import type { LeadFormVariantProps } from "@/forms/lead/types";
import React, { useEffect, useMemo, useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Loader2, Lock, Mail, Phone, User } from "lucide-react";
import { FloatingLabelInput } from "@/components/ui/FloatingLabelInput";
import { useWhatsappValidation } from "@/hooks/useWhatsappValidation";
import { useAirtableSubmission } from "@/hooks/useAirtableSubmission";
import { LEAD_FIELD_IDS } from "@/forms/lead/fieldIds";

type InssSituation =
  | "aposentado_inss"
  | "pensionista_inss"
  | "clt"
  | "mei"
  | "outra";

type BenefitRange =
  | "acima_4000"
  | "3000_4000"
  | "2000_3000"
  | "abaixo_2000"
  | "nao_sei";

type DebtType =
  | "consignado"
  | "cartao_credito"
  | "emprestimo_pessoal"
  | "outros"
  | "multiplas";

type DiscountRange =
  | "acima_2000"
  | "1000_2000"
  | "500_1000"
  | "abaixo_500"
  | "nao_sei";

const benefitRangeLabel: Record<Exclude<BenefitRange, "abaixo_2000">, string> = {
  acima_4000: "Acima de R$ 4.000",
  "3000_4000": "Entre R$ 3.000 e R$ 4.000",
  "2000_3000": "Entre R$ 2.000 e R$ 3.000",
  nao_sei: "Não sei/Não tenho certeza",
};

const debtTypeLabel: Record<DebtType, string> = {
  consignado: "Empréstimo consignado (desconto em folha)",
  cartao_credito: "Cartão de crédito",
  emprestimo_pessoal: "Empréstimo pessoal",
  outros: "Outros tipos de dívida",
  multiplas: "Múltiplas dívidas diferentes",
};

const discountRangeLabel: Record<Exclude<DiscountRange, "abaixo_500">, string> = {
  acima_2000: "Mais de R$ 2.000",
  "1000_2000": "Entre R$ 1.000 e R$ 2.000",
  "500_1000": "Entre R$ 500 e R$ 1.000",
  nao_sei: "Não sei calcular",
};

export const Lp01LeadFormDialogContent = (props: LeadFormVariantProps) => {
  const { isOpen, onClose } = props;

  const [step, setStep] = useState<
    "q1" | "q2" | "q3" | "q4" | "disqualified" | "form"
  >("q1");
  const [disqualifyReason, setDisqualifyReason] = useState<
    "not_inss" | "below_2k" | "discount_low" | null
  >(null);
  const [answers, setAnswers] = useState<{
    inssSituation: InssSituation | null;
    benefitRange: BenefitRange | null;
    debtType: DebtType | null;
    discountRange: DiscountRange | null;
  }>({
    inssSituation: null,
    benefitRange: null,
    debtType: null,
    discountRange: null,
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const {
    isValidating,
    isValid,
    validationError,
    validateWhatsapp,
    resetValidation,
  } = useWhatsappValidation();
  const { isSubmitting, submitLead } = useAirtableSubmission();

  useEffect(() => {
    if (!isOpen) return;

    const hasSubmitted = localStorage.getItem("leadSubmitted") === "true";
    setIsFormSubmitted(hasSubmitted);

    setStep("q1");
    setDisqualifyReason(null);
    setAnswers({ inssSituation: null, benefitRange: null, debtType: null, discountRange: null });
    setFormData({ name: "", email: "", phone: "" });
    setFocusedField(null);
    resetValidation();
  }, [isOpen, resetValidation]);

  const nameValidationError = useMemo(() => {
    const raw = formData.name;
    const normalized = raw.replace(/\s+/g, " ").trim();
    if (!normalized) return null;

    const hasInvalidChars = /[^\p{L}\s]/u.test(normalized);
    if (hasInvalidChars) return "Use apenas letras e espaços.";

    const parts = normalized.split(" ").filter(Boolean);
    if (parts.length < 2) return "É necessário que seja preenchido seu nome completo";

    return null;
  }, [formData.name]);

  const emailValidationError = useMemo(() => {
    const email = formData.email.trim();
    if (!email) return null;
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) return "Informe um e-mail válido";
    return null;
  }, [formData.email]);

  const isFullyQualified = useMemo(() => {
    const inssOk =
      answers.inssSituation === "aposentado_inss" || answers.inssSituation === "pensionista_inss";
    const benefitOk = answers.benefitRange === "acima_4000" || answers.benefitRange === "3000_4000";
    const debtOk = answers.debtType === "consignado" || answers.debtType === "multiplas";
    const discountOk =
      answers.discountRange === "acima_2000" || answers.discountRange === "1000_2000";
    return inssOk && benefitOk && debtOk && discountOk;
  }, [answers]);

  const handleInputChange = <K extends keyof typeof formData>(
    field: K,
    value: (typeof formData)[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "phone") {
      const phoneValue = String(value);
      const numbersOnly = phoneValue.replace(/\D/g, "");
      if (numbersOnly.length === 11) {
        validateWhatsapp(phoneValue);
      } else if (numbersOnly.length < 11) {
        resetValidation();
      }
    }
  };

  const handleQualifiedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormSubmitted) return;

    if (!formData.name || !formData.email || !formData.phone) {
      return;
    }

    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (phoneDigits.length !== 11) return;
    if (nameValidationError || emailValidationError) return;
    if (isValid === false) return;

    const inssSituationLabel =
      answers.inssSituation === "aposentado_inss"
        ? "Aposentado do INSS"
        : answers.inssSituation === "pensionista_inss"
          ? "Pensionista do INSS"
          : answers.inssSituation === "clt"
            ? "CLT com carteira assinada"
            : answers.inssSituation === "mei"
              ? "Autônomo/MEI"
              : answers.inssSituation === "outra"
                ? "Outra situação"
                : "";

    const benefitRange =
      answers.benefitRange && answers.benefitRange !== "abaixo_2000"
        ? benefitRangeLabel[answers.benefitRange]
        : "";
    const debtType = answers.debtType ? debtTypeLabel[answers.debtType] : "";
    const discountRange =
      answers.discountRange && answers.discountRange !== "abaixo_500"
        ? discountRangeLabel[answers.discountRange]
        : "";

    const benefitAbove2k =
      answers.benefitRange === "nao_sei"
        ? "unknown"
        : answers.benefitRange === "abaixo_2000"
          ? "no"
          : answers.benefitRange
            ? "yes"
            : undefined;

    const discountReasonParts = [
      debtType ? `Tipo de dívida: ${debtType}` : null,
      discountRange ? `Desconto mensal: ${discountRange}` : null,
    ].filter(Boolean);

    const success = await submitLead({
      name: formData.name,
      phone: formData.phone,
      email: formData.email.trim(),
      isInssRetireeOrPensioner:
        answers.inssSituation === "aposentado_inss" || answers.inssSituation === "pensionista_inss",
      benefitAbove2k,
      benefitRange: benefitRange || undefined,
      inssSituation: inssSituationLabel || undefined,
      debtType: debtType || undefined,
      discountRange: discountRange || undefined,
      leadType: isFullyQualified ? "Qualificado" : "Avaliação",
      discountReason: discountReasonParts.length ? discountReasonParts.join(" | ") : undefined,
    });

    if (success) {
      setIsFormSubmitted(true);
      resetValidation();
      onClose();
    }
  };

  const isQualifiedSubmitDisabled = useMemo(() => {
    const phoneDigits = formData.phone.replace(/\D/g, "");
    const hasValidPhone = phoneDigits.length === 11;
    return (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !hasValidPhone ||
      Boolean(nameValidationError) ||
      Boolean(emailValidationError) ||
      isSubmitting ||
      isFormSubmitted ||
      isValidating ||
      isValid === false
    );
  }, [
    formData,
    nameValidationError,
    emailValidationError,
    isSubmitting,
    isFormSubmitted,
    isValidating,
    isValid,
  ]);

  if (isFormSubmitted) {
    return (
      <DialogContent className="sm:max-w-md rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] border-0 [&>button]:hidden">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors duration-200 group"
          aria-label="Fechar formulário"
        >
          <svg
            className="w-4 h-4 text-gray-400 group-hover:text-lavender-500 transition-colors duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="text-center py-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>

          <DialogHeader className="text-center">
            <DialogTitle className="text-purple-brand text-2xl font-bold tracking-tight leading-tight mb-2">
              Dados recebidos com sucesso!
            </DialogTitle>
            <p className="text-gray-600 text-base font-medium">
              Já recebemos suas informações e entraremos em contato via WhatsApp.
            </p>
          </DialogHeader>

          <Button
            onClick={onClose}
            className="w-full h-12 mt-6 bg-purple-brand hover:bg-lavender-800 text-white font-semibold rounded-lg"
          >
            Entendi
          </Button>
        </div>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="sm:max-w-md rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] border-0 [&>button]:hidden">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors duration-200 group"
        aria-label="Fechar formulário"
      >
        <svg
          className="w-4 h-4 text-gray-400 group-hover:text-lavender-500 transition-colors duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {step === "disqualified" ? (
        <div>
          <DialogHeader className="text-center pt-2">
            <DialogTitle className="text-purple-brand text-2xl font-bold tracking-tight leading-tight">
              ⚠️ Infelizmente você não se qualifica
            </DialogTitle>
            <p className="text-gray-600 text-base font-medium mt-2">
              Mensagem baseada nas suas respostas.
            </p>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-lavender bg-lavender/10 p-4 text-center">
              {disqualifyReason === "not_inss" ? (
                <p className="text-gray-900 font-semibold text-base">
                  Esta solução é exclusiva para aposentados/pensionistas do INSS. Para trabalhadores CLT e autônomos/MEI, sugerimos buscar orientação jurídica adequada ao seu vínculo.
                </p>
              ) : disqualifyReason === "below_2k" ? (
                <p className="text-gray-900 font-semibold text-base">
                  Para valores abaixo de R$ 2.000, recomendamos orientação da Defensoria Pública.
                </p>
              ) : (
                <p className="text-gray-900 font-semibold text-base">
                  Para descontos baixos, renegociação direta com o banco pode ser mais eficiente.
                </p>
              )}
            </div>

            <Button
              type="button"
              onClick={onClose}
              className="w-full h-12 bg-purple-brand hover:bg-lavender-800 text-white font-semibold rounded-lg"
            >
              Entendi
            </Button>
          </div>
        </div>
      ) : step === "form" ? (
        <div>
          <DialogHeader className="text-center pt-2">
            <DialogTitle className="text-purple-brand text-2xl font-bold tracking-tight leading-tight">
              {isFullyQualified ? "✅ Parabéns! Você se qualifica" : "✅ Seu caso pode ser avaliado"}
            </DialogTitle>
            <p className="text-gray-600 text-base font-medium mt-2">
              Preencha os dados para contato via WhatsApp.
            </p>
          </DialogHeader>

          <form onSubmit={handleQualifiedSubmit} className="space-y-6 mt-6">
            <FloatingLabelInput
              id={LEAD_FIELD_IDS.name}
              type="text"
              placeholder="Seu nome completo"
              value={formData.name}
              onChange={(value) => handleInputChange("name", value)}
              icon={User}
              label="Nome completo"
              focusedField={focusedField}
              setFocusedField={setFocusedField}
              isValid={nameValidationError ? false : null}
              validationError={nameValidationError}
            />

            <FloatingLabelInput
              id={LEAD_FIELD_IDS.email}
              type="email"
              placeholder="Seu melhor e-mail"
              value={formData.email}
              onChange={(value) => handleInputChange("email", value)}
              icon={Mail}
              label="E-mail"
              focusedField={focusedField}
              setFocusedField={setFocusedField}
              isValid={emailValidationError ? false : null}
              validationError={emailValidationError}
            />

            <FloatingLabelInput
              id={LEAD_FIELD_IDS.phone}
              type="tel"
              placeholder="(11) 9 9999-9999"
              value={formData.phone}
              onChange={(value) => handleInputChange("phone", value)}
              icon={Phone}
              label="WhatsApp (com DDD)"
              focusedField={focusedField}
              setFocusedField={setFocusedField}
              isValidating={isValidating}
              isValid={isValid}
              validationError={validationError}
            />

            <Button
              type="submit"
              disabled={isQualifiedSubmitDisabled}
              className={`w-full h-12 font-semibold text-base rounded-lg transition-all duration-300 flex items-center justify-center gap-3 mt-2 ${
                isQualifiedSubmitDisabled
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-purple-brand hover:bg-lavender-800 text-white"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enviando dados...
                </>
              ) : (
                <>
                  Falar com especialista no WhatsApp
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-1">
                <Lock className="w-4 h-4 text-green-600" />
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-green-700 font-semibold text-sm">Anti-Fraude LGPD</span>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <DialogHeader className="text-center pt-2">
            <DialogTitle className="text-purple-brand text-2xl font-bold tracking-tight leading-tight">
              Triagem rápida (5 etapas)
            </DialogTitle>
            <p className="text-gray-600 text-base font-medium mt-2">
              Responda para verificarmos se conseguimos ajudar.
            </p>
          </DialogHeader>

          <div className="mt-6 space-y-6">
            {step === "q1" ? (
              <div className="rounded-xl border border-lavender bg-white p-4">
                <p className="text-gray-900 font-bold text-lg mb-3">
                  Qual é sua situação perante o INSS?
                </p>
                <div className="grid gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setAnswers((prev) => ({ ...prev, inssSituation: "aposentado_inss" }));
                      setDisqualifyReason(null);
                      setStep("q2");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    Aposentado do INSS
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAnswers((prev) => ({ ...prev, inssSituation: "pensionista_inss" }));
                      setDisqualifyReason(null);
                      setStep("q2");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    Pensionista do INSS
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAnswers((prev) => ({ ...prev, inssSituation: "clt" }));
                      setDisqualifyReason("not_inss");
                      setStep("disqualified");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    CLT com carteira assinada
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAnswers((prev) => ({ ...prev, inssSituation: "mei" }));
                      setDisqualifyReason("not_inss");
                      setStep("disqualified");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    Autônomo/MEI
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAnswers((prev) => ({ ...prev, inssSituation: "outra" }));
                      setDisqualifyReason("not_inss");
                      setStep("disqualified");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    Outra situação
                  </button>
                </div>
              </div>
            ) : null}

            {step === "q2" ? (
              <div className="rounded-xl border border-lavender bg-white p-4">
                <p className="text-gray-900 font-bold text-lg mb-3">
                  Qual o valor aproximado do seu benefício mensal?
                </p>
                <div className="grid gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setAnswers((prev) => ({ ...prev, benefitRange: "acima_4000" }));
                      setDisqualifyReason(null);
                      setStep("q3");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    Acima de R$ 4.000
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAnswers((prev) => ({ ...prev, benefitRange: "3000_4000" }));
                      setDisqualifyReason(null);
                      setStep("q3");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    Entre R$ 3.000 e R$ 4.000
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAnswers((prev) => ({ ...prev, benefitRange: "2000_3000" }));
                      setDisqualifyReason(null);
                      setStep("q3");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    Entre R$ 2.000 e R$ 3.000
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAnswers((prev) => ({ ...prev, benefitRange: "abaixo_2000" }));
                      setDisqualifyReason("below_2k");
                      setStep("disqualified");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    Abaixo de R$ 2.000
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAnswers((prev) => ({ ...prev, benefitRange: "nao_sei" }));
                      setDisqualifyReason(null);
                      setStep("q3");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    Não sei/Não tenho certeza
                  </button>
                </div>
              </div>
            ) : null}

            {step === "q3" ? (
              <div className="rounded-xl border border-lavender bg-white p-4">
                <p className="text-gray-900 font-bold text-lg mb-3">
                  Que tipo de dívida mais pesa no seu orçamento?
                </p>
                <div className="grid gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setAnswers((prev) => ({ ...prev, debtType: "consignado" }));
                      setStep("q4");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    Empréstimo consignado (desconto em folha)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAnswers((prev) => ({ ...prev, debtType: "multiplas" }));
                      setStep("q4");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    Múltiplas dívidas diferentes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAnswers((prev) => ({ ...prev, debtType: "cartao_credito" }));
                      setStep("q4");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    Cartão de crédito
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAnswers((prev) => ({ ...prev, debtType: "emprestimo_pessoal" }));
                      setStep("q4");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    Empréstimo pessoal
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAnswers((prev) => ({ ...prev, debtType: "outros" }));
                      setStep("q4");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    Outros tipos de dívida
                  </button>
                </div>
              </div>
            ) : null}

            {step === "q4" ? (
              <div className="rounded-xl border border-lavender bg-white p-4">
                <p className="text-gray-900 font-bold text-lg mb-3">
                  Quanto os bancos descontam do seu benefício todo mês?
                </p>
                <div className="grid gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setAnswers((prev) => ({ ...prev, discountRange: "acima_2000" }));
                      setDisqualifyReason(null);
                      setStep("form");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    Mais de R$ 2.000
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAnswers((prev) => ({ ...prev, discountRange: "1000_2000" }));
                      setDisqualifyReason(null);
                      setStep("form");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    Entre R$ 1.000 e R$ 2.000
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAnswers((prev) => ({ ...prev, discountRange: "500_1000" }));
                      setDisqualifyReason(null);
                      setStep("form");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    Entre R$ 500 e R$ 1.000
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAnswers((prev) => ({ ...prev, discountRange: "abaixo_500" }));
                      setDisqualifyReason("discount_low");
                      setStep("disqualified");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    Menos de R$ 500
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAnswers((prev) => ({ ...prev, discountRange: "nao_sei" }));
                      setDisqualifyReason(null);
                      setStep("form");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    Não sei calcular
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </DialogContent>
  );
};

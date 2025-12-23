import React, { useEffect, useMemo, useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, User, Mail, Loader2, CheckCircle, Lock } from "lucide-react";
import { FloatingLabelInput } from "@/components/ui/FloatingLabelInput";
import { useWhatsappValidation } from "@/hooks/useWhatsappValidation";
import { useAirtableSubmission } from "@/hooks/useAirtableSubmission";
import type { LeadFormVariantProps } from "@/forms/lead/types";
import { LEAD_FIELD_IDS } from "@/forms/lead/fieldIds";

export const Lp05LeadFormDialogContent = (props: LeadFormVariantProps) => {
  const { isOpen, onClose } = props;
  const [step, setStep] = useState<
    "q1-inss" | "q2-benefit" | "q3-consignado" | "q4-debt" | "form" | "disqualified" | "thankyou"
  >("q1-inss");
  const [disqualifyReason, setDisqualifyReason] = useState<
    "not_inss" | "below_3k" | "no_consignado" | null
  >(null);

  const [qualification, setQualification] = useState<{
    isInssRetireeOrPensioner: boolean | null;
    benefitRange: "lt_2k" | "2k_3k" | "3k1_4k" | "gt_4k" | null;
    hasActiveConsignado: boolean | null;
    debtsRange: "lt_10k" | "10k_20k" | "20k1_40k" | "gt_40k" | null;
  }>({
    isInssRetireeOrPensioner: null,
    benefitRange: null,
    hasActiveConsignado: null,
    debtsRange: null,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
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
    setStep("q1-inss");
    setDisqualifyReason(null);
    setQualification({
      isInssRetireeOrPensioner: null,
      benefitRange: null,
      hasActiveConsignado: null,
      debtsRange: null,
    });
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

  const handleInputChange = <K extends keyof typeof formData>(
    field: K,
    value: (typeof formData)[K]
  ) => {
    if (isFormSubmitted) return;

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

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

  const benefitRangeLabel = useMemo(() => {
    switch (qualification.benefitRange) {
      case "lt_2k":
        return "Menos de R$ 2.000";
      case "2k_3k":
        return "R$ 2.000 a R$ 3.000";
      case "3k1_4k":
        return "R$ 3.001 a R$ 4.000";
      case "gt_4k":
        return "Acima de R$ 4.000";
      default:
        return undefined;
    }
  }, [qualification.benefitRange]);

  const debtsTotalFromRange = (range: typeof qualification.debtsRange) => {
    switch (range) {
      case "lt_10k":
        return 9000;
      case "10k_20k":
        return 15000;
      case "20k1_40k":
        return 30000;
      case "gt_40k":
        return 45000;
      default:
        return undefined;
    }
  };

  const debtsRangeHint = useMemo(() => {
    if (qualification.debtsRange === "lt_10k") {
      return "Para dívidas mais altas (acima de R$ 15.000) normalmente conseguimos melhor margem de resultado, mas ainda podemos analisar.";
    }
    return null;
  }, [qualification.debtsRange]);

  const isSubmitDisabled = useMemo(() => {
    const numbersOnly = formData.phone.replace(/\D/g, "");
    const hasValidLength = numbersOnly.length === 11;
    return (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !hasValidLength ||
      Boolean(nameValidationError) ||
      Boolean(emailValidationError) ||
      isSubmitting ||
      isFormSubmitted ||
      isValidating ||
      isValid === false
    );
  }, [
    formData,
    isSubmitting,
    isFormSubmitted,
    isValidating,
    isValid,
    nameValidationError,
    emailValidationError,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormSubmitted) return;

    if (!formData.name || !formData.email || !formData.phone) return;
    if (formData.phone.replace(/\D/g, "").length !== 11) return;
    if (nameValidationError) return;
    if (emailValidationError) return;
    if (isValid === false) return;

    const success = await submitLead({
      name: formData.name,
      phone: formData.phone,
      email: formData.email.trim(),
      isInssRetireeOrPensioner: qualification.isInssRetireeOrPensioner ?? undefined,
      benefitAbove2k: "yes",
      benefitRange: benefitRangeLabel,
      debtType: qualification.hasActiveConsignado ? "Consignado INSS (ativo)" : undefined,
      debtsTotal: debtsTotalFromRange(qualification.debtsRange),
      leadType: "lp05",
    });

    if (success) {
      localStorage.setItem("leadSubmitted", "true");
      setIsFormSubmitted(true);
      setStep("thankyou");
    }
  };

  useEffect(() => {
    if (!isOpen) resetValidation();
  }, [isOpen, resetValidation]);

  if (step === "thankyou") {
    return (
      <DialogContent
        className="sm:max-w-md rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] border-0 [&>button]:hidden"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="text-center py-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>

          <DialogHeader className="text-center">
            <DialogTitle className="text-purple-brand text-2xl font-bold tracking-tight leading-tight mb-2">
              Redirecionando para o WhatsApp...
            </DialogTitle>
            <p className="text-gray-600 text-base font-medium">
              Aguarde alguns instantes. Você será redirecionado automaticamente para continuar o atendimento.
            </p>
          </DialogHeader>
        </div>
      </DialogContent>
    );
  }

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

          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Phone className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-semibold">Próximo passo</span>
            </div>
            <p className="text-green-600 text-sm">
              Se possível, já deixe separado o extrato de empréstimos consignados do Meu INSS para agilizar sua pré-análise.
            </p>
          </div>

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

  const showCloseButton = (
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
  );

  if (step === "disqualified") {
    return (
      <DialogContent className="sm:max-w-md rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] border-0 [&>button]:hidden">
        {showCloseButton}
        <div>
          <DialogHeader className="text-center pt-2">
            <DialogTitle className="text-purple-brand text-2xl font-bold tracking-tight leading-tight">
              Obrigado pelo interesse
            </DialogTitle>
            <p className="text-gray-600 text-base font-medium mt-2">Agradecemos por responder.</p>
          </DialogHeader>

          <div className="mt-6">
            <div className="rounded-xl border border-lavender bg-lavender/10 p-4 text-center">
              {disqualifyReason === "not_inss" ? (
                <>
                  <p className="text-gray-900 font-semibold text-lg">
                    No momento, atendemos apenas aposentados e pensionistas do INSS.
                  </p>
                  <p className="text-gray-700 text-base mt-2">Obrigado pelo interesse!</p>
                </>
              ) : disqualifyReason === "no_consignado" ? (
                <>
                  <p className="text-gray-900 font-semibold text-lg">
                    Nossa especialidade é consignado descontado no benefício do INSS.
                  </p>
                  <p className="text-gray-700 text-base mt-2">
                    Se você tiver consignados ativos no futuro, volte aqui para uma nova triagem.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-gray-900 font-semibold text-lg">
                    Para casos com benefício acima de R$ 3.000 obtemos os melhores resultados.
                  </p>
                  <p className="text-gray-700 text-base mt-2">
                    Se sua situação mudar, volte aqui e faremos uma nova avaliação.
                  </p>
                </>
              )}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setStep("q1-inss");
                  setDisqualifyReason(null);
                }}
                className="h-12 rounded-lg font-semibold"
              >
                Voltar
              </Button>
              <Button
                onClick={onClose}
                className="h-12 bg-purple-brand hover:bg-lavender-800 text-white font-semibold rounded-lg"
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    );
  }

  if (step === "q1-inss" || step === "q2-benefit" || step === "q3-consignado" || step === "q4-debt") {
    const progressText =
      step === "q1-inss"
        ? "Etapa 1 de 3 • Qualificação"
        : step === "q2-benefit"
          ? "Etapa 1 de 3 • Qualificação"
          : step === "q3-consignado"
            ? "Etapa 2 de 3 • Suas dívidas"
            : "Etapa 2 de 3 • Suas dívidas";

    return (
      <DialogContent className="sm:max-w-md rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] border-0 [&>button]:hidden">
        {showCloseButton}
        <div>
          <DialogHeader className="text-center pt-2">
            <DialogTitle className="text-purple-brand text-2xl font-bold tracking-tight leading-tight">
              Triagem rápida (menos de 2 minutos)
            </DialogTitle>
            <p className="text-gray-600 text-base font-medium mt-2">
              {progressText}
            </p>
          </DialogHeader>

          <div className="mt-6 space-y-6">
            {step === "q1-inss" ? (
              <div className="rounded-xl border border-lavender bg-white p-4">
                <p className="text-gray-900 font-bold text-lg mb-3">
                  Você é aposentado ou pensionista do INSS?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setQualification((prev) => ({
                        ...prev,
                        isInssRetireeOrPensioner: true,
                        benefitRange: null,
                      }));
                      setDisqualifyReason(null);
                      setStep("q2-benefit");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    Sim
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setQualification((prev) => ({
                        ...prev,
                        isInssRetireeOrPensioner: false,
                        benefitRange: null,
                      }));
                      setDisqualifyReason("not_inss");
                      setStep("disqualified");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    Não
                  </button>
                </div>
                <p className="text-gray-600 text-sm mt-3">
                  No momento, atendemos apenas casos ligados ao benefício do INSS.
                </p>
              </div>
            ) : null}

            {step === "q2-benefit" ? (
              <div className="rounded-xl border border-lavender bg-white p-4">
                <p className="text-gray-900 font-bold text-lg mb-3">
                  Qual o valor aproximado do seu benefício mensal do INSS?
                </p>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setQualification((prev) => ({ ...prev, benefitRange: "lt_2k" }));
                      setDisqualifyReason("below_3k");
                      setStep("disqualified");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    Menos de R$ 2.000
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setQualification((prev) => ({ ...prev, benefitRange: "2k_3k" }));
                      setDisqualifyReason("below_3k");
                      setStep("disqualified");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    R$ 2.000 a R$ 3.000
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setQualification((prev) => ({ ...prev, benefitRange: "3k1_4k" }));
                      setDisqualifyReason(null);
                      setStep("q3-consignado");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    R$ 3.001 a R$ 4.000
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setQualification((prev) => ({ ...prev, benefitRange: "gt_4k" }));
                      setDisqualifyReason(null);
                      setStep("q3-consignado");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    Acima de R$ 4.000
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("q1-inss")}
                    className="h-12 rounded-lg font-semibold"
                  >
                    Voltar
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setStep("q3-consignado")}
                    disabled={!qualification.benefitRange || qualification.benefitRange === "lt_2k" || qualification.benefitRange === "2k_3k"}
                    className="h-12 bg-purple-brand hover:bg-lavender-800 text-white font-semibold rounded-lg disabled:bg-gray-300 disabled:text-gray-600"
                  >
                    Continuar
                  </Button>
                </div>
              </div>
            ) : null}

            {step === "q3-consignado" ? (
              <div className="rounded-xl border border-lavender bg-white p-4">
                <p className="text-gray-900 font-bold text-lg mb-3">
                  Você tem empréstimos consignados ativos descontados no benefício?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setQualification((prev) => ({
                        ...prev,
                        hasActiveConsignado: true,
                        debtsRange: null,
                      }));
                      setDisqualifyReason(null);
                      setStep("q4-debt");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    Sim
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setQualification((prev) => ({
                        ...prev,
                        hasActiveConsignado: false,
                        debtsRange: null,
                      }));
                      setDisqualifyReason("no_consignado");
                      setStep("disqualified");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    Não
                  </button>
                </div>

                <div className="mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("q2-benefit")}
                    className="w-full h-12 rounded-lg font-semibold"
                  >
                    Voltar
                  </Button>
                </div>
              </div>
            ) : null}

            {step === "q4-debt" ? (
              <div className="rounded-xl border border-lavender bg-white p-4">
                <p className="text-gray-900 font-bold text-lg mb-3">
                  Qual o valor aproximado total das suas dívidas em consignados?
                </p>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setQualification((prev) => ({ ...prev, debtsRange: "lt_10k" }));
                      setStep("form");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    Menos de R$ 10.000
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setQualification((prev) => ({ ...prev, debtsRange: "10k_20k" }));
                      setStep("form");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    R$ 10.000 a R$ 20.000
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setQualification((prev) => ({ ...prev, debtsRange: "20k1_40k" }));
                      setStep("form");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    R$ 20.001 a R$ 40.000
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setQualification((prev) => ({ ...prev, debtsRange: "gt_40k" }));
                      setStep("form");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    Acima de R$ 40.000
                  </button>
                </div>

                {debtsRangeHint ? (
                  <p className="text-gray-600 text-sm mt-3">{debtsRangeHint}</p>
                ) : null}

                <div className="mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("q3-consignado")}
                    className="w-full h-12 rounded-lg font-semibold"
                  >
                    Voltar
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="sm:max-w-md rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] border-0 [&>button]:hidden">
      {showCloseButton}
      <div>
        <DialogHeader className="text-center pt-2">
          <DialogTitle className="text-purple-brand text-2xl font-bold tracking-tight leading-tight">
            Análise gratuita do seu caso
          </DialogTitle>
          <p className="text-gray-600 text-base font-medium mt-2">
            Etapa 3 de 3 • Dados de contato
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6 w-full min-w-0">
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

          <Button
            type="submit"
            disabled={isSubmitDisabled}
            className={`w-full min-h-12 h-auto py-3 whitespace-normal text-center leading-snug font-semibold text-base rounded-lg transition-all duration-300 flex items-center justify-center gap-3 mt-2 ${
              isSubmitDisabled
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
                Sim, quero recuperar minha margem consignada!
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

        <div className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep("q4-debt")}
            className="w-full h-12 rounded-lg font-semibold"
          >
            Voltar
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

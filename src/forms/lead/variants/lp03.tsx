import React, { useEffect, useMemo, useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Loader2, Lock, Mail, Phone, User, XCircle } from "lucide-react";
import type { LeadFormVariantProps } from "@/forms/lead/types";
import { FloatingLabelInput } from "@/components/ui/FloatingLabelInput";
import { LEAD_FIELD_IDS } from "@/forms/lead/fieldIds";
import { useWhatsappValidation } from "@/hooks/useWhatsappValidation";
import { useAirtableSubmission } from "@/hooks/useAirtableSubmission";
import { formatPhoneNumber } from "@/utils/phoneUtils";

type Step = "q1" | "q2" | "q3" | "disqualified" | "form" | "thankyou";

type DisqualifyReason = "income_origin" | "problem_type" | "income_low";

export const Lp03LeadFormDialogContent = ({ isOpen, onClose }: LeadFormVariantProps) => {
  const [step, setStep] = useState<Step>("q1");
  const [disqualifyReason, setDisqualifyReason] = useState<DisqualifyReason | null>(null);
  const [incomeOrigin, setIncomeOrigin] = useState<string | null>(null);
  const [mainProblem, setMainProblem] = useState<string | null>(null);
  const [incomeRange, setIncomeRange] = useState<string | null>(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  const { isValidating, isValid, validationError, validateWhatsapp, resetValidation } =
    useWhatsappValidation();
  const { isSubmitting, submitLead } = useAirtableSubmission({ navigateOnSuccess: false });

  useEffect(() => {
    if (!isOpen) {
      resetValidation();
      return;
    }

    const hasSubmitted = localStorage.getItem("leadSubmitted") === "true";
    setIsFormSubmitted(hasSubmitted);
    setStep("q1");
    setDisqualifyReason(null);
    setIncomeOrigin(null);
    setMainProblem(null);
    setIncomeRange(null);
    setFocusedField(null);
    setFormData({ name: "", email: "", phone: "" });
    resetValidation();
  }, [isOpen, resetValidation]);

  const disqualifiedTitle = useMemo(() => {
    if (disqualifyReason === "income_low") return "Obrigado pelo interesse";
    return "No momento, não atendemos este perfil";
  }, [disqualifyReason]);

  const disqualifiedBody = useMemo(() => {
    if (disqualifyReason === "income_origin") {
      return "Nosso atendimento é exclusivo para servidores públicos, aposentados e pensionistas, por conta do tipo de desconto em folha/benefício e da estratégia de atuação.";
    }
    if (disqualifyReason === "problem_type") {
      return "Nossa atuação é voltada especificamente a empréstimos consignados (desconto em folha/benefício). Para dívidas de cartão/lojas, este serviço não é o indicado.";
    }
    if (disqualifyReason === "income_low") {
      return "No momento, a análise com acesso direto ao especialista é priorizada para renda familiar acima de R$ 3.000. Agradecemos por responder.";
    }
    return "Agradecemos por responder. No momento, este serviço não é o indicado para o seu caso.";
  }, [disqualifyReason]);

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

    if (field === "phone") {
      const formattedPhone = formatPhoneNumber(String(value));
      setFormData((prev) => ({ ...prev, phone: formattedPhone }));

      const numbersOnly = formattedPhone.replace(/\D/g, "");
      if (numbersOnly.length === 11) {
        validateWhatsapp(formattedPhone);
      } else {
        resetValidation();
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isSubmitDisabled = useMemo(() => {
    const numbersOnly = formData.phone.replace(/\D/g, "");
    const hasValidPhone = numbersOnly.length === 11;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormSubmitted) return;
    if (isValid === false) return;
    if (isSubmitDisabled) return;

    const success = await submitLead({
      name: formData.name,
      phone: formData.phone,
      email: formData.email.trim(),
      incomeOrigin: incomeOrigin ?? undefined,
      mainProblem: mainProblem ?? undefined,
      incomeRange: incomeRange ?? undefined,
    });

    if (success) {
      localStorage.setItem("leadSubmitted", "true");
      setIsFormSubmitted(true);
      setStep("thankyou");
      setFormData({ name: "", email: "", phone: "" });
      setFocusedField(null);
      resetValidation();
    }
  };

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

  if (step === "disqualified") {
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

        <div>
          <DialogHeader className="text-center pt-2">
            <DialogTitle className="text-purple-brand text-2xl font-bold tracking-tight leading-tight">
              {disqualifiedTitle}
            </DialogTitle>
            <p className="text-gray-600 text-base font-medium mt-2">Agradecemos por responder.</p>
          </DialogHeader>

          <div className="mt-6">
            <div className="rounded-xl border border-lavender bg-lavender/10 p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <XCircle className="w-6 h-6 text-red-600" aria-hidden="true" />
                <p className="text-gray-900 font-semibold text-base">Perfil não elegível</p>
              </div>
              <p className="text-gray-700 text-base">{disqualifiedBody}</p>
            </div>

            <Button
              onClick={onClose}
              className="w-full mt-6 bg-purple-brand hover:bg-lavender-800 text-white font-semibold rounded-lg"
            >
              Entendi
            </Button>
          </div>
        </div>
      </DialogContent>
    );
  }

  if (step === "q1" || step === "q2" || step === "q3") {
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

        <div>
          <DialogHeader className="text-center pt-2">
            <DialogTitle className="text-purple-brand text-2xl font-bold tracking-tight leading-tight">
              Triagem rápida (3 etapas)
            </DialogTitle>
            <p className="text-gray-600 text-base font-medium mt-2">
              Para qualificar o atendimento, responda antes de falar com um especialista.
            </p>
          </DialogHeader>

          <div className="mt-6 space-y-6">
            {step === "q1" ? (
              <div className="rounded-xl border border-lavender bg-white p-4">
                <p className="text-gray-900 font-bold text-lg mb-3">1) Qual a origem da sua renda?</p>
                <div className="grid gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIncomeOrigin("Trabalho em empresa privada (CLT)");
                      setDisqualifyReason("income_origin");
                      setStep("disqualified");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    Trabalho em empresa privada (CLT)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIncomeOrigin("Autônomo / Empresário");
                      setDisqualifyReason("income_origin");
                      setStep("disqualified");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    Autônomo / Empresário
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIncomeOrigin("Servidor público / Aposentado / Pensionista");
                      setDisqualifyReason(null);
                      setStep("q2");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    Servidor público / Aposentado / Pensionista
                  </button>
                </div>
              </div>
            ) : null}

            {step === "q2" ? (
              <div className="rounded-xl border border-lavender bg-white p-4">
                <p className="text-gray-900 font-bold text-lg mb-3">2) Qual o seu principal problema hoje?</p>
                <div className="grid gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setMainProblem("Dívidas de cartão de crédito / lojas");
                      setDisqualifyReason("problem_type");
                      setStep("disqualified");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    Dívidas de cartão de crédito / lojas
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMainProblem("Empréstimos consignados (desconto em folha/benefício)");
                      setDisqualifyReason(null);
                      setStep("q3");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    Empréstimos consignados (desconto em folha/benefício)
                  </button>
                </div>
              </div>
            ) : null}

            {step === "q3" ? (
              <div className="rounded-xl border border-lavender bg-white p-4">
                <p className="text-gray-900 font-bold text-lg mb-3">3) Qual sua renda mensal aproximada?</p>
                <div className="grid gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIncomeRange("Até R$ 3.000");
                      setDisqualifyReason("income_low");
                      setStep("disqualified");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    Até R$ 3.000
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIncomeRange("Acima de R$ 3.000");
                      setDisqualifyReason(null);
                      setStep("form");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    Acima de R$ 3.000
                  </button>
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

      <DialogHeader className="text-center pt-2">
        <DialogTitle className="text-purple-brand text-2xl font-bold tracking-tight leading-tight">
          Preencha seus dados para contato
        </DialogTitle>
        <p className="text-gray-600 text-base font-medium mt-2">
          Vamos te chamar no WhatsApp para continuar o atendimento.
        </p>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6 mt-6">
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
          disabled={isSubmitDisabled}
          className={`w-full h-12 font-semibold text-base rounded-lg transition-all duration-300 flex items-center justify-center gap-3 mt-2 ${
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
    </DialogContent>
  );
};

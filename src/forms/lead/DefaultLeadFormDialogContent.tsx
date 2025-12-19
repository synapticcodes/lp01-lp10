import React, { useEffect, useMemo, useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, User, Mail, Loader2, CheckCircle, Lock } from "lucide-react";
import { FloatingLabelInput } from "@/components/ui/FloatingLabelInput";
import { useWhatsappValidation } from "@/hooks/useWhatsappValidation";
import { useAirtableSubmission } from "@/hooks/useAirtableSubmission";
import type { LeadFormVariantProps } from "@/forms/lead/types";
import { LEAD_FIELD_IDS } from "@/forms/lead/fieldIds";

export const DefaultLeadFormDialogContent = ({ isOpen, onClose }: LeadFormVariantProps) => {
  const [step, setStep] = useState<
    "qualify-inss" | "qualify-benefit" | "disqualified" | "form"
  >("qualify-inss");
  const [disqualifyReason, setDisqualifyReason] = useState<
    "not_inss" | "below_2k" | null
  >(null);
  const [qualification, setQualification] = useState<{
    isInssRetireeOrPensioner: boolean | null;
    benefitAbove2k: "yes" | "no" | "unknown" | null;
  }>({
    isInssRetireeOrPensioner: null,
    benefitAbove2k: null,
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

  useEffect(() => {
    if (isOpen) {
      const hasSubmitted = localStorage.getItem("leadSubmitted") === "true";
      setIsFormSubmitted(hasSubmitted);
      setStep("qualify-inss");
      setDisqualifyReason(null);
      setQualification({ isInssRetireeOrPensioner: null, benefitAbove2k: null });
      setFormData({ name: "", email: "", phone: "" });
      setFocusedField(null);
      resetValidation();

      if (hasSubmitted) {
        console.log("Form already submitted, showing protection message");
      }
    }
  }, [isOpen, resetValidation]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isFormSubmitted) return;

    if (!formData.name || !formData.email || !formData.phone) return;
    if (formData.phone.replace(/\D/g, "").length !== 11) return;
    if (nameValidationError) return;
    if (emailValidationError) return;

    if (isValid === false) {
      return;
    }

    console.log("Submitting lead form:", { qualification, formData });

    const success = await submitLead({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      isInssRetireeOrPensioner:
        qualification.isInssRetireeOrPensioner ?? undefined,
      benefitAbove2k: qualification.benefitAbove2k ?? undefined,
    });

    if (success) {
      localStorage.setItem("leadSubmitted", "true");
      setIsFormSubmitted(true);
      console.log("Lead submitted successfully, flag set in localStorage");

      setFormData({ name: "", email: "", phone: "" });
      setFocusedField(null);
      resetValidation();
      onClose();
    }
  };

  useEffect(() => {
    if (!isOpen) {
      resetValidation();
    }
  }, [isOpen, resetValidation]);

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
              Dados Recebidos com Sucesso!
            </DialogTitle>
            <p className="text-gray-600 text-base font-medium">
              Já recebemos suas informações e entraremos em contato via WhatsApp em breve.
            </p>
          </DialogHeader>

          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Phone className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-semibold">Aguarde nosso contato</span>
            </div>
            <p className="text-green-600 text-sm">
              Nossa equipe entrará em contato em até 24 horas pelo WhatsApp para sua análise gratuita.
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

      {step === "disqualified" ? (
        <div>
          <DialogHeader className="text-center pt-2">
            <DialogTitle className="text-purple-brand text-2xl font-bold tracking-tight leading-tight">
              Obrigado pelo interesse
            </DialogTitle>
            <p className="text-gray-600 text-base font-medium mt-2">Agradecemos por responder.</p>
          </DialogHeader>

          <div className="mt-6">
            <div className="rounded-xl border border-lavender bg-lavender/10 p-4 text-center">
              {disqualifyReason === "below_2k" ? (
                <>
                  <p className="text-gray-900 font-semibold text-lg">
                    No momento, conseguimos ajudar apenas quando o benefício é superior a R$ 2.000 mensais.
                  </p>
                  <p className="text-gray-700 text-base mt-2">Agradecemos seu interesse.</p>
                </>
              ) : (
                <>
                  <p className="text-gray-900 font-semibold text-lg">
                    No momento, atendemos apenas aposentados e pensionistas do INSS.
                  </p>
                  <p className="text-gray-700 text-base mt-2">Agradecemos seu interesse.</p>
                </>
              )}
            </div>

            <Button
              onClick={onClose}
              className="w-full mt-6 bg-purple-brand hover:bg-lavender-800 text-white font-semibold rounded-lg"
            >
              Entendi
            </Button>
          </div>
        </div>
      ) : step === "qualify-inss" || step === "qualify-benefit" ? (
        <div>
          <DialogHeader className="text-center pt-2">
            <DialogTitle className="text-purple-brand text-2xl font-bold tracking-tight leading-tight">
              Antes de começar, confirme
            </DialogTitle>
            <p className="text-gray-600 text-base font-medium mt-2">
              Para garantir que podemos ajudar, responda 2 perguntas rápidas.
            </p>
          </DialogHeader>

          <div className="mt-6 space-y-6">
            {step === "qualify-inss" ? (
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
                        benefitAbove2k: null,
                      }));
                      setDisqualifyReason(null);
                      setStep("qualify-benefit");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    SIM
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setQualification((prev) => ({
                        ...prev,
                        isInssRetireeOrPensioner: false,
                        benefitAbove2k: null,
                      }));
                      setDisqualifyReason("not_inss");
                      setStep("disqualified");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    NÃO
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-lavender bg-white p-4">
                <p className="text-gray-900 font-bold text-lg mb-3">
                  Seu benefício é superior a R$ 2.000 mensais?
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setQualification((prev) => ({ ...prev, benefitAbove2k: "yes" }));
                      setDisqualifyReason(null);
                      setStep("form");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    SIM
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setQualification((prev) => ({ ...prev, benefitAbove2k: "no" }));
                      setDisqualifyReason("below_2k");
                      setStep("disqualified");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    NÃO
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setQualification((prev) => ({ ...prev, benefitAbove2k: "unknown" }));
                      setDisqualifyReason(null);
                      setStep("form");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    NÃO SEI
                  </button>
                </div>
                <p className="text-gray-600 text-sm mt-3">
                  Se você é aposentado/pensionista do INSS, pode continuar para a análise gratuita.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <DialogHeader className="text-center pt-2">
            <DialogTitle className="text-purple-brand text-2xl font-bold tracking-tight leading-tight">
              Sua análise gratuita — 100% segura
            </DialogTitle>
            <p className="text-gray-600 text-base font-medium mt-2">
              Preencha seus dados para um contato via WhatsApp.
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
              label="WhatsApp"
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
                  Quero minha análise gratuita
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
      )}
    </DialogContent>
  );
};

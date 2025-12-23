import React, { useEffect, useMemo, useState } from "react";
import type { LeadFormVariantProps } from "@/forms/lead/types";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FloatingLabelInput } from "@/components/ui/FloatingLabelInput";
import { useWhatsappValidation } from "@/hooks/useWhatsappValidation";
import { useAirtableSubmission } from "@/hooks/useAirtableSubmission";
import { LEAD_FIELD_IDS } from "@/forms/lead/fieldIds";
import { ArrowRight, CheckCircle, Loader2, Lock, Mail, Phone, User, XCircle } from "lucide-react";

type Situation = "aposentado" | "servidor_publico" | "clt" | null;

const CloseButton = ({ onClose }: { onClose: () => void }) => (
  <button
    type="button"
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

const QuestionBlock = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-xl border border-lavender/40 bg-white p-4">
    <p className="text-gray-900 font-semibold text-base mb-3">{title}</p>
    {children}
  </div>
);

const OptionButton = ({ onClick, label }: { onClick: () => void; label: string }) => (
  <button
    type="button"
    onClick={onClick}
    className="min-h-12 rounded-lg border font-semibold text-base transition-colors px-4 text-left bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
  >
    {label}
  </button>
);

const labelSituation = (value: Situation) => {
  switch (value) {
    case "aposentado":
      return "Aposentado";
    case "servidor_publico":
      return "Servidor público";
    case "clt":
      return "CLT";
    default:
      return "";
  }
};

export const Lp07LeadFormDialogContent = ({ isOpen, onClose }: LeadFormVariantProps) => {
  const [step, setStep] = useState<"qualify" | "disqualified" | "form">("qualify");
  const [situation, setSituation] = useState<Situation>(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { isValidating, isValid, validationError, validateWhatsapp, resetValidation } =
    useWhatsappValidation();
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
      setStep("qualify");
      setSituation(null);
      setFormData({ name: "", email: "", phone: "" });
      setFocusedField(null);
      resetValidation();
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

    const success = await submitLead({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      incomeOrigin: labelSituation(situation),
    });

    if (success) {
      localStorage.setItem("leadSubmitted", "true");
      setIsFormSubmitted(true);
      setFormData({ name: "", email: "", phone: "" });
      setFocusedField(null);
      resetValidation();
      onClose();
    }
  };

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
        <CloseButton onClose={onClose} />
        <div className="text-center py-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <DialogHeader className="text-center">
            <DialogTitle className="text-gray-900 text-xl font-bold">
              Recebemos seus dados com sucesso
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-600 text-base mt-3">
            Em breve um especialista entrará em contato.
          </p>
        </div>
      </DialogContent>
    );
  }

  if (step === "disqualified") {
    return (
      <DialogContent className="sm:max-w-md rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] border-0 [&>button]:hidden">
        <CloseButton onClose={onClose} />

        <DialogHeader className="text-center pt-2">
          <DialogTitle className="text-purple-brand text-2xl font-bold tracking-tight leading-tight">
            Obrigado pelo interesse
          </DialogTitle>
          <p className="text-gray-600 text-base font-medium mt-2">
            No momento não atendemos casos CLT. Nosso atendimento é exclusivo para servidores públicos e beneficiários do INSS.
          </p>
        </DialogHeader>

        <div className="mt-6">
          <div className="rounded-xl border border-lavender bg-lavender/10 p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <XCircle className="w-6 h-6 text-red-600" aria-hidden="true" />
              <p className="text-gray-900 font-semibold text-base">Perfil não elegível</p>
            </div>
            <p className="text-gray-700 text-base">
              Se você for servidor público ou beneficiário do INSS, teremos prazer em ajudar. Quando esse for o seu caso, volte para refazer a triagem.
            </p>
          </div>

          <div className="mt-6">
            <Button
              type="button"
              onClick={onClose}
              className="h-12 w-full bg-purple-brand hover:bg-lavender-800 text-white font-semibold rounded-lg"
            >
              Entendi
            </Button>
          </div>
        </div>
      </DialogContent>
    );
  }

  if (step === "qualify") {
    return (
      <DialogContent className="sm:max-w-md rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] border-0 [&>button]:hidden">
        <CloseButton onClose={onClose} />
        <DialogHeader className="text-center pt-2">
          <DialogTitle className="text-purple-brand text-2xl font-bold tracking-tight leading-tight">
            Triagem rápida
          </DialogTitle>
          <p className="text-gray-600 text-base font-medium mt-2">
            Responda para confirmarmos se conseguimos te ajudar.
          </p>
        </DialogHeader>

        <div className="space-y-5 mt-6">
          <QuestionBlock title="Qual sua situação?">
            <div className="grid gap-3">
              <OptionButton
                label="1 - Aposentado"
                onClick={() => {
                  setSituation("aposentado");
                  setStep("form");
                }}
              />
              <OptionButton
                label="2 - Servidor público"
                onClick={() => {
                  setSituation("servidor_publico");
                  setStep("form");
                }}
              />
              <OptionButton
                label="3 - CLT"
                onClick={() => {
                  setSituation("clt");
                  setStep("disqualified");
                }}
              />
            </div>
          </QuestionBlock>
        </div>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="sm:max-w-md rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] border-0 [&>button]:hidden">
      <CloseButton onClose={onClose} />

      <DialogHeader className="text-center pt-2">
        <DialogTitle className="text-purple-brand text-2xl font-bold tracking-tight leading-tight">
          Preencha seus dados
        </DialogTitle>
        <p className="text-gray-600 text-base font-medium mt-2">
          É rápido e seguro. Seus dados ficam protegidos.
        </p>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        <FloatingLabelInput
          id={LEAD_FIELD_IDS.name}
          type="text"
          placeholder="Nome completo"
          label="Nome completo"
          value={formData.name}
          onChange={(value) => handleInputChange("name", value)}
          icon={User}
          focusedField={focusedField}
          setFocusedField={setFocusedField}
          required
          validationError={nameValidationError ?? undefined}
        />

        <FloatingLabelInput
          id={LEAD_FIELD_IDS.email}
          type="email"
          placeholder="E-mail"
          label="E-mail"
          value={formData.email}
          onChange={(value) => handleInputChange("email", value)}
          icon={Mail}
          focusedField={focusedField}
          setFocusedField={setFocusedField}
          required
          validationError={emailValidationError ?? undefined}
        />

        <FloatingLabelInput
          id={LEAD_FIELD_IDS.phone}
          type="tel"
          placeholder="WhatsApp"
          label="WhatsApp"
          value={formData.phone}
          onChange={(value) => handleInputChange("phone", value)}
          icon={Phone}
          focusedField={focusedField}
          setFocusedField={setFocusedField}
          isValidating={isValidating}
          isValid={isValid}
          validationError={validationError ?? undefined}
          required
        />

        <div className="pt-2">
          <Button
            type="submit"
            disabled={isSubmitDisabled}
            className="w-full h-12 bg-purple-brand hover:bg-lavender-800 text-white font-semibold rounded-lg flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                Enviar
                <ArrowRight className="w-4 h-4 text-yellow-vibrant" />
              </>
            )}
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-gray-600 pt-2">
          <Lock className="w-4 h-4" />
          <span>Seus dados estão seguros.</span>
        </div>
      </form>
    </DialogContent>
  );
};

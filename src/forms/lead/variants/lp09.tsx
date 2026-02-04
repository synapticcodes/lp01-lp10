import React, { useEffect, useMemo, useState } from "react";
import type { LeadFormVariantProps } from "@/forms/lead/types";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FloatingLabelInput } from "@/components/ui/FloatingLabelInput";
import { useWhatsappValidation } from "@/hooks/useWhatsappValidation";
import { useAirtableSubmission } from "@/hooks/useAirtableSubmission";
import { LEAD_FIELD_IDS } from "@/forms/lead/fieldIds";
import { AlertTriangle, ArrowRight, CheckCircle, Loader2, Lock, Mail, Phone, User, XCircle } from "lucide-react";

type Situation = "aposentado" | "servidor_publico" | "clt" | null;
type IncomeRange = "above_5000" | "3000_5000" | "below_3000" | null;
type DisqualifyReason = "clt" | "low_income" | "terms_declined" | null;

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

const labelIncomeRange = (value: IncomeRange) => {
  switch (value) {
    case "above_5000":
      return "Acima de R$ 5.000";
    case "3000_5000":
      return "Entre R$ 3.000 e R$ 5.000";
    case "below_3000":
      return "Abaixo de R$ 3.000";
    default:
      return "";
  }
};

export const Lp09LeadFormDialogContent = ({ isOpen, onClose }: LeadFormVariantProps) => {
  const [step, setStep] = useState<"qualify" | "income" | "terms" | "disqualified" | "form">(
    "qualify"
  );
  const [situation, setSituation] = useState<Situation>(null);
  const [incomeRange, setIncomeRange] = useState<IncomeRange>(null);
  const [disqualifyReason, setDisqualifyReason] = useState<DisqualifyReason>(null);
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
      setIncomeRange(null);
      setDisqualifyReason(null);
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

    const incomeRangeLabel = labelIncomeRange(incomeRange);
    const success = await submitLead({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      incomeOrigin: labelSituation(situation),
      incomeRange: incomeRangeLabel || undefined,
      paidServiceAcknowledgement: "SIM",
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
    const disqualifiedSubtitle =
      disqualifyReason === "low_income"
        ? "No momento, priorizamos casos com renda mensal acima de R$ 3.000."
        : disqualifyReason === "terms_declined"
          ? "Encerramos por aqui, sem compromisso."
          : "No momento não atendemos casos CLT. Nosso atendimento é exclusivo para servidores públicos e beneficiários do INSS.";
    const disqualifiedBody =
      disqualifyReason === "low_income"
        ? "Agradecemos por responder. Quando sua renda estiver acima de R$ 3.000, teremos prazer em ajudar."
        : disqualifyReason === "terms_declined"
          ? "Se preferir, você pode voltar a qualquer momento para retomar a análise."
          : "Se você for servidor público ou beneficiário do INSS, teremos prazer em ajudar. Quando esse for o seu caso, volte para refazer a triagem.";

    return (
      <DialogContent className="sm:max-w-md rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] border-0 [&>button]:hidden">
        <CloseButton onClose={onClose} />

        <DialogHeader className="text-center pt-2">
          <DialogTitle className="text-purple-brand text-2xl font-bold tracking-tight leading-tight">
            Obrigado pelo interesse
          </DialogTitle>
          <p className="text-gray-600 text-base font-medium mt-2">
            {disqualifiedSubtitle}
          </p>
        </DialogHeader>

        <div className="mt-6">
          <div className="rounded-xl border border-lavender bg-lavender/10 p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <XCircle className="w-6 h-6 text-red-600" aria-hidden="true" />
              <p className="text-gray-900 font-semibold text-base">Perfil não elegível</p>
            </div>
            <p className="text-gray-700 text-base">
              {disqualifiedBody}
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
                  setDisqualifyReason(null);
                  setStep("income");
                }}
              />
              <OptionButton
                label="2 - Servidor público"
                onClick={() => {
                  setSituation("servidor_publico");
                  setDisqualifyReason(null);
                  setStep("income");
                }}
              />
              <OptionButton
                label="3 - CLT"
                onClick={() => {
                  setSituation("clt");
                  setDisqualifyReason("clt");
                  setStep("disqualified");
                }}
              />
            </div>
          </QuestionBlock>
        </div>
      </DialogContent>
    );
  }

  if (step === "income") {
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
          <QuestionBlock title="Quanto sobra no seu bolso todo mês?">
            <p className="text-gray-600 text-sm mb-4">
              Pense no dinheiro que realmente fica com você depois de pagar todas as contas fixas
              (aluguel, luz, água, internet...).
            </p>
            <div className="grid gap-3">
              <OptionButton
                label="1 - Acima de R$5000"
                onClick={() => {
                  setIncomeRange("above_5000");
                  setDisqualifyReason(null);
                  setStep("terms");
                }}
              />
              <OptionButton
                label="2 - Entre R$3000 a R$5000"
                onClick={() => {
                  setIncomeRange("3000_5000");
                  setDisqualifyReason(null);
                  setStep("terms");
                }}
              />
              <OptionButton
                label="3 - Abaixo de R$3000"
                onClick={() => {
                  setIncomeRange("below_3000");
                  setDisqualifyReason("low_income");
                  setStep("disqualified");
                }}
              />
            </div>
          </QuestionBlock>
        </div>
      </DialogContent>
    );
  }

  if (step === "terms") {
    return (
      <DialogContent className="sm:max-w-md rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] border-0 [&>button]:hidden">
        <CloseButton onClose={onClose} />
        <DialogHeader className="text-center pt-2">
          <DialogTitle className="text-purple-brand text-2xl font-bold tracking-tight leading-tight">
            Antes de continuar, leia com atenção
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-left">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-yellow-600" aria-hidden="true" />
              <p className="text-gray-800 text-sm">
                Este é um serviço jurídico especializado e possui custos.
              </p>
            </div>
          </div>

          <p className="text-gray-700 text-sm">
            Ao prosseguir, você declara estar ciente de que:
          </p>

          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-gray-700 text-sm">
              <CheckCircle className="mt-0.5 h-5 w-5 text-green-600" aria-hidden="true" />
              <span>
                Não prestamos atendimento gratuito — nosso trabalho envolve profissionais
                qualificados e estratégias personalizadas para o seu caso.
              </span>
            </li>
            <li className="flex items-start gap-2 text-gray-700 text-sm">
              <CheckCircle className="mt-0.5 h-5 w-5 text-green-600" aria-hidden="true" />
              <span>
                O início do seu processo está condicionado à assinatura do contrato e pagamento
                conforme as condições que serão apresentadas.
              </span>
            </li>
            <li className="flex items-start gap-2 text-gray-700 text-sm">
              <CheckCircle className="mt-0.5 h-5 w-5 text-green-600" aria-hidden="true" />
              <span>
                O contrato existe para sua proteção, garantindo transparência, prazos e
                responsabilidades de ambas as partes.
              </span>
            </li>
          </ul>

          <p className="text-gray-700 text-sm">
            Se você concorda com esses termos e deseja seguir com a análise do seu caso, clique em
            ACEITO. Caso contrário, clique em NÃO ACEITO e encerramos por aqui, sem compromisso.
          </p>

          <div className="grid gap-3 pt-2">
            <Button
              type="button"
              onClick={() => {
                setDisqualifyReason(null);
                setStep("form");
              }}
              className="h-12 w-full bg-purple-brand hover:bg-lavender-800 text-white font-semibold rounded-lg"
            >
              ACEITO
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDisqualifyReason("terms_declined");
                setStep("disqualified");
              }}
              className="h-12 w-full border-gray-300 text-gray-800 font-semibold rounded-lg"
            >
              NÃO ACEITO
            </Button>
          </div>
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

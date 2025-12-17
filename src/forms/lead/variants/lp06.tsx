import type { LeadFormVariantProps } from "@/forms/lead/types";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FloatingLabelInput } from "@/components/ui/FloatingLabelInput";
import { useWhatsappValidation } from "@/hooks/useWhatsappValidation";
import { useAirtableSubmission } from "@/hooks/useAirtableSubmission";
import { LEAD_FIELD_IDS } from "@/forms/lead/fieldIds";
import { ArrowLeft, CheckCircle, Loader2, Phone, User, XCircle } from "lucide-react";

type AgeRange = "lt_40" | "40_54" | "55_65" | "gt_65" | null;
type Professional =
  | "aposentado_inss"
  | "pensionista_inss"
  | "servidor_publico_aposentado"
  | "outro"
  | null;
type BenefitRange = "ate_2000" | "2001_3000" | "3001_5000" | "acima_5000" | null;
type DebtsRange = "ate_10000" | "10001_30000" | "30001_70000" | "acima_70000" | null;
type LoansCount = "1" | "2" | "3_mais" | null;

type Outcome = "qualified" | "review" | "disqualified";
type Step =
  | "q_age"
  | "q_professional"
  | "q_benefit"
  | "q_debts"
  | "q_loans"
  | "contact"
  | "review"
  | "disqualified"
  | "thankyou";

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

const OptionButton = ({
  isActive,
  onClick,
  label,
}: {
  isActive: boolean;
  onClick: () => void;
  label: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`min-h-12 rounded-lg border font-semibold text-base transition-colors px-4 text-left ${
      isActive
        ? "bg-lavender/10 text-gray-900 border-lavender-500"
        : "bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
    }`}
  >
    {label}
  </button>
);

const labelAgeRange = (value: AgeRange) => {
  switch (value) {
    case "lt_40":
      return "Menos de 40 anos";
    case "40_54":
      return "40 a 54 anos";
    case "55_65":
      return "55 a 65 anos";
    case "gt_65":
      return "Acima de 65 anos";
    default:
      return "";
  }
};

const estimateAge = (value: AgeRange) => {
  switch (value) {
    case "lt_40":
      return 35;
    case "40_54":
      return 47;
    case "55_65":
      return 60;
    case "gt_65":
      return 70;
    default:
      return undefined;
  }
};

const labelProfessional = (value: Professional) => {
  switch (value) {
    case "aposentado_inss":
      return "Aposentado do INSS";
    case "pensionista_inss":
      return "Pensionista do INSS";
    case "servidor_publico_aposentado":
      return "Servidor Público Aposentado";
    case "outro":
      return "Outro";
    default:
      return "";
  }
};

const labelBenefitRange = (value: BenefitRange) => {
  switch (value) {
    case "ate_2000":
      return "Até R$ 2.000";
    case "2001_3000":
      return "R$ 2.001 a R$ 3.000";
    case "3001_5000":
      return "R$ 3.001 a R$ 5.000";
    case "acima_5000":
      return "Acima de R$ 5.000";
    default:
      return "";
  }
};

const labelDebtsRange = (value: DebtsRange) => {
  switch (value) {
    case "ate_10000":
      return "Até R$ 10.000";
    case "10001_30000":
      return "R$ 10.001 a R$ 30.000";
    case "30001_70000":
      return "R$ 30.001 a R$ 70.000";
    case "acima_70000":
      return "Acima de R$ 70.000";
    default:
      return "";
  }
};

const estimateDebtsTotal = (range: DebtsRange) => {
  switch (range) {
    case "ate_10000":
      return 9000;
    case "10001_30000":
      return 20000;
    case "30001_70000":
      return 50000;
    case "acima_70000":
      return 80000;
    default:
      return undefined;
  }
};

const labelLoansCount = (value: LoansCount) => {
  switch (value) {
    case "1":
      return "1";
    case "2":
      return "2";
    case "3_mais":
      return "3 ou mais";
    default:
      return "";
  }
};

export const Lp06LeadFormDialogContent = ({ isOpen, onClose }: LeadFormVariantProps) => {
  const navigate = useNavigate();

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [step, setStep] = useState<Step>("q_age");

  const [answers, setAnswers] = useState<{
    ageRange: AgeRange;
    professional: Professional;
    benefitRange: BenefitRange;
    debtsRange: DebtsRange;
    loansCount: LoansCount;
  }>({
    ageRange: null,
    professional: null,
    benefitRange: null,
    debtsRange: null,
    loansCount: null,
  });

  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [focusedField, setFocusedField] = useState<string | null>(null);

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
    setStep("q_age");
    setAnswers({
      ageRange: null,
      professional: null,
      benefitRange: null,
      debtsRange: null,
      loansCount: null,
    });
    setFormData({ name: "", phone: "" });
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

  const handleInputChange = <K extends keyof typeof formData>(
    field: K,
    value: (typeof formData)[K]
  ) => {
    if (isFormSubmitted) return;

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

  const outcome = useMemo((): { value: Outcome; reasons: string[] } => {
    const reasons: string[] = [];

    const isEligibleProfessional =
      answers.professional === "aposentado_inss" ||
      answers.professional === "pensionista_inss" ||
      answers.professional === "servidor_publico_aposentado";

    if (answers.professional === "outro") {
      reasons.push("Perfil fora do atendimento (não é INSS/servidor público aposentado).");
    }

    if (answers.benefitRange === "ate_2000") {
      reasons.push("Benefício até R$ 2.000 (fora do ticket atendido).");
    }

    if (answers.debtsRange === "ate_10000") {
      reasons.push("Dívida até R$ 10.000 (normalmente sem margem suficiente).");
    }

    const isUnder40 = answers.ageRange === "lt_40";
    if (isUnder40 && answers.professional !== "servidor_publico_aposentado") {
      reasons.push("Idade abaixo de 40 anos (fora do público-alvo principal).");
    }

    const hardDisqualified =
      answers.professional === "outro" ||
      answers.benefitRange === "ate_2000" ||
      answers.debtsRange === "ate_10000" ||
      (isUnder40 && answers.professional !== "servidor_publico_aposentado");

    if (hardDisqualified) return { value: "disqualified", reasons };
    if (!isEligibleProfessional) return { value: "review", reasons };

    const hasHighBenefit = answers.benefitRange === "3001_5000" || answers.benefitRange === "acima_5000";
    const hasMediumBenefit = answers.benefitRange === "2001_3000";

    const hasHighDebt = answers.debtsRange === "30001_70000" || answers.debtsRange === "acima_70000";
    const hasMediumDebt = answers.debtsRange === "10001_30000";

    const loans2OrMore = answers.loansCount === "2" || answers.loansCount === "3_mais";
    const loansHigh = answers.loansCount === "3_mais";

    const ageStrong = answers.ageRange === "55_65" || answers.ageRange === "gt_65";

    const qualified =
      (ageStrong || (answers.ageRange === "40_54" && (hasHighDebt || hasHighBenefit || loansHigh))) &&
      (hasHighBenefit || (hasMediumBenefit && hasHighDebt)) &&
      (hasHighDebt || hasMediumDebt) &&
      (loans2OrMore || (answers.loansCount === "1" && hasHighDebt));

    return { value: qualified ? "qualified" : "review", reasons };
  }, [answers]);

  const isContactStepDisabled = useMemo(() => {
    const numbersOnly = formData.phone.replace(/\D/g, "");
    const hasValidPhone = numbersOnly.length === 11;

    return (
      !formData.name ||
      !formData.phone ||
      !hasValidPhone ||
      Boolean(nameValidationError) ||
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
  ]);

  const handleFinalSubmit = async () => {
    if (isFormSubmitted) return;
    if (isContactStepDisabled) return;
    if (isValid === false) return;

    const leadType =
      outcome.value === "qualified"
        ? "LP06 — Qualificado"
        : outcome.value === "disqualified"
          ? "LP06 — Desqualificado"
          : "LP06 — Avaliação";

    const professionalLabel = labelProfessional(answers.professional);
    const benefitRangeLabel = labelBenefitRange(answers.benefitRange);
    const debtsRangeLabel = labelDebtsRange(answers.debtsRange);
    const loansCountLabel = labelLoansCount(answers.loansCount);
    const ageRangeLabel = labelAgeRange(answers.ageRange);

    const benefitAbove2k =
      answers.benefitRange === "ate_2000" ? "no" : "yes";

    const discountReasonParts = [
      professionalLabel ? `Você é: ${professionalLabel}` : null,
      ageRangeLabel ? `Idade: ${ageRangeLabel}` : null,
      benefitRangeLabel ? `Benefício: ${benefitRangeLabel}` : null,
      debtsRangeLabel ? `Dívidas: ${debtsRangeLabel}` : null,
      loansCountLabel ? `Qtd. consignados: ${loansCountLabel}` : null,
      outcome.reasons.length ? `Motivos (triagem): ${outcome.reasons.join(" ")}` : null,
    ].filter(Boolean);

    const success = await submitLead({
      name: formData.name,
      phone: formData.phone,
      isInssRetireeOrPensioner:
        answers.professional === "aposentado_inss" || answers.professional === "pensionista_inss"
          ? true
          : answers.professional === "outro"
            ? false
            : undefined,
      benefitAbove2k,
      benefitRange: benefitRangeLabel || undefined,
      age: estimateAge(answers.ageRange),
      inssSituation: professionalLabel || undefined,
      debtType: loansCountLabel ? `Consignado (empréstimos ativos: ${loansCountLabel})` : "Consignado",
      debtsTotal: estimateDebtsTotal(answers.debtsRange),
      leadType,
      discountReason: discountReasonParts.join(" | ") || undefined,
    });

    if (success) {
      localStorage.setItem("leadSubmitted", "true");
      setIsFormSubmitted(true);
      setStep("thankyou");
    }
  };

  const progress = useMemo(() => {
    const map: Record<Step, number> = {
      q_age: 1,
      q_professional: 2,
      q_benefit: 3,
      q_debts: 4,
      q_loans: 5,
      contact: 6,
      review: 6,
      disqualified: 6,
      thankyou: 6,
    };
    return { current: map[step] ?? 1, total: 6 };
  }, [step]);

  const goBack = () => {
    setStep((prev) => {
      switch (prev) {
        case "q_professional":
          return "q_age";
        case "q_benefit":
          return "q_professional";
        case "q_debts":
          return "q_benefit";
        case "q_loans":
          return "q_debts";
        case "contact":
          return "q_loans";
        case "review":
          return "contact";
        case "disqualified":
          return "q_loans";
        default:
          return prev;
      }
    });
  };

  const canGoBack =
    step !== "q_age" && step !== "thankyou" && !(isFormSubmitted && step === "thankyou");

  if (isFormSubmitted && step !== "thankyou") {
    return (
      <DialogContent className="sm:max-w-md rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] border-0 [&>button]:hidden">
        <CloseButton onClose={onClose} />
        <div className="text-center py-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" aria-hidden="true" />
          </div>
          <DialogHeader className="text-center">
            <DialogTitle className="text-purple-brand text-2xl font-bold tracking-tight leading-tight mb-2">
              Dados recebidos com sucesso!
            </DialogTitle>
            <p className="text-gray-600 text-base font-medium">
              Já recebemos suas informações. Se fizer sentido, um especialista entra em contato via WhatsApp.
            </p>
          </DialogHeader>
          <Button
            type="button"
            onClick={onClose}
            className="w-full h-12 mt-6 bg-purple-brand hover:bg-lavender-800 text-white font-semibold rounded-lg"
          >
            Entendi
          </Button>
        </div>
      </DialogContent>
    );
  }

  if (step === "thankyou") {
    const isDisqualified = outcome.value === "disqualified";
    return (
      <DialogContent className="sm:max-w-md rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] border-0 [&>button]:hidden">
        <CloseButton onClose={onClose} />

        <div className="text-center py-6">
          <div className="flex justify-center mb-4">
            {isDisqualified ? (
              <XCircle className="w-14 h-14 text-red-600" aria-hidden="true" />
            ) : (
              <CheckCircle className="w-14 h-14 text-green-600" aria-hidden="true" />
            )}
          </div>

          <DialogHeader className="text-center">
            <DialogTitle className="text-purple-brand text-2xl font-bold tracking-tight leading-tight mb-2">
              {isDisqualified ? "Obrigado pelo seu interesse" : "Recebemos suas informações"}
            </DialogTitle>
            <p className="text-gray-700 text-base font-medium">
              {isDisqualified
                ? "No momento, nosso trabalho é focado exclusivamente em ajudar aposentados, pensionistas do INSS e servidores públicos aposentados com dívidas altas de consignado."
                : "Se o seu caso se encaixar, um especialista entrará em contato via WhatsApp para seguir com a análise gratuita."}
            </p>
          </DialogHeader>

          {isDisqualified ? (
            <div className="mt-5 rounded-xl border border-lavender bg-lavender/10 p-4 text-left">
              <p className="text-gray-900 font-semibold text-base mb-2">
                Orientação rápida:
              </p>
              <p className="text-gray-700 text-sm leading-relaxed">
                Para outras situações, recomendamos buscar orientação no Procon ou em um defensor público.
              </p>
            </div>
          ) : null}

          <div className="mt-6 grid grid-cols-1 gap-3">
            <Button
              type="button"
              onClick={() => {
                onClose();
                if (!isDisqualified) navigate("/obrigado");
              }}
              className="w-full h-12 bg-purple-brand hover:bg-lavender-800 text-white font-semibold rounded-lg"
            >
              {isDisqualified ? "Entendi" : "Continuar"}
            </Button>

            {isDisqualified ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onClose();
                  navigate("/obrigado");
                }}
                className="w-full h-12 rounded-lg"
              >
                Ver o conteúdo mesmo assim
              </Button>
            ) : null}
          </div>
        </div>
      </DialogContent>
    );
  }

  if (step === "disqualified") {
    return (
      <DialogContent className="sm:max-w-md rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] border-0 [&>button]:hidden">
        <CloseButton onClose={onClose} />

        <div className="text-center py-6">
          <div className="flex justify-center mb-4">
            <XCircle className="w-14 h-14 text-red-600" aria-hidden="true" />
          </div>

          <DialogHeader className="text-center">
            <DialogTitle className="text-purple-brand text-2xl font-bold tracking-tight leading-tight mb-2">
              Obrigado pelo seu interesse
            </DialogTitle>
            <p className="text-gray-700 text-base font-medium">
              No momento, nosso trabalho é focado exclusivamente em ajudar aposentados, pensionistas do INSS e servidores públicos aposentados com dívidas altas de consignado.
            </p>
          </DialogHeader>

          <div className="mt-5 rounded-xl border border-lavender bg-lavender/10 p-4 text-left">
            <p className="text-gray-900 font-semibold text-base mb-2">Orientação rápida:</p>
            <p className="text-gray-700 text-sm leading-relaxed">
              Para outras situações, recomendamos buscar orientação no Procon ou em um defensor público.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              className="w-full h-12 rounded-lg flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>

            <Button
              type="button"
              onClick={onClose}
              className="w-full h-12 bg-purple-brand hover:bg-lavender-800 text-white font-semibold rounded-lg"
            >
              Entendi
            </Button>
          </div>
        </div>
      </DialogContent>
    );
  }

  const HeaderProgress = (
    <div className="text-center pt-1">
      <p className="text-gray-600 text-sm font-medium">
        Etapa {progress.current} de {progress.total}
      </p>
    </div>
  );

  const BackButton = canGoBack ? (
    <Button
      type="button"
      variant="outline"
      onClick={goBack}
      className="h-12 rounded-lg flex items-center justify-center gap-2"
    >
      <ArrowLeft className="w-4 h-4" />
      Voltar
    </Button>
  ) : null;

  if (step === "q_age") {
    return (
      <DialogContent className="sm:max-w-md rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] border-0 [&>button]:hidden">
        <CloseButton onClose={onClose} />
        {HeaderProgress}
        <DialogHeader className="text-center pt-2">
          <DialogTitle className="text-purple-brand text-2xl font-bold tracking-tight leading-tight">
            Triagem rápida
          </DialogTitle>
          <p className="text-gray-600 text-base font-medium mt-2">
            Responda as perguntas para confirmar se conseguimos te ajudar.
          </p>
        </DialogHeader>

        <div className="space-y-5 mt-6">
          <QuestionBlock title="Idade">
            <div className="grid gap-3">
              <OptionButton
                isActive={answers.ageRange === "lt_40"}
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, ageRange: "lt_40" }));
                  setStep("q_professional");
                }}
                label="Menos de 40 anos"
              />
              <OptionButton
                isActive={answers.ageRange === "40_54"}
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, ageRange: "40_54" }));
                  setStep("q_professional");
                }}
                label="40 a 54 anos"
              />
              <OptionButton
                isActive={answers.ageRange === "55_65"}
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, ageRange: "55_65" }));
                  setStep("q_professional");
                }}
                label="55 a 65 anos"
              />
              <OptionButton
                isActive={answers.ageRange === "gt_65"}
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, ageRange: "gt_65" }));
                  setStep("q_professional");
                }}
                label="Acima de 65 anos"
              />
            </div>
          </QuestionBlock>
        </div>
      </DialogContent>
    );
  }

  if (step === "q_professional") {
    return (
      <DialogContent className="sm:max-w-md rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] border-0 [&>button]:hidden">
        <CloseButton onClose={onClose} />
        {HeaderProgress}
        <DialogHeader className="text-center pt-2">
          <DialogTitle className="text-purple-brand text-2xl font-bold tracking-tight leading-tight">
            Triagem rápida
          </DialogTitle>
          <p className="text-gray-600 text-base font-medium mt-2">
            Responda as perguntas para confirmar se conseguimos te ajudar.
          </p>
        </DialogHeader>

        <div className="space-y-5 mt-6">
          <QuestionBlock title="Você é">
            <div className="grid gap-3">
              <OptionButton
                isActive={answers.professional === "aposentado_inss"}
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, professional: "aposentado_inss" }));
                  setStep("q_benefit");
                }}
                label="Aposentado do INSS"
              />
              <OptionButton
                isActive={answers.professional === "pensionista_inss"}
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, professional: "pensionista_inss" }));
                  setStep("q_benefit");
                }}
                label="Pensionista do INSS"
              />
              <OptionButton
                isActive={answers.professional === "servidor_publico_aposentado"}
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, professional: "servidor_publico_aposentado" }));
                  setStep("q_benefit");
                }}
                label="Servidor Público Aposentado"
              />
              <OptionButton
                isActive={answers.professional === "outro"}
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, professional: "outro" }));
                  setStep("q_benefit");
                }}
                label="Outro"
              />
            </div>
          </QuestionBlock>

          <div className="grid gap-3">
            {BackButton}
          </div>
        </div>
      </DialogContent>
    );
  }

  if (step === "q_benefit") {
    return (
      <DialogContent className="sm:max-w-md rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] border-0 [&>button]:hidden">
        <CloseButton onClose={onClose} />
        {HeaderProgress}
        <DialogHeader className="text-center pt-2">
          <DialogTitle className="text-purple-brand text-2xl font-bold tracking-tight leading-tight">
            Triagem rápida
          </DialogTitle>
          <p className="text-gray-600 text-base font-medium mt-2">
            Responda as perguntas para confirmar se conseguimos te ajudar.
          </p>
        </DialogHeader>

        <div className="space-y-5 mt-6">
          <QuestionBlock title="Valor do seu benefício (aposentadoria/pensão)">
            <div className="grid gap-3">
              <OptionButton
                isActive={answers.benefitRange === "ate_2000"}
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, benefitRange: "ate_2000" }));
                  setStep("q_debts");
                }}
                label="Até R$ 2.000"
              />
              <OptionButton
                isActive={answers.benefitRange === "2001_3000"}
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, benefitRange: "2001_3000" }));
                  setStep("q_debts");
                }}
                label="R$ 2.001 a R$ 3.000"
              />
              <OptionButton
                isActive={answers.benefitRange === "3001_5000"}
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, benefitRange: "3001_5000" }));
                  setStep("q_debts");
                }}
                label="R$ 3.001 a R$ 5.000"
              />
              <OptionButton
                isActive={answers.benefitRange === "acima_5000"}
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, benefitRange: "acima_5000" }));
                  setStep("q_debts");
                }}
                label="Acima de R$ 5.000"
              />
            </div>
          </QuestionBlock>

          <div className="grid gap-3">
            {BackButton}
          </div>
        </div>
      </DialogContent>
    );
  }

  if (step === "q_debts") {
    return (
      <DialogContent className="sm:max-w-md rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] border-0 [&>button]:hidden">
        <CloseButton onClose={onClose} />
        {HeaderProgress}
        <DialogHeader className="text-center pt-2">
          <DialogTitle className="text-purple-brand text-2xl font-bold tracking-tight leading-tight">
            Triagem rápida
          </DialogTitle>
          <p className="text-gray-600 text-base font-medium mt-2">
            Responda as perguntas para confirmar se conseguimos te ajudar.
          </p>
        </DialogHeader>

        <div className="space-y-5 mt-6">
          <QuestionBlock title="O valor total das suas dívidas de consignado é">
            <div className="grid gap-3">
              <OptionButton
                isActive={answers.debtsRange === "ate_10000"}
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, debtsRange: "ate_10000" }));
                  setStep("q_loans");
                }}
                label="Até R$ 10.000"
              />
              <OptionButton
                isActive={answers.debtsRange === "10001_30000"}
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, debtsRange: "10001_30000" }));
                  setStep("q_loans");
                }}
                label="R$ 10.001 a R$ 30.000"
              />
              <OptionButton
                isActive={answers.debtsRange === "30001_70000"}
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, debtsRange: "30001_70000" }));
                  setStep("q_loans");
                }}
                label="R$ 30.001 a R$ 70.000"
              />
              <OptionButton
                isActive={answers.debtsRange === "acima_70000"}
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, debtsRange: "acima_70000" }));
                  setStep("q_loans");
                }}
                label="Acima de R$ 70.000"
              />
            </div>
          </QuestionBlock>

          <div className="grid gap-3">
            {BackButton}
          </div>
        </div>
      </DialogContent>
    );
  }

  if (step === "q_loans") {
    return (
      <DialogContent className="sm:max-w-md rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] border-0 [&>button]:hidden">
        <CloseButton onClose={onClose} />
        {HeaderProgress}
        <DialogHeader className="text-center pt-2">
          <DialogTitle className="text-purple-brand text-2xl font-bold tracking-tight leading-tight">
            Triagem rápida
          </DialogTitle>
          <p className="text-gray-600 text-base font-medium mt-2">
            Responda as perguntas para confirmar se conseguimos te ajudar.
          </p>
        </DialogHeader>

        <div className="space-y-5 mt-6">
          <QuestionBlock title="Quantidade de empréstimos consignados ativos">
            <div className="grid gap-3">
              <OptionButton
                isActive={answers.loansCount === "1"}
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, loansCount: "1" }));
                  setStep(outcome.value === "disqualified" ? "disqualified" : "contact");
                }}
                label="1"
              />
              <OptionButton
                isActive={answers.loansCount === "2"}
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, loansCount: "2" }));
                  setStep(outcome.value === "disqualified" ? "disqualified" : "contact");
                }}
                label="2"
              />
              <OptionButton
                isActive={answers.loansCount === "3_mais"}
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, loansCount: "3_mais" }));
                  setStep(outcome.value === "disqualified" ? "disqualified" : "contact");
                }}
                label="3 ou mais"
              />
            </div>
          </QuestionBlock>

          <div className="grid gap-3">
            {BackButton}
          </div>
        </div>
      </DialogContent>
    );
  }

  if (step === "contact") {
    return (
      <DialogContent className="sm:max-w-md rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] border-0 [&>button]:hidden">
        <CloseButton onClose={onClose} />
        {HeaderProgress}
        <DialogHeader className="text-center pt-2">
          <DialogTitle className="text-purple-brand text-2xl font-bold tracking-tight leading-tight">
            Falta pouco
          </DialogTitle>
          <p className="text-gray-600 text-base font-medium mt-2">
            Informe seus dados para um especialista te chamar no WhatsApp.
          </p>
        </DialogHeader>

        <div className="space-y-5 mt-6">
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

          <div className="grid grid-cols-2 gap-3">
            {BackButton}
            <Button
              type="button"
              disabled={isContactStepDisabled}
              onClick={() => setStep("review")}
              className={`h-12 rounded-lg font-semibold ${
                isContactStepDisabled
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-purple-brand hover:bg-lavender-800 text-white"
              }`}
            >
              Continuar
            </Button>
          </div>
        </div>
      </DialogContent>
    );
  }

  const professionalLabel = labelProfessional(answers.professional);
  const benefitRangeLabel = labelBenefitRange(answers.benefitRange);
  const debtsRangeLabel = labelDebtsRange(answers.debtsRange);
  const loansCountLabel = labelLoansCount(answers.loansCount);
  const ageRangeLabel = labelAgeRange(answers.ageRange);

  return (
    <DialogContent className="sm:max-w-md rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] border-0 [&>button]:hidden">
      <CloseButton onClose={onClose} />
      {HeaderProgress}

      <DialogHeader className="text-center pt-2">
        <DialogTitle className="text-purple-brand text-2xl font-bold tracking-tight leading-tight">
          Confirme suas respostas
        </DialogTitle>
        <p className="text-gray-600 text-base font-medium mt-2">
          Revise os dados antes de enviar para análise gratuita.
        </p>
      </DialogHeader>

      <div className="space-y-4 mt-6">
        <div className="rounded-xl border border-lavender/40 bg-white p-4 text-left space-y-2">
          <p className="text-gray-900 font-semibold">Resumo</p>
          <p className="text-gray-700 text-sm">Idade: {ageRangeLabel || "-"}</p>
          <p className="text-gray-700 text-sm">Você é: {professionalLabel || "-"}</p>
          <p className="text-gray-700 text-sm">Benefício: {benefitRangeLabel || "-"}</p>
          <p className="text-gray-700 text-sm">Dívidas: {debtsRangeLabel || "-"}</p>
          <p className="text-gray-700 text-sm">Qtd. consignados: {loansCountLabel || "-"}</p>
        </div>

        {outcome.value === "review" ? (
          <div className="rounded-xl border border-lavender bg-lavender/10 p-4 text-left">
            <p className="text-gray-900 font-semibold text-sm">Nota:</p>
            <p className="text-gray-700 text-sm mt-1 leading-relaxed">
              Seu caso pode exigir análise manual. Envie mesmo assim e um especialista avalia com cuidado.
            </p>
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-3">
          {BackButton}
          <Button
            type="button"
            disabled={isContactStepDisabled}
            onClick={handleFinalSubmit}
            className={`h-12 rounded-lg font-semibold flex items-center justify-center gap-2 ${
              isContactStepDisabled
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-purple-brand hover:bg-lavender-800 text-white"
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "✅ Enviar"
            )}
          </Button>
        </div>

        <p className="text-gray-600 text-xs leading-relaxed text-center">
          Atendemos exclusivamente aposentados, pensionistas e servidores públicos aposentados com dívidas de consignado.
        </p>
      </div>
    </DialogContent>
  );
};

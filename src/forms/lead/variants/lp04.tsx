import React, { useEffect, useMemo, useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowRight, CheckCircle, Loader2, Lock, Mail, Phone, User, XCircle } from "lucide-react";
import { FloatingLabelInput } from "@/components/ui/FloatingLabelInput";
import { useWhatsappValidation } from "@/hooks/useWhatsappValidation";
import { useAirtableSubmission } from "@/hooks/useAirtableSubmission";
import type { LeadFormVariantProps } from "@/forms/lead/types";
import { LEAD_FIELD_IDS } from "@/forms/lead/fieldIds";
import { formatPhoneNumber } from "@/utils/phoneUtils";

type ProfessionalSituation =
  | "aposentado_inss"
  | "pensionista_inss"
  | "servidor_aposentado"
  | "clt_autonomo"
  | null;

type IncomeRange =
  | "ate_2000"
  | "2001_3000"
  | "3001_5000"
  | "acima_5000"
  | null;

type DebtRange =
  | "ate_10000"
  | "10001_15000"
  | "15001_30000"
  | "acima_30000"
  | null;

type LoansCount = "1_2" | "3_5" | "6_mais" | null;

type CommitmentRange = "ate_30" | "35_50" | "acima_50" | null;

type Step =
  | "q_professional"
  | "q_income"
  | "q_debt"
  | "q_loans"
  | "q_commitment"
  | "form"
  | "disqualified"
  | "thankyou";

type DisqualifyReason = "professional" | "income" | "debt" | "loans" | "commitment";

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
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="min-h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50 px-4 text-left"
  >
    {label}
  </button>
);

const formatProfessionalSituationLabel = (value: ProfessionalSituation) => {
  switch (value) {
    case "aposentado_inss":
      return "Aposentado INSS";
    case "pensionista_inss":
      return "Pensionista INSS";
    case "servidor_aposentado":
      return "Servidor público";
    case "clt_autonomo":
      return "CLT/Autônomo (não atendemos)";
    default:
      return "";
  }
};

const formatIncomeRangeLabel = (value: IncomeRange) => {
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

const formatDebtRangeLabel = (value: DebtRange) => {
  switch (value) {
    case "ate_10000":
      return "Até R$ 10.000";
    case "10001_15000":
      return "R$ 10.001 a R$ 15.000";
    case "15001_30000":
      return "R$ 15.001 a R$ 30.000";
    case "acima_30000":
      return "Acima de R$ 30.000";
    default:
      return "";
  }
};

const formatLoansCountLabel = (value: LoansCount) => {
  switch (value) {
    case "1_2":
      return "1 a 2";
    case "3_5":
      return "3 a 5";
    case "6_mais":
      return "6 ou mais";
    default:
      return "";
  }
};

const formatCommitmentRangeLabel = (value: CommitmentRange) => {
  switch (value) {
    case "ate_30":
      return "Até 30%";
    case "35_50":
      return "35% a 50%";
    case "acima_50":
      return "Mais de 50%";
    default:
      return "";
  }
};

const estimateDebtsTotal = (range: DebtRange) => {
  switch (range) {
    case "15001_30000":
      return 22500;
    case "acima_30000":
      return 40000;
    case "10001_15000":
      return 12500;
    case "ate_10000":
      return 8000;
    default:
      return undefined;
  }
};

export const Lp04LeadFormDialogContent = ({ isOpen, onClose }: LeadFormVariantProps) => {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [step, setStep] = useState<Step>("q_professional");
  const [disqualifyReason, setDisqualifyReason] = useState<DisqualifyReason | null>(null);

  const [answers, setAnswers] = useState<{
    professionalSituation: ProfessionalSituation;
    incomeRange: IncomeRange;
    debtRange: DebtRange;
    loansCount: LoansCount;
    commitmentRange: CommitmentRange;
  }>({
    professionalSituation: null,
    incomeRange: null,
    debtRange: null,
    loansCount: null,
    commitmentRange: null,
  });

  const [consentAccepted, setConsentAccepted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const { isValidating, isValid, validationError, validateWhatsapp, resetValidation } =
    useWhatsappValidation();
  const { isSubmitting, submitLead } = useAirtableSubmission();

  useEffect(() => {
    if (!isOpen) {
      resetValidation();
      return;
    }

    const hasSubmitted = localStorage.getItem("leadSubmitted") === "true";
    setIsFormSubmitted(hasSubmitted);
    setStep(hasSubmitted ? "thankyou" : "q_professional");
    setDisqualifyReason(null);

    setAnswers({
      professionalSituation: null,
      incomeRange: null,
      debtRange: null,
      loansCount: null,
      commitmentRange: null,
    });
    setConsentAccepted(false);
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
    const professionalOk =
      answers.professionalSituation === "aposentado_inss" ||
      answers.professionalSituation === "pensionista_inss" ||
      answers.professionalSituation === "servidor_aposentado";
    const incomeOk =
      answers.incomeRange === "3001_5000" || answers.incomeRange === "acima_5000";
    const debtOk = answers.debtRange === "15001_30000" || answers.debtRange === "acima_30000";
    const loansOk = answers.loansCount === "3_5" || answers.loansCount === "6_mais";
    const commitmentOk = Boolean(answers.commitmentRange);
    return professionalOk && incomeOk && debtOk && loansOk && commitmentOk;
  }, [answers]);

  const disqualifiedTitle = useMemo(() => {
    return "No momento, este programa não é indicado para o seu perfil";
  }, []);

  const disqualifiedBody = useMemo(() => {
    switch (disqualifyReason) {
      case "professional":
        return "Este programa é exclusivo para aposentados/pensionistas do INSS e servidores públicos aposentados.";
      case "income":
        return "No momento, o programa atende apenas benefícios acima de R$ 3.000.";
      case "debt":
        return "No momento, o programa atende apenas dívidas de consignado acima de R$ 15.000.";
      case "loans":
        return "No momento, priorizamos casos com 3 ou mais consignados ativos.";
      case "commitment":
        return "No momento, priorizamos casos com mais de 35% do benefício comprometido com descontos.";
      default:
        return "Agradecemos por responder. No momento, este programa não é o indicado para o seu caso.";
    }
  }, [disqualifyReason]);

  const progress = (() => {
    const map: Record<Exclude<Step, "disqualified" | "thankyou">, { current: number; total: number }> = {
      q_professional: { current: 1, total: 6 },
      q_income: { current: 2, total: 6 },
      q_debt: { current: 3, total: 6 },
      q_loans: { current: 4, total: 6 },
      q_commitment: { current: 5, total: 6 },
      form: { current: 6, total: 6 },
    };
    return map[step as Exclude<Step, "disqualified" | "thankyou">] ?? { current: 1, total: 6 };
  })();

  const goBack = () => {
    setDisqualifyReason(null);
    switch (step) {
      case "q_income":
        setStep("q_professional");
        break;
      case "q_debt":
        setStep("q_income");
        break;
      case "q_loans":
        setStep("q_debt");
        break;
      case "q_commitment":
        setStep("q_loans");
        break;
      case "form":
        setStep("q_commitment");
        break;
      default:
        setStep("q_professional");
        break;
    }
  };

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
    const phoneDigits = formData.phone.replace(/\D/g, "");
    const phoneOk = phoneDigits.length === 11;

    return (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !phoneOk ||
      Boolean(nameValidationError) ||
      Boolean(emailValidationError) ||
      !consentAccepted ||
      !isFullyQualified ||
      isSubmitting ||
      isValidating ||
      isValid === false ||
      isFormSubmitted
    );
  }, [
    consentAccepted,
    emailValidationError,
    formData.email,
    formData.name,
    formData.phone,
    isFormSubmitted,
    isFullyQualified,
    isSubmitting,
    isValid,
    isValidating,
    nameValidationError,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormSubmitted) return;
    if (!isFullyQualified || !consentAccepted) return;

    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (!formData.name || !formData.email || !formData.phone) return;
    if (phoneDigits.length !== 11) return;
    if (nameValidationError || emailValidationError) return;
    if (isValid === false) return;

    const professionalSituationLabel = formatProfessionalSituationLabel(answers.professionalSituation);
    const incomeRangeLabel = formatIncomeRangeLabel(answers.incomeRange);
    const debtRangeLabel = formatDebtRangeLabel(answers.debtRange);
    const loansCountLabel = formatLoansCountLabel(answers.loansCount);
    const commitmentRangeLabel = formatCommitmentRangeLabel(answers.commitmentRange);

    const debtsTotal = answers.debtRange ? estimateDebtsTotal(answers.debtRange) : undefined;

    const extraInfoParts = [
      professionalSituationLabel ? `Situação: ${professionalSituationLabel}` : null,
      incomeRangeLabel ? `Renda: ${incomeRangeLabel}` : null,
      debtRangeLabel ? `Dívida: ${debtRangeLabel}` : null,
      loansCountLabel ? `Qtd. consignados: ${loansCountLabel}` : null,
      commitmentRangeLabel ? `Comprometimento: ${commitmentRangeLabel}` : null,
      "Ciente de investimento: Sim",
    ].filter(Boolean);

    const success = await submitLead({
      name: formData.name,
      phone: formData.phone,
      email: formData.email.trim(),
      isInssRetireeOrPensioner: true,
      benefitAbove2k: "yes",
      inssSituation: professionalSituationLabel || undefined,
      benefitRange: incomeRangeLabel || undefined,
      debtType: `Empréstimo consignado | ${loansCountLabel || "Qtd. não informada"}`,
      discountRange: commitmentRangeLabel || undefined,
      debtsTotal,
      leadType: "LP04 — Qualificação (consignado)",
      discountReason: extraInfoParts.join(" | "),
    });

    if (success) {
      localStorage.setItem("leadSubmitted", "true");
      setIsFormSubmitted(true);
      setStep("thankyou");
    }
  };

  if (step === "thankyou") {
    return (
      <DialogContent
        className="sm:max-w-md rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] border-0 [&>button]:hidden"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="text-center py-2">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-14 h-14 text-green-600" aria-hidden="true" />
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
        <CloseButton onClose={onClose} />
        <div className="text-center py-2">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-14 h-14 text-green-600" aria-hidden="true" />
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
        <CloseButton onClose={onClose} />

        <DialogHeader className="text-center pt-2">
          <DialogTitle className="text-purple-brand text-2xl font-bold tracking-tight leading-tight">
            Obrigado pelo interesse
          </DialogTitle>
          <p className="text-gray-600 text-base font-medium mt-2">Agradecemos por responder.</p>
        </DialogHeader>

        <div className="mt-6">
          <div className="rounded-xl border border-lavender bg-lavender/10 p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <XCircle className="w-6 h-6 text-red-600" aria-hidden="true" />
              <p className="text-gray-900 font-semibold text-base">Perfil não elegível</p>
            </div>
            <p className="text-gray-900 font-semibold text-base mb-2">{disqualifiedTitle}</p>
            <p className="text-gray-700 text-base">{disqualifiedBody}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              className="h-12 rounded-lg"
            >
              Voltar
            </Button>
            <Button
              type="button"
              onClick={onClose}
              className="h-12 bg-purple-brand hover:bg-lavender-800 text-white font-semibold rounded-lg"
            >
              Entendi
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
          Verificação rápida ({progress.current}/{progress.total})
        </DialogTitle>
        <p className="text-gray-600 text-base font-medium mt-2">
          Responda as perguntas. Se seu perfil for qualificado, liberamos o formulário final.
        </p>
      </DialogHeader>

      {step === "q_professional" ? (
        <div className="mt-6 space-y-4">
          <QuestionBlock title="1) Qual sua situação profissional atual?*">
            <div className="grid gap-3">
              <OptionButton
                label="Aposentado INSS"
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, professionalSituation: "aposentado_inss" }));
                  setStep("q_income");
                }}
              />
              <OptionButton
                label="Pensionista INSS"
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, professionalSituation: "pensionista_inss" }));
                  setStep("q_income");
                }}
              />
              <OptionButton
                label="Servidor público"
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, professionalSituation: "servidor_aposentado" }));
                  setStep("q_income");
                }}
              />
              <OptionButton
                label="CLT/Autônomo"
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, professionalSituation: "clt_autonomo" }));
                  setDisqualifyReason("professional");
                  setStep("disqualified");
                }}
              />
            </div>
          </QuestionBlock>
        </div>
      ) : null}

      {step === "q_income" ? (
        <div className="mt-6 space-y-4">
          <QuestionBlock title="2) Qual sua renda mensal (benefício)?*">
            <div className="grid gap-3">
              <OptionButton
                label="Até R$ 2.000"
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, incomeRange: "ate_2000" }));
                  setDisqualifyReason("income");
                  setStep("disqualified");
                }}
              />
              <OptionButton
                label="R$ 2.001 a R$ 3.000"
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, incomeRange: "2001_3000" }));
                  setDisqualifyReason("income");
                  setStep("disqualified");
                }}
              />
              <OptionButton
                label="R$ 3.001 a R$ 5.000"
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, incomeRange: "3001_5000" }));
                  setStep("q_debt");
                }}
              />
              <OptionButton
                label="Acima de R$ 5.000"
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, incomeRange: "acima_5000" }));
                  setStep("q_debt");
                }}
              />
            </div>
          </QuestionBlock>
          <Button type="button" variant="outline" onClick={goBack} className="w-full h-12 rounded-lg">
            Voltar
          </Button>
        </div>
      ) : null}

      {step === "q_debt" ? (
        <div className="mt-6 space-y-4">
          <QuestionBlock title="3) Quanto você deve aproximadamente em consignados?*">
            <div className="grid gap-3">
              <OptionButton
                label="Até R$ 10.000"
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, debtRange: "ate_10000" }));
                  setDisqualifyReason("debt");
                  setStep("disqualified");
                }}
              />
              <OptionButton
                label="R$ 10.001 a R$ 15.000"
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, debtRange: "10001_15000" }));
                  setDisqualifyReason("debt");
                  setStep("disqualified");
                }}
              />
              <OptionButton
                label="R$ 15.001 a R$ 30.000"
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, debtRange: "15001_30000" }));
                  setStep("q_loans");
                }}
              />
              <OptionButton
                label="Acima de R$ 30.000"
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, debtRange: "acima_30000" }));
                  setStep("q_loans");
                }}
              />
            </div>
          </QuestionBlock>
          <Button type="button" variant="outline" onClick={goBack} className="w-full h-12 rounded-lg">
            Voltar
          </Button>
        </div>
      ) : null}

      {step === "q_loans" ? (
        <div className="mt-6 space-y-4">
          <QuestionBlock title="4) Quantos empréstimos consignados você possui ativos?*">
            <div className="grid gap-3">
              <OptionButton
                label="1 a 2"
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, loansCount: "1_2" }));
                  setDisqualifyReason("loans");
                  setStep("disqualified");
                }}
              />
              <OptionButton
                label="3 a 5"
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, loansCount: "3_5" }));
                  setStep("q_commitment");
                }}
              />
              <OptionButton
                label="6 ou mais"
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, loansCount: "6_mais" }));
                  setStep("q_commitment");
                }}
              />
            </div>
          </QuestionBlock>
          <Button type="button" variant="outline" onClick={goBack} className="w-full h-12 rounded-lg">
            Voltar
          </Button>
        </div>
      ) : null}

      {step === "q_commitment" ? (
        <div className="mt-6 space-y-4">
          <QuestionBlock title="5) Quanto do seu benefício está comprometido com descontos?*">
            <div className="grid gap-3">
              <OptionButton
                label="Até 30%"
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, commitmentRange: "ate_30" }));
                  setStep("form");
                }}
              />
              <OptionButton
                label="35% a 50%"
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, commitmentRange: "35_50" }));
                  setStep("form");
                }}
              />
              <OptionButton
                label="Mais de 50%"
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, commitmentRange: "acima_50" }));
                  setStep("form");
                }}
              />
            </div>
          </QuestionBlock>
          <Button type="button" variant="outline" onClick={goBack} className="w-full h-12 rounded-lg">
            Voltar
          </Button>
        </div>
      ) : null}

      {step === "form" ? (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="rounded-xl border border-green-200 bg-green-50 p-4">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-700" aria-hidden="true" />
              <p className="text-gray-900 font-semibold text-base">Perfil qualificado</p>
            </div>
            <p className="text-gray-700 text-sm text-center mt-2">
              Agora preencha seus dados para receber contato de um especialista.
            </p>
          </div>

          <div className="space-y-3">
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
              isValid={
                focusedField !== LEAD_FIELD_IDS.name && nameValidationError ? false : null
              }
              validationError={
                focusedField !== LEAD_FIELD_IDS.name ? nameValidationError : null
              }
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
              isValid={focusedField !== LEAD_FIELD_IDS.phone ? isValid : null}
              validationError={
                focusedField !== LEAD_FIELD_IDS.phone
                  ? validationError ||
                    (formData.phone.replace(/\D/g, "").length > 0 &&
                    formData.phone.replace(/\D/g, "").length < 11
                      ? "Informe um WhatsApp com 11 dígitos (DDD + número)."
                      : null)
                  : null
              }
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
              isValid={
                focusedField !== LEAD_FIELD_IDS.email && emailValidationError ? false : null
              }
              validationError={
                focusedField !== LEAD_FIELD_IDS.email ? emailValidationError : null
              }
            />
          </div>

          <div className="rounded-xl border border-lavender/40 bg-white p-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="lp04_consent_paid"
                checked={consentAccepted}
                onCheckedChange={(value) => setConsentAccepted(Boolean(value))}
              />
              <Label
                htmlFor="lp04_consent_paid"
                className="text-gray-900 text-sm leading-relaxed cursor-pointer"
              >
                Estou ciente que este é um serviço jurídico especializado com investimento financeiro (não é gratuito) e autorizo o contato via WhatsApp.*
              </Label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button type="button" variant="outline" onClick={goBack} className="h-12 rounded-lg">
              Voltar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitDisabled}
              className="h-12 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:text-gray-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 whitespace-normal text-center leading-snug"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  Enviando…
                </>
              ) : (
                <>
                  Enviar
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 text-gray-600 text-xs">
            <Lock className="w-4 h-4" aria-hidden="true" />
            <span>Seus dados estão seguros • Resposta em até 2 horas úteis</span>
          </div>
        </form>
      ) : null}
    </DialogContent>
  );
};

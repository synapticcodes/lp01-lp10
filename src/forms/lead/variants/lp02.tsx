import React, { useEffect, useMemo, useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowRight, CheckCircle, Loader2, Mail, Phone, User } from "lucide-react";
import { useWhatsappValidation } from "@/hooks/useWhatsappValidation";
import { useAirtableSubmission } from "@/hooks/useAirtableSubmission";
import type { LeadFormVariantProps } from "@/forms/lead/types";
import { LEAD_FIELD_IDS } from "@/forms/lead/fieldIds";
import { formatPhoneNumber } from "@/utils/phoneUtils";

type BenefitAnswer = "aposentadoria" | "pensao" | "nao" | null;
type DirectDiscountAnswer = "sim" | "nao" | "nao_sei" | null;
type ContractsAnswer = "1" | "2-3" | "4+" | "nao_sei" | null;
type DiscountRangeAnswer =
  | "ate_150"
  | "151_350"
  | "351_700"
  | "acima_700"
  | "nao_sei"
  | null;
type PaidAwareAnswer = "sim" | "nao" | null;

type Step =
  | "q_benefit"
  | "q_direct_discount"
  | "q_contracts"
  | "q_discount_range"
  | "q_paid_aware"
  | "exit_not_inss"
  | "exit_paid"
  | "contact"
  | "thankyou";

const formatBenefitLabel = (value: BenefitAnswer) => {
  switch (value) {
    case "aposentadoria":
      return "Aposentadoria";
    case "pensao":
      return "Pensão";
    case "nao":
      return "Não (CLT/MEI/outros)";
    default:
      return "";
  }
};

const formatDirectDiscountLabel = (value: DirectDiscountAnswer) => {
  switch (value) {
    case "sim":
      return "Sim";
    case "nao":
      return "Não";
    case "nao_sei":
      return "Não sei";
    default:
      return "";
  }
};

const formatContractsLabel = (value: ContractsAnswer) => {
  switch (value) {
    case "1":
      return "1";
    case "2-3":
      return "2–3";
    case "4+":
      return "4 ou mais";
    case "nao_sei":
      return "Não sei";
    default:
      return "";
  }
};

const formatDiscountRangeLabel = (value: DiscountRangeAnswer) => {
  switch (value) {
    case "ate_150":
      return "até R$150";
    case "151_350":
      return "R$151–R$350";
    case "351_700":
      return "R$351–R$700";
    case "acima_700":
      return "acima de R$700";
    case "nao_sei":
      return "Não sei";
    default:
      return "";
  }
};

const formatPaidAwareLabel = (value: PaidAwareAnswer) => {
  switch (value) {
    case "sim":
      return "Sim";
    case "nao":
      return "Não";
    default:
      return "";
  }
};

const CloseButton = ({ onClose }: { onClose: () => void }) => (
  <div className="absolute right-4 top-4">
    <button
      type="button"
      onClick={onClose}
      className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors duration-200 group"
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
  </div>
);

const QuestionBlock = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-xl border border-lavender/40 bg-white p-4">
    <p className="text-gray-900 font-semibold text-base mb-3">{title}</p>
    {children}
  </div>
);

const RadioItem = ({ id, value, label }: { id: string; value: string; label: string }) => (
  <div className="flex items-center space-x-3">
    <RadioGroupItem value={value} id={id} />
    <Label htmlFor={id} className="text-gray-900 text-base cursor-pointer">
      {label}
    </Label>
  </div>
);

export const Lp02LeadFormDialogContent = ({ isOpen, onClose }: LeadFormVariantProps) => {
  const [step, setStep] = useState<Step>("q_benefit");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const [benefit, setBenefit] = useState<BenefitAnswer>(null);
  const [directDiscount, setDirectDiscount] = useState<DirectDiscountAnswer>(null);
  const [contracts, setContracts] = useState<ContractsAnswer>(null);
  const [discountRange, setDiscountRange] = useState<DiscountRangeAnswer>(null);
  const [paidAware, setPaidAware] = useState<PaidAwareAnswer>(null);

  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [lgpdAccepted, setLgpdAccepted] = useState(false);

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
    setStep(hasSubmitted ? "thankyou" : "q_benefit");

    setBenefit(null);
    setDirectDiscount(null);
    setContracts(null);
    setDiscountRange(null);
    setPaidAware(null);
    setFormData({ name: "", email: "", phone: "" });
    setLgpdAccepted(false);
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

  const canContinueCurrentStep = useMemo(() => {
    switch (step) {
      case "q_benefit":
        return Boolean(benefit);
      case "q_direct_discount":
        return Boolean(directDiscount) && directDiscount !== "nao";
      case "q_contracts":
        return Boolean(contracts) && contracts !== "1";
      case "q_discount_range":
        return Boolean(discountRange) && discountRange !== "ate_150" && discountRange !== "151_350";
      case "q_paid_aware":
        return Boolean(paidAware);
      default:
        return false;
    }
  }, [step, benefit, directDiscount, contracts, discountRange, paidAware]);

  const goBackFromQuestion = () => {
    switch (step) {
      case "q_direct_discount":
        setStep("q_benefit");
        break;
      case "q_contracts":
        setStep("q_direct_discount");
        break;
      case "q_discount_range":
        setStep("q_contracts");
        break;
      case "q_paid_aware":
        setStep("q_discount_range");
        break;
      default:
        break;
    }
  };

  const handleContinueFromQuestion = () => {
    if (!canContinueCurrentStep) return;

    switch (step) {
      case "q_benefit":
        if (benefit === "nao") {
          setStep("exit_not_inss");
          return;
        }
        setStep("q_direct_discount");
        return;
      case "q_direct_discount":
        setStep("q_contracts");
        return;
      case "q_contracts":
        setStep("q_discount_range");
        return;
      case "q_discount_range":
        setStep("q_paid_aware");
        return;
      case "q_paid_aware":
        if (paidAware === "nao") {
          setStep("exit_paid");
          return;
        }
        setStep("contact");
        return;
      default:
        return;
    }
  };

  const buildDiscountReason = () => {
    const parts = [
      benefit ? `Benefício: ${formatBenefitLabel(benefit)}` : null,
      directDiscount ? `Desconto no benefício: ${formatDirectDiscountLabel(directDiscount)}` : null,
      contracts ? `Contratos: ${formatContractsLabel(contracts)}` : null,
      discountRange ? `Desconto mensal: ${formatDiscountRangeLabel(discountRange)}` : null,
      paidAware ? `Ciente (serviço jurídico remunerado): ${formatPaidAwareLabel(paidAware)}` : null,
    ].filter(Boolean);
    return parts.join(" | ") || undefined;
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
      !lgpdAccepted ||
      isSubmitting ||
      isFormSubmitted ||
      isValidating ||
      isValid === false
    );
  }, [
    formData,
    lgpdAccepted,
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
    if (isValid === false) return;
    if (isSubmitDisabled) return;

    const success = await submitLead({
      name: formData.name,
      phone: formData.phone,
      email: formData.email.trim(),
      isInssRetireeOrPensioner: benefit === "aposentadoria" || benefit === "pensao",
      discountReason: buildDiscountReason(),
    });

    if (success) {
      localStorage.setItem("leadSubmitted", "true");
      setIsFormSubmitted(true);
      setStep("thankyou");
      setFormData({ name: "", email: "", phone: "" });
      setLgpdAccepted(false);
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

  if (step === "exit_not_inss") {
    return (
      <DialogContent className="sm:max-w-md rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] border-0 [&>button]:hidden">
        <CloseButton onClose={onClose} />
        <DialogHeader className="text-center">
          <DialogTitle className="text-purple-brand text-2xl font-bold tracking-tight leading-tight mb-2">
            Triagem do consignado INSS
          </DialogTitle>
        </DialogHeader>
        <div className="pt-2">
          <p className="text-gray-800 text-base text-center">
            No momento, atuamos apenas em casos de consignado com desconto no benefício do INSS.
          </p>
          <Button
            type="button"
            onClick={() => setStep("q_benefit")}
            className="w-full h-12 mt-6 bg-purple-brand hover:bg-lavender-800 text-white font-semibold rounded-lg"
          >
            Voltar
          </Button>
        </div>
      </DialogContent>
    );
  }

  if (step === "exit_paid") {
    return (
      <DialogContent className="sm:max-w-md rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] border-0 [&>button]:hidden">
        <CloseButton onClose={onClose} />
        <DialogHeader className="text-center">
          <DialogTitle className="text-purple-brand text-2xl font-bold tracking-tight leading-tight mb-2">
            Obrigado!
          </DialogTitle>
        </DialogHeader>
        <div className="pt-2">
          <p className="text-gray-800 text-base text-center">
            Este atendimento é um serviço jurídico remunerado, realizado mediante contrato. Se fizer sentido para você, volte quando quiser e refaça a triagem.
          </p>
          <Button
            type="button"
            onClick={onClose}
            className="w-full h-12 mt-6 bg-purple-brand hover:bg-lavender-800 text-white font-semibold rounded-lg"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="sm:max-w-md rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] border-0 [&>button]:hidden">
      <CloseButton onClose={onClose} />

      {step !== "contact" ? (
        <div key="triage">
          <DialogHeader className="text-center">
            <DialogTitle className="text-purple-brand text-2xl font-bold tracking-tight leading-tight mb-2">
              Triagem do consignado INSS
            </DialogTitle>
            <p className="text-gray-600 text-base font-medium">
              Responda em 2 minutos para verificarmos se o caso se encaixa.
            </p>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            {step === "q_benefit" ? (
              <QuestionBlock title="Você recebe benefício do INSS?">
                <RadioGroup
                  value={benefit ?? undefined}
                  onValueChange={(v) => setBenefit(v as BenefitAnswer)}
                >
                  <RadioItem id="benefit-aposentadoria" value="aposentadoria" label="Aposentadoria" />
                  <RadioItem id="benefit-pensao" value="pensao" label="Pensão" />
                  <RadioItem id="benefit-nao" value="nao" label="Não (CLT/MEI/outros)" />
                </RadioGroup>
              </QuestionBlock>
            ) : null}

            {step === "q_direct_discount" ? (
              <QuestionBlock title="O empréstimo consignado é descontado diretamente do seu benefício?">
                <RadioGroup
                  value={directDiscount ?? undefined}
                  onValueChange={(v) => setDirectDiscount(v as DirectDiscountAnswer)}
                >
                  <RadioItem id="direct-sim" value="sim" label="Sim" />
                  <RadioItem id="direct-nao" value="nao" label="Não" />
                  <RadioItem id="direct-nao-sei" value="nao_sei" label="Não sei" />
                </RadioGroup>
                {directDiscount === "nao" ? (
                  <p className="mt-3 text-sm text-gray-700">
                    No momento, a triagem é para casos em que o desconto ocorre no benefício do INSS.
                    Se você não tiver certeza, selecione “Não sei”.
                  </p>
                ) : null}
              </QuestionBlock>
            ) : null}

            {step === "q_contracts" ? (
              <QuestionBlock title="Quantos contratos de consignado você tem hoje?">
                <RadioGroup
                  value={contracts ?? undefined}
                  onValueChange={(v) => setContracts(v as ContractsAnswer)}
                >
                  <RadioItem id="contracts-1" value="1" label="1" />
                  <RadioItem id="contracts-2-3" value="2-3" label="2–3" />
                  <RadioItem id="contracts-4" value="4+" label="4 ou mais" />
                  <RadioItem id="contracts-nao-sei" value="nao_sei" label="Não sei" />
                </RadioGroup>
                {contracts === "1" ? (
                  <p className="mt-3 text-sm text-gray-700">
                    Para esta triagem, priorizamos casos com múltiplos contratos. Se você tiver apenas 1,
                    você pode ler as informações da página e voltar quando fizer sentido.
                  </p>
                ) : null}
              </QuestionBlock>
            ) : null}

            {step === "q_discount_range" ? (
              <QuestionBlock title="Qual é o desconto total mensal aproximado no benefício?">
                <RadioGroup
                  value={discountRange ?? undefined}
                  onValueChange={(v) => setDiscountRange(v as DiscountRangeAnswer)}
                >
                  <RadioItem id="range-ate-150" value="ate_150" label="até R$150" />
                  <RadioItem id="range-151-350" value="151_350" label="R$151–R$350" />
                  <RadioItem id="range-351-700" value="351_700" label="R$351–R$700" />
                  <RadioItem id="range-acima-700" value="acima_700" label="acima de R$700" />
                  <RadioItem id="range-nao-sei" value="nao_sei" label="Não sei" />
                </RadioGroup>
                {discountRange === "ate_150" || discountRange === "151_350" ? (
                  <p className="mt-3 text-sm text-gray-700">
                    Para esta triagem, priorizamos casos com descontos mensais mais elevados. Se o seu
                    desconto for menor, você pode ler as informações da página e voltar quando fizer sentido.
                  </p>
                ) : null}
              </QuestionBlock>
            ) : null}

            {step === "q_paid_aware" ? (
              <QuestionBlock title="Você entende que se trata de serviço jurídico remunerado e que a viabilidade depende de análise?">
                <RadioGroup
                  value={paidAware ?? undefined}
                  onValueChange={(v) => {
                    const next = v as PaidAwareAnswer;
                    setPaidAware(next);
                    if (next === "nao") {
                      setStep("exit_paid");
                    }
                  }}
                >
                  <RadioItem id="paid-sim" value="sim" label="Sim" />
                  <RadioItem id="paid-nao" value="nao" label="Não" />
                </RadioGroup>
              </QuestionBlock>
            ) : null}

            <Button
              type="button"
              onClick={handleContinueFromQuestion}
              className="w-full h-12 bg-purple-brand hover:bg-lavender-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              disabled={!canContinueCurrentStep}
            >
              Continuar
              <ArrowRight className="w-4 h-4 text-yellow-vibrant" />
            </Button>

            {step !== "q_benefit" ? (
              <Button type="button" variant="outline" className="w-full h-11" onClick={goBackFromQuestion}>
                Voltar
              </Button>
            ) : null}
          </div>
        </div>
      ) : (
        <div key="contact">
          <DialogHeader className="text-center">
            <DialogTitle className="text-purple-brand text-2xl font-bold tracking-tight leading-tight mb-2">
              Dados para retorno
            </DialogTitle>
            <p className="text-gray-600 text-base font-medium">
              Preencha para retornarmos pelo WhatsApp.
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor={LEAD_FIELD_IDS.name} className="text-gray-900 font-semibold text-sm">
                Seu nome completo
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id={LEAD_FIELD_IDS.name}
                  type="text"
                  className="pl-10"
                  placeholder="Ex.: Maria Aparecida"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  disabled={isSubmitting || isFormSubmitted}
                  autoComplete="name"
                  required
                />
              </div>
              {nameValidationError ? (
                <p className="text-xs text-red-500 font-medium">{nameValidationError}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor={LEAD_FIELD_IDS.phone} className="text-gray-900 font-semibold text-sm">
                WhatsApp
              </Label>
              <div className="relative">
                {isValidating ? (
                  <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
                ) : isValid === true ? (
                  <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                ) : (
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                )}
                <Input
                  id={LEAD_FIELD_IDS.phone}
                  type="tel"
                  className="pl-10"
                  placeholder="(11) 99999-9999"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  disabled={isSubmitting || isFormSubmitted || isValidating}
                  inputMode="tel"
                  autoComplete="tel"
                  required
                />
              </div>
              {validationError ? (
                <p className="text-xs text-red-500 font-medium">{validationError}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor={LEAD_FIELD_IDS.email} className="text-gray-900 font-semibold text-sm">
                E-mail
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id={LEAD_FIELD_IDS.email}
                  type="email"
                  className="pl-10"
                  placeholder="Ex.: maria@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={isSubmitting || isFormSubmitted}
                  inputMode="email"
                  autoComplete="email"
                  required
                />
              </div>
              {emailValidationError ? (
                <p className="text-xs text-red-500 font-medium">{emailValidationError}</p>
              ) : null}
            </div>

            <div className="rounded-xl border border-lavender/40 bg-white p-4">
              <div className="flex items-start gap-3">
                <Checkbox id="lgpd" checked={lgpdAccepted} onCheckedChange={(checked) => setLgpdAccepted(Boolean(checked))} />
                <Label htmlFor="lgpd" className="text-gray-800 text-sm leading-relaxed cursor-pointer">
                  Li e concordo com a Política de Privacidade e autorizo contato pelo WhatsApp.
                </Label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-purple-brand hover:bg-lavender-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              disabled={isSubmitDisabled}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  ✅ Enviar triagem
                  <ArrowRight className="w-4 h-4 text-yellow-vibrant" />
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full h-11"
              onClick={() => setStep("q_paid_aware")}
              disabled={isSubmitting}
            >
              Voltar
            </Button>
          </form>
        </div>
      )}
    </DialogContent>
  );
};

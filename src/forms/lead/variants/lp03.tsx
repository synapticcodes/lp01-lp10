import { useEffect, useMemo, useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, MessageCircle, XCircle } from "lucide-react";
import type { LeadFormVariantProps } from "@/forms/lead/types";

type Step = "q1" | "q2" | "q3" | "disqualified" | "approved";

type DisqualifyReason = "income_origin" | "problem_type" | "income_low";

const WHATSAPP_MESSAGE =
  "Olá, sou servidor/aposentado e gostaria da análise de margem.";

const buildWhatsappUrl = (rawPhone: string, message: string) => {
  const phone = rawPhone.replace(/\D/g, "");
  if (!phone) return null;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};

export const Lp03LeadFormDialogContent = ({ isOpen, onClose }: LeadFormVariantProps) => {
  const [step, setStep] = useState<Step>("q1");
  const [disqualifyReason, setDisqualifyReason] = useState<DisqualifyReason | null>(null);

  const whatsappNumber = useMemo(() => {
    return (import.meta.env.VITE_WHATSAPP_CONTACT_NUMBER as string | undefined) ?? "";
  }, []);

  const whatsappUrl = useMemo(() => {
    return buildWhatsappUrl(whatsappNumber, WHATSAPP_MESSAGE);
  }, [whatsappNumber]);

  useEffect(() => {
    if (!isOpen) return;
    setStep("q1");
    setDisqualifyReason(null);
  }, [isOpen]);

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

  const handleWhatsappClick = () => {
    if (!whatsappUrl) return;
    localStorage.setItem("leadSubmitted", "true");
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    onClose();
  };

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
      ) : step === "approved" ? (
        <div className="text-center py-2">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-14 h-14 text-green-600" aria-hidden="true" />
          </div>

          <DialogHeader className="text-center">
            <DialogTitle className="text-purple-brand text-2xl font-bold tracking-tight leading-tight mb-2">
              Perfil Aprovado para Análise.
            </DialogTitle>
            <p className="text-gray-600 text-base font-medium">
              Temos uma vaga na agenda de um especialista para analisar seu caso agora.
            </p>
          </DialogHeader>

          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-left">
            <p className="text-gray-900 font-semibold">Mensagem sugerida:</p>
            <p className="text-gray-700 text-sm mt-1">{WHATSAPP_MESSAGE}</p>
          </div>

          <Button
            onClick={handleWhatsappClick}
            disabled={!whatsappUrl}
            className={`w-full h-12 mt-6 font-semibold rounded-lg flex items-center justify-center gap-2 ${
              whatsappUrl
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            ENVIAR MENSAGEM NO WHATSAPP
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Button>

          {!whatsappUrl ? (
            <p className="text-gray-600 text-xs mt-3">
              Configuração necessária: defina <span className="font-mono">VITE_WHATSAPP_CONTACT_NUMBER</span> no
              ambiente (ex.: <span className="font-mono">5511999999999</span>).
            </p>
          ) : null}
        </div>
      ) : (
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
                <p className="text-gray-900 font-bold text-lg mb-3">
                  1) Qual a origem da sua renda?
                </p>
                <div className="grid gap-3">
                  <button
                    type="button"
                    onClick={() => {
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
                <p className="text-gray-900 font-bold text-lg mb-3">
                  2) Qual o seu principal problema hoje?
                </p>
                <div className="grid gap-3">
                  <button
                    type="button"
                    onClick={() => {
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
                <p className="text-gray-900 font-bold text-lg mb-3">
                  3) Qual sua renda mensal aproximada?
                </p>
                <div className="grid gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setDisqualifyReason("income_low");
                      setStep("disqualified");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    Até R$ 2.000,00
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDisqualifyReason(null);
                      setStep("approved");
                    }}
                    className="h-12 rounded-lg border font-semibold text-base transition-colors bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  >
                    Acima de R$ 3.000,00
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

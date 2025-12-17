
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GuaranteeStamp } from "@/components/ui/GuaranteeStamp";
import { LeadFormDialog } from "@/components/ui/LeadFormDialog";
import { useState } from "react";
import type { FinalCtaCopy } from "@/content/lpVariants";

interface FinalCTASectionProps {
  copy?: FinalCtaCopy;
}

export const FinalCTASection = ({ copy }: FinalCTASectionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const resolvedCopy: FinalCtaCopy = copy ?? {
    title: "Pronto para recuperar seu benefício?",
    body: "Não deixe mais um mês passar perdendo dinheiro com descontos abusivos. Sua análise gratuita está a um clique de distância.",
    ctaLabel: "Quero minha análise gratuita",
    showGuaranteeStamp: true,
  };

  const handleFinalCTA = () => {
    console.log("Final CTA clicked - Opening lead form");
    setIsDialogOpen(true);
  };

  return (
    <section className="py-12 lg:py-20 px-4 bg-lavender-100">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-purple-brand font-bold text-2xl lg:text-4xl xl:text-5xl mb-6 lg:mb-8">
          {resolvedCopy.title}
        </h2>
        
        <p className="text-gray-800 text-base lg:text-subhead mb-8 lg:mb-12 max-w-2xl mx-auto">
          {resolvedCopy.body}
        </p>
        
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 mb-6 lg:mb-8">
          <Button 
            onClick={handleFinalCTA}
            className="w-full sm:w-auto min-h-12 h-auto py-3 bg-purple-brand hover:bg-lavender-800 text-white font-bold px-6 text-base rounded-lg shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-3 whitespace-normal text-center leading-snug"
          >
            {resolvedCopy.ctaLabel}
            <ArrowRight className="w-4 h-4 text-yellow-vibrant" />
          </Button>
          
          {resolvedCopy.showGuaranteeStamp === false ? null : (
            <div className="flex justify-center">
              <GuaranteeStamp />
            </div>
          )}
        </div>
        
        {resolvedCopy.microcopy ? (
          <p className="text-gray-700 text-sm lg:text-body-sm max-w-2xl mx-auto">
            {resolvedCopy.microcopy}
          </p>
        ) : (
          <p className="text-gray-600 text-sm lg:text-body-sm">
            ⚡ Atendimento imediato • 🔒 Dados 100% seguros • ✅ Sem compromisso
          </p>
        )}

        {resolvedCopy.footerIdentificationLines?.length || resolvedCopy.footerDisclaimer ? (
          <footer className="mt-10 text-left rounded-2xl border border-lavender/40 bg-white/70 backdrop-blur-sm p-5 lg:p-6">
            {resolvedCopy.footerIdentificationLines?.length ? (
              <div className="space-y-1 text-gray-900 text-sm lg:text-base">
                {resolvedCopy.footerIdentificationLines.map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            ) : null}
            {resolvedCopy.footerDisclaimer ? (
              <p className="text-gray-700 text-xs lg:text-sm mt-4">
                {resolvedCopy.footerDisclaimer}
              </p>
            ) : null}

            {resolvedCopy.privacyPolicyTitle ? (
              <div className="mt-5 border-t border-lavender/30 pt-5">
                <h3
                  id="politica-de-privacidade"
                  className="text-gray-900 font-bold text-base lg:text-lg"
                >
                  {resolvedCopy.privacyPolicyTitle}
                </h3>
                {resolvedCopy.privacyPolicyBody ? (
                  <p className="text-gray-700 text-xs lg:text-sm mt-2">
                    {resolvedCopy.privacyPolicyBody}
                  </p>
                ) : null}
              </div>
            ) : null}
          </footer>
        ) : null}
      </div>

      <LeadFormDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
      />
    </section>
  );
};

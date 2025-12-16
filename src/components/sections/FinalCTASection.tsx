
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GuaranteeStamp } from "@/components/ui/GuaranteeStamp";
import { LeadFormDialog } from "@/components/ui/LeadFormDialog";
import { useState } from "react";

type FinalCtaCopy = {
  title: string;
  body: string;
  ctaLabel: string;
};

interface FinalCTASectionProps {
  copy?: FinalCtaCopy;
}

export const FinalCTASection = ({ copy }: FinalCTASectionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const resolvedCopy: FinalCtaCopy = copy ?? {
    title: "Pronto para recuperar seu benefício?",
    body: "Não deixe mais um mês passar perdendo dinheiro com descontos abusivos. Sua análise gratuita está a um clique de distância.",
    ctaLabel: "Quero minha análise gratuita",
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
            className="w-full sm:w-auto h-12 bg-purple-brand hover:bg-lavender-800 text-white font-bold px-6 text-base rounded-lg shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-3"
          >
            {resolvedCopy.ctaLabel}
            <ArrowRight className="w-4 h-4 text-yellow-vibrant" />
          </Button>
          
          <div className="flex justify-center">
            <GuaranteeStamp />
          </div>
        </div>
        
        <p className="text-gray-600 text-sm lg:text-body-sm">
          ⚡ Atendimento imediato • 🔒 Dados 100% seguros • ✅ Sem compromisso
        </p>
      </div>

      <LeadFormDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
      />
    </section>
  );
};


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { GuaranteeStamp } from "@/components/ui/GuaranteeStamp";
import { LeadFormDialog } from "@/components/ui/LeadFormDialog";

export const BackRedirectHero = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCTAClick = () => {
    console.log("CTA clicked - Opening lead form");
    setIsDialogOpen(true);
  };

  return (
    <section className="pt-4 pb-6 px-3 md:pt-8 md:pb-12 md:px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-4 md:gap-8 items-center">
          {/* Content */}
          <div className="space-y-3 md:space-y-6 animate-fade-in">
            {/* Eyebrow */}
            <p className="text-blue-vibrant font-bold text-sm md:text-lg text-center lg:text-left">
              Aposentado ou pensionista do INSS?
            </p>

            {/* Headline */}
            <h1 className="text-purple-brand font-bold text-xl md:text-3xl lg:text-4xl xl:text-5xl leading-tight text-center lg:text-left">
              Recupere até 80% do seu benefício consumido por descontos ilegais
            </h1>

            {/* Sub-headline */}
            <p className="text-gray-800 text-sm md:text-lg leading-relaxed text-center lg:text-left">
              Confirme seu caso e receba uma análise gratuita — sem custo, sem compromisso. Tudo 100% digital.
            </p>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 w-full lg:max-w-md">
              <Button 
                onClick={handleCTAClick}
                className="bg-blue-vibrant hover:bg-blue-vibrant/90 text-white font-semibold px-4 md:px-6 py-3 rounded-lg w-full sm:flex-1 text-base"
              >
                Quero minha análise gratuita
              </Button>
              <div className="flex-shrink-0">
                <GuaranteeStamp />
              </div>
            </div>

            {/* Booster */}
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <Lock className="w-3 h-3 md:w-4 md:h-4 text-yellow-vibrant" />
              <span className="text-gray-600 text-xs md:text-sm">
                Dados 100% protegidos · Resposta imediata
              </span>
            </div>
          </div>

          {/* Image */}
          <div className="relative animate-fade-in mt-4 lg:mt-0">
            <div className="bg-gradient-to-br from-lavender/20 to-lavender/5 rounded-2xl p-3 md:p-6 shadow-2xl">
              <img 
                src="/lovable-uploads/afc5aa38-3e7b-4f13-acf0-3fbcb8ea77cb.png"
                alt="Aposentado sorrindo, segurando relógio mostrando 7 dias sem descontos abusivos"
                className="w-full h-48 md:h-80 lg:h-96 object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>

      <LeadFormDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
      />
    </section>
  );
};


import { ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GuaranteeStamp } from "@/components/ui/GuaranteeStamp";
import { TrustBar } from "@/components/ui/TrustBar";
import { LeadFormDialog } from "@/components/ui/LeadFormDialog";
import { useState } from "react";

type HeroCopy = {
  badge: string;
  eyebrow: string;
  headline: string;
  subheadline: string;
  ctaLabel: string;
};

interface HeroSectionProps {
  copy?: HeroCopy;
}

export const HeroSection = ({ copy }: HeroSectionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const resolvedCopy: HeroCopy = copy ?? {
    badge: "EXCLUSIVO PARA APOSENTADOS E PENSIONISTAS DO INSS",
    eyebrow: "Aposentado do INSS com descontos no benefício?",
    headline: "Recupere até 80% do seu benefício consumido por descontos ilegais.",
    subheadline:
      "Especialistas em direito previdenciário: ajudamos apenas aposentados e pensionistas do INSS a eliminar descontos ilegais, limpar o nome e recuperar a tranquilidade financeira sem risco — tudo 100% digital.",
    ctaLabel: "Quero minha análise gratuita",
  };

  const handleCTAClick = () => {
    console.log("CTA clicked - Opening lead form");
    setIsDialogOpen(true);
  };

  return (
    <section className="pt-8 lg:pt-16 pb-8 lg:pb-12 px-4 bg-gradient-to-b from-lavender-50 to-white">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="space-y-6 animate-fade-in order-2 lg:order-1">
            <div className="flex justify-center lg:justify-start">
              <span className="inline-flex items-center rounded-full bg-blue-vibrant/10 px-4 py-2 text-blue-vibrant font-semibold text-sm lg:text-base">
                {resolvedCopy.badge}
              </span>
            </div>

            {/* Eyebrow */}
            <p className="text-gray-800 font-medium text-base lg:text-lg text-center lg:text-left">
              {resolvedCopy.eyebrow}
            </p>

            {/* Headline */}
            <h1 className="text-purple-brand font-bold text-2xl sm:text-3xl lg:text-4xl xl:text-5xl leading-tight text-center lg:text-left">
              {resolvedCopy.headline}
            </h1>

            {/* Sub-headline */}
            <p className="text-gray-800 text-base lg:text-lg leading-relaxed text-center lg:text-left max-w-lg lg:max-w-none mx-auto lg:mx-0">
              {resolvedCopy.subheadline}
            </p>

            {/* CTA Section */}
            <div className="space-y-4 pt-2">
              <div className="flex justify-center lg:justify-start">
                <Button 
                  onClick={handleCTAClick}
                  className="w-full sm:w-auto h-12 bg-purple-brand hover:bg-lavender-800 text-white font-semibold px-6 text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 max-w-xs"
                >
                  {resolvedCopy.ctaLabel}
                  <ArrowRight className="w-4 h-4 text-yellow-vibrant" />
                </Button>
              </div>
              
              <div className="flex justify-center lg:justify-start">
                <GuaranteeStamp />
              </div>
            </div>

            {/* Booster */}
            <p className="text-gray-600 text-base flex items-center justify-center lg:justify-start gap-2 pt-2">
              <Heart className="w-4 h-4 text-yellow-vibrant fill-current" />
              Sem custo agora. Seus dados ficam 100% seguros.
            </p>
          </div>

          {/* Image */}
          <div className="relative animate-fade-in order-1 lg:order-2">
            <div className="bg-gradient-to-br from-lavender/20 to-lavender/5 rounded-2xl p-4 lg:p-6 shadow-2xl max-w-md mx-auto lg:max-w-none">
              <img 
                src="/lovable-uploads/afc5aa38-3e7b-4f13-acf0-3fbcb8ea77cb.png"
                alt="Aposentado do INSS sorrindo - ajuda previdenciária simples e transparente"
                className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Trust Bar */}
        <div className="mt-12 lg:mt-16">
          <TrustBar />
        </div>
      </div>

      <LeadFormDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
      />
    </section>
  );
};

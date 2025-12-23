
import { ArrowRight, CheckCircle, Heart, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GuaranteeStamp } from "@/components/ui/GuaranteeStamp";
import { TrustBar } from "@/components/ui/TrustBar";
import { LeadFormDialog } from "@/components/ui/LeadFormDialog";
import { useState } from "react";
import type { HeroCopy } from "@/content/lpVariants";

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
    showTrustBar: true,
    showGuaranteeStamp: true,
    boosterText: "Sem custo agora. Seus dados ficam 100% seguros.",
  };

  const hasBadge = Boolean(resolvedCopy.badge?.trim());

  const handleCTAClick = () => {
    console.log("CTA clicked - Opening lead form");
    setIsDialogOpen(true);
  };

  return (
    <section className="pt-0 pb-8 lg:pb-12 px-4 bg-gradient-to-b from-lavender-50 to-white">
      {resolvedCopy.topBarText ? (
        <div className="mx-[-1rem] mb-6 border-b border-lavender/20 bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto max-w-7xl px-4 py-2 text-center">
            <p className="text-gray-900 text-sm font-medium">{resolvedCopy.topBarText}</p>
            {resolvedCopy.topBarMicrotext ? (
              <p className="text-gray-600 text-xs mt-0.5">{resolvedCopy.topBarMicrotext}</p>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="pt-8 lg:pt-16">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="space-y-6 animate-fade-in order-2 lg:order-1">
            {hasBadge ? (
              <div className="flex justify-center lg:justify-start">
                <span className="inline-flex items-center rounded-full bg-blue-vibrant/10 px-4 py-2 text-blue-vibrant font-semibold text-sm lg:text-base">
                  {resolvedCopy.badge}
                </span>
              </div>
            ) : null}

            {/* Eyebrow */}
            {resolvedCopy.eyebrow ? (
              <p className="text-gray-800 font-medium text-base lg:text-lg text-center lg:text-left">
                {resolvedCopy.eyebrow}
              </p>
            ) : null}

            {/* Headline */}
            <h1 className="text-purple-brand font-bold text-2xl sm:text-3xl lg:text-4xl xl:text-5xl leading-tight text-center lg:text-left">
              {resolvedCopy.headline}
            </h1>

            {/* Sub-headline */}
            <p className="text-gray-800 text-base lg:text-lg leading-relaxed text-center lg:text-left max-w-lg lg:max-w-none mx-auto lg:mx-0">
              {resolvedCopy.subheadline}
            </p>

            {resolvedCopy.bullets?.length ? (
              <div className="max-w-lg lg:max-w-none mx-auto lg:mx-0">
                <ul className="space-y-3 text-left">
                  {resolvedCopy.bullets.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-vibrant flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span className="text-gray-900 text-base lg:text-lg leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* CTA Section */}
            <div className="space-y-4 pt-2">
              <div className="flex justify-center lg:justify-start">
                <Button 
                  onClick={handleCTAClick}
                  className="w-full sm:w-auto min-h-12 h-auto py-3 bg-purple-brand hover:bg-lavender-800 text-white font-semibold px-6 text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 whitespace-normal text-center leading-snug"
                >
                  {resolvedCopy.ctaLabel}
                  <ArrowRight className="w-4 h-4 text-yellow-vibrant" />
                </Button>
              </div>
              
              {resolvedCopy.ctaMicrocopy ? (
                <p className="text-gray-600 text-xs lg:text-sm text-center lg:text-left max-w-lg lg:max-w-none mx-auto lg:mx-0">
                  {resolvedCopy.ctaMicrocopy}
                </p>
              ) : null}

              {resolvedCopy.showGuaranteeStamp === false ? null : (
                <div className="flex justify-center lg:justify-start">
                  <GuaranteeStamp />
                </div>
              )}
            </div>

            {/* Booster */}
            {resolvedCopy.boosterText ? (
              <p className="text-gray-600 text-base flex items-center justify-center lg:justify-start gap-2 pt-2">
                <Heart className="w-4 h-4 text-yellow-vibrant fill-current" />
                {resolvedCopy.boosterText}
              </p>
            ) : null}

            {resolvedCopy.eligibilityNotice ? (
              <div className="rounded-xl border border-lavender bg-white/70 px-4 py-3 text-left">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-blue-vibrant flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-gray-800 text-sm lg:text-base">{resolvedCopy.eligibilityNotice}</p>
                </div>
              </div>
            ) : null}
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
        {resolvedCopy.showTrustBar === false ? (
          resolvedCopy.trustBlockTitle && resolvedCopy.trustBlockItems?.length ? (
            <div className="mt-10 lg:mt-14 rounded-2xl border border-lavender bg-white/80 backdrop-blur-sm p-5 lg:p-6">
              <h3 className="text-purple-brand font-bold text-lg lg:text-xl text-center mb-4">
                {resolvedCopy.trustBlockTitle}
              </h3>
              <div className="grid gap-3 lg:gap-4">
                {resolvedCopy.trustBlockItems.map((text, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-vibrant flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="text-gray-800 text-sm lg:text-base leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null
        ) : (
          <div className="mt-12 lg:mt-16">
            <TrustBar />
          </div>
        )}
      </div>
      </div>

      <LeadFormDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
      />
    </section>
  );
};

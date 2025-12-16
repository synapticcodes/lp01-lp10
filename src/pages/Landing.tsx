import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { SolutionSection } from "@/components/sections/SolutionSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";
import { StickyFooterCTA } from "@/components/ui/StickyFooterCTA";
import { useBackButtonRedirect } from "@/hooks/useBackButtonRedirect";
import { getLandingVariant } from "@/content/lpVariants";
import { useMemo } from "react";

type LandingProps = {
  variantKeyOverride?: string;
};

const Landing = ({ variantKeyOverride }: LandingProps) => {
  const variantKey = useMemo(() => {
    return variantKeyOverride ?? "lp01";
  }, [variantKeyOverride]);

  const copy = getLandingVariant(variantKey);

  useBackButtonRedirect();

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header />
      <main className="pb-20 md:pb-0">
        <HeroSection copy={copy.hero} />
        <ProblemSection copy={copy.problem} />
        <SolutionSection copy={copy.solution} />
        <TestimonialsSection copy={copy.testimonials} />
        <ProcessSection copy={copy.process} />
        <FAQSection copy={copy.faq} />
        <FinalCTASection copy={copy.finalCta} />
      </main>
      <StickyFooterCTA ctaLabel={copy.hero.ctaLabel} />
    </div>
  );
};

export default Landing;

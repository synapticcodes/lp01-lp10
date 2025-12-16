import { HeroSection } from "@/components/sections/HeroSection";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { SolutionSection } from "@/components/sections/SolutionSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";
import { Header } from "@/components/layout/Header";
import { StickyFooterCTA } from "@/components/ui/StickyFooterCTA";
import { useBackButtonRedirect } from "@/hooks/useBackButtonRedirect";

const Index = () => {
  // Add the back button redirect hook
  useBackButtonRedirect();

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header />
      <main className="pb-20 md:pb-0"> {/* Padding bottom para sticky CTA */}
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <TestimonialsSection />
        <ProcessSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <StickyFooterCTA />
    </div>
  );
};

export default Index;

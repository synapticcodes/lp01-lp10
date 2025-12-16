
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadFormDialog } from "@/components/ui/LeadFormDialog";
import { useState, useEffect } from "react";

interface StickyFooterCTAProps {
  ctaLabel?: string;
}

export const StickyFooterCTA = ({ ctaLabel }: StickyFooterCTAProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      setIsVisible(scrollPercentage > 30);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCTAClick = () => {
    console.log("Sticky CTA clicked - Opening lead form");
    setIsDialogOpen(true);
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-lavender/20 p-4 shadow-lg md:hidden">
        <Button 
          onClick={handleCTAClick}
          className="w-full h-12 bg-purple-brand hover:bg-lavender-800 text-white font-semibold text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
        >
          {ctaLabel ?? "Quero minha análise gratuita"}
          <ArrowRight className="w-4 h-4 text-yellow-vibrant" />
        </Button>
      </div>

      <LeadFormDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
      />
    </>
  );
};

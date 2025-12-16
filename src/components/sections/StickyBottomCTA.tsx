
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { LeadFormDialog } from "@/components/ui/LeadFormDialog";

export const StickyBottomCTA = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCTAClick = () => {
    console.log("Sticky CTA clicked - Opening lead form");
    setIsDialogOpen(true);
  };

  return (
    <>
      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-blue-vibrant p-3 md:p-4 shadow-lg z-50">
        <div className="container mx-auto flex items-center justify-center">
          <Button 
            onClick={handleCTAClick}
            className="bg-white text-blue-vibrant hover:bg-gray-100 font-semibold px-4 md:px-6 py-2.5 md:py-3 rounded-lg flex items-center gap-2 text-sm md:text-base"
          >
            <Phone className="w-3 h-3 md:w-4 md:h-4" />
            Garantir Diagnóstico em 5 min
          </Button>
        </div>
      </div>

      {/* Bottom padding to account for sticky CTA */}
      <div className="h-16 md:h-20"></div>

      <LeadFormDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
      />
    </>
  );
};

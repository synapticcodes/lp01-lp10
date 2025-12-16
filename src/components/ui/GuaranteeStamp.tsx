
import { Check } from "lucide-react";

export const GuaranteeStamp = () => {
  return (
    <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm border-2 border-blue-vibrant/20 rounded-lg px-4 py-2 shadow-md">
      <div className="w-8 h-8 bg-gradient-to-br from-lavender to-blue-vibrant/20 rounded-full flex items-center justify-center">
        <Check className="w-4 h-4 text-blue-vibrant" />
      </div>
      <span className="text-blue-vibrant font-bold text-sm">
        100% Garantido
      </span>
    </div>
  );
};

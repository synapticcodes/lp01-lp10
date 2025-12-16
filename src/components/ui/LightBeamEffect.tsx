
import { ReactNode } from "react";

interface LightBeamEffectProps {
  children: ReactNode;
  className?: string;
}

export const LightBeamEffect = ({ children, className = "" }: LightBeamEffectProps) => {
  return (
    <div className={`relative group ${className}`}>
      {/* Feixes de luz animados */}
      <div className="absolute -inset-1 bg-gradient-to-r from-yellow-vibrant via-purple-brand to-yellow-vibrant rounded-lg blur-sm opacity-75 group-hover:opacity-100 animate-pulse"></div>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-transparent via-yellow-vibrant/50 to-transparent rounded-lg animate-spin"></div>
      
      {/* Raios de luz radiais */}
      <div className="absolute inset-0 rounded-lg overflow-hidden">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-yellow-vibrant/80 via-transparent to-yellow-vibrant/80 animate-pulse delay-100"></div>
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-yellow-vibrant/80 via-transparent to-yellow-vibrant/80 animate-pulse delay-300"></div>
        <div className="absolute left-0 top-1/4 w-full h-px bg-gradient-to-r from-yellow-vibrant/80 via-transparent to-yellow-vibrant/80 animate-pulse delay-200"></div>
        <div className="absolute left-0 bottom-1/4 w-full h-px bg-gradient-to-r from-yellow-vibrant/80 via-transparent to-yellow-vibrant/80 animate-pulse delay-400"></div>
      </div>
      
      {/* Efeito de brilho nos cantos */}
      <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-vibrant/30 rounded-full blur-sm animate-ping"></div>
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-vibrant/30 rounded-full blur-sm animate-ping delay-500"></div>
      <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-yellow-vibrant/30 rounded-full blur-sm animate-ping delay-1000"></div>
      <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-yellow-vibrant/30 rounded-full blur-sm animate-ping delay-700"></div>
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};


import { Shield, Star, Award, Users, Trophy } from "lucide-react";

export const TrustBar = () => {
  const trustItems = [
    {
      icon: Shield,
      text: "OAB Certificado"
    },
    {
      icon: Star,
      text: "4.9 ★ Google"
    },
    {
      icon: Award,
      text: "Reclame Aqui"
    },
    {
      icon: Users,
      text: "+ 30 mil clientes"
    },
    {
      icon: Trophy,
      text: "6x consecutivas melhor empresa do ramo do país"
    }
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-6 py-6 border-t border-lavender/20 mt-8 lg:mt-12">
      {trustItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <div key={index} className="flex items-center gap-2 text-blue-vibrant">
            <Icon className="w-4 h-4 lg:w-5 lg:h-5" strokeWidth={2} />
            <span className="text-xs lg:text-body-sm font-medium">{item.text}</span>
          </div>
        );
      })}
    </div>
  );
};

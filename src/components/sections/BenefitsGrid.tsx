
import { Zap, Shield, CheckCircle, Clock } from "lucide-react";

export const BenefitsGrid = () => {
  const benefits = [
    {
      icon: Zap,
      title: "Diagnóstico expresso em 5 min",
      description: "via WhatsApp"
    },
    {
      icon: Shield,
      title: "Garantia 30-Dias",
      description: "descontos bloqueados ou nossos honorários zerados"
    },
    {
      icon: CheckCircle,
      title: "Bônus exclusivo",
      description: "checklist PDF \"Como evitar novos descontos ilegais\" entregue imediatamente no seu celular"
    },
    {
      icon: Clock,
      title: "Fila prioritária",
      description: "pulamos etapas internas para casos que entram por esta página"
    }
  ];

  return (
    <section className="py-12 px-4 bg-white">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-blue-vibrant font-bold text-2xl lg:text-3xl text-center mb-8">
          O que você ganha agora — e só agora
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-lavender-50">
                <div className="w-8 h-8 bg-yellow-vibrant rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-gray-900" />
                </div>
                <div>
                  <h3 className="text-purple-brand font-bold text-lg">{benefit.title}</h3>
                  <p className="text-gray-700">{benefit.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

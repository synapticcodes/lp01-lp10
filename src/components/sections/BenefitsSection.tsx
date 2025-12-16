
import { Heart, Shield, Check, Calendar, Wallet } from "lucide-react";

export const BenefitsSection = () => {
  const benefits = [
    {
      icon: Check,
      title: "Análise completa e gratuita",
      description: "Avaliamos seu caso sem custo algum para identificar todas as oportunidades"
    },
    {
      icon: Heart,
      title: "Acompanhamento personalizado", 
      description: "Cuidamos de cada detalhe do seu processo com atenção exclusiva"
    },
    {
      icon: Shield,
      title: "Equipe especializada",
      description: "Profissionais experientes em direito previdenciário ao seu lado"
    },
    {
      icon: Wallet,
      title: "Resultados garantidos",
      description: "Seus direitos protegidos ou seu dinheiro de volta"
    },
    {
      icon: Calendar,
      title: "Atendimento 100% digital",
      description: "Resolva tudo online, sem sair de casa, no seu tempo"
    }
  ];

  return (
    <section className="py-12 lg:py-16 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-center text-purple-brand font-bold text-2xl lg:text-3xl xl:text-4xl mb-8 lg:mb-12">
          Por que escolher nossa ajuda
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div 
                key={index} 
                className="bg-white border border-lavender rounded-xl p-4 lg:p-6 text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-blue-vibrant/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-blue-vibrant" />
                </div>
                <h3 className="text-blue-vibrant font-bold text-base lg:text-lg mb-2 lg:mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

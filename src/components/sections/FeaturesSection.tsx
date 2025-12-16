export const FeaturesSection = () => {
  const features = [
    "Análise completa e gratuita do seu caso",
    "Acompanhamento personalizado durante todo processo",
    "Equipe especializada em direito previdenciário",
    "Resultados garantidos ou seu dinheiro de volta",
    "Atendimento 100% digital, sem sair de casa"
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-center text-blue-vibrant font-bold text-3xl lg:text-4xl mb-12">
          Por que escolher nossa ajuda
        </h2>
        
        <div className="space-y-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="w-8 h-8 bg-purple-brand rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white font-bold text-sm">{index + 1}</span>
              </div>
              <div>
                <h3 className="text-blue-vibrant font-semibold text-lg mb-1">
                  {index === 0 && "Analisamos Gratuitamente Seu Caso"}
                  {index === 1 && "Sempre ao Seu Lado"}
                  {index === 2 && "Trabalhando por Você!"}
                  {index === 3 && "Vitória Garantida ou Seu Dinheiro de Volta"}
                  {index === 4 && "Atendimento 100% digital, sem sair de casa"}
                </h3>
                <p className="text-gray-700">{feature}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

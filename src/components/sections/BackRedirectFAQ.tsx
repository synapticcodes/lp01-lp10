
export const BackRedirectFAQ = () => {
  const faqs = [
    {
      question: "Preciso enviar documentos agora?",
      answer: "Só após recebermos seu diagnóstico; o primeiro passo é 100% gratuito."
    },
    {
      question: "E se vocês não bloquearem em 30 dias?",
      answer: "Não cobramos nenhum honorário até o banco parar de descontar."
    },
    {
      question: "Meu número ficará recebendo spam?",
      answer: "Nunca. Política de dados rígida e criptografia bancária."
    }
  ];

  return (
    <section className="py-8 md:py-12 px-3 md:px-4 bg-white">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-blue-vibrant font-bold text-xl md:text-2xl text-center mb-6 md:mb-8">FAQ Flash</h2>
        
        <div className="space-y-4 md:space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-l-4 border-purple-brand pl-3 md:pl-4">
              <h3 className="text-purple-brand font-bold text-base md:text-lg mb-1 md:mb-2">{faq.question}</h3>
              <p className="text-gray-700 text-sm md:text-base">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


export const ClosingSection = () => {
  return (
    <section className="py-8 lg:py-12 px-4 bg-white border-t border-gray-200">
      <div className="container mx-auto max-w-4xl text-center">
        <p className="text-gray-800 text-base lg:text-lg mb-4 lg:mb-6">
          Cada dia que passa sem agir é dinheiro que sai do seu bolso. 
          Milhares de aposentados e pensionistas já recuperaram sua dignidade financeira.
        </p>
        
        <p className="text-gray-700 mb-6 lg:mb-4 text-sm lg:text-base">
          Na <span className="font-bold text-purple-brand">Meu Nome Ok</span>, 
          nossa missão é simples: devolver o controle do seu dinheiro para você.
        </p>

        <div className="mt-6 lg:mt-8 pt-6 lg:pt-8 border-t border-gray-200">
          <p className="text-gray-800 text-base lg:text-lg">
            <span className="inline-block w-3 h-3 bg-yellow-vibrant rounded-full mr-2"></span>
            <strong>P.S.:</strong> Os bancos contam com sua inércia para continuar lucrando. 
            Não deixe isso acontecer mais um dia sequer.
          </p>
        </div>
      </div>
    </section>
  );
};

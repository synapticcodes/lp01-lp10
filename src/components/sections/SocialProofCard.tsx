
export const SocialProofCard = () => {
  return (
    <section className="py-8 px-4 bg-lavender-50">
      <div className="container mx-auto max-w-4xl text-center">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-brand to-lavender rounded-full border-4 border-lavender-500 flex items-center justify-center overflow-hidden">
              <img 
                src="/lovable-uploads/8fdcf3e5-887a-4a19-9f13-9d617fe9b4c9.png"
                alt="Sr. Álvaro"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <blockquote className="text-gray-800 text-lg italic mb-2">
            "Cliquei, mandei meu WhatsApp e em poucos minutos já estavam analisando meu extrato do INSS. Em pouco tempo, meu benefício ficou muito mais leve."
          </blockquote>
          <cite className="text-purple-brand font-medium">— Sr. Álvaro, 61 anos</cite>
        </div>
      </div>
    </section>
  );
};

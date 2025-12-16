
import { GuaranteeStamp } from "@/components/ui/GuaranteeStamp";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { TestimonialsCopy } from "@/content/lpVariants";

const defaultCopy: TestimonialsCopy = {
  title: "Quem já recuperou o próprio benefício",
  testimonials: [
    {
      name: "João Silva",
      role: "68 anos, ex-motorista de ônibus",
      text: "Recuperei R$ 42.000 em descontos ilegais. Agora pago minhas contas e ainda ajudo meu neto na faculdade.",
      image: "/lovable-uploads/770f24ba-712b-48c6-8348-629c55780154.png",
    },
    {
      name: "Maria Santos",
      role: "61 anos, ex-professora",
      text: "Em 45 dias meu nome saiu do SERASA e recebi R$ 18.500 de volta. Finalmente durmo em paz.",
      image: "/lovable-uploads/0159e8f4-d08a-4cc3-b6b5-99ffcd5ba296.png",
    },
    {
      name: "Carlos Oliveira",
      role: "70 anos, ex-comerciante",
      text: "A equipe entende a realidade do aposentado. Respeitosos, pacientes e eficientes.",
      image: "/lovable-uploads/66607520-da93-457f-9540-627eb8234316.png",
    },
  ],
};

export const TestimonialsSection = ({ copy }: { copy?: TestimonialsCopy }) => {
  const resolvedCopy = copy ?? defaultCopy;
  const testimonials = resolvedCopy.testimonials;

  return (
    <section className="py-12 lg:py-16 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-center text-purple-brand font-bold text-2xl lg:text-3xl xl:text-4xl mb-8 lg:mb-12">
          {resolvedCopy.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 mb-8 lg:mb-12">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-lavender/5 rounded-xl p-4 lg:p-6 relative">
              {/* Imagem quadrada grande acima do texto conforme solicitado */}
              {index === 0 && (
                <div className="flex justify-center mb-4 lg:mb-6">
                  <img
                    src="/lovable-uploads/c51da9e7-37d9-415c-a912-20fb7034afbf.png"
                    alt="Comprovante desconto quitado"
                    className="w-48 h-48 lg:w-56 lg:h-56 object-cover border-4 border-purple-brand shadow-xl rounded-xl"
                  />
                </div>
              )}
              {index === 1 && (
                <div className="flex justify-center mb-4 lg:mb-6">
                  <img
                    src="/lovable-uploads/8fd9b21a-f400-48d5-96e5-9dc003edf59c.png"
                    alt="Comprovante resultado João Santos"
                    className="w-48 h-48 lg:w-56 lg:h-56 object-cover border-4 border-purple-brand shadow-xl rounded-xl"
                  />
                </div>
              )}
              {index === 2 && (
                <div className="flex justify-center mb-4 lg:mb-6">
                  <img
                    src="/lovable-uploads/f170b4f7-a7a6-4ce7-a368-af9eb2f42042.png"
                    alt="Resultado Ana Costa - sentença judicial"
                    className="w-48 h-48 lg:w-56 lg:h-56 object-cover border-4 border-purple-brand shadow-xl rounded-xl"
                  />
                </div>
              )}
              <div className="text-3xl lg:text-4xl text-yellow-vibrant mb-3 lg:mb-4">"</div>
              <p className="text-gray-800 mb-3 lg:mb-4 italic text-sm lg:text-base">
                {testimonial.text}
              </p>
              <div className="flex items-start gap-3">
                {testimonial.image && (
                  <Avatar className="w-10 h-10 lg:w-12 lg:h-12 flex-shrink-0">
                    <AvatarImage
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gray-200 text-gray-600">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <div className="font-semibold text-gray-900 text-sm lg:text-base">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-600 text-xs lg:text-sm">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <GuaranteeStamp />
        </div>
      </div>
    </section>
  );
};

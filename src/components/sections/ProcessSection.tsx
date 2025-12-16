
import { ClipboardList, Search, PiggyBank } from "lucide-react";
import type { ProcessCopy } from "@/content/lpVariants";

const defaultCopy: ProcessCopy = {
  title: "Como funciona em 3 passos simples",
  steps: [
    {
      title: "CONTE SEU CASO (2 min)",
      description:
        "Preencha nosso formulário seguro. Só precisamos do seu nome, WhatsApp e um valor aproximado do benefício.",
    },
    {
      title: "ANÁLISE GRATUITA (24–48h)",
      description:
        "Nossa equipe especializada em direito previdenciário analisa oportunidades no seu caso. Sem custo, sem compromisso.",
    },
    {
      title: "BENEFÍCIO LIVRE (até 30 dias)",
      description:
        "Assinamos digitalmente e iniciamos a recuperação do seu dinheiro, sem você precisar sair de casa.",
    },
  ],
};

export const ProcessSection = ({ copy }: { copy?: ProcessCopy }) => {
  const resolvedCopy = copy ?? defaultCopy;

  const steps = [
    {
      number: 1,
      title: resolvedCopy.steps[0]?.title ?? defaultCopy.steps[0].title,
      description: resolvedCopy.steps[0]?.description ?? defaultCopy.steps[0].description,
      color: "bg-purple-brand",
      icon: ClipboardList,
    },
    {
      number: 2,
      title: resolvedCopy.steps[1]?.title ?? defaultCopy.steps[1].title,
      description: resolvedCopy.steps[1]?.description ?? defaultCopy.steps[1].description,
      color: "bg-blue-vibrant",
      icon: Search,
    },
    {
      number: 3,
      title: resolvedCopy.steps[2]?.title ?? defaultCopy.steps[2].title,
      description: resolvedCopy.steps[2]?.description ?? defaultCopy.steps[2].description,
      color: "bg-yellow-vibrant",
      icon: PiggyBank,
    },
  ];

  return (
    <section className="py-12 lg:py-16 px-4 bg-lavender/8">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-purple-brand font-bold text-2xl lg:text-3xl xl:text-4xl mb-8 lg:mb-12">
          {resolvedCopy.title}
        </h2>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center relative w-full md:w-auto">
              {/* Circle with number */}
              <div className={`w-20 h-20 ${step.color} rounded-full flex items-center justify-center mb-4`}>
                <div className="flex flex-col items-center">
                  <step.icon className="w-8 h-8 text-white" aria-hidden="true" />
                  <span className="text-white font-bold text-lg mt-1">{step.number}</span>
                </div>
              </div>
              
              {/* Content */}
              <h3 className="font-bold text-lg lg:text-xl mb-2 text-gray-900">{step.title}</h3>
              <p className="text-gray-700 text-center text-base lg:text-lg max-w-xs px-2 leading-relaxed">{step.description}</p>
              
              {/* Connector line (except for last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-6 lg:w-8 border-t-2 border-dashed border-lavender"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

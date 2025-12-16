
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import type { FaqCopy } from "@/content/lpVariants";

const defaultCopy: FaqCopy = {
  title: "Perguntas frequentes",
  items: [
    {
      question: "É seguro para aposentados e pensionistas?",
      answer:
        "Sim. Trabalhamos dentro da legislação previdenciária. Seu benefício NÃO pode ser bloqueado ou suspenso por buscar seus direitos.",
    },
    {
      question: "Preciso ir até um escritório?",
      answer:
        "Não. Todo o processo é 100% digital. Atendemos por WhatsApp, e-mail e, se precisar, vídeo-chamada.",
    },
    {
      question: "E se eu não tiver computador?",
      answer:
        "Sem problema. Atendemos perfeitamente por celular. Nossos formulários são otimizados para smartphones.",
    },
    {
      question: "Como sei se tenho direito?",
      answer:
        "Se você é aposentado ou pensionista do INSS e tem descontos no benefício, provavelmente tem. A análise é gratuita para confirmar.",
    },
    {
      question: "Vou perder minha aposentadoria?",
      answer: "Nunca. Isso é mito. Seu benefício é vitalício e constitucional.",
    },
  ],
};

export const FAQSection = ({ copy }: { copy?: FaqCopy }) => {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const resolvedCopy = copy ?? defaultCopy;
  const faqs = resolvedCopy.items;

  const handleValueChange = (value: string) => {
    setOpenItems(value ? [value] : []);
  };

  return (
    <section className="py-16 px-4 bg-lavender-50">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-center text-purple-brand font-bold text-3xl lg:text-4xl mb-12">
          {resolvedCopy.title}
        </h2>
        
        <Accordion 
          type="single" 
          collapsible 
          className="space-y-4"
          onValueChange={handleValueChange}
        >
          {faqs.map((faq, index) => {
            const isOpen = openItems.includes(`item-${index}`);
            return (
              <AccordionItem 
                key={index} 
                value={`item-${index}`} 
                className={`bg-white border border-lavender rounded-lg transition-colors duration-200 ${
                  isOpen ? 'bg-lavender-50' : 'bg-white'
                }`}
              >
                <AccordionTrigger className="px-6 py-4 text-purple-brand font-semibold text-left hover:no-underline group min-h-[44px]">
                  <span className="flex-1 text-body">{faq.question}</span>
                  <div className="ml-4 transition-transform duration-200 group-data-[state=open]:rotate-180">
                    {isOpen ? (
                      <Minus className="h-5 w-5 text-blue-vibrant" strokeWidth={2} />
                    ) : (
                      <Plus className="h-5 w-5 text-blue-vibrant" strokeWidth={2} />
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 text-gray-700 text-body">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </section>
  );
};

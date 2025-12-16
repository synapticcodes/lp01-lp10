
import { Check } from "lucide-react";
import type { SolutionCopy } from "@/content/lpVariants";

const defaultCopy: SolutionCopy = {
  title: "Não é milagre, é lei",
  subtitle:
    "A legislação previdenciária protege aposentados e pensionistas do INSS contra descontos abusivos.",
  badgeLeft: "INSS",
  badgeRight: "Proteção legal contra descontos abusivos",
  items: [
    {
      action: "Bloqueamos imediatamente",
      description: "novos descontos ilegais no seu benefício",
    },
    {
      action: "Reduzimos em até 80%",
      description: "os juros abusivos",
    },
    {
      action: "Retiramos seu nome",
      description: "do SPC/SERASA em até 30 dias",
    },
    {
      action: "Recuperamos valores",
      description: "pagos indevidamente nos últimos 5 anos",
    },
  ],
  beforeAfterTitle: "Antes / Depois",
  beforeLabel: "Antes",
  beforeRight: "80% descontado",
  afterLabel: "Depois",
  afterRight: "100% no bolso",
  footer: "Tudo 100% digital, sem precisar sair de casa.",
};

export const SolutionSection = ({ copy }: { copy?: SolutionCopy }) => {
  const resolvedCopy = copy ?? defaultCopy;
  const solutions = resolvedCopy.items;

  return (
    <section className="py-12 lg:py-16 px-4 bg-lavender/8">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-blue-vibrant font-bold text-2xl lg:text-3xl xl:text-4xl mb-2 lg:mb-4 drop-shadow-sm text-center">
          {resolvedCopy.title}
        </h2>
        <p className="text-gray-700 text-base lg:text-lg mb-8 lg:mb-12 text-center">
          {resolvedCopy.subtitle}
        </p>
        
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Solutions List */}
          <div className="space-y-4 lg:space-y-6 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 rounded-lg bg-white border border-lavender px-4 py-3">
              <span className="font-bold text-blue-vibrant">{resolvedCopy.badgeLeft}</span>
              <span className="text-gray-700 text-base">{resolvedCopy.badgeRight}</span>
            </div>

            {solutions.map((solution, index) => (
              <div key={index} className="flex items-start gap-3 lg:gap-4 text-left">
                <Check className="w-6 h-6 text-blue-vibrant flex-shrink-0 mt-1" />
                <p className="text-gray-800 text-base lg:text-lg">
                  <span className="font-bold text-purple-brand">{solution.action}</span>{" "}
                  {solution.description}
                </p>
              </div>
            ))}

            <div className="mt-6 rounded-xl border border-lavender bg-white p-4 lg:p-6">
              <p className="text-gray-900 font-bold text-lg lg:text-xl mb-3">{resolvedCopy.beforeAfterTitle}</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-800 font-semibold">{resolvedCopy.beforeLabel}</span>
                  <div className="flex-1 h-3 rounded-full bg-gray-200 overflow-hidden">
                    <div className="h-full w-4/5 bg-yellow-vibrant" />
                  </div>
                  <span className="text-gray-800 font-semibold">{resolvedCopy.beforeRight}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-800 font-semibold">{resolvedCopy.afterLabel}</span>
                  <div className="flex-1 h-3 rounded-full bg-gray-200 overflow-hidden">
                    <div className="h-full w-full bg-blue-vibrant" />
                  </div>
                  <span className="text-gray-800 font-semibold">{resolvedCopy.afterRight}</span>
                </div>
              </div>
              <p className="text-gray-700 text-base mt-4">{resolvedCopy.footer}</p>
            </div>
          </div>

          {/* Image */}
          <div className="relative order-1 lg:order-2">
            <div className="bg-gradient-to-br from-lavender/20 to-lavender/5 rounded-2xl p-4 lg:p-6 shadow-lg">
              <img 
                src="/lovable-uploads/e66301d8-3de6-4047-b43a-fa00037c2455.png"
                alt="Aposentado do INSS usando o celular - atendimento digital e simples"
                className="w-full h-64 lg:h-80 object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

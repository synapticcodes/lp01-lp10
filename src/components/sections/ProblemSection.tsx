import { useMemo, useState } from "react";
import type { ProblemCopy } from "@/content/lpVariants";

const defaultCopy: ProblemCopy = {
  badge: "O que os bancos não contam aos aposentados",
  title: "Cada mês que passa, mais dinheiro do INSS vai para os bancos",
  bullets: [
    "Descontos consignados que consomem ATÉ 80% do seu benefício mensal",
    "Juros abusivos em empréstimos que só aumentam, nunca diminuem",
    "Nome no SPC/SERASA impedindo novos créditos quando precisa",
    "Dependência financeira dos filhos na terceira idade",
    "Medo de perder a aposentadoria por conta de dívidas",
  ],
  calculatorTitle: "Calcule quanto você perde por mês",
  calculatorBody:
    "Informe um valor aproximado. É só para ter uma noção do tamanho do prejuízo.",
  benefitLabel: "Seu benefício (R$)",
  percentLabel: "% descontada",
  resultLabel: "Resultado",
  closingLine: "Pior: cada mês que passa, mais dinheiro do INSS vai para os bancos.",
};

const formatCurrencyBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    Number.isFinite(value) ? value : 0
  );

const parseNumberPtBR = (raw: string) => {
  const normalized = raw
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^0-9.]/g, "");
  const value = Number(normalized);
  return Number.isFinite(value) ? value : 0;
};

export const ProblemSection = ({ copy }: { copy?: ProblemCopy }) => {
  const resolvedCopy = copy ?? defaultCopy;
  const problems = resolvedCopy.bullets;

  const [benefitValue, setBenefitValue] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");

  const monthlyLoss = useMemo(() => {
    const benefit = parseNumberPtBR(benefitValue);
    const percent = parseNumberPtBR(discountPercent);
    if (benefit <= 0 || percent <= 0) return 0;
    return (benefit * Math.min(Math.max(percent, 0), 100)) / 100;
  }, [benefitValue, discountPercent]);

  return (
    <section className="py-12 lg:py-16 px-4 bg-white border-t-2 border-lavender/20">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8 lg:mb-12 text-center">
          <span className="inline-block px-4 py-2 bg-yellow-vibrant/10 rounded-full text-yellow-vibrant text-sm lg:text-base font-semibold mb-4">
            {resolvedCopy.badge}
          </span>
          <h2 className="text-purple-brand font-bold text-2xl lg:text-3xl xl:text-4xl">
            {resolvedCopy.title}
          </h2>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div className="bg-gradient-to-br from-lavender/10 to-lavender/5 rounded-2xl p-4 lg:p-6 shadow-lg">
              <img 
                src="/lovable-uploads/791dabc3-5335-4b7e-a984-7571506d7bb7.png"
                alt="Homem preocupado com problemas financeiros - o peso dos descontos abusivos"
                className="w-full h-64 lg:h-80 object-cover rounded-xl"
                loading="lazy"
              />
            </div>
          </div>

          {/* Problems List */}
          <div className="space-y-4 lg:space-y-6 order-1 lg:order-2">
            {problems.map((problem, index) => (
              <div key={index} className="flex items-start gap-3 lg:gap-4 text-left">
                <div className="w-7 h-7 rounded-full bg-yellow-vibrant flex-shrink-0 flex items-center justify-center mt-0.5">
                  <span className="text-white text-base font-bold">✓</span>
                </div>
                <p className="text-gray-900 text-base lg:text-lg leading-relaxed">{problem}</p>
              </div>
            ))}

            <div className="mt-6 rounded-xl border border-lavender bg-white p-4 lg:p-6">
              <h3 className="text-blue-vibrant font-bold text-lg lg:text-xl mb-2">
                {resolvedCopy.calculatorTitle}
              </h3>
              <p className="text-gray-700 text-base mb-4">
                {resolvedCopy.calculatorBody}
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="benefitValue" className="block text-gray-900 font-semibold text-base mb-2">
                    {resolvedCopy.benefitLabel}
                  </label>
                  <input
                    id="benefitValue"
                    inputMode="decimal"
                    autoComplete="off"
                    className="w-full h-11 rounded-lg border border-gray-300 px-3 text-base focus:outline-none focus:ring-2 focus:ring-lavender-400"
                    placeholder="Ex.: 3.500"
                    value={benefitValue}
                    onChange={(e) => setBenefitValue(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="discountPercent" className="block text-gray-900 font-semibold text-base mb-2">
                    {resolvedCopy.percentLabel}
                  </label>
                  <input
                    id="discountPercent"
                    inputMode="numeric"
                    autoComplete="off"
                    className="w-full h-11 rounded-lg border border-gray-300 px-3 text-base focus:outline-none focus:ring-2 focus:ring-lavender-400"
                    placeholder="Ex.: 40"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-lavender/10 p-4">
                <p className="text-gray-900 text-base lg:text-lg">
                  {resolvedCopy.resultLabel}: <span className="font-bold text-purple-brand">{formatCurrencyBRL(monthlyLoss)}</span> perdidos mensalmente
                </p>
              </div>

              <p className="text-gray-800 text-base font-semibold mt-4">
                {resolvedCopy.closingLine}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

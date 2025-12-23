
import { Check, CheckCircle2, XCircle } from "lucide-react";
import type { SolutionCopy } from "@/content/lpVariants";

const clampPercent = (value: number) => Math.min(100, Math.max(0, value));

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
  const beforePercent = clampPercent(resolvedCopy.beforeBarPercent ?? 80);
  const afterPercent = clampPercent(resolvedCopy.afterBarPercent ?? 100);
  const showBadge = Boolean(resolvedCopy.badgeLeft || resolvedCopy.badgeRight);
  const showComparison = Boolean(
    resolvedCopy.beforeAfterTitle ||
      resolvedCopy.beforeLabel ||
      resolvedCopy.beforeRight ||
      resolvedCopy.afterLabel ||
      resolvedCopy.afterRight ||
      resolvedCopy.footer
  );

  if (resolvedCopy.mode === "lp02") {
    return (
      <section className="py-12 lg:py-16 px-4 bg-lavender/8">
        <div className="container mx-auto max-w-6xl">
          {resolvedCopy.eligibilityTitle ? (
            <h2 className="text-blue-vibrant font-bold text-2xl lg:text-3xl xl:text-4xl mb-8 text-center">
              {resolvedCopy.eligibilityTitle}
            </h2>
          ) : null}

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mb-10">
            <div className="rounded-2xl border border-lavender bg-white p-5 lg:p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-600" aria-hidden="true" />
                <h3 className="text-gray-900 font-bold text-lg lg:text-xl">
                  {resolvedCopy.eligibilityYesTitle ?? "Indicado"}
                </h3>
              </div>
              <ul className="space-y-3">
                {(resolvedCopy.eligibilityYesItems ?? []).map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-blue-vibrant flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-gray-800 text-base leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-lavender bg-white p-5 lg:p-6">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="w-6 h-6 text-red-600" aria-hidden="true" />
                <h3 className="text-gray-900 font-bold text-lg lg:text-xl">
                  {resolvedCopy.eligibilityNoTitle ?? "Não indicado"}
                </h3>
              </div>
              <ul className="space-y-3">
                {(resolvedCopy.eligibilityNoItems ?? []).map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-gray-800 text-base leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {resolvedCopy.analysisTitle ? (
            <h2 className="text-purple-brand font-bold text-2xl lg:text-3xl xl:text-4xl mb-2 text-center">
              {resolvedCopy.analysisTitle}
            </h2>
          ) : null}
          {resolvedCopy.analysisBody ? (
            <p className="text-gray-700 text-base lg:text-lg mb-8 text-center max-w-4xl mx-auto">
              {resolvedCopy.analysisBody}
            </p>
          ) : null}

          {resolvedCopy.analysisBullets?.length ? (
            <div className="max-w-4xl mx-auto rounded-2xl border border-lavender bg-white p-5 lg:p-6">
              <ul className="space-y-3">
                {resolvedCopy.analysisBullets.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-blue-vibrant flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-gray-800 text-base lg:text-lg leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              {resolvedCopy.analysisNote ? (
                <p className="text-gray-600 text-sm lg:text-base mt-5">
                  {resolvedCopy.analysisNote}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>
    );
  }

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
            {showBadge ? (
              <div className="inline-flex items-center gap-2 rounded-lg bg-white border border-lavender px-4 py-3">
                <span className="font-bold text-blue-vibrant">{resolvedCopy.badgeLeft}</span>
                <span className="text-gray-700 text-base">{resolvedCopy.badgeRight}</span>
              </div>
            ) : null}

            {solutions.map((solution, index) => (
              <div key={index} className="flex items-start gap-3 lg:gap-4 text-left">
                <Check className="w-6 h-6 text-blue-vibrant flex-shrink-0 mt-1" />
                <p className="text-gray-800 text-base lg:text-lg">
                  <span className="font-bold text-purple-brand">{solution.action}</span>{" "}
                  {solution.description}
                </p>
              </div>
            ))}

            {showComparison ? (
              <div className="mt-6 rounded-xl border border-lavender bg-white p-4 lg:p-6">
                <p className="text-gray-900 font-bold text-lg lg:text-xl mb-3">
                  {resolvedCopy.beforeAfterTitle}
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-gray-800 font-semibold">{resolvedCopy.beforeLabel}</span>
                    <div className="flex-1 h-3 rounded-full bg-gray-200 overflow-hidden">
                      <div className="h-full bg-yellow-vibrant" style={{ width: `${beforePercent}%` }} />
                    </div>
                    <span className="text-gray-800 font-semibold">{resolvedCopy.beforeRight}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-gray-800 font-semibold">{resolvedCopy.afterLabel}</span>
                    <div className="flex-1 h-3 rounded-full bg-gray-200 overflow-hidden">
                      <div className="h-full bg-blue-vibrant" style={{ width: `${afterPercent}%` }} />
                    </div>
                    <span className="text-gray-800 font-semibold">{resolvedCopy.afterRight}</span>
                  </div>
                </div>
                <p className="text-gray-700 text-base mt-4">{resolvedCopy.footer}</p>
              </div>
            ) : null}
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

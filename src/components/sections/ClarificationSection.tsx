import type { ClarificationCopy } from "@/content/lpVariants";

type ClarificationSectionProps = {
  copy?: ClarificationCopy;
};

export const ClarificationSection = ({ copy }: ClarificationSectionProps) => {
  if (!copy) return null;

  return (
    <section className="py-12 lg:py-16 px-4 bg-white border-t-2 border-lavender/20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8 lg:mb-10">
          <h2 className="text-purple-brand font-bold text-2xl lg:text-3xl xl:text-4xl">
            {copy.title}
          </h2>
          {copy.intro ? (
            <p className="text-gray-700 text-base lg:text-lg mt-3 max-w-3xl mx-auto">
              {copy.intro}
            </p>
          ) : null}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="rounded-2xl border border-lavender bg-white p-5 lg:p-6 text-left">
            <h3 className="text-gray-900 font-bold text-lg lg:text-xl mb-4">
              {copy.left.title}
            </h3>
            <ul className="space-y-3">
              {copy.left.bullets.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-yellow-vibrant text-white font-bold">
                    ✓
                  </span>
                  <span className="text-gray-800 text-base lg:text-lg leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-lavender bg-lavender/10 p-5 lg:p-6 text-left">
            <h3 className="text-gray-900 font-bold text-lg lg:text-xl mb-4">
              {copy.right.title}
            </h3>
            <ul className="space-y-3">
              {copy.right.bullets.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-vibrant text-white font-bold">
                    ✓
                  </span>
                  <span className="text-gray-800 text-base lg:text-lg leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {copy.exampleTitle || copy.exampleBody ? (
          <div className="mt-8 lg:mt-10 rounded-2xl border border-lavender bg-white p-5 lg:p-6">
            {copy.exampleTitle ? (
              <h3 className="text-blue-vibrant font-bold text-lg lg:text-xl">
                {copy.exampleTitle}
              </h3>
            ) : null}
            {copy.exampleBody ? (
              <p className="text-gray-700 text-base lg:text-lg mt-2 leading-relaxed">
                {copy.exampleBody}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
};


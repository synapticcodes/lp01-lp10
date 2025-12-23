import type { BenefitsListCopy } from "@/content/lpVariants";

type BenefitsListSectionProps = {
  copy?: BenefitsListCopy;
};

export const BenefitsListSection = ({ copy }: BenefitsListSectionProps) => {
  if (!copy?.items?.length) return null;

  return (
    <section className="py-12 lg:py-16 px-4 bg-white">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-blue-vibrant font-bold text-2xl lg:text-3xl xl:text-4xl text-center mb-8 lg:mb-10">
          {copy.title}
        </h2>

        <div className="space-y-6 lg:space-y-7">
          {copy.items.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-brand text-white flex items-center justify-center font-bold text-base flex-shrink-0">
                {index + 1}
              </div>
              <div>
                <h3 className="text-blue-vibrant font-semibold text-base lg:text-lg">
                  {item.title}
                </h3>
                <p className="text-gray-700 text-sm lg:text-base">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

import type { LeadFormVariantKey, LeadFormVariantProps } from "@/forms/lead/types";
import { DefaultLeadFormDialogContent } from "@/forms/lead/DefaultLeadFormDialogContent";
import { Lp01LeadFormDialogContent } from "@/forms/lead/variants/lp01";
import { Lp02LeadFormDialogContent } from "@/forms/lead/variants/lp02";
import { Lp03LeadFormDialogContent } from "@/forms/lead/variants/lp03";
import { Lp04LeadFormDialogContent } from "@/forms/lead/variants/lp04";
import { Lp05LeadFormDialogContent } from "@/forms/lead/variants/lp05";
import { Lp06LeadFormDialogContent } from "@/forms/lead/variants/lp06";

export type LeadFormVariantComponent = (props: LeadFormVariantProps) => JSX.Element;

export const leadFormVariants: Record<LeadFormVariantKey, LeadFormVariantComponent> = {
  lp01: Lp01LeadFormDialogContent,
  lp02: Lp02LeadFormDialogContent,
  lp03: Lp03LeadFormDialogContent,
  lp04: Lp04LeadFormDialogContent,
  lp05: Lp05LeadFormDialogContent,
  lp06: Lp06LeadFormDialogContent,
};

export const getLeadFormVariantFromPath = (pathname: string): LeadFormVariantKey => {
  const match = pathname.match(/^\/lp-?(0[1-6])(\/|$)/);
  if (!match) return "lp06";
  return (`lp${match[1]}` as LeadFormVariantKey);
};

export const getLeadFormComponentForPath = (pathname: string): LeadFormVariantComponent => {
  const key = getLeadFormVariantFromPath(pathname);
  return leadFormVariants[key] ?? DefaultLeadFormDialogContent;
};

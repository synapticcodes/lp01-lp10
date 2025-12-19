export type LeadFormVariantKey =
  | "lp01"
  | "lp02"
  | "lp03"
  | "lp04"
  | "lp05"
  | "lp06";

export type LeadFormVariantProps = {
  isOpen: boolean;
  onClose: () => void;
};

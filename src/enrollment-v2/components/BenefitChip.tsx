import { Check } from "lucide-react";

export interface BenefitChipProps {
  label: string;
  className?: string;
}

/**
 * Benefit chip: pill, rounded-full, soft background, check icon.
 * Used in PlanCard Key Benefits section.
 */
export function BenefitChip({ label, className = "" }: BenefitChipProps) {
  return (
    <span
      className={
        `inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ` +
        `border border-neutral-200 bg-neutral-50 text-neutral-800 ` +
        `dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200 ` +
        className
      }
    >
      <Check className="w-4 h-4 flex-shrink-0 text-green-600 dark:text-green-400" aria-hidden />
      {label}
    </span>
  );
}

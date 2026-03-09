import { useTranslation } from "react-i18next";

export interface QuickSelectOption {
  id: string;
  labelKey: string;
  percentage: number;
}

export interface QuickSelectButtonsProps {
  options: QuickSelectOption[];
  activePercentage: number;
  onSelect: (percentage: number) => void;
}

/**
 * Quick select pills: e.g. 4% Safe, 6% Match, 15% Aggressive.
 * Click sets contribution percent. Active state uses success/accent token.
 */
export function QuickSelectButtons({
  options,
  activePercentage,
  onSelect,
}: QuickSelectButtonsProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap items-center gap-2">
      {options.map((opt) => {
        const isActive = activePercentage === opt.percentage;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelect(opt.percentage)}
            className={`contrib-quick-select-btn h-8 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${isActive ? "contrib-quick-select-btn--active" : ""}`}
            aria-pressed={isActive}
            aria-label={t(opt.labelKey)}
          >
            {t(opt.labelKey)}
          </button>
        );
      })}
    </div>
  );
}

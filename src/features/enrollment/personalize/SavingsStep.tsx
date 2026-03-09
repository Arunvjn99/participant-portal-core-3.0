import { useTranslation } from "react-i18next";
import { Sparkles } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";

export interface SavingsStepProps {
  /** Currency input value (e.g. "50000" or ""). Displayed with locale formatting. */
  savingsAmount: string;
  onSavingsAmountChange: (value: string) => void;
  /** Years until retirement (from step 1) for encouragement card copy. */
  yearsUntilRetirement: number;
  completeDisabled?: boolean;
}

/** Format numeric string for display (e.g. "50000" → "50,000") */
function formatDisplayAmount(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits === "") return "";
  const n = parseInt(digits, 10);
  if (Number.isNaN(n)) return "";
  return n.toLocaleString();
}

/** Parse display or raw input back to digits-only string for state */
function parseAmountInput(display: string): string {
  return display.replace(/\D/g, "");
}

export function SavingsStep({
  savingsAmount,
  onSavingsAmountChange,
  yearsUntilRetirement,
  completeDisabled = false,
}: SavingsStepProps) {
  const { t } = useTranslation();
  const displayValue = formatDisplayAmount(savingsAmount);
  const showCard = savingsAmount.length > 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = parseAmountInput(e.target.value);
    onSavingsAmountChange(next);
  };

  return (
    <div className="flex flex-col">
      {/* Title section — center aligned. Spacing: Title → Input 20px */}
      <div className="text-center pb-5">
        <h2
          className="text-xl font-bold text-[var(--color-text-primary)] sm:text-2xl"
          id="savings-heading"
        >
          {t("personalize.currentRetirementSavings", "What's your current retirement savings?")} 💰
        </h2>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          {t("personalize.savingsHelpsPicture", "Sharing this helps us give you a clearer picture of your future.")}
        </p>
      </div>

      {/* Input: relative container, $ left, 48px height, rounded-lg, border-gray-300. Spacing: Input → Helper 6px */}
      <div className="relative">
        <span
          className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-semibold text-[var(--color-text-secondary)] pointer-events-none"
          aria-hidden
        >
          $
        </span>
        <input
          type="text"
          inputMode="numeric"
          className="w-full h-12 rounded-lg border border-[var(--color-border)] bg-transparent pl-10 pr-4 text-base text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
          style={{ minHeight: 48 }}
          placeholder="0"
          value={displayValue}
          onChange={handleInputChange}
          aria-label={t("personalize.savingsAmountLabel", "Retirement savings amount in dollars")}
          aria-describedby="savings-helper"
        />
      </div>

      {/* Helper text: text-xs text-gray-400, margin-top 4px. Spacing: Helper → Card 16px */}
      <p id="savings-helper" className="mt-1.5 text-xs text-[var(--color-text-secondary)]">
        {t(
          "personalize.savingsHelper",
          "Exclude 401(k), IRA, pension — only include personal savings and investments"
        )}
      </p>

      {/* Encouragement card: rounded-xl border-purple-200 bg-purple-50 p-4 flex gap-3. Spacing: 16px above */}
      {showCard && (
        <Card className="mt-4 rounded-xl p-4" role="region" aria-live="polite">
          <CardContent className="flex flex-row gap-3 p-0">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--color-text-inverse)]"
              style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-light))" }}
              aria-hidden
            >
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                {t("personalize.greatStart", "Great Start!")}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                {t("personalize.everyDollarCounts", "Every dollar counts.")}{" "}
                {t("personalize.encouragementWithAmount", "With {{amount}} saved and {{years}} until retirement, consistent contributions can grow this significantly through compound interest.", {
                  amount: `$${formatDisplayAmount(savingsAmount)}`,
                  years: yearsUntilRetirement,
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

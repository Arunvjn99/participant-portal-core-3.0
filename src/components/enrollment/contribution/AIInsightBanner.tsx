import { useTranslation } from "react-i18next";
import { Zap } from "lucide-react";

export interface AIInsightBannerProps {
  /** Current contribution percentage (0–100) */
  contributionPercent: number;
  /** Employer match cap (e.g. 6 for 6%) */
  employerMatchCap: number;
  /** Full match amount formatted (e.g. "$4,320/year") */
  fullMatchAmountFormatted: string;
  /** "figma" = gradient background, gradient icon and title (contribution page) */
  variant?: "default" | "figma";
}

/**
 * AI Insight banner: "Maximize Your Match".
 * < 6%: "You are not maximizing employer match." + annual free money.
 * = 6%: "You're maximizing employer match." + annual free money.
 * > 6%: "You are contributing above the match." + annual free money.
 */
export function AIInsightBanner({
  contributionPercent,
  employerMatchCap,
  fullMatchAmountFormatted,
  variant = "default",
}: AIInsightBannerProps) {
  const { t } = useTranslation();
  const belowMatch = contributionPercent < employerMatchCap - 0.01;
  const atMatch = contributionPercent >= employerMatchCap - 0.01 && contributionPercent <= employerMatchCap + 0.01;

  let message: string;
  if (belowMatch) {
    message =
      t("enrollment.aiInsightNotMaximizing") +
      " " +
      t("enrollment.aiInsightAnnualFreeMoney", { amount: fullMatchAmountFormatted });
  } else if (atMatch) {
    message =
      t("enrollment.aiInsightMaximizing") +
      " " +
      t("enrollment.aiInsightAnnualFreeMoney", { amount: fullMatchAmountFormatted });
  } else {
    message =
      t("enrollment.aiInsightAboveMatch") +
      " " +
      t("enrollment.aiInsightAnnualFreeMoney", { amount: fullMatchAmountFormatted });
  }

  const title = t("enrollment.aiInsightMaximizeMatch");

  if (variant === "figma") {
    return (
      <div className="contrib-ai-banner-figma">
        <div className="contrib-ai-banner-figma__icon">
          <Zap className="h-5 w-5" strokeWidth={2} aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="contrib-ai-banner-figma__title">{title}</h4>
          <p className="contrib-ai-banner-figma__message">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="contrib-ai-banner rounded-[var(--contrib-ai-banner-radius)] border p-5">
      <div className="flex gap-3">
        <div className="contrib-ai-banner__icon flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]">
          <Zap className="h-5 w-5" strokeWidth={2} aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="contrib-ai-banner__title text-base font-semibold leading-6">
            {title}
          </h4>
          <p className="contrib-ai-banner__message mt-1 text-sm leading-5">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

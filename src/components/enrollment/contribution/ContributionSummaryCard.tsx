export interface ContributionSummaryCardProps {
  /** e.g. "You $200 + Employer $150 = Total $350/mo" — total part can be emphasized */
  summaryLine: string;
  /** Whether to emphasize the total (bold/blue) in the line; if true, expect summaryLine to contain "Total $X" */
  emphasizeTotal?: boolean;
  /** e.g. "Based on 12 pay periods per year • $4,200/yr total" */
  annualSummaryLine: string;
  /** When true, use Figma spec: 32px padding, 16px radius, soft shadow */
  variant?: "default" | "figma";
  /** Optional progress bar: share of total (0–1). You + Employer should ≈ 1. */
  progressBar?: { youPercent: number; employerPercent: number };
}

export function ContributionSummaryCard({
  summaryLine,
  emphasizeTotal,
  annualSummaryLine,
  variant = "default",
  progressBar,
}: ContributionSummaryCardProps) {
  const cardClass = variant === "figma"
    ? "contrib-summary-card-figma flex flex-col gap-2"
    : "contrib-summary-card-default flex flex-col gap-2 pt-[25px] px-6 pb-6";
  const lineClass = variant === "figma" ? "contrib-summary-card-figma__line" : "";
  const totalClass = variant === "figma" ? "contrib-summary-card-figma__total" : "";
  const annualClass = variant === "figma" ? "contrib-summary-card-figma__annual" : "";

  const [left, right] = summaryLine.includes("=")
    ? summaryLine.split("=").map((s) => s.trim())
    : [summaryLine, ""];

  const content = (
    <>
      {progressBar != null && variant === "figma" && (
        <div className="contrib-summary-card-figma__bar-wrap" role="presentation">
          <div
            className="contrib-summary-card-figma__bar contrib-summary-card-figma__bar--you"
            style={{ width: `${Math.min(1, Math.max(0, progressBar.youPercent)) * 100}%` }}
          />
          <div
            className="contrib-summary-card-figma__bar contrib-summary-card-figma__bar--employer"
            style={{ width: `${Math.min(1, Math.max(0, progressBar.employerPercent)) * 100}%` }}
          />
        </div>
      )}
      {emphasizeTotal && right ? (
        <p className={`text-sm leading-5 ${lineClass}`}>
          {left}= <span className={`font-bold ${totalClass}`}>{right}</span>
        </p>
      ) : (
        <p className={`text-sm leading-5 ${lineClass}`}>{summaryLine}</p>
      )}
      <p className={`text-xs ${annualClass}`}>{annualSummaryLine}</p>
    </>
  );

  if (variant === "figma") {
    return (
      <div className="contrib-summary-card-figma__strip">
        <div className={cardClass}>
          {content}
        </div>
      </div>
    );
  }

  return <div className={cardClass}>{content}</div>;
}

const WIZARD_GRADIENT = "linear-gradient(135deg, #2563EB, #7C3AED)";

export interface TimelineBarProps {
  /** Label for "now" (e.g. "Now") */
  nowLabel: string;
  /** Year or value for start */
  nowValue: string | number;
  /** Center segment label (e.g. "12 years") */
  centerLabel: string;
  /** Label for end (e.g. "Retire") */
  endLabel: string;
  /** Year or value for end */
  endValue: string | number;
  className?: string;
}

export function TimelineBar({
  nowLabel,
  nowValue,
  centerLabel,
  endLabel,
  endValue,
  className = "",
}: TimelineBarProps) {
  return (
    <div
      className={`flex items-center gap-2 pt-2 ${className}`}
      role="img"
      aria-label={`Timeline from ${nowValue} to ${endValue}, ${centerLabel}`}
    >
      <div className="flex flex-col items-center">
        <div
          className="h-2.5 w-2.5 rounded-full"
          style={{ background: WIZARD_GRADIENT }}
        />
        <div className="mt-1 text-xs font-medium text-[var(--color-textSecondary)]">{nowLabel}</div>
        <div className="text-xs text-[var(--color-textTertiary)]">{nowValue}</div>
      </div>
      <div className="relative flex-1 h-0.5 overflow-hidden rounded-full bg-[var(--color-border)]">
        <div
          className="absolute inset-y-0 left-0 w-full rounded-full"
          style={{ background: WIZARD_GRADIENT }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded bg-[var(--color-background)] px-2 py-0.5 text-xs font-medium text-[#2563EB] whitespace-nowrap">
          {centerLabel}
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="h-2.5 w-2.5 rounded-full bg-[#7C3AED]" />
        <div className="mt-1 text-xs font-medium text-[var(--color-textSecondary)]">{endLabel}</div>
        <div className="text-xs text-[var(--color-textTertiary)]">{endValue}</div>
      </div>
    </div>
  );
}

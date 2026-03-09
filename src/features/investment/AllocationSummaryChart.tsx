export interface FundSegment {
  name: string;
  percentage: number;
}

interface AllocationSummaryChartProps {
  /** Segments for donut, e.g. [{ name: "S&P 500 Index Fund", percentage: 90 }, ...]. Total should be 100. */
  segments: FundSegment[];
}

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

/**
 * Donut chart showing fund allocation (e.g. S&P 500 90%, Total Bond 5%, International 5%).
 * Uses CSS conic-gradient for the ring; tokens for colors.
 */
export function AllocationSummaryChart({ segments }: AllocationSummaryChartProps) {
  const total = segments.reduce((s, seg) => s + seg.percentage, 0);
  const normalized = total > 0
    ? segments.map((s) => ({ ...s, percentage: (s.percentage / total) * 100 }))
    : segments;

  let acc = 0;
  const conicParts = normalized.map((seg, i) => {
    const start = acc;
    acc += seg.percentage;
    return `${CHART_COLORS[i % CHART_COLORS.length]} ${start}% ${acc}%`;
  });
  const conicGradient = conicParts.length
    ? `conic-gradient(${conicParts.join(", ")})`
    : "var(--enroll-donut-track)";

  return (
    <div
      className="p-5 rounded-[var(--radius-xl)] border"
      style={{
        background: "var(--surface-1)",
        borderColor: "var(--border-subtle)",
      }}
    >
      <h3
        className="text-base font-semibold mb-4"
        style={{ color: "var(--text-primary)" }}
      >
        Allocation Summary
      </h3>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div
          className="relative flex-shrink-0 w-32 h-32 rounded-full"
          style={{
            background: conicGradient,
          }}
        >
          <div
            className="absolute inset-[20%] rounded-full"
            style={{
              background: "var(--surface-1)",
            }}
          />
        </div>
        <ul className="space-y-2 min-w-0">
          {normalized.map((seg, i) => (
            <li
              key={seg.name}
              className="flex items-center gap-2 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
              />
              <span className="truncate">{seg.name}</span>
              <span className="tabular-nums flex-shrink-0">{Math.round(seg.percentage)}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

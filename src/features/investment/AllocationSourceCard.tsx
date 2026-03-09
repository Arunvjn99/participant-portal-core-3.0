import { AllocationRow } from "./AllocationRow";

export interface SourceAllocation {
  pretax: number;
  roth: number;
  aftertax: number;
}

export type SourceKey = "pretax" | "roth" | "aftertax";

interface AllocationSourceCardProps {
  /** Allocation by source; total must equal 100. */
  allocation: SourceAllocation;
  /** Optional fund counts per source; defaults to derived from non-zero % */
  fundCounts?: { pretax: number; roth: number; aftertax: number };
  /** When set, each source row shows Edit and calls this with the source key */
  onEditSource?: (source: SourceKey) => void;
}

const DEFAULT_FUND_COUNTS = (a: SourceAllocation) => ({
  pretax: a.pretax > 0 ? 3 : 0,
  roth: a.roth > 0 ? 1 : 0,
  aftertax: a.aftertax > 0 ? 1 : 0,
});

/**
 * Card showing allocation by source: Pre-tax, Roth, After-tax.
 * Each row: label, fund count, percentage, progress bar.
 */
export function AllocationSourceCard({
  allocation,
  fundCounts,
  onEditSource,
}: AllocationSourceCardProps) {
  const counts = fundCounts ?? DEFAULT_FUND_COUNTS(allocation);
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
        Allocation by Source
      </h3>
      <div className="space-y-4">
        <AllocationRow
          label="Pre-tax"
          fundCount={counts.pretax}
          percentage={allocation.pretax}
          onEdit={onEditSource ? () => onEditSource("pretax") : undefined}
        />
        <AllocationRow
          label="Roth"
          fundCount={counts.roth}
          percentage={allocation.roth}
          onEdit={onEditSource ? () => onEditSource("roth") : undefined}
        />
        <AllocationRow
          label="After-tax"
          fundCount={counts.aftertax}
          percentage={allocation.aftertax}
          onEdit={onEditSource ? () => onEditSource("aftertax") : undefined}
        />
      </div>
    </div>
  );
}

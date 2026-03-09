export interface AllocationRowProps {
  /** e.g. "Pre-tax", "Roth", "After-tax" */
  label: string;
  /** Number of funds, e.g. 3 */
  fundCount: number;
  /** Percentage 0–100 */
  percentage: number;
  /** Optional edit handler to open allocation editor for this source */
  onEdit?: () => void;
}

/**
 * Single row: label, fund count, percentage, progress bar. Optional Edit.
 */
export function AllocationRow({ label, fundCount, percentage, onEdit }: AllocationRowProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span
          className="text-sm font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          {label} ({fundCount} funds)
        </span>
        <div className="flex items-center gap-2">
          <span
            className="text-sm tabular-nums"
            style={{ color: "var(--text-secondary)" }}
          >
            {percentage}%
          </span>
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="text-xs font-medium"
              style={{ color: "var(--brand-primary)" }}
            >
              Edit
            </button>
          )}
        </div>
      </div>
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ background: "var(--enroll-soft-bg)" }}
      >
        <div
          className="h-full rounded-full transition-[width] duration-300"
          style={{
            width: `${Math.min(100, Math.max(0, percentage))}%`,
            background: "var(--brand-primary)",
          }}
        />
      </div>
    </div>
  );
}

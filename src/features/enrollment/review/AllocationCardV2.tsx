import { Link } from "react-router-dom";
import { Edit } from "lucide-react";

export interface AllocationBarItem {
  label: string;
  percent: number;
  /** CSS variable for bar color, e.g. --brand-primary */
  colorVar?: string;
}

export interface AllocationCardV2Props {
  title: string;
  /** Optional edit link (e.g. to investment step) */
  editHref?: string;
  editLabel?: string;
  items: AllocationBarItem[];
  className?: string;
}

/**
 * Asset class / allocation summary: title, optional Edit, list of label + percent + bar.
 * Layout only; no allocation logic.
 */
export function AllocationCardV2({
  title,
  editHref,
  editLabel = "Edit",
  items,
  className = "",
}: AllocationCardV2Props) {
  return (
    <div
      className={`rounded-xl border p-4 ${className}`}
      style={{
        background: "var(--surface-1)",
        borderColor: "var(--border-subtle)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--text-primary)" }}>
          {title}
        </h2>
        {editHref && (
          <Link
            to={editHref}
            className="text-xs font-medium flex items-center gap-1 transition-colors hover:opacity-80"
            style={{ color: "var(--brand-primary)" }}
          >
            <Edit className="w-3 h-3" />
            {editLabel}
          </Link>
        )}
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                {item.label}
              </span>
              <span className="text-xl font-black" style={{ color: item.colorVar ? `var(${item.colorVar})` : "var(--brand-primary)" }}>
                {item.percent}%
              </span>
            </div>
            <div
              className="relative h-3 rounded-full overflow-hidden"
              style={{ background: "var(--surface-2)" }}
            >
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-all"
                style={{
                  width: `${Math.min(100, Math.max(0, item.percent))}%`,
                  background: item.colorVar ? `var(${item.colorVar})` : "var(--brand-primary)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

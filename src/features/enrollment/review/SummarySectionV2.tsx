import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Edit } from "lucide-react";

export interface SummarySectionV2Props {
  title: string;
  /** Optional: path for Edit link (e.g. ENROLLMENT_V2_STEP_PATHS[1]) */
  editHref?: string;
  editLabel?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Reusable summary block with optional Edit link. Layout only; no logic.
 */
export function SummarySectionV2({
  title,
  editHref,
  editLabel = "Edit",
  children,
  className = "",
}: SummarySectionV2Props) {
  return (
    <div
      className={`rounded-xl border p-6 ${className}`}
      style={{
        background: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-[var(--color-text-primary)]">
          {title}
        </h2>
        {editHref && (
          <Link
            to={editHref}
            className="text-xs font-medium flex items-center gap-1 transition-colors hover:opacity-80 text-[var(--color-primary)]"
          >
            <Edit className="w-3 h-3" />
            {editLabel}
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}

import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";

export interface InsightCardProps {
  title?: string;
  message: string;
  tone?: "positive" | "neutral" | "warning";
  /** Wizard variant: gradient border, icon, optional action */
  variant?: "default" | "wizard";
  /** Icon shown in wizard variant (default: Sparkles) */
  icon?: ReactNode;
  /** Optional action button label (wizard variant) */
  actionLabel?: string;
  /** Optional action handler (wizard variant) */
  onAction?: () => void;
  /** Optional badge text (e.g. "Popular") */
  badge?: string;
}

export function InsightCard({
  title,
  message,
  tone = "neutral",
  variant = "default",
  icon,
  actionLabel,
  onAction,
  badge,
}: InsightCardProps) {
  if (variant === "wizard") {
    return (
      <div
        className="rounded-xl border p-3 shadow-sm"
        style={{
          borderColor: "rgba(37, 99, 235, 0.35)",
          background: "linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(124, 58, 237, 0.06) 100%)",
        }}
        role="region"
        aria-live="polite"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2 min-w-0 flex-1">
            <div
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white"
              style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)" }}
              aria-hidden
            >
              {icon ?? <Sparkles className="h-3.5 w-3.5" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-0.5 flex flex-wrap items-center gap-1.5">
                {title && (
                  <h3 className="text-sm font-semibold text-[var(--color-text)]">{title}</h3>
                )}
                {badge && (
                  <span className="rounded-full px-1.5 py-0.5 text-xs font-medium" style={{ backgroundColor: "rgba(37, 99, 235, 0.2)", color: "#2563EB" }}>
                    {badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--color-textSecondary)]">{message}</p>
            </div>
          </div>
          {actionLabel && onAction && (
            <button
              type="button"
              onClick={onAction}
              className="shrink-0 self-end text-sm font-medium text-[#2563EB] hover:underline focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2 rounded px-1 sm:self-auto"
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`insight-card insight-card--${tone}`} role="status" aria-live="polite">
      {title && <h4 className="insight-card__title">{title}</h4>}
      <p className="insight-card__message">{message}</p>
    </div>
  );
}

/**
 * SummaryCard — Key-value summary displayed inline in the chat stream.
 *
 * Used for account snapshots, review screens, and completion states.
 * Supports optional action buttons and color-coded status badges.
 */

import { motion, useReducedMotion } from "framer-motion";

export interface SummaryRow {
  label: string;
  value: string;
  /** Optional color accent: "default" | "success" | "warning" | "info" */
  accent?: "default" | "success" | "warning" | "info";
}

export interface SummaryAction {
  label: string;
  variant: "primary" | "secondary";
  onClick: () => void;
}

export interface SummaryCardProps {
  title: string;
  rows: SummaryRow[];
  actions?: SummaryAction[];
  /** Optional status banner at top (e.g. "Eligible", "Submitted") */
  status?: { label: string; type: "success" | "info" | "warning" };
}

const ACCENT_CLASSES: Record<string, string> = {
  default: "text-slate-800 dark:text-slate-100",
  success: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400",
  info: "text-sky-600 dark:text-sky-400",
};

const STATUS_CLASSES: Record<string, string> = {
  success: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  info: "bg-sky-500/10 border-sky-500/20 text-sky-400",
  warning: "bg-amber-500/10 border-amber-500/20 text-amber-400",
};

export function SummaryCard({ title, rows, actions, status }: SummaryCardProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="rounded-xl border border-slate-300 bg-slate-50/90 shadow-lg overflow-hidden dark:border-slate-700/50 dark:bg-slate-800/80"
    >
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-slate-200 flex items-center justify-between dark:border-slate-700/40">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</h4>
        {status && (
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${STATUS_CLASSES[status.type]}`}>
            {status.label}
          </span>
        )}
      </div>

      {/* Rows */}
      <div className="px-4 py-3 space-y-2">
        {rows.map((row, i) => (
          <motion.div
            key={row.label}
            initial={reduced ? false : { opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, duration: 0.15 }}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <span className="text-slate-500 dark:text-slate-400">{row.label}</span>
            <span className={`font-medium tabular-nums ${ACCENT_CLASSES[row.accent || "default"]}`}>
              {row.value}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      {actions && actions.length > 0 && (
        <div className="px-4 py-3 border-t border-slate-200 flex flex-wrap gap-2 dark:border-slate-700/40">
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={action.onClick}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                ${action.variant === "primary"
                  ? "bg-primary text-white hover:bg-primary-hover"
                  : "border border-slate-400 text-slate-600 hover:bg-slate-200 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                }
              `}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

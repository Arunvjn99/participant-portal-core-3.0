/**
 * InteractiveOption — A single selectable option card inside a group.
 *
 * Supports: label, hint, optional badge (e.g. "Recommended"), selected state.
 * Presentation-only. No hard-coded flow logic.
 */

import { motion, useReducedMotion } from "framer-motion";

export interface InteractiveOptionProps {
  label: string;
  hint?: string;
  badge?: string;
  selected?: boolean;
  onClick: () => void;
  /** Delay for staggered animation */
  index?: number;
}

export function InteractiveOption({
  label,
  hint,
  badge,
  selected = false,
  onClick,
  index = 0,
}: InteractiveOptionProps) {
  const reduced = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className={`
        w-full rounded-lg border-2 p-3 text-left transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800
        ${selected
          ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/30 dark:text-white"
          : "border-slate-300 bg-slate-100 text-slate-700 hover:border-slate-400 hover:bg-slate-200 dark:border-slate-600/60 dark:bg-slate-700/40 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-700/70"
        }
      `}
      aria-pressed={selected}
      aria-label={`${label}${hint ? `: ${hint}` : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <span className="block text-sm font-semibold">{label}</span>
          {hint && <span className="block text-[11px] text-slate-500 mt-0.5 dark:text-slate-400">{hint}</span>}
        </div>
        {badge && (
          <span className="shrink-0 rounded-full bg-primary/10 border border-primary/30 px-2 py-0.5 text-[10px] font-medium text-primary">
            {badge}
          </span>
        )}
      </div>
    </motion.button>
  );
}

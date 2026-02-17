import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface ProgressBarProps {
  value: number;
  max?: number;
  height?: number;
  /** CSS variable or color for fill; default --color-primary */
  barColor?: string;
}

/**
 * Progress bar for status tracking and completion states.
 * Uses design tokens only.
 */
export const ProgressBar = memo(function ProgressBar({ value, max = 100, height = 6, barColor }: ProgressBarProps) {
  const reduced = !!useReducedMotion();
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const fillStyle = barColor ?? "var(--color-primary)";

  return (
    <div
      className="w-full overflow-hidden rounded-[var(--radius-full)]"
      style={{
        height,
        background: "var(--color-border)",
      }}
    >
      <motion.div
        initial={reduced ? false : { width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="h-full rounded-[var(--radius-full)]"
        style={{ background: fillStyle }}
      />
    </div>
  );
});

import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface ProgressBarProps {
  value: number;
  max?: number;
  /** Optional label (e.g. "65%") */
  label?: string;
  /** Bar height in pixels */
  height?: number;
}

/**
 * Reusable progress bar. Uses design tokens only.
 */
export const ProgressBar = memo(function ProgressBar({
  value,
  max = 100,
  label,
  height = 8,
}: ProgressBarProps) {
  const reduced = !!useReducedMotion();
  const pct = Math.min(100, Math.max(0, max ? (value / max) * 100 : 0));

  return (
    <div className="w-full">
      <div
        className="w-full overflow-hidden rounded-[var(--radius-full)]"
        style={{
          height,
          background: "var(--color-border)",
        }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <motion.div
          initial={reduced ? false : { width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="h-full rounded-[var(--radius-full)]"
          style={{ background: "var(--color-primary)" }}
        />
      </div>
      {label != null && (
        <p className="mt-1 text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>
          {label}
        </p>
      )}
    </div>
  );
});

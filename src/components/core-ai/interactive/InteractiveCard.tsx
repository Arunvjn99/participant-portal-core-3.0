/**
 * InteractiveCard — Container card for interactive blocks inside the chat.
 *
 * Matches Core AI dark theme. Used as a wrapper for option groups,
 * sliders, summaries, and other structured UI in the conversation stream.
 */

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export interface InteractiveCardProps {
  /** Optional heading shown at the top of the card */
  title?: string;
  /** Optional subtitle / hint below the title */
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function InteractiveCard({ title, subtitle, children, className = "" }: InteractiveCardProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] backdrop-blur-sm shadow-lg overflow-hidden ${className}`}
    >
      {title && (
        <div className="px-4 py-3 border-b border-[var(--color-border)]">
          <h4 className="text-sm font-semibold text-[var(--color-text)]">{title}</h4>
          {subtitle && <p className="text-[11px] text-[var(--color-textSecondary)] mt-0.5">{subtitle}</p>}
        </div>
      )}
      <div className="px-4 py-3">{children}</div>
    </motion.div>
  );
}

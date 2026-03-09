/**
 * "Need help deciding?" card for Choose Plan step — Figma parity.
 * Content: title, description, "View Detailed Comparison" button.
 */
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export interface HelpDecisionCardProps {
  title: string;
  description: string;
  buttonLabel: string;
  onButtonClick?: () => void;
  className?: string;
}

export function HelpDecisionCard({
  title,
  description,
  buttonLabel,
  onButtonClick,
  className = "",
}: HelpDecisionCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      aria-label={title}
      className={
        `rounded-2xl border border-[var(--enroll-card-border)] shadow-sm p-6 ` +
        `flex flex-col md:flex-row md:items-center md:justify-between gap-6 ${className}`
      }
      style={{ background: "var(--enroll-card-bg)" }}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-4">
          <div
            className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border border-[var(--enroll-card-border)]"
            style={{ background: "var(--enroll-soft-bg)", color: "var(--enroll-brand)" }}
            aria-hidden
          >
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--enroll-text-primary)" }}>
              {title}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--enroll-text-secondary)" }}>
              {description}
            </p>
          </div>
        </div>
      </div>
      <motion.button
        type="button"
        onClick={onButtonClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex-shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity text-white"
        style={{ background: "linear-gradient(135deg, var(--enroll-brand), var(--enroll-accent))" }}
      >
        {buttonLabel}
      </motion.button>
    </motion.section>
  );
}

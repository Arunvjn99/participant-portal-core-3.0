/**
 * Reusable review summary card: white card, border, shadow, title row with optional Edit link.
 * Figma parity: bg-white border border-gray-200 rounded-xl p-5.
 */
import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Edit, ChevronRight } from "lucide-react";

export interface ReviewSummaryCardProps {
  title: string;
  /** Path for Edit link (e.g. ENROLLMENT_V2_STEP_PATHS[1]) */
  editHref?: string;
  editLabel?: string;
  children: ReactNode;
  className?: string;
  /** Optional delay for stagger animation */
  animationDelay?: number;
  /** Optional icon in header (e.g. Percent, Target) */
  icon?: ReactNode;
  /** Optional colored top strip for Figma section style: blue, purple, green, teal, amber */
  accentStrip?: "blue" | "purple" | "green" | "teal" | "amber";
}

const ACCENT_STRIP_STYLE: Record<NonNullable<ReviewSummaryCardProps["accentStrip"]>, CSSProperties> = {
  blue: { background: "var(--color-primary)" },
  purple: { background: "var(--color-primary)" },
  green: { background: "var(--color-success)" },
  teal: { background: "var(--color-primary)" },
  amber: { background: "var(--color-warning)" },
};

export function ReviewSummaryCard({
  title,
  editHref,
  editLabel = "Edit",
  children,
  className = "",
  animationDelay = 0,
  icon,
  accentStrip,
}: ReviewSummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: animationDelay }}
      className={`overflow-hidden rounded-xl border ${className}`}
      style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
    >
      {accentStrip && (
        <div
          className="h-1.5 w-full"
          style={{ minHeight: 6, ...ACCENT_STRIP_STYLE[accentStrip] }}
          aria-hidden
        />
      )}
      <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            {title}
          </h2>
        </div>
        {editHref && (
          <Link
            to={editHref}
            className="text-sm font-semibold flex items-center gap-1 transition-colors hover:opacity-90"
            className="text-[var(--color-primary)]"
          >
            <Edit className="w-3.5 h-3.5" />
            {editLabel}
            <ChevronRight className="w-3.5 h-3.5" aria-hidden />
          </Link>
        )}
      </div>
      {children}
      </div>
    </motion.div>
  );
}

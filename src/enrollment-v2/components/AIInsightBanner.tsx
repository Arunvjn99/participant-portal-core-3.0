import type { ReactNode } from "react";
import { motion } from "framer-motion";

export interface AIInsightBannerProps {
  /** Icon (e.g. Zap) rendered inside the icon container */
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

/**
 * Reusable AI insight banner for the contribution step.
 * Design: rounded-xl, gradient background (purple-50 to indigo-50), icon container, title + description.
 * Dark mode: uses theme surface/border tokens for compatibility.
 */
export function AIInsightBanner({ icon, title, description, className = "" }: AIInsightBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className={`overflow-hidden relative p-5 border rounded-2xl enrollment-card ${className}`}
      style={{
        background: "var(--contrib-ai-banner-bg, var(--enroll-soft-bg))",
        borderColor: "var(--contrib-ai-banner-border, var(--enroll-card-border))",
        boxShadow: "var(--enroll-elevation-2)",
      }}
    >
      <div className="relative flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
          style={{
            background: "var(--contrib-ai-icon-bg, linear-gradient(135deg, var(--enroll-brand), var(--enroll-accent)))",
            color: "var(--contrib-ai-icon-color)",
            boxShadow: "var(--contrib-ai-icon-shadow)",
          }}
          aria-hidden
        >
          {icon}
        </div>
        <div>
          <h4 className="font-bold mb-1 text-sm" style={{ color: "var(--enroll-text-primary)" }}>
            <span style={{ color: "var(--enroll-brand)" }}>AI Insight</span> — {title}
          </h4>
          <p className="text-sm leading-relaxed" style={{ color: "var(--enroll-text-secondary)" }}>
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

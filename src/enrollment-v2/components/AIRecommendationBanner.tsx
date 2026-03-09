/**
 * AI Recommendation banner for the Investment step.
 * Matches Figma: gradient indigo/purple/blue, Sparkles icon, optional Ask AI button.
 */
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export interface AIRecommendationBannerProps {
  title: string;
  description: string;
  onAskAI?: () => void;
  className?: string;
}

export function AIRecommendationBanner({
  title,
  description,
  onAskAI,
  className = "",
}: AIRecommendationBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`rounded-2xl border border-[var(--enroll-card-border)] p-5 shadow-sm ${className}`}
      style={{
        background: "var(--contrib-ai-banner-bg, var(--enroll-soft-bg))",
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
          style={{
            background: "var(--contrib-ai-icon-bg, var(--enroll-brand))",
            color: "var(--contrib-ai-icon-color, #fff)",
            boxShadow: "var(--contrib-ai-icon-shadow, 0 1px 3px rgba(0,0,0,0.1))",
          }}
          aria-hidden
        >
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base mb-1.5" style={{ color: "var(--enroll-text-primary)" }}>
            <span style={{ color: "var(--enroll-brand)" }}>AI Insight</span> — {title}
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: "var(--enroll-text-secondary)" }}>
            {description}
          </p>
        </div>
        {onAskAI && (
          <button
            type="button"
            onClick={onAskAI}
            className="flex-shrink-0 text-sm font-medium px-3 py-1.5 rounded-lg border transition-all duration-150 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--enroll-brand)] focus-visible:ring-offset-2"
            style={{
              borderColor: "var(--enroll-card-border)",
              color: "var(--enroll-brand)",
              background: "transparent",
            }}
          >
            Ask AI
          </button>
        )}
      </div>
    </motion.div>
  );
}

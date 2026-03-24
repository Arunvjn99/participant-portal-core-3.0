import { memo } from "react";
import { motion } from "framer-motion";
import { AiCoreBridgeButton } from "@/components/ai/AiCoreBridgeButton";

interface InsightCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  impact?: string;
  actionLabel?: string;
  onAction?: () => void;
  index?: number;
  /** When true, used inside another card — no border, no entrance animation */
  embedded?: boolean;
  /** Opens Core AI with this context after the primary CTA. */
  coreAiPrompt?: string;
}

/**
 * AI Insight card with staggered entrance, hover glow, and optional action.
 */
export const InsightCard = memo(function InsightCard({
  icon,
  title,
  description,
  impact,
  actionLabel,
  onAction,
  index = 0,
  embedded = false,
  coreAiPrompt,
}: InsightCardProps) {
  const content = (
    <>
      <div className="flex items-start gap-3">
        {icon && (
          <div
            className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm"
            style={{
              background: "rgb(var(--enroll-brand-rgb) / 0.08)",
              color: "var(--enroll-brand)",
            }}
          >
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold" style={{ color: "var(--enroll-text-primary)" }}>
            {title}
          </p>
          <p
            className="text-[11px] mt-0.5 leading-relaxed"
            style={{ color: "var(--enroll-text-secondary)" }}
          >
            {description}
          </p>
          {impact && (
            <span
              className="inline-block text-[10px] font-semibold mt-1.5 px-2 py-0.5 rounded-full"
              style={{
                background: "rgb(var(--enroll-accent-rgb) / 0.08)",
                color: "var(--enroll-accent)",
              }}
            >
              {impact}
            </span>
          )}
        </div>
      </div>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="ai-recommendation mt-3 w-full cursor-pointer rounded-lg border border-[var(--ai-border)] py-1.5 text-[11px] font-semibold transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99]"
          style={{
            background: "var(--ai-bg-soft)",
            color: "var(--ai-primary)",
          }}
        >
          {actionLabel}
        </button>
      )}
      {coreAiPrompt ? (
        <div className="mt-2">
          <AiCoreBridgeButton prompt={coreAiPrompt} />
        </div>
      ) : null}
    </>
  );

  if (embedded) {
    return <div className="min-w-0">{content}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.08 * index, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ boxShadow: "0 0 22px color-mix(in srgb, var(--ai-primary) 12%, transparent)" }}
      className="ai-insight rounded-xl p-4 transition-all"
      style={{
        background: "var(--color-bg-surface, var(--enroll-card-bg))",
        border: "1px solid var(--ai-border)",
      }}
    >
      {content}
    </motion.div>
  );
});

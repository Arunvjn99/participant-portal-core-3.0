import { Sparkles } from "lucide-react";

interface AIRecommendationCardProps {
  /** Recommendation text, e.g. "At age 31 with 34 years to retirement, Aggressive offers the best balance of growth and stability." */
  text: string;
}

/**
 * AI Recommendation card — shows recommendation text with sparkles icon.
 * Uses design tokens for surface and text.
 */
export function AIRecommendationCard({ text }: AIRecommendationCardProps) {
  return (
    <div
      className="flex gap-3 p-4 rounded-[var(--radius-xl)] border"
      style={{
        background: "var(--surface-1)",
        borderColor: "var(--border-subtle)",
      }}
    >
      <div
        className="flex-shrink-0 w-9 h-9 rounded-[var(--radius-lg)] flex items-center justify-center"
        style={{ background: "var(--enroll-soft-bg)" }}
      >
        <Sparkles className="w-5 h-5" style={{ color: "var(--brand-primary)" }} aria-hidden />
      </div>
      <div className="min-w-0">
        <p
          className="text-sm font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          AI Recommendation
        </p>
        <p
          className="mt-1 text-sm leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          {text}
        </p>
      </div>
    </div>
  );
}

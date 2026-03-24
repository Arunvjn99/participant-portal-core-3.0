import { Sparkles } from "lucide-react";

export type AiFallbackCardProps = {
  query: string;
  onActivate: () => void;
};

/**
 * Primary CTA when local command matches are empty — routes through the same submit pipeline as Enter.
 */
export function AiFallbackCard({ query, onActivate }: AiFallbackCardProps) {
  const q = query.trim();
  const display = q || "your question";

  return (
    <button
      type="button"
      className="ai-command-ai-card"
      onClick={onActivate}
      aria-label={`Ask Core AI about ${display}`}
    >
      <span className="ai-command-ai-card__glow" aria-hidden />
      <span className="ai-command-ai-card__icon-wrap" aria-hidden>
        <Sparkles className="ai-command-ai-card__icon" strokeWidth={2} />
      </span>
      <span className="ai-command-ai-card__label">Ask Core AI</span>
      <span className="ai-command-ai-card__query">&ldquo;{display}&rdquo;</span>
    </button>
  );
}

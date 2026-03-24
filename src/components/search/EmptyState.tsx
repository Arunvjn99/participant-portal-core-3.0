import { Search } from "lucide-react";

export type EmptyStateProps = {
  query: string;
  listLabelId: string;
};

/**
 * Shown when the filtered command list has no matches (before the AI fallback CTA).
 */
export function EmptyState({ query, listLabelId }: EmptyStateProps) {
  const q = query.trim();

  return (
    <div className="ai-command-empty" role="status" aria-labelledby={listLabelId}>
      <span className="ai-command-empty__icon-wrap" aria-hidden>
        <Search className="ai-command-empty__icon" strokeWidth={1.75} />
      </span>
      <p id={listLabelId} className="ai-command-empty__title">
        No results found for &lsquo;{q}&rsquo;
      </p>
      <p className="ai-command-empty__sub">Try asking AI instead</p>
    </div>
  );
}

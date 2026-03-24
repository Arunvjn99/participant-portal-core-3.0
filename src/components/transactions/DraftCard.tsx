export type DraftCardProps = {
  title: string;
  progressPct: number;
  onResume?: () => void;
};

/**
 * Draft transaction row with a custom CSS progress bar (consistent cross-browser).
 */
export function DraftCard({ title, progressPct, onResume }: DraftCardProps) {
  const pct = Math.min(100, Math.max(0, progressPct));
  return (
    <div className="txn-draft-card">
      <p className="txn-draft-card__title">{title}</p>
      <div className="txn-draft-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`Progress ${pct}%`}>
        <div className="txn-draft-bar__fill" style={{ width: `${pct}%` }} />
      </div>
      {onResume ? (
        <button type="button" className="btn btn-outline btn-sm txn-draft-card__btn" onClick={onResume}>
          Resume
        </button>
      ) : null}
    </div>
  );
}

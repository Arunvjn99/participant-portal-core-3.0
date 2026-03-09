interface InvestorProfileCardProps {
  /** e.g. "Aggressive Investor" */
  profileName: string;
  onEdit?: () => void;
}

/**
 * Right sidebar card: profile name + Edit button.
 * Uses design tokens.
 */
export function InvestorProfileCard({ profileName, onEdit }: InvestorProfileCardProps) {
  return (
    <div
      className="p-5 rounded-[var(--radius-xl)] border"
      style={{
        background: "var(--surface-1)",
        borderColor: "var(--border-subtle)",
      }}
    >
      <h3
        className="text-base font-semibold"
        style={{ color: "var(--text-primary)" }}
      >
        Investor Profile
      </h3>
      <p
        className="mt-2 text-sm"
        style={{ color: "var(--text-secondary)" }}
      >
        {profileName}
      </p>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="mt-3 text-sm font-medium transition-opacity hover:opacity-80"
          style={{ color: "var(--brand-primary)" }}
        >
          Edit
        </button>
      )}
    </div>
  );
}

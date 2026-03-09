interface FundSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onAddClick: () => void;
  placeholder?: string;
  addButtonLabel?: string;
}

/**
 * Search input for funds with "Add Investments" button.
 * Uses design tokens only.
 */
export function FundSearchInput({
  value,
  onChange,
  onAddClick,
  placeholder = "Search funds...",
  addButtonLabel = "Add Investments",
}: FundSearchInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="fund-search" className="sr-only">
        Search funds
      </label>
      <input
        id="fund-search"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-sm rounded-[var(--radius-lg)] border px-3 py-2"
        style={{
          background: "var(--surface-1)",
          borderColor: "var(--border-subtle)",
          color: "var(--text-primary)",
        }}
        aria-label="Search funds"
      />
      <button
        type="button"
        onClick={onAddClick}
        className="text-sm font-medium px-4 py-2 rounded-[var(--radius-lg)] border transition-opacity hover:opacity-90 w-fit"
        style={{
          background: "var(--surface-1)",
          borderColor: "var(--border-subtle)",
          color: "var(--brand-primary)",
        }}
      >
        {addButtonLabel}
      </button>
    </div>
  );
}

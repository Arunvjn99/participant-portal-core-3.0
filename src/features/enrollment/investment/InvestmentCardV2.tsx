import type { ReactNode } from "react";

export interface InvestmentCardV2Props {
  title: string;
  subtitle?: string;
  isSelected?: boolean;
  onSelect?: () => void;
  children: ReactNode;
  className?: string;
}

/**
 * Card for investment profile option. Theme tokens only.
 */
export function InvestmentCardV2({
  title,
  subtitle,
  isSelected,
  onSelect,
  children,
  className = "",
}: InvestmentCardV2Props) {
  const isInteractive = typeof onSelect === "function";

  return (
    <div
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onSelect}
      onKeyDown={
        isInteractive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect?.();
              }
            }
          : undefined
      }
      className={`rounded-2xl border-2 p-6 transition-all duration-300 ${className} ${
        isInteractive ? "cursor-pointer hover:shadow-lg" : ""
      } ${
        isSelected
          ? "border-[var(--brand-primary)] shadow-lg ring-2 ring-[var(--brand-primary)]/20"
          : "border-[var(--border-subtle)]"
      }`}
      style={{
        background: "var(--surface-1)",
        color: "var(--text-primary)",
      }}
    >
      <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
        {title}
      </h3>
      {subtitle != null && (
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          {subtitle}
        </p>
      )}
      <div className="mt-4">{children}</div>
    </div>
  );
}

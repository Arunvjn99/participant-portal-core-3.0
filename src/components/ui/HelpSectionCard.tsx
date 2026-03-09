import type { ReactNode } from "react";

/**
 * Reusable help/CTA card matching Figma: soft elevated panel with icon, title, description, and button.
 * Used on Choose Plan ("Need help deciding?") and can be reused elsewhere.
 * No shadow or hover/tap animation.
 */
export interface HelpSectionCardProps {
  /** Card title */
  title: string;
  /** Body text */
  description: string;
  /** Button label */
  buttonLabel: string;
  /** Button click handler */
  onButtonClick?: () => void;
  /** Optional icon (e.g. Sparkles) - rendered in 48x48 rounded container next to title */
  icon?: ReactNode;
  /** Optional icon inside the button (e.g. Eye) */
  buttonIcon?: ReactNode;
  /** Optional className for the wrapper */
  className?: string;
}

export function HelpSectionCard({
  title,
  description,
  buttonLabel,
  onButtonClick,
  icon,
  buttonIcon,
  className = "",
}: HelpSectionCardProps) {
  return (
    <div className={`help-section-card overflow-hidden rounded-[var(--radius-2xl)] border ${className}`}>
      <div className="help-section-card__inner flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              {icon != null && (
                <div
                  className="help-section-card__icon-wrap flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-lg)]"
                  aria-hidden
                >
                  {icon}
                </div>
              )}
              <h2 className="help-section-card__title leading-8 tracking-[0.07px]">
                {title}
              </h2>
            </div>
            <p className="help-section-card__description font-normal leading-6 tracking-[-0.31px]">
              {description}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onButtonClick}
          className="help-section-card__button flex h-10 shrink-0 items-center justify-center gap-2 rounded-[var(--radius-sm)] px-4 font-semibold leading-5 tracking-[-0.15px] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent)]"
        >
          {buttonIcon != null && <span className="flex h-4 w-4 shrink-0 items-center justify-center" aria-hidden>{buttonIcon}</span>}
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}

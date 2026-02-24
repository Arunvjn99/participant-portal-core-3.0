/**
 * CORE product branding for pre-auth pages (Login, Signup, Forgot Password, etc.).
 * Left-aligned logo + tagline. Do not use tenant logo or ThemeContext here.
 */
interface CoreProductBrandingProps {
  className?: string;
  /** Optional: show "by Congruent Solutions" subtext */
  showByline?: boolean;
  /** Optional: class for the logo img (e.g. h-10 w-auto) */
  imgClassName?: string;
}

export const CoreProductBranding = ({
  className = "",
  showByline = true,
  imgClassName = "h-10 w-auto object-contain mb-2",
}: CoreProductBrandingProps) => (
  <div className={`flex flex-col items-start mb-6 ${className}`.trim()}>
    <img
      src="/image/core-logo.png"
      alt="CORE"
      className={imgClassName}
    />
    <p className="text-sm text-[var(--color-text-secondary)]">
      Retirement Intelligence Platform
    </p>
    {showByline && (
      <span className="text-xs text-[var(--color-text-secondary)] opacity-80 mt-0.5">
        by Congruent Solutions
      </span>
    )}
  </div>
);

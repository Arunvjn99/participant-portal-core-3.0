import type { ReactNode } from "react";

/**
 * Reusable section heading matching Figma: gradient title, subtitle, vertical accent bar.
 * Used on Choose Plan and can be reused on other enrollment or content pages.
 */
export interface SectionHeadingWithAccentProps {
  /** Main heading (e.g. "Choose Your Retirement Plan") */
  title: string;
  /** Subtitle below the title */
  subtitle?: string;
  /** Optional custom content instead of title/subtitle */
  children?: ReactNode;
  /** Optional className for the wrapper */
  className?: string;
  /** Accent bar position: left (default, -16px offset) or none */
  accentPosition?: "left" | "none";
}

export function SectionHeadingWithAccent({
  title,
  subtitle,
  children,
  className = "",
  accentPosition = "left",
}: SectionHeadingWithAccentProps) {
  return (
    <div className={`section-heading-accent relative ${className}`}>
      {accentPosition === "left" && (
        <div
          className="section-heading-accent__bar absolute left-0 top-0 w-1 h-12 rounded-full"
          aria-hidden
        />
      )}
      <div className={accentPosition === "left" ? "pl-4" : ""}>
        {children != null ? (
          children
        ) : (
          <>
            <h1 className="section-heading-accent__title text-3xl font-bold leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="section-heading-accent__subtitle mt-3 text-base font-normal leading-7" style={{ color: "var(--enroll-text-secondary)" }}>
                {subtitle}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

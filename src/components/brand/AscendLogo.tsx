/**
 * Ascend logo from Figma (node 77-8361): overlapping angled shapes + "Ascend" text.
 * Theme-aware for light and dark mode.
 */
interface AscendLogoProps {
  className?: string;
  /** "full" = icon + Ascend text (auth). "icon" = icon only (dashboard + label). */
  variant?: "full" | "icon";
}

export const AscendLogo = ({ className = "", variant = "full" }: AscendLogoProps) => {
  return (
    <div
      className={`inline-flex items-center gap-2.5 ${className}`.trim()}
      role="img"
      aria-label="Ascend"
    >
      {/* Icon: two overlapping angled parallelograms suggesting upward motion */}
      <svg
        viewBox="0 0 36 32"
        className="h-8 w-8 shrink-0 sm:h-9 sm:w-9"
        aria-hidden
      >
        {/* Back shape (darker blue) */}
        <path
          d="M4 8 L20 8 L28 24 L12 24 Z"
          className="fill-blue-700 dark:fill-blue-500"
        />
        {/* Front shape (brighter blue) */}
        <path
          d="M0 14 L14 14 L22 30 L8 30 Z"
          className="fill-blue-600 dark:fill-blue-400"
        />
      </svg>
      {variant === "full" && (
        <span className="font-serif text-lg font-semibold tracking-tight text-blue-600 dark:text-blue-400 sm:text-xl">
          Ascend
        </span>
      )}
    </div>
  );
};

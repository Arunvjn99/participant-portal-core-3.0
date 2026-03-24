import { cn } from "@/lib/utils";
import { CORE_AI_LOGO_URL } from "@/constants/coreAiLogo";

export interface CoreAiBrandMarkProps {
  className?: string;
  /** Subtle scale pulse (e.g. legacy grid tile). */
  animated?: boolean;
  loading?: "eager" | "lazy";
  /** Use white-tinted glow (for placement on primary-colored backgrounds). */
  inverted?: boolean;
}

/**
 * Core AI brand mark: 48×48 (md 56×56), radial glow, hi-res PNG with drop-shadow.
 */
export function CoreAiBrandMark({ className, animated, loading, inverted }: CoreAiBrandMarkProps) {
  const outerGlow = inverted
    ? "bg-[radial-gradient(circle_at_50%_45%,rgb(var(--color-text-inverse-rgb)/0.35)_0%,rgb(var(--color-text-inverse-rgb)/0.12)_50%,transparent_72%)]"
    : "bg-[radial-gradient(circle_at_50%_45%,rgb(var(--color-primary-rgb)/0.42)_0%,rgb(var(--color-primary-rgb)/0.14)_50%,transparent_72%)]";

  const innerGlow = inverted
    ? "bg-[radial-gradient(circle_at_50%_50%,rgb(var(--color-text-inverse-rgb)/0.18)_0%,transparent_62%)] ring-[rgb(var(--color-text-inverse-rgb)/0.18)]"
    : "bg-[radial-gradient(circle_at_50%_50%,rgb(var(--color-primary-rgb)/0.2)_0%,transparent_62%)] ring-[var(--color-border)]";

  const shadow = inverted
    ? "drop-shadow(0 6px 16px rgb(0 0 0 / 0.25)) drop-shadow(0 2px 4px rgb(0 0 0 / 0.12))"
    : "drop-shadow(0 6px 16px rgb(var(--color-primary-rgb) / 0.38)) drop-shadow(0 2px 4px rgb(0 0 0 / 0.08))";

  return (
    <div
      className={cn(
        "relative flex h-12 w-12 shrink-0 items-center justify-center md:h-14 md:w-14",
        animated &&
          "origin-center animate-ai-assistant-breathe transition-transform duration-200 ease-out motion-reduce:animate-none motion-reduce:transform-none",
        className,
      )}
      aria-hidden
    >
      <div
        className={cn(
          "pointer-events-none absolute -inset-[3px] rounded-[13px] opacity-95 blur-[6px] motion-reduce:blur-none motion-reduce:opacity-100",
          outerGlow,
        )}
        aria-hidden
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset",
          innerGlow,
        )}
        aria-hidden
      />
      <img
        src={CORE_AI_LOGO_URL}
        alt=""
        width={512}
        height={512}
        className="relative z-10 h-[88%] w-[88%] object-contain object-center"
        style={{ filter: shadow }}
        decoding="async"
        loading={loading}
      />
    </div>
  );
}

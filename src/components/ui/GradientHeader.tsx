import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";

export interface GradientHeaderProps {
  title: string;
  subtitle?: string;
  /** Optional decorative icon (default: Sparkles) */
  icon?: ReactNode;
  /** CSS background value (e.g. linear-gradient). When set, overrides default. */
  background?: string;
  /** Opacity of the decorative icon in top right (default 0.3) */
  decorativeIconOpacity?: number;
  className?: string;
}

const DEFAULT_GRADIENT = "linear-gradient(135deg, var(--color-primary), var(--color-primary-light))";

export function GradientHeader({
  title,
  subtitle,
  icon,
  background = DEFAULT_GRADIENT,
  decorativeIconOpacity = 0.3,
  className = "",
}: GradientHeaderProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-t-2xl px-6 pt-6 pb-5 text-white ${className}`}
      style={{ background }}
    >
      <div className="absolute right-2 top-2" style={{ opacity: decorativeIconOpacity }} aria-hidden>
        {icon ?? <Sparkles className="h-12 w-12" />}
      </div>
      <div className="relative z-10">
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="mt-1 text-sm opacity-90">{subtitle}</p>}
      </div>
    </div>
  );
}

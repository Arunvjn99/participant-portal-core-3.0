import { Zap } from "lucide-react";

/**
 * Trust / positioning line under the command palette search field (high contrast, above backdrop layers).
 */
export function SearchAITrustStrip() {
  return (
    <div className="relative z-10 mt-3 px-0.5">
      <div className="flex items-center gap-1.5">
        <Zap
          className="h-4 w-4 shrink-0 text-blue-500 opacity-100 dark:text-blue-400"
          strokeWidth={2.25}
          aria-hidden
        />
        <span className="text-sm font-medium text-blue-500/90 dark:text-blue-400/95">
          Powered by Core AI
        </span>
      </div>
      <p className="ml-6 mt-0.5 text-xs text-[var(--color-text-tertiary)]">
        Personalized for your retirement plan
      </p>
    </div>
  );
}

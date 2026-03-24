import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type UnifiedSearchInputVariant = "hero" | "palette";

export type UnifiedSearchInputProps = {
  variant?: UnifiedSearchInputVariant;
  className?: string;
  wrapperClassName?: string;
  children: ReactNode;
};

/**
 * Shared intelligent search chrome: gradient `search-wrapper` + solid `search-inner`
 * (hero contextual bar + command palette).
 */
export function UnifiedSearchInput({
  variant = "hero",
  className,
  wrapperClassName,
  children,
}: UnifiedSearchInputProps) {
  return (
    <div
      className={cn(
        "search-wrapper",
        variant === "hero" && "search-wrapper--animated",
        variant === "palette" && "search-wrapper--palette ai-command-search-shell",
        wrapperClassName,
        className,
      )}
      data-variant={variant}
    >
      <div
        className={cn(
          "search-inner",
          variant === "palette" && "search-inner--palette",
        )}
      >
        {children}
      </div>
    </div>
  );
}

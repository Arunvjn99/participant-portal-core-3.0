import type { ReactNode } from "react";

export interface IconContainerProps {
  /** Icon to render (e.g. from lucide-react) */
  children: ReactNode;
  /** Size: sm (32px), md (40px), lg (48px) */
  size?: "sm" | "md" | "lg";
  /** Optional accent so icon color uses theme (e.g. brand-primary) */
  accent?: "brand" | "success" | "accent" | "neutral";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 rounded-lg",
  md: "w-10 h-10 rounded-xl",
  lg: "w-12 h-12 rounded-xl",
};

const accentIconColor = {
  brand: "var(--brand-primary)",
  success: "var(--success)",
  accent: "var(--enroll-accent)",
  neutral: "var(--text-secondary)",
};

/**
 * Wraps an icon in a rounded background container for elevation and focus.
 * Uses theme tokens only; dark-mode compatible.
 */
export function IconContainer({
  children,
  size = "md",
  accent = "neutral",
  className = "",
}: IconContainerProps) {
  return (
    <div
      className={`flex items-center justify-center flex-shrink-0 ${sizeClasses[size]} ${className}`}
      style={{
        background: "var(--surface-2)",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "var(--border-subtle)",
        color: accentIconColor[accent],
      }}
      aria-hidden
    >
      {children}
    </div>
  );
}

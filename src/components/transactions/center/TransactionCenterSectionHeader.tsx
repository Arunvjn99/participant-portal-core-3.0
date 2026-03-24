import type { ReactNode } from "react";

export function TransactionCenterSectionHeader({
  icon,
  title,
  subtitle,
  badge,
  variant = "default",
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  badge?: { text: string; color: string };
  variant?: "default" | "ai";
}) {
  return (
    <div className="flex items-center gap-2.5 mb-5 sm:mb-6 flex-wrap">
      <div className={variant === "ai" ? "text-violet-500 dark:text-violet-400" : "text-[var(--color-primary)]"}>{icon}</div>
      <div className="flex items-center gap-2.5 flex-wrap">
        <h2 className="text-[15px] sm:text-[16px] font-bold text-[var(--foreground)] tracking-[-0.3px]">{title}</h2>
        {badge ? (
          <span className={`text-[11px] font-bold px-2.5 py-[3px] rounded-[6px] ${badge.color}`}>{badge.text}</span>
        ) : null}
      </div>
      {subtitle ? (
        <span className="text-[12px] text-[var(--color-text-tertiary)] ml-auto hidden sm:block font-medium">{subtitle}</span>
      ) : null}
    </div>
  );
}

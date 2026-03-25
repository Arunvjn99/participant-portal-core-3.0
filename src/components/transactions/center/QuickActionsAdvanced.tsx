import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type QuickActionBadge = "recommended" | "most_used";

export type QuickActionAdvancedItem = {
  id: string;
  icon: ReactNode;
  title: string;
  keyValue: string;
  supporting: string;
  onClick: () => void;
  badge?: QuickActionBadge;
};

export type QuickActionsAdvancedProps = {
  items: QuickActionAdvancedItem[];
  className?: string;
};

const badgeLabel: Record<QuickActionBadge, string> = {
  recommended: "Recommended",
  most_used: "Most used",
};

/**
 * Context-rich financial action cards for the transaction center (Figma-aligned).
 * Horizontal layout: icon | title + key value + supporting | arrow.
 */
export function QuickActionsAdvanced({ items, className }: QuickActionsAdvancedProps) {
  return (
    <div
      className={cn(
        "@container min-w-0 grid grid-cols-1 gap-3 @[28rem]:grid-cols-2 @[56rem]:grid-cols-4",
        className,
      )}
      role="list"
    >
      {items.map((item) => (
        <motion.article
          key={item.id}
          role="listitem"
          initial={false}
          whileHover={{
            y: -2,
            boxShadow: "var(--quick-action-card-hover-shadow, 0 8px 24px color-mix(in srgb, var(--color-primary) 14%, transparent))",
          }}
          whileTap={{ scale: 0.992 }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
          className="quick-actions-advanced__card group relative flex min-w-0 cursor-pointer items-start gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--color-background)] p-4 text-left outline-none transition-[border-color] duration-200 hover:border-[color-mix(in_srgb,var(--color-primary)_35%,var(--border-subtle))] focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]"
          tabIndex={0}
          onClick={item.onClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              item.onClick();
            }
          }}
        >
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg sm:h-11 sm:w-11"
            style={{
              background: "var(--primary-soft)",
              color: "var(--primary)",
            }}
            aria-hidden
          >
            {item.icon}
          </div>

          <div className="min-w-0 flex-1 flex flex-col gap-0.5 pr-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3
                className="text-[0.9375rem] font-semibold leading-snug"
                style={{ color: "var(--text-primary, var(--color-text-primary))" }}
              >
                {item.title}
              </h3>
              {item.badge ? (
                <span
                  className="inline-flex shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                  style={{
                    background: "color-mix(in srgb, var(--color-primary) 12%, var(--color-background))",
                    color: "var(--primary)",
                  }}
                >
                  {badgeLabel[item.badge]}
                </span>
              ) : null}
            </div>
            <p className="text-sm font-semibold leading-snug" style={{ color: "var(--primary)" }}>
              {item.keyValue}
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {item.supporting}
            </p>
          </div>

          <div className="flex shrink-0 items-start self-start pt-0.5">
            <ChevronRight
              className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5"
              style={{ color: "var(--text-muted)" }}
              aria-hidden
            />
          </div>
        </motion.article>
      ))}
    </div>
  );
}

import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { getRoutingVersion, withVersionIfEnrollment } from "@/core/version";

export interface QuickActionItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  /** Versioned when under `/transactions` or `/enrollment` (see `withVersionIfEnrollment`). */
  route?: string;
  /** Overrides `route` when both are set. */
  onClick?: () => void;
  /** Optional — reserved for future “Recommended” style badges. */
  badge?: string;
  /** Optional — reserved for future stats (e.g. “Available: $5,000”). */
  quickStat?: string;
}

export interface QuickActionsProps {
  title?: string;
  actions: QuickActionItem[];
  className?: string;
}

/**
 * Post-enrollment quick actions: horizontal cards, version-aware transaction navigation.
 */
export function QuickActions({ title = "Quick Actions", actions, className }: QuickActionsProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const version = getRoutingVersion(pathname);

  const handleActivate = (item: QuickActionItem) => {
    if (item.onClick) {
      item.onClick();
      return;
    }
    if (item.route) {
      navigate(withVersionIfEnrollment(version, item.route));
    }
  };

  return (
    <div
      className={cn(
        "@container min-w-0 overflow-hidden rounded-2xl border border-[var(--border-subtle)] p-6 lg:p-8",
        className,
      )}
    >
      <h3
        className="mb-5 text-lg font-semibold text-[var(--text-primary)] lg:mb-6"
        style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
      >
        {title}
      </h3>
      {/* Column count follows this card’s width (sidebar vs full width), not viewport — avoids 4 cramped columns in col-span-4 */}
      <div className="grid min-w-0 grid-cols-1 gap-3 @[22rem]:grid-cols-2 @[52rem]:grid-cols-4 sm:gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              type="button"
              onClick={() => handleActivate(action)}
              className={cn(
                "group flex min-w-0 w-full cursor-pointer gap-3 rounded-xl border border-[var(--border-subtle)] p-3 text-left transition-shadow",
                "flex-col @[22rem]:flex-row @[22rem]:items-center",
                "bg-[var(--bg-secondary)] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-secondary)]",
              )}
            >
              <div className="flex shrink-0 items-center justify-center rounded-lg bg-[var(--bg-tertiary)] p-3 @[22rem]:p-3">
                <Icon className="h-5 w-5 text-[var(--primary)]" strokeWidth={2} aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="break-words text-sm font-semibold leading-tight text-[var(--text-primary)]">
                    {action.title}
                  </span>
                  {action.badge ? (
                    <span
                      className="rounded-full px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-[var(--primary)]"
                      style={{
                        background: "color-mix(in srgb, var(--primary) 12%, var(--bg-secondary))",
                      }}
                    >
                      {action.badge}
                    </span>
                  ) : null}
                </div>
                <p className="mt-0.5 break-words text-xs leading-snug text-[var(--text-muted)]">{action.description}</p>
                {action.quickStat ? (
                  <p className="mt-1 text-[0.7rem] font-medium text-[var(--text-primary)]">{action.quickStat}</p>
                ) : null}
              </div>
              <ChevronRight
                className="h-5 w-5 shrink-0 self-end @[22rem]:self-center text-[var(--text-muted)] transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

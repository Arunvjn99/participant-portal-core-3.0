import { AlertTriangle, ArrowRight, Bot, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InsightItem } from "../data/mockPortfolioDashboard";

const variantStyles = {
  recommendation: {
    icon: Lightbulb,
    iconWrap: "bg-primary/10 text-primary dark:bg-primary/20",
    bar: "from-primary/80 to-transparent",
    badge: "bg-primary/10 text-primary dark:bg-primary/20",
    label: "Recommendation",
  },
  alert: {
    icon: AlertTriangle,
    iconWrap: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    bar: "from-amber-500/80 to-transparent",
    badge: "bg-amber-500/10 text-amber-800 dark:text-amber-300",
    label: "Alert",
  },
  ai: {
    icon: Bot,
    iconWrap: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
    bar: "from-violet-500/80 to-transparent",
    badge: "bg-violet-500/10 text-violet-800 dark:text-violet-300",
    label: "AI insight",
  },
} as const;

type Props = {
  item: InsightItem;
  onCta?: (id: string) => void;
};

export function InsightCard({ item, onCta }: Props) {
  const v = variantStyles[item.variant];
  const Icon = v.icon;

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow",
        "hover:shadow-md dark:border-border/80 dark:shadow-none dark:ring-1 dark:ring-white/5 dark:hover:ring-white/10",
      )}
    >
      <div
        className={cn("absolute left-0 right-0 top-0 h-1 bg-gradient-to-r opacity-70", v.bar)}
        aria-hidden
      />

      <div className="mb-2 flex items-start gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            v.iconWrap,
          )}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <span
            className={cn("mb-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium", v.badge)}
          >
            {v.label}
          </span>
          <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
        </div>
      </div>

      <p className="mb-3 flex-1 text-xs leading-relaxed text-muted-foreground">{item.body}</p>

      {item.highlight ? (
        <p className="mb-3 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          {item.highlight}
        </p>
      ) : null}

      {item.ctaLabel ? (
        <button
          type="button"
          onClick={() => onCta?.(item.id)}
          className={cn(
            "flex w-full items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-medium transition-colors",
            "bg-muted/80 text-foreground hover:bg-muted dark:bg-muted/40 dark:hover:bg-muted/60",
          )}
        >
          {item.ctaLabel}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      ) : null}
    </article>
  );
}

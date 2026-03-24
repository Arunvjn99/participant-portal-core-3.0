import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type AICardProps = {
  title: string;
  description: string;
  actionLabel: string;
  onAction?: () => void;
  href?: string;
  betaLabel?: string;
  className?: string;
};

/**
 * Dark “Ask Core AI” card — neural core + cyan glow from figma-dump/zip (2), compressed for grid slot.
 */
export function AICard({
  title,
  description,
  actionLabel,
  onAction,
  href,
  betaLabel = "BETA",
  className,
}: AICardProps) {
  const cta = href ? (
    <a href={href} className="dash-ai-card__cta">
      {actionLabel}
      <ArrowRight className="dash-ai-card__cta-arrow h-4 w-4" aria-hidden />
    </a>
  ) : (
    <button type="button" className="dash-ai-card__cta" onClick={onAction}>
      {actionLabel}
      <ArrowRight className="dash-ai-card__cta-arrow h-4 w-4" aria-hidden />
    </button>
  );

  return (
    <motion.div
      className={cn("dash-ai-card group", className)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="dash-ai-card__inner">
        <div className="dash-ai-card__visual" aria-hidden>
          <motion.div
            className="dash-ai-card__ring dash-ai-card__ring--dashed"
            animate={{ rotate: 360 }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="dash-ai-card__ring dash-ai-card__ring--arc"
            animate={{ rotate: -360 }}
            transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="dash-ai-card__pulse"
            animate={{ scale: [1, 1.08, 1], opacity: [0.45, 0.75, 0.45] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="dash-ai-card__core">
            <div className="dash-ai-card__core-disk">
              <motion.div
                animate={{ rotate: [0, 6, -4, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              >
                <Sparkles className="h-5 w-5 text-[var(--color-primary)]" strokeWidth={2} />
              </motion.div>
            </div>
          </div>
        </div>

        <div className="dash-ai-card__body">
          <div className="dash-ai-card__title-row">
            <h3 className="dash-ai-card__title">{title}</h3>
            <span className="dash-ai-card__beta">{betaLabel}</span>
          </div>
          <p className="dash-ai-card__desc">{description}</p>
        </div>

        <div className="dash-ai-card__cta-wrap">{cta}</div>
      </div>
    </motion.div>
  );
}

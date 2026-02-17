import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ActivityInsight } from "../types";

interface ActivityInsightsProps {
  insights: ActivityInsight[];
}

export const ActivityInsights = memo(function ActivityInsights({ insights }: ActivityInsightsProps) {
  const reduced = !!useReducedMotion();
  if (insights.length === 0) return null;

  return (
    <section className="space-y-2">
      <h2 className="text-sm font-semibold" style={{ color: "var(--color-text-secondary)" }}>
        Activity insights
      </h2>
      <div className="grid gap-2 sm:grid-cols-3">
        {insights.map((insight, i) => (
          <motion.div
            key={insight.id}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.06, ease: "easeOut" }}
            className="flex rounded-[var(--radius-lg)] border border-[var(--color-border)] p-[var(--spacing-4)]"
            style={{
              background: "var(--color-surface)",
              boxShadow: "var(--shadow-sm)",
              borderLeftWidth: 4,
              borderLeftColor:
                insight.type === "warning"
                  ? "var(--color-warning)"
                  : insight.type === "withdrawal"
                    ? "var(--color-danger)"
                    : "var(--color-primary)",
            }}
          >
            <p className="text-sm leading-snug" style={{ color: "var(--color-text)" }}>
              {insight.statement}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
});

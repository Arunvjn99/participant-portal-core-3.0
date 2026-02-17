import { memo, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface ActivityHeroProps {
  totalBalance: number;
  ytdReturnPercent: number;
  netFlowThisMonth: number;
  chartData: { month: string; value: number }[];
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

export const ActivityHero = memo(function ActivityHero({
  totalBalance,
  ytdReturnPercent,
  netFlowThisMonth,
  chartData,
}: ActivityHeroProps) {
  const reduced = !!useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduced) {
      setCount(totalBalance);
      return;
    }
    const duration = 600;
    const start = performance.now();
    const startVal = count;
    const raf = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - t) * (1 - t);
      setCount(startVal + (totalBalance - startVal) * eased);
      if (t < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [totalBalance, reduced]);

  const minVal = Math.min(...chartData.map((d) => d.value));
  const maxVal = Math.max(...chartData.map((d) => d.value));
  const range = maxVal - minVal || 1;

  return (
    <motion.section
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="grid grid-cols-1 gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] p-[var(--spacing-6)] md:grid-cols-2"
      style={{
        background: "var(--color-surface)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div className="flex flex-col justify-center gap-3">
        <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
          Total Balance
        </p>
        <p className="text-2xl font-bold tracking-tight md:text-3xl" style={{ color: "var(--color-text)" }}>
          {formatCurrency(count)}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <span
            className="inline-flex items-center rounded-[var(--radius-md)] px-2 py-0.5 text-xs font-medium"
            style={{ background: "var(--color-success-light)", color: "var(--color-success)" }}
          >
            {ytdReturnPercent}% YTD
          </span>
          <span
            className="text-sm font-medium"
            style={{ color: netFlowThisMonth >= 0 ? "var(--color-success)" : "var(--color-danger)" }}
          >
            {netFlowThisMonth >= 0 ? "+" : ""}
            {formatCurrency(netFlowThisMonth)} this month
          </span>
        </div>
      </div>
      <div className="flex items-end gap-0.5">
        {chartData.map((d, i) => (
          <motion.div
            key={d.month}
            initial={reduced ? false : { scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.35, delay: i * 0.04, ease: "easeOut" }}
            style={{
              transformOrigin: "bottom",
              height: 48,
              flex: 1,
              borderRadius: "var(--radius-sm)",
              background: "var(--color-primary)",
              opacity: 0.6 + (d.value - minVal) / range * 0.4,
            }}
            title={`${d.month}: ${formatCurrency(d.value)}`}
          />
        ))}
      </div>
    </motion.section>
  );
});

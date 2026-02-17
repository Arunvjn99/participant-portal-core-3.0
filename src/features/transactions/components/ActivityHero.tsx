import { memo, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Card, CardContent } from "../../../components/ui/card";

interface ActivityHeroProps {
  totalBalance: number;
  ytdReturnPercent: number;
  netFlowThisMonth: number;
  totalContributionsThisYear: number;
  withdrawalsThisYear: number;
  chartData: { month: string; value: number }[];
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

function AnimatedCounter({ value, duration = 500 }: { value: number; duration?: number }) {
  const reduced = !!useReducedMotion();
  const [count, setCount] = useState(value);
  useEffect(() => {
    if (reduced) {
      setCount(value);
      return;
    }
    const start = performance.now();
    const startVal = count;
    const raf = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - t) * (1 - t);
      setCount(Math.round(startVal + (value - startVal) * eased));
      if (t < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [value, reduced, duration]);
  return <>{formatCurrency(count)}</>;
}

export const ActivityHero = memo(function ActivityHero({
  totalBalance,
  ytdReturnPercent,
  netFlowThisMonth,
  totalContributionsThisYear,
  withdrawalsThisYear,
  chartData,
}: ActivityHeroProps) {
  const reduced = !!useReducedMotion();
  const minVal = Math.min(...chartData.map((d) => d.value));
  const maxVal = Math.max(...chartData.map((d) => d.value));
  const range = maxVal - minVal || 1;

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 md:gap-8 md:p-8">
        <CardContent className="flex flex-col justify-center gap-6 p-0">
          <div>
            <motion.p
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-xl font-semibold md:text-2xl"
              style={{ color: "var(--color-text)" }}
            >
              Your retirement is moving forward.
            </motion.p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--color-text-secondary)" }}>
                Net flow this month
              </p>
              <p className="mt-0.5 text-lg font-semibold" style={{ color: netFlowThisMonth >= 0 ? "var(--color-success)" : "var(--color-danger)" }}>
                {netFlowThisMonth >= 0 ? "+" : ""}
                <AnimatedCounter value={netFlowThisMonth} duration={600} />
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--color-text-secondary)" }}>
                Contributions this year
              </p>
              <p className="mt-0.5 text-lg font-semibold" style={{ color: "var(--color-text)" }}>
                <AnimatedCounter value={totalContributionsThisYear} duration={600} />
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--color-text-secondary)" }}>
                Withdrawals this year
              </p>
              <p className="mt-0.5 text-lg font-semibold" style={{ color: withdrawalsThisYear > 0 ? "var(--color-danger)" : "var(--color-text)" }}>
                <AnimatedCounter value={withdrawalsThisYear} duration={600} />
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--color-text-secondary)" }}>
                Balance
              </p>
              <p className="mt-0.5 text-lg font-semibold" style={{ color: "var(--color-text)" }}>
                <AnimatedCounter value={totalBalance} duration={700} />
              </p>
            </div>
          </div>
          <p className="text-sm font-medium" style={{ color: "var(--color-success)" }}>
            {ytdReturnPercent}% YTD return
          </p>
        </CardContent>
        <div className="flex flex-col justify-end">
          <p className="mb-3 text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>
            6-month activity
          </p>
          <div className="flex items-end gap-0.5" style={{ minHeight: 80 }}>
            {chartData.map((d, i) => (
              <motion.div
                key={d.month}
                initial={reduced ? false : { scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.35, delay: i * 0.04, ease: "easeOut" }}
                style={{
                  transformOrigin: "bottom",
                  height: 64,
                  flex: 1,
                  borderRadius: "var(--radius-sm)",
                  background: "var(--color-primary)",
                  opacity: 0.5 + (d.value - minVal) / range * 0.5,
                }}
                title={`${d.month}: ${formatCurrency(d.value)}`}
              />
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
});

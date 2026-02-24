import { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";
import {
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Target, Wallet } from "lucide-react";
import { AnimatedNumber } from "../../../components/dashboard/shared/AnimatedNumber";

interface MomentumChartPoint {
  month: string;
  inflow: number;
  outflow: number;
  balance: number;
}

interface ActivityHeroProps {
  totalBalance: number;
  ytdReturnPercent: number;
  netFlowThisMonth: number;
  contributionsYtd: number;
  withdrawalsYtd: number;
  chartData: { month: string; value: number }[];
  momentumChartData?: MomentumChartPoint[];
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);

export const ActivityHero = memo(function ActivityHero({
  totalBalance,
  ytdReturnPercent,
  netFlowThisMonth,
  contributionsYtd,
  withdrawalsYtd,
  chartData,
  momentumChartData,
}: ActivityHeroProps) {
  const { t } = useTranslation();
  const reduced = !!useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const data = momentumChartData ?? chartData.map((d, i) => ({
    month: d.month,
    inflow: 1200 + (i === chartData.length - 1 ? netFlowThisMonth : 0),
    outflow: i === chartData.length - 1 ? Math.max(0, -netFlowThisMonth) : 200,
    balance: d.value,
  }));

  const lastPoint = data[data.length - 1];
  const netFlow = lastPoint ? lastPoint.inflow - lastPoint.outflow : netFlowThisMonth;
  const isPositive = netFlow >= 0;

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
    if (!active || !payload?.length || !label) return null;
    const p = data.find((d) => d.month === label);
    return (
      <div
        className="rounded-xl border p-4 backdrop-blur-sm"
        style={{
          background: "var(--enroll-card-bg)",
          borderColor: "var(--enroll-card-border)",
          boxShadow: "var(--enroll-elevation-2)",
        }}
      >
        <p className="mb-2 text-sm font-semibold" style={{ color: "var(--color-text)" }}>
          {label}
        </p>
        <div className="space-y-1 text-xs">
          <p className="flex justify-between gap-4" style={{ color: "var(--enroll-brand)" }}>
            <span>{t("transactions.overview.balance")}</span>
            <span className="font-medium">{p ? formatCurrency(p.balance) : formatCurrency(payload[0]?.value ?? 0)}</span>
          </p>
          {p && (
            <p className="flex justify-between gap-4" style={{ color: "var(--color-success)" }}>
              <span>{t("transactions.overview.inflow")}</span>
              <span className="font-medium">+{formatCurrency(p.inflow)}</span>
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <motion.section
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative overflow-hidden rounded-[var(--txn-card-radius)] border p-0"
      style={{
        background: "linear-gradient(to bottom right, var(--color-surface), var(--enroll-soft-bg), var(--color-background-secondary))",
        borderColor: "var(--color-border)",
        boxShadow: "var(--txn-elevation)",
      }}
    >
      {/* Background decor */}
      <div
        className="pointer-events-none absolute -top-1/2 right-0 h-64 w-64 rounded-full blur-3xl translate-x-1/2"
        style={{ background: "var(--txn-brand-soft)" }}
      />
      <div
        className="pointer-events-none absolute bottom-0 -left-1/4 h-40 w-40 rounded-full blur-3xl translate-y-1/2"
        style={{ background: "var(--txn-success-soft)" }}
      />

      <div className="relative z-10 grid min-h-[280px] grid-cols-1 lg:grid-cols-12">
        {/* Left: Financial Momentum Panel */}
        <div className="flex flex-col justify-between p-6 lg:col-span-5 lg:p-8">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span
                className="inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                style={{ background: "var(--txn-brand-soft)", color: "var(--enroll-brand)" }}
              >
                {t("transactions.overview.momentum")}
              </span>
              <span className="text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>
                {t("transactions.overview.liveProjection")}
              </span>
            </div>
            <h2 className="text-2xl font-light leading-tight tracking-tight lg:text-3xl" style={{ color: "var(--color-text)" }}>
              {t("transactions.overview.wealthCompounding")}
            </h2>
            <p className="mt-2 max-w-sm text-sm" style={{ color: "var(--color-text-secondary)" }}>
              {t("transactions.overview.milestoneProjection")}
            </p>
          </div>

          <div className="mt-6">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-tertiary)" }}>
              {t("transactions.overview.totalBalance")}
            </p>
            <div className="mb-6 flex items-baseline gap-2">
              <AnimatedNumber
                value={totalBalance}
                format="currency"
                duration={700}
                decimals={0}
                className="text-3xl font-bold tracking-tight lg:text-4xl xl:text-5xl"
                style={{ color: "var(--color-text)" }}
              />
            </div>

            <div className="grid grid-cols-2 gap-6 border-t pt-6" style={{ borderColor: "var(--color-border)" }}>
              <div>
                <div className="mb-1 flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5" style={{ color: isPositive ? "var(--color-success)" : "var(--color-text-tertiary)" }} />
                  <p className="text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>
                    {t("transactions.overview.netFlowThisMonth")}
                  </p>
                </div>
                <p className="text-lg font-semibold" style={{ color: isPositive ? "var(--color-success)" : "var(--color-text-secondary)" }}>
                  {isPositive ? "+" : "−"}
                  {formatCurrency(Math.abs(netFlow))}
                </p>
              </div>
              <div>
                <div className="mb-1 flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5" style={{ color: "var(--enroll-brand)" }} />
                  <p className="text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>
                    {t("transactions.overview.twelveMoImpact")}
                  </p>
                </div>
                <p className="text-lg font-semibold" style={{ color: "var(--enroll-brand)" }}>
                  +{formatCurrency(contributionsYtd + 6000)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Chart */}
        <div
          className="flex flex-col justify-center border-l p-6 lg:col-span-7 lg:p-8"
          style={{ background: "var(--surface-1)", borderColor: "var(--color-border)" }}
        >
          <div className="mb-6 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--color-text)" }}>
              <Wallet className="h-4 w-4" style={{ color: "var(--color-text-tertiary)" }} />
              {t("transactions.overview.growthContributionAnalysis")}
            </h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: "var(--enroll-brand)" }} />
                <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{t("transactions.overview.balance")}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: "var(--color-success)" }} />
                <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{t("transactions.overview.inflow")}</span>
              </div>
            </div>
          </div>

          <div className="h-[200px] w-full lg:h-[220px]">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="txnBalanceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--enroll-brand)" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="var(--enroll-brand)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--color-text-tertiary)", fontSize: 11, fontWeight: 500 }}
                    dy={10}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--color-text-tertiary)", fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
                  <Bar
                    dataKey="inflow"
                    barSize={12}
                    fill="var(--color-success)"
                    radius={[4, 4, 0, 0]}
                    fillOpacity={0.8}
                    animationDuration={1500}
                  />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="var(--enroll-brand)"
                    strokeWidth={3}
                    fill="url(#txnBalanceGradient)"
                    fillOpacity={1}
                    activeDot={{ r: 6, strokeWidth: 4, stroke: "var(--color-text-inverse)", fill: "var(--enroll-brand)" }}
                    animationDuration={2000}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
});

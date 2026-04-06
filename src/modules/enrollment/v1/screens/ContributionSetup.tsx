import { useEffect, useId, useMemo, useState, type CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { Check, Info, Minus, Plus, Sparkles } from "lucide-react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { generateContributionProjectionData } from "../flow/contributionProjection";
import { getGrowthRate } from "../flow/readinessMetrics";
import { useEnrollmentStore } from "../store/useEnrollmentStore";
import { cn } from "@/lib/utils";

const S = "enrollment.v1.contributionSetup.";

export function ContributionSetup() {
  const { t } = useTranslation();
  const contribution = useEnrollmentStore((s) => s.contribution);
  const salary = useEnrollmentStore((s) => s.salary);
  const monthlyPaycheck = useEnrollmentStore((s) => s.monthlyPaycheck);
  const monthlyContribution = useEnrollmentStore((s) => s.monthlyContribution);
  const employerMatch = useEnrollmentStore((s) => s.employerMatch);
  const projectedBalance = useEnrollmentStore((s) => s.projectedBalance);
  const monthlyRetirementIncomeFromStore = useEnrollmentStore((s) => s.retirementProjection.monthlyIncome);
  const riskLevel = useEnrollmentStore((s) => s.riskLevel);
  const retirementAge = useEnrollmentStore((s) => s.retirementAge);
  const updateField = useEnrollmentStore((s) => s.updateField);

  const quickOptions = useMemo(
    () => [
      { label: t(`${S}quick4`), value: 4 },
      { label: t(`${S}quick6`), value: 6 },
      { label: t(`${S}quick10`), value: 10 },
      { label: t(`${S}quick15`), value: 15 },
    ],
    [t],
  );

  const [compareMode, setCompareMode] = useState(false);
  const [comparePercent, setComparePercent] = useState(12);
  const [percentInput, setPercentInput] = useState(String(contribution));
  const [dollarInput, setDollarInput] = useState(String(Math.round((salary * contribution) / 100)));

  const gradientId = useId().replace(/:/g, "");

  /* eslint-disable react-hooks/set-state-in-effect -- sync local inputs when zustand contribution/salary changes */
  useEffect(() => {
    setPercentInput(String(contribution));
    setDollarInput(String(Math.round((salary * contribution) / 100)));
  }, [contribution, salary]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const percent = contribution;
  const monthlyMatch = employerMatch;

  const growthRate = getGrowthRate(riskLevel);
  const projectionData = generateContributionProjectionData(percent, salary, growthRate);
  const chartEndCurrent = projectionData[projectionData.length - 1]?.value ?? 0;
  const projectedTotal = projectedBalance;
  const monthlyRetirementIncome = monthlyRetirementIncomeFromStore;

  const recommendedPercent = 12;
  const progressPercentage = Math.min((percent / recommendedPercent) * 100, 100);

  const targetGoalLine = useMemo(() => {
    const d = generateContributionProjectionData(recommendedPercent, salary, growthRate);
    return d[d.length - 1]?.value ?? 0;
  }, [salary, growthRate]);

  const comparisonData = generateContributionProjectionData(comparePercent, salary, growthRate);
  const comparisonTotal = comparisonData[comparisonData.length - 1]?.value ?? 0;
  const difference = comparisonTotal - chartEndCurrent;

  const onePercentImpact = Math.round(monthlyPaycheck * 0.01);

  const adjustPercent = (delta: number) => {
    const newValue = Math.max(1, Math.min(25, percent + delta));
    updateField("contribution", newValue);
  };

  const handlePercentInputChange = (value: string) => {
    setPercentInput(value);
    const numValue = parseFloat(value);
    if (!Number.isNaN(numValue) && numValue >= 1 && numValue <= 25) {
      updateField("contribution", Math.round(numValue));
      setDollarInput(String(Math.round((salary * Math.round(numValue)) / 100)));
    }
  };

  const handleDollarInputChange = (value: string) => {
    setDollarInput(value);
    const numValue = parseFloat(value.replace(/,/g, ""));
    if (!Number.isNaN(numValue)) {
      const calculatedPercent = Math.round((numValue / salary) * 100);
      if (calculatedPercent >= 1 && calculatedPercent <= 25) {
        updateField("contribution", calculatedPercent);
        setPercentInput(String(calculatedPercent));
      }
    }
  };

  const handleQuickOption = (value: number) => {
    updateField("contribution", value);
  };

  const rangePct = `${((percent - 1) / 24) * 100}%`;

  const tooltipFormatter = (val: number, name: string) => {
    const formatted = `$${val.toLocaleString()}`;
    if (name === "value") return [formatted, t(`${S}chartTotalSavings`)];
    if (name === "contributions") return [formatted, t(`${S}chartYourContributions`)];
    if (name === "marketGain") return [formatted, t(`${S}chartMarketGains`)];
    return [formatted, name];
  };

  const cardShell =
    "min-w-0 rounded-2xl border border-[var(--color-border)]/60 bg-[var(--color-surface)] p-6 " +
    "shadow-[0_1px_2px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.06)] " +
    "dark:shadow-[0_4px_24px_-8px_rgba(0,0,0,0.45)]";

  return (
    <div className="min-w-0 w-full space-y-6 bg-transparent">
      <div className="min-w-0 text-left">
        <h1 className="text-2xl font-semibold leading-tight tracking-tight text-[var(--enroll-text-primary)]">
          {t(`${S}title`)}
        </h1>
        <p className="mt-1.5 text-sm leading-snug text-[var(--color-text-secondary)]">{t(`${S}subtitle`)}</p>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)] lg:items-start">
          {/* Left: single settings card */}
          <div className={cn(cardShell, "flex min-w-0 flex-col gap-5 shadow-sm transition-shadow hover:shadow-md")}>
            <div className="rounded-xl bg-[color-mix(in_srgb,var(--color-primary)_8%,transparent)] px-4 py-3.5">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[var(--enroll-text-secondary)]">
                {t(`${S}monthlyPaycheck`)}
              </p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-[var(--enroll-text-primary)]">
                ${monthlyPaycheck.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[var(--enroll-text-secondary)]">
                {t(`${S}yourContribution`)}
              </p>
              <div className="mt-3 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => adjustPercent(-1)}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--color-primary)_15%,transparent)] text-[var(--color-primary)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-primary)_25%,transparent)]"
                  aria-label={t(`${S}decreasePctAria`)}
                >
                  <Minus className="h-5 w-5" aria-hidden strokeWidth={2.5} />
                </button>
                <p className="min-w-[4.5rem] text-center text-4xl font-bold tabular-nums leading-none text-[var(--color-primary)]">
                  {percent}%
                </p>
                <button
                  type="button"
                  onClick={() => adjustPercent(1)}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--color-primary)_15%,transparent)] text-[var(--color-primary)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-primary)_25%,transparent)]"
                  aria-label={t(`${S}increasePctAria`)}
                >
                  <Plus className="h-5 w-5" aria-hidden strokeWidth={2.5} />
                </button>
              </div>
            </div>

            <div className="grid min-w-0 grid-cols-2 gap-3">
              <div className="min-w-0">
                <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[var(--enroll-text-secondary)]">
                  {t(`${S}percentage`)}
                </label>
                <div className="relative min-w-0">
                  <input
                    type="number"
                    min={1}
                    max={25}
                    step={0.5}
                    value={percentInput}
                    onChange={(e) => handlePercentInputChange(e.target.value)}
                    className="input input--suffix w-full min-w-0 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] py-2.5 text-[var(--color-text)]"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[var(--enroll-text-secondary)]">
                    %
                  </span>
                </div>
              </div>
              <div className="min-w-0">
                <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[var(--enroll-text-secondary)]">
                  {t(`${S}annualDollar`)}
                </label>
                <div className="relative min-w-0">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[var(--enroll-text-secondary)]">
                    $
                  </span>
                  <input
                    type="text"
                    value={dollarInput}
                    onChange={(e) => handleDollarInputChange(e.target.value)}
                    className="input input--prefix w-full min-w-0 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] py-2.5 pl-7 text-[var(--color-text)]"
                  />
                </div>
              </div>
            </div>

            <div>
              <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[var(--enroll-text-secondary)]">
                {t(`${S}quickSelect`)}
              </p>
              <div className="flex min-w-0 flex-wrap gap-2">
                {quickOptions.map((opt) => {
                  const active = percent === opt.value;
                  const isMatchChip = opt.value === 6;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleQuickOption(opt.value)}
                      className={cn(
                        "inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors",
                        active
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-sm"
                          : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-border)] hover:bg-[var(--color-background-secondary)] dark:hover:bg-[var(--color-background-secondary)]",
                      )}
                    >
                      {active && isMatchChip ? <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={3} aria-hidden /> : null}
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <input
                type="range"
                min={1}
                max={25}
                value={percent}
                onChange={(e) => updateField("contribution", Number(e.target.value))}
                className="contribution-range h-3 w-full min-w-0"
                style={{ "--range-pct": rangePct } as CSSProperties}
              />
              <div className="flex justify-between text-xs font-medium text-[var(--enroll-text-secondary)]">
                <span>{t(`${S}rangeMin`)}</span>
                <span>{t(`${S}rangeMax`)}</span>
              </div>
            </div>

            <div className="rounded-xl border border-violet-200/80 bg-violet-50/95 px-4 py-3.5 dark:border-violet-800/60 dark:bg-violet-950/40">
              <div className="flex min-w-0 items-start gap-2.5">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-violet-600 dark:text-violet-400" aria-hidden />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-violet-900 dark:text-violet-100">{t(`${S}proTipTitle`)}</p>
                  <p className="mt-1 text-sm leading-snug text-violet-900/90 dark:text-violet-100/90">
                    {t(`${S}proTipBody`, { amount: `$${onePercentImpact.toLocaleString()}` })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: projection + chart + compare — one card */}
          <div
            className={cn(
              cardShell,
              "flex min-w-0 flex-col gap-5",
              "shadow-[0_10px_30px_rgba(0,0,0,0.1)] bg-gradient-to-b from-[var(--color-surface)] to-[color-mix(in_srgb,var(--color-primary)_5%,transparent)]",
              "dark:to-[var(--color-surface)]",
            )}
          >
            <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-[var(--enroll-text-primary)]">{t(`${S}projectionTitle`)}</h2>
                <p className="mt-1 text-xs leading-snug text-[var(--color-text-secondary)]">{t(`${S}projectionSub`)}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  {t(`${S}onTrack`, { percent: Math.round(progressPercentage) })}
                </p>
                <div className="mt-1.5 h-2 w-32 overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]">
                  <div
                    className="h-full rounded-full bg-emerald-600 transition-all duration-300 dark:bg-emerald-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="grid min-w-0 grid-cols-2 gap-3">
              <div className="min-w-0 rounded-xl border border-emerald-200/70 bg-emerald-50/95 p-3.5 dark:border-emerald-900/50 dark:bg-emerald-950/40">
                <p className="text-center text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-[var(--color-text-secondary)]">
                  {t(`${S}projectedAtAge`, { age: retirementAge })}
                </p>
                <p className="mt-1.5 text-center text-2xl font-bold tabular-nums leading-none text-emerald-700 dark:text-emerald-400">
                  ${(projectedTotal / 1_000_000).toFixed(1)}M
                </p>
                <p className="mt-1 text-center text-xs font-medium text-emerald-700/95 dark:text-emerald-300">
                  {t(`${S}approxPerMo`, { amount: `$${monthlyRetirementIncome.toLocaleString()}` })}
                </p>
              </div>

              <div className="flex min-w-0 flex-col justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5">
                <p className="text-center text-[0.65rem] font-bold uppercase tracking-[0.1em] text-[var(--color-text)]">
                  {t(`${S}monthlyImpact`)}
                </p>
                <div className="mt-2 text-center">
                  <p className="text-xs text-[var(--color-text-secondary)]">{t(`${S}youContribute`)}</p>
                  <p className="mt-0.5 text-base font-semibold tabular-nums text-[var(--enroll-text-primary)]">
                    ${monthlyContribution.toLocaleString()}
                  </p>
                </div>
                <div className="mt-2 rounded-lg border border-emerald-200/80 bg-emerald-50 px-2 py-2 dark:border-emerald-900/50 dark:bg-emerald-950/50">
                  <p className="text-center text-xs font-semibold text-emerald-900 dark:text-emerald-100">
                    {t(`${S}employerAdds`)}{" "}
                    <span className="tabular-nums">+${monthlyMatch.toLocaleString()}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="min-h-0 min-w-0">
              <div className="h-52 min-h-[13rem] w-full md:h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={projectionData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.32} />
                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.04} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.45} vertical={false} />
                    <XAxis
                      dataKey="year"
                      tick={{ fontSize: 10, fill: "var(--color-text-tertiary)" }}
                      tickLine={false}
                      axisLine={{ stroke: "var(--color-border)" }}
                      interval={4}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "var(--color-text-tertiary)" }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) => `$${(val / 1_000_000).toFixed(1)}M`}
                    />
                    <Tooltip
                      formatter={tooltipFormatter}
                      contentStyle={{
                        borderRadius: 10,
                        fontSize: 11,
                        border: "1px solid var(--color-border)",
                        backgroundColor: "var(--color-background)",
                        color: "var(--color-text)",
                      }}
                    />
                    <ReferenceLine
                      y={targetGoalLine}
                      stroke="var(--color-success)"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="var(--color-primary)"
                      strokeWidth={2.5}
                      fill={`url(#${gradientId})`}
                    />
                    <Line
                      type="monotone"
                      dataKey="marketGain"
                      stroke="var(--color-success)"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="contributions"
                      stroke="var(--color-text-tertiary)"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                      activeDot={{ r: 3 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-3 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--color-text-secondary)]">
                <div className="flex items-center gap-1.5">
                  <span className="chart-legend-swatch chart-legend-swatch--primary" />
                  {t(`${S}chartTotalSavings`)}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="chart-legend-swatch chart-legend-swatch--success" />
                  {t(`${S}chartMarketGains`)}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="chart-legend-dash" />
                  {t(`${S}chartYourContributions`)}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="chart-legend-target" />
                  {t(`${S}chartTargetGoal`)}
                </div>
              </div>

              <div className="mt-3 flex min-w-0 items-start gap-2">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-text-tertiary)]" aria-hidden />
                <p className="text-xs leading-snug text-[var(--enroll-text-secondary)]">{t(`${S}disclaimer`)}</p>
              </div>
            </div>

            <div className="mt-1 rounded-xl border border-[var(--color-border)]/60 bg-[var(--color-surface)] px-4 py-3.5 shadow-sm">
              <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[var(--color-text)]">
                  {t(`${S}compareScenarios`)}
                </p>
                <button
                  type="button"
                  onClick={() => setCompareMode(!compareMode)}
                  className={cn(
                    "rounded-md border px-4 py-2 text-xs font-semibold shadow-sm transition-colors",
                    compareMode
                      ? "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)]"
                      : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-background-secondary)]",
                  )}
                >
                  {compareMode ? t(`${S}hide`) : t(`${S}show`)}
                </button>
              </div>
              {compareMode ? (
                <div className="mt-3 space-y-3 border-t border-[var(--color-border)]/80 pt-3">
                  <div className="flex min-w-0 gap-2">
                    {[10, 12, 15].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setComparePercent(val)}
                        className={cn(
                          "min-w-0 flex-1 rounded-md border px-2 py-2 text-xs font-semibold transition-colors",
                          comparePercent === val
                            ? "border-[color-mix(in_srgb,var(--color-primary)_25%,transparent)] bg-[color-mix(in_srgb,var(--color-primary)_8%,transparent)] text-[var(--color-primary)]"
                            : "border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-background-secondary)]",
                        )}
                      >
                        {val}%
                      </button>
                    ))}
                  </div>
                  <div
                    className={cn(
                      "rounded-lg border p-3",
                      difference < 0
                        ? "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/30"
                        : "border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/30",
                    )}
                  >
                    <p
                      className={cn(
                        "text-sm font-bold",
                        difference < 0 ? "text-red-800 dark:text-red-200" : "text-emerald-800 dark:text-emerald-200",
                      )}
                    >
                      {difference >= 0 ? "+" : "-"}${Math.abs(difference).toLocaleString()}
                    </p>
                    <p
                      className={cn(
                        "text-xs",
                        difference < 0 ? "text-red-600 dark:text-red-300/90" : "text-emerald-600 dark:text-emerald-300/90",
                      )}
                    >
                      {difference >= 0 ? t(`${S}compareMore`) : t(`${S}compareLess`)}{" "}
                      {t(`${S}compareVs`, { compare: comparePercent, current: percent })}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
    </div>
  );
}

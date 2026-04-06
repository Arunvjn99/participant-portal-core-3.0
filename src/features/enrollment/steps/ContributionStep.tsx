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
import { useEnrollmentStore } from "../store/useEnrollmentStore";
import { getGrowthRate, generateProjectionCurve } from "../utils/calculations";

const S = "enrollment.v1.contributionSetup.";

export function ContributionStep() {
  const { t } = useTranslation();
  const contribution = useEnrollmentStore((s) => s.contribution);
  const salary = useEnrollmentStore((s) => s.salary);
  const monthlyPaycheck = useEnrollmentStore((s) => s.monthlyPaycheck);
  const monthlyContribution = useEnrollmentStore((s) => s.monthlyContribution);
  const employerMatch = useEnrollmentStore((s) => s.employerMatch);
  const projectedBalance = useEnrollmentStore((s) => s.projectedBalance);
  const monthlyRetirementIncome = useEnrollmentStore(
    (s) => s.retirementProjection.monthlyIncome,
  );
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
  const [dollarInput, setDollarInput] = useState(
    String(Math.round((salary * contribution) / 100)),
  );

  const gradientId = useId().replace(/:/g, "");

  useEffect(() => {
    setPercentInput(String(contribution));
    setDollarInput(String(Math.round((salary * contribution) / 100)));
  }, [contribution, salary]);

  const percent = contribution;
  const monthlyMatch = employerMatch;

  const growthRate = getGrowthRate(riskLevel);
  const projectionData = generateProjectionCurve(percent, salary, growthRate);
  const projectedTotal = projectedBalance;

  const recommendedPercent = 12;
  const progressPercentage = Math.min(
    (percent / recommendedPercent) * 100,
    100,
  );

  const targetGoalLine = useMemo(() => {
    const d = generateProjectionCurve(recommendedPercent, salary, growthRate);
    return d[d.length - 1]?.value ?? 0;
  }, [salary, growthRate]);

  const comparisonData = generateProjectionCurve(
    comparePercent,
    salary,
    growthRate,
  );
  const comparisonTotal = comparisonData[comparisonData.length - 1]?.value ?? 0;
  const chartEndCurrent =
    projectionData[projectionData.length - 1]?.value ?? 0;
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
      setDollarInput(
        String(Math.round((salary * Math.round(numValue)) / 100)),
      );
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
    if (name === "contributions")
      return [formatted, t(`${S}chartYourContributions`)];
    if (name === "marketGain") return [formatted, t(`${S}chartMarketGains`)];
    return [formatted, name];
  };

  const card: CSSProperties = {
    background: "var(--enroll-card-bg)",
    border: "1px solid var(--enroll-card-border)",
    borderRadius: "1rem",
    boxShadow: "var(--enroll-elevation-2, 0 1px 2px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.06))",
  };

  return (
    <div className="ew-step" style={{ gap: "1.5rem" }}>
      <div className="min-w-0 text-left">
        <h1
          className="text-2xl font-semibold leading-tight tracking-tight"
          style={{ color: "var(--enroll-text-primary)" }}
        >
          {t(`${S}title`)}
        </h1>
        <p
          className="mt-1.5 text-sm leading-snug"
          style={{ color: "var(--enroll-text-secondary)" }}
        >
          {t(`${S}subtitle`)}
        </p>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)] lg:items-start">
        {/* ─── Left: Settings Card ─── */}
        <div
          className="flex min-w-0 flex-col gap-5 p-6 transition-shadow hover:shadow-md"
          style={card}
        >
          {/* Monthly paycheck */}
          <div
            className="rounded-xl px-4 py-3.5"
            style={{
              background:
                "color-mix(in srgb, var(--enroll-brand) 8%, var(--enroll-card-bg))",
            }}
          >
            <p
              className="text-[0.65rem] font-semibold uppercase tracking-[0.12em]"
              style={{ color: "var(--enroll-text-secondary)" }}
            >
              {t(`${S}monthlyPaycheck`)}
            </p>
            <p
              className="mt-1 text-2xl font-bold tabular-nums"
              style={{ color: "var(--enroll-text-primary)" }}
            >
              ${monthlyPaycheck.toLocaleString()}
            </p>
          </div>

          {/* +/- Contribution control */}
          <div>
            <p
              className="text-[0.65rem] font-semibold uppercase tracking-[0.12em]"
              style={{ color: "var(--enroll-text-secondary)" }}
            >
              {t(`${S}yourContribution`)}
            </p>
            <div className="mt-3 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => adjustPercent(-1)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors"
                style={{
                  background:
                    "color-mix(in srgb, var(--enroll-brand) 12%, var(--enroll-card-bg))",
                  color: "var(--enroll-brand)",
                }}
                aria-label={t(`${S}decreasePctAria`)}
              >
                <Minus className="h-5 w-5" aria-hidden strokeWidth={2.5} />
              </button>
              <p
                className="min-w-[4.5rem] text-center text-4xl font-bold tabular-nums leading-none"
                style={{ color: "var(--enroll-brand)" }}
              >
                {percent}%
              </p>
              <button
                type="button"
                onClick={() => adjustPercent(1)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors"
                style={{
                  background:
                    "color-mix(in srgb, var(--enroll-brand) 12%, var(--enroll-card-bg))",
                  color: "var(--enroll-brand)",
                }}
                aria-label={t(`${S}increasePctAria`)}
              >
                <Plus className="h-5 w-5" aria-hidden strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Percent + Dollar inputs */}
          <div className="grid min-w-0 grid-cols-2 gap-3">
            <div className="min-w-0">
              <label
                className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.12em]"
                style={{ color: "var(--enroll-text-secondary)" }}
              >
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
                  className="w-full min-w-0 rounded-lg py-2.5 pr-8 pl-3 text-sm"
                  style={{
                    background: "var(--enroll-card-bg)",
                    border: "1px solid var(--enroll-card-border)",
                    color: "var(--enroll-text-primary)",
                  }}
                />
                <span
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold"
                  style={{ color: "var(--enroll-text-secondary)" }}
                >
                  %
                </span>
              </div>
            </div>
            <div className="min-w-0">
              <label
                className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.12em]"
                style={{ color: "var(--enroll-text-secondary)" }}
              >
                {t(`${S}annualDollar`)}
              </label>
              <div className="relative min-w-0">
                <span
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold"
                  style={{ color: "var(--enroll-text-secondary)" }}
                >
                  $
                </span>
                <input
                  type="text"
                  value={dollarInput}
                  onChange={(e) => handleDollarInputChange(e.target.value)}
                  className="w-full min-w-0 rounded-lg py-2.5 pr-3 pl-7 text-sm"
                  style={{
                    background: "var(--enroll-card-bg)",
                    border: "1px solid var(--enroll-card-border)",
                    color: "var(--enroll-text-primary)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Quick select chips */}
          <div>
            <p
              className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.12em]"
              style={{ color: "var(--enroll-text-secondary)" }}
            >
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
                    className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors"
                    style={{
                      borderColor: active
                        ? "var(--enroll-brand)"
                        : "var(--enroll-card-border)",
                      background: active
                        ? "var(--enroll-brand)"
                        : "var(--enroll-card-bg)",
                      color: active
                        ? "var(--color-text-on-primary)"
                        : "var(--enroll-text-primary)",
                      boxShadow: active
                        ? "0 1px 3px rgba(0,0,0,0.1)"
                        : "none",
                    }}
                  >
                    {active && isMatchChip ? (
                      <Check
                        className="h-3.5 w-3.5 shrink-0"
                        strokeWidth={3}
                        aria-hidden
                      />
                    ) : null}
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Range slider */}
          <div className="space-y-2 pt-1">
            <input
              type="range"
              min={1}
              max={25}
              value={percent}
              onChange={(e) =>
                updateField("contribution", Number(e.target.value))
              }
              className="contribution-range h-3 w-full min-w-0"
              style={{ "--range-pct": rangePct } as CSSProperties}
            />
            <div
              className="flex justify-between text-xs font-medium"
              style={{ color: "var(--enroll-text-secondary)" }}
            >
              <span>{t(`${S}rangeMin`)}</span>
              <span>{t(`${S}rangeMax`)}</span>
            </div>
          </div>

          {/* Pro tip */}
          <div
            className="rounded-xl border px-4 py-3.5"
            style={{
              borderColor:
                "color-mix(in srgb, var(--ai-primary) 25%, transparent)",
              background:
                "color-mix(in srgb, var(--ai-primary) 6%, var(--enroll-card-bg))",
            }}
          >
            <div className="flex min-w-0 items-start gap-2.5">
              <Sparkles
                className="mt-0.5 h-4 w-4 shrink-0"
                style={{ color: "var(--ai-primary)" }}
                aria-hidden
              />
              <div className="min-w-0">
                <p
                  className="text-xs font-semibold"
                  style={{ color: "var(--ai-primary)" }}
                >
                  {t(`${S}proTipTitle`)}
                </p>
                <p
                  className="mt-1 text-sm leading-snug"
                  style={{ color: "var(--enroll-text-secondary)" }}
                >
                  {t(`${S}proTipBody`, {
                    amount: `$${onePercentImpact.toLocaleString()}`,
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Right: Projection Card ─── */}
        <div
          className="flex min-w-0 flex-col gap-5 p-6"
          style={{
            ...card,
            backgroundImage: `linear-gradient(to bottom, var(--enroll-card-bg), color-mix(in srgb, var(--enroll-brand) 3%, var(--enroll-card-bg)))`,
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          }}
        >
          {/* Projection header */}
          <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h2
                className="text-lg font-semibold"
                style={{ color: "var(--enroll-text-primary)" }}
              >
                {t(`${S}projectionTitle`)}
              </h2>
              <p
                className="mt-1 text-xs leading-snug"
                style={{ color: "var(--enroll-text-secondary)" }}
              >
                {t(`${S}projectionSub`)}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p
                className="text-xs font-bold"
                style={{ color: "var(--color-success)" }}
              >
                {t(`${S}onTrack`, {
                  percent: Math.round(progressPercentage),
                })}
              </p>
              <div
                className="mt-1.5 h-2 w-32 overflow-hidden rounded-full border"
                style={{
                  borderColor: "var(--enroll-card-border)",
                  background: "var(--enroll-card-bg)",
                }}
              >
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${progressPercentage}%`,
                    background: "var(--color-success)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Metric cards */}
          <div className="grid min-w-0 grid-cols-2 gap-3">
            <div
              className="min-w-0 rounded-xl border p-3.5"
              style={{
                borderColor:
                  "color-mix(in srgb, var(--color-success) 25%, transparent)",
                background:
                  "color-mix(in srgb, var(--color-success) 6%, var(--enroll-card-bg))",
              }}
            >
              <p
                className="text-center text-[0.65rem] font-semibold uppercase tracking-[0.1em]"
                style={{ color: "var(--enroll-text-secondary)" }}
              >
                {t(`${S}projectedAtAge`, { age: retirementAge })}
              </p>
              <p
                className="mt-1.5 text-center text-2xl font-bold tabular-nums leading-none"
                style={{ color: "var(--color-success)" }}
              >
                ${(projectedTotal / 1_000_000).toFixed(1)}M
              </p>
              <p
                className="mt-1 text-center text-xs font-medium"
                style={{ color: "var(--color-success)" }}
              >
                {t(`${S}approxPerMo`, {
                  amount: `$${monthlyRetirementIncome.toLocaleString()}`,
                })}
              </p>
            </div>

            <div
              className="flex min-w-0 flex-col justify-between rounded-xl border p-3.5"
              style={{
                borderColor: "var(--enroll-card-border)",
                background: "var(--enroll-card-bg)",
              }}
            >
              <p
                className="text-center text-[0.65rem] font-bold uppercase tracking-[0.1em]"
                style={{ color: "var(--enroll-text-primary)" }}
              >
                {t(`${S}monthlyImpact`)}
              </p>
              <div className="mt-2 text-center">
                <p
                  className="text-xs"
                  style={{ color: "var(--enroll-text-secondary)" }}
                >
                  {t(`${S}youContribute`)}
                </p>
                <p
                  className="mt-0.5 text-base font-semibold tabular-nums"
                  style={{ color: "var(--enroll-text-primary)" }}
                >
                  ${monthlyContribution.toLocaleString()}
                </p>
              </div>
              <div
                className="mt-2 rounded-lg border px-2 py-2"
                style={{
                  borderColor:
                    "color-mix(in srgb, var(--color-success) 25%, transparent)",
                  background:
                    "color-mix(in srgb, var(--color-success) 6%, var(--enroll-card-bg))",
                }}
              >
                <p
                  className="text-center text-xs font-semibold"
                  style={{ color: "var(--color-success)" }}
                >
                  {t(`${S}employerAdds`)}{" "}
                  <span className="tabular-nums">
                    +${monthlyMatch.toLocaleString()}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="min-h-0 min-w-0">
            <div className="h-52 min-h-[13rem] w-full md:h-60">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={projectionData}
                  margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id={gradientId}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--color-primary)"
                        stopOpacity={0.32}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-primary)"
                        stopOpacity={0.04}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--color-border)"
                    opacity={0.45}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="year"
                    tick={{
                      fontSize: 10,
                      fill: "var(--color-text-tertiary)",
                    }}
                    tickLine={false}
                    axisLine={{ stroke: "var(--color-border)" }}
                    interval={4}
                  />
                  <YAxis
                    tick={{
                      fontSize: 10,
                      fill: "var(--color-text-tertiary)",
                    }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) =>
                      `$${(val / 1_000_000).toFixed(1)}M`
                    }
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

            {/* Legend */}
            <div
              className="mt-3 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 text-xs"
              style={{ color: "var(--enroll-text-secondary)" }}
            >
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

            {/* Disclaimer */}
            <div className="mt-3 flex min-w-0 items-start gap-2">
              <Info
                className="mt-0.5 h-3.5 w-3.5 shrink-0"
                style={{ color: "var(--enroll-text-muted)" }}
                aria-hidden
              />
              <p
                className="text-xs leading-snug"
                style={{ color: "var(--enroll-text-secondary)" }}
              >
                {t(`${S}disclaimer`)}
              </p>
            </div>
          </div>

          {/* Compare scenarios */}
          <div
            className="mt-1 rounded-xl border px-4 py-3.5 shadow-sm"
            style={{
              borderColor: "var(--enroll-card-border)",
              background: "var(--enroll-card-bg)",
            }}
          >
            <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
              <p
                className="text-[0.65rem] font-bold uppercase tracking-[0.14em]"
                style={{ color: "var(--enroll-text-primary)" }}
              >
                {t(`${S}compareScenarios`)}
              </p>
              <button
                type="button"
                onClick={() => setCompareMode(!compareMode)}
                className="rounded-md border px-4 py-2 text-xs font-semibold shadow-sm transition-colors"
                style={{
                  borderColor: "var(--enroll-card-border)",
                  background: "var(--enroll-card-bg)",
                  color: "var(--enroll-text-primary)",
                }}
              >
                {compareMode ? t(`${S}hide`) : t(`${S}show`)}
              </button>
            </div>
            {compareMode && (
              <div
                className="mt-3 space-y-3 border-t pt-3"
                style={{ borderColor: "var(--enroll-card-border)" }}
              >
                <div className="flex min-w-0 gap-2">
                  {[10, 12, 15].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setComparePercent(val)}
                      className="min-w-0 flex-1 rounded-md border px-2 py-2 text-xs font-semibold transition-colors"
                      style={{
                        borderColor:
                          comparePercent === val
                            ? "color-mix(in srgb, var(--enroll-brand) 30%, transparent)"
                            : "var(--enroll-card-border)",
                        background:
                          comparePercent === val
                            ? "color-mix(in srgb, var(--enroll-brand) 8%, var(--enroll-card-bg))"
                            : "var(--enroll-card-bg)",
                        color:
                          comparePercent === val
                            ? "var(--enroll-brand)"
                            : "var(--enroll-text-primary)",
                      }}
                    >
                      {val}%
                    </button>
                  ))}
                </div>
                <div
                  className="rounded-lg border p-3"
                  style={{
                    borderColor:
                      difference < 0
                        ? "color-mix(in srgb, var(--color-error) 25%, transparent)"
                        : "color-mix(in srgb, var(--color-success) 25%, transparent)",
                    background:
                      difference < 0
                        ? "color-mix(in srgb, var(--color-error) 6%, var(--enroll-card-bg))"
                        : "color-mix(in srgb, var(--color-success) 6%, var(--enroll-card-bg))",
                  }}
                >
                  <p
                    className="text-sm font-bold"
                    style={{
                      color:
                        difference < 0
                          ? "var(--color-error)"
                          : "var(--color-success)",
                    }}
                  >
                    {difference >= 0 ? "+" : "-"}$
                    {Math.abs(difference).toLocaleString()}
                  </p>
                  <p
                    className="text-xs"
                    style={{
                      color:
                        difference < 0
                          ? "var(--color-error)"
                          : "var(--color-success)",
                    }}
                  >
                    {difference >= 0
                      ? t(`${S}compareMore`)
                      : t(`${S}compareLess`)}{" "}
                    {t(`${S}compareVs`, {
                      compare: comparePercent,
                      current: percent,
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

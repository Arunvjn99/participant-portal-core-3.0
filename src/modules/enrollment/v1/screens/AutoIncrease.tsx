import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { ArrowRight, Calendar, DollarSign, Info, Minus, Target, TrendingUp } from "lucide-react";
import { useEnrollmentStore } from "../store/useEnrollmentStore";
import { cn } from "@/lib/utils";
import type { IncrementCycle, RiskLevel } from "../store/useEnrollmentStore";

type Choice = null | "skip" | "enable";

const GROWTH: Record<RiskLevel, number> = {
  conservative: 0.045,
  balanced: 0.068,
  growth: 0.082,
  aggressive: 0.095,
};

export function AutoIncrease() {
  const data = useEnrollmentStore();
  const updateField = useEnrollmentStore((s) => s.updateField);

  const [choice, setChoice] = useState<Choice>(null);
  const [setupSaved, setSetupSaved] = useState(false);
  const [increaseAmount, setIncreaseAmount] = useState(data.autoIncreaseRate);
  const [maxContribution, setMaxContribution] = useState(
    Math.min(Math.max(data.autoIncreaseMax, 10), 15),
  );
  const [incrementCycle, setIncrementCycle] = useState<IncrementCycle>(data.incrementCycle);

  useEffect(() => {
    if (data.autoIncrease) {
      setChoice("enable");
      setSetupSaved(data.autoIncreaseStepResolved);
      setIncreaseAmount(data.autoIncreaseRate);
      setMaxContribution(Math.min(Math.max(data.autoIncreaseMax, 10), 15));
      setIncrementCycle(data.incrementCycle);
    } else if (data.autoIncreaseStepResolved) {
      setChoice("skip");
      setSetupSaved(true);
    }
  }, [
    data.autoIncrease,
    data.autoIncreaseStepResolved,
    data.autoIncreaseRate,
    data.autoIncreaseMax,
    data.incrementCycle,
  ]);

  const currentPercent = data.contribution;
  const salary = data.salary;
  const risk = data.riskLevel ?? "balanced";
  const growthRate = GROWTH[risk] ?? 0.068;

  const fixedProjection = 124621;
  const autoProjection = 185943;
  const difference = autoProjection - fixedProjection;

  const currentMonthlyContribution = Math.round((salary * currentPercent) / 100 / 12);

  const yearsToMax =
    currentPercent >= maxContribution || increaseAmount === 0
      ? 0
      : Math.ceil((maxContribution - currentPercent) / increaseAmount);

  const financialImpact = useMemo(() => {
    const yearsToRetirement = data.retirementAge - data.currentAge;
    let balanceFixed = data.currentSavings;
    for (let y = 0; y < yearsToRetirement; y++) {
      const contrib = (currentPercent / 100) * salary;
      const match = (Math.min(currentPercent, 6) / 100) * salary;
      balanceFixed = (balanceFixed + contrib + match) * (1 + growthRate);
    }
    let balanceAuto = data.currentSavings;
    let autoPct = currentPercent;
    for (let y = 0; y < yearsToRetirement; y++) {
      const contrib = (autoPct / 100) * salary;
      const match = (Math.min(autoPct, 6) / 100) * salary;
      balanceAuto = (balanceAuto + contrib + match) * (1 + growthRate);
      autoPct = Math.min(autoPct + increaseAmount, maxContribution);
    }
    return {
      withoutIncrease: balanceFixed,
      withIncrease: balanceAuto,
      difference: balanceAuto - balanceFixed,
    };
  }, [
    currentPercent,
    increaseAmount,
    maxContribution,
    salary,
    growthRate,
    data.currentSavings,
    data.retirementAge,
    data.currentAge,
  ]);

  const formatCurrency = (val: number) => {
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
    if (val >= 1_000) return `$${Math.round(val / 1_000).toLocaleString()}K`;
    return `$${Math.round(val).toLocaleString()}`;
  };

  const handleSkip = () => {
    updateField("autoIncrease", false);
    updateField("autoIncreaseStepResolved", true);
    setChoice("skip");
    setSetupSaved(true);
  };

  const handleEnable = () => {
    updateField("autoIncreaseStepResolved", false);
    setChoice("enable");
    setSetupSaved(false);
  };

  const handleSaveSetup = () => {
    updateField("autoIncrease", true);
    updateField("autoIncreaseRate", increaseAmount);
    updateField("autoIncreaseMax", maxContribution);
    updateField("incrementCycle", incrementCycle);
    updateField("autoIncreaseStepResolved", true);
    setSetupSaved(true);
  };

  const increaseRangePct = `${(increaseAmount / 3) * 100}%`;
  const maxRangePct = `${((maxContribution - 10) / 5) * 100}%`;

  if (choice !== "enable") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground md:text-2xl">
            Increase your savings automatically
          </h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            Small increases today can grow your retirement savings over time.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="auto-increase-card">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <Minus className="h-5 w-5 text-muted-foreground" aria-hidden />
              </div>
              <h3 className="font-semibold text-foreground">Keep Contributions Fixed</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Your contribution stays at {currentPercent}% throughout.
            </p>
            <div className="mt-4 flex-1">
              <p className="text-xs text-muted-foreground">Projected in 10 years</p>
              <p className="text-3xl font-bold text-foreground">${fixedProjection.toLocaleString()}</p>
            </div>
            <button
              type="button"
              onClick={handleSkip}
              className={cn(
                "btn btn-outline mt-5 w-full",
                choice === "skip" && "ring-2 ring-primary ring-offset-2 ring-offset-background",
              )}
            >
              Skip Auto Increase
            </button>
          </div>

          <div className="auto-increase-card auto-increase-card--featured">
            <span className="badge-floating">Recommended</span>
            <div className="mb-3 mt-1 flex items-center gap-2">
              <div className="success-icon-soft">
                <TrendingUp className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="font-semibold text-foreground">Enable Auto Increase</h3>
            </div>
            <p className="text-sm text-muted-foreground">Increase by 1% each year up to 15%.</p>
            <div className="mt-4 flex-1">
              <p className="text-xs text-muted-foreground">Projected in 10 years</p>
              <p className="success-metric-xl">${autoProjection.toLocaleString()}</p>
            </div>
            <button type="button" onClick={handleEnable} className="btn btn-primary mt-5 w-full">
              Enable Auto Increase <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>

        <div className="success-callout success-callout--stack success-callout--compact">
          <p className="text-sm font-medium text-foreground">
            Automatic increases could add{" "}
            <span className="success-emphasis-num">+${difference.toLocaleString()}</span> over
            10 years.
          </p>
        </div>

        {choice == null ? (
          <p className="text-center text-sm text-muted-foreground">
            Choose an option above, then use <strong>Next</strong> to continue.
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-2.5">
          <div className="success-icon-soft success-icon-soft--sm">
            <TrendingUp className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Configure your automatic increases</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Your contribution will gradually increase over time.
            </p>
          </div>
        </div>
        <div className="stat-pair-panel flex shrink-0 gap-6">
          <div className="stat-pair-panel__col">
            <p className="text-[0.65rem] font-bold uppercase tracking-wide text-muted-foreground">Current</p>
            <p className="text-2xl font-extrabold text-foreground">{currentPercent}%</p>
            <p className="mt-1 text-xs text-muted-foreground">
              ${currentMonthlyContribution.toLocaleString()}/mo
            </p>
          </div>
          <div className="stat-pair-panel__col stat-pair-panel__divider">
            <p className="text-[0.65rem] font-bold uppercase tracking-wide text-muted-foreground">Target Max</p>
            <p className="text-2xl font-extrabold text-foreground">{maxContribution}%</p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-5 lg:items-start">
        <div className="space-y-4 lg:col-span-3">
          <div className="enroll-section-card card-border-accent">
            <h3 className="mb-2.5 text-sm font-bold text-foreground">Increment Cycle</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {(
                [
                  { id: "calendar" as const, title: "Calendar Year", sub: "Every Jan 1st" },
                  { id: "participant" as const, title: "Participant Date", sub: "On enrollment date" },
                  { id: "plan" as const, title: "Plan Year", sub: "Every April 1" },
                ] satisfies { id: IncrementCycle; title: string; sub: string }[]
              ).map((opt) => (
                <label
                  key={opt.id}
                  className={cn(
                    "flex cursor-pointer flex-col gap-2 rounded-[calc(var(--ds-card-radius)-4px)] border-2 p-3 transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/5",
                    incrementCycle === opt.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="increment-cycle"
                      checked={incrementCycle === opt.id}
                      onChange={() => setIncrementCycle(opt.id)}
                      className="h-4 w-4 accent-primary"
                    />
                    <p className="text-sm font-semibold text-foreground">{opt.title}</p>
                  </div>
                  <p className="ml-6 text-[0.7rem] text-muted-foreground">{opt.sub}</p>
                </label>
              ))}
            </div>
          </div>

          <div className="enroll-section-card enroll-section-card--tight">
            <div className="flex gap-3">
              <div className="icon-box-soft">
                <Calendar className="h-4 w-4" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-sm font-medium text-foreground">
                  How much do you want to increase per cycle?
                </span>
                <div className="mt-2">
                  <div className="mb-1 flex items-center justify-between text-[0.65rem] text-muted-foreground">
                    <span>0%</span>
                    <span className="text-sm font-bold text-primary">{increaseAmount}% per cycle</span>
                    <span>3%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={3}
                    step={0.5}
                    value={increaseAmount}
                    onChange={(e) => setIncreaseAmount(parseFloat(e.target.value))}
                    className="enroll-range"
                    style={{ "--range-pct": increaseRangePct } as CSSProperties}
                  />
                </div>
                <div className="mt-2 flex gap-2">
                  {[1, 2, 3].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setIncreaseAmount(opt)}
                      className={cn("chip flex-1", increaseAmount === opt && "chip-active")}
                    >
                      {opt}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="enroll-section-card enroll-section-card--tight">
            <div className="flex gap-3">
              <div className="icon-box-target">
                <Target className="h-4 w-4" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-sm font-medium text-foreground">
                  Stop increasing when contributions reach
                </span>
                <p className="mt-0.5 text-[0.78rem] text-muted-foreground">
                  Your contribution rate will not exceed this percentage.
                </p>
                <div className="mt-4">
                  <div className="mb-1.5 flex items-center justify-between text-[0.7rem] text-muted-foreground">
                    <span>10%</span>
                    <span className="text-accent-chart5-lg">{maxContribution}%</span>
                    <span>15%</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={15}
                    step={1}
                    value={maxContribution}
                    onChange={(e) => setMaxContribution(parseInt(e.target.value, 10))}
                    className="enroll-range enroll-range--secondary-accent"
                    style={{ "--range-pct": maxRangePct } as CSSProperties}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 px-1">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            <p className="text-[0.78rem] text-muted-foreground">
              Automatic increases apply once per year. Your contribution will rise by the selected percentage each
              year until it reaches your maximum. You can change or disable automatic increases at any time.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSaveSetup}
            disabled={increaseAmount === 0}
            className="btn btn-primary w-full"
          >
            Save Auto Increase <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <div className="card lg:col-span-2">
          <div className="border-b border-border px-5 py-3.5">
            <p className="text-sm text-foreground/90">
              {currentPercent >= maxContribution ? (
                <>Your contribution rate is already at or above your selected maximum.</>
              ) : increaseAmount === 0 ? (
                <>Select an increase amount to see your contribution growth path.</>
              ) : (
                <>
                  Your contribution will grow from{" "}
                  <span className="font-semibold text-foreground">{currentPercent}%</span> to{" "}
                  <span className="font-semibold text-foreground">{maxContribution}%</span> over approximately{" "}
                  <span className="font-semibold text-foreground">
                    {yearsToMax} {yearsToMax === 1 ? "year" : "years"}
                  </span>
                  .
                </>
              )}
            </p>
          </div>

          {increaseAmount > 0 && financialImpact.difference > 0 ? (
            <div className="space-y-3 px-5 py-4">
              <p className="text-sm font-semibold text-foreground">Savings Impact</p>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-[calc(var(--ds-card-radius)-4px)] bg-muted px-3 py-3 text-center">
                  <p className="mb-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-muted-foreground">
                    Without increases
                  </p>
                  <p className="text-lg font-bold tabular-nums text-foreground">
                    {formatCurrency(financialImpact.withoutIncrease)}
                  </p>
                </div>
                <div className="success-card success-card--compact text-center">
                  <p className="success-kicker">With increases</p>
                  <p className="success-figure-tabular">{formatCurrency(financialImpact.withIncrease)}</p>
                </div>
              </div>
              <div className="success-callout success-callout--compact">
                <DollarSign className="success-callout-icon mt-0.5 h-4 w-4" aria-hidden />
                <p className="text-left text-[0.78rem] text-foreground/90">
                  Automatic increases could add approximately{" "}
                  <span className="success-emphasis-num">{formatCurrency(financialImpact.difference)}</span>{" "}
                  more to your retirement savings compared to keeping contributions fixed.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {setupSaved ? (
        <p className="success-footer-note text-center">
          Settings saved. Continue with <strong>Next</strong>.
        </p>
      ) : (
        <p className="text-center text-sm text-muted-foreground">
          Save your auto increase settings to enable <strong>Next</strong>.
        </p>
      )}
    </div>
  );
}

/**
 * Auto Increase step — UI layout only. No local state, no calculations.
 * All values and handlers from props (useEnrollment).
 */
import {
  TrendingUp,
  Calendar,
  Target,
  ArrowUpRight,
  Info,
  Pause,
  Play,
  Rocket,
  BadgeDollarSign,
  ShieldCheck,
  Clock,
  Check,
  AlertTriangle,
} from "lucide-react";
import { AIInsightBanner } from "../../../enrollment-v2/components/AIInsightBanner";
import Button from "../../../components/ui/Button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export type AutoIncreasePhase = "education" | "configure" | "skipped";

export interface AutoIncreaseLayoutV2Props {
  phase: AutoIncreasePhase;
  onPhaseChange: (phase: AutoIncreasePhase) => void;
  selectedPlanLabel: string;
  salary: number;
  /** Current contribution % (from context) */
  currentContributionPercent: number;
  /** For education: projected balance without auto */
  projectedWithoutAuto: number;
  /** For education: projected balance with auto */
  projectedWithAuto: number;
  /** For education: difference */
  projectedDifference: number;
  /** For education: extra per month (e.g. 2% of salary / 12) */
  monthlyImpactHint: number;
  /** For configure: increase % per period */
  increaseAmount: number;
  onIncreaseAmountChange: (v: number) => void;
  /** For configure: max cap % */
  maxCap: number;
  onMaxCapChange: (v: number) => void;
  /** For configure: frequency id */
  frequency: string;
  onFrequencyChange: (id: string) => void;
  frequencyOptions: Array<{ id: string; label: string; description: string }>;
  /** Chart data for configure: year, withoutAutoIncrease, withAutoIncrease */
  projectionChartData: Array<{ year: string; withoutAutoIncrease: number; withAutoIncrease: number }>;
  /** For configure: final balance with auto */
  finalBalanceWithAuto: number;
  /** For configure: final balance without */
  finalBalanceWithoutAuto: number;
  /** For configure: difference */
  configureDifference: number;
  /** For skipped: missed savings message */
  missedSavingsMessage?: string;
}

export function AutoIncreaseLayoutV2({
  phase,
  onPhaseChange,
  selectedPlanLabel,
  currentContributionPercent,
  projectedWithoutAuto,
  projectedWithAuto,
  projectedDifference,
  monthlyImpactHint,
  increaseAmount,
  onIncreaseAmountChange,
  maxCap,
  onMaxCapChange,
  frequency,
  onFrequencyChange,
  frequencyOptions,
  projectionChartData,
  finalBalanceWithAuto,
  finalBalanceWithoutAuto,
  configureDifference,
  missedSavingsMessage,
}: AutoIncreaseLayoutV2Props) {
  if (phase === "education") {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <AIInsightBanner
          icon={<Rocket className="w-5 h-5 flex-shrink-0" />}
          title="Small increases, big results"
          description={`Small automatic increases today can add up to +$${projectedDifference.toLocaleString()} in just 10 years — helping you enjoy a more comfortable retirement.`}
        />

        <div
          className="enrollment-card rounded-2xl border border-[var(--enroll-card-border)] p-6"
          style={{ background: "var(--enroll-card-bg)" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div
              className="text-center rounded-2xl p-5 border border-[var(--enroll-card-border)]"
              style={{ background: "var(--enroll-soft-bg)", borderColor: "var(--enroll-card-border)" }}
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 border" style={{ background: "var(--enroll-card-bg)", borderColor: "var(--enroll-card-border)" }}>
                <TrendingUp className="w-6 h-6" style={{ color: "var(--enroll-text-secondary)" }} />
              </div>
              <h3 className="text-lg font-bold mb-2 leading-7" style={{ color: "var(--enroll-text-primary)" }}>Keep it Steady</h3>
              <div className="text-xs uppercase tracking-wide mb-2 font-semibold" style={{ color: "var(--enroll-text-secondary)" }}>Without Auto Increase</div>
              <div className="text-3xl md:text-4xl font-bold mb-1.5" style={{ color: "var(--enroll-text-primary)" }}>${projectedWithoutAuto.toLocaleString()}</div>
              <div className="text-sm mb-4" style={{ color: "var(--enroll-text-secondary)" }}>Stay at {currentContributionPercent}% for 10 years</div>
              <Button type="button" variant="outline" className="w-full h-11" onClick={() => onPhaseChange("skipped")}>
                Skip for Now
              </Button>
            </div>

            <div
              className="text-center rounded-2xl p-5 border relative"
              style={{
                background: "var(--enroll-success-tint-bg)",
                borderColor: "var(--enroll-success-tint-border)",
              }}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1.5 text-xs font-bold rounded-full shadow-md h-6 flex items-center" style={{ background: "var(--success)", color: "var(--color-text-inverse)" }}>
                RECOMMENDED
              </div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 border" style={{ background: "var(--color-success-light)", borderColor: "var(--enroll-success-tint-border)" }}>
                <Rocket className="w-6 h-6" style={{ color: "var(--success)" }} />
              </div>
              <h3 className="text-lg font-bold mb-2 leading-7" style={{ color: "var(--success)" }}>Grow Gradually</h3>
              <div className="text-xs uppercase tracking-[0.3px] mb-2 font-semibold" style={{ color: "var(--success)" }}>With Auto Increase</div>
              <div className="text-3xl md:text-4xl font-bold mb-1.5 leading-10" style={{ color: "var(--success)" }}>${projectedWithAuto.toLocaleString()}</div>
              <div className="text-sm mb-4" style={{ color: "var(--enroll-text-secondary)" }}>Grow from {currentContributionPercent}% to 15%</div>
              <Button type="button" className="w-full h-[58px] rounded-[10px] flex flex-col items-center justify-center gap-0.5 shadow-sm transition-all duration-150 ease-out hover:shadow-md" style={{ background: "var(--success)", color: "var(--color-text-inverse)" }} onClick={() => onPhaseChange("configure")}>
                <span className="text-sm font-semibold leading-5">Enable Auto Increase</span>
                <span className="text-xs font-normal leading-4 opacity-90">Yes, Increase My Contributions</span>
              </Button>
            </div>
          </div>

          <div
            className="rounded-2xl p-6 mb-6 overflow-hidden border border-[var(--enroll-success-tint-border)]"
            style={{ background: "var(--enroll-success-tint-bg)" }}
          >
            <div className="text-center">
              <div className="text-sm font-semibold mb-1.5 text-[var(--success)]">Strengthen Your Future with Automatic Increases</div>
              <div className="text-4xl md:text-5xl font-black text-[var(--success)] mb-1.5">+${projectedDifference.toLocaleString()}</div>
              <div className="text-base" style={{ color: "var(--enroll-text-secondary)" }}>over 10 years with Auto Increase</div>
            </div>
          </div>

          <div className="flex gap-2.5 justify-center flex-wrap mb-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border h-[38px]" style={{ background: "var(--enroll-success-tint-bg)", borderColor: "var(--enroll-success-tint-border)" }}>
              <BadgeDollarSign className="w-4 h-4" style={{ color: "var(--success)" }} />
              <span className="text-sm font-medium" style={{ color: "var(--success)" }}>Only ${monthlyImpactHint}/mo more</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border h-[38px]" style={{ background: "var(--enroll-risk-badge-bg)", borderColor: "var(--enroll-risk-badge-border)" }}>
              <ShieldCheck className="w-4 h-4" style={{ color: "var(--brand-primary)" }} />
              <span className="text-sm font-medium" style={{ color: "var(--brand-primary)" }}>Pause anytime</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border h-[38px]" style={{ background: "var(--enroll-soft-bg)", borderColor: "var(--enroll-card-border)" }}>
              <Clock className="w-4 h-4" style={{ color: "var(--enroll-brand)" }} />
              <span className="text-sm font-medium" style={{ color: "var(--enroll-brand)" }}>Fully automatic</span>
            </div>
          </div>
          <p className="text-center text-sm" style={{ color: "var(--enroll-text-secondary)" }}>You can always change this later in your plan settings</p>
        </div>
      </div>
    );
  }

  if (phase === "skipped") {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="relative max-w-xl">
          <div className="absolute -left-4 top-0 w-1 h-12 rounded-full bg-[var(--enroll-card-border)]" />
          <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--enroll-text-primary)" }}>Auto Increase Skipped</h2>
          <p className="text-base" style={{ color: "var(--enroll-text-secondary)" }}>
            Your contributions will remain at {currentContributionPercent}% unless you manually adjust them
          </p>
        </div>
        <div className="enrollment-card rounded-2xl border border-[var(--enroll-card-border)] p-6 text-center max-w-xl mx-auto" style={{ background: "var(--enroll-card-bg)" }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "var(--enroll-soft-bg)", border: "1px solid var(--enroll-card-border)" }}>
            <Pause className="w-8 h-8" style={{ color: "var(--enroll-text-secondary)" }} />
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--enroll-text-primary)" }}>No Auto Increase Configured</h3>
          <p className="text-sm mb-4" style={{ color: "var(--enroll-text-secondary)" }}>
            Your {selectedPlanLabel} contribution rate will stay at {currentContributionPercent}%. You can enable auto increase later from your plan settings.
          </p>
          {missedSavingsMessage && (
            <div className="rounded-xl p-4 mb-6 border-2 border-[var(--danger)]" style={{ background: "var(--enroll-soft-bg)" }}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgb(var(--color-danger-rgb) / 0.15)", color: "var(--danger)" }}>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold mb-1" style={{ color: "var(--danger)" }}>Potential Missed Savings</p>
                  <p className="text-sm" style={{ color: "var(--danger)" }}>{missedSavingsMessage}</p>
                </div>
              </div>
            </div>
          )}
          <Button type="button" onClick={() => onPhaseChange("education")}>
            <Play className="w-4 h-4 mr-2" />
            Reconsider Auto Increase
          </Button>
        </div>
      </div>
    );
  }

  // configure
  const increasePct = (increaseAmount - 0.5) / 4.5;
  const maxCapMin = currentContributionPercent + 1;
  const maxCapRange = 25 - maxCapMin;
  const maxCapPct = maxCapRange > 0 ? (maxCap - maxCapMin) / maxCapRange : 0;

  return (
    <div className="space-y-6">
      <div className="relative">
        <div
          className="absolute -left-4 top-0 w-1 h-12 rounded-full"
          style={{ background: "linear-gradient(to bottom, var(--success), var(--enroll-brand))" }}
        />
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-lg font-semibold" style={{ color: "var(--enroll-text-primary)" }}>Configure Auto Increase</h2>
          <span className="px-3 py-1 rounded-full text-xs font-bold border" style={{ background: "var(--enroll-active-badge-bg)", borderColor: "var(--enroll-active-badge-border)", color: "var(--success)" }}>ENABLED</span>
        </div>
        <p className="text-base" style={{ color: "var(--enroll-text-secondary)" }}>Customize how your {selectedPlanLabel} contributions grow over time</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Frequency */}
          <div className="enrollment-card rounded-2xl border border-[var(--enroll-card-border)] p-6" style={{ background: "var(--enroll-card-bg)" }}>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-[var(--enroll-card-border)]" style={{ background: "var(--enroll-soft-bg)" }}>
                <Calendar className="w-5 h-5" style={{ color: "var(--enroll-brand)" }} />
              </div>
              <h3 className="text-lg font-semibold" style={{ color: "var(--enroll-text-primary)" }}>Select your auto-increase frequency</h3>
            </div>
            <p className="text-sm mb-3 flex items-center gap-1.5" style={{ color: "var(--enroll-text-secondary)" }}>
              <Info className="w-3.5 h-3.5 flex-shrink-0" />
              More frequent increases can help you reach your cap sooner with smaller steps.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-3">
              {frequencyOptions.map((f) => {
                const isSelected = frequency === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => onFrequencyChange(f.id)}
                    className={`relative p-3 rounded-lg border-2 transition-all text-center ${
                      isSelected ? "border-[var(--enroll-brand)]" : "border-[var(--enroll-card-border)]"
                    }`}
                    style={{ background: isSelected ? "var(--enroll-soft-bg)" : "var(--enroll-card-bg)" }}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "var(--enroll-brand)", color: "white" }}>
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </div>
                    )}
                    <div className="text-sm font-bold mb-0.5" style={{ color: isSelected ? "var(--enroll-brand)" : "var(--enroll-text-primary)" }}>{f.label}</div>
                    <div className="text-sm" style={{ color: "var(--enroll-text-secondary)" }}>{f.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Increase amount */}
          <div className="enrollment-card rounded-2xl border border-[var(--enroll-card-border)] p-5" style={{ background: "var(--enroll-card-bg)" }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center border border-[var(--enroll-card-border)]" style={{ background: "var(--enroll-soft-bg)" }}>
                <TrendingUp className="w-4 h-4 text-[var(--success)]" />
              </div>
              <h3 className="text-lg font-semibold" style={{ color: "var(--enroll-text-primary)" }}>How much you want to increase your contribution</h3>
            </div>
            <p className="text-sm mb-3 flex items-center gap-1.5" style={{ color: "var(--enroll-text-secondary)" }}>
              <Info className="w-3.5 h-3.5 flex-shrink-0" />
              Small annual increases add up over time without impacting your budget much.
            </p>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-sm font-medium mr-1" style={{ color: "var(--enroll-text-secondary)" }}>Quick:</span>
              {[1, 2, 3].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => onIncreaseAmountChange(pct)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                    increaseAmount === pct ? "border-[var(--success)]" : "border-[var(--enroll-card-border)]"
                  }`}
                  style={{
                    background: increaseAmount === pct ? "var(--enroll-success-tint-bg)" : "var(--enroll-card-bg)",
                    color: increaseAmount === pct ? "var(--success)" : "var(--enroll-text-primary)",
                  }}
                >
                  {pct}%
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4 mb-1.5">
              <div className="flex-1">
                <input
                  type="range"
                  id="auto-increase-amount-slider"
                  min={0.5}
                  max={5}
                  step={0.5}
                  value={increaseAmount}
                  onChange={(e) => onIncreaseAmountChange(Number(e.target.value))}
                  className="contrib-slider-v2 block w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, var(--success) 0%, var(--success) ${increasePct * 100}%, var(--enroll-card-border) ${increasePct * 100}%, var(--enroll-card-border) 100%)`,
                  }}
                  aria-label="Annual increase percentage"
                  aria-valuemin={0.5}
                  aria-valuemax={5}
                  aria-valuenow={increaseAmount}
                  aria-valuetext={`${increaseAmount} percent`}
                />
                <div className="flex justify-between text-sm mt-1.5" style={{ color: "var(--enroll-text-secondary)" }}><span>0.5%</span><span>5%</span></div>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 border border-[var(--success)]" style={{ background: "var(--enroll-success-tint-bg)" }}>
                <label htmlFor="auto-increase-amount-slider" className="sr-only">Increase amount percent</label>
                <input
                  type="number"
                  min={0.5}
                  max={5}
                  step={0.5}
                  value={increaseAmount}
                  onChange={(e) => { const v = Number(e.target.value); if (v >= 0.5 && v <= 5) onIncreaseAmountChange(v); }}
                  className="w-10 text-lg font-bold outline-none text-center bg-transparent text-[var(--success)] focus:ring-2 focus:ring-[var(--success)] focus:ring-offset-1 rounded"
                  aria-label="Increase amount percent"
                />
                <span className="text-sm font-bold text-[var(--success)]">%</span>
              </div>
            </div>
            <p className="text-sm text-center mb-2.5" style={{ color: "var(--enroll-text-secondary)" }}>Your contribution will increase by <strong className="text-[var(--success)]">{increaseAmount}%</strong> each period</p>
          </div>

          {/* Max cap */}
          <div className="enrollment-card rounded-2xl border border-[var(--enroll-card-border)] p-5" style={{ background: "var(--enroll-card-bg)" }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center border border-[var(--enroll-card-border)]" style={{ background: "var(--enroll-soft-bg)" }}>
                <Target className="w-4 h-4" style={{ color: "var(--enroll-accent)" }} />
              </div>
              <h3 className="text-lg font-semibold" style={{ color: "var(--enroll-text-primary)" }}>Set maximum contribution limit</h3>
            </div>
            <p className="text-sm mb-3 flex items-center gap-1.5" style={{ color: "var(--enroll-text-secondary)" }}>
              <Info className="w-3.5 h-3.5 flex-shrink-0" />
              The IRS sets an annual limit; your auto-increase will stop at this cap.
            </p>
            <div className="flex items-center gap-4 mb-1.5">
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block" style={{ color: "var(--enroll-text-secondary)" }} htmlFor="auto-increase-cap-slider">Stop auto-increase at:</label>
                <input
                  type="range"
                  id="auto-increase-cap-slider"
                  min={maxCapMin}
                  max={25}
                  step={1}
                  value={maxCap}
                  onChange={(e) => onMaxCapChange(Number(e.target.value))}
                  className="contrib-slider-v2 block w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, var(--enroll-accent) 0%, var(--enroll-accent) ${maxCapPct * 100}%, var(--enroll-card-border) ${maxCapPct * 100}%, var(--enroll-card-border) 100%)`,
                  }}
                  aria-label="Maximum contribution cap percentage"
                  aria-valuemin={maxCapMin}
                  aria-valuemax={25}
                  aria-valuenow={maxCap}
                  aria-valuetext={`${maxCap} percent`}
                />
                <div className="flex justify-between text-sm mt-1.5 items-center" style={{ color: "var(--enroll-text-secondary)" }}>
                  <span>{maxCapMin}%</span>
                  <span className="flex items-center gap-1"><span>25%</span><span className="text-xs font-semibold opacity-80">IRS Max</span></span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 border" style={{ background: "var(--enroll-soft-bg)", borderColor: "var(--enroll-accent)" }}>
                <input
                  type="number"
                  min={maxCapMin}
                  max={25}
                  value={maxCap}
                  onChange={(e) => { const v = Number(e.target.value); if (v >= maxCapMin && v <= 25) onMaxCapChange(v); }}
                  className="w-10 text-lg font-bold outline-none text-center bg-transparent focus:ring-2 focus:ring-[var(--enroll-accent)] focus:ring-offset-1 rounded"
                  style={{ color: "var(--enroll-accent)" }}
                  aria-label="Maximum cap percent"
                />
                <span className="text-sm font-bold" style={{ color: "var(--enroll-accent)" }}>%</span>
              </div>
            </div>
            <p className="text-sm text-center mt-1.5" style={{ color: "var(--enroll-text-secondary)" }}>Auto increases will stop at <strong style={{ color: "var(--enroll-accent)" }}>{maxCap}%</strong></p>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="enrollment-card rounded-2xl border border-[var(--enroll-card-border)] p-6" style={{ background: "var(--enroll-card-bg)" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-[var(--enroll-card-border)]" style={{ background: "var(--enroll-soft-bg)" }}>
                <TrendingUp className="w-5 h-5" style={{ color: "var(--enroll-text-secondary)" }} />
              </div>
              <div>
                <h3 className="text-lg font-semibold" style={{ color: "var(--enroll-text-primary)" }}>Retirement Projection</h3>
                <p className="text-sm" style={{ color: "var(--enroll-text-secondary)" }}>Savings comparison</p>
              </div>
            </div>
            {projectionChartData.length > 0 && (
              <div className="mb-4 h-[200px] min-h-[200px] w-full">
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={projectionChartData} isAnimationActive={false}>
                    <defs>
                      <linearGradient id="areaWithAutoV2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--success)" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="var(--success)" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="areaWithoutAutoV2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--text-secondary)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="var(--text-secondary)" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                    <XAxis dataKey="year" tick={{ fontSize: 11 }} tickLine={false} />
                    <YAxis tick={{ fontSize: 11 }} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "var(--surface-1)", border: "1px solid var(--border-subtle)", borderRadius: "8px", fontSize: "12px" }}
                      formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name === "withAutoIncrease" ? "With Auto Increase" : "Without"]}
                    />
                    <Area type="monotone" dataKey="withoutAutoIncrease" stroke="var(--text-secondary)" fill="url(#areaWithoutAutoV2)" name="withoutAutoIncrease" />
                    <Area type="monotone" dataKey="withAutoIncrease" stroke="var(--success)" fill="url(#areaWithAutoV2)" name="withAutoIncrease" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="rounded-xl p-4 border border-[var(--enroll-card-border)]" style={{ background: "var(--enroll-soft-bg)" }}>
                <div className="text-xs font-bold uppercase mb-2" style={{ color: "var(--enroll-text-secondary)" }}>Without</div>
                <div className="text-lg font-bold" style={{ color: "var(--enroll-text-primary)" }}>${finalBalanceWithoutAuto.toLocaleString()}</div>
                <div className="text-sm" style={{ color: "var(--enroll-text-secondary)" }}>Stay at {currentContributionPercent}%</div>
              </div>
              <div className="rounded-xl p-3 border-2 border-[var(--success)]" style={{ background: "var(--enroll-success-tint-bg)" }}>
                <div className="text-xs font-bold uppercase mb-2 text-[var(--success)]">With Auto</div>
                <div className="text-lg font-bold text-[var(--success)]">${finalBalanceWithAuto.toLocaleString()}</div>
                <div className="text-xs text-[var(--success)]">Grow to {maxCap}%</div>
              </div>
            </div>
            <div className="rounded-xl p-4 mb-4 flex items-center justify-between overflow-hidden" style={{ background: "var(--success)" }}>
              <div>
                <div className="text-white/90 text-xs font-semibold mb-1">Extra Savings</div>
                <div className="text-white text-2xl md:text-3xl font-black">+${configureDifference.toLocaleString()}</div>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/20">
                <ArrowUpRight className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="rounded-lg p-3 border border-[var(--enroll-card-border)] flex items-start gap-2" style={{ background: "var(--enroll-soft-bg)" }}>
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "var(--enroll-text-secondary)" }} />
              <p className="text-sm" style={{ color: "var(--enroll-text-secondary)" }}>Projections are estimates. Actual results may vary.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

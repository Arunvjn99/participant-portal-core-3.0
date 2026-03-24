import { useState, type CSSProperties, type ReactNode } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Shield,
  Sparkles,
  TrendingUp,
  Wallet,
  DollarSign,
} from "lucide-react";
import type { ContributionSources } from "../store/useEnrollmentStore";
import { useEnrollmentStore } from "../store/useEnrollmentStore";
import { cn } from "@/lib/utils";

const PLAN_DEFAULT: ContributionSources = { preTax: 60, roth: 40, afterTax: 0 };
const RECOMMENDED: ContributionSources = { preTax: 40, roth: 60, afterTax: 0 };

export function ContributionSource() {
  const data = useEnrollmentStore();
  const updateField = useEnrollmentStore((s) => s.updateField);
  const sources = data.contributionSources;
  const salary = data.salary;
  const percent = data.contribution;
  const supportsAfterTax = data.supportsAfterTax;

  const [showAdvanced, setShowAdvanced] = useState(sources.afterTax > 0);

  const monthlyTotal = Math.round((salary * percent) / 100 / 12);
  const matchPercent = Math.min(percent, 6);
  const monthlyMatch = Math.round((salary * matchPercent) / 100 / 12);
  const monthlyPreTax = Math.round(monthlyTotal * (sources.preTax / 100));
  const monthlyRoth = Math.round(monthlyTotal * (sources.roth / 100));
  const monthlyAfterTax = Math.round(monthlyTotal * (sources.afterTax / 100));
  const totalMonthlyInvestment = monthlyTotal + monthlyMatch;

  const planDefaultPreTax = Math.round(monthlyTotal * (PLAN_DEFAULT.preTax / 100));
  const planDefaultRoth = Math.round(monthlyTotal * (PLAN_DEFAULT.roth / 100));

  const setSources = (next: ContributionSources) => {
    updateField("contributionSources", next);
  };

  const handlePreTaxChange = (value: number) => {
    const newPreTax = Math.min(100, Math.max(0, value));
    const remaining = 100 - newPreTax;
    const currentRothAfterTaxTotal = sources.roth + sources.afterTax;
    if (currentRothAfterTaxTotal > 0) {
      const rothRatio = sources.roth / currentRothAfterTaxTotal;
      setSources({
        preTax: newPreTax,
        roth: Math.round(remaining * rothRatio),
        afterTax: Math.round(remaining * (1 - rothRatio)),
      });
    } else {
      setSources({ preTax: newPreTax, roth: remaining, afterTax: 0 });
    }
  };

  const handleRothChange = (value: number) => {
    const newRoth = Math.min(100, Math.max(0, value));
    const remaining = 100 - newRoth;
    const currentPreTaxAfterTaxTotal = sources.preTax + sources.afterTax;
    if (currentPreTaxAfterTaxTotal > 0) {
      const preTaxRatio = sources.preTax / currentPreTaxAfterTaxTotal;
      setSources({
        preTax: Math.round(remaining * preTaxRatio),
        roth: newRoth,
        afterTax: Math.round(remaining * (1 - preTaxRatio)),
      });
    } else {
      setSources({ preTax: remaining, roth: newRoth, afterTax: 0 });
    }
  };

  const handleAfterTaxChange = (value: number) => {
    const newAfterTax = Math.min(100, Math.max(0, value));
    const remaining = 100 - newAfterTax;
    const currentPreTaxRothTotal = sources.preTax + sources.roth;
    if (currentPreTaxRothTotal > 0) {
      const preTaxRatio = sources.preTax / currentPreTaxRothTotal;
      setSources({
        preTax: Math.round(remaining * preTaxRatio),
        roth: Math.round(remaining * (1 - preTaxRatio)),
        afterTax: newAfterTax,
      });
    } else {
      setSources({ preTax: remaining, roth: 0, afterTax: newAfterTax });
    }
  };

  const total = sources.preTax + sources.roth + sources.afterTax;

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">How do you want to pay taxes?</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground md:text-base">
            Choose when you want to pay taxes on your savings.
          </p>
        </div>
        <div className="enroll-inline-highlight shrink-0">
          <Wallet className="h-5 w-5 text-primary" aria-hidden />
          <p className="text-sm font-bold text-foreground">
            You&apos;re contributing {percent}% (${monthlyTotal.toLocaleString()}/month)
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-5 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div className="card card--pad-sm flex flex-col space-y-4 opacity-90">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded-md bg-secondary px-2.5 py-1">
                <p className="text-[0.65rem] font-bold uppercase tracking-wide text-muted-foreground">Default</p>
              </div>
            </div>
            <h3 className="text-base font-bold text-foreground">Plan Default</h3>
            <p className="mt-1 text-xs text-muted-foreground">Applied if no changes are made</p>
          </div>
          <div className="alloc-bar-plain">
            <div className="flex h-full w-full">
              <div className="alloc-seg-pretax" style={{ width: `${PLAN_DEFAULT.preTax}%` }} />
              <div className="alloc-seg-roth" style={{ width: `${PLAN_DEFAULT.roth}%` }} />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="alloc-dot alloc-dot--md alloc-dot--pretax" />
                <p className="text-sm text-foreground">Pre-Tax ({PLAN_DEFAULT.preTax}%)</p>
              </div>
              <p className="text-sm font-semibold">${planDefaultPreTax.toLocaleString()}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="alloc-dot alloc-dot--md alloc-dot--roth" />
                <p className="text-sm text-foreground">Roth ({PLAN_DEFAULT.roth}%)</p>
              </div>
              <p className="text-sm font-semibold">${planDefaultRoth.toLocaleString()}</p>
            </div>
          </div>
          <p className="flex-1 pt-3 text-center text-[0.7rem] leading-snug text-muted-foreground">
            Your employer&apos;s default allocation balances tax benefits.
          </p>
          <button type="button" onClick={() => setSources({ ...PLAN_DEFAULT })} className="btn btn-primary w-full">
            Use plan default allocation
          </button>
        </div>

        <div className="card card-border-accent flex flex-col gap-6 lg:flex-row">
          <div className="min-w-0 flex-1 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-foreground">Your Tax Strategy</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">Total allocation: {total}%</p>
              </div>
              <div className="badge-recommended-enroll">
                <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden />
                <p className="text-[0.7rem] font-bold uppercase tracking-wide text-foreground">Recommended</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="alloc-bar-track">
                {sources.preTax > 0 ? (
                  <div className="alloc-seg-pretax transition-all" style={{ width: `${sources.preTax}%` }} />
                ) : null}
                {sources.roth > 0 ? (
                  <div className="alloc-seg-roth transition-all" style={{ width: `${sources.roth}%` }} />
                ) : null}
                {sources.afterTax > 0 ? (
                  <div className="alloc-seg-aftertax transition-all" style={{ width: `${sources.afterTax}%` }} />
                ) : null}
              </div>
              <div className="flex flex-wrap gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="alloc-dot alloc-dot--pretax" />
                  {sources.preTax}% Pre-Tax
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="alloc-dot alloc-dot--roth" />
                  {sources.roth}% Roth
                </span>
                {sources.afterTax > 0 ? (
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="alloc-dot alloc-dot--aftertax" />
                    {sources.afterTax}% After-Tax
                  </span>
                ) : null}
              </div>
            </div>

            <div className="space-y-4">
              <SliderRow
                label="Pre-Tax"
                sub="Lower taxes today"
                color="blue"
                value={sources.preTax}
                monthly={monthlyPreTax}
                onChange={handlePreTaxChange}
              />
              <SliderRow
                label="Roth"
                sub="Tax-free withdrawals later"
                color="purple"
                value={sources.roth}
                monthly={monthlyRoth}
                onChange={handleRothChange}
              />
              {showAdvanced && supportsAfterTax ? (
                <div className="space-y-2 border-t border-border pt-4">
                  <div className="enroll-advanced-tag">
                    <p className="enroll-advanced-tag__text">Advanced</p>
                  </div>
                  <SliderRow
                    label="After-Tax"
                    sub="For advanced strategies (e.g., backdoor Roth)"
                    color="orange"
                    value={sources.afterTax}
                    monthly={monthlyAfterTax}
                    onChange={handleAfterTaxChange}
                  />
                </div>
              ) : null}
            </div>

            {!showAdvanced ? (
              <button
                type="button"
                onClick={() => setShowAdvanced(true)}
                className="flex items-center gap-1.5 self-start text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <ChevronDown className="h-4 w-4" aria-hidden />
                Show advanced options
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setShowAdvanced(false);
                  if (sources.afterTax > 0) {
                    setSources({
                      preTax: sources.preTax + sources.afterTax,
                      roth: sources.roth,
                      afterTax: 0,
                    });
                  }
                }}
                className="flex items-center gap-1.5 self-start text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <ChevronUp className="h-4 w-4" aria-hidden />
                Hide advanced options
              </button>
            )}

            <div className="enroll-recommended-strip">
              <div className="mb-2 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" aria-hidden />
                  <p className="text-sm font-bold text-foreground">Recommended for You</p>
                </div>
                <div className="badge-score">Score: 72</div>
              </div>
              <p className="text-sm leading-snug text-foreground/90">
                {RECOMMENDED.preTax}% Pre-Tax / {RECOMMENDED.roth}% Roth — optimized for your profile
              </p>
            </div>

            <div className="tip-callout">
              <div className="flex items-start gap-2.5">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <p className="tip-callout__text">Roth may be better — tax-free income later</p>
              </div>
              <button
                type="button"
                onClick={() => setSources({ ...RECOMMENDED })}
                disabled={Math.abs(total - 100) > 0.001}
                className="btn btn-outline mt-3 w-full disabled:cursor-not-allowed disabled:opacity-50"
              >
                Apply recommended allocation
              </button>
            </div>
          </div>

          <div className="flex flex-col justify-between border-t border-border pt-5 lg:w-[32%] lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wide text-foreground">Your monthly impact</h4>
              <div>
                <p className="text-xs text-muted-foreground">You contribute:</p>
                <p className="text-xl font-extrabold text-foreground">${monthlyTotal.toLocaleString()}</p>
                <div className="mt-2 space-y-1.5 border-l-2 border-border pl-3">
                  <RowMini label="Pre-Tax" amount={monthlyPreTax} variant="pretax" />
                  <RowMini label="Roth" amount={monthlyRoth} variant="roth" />
                  {monthlyAfterTax > 0 ? (
                    <RowMini label="After-Tax" amount={monthlyAfterTax} variant="aftertax" />
                  ) : null}
                </div>
              </div>
              <div className="success-card success-card--compact">
                <p className="success-card-emphasis">Employer match</p>
                <p className="success-card-emphasis-lg">+${monthlyMatch.toLocaleString()}/month</p>
                <p className="success-card-footnote">100% on first {matchPercent}%</p>
              </div>
              <div className="card-soft card-soft--tight">
                <p className="text-[0.7rem] font-semibold text-muted-foreground">Total investment</p>
                <p className="text-2xl font-extrabold text-foreground">${totalMonthlyInvestment.toLocaleString()}</p>
                <p className="text-[0.65rem] text-muted-foreground">per month</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {Math.abs(total - 100) > 0.001 ? (
        <p className="text-center text-sm font-medium text-destructive">
          Allocations must total 100% (currently {total}%).
        </p>
      ) : null}

      <div className="space-y-3 opacity-95">
        <h2 className="text-xl font-bold text-foreground">Understanding the Difference</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <ExplainCard
            title="Pre-Tax"
            icon={<TrendingUp className="enroll-on-accent-icon h-4 w-4" aria-hidden />}
            variant="pretax"
            items={["Lower taxes today", "Reduces current taxable income", "Pay taxes when you withdraw"]}
          />
          <ExplainCard
            title="Roth"
            icon={<Shield className="enroll-on-accent-icon h-4 w-4" aria-hidden />}
            variant="roth"
            items={["Tax-free withdrawals later", "Pay taxes now at current rate", "Growth is tax-free"]}
          />
          <ExplainCard
            title="After-Tax"
            icon={<DollarSign className="enroll-on-accent-icon h-4 w-4" aria-hidden />}
            variant="aftertax"
            items={["For high earners", "Mega backdoor Roth option", "Advanced tax strategy"]}
            className="md:col-span-2 lg:col-span-1"
          />
        </div>
      </div>
    </div>
  );
}

function RowMini({
  label,
  amount,
  variant,
}: {
  label: string;
  amount: number;
  variant: "pretax" | "roth" | "aftertax";
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <div
          className={cn(
            "alloc-dot",
            variant === "pretax" && "alloc-dot--pretax",
            variant === "roth" && "alloc-dot--roth",
            variant === "aftertax" && "alloc-dot--aftertax",
          )}
        />
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      <p className="text-xs font-semibold">${amount.toLocaleString()}</p>
    </div>
  );
}

const ACCENT_BY_COLOR: Record<
  "blue" | "purple" | "orange",
  { varName: string; valueClass: string }
> = {
  blue: { varName: "var(--color-primary)", valueClass: "alloc-value-pretax" },
  purple: { varName: "var(--chart-5)", valueClass: "alloc-value-roth" },
  orange: { varName: "var(--chart-9)", valueClass: "alloc-value-aftertax" },
};

function SliderRow({
  label,
  sub,
  color,
  value,
  monthly,
  onChange,
}: {
  label: string;
  sub: string;
  color: "blue" | "purple" | "orange";
  value: number;
  monthly: number;
  onChange: (n: number) => void;
}) {
  const { varName, valueClass } = ACCENT_BY_COLOR[color];
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: varName }} />
            <p className="text-sm font-semibold text-foreground">{label}</p>
          </div>
          <p className="ml-5 text-[0.7rem] leading-snug text-muted-foreground">{sub}</p>
        </div>
        <p className={valueClass}>{value}%</p>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="source-allocation-range"
        style={
          {
            "--range-pct": `${value}%`,
            "--range-accent": varName,
          } as CSSProperties
        }
      />
      <div className="flex justify-between text-[0.7rem] text-muted-foreground">
        <span>0%</span>
        <span className="font-semibold text-foreground">${monthly.toLocaleString()}/mo</span>
        <span>100%</span>
      </div>
    </div>
  );
}

function ExplainCard({
  title,
  icon,
  variant,
  items,
  className,
}: {
  title: string;
  icon: ReactNode;
  variant: "pretax" | "roth" | "aftertax";
  items: string[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "explain-card",
        variant === "roth" && "explain-card--roth",
        variant === "aftertax" && "explain-card--aftertax",
        className,
      )}
    >
      <div className="mb-3 flex items-center gap-2.5">
        <div className="explain-card__icon">{icon}</div>
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
      </div>
      <div className="space-y-1.5">
        {items.map((t) => (
          <div key={t} className="flex items-start gap-2">
            <Check className="explain-card__check" aria-hidden />
            <p className="text-sm text-foreground/90">{t}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { calculateContributionImpact, generateProjectionData } from "../utils/calculations";
import { useAnimatedNumber } from "../hooks/useAnimatedNumber";
import { useLocaleFormat } from "../hooks/useLocaleFormat";
import type { HubFinancialData } from "../data/mockHubData";

interface ContributionAdjusterProps {
  data: HubFinancialData;
}

export function ContributionAdjuster({ data }: ContributionAdjusterProps) {
  const { t } = useTranslation();
  const fmt = useLocaleFormat();

  const [rate, setRate] = useState(data.currentContributionRate);

  const impact = useMemo(
    () =>
      calculateContributionImpact(
        data.annualSalary,
        data.currentContributionRate,
        rate,
        data.federalTaxRate,
        data.projectedBalance,
        data.avgReturnRate,
        data.yearsToRetirement,
      ),
    [rate, data],
  );

  const animPaycheck = useAnimatedNumber(impact.monthlyPaycheckDelta);
  const animTax = useAnimatedNumber(impact.annualTaxSavings);
  const animAge = useAnimatedNumber(impact.retirementAgeDelta);
  const animBalance = useAnimatedNumber(impact.projectedBalanceDelta);

  const chartData = useMemo(() => {
    const monthlyOld = (data.annualSalary * data.currentContributionRate) / 100 / 12;
    const monthlyNew = (data.annualSalary * rate) / 100 / 12;
    const projOld = generateProjectionData(data.projectedBalance, monthlyOld, data.avgReturnRate, 12);
    const projNew = generateProjectionData(data.projectedBalance, monthlyNew, data.avgReturnRate, 12);
    return projOld.map((p, i) => ({
      month: p.month,
      current: p.balance,
      adjusted: projNew[i]?.balance ?? p.balance,
    }));
  }, [rate, data]);

  return (
    <div
      role="tabpanel"
      id="tabpanel-contribution"
      aria-labelledby="tab-contribution"
      className="grid gap-6 lg:grid-cols-2"
    >
      {/* Controls */}
      <div className="flex flex-col gap-5 rounded-xl border border-[var(--color-border)] p-5" style={{ backgroundColor: "var(--color-surface)" }}>
        <h3 className="text-lg font-semibold text-[var(--color-text)]">
          {t("transactionHub.contribution.title")}
        </h3>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label htmlFor="contrib-rate" className="text-sm font-medium text-[var(--color-text-secondary)]">
              {t("transactionHub.contribution.rate")}
            </label>
            <span className="text-2xl font-bold tabular-nums text-[var(--color-primary)]">
              {rate}%
            </span>
          </div>
          <input
            id="contrib-rate"
            type="range"
            min={0}
            max={25}
            step={0.5}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full accent-[var(--color-primary)]"
            style={{ background: `linear-gradient(to right, var(--color-primary) ${(rate / 25) * 100}%, var(--color-border) ${(rate / 25) * 100}%)` }}
          />
          <div className="flex justify-between text-xs text-[var(--color-text-tertiary)]">
            <span>0%</span>
            <span>25%</span>
          </div>
        </div>

        {/* Impact Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1 rounded-lg border border-[var(--color-border)] p-3">
            <span className="text-xs text-[var(--color-text-secondary)]">
              {t("transactionHub.contribution.paycheckImpact")}
            </span>
            <span
              className="text-lg font-bold tabular-nums"
              style={{ color: animPaycheck < 0 ? "var(--color-danger)" : "var(--color-success)" }}
            >
              {animPaycheck >= 0 ? "+" : ""}{fmt.currency(animPaycheck)}
              <span className="text-xs font-normal text-[var(--color-text-tertiary)]">
                {" "}{t("transactionHub.contribution.perMonth")}
              </span>
            </span>
          </div>

          <div className="flex flex-col gap-1 rounded-lg border border-[var(--color-border)] p-3">
            <span className="text-xs text-[var(--color-text-secondary)]">
              {t("transactionHub.contribution.taxSavings")}
            </span>
            <span className="text-lg font-bold tabular-nums text-[var(--color-success)]">
              {fmt.currency(animTax)}
            </span>
          </div>

          <div className="flex flex-col gap-1 rounded-lg border border-[var(--color-border)] p-3">
            <span className="text-xs text-[var(--color-text-secondary)]">
              {t("transactionHub.contribution.retirementShift")}
            </span>
            <span
              className="text-lg font-bold tabular-nums"
              style={{ color: animAge <= 0 ? "var(--color-success)" : "var(--color-danger)" }}
            >
              {animAge <= 0 ? fmt.number(Math.abs(animAge), 1) : fmt.number(animAge, 1)}{" "}
              <span className="text-xs font-normal text-[var(--color-text-tertiary)]">
                {t(`transactionHub.contribution.${animAge <= 0 ? "earlier" : "later"}`)}
              </span>
            </span>
          </div>

          <div className="flex flex-col gap-1 rounded-lg border border-[var(--color-border)] p-3">
            <span className="text-xs text-[var(--color-text-secondary)]">
              {t("transactionHub.contribution.projectedDelta")}
            </span>
            <span
              className="text-lg font-bold tabular-nums"
              style={{ color: animBalance >= 0 ? "var(--color-success)" : "var(--color-danger)" }}
            >
              {animBalance >= 0 ? "+" : ""}{fmt.currency(animBalance, true)}
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex flex-col gap-3 rounded-xl border border-[var(--color-border)] p-5" style={{ backgroundColor: "var(--color-surface)" }}>
        <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-secondary)]">
          {t("transactionHub.loanSim.projection")}
        </span>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.5} />
              <XAxis dataKey="month" tick={{ fill: "var(--color-text-tertiary)", fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "var(--color-text-tertiary)", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} width={45} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="current" fill="var(--color-border)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="adjusted" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

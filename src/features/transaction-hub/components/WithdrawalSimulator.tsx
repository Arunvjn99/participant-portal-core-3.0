import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { calculateWithdrawalNet, calculateOpportunityCost } from "../utils/calculations";
import { useAnimatedNumber } from "../hooks/useAnimatedNumber";
import { useLocaleFormat } from "../hooks/useLocaleFormat";
import type { HubFinancialData } from "../data/mockHubData";

interface WithdrawalSimulatorProps {
  data: HubFinancialData;
}

const WITHDRAWAL_TYPES = ["typeHardship", "typeRegular", "typeRoth"] as const;

export function WithdrawalSimulator({ data }: WithdrawalSimulatorProps) {
  const { t } = useTranslation();
  const fmt = useLocaleFormat();

  const maxWithdrawal = Math.round(data.projectedBalance * 0.2);
  const [amount, setAmount] = useState(Math.round(maxWithdrawal * 0.5));
  const [wType, setWType] = useState<(typeof WITHDRAWAL_TYPES)[number]>("typeRegular");

  const isEarly = wType !== "typeRoth";
  const isRoth = wType === "typeRoth";

  const calc = useMemo(() => {
    const fedRate = isRoth ? 0 : data.federalTaxRate;
    const stRate = isRoth ? 0 : data.stateTaxRate;
    const penRate = isEarly ? data.earlyWithdrawalPenalty : 0;

    const net = calculateWithdrawalNet(amount, fedRate, stRate, penRate, isEarly);
    const retirementImpact = calculateOpportunityCost(amount, data.avgReturnRate, data.yearsToRetirement) - amount;
    const riskChange = (retirementImpact / data.projectedBalance) * 100;

    return { ...net, retirementImpact, riskChange };
  }, [amount, wType, isEarly, isRoth, data]);

  const animNet = useAnimatedNumber(calc.netPayout);
  const animFed = useAnimatedNumber(calc.federalTax);
  const animState = useAnimatedNumber(calc.stateTax);
  const animPenalty = useAnimatedNumber(calc.penalty);
  const animImpact = useAnimatedNumber(calc.retirementImpact);
  const animRisk = useAnimatedNumber(calc.riskChange);

  return (
    <div
      role="tabpanel"
      id="tabpanel-withdraw"
      aria-labelledby="tab-withdraw"
      className="grid gap-6 lg:grid-cols-2"
    >
      {/* Controls */}
      <div className="flex flex-col gap-5 rounded-xl border border-[var(--color-border)] p-5" style={{ backgroundColor: "var(--color-surface)" }}>
        <h3 className="text-lg font-semibold text-[var(--color-text)]">
          {t("transactionHub.withdrawSim.title")}
        </h3>

        <div className="flex flex-col gap-2">
          <label htmlFor="withdraw-amount" className="text-sm font-medium text-[var(--color-text-secondary)]">
            {t("transactionHub.withdrawSim.amount")}
          </label>
          <div className="flex items-center gap-3">
            <input
              id="withdraw-amount"
              type="range"
              min={1000}
              max={maxWithdrawal}
              step={500}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="h-2 flex-1 cursor-pointer appearance-none rounded-full accent-[var(--color-primary)]"
              style={{ background: `linear-gradient(to right, var(--color-primary) ${(amount / maxWithdrawal) * 100}%, var(--color-border) ${(amount / maxWithdrawal) * 100}%)` }}
            />
            <span className="w-24 text-right text-sm font-semibold tabular-nums text-[var(--color-text)]">
              {fmt.currency(amount, true)}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-[var(--color-text-secondary)]">
            {t("transactionHub.withdrawSim.type")}
          </span>
          <div className="flex gap-2">
            {WITHDRAWAL_TYPES.map((wt) => (
              <button
                key={wt}
                type="button"
                onClick={() => setWType(wt)}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                  wType === wt
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                    : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]"
                }`}
              >
                {t(`transactionHub.withdrawSim.${wt}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex flex-col gap-5 rounded-xl border border-[var(--color-border)] p-5" style={{ backgroundColor: "var(--color-surface)" }}>
        <div className="flex flex-col items-center gap-1 rounded-xl p-6" style={{ backgroundColor: "var(--color-background-secondary, var(--color-background))" }}>
          <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-secondary)]">
            {t("transactionHub.withdrawSim.netPayout")}
          </span>
          <span className="text-3xl font-bold tabular-nums text-[var(--color-success)]">
            {fmt.currency(animNet)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <ResultRow label={t("transactionHub.withdrawSim.federalTax")} value={`-${fmt.currency(animFed)}`} negative />
          <ResultRow label={t("transactionHub.withdrawSim.stateTax")} value={`-${fmt.currency(animState)}`} negative />
          <ResultRow label={t("transactionHub.withdrawSim.penalty")} value={isEarly ? `-${fmt.currency(animPenalty)}` : "—"} negative={isEarly} />
          <ResultRow label={t("transactionHub.withdrawSim.riskChange")} value={`+${fmt.number(animRisk, 1)}%`} negative />
        </div>

        <div className="flex flex-col gap-1 rounded-lg border border-[var(--color-border)] p-4">
          <span className="text-xs text-[var(--color-text-secondary)]">
            {t("transactionHub.withdrawSim.retirementImpact")}
          </span>
          <span className="text-lg font-bold tabular-nums text-[var(--color-danger)]">
            -{fmt.currency(animImpact, true)}
          </span>
          <span className="text-xs text-[var(--color-text-tertiary)]">
            {t("transactionHub.loanSim.projection")}
          </span>
        </div>
      </div>
    </div>
  );
}

function ResultRow({ label, value, negative }: { label: string; value: string; negative?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-[var(--color-text-secondary)]">{label}</span>
      <span className="text-base font-bold tabular-nums" style={{ color: negative ? "var(--color-danger)" : "var(--color-text)" }}>
        {value}
      </span>
    </div>
  );
}

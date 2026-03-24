import { useMemo, useState } from "react";
import { Slider } from "@/components/ui/Slider";
import { calculateEMI } from "@/core/ai/utils/emiCalculator";
import type { CoreAIStructuredPayload, LoanSimulatorCardPayload } from "@/core/ai/interactive/types";

function money(n: number): string {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export interface LoanSimulatorCardProps {
  payload: LoanSimulatorCardPayload;
  onAction: (payload: CoreAIStructuredPayload) => void;
}

export function LoanSimulatorCard({ payload, onAction }: LoanSimulatorCardProps) {
  const amountStep = payload.amountStep ?? 100;
  const [amount, setAmount] = useState(() =>
    Math.min(payload.maxAmount, Math.max(payload.minAmount, Math.round(payload.amount / amountStep) * amountStep)),
  );
  const [tenureMonths, setTenureMonths] = useState(() => {
    const t = payload.tenureMonths;
    const step = payload.tenureStep;
    const snapped = Math.round(t / step) * step;
    return Math.min(payload.maxTenureMonths, Math.max(payload.minTenureMonths, snapped));
  });

  const emi = useMemo(
    () => Math.round(calculateEMI(amount, payload.annualRatePercent, tenureMonths) * 100) / 100,
    [amount, tenureMonths, payload.annualRatePercent],
  );

  const years = tenureMonths / 12;

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-textSecondary)]">Loan simulator</p>
      <p className="mt-1 text-lg font-semibold text-[var(--color-text)]">{money(emi)}<span className="text-sm font-normal text-[var(--color-textSecondary)]">/mo est.</span></p>
      <p className="mt-0.5 text-[11px] text-[var(--color-textSecondary)]">
        {payload.annualRatePercent}% APR · {years % 1 === 0 ? `${years} yr` : `${tenureMonths} mo`}
      </p>

      <div className="mt-4 space-y-1">
        <div className="flex justify-between text-xs text-[var(--color-textSecondary)]">
          <span>Amount</span>
          <span className="font-medium text-[var(--color-text)]">{money(amount)}</span>
        </div>
        <Slider
          value={[amount]}
          onValueChange={(v) => {
            const raw = v[0] ?? amount;
            const snapped = Math.round(raw / amountStep) * amountStep;
            setAmount(Math.min(payload.maxAmount, Math.max(payload.minAmount, snapped)));
          }}
          min={payload.minAmount}
          max={payload.maxAmount}
          step={amountStep}
        />
      </div>

      <div className="mt-5 space-y-1">
        <div className="flex justify-between text-xs text-[var(--color-textSecondary)]">
          <span>Length</span>
          <span className="font-medium text-[var(--color-text)]">{tenureMonths} months</span>
        </div>
        <Slider
          value={[tenureMonths]}
          onValueChange={(v) => {
            const raw = v[0] ?? tenureMonths;
            const step = payload.tenureStep;
            const snapped = Math.round(raw / step) * step;
            setTenureMonths(
              Math.min(payload.maxTenureMonths, Math.max(payload.minTenureMonths, snapped)),
            );
          }}
          min={payload.minTenureMonths}
          max={payload.maxTenureMonths}
          step={payload.tenureStep}
        />
      </div>

      <button
        type="button"
        onClick={() => onAction({ action: "loan_simulator_continue", amount, tenureMonths })}
        className="mt-5 w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
      >
        Continue
      </button>
    </div>
  );
}

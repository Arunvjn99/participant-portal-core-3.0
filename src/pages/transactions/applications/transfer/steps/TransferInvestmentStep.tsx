import { TransactionStepCard } from "../../../../../components/transactions/TransactionStepCard";
import type { TransactionStepProps } from "../../../../../components/transactions/TransactionApplication";

const MOCK_FUNDS = [
  { id: "f1", name: "Vanguard Target 2050", allocation: 60 },
  { id: "f2", name: "Fidelity 500 Index", allocation: 25 },
  { id: "f3", name: "T. Rowe Blue Chip", allocation: 15 },
];

export const TransferInvestmentStep = ({ initialData }: TransactionStepProps) => (
  <TransactionStepCard title="Investment Selection">
    <div className="space-y-4">
      <p className="text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
        Current allocation (for reference). Changes will be applied at next market close.
      </p>
      <ul className="space-y-2">
        {MOCK_FUNDS.map((f) => (
          <li
            key={f.id}
            className="flex justify-between items-center py-3 px-4 rounded-[var(--radius-md)]"
            style={{ background: "var(--enroll-soft-bg)" }}
          >
            <span style={{ color: "var(--enroll-text-primary)" }}>{f.name}</span>
            <span className="font-semibold" style={{ color: "var(--enroll-text-primary)" }}>{f.allocation}%</span>
          </li>
        ))}
      </ul>
    </div>
  </TransactionStepCard>
);

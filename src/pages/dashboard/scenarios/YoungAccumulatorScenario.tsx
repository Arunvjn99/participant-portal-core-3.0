import type { PersonaProfile } from "@/mock/personas";
import { ScenarioShell } from "./ScenarioShell";

const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function YoungAccumulatorScenario({ user }: { user: PersonaProfile }) {
  const yearsToRetire = 65 - user.age;
  const projectedBalance = Math.round(user.balance * Math.pow(1.07, yearsToRetire));

  return (
    <ScenarioShell user={user} accentColor="#10b981">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Current Balance" value={fmt.format(user.balance)} color="#10b981" />
        <StatCard label="Contribution Rate" value={`${user.contributionRate}%`} color="#0b5fff" />
        <StatCard label="Employer Match" value={`${user.employerMatchRate}%`} color="#8b5cf6" />
        <StatCard label="Projected at 65" value={fmt.format(projectedBalance)} color="#f59e0b" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[var(--color-success)]/20 bg-[var(--color-success)]/10 p-5">
          <h3 className="font-semibold text-[var(--color-success)]">Growth Trajectory</h3>
          <p className="mt-2 text-sm text-[var(--color-success)]">
            With {yearsToRetire} years of compound growth at 7% average annual returns,
            your current {fmt.format(user.balance)} could grow to {fmt.format(projectedBalance)}.
          </p>
          <div className="mt-4 h-2 rounded-full bg-[var(--color-success)]/20">
            <div
              className="h-2 rounded-full bg-[var(--color-success)] transition-all"
              style={{ width: `${Math.min((user.balance / projectedBalance) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10 p-5">
          <h3 className="font-semibold text-[var(--color-primary)]">Recommendation</h3>
          <p className="mt-2 text-sm text-[var(--color-primary)]">
            You're on a great start! Consider increasing your contribution rate by 1% each year
            to maximize your employer match and accelerate your retirement savings.
          </p>
          <button
            type="button"
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
          >
            Increase Contribution
          </button>
        </div>
      </div>
    </ScenarioShell>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-textSecondary)]">{label}</p>
      <p className="mt-1 text-2xl font-bold" style={{ color }}>{value}</p>
    </div>
  );
}

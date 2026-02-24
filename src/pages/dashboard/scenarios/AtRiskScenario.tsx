import type { PersonaProfile } from "@/mock/personas";
import { ScenarioShell } from "./ScenarioShell";

const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function AtRiskScenario({ user }: { user: PersonaProfile }) {
  const yearsToRetire = 65 - user.age;
  const gap = user.employerMatchRate - user.contributionRate;
  const missedMatch = Math.round(user.balance * 0.5 * (gap / 100) * yearsToRetire);

  return (
    <ScenarioShell user={user} accentColor="#ef4444">
      {/* Warning banner */}
      <div className="flex items-start gap-3 rounded-xl border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 p-5">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-danger)]/10 text-[var(--color-danger)]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </span>
        <div>
          <h2 className="font-semibold text-[var(--color-danger)]">Action Needed: Low Contribution Rate</h2>
          <p className="mt-1 text-sm text-[var(--color-danger)]">
            You're contributing only {user.contributionRate}% — well below your employer match of {user.employerMatchRate}%.
            You're potentially leaving {fmt.format(missedMatch)} of employer match on the table over the next {yearsToRetire} years.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Current Balance" value={fmt.format(user.balance)} color="#ef4444" alert />
        <StatCard label="Contribution Rate" value={`${user.contributionRate}%`} color="#ef4444" alert />
        <StatCard label="Retirement Score" value={`${user.retirementScore}/100`} color="#f59e0b" />
        <StatCard label="Employer Match" value={`${user.employerMatchRate}%`} color="#10b981" />
      </div>

      {/* Recovery plan */}
      <div className="rounded-xl border border-[var(--color-warning)]/20 bg-[var(--color-warning)]/5 p-5">
        <h3 className="font-semibold text-[var(--color-warning)]">Recovery Plan</h3>
        <ul className="mt-3 space-y-2 text-sm text-[var(--color-text)]">
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-warning)]" />
            Increase contribution to at least {user.employerMatchRate}% to capture full employer match
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-warning)]" />
            Set up automatic annual increase of 1% until you reach 15%
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-warning)]" />
            Review investment allocation for better growth potential
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-warning)]" />
            Schedule a consultation with a retirement advisor
          </li>
        </ul>
        <button
          type="button"
          className="mt-4 rounded-lg bg-[var(--color-warning)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          Fix My Contribution Now
        </button>
      </div>
    </ScenarioShell>
  );
}

function StatCard({ label, value, color, alert }: { label: string; value: string; color: string; alert?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${alert ? "border-[var(--color-danger)]/20 bg-[var(--color-danger)]/10/50" : "border-[var(--color-border)] bg-[var(--color-surface)]"}`}>
      <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-textSecondary)]">{label}</p>
      <p className="mt-1 text-2xl font-bold" style={{ color }}>{value}</p>
    </div>
  );
}

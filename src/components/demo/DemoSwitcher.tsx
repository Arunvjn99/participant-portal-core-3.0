import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { personas, SCENARIO_LABELS } from "@/mock/personas";
import { useDemoUser, setDemoUser } from "@/hooks/useDemoUser";
import type { PersonaProfile } from "@/mock/personas";

const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

/** Color map for scenario badges */
const SCENARIO_COLORS: Record<string, string> = {
  pre_enrollment: "#6366f1",
  new_enrollee: "#6366f1",
  young_accumulator: "#10b981",
  mid_career: "#0b5fff",
  pre_retiree: "#f59e0b",
  at_risk: "#ef4444",
  loan_active: "#f97316",
  retired: "#8b5cf6",
};

/**
 * Floating demo user switcher (bottom-left).
 * Only rendered when a demo user is active.
 * Shows on all pages except login and voice.
 */
export function DemoSwitcher() {
  const [open, setOpen] = useState(false);
  const currentUser = useDemoUser();
  const navigate = useNavigate();
  const location = useLocation();

  /* Hide on login route */
  if (location.pathname === "/") return null;
  if (!currentUser) return null;

  const handleSelect = (persona: PersonaProfile) => {
    setDemoUser(persona);
    setOpen(false);
    navigate("/demo");
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm font-medium text-[var(--color-text)] shadow-lg transition-all hover:shadow-xl hover:border-[var(--color-primary)]/30"
        aria-label="Switch demo user"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <line x1="20" y1="8" x2="20" y2="14" />
          <line x1="23" y1="11" x2="17" y2="11" />
        </svg>
        Switch Demo User
      </button>

      {/* Modal overlay */}
      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-start sm:items-center sm:justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />

          {/* Panel */}
          <div className="relative z-10 m-4 w-full max-w-lg rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-[var(--color-text)]">Switch Demo Persona</h2>
                <p className="text-sm text-[var(--color-textSecondary)]">Select a scenario to explore</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-textSecondary)] transition-colors hover:bg-[var(--color-background)] hover:text-[var(--color-textSecondary)]"
                aria-label="Close"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Persona list */}
            <div className="max-h-[60vh] overflow-y-auto p-3">
              <div className="flex flex-col gap-1.5">
                {personas.map((persona) => {
                  const isActive = currentUser.id === persona.id;
                  const color = SCENARIO_COLORS[persona.scenario] ?? "#6b7280";

                  return (
                    <button
                      key={persona.id}
                      type="button"
                      onClick={() => handleSelect(persona)}
                      className={`flex w-full items-start gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                        isActive
                          ? "border-primary bg-primary/10"
                          : "border-transparent hover:border-[var(--color-border)] hover:bg-[var(--color-surface)]"
                      }`}
                    >
                      {/* Avatar */}
                      <span
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                        style={{ backgroundColor: color }}
                      >
                        {persona.name.charAt(0)}
                      </span>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[var(--color-text)]">{persona.name}</span>
                          <span
                            className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
                            style={{ backgroundColor: color }}
                          >
                            {SCENARIO_LABELS[persona.scenario]}
                          </span>
                          {isActive && (
                            <span className="text-xs font-medium text-[var(--color-primary)]">Active</span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-[var(--color-textSecondary)]">
                          {persona.email} · Age {persona.age} · {fmt.format(persona.balance)}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer hint */}
            <div className="border-t border-[var(--color-border)] px-5 py-3">
              <p className="text-center text-xs text-[var(--color-textSecondary)]">
                Selecting a persona reloads the dashboard with that scenario's data.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

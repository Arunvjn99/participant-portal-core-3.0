import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, Zap } from "lucide-react";
import { useEnrollmentStore } from "../store/useEnrollmentStore";
import {
  getGrowthRate,
  projectBalanceWithAutoIncrease,
} from "../utils/calculations";
import type { IncrementCycle } from "../types";

const A = "enrollment.v1.autoIncreaseDecision.";
const C = "enrollment.v1.autoIncreaseConfig.";

const CYCLE_OPTIONS: { value: IncrementCycle; label: string; desc: string }[] =
  [
    {
      value: "participant",
      label: "Anniversary",
      desc: "Increases on your hire anniversary",
    },
    {
      value: "calendar",
      label: "Calendar Year",
      desc: "Increases every January 1st",
    },
    {
      value: "plan",
      label: "Plan Year",
      desc: "Increases on the plan year start",
    },
  ];

function formatCurrency(n: number) {
  return `$${Math.abs(n).toLocaleString()}`;
}

export function AutoIncreaseStep() {
  const { t } = useTranslation();
  const data = useEnrollmentStore();
  const updateField = useEnrollmentStore((s) => s.updateField);
  const [skipPopupOpen, setSkipPopupOpen] = useState(false);

  const currentPercent = data.contribution;
  const growthRate = getGrowthRate(data.riskLevel);
  const yearsToRetirement = Math.max(0, data.retirementAge - data.currentAge);
  const stepPct = Math.max(data.autoIncreaseRate, 1);
  const maxCap = Math.min(Math.max(data.autoIncreaseMax, 10), 15);

  const fixedProjection = data.projectedBalanceNoAutoIncrease;
  const autoProjection = Math.round(
    projectBalanceWithAutoIncrease(
      data.salary,
      data.currentSavings,
      currentPercent,
      yearsToRetirement,
      growthRate,
      stepPct,
      maxCap,
    ),
  );

  const difference = autoProjection - fixedProjection;

  const [view, setView] = useState<"decision" | "config">(
    data.autoIncreaseStepResolved && data.autoIncrease ? "config" : "decision",
  );

  useEffect(() => {
    if (!skipPopupOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSkipPopupOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [skipPopupOpen]);

  const handleEnable = () => {
    updateField("autoIncrease", true);
    updateField("autoIncreaseStepResolved", false);
    setView("config");
  };

  const handleSkip = () => {
    updateField("autoIncrease", false);
    updateField("autoIncreaseStepResolved", true);
    setSkipPopupOpen(false);
  };

  const handleSaveConfig = () => {
    updateField("autoIncreaseStepResolved", true);
  };

  if (view === "config") {
    return (
      <div className="ew-step" style={{ gap: "1.5rem" }}>
        <div className="text-left">
          <h1
            className="text-2xl font-semibold leading-tight"
            style={{ color: "var(--enroll-text-primary)" }}
          >
            {t(`${C}title`, "Configure Auto-Increase")}
          </h1>
          <p
            className="mt-1 text-sm leading-snug"
            style={{ color: "var(--enroll-text-secondary)" }}
          >
            {t(
              `${C}subtitle`,
              "Set how your contribution rate grows automatically over time.",
            )}
          </p>
        </div>

        <div
          className="flex flex-col gap-5 rounded-2xl p-6"
          style={{
            background: "var(--enroll-card-bg)",
            border: "1px solid var(--enroll-card-border)",
            boxShadow: "var(--enroll-elevation-1)",
          }}
        >
          {/* Increase schedule */}
          <div className="space-y-3">
            <p
              className="text-[0.65rem] font-semibold uppercase tracking-[0.12em]"
              style={{ color: "var(--enroll-text-secondary)" }}
            >
              Increase Schedule
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {CYCLE_OPTIONS.map((opt) => {
                const active = data.incrementCycle === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    className="flex flex-col rounded-xl border p-4 text-left transition-all"
                    style={{
                      borderColor: active
                        ? "var(--enroll-brand)"
                        : "var(--enroll-card-border)",
                      borderWidth: active ? "2px" : "1px",
                      background: active
                        ? "color-mix(in srgb, var(--enroll-brand) 6%, var(--enroll-card-bg))"
                        : "var(--enroll-card-bg)",
                    }}
                    onClick={() => updateField("incrementCycle", opt.value)}
                  >
                    <span
                      className="text-sm font-semibold"
                      style={{
                        color: active
                          ? "var(--enroll-brand)"
                          : "var(--enroll-text-primary)",
                      }}
                    >
                      {opt.label}
                    </span>
                    <span
                      className="mt-1 text-xs"
                      style={{ color: "var(--enroll-text-secondary)" }}
                    >
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Annual increase slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p
                className="text-[0.65rem] font-semibold uppercase tracking-[0.12em]"
                style={{ color: "var(--enroll-text-secondary)" }}
              >
                Annual Increase
              </p>
              <span
                className="text-lg font-bold tabular-nums"
                style={{ color: "var(--enroll-brand)" }}
              >
                {data.autoIncreaseRate}%
              </span>
            </div>
            <input
              type="range"
              min={0.5}
              max={3}
              step={0.5}
              value={data.autoIncreaseRate}
              onChange={(e) =>
                updateField("autoIncreaseRate", Number(e.target.value))
              }
              className="contribution-range h-3 w-full min-w-0"
              aria-label="Annual increase rate"
            />
            <div
              className="flex justify-between text-xs font-medium"
              style={{ color: "var(--enroll-text-secondary)" }}
            >
              <span>0.5%</span>
              <span>3%</span>
            </div>
          </div>

          {/* Max cap slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p
                className="text-[0.65rem] font-semibold uppercase tracking-[0.12em]"
                style={{ color: "var(--enroll-text-secondary)" }}
              >
                Maximum Contribution
              </p>
              <span
                className="text-lg font-bold tabular-nums"
                style={{ color: "var(--enroll-brand)" }}
              >
                {data.autoIncreaseMax}%
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={15}
              step={1}
              value={data.autoIncreaseMax}
              onChange={(e) =>
                updateField("autoIncreaseMax", Number(e.target.value))
              }
              className="contribution-range h-3 w-full min-w-0"
              aria-label="Maximum contribution cap"
            />
            <div
              className="flex justify-between text-xs font-medium"
              style={{ color: "var(--enroll-text-secondary)" }}
            >
              <span>10%</span>
              <span>15%</span>
            </div>
          </div>

          {/* Insight strip */}
          <div
            className="flex items-start gap-2.5 rounded-xl border px-4 py-3.5"
            style={{
              borderColor:
                "color-mix(in srgb, var(--color-success) 25%, transparent)",
              background:
                "color-mix(in srgb, var(--color-success) 6%, var(--enroll-card-bg))",
            }}
          >
            <Zap
              className="mt-0.5 h-4 w-4 shrink-0"
              style={{ color: "var(--color-success)" }}
              aria-hidden
            />
            <p
              className="text-sm leading-snug"
              style={{ color: "var(--color-success)" }}
            >
              Starting at {currentPercent}%, your rate will grow by{" "}
              {data.autoIncreaseRate}% per year until it reaches{" "}
              {data.autoIncreaseMax}%.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSaveConfig}
            className="flex h-12 w-full items-center justify-center rounded-xl text-sm font-semibold shadow-sm transition-colors hover:opacity-90 active:scale-[0.99]"
            style={{
              background: "var(--enroll-brand)",
              color: "var(--color-text-on-primary)",
            }}
          >
            Save Configuration
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ew-step" style={{ gap: "1rem" }}>
      <div className="text-left">
        <h1
          className="text-2xl font-semibold leading-tight"
          style={{ color: "var(--enroll-text-primary)" }}
        >
          {t(`${A}title`)}
        </h1>
        <p
          className="mt-1 text-sm leading-snug"
          style={{ color: "var(--enroll-text-secondary)" }}
        >
          {t(`${A}subtitle`)}
        </p>
      </div>

      {/* Comparison cards */}
      <div className="grid min-w-0 gap-4 md:grid-cols-2">
        {/* Fixed rate card */}
        <div
          className="flex flex-col rounded-xl border p-5 shadow-sm"
          style={{
            borderColor: "var(--enroll-card-border)",
            background: "var(--enroll-card-bg)",
          }}
        >
          <div className="mb-3 flex items-center gap-2">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-lg leading-none"
              style={{
                background:
                  "color-mix(in srgb, var(--enroll-card-border) 40%, var(--enroll-card-bg))",
              }}
            >
              <span aria-hidden>➖</span>
            </div>
            <h3
              className="font-semibold"
              style={{ color: "var(--enroll-text-primary)" }}
            >
              {t(`${A}cardFixedTitle`)}
            </h3>
          </div>
          <p
            className="text-sm"
            style={{ color: "var(--enroll-text-secondary)" }}
          >
            {t(`${A}cardFixedDesc`, { percent: currentPercent })}
          </p>
          <div className="mt-4 flex-1">
            <p
              className="text-[0.75rem] font-semibold uppercase tracking-wide"
              style={{ color: "var(--enroll-text-muted)" }}
            >
              {t(`${A}projectedRetirement`)}
            </p>
            <p
              className="mt-1 text-2xl font-bold"
              style={{ color: "var(--enroll-text-primary)" }}
            >
              ${fixedProjection.toLocaleString()}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSkipPopupOpen(true)}
            className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors"
            style={{
              borderColor: "var(--enroll-card-border)",
              background: "var(--enroll-card-bg)",
              color: "var(--enroll-text-primary)",
            }}
          >
            {t(`${A}ctaSkip`)}
          </button>
        </div>

        {/* Auto-increase card (recommended) */}
        <div
          className="relative flex flex-col rounded-xl p-5 shadow-sm"
          style={{
            border: "2px solid var(--color-success)",
            background: "var(--enroll-card-bg)",
          }}
        >
          <span
            className="absolute -top-3 left-4 rounded-full px-3 py-0.5 text-xs font-semibold"
            style={{
              background: "var(--color-success)",
              color: "var(--color-text-on-primary)",
            }}
          >
            {t(`${A}recommended`)}
          </span>
          <div className="mb-3 mt-1 flex items-center gap-2">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-lg leading-none"
              style={{
                background:
                  "color-mix(in srgb, var(--color-success) 12%, var(--enroll-card-bg))",
              }}
            >
              <span aria-hidden>📈</span>
            </div>
            <h3
              className="font-semibold"
              style={{ color: "var(--enroll-text-primary)" }}
            >
              {t(`${A}cardAutoTitle`)}
            </h3>
          </div>
          <p
            className="text-sm"
            style={{ color: "var(--enroll-text-secondary)" }}
          >
            {t(`${A}cardAutoDesc`)}
          </p>
          <div className="mt-4 flex-1">
            <p
              className="text-[0.75rem] font-semibold uppercase tracking-wide"
              style={{ color: "var(--enroll-text-muted)" }}
            >
              {t(`${A}projectedRetirement`)}
            </p>
            <p
              className="mt-1 text-2xl font-bold"
              style={{ color: "var(--color-success)" }}
            >
              ${autoProjection.toLocaleString()}
            </p>
          </div>
          <button
            type="button"
            onClick={handleEnable}
            className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors hover:opacity-90"
            style={{
              background: "var(--color-success)",
              color: "var(--color-text-on-primary)",
            }}
          >
            {t(`${A}ctaEnable`)}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>

      {/* Insight banner */}
      {difference > 0 && (
        <div
          className="rounded-xl border p-3 text-left md:text-center"
          style={{
            borderColor:
              "color-mix(in srgb, var(--color-success) 20%, transparent)",
            background:
              "color-mix(in srgb, var(--color-success) 6%, var(--enroll-card-bg))",
          }}
        >
          <p
            className="text-sm font-medium leading-snug"
            style={{ color: "var(--color-success)" }}
          >
            {t(`${A}insightBefore`, "Auto-increase could add ")}
            <span className="font-bold">{formatCurrency(difference)}</span>
            {t(`${A}insightAfter`, " more to your retirement savings.")}
          </p>
        </div>
      )}

      {/* Skip confirmation modal */}
      {skipPopupOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setSkipPopupOpen(false)}
        >
          <div
            className="max-h-[min(90vh,900px)] w-full max-w-[520px] overflow-y-auto rounded-2xl p-5 shadow-2xl sm:p-6"
            style={{ background: "var(--enroll-card-bg)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              className="text-lg font-semibold"
              style={{ color: "var(--enroll-text-primary)" }}
            >
              Are you sure?
            </h2>
            <p
              className="mt-2 text-sm leading-relaxed"
              style={{ color: "var(--enroll-text-secondary)" }}
            >
              Without auto-increase, you'll miss out on an estimated{" "}
              <strong style={{ color: "var(--color-success)" }}>
                {formatCurrency(difference)}
              </strong>{" "}
              in additional retirement savings. You can always enable it later.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setSkipPopupOpen(false)}
                className="flex h-10 items-center justify-center rounded-lg border px-4 text-sm font-medium transition-colors"
                style={{
                  borderColor: "var(--enroll-card-border)",
                  background: "var(--enroll-card-bg)",
                  color: "var(--enroll-text-primary)",
                }}
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleSkip}
                className="flex h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold transition-colors hover:opacity-90"
                style={{
                  background: "var(--enroll-brand)",
                  color: "var(--color-text-on-primary)",
                }}
              >
                Skip Auto-Increase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

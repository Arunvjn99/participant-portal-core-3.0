import { useMemo, useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  HelpCircle,
  Landmark,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { useEnrollmentStore } from "../store/useEnrollmentStore";
import type { PlanType } from "../types";

const P = "enrollment.v1.plan.";

type CompareRow = { feature: string; traditional: string; roth: string };

function asStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.map(String) : [];
}

function asCompareRows(v: unknown): CompareRow[] {
  if (!Array.isArray(v)) return [];
  return v.filter(
    (r): r is CompareRow =>
      r != null && typeof r === "object" && "feature" in r,
  ) as CompareRow[];
}

export function PlanStep() {
  const { t } = useTranslation();
  const { selectedPlan, companyPlans, updateField } = useEnrollmentStore();

  const [showAI, setShowAI] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const traditionalBenefits = useMemo(
    () => asStringArray(t(`${P}traditionalBenefits`, { returnObjects: true })),
    [t],
  );
  const rothBenefits = useMemo(
    () => asStringArray(t(`${P}rothBenefits`, { returnObjects: true })),
    [t],
  );
  const compareRows = useMemo(
    () => asCompareRows(t(`${P}compareRows`, { returnObjects: true })),
    [t],
  );

  const hasTwoPlans = companyPlans.length >= 2;

  if (!hasTwoPlans) {
    const onlyPlan = companyPlans[0] || "traditional";
    const planLabel =
      onlyPlan === "traditional"
        ? t(`${P}traditionalTitle`)
        : t(`${P}rothTitle`);

    return (
      <div className="ew-step">
        <div
          className="flex min-w-0 flex-col gap-4 rounded-2xl p-6 text-left"
          style={{
            background: "var(--enroll-card-bg)",
            border: "1px solid var(--enroll-card-border)",
            boxShadow: "var(--enroll-elevation-2)",
          }}
        >
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
            style={{
              background:
                "color-mix(in srgb, var(--enroll-brand) 12%, var(--enroll-card-bg))",
            }}
          >
            <Landmark
              className="h-5 w-5"
              style={{ color: "var(--enroll-brand)" }}
              aria-hidden
            />
          </div>
          <div className="min-w-0">
            <h2
              className="text-2xl font-semibold leading-tight"
              style={{ color: "var(--enroll-text-primary)" }}
            >
              {t(`${P}singlePlanTitle`, { planLabel })}
            </h2>
            <p
              className="mt-1 text-sm leading-snug"
              style={{ color: "var(--enroll-text-secondary)" }}
            >
              {onlyPlan === "traditional"
                ? t(`${P}singleTraditionalExplainer`)
                : t(`${P}singleRothExplainer`)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => updateField("selectedPlan", onlyPlan as PlanType)}
            className="flex h-11 w-full min-w-0 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold shadow-sm transition-all duration-200 hover:opacity-90 active:scale-[0.99]"
            style={{
              background: "var(--enroll-brand)",
              color: "var(--color-text-on-primary)",
            }}
          >
            {t(`${P}ctaContinueSingle`)}{" "}
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
          </button>
        </div>
      </div>
    );
  }

  const renderPlanCard = (
    planKey: PlanType,
    benefits: string[],
    badge?: { label: string; tooltip: string },
  ) => {
    const isSelected = selectedPlan === planKey;
    const title =
      planKey === "traditional"
        ? t(`${P}traditionalTitle`)
        : t(`${P}rothTitle`);
    const desc =
      planKey === "traditional"
        ? t(`${P}traditionalDesc`)
        : t(`${P}rothDesc`);

    return (
      <button
        key={planKey}
        type="button"
        role="radio"
        aria-checked={isSelected}
        aria-label={t(`${P}selectPlanAria`, { plan: title })}
        onClick={() => updateField("selectedPlan", planKey)}
        className="flex min-w-0 flex-col rounded-2xl border p-6 text-left transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        style={{
          background: "var(--enroll-card-bg)",
          borderColor: isSelected
            ? "var(--enroll-brand)"
            : "var(--enroll-card-border)",
          borderWidth: isSelected ? "2px" : "1px",
          boxShadow: isSelected
            ? "0 4px 20px color-mix(in srgb, var(--enroll-brand) 15%, transparent), 0 0 0 4px color-mix(in srgb, var(--enroll-brand) 10%, transparent)"
            : "var(--enroll-elevation-1)",
          transform: isSelected ? "none" : undefined,
        }}
        onMouseEnter={(e) => {
          if (!isSelected)
            (e.currentTarget as HTMLElement).style.transform =
              "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          if (!isSelected)
            (e.currentTarget as HTMLElement).style.transform = "none";
        }}
      >
        {/* Badge row */}
        <div className="mb-4 flex min-w-0 items-start justify-between gap-2">
          {badge ? (
            <div className="relative min-w-0">
              <span
                className="inline-flex max-w-full min-w-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
                style={{
                  background:
                    "color-mix(in srgb, var(--color-warning) 14%, var(--enroll-card-bg))",
                  color: "var(--color-warning)",
                }}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <span className="min-w-0 break-words">{badge.label}</span>
                <HelpCircle
                  className="h-3 w-3 shrink-0 opacity-70"
                  aria-hidden
                />
              </span>
              {showTooltip && (
                <div
                  className="absolute left-0 top-full z-10 mt-1 max-w-xs rounded-lg px-3 py-2 text-xs leading-snug shadow-lg"
                  role="tooltip"
                  style={{
                    background: "var(--enroll-text-primary)",
                    color: "var(--enroll-card-bg)",
                  }}
                >
                  {badge.tooltip}
                  <div
                    className="absolute left-6 top-0 h-2 w-2 -translate-y-1/2 rotate-45"
                    style={{ background: "var(--enroll-text-primary)" }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div />
          )}
          {isSelected && (
            <span
              className="inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
              style={{
                background:
                  "color-mix(in srgb, var(--enroll-brand) 10%, var(--enroll-card-bg))",
                color: "var(--enroll-brand)",
              }}
            >
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
              {t(`${P}selectedLabel`)}
            </span>
          )}
        </div>

        <h3
          className="text-base font-semibold"
          style={{ color: "var(--enroll-text-primary)" }}
        >
          {title}
        </h3>
        <p
          className="mt-2 text-sm leading-relaxed"
          style={{ color: "var(--enroll-text-secondary)" }}
        >
          {desc}
        </p>

        <ul className="mt-4 flex min-w-0 flex-col gap-2">
          {benefits.map((b) => (
            <li
              key={b}
              className="flex min-w-0 items-start gap-2 text-sm leading-snug"
              style={{ color: "var(--enroll-text-secondary)" }}
            >
              <Check
                className="mt-0.5 h-4 w-4 shrink-0"
                style={{ color: "var(--color-success)" }}
                aria-hidden
              />
              <span className="min-w-0">{b}</span>
            </li>
          ))}
        </ul>
      </button>
    );
  };

  return (
    <div className="ew-step" style={{ gap: "1.25rem" }}>
      {/* Header */}
      <div className="text-left">
        <h1
          className="text-xl font-semibold leading-tight"
          style={{ color: "var(--enroll-text-primary)" }}
        >
          {t(`${P}title`)}
        </h1>
        <p
          className="mt-1.5 text-sm leading-snug"
          style={{ color: "var(--enroll-text-secondary)" }}
        >
          {t(`${P}subtitle`)}
        </p>
      </div>

      {/* Plan cards — 2-column grid */}
      <div className="grid min-w-0 grid-cols-1 gap-6 md:grid-cols-2">
        {renderPlanCard("traditional", traditionalBenefits, {
          label: t(`${P}badgeMostCommon`),
          tooltip: t(`${P}badgeTooltip`),
        })}
        {renderPlanCard("roth", rothBenefits)}
      </div>

      {/* "Not sure?" helper */}
      <div
        className="rounded-xl p-4"
        style={{
          background: "var(--enroll-card-bg)",
          border: "1px solid var(--enroll-card-border)",
          boxShadow: "var(--enroll-elevation-1)",
        }}
      >
        <p
          className="text-sm font-semibold"
          style={{ color: "var(--enroll-text-primary)" }}
        >
          {t(`${P}notSureTitle`)}
        </p>
        <p
          className="mt-1 text-sm leading-snug"
          style={{ color: "var(--enroll-text-secondary)" }}
        >
          {t(`${P}notSureSubtitle`)}
        </p>
        <div className="mt-3 flex min-w-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setShowAI(!showAI);
              setShowCompare(false);
            }}
            className="flex h-9 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors"
            style={{
              borderColor: showAI
                ? "color-mix(in srgb, var(--ai-primary) 50%, transparent)"
                : "color-mix(in srgb, var(--ai-primary) 25%, transparent)",
              background: showAI
                ? "color-mix(in srgb, var(--ai-primary) 12%, var(--enroll-card-bg))"
                : "color-mix(in srgb, var(--ai-primary) 5%, var(--enroll-card-bg))",
              color: showAI
                ? "var(--ai-primary)"
                : "color-mix(in srgb, var(--ai-primary) 80%, var(--enroll-text-primary))",
            }}
          >
            <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />{" "}
            {t(`${P}askAi`)}
          </button>
          <button
            type="button"
            onClick={() => {
              setShowCompare(!showCompare);
              setShowAI(false);
            }}
            className="flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors"
            style={{
              borderColor: showCompare
                ? "var(--enroll-card-border)"
                : "var(--enroll-card-border)",
              background: showCompare
                ? "var(--enroll-soft-bg)"
                : "transparent",
              color: showCompare
                ? "var(--enroll-text-primary)"
                : "var(--enroll-text-secondary)",
            }}
          >
            <MessageCircle className="h-3.5 w-3.5" aria-hidden />{" "}
            {t(`${P}comparePlans`)}
          </button>
        </div>

        {/* AI Recommendation panel */}
        {showAI && (
          <div
            className="mt-3 min-w-0 rounded-xl border p-3"
            style={{
              borderColor:
                "color-mix(in srgb, var(--ai-primary) 20%, transparent)",
              background:
                "color-mix(in srgb, var(--ai-primary) 6%, var(--enroll-card-bg))",
            }}
          >
            <div className="flex items-start gap-2">
              <Sparkles
                className="mt-0.5 h-4 w-4 shrink-0"
                style={{ color: "var(--ai-primary)" }}
                aria-hidden
              />
              <div className="text-sm leading-snug">
                <p
                  className="font-semibold"
                  style={{ color: "var(--ai-primary)" }}
                >
                  {t(`${P}aiRecommendationTitle`)}
                </p>
                <p
                  className="mt-1"
                  style={{ color: "var(--enroll-text-secondary)" }}
                >
                  <Trans
                    i18nKey={`${P}aiRecommendationBody`}
                    components={{ trad: <strong />, roth: <strong /> }}
                  />
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Comparison table */}
        {showCompare && (
          <div className="mt-3 min-w-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid var(--enroll-card-border)",
                  }}
                >
                  <th
                    className="py-2 text-left"
                    style={{
                      fontWeight: 500,
                      color: "var(--enroll-text-secondary)",
                    }}
                  >
                    {t(`${P}compareColFeature`)}
                  </th>
                  <th
                    className="py-2 text-left"
                    style={{
                      fontWeight: 600,
                      color: "var(--enroll-text-primary)",
                    }}
                  >
                    {t(`${P}compareColTraditional`)}
                  </th>
                  <th
                    className="py-2 text-left"
                    style={{
                      fontWeight: 600,
                      color: "var(--enroll-text-primary)",
                    }}
                  >
                    {t(`${P}compareColRoth`)}
                  </th>
                </tr>
              </thead>
              <tbody style={{ color: "var(--enroll-text-secondary)" }}>
                {compareRows.map((row) => (
                  <tr
                    key={row.feature}
                    style={{
                      borderBottom: "1px solid var(--enroll-card-border)",
                    }}
                  >
                    <td className="py-2">{row.feature}</td>
                    <td className="py-2">{row.traditional}</td>
                    <td className="py-2">{row.roth}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

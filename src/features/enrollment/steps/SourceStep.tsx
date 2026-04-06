import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { useTranslation, type TFunction } from "react-i18next";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronUp,
  DollarSign,
  Plus,
  Shield,
  SlidersHorizontal,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useEnrollmentStore } from "../store/useEnrollmentStore";

const A = "enrollment.v1.sourceAllocation.";

type Sources = { preTax: number; roth: number; afterTax: number };

const PLAN_DEFAULT: Sources = { preTax: 60, roth: 40, afterTax: 0 };

function splitMonthly(total: number, s: Sources) {
  return {
    monthlyPreTax: Math.round((total * s.preTax) / 100),
    monthlyRoth: Math.round((total * s.roth) / 100),
    monthlyAfterTax: Math.round((total * s.afterTax) / 100),
  };
}

function matchesPlanDefault(s: Sources) {
  return (
    Math.abs(s.preTax - PLAN_DEFAULT.preTax) < 0.01 &&
    Math.abs(s.roth - PLAN_DEFAULT.roth) < 0.01 &&
    Math.abs(s.afterTax - PLAN_DEFAULT.afterTax) < 0.01
  );
}

function asStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.map(String) : [];
}

export function SourceStep() {
  const { t } = useTranslation();
  const data = useEnrollmentStore();
  const updateField = useEnrollmentStore((s) => s.updateField);
  const sources = data.contributionSources;
  const monthlyTotal = data.monthlyContribution;
  const monthlyMatch = data.employerMatch;
  const percent = data.contribution;
  const supportsAfterTax = data.supportsAfterTax;

  const planDefaultFeatures = useMemo(
    () => asStringArray(t(`${A}planDefaultFeatures`, { returnObjects: true })),
    [t],
  );
  const customizeFeatures = useMemo(
    () => asStringArray(t(`${A}customizeFeatures`, { returnObjects: true })),
    [t],
  );
  const explainPreTax = useMemo(
    () => asStringArray(t(`${A}explainPreTaxItems`, { returnObjects: true })),
    [t],
  );
  const explainRoth = useMemo(
    () => asStringArray(t(`${A}explainRothItems`, { returnObjects: true })),
    [t],
  );
  const explainAfterTax = useMemo(
    () => asStringArray(t(`${A}explainAfterTaxItems`, { returnObjects: true })),
    [t],
  );

  const [showAdvanced, setShowAdvanced] = useState(sources.afterTax > 0);
  const [editorOpen, setEditorOpen] = useState(false);

  const { monthlyPreTax, monthlyRoth, monthlyAfterTax } = splitMonthly(
    monthlyTotal,
    sources,
  );
  const effectiveEmployerMatch = Math.round(
    (monthlyMatch * sources.preTax) / 100,
  );
  const totalMonthlyInvestment = monthlyTotal + effectiveEmployerMatch;

  const planDefaultSplit = splitMonthly(monthlyTotal, PLAN_DEFAULT);
  const planDefaultEmployerMatch = Math.round(
    (monthlyMatch * PLAN_DEFAULT.preTax) / 100,
  );
  const planDefaultTotalMonthly = monthlyTotal + planDefaultEmployerMatch;

  const setSources = (next: Sources) => {
    updateField("contributionSources", next);
  };

  const handleContinuePlanDefault = () => {
    setSources({ ...PLAN_DEFAULT });
    setShowAdvanced(false);
  };

  const openCustomizeEditor = () => {
    setEditorOpen(true);
    setShowAdvanced(false);
    setSources({ ...PLAN_DEFAULT });
  };

  const total = sources.preTax + sources.roth + sources.afterTax;
  const hasAfterTaxSlice = sources.afterTax > 0;

  const handlePreTaxChange = (value: number) => {
    const v = Math.min(100, Math.max(0, value));
    const rem = 100 - v;
    const rr = sources.roth + sources.afterTax;
    if (rr > 0) {
      const ratio = sources.roth / rr;
      setSources({
        preTax: v,
        roth: Math.round(rem * ratio),
        afterTax: Math.round(rem * (1 - ratio)),
      });
    } else {
      setSources({ preTax: v, roth: rem, afterTax: 0 });
    }
  };

  const handleRothChange = (value: number) => {
    const v = Math.min(100, Math.max(0, value));
    const rem = 100 - v;
    const rr = sources.preTax + sources.afterTax;
    if (rr > 0) {
      const ratio = sources.preTax / rr;
      setSources({
        preTax: Math.round(rem * ratio),
        roth: v,
        afterTax: Math.round(rem * (1 - ratio)),
      });
    } else {
      setSources({ preTax: rem, roth: v, afterTax: 0 });
    }
  };

  const handleAfterTaxChange = (value: number) => {
    const v = Math.min(100, Math.max(0, value));
    const rem = 100 - v;
    const rr = sources.preTax + sources.roth;
    if (rr > 0) {
      const ratio = sources.preTax / rr;
      setSources({
        preTax: Math.round(rem * ratio),
        roth: Math.round(rem * (1 - ratio)),
        afterTax: v,
      });
    } else {
      setSources({ preTax: rem, roth: 0, afterTax: v });
    }
  };

  const handleCombinedPreRoth = (preTax: number) => {
    const v = Math.min(100, Math.max(0, preTax));
    setSources({ preTax: v, roth: 100 - v, afterTax: 0 });
  };

  const handleReset = () => {
    setSources({ ...PLAN_DEFAULT });
    setShowAdvanced(false);
  };

  const scrollToExplain = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  const applyCustomDisabled =
    Math.abs(total - 100) > 0.001 || matchesPlanDefault(sources);

  const commonPresets = useMemo(
    () => [
      { preTax: 100, roth: 0, label: t(`${A}splitAllPreTax`) },
      { preTax: 80, roth: 20, label: t(`${A}split8020`) },
      { preTax: 50, roth: 50, label: t(`${A}split5050`) },
      { preTax: 20, roth: 80, label: t(`${A}split2080`) },
      { preTax: 0, roth: 100, label: t(`${A}splitAllRoth`) },
    ],
    [t],
  );

  return (
    <div className="ew-step" style={{ gap: "2rem" }}>
      {/* Header + badge */}
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 text-left">
          <h1
            className="text-2xl font-bold tracking-tight md:text-[26px] md:leading-tight"
            style={{ color: "var(--enroll-text-primary)" }}
          >
            {t(`${A}title`)}
          </h1>
        </div>
        <div
          className="inline-flex min-w-0 max-w-full shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5"
          style={{
            borderColor: "var(--enroll-card-border)",
            background: "var(--enroll-card-bg)",
          }}
        >
          <Wallet
            className="h-5 w-5 shrink-0"
            style={{ color: "var(--enroll-brand)" }}
            aria-hidden
          />
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--enroll-text-primary)" }}
          >
            {t(`${A}contributingSummary`, {
              percent,
              amount: `$${monthlyTotal.toLocaleString()}`,
            })}
          </p>
        </div>
      </div>

      {/* Two-column cards */}
      <div className="grid min-w-0 gap-6 lg:grid-cols-2 lg:items-stretch">
        {/* Plan Default card */}
        <div
          className="flex min-h-0 flex-col overflow-hidden rounded-2xl"
          style={{
            border: "1px solid color-mix(in srgb, var(--enroll-brand) 35%, transparent)",
            background: "var(--enroll-card-bg)",
            boxShadow: "0 0 0 1px color-mix(in srgb, var(--enroll-brand) 12%, transparent)",
          }}
        >
          <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
            <div>
              <span
                className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold shadow-sm"
                style={{
                  background: "var(--enroll-brand)",
                  color: "var(--color-text-on-primary)",
                }}
              >
                {t(`${A}planDefaultHeader`)}
              </span>
              <p
                className="mt-3 text-sm"
                style={{ color: "var(--enroll-text-secondary)" }}
              >
                {t(`${A}planDefaultSubtitle`)}
              </p>
            </div>

            {/* Allocation bar */}
            <div className="alloc-bar-plain">
              <div className="flex h-full w-full overflow-hidden rounded-full">
                <div
                  className="alloc-seg-pretax"
                  style={{ width: `${PLAN_DEFAULT.preTax}%` }}
                />
                <div
                  className="alloc-seg-roth"
                  style={{ width: `${PLAN_DEFAULT.roth}%` }}
                />
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div
                className="flex items-center gap-2"
                style={{ color: "var(--enroll-text-primary)" }}
              >
                <span className="alloc-dot alloc-dot--md alloc-dot--pretax" />
                {t(`${A}preTaxLabel`)} $
                {planDefaultSplit.monthlyPreTax.toLocaleString()}/mo
              </div>
              <div
                className="flex items-center gap-2"
                style={{ color: "var(--enroll-text-primary)" }}
              >
                <span className="alloc-dot alloc-dot--md alloc-dot--roth" />
                {t(`${A}rothLabel`)} $
                {planDefaultSplit.monthlyRoth.toLocaleString()}/mo
              </div>
            </div>

            {/* Match + Total cards */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div
                className="rounded-xl border p-4"
                style={{
                  borderColor:
                    "color-mix(in srgb, var(--color-success) 25%, transparent)",
                  background:
                    "color-mix(in srgb, var(--color-success) 6%, var(--enroll-card-bg))",
                }}
              >
                <p
                  className="text-xs font-semibold"
                  style={{ color: "var(--color-success)" }}
                >
                  {t(`${A}employerMatch`)}
                </p>
                <p
                  className="mt-1 text-xl font-bold tabular-nums"
                  style={{ color: "var(--color-success)" }}
                >
                  +${planDefaultEmployerMatch.toLocaleString()}
                </p>
                <p
                  className="mt-0.5 text-xs font-medium"
                  style={{ color: "var(--color-success)" }}
                >
                  {t(`${A}employerMatchOnPreTax`)}
                </p>
              </div>
              <div
                className="rounded-xl border p-4"
                style={{
                  borderColor: "var(--enroll-card-border)",
                  background: "var(--enroll-card-bg)",
                }}
              >
                <p
                  className="text-xs font-semibold"
                  style={{ color: "var(--enroll-text-secondary)" }}
                >
                  {t(`${A}totalMonthlyLabel`)}
                </p>
                <p
                  className="mt-1 text-xl font-bold tabular-nums"
                  style={{ color: "var(--enroll-text-primary)" }}
                >
                  ${planDefaultTotalMonthly.toLocaleString()}
                </p>
                <p
                  className="mt-0.5 text-xs"
                  style={{ color: "var(--enroll-text-secondary)" }}
                >
                  {t(`${A}totalMonthlyYouPlusEmployer`)}
                </p>
              </div>
            </div>

            <ul className="flex-1 space-y-2.5">
              {planDefaultFeatures.map((line) => (
                <li
                  key={line}
                  className="flex items-start gap-2.5 text-sm leading-snug"
                  style={{ color: "var(--enroll-text-primary)" }}
                >
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0"
                    style={{ color: "var(--enroll-brand)" }}
                    aria-hidden
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={handleContinuePlanDefault}
              className="flex h-12 w-full items-center justify-center rounded-xl text-sm font-semibold shadow-sm transition-colors hover:opacity-90 active:scale-[0.99]"
              style={{
                background: "var(--enroll-brand)",
                color: "var(--color-text-on-primary)",
              }}
            >
              {t(`${A}continuePlanDefaultCta`)}
            </button>
          </div>
        </div>

        {/* Customize card */}
        <div
          className="flex min-h-0 flex-col overflow-hidden rounded-2xl shadow-sm transition-all"
          style={{
            border: editorOpen
              ? "1px solid color-mix(in srgb, var(--enroll-brand) 50%, transparent)"
              : "1px solid var(--enroll-card-border)",
            background: "var(--enroll-card-bg)",
            boxShadow: editorOpen
              ? "0 0 0 3px color-mix(in srgb, var(--enroll-brand) 12%, transparent)"
              : undefined,
          }}
        >
          <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
            {!editorOpen ? (
              <>
                <div>
                  <span
                    className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold"
                    style={{
                      borderColor:
                        "color-mix(in srgb, var(--enroll-brand) 40%, transparent)",
                      background:
                        "color-mix(in srgb, var(--enroll-brand) 8%, var(--enroll-card-bg))",
                      color: "var(--enroll-brand)",
                    }}
                  >
                    <SlidersHorizontal
                      className="h-4 w-4 shrink-0 opacity-90"
                      aria-hidden
                    />
                    {t(`${A}customizeSplitHeader`)}
                  </span>
                  <p
                    className="mt-3 text-sm font-semibold"
                    style={{ color: "var(--enroll-text-primary)" }}
                  >
                    {t(`${A}customizeCardTitle`)}
                  </p>
                  <p
                    className="mt-1 text-sm"
                    style={{ color: "var(--enroll-text-secondary)" }}
                  >
                    {t(`${A}customizeCardSubtitle`)}
                  </p>
                </div>

                <div className="space-y-2 opacity-50">
                  <div className="alloc-bar-track">
                    <div
                      className="alloc-seg-pretax"
                      style={{ width: `${PLAN_DEFAULT.preTax}%` }}
                    />
                    <div
                      className="alloc-seg-roth"
                      style={{ width: `${PLAN_DEFAULT.roth}%` }}
                    />
                  </div>
                  <div
                    className="flex justify-between text-xs font-medium"
                    style={{ color: "var(--enroll-text-secondary)" }}
                  >
                    <span>{t(`${A}preTaxLabel`)}</span>
                    <span>{t(`${A}rothLabel`)}</span>
                  </div>
                </div>

                <ul className="space-y-2.5">
                  {customizeFeatures.map((line) => (
                    <li
                      key={line}
                      className="flex items-start gap-2.5 text-sm leading-snug"
                      style={{ color: "var(--enroll-text-secondary)" }}
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 opacity-70"
                        style={{ color: "var(--enroll-text-muted)" }}
                        aria-hidden
                      />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={openCustomizeEditor}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-colors"
                  style={{
                    borderColor: "var(--enroll-card-border)",
                    background: "var(--enroll-card-bg)",
                    color: "var(--enroll-text-primary)",
                  }}
                >
                  {t(`${A}customizeAllocationCta`)}
                  <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                </button>
              </>
            ) : (
              /* ─── Editor panel ─── */
              <>
                <div>
                  <span
                    className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold"
                    style={{
                      borderColor:
                        "color-mix(in srgb, var(--enroll-brand) 40%, transparent)",
                      background:
                        "color-mix(in srgb, var(--enroll-brand) 8%, var(--enroll-card-bg))",
                      color: "var(--enroll-brand)",
                    }}
                  >
                    <SlidersHorizontal
                      className="h-4 w-4 shrink-0 opacity-90"
                      aria-hidden
                    />
                    {t(`${A}customizeSplitHeader`)}
                  </span>
                  <p
                    className="mt-3 text-sm"
                    style={{ color: "var(--enroll-text-secondary)" }}
                  >
                    {t(`${A}customizeEditorSubtitle`)}
                  </p>
                </div>

                {/* Live allocation bar */}
                <div className="space-y-2">
                  <div className="alloc-bar-plain">
                    <div className="flex h-full w-full overflow-hidden rounded-full">
                      {sources.preTax > 0 && (
                        <div
                          className="alloc-seg-pretax transition-all"
                          style={{ width: `${sources.preTax}%` }}
                        />
                      )}
                      {sources.roth > 0 && (
                        <div
                          className="alloc-seg-roth transition-all"
                          style={{ width: `${sources.roth}%` }}
                        />
                      )}
                      {sources.afterTax > 0 && (
                        <div
                          className="alloc-seg-aftertax transition-all"
                          style={{ width: `${sources.afterTax}%` }}
                        />
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div
                      className="flex items-center gap-2"
                      style={{ color: "var(--enroll-text-primary)" }}
                    >
                      <span className="alloc-dot alloc-dot--md alloc-dot--pretax" />
                      {t(`${A}preTaxLabel`)} ${monthlyPreTax.toLocaleString()}
                      /mo
                    </div>
                    <div
                      className="flex items-center gap-2"
                      style={{ color: "var(--enroll-text-primary)" }}
                    >
                      <span className="alloc-dot alloc-dot--md alloc-dot--roth" />
                      {t(`${A}rothLabel`)} ${monthlyRoth.toLocaleString()}/mo
                    </div>
                    {hasAfterTaxSlice && (
                      <div
                        className="flex items-center gap-2"
                        style={{ color: "var(--enroll-text-primary)" }}
                      >
                        <span className="alloc-dot alloc-dot--md alloc-dot--aftertax" />
                        {t(`${A}afterTaxLabel`)} $
                        {monthlyAfterTax.toLocaleString()}/mo
                      </div>
                    )}
                  </div>
                </div>

                {/* Sliders */}
                {hasAfterTaxSlice ? (
                  <div className="space-y-5">
                    <SliderRow
                      label={t(`${A}preTaxLabel`)}
                      sub={t(`${A}preTaxSub`)}
                      color="blue"
                      value={sources.preTax}
                      monthly={monthlyPreTax}
                      onChange={handlePreTaxChange}
                    />
                    <SliderRow
                      label={t(`${A}rothLabel`)}
                      sub={t(`${A}rothSub`)}
                      color="purple"
                      value={sources.roth}
                      monthly={monthlyRoth}
                      onChange={handleRothChange}
                    />
                    <SliderRow
                      label={t(`${A}afterTaxLabel`)}
                      sub={t(`${A}afterTaxSub`)}
                      color="orange"
                      value={sources.afterTax}
                      monthly={monthlyAfterTax}
                      onChange={handleAfterTaxChange}
                    />
                  </div>
                ) : (
                  <>
                    <div className="space-y-6">
                      <DualSlider
                        label={t(`${A}preTaxLabel`)}
                        color="blue"
                        value={sources.preTax}
                        onChange={handleCombinedPreRoth}
                        whatsThisLabel={t(`${A}whatsThis`)}
                        onWhatsThis={() =>
                          scrollToExplain("source-explain-pretax")
                        }
                      />
                      <DualSlider
                        label={t(`${A}rothLabel`)}
                        color="purple"
                        value={sources.roth}
                        onChange={(v) =>
                          setSources({
                            preTax: 100 - v,
                            roth: v,
                            afterTax: 0,
                          })
                        }
                        whatsThisLabel={t(`${A}whatsThis`)}
                        onWhatsThis={() =>
                          scrollToExplain("source-explain-roth")
                        }
                      />
                    </div>

                    {/* Presets */}
                    <div className="space-y-2">
                      <p
                        className="text-[0.65rem] font-semibold uppercase tracking-[0.12em]"
                        style={{ color: "var(--enroll-text-secondary)" }}
                      >
                        {t(`${A}commonSplitsLabel`)}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {commonPresets.map((p) => (
                          <button
                            key={p.label}
                            type="button"
                            onClick={() =>
                              setSources({
                                preTax: p.preTax,
                                roth: p.roth,
                                afterTax: 0,
                              })
                            }
                            className="rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors"
                            style={{
                              borderColor: "var(--enroll-card-border)",
                              background: "var(--enroll-card-bg)",
                              color: "var(--enroll-text-primary)",
                            }}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {supportsAfterTax && showAdvanced && (
                      <div
                        className="space-y-2 border-t pt-4"
                        style={{ borderColor: "var(--enroll-card-border)" }}
                      >
                        <SliderRow
                          label={t(`${A}afterTaxLabel`)}
                          sub={t(`${A}afterTaxSub`)}
                          color="orange"
                          value={sources.afterTax}
                          monthly={monthlyAfterTax}
                          onChange={handleAfterTaxChange}
                        />
                      </div>
                    )}
                  </>
                )}

                {supportsAfterTax && !hasAfterTaxSlice && (
                  <div className="flex flex-col gap-2">
                    {!showAdvanced ? (
                      <button
                        type="button"
                        onClick={() => setShowAdvanced(true)}
                        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-dashed text-sm font-medium transition-colors"
                        style={{
                          borderColor: "var(--enroll-card-border)",
                          color: "var(--enroll-text-secondary)",
                        }}
                      >
                        <Plus className="h-4 w-4 shrink-0" aria-hidden />
                        {t(`${A}addAnotherSource`)}
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
                        className="flex items-center gap-1.5 self-start text-sm font-medium"
                        style={{ color: "var(--enroll-text-secondary)" }}
                      >
                        <ChevronUp className="h-4 w-4" aria-hidden />
                        {t(`${A}hideAdvanced`)}
                      </button>
                    )}
                  </div>
                )}

                {/* Match + Total */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div
                    className="rounded-xl border p-4"
                    style={{
                      borderColor:
                        "color-mix(in srgb, var(--color-success) 25%, transparent)",
                      background:
                        "color-mix(in srgb, var(--color-success) 6%, var(--enroll-card-bg))",
                    }}
                  >
                    <p
                      className="text-xs font-semibold uppercase tracking-wide"
                      style={{ color: "var(--color-success)" }}
                    >
                      {t(`${A}employerMatch`)}
                    </p>
                    <p
                      className="mt-1 text-xl font-bold tabular-nums"
                      style={{ color: "var(--color-success)" }}
                    >
                      +${effectiveEmployerMatch.toLocaleString()}
                    </p>
                    <p
                      className="mt-0.5 text-xs font-medium"
                      style={{ color: "var(--color-success)" }}
                    >
                      {t(`${A}employerMatchOnPreTax`)}
                    </p>
                  </div>
                  <div
                    className="rounded-xl border p-4"
                    style={{
                      borderColor: "var(--enroll-card-border)",
                      background: "var(--enroll-card-bg)",
                    }}
                  >
                    <p
                      className="text-xs font-semibold uppercase tracking-wide"
                      style={{ color: "var(--enroll-text-secondary)" }}
                    >
                      {t(`${A}totalMonthlyLabel`)}
                    </p>
                    <p
                      className="mt-1 text-xl font-bold tabular-nums"
                      style={{ color: "var(--enroll-text-primary)" }}
                    >
                      ${totalMonthlyInvestment.toLocaleString()}
                    </p>
                    <p
                      className="mt-0.5 text-xs"
                      style={{ color: "var(--enroll-text-secondary)" }}
                    >
                      {t(`${A}totalMonthlyYouPlusEmployer`)}
                    </p>
                  </div>
                </div>

                {/* Apply + Reset */}
                <button
                  type="button"
                  onClick={() => {
                    if (Math.abs(total - 100) < 0.001) {
                      /* applied */
                    }
                  }}
                  disabled={applyCustomDisabled || Math.abs(total - 100) > 0.001}
                  className="flex h-12 w-full items-center justify-center rounded-xl text-sm font-semibold transition-colors"
                  style={{
                    background:
                      applyCustomDisabled || Math.abs(total - 100) > 0.001
                        ? "var(--enroll-soft-bg)"
                        : "var(--enroll-brand)",
                    color:
                      applyCustomDisabled || Math.abs(total - 100) > 0.001
                        ? "var(--enroll-text-muted)"
                        : "var(--color-text-on-primary)",
                    cursor:
                      applyCustomDisabled || Math.abs(total - 100) > 0.001
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  {t(`${A}adjustSlidersToApply`)}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="flex w-full items-center justify-center gap-1.5 text-sm font-medium"
                  style={{ color: "var(--enroll-text-secondary)" }}
                >
                  <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
                  {t(`${A}resetToPlanDefault`)}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {editorOpen && Math.abs(total - 100) > 0.001 && (
        <p
          className="text-center text-sm font-medium"
          style={{ color: "var(--color-error)" }}
        >
          {t(`${A}allocMustTotal`, { total })}
        </p>
      )}

      {/* Understanding section */}
      <div className="space-y-4">
        <h2
          className="text-lg font-semibold"
          style={{ color: "var(--enroll-text-primary)" }}
        >
          {t(`${A}understandingTitle`)}
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ExplainCard
            id="source-explain-pretax"
            title={t(`${A}preTaxLabel`)}
            subtitle={t(`${A}explainPreTaxSub`)}
            icon={<TrendingUp className="h-4 w-4" aria-hidden />}
            variant="pretax"
            items={explainPreTax}
          />
          <ExplainCard
            id="source-explain-roth"
            title={t(`${A}rothLabel`)}
            subtitle={t(`${A}explainRothSub`)}
            icon={<Shield className="h-4 w-4" aria-hidden />}
            variant="roth"
            items={explainRoth}
          />
          <ExplainCard
            id="source-explain-aftertax"
            title={t(`${A}afterTaxLabel`)}
            subtitle={t(`${A}explainAfterTaxSub`)}
            icon={<DollarSign className="h-4 w-4" aria-hidden />}
            variant="aftertax"
            items={explainAfterTax}
            className="md:col-span-2 lg:col-span-1"
          />
        </div>
      </div>
    </div>
  );
}

function DualSlider({
  label,
  color,
  value,
  onChange,
  whatsThisLabel,
  onWhatsThis,
}: {
  label: string;
  color: "blue" | "purple";
  value: number;
  onChange: (n: number) => void;
  whatsThisLabel: string;
  onWhatsThis: () => void;
}) {
  const displayPct = Math.round(value);
  const rangeMod =
    color === "blue"
      ? "source-allocation-range--pretax"
      : "source-allocation-range--roth";
  return (
    <div
      className="space-y-2 rounded-xl border p-4"
      style={{
        borderColor: "color-mix(in srgb, var(--enroll-card-border) 80%, transparent)",
        background: "color-mix(in srgb, var(--enroll-soft-bg, var(--enroll-card-bg)) 22%, var(--enroll-card-bg) 78%)",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span
            className={`alloc-dot alloc-dot--md shrink-0 ${color === "blue" ? "alloc-dot--pretax" : "alloc-dot--roth"}`}
          />
          <span
            className="text-sm font-semibold"
            style={{ color: "var(--enroll-text-primary)" }}
          >
            {label}
          </span>
          <button
            type="button"
            onClick={onWhatsThis}
            className="text-xs font-medium hover:underline"
            style={{ color: "var(--enroll-brand)" }}
          >
            {whatsThisLabel}
          </button>
        </div>
        <p
          className={`shrink-0 tabular-nums ${color === "blue" ? "alloc-value-pretax" : "alloc-value-roth"}`}
        >
          {displayPct}%
        </p>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={Math.min(100, Math.max(0, value))}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`source-allocation-range w-full min-w-0 ${rangeMod}`}
        style={
          { "--range-pct": `${Math.min(100, Math.max(0, value))}%` } as CSSProperties
        }
        aria-label={label}
      />
      <div
        className="flex justify-between text-xs"
        style={{ color: "var(--enroll-text-secondary)" }}
      >
        <span>0%</span>
        <span>100%</span>
      </div>
    </div>
  );
}

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
  const valueClass =
    color === "blue"
      ? "alloc-value-pretax"
      : color === "purple"
        ? "alloc-value-roth"
        : "alloc-value-aftertax";
  const rangeMod =
    color === "blue"
      ? "source-allocation-range--pretax"
      : color === "purple"
        ? "source-allocation-range--roth"
        : "source-allocation-range--aftertax";
  return (
    <div
      className="space-y-2 rounded-xl border p-4"
      style={{
        borderColor: "color-mix(in srgb, var(--enroll-card-border) 80%, transparent)",
        background: "color-mix(in srgb, var(--enroll-soft-bg, var(--enroll-card-bg)) 22%, var(--enroll-card-bg) 78%)",
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`alloc-dot alloc-dot--md ${
                color === "blue"
                  ? "alloc-dot--pretax"
                  : color === "purple"
                    ? "alloc-dot--roth"
                    : "alloc-dot--aftertax"
              }`}
            />
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--enroll-text-primary)" }}
            >
              {label}
            </p>
          </div>
          <p
            className="ml-5 text-[0.7rem] leading-snug"
            style={{ color: "var(--enroll-text-secondary)" }}
          >
            {sub}
          </p>
        </div>
        <p className={valueClass}>{value}%</p>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`source-allocation-range ${rangeMod}`}
        style={{ "--range-pct": `${value}%` } as CSSProperties}
      />
      <div
        className="flex justify-between text-[0.7rem]"
        style={{ color: "var(--enroll-text-secondary)" }}
      >
        <span>0%</span>
        <span
          className="font-semibold"
          style={{ color: "var(--enroll-text-primary)" }}
        >
          ${monthly.toLocaleString()}/mo
        </span>
        <span>100%</span>
      </div>
    </div>
  );
}

const EXPLAIN_ACCENT = {
  pretax: { bg: "var(--enroll-brand)", check: "var(--enroll-brand)" },
  roth: { bg: "var(--ai-primary)", check: "var(--ai-primary)" },
  aftertax: { bg: "var(--color-warning)", check: "var(--color-warning)" },
} as const;

function ExplainCard({
  id,
  title,
  subtitle,
  icon,
  variant,
  items,
  className,
}: {
  id?: string;
  title: string;
  subtitle: string;
  icon: ReactNode;
  variant: "pretax" | "roth" | "aftertax";
  items: string[];
  className?: string;
}) {
  const accent = EXPLAIN_ACCENT[variant];
  return (
    <div
      id={id}
      className={`rounded-xl border p-4 transition-all hover:-translate-y-px hover:shadow-md ${className ?? ""}`}
      style={{
        borderColor: "color-mix(in srgb, var(--enroll-card-border) 80%, transparent)",
        background: "color-mix(in srgb, var(--enroll-soft-bg, var(--enroll-card-bg)) 22%, var(--enroll-card-bg) 78%)",
      }}
    >
      <div className="mb-3 flex items-start gap-2.5">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white"
          style={{ background: accent.bg }}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <h3
            className="text-sm font-semibold"
            style={{ color: "var(--enroll-text-primary)" }}
          >
            {title}
          </h3>
          <p
            className="mt-0.5 text-xs"
            style={{ color: "var(--enroll-text-secondary)" }}
          >
            {subtitle}
          </p>
        </div>
      </div>
      <div className="space-y-1.5">
        {items.map((line) => (
          <div key={line} className="flex items-start gap-2">
            <Check
              className="mt-0.5 h-3.5 w-3.5 shrink-0"
              style={{ color: accent.check }}
              aria-hidden
            />
            <p
              className="text-sm"
              style={{ color: "var(--enroll-text-secondary)" }}
            >
              {line}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

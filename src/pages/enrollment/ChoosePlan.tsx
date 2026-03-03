import { useCallback, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEnrollment } from "../../enrollment/context/EnrollmentContext";
import { loadEnrollmentDraft, saveEnrollmentDraft } from "../../enrollment/enrollmentDraftStore";
import { getPlanRecommendation } from "../../enrollment/logic/planRecommendationLogic";
import { useCoreAIModalOptional } from "../../context/CoreAIModalContext";
import { useUser } from "../../context/UserContext";
import { PersonalizePlanModal } from "../../components/enrollment/PersonalizePlanModal";
import { EnrollmentFooter } from "../../components/enrollment/EnrollmentFooter";
import { User, Clock, CheckCircle2, Check, MessageCircle, TrendingUp, Shield, Info } from "lucide-react";

const FALLBACK_AGE = 30;
const FALLBACK_RETIREMENT_AGE = 65;
const FALLBACK_SALARY = 50000;

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

const PLAN_ASK_AI_PROMPT = (planName: string) =>
  `Explain the ${planName} plan and how it works for me.`;

export const ChoosePlan = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { profile } = useUser();
  const { state, setSelectedPlan, setCurrentAge, setRetirementAge, setSalary } = useEnrollment();
  const draft = loadEnrollmentDraft();
  const coreAI = useCoreAIModalOptional();
  const selectedInContext = state.selectedPlan === "roth_401k";
  const [planSelected, setPlanSelected] = useState(selectedInContext);
  const isSelected = planSelected || selectedInContext;
  const [isPersonalizeOpen, setIsPersonalizeOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!toastMessage) return;
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
      toastTimeoutRef.current = null;
    }, 4000);
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, [toastMessage]);

  const handleTogglePlan = useCallback(() => {
    if (isSelected) {
      setSelectedPlan(null);
      setPlanSelected(false);
    } else {
      setSelectedPlan("roth_401k");
      setPlanSelected(true);
    }
  }, [isSelected, setSelectedPlan]);

  const handleContinue = useCallback(() => {
    if (state.selectedPlan == null) {
      setToastMessage(t("enrollment.selectPlanRequired"));
      return;
    }
    const draft = loadEnrollmentDraft();
    const currentAge = state.currentAge ?? draft?.currentAge ?? FALLBACK_AGE;
    const retirementAge = state.retirementAge ?? draft?.retirementAge ?? FALLBACK_RETIREMENT_AGE;
    const annualSalary = state.salary ?? draft?.annualSalary ?? FALLBACK_SALARY;
    const yearsToRetire = Math.max(0, retirementAge - currentAge);
    const base = draft ?? {
      currentAge,
      retirementAge,
      yearsToRetire,
      annualSalary,
      retirementLocation: draft?.retirementLocation ?? "",
    };
    saveEnrollmentDraft({
      ...base,
      selectedPlanId: state.selectedPlan,
      selectedPlanDbId: state.selectedPlanDbId ?? undefined,
    });
  }, [state.selectedPlan, state.selectedPlanDbId, state.currentAge, state.retirementAge, state.salary, t]);

  const handleClosePersonalize = useCallback(() => {
    setIsPersonalizeOpen(false);
    const d = loadEnrollmentDraft();
    if (d != null) {
      if (d.currentAge != null) setCurrentAge(d.currentAge);
      if (d.retirementAge != null) setRetirementAge(d.retirementAge);
      if (d.annualSalary != null && d.annualSalary > 0) setSalary(d.annualSalary);
    }
  }, [setCurrentAge, setRetirementAge, setSalary]);

  const plan = {
    id: "roth-dev",
    name: "Roth 401(k)",
    description:
      "Contributions are made after-tax. Withdrawals in retirement are tax-free.",
    highlight: "100% up to 6% Match",
    advantages: [
      "Tax-free growth",
      "Tax-free withdrawal",
      "Employer Match",
    ],
    impact: {
      immediate: "No immediate tax deduction.",
      future: "Tax-free income in retirement.",
      diversification: "Provides tax diversification strategy.",
    },
  };

  const recommendation = getPlanRecommendation({
    currentAge: (state.currentAge || draft?.currentAge) ?? FALLBACK_AGE,
    retirementAge: (state.retirementAge || draft?.retirementAge) ?? FALLBACK_RETIREMENT_AGE,
    salary: (state.salary || draft?.annualSalary) ?? FALLBACK_SALARY,
    currentBalance: state.currentBalance ?? (draft?.otherSavings?.amount ?? 0),
  });

  const yearsToRetire = Math.max(0, recommendation.profileSnapshot.retirementAge - recommendation.profileSnapshot.age);
  const userSnapshot = {
    age: recommendation.profileSnapshot.age,
    retirementAge: recommendation.profileSnapshot.retirementAge,
    salary: recommendation.profileSnapshot.salary,
    yearsToRetire,
    retirementLocation: draft?.retirementLocation,
    otherSavings: state.currentBalance ?? draft?.otherSavings?.amount ?? undefined,
  };

  return (
    <div className="w-full min-h-0 pb-12 md:pb-16" style={{ background: "var(--enroll-bg)" }}>
      <PersonalizePlanModal
        isOpen={isPersonalizeOpen}
        onClose={handleClosePersonalize}
        userName={profile?.name ?? "there"}
      />
      {toastMessage && (
        <div
          role="alert"
          aria-live="assertive"
          className="fixed right-4 top-6 z-[100] max-w-sm rounded-xl px-4 py-3 text-sm font-medium shadow-lg border"
          style={{
            background: "var(--color-warning-light)",
            borderColor: "var(--color-warning)",
            color: "var(--color-warning)",
            boxShadow: "var(--enroll-elevation-3)",
          }}
        >
          {toastMessage}
        </div>
      )}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-4 pb-12">
        <header className="mb-4">
          <h1 className="text-xl md:text-2xl font-bold leading-tight" style={{ color: "var(--enroll-text-primary)" }}>
            {t("enrollment.yourPlan")}
          </h1>
          <p className="mt-1 text-base leading-relaxed" style={{ color: "var(--enroll-text-secondary)" }}>
            {t("enrollment.yourPlanSubtitle")}
          </p>
        </header>

        <div
          className={`rounded-2xl grid grid-cols-1 lg:grid-cols-12 overflow-hidden transition-all duration-200 ${
            isSelected
              ? "border-2 border-[var(--enroll-brand)] bg-white shadow-xl"
              : "border border-slate-200 dark:border-[var(--enroll-card-border)] bg-white dark:bg-[var(--enroll-card-bg)] shadow-md"
          }`}
        >
          <div className="lg:col-span-8 flex flex-col">
            <div
              className={`p-10 flex flex-col transition-all duration-200 ${
                isSelected
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--enroll-soft-bg)] dark:bg-[var(--enroll-card-bg)] border-b border-slate-200 dark:border-[var(--enroll-card-border)]"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2
                    className="text-2xl md:text-3xl font-bold tracking-tight"
                    style={isSelected ? undefined : { color: "var(--enroll-text-primary)" }}
                  >
                    {plan.name}
                  </h2>
                  <p
                    className={`mt-2 text-sm md:text-base leading-relaxed max-w-xl ${isSelected ? "text-white/90" : ""}`}
                    style={isSelected ? undefined : { color: "var(--enroll-text-secondary)" }}
                  >
                    {plan.description}
                  </p>
                </div>
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors"
                  style={{
                    borderColor: isSelected ? "rgba(255,255,255,0.4)" : "var(--enroll-card-border)",
                    background: isSelected ? "rgba(255,255,255,0.2)" : "var(--enroll-soft-bg)",
                  }}
                  aria-label={isSelected ? t("enrollment.selectedPlanAria") : t("enrollment.planInsightsAria")}
                >
                  {isSelected ? (
                    <CheckCircle2 className="h-5 w-5 text-white" strokeWidth={2} aria-hidden />
                  ) : (
                    <Info className="h-5 w-5 text-slate-400 dark:text-[var(--enroll-text-muted)]" strokeWidth={2} aria-hidden />
                  )}
                </span>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {plan.advantages.map((b, i) => (
                  <span
                    key={i}
                    className={
                      isSelected
                        ? "inline-flex items-center rounded-lg bg-white/15 px-3 py-1.5 text-xs font-medium"
                        : "inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-medium border border-slate-200 dark:border-[var(--enroll-card-border)]"
                    }
                    style={isSelected ? undefined : { color: "var(--enroll-text-secondary)", background: "var(--enroll-card-bg)" }}
                  >
                    {b}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-4">
                {coreAI && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      coreAI.openWithPrompt(PLAN_ASK_AI_PROMPT(plan.name));
                    }}
                    className={
                      isSelected
                        ? "order-2 sm:order-1 w-full sm:w-auto min-h-[44px] sm:min-h-0 inline-flex items-center justify-center gap-2 rounded-xl border-0 bg-transparent px-0 py-2 text-sm font-medium text-white/90 hover:text-white transition-colors"
                        : "order-2 sm:order-1 w-full sm:w-auto min-h-[44px] sm:min-h-0 inline-flex items-center justify-center gap-2 rounded-xl border-0 bg-transparent px-0 py-2 text-sm font-medium transition-colors hover:opacity-80"
                    }
                    style={isSelected ? undefined : { color: "var(--enroll-brand)" }}
                    aria-label={t("enrollment.askAiAboutPlan")}
                  >
                    <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />
                    <span>{t("enrollment.askAiAboutPlan")}</span>
                  </button>
                )}
                {isSelected ? (
                  <button
                    type="button"
                    onClick={handleTogglePlan}
                    className="order-1 sm:order-2 inline-flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2.5 text-sm font-medium sm:ml-auto hover:bg-white/25 transition-colors cursor-pointer"
                    aria-label={t("enrollment.selected")}
                  >
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                    {t("enrollment.selected")}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleTogglePlan}
                    className="order-1 sm:order-2 w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition-colors hover:opacity-90"
                    style={{
                      borderColor: "var(--enroll-brand)",
                      color: "var(--enroll-brand)",
                      background: "rgb(var(--enroll-brand-rgb) / 0.08)",
                    }}
                  >
                    {t("enrollment.selectPlan")}
                  </button>
                )}
              </div>
            </div>

            <div className="p-10 border-t border-slate-100">
              <h3 className="text-lg font-semibold mb-6" style={{ color: "var(--enroll-text-primary)" }}>
                {t("enrollment.whatThisMeansForYou")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: "var(--enroll-brand)" }}>
                    <Clock className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden />
                    {t("enrollment.immediateImpact")}
                  </h4>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--enroll-text-secondary)" }}>
                    {plan.impact.immediate}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: "var(--enroll-brand)" }}>
                    <TrendingUp className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden />
                    {t("enrollment.futureBenefit")}
                  </h4>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--enroll-text-secondary)" }}>
                    {plan.impact.future}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: "var(--enroll-brand)" }}>
                    <Shield className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden />
                    {t("enrollment.taxDiversification")}
                  </h4>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--enroll-text-secondary)" }}>
                    {plan.impact.diversification}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-slate-50/50 dark:bg-slate-900/30 p-10 border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col gap-6">
            <section>
              <h4 className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "var(--enroll-text-muted)" }}>
                {t("enrollment.planHighlight")}
              </h4>
              <p className="text-sm leading-relaxed" style={{ color: "var(--enroll-text-secondary)" }}>
                {plan.highlight}
              </p>
            </section>

            <section>
              <h4 className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "var(--enroll-text-muted)" }}>
                {t("enrollment.keyAdvantages")}
              </h4>
              <ul className="space-y-2">
                {plan.advantages.map((value, i) => (
                  <li key={i} className="flex gap-2 text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--enroll-brand)]" />
                    {value}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h4 className="text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: "var(--enroll-text-muted)" }}>
                <User size={12} /> {t("enrollment.yourDetails")}
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-800/50 border border-slate-100">
                  <span className="text-[10px] font-medium" style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.age")}</span>
                  <div className="font-medium" style={{ color: "var(--enroll-text-primary)" }}>{userSnapshot.age}</div>
                </div>
                <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-800/50 border border-slate-100">
                  <span className="text-[10px] font-medium" style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.retiringAt")}</span>
                  <div className="font-medium" style={{ color: "var(--enroll-text-primary)" }}>{userSnapshot.retirementAge}</div>
                </div>
                <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-800/50 border border-slate-100 col-span-2">
                  <span className="text-[10px] font-medium" style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.salary")}</span>
                  <div className="font-medium" style={{ color: "var(--enroll-text-primary)" }}>{formatCurrency(userSnapshot.salary)}</div>
                </div>
                {userSnapshot.yearsToRetire != null && userSnapshot.yearsToRetire >= 0 && (
                  <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-800/50 border border-slate-100 col-span-2 flex items-center gap-1.5">
                    <Clock size={12} style={{ color: "var(--enroll-text-muted)" }} />
                    <span className="text-[10px] font-medium" style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.yearsToRetire")}</span>
                    <span className="font-medium" style={{ color: "var(--enroll-text-primary)" }}>{userSnapshot.yearsToRetire}</span>
                  </div>
                )}
              </div>
            </section>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsPersonalizeOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-medium border transition-colors"
                style={{ borderColor: "var(--enroll-card-border)", color: "var(--enroll-text-secondary)", background: "var(--enroll-card-bg)" }}
              >
                {t("enrollment.editDetails")}
              </button>
            </div>
          </div>
        </div>

        <EnrollmentFooter
          primaryLabel={t("enrollment.continueToContributions") + " →"}
          primaryDisabled={state.selectedPlan == null}
          onPrimary={handleContinue}
        />
      </div>
    </div>
  );
};

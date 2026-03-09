import { useCallback, useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useEnrollment } from "../../../enrollment/context/EnrollmentContext";
import { useContributionStore } from "../../../enrollment/context/useContributionStore";
import { loadEnrollmentDraft, saveEnrollmentDraft } from "../../../enrollment/enrollmentDraftStore";
import { PAYCHECKS_PER_YEAR } from "../../../enrollment/logic/contributionCalculator";
import { EnrollmentPageContent } from "../../../components/enrollment/EnrollmentPageContent";
import { EnrollmentFooter } from "../../../components/enrollment/EnrollmentFooter";
import { SectionHeadingWithAccent } from "../../../components/ui/SectionHeadingWithAccent";
import { ContributionLayoutV2 } from "./ContributionLayoutV2";
import { ENROLLMENT_V2_STEP_PATHS } from "../config/stepConfig";
import { useCoreAIModalOptional } from "../../../context/CoreAIModalContext";

/** V2 Contribution — UI from ContributionLayoutV2; state from useEnrollment + useContributionStore. Contribution fields always editable; only Tax Strategy has "Edit Contribution Split". */
export function ContributionPage() {
  const { t } = useTranslation();
  const { state } = useEnrollment();
  const coreAI = useCoreAIModalOptional();
  const {
    salary,
    contributionPct,
    derived,
    projectionBaseline,
    sourceAllocation,
    setSourcesEditMode,
    setContributionType: setType,
    setContributionAmount: setAmount,
    setSourceAllocation,
    handleSourcePercentChange,
  } = useContributionStore();

  const sourcesEditMode = state.sourcesEditMode;
  const setSourcesEditModeFromStore = useCallback(() => {
    setSourcesEditMode(!sourcesEditMode);
  }, [sourcesEditMode, setSourcesEditMode]);

  /** Per-source enable/disable (UI only). When disabled, percentage is 0 and row is muted. */
  const [sourceEnabled, setSourceEnabled] = useState<{ preTax: boolean; roth: boolean; afterTax: boolean }>(() => ({
    preTax: sourceAllocation.preTax > 0,
    roth: sourceAllocation.roth > 0,
    afterTax: sourceAllocation.afterTax > 0,
  }));
  useEffect(() => {
    setSourceEnabled({
      preTax: sourceAllocation.preTax > 0,
      roth: sourceAllocation.roth > 0,
      afterTax: sourceAllocation.afterTax > 0,
    });
  }, [sourceAllocation.preTax, sourceAllocation.roth, sourceAllocation.afterTax]);

  const onSourceEnabledChange = useCallback(
    (key: "preTax" | "roth" | "afterTax", enabled: boolean) => {
      setSourceEnabled((prev) => ({ ...prev, [key]: enabled }));
      if (!enabled) {
        handleSourcePercentChange(key, 0);
      } else {
        handleSourcePercentChange(key, 33);
      }
    },
    [handleSourcePercentChange]
  );

  const selectedPlanLabel =
    state.selectedPlan === "roth_401k"
      ? t("enrollment.planRoth401kTitle")
      : state.selectedPlan === "traditional_401k"
        ? t("enrollment.planTraditional401kTitle")
        : "Plan";

  const monthlyContribution = {
    employee: derived.monthlyContribution,
    employer: derived.employerMatchMonthly,
    total: derived.totalMonthlyInvestment,
  };
  const perPaycheckEmployerMatch = derived.employerMatchMonthly * (12 / PAYCHECKS_PER_YEAR);
  const perPaycheckTotal = derived.perPaycheck + perPaycheckEmployerMatch;

  const projectionChartData = useMemo(() => {
    return projectionBaseline.dataPoints.map((d, i) => ({
      year: i === 0 ? "Now" : `Year ${d.year}`,
      value: d.balance,
      contributions: d.contributions,
    }));
  }, [projectionBaseline.dataPoints]);

  const onPreset = useCallback(
    (percent: number) => {
      setType("percentage");
      setAmount(percent);
    },
    [setType, setAmount]
  );

  const onContributionAmountChange = useCallback(
    (amount: number) => {
      if (state.contributionType === "percentage") {
        setType("percentage");
        setAmount(amount);
      } else {
        setType("fixed");
        setAmount(amount);
      }
    },
    [state.contributionType, setType, setAmount]
  );

  const saveDraftForNextStep = useCallback(() => {
    const draft = loadEnrollmentDraft();
    if (!draft) return;
    saveEnrollmentDraft({
      ...draft,
      contributionType: state.contributionType,
      contributionAmount: state.contributionAmount,
      sourceAllocation: state.sourceAllocation,
    });
  }, [state.contributionType, state.contributionAmount, state.sourceAllocation]);

  const getDraftSnapshot = useCallback(
    () => ({
      contributionType: state.contributionType,
      contributionAmount: state.contributionAmount,
      sourceAllocation: state.sourceAllocation,
    }),
    [state.contributionType, state.contributionAmount, state.sourceAllocation]
  );

  const primaryDisabled = state.contributionAmount <= 0;
  const maxDollar = salary > 0 ? Math.floor((salary / 100) * 25 / 12) : 1916;

  return (
    <EnrollmentPageContent
      headerContent={
        <SectionHeadingWithAccent
          title={t("enrollment.contributionTitle", "How much would you like to contribute?")}
          subtitle={`to your ${selectedPlanLabel}`}
          accentPosition="left"
        />
      }
    >
      <div className="flex flex-col gap-6 pb-12">
        <ContributionLayoutV2
          selectedPlanLabel={selectedPlanLabel}
          salary={salary}
          contributionType={state.contributionType}
          contributionAmount={state.contributionType === "percentage" ? contributionPct : state.contributionAmount}
          onContributionTypeChange={(type) => {
            setType(type);
            if (type === "percentage") setAmount(contributionPct || 6);
            else setAmount(derived.perPaycheck || 0);
          }}
          onContributionAmountChange={onContributionAmountChange}
          onPreset={onPreset}
          sourceAllocation={sourceAllocation}
          onSourcePercentChange={handleSourcePercentChange}
          sourceEnabled={sourceEnabled}
          onSourceEnabledChange={onSourceEnabledChange}
          sourcesEditMode={sourcesEditMode}
          onSourcesEditModeToggle={setSourcesEditModeFromStore}
          monthlyContribution={monthlyContribution}
          perPaycheckContribution={derived.perPaycheck}
          perPaycheckEmployerMatch={perPaycheckEmployerMatch}
          perPaycheckTotal={perPaycheckTotal}
          projectionChartData={projectionChartData}
          finalProjectedValue={projectionBaseline.finalBalance}
          yearsToRetire={Math.max(0, (state.retirementAge ?? 65) - (state.currentAge ?? 30))}
          totalContributionsOverTime={projectionBaseline.totalContributions}
          employerMatchCap={state.assumptions.employerMatchCap ?? 6}
          paychecksPerYear={PAYCHECKS_PER_YEAR}
          minPercent={1}
          maxPercent={25}
          minDollar={100}
          maxDollar={maxDollar}
          onAskAIContribution={coreAI ? () => coreAI.openWithPrompt("Explain how retirement contributions work and how employer match works.") : undefined}
          onAskAIPreTax={coreAI ? () => coreAI.openWithPrompt("Explain pre-tax contributions and tax benefits.") : undefined}
          onAskAIRoth={coreAI ? () => coreAI.openWithPrompt("Explain Roth contributions and tax-free growth.") : undefined}
          onAskAIAfterTax={coreAI ? () => coreAI.openWithPrompt("Explain after-tax contributions and mega backdoor Roth.") : undefined}
        />

        <EnrollmentFooter
          primaryLabel={t("enrollment.continueToAutoIncrease", "Continue to Auto Increase")}
          primaryDisabled={primaryDisabled}
          onPrimary={saveDraftForNextStep}
          getDraftSnapshot={getDraftSnapshot}
          stepPaths={ENROLLMENT_V2_STEP_PATHS}
          inContent
        />
      </div>
    </EnrollmentPageContent>
  );
}

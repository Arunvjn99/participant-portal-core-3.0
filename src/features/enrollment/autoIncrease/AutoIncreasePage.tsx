import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useEnrollment } from "../../../enrollment/context/EnrollmentContext";
import { useContributionStore } from "../../../enrollment/context/useContributionStore";
import { loadEnrollmentDraft, saveEnrollmentDraft } from "../../../enrollment/enrollmentDraftStore";
import { calculateProjection } from "../../../enrollment/logic/projectionCalculator";
import { EnrollmentPageContent } from "../../../components/enrollment/EnrollmentPageContent";
import { EnrollmentFooter } from "../../../components/enrollment/EnrollmentFooter";
import { SectionHeadingWithAccent } from "../../../components/ui/SectionHeadingWithAccent";
import { AutoIncreaseLayoutV2, type AutoIncreasePhase } from "./AutoIncreaseLayoutV2";
import { ENROLLMENT_V2_STEP_PATHS } from "../config/stepConfig";

const YEARS_TO_PROJECT = 10;
const FREQUENCY_OPTIONS = [
  { id: "annually", label: "Annually", description: "Once per year" },
  { id: "semi-annually", label: "Semi-Annually", description: "Every 6 months" },
  { id: "quarterly", label: "Quarterly", description: "Every 3 months" },
];

/** V2 Auto Increase — UI from AutoIncreaseLayoutV2; state from useEnrollment. Phase is local UI state only. */
export function AutoIncreasePage() {
  const { t } = useTranslation();
  const { state, setAutoIncrease } = useEnrollment();
  const { salary, contributionPct, derived } = useContributionStore();
  const [phase, setPhase] = useState<AutoIncreasePhase>("education");

  const currentContributionPercent = contributionPct;
  const currentAge = state.currentAge ?? 35;
  const retirementAge = state.retirementAge ?? 65;
  const yearsToRetire = Math.max(0, retirementAge - currentAge);

  const baseProjectionInput = useMemo(
    () => ({
      currentAge,
      retirementAge: currentAge + YEARS_TO_PROJECT,
      currentBalance: state.currentBalance ?? 0,
      monthlyContribution: derived.monthlyContribution,
      employerMatch: state.employerMatchEnabled ? derived.employerMatchMonthly : 0,
      annualReturnRate: state.assumptions.annualReturnRate ?? 7,
      inflationRate: state.assumptions.inflationRate ?? 2.5,
    }),
    [
      currentAge,
      state.currentBalance,
      derived.monthlyContribution,
      derived.employerMatchMonthly,
      state.employerMatchEnabled,
      state.assumptions.annualReturnRate,
      state.assumptions.inflationRate,
    ]
  );

  const projectionWithoutAuto = useMemo(() => calculateProjection(baseProjectionInput), [baseProjectionInput]);
  const projectionWithAutoEducation = useMemo(
    () =>
      calculateProjection({
        ...baseProjectionInput,
        autoIncrease: {
          enabled: true,
          initialPercentage: currentContributionPercent,
          increasePercentage: 2,
          maxPercentage: 15,
          salary,
          contributionType: "percentage",
          assumptions: state.assumptions,
        },
      }),
    [baseProjectionInput, currentContributionPercent, salary, state.assumptions]
  );

  const projectedWithoutAuto = Math.round(projectionWithoutAuto.finalBalance);
  const projectedWithAuto = Math.round(projectionWithAutoEducation.finalBalance);
  const projectedDifference = projectedWithAuto - projectedWithoutAuto;
  const monthlyImpactHint = salary > 0 ? Math.round((salary * 2) / 100 / 12) : 0;

  const increaseAmount = state.autoIncrease.percentage;
  const maxCap = state.autoIncrease.maxPercentage;
  const frequency = "annually";

  const configureProjectionInput = useMemo(
    () => ({
      ...baseProjectionInput,
      autoIncrease: state.autoIncrease.enabled
        ? {
            enabled: true,
            initialPercentage: currentContributionPercent,
            increasePercentage: state.autoIncrease.percentage,
            maxPercentage: state.autoIncrease.maxPercentage,
            salary,
            contributionType: "percentage" as const,
            assumptions: state.assumptions,
          }
        : undefined,
    }),
    [
      baseProjectionInput,
      state.autoIncrease.enabled,
      state.autoIncrease.percentage,
      state.autoIncrease.maxPercentage,
      state.assumptions,
      currentContributionPercent,
      salary,
    ]
  );

  const projectionWithAutoConfigure = useMemo(
    () => calculateProjection(configureProjectionInput),
    [configureProjectionInput]
  );

  const projectionChartData = useMemo(() => {
    const without = projectionWithoutAuto.dataPoints;
    const withA = projectionWithAutoConfigure.dataPoints;
    return without.slice(0, Math.min(without.length, withA.length, YEARS_TO_PROJECT + 1)).map((_, i) => ({
      year: i === 0 ? "Now" : `Yr ${i}`,
      withoutAutoIncrease: Math.round(without[i]?.balance ?? 0),
      withAutoIncrease: Math.round(withA[i]?.balance ?? 0),
    }));
  }, [projectionWithoutAuto.dataPoints, projectionWithAutoConfigure.dataPoints]);

  const finalBalanceWithoutAuto = Math.round(projectionWithoutAuto.finalBalance);
  const finalBalanceWithAuto = Math.round(projectionWithAutoConfigure.finalBalance);
  const configureDifference = finalBalanceWithAuto - finalBalanceWithoutAuto;

  const onPhaseChange = useCallback((p: AutoIncreasePhase) => {
    setPhase(p);
    if (p === "configure") setAutoIncrease({ enabled: true });
    if (p === "skipped") setAutoIncrease({ enabled: false });
  }, [setAutoIncrease]);

  const onIncreaseAmountChange = useCallback((v: number) => setAutoIncrease({ percentage: v }), [setAutoIncrease]);
  const onMaxCapChange = useCallback((v: number) => setAutoIncrease({ maxPercentage: v }), [setAutoIncrease]);
  const onFrequencyChange = useCallback((_id: string) => {}, []);

  const missedSavingsMessage = useMemo(
    () =>
      `By skipping, you could miss out on an estimated $${projectedDifference.toLocaleString()} in potential retirement savings over ${YEARS_TO_PROJECT} years.`,
    [projectedDifference]
  );

  const selectedPlanLabel =
    state.selectedPlan === "roth_401k"
      ? t("enrollment.planRoth401kTitle")
      : state.selectedPlan === "traditional_401k"
        ? t("enrollment.planTraditional401kTitle")
        : "Plan";

  const saveDraftForNextStep = useCallback(() => {
    const draft = loadEnrollmentDraft();
    if (!draft) return;
    saveEnrollmentDraft({
      ...draft,
      autoIncrease: state.autoIncrease.enabled
        ? {
            enabled: true,
            annualIncreasePct: state.autoIncrease.percentage,
            stopAtPct: state.autoIncrease.maxPercentage,
            minimumFloorPct: state.autoIncrease.minimumFloor,
          }
        : undefined,
    });
  }, [state.autoIncrease]);

  const getDraftSnapshot = useCallback(
    () => ({
      autoIncrease: state.autoIncrease.enabled
        ? {
            enabled: true,
            annualIncreasePct: state.autoIncrease.percentage,
            stopAtPct: state.autoIncrease.maxPercentage,
            minimumFloorPct: state.autoIncrease.minimumFloor,
          }
        : undefined,
    }),
    [state.autoIncrease]
  );

  return (
    <EnrollmentPageContent
      headerContent={
        <SectionHeadingWithAccent
          title={t("enrollment.autoIncreaseTitle", "Auto Increase Your Savings")}
          subtitle={t("enrollment.autoIncreaseSubtitleLong", "Small automatic increases add up to big results over time")}
          accentPosition="left"
        />
      }
    >
      <div className="flex flex-col gap-6 pb-12">
        <AutoIncreaseLayoutV2
          phase={phase}
          onPhaseChange={onPhaseChange}
          selectedPlanLabel={selectedPlanLabel}
          salary={salary}
          currentContributionPercent={currentContributionPercent}
          projectedWithoutAuto={projectedWithoutAuto}
          projectedWithAuto={projectedWithAuto}
          projectedDifference={projectedDifference}
          monthlyImpactHint={monthlyImpactHint}
          increaseAmount={increaseAmount}
          onIncreaseAmountChange={onIncreaseAmountChange}
          maxCap={maxCap}
          onMaxCapChange={onMaxCapChange}
          frequency={frequency}
          onFrequencyChange={onFrequencyChange}
          frequencyOptions={FREQUENCY_OPTIONS}
          projectionChartData={projectionChartData}
          finalBalanceWithAuto={finalBalanceWithAuto}
          finalBalanceWithoutAuto={finalBalanceWithoutAuto}
          configureDifference={configureDifference}
          missedSavingsMessage={missedSavingsMessage}
        />

        <EnrollmentFooter
          primaryLabel={t("enrollment.continueToInvestment", "Continue to Investment")}
          onPrimary={saveDraftForNextStep}
          getDraftSnapshot={getDraftSnapshot}
          stepPaths={ENROLLMENT_V2_STEP_PATHS}
          inContent
        />
      </div>
    </EnrollmentPageContent>
  );
}

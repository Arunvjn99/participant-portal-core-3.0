import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Zap,
  TrendingUp,
  Target,
  Shield,
  DollarSign,
} from "lucide-react";
import { useEnrollment } from "../../../enrollment/context/EnrollmentContext";
import type { RiskTolerance } from "../../../enrollment/types/investmentProfile";
import { DEFAULT_INVESTMENT_PROFILE } from "../../../enrollment/types/investmentProfile";
import { loadEnrollmentDraft, saveEnrollmentDraft } from "../../../enrollment/enrollmentDraftStore";
import { EnrollmentPageContent } from "../../../components/enrollment/EnrollmentPageContent";
import { EnrollmentFooter } from "../../../components/enrollment/EnrollmentFooter";
import { SectionHeadingWithAccent } from "../../../components/ui/SectionHeadingWithAccent";
import { InvestmentLayoutV2, type InvestmentProfileOption } from "./InvestmentLayoutV2";
import { ENROLLMENT_V2_STEP_PATHS } from "../config/stepConfig";

const RISK_LABELS: Record<RiskTolerance, string> = {
  1: "Conservative",
  2: "Moderate",
  3: "Balanced",
  4: "Growth",
  5: "Aggressive",
};

const PROFILE_DESCRIPTIONS: Record<RiskTolerance, string> = {
  1: "Lower volatility, emphasis on bonds and stable assets.",
  2: "Moderate mix of stocks and bonds for balanced growth.",
  3: "Balanced allocation suited to a typical retirement timeline.",
  4: "Higher growth potential with more equity exposure.",
  5: "Maximum growth focus with higher volatility tolerance.",
};

/** Display config per risk level (Figma parity: allocation, target return, age range, gradients, icon). */
const RISK_DISPLAY: Record<
  RiskTolerance,
  {
    targetReturn: number;
    ageRange: string;
    yearsToRetirement: string;
    allocation: { stocks: number; bonds: number; other: number };
    gradient: string;
    bgGradient: string;
    icon: typeof Zap;
  }
> = {
  1: {
    targetReturn: 6,
    ageRange: "50s - 60s",
    yearsToRetirement: "5-10 years",
    allocation: { stocks: 40, bonds: 50, other: 10 },
    gradient: "from-emerald-500 to-teal-500",
    bgGradient: "from-emerald-50 to-teal-50",
    icon: Shield,
  },
  2: {
    targetReturn: 6.5,
    ageRange: "40s - 50s",
    yearsToRetirement: "10-15 years",
    allocation: { stocks: 60, bonds: 30, other: 10 },
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50",
    icon: Target,
  },
  3: {
    targetReturn: 7.5,
    ageRange: "40s - 50s",
    yearsToRetirement: "10-15 years",
    allocation: { stocks: 60, bonds: 30, other: 10 },
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50",
    icon: Target,
  },
  4: {
    targetReturn: 8.5,
    ageRange: "30s - 40s",
    yearsToRetirement: "15-25 years",
    allocation: { stocks: 80, bonds: 15, other: 5 },
    gradient: "from-orange-500 to-amber-500",
    bgGradient: "from-orange-50 to-amber-50",
    icon: TrendingUp,
  },
  5: {
    targetReturn: 9.5,
    ageRange: "20s - 30s",
    yearsToRetirement: "25+ years",
    allocation: { stocks: 90, bonds: 5, other: 5 },
    gradient: "from-red-500 to-orange-500",
    bgGradient: "from-red-50 to-orange-50",
    icon: Zap,
  },
};

/** Simple projection: annual contribution * years * (1 + rate)^(years/2). */
function estimateRetirementBalance(
  annualContribution: number,
  years: number,
  ratePercent: number
): number {
  if (years <= 0) return 0;
  const rate = ratePercent / 100;
  let balance = 0;
  for (let y = 1; y <= years; y++) {
    balance += annualContribution * Math.pow(1 + rate, (years - y + 0.5));
  }
  return Math.round(balance);
}

/** V2 Investment — UI from InvestmentLayoutV2; state from useEnrollment only. */
export function InvestmentPage() {
  const { t } = useTranslation();
  const { state, setInvestmentProfile, setInvestmentProfileCompleted } = useEnrollment();

  const profileOptions: InvestmentProfileOption[] = useMemo(() => {
    return ([1, 2, 3, 4, 5] as RiskTolerance[]).map((risk) => {
      const display = RISK_DISPLAY[risk];
      return {
        id: String(risk),
        label: RISK_LABELS[risk],
        riskLabel: RISK_LABELS[risk],
        description: PROFILE_DESCRIPTIONS[risk],
        isRecommended: risk === 3,
        targetReturn: display.targetReturn,
        ageRange: display.ageRange,
        yearsToRetirement: display.yearsToRetirement,
        allocation: display.allocation,
        gradient: display.gradient,
        bgGradient: display.bgGradient,
        riskLevel: risk,
        icon: display.icon,
      };
    });
  }, []);

  const selectedProfileId = state.investmentProfile
    ? String(state.investmentProfile.riskTolerance)
    : null;

  const onSelectProfile = useCallback(
    (id: string) => {
      const risk = Number(id) as RiskTolerance;
      if (risk < 1 || risk > 5) return;
      const current = state.investmentProfile ?? DEFAULT_INVESTMENT_PROFILE;
      setInvestmentProfile({
        riskTolerance: risk,
        investmentHorizon: current.investmentHorizon,
        investmentPreference: current.investmentPreference,
      });
    },
    [state.investmentProfile, setInvestmentProfile]
  );

  const saveDraftForNextStep = useCallback(() => {
    const draft = loadEnrollmentDraft();
    if (!draft) return;
    setInvestmentProfileCompleted(true);
    saveEnrollmentDraft({
      ...draft,
      investmentProfile: state.investmentProfile ?? undefined,
      investmentProfileCompleted: true,
    });
  }, [state.investmentProfile, setInvestmentProfileCompleted]);

  const getDraftSnapshot = useCallback(
    () => ({
      investmentProfile: state.investmentProfile ?? undefined,
      investmentProfileCompleted: true,
    }),
    [state.investmentProfile]
  );

  const currentAge = state.currentAge ?? 30;
  const retirementAge = state.retirementAge ?? 65;
  const yearsToRetirement = Math.max(0, retirementAge - currentAge);
  const salary = state.salary ?? 0;
  const contributionPercent = state.contributionType === "percentage"
    ? (state.contributionAmount ?? 0)
    : salary > 0
      ? ((state.contributionAmount ?? 0) * 12 / salary) * 100
      : 0;
  const annualContribution = (salary * contributionPercent) / 100;
  const selectedOption = selectedProfileId
    ? profileOptions.find((p) => p.id === selectedProfileId)
    : null;
  const targetReturn = selectedOption?.targetReturn ?? 7.5;
  const estimatedAtRetirement = useMemo(
    () => estimateRetirementBalance(annualContribution, yearsToRetirement, targetReturn),
    [annualContribution, yearsToRetirement, targetReturn]
  );

  const aiRecommendationText = selectedProfileId
    ? undefined
    : `At age ${currentAge}, a Balanced (moderate risk) strategy typically offers the best balance of growth and stability for retirement.`;

  const handleEditStrategy = useCallback(() => {
    document.querySelector('[data-investment-strategy-cards]')?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const contributionPath = ENROLLMENT_V2_STEP_PATHS[1]; // "/enrollment-v2/contribution"
  const handleChooseMyOwnInvestments = useCallback(() => {
    window.location.href = contributionPath;
  }, []);

  return (
    <EnrollmentPageContent
      headerContent={
        <SectionHeadingWithAccent
          title={t("enrollment.investmentTitle", "Choose How Your Retirement Savings Are Invested")}
          subtitle={t("enrollment.investmentSubtitleLong", "Pick an investment approach that aligns with your risk level and retirement goals.")}
          accentPosition="left"
        />
      }
    >
      <div className="flex flex-col gap-6 pb-12">
        <InvestmentLayoutV2
          title={t("enrollment.stepperInvestment", "Investment")}
          subtitle={t("enrollment.investmentSubtitle", "Choose your investment approach.")}
          aiRecommendationText={aiRecommendationText}
          profileOptions={profileOptions}
          selectedProfileId={selectedProfileId}
          onSelectProfile={onSelectProfile}
          onEditStrategy={handleEditStrategy}
          estimatedAtRetirement={estimatedAtRetirement}
          yearsToRetirement={yearsToRetirement}
          avgReturnPercent={selectedOption?.targetReturn}
          sourceAllocation={state.sourceAllocation}
          onChooseMyOwnInvestments={handleChooseMyOwnInvestments}
        />
        <EnrollmentFooter
          primaryLabel={t("enrollment.continueToReadiness", "Continue to Readiness")}
          onPrimary={saveDraftForNextStep}
          getDraftSnapshot={getDraftSnapshot}
          stepPaths={ENROLLMENT_V2_STEP_PATHS}
          inContent
        />
      </div>
    </EnrollmentPageContent>
  );
}

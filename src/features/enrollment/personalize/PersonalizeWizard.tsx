import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Save } from "lucide-react";
import Button from "../../../components/ui/Button";
import { WizardModal } from "../../../components/ui/WizardModal";
import { GradientHeader } from "../../../components/ui/GradientHeader";
import { Stepper } from "../../../components/ui/Stepper";
import { usePersonalizeState, getAgeFromDOB } from "./usePersonalizeState";
import { savePersonalizeDraft } from "./personalizeDraftStore";
import { AgeStep } from "./AgeStep";
import { LocationStep } from "./LocationStep";
import { SavingsStep } from "./SavingsStep";

export interface PersonalizeWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  userName: string;
}

const STEPS = [
  { id: 1, label: "Age" },
  { id: 2, label: "Location" },
  { id: 3, label: "Savings" },
] as const;

export function PersonalizeWizard({ isOpen, onClose, onComplete, userName }: PersonalizeWizardProps) {
  const { t } = useTranslation();
  const {
    state,
    setCurrentStep,
    setDateOfBirth,
    setRetirementAge,
    setCountry,
    setStateRegion,
    setSalaryRange,
    setSavingsEstimate,
    setSavingsAmount,
    reset,
    RETIREMENT_AGE_MIN,
    RETIREMENT_AGE_MAX,
  } = usePersonalizeState();

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleComplete = () => {
    const savingsNum =
      state.savingsAmount.trim() === ""
        ? undefined
        : parseInt(state.savingsAmount, 10);
    const validSavings =
      savingsNum !== undefined && !Number.isNaN(savingsNum) && savingsNum >= 0
        ? savingsNum
        : undefined;

    savePersonalizeDraft({
      dateOfBirth: state.dateOfBirth,
      retirementAge: state.retirementAge,
      country: state.country,
      state: state.state,
      salaryRange: state.salaryRange,
      savingsEstimate: state.savingsEstimate,
      ...(validSavings != null && { savingsAmount: validSavings }),
    });
    reset();
    onComplete();
  };

  const canProceedAge = Boolean(state.dateOfBirth?.trim() && /^\d{4}-\d{2}-\d{2}$/.test(state.dateOfBirth));
  const needsState = (state.country === "United States" || state.country === "Canada") && state.state === "";
  const canProceedLocation = !needsState;
  const canCompleteSavings = true;

  const handleContinue = () => {
    if (state.currentStep < 3) {
      setCurrentStep((state.currentStep + 1) as 1 | 2 | 3);
    } else {
      handleComplete();
    }
  };

  const isLastStep = state.currentStep === 3;
  const continueDisabled =
    (state.currentStep === 1 && !canProceedAge) ||
    (state.currentStep === 2 && !canProceedLocation) ||
    (state.currentStep === 3 && !canCompleteSavings);

  return (
    <WizardModal isOpen={isOpen} onClose={handleClose} aria-label={t("wizard.title")}>
      <GradientHeader
        title={t("personalize.hiUser", "Hi {{name}} 👋", { name: userName })}
        subtitle={t("wizard.subtitle")}
        background="linear-gradient(135deg, var(--color-primary), var(--color-primary-light))"
        decorativeIconOpacity={0.3}
      />
      <Stepper
        steps={STEPS}
        currentStep={state.currentStep}
        onStepClick={(id) => setCurrentStep(id as 1 | 2 | 3)}
        aria-label={t("wizard.progress")}
      />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <AnimatePresence mode="wait">
          {state.currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 sm:space-y-5"
            >
              <AgeStep
                userName={userName}
                dateOfBirth={state.dateOfBirth}
                retirementAge={state.retirementAge}
                minRetirementAge={RETIREMENT_AGE_MIN}
                maxRetirementAge={RETIREMENT_AGE_MAX}
                onDateOfBirthChange={setDateOfBirth}
                onRetirementAgeChange={setRetirementAge}
                nextDisabled={!canProceedAge}
              />
            </motion.div>
          )}
          {state.currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 sm:space-y-5"
            >
              <LocationStep
                country={state.country}
                state={state.state}
                onCountryChange={setCountry}
                onStateChange={setStateRegion}
                nextDisabled={!canProceedLocation}
              />
            </motion.div>
          )}
          {state.currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <SavingsStep
                savingsAmount={state.savingsAmount}
                onSavingsAmountChange={setSavingsAmount}
                yearsUntilRetirement={Math.max(
                  0,
                  state.retirementAge - getAgeFromDOB(state.dateOfBirth)
                )}
                completeDisabled={!canCompleteSavings}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <footer className="sticky bottom-0 flex shrink-0 items-center justify-between border-t border-[var(--color-border)] bg-[var(--color-background-secondary)] p-4 sm:p-6">
        {state.currentStep > 1 ? (
          <Button
            type="button"
            variant="secondary"
            onClick={() => setCurrentStep((state.currentStep - 1) as 1 | 2 | 3)}
            className="rounded-xl px-4 py-2.5"
            aria-label={t("wizard.back")}
          >
            {t("wizard.back")}
          </Button>
        ) : (
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            className="rounded-xl px-4 py-2.5"
            aria-label={t("wizard.saveExit")}
          >
            <Save className="h-4 w-4 shrink-0" aria-hidden />
            <span className="sm:inline">{t("wizard.saveExit")}</span>
          </Button>
        )}
        <Button
          type="button"
          variant="primary"
          onClick={handleContinue}
          disabled={continueDisabled}
          className="rounded-xl px-5 py-2.5 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={isLastStep ? t("wizard.viewMyPlan") : t("wizard.continue")}
        >
          {isLastStep ? t("wizard.viewMyPlan") : t("wizard.continue")}
          <ArrowRight className="h-5 w-5" aria-hidden />
        </Button>
      </footer>
    </WizardModal>
  );
}

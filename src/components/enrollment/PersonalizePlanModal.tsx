import { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trans, useTranslation } from "react-i18next";
import "@/styles/v2/v2-ui.css";
import {
  V2WizardShell,
  V2Stepper,
  V2WizardFooter,
  V2Button,
  V2AgeStep,
  V2LocationStep,
  V2SavingsStep,
  V2ComfortStep,
  AnimatedHeaderWave,
  type V2InvestmentComfort,
} from "@/components/v2";
import {
  loadEnrollmentDraft,
  saveEnrollmentDraft,
  type EnrollmentDraft,
} from "@/enrollment/enrollmentDraftStore";
import { US_STATES } from "@/constants/usStates";
import { getRoutingVersion, withVersion } from "@/core/version";
import {
  WIZARD_RETIREMENT_AGE_MAX,
  WIZARD_RETIREMENT_AGE_MIN,
  clampWizardRetirementAge,
  getYearsUntilRetirement,
  type WizardStepsCoreState,
} from "@/enrollment/wizardStepInsights";
import { RETIREMENT_LOCATION_UNKNOWN } from "./wizardConstants";

export { RETIREMENT_LOCATION_UNKNOWN };

const TOTAL_STEPS = 4;
const DEFAULT_DOB = "1994-04-16";
const GENERIC_EN = "there";

function getAgeFromDOB(isoDate: string): number {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return 30;
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age -= 1;
  return Math.max(18, Math.min(74, age));
}

function getDOBFromAge(age: number): string {
  const y = new Date().getFullYear() - age;
  return `${y}-01-01`;
}

interface WizardFormState {
  dateOfBirth: string;
  retirementAge: number;
  annualSalary: number;
  retirementLocation: string;
  savingsAmount: number;
  investmentComfort: V2InvestmentComfort;
}

const DEFAULT_STATE: WizardFormState = {
  dateOfBirth: DEFAULT_DOB,
  retirementAge: 65,
  annualSalary: 45000,
  retirementLocation: "",
  savingsAmount: 0,
  investmentComfort: "balanced",
};

export interface PersonalizePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

const stepTransition = { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] };

function V2ExitConfirmation({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  const { t } = useTranslation();
  return (
    <motion.div className="v2-exit-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
      <motion.div
        className="v2-exit-dialog"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
      >
        <div className="v2-flex-center v2-mb-1">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--v2-purple-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h3 className="v2-section__title">{t("preEnrollment.personalizeWizard.exitTitle")}</h3>
        <p className="v2-text-center v2-text-muted v2-mt-1">{t("preEnrollment.personalizeWizard.exitBody")}</p>
        <div className="v2-exit-dialog__actions">
          <V2Button variant="secondary" type="button" onClick={onCancel}>
            {t("preEnrollment.personalizeWizard.exitKeepGoing")}
          </V2Button>
          <V2Button variant="primary" type="button" onClick={onConfirm}>
            {t("preEnrollment.personalizeWizard.exitExit")}
          </V2Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export const PersonalizePlanModal = ({ isOpen, onClose, userName = "there" }: PersonalizePlanModalProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const version = getRoutingVersion(pathname);
  const [step, setStep] = useState(1);
  const [state, setState] = useState<WizardFormState>(DEFAULT_STATE);
  const [editingAge, setEditingAge] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const currentAge = useMemo(() => getAgeFromDOB(state.dateOfBirth), [state.dateOfBirth]);
  const yearsUntilRetirement = useMemo(
    () => getYearsUntilRetirement(clampWizardRetirementAge(state.retirementAge), currentAge),
    [state.retirementAge, currentAge],
  );

  /** Steps 1–3 core fields (single source of truth for wizard logic). */
  const wizardCore: WizardStepsCoreState = useMemo(
    () => ({
      retirementAge: clampWizardRetirementAge(state.retirementAge),
      retirementLocation: state.retirementLocation.trim() === "" ? null : state.retirementLocation,
      savingsAmount: state.savingsAmount,
    }),
    [state.retirementAge, state.retirementLocation, state.savingsAmount],
  );

  const trimmed = userName?.trim();
  const isCasual =
    !trimmed || trimmed.toLowerCase() === GENERIC_EN || trimmed === t("preEnrollment.personalizeWizard.headerAnonymous");
  const wave = <AnimatedHeaderWave />;
  const headerTitle = isCasual ? (
    <Trans i18nKey="preEnrollment.personalizeWizard.headerGreetingCasual" components={{ wave }} />
  ) : (
    <Trans
      i18nKey="preEnrollment.personalizeWizard.headerGreeting"
      values={{ name: trimmed }}
      components={{ wave }}
    />
  );
  const headerSubtitle = t("preEnrollment.personalizeWizard.headerSubtitle");

  const POPULAR_RETIREMENT_AGE = 58;
  const applyPopularRetirementAge = useCallback(() => {
    setState((p) => ({ ...p, retirementAge: clampWizardRetirementAge(POPULAR_RETIREMENT_AGE) }));
  }, []);

  const canApplyPopularAge = state.retirementAge !== POPULAR_RETIREMENT_AGE;

  /* figma-dump footer: hide floating Core AI so it does not overlap the modal chrome */
  useEffect(() => {
    if (isOpen) {
      document.documentElement.setAttribute("data-v2-wizard-open", "true");
    } else {
      document.documentElement.removeAttribute("data-v2-wizard-open");
    }
    return () => document.documentElement.removeAttribute("data-v2-wizard-open");
  }, [isOpen]);

  const canProceedFromStep = useCallback(
    (s: number): boolean => {
      switch (s) {
        case 1:
          return (
            wizardCore.retirementAge >= WIZARD_RETIREMENT_AGE_MIN && wizardCore.retirementAge <= WIZARD_RETIREMENT_AGE_MAX
          );
        case 2: {
          const loc = wizardCore.retirementLocation;
          return loc != null && US_STATES.includes(loc);
        }
        case 3:
          return true;
        case 4:
          return (
            state.investmentComfort === "conservative" ||
            state.investmentComfort === "balanced" ||
            state.investmentComfort === "growth" ||
            state.investmentComfort === "aggressive"
          );
        default:
          return false;
      }
    },
    [wizardCore, state.investmentComfort],
  );

  /* Reset step + hydrate draft when the wizard opens (external isOpen signal). */
  useEffect(() => {
    if (!isOpen) return;
    /* Opening the overlay must sync step UI and optional draft; not derivable from render alone. */
    /* eslint-disable react-hooks/set-state-in-effect */
    setStep(1);
    setEditingAge(false);
    setShowExitConfirm(false);
    const draft = loadEnrollmentDraft();
    setState((prev) => {
      let next = { ...prev };
      if (draft) {
        next = {
          ...next,
          dateOfBirth: draft.dateOfBirth ?? (draft.currentAge != null ? getDOBFromAge(draft.currentAge) : prev.dateOfBirth),
          retirementAge: draft.retirementAge ?? prev.retirementAge,
          annualSalary: draft.annualSalary ?? prev.annualSalary,
          retirementLocation: draft.retirementLocation || prev.retirementLocation,
          savingsAmount: draft.otherSavings?.amount ?? prev.savingsAmount,
          investmentComfort: (draft.investmentComfort as V2InvestmentComfort) ?? prev.investmentComfort,
        };
      }
      return { ...next, retirementAge: clampWizardRetirementAge(next.retirementAge) };
    });
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [isOpen]);

  const update = useCallback(<K extends keyof WizardFormState>(key: K, value: WizardFormState[K]) => {
    setState((prev) => {
      if (key === "dateOfBirth") {
        const iso = value as string;
        return {
          ...prev,
          dateOfBirth: iso,
          retirementAge: clampWizardRetirementAge(prev.retirementAge),
        };
      }
      if (key === "retirementAge") {
        return { ...prev, retirementAge: clampWizardRetirementAge(value as number) };
      }
      return { ...prev, [key]: value };
    });
  }, []);

  const persistDraft = useCallback(() => {
    const existing = loadEnrollmentDraft();
    const yearsToRetire = clampWizardRetirementAge(state.retirementAge) - currentAge;
    const merged: EnrollmentDraft = {
      ...existing,
      currentAge,
      dateOfBirth: state.dateOfBirth,
      retirementAge: clampWizardRetirementAge(state.retirementAge),
      yearsToRetire,
      annualSalary: state.annualSalary,
      retirementLocation: state.retirementLocation,
      investmentComfort: state.investmentComfort,
      otherSavings: state.savingsAmount > 0 ? { type: "Other", amount: state.savingsAmount } : existing?.otherSavings,
    };
    saveEnrollmentDraft(merged);
  }, [state, currentAge]);

  const handleCloseAttempt = () => setShowExitConfirm(true);
  const handleConfirmExit = () => {
    persistDraft();
    setShowExitConfirm(false);
    onClose();
  };
  const handleSaveAndExit = () => {
    persistDraft();
    onClose();
  };
  const handleNext = () => {
    if (!canProceedFromStep(step)) return;
    if (step < TOTAL_STEPS) setStep(step + 1);
    else {
      persistDraft();
      onClose();
      navigate(withVersion(version, "/enrollment/choose-plan"));
    }
  };
  const handlePrevious = () => setStep(Math.max(1, step - 1));

  const isLastStep = step === TOTAL_STEPS;
  const isFirstStep = step === 1;
  const ctaLabel =
    step === 1
      ? t("preEnrollment.personalizeWizard.footerContinue")
      : isLastStep
        ? t("preEnrollment.personalizeWizard.footerStartEnrollment")
        : t("preEnrollment.personalizeWizard.footerNext");
  const nextDisabled = !canProceedFromStep(step);

  const stepLabels = [
    t("preEnrollment.personalizeWizard.stepAge"),
    t("preEnrollment.personalizeWizard.stepLocation"),
    t("preEnrollment.personalizeWizard.stepSavings"),
    t("preEnrollment.personalizeWizard.stepComfort"),
  ] as const;

  const stepper = <V2Stepper currentStep={step} labels={stepLabels} />;

  const footer = (
    <V2WizardFooter
      left={
        isFirstStep ? (
          <V2Button variant="ghost" type="button" onClick={handleSaveAndExit}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            {t("preEnrollment.personalizeWizard.footerSaveExit")}
          </V2Button>
        ) : (
          <V2Button variant="ghost" type="button" onClick={handlePrevious}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M15 18l-6-6 6-6" />
            </svg>
            {t("preEnrollment.personalizeWizard.footerBack")}
          </V2Button>
        )
      }
      right={
        <V2Button
          variant="primary"
          type="button"
          onClick={handleNext}
          disabled={nextDisabled}
          className="v2-btn--primary-cta-wizard"
        >
          {ctaLabel}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M9 18l6-6-6-6" />
          </svg>
        </V2Button>
      }
    />
  );

  return (
    <V2WizardShell
      isOpen={isOpen}
      onClose={handleCloseAttempt}
      title={headerTitle}
      subtitle={headerSubtitle}
      closeLabel={t("preEnrollment.personalizeWizard.headerCloseAria")}
      stepper={stepper}
      footer={footer}
      exitOverlay={
        <AnimatePresence>
          {showExitConfirm ? (
            <V2ExitConfirmation
              key="v2-exit"
              onConfirm={handleConfirmExit}
              onCancel={() => setShowExitConfirm(false)}
            />
          ) : null}
        </AnimatePresence>
      }
    >
      <div className="v2-wizard-step-host">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step-1"
              className="v2-wizard-step-motion"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={stepTransition}
            >
              <V2AgeStep
                dateOfBirth={state.dateOfBirth}
                currentAge={currentAge}
                retirementAge={state.retirementAge}
                editingAge={editingAge}
                onEdit={() => setEditingAge(true)}
                onDoneEditing={() => setEditingAge(false)}
                onDateOfBirthChange={(v) => update("dateOfBirth", v)}
                onRetirementAgeChange={(v) => update("retirementAge", v)}
                onApplySuggestedAge={applyPopularRetirementAge}
                canApplySuggestedAge={canApplyPopularAge}
              />
            </motion.div>
          )}
          {step === 2 && (
            <motion.div
              key="step-2"
              className="v2-wizard-step-motion"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={stepTransition}
            >
              <V2LocationStep value={state.retirementLocation} onChange={(v) => update("retirementLocation", v)} />
            </motion.div>
          )}
          {step === 3 && (
            <motion.div
              key="step-3"
              className="v2-wizard-step-motion"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={stepTransition}
            >
              <V2SavingsStep
                value={state.savingsAmount}
                yearsUntilRetirement={yearsUntilRetirement}
                onChange={(v) => update("savingsAmount", v)}
              />
            </motion.div>
          )}
          {step === 4 && (
            <motion.div
              key="step-4"
              className="v2-wizard-step-motion"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={stepTransition}
            >
              <V2ComfortStep value={state.investmentComfort} onChange={(v) => update("investmentComfort", v)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </V2WizardShell>
  );
};

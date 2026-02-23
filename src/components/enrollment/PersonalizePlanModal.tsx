import { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Modal } from "../ui/Modal";
import { cn } from "@/lib/utils";
import {
  loadEnrollmentDraft,
  saveEnrollmentDraft,
  type EnrollmentDraft,
} from "../../enrollment/enrollmentDraftStore";

const TOTAL_STEPS = 3;

/* ──────────────────────── Shared helpers ──────────────────────── */

interface WizardFormState {
  currentAge: number;
  retirementAge: number;
  annualSalary: number;
  retirementLocation: string;
  savingsAmount: number;
}

const DEFAULT_STATE: WizardFormState = {
  currentAge: 30,
  retirementAge: 65,
  annualSalary: 45000,
  retirementLocation: "",
  savingsAmount: 0,
};

const COUNTRIES = [
  "Dominica",
  "Eritrea",
  "Chad",
  "Fiji",
  "Belize",
  "Gabon",
  "Andorra",
  "Haiti",
  "Iceland",
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Phoenix, AZ",
  "Philadelphia, PA",
  "San Antonio, TX",
  "San Diego, CA",
  "Dallas, TX",
];

export interface PersonalizePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

function formatCurrency(value: number): string {
  if (value === 0) return "";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function parseCurrencyInput(value: string): number {
  const cleaned = value.replace(/[^0-9]/g, "");
  return parseInt(cleaned, 10) || 0;
}

/* Shared motion variants */
const stepVariants = {
  enter: { opacity: 0, x: 12 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -12 },
};
const stepTransition = { duration: 0.2 };

/* ──────────────────────── Progress Bar ────────────────────────── */

function ProgressBar({ step }: { step: number }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex gap-[5px] shrink-0">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => {
          const filled = i < step;
          return (
            <motion.div
              key={i}
              className="h-2.5 rounded-full"
              style={{ width: filled ? 66 : 43 }}
              initial={false}
              animate={{
                backgroundColor: filled ? "#5147ef" : "#e1e8f1",
                width: filled ? 66 : 43,
              }}
              transition={{ duration: 0.25 }}
            />
          );
        })}
      </div>
      <span className="text-sm font-semibold whitespace-nowrap text-blue-700 dark:text-blue-400">
        {t("preEnrollment.wizardStepOf", { current: step, total: TOTAL_STEPS })}
      </span>
    </div>
  );
}

/* ──────────────────── Step 1: Age + Retirement Age (combined) ──── */

function Step1Combined({
  currentAge,
  retirementAge,
  yearsToRetire,
  editingAge,
  onEdit,
  onDoneEditing,
  onCurrentAgeChange,
  onRetirementAgeChange,
}: {
  currentAge: number;
  retirementAge: number;
  yearsToRetire: number;
  editingAge: boolean;
  onEdit: () => void;
  onDoneEditing: () => void;
  onCurrentAgeChange: (v: number) => void;
  onRetirementAgeChange: (v: number) => void;
}) {
  const { t } = useTranslation();
  const max = 75;
  const min = Math.min(max, Math.max(22, currentAge + 1));
  const sliderValue = Math.min(max, Math.max(min, retirementAge));
  const isRangeLocked = min === max;

  return (
    <motion.div
      key="step1"
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={stepTransition}
      className="space-y-7"
    >
      {/* Age info card */}
      {editingAge ? (
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            {t("preEnrollment.wizardCurrentAgeLabel")}
          </label>
          <input
            type="number"
            min={18}
            max={75}
            value={currentAge}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              if (!isNaN(v)) onCurrentAgeChange(Math.min(75, Math.max(18, v)));
            }}
            className="h-12 max-w-[8rem] w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base font-semibold text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:border-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
          <button
            type="button"
            onClick={onDoneEditing}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {t("preEnrollment.wizardDone")}
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4 sm:p-[17px] dark:border-blue-800 dark:bg-blue-900/20">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-2 min-w-0">
              <p className="text-base sm:text-lg font-semibold">
                <span className="text-slate-800 dark:text-slate-200">
                  {t("preEnrollment.wizardAgeIntro")}{" "}
                </span>
                <span className="text-blue-700 dark:text-blue-400">
                  {t("preEnrollment.wizardAgeAndDob", { age: currentAge, dob: "04/16/1999" })}
                </span>
              </p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {t("preEnrollment.wizardUpdateHint")}
              </p>
            </div>
            <button
              type="button"
              onClick={onEdit}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              {t("preEnrollment.wizardEdit")}
            </button>
          </div>
        </div>
      )}

      {/* Retirement age question + slider */}
      <div>
        <h3 className="text-xl sm:text-2xl font-bold leading-7 text-slate-900 dark:text-slate-100">
          {t("preEnrollment.wizardRetireAgeQuestion")}
        </h3>
        <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
          {t("preEnrollment.wizardRetireAgeHint")}
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <input
          type="range"
          min={min}
          max={max}
          value={sliderValue}
          disabled={isRangeLocked}
          onChange={(e) => onRetirementAgeChange(parseInt(e.target.value, 10))}
          aria-label={t("preEnrollment.wizardRetireAgeAria")}
          className="personalize-plan-slider block min-w-0 flex-1"
        />
        <input
          type="number"
          min={min}
          max={max}
          value={sliderValue}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            if (!isNaN(v)) onRetirementAgeChange(Math.min(max, Math.max(min, v)));
          }}
          className="h-[42px] w-[166px] shrink-0 rounded-lg border border-blue-500 bg-white px-3 py-1.5 text-center text-sm font-medium text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:border-blue-500 dark:bg-slate-800 dark:text-blue-400"
        />
      </div>

      {/* Years-from-now banner — blue style matching Figma */}
      <motion.div
        key={yearsToRetire}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border border-blue-200 bg-blue-50/60 px-4 py-3 text-center text-sm font-semibold text-blue-800 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
      >
        {t("preEnrollment.wizardYearsFromNow", { years: yearsToRetire })}
      </motion.div>
    </motion.div>
  );
}

/* ──────────────────────── Step 3: Location ───────────────────── */

function Step3Location({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return COUNTRIES;
    const q = search.toLowerCase();
    return COUNTRIES.filter((c) => c.toLowerCase().includes(q));
  }, [search]);

  return (
    <motion.div
      key="step3"
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={stepTransition}
      className="flex flex-col gap-5"
    >
      <div>
        <h3 className="text-xl sm:text-2xl font-bold leading-7 text-slate-900 dark:text-slate-100">
          {t("preEnrollment.wizardWhereRetire")}
        </h3>
        <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
          {t("preEnrollment.wizardWhereRetireHint")}
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="shrink-0 text-slate-400"
            aria-hidden
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder={t("preEnrollment.wizardSearchLocation")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border-2 border-slate-200 bg-white py-3 pl-11 pr-11 text-sm font-medium text-slate-900 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
        />
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0 text-slate-400"
            aria-hidden
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </div>
      </div>

      {/* Location cards grid — scrollable to keep modal height consistent */}
      <div className="max-h-[240px] overflow-y-auto rounded-lg sm:max-h-[260px]">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5">
          {filtered.map((location) => {
            const selected = value === location;
            return (
              <button
                key={location}
                type="button"
                onClick={() => onChange(selected ? "" : location)}
                className={cn(
                  "flex items-center h-[56px] sm:h-[60px] px-3 rounded-lg border-2 text-left text-sm font-medium transition-all duration-150",
                  selected
                    ? "border-blue-500 bg-blue-50 text-blue-600 dark:border-blue-400 dark:bg-blue-500/10 dark:text-blue-400"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-500"
                )}
              >
                {location}
              </button>
            );
          })}
          {filtered.length === 0 && (
            <p className="col-span-full text-center text-sm text-slate-500 py-4 dark:text-slate-400">
              {t("preEnrollment.wizardNoLocationsFound")}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ──────────────────────── Step 4: Savings ────────────────────── */

function Step4Savings({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const { t } = useTranslation();
  const display = value > 0 ? formatCurrency(value) : "";

  return (
    <motion.div
      key="step4"
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={stepTransition}
      className="space-y-5"
    >
      <div>
        <h3 className="text-xl sm:text-2xl font-bold leading-7 text-slate-900 dark:text-slate-100">
          {t("preEnrollment.wizardSavingsQuestion")}
        </h3>
        <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
          {t("preEnrollment.wizardSavingsHint")}
        </p>
      </div>
      <div className="relative w-full">
        <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400 font-semibold text-lg">
          $
        </span>
        <input
          type="text"
          inputMode="numeric"
          value={display}
          onChange={(e) => onChange(parseCurrencyInput(e.target.value))}
          placeholder="0"
          className="h-14 w-full rounded-xl border-2 border-slate-200 bg-white pl-10 pr-4 py-3 text-lg font-semibold text-slate-900 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:border-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
        />
      </div>
    </motion.div>
  );
}

/* ──────────────────────── SVG Icons ──────────────────────────── */

function SaveIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/* ──────────────────────── Main Modal ─────────────────────────── */

export const PersonalizePlanModal = ({
  isOpen,
  onClose,
  userName = "there",
}: PersonalizePlanModalProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [state, setState] = useState<WizardFormState>(DEFAULT_STATE);
  const [editingAge, setEditingAge] = useState(false);

  useEffect(() => {
    setState((prev) => {
      const max = 75;
      const minRetirementAge = Math.min(
        max,
        Math.max(22, prev.currentAge + 1)
      );
      const normalizedRetirementAge = Math.min(
        max,
        Math.max(minRetirementAge, prev.retirementAge)
      );
      if (normalizedRetirementAge === prev.retirementAge) return prev;
      return { ...prev, retirementAge: normalizedRetirementAge };
    });
  }, [state.currentAge]);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setEditingAge(false);
      const draft = loadEnrollmentDraft();
      if (draft) {
        setState((prev) => ({
          ...prev,
          currentAge: draft.currentAge ?? prev.currentAge,
          retirementAge: draft.retirementAge ?? prev.retirementAge,
          annualSalary: draft.annualSalary ?? prev.annualSalary,
          retirementLocation:
            draft.retirementLocation || prev.retirementLocation,
          savingsAmount: draft.otherSavings?.amount ?? prev.savingsAmount,
        }));
      }
    }
  }, [isOpen]);

  const update = useCallback(
    <K extends keyof WizardFormState>(key: K, value: WizardFormState[K]) => {
      setState((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const persistDraft = useCallback(() => {
    const existing = loadEnrollmentDraft();
    const yearsToRetire = state.retirementAge - state.currentAge;
    const merged: EnrollmentDraft = {
      ...existing,
      currentAge: state.currentAge,
      retirementAge: state.retirementAge,
      yearsToRetire,
      annualSalary: state.annualSalary,
      retirementLocation: state.retirementLocation,
      otherSavings:
        state.savingsAmount > 0
          ? { type: "Other", amount: state.savingsAmount }
          : existing?.otherSavings,
    };
    saveEnrollmentDraft(merged);
  }, [state]);

  const handleSaveAndExit = () => {
    persistDraft();
    onClose();
  };

  const handleNext = () => {
    persistDraft();
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
    } else {
      onClose();
      navigate("/enrollment/choose-plan");
    }
  };

  const handlePrevious = () => {
    persistDraft();
    setStep((s) => Math.max(1, s - 1));
  };

  const isLastStep = step === TOTAL_STEPS;
  const isFirstStep = step === 1;

  return (
    <Modal isOpen={isOpen} onClose={onClose} dialogClassName="max-w-[42rem]" wizard>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-2xl bg-white dark:bg-slate-900"
      >
        {/* ─── Header ─── */}
        <div className="shrink-0 border-b border-slate-200 px-5 py-4 sm:px-6 dark:border-slate-700">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex flex-col gap-1">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 truncate dark:text-slate-100">
                {t("preEnrollment.wizardTitle", { name: userName })}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t("preEnrollment.wizardSubtitle")}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              aria-label={t("preEnrollment.wizardClose")}
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* ─── Content — flex-1 so it fills the wizard min-height ─── */}
        <div className="flex-1 min-h-0 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          {/* Progress bar */}
          <div className="mb-6">
            <ProgressBar step={step} />
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <Step1Combined
                key="step1"
                currentAge={state.currentAge}
                retirementAge={state.retirementAge}
                yearsToRetire={Math.max(0, state.retirementAge - state.currentAge)}
                editingAge={editingAge}
                onEdit={() => setEditingAge(true)}
                onDoneEditing={() => setEditingAge(false)}
                onCurrentAgeChange={(v) => update("currentAge", v)}
                onRetirementAgeChange={(v) => update("retirementAge", v)}
              />
            )}
            {step === 2 && (
              <Step3Location
                key="step2"
                value={state.retirementLocation}
                onChange={(v) => update("retirementLocation", v)}
              />
            )}
            {step === 3 && (
              <Step4Savings
                key="step3"
                value={state.savingsAmount}
                onChange={(v) => update("savingsAmount", v)}
              />
            )}
          </AnimatePresence>
        </div>

        {/* ─── Footer ─── */}
        <div className="shrink-0 border-t border-slate-200 bg-slate-50 px-5 py-3 sm:px-6 sm:py-4 dark:border-slate-700 dark:bg-slate-800/50">
          <div className="flex items-center justify-between gap-3">
            {/* Save & Exit */}
            <button
              type="button"
              onClick={handleSaveAndExit}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            >
              <SaveIcon />
              <span className="whitespace-nowrap">
                {t("preEnrollment.wizardSaveAndExit")}
              </span>
            </button>

            {/* Right side: Previous + Next */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={isFirstStep}
                className={cn(
                  "inline-flex items-center gap-1 rounded-lg border px-3 sm:px-5 py-2 text-sm font-medium transition-colors",
                  isFirstStep
                    ? "border-slate-200 bg-white text-slate-400 cursor-default dark:border-slate-700 dark:bg-slate-800 dark:text-slate-600"
                    : "border-slate-300 bg-white text-slate-500 hover:border-slate-400 hover:text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-slate-500 dark:hover:text-slate-300"
                )}
              >
                <ChevronLeftIcon />
                <span>{t("preEnrollment.wizardPrevious")}</span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-5 py-2 text-sm font-medium text-white transition-all hover:from-blue-700 hover:to-blue-800 whitespace-nowrap dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700"
              >
                {isLastStep ? t("preEnrollment.wizardFinish") : t("preEnrollment.wizardNextStep")}
                <ChevronRightIcon />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </Modal>
  );
};

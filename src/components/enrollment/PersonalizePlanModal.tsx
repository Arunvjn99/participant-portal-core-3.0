import { useState, useCallback, useEffect, useMemo, useReducer, useRef } from "react";
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
import {
  calculateCurrentAge,
  calculateYearsToRetire,
  calculateRetirementYear,
  clampRetirementAge,
  getRetirementAgeSliderMin,
  RETIREMENT_AGE_MAX,
} from "@/utils/personalizeCalculations";
import { getAgeInsight, getLocationInsight, getSavingsInsight } from "@/enrollment/logic/personalizeInsights";
import { US_STATES_DATA, filterStatesBySearch, findStateByName } from "@/data/usStates";

const TOTAL_STEPS = 3;
const DEFAULT_DOB = "1994-04-16";

function formatDOBDisplay(isoDate: string): string {
  const d = new Date(isoDate + "T12:00:00");
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
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
}

const DEFAULT_STATE: WizardFormState = {
  dateOfBirth: DEFAULT_DOB,
  retirementAge: 65,
  annualSalary: 45000,
  retirementLocation: "",
  savingsAmount: 0,
};

type WizardAction =
  | { type: "SET_STEP"; payload: number }
  | { type: "UPDATE_FORM"; payload: Partial<WizardFormState> }
  | { type: "SET_EDITING_AGE"; payload: boolean }
  | { type: "SET_EXIT_CONFIRM"; payload: boolean }
  | { type: "HYDRATE"; payload: Partial<WizardFormState> }
  | { type: "RESET"; payload?: Partial<WizardFormState> };

interface WizardState {
  step: number;
  form: WizardFormState;
  editingAge: boolean;
  showExitConfirm: boolean;
}

const initialWizardState: WizardState = {
  step: 1,
  form: DEFAULT_STATE,
  editingAge: false,
  showExitConfirm: false,
};

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: Math.max(1, Math.min(TOTAL_STEPS, action.payload)) };
    case "UPDATE_FORM":
      return { ...state, form: { ...state.form, ...action.payload } };
    case "SET_EDITING_AGE":
      return { ...state, editingAge: action.payload };
    case "SET_EXIT_CONFIRM":
      return { ...state, showExitConfirm: action.payload };
    case "HYDRATE":
      return { ...state, form: { ...state.form, ...action.payload } };
    case "RESET":
      return { ...initialWizardState, form: { ...DEFAULT_STATE, ...(action.payload ?? {}) } };
    default:
      return state;
  }
}

function isStepValid(stepNum: number, form: WizardFormState, currentAge: number): boolean {
  if (stepNum === 1) return form.retirementAge > currentAge;
  if (stepNum === 2) return form.retirementLocation.trim() !== "";
  if (stepNum === 3) return form.savingsAmount >= 0;
  return true;
}

export interface PersonalizePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

function formatCurrency(value: number): string {
  if (value === 0) return "";
  return new Intl.NumberFormat("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
}

function parseCurrencyInput(value: string): number {
  const cleaned = value.replace(/[^0-9]/g, "");
  return parseInt(cleaned, 10) || 0;
}

const stepTransition = { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] };

function CheckIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function StepIndicator({ currentStep, stepLabels, navStepAria }: { currentStep: number; stepLabels: string[]; navStepAria: (current: number, total: number, label: string) => string }) {
  return (
    <nav className="premium-wizard__nav" aria-label={navStepAria(currentStep, TOTAL_STEPS, stepLabels[currentStep - 1] ?? "")}>
      {Array.from({ length: TOTAL_STEPS }, (_, i) => {
        const stepNum = i + 1;
        const isCompleted = stepNum < currentStep;
        const isCurrent = stepNum === currentStep;
        const isUpcoming = stepNum > currentStep;
        const label = stepLabels[i] ?? "";
        return (
          <div
            key={i}
            className="premium-wizard__nav-item"
            {...(isCurrent ? { "aria-current": "step" as const } : {})}
            aria-label={navStepAria(stepNum, TOTAL_STEPS, label)}
          >
            <div className="premium-wizard__nav-step">
              <div className={cn("premium-wizard__step-dot", isCompleted && "premium-wizard__step-dot--completed", isCurrent && "premium-wizard__step-dot--current", isUpcoming && "premium-wizard__step-dot--upcoming")}>
                {isCompleted ? <CheckIcon size={20} /> : <span className="premium-wizard__step-num">{stepNum}</span>}
              </div>
              <span className={cn("premium-wizard__step-label", isCompleted && "premium-wizard__step-label--completed", isCurrent && "premium-wizard__step-label--current", isUpcoming && "premium-wizard__step-label--upcoming")}>{label}</span>
            </div>
            {i < TOTAL_STEPS - 1 && (
              <div className={cn("premium-wizard__nav-connector", isCompleted && "premium-wizard__nav-connector--completed")} aria-hidden />
            )}
          </div>
        );
      })}
    </nav>
  );
}

const EXIT_DIALOG_ID_TITLE = "personalize-exit-dialog-title";
const EXIT_DIALOG_ID_DESC = "personalize-exit-dialog-desc";

function ExitConfirmation({
  isOpen,
  onConfirm,
  onCancel,
  title,
  body,
  keepGoing,
  exitSetup,
  dialogRef,
}: {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  body: string;
  keepGoing: string;
  exitSetup: string;
  dialogRef: React.RefObject<HTMLDivElement | null>;
}) {
  const firstButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => firstButtonRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  return (
    <motion.div className="premium-wizard__exit-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
      <motion.div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={EXIT_DIALOG_ID_TITLE}
        aria-describedby={EXIT_DIALOG_ID_DESC}
        className="premium-wizard__exit-dialog"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
      >
        <div className="flex justify-center mb-4">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-warning)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
        </div>
        <h3 id={EXIT_DIALOG_ID_TITLE} className="text-lg font-bold text-[var(--color-text)] text-center mb-1">{title}</h3>
        <p id={EXIT_DIALOG_ID_DESC} className="text-sm text-[var(--color-text-secondary)] text-center mb-6">{body}</p>
        <div className="flex gap-3">
          <button ref={firstButtonRef} type="button" onClick={onCancel} className="premium-wizard__exit-btn premium-wizard__exit-btn--cancel">{keepGoing}</button>
          <button type="button" onClick={onConfirm} className="premium-wizard__exit-btn premium-wizard__exit-btn--confirm">{exitSetup}</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Step1RetirementAge({
  dateOfBirth,
  currentAge,
  retirementAge,
  editingAge,
  onEdit,
  onDoneEditing,
  onDateOfBirthChange,
  onRetirementAgeChange,
}: {
  dateOfBirth: string;
  currentAge: number;
  retirementAge: number;
  editingAge: boolean;
  onEdit: () => void;
  onDoneEditing: () => void;
  onDateOfBirthChange: (isoDate: string) => void;
  onRetirementAgeChange: (v: number) => void;
}) {
  const { t } = useTranslation();
  const min = getRetirementAgeSliderMin(currentAge);
  const max = RETIREMENT_AGE_MAX;
  const sliderValue = clampRetirementAge(retirementAge, currentAge);
  const isRangeLocked = min >= max;
  const yearsToRetire = calculateYearsToRetire(currentAge, sliderValue);
  const retirementYear = calculateRetirementYear(currentAge, sliderValue);
  const sliderPercent = max > min ? ((sliderValue - min) / (max - min)) * 100 : 0;
  const isInvalid = retirementAge <= currentAge;
  const ageInsight = useMemo(() => getAgeInsight(currentAge, sliderValue), [currentAge, sliderValue]);

  const handleSliderChange = useCallback(
    (raw: number) => {
      const clamped = clampRetirementAge(raw, currentAge);
      if (typeof requestAnimationFrame !== "undefined") {
        requestAnimationFrame(() => onRetirementAgeChange(clamped));
      } else {
        onRetirementAgeChange(clamped);
      }
    },
    [currentAge, onRetirementAgeChange],
  );

  return (
    <main className="premium-wizard__main">
      <AnimatePresence mode="wait">
        {editingAge ? (
          <motion.div key="editing" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} className="premium-wizard__info-card premium-wizard__info-card--editing">
            <label htmlFor="wizard-dob-input" className="premium-wizard__dob-label">{t("enrollment.personalizePlan.step1DobLabel")}</label>
            <div className="relative">
              <input id="wizard-dob-input" type="date" value={dateOfBirth} onChange={(e) => onDateOfBirthChange(e.target.value)} onBlur={onDoneEditing} max={new Date().toISOString().slice(0, 10)} className="premium-wizard__dob-input" aria-describedby="wizard-dob-helper" />
              <span className="premium-wizard__dob-icon" aria-hidden><CalendarIcon /></span>
            </div>
            <p id="wizard-dob-helper" className="premium-wizard__dob-helper">{t("enrollment.personalizePlan.step1DobHelper")}</p>
          </motion.div>
        ) : (
          <motion.div key="display" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="premium-wizard__age-card">
            <div className="premium-wizard__age-card-bg-icon" aria-hidden><CalendarIcon /></div>
            <div className="premium-wizard__age-card-inner">
              <div className="premium-wizard__age-avatar" aria-hidden />
              <div className="premium-wizard__age-card-content">
                <p className="premium-wizard__age-card-title">{t("enrollment.personalizePlan.step1AgeCard", { age: currentAge })}</p>
                <div className="premium-wizard__age-card-meta">
                  <span>{t("enrollment.personalizePlan.step1BornOn", { date: formatDOBDisplay(dateOfBirth) })}</span>
                  <button type="button" onClick={onEdit} className="premium-wizard__edit-link">{t("enrollment.personalizePlan.step1Edit")}</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <h2 className="premium-wizard__question premium-wizard__question--center">{t("enrollment.personalizePlan.step1Question")}</h2>

      {isInvalid && (
        <p className="premium-wizard__validation-message" role="alert" id="step1-retirement-age-error">
          {t("enrollment.personalizePlan.validationRetirementAge")}
        </p>
      )}

      <div className="premium-wizard__retirement-stepper">
        <button type="button" disabled={isRangeLocked || sliderValue <= min} onClick={() => handleSliderChange(sliderValue - 1)} className="premium-wizard__stepper-btn" aria-label={t("enrollment.personalizePlan.step1DecreaseAria")}><MinusIcon /></button>
        <div className="premium-wizard__stepper-value-block">
          <p className="premium-wizard__stepper-label">{t("enrollment.personalizePlan.step1PlanToRetire")}</p>
          <motion.p key={sliderValue} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="premium-wizard__stepper-big-value">{sliderValue}</motion.p>
        </div>
        <button type="button" disabled={isRangeLocked || sliderValue >= max} onClick={() => handleSliderChange(sliderValue + 1)} className="premium-wizard__stepper-btn" aria-label={t("enrollment.personalizePlan.step1IncreaseAria")}><PlusIcon /></button>
      </div>

      <div className="premium-wizard__slider-wrap">
        <div className="premium-wizard__slider-container">
          <input
            type="range"
            min={min}
            max={max}
            value={sliderValue}
            disabled={isRangeLocked}
            onChange={(e) => handleSliderChange(parseInt(e.target.value, 10))}
            className="premium-wizard__slider premium-wizard__slider--gradient"
            style={{ "--slider-percent": `${sliderPercent}%` } as React.CSSProperties}
            aria-label={t("enrollment.personalizePlan.step1RetirementAgeAria")}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={sliderValue}
            aria-invalid={isInvalid}
            aria-describedby={isInvalid ? "step1-retirement-age-error" : undefined}
          />
        </div>
        <div className="premium-wizard__slider-labels">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>

      <div className={cn("premium-wizard__popular-card", ageInsight.tone === "warning" && "premium-wizard__popular-card--tone-warning", ageInsight.tone === "positive" && "premium-wizard__popular-card--tone-positive")}>
        <div className="premium-wizard__popular-icon"><SparklesIcon /></div>
        <div className="premium-wizard__popular-content">
          <h3 className="premium-wizard__popular-title">{t(ageInsight.titleKey)}</h3>
          <p className="premium-wizard__popular-sub">{t(ageInsight.messageKey)}</p>
        </div>
      </div>

      <div className="premium-wizard__summary-card">
        <p className="premium-wizard__summary-line1">
          {t("enrollment.personalizePlan.step1SummaryYears", { age: sliderValue, years: yearsToRetire })}
        </p>
        <p className="premium-wizard__summary-line2">
          {t("enrollment.personalizePlan.step1SummaryYear", { year: retirementYear })}
        </p>
        <div className="flex w-full items-start gap-0 pt-8">
          {/* Left point – dot centered above label */}
          <div className="flex flex-shrink-0 flex-col items-center">
            <div className="flex h-[10px] w-full items-center justify-center">
              <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[var(--color-primary)]" aria-hidden />
            </div>
            <span className="mt-1 text-xs font-medium text-[var(--color-text-secondary)]">{t("enrollment.personalizePlan.step1TimelineNow")}</span>
            <span className="text-xs text-[var(--color-text-tertiary)]">{new Date().getFullYear()}</span>
          </div>
          {/* Timeline – gradient line with Years badge above */}
          <div className="relative flex-1 min-w-0 px-4">
            <div className="flex h-[10px] items-center">
              <div className="h-[3px] w-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500" aria-hidden />
            </div>
            <span className="absolute left-1/2 top-0 -translate-x-1/2 -top-6 whitespace-nowrap rounded bg-[var(--color-primary)]/10 px-2 py-0.5 text-xs font-medium text-[var(--color-primary)]">
              {yearsToRetire} {t("enrollment.personalizePlan.step1TimelineYears")}
            </span>
          </div>
          {/* Right point – dot centered above label */}
          <div className="flex flex-shrink-0 flex-col items-center">
            <div className="flex h-[10px] w-full items-center justify-center">
              <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-purple-500" aria-hidden />
            </div>
            <span className="mt-1 text-xs font-medium text-[var(--color-text-secondary)]">{t("enrollment.personalizePlan.step1TimelineRetire")}</span>
            <span className="text-xs text-[var(--color-text-tertiary)]">{retirementYear}</span>
          </div>
        </div>
      </div>
    </main>
  );
}

function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
  );
}

function MinusIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>;
}

function PlusIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
}

function SparklesIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <path d="M5 21l2-6 2 6M19 21l-2-6-2 6M2 12h4M18 12h4M4 18h2M18 18h2" />
    </svg>
  );
}

function SaveIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>;
}

function ChevronRightIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>;
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function Step2Location({ value, onChange, validationMessage }: { value: string; onChange: (v: string) => void; validationMessage?: string }) {
  const { t } = useTranslation();
  const [search, setSearch] = useState(value || "");
  useEffect(() => {
    setSearch(value || "");
  }, [value]);
  const displayValue = search;
  const filteredStates = useMemo(() => filterStatesBySearch(search), [search]);
  const selectedState = useMemo(() => (value ? findStateByName(value) : null), [value]);
  const locationInsight = useMemo(() => getLocationInsight(selectedState), [selectedState]);

  const handleSelect = useCallback(
    (stateName: string) => {
      const next = value === stateName ? "" : stateName;
      onChange(next);
      setSearch(next);
    },
    [value, onChange],
  );

  const handleInputChange = useCallback(
    (v: string) => {
      setSearch(v);
      const match = findStateByName(v);
      onChange(match ? match.name : v.trim() === "" ? "" : value);
    },
    [value, onChange],
  );

  const handleBlur = useCallback(() => {
    const trimmed = search.trim();
    if (trimmed === "") {
      onChange("");
      setSearch("");
      return;
    }
    const match = findStateByName(trimmed);
    if (match) {
      onChange(match.name);
      setSearch(match.name);
    } else {
      setSearch(value || "");
    }
  }, [search, value, onChange]);

  return (
    <main className="premium-wizard__main premium-wizard__main--location">
      <div className="premium-wizard__location-header">
        <h2 className="premium-wizard__location-title">{t("enrollment.personalizePlan.step2Title")}</h2>
        <p className="premium-wizard__location-sub">{t("enrollment.personalizePlan.step2Sub")}</p>
      </div>

      <div className="premium-wizard__location-search-wrap">
        <span className="premium-wizard__location-search-icon" aria-hidden><SearchIcon /></span>
        <input
          type="text"
          className="premium-wizard__location-search-input"
          placeholder={t("enrollment.personalizePlan.step2SearchPlaceholder")}
          value={displayValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onBlur={handleBlur}
          aria-label={t("enrollment.personalizePlan.step2SearchAria")}
          aria-invalid={!!validationMessage}
          aria-describedby={validationMessage ? "step2-location-error" : undefined}
        />
      </div>
      {validationMessage && (
        <p id="step2-location-error" className="premium-wizard__validation-message" role="alert">
          {validationMessage}
        </p>
      )}

      <div className="premium-wizard__location-popular">
        <div className="premium-wizard__location-popular-head">
          <span className="premium-wizard__location-sparkles" aria-hidden><SparklesIcon /></span>
          <h3 className="premium-wizard__location-popular-title">{t("enrollment.personalizePlan.step2PopularHeading")}</h3>
        </div>
        <div className="premium-wizard__location-grid premium-wizard__location-grid--scroll">
          {filteredStates.slice(0, 12).map((state) => {
            const selected = value === state.name;
            const costLabel = state.costIndex === "low" ? "Low" : state.costIndex === "high" ? "High" : "Medium";
            return (
              <button
                key={state.abbreviation}
                type="button"
                onClick={() => handleSelect(state.name)}
                className={cn("premium-wizard__location-card", selected && "premium-wizard__location-card--selected")}
                aria-pressed={selected}
              >
                <div className="premium-wizard__location-card-content">
                  <div className="premium-wizard__location-card-row">
                    <span className="premium-wizard__location-card-name">{state.name}</span>
                    <span className={cn("premium-wizard__location-card-badge", state.costIndex === "medium" && "premium-wizard__location-card-badge--medium", state.costIndex === "high" && "premium-wizard__location-card-badge--high")}>{costLabel} cost</span>
                  </div>
                  <p className="premium-wizard__location-card-desc">{state.abbreviation}</p>
                </div>
                {selected && (
                  <span className="premium-wizard__location-card-check" aria-hidden>
                    <CheckIcon size={20} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {filteredStates.length > 12 && (
          <p className="premium-wizard__location-hint">{t("enrollment.personalizePlan.step2MatchCount", { count: filteredStates.length })}</p>
        )}
      </div>

      {locationInsight && (
        <div className={cn("premium-wizard__smart-choice", locationInsight.tone === "warning" && "premium-wizard__smart-choice--tone-warning")}>
          <div className="premium-wizard__smart-choice-icon"><SparklesIcon /></div>
          <div className="premium-wizard__smart-choice-content">
            <h3 className="premium-wizard__smart-choice-title">{t(locationInsight.titleKey)}</h3>
            <p className="premium-wizard__smart-choice-text">{t(locationInsight.messageKey)}</p>
          </div>
        </div>
      )}
    </main>
  );
}

const SAVINGS_DEBOUNCE_MS = 300;

function Step3Savings({
  value,
  onChange,
  yearsToRetire,
  currentAge,
  retirementAge,
}: {
  value: number;
  onChange: (v: number) => void;
  yearsToRetire: number;
  currentAge: number;
  retirementAge: number;
}) {
  const { t } = useTranslation();
  const [localValue, setLocalValue] = useState(value);
  const debouncedCommit = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const safeDisplay = Math.max(0, localValue);
  const display = safeDisplay > 0 ? formatCurrency(safeDisplay) : "";
  const savingsForInsight = Math.max(0, localValue);
  const savingsInsight = useMemo(
    () => getSavingsInsight({ age: currentAge, retirementAge, savings: savingsForInsight }),
    [currentAge, retirementAge, savingsForInsight],
  );

  const handleChange = useCallback(
    (raw: string) => {
      const parsed = Math.max(0, parseCurrencyInput(raw));
      setLocalValue(parsed);
      if (debouncedCommit.current) clearTimeout(debouncedCommit.current);
      debouncedCommit.current = setTimeout(() => {
        onChange(parsed);
        debouncedCommit.current = null;
      }, SAVINGS_DEBOUNCE_MS);
    },
    [onChange],
  );

  useEffect(() => () => { if (debouncedCommit.current) clearTimeout(debouncedCommit.current); }, []);

  return (
    <main className="premium-wizard__main premium-wizard__main--savings">
      <div className="premium-wizard__savings-header">
        <h2 className="premium-wizard__savings-title">{t("enrollment.personalizePlan.step3Title")}</h2>
        <p className="premium-wizard__savings-sub">{t("enrollment.personalizePlan.step3Sub")}</p>
      </div>

      <div className="premium-wizard__savings-input-block">
        <label htmlFor="savings-input" className="premium-wizard__savings-label">{t("enrollment.personalizePlan.step3Label")}</label>
        <div className="premium-wizard__savings-input-wrap">
          <span className="premium-wizard__savings-currency-prefix" aria-hidden>$</span>
          <input
            id="savings-input"
            type="text"
            inputMode="numeric"
            value={display}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={t("enrollment.personalizePlan.step3Placeholder")}
            className="premium-wizard__savings-input"
            aria-describedby="savings-helper"
          />
        </div>
        <p id="savings-helper" className="premium-wizard__savings-helper">{t("enrollment.personalizePlan.step3Helper")}</p>
      </div>

      <div className={cn("premium-wizard__great-start premium-wizard__smart-choice", savingsInsight.tone === "warning" && "premium-wizard__smart-choice--tone-warning")}>
        <div className="premium-wizard__smart-choice-icon"><SparklesIcon /></div>
        <div className="premium-wizard__smart-choice-content">
          <h3 className="premium-wizard__smart-choice-title">{t(savingsInsight.titleKey)}</h3>
          <p className="premium-wizard__smart-choice-text">{t(savingsInsight.messageKey)}</p>
        </div>
      </div>
    </main>
  );
}

export const PersonalizePlanModal = ({ isOpen, onClose, userName = "there" }: PersonalizePlanModalProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [wizardState, dispatch] = useReducer(wizardReducer, initialWizardState);
  const exitDialogRef = useRef<HTMLDivElement>(null);
  const { step, form: state, editingAge, showExitConfirm } = wizardState;

  const currentAge = useMemo(() => calculateCurrentAge(state.dateOfBirth), [state.dateOfBirth]);

  useEffect(() => {
    dispatch({ type: "UPDATE_FORM", payload: { retirementAge: clampRetirementAge(state.retirementAge, currentAge) } });
  }, [currentAge]);

  useEffect(() => {
    if (isOpen) {
      const draft = loadEnrollmentDraft();
      if (draft) {
        dispatch({
          type: "RESET",
          payload: {
            dateOfBirth: draft.dateOfBirth ?? (draft.currentAge != null ? getDOBFromAge(draft.currentAge) : DEFAULT_STATE.dateOfBirth),
            retirementAge: draft.retirementAge ?? DEFAULT_STATE.retirementAge,
            annualSalary: draft.annualSalary ?? DEFAULT_STATE.annualSalary,
            retirementLocation: draft.retirementLocation || DEFAULT_STATE.retirementLocation,
            savingsAmount: draft.otherSavings?.amount ?? DEFAULT_STATE.savingsAmount,
          },
        });
      } else {
        dispatch({ type: "RESET" });
      }
    }
  }, [isOpen]);

  const update = useCallback(<K extends keyof WizardFormState>(key: K, value: WizardFormState[K]) => {
    dispatch({ type: "UPDATE_FORM", payload: { [key]: value } });
  }, []);

  const persistDraft = useCallback(() => {
    const existing = loadEnrollmentDraft();
    const yearsToRetire = state.retirementAge - currentAge;
    const merged: EnrollmentDraft = {
      ...existing,
      currentAge,
      dateOfBirth: state.dateOfBirth,
      retirementAge: state.retirementAge,
      yearsToRetire,
      annualSalary: state.annualSalary,
      retirementLocation: state.retirementLocation,
      otherSavings: Math.max(0, state.savingsAmount) > 0 ? { type: "Other", amount: Math.max(0, state.savingsAmount) } : existing?.otherSavings,
    };
    saveEnrollmentDraft(merged);
  }, [state, currentAge]);

  const handleCloseAttempt = () => dispatch({ type: "SET_EXIT_CONFIRM", payload: true });
  const handleConfirmExit = () => {
    persistDraft();
    dispatch({ type: "SET_EXIT_CONFIRM", payload: false });
    onClose();
  };
  const handleSaveAndExit = () => {
    persistDraft();
    onClose();
  };
  const handleNext = () => {
    if (step < TOTAL_STEPS) dispatch({ type: "SET_STEP", payload: step + 1 });
    else {
      persistDraft();
      onClose();
      navigate("/enrollment/choose-plan");
    }
  };
  const handlePrevious = () => dispatch({ type: "SET_STEP", payload: step - 1 });

  const isLastStep = step === TOTAL_STEPS;
  const isFirstStep = step === 1;
  const stepValid = isStepValid(step, state, currentAge);
  const stepLabels = useMemo(() => [
    t("enrollment.personalizePlan.stepAge"),
    t("enrollment.personalizePlan.stepLocation"),
    t("enrollment.personalizePlan.stepSavings"),
  ], [t]);
  const ctaLabel = step === 1 ? t("enrollment.personalizePlan.continue") : isLastStep ? t("enrollment.personalizePlan.viewMyPlan") : t("enrollment.personalizePlan.continue");
  const displayName = userName && userName !== "there" ? userName : "there";
  const step2ValidationMessage = step === 2 && !stepValid ? t("enrollment.personalizePlan.step2ValidationLocation") : undefined;

  return (
    <Modal isOpen={isOpen} onClose={handleCloseAttempt} closeOnOverlayClick={false} dialogClassName="premium-wizard__dialog premium-wizard__dialog--responsive" wizard>
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.3 }} className="premium-wizard premium-wizard--figma">
        <header className="premium-wizard__header-figma">
          <div className="premium-wizard__header-figma-bg" aria-hidden />
          <div className="premium-wizard__header-figma-icons" aria-hidden>
            <SparklesIcon />
          </div>
          <div className="premium-wizard__header-figma-content">
            <h1 className="premium-wizard__header-figma-title">{t("enrollment.personalizePlan.title", { name: displayName })}</h1>
            <p className="premium-wizard__header-figma-sub">{t("enrollment.personalizePlan.subtitle")}</p>
          </div>
          <button type="button" onClick={handleCloseAttempt} className="premium-wizard__close-btn premium-wizard__close-btn--on-header" aria-label={t("enrollment.personalizePlan.closeAria")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </header>
        <div className="premium-wizard__nav-wrap">
          <StepIndicator currentStep={step} stepLabels={stepLabels} navStepAria={(current, total, label) => t("enrollment.personalizePlan.navStepAria", { current, total, label })} />
        </div>
        <div className="premium-wizard__body">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step-1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={stepTransition}>
                <Step1RetirementAge dateOfBirth={state.dateOfBirth} currentAge={currentAge} retirementAge={state.retirementAge} editingAge={editingAge} onEdit={() => dispatch({ type: "SET_EDITING_AGE", payload: true })} onDoneEditing={() => dispatch({ type: "SET_EDITING_AGE", payload: false })} onDateOfBirthChange={(v) => update("dateOfBirth", v)} onRetirementAgeChange={(v) => update("retirementAge", v)} />
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="step-2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={stepTransition}>
                <Step2Location value={state.retirementLocation} onChange={(v) => update("retirementLocation", v)} validationMessage={step2ValidationMessage} />
              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="step-3" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={stepTransition}>
                <Step3Savings value={state.savingsAmount} onChange={(v) => update("savingsAmount", v)} yearsToRetire={Math.max(0, state.retirementAge - currentAge)} currentAge={currentAge} retirementAge={state.retirementAge} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <footer className="premium-wizard__footer premium-wizard__footer--figma">
          <button type="button" onClick={handleSaveAndExit} className="premium-wizard__ghost-btn premium-wizard__ghost-btn--figma" aria-label={t("enrollment.personalizePlan.saveAndExit")}>
            <SaveIcon />
            {t("enrollment.personalizePlan.saveAndExit")}
          </button>
          <div className="premium-wizard__footer-actions">
            {!isFirstStep && (
              <motion.button type="button" onClick={handlePrevious} className="premium-wizard__back-btn" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }} aria-label={t("enrollment.personalizePlan.backAria")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M15 18l-6-6 6-6" /></svg>
                {t("enrollment.personalizePlan.back")}
              </motion.button>
            )}
            <motion.button type="button" onClick={handleNext} disabled={!stepValid} className="premium-wizard__cta premium-wizard__cta--figma" whileHover={stepValid ? { y: -1 } : {}} whileTap={stepValid ? { scale: 0.98 } : {}} aria-disabled={!stepValid}>
              {ctaLabel}
              <ChevronRightIcon />
            </motion.button>
          </div>
        </footer>
        {showExitConfirm && (
          <ExitConfirmation
            isOpen={showExitConfirm}
            onConfirm={handleConfirmExit}
            onCancel={() => dispatch({ type: "SET_EXIT_CONFIRM", payload: false })}
            title={t("enrollment.personalizePlan.exitConfirmTitle")}
            body={t("enrollment.personalizePlan.exitConfirmBody")}
            keepGoing={t("enrollment.personalizePlan.exitKeepGoing")}
            exitSetup={t("enrollment.personalizePlan.exitConfirm")}
            dialogRef={exitDialogRef}
          />
        )}
      </motion.div>
    </Modal>
  );
};

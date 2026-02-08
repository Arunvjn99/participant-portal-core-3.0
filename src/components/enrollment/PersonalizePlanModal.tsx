import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "../ui/Modal";
import { Dropdown, type DropdownOption } from "../ui/Dropdown";
import {
  saveEnrollmentDraft,
  type EnrollmentDraft,
} from "../../enrollment/enrollmentDraftStore";

interface WizardFormState {
  currentAge: number;
  retirementAge: number;
  annualSalary: number;
  retirementLocation: string;
  savingsType: string;
  savingsAmount: number;
}

const DEFAULT_STATE: WizardFormState = {
  currentAge: 30,
  retirementAge: 65,
  annualSalary: 45000,
  retirementLocation: "New York",
  savingsType: "",
  savingsAmount: 0,
};

const RETIREMENT_LOCATIONS: DropdownOption[] = [
  { label: "New York", value: "New York" },
  { label: "California", value: "California" },
  { label: "Texas", value: "Texas" },
  { label: "Florida", value: "Florida" },
  { label: "Washington", value: "Washington" },
  { label: "Other", value: "Other" },
];

const SAVINGS_TYPES: DropdownOption[] = [
  { label: "IRA", value: "IRA" },
  { label: "Mutual Funds", value: "Mutual Funds" },
  { label: "Real Estate", value: "Real Estate" },
  { label: "Savings Account", value: "Savings Account" },
  { label: "401(k) Other", value: "401k Other" },
];

interface PersonalizePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function formatCurrency(value: number): string {
  if (value === 0) return "0";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function parseCurrencyInput(value: string): number {
  const cleaned = value.replace(/[^0-9]/g, "");
  return parseInt(cleaned, 10) || 0;
}

function buildDraft(state: WizardFormState): EnrollmentDraft {
  const yearsToRetire = state.retirementAge - state.currentAge;
  const otherSavings =
    state.savingsType && state.savingsAmount > 0
      ? { type: state.savingsType, amount: state.savingsAmount }
      : undefined;

  return {
    currentAge: state.currentAge,
    retirementAge: state.retirementAge,
    yearsToRetire,
    annualSalary: state.annualSalary,
    retirementLocation: state.retirementLocation,
    otherSavings: otherSavings
      ? { type: otherSavings.type, amount: otherSavings.amount }
      : undefined,
  };
}

function validateWizard(state: WizardFormState): boolean {
  const retirementAgeValid = state.retirementAge > state.currentAge && state.retirementAge <= 75;
  const annualSalaryValid = state.annualSalary > 0;

  const otherSavingsFilled = Boolean(state.savingsType && state.savingsAmount > 0);
  const otherSavingsEmpty = !state.savingsType && state.savingsAmount === 0;
  const otherSavingsValid = otherSavingsFilled || otherSavingsEmpty;

  return retirementAgeValid && annualSalaryValid && otherSavingsValid;
}

export const PersonalizePlanModal = ({ isOpen, onClose }: PersonalizePlanModalProps) => {
  const navigate = useNavigate();
  const [state, setState] = useState<WizardFormState>(DEFAULT_STATE);

  const updateState = useCallback(<K extends keyof WizardFormState>(
    key: K,
    value: WizardFormState[K]
  ) => {
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSaveAndExit = () => {
    const draft = buildDraft(state);
    saveEnrollmentDraft(draft);
    onClose();
  };

  const handleNext = () => {
    if (!validateWizard(state)) return;
    const draft = buildDraft(state);
    saveEnrollmentDraft(draft);
    onClose();
    navigate("/enrollment/plans");
  };

  const isFormValid = validateWizard(state);
  const yearsToRetire = state.retirementAge - state.currentAge;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex max-h-[90vh] flex-col bg-white dark:bg-slate-800">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Personalize Your Plan
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:bg-slate-700 dark:hover:text-slate-300"
            aria-label="Close"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-2.72 2.72a.75.75 0 101.06 1.06L10 11.06l2.72 2.72a.75.75 0 101.06-1.06L11.06 10l2.72-2.72a.75.75 0 00-1.06-1.06L10 8.94 7.28 6.22z" />
            </svg>
          </button>
        </div>

        {/* Summary strip */}
        <div className="shrink-0 bg-sky-50 px-6 py-4 dark:bg-sky-950/40">
          <div className="flex flex-wrap gap-6">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Your Age to Retire:{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {state.retirementAge} years
              </span>
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Years to Retire:{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {yearsToRetire > 0 ? yearsToRetire : "-"} years
              </span>
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Your Annual Salary:{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                ${formatCurrency(state.annualSalary)}
              </span>
            </p>
          </div>
        </div>

        {/* Form content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-8">
            {/* Section 0: Current Age */}
            <div>
              <label className="block text-base font-semibold text-slate-900 dark:text-slate-100">
                Current age
              </label>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Your age today for retirement projections.
              </p>
              <input
                type="number"
                min={18}
                max={100}
                value={state.currentAge}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  if (!isNaN(v)) updateState("currentAge", Math.min(100, Math.max(18, v)));
                }}
                className="mt-4 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Section 1: Retirement Age */}
            <div>
              <label className="block text-base font-semibold text-slate-900 dark:text-slate-100">
                What age would you like to retire?
              </label>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                This helps us calculate how many years you have until retirement.
              </p>
              {state.retirementAge <= state.currentAge && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  Retirement age must be greater than current age.
                </p>
              )}
              {state.retirementAge > 75 && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  Retirement age must be 75 or less.
                </p>
              )}
              <div className="mt-4 flex items-center gap-4">
                <input
                  type="range"
                  min={Math.max(50, state.currentAge + 1)}
                  max={75}
                  value={Math.min(75, Math.max(state.currentAge + 1, state.retirementAge))}
                  onChange={(e) => updateState("retirementAge", parseInt(e.target.value, 10))}
                  style={{
                    background: `linear-gradient(to right, rgb(59 130 246) 0%, rgb(59 130 246) ${((state.retirementAge - 50) / 25) * 100}%, rgb(100 116 139) ${((state.retirementAge - 50) / 25) * 100}%, rgb(100 116 139) 100%)`,
                  }}
                  className="h-2 flex-1 cursor-pointer appearance-none rounded-full [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:border-0"
                />
                <input
                  type="number"
                  min={state.currentAge + 1}
                  max={75}
                  value={state.retirementAge}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    if (!isNaN(v))
                      updateState(
                        "retirementAge",
                        Math.min(75, Math.max(state.currentAge + 1, v))
                      );
                  }}
                  className="h-10 w-16 rounded-lg border border-slate-200 bg-white px-3 text-center text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Section 2: Annual Salary */}
            <div>
              <label className="block text-base font-semibold text-slate-900 dark:text-slate-100">
                Annual Salary
              </label>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Your gross annual income for retirement projections.
              </p>
              <input
                type="text"
                inputMode="numeric"
                value={state.annualSalary ? formatCurrency(state.annualSalary) : ""}
                onChange={(e) => updateState("annualSalary", parseCurrencyInput(e.target.value))}
                placeholder="0"
                className="mt-4 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Section 3: Retirement Location */}
            <div>
              <label className="block text-base font-semibold text-slate-900 dark:text-slate-100">
                Where would you like to retire?
              </label>
              <div className="mt-4">
                <Dropdown
                  label=""
                  placeholder="Select location"
                  value={state.retirementLocation}
                  options={RETIREMENT_LOCATIONS}
                  onChange={(v) => updateState("retirementLocation", v)}
                  size="compact"
                />
              </div>
            </div>

            {/* Section 4: Other Savings */}
            <div>
              <label className="block text-base font-semibold text-slate-900 dark:text-slate-100">
                Other savings
              </label>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Provide both type and amount, or leave both empty.
              </p>
              {(state.savingsType && !state.savingsAmount) ||
              (!state.savingsType && state.savingsAmount > 0) ? (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  Please provide both savings type and amount, or leave both empty.
                </p>
              ) : null}
              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:gap-4">
                <div className="flex-1">
                  <Dropdown
                    label=""
                    placeholder="Savings Type"
                    value={state.savingsType}
                    options={SAVINGS_TYPES}
                    onChange={(v) => updateState("savingsType", v)}
                    size="compact"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={state.savingsAmount ? formatCurrency(state.savingsAmount) : ""}
                    onChange={(e) =>
                      updateState("savingsAmount", parseCurrencyInput(e.target.value))
                    }
                    placeholder="Amount"
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - sticky */}
        <div className="shrink-0 border-t border-slate-200 px-6 py-4 dark:border-slate-700">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleSaveAndExit}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Save & Exit
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={!isFormValid}
              className="rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

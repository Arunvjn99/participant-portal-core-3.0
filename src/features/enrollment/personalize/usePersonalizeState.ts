import { useState, useCallback } from "react";

export interface PersonalizeState {
  currentStep: 1 | 2 | 3;
  dateOfBirth: string;
  retirementAge: number;
  country: string;
  state: string;
  salaryRange: string;
  savingsEstimate: string;
  /** Step 3: currency input value (e.g. "50000" or "") */
  savingsAmount: string;
}

const DEFAULT_DOB = "1994-04-16";
const RETIREMENT_AGE_MIN = 50;
const RETIREMENT_AGE_MAX = 75;
const RETIREMENT_AGE_DEFAULT = 65;

const initialState: PersonalizeState = {
  currentStep: 1,
  dateOfBirth: DEFAULT_DOB,
  retirementAge: RETIREMENT_AGE_DEFAULT,
  country: "United States",
  state: "",
  salaryRange: "",
  savingsEstimate: "",
  savingsAmount: "",
};

export function usePersonalizeState() {
  const [state, setState] = useState<PersonalizeState>(initialState);

  const setCurrentStep = useCallback((step: 1 | 2 | 3) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  }, []);

  const setDateOfBirth = useCallback((dateOfBirth: string) => {
    setState((prev) => ({ ...prev, dateOfBirth }));
  }, []);

  const setRetirementAge = useCallback((retirementAge: number) => {
    const clamped = Math.min(RETIREMENT_AGE_MAX, Math.max(RETIREMENT_AGE_MIN, retirementAge));
    setState((prev) => ({ ...prev, retirementAge: clamped }));
  }, []);

  const setCountry = useCallback((country: string) => {
    setState((prev) => ({ ...prev, country, state: prev.country !== country ? "" : prev.state }));
  }, []);

  const setStateRegion = useCallback((stateRegion: string) => {
    setState((prev) => ({ ...prev, state: stateRegion }));
  }, []);

  const setSalaryRange = useCallback((salaryRange: string) => {
    setState((prev) => ({ ...prev, salaryRange }));
  }, []);

  const setSavingsEstimate = useCallback((savingsEstimate: string) => {
    setState((prev) => ({ ...prev, savingsEstimate }));
  }, []);

  const setSavingsAmount = useCallback((savingsAmount: string) => {
    setState((prev) => ({ ...prev, savingsAmount }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
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
  };
}

export function getAgeFromDOB(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

export function formatDOB(dateOfBirth: string): string {
  const d = new Date(dateOfBirth + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

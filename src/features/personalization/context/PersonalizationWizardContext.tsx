import {
  createContext,
  useContext,
  useCallback,
  useState,
  useMemo,
  type ReactNode,
} from "react";
import {
  type PersonalizationStep,
  type PersonalizationState,
  PERSONALIZATION_STEPS,
  RETIREMENT_AGE_MIN,
  RETIREMENT_AGE_MAX,
  SAVINGS_MIN,
  SAVINGS_MAX,
} from "../types";

const STORAGE_KEY = "participant-portal-personalization";

function loadStored(): Partial<PersonalizationState> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<PersonalizationState>;
  } catch {
    return null;
  }
}

function saveToStorage(data: Partial<PersonalizationState>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export const PERSONALIZATION_COMPLETE_KEY = "participant-portal-personalization-complete";

function getInitialState(
  currentAge: number,
  birthDateDisplay: string,
  birthYear: number
): PersonalizationState {
  const stored = loadStored();
  const age = Math.max(0, Math.min(120, stored?.currentAge ?? currentAge));
  const retirementAge = Math.max(
    RETIREMENT_AGE_MIN,
    Math.min(RETIREMENT_AGE_MAX, stored?.retirementAge ?? 65)
  );
  return {
    currentStep: stored?.currentStep ?? "age",
    currentAge: age,
    retirementAge,
    location: stored?.location ?? "",
    savings: Math.max(SAVINGS_MIN, Math.min(SAVINGS_MAX, stored?.savings ?? 0)),
    birthDateDisplay: stored?.birthDateDisplay ?? birthDateDisplay,
    birthYear: stored?.birthYear ?? birthYear,
  };
}

interface PersonalizationWizardContextValue {
  state: PersonalizationState;
  setRetirementAge: (age: number) => void;
  setLocation: (location: string) => void;
  setSavings: (amount: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: PersonalizationStep) => void;
  saveAndExit: () => void;
  completeWizard: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  stepIndex: number;
}

const Context = createContext<PersonalizationWizardContextValue | null>(null);

export function PersonalizationWizardProvider({
  children,
  currentAge,
  birthDateDisplay,
  birthYear,
  onComplete,
  onSaveAndExit,
}: {
  children: ReactNode;
  currentAge: number;
  birthDateDisplay: string;
  birthYear: number;
  onComplete?: () => void;
  onSaveAndExit?: () => void;
}) {
  const [state, setState] = useState<PersonalizationState>(() =>
    getInitialState(currentAge, birthDateDisplay, birthYear)
  );

  const stepIndex = useMemo(
    () => PERSONALIZATION_STEPS.indexOf(state.currentStep),
    [state.currentStep]
  );
  const isFirstStep = stepIndex <= 0;
  const isLastStep = stepIndex >= PERSONALIZATION_STEPS.length - 1;

  const persist = useCallback((updates: Partial<PersonalizationState>) => {
    setState((prev) => {
      const next = { ...prev, ...updates };
      saveToStorage({
        currentStep: next.currentStep,
        currentAge: next.currentAge,
        retirementAge: next.retirementAge,
        location: next.location,
        savings: next.savings,
        birthDateDisplay: next.birthDateDisplay,
        birthYear: next.birthYear,
      });
      return next;
    });
  }, []);

  const setRetirementAge = useCallback(
    (age: number) => {
      const clamped = Math.max(RETIREMENT_AGE_MIN, Math.min(RETIREMENT_AGE_MAX, age));
      persist({ retirementAge: clamped });
    },
    [persist]
  );

  const setLocation = useCallback((location: string) => persist({ location }), [persist]);
  const setSavings = useCallback(
    (amount: number) => {
      const clamped = Math.max(SAVINGS_MIN, Math.min(SAVINGS_MAX, amount));
      persist({ savings: clamped });
    },
    [persist]
  );

  const nextStep = useCallback(() => {
    if (isLastStep) {
      try {
        localStorage.setItem(PERSONALIZATION_COMPLETE_KEY, "true");
      } catch {
        // ignore
      }
      onComplete?.();
      return;
    }
    const next = PERSONALIZATION_STEPS[stepIndex + 1];
    if (next) persist({ currentStep: next });
  }, [isLastStep, stepIndex, persist, onComplete]);

  const prevStep = useCallback(() => {
    if (isFirstStep) return;
    const prev = PERSONALIZATION_STEPS[stepIndex - 1];
    if (prev) persist({ currentStep: prev });
  }, [isFirstStep, stepIndex, persist]);

  const goToStep = useCallback(
    (step: PersonalizationStep) => persist({ currentStep: step }),
    [persist]
  );

  const saveAndExit = useCallback(() => {
    persist({});
    try {
      localStorage.setItem(PERSONALIZATION_COMPLETE_KEY, "true");
    } catch {
      // ignore
    }
    onSaveAndExit?.();
  }, [persist, onSaveAndExit]);

  const completeWizard = useCallback(() => {
    try {
      localStorage.setItem(PERSONALIZATION_COMPLETE_KEY, "true");
    } catch {
      // ignore
    }
    onComplete?.();
  }, [onComplete]);

  const value = useMemo<PersonalizationWizardContextValue>(
    () => ({
      state,
      setRetirementAge,
      setLocation,
      setSavings,
      nextStep,
      prevStep,
      goToStep,
      saveAndExit,
      completeWizard,
      isFirstStep,
      isLastStep,
      stepIndex,
    }),
    [
      state,
      setRetirementAge,
      setLocation,
      setSavings,
      nextStep,
      prevStep,
      goToStep,
      saveAndExit,
      completeWizard,
      isFirstStep,
      isLastStep,
      stepIndex,
    ]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function usePersonalizationWizard() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("usePersonalizationWizard must be used within PersonalizationWizardProvider");
  return ctx;
}

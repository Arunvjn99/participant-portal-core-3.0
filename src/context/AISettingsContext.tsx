import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

const STORAGE_KEY = "participant_portal_ai_settings";

export interface AISettingsState {
  coreAIEnabled: boolean;
  insightsEnabled: boolean;
}

const DEFAULT_STATE: AISettingsState = {
  coreAIEnabled: true,
  insightsEnabled: true,
};

function loadFromStorage(): AISettingsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw) as Partial<AISettingsState>;
    return {
      coreAIEnabled: typeof parsed.coreAIEnabled === "boolean" ? parsed.coreAIEnabled : DEFAULT_STATE.coreAIEnabled,
      insightsEnabled: typeof parsed.insightsEnabled === "boolean" ? parsed.insightsEnabled : DEFAULT_STATE.insightsEnabled,
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

function saveToStorage(state: AISettingsState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

interface AISettingsContextValue extends AISettingsState {
  setCoreAIEnabled: (enabled: boolean) => void;
  setInsightsEnabled: (enabled: boolean) => void;
}

const AISettingsContext = createContext<AISettingsContextValue | null>(null);

export function AISettingsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AISettingsState>(loadFromStorage);

  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  const setCoreAIEnabled = useCallback((enabled: boolean) => {
    setState((prev) => ({ ...prev, coreAIEnabled: enabled }));
  }, []);

  const setInsightsEnabled = useCallback((enabled: boolean) => {
    setState((prev) => ({ ...prev, insightsEnabled: enabled }));
  }, []);

  const value = useMemo<AISettingsContextValue>(
    () => ({
      ...state,
      setCoreAIEnabled,
      setInsightsEnabled,
    }),
    [state, setCoreAIEnabled, setInsightsEnabled],
  );

  return (
    <AISettingsContext.Provider value={value}>
      {children}
    </AISettingsContext.Provider>
  );
}

export function useAISettings(): AISettingsContextValue {
  const ctx = useContext(AISettingsContext);
  if (!ctx) {
    return {
      ...DEFAULT_STATE,
      setCoreAIEnabled: () => {},
      setInsightsEnabled: () => {},
    };
  }
  return ctx;
}

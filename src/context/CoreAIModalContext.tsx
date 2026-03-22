import * as React from "react";
import { CoreAssistantModal } from "../components/core-ai/CoreAssistantModal";
import { CORE_AI_SEARCH_EVENT, OPEN_AI_ASSISTANT_EVENT } from "@/core/search/aiBridge";

export interface CoreAIModalContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  /** Open the Core AI modal with a pre-filled prompt (e.g. from "Ask AI about this plan"). */
  openWithPrompt: (prompt: string) => void;
  initialPrompt: string | null;
  clearInitialPrompt: () => void;
}

const CoreAIModalContext = React.createContext<CoreAIModalContextValue | null>(null);

export function useCoreAIModal(): CoreAIModalContextValue {
  const ctx = React.useContext(CoreAIModalContext);
  if (!ctx) {
    throw new Error("useCoreAIModal must be used within CoreAIModalProvider");
  }
  return ctx;
}

export function useCoreAIModalOptional(): CoreAIModalContextValue | null {
  return React.useContext(CoreAIModalContext);
}

export function CoreAIModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = React.useState(false);
  const [initialPrompt, setInitialPrompt] = React.useState<string | null>(null);

  const open = React.useCallback(() => {
    setInitialPrompt(null);
    setOpen(true);
  }, []);

  const close = React.useCallback(() => {
    setOpen(false);
    setInitialPrompt(null);
  }, []);

  const openWithPrompt = React.useCallback((prompt: string) => {
    setInitialPrompt(prompt.trim() || null);
    setOpen(true);
  }, []);

  const clearInitialPrompt = React.useCallback(() => {
    setInitialPrompt(null);
  }, []);

  /* Global search / command palette → Core AI (decoupled via window events) */
  React.useEffect(() => {
    const onOpenAssistant = () => {
      open();
    };

    const onCoreAISearch = (e: Event) => {
      const prompt = (e as CustomEvent<{ prompt?: string }>).detail?.prompt;
      if (typeof prompt !== "string" || !prompt.trim()) return;
      openWithPrompt(prompt.trim());
    };

    window.addEventListener(OPEN_AI_ASSISTANT_EVENT, onOpenAssistant);
    window.addEventListener(CORE_AI_SEARCH_EVENT, onCoreAISearch as EventListener);
    return () => {
      window.removeEventListener(OPEN_AI_ASSISTANT_EVENT, onOpenAssistant);
      window.removeEventListener(CORE_AI_SEARCH_EVENT, onCoreAISearch as EventListener);
    };
  }, [open, openWithPrompt]);

  const value: CoreAIModalContextValue = React.useMemo(
    () => ({ isOpen, open, close, openWithPrompt, initialPrompt, clearInitialPrompt }),
    [isOpen, open, close, openWithPrompt, initialPrompt, clearInitialPrompt]
  );

  return (
    <CoreAIModalContext.Provider value={value}>
      {children}
      {isOpen && (
        <CoreAssistantModal
          isOpen={true}
          onClose={close}
          initialPrompt={initialPrompt}
          onInitialPromptSent={clearInitialPrompt}
        />
      )}
    </CoreAIModalContext.Provider>
  );
}

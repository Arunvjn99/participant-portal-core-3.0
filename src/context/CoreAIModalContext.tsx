import * as React from "react";
import { CoreAssistantModal } from "../components/core-ai/CoreAssistantModal";
import { CORE_AI_SEARCH_EVENT, OPEN_AI_ASSISTANT_EVENT } from "@/core/search/aiBridge";
import { normalizeOpenAIModalInput, useAIAssistantStore, type OpenAIModalInput } from "@/stores/aiAssistantStore";

export interface CoreAIModalContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  /** Open the Core AI modal with a pre-filled prompt (e.g. from "Ask AI about this plan"). */
  openWithPrompt: (prompt: string) => void;
  initialPrompt: string | null;
  clearInitialPrompt: () => void;
  /**
   * Hero / contextual search entry: empty or whitespace → open with welcome + focus composer;
   * non-empty → same as opening with prompt (or queue send if already open).
   */
  openAIModal: (input?: OpenAIModalInput) => void;
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
  const [composerFocusTick, setComposerFocusTick] = React.useState(0);
  const [pendingSend, setPendingSend] = React.useState<{ id: number; text: string } | null>(null);

  const isOpenRef = React.useRef(isOpen);
  isOpenRef.current = isOpen;

  const debounceOpenRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingOpenRef = React.useRef<{ text: string; openEmpty: boolean } | null>(null);

  const clearInitialPrompt = React.useCallback(() => {
    setInitialPrompt(null);
  }, []);

  const close = React.useCallback(() => {
    if (debounceOpenRef.current) {
      clearTimeout(debounceOpenRef.current);
      debounceOpenRef.current = null;
    }
    setOpen(false);
    setInitialPrompt(null);
    setPendingSend(null);
  }, []);

  const open = React.useCallback(() => {
    setInitialPrompt(null);
    if (isOpenRef.current) {
      setComposerFocusTick((n) => n + 1);
      return;
    }
    setOpen(true);
  }, []);

  const openWithPrompt = React.useCallback((prompt: string) => {
    const p = prompt.trim();
    if (!p) return;
    if (isOpenRef.current) {
      setPendingSend({ id: Date.now(), text: p });
    } else {
      setInitialPrompt(p);
      setOpen(true);
    }
  }, []);

  const openAIModal = React.useCallback((raw?: OpenAIModalInput) => {
    const { text, openEmpty } = normalizeOpenAIModalInput(raw);
    useAIAssistantStore.setState({ query: text });

    pendingOpenRef.current = { text, openEmpty };
    if (debounceOpenRef.current) clearTimeout(debounceOpenRef.current);
    debounceOpenRef.current = setTimeout(() => {
      debounceOpenRef.current = null;
      const pending = pendingOpenRef.current;
      const q = pending?.text ?? "";
      const empty = pending?.openEmpty ?? true;
      const openNow = isOpenRef.current;

      if (empty) {
        setInitialPrompt(null);
        if (openNow) {
          setComposerFocusTick((n) => n + 1);
        } else {
          setOpen(true);
          queueMicrotask(() => setComposerFocusTick((n) => n + 1));
        }
        return;
      }

      if (openNow) {
        setPendingSend({ id: Date.now(), text: q });
      } else {
        setInitialPrompt(q);
        setOpen(true);
      }
    }, 0);
  }, []);

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

  React.useEffect(() => {
    useAIAssistantStore.setState({
      isAIModalOpen: isOpen,
      openAIModal: (input?: OpenAIModalInput) => openAIModal(input),
      closeAIModal: close,
    });
  }, [isOpen, openAIModal, close]);

  React.useEffect(() => {
    if (!isOpen) {
      useAIAssistantStore.setState({ query: "" });
    }
  }, [isOpen]);

  const value: CoreAIModalContextValue = React.useMemo(
    () => ({
      isOpen,
      open,
      close,
      openWithPrompt,
      initialPrompt,
      clearInitialPrompt,
      openAIModal,
    }),
    [isOpen, open, close, openWithPrompt, initialPrompt, clearInitialPrompt, openAIModal],
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
          composerFocusSignal={composerFocusTick}
          externalSend={pendingSend}
          onExternalSendConsumed={() => setPendingSend(null)}
        />
      )}
    </CoreAIModalContext.Provider>
  );
}

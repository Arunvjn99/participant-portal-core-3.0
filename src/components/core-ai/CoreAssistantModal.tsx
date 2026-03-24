import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { useSpeechRecognition } from "./useSpeechRecognition";
import { useTextToSpeech } from "./useTextToSpeech";
import { getRoutingVersion, withVersionIfEnrollment } from "@/core/version";
import { buildActionHandlers } from "@/core/search/actionHandlers";
import { handleLocalAI } from "@/core/ai/handleLocalAI";
import { formatStructuredUserLine, type CoreAIStructuredPayload } from "@/core/ai/interactive/types";
import { CORE_AI_LOAN_APPLY_ROUTE } from "@/core/ai/types";
import type { LocalFlowState } from "@/core/ai/types";
import { useLoanStore } from "@/stores/loanStore";
import { CoreAiBrandMark } from "@/components/core-ai/CoreAiBrandMark";
import type { ChatMessage } from "./MessageBubble";

/* ── Props ── */
export interface CoreAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** When set, modal sends this as the first user message and then clears it (e.g. "Ask AI about this plan"). */
  initialPrompt?: string | null;
  /** Called after the initial prompt has been submitted so the parent can clear it. */
  onInitialPromptSent?: () => void;
  /** Increment to focus the composer (hero search → open empty). */
  composerFocusSignal?: number;
  /** When modal is already open, send this message immediately (e.g. second hero search submit). */
  externalSend?: { id: number; text: string } | null;
  onExternalSendConsumed?: () => void;
}

/* ── Helpers ── */
let msgCounter = 0;
const nextId = () => `msg-${++msgCounter}-${Date.now()}`;

/**
 * Welcome message with suggestion chips embedded IN the message stream.
 * No separate suggestion bar — suggestions are part of the first AI bubble.
 */
function getWelcomeMessage(t: (key: string) => string): ChatMessage {
  return {
    id: "welcome",
    role: "assistant",
    content: t("coreAi.welcomeMessage"),
    timestamp: new Date(),
    suggestions: [
      t("coreAi.suggestionEnroll"),
      t("coreAi.suggestionLoan"),
      t("coreAi.suggestionWithdraw"),
      t("coreAi.suggestionVested"),
    ],
  };
}

/* ── Component ── */
export function CoreAssistantModal({
  isOpen,
  onClose,
  initialPrompt,
  onInitialPromptSent,
  composerFocusSignal = 0,
  externalSend = null,
  onExternalSendConsumed,
}: CoreAssistantModalProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  /* ── State ── */
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const flowStateRef = useRef<LocalFlowState | null>(null);
  const prevOpenRef = useRef(false);
  const initialPromptSentRef = useRef(false);
  const lastExternalSendIdRef = useRef<number | null>(null);

  /* ── Core message handler (defined early so speech hook can reference it) ── */
  const handleSendRef = useRef<(text: string) => void>(() => {});
  const isLoadingRef = useRef(false);

  /* ── Hooks ── */
  const tts = useTextToSpeech();
  const speech = useSpeechRecognition({
    onResult: (transcript: string) => {
      handleSendRef.current(transcript);
    },
  });

  /* ── Reset when modal opens (detect false→true transition) ── */
  useEffect(() => {
    const wasOpen = prevOpenRef.current;
    prevOpenRef.current = isOpen;

    if (isOpen && !wasOpen) {
      /* Fresh open — reset everything */
      initialPromptSentRef.current = false;
      lastExternalSendIdRef.current = null;
      setMessages([getWelcomeMessage(t)]);
      setIsLoading(false);
      isLoadingRef.current = false;
      flowStateRef.current = null;
      tts.stop();
    } else if (!isOpen && wasOpen) {
      /* Closing — stop any active audio/recording */
      speech.stopListening();
      tts.stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  /* ── Send initial prompt when opened with one (e.g. hero search → Core AI) ── */
  useEffect(() => {
    if (!isOpen || !initialPrompt?.trim() || initialPromptSentRef.current) return;
    const prompt = initialPrompt.trim();
    initialPromptSentRef.current = true;
    onInitialPromptSent?.();
    let cancelled = false;
    const id = window.setTimeout(() => {
      if (!cancelled) handleSendRef.current(prompt);
    }, 10);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [isOpen, initialPrompt, onInitialPromptSent]);

  /* ── External send while modal already open (e.g. hero search with text) ── */
  useEffect(() => {
    if (!isOpen || !externalSend?.text.trim()) return;
    if (lastExternalSendIdRef.current === externalSend.id) return;
    lastExternalSendIdRef.current = externalSend.id;
    onExternalSendConsumed?.();
    const text = externalSend.text.trim();
    const id = window.setTimeout(() => {
      handleSendRef.current(text);
    }, 10);
    return () => window.clearTimeout(id);
  }, [isOpen, externalSend, onExternalSendConsumed]);

  /* ── Escape to close ── */
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  /* ── Lock body scroll ── */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  /* ── Core message handler (text + structured card actions) ── */
  const runTurn = useCallback(
    (text: string, structured: CoreAIStructuredPayload | null) => {
      const trimmed = text.trim();
      if (isLoadingRef.current) return;
      if (!structured && !trimmed) return;

      const userContent = structured ? formatStructuredUserLine(structured) : trimmed;

      const userMsg: ChatMessage = {
        id: nextId(),
        role: "user",
        content: userContent,
        timestamp: new Date(),
      };

      setMessages((prev) => {
        const updated = prev.map((m) => (m.suggestions ? { ...m, suggestions: undefined } : m));
        return [...updated, userMsg];
      });

      setIsLoading(true);
      isLoadingRef.current = true;

      const routeVersion = getRoutingVersion(location.pathname);
      const local = handleLocalAI(structured ? "" : trimmed, flowStateRef.current, structured);
      flowStateRef.current = local.nextState;

      if (local.loanApplyPayload) {
        const p = local.loanApplyPayload;
        useLoanStore.getState().initializeLoan({
          amount: p.amount,
          purpose: p.purpose,
          loanType: p.loanType,
        });
        useLoanStore.getState().setStep(3);
      }

      setMessages((prev) => [...prev, ...local.messages]);

      const handlers = buildActionHandlers(navigate, routeVersion);
      if (local.navigate) {
        navigate(withVersionIfEnrollment(routeVersion, local.navigate));
        onClose();
      } else if (local.action && handlers[local.action]) {
        handlers[local.action]();
        onClose();
      }

      setIsLoading(false);
      isLoadingRef.current = false;
    },
    [navigate, onClose, location.pathname],
  );

  const handleSend = useCallback(
    (text: string) => {
      runTurn(text, null);
    },
    [runTurn],
  );

  const handleInteractiveAction = useCallback(
    (structured: CoreAIStructuredPayload) => {
      runTurn("", structured);
    },
    [runTurn],
  );

  /* Keep refs in sync so the speech hook always calls the latest handlers */
  useEffect(() => {
    handleSendRef.current = handleSend;
  }, [handleSend]);

  /* ── Handle action button navigation ── */
  const handleAction = useCallback(
    (route: string) => {
      if (route === CORE_AI_LOAN_APPLY_ROUTE) {
        const v = getRoutingVersion(location.pathname);
        navigate(withVersionIfEnrollment(v, "/transactions/loan/configuration"));
        onClose();
        return;
      }
      navigate(route);
      onClose();
    },
    [navigate, onClose, location.pathname]
  );

  /* ── Mic click (toggle) ── */
  const handleMicClick = useCallback(() => {
    if (speech.isListening) {
      speech.stopListening();
    } else {
      speech.startListening();
    }
  }, [speech]);

  /* ── Play message audio ── */
  const handlePlay = useCallback(
    (messageId: string) => {
      const msg = messages.find((m) => m.id === messageId);
      if (!msg) return;
      tts.speak(messageId, msg.content);
    },
    [messages, tts]
  );

  /* ── Suggestion chip click (same handler as typing — goes through flow router) ── */
  const handleSuggestion = useCallback(
    (text: string) => {
      handleSend(text);
    },
    [handleSend]
  );

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center">
          {/* ── Backdrop ── */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          {/* ── Modal ── */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="relative z-10 flex flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl bg-[var(--color-surface)] text-[var(--color-text)] shadow-2xl w-full sm:w-[min(640px,calc(100vw-2rem))] md:w-[min(720px,calc(100vw-2rem))] h-[calc(100dvh-1rem)] sm:h-[min(620px,calc(100dvh-3rem))]"
            role="dialog"
            aria-modal="true"
            aria-label={t("coreAi.modalAria")}
          >
            {/* ── Header ── */}
            <div className="shrink-0 flex items-center justify-between gap-3 border-b border-[var(--color-border)] px-5 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <CoreAiBrandMark />
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold text-[var(--color-text)]">{t("coreAi.headerTitle")}</h2>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-success)]" aria-hidden />
                    <span className="text-[11px] text-[var(--color-textSecondary)]">
                      {flowStateRef.current
                        ? t("coreAi.statusFlow", { type: flowStateRef.current.type.charAt(0).toUpperCase() + flowStateRef.current.type.slice(1) })
                        : t("coreAi.statusOnline")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Close */}
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-textSecondary)] transition-colors hover:bg-[var(--color-background)] hover:text-[var(--color-text)]"
                aria-label={t("coreAi.closeAria")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* ── Messages (suggestions are inside the message stream) ── */}
            <MessageList
              messages={messages}
              speakingId={tts.speakingId}
              isLoading={isLoading}
              onPlay={handlePlay}
              onAction={handleAction}
              onSuggestion={handleSuggestion}
              onInteractiveAction={handleInteractiveAction}
            />

            {/* ── Input (mic inside input — voice is a feature, not a mode) ── */}
            <MessageInput
              onSend={handleSend}
              isListening={speech.isListening}
              isProcessing={speech.isProcessing}
              onMicClick={handleMicClick}
              disabled={isLoading}
              composerFocusSignal={composerFocusSignal}
            />

            {/* ── Footer ── */}
            <div className="shrink-0 border-t border-[var(--color-border)] px-5 py-2">
              <p className="text-[10px] text-[var(--color-textSecondary)] text-center">
                {t("coreAi.disclaimer")}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

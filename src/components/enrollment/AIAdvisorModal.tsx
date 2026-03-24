import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Button from "../ui/Button";
import { useAIAssistantStore } from "@/stores/aiAssistantStore";

interface AIAdvisorModalProps {
  open: boolean;
  onClose: () => void;
}

const REVIEW_OPTIMIZE_PROMPT =
  "I'm on the enrollment review step before I submit. Help me sanity-check my plan choice, contribution rate, and investment allocation.";

/**
 * Chooser: open Core AI with enrollment context, or dismiss. No fake “connect” actions.
 */
export const AIAdvisorModal = ({ open, onClose }: AIAdvisorModalProps) => {
  const { t } = useTranslation();

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, handleEscape]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-advisor-modal-title"
    >
      <div className="w-full max-w-md rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-xl">
        <h2 id="ai-advisor-modal-title" className="text-xl font-semibold text-[var(--color-text)]">
          {t("aiSystem.askCoreAI")}
        </h2>
        <p className="mt-3 text-[var(--color-textSecondary)]">
          {t("aiSystem.aiAdvisorModalBody")}
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Button
            type="button"
            className="ai-assistant w-full rounded-full border-0 font-semibold text-white shadow-md"
            onClick={() => {
              useAIAssistantStore.getState().openAIModal({ prompt: REVIEW_OPTIMIZE_PROMPT, autoSend: true });
              onClose();
            }}
          >
            {t("aiSystem.askCoreAI")}
          </Button>
          <Button type="button" onClick={onClose} className="button--outline w-full">
            {t("aiSystem.scheduleHumanAdvisor")}
          </Button>
          <button
            type="button"
            onClick={onClose}
            className="mt-2 text-sm text-[var(--color-textSecondary)] hover:text-[var(--color-text)]"
          >
            {t("aiSystem.maybeLater")}
          </button>
        </div>
      </div>
    </div>
  );
};

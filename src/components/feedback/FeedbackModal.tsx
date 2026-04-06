import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { submitFeedback } from "@/services/feedbackService";
import { isSupabaseConfigured } from "@/lib/supabase";
import { useFeedbackStore } from "@/store/feedbackStore";
import { useScenarioStore } from "@/store/scenarioStore";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";

function StarRow({
  value,
  hover,
  onHover,
  onPick,
}: {
  value: number | null;
  hover: number;
  onHover: (n: number) => void;
  onPick: (n: number) => void;
}) {
  const { t } = useTranslation();
  const display = hover || value || 0;
  return (
    <div
      className="flex gap-1"
      role="radiogroup"
      aria-label={t("feedback.ratingAria")}
      aria-required="true"
      onMouseLeave={() => onHover(0)}
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n <= display;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            onMouseEnter={() => onHover(n)}
            onFocus={() => onHover(n)}
            onBlur={() => onHover(0)}
            onClick={() => onPick(n)}
            className={cn(
              "rounded-md p-1 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            )}
            aria-label={t("feedback.starLabel", { n })}
          >
            <Star
              className={cn("h-9 w-9", active ? "fill-primary text-primary" : "text-muted-foreground")}
              strokeWidth={1.5}
            />
          </button>
        );
      })}
    </div>
  );
}

/**
 * Global feedback dialog — opened via {@link useFeedbackStore}. Persists to Supabase when configured.
 */
export function FeedbackModal() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const page = pathname?.trim() || "/";
  const { profile } = useUser();
  const isOpen = useFeedbackStore((s) => s.isOpen);
  const rating = useFeedbackStore((s) => s.rating);
  const comment = useFeedbackStore((s) => s.comment);
  const closeFeedback = useFeedbackStore((s) => s.closeFeedback);
  const setRating = useFeedbackStore((s) => s.setRating);
  const setComment = useFeedbackStore((s) => s.setComment);
  const showToast = useFeedbackStore((s) => s.showToast);

  const [starHover, setStarHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const canSubmit = rating !== null && rating >= 1 && rating <= 5 && !submitting;

  useEffect(() => {
    if (isOpen) {
      setSubmitError(null);
      setStarHover(0);
    }
  }, [isOpen]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeFeedback();
      setStarHover(0);
      setSubmitError(null);
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit || rating === null) return;

    const scenarioState = useScenarioStore.getState();
    const scenarioId =
      scenarioState.isDemoMode && scenarioState.activeScenarioId ? scenarioState.activeScenarioId : null;

    setSubmitError(null);
    setSubmitting(true);

    try {
      const configured = isSupabaseConfigured();

      if (configured) {
        const result = await submitFeedback({
          rating,
          comment: comment.trim() || null,
          pathname: page,
          companyId: profile?.company_id ?? null,
          scenario: scenarioId,
        });

        if (!result.ok) {
          const msg = result.message;
          setSubmitError(msg);
          showToast(msg, "error");
          return;
        }

        closeFeedback();
        setRating(null);
        setComment("");
        setStarHover(0);
        showToast(t("feedback.successSaved"), "success");
        return;
      }

      if (import.meta.env.DEV) {
        console.warn("[feedback] Supabase not configured; feedback not persisted.");
      }
      closeFeedback();
      setRating(null);
      setComment("");
      setStarHover(0);
      showToast(t("feedback.successLocal"), "success");
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("feedback.errorGeneric");
      console.error("[feedback] handleSubmit unexpected error", err);
      setSubmitError(msg);
      showToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            className="fixed inset-0 bg-black/45 backdrop-blur-sm dark:bg-black/70"
            style={{ zIndex: 10000 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        </Dialog.Overlay>
        <Dialog.Content asChild>
          {/*
            Outer wrapper: flex centering (not transform-based). Inner motion.div uses transform for
            enter animation — if transform lived on the same node as left-1/2/top-1/2 translate,
            Framer Motion would override Tailwind and break centering (modal drifts to bottom-right).
          */}
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              className={cn(
                "pointer-events-auto w-full max-w-[420px] max-h-[min(90vh,640px)] overflow-y-auto",
                "rounded-2xl border border-border bg-card p-6 text-foreground shadow-xl",
              )}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
            >
            <div className="flex items-start justify-between gap-3">
              <Dialog.Title className="text-lg font-semibold tracking-tight">{t("feedback.title")}</Dialog.Title>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-background-secondary hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label={t("feedback.closeAria")}
                >
                  <X className="h-5 w-5" />
                </button>
              </Dialog.Close>
            </div>

            <Dialog.Description className="mt-1 text-sm text-muted-foreground">
              {t("feedback.description")}
              <span className="mt-1 block text-xs text-muted-foreground/80">{page}</span>
            </Dialog.Description>

            <div className="mt-5">
              <p className="mb-2 text-sm font-medium text-foreground">{t("feedback.ratingPrompt")}</p>
              <StarRow value={rating} hover={starHover} onHover={setStarHover} onPick={setRating} />
              {rating === null && (
                <p className="mt-2 text-xs text-muted-foreground">{t("feedback.ratingRequiredHint")}</p>
              )}
            </div>

            <div className="mt-5">
              <label htmlFor="feedback-comment" className="mb-2 block text-sm font-medium text-foreground">
                {t("feedback.commentLabel")}
              </label>
              <textarea
                id="feedback-comment"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t("feedback.commentPlaceholder")}
                className={cn(
                  "w-full resize-y rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground",
                  "placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25",
                  "dark:border-border/80 dark:bg-muted/35",
                )}
              />
            </div>

            <AnimatePresence>
              {submitError ? (
                <motion.div
                  role="alert"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 overflow-hidden rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
                >
                  {submitError}
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <Dialog.Close asChild>
                <button
                  type="button"
                  disabled={submitting}
                  className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-background-secondary disabled:opacity-50"
                >
                  {t("feedback.cancel")}
                </button>
              </Dialog.Close>
              <button
                type="button"
                disabled={!canSubmit}
                onClick={() => void handleSubmit()}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors",
                  "bg-primary hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  !canSubmit && "cursor-not-allowed opacity-50",
                )}
              >
                {submitting ? t("feedback.submitting") : t("feedback.submit")}
              </button>
            </div>
            </motion.div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { useFeedbackStore } from "@/store/feedbackStore";
import { cn } from "@/lib/utils";

const TOAST_MS = 4500;

/**
 * Global success / error toast for feedback submit (driven by {@link useFeedbackStore}).
 */
export function FeedbackSuccessToast() {
  const toastMessage = useFeedbackStore((s) => s.toastMessage);
  const toastVariant = useFeedbackStore((s) => s.toastVariant);
  const dismissToast = useFeedbackStore((s) => s.dismissToast);

  useEffect(() => {
    if (!toastMessage) return;
    const t = window.setTimeout(() => dismissToast(), TOAST_MS);
    return () => window.clearTimeout(t);
  }, [toastMessage, dismissToast]);

  return (
    <AnimatePresence>
      {toastMessage ? (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          className={cn(
            "pointer-events-none fixed left-1/2 top-6 z-[10001] flex max-w-md -translate-x-1/2 items-center gap-3 rounded-xl border px-4 py-3 shadow-lg",
            "border-border bg-card text-foreground",
            toastVariant === "error" && "border-danger/35 bg-danger/5",
          )}
        >
          {toastVariant === "success" ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" aria-hidden />
          ) : (
            <XCircle className="h-5 w-5 shrink-0 text-danger" aria-hidden />
          )}
          <p className="text-sm font-medium leading-snug">{toastMessage}</p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

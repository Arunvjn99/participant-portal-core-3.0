import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import { useUser } from "../../context/UserContext";

export type WorkflowType = "enrollment_flow" | "overall_experience";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  workflowType: WorkflowType;
}

const TITLES: Record<WorkflowType, string> = {
  enrollment_flow: "How was your enrollment experience?",
  overall_experience: "Before you go, how was your overall experience?",
};

const SUBTITLES: Record<WorkflowType, string> = {
  enrollment_flow: "Your feedback helps us improve the enrollment process.",
  overall_experience: "We'd love to hear your thoughts before you leave.",
};

function StarIcon({ filled, hovered }: { filled: boolean; hovered: boolean }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill={filled || hovered ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-colors duration-150 ${
        filled
          ? "text-[var(--color-primary)]"
          : hovered
            ? "text-[var(--color-primary)]/60"
            : "text-slate-300 dark:text-slate-600"
      }`}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function FeedbackModal({ isOpen, onClose, workflowType }: FeedbackModalProps) {
  const { user } = useAuth();
  const { profile } = useUser();
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const firstFocusRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setHoveredStar(0);
      setComment("");
      setStatus("idle");
      setErrorMsg("");
      setTimeout(() => firstFocusRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleSubmit = useCallback(async () => {
    if (rating === 0) {
      setErrorMsg("Please select a rating.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");

    const { error } = await supabase.from("feedback").insert({
      user_id: user?.id,
      company_id: profile?.company_id ?? null,
      workflow_name: workflowType,
      rating,
      comment: comment.trim() || null,
    });

    if (error) {
      setStatus("error");
      setErrorMsg("Failed to submit feedback. Please try again.");
      return;
    }

    setStatus("success");
    setTimeout(() => onClose(), 1500);
  }, [rating, comment, user, profile, workflowType, onClose]);

  const content = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden
          />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 dark:shadow-black/50"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-title"
            onClick={(e) => e.stopPropagation()}
          >
            {status === "success" ? (
              <div className="flex flex-col items-center py-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-success, #16a34a)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Thank you!
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Your feedback has been submitted.
                </p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h2 id="feedback-title" className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {TITLES[workflowType]}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {SUBTITLES[workflowType]}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                    aria-label="Close"
                    ref={firstFocusRef}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                {/* Stars */}
                <div className="mt-6 flex items-center justify-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="rounded-md p-1 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                      aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                      aria-pressed={rating === star}
                    >
                      <StarIcon
                        filled={star <= rating}
                        hovered={hoveredStar > 0 && star <= hoveredStar && star > rating}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="mt-1 text-center text-xs text-slate-400 dark:text-slate-500">
                    {["", "Poor", "Fair", "Good", "Great", "Excellent"][rating]}
                  </p>
                )}

                {/* Comment */}
                <textarea
                  className="mt-5 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500"
                  rows={3}
                  placeholder="Any additional comments? (optional)"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />

                {/* Error */}
                {errorMsg && (
                  <p className="mt-2 text-sm text-red-500 dark:text-red-400" role="alert">
                    {errorMsg}
                  </p>
                )}

                {/* Actions */}
                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Skip
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={rating === 0 || status === "loading"}
                    className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {status === "loading" ? "Submitting…" : "Submit"}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}

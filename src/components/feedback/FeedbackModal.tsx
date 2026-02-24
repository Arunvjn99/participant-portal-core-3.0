import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import { useUser } from "../../context/UserContext";

/* ═══════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════ */

export type WorkflowType = "enrollment_flow" | "overall_experience";

type FeedbackMetadata = {
  difficult_part?: string;
  confidence_level?: string;
  primary_feature_used?: string;
  nps_score?: number;
};

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  workflowType: WorkflowType;
}

/* ═══════════════════════════════════════════════════════
   QUESTION CONFIG — data-driven, no switch statements
   ═══════════════════════════════════════════════════════ */

interface SelectOption {
  value: string;
  label: string;
  icon: string;
}

const ENROLLMENT_DIFFICULTY_OPTIONS: SelectOption[] = [
  { value: "investment_selection", label: "Investment selection", icon: "📊" },
  { value: "contribution_selection", label: "Contribution setup", icon: "💰" },
  { value: "plan_understanding", label: "Understanding plans", icon: "📋" },
  { value: "too_many_steps", label: "Too many steps", icon: "🔄" },
  { value: "none_smooth", label: "Nothing — it was smooth!", icon: "✨" },
];

const CONFIDENCE_OPTIONS: SelectOption[] = [
  { value: "confident", label: "Yes, confident", icon: "💪" },
  { value: "somewhat_confident", label: "Somewhat", icon: "🤔" },
  { value: "not_confident", label: "Not really", icon: "😟" },
];

const FEATURE_OPTIONS: SelectOption[] = [
  { value: "dashboard", label: "Dashboard", icon: "📈" },
  { value: "enrollment", label: "Enrolment", icon: "📝" },
  { value: "investment_portfolio", label: "Investments", icon: "💼" },
  { value: "transactions", label: "Transactions", icon: "🔄" },
  { value: "core_ai", label: "Core AI assistant", icon: "🤖" },
];

const STEP_TITLES: Record<WorkflowType, Record<number, string>> = {
  enrollment_flow: {
    1: "How was your enrollment experience?",
    2: "Help us understand your experience",
  },
  overall_experience: {
    1: "Before you go — quick feedback?",
    2: "A few more details",
  },
};

/* ═══════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════ */

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
            : "text-[var(--color-text)]"
      }`}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function OptionButton({
  option,
  selected,
  onClick,
}: {
  option: SelectOption;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl border-2 px-3.5 py-2.5 text-left text-sm font-medium transition-all duration-150 ${
        selected
          ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-text)]"
          : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-textSecondary)] hover:border-[var(--color-border)] hover:bg-[var(--color-surface)]"
      }`}
      aria-pressed={selected}
    >
      <span className="text-base">{option.icon}</span>
      <span>{option.label}</span>
      {selected && (
        <svg className="ml-auto shrink-0 text-[var(--color-primary)]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </button>
  );
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className="h-1 rounded-full transition-all duration-300"
          style={{
            width: i + 1 === current ? 24 : 8,
            backgroundColor:
              i + 1 <= current ? "var(--color-primary)" : "var(--color-border, #e5e7eb)",
          }}
        />
      ))}
    </div>
  );
}

function NpsSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[var(--color-textSecondary)]">Not likely</span>
        <span
          className="text-2xl font-bold tabular-nums"
          style={{ color: "var(--color-primary)" }}
        >
          {value}
        </span>
        <span className="text-xs text-[var(--color-textSecondary)]">Extremely likely</span>
      </div>
      <input
        type="range"
        min={0}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--color-background)] accent-[var(--color-primary)] [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md"
        aria-label="NPS score"
      />
      <div className="flex justify-between px-0.5">
        {Array.from({ length: 11 }, (_, i) => (
          <span key={i} className="text-[9px] tabular-nums text-[var(--color-textSecondary)]">
            {i}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */

const STEP_ANIMATION = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.2 },
};

export function FeedbackModal({ isOpen, onClose, workflowType }: FeedbackModalProps) {
  const { user } = useAuth();
  const { profile } = useUser();
  const firstFocusRef = useRef<HTMLButtonElement>(null);

  const [step, setStep] = useState(1);
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState("");

  const [difficultPart, setDifficultPart] = useState("");
  const [confidenceLevel, setConfidenceLevel] = useState("");
  const [primaryFeature, setPrimaryFeature] = useState("");
  const [npsScore, setNpsScore] = useState(7);

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const TOTAL_STEPS = 2;

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setRating(0);
      setHoveredStar(0);
      setComment("");
      setDifficultPart("");
      setConfidenceLevel("");
      setPrimaryFeature("");
      setNpsScore(7);
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

  const canProceedStep1 = rating > 0;

  const canProceedStep2 =
    workflowType === "enrollment_flow"
      ? difficultPart !== "" && confidenceLevel !== ""
      : primaryFeature !== "";

  const handleNext = () => {
    if (step === 1 && canProceedStep1) setStep(2);
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
  };

  const handleSubmit = useCallback(async () => {
    if (rating === 0) return;
    setStatus("loading");
    setErrorMsg("");

    const metadata: FeedbackMetadata = {};
    if (workflowType === "enrollment_flow") {
      metadata.difficult_part = difficultPart || undefined;
      metadata.confidence_level = confidenceLevel || undefined;
    } else {
      metadata.primary_feature_used = primaryFeature || undefined;
      metadata.nps_score = npsScore;
    }

    const { error } = await supabase.from("feedback").insert({
      user_id: user?.id,
      company_id: profile?.company_id ?? null,
      workflow_name: workflowType,
      rating,
      comment: comment.trim() || null,
      metadata,
    });

    if (error) {
      setStatus("error");
      setErrorMsg("Failed to submit feedback. Please try again.");
      return;
    }

    setStatus("success");
    setTimeout(() => onClose(), 1500);
  }, [rating, comment, workflowType, difficultPart, confidenceLevel, primaryFeature, npsScore, user, profile, onClose]);

  /* ── Step content renderers ── */

  const renderStep1 = () => (
    <motion.div key="step-1" {...STEP_ANIMATION}>
      <div className="mt-5 flex items-center justify-center gap-1.5">
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
        <p className="mt-1 text-center text-xs text-[var(--color-textSecondary)]">
          {["", "Poor", "Fair", "Good", "Great", "Excellent"][rating]}
        </p>
      )}

      <textarea
        className="mt-5 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-textSecondary)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
        rows={2}
        placeholder="Any additional comments? (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-textSecondary)] transition-colors hover:bg-[var(--color-surface)]"
        >
          Skip
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!canProceedStep1}
          className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </motion.div>
  );

  const renderEnrollmentStep2 = () => (
    <motion.div key="step-2-enroll" {...STEP_ANIMATION} className="space-y-5">
      {/* Q: Difficult part */}
      <div>
        <p className="mb-2 text-sm font-medium text-[var(--color-text)]">
          What part was most challenging?
        </p>
        <div className="space-y-2">
          {ENROLLMENT_DIFFICULTY_OPTIONS.map((opt) => (
            <OptionButton
              key={opt.value}
              option={opt}
              selected={difficultPart === opt.value}
              onClick={() => setDifficultPart(opt.value)}
            />
          ))}
        </div>
      </div>

      {/* Q: Confidence */}
      <div>
        <p className="mb-2 text-sm font-medium text-[var(--color-text)]">
          Did you feel confident about your investment choice?
        </p>
        <div className="space-y-2">
          {CONFIDENCE_OPTIONS.map((opt) => (
            <OptionButton
              key={opt.value}
              option={opt}
              selected={confidenceLevel === opt.value}
              onClick={() => setConfidenceLevel(opt.value)}
            />
          ))}
        </div>
      </div>

      {errorMsg && (
        <p className="text-sm text-[var(--color-danger)]" role="alert">{errorMsg}</p>
      )}

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={handleBack}
          className="flex-1 rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-textSecondary)] transition-colors hover:bg-[var(--color-surface)]"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canProceedStep2 || status === "loading"}
          className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "loading" ? "Submitting…" : "Submit"}
        </button>
      </div>
    </motion.div>
  );

  const renderLogoutStep2 = () => (
    <motion.div key="step-2-logout" {...STEP_ANIMATION} className="space-y-5">
      {/* Q: Primary feature */}
      <div>
        <p className="mb-2 text-sm font-medium text-[var(--color-text)]">
          What did you primarily use today?
        </p>
        <div className="space-y-2">
          {FEATURE_OPTIONS.map((opt) => (
            <OptionButton
              key={opt.value}
              option={opt}
              selected={primaryFeature === opt.value}
              onClick={() => setPrimaryFeature(opt.value)}
            />
          ))}
        </div>
      </div>

      {/* Q: NPS */}
      <div>
        <p className="mb-3 text-sm font-medium text-[var(--color-text)]">
          How likely are you to recommend this portal?
        </p>
        <NpsSlider value={npsScore} onChange={setNpsScore} />
      </div>

      {errorMsg && (
        <p className="text-sm text-[var(--color-danger)]" role="alert">{errorMsg}</p>
      )}

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={handleBack}
          className="flex-1 rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-textSecondary)] transition-colors hover:bg-[var(--color-surface)]"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canProceedStep2 || status === "loading"}
          className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "loading" ? "Submitting…" : "Submit"}
        </button>
      </div>
    </motion.div>
  );

  const renderSuccess = () => (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center py-6"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-success)]/10">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-success, #16a34a)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <p className="mt-4 text-lg font-semibold text-[var(--color-text)]">
        Thank you!
      </p>
      <p className="mt-1 text-sm text-[var(--color-textSecondary)]">
        Your feedback has been submitted.
      </p>
    </motion.div>
  );

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
          <motion.div
            className="absolute inset-0 bg-[var(--color-surface)] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden
          />

          <motion.div
            className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-[var(--color-surface)] shadow-2xl"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-h-[85vh] overflow-y-auto p-6">
              {status === "success" ? (
                renderSuccess()
              ) : (
                <>
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2">
                        <StepIndicator current={step} total={TOTAL_STEPS} />
                      </div>
                      <h2 id="feedback-title" className="text-lg font-semibold text-[var(--color-text)]">
                        {STEP_TITLES[workflowType][step]}
                      </h2>
                      <p className="mt-0.5 text-xs text-[var(--color-textSecondary)]">
                        Step {step} of {TOTAL_STEPS}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--color-textSecondary)] transition-colors hover:bg-[var(--color-background)] hover:text-[var(--color-textSecondary)]"
                      aria-label="Close"
                      ref={firstFocusRef}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>

                  {/* Step content */}
                  <AnimatePresence mode="wait">
                    {step === 1 && renderStep1()}
                    {step === 2 && workflowType === "enrollment_flow" && renderEnrollmentStep2()}
                    {step === 2 && workflowType === "overall_experience" && renderLogoutStep2()}
                  </AnimatePresence>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface SuccessEnrollmentModalProps {
  open: boolean;
  onClose: () => void;
  onViewPlanDetails?: () => void;
}

const BURST_PARTICLES = 16;
const PARTICLE_ANGLES = Array.from({ length: BURST_PARTICLES }, (_, i) => (i / BURST_PARTICLES) * 360);
const BURST_COLORS = [
  "bg-emerald-400 dark:bg-emerald-500",
  "bg-emerald-300 dark:bg-emerald-600",
  "bg-emerald-200 dark:bg-emerald-700",
];

export function SuccessEnrollmentModal({
  open,
  onClose,
  onViewPlanDetails,
}: SuccessEnrollmentModalProps) {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();

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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  const handleOkay = () => {
    onClose();
  };

  const handleViewPlanDetails = () => {
    if (onViewPlanDetails) {
      onViewPlanDetails();
    } else {
      onClose();
    }
  };

  const content = (
    <AnimatePresence>
      {open && (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={false}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.2 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.25 }}
          onClick={onClose}
          aria-hidden
        />

        {/* Modal card */}
        <motion.div
          className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white p-8 shadow-2xl dark:bg-slate-900 dark:shadow-black/50"
          initial={reducedMotion ? false : { scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
            opacity: { duration: 0.2 },
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="success-modal-title"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Burst particles - radiate from checkmark */}
          {!reducedMotion &&
            PARTICLE_ANGLES.map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const distance = 72 + (i % 4) * 24;
              const x = Math.cos(rad) * distance;
              const y = Math.sin(rad) * distance;
              const size = 6 + (i % 3) * 2;
              const delay = 0.15 + i * 0.015;
              const duration = 0.6 + (i % 4) * 0.08;
              const colorClass = BURST_COLORS[i % BURST_COLORS.length];
              return (
                <motion.div
                  key={i}
                  className={`absolute left-1/2 top-[4.5rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80 ${colorClass}`}
                  style={{ width: size, height: size }}
                  initial={{ opacity: 0.9, scale: 0.3 }}
                  animate={{
                    opacity: 0,
                    scale: 1.5,
                    x,
                    y,
                  }}
                  transition={{
                    duration,
                    delay,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                />
              );
            })}

          {/* Success icon with ring burst */}
          <div className="relative flex justify-center">
            <motion.div
              className="absolute h-16 w-16 rounded-full bg-emerald-500/20 dark:bg-emerald-500/30"
              initial={reducedMotion ? false : { scale: 0.5, opacity: 0.8 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
              }}
            />
            <motion.div
              className="relative flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 dark:bg-emerald-600"
              initial={reducedMotion ? false : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 15,
                delay: 0.1,
              }}
            >
              <motion.svg
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <motion.path
                  d="M5 13l4 4L19 7"
                  initial={reducedMotion ? false : { pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    pathLength: { duration: 0.4, delay: 0.3 },
                    opacity: { duration: 0.2, delay: 0.2 },
                  }}
                />
              </motion.svg>
            </motion.div>
          </div>

          {/* Title */}
          <motion.h2
            id="success-modal-title"
            className="mt-6 text-center text-xl font-semibold text-slate-900 dark:text-slate-100"
            initial={reducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            {t("enrollment.successModalTitle")}
          </motion.h2>

          {/* Description */}
          <motion.p
            className="mt-3 text-center text-sm text-slate-600 dark:text-slate-400"
            initial={reducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            {t("enrollment.successModalMessage")}
          </motion.p>

          {/* Okay button */}
          <motion.div
            className="mt-8 flex justify-center"
            initial={reducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <button
              type="button"
              onClick={handleOkay}
              className="w-full max-w-[200px] rounded-xl bg-emerald-500 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-offset-slate-900"
            >
              {t("enrollment.successModalOkay")}
            </button>
          </motion.div>

          {/* View plan details link */}
          <motion.div
            className="mt-4 flex justify-center"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <button
              type="button"
              onClick={handleViewPlanDetails}
              className="text-sm font-medium text-slate-600 underline-offset-2 hover:underline dark:text-slate-400 dark:hover:text-slate-300"
            >
              {t("enrollment.successModalViewPlan")}
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}

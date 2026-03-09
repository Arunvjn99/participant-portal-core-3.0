import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import {
  ENROLLMENT_V2_STEP_PATHS,
  ENROLLMENT_V2_STEP_LABEL_KEYS,
  getV2StepIndex,
} from "../../features/enrollment/config/stepConfig";

/**
 * V2 step indicator — 6 steps; current step from pathname.
 * Animated step change and hover; uses theme tokens (dark-mode compatible).
 */
export function StepIndicatorV2() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const currentStep = getV2StepIndex(pathname);

  const stepLabels = ENROLLMENT_V2_STEP_PATHS.map(
    (p) => t(ENROLLMENT_V2_STEP_LABEL_KEYS[p] ?? "")
  );

  return (
    <div className="w-full" role="navigation" aria-label="Enrollment steps">
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4">
        {ENROLLMENT_V2_STEP_PATHS.map((_, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isActive = isCompleted || isCurrent;

          return (
            <div key={ENROLLMENT_V2_STEP_PATHS[index]} className="flex items-center flex-1 min-w-0">
              <div className="flex items-center flex-1 gap-2 sm:gap-4 min-w-0">
                <motion.div
                  className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full flex-shrink-0 cursor-default"
                  initial={false}
                  animate={{
                    scale: 1,
                    backgroundColor: isActive
                      ? "var(--brand-primary)"
                      : "var(--border-subtle)",
                  }}
                  whileHover={{
                    scale: 1.08,
                    transition: { duration: 0.2 },
                  }}
                  transition={{
                    backgroundColor: { duration: 0.25 },
                  }}
                  style={{
                    boxShadow: isCurrent ? "var(--shadow-sm)" : undefined,
                  }}
                >
                  <AnimatePresence mode="wait">
                    {isCompleted ? (
                      <motion.span
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <Check
                          className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                          aria-hidden
                        />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="number"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="text-sm font-semibold text-white"
                        aria-current={isCurrent ? "step" : undefined}
                      >
                        {index + 1}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
                <motion.span
                  className={`text-sm sm:text-base font-medium whitespace-nowrap truncate transition-colors duration-200 ${
                    isActive
                      ? "text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)]"
                  }`}
                  animate={{
                    color: isActive
                      ? "var(--text-primary)"
                      : "var(--text-secondary)",
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {stepLabels[index]}
                </motion.span>
                {index < ENROLLMENT_V2_STEP_PATHS.length - 1 && (
                  <div
                    className="flex-1 h-px min-w-4 sm:min-w-8 hidden sm:block"
                    style={{
                      background: "var(--border-subtle)",
                    }}
                    aria-hidden
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

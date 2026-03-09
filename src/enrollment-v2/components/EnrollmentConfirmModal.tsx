/**
 * Enrollment success modal: confirmation animation, summary, "What Happens Next", Got It button.
 * Figma parity: backdrop blur, spring scale-in, gradient bar, confetti-style icons, checklist.
 */
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Sparkles, PartyPopper, CheckCircle2, Target } from "lucide-react";
import Button from "../../components/ui/Button";

export interface EnrollmentConfirmModalProps {
  open: boolean;
  onClose: () => void;
  selectedPlanName: string;
  successTitle?: string;
  successSubtitle?: string;
  message?: string;
  /** Optional "What Happens Next" bullets */
  nextSteps?: string[];
}

export function EnrollmentConfirmModal({
  open,
  onClose,
  selectedPlanName,
  successTitle = "Congratulations!",
  successSubtitle = "Enrollment Successful",
  message,
  nextSteps,
}: EnrollmentConfirmModalProps) {
  const { t } = useTranslation();
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white dark:bg-[var(--surface-1)] rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden border border-gray-200 dark:border-[var(--border-subtle)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-[var(--color-primary)]" />

            <div className="absolute top-10 left-10">
              <motion.div
                initial={{ scale: 0, rotate: 0 }}
                animate={{
                  scale: [0, 1.2, 1],
                  rotate: [0, 180, 360],
                  y: [0, -20, 0],
                }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Sparkles className="w-6 h-6 text-amber-400" />
              </motion.div>
            </div>
            <div className="absolute top-10 right-10">
              <motion.div
                initial={{ scale: 0, rotate: 0 }}
                animate={{
                  scale: [0, 1.2, 1],
                  rotate: [0, -180, -360],
                  y: [0, -20, 0],
                }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <PartyPopper className="w-6 h-6 text-purple-400" />
              </motion.div>
            </div>

            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full blur-xl opacity-50" />
                <div className="relative bg-gradient-to-br from-emerald-400 to-green-500 rounded-full p-6">
                  <CheckCircle2 className="w-16 h-16 text-white" strokeWidth={2.5} />
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-3"
            >
              <h2 className="text-3xl font-black text-gray-900 dark:text-[var(--text-primary)] mb-2">
                {successTitle}
              </h2>
              <p className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {successSubtitle}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6"
            >
              <p className="text-sm text-gray-500 dark:text-[var(--text-secondary)] text-center leading-relaxed mb-4">
                {message ??
                  `Your ${selectedPlanName} retirement plan has been successfully set up! Your contributions will begin with your next paycheck.`}
              </p>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-[var(--surface-2)] dark:to-[var(--surface-2)] rounded-xl p-4 border border-blue-200 dark:border-[var(--border-subtle)]">
                <h3 className="text-xs font-bold text-gray-900 dark:text-[var(--text-primary)] uppercase tracking-wide mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  What Happens Next
                </h3>
                <ul className="space-y-2 text-xs text-gray-500 dark:text-[var(--text-secondary)]">
                  {nextSteps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div
                        className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-1.5 flex-shrink-0"
                        style={{
                          backgroundColor: i === 0 ? "#3B82F6" : i === 1 ? "#06B6D4" : "#6366F1",
                        }}
                      />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                type="button"
                variant="primary"
                onClick={onClose}
                className="w-full py-4 px-6 text-base font-bold rounded-xl shadow-lg"
              >
                {t("enrollment.gotIt", "Got it")}
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

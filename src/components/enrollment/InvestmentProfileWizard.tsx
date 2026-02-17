import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { useEnrollment } from "../../enrollment/context/EnrollmentContext";
import { loadEnrollmentDraft, saveEnrollmentDraft } from "../../enrollment/enrollmentDraftStore";
import type {
  InvestmentProfile,
  RiskTolerance,
  InvestmentHorizon,
  InvestmentPreference,
} from "../../enrollment/types/investmentProfile";
import { DEFAULT_INVESTMENT_PROFILE } from "../../enrollment/types/investmentProfile";

/* ═══════════════════════════════════════════════════════
   STEP DATA (i18n keys)
   ═══════════════════════════════════════════════════════ */

const RISK_OPTIONS: { value: RiskTolerance; labelKey: string; shortKey: string; feedbackKey: string }[] = [
  { value: 1, labelKey: "enrollment.profileRisk1Label", shortKey: "enrollment.profileRisk1Short", feedbackKey: "enrollment.profileRisk1Feedback" },
  { value: 2, labelKey: "enrollment.profileRisk2Label", shortKey: "enrollment.profileRisk2Short", feedbackKey: "enrollment.profileRisk2Feedback" },
  { value: 3, labelKey: "enrollment.profileRisk3Label", shortKey: "enrollment.profileRisk3Short", feedbackKey: "enrollment.profileRisk3Feedback" },
  { value: 4, labelKey: "enrollment.profileRisk4Label", shortKey: "enrollment.profileRisk4Short", feedbackKey: "enrollment.profileRisk4Feedback" },
  { value: 5, labelKey: "enrollment.profileRisk5Label", shortKey: "enrollment.profileRisk5Short", feedbackKey: "enrollment.profileRisk5Feedback" },
];

const HORIZON_OPTIONS: { value: InvestmentHorizon; labelKey: string; icon: string; feedbackKey: string }[] = [
  { value: "< 5 years", labelKey: "enrollment.profileHorizon1Label", icon: "⏱", feedbackKey: "enrollment.profileHorizon1Feedback" },
  { value: "5–10 years", labelKey: "enrollment.profileHorizon2Label", icon: "📅", feedbackKey: "enrollment.profileHorizon2Feedback" },
  { value: "10–20 years", labelKey: "enrollment.profileHorizon3Label", icon: "📈", feedbackKey: "enrollment.profileHorizon3Feedback" },
  { value: "20+ years", labelKey: "enrollment.profileHorizon4Label", icon: "🚀", feedbackKey: "enrollment.profileHorizon4Feedback" },
];

const PREFERENCE_OPTIONS: { value: InvestmentPreference; labelKey: string; descKey: string; icon: string; feedbackKey: string }[] = [
  { value: "prefer recommended", labelKey: "enrollment.profilePref1Label", descKey: "enrollment.profilePref1Desc", icon: "✨", feedbackKey: "enrollment.profilePref1Feedback" },
  { value: "adjust allocations", labelKey: "enrollment.profilePref2Label", descKey: "enrollment.profilePref2Desc", icon: "🎛", feedbackKey: "enrollment.profilePref2Feedback" },
  { value: "full manual", labelKey: "enrollment.profilePref3Label", descKey: "enrollment.profilePref3Desc", icon: "⚙", feedbackKey: "enrollment.profilePref3Feedback" },
  { value: "advisor assistance", labelKey: "enrollment.profilePref4Label", descKey: "enrollment.profilePref4Desc", icon: "👤", feedbackKey: "enrollment.profilePref4Feedback" },
];

interface StepConfig {
  titleKey: string;
  subtitleKey: string;
  key: keyof InvestmentProfile;
}

const STEP_CONFIGS: StepConfig[] = [
  { titleKey: "enrollment.profileStep1Title", subtitleKey: "enrollment.profileStep1Subtitle", key: "riskTolerance" },
  { titleKey: "enrollment.profileStep2Title", subtitleKey: "enrollment.profileStep2Subtitle", key: "investmentHorizon" },
  { titleKey: "enrollment.profileStep3Title", subtitleKey: "enrollment.profileStep3Subtitle", key: "investmentPreference" },
];

/* ═══════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════ */

interface InvestmentProfileWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const InvestmentProfileWizard = ({
  isOpen,
  onClose,
  onComplete,
}: InvestmentProfileWizardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setInvestmentProfile, setInvestmentProfileCompleted } = useEnrollment();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<InvestmentProfile>>({});
  const [direction, setDirection] = useState(1);

  const config = STEP_CONFIGS[step - 1];
  const currentValue = profile[config.key];
  const canProceed = currentValue != null;

  const handleSelect = useCallback((key: keyof InvestmentProfile, value: unknown) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleBack = useCallback(() => {
    if (step > 1) {
      setDirection(-1);
      setStep(step - 1);
    }
  }, [step]);

  const handleNext = useCallback(() => {
    if (!canProceed) return;
    if (step < 3) {
      setDirection(1);
      setStep(step + 1);
    } else {
      const fullProfile: InvestmentProfile = {
        riskTolerance: (profile.riskTolerance ?? DEFAULT_INVESTMENT_PROFILE.riskTolerance) as RiskTolerance,
        investmentHorizon: (profile.investmentHorizon ?? DEFAULT_INVESTMENT_PROFILE.investmentHorizon) as InvestmentHorizon,
        investmentPreference: (profile.investmentPreference ?? DEFAULT_INVESTMENT_PROFILE.investmentPreference) as InvestmentPreference,
      };
      setInvestmentProfile(fullProfile);
      setInvestmentProfileCompleted(true);
      const draft = loadEnrollmentDraft();
      if (draft) {
        saveEnrollmentDraft({
          ...draft,
          investmentProfile: fullProfile,
          investmentProfileCompleted: true,
        });
      }
      onComplete();
      navigate("/enrollment/investments");
    }
  }, [step, canProceed, profile, setInvestmentProfile, setInvestmentProfileCompleted, onComplete, navigate]);

  const handleClose = useCallback(() => {
    setInvestmentProfile(DEFAULT_INVESTMENT_PROFILE);
    setInvestmentProfileCompleted(true);
    const draft = loadEnrollmentDraft();
    if (draft) {
      saveEnrollmentDraft({
        ...draft,
        investmentProfile: DEFAULT_INVESTMENT_PROFILE,
        investmentProfileCompleted: true,
      });
    }
    onClose();
    navigate("/enrollment/investments");
  }, [setInvestmentProfile, setInvestmentProfileCompleted, onClose, navigate]);

  /* ── Feedback message for current selection ── */
  const feedbackMessageKey = (() => {
    if (!currentValue) return null;
    if (step === 1) return RISK_OPTIONS.find((o) => o.value === currentValue)?.feedbackKey ?? null;
    if (step === 2) return HORIZON_OPTIONS.find((o) => o.value === currentValue)?.feedbackKey ?? null;
    return PREFERENCE_OPTIONS.find((o) => o.value === currentValue)?.feedbackKey ?? null;
  })();
  const feedbackMessage = feedbackMessageKey ? t(feedbackMessageKey) : null;

  /* ── Slide animation variants ── */
  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  /* Lock body scroll when wizard is open so modal is clearly on top */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const wizardContent = (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount container={document.body}>
            {/* Full-screen flex container: centers dialog on viewport and ensures high stacking order */}
            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
              {/* Overlay */}
              <Dialog.Overlay asChild forceMount>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                  style={{ background: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(8px)" }}
                />
              </Dialog.Overlay>

              {/* Content — centered by flex parent, no fixed/translate so it always appears in center */}
              <Dialog.Content asChild forceMount
                aria-describedby={undefined}
                onPointerDownOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={() => handleClose()}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 12 }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  className="relative z-10 w-full max-w-[600px] max-h-[90vh] overflow-y-auto focus:outline-none rounded-3xl"
                  style={{
                    background: "var(--enroll-card-bg)",
                    border: "1px solid var(--enroll-card-border)",
                    boxShadow: "0 24px 64px rgba(0, 0, 0, 0.12), 0 0 80px rgb(var(--enroll-brand-rgb) / 0.06)",
                  }}
                >
                {/* ── Radial glow accent ── */}
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] pointer-events-none"
                  style={{
                    background: "radial-gradient(ellipse at center, rgb(var(--enroll-brand-rgb) / 0.06) 0%, transparent 70%)",
                  }}
                />

                <div className="relative p-6 md:p-8">
                  {/* ── Header ── */}
                  <div className="flex items-start justify-between gap-3 mb-6">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                        style={{ background: "rgb(var(--enroll-brand-rgb) / 0.1)", color: "var(--enroll-brand)" }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
                        </svg>
                      </div>
                      <div>
                        <Dialog.Title asChild>
                          <p className="text-sm font-bold" style={{ color: "var(--enroll-text-primary)" }}>
                            {t("enrollment.investmentProfile")}
                          </p>
                        </Dialog.Title>
                        <p className="text-[11px] mt-0.5" style={{ color: "var(--enroll-text-muted)" }}>
                          {t("enrollment.investmentProfileSubtitle")}
                        </p>
                      </div>
                    </div>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border-none cursor-pointer transition-colors"
                        style={{ background: "var(--enroll-soft-bg)", color: "var(--enroll-text-muted)" }}
                        aria-label={t("enrollment.closeWizardAria")}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </Dialog.Close>
                  </div>

                  {/* ── Animated progress ── */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {[1, 2, 3].map((s) => (
                          <div
                            key={s}
                            className="flex items-center gap-1.5"
                          >
                            <motion.div
                              animate={{
                                background: s <= step ? "var(--enroll-brand)" : "var(--enroll-card-border)",
                                scale: s === step ? 1 : 0.85,
                              }}
                              transition={{ duration: 0.3 }}
                              className="h-2 rounded-full"
                              style={{ width: s === step ? 24 : 8 }}
                            />
                          </div>
                        ))}
                      </div>
                      <span className="text-[11px] font-semibold" style={{ color: "var(--enroll-text-muted)" }}>
                        {t("enrollment.stepOf3", { current: step })}
                      </span>
                    </div>
                  </div>

                  {/* ── Step content (animated) ── */}
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={step}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    >
                      {/* Question */}
                      <h3 className="text-lg md:text-xl font-bold leading-snug mb-1.5" style={{ color: "var(--enroll-text-primary)" }}>
                        {t(config.titleKey)}
                      </h3>
                      <p className="text-sm mb-5" style={{ color: "var(--enroll-text-secondary)" }}>
                        {t(config.subtitleKey)}
                      </p>

                      {/* Options */}
                      {step === 1 && <RiskSpectrum value={currentValue as RiskTolerance | undefined} onSelect={(v) => handleSelect("riskTolerance", v)} />}
                      {step === 2 && <HorizonTiles value={currentValue as InvestmentHorizon | undefined} onSelect={(v) => handleSelect("investmentHorizon", v)} />}
                      {step === 3 && <PreferenceTiles value={currentValue as InvestmentPreference | undefined} onSelect={(v) => handleSelect("investmentPreference", v)} />}

                      {/* Micro feedback */}
                      <AnimatePresence mode="wait">
                        {feedbackMessage && (
                          <motion.div
                            key={feedbackMessage}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-2 mt-4 px-3 py-2 rounded-xl"
                            style={{ background: "rgb(var(--enroll-accent-rgb) / 0.06)", border: "1px solid rgb(var(--enroll-accent-rgb) / 0.12)" }}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--enroll-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                            <span className="text-xs font-medium" style={{ color: "var(--enroll-accent)" }}>{feedbackMessage}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </AnimatePresence>

                  {/* ── Footer ── */}
                  <div className="flex items-center justify-between gap-3 mt-6 pt-5" style={{ borderTop: "1px solid var(--enroll-card-border)" }}>
                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={step === 1}
                      className="px-5 py-2.5 text-xs font-semibold rounded-xl border-none cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      style={{ background: "var(--enroll-soft-bg)", color: "var(--enroll-text-secondary)" }}
                    >
                      {t("enrollment.back")}
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={!canProceed}
                      className="px-6 py-2.5 text-xs font-bold rounded-xl border-none cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      style={{
                        background: canProceed ? "var(--enroll-brand)" : "var(--enroll-card-border)",
                        color: canProceed ? "white" : "var(--enroll-text-muted)",
                        boxShadow: canProceed ? "0 4px 12px rgb(var(--enroll-brand-rgb) / 0.2)" : "none",
                      }}
                    >
                      {step < 3 ? t("enrollment.continue") : t("enrollment.buildMyPortfolio")}
                    </button>
                  </div>

                  {/* ── Disclaimer (subtle) ── */}
                  <p className="text-[10px] mt-4 leading-relaxed text-center" style={{ color: "var(--enroll-text-muted)", opacity: 0.7 }}>
                    {t("enrollment.profileDisclaimer")}
                  </p>
                </div>
              </motion.div>
            </Dialog.Content>
            </div>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );

  return wizardContent;
};

/* ═══════════════════════════════════════════════════════
   RISK SPECTRUM (Step 1)
   Interactive horizontal spectrum with 5 selectable nodes
   ═══════════════════════════════════════════════════════ */

function RiskSpectrum({ value, onSelect }: { value?: RiskTolerance; onSelect: (v: RiskTolerance) => void }) {
  const { t } = useTranslation();
  return (
    <div>
      {/* Spectrum bar with nodes */}
      <div className="relative flex items-center justify-between px-1 mb-3">
        {/* Track */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full" style={{ background: "var(--enroll-card-border)" }}>
          {value && (
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((value - 1) / 4) * 100}%` }}
              transition={{ duration: 0.3 }}
              style={{ background: "var(--enroll-brand)" }}
            />
          )}
        </div>

        {/* Nodes */}
        {RISK_OPTIONS.map((opt) => {
          const isSelected = value === opt.value;
          const isPast = value !== undefined && opt.value <= value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSelect(opt.value)}
              className="relative z-10 flex flex-col items-center gap-1.5 border-none cursor-pointer bg-transparent p-0 group"
              aria-label={t(opt.labelKey)}
            >
              <motion.div
                animate={{
                  scale: isSelected ? 1.2 : 1,
                  background: isPast ? "var(--enroll-brand)" : "var(--enroll-card-bg)",
                  borderColor: isPast ? "var(--enroll-brand)" : "var(--enroll-card-border)",
                  boxShadow: isSelected ? "0 0 0 6px rgb(var(--enroll-brand-rgb) / 0.12)" : "none",
                }}
                transition={{ duration: 0.25 }}
                className="h-6 w-6 rounded-full"
                style={{ border: "2px solid var(--enroll-card-border)" }}
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="h-full w-full rounded-full flex items-center justify-center"
                  >
                    <div className="h-2 w-2 rounded-full bg-white" />
                  </motion.div>
                )}
              </motion.div>
            </button>
          );
        })}
      </div>

      {/* Labels */}
      <div className="flex items-center justify-between px-0">
        {RISK_OPTIONS.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSelect(opt.value)}
              className="flex flex-col items-center gap-0 border-none cursor-pointer bg-transparent p-0 min-w-0"
              style={{ width: "20%" }}
            >
              <span
                className="text-[10px] font-semibold text-center leading-tight transition-colors"
                style={{ color: isSelected ? "var(--enroll-brand)" : "var(--enroll-text-muted)" }}
              >
                {t(opt.shortKey)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   HORIZON TILES (Step 2)
   ═══════════════════════════════════════════════════════ */

function HorizonTiles({ value, onSelect }: { value?: InvestmentHorizon; onSelect: (v: InvestmentHorizon) => void }) {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-2 gap-2">
      {HORIZON_OPTIONS.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <motion.button
            key={opt.value}
            type="button"
            onClick={() => onSelect(opt.value)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 p-4 rounded-xl border-none cursor-pointer text-left transition-colors"
            style={{
              background: isSelected ? "rgb(var(--enroll-brand-rgb) / 0.06)" : "var(--enroll-soft-bg)",
              border: isSelected ? "1.5px solid var(--enroll-brand)" : "1.5px solid var(--enroll-card-border)",
              boxShadow: isSelected ? "0 0 0 4px rgb(var(--enroll-brand-rgb) / 0.08)" : "none",
            }}
          >
            <span className="text-xl">{opt.icon}</span>
            <div>
              <p
                className="text-sm font-bold"
                style={{ color: isSelected ? "var(--enroll-brand)" : "var(--enroll-text-primary)" }}
              >
                {t(opt.labelKey)}
              </p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PREFERENCE TILES (Step 3)
   ═══════════════════════════════════════════════════════ */

function PreferenceTiles({ value, onSelect }: { value?: InvestmentPreference; onSelect: (v: InvestmentPreference) => void }) {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-2 gap-2">
      {PREFERENCE_OPTIONS.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <motion.button
            key={opt.value}
            type="button"
            onClick={() => onSelect(opt.value)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center gap-1.5 p-4 rounded-xl border-none cursor-pointer text-center transition-colors"
            style={{
              background: isSelected ? "rgb(var(--enroll-brand-rgb) / 0.06)" : "var(--enroll-soft-bg)",
              border: isSelected ? "1.5px solid var(--enroll-brand)" : "1.5px solid var(--enroll-card-border)",
              boxShadow: isSelected ? "0 0 0 4px rgb(var(--enroll-brand-rgb) / 0.08)" : "none",
            }}
          >
            <span className="text-xl">{opt.icon}</span>
            <p
              className="text-xs font-bold"
              style={{ color: isSelected ? "var(--enroll-brand)" : "var(--enroll-text-primary)" }}
            >
              {t(opt.labelKey)}
            </p>
            <p className="text-[10px]" style={{ color: "var(--enroll-text-muted)" }}>{t(opt.descKey)}</p>
          </motion.button>
        );
      })}
    </div>
  );
}

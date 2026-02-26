import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowRight, Compass, Clock } from "lucide-react";
import { FloatingCards } from "./FloatingCards";
import { PersonalizePlanModal } from "../enrollment/PersonalizePlanModal";
import { useUser } from "../../context/UserContext";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
};

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
  },
};

export const HeroSection = () => {
  const { t } = useTranslation();
  const { profile } = useUser();
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const displayName = profile?.name || "there";

  const greetingLine = useMemo(() => {
    const hour = typeof document !== "undefined" ? new Date().getHours() : 12;
    const key = hour >= 5 && hour < 12 ? "dashboard.greetingMorning" : hour >= 12 && hour < 17 ? "dashboard.greetingAfternoon" : hour >= 17 && hour < 21 ? "dashboard.greetingEvening" : "dashboard.greetingWelcomeBack";
    return t(key);
  }, [t]);

  return (
    <>
    <section className="relative w-full overflow-hidden rounded-2xl">
      {/* Background depth – radial gradients + optional noise */}
      <div
        className="pre-enrollment-hero-bg pre-enrollment-hero-noise absolute inset-0 -z-10"
        aria-hidden
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent to-[var(--surface-1)]/80" />

      <div className="relative flex flex-col lg:flex-row lg:items-center gap-8 sm:gap-10 lg:gap-16 pt-8 pb-10 sm:pt-14 sm:pb-16 lg:pt-20 lg:pb-24 px-0 min-h-0">
        {/* Left: content */}
        <motion.div
          className="flex-1 w-full min-w-0 flex flex-col justify-center min-h-0"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-success)]/10 border border-[var(--color-success)]/10 w-fit mb-4 sm:mb-6"
          >
            <div className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
            <span className="text-xs font-bold text-[var(--color-success)] uppercase tracking-wide">
              {t("dashboard.enrollmentOpen")}
            </span>
          </motion.div>

          {/* 1. Smallest: greeting */}
          <motion.p
            variants={fadeUp}
            className="text-xs sm:text-sm font-medium text-[var(--color-textSecondary)] mb-2 leading-snug"
          >
            {greetingLine}
          </motion.p>

          {/* 2. Medium: user name (~20–30% smaller than headline; wraps cleanly) */}
          <motion.h1
            variants={fadeUp}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold text-[var(--color-text)] leading-tight tracking-tight mb-3 sm:mb-4 break-words"
          >
            {displayName}
          </motion.h1>

          {/* 3. Largest: hero headline (visually dominant) */}
          <motion.h2
            variants={fadeUp}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-bold text-[var(--color-text)] leading-[1.08] tracking-tight mb-4 sm:mb-6"
          >
            {t("dashboard.heroTitlePart1")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-primary)] to-[var(--color-primary)]">
              {t("dashboard.heroTitlePart2")}
            </span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-sm sm:text-base md:text-lg text-[var(--color-textSecondary)] max-w-lg leading-relaxed mb-6 sm:mb-8 md:mb-10"
          >
            {t("dashboard.heroSubtitle")}
          </motion.p>

          {/* CTA group: align by top so both buttons share baseline; identical h, py, font, radius; chip below primary only */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 mb-8 sm:mb-10"
          >
            <div className="flex flex-col items-start w-full sm:w-auto">
              <motion.button
                type="button"
                onClick={() => setIsWizardOpen(true)}
                className="group relative inline-flex h-11 sm:h-12 items-center justify-center gap-2 px-6 py-0 w-full sm:w-auto bg-primary hover:bg-primary-hover text-white rounded-2xl text-sm font-semibold leading-none shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                {t("dashboard.startEnrollment")}
                <ArrowRight
                  size={18}
                  className="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                />
              </motion.button>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-background-secondary)] px-3 py-1.5 text-xs text-[var(--color-textSecondary)] mt-2">
                <Clock size={12} className="shrink-0" aria-hidden />
                {t("dashboard.takesMinutes")}
              </span>
            </div>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex h-11 sm:h-12 items-center justify-center gap-2 px-6 py-0 w-full sm:w-auto bg-[var(--color-surface)] text-[var(--color-text)] border-2 border-[var(--color-border)] rounded-2xl text-sm font-semibold leading-none hover:bg-[var(--color-surface)] hover:border-[var(--color-border)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--border-subtle)] focus:ring-offset-2 box-border"
            >
              <Compass size={18} className="shrink-0" />
              {t("dashboard.exploreOptions")}
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Right: floating cards (desktop) / fallback card (mobile/tablet) */}
        <motion.div
          className="flex-1 w-full min-w-0 relative flex items-center justify-center shrink-0 lg:shrink"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Floating cards: visible from md (768px) up with responsive layout */}
          <div className="hidden md:block w-full min-h-[380px] md:h-[480px] lg:h-[520px] xl:h-[600px] relative">
            <FloatingCards />
          </div>
          {/* Mobile-only fallback (below md) */}
          <div className="md:hidden w-full max-w-[260px] sm:max-w-[320px] aspect-square bg-gradient-to-br from-[var(--brand-primary)]/10 to-[var(--color-primary)]/5 rounded-2xl sm:rounded-3xl flex items-center justify-center relative overflow-hidden shadow-lg mx-auto">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            <div className="text-center p-6 sm:p-8">
              <h3 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-2">$1.2M</h3>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] font-medium">{t("dashboard.projectedFutureValue")}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
    <PersonalizePlanModal
      isOpen={isWizardOpen}
      onClose={() => setIsWizardOpen(false)}
      userName={displayName}
    />
    </>
  );
};

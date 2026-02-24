import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowRight, Compass } from "lucide-react";
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

  return (
    <>
    <section className="relative w-full overflow-hidden rounded-2xl">
      {/* Background depth – radial gradients + optional noise */}
      <div
        className="pre-enrollment-hero-bg pre-enrollment-hero-noise absolute inset-0 -z-10"
        aria-hidden
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent to-slate-50/80" />

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

          <motion.h2
            variants={fadeUp}
            className="text-xl md:text-2xl font-medium text-[var(--color-textSecondary)] mb-3"
          >
            {t("dashboard.greeting", { name: displayName })}
          </motion.h2>

          <motion.h1
            variants={fadeUp}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-[var(--color-text)] leading-[1.08] tracking-tight mb-4 sm:mb-6"
          >
            {t("dashboard.heroTitlePart1")}{" "}
            <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">
              {t("dashboard.heroTitlePart2")}
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-sm sm:text-base md:text-lg text-[var(--color-textSecondary)] max-w-lg leading-relaxed mb-6 sm:mb-8 md:mb-10"
          >
            {t("dashboard.heroSubtitle")}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10"
          >
            <motion.button
              type="button"
              onClick={() => setIsWizardOpen(true)}
              className="group relative inline-flex items-center justify-center gap-2 px-5 py-3 sm:px-6 sm:py-3.5 md:px-8 md:py-4 w-full sm:w-auto bg-primary hover:bg-primary-hover text-white rounded-2xl font-semibold text-sm sm:text-base shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              {t("dashboard.startEnrollment")}
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:px-6 sm:py-3.5 md:px-8 md:py-4 w-full sm:w-auto bg-[var(--color-surface)] text-[var(--color-text)] border-2 border-[var(--color-border)] rounded-2xl font-semibold text-sm sm:text-base hover:bg-[var(--color-surface)] hover:border-[var(--color-border)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2"
            >
              <Compass size={18} />
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
          <div className="md:hidden w-full max-w-[260px] sm:max-w-[320px] aspect-square bg-gradient-to-br from-brand-100 to-indigo-50 rounded-2xl sm:rounded-3xl flex items-center justify-center relative overflow-hidden shadow-lg mx-auto">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            <div className="text-center p-6 sm:p-8">
              <h3 className="text-2xl sm:text-3xl font-bold text-brand-900 mb-2">$1.2M</h3>
              <p className="text-sm sm:text-base text-brand-700 font-medium">{t("dashboard.projectedFutureValue")}</p>
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

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Info } from "lucide-react";
import Button from "../ui/Button";
import { PersonalizePlanModal } from "../enrollment/PersonalizePlanModal";
import { useUser } from "../../context/UserContext";

const HERO_ILLUSTRATION_SRC = "/image/hero-dashboard-illustration.png";

export interface HeroSectionProps {
  /** When set, primary CTA navigates to this path instead of opening the personalization modal. */
  primaryCtaTo?: string;
  /** When set, primary CTA calls this callback (e.g. open Personalize wizard) instead of linking. Takes precedence over primaryCtaTo. */
  onPrimaryClick?: () => void;
}

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

export const HeroSection = ({ primaryCtaTo, onPrimaryClick }: HeroSectionProps = {}) => {
  const { t } = useTranslation();
  const { profile } = useUser();
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const displayName = profile?.name || "there";
  const handlePrimary = onPrimaryClick ?? (() => setIsWizardOpen(true));
  const useLink = !onPrimaryClick && primaryCtaTo;

  return (
    <>
      <section className="relative w-full overflow-hidden rounded-2xl">
        {/* Background depth – radial gradients + optional noise */}
        <div
          className="pre-enrollment-hero-bg pre-enrollment-hero-noise absolute inset-0 -z-10"
          aria-hidden
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent to-[var(--surface-1)]/80" />

        <div className="relative grid lg:grid-cols-2 gap-12 items-center py-12">
          {/* Left: content */}
          <motion.div
            className="flex flex-col justify-center min-h-0 space-y-6"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeUp} className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-success)]/10 border border-[var(--color-success)]/20 text-[var(--color-success)] w-fit">
                <div className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wide">
                  {t("dashboard.enrollmentOpenUntil", "Enrollment open until Oct 31")}
                </span>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-0">
              <p className="text-body-sm text-[var(--color-text-secondary)]">
                {t("dashboard.greetingTitle")} {displayName}
              </p>
              <h1 className="text-5xl lg:text-6xl font-bold text-[var(--color-text)] leading-tight mt-1">
                {t("dashboard.heroTitlePart1")}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-primary)] to-[var(--color-primary)]">
                  {t("dashboard.heroTitlePart2")}
                </span>
              </h1>
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="text-heading-md text-[var(--color-text-secondary)] max-w-lg"
            >
              {t("dashboard.heroSubtitle")}
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex gap-3 mt-6"
            >
              {useLink ? (
                <Link
                  to={primaryCtaTo!}
                  className="button button--primary group inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
                >
                  {t("dashboard.startMyRegistration", "Start my registration")}
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  onClick={handlePrimary}
                  className="group h-11 px-5 rounded-lg shadow-sm"
                >
                  {t("dashboard.startMyRegistration", "Start my registration")}
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                className="h-11 px-5 rounded-lg"
              >
                <Info size={18} />
                {t("dashboard.learnMoreAboutRegistration", "Learn more about registration")}
              </Button>
            </motion.div>

            <motion.span
              variants={fadeUp}
              className="inline-flex w-fit items-center rounded-full border border-[var(--color-border)] bg-[var(--color-background-secondary)] px-4 py-2 text-body text-[var(--color-text-secondary)]"
            >
              {t("dashboard.takesMinutes")}
            </motion.span>
          </motion.div>

          {/* Right: hero illustration – no card wrapper */}
          <motion.div
            className="relative flex items-center justify-end"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <img
              src={HERO_ILLUSTRATION_SRC}
              alt={t("dashboard.heroIllustrationAlt", "Retirement dashboard illustration")}
              className="w-[560px] lg:w-[640px] object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                const parent = (e.target as HTMLImageElement).parentElement;
                const placeholder = parent?.querySelector("[data-hero-placeholder]") as HTMLElement;
                if (placeholder) placeholder.classList.remove("hidden");
              }}
              width={560}
              height={440}
              fetchPriority="high"
            />
            <div data-hero-placeholder className="hidden absolute inset-0 flex items-center justify-center text-[var(--color-text-secondary)] text-body-sm">
              {t("dashboard.heroIllustrationPlaceholder", "Illustration placeholder")}
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

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowRight, Shield, TrendingUp } from "lucide-react";
import { PersonalizePlanModal } from "@/components/enrollment/PersonalizePlanModal";
import { useUser } from "@/context/UserContext";
import { safeT } from "@/lib/safeT";
import { motionTokens } from "./motion";

const ease = motionTokens.ease;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: motionTokens.slow.duration, ease } },
};

const floatTransition = {
  duration: 5,
  ease: "easeInOut" as const,
  repeat: Infinity,
  repeatType: "loop" as const,
};

export function CrpPreEnrollmentHero() {
  const { t } = useTranslation();
  const { profile } = useUser();
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const displayName =
    profile?.name?.trim() || safeT(t, "dashboard.greetingFallbackName", "there");

  const h = new Date().getHours();
  const greetingPrefix =
    h < 12
      ? safeT(t, "dashboard.greetingMorning", "Good morning")
      : h < 17
        ? safeT(t, "dashboard.greetingAfternoon", "Good afternoon")
        : safeT(t, "dashboard.greetingEvening", "Good evening");
  const greetingPill = `${greetingPrefix}, ${displayName}`;

  const scrollToLearnMore = () => {
    document.getElementById("learn-more")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-gradient-to-b from-primary/[0.07] via-background to-background dark:from-background dark:via-background dark:to-background"
      aria-label="Welcome hero"
    >
      <div
        className="pointer-events-none absolute -left-48 -top-48 size-[800px] rounded-full bg-primary/[0.08] blur-3xl dark:bg-primary/[0.06]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-40 size-[600px] rounded-full bg-primary/[0.07] blur-3xl dark:bg-primary/[0.04]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 size-[400px] -translate-x-1/2 rounded-full bg-primary/[0.05] blur-3xl dark:bg-primary/[0.03]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-transparent via-background/55 to-background"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-primary/[0.06] via-transparent to-primary/[0.06] dark:from-background/70 dark:via-transparent dark:to-background/70"
        aria-hidden
      />

      <div className="relative z-20 mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-24">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-7"
          >
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary shadow-sm backdrop-blur-sm dark:border-primary/20 dark:bg-primary/10">
                <span className="size-1.5 animate-pulse rounded-full bg-primary" aria-hidden />
                {greetingPill}
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-foreground md:text-[3.25rem]"
            >
              {safeT(t, "dashboard.heroTitlePart1", "Let's build your")}{" "}
              <span className="text-primary">
                {safeT(t, "dashboard.heroTitlePart2", "future, together.")}
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="max-w-[440px] text-pretty text-[1.0625rem] leading-relaxed text-muted-foreground"
            >
              {safeT(
                t,
                "dashboard.heroSubtitle",
                "You're one step away from activating your 401(k). We've simplified everything so you can focus on what matters.",
              )}
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap items-start gap-3 pt-1">
              <div className="flex flex-col items-stretch gap-2">
                <motion.button
                  type="button"
                  onClick={() => setIsWizardOpen(true)}
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: motionTokens.fast.duration, ease }}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label={safeT(t, "dashboard.startEnrollment", "Start My Enrolment")}
                >
                  {safeT(t, "dashboard.startEnrollment", "Start My Enrolment")}
                  <ArrowRight className="size-4" aria-hidden />
                </motion.button>
                <p className="text-center text-xs font-medium text-muted-foreground/75 sm:text-left">
                  {safeT(
                    t,
                    "dashboard.heroTrustLine",
                    "It only takes 5 minutes",
                  )}
                </p>
              </div>

              <motion.div
                className="flex items-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: motionTokens.fast.duration, ease }}
              >
                <button
                  type="button"
                  onClick={scrollToLearnMore}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-border/60 bg-background-secondary/85 px-7 text-sm font-medium text-foreground/90 backdrop-blur-sm transition-all duration-300 hover:border-border hover:bg-background-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {safeT(t, "dashboard.heroLearnMoreCta", "Learn about the plan")}
                </button>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -16, 0] }}
            transition={floatTransition}
            className="flex items-center justify-center"
            aria-hidden
          >
            <div className="absolute size-80 rounded-full bg-primary/10 blur-3xl md:size-[420px]" />
            <div className="absolute size-56 rounded-full bg-primary/10 blur-2xl md:size-72" />

            <div className="relative flex size-[280px] items-center justify-center rounded-3xl border border-border/50 bg-card/70 shadow-2xl shadow-primary/[0.12] backdrop-blur-xl dark:border-border/60 dark:bg-card/55 dark:shadow-black/40 md:size-[360px]">
              <div className="absolute size-56 rounded-full border border-primary/[0.12] md:size-[280px]" />
              <div className="absolute size-40 rounded-full border border-primary/[0.18] md:size-[200px]" />
              <div className="absolute size-24 rounded-full border border-primary/[0.24] md:size-28" />

              <div className="absolute size-32 rounded-full bg-primary/[0.06] blur-xl md:size-40" />

              <div className="relative flex size-20 flex-col items-center justify-center rounded-2xl bg-primary shadow-xl shadow-primary/40">
                <span className="text-3xl font-bold leading-none text-primary-foreground">C</span>
                <span className="mt-0.5 text-[9px] font-bold tracking-[0.22em] text-primary-foreground/60">
                  CORE
                </span>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.7, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.45, duration: motionTokens.normal.duration, ease }}
                className="absolute -right-7 -top-7 flex items-center gap-2.5 rounded-2xl border border-border/60 bg-card/95 px-4 py-3 shadow-xl shadow-primary/[0.1] backdrop-blur-md dark:border-border dark:bg-card/90 dark:shadow-black/30"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 dark:bg-emerald-400/15">
                  <Shield className="size-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden />
                </span>
                <div>
                  <p className="text-[10px] font-medium leading-none text-muted-foreground">
                    {safeT(t, "dashboard.heroBadgeRetirementLabel", "Retirement")}
                  </p>
                  <p className="mt-0.5 text-sm font-bold leading-none text-foreground">
                    {safeT(t, "dashboard.heroBadgePlanActive", "Plan Active")}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.7, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.65, duration: motionTokens.normal.duration, ease }}
                className="absolute -bottom-7 -left-7 flex items-center gap-2.5 rounded-2xl border border-border/60 bg-card/95 px-4 py-3 shadow-xl shadow-primary/[0.1] backdrop-blur-md dark:border-border dark:bg-card/90 dark:shadow-black/30"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="size-3.5 text-primary" aria-hidden />
                </span>
                <div>
                  <p className="text-[10px] font-medium leading-none text-muted-foreground">
                    {safeT(t, "dashboard.heroBadgeContributionsLabel", "Contributions")}
                  </p>
                  <p className="mt-0.5 text-sm font-bold leading-none text-foreground">
                    {safeT(t, "dashboard.heroBadgeOnTrack", "On Track")}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <PersonalizePlanModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        userName={displayName}
      />
    </section>
  );
}

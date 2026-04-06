import { useState } from "react";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import { PersonalizePlanModal } from "../enrollment/PersonalizePlanModal";
import { ArrowUpRightIcon } from "@/assets/dashboard/icons";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useResolvedUIAsset } from "@/hooks/useResolvedUIAsset";
import { isVideoAssetUrl } from "@/lib/isVideoAssetUrl";

interface HeroEnrollmentCardProps {
  /** Single-line greeting (legacy). If greetingTitle + userName are set, they are shown on two lines instead. */
  greeting?: string;
  /** Greeting phrase for first line (e.g. "Good Morning"). Shown with userName on second line when both set. */
  greetingTitle?: string;
  /** User name on second line when greetingTitle is set. */
  userName?: string;
  headline?: string;
  description?: string;
  /** Hero illustration image. Uses placeholder if not provided. */
  heroImageSrc?: string;
  /** Enrollment badge text. Hidden if empty. */
  enrollmentBadge?: string;
  /** Primary CTA button label (e.g. "Start My Enrollment"). */
  primaryCtaLabel?: string;
  /** Second line inside the primary CTA (e.g. "It only takes 5 minutes"). Hidden if empty. */
  ctaChip?: string;
  /** Floating insight card: plan name */
  insightPlanName?: string;
  /** Floating insight card: balance label */
  insightBalanceLabel?: string;
  /** Floating insight card: balance value */
  insightBalanceValue?: string;
}

export const HeroEnrollmentCard = ({
  greeting = "Welcome back",
  greetingTitle,
  userName,
  headline = "Get started with your 401(k)",
  description = "Enroll in your retirement plan today and start building your financial future. The process is simple and takes just a few minutes.",
  heroImageSrc,
  enrollmentBadge = "+ ENROLMENT OPEN",
  primaryCtaLabel,
  ctaChip,
  insightPlanName = "Plan: Roth 401(k)",
  insightBalanceLabel = "Current Balance",
  insightBalanceValue = "$12,500",
}: HeroEnrollmentCardProps) => {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const reduced = useReducedMotion();
  const defaultHeroSrc = useResolvedUIAsset("dashboardHero");
  const effectiveHeroSrc = (heroImageSrc ?? defaultHeroSrc).trim();
  const heroIsVideo = effectiveHeroSrc ? isVideoAssetUrl(effectiveHeroSrc) : false;

  const handleEnrollClick = () => {
    setIsWizardOpen(true);
  };

  return (
    <>
      <section
        className="relative overflow-hidden rounded-2xl elevation-1 bg-[var(--surface-1)] p-6 md:p-8"
      >
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-10">
          {/* Left: copy, badge, CTA - stagger first */}
          <motion.div
            initial={reduced ? {} : { opacity: 0, y: 8 }}
            animate={reduced ? {} : { opacity: 1, y: 0 }}
            transition={reduced ? {} : { duration: 0.3, ease: [0.25, 0.1, 0.25, 1], delay: 0 }}
            className="flex flex-1 flex-col items-start gap-4 lg:order-1"
          >
            {enrollmentBadge && (
              <span className="rounded-full bg-green-500/80 px-4 py-1.5 text-xs font-semibold text-white">
                {enrollmentBadge}
              </span>
            )}
            <p className="font-medium text-[var(--color-textSecondary)]">
              {greetingTitle != null && userName != null ? (
                <>
                  <span className="block text-sm">{greetingTitle}</span>
                  <span className="block text-xl font-semibold text-[var(--color-text)]">{userName}</span>
                </>
              ) : (
                greeting
              )}
            </p>
            <h1 className="text-2xl font-bold leading-tight text-[var(--color-text)] md:text-3xl">
              {headline}
            </h1>
            <p className="text-base leading-relaxed text-[var(--color-textSecondary)]">
              {description}
            </p>
            <Button
              className="group flex w-full max-w-md flex-col items-center justify-center rounded-xl px-6 py-4 font-semibold text-white bg-[var(--color-primary)] transition-all duration-200 hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2 shadow-md hover:shadow-lg motion-safe:hover:scale-[1.01] sm:w-auto sm:min-w-[220px]"
              onClick={handleEnrollClick}
            >
              <span className="text-base leading-tight">{primaryCtaLabel ?? "Enroll Now"}</span>
              {ctaChip ? (
                <span className="mt-1 text-center text-xs font-medium leading-snug text-white/80">
                  {ctaChip}
                </span>
              ) : null}
            </Button>
          </motion.div>

          {/* Right: illustration - stagger second */}
          <motion.div
            initial={reduced ? {} : { opacity: 0, y: 8 }}
            animate={reduced ? {} : { opacity: 1, y: 0 }}
            transition={reduced ? {} : { duration: 0.3, ease: [0.25, 0.1, 0.25, 1], delay: 0.08 }}
            className="relative order-first w-full shrink-0 lg:order-2 lg:min-w-[280px] lg:w-2/5"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[var(--color-background)]">
              {effectiveHeroSrc.trim() ? (
                heroIsVideo ? (
                  <video
                    src={effectiveHeroSrc}
                    className="h-full w-full object-cover"
                    autoPlay={!reduced}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-hidden
                  />
                ) : (
                  <img
                    src={effectiveHeroSrc}
                    alt=""
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%94a3b8' width='400' height='300'/%3E%3Ctext fill='%64748b' font-family='sans-serif' font-size='18' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle'%3EIllustration%3C/text%3E%3C/svg%3E";
                    }}
                  />
                )
              ) : null}
              {/* Floating insight card - stagger last */}
              <motion.div
                initial={reduced ? {} : { opacity: 0, y: 8 }}
                animate={reduced ? {} : { opacity: 1, y: 0 }}
                transition={reduced ? {} : { duration: 0.3, ease: [0.25, 0.1, 0.25, 1], delay: 0.16 }}
                className="absolute bottom-4 left-4 right-4 elevation-2 rounded-2xl bg-[var(--surface-1)] p-4 md:right-auto md:w-48"
              >
                <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-[var(--color-primary)]">
                  PERSONALISED INSIGHTS
                  <ArrowUpRightIcon size={12} className="shrink-0" />
                </p>
                <p className="text-sm font-medium text-[var(--color-text)]">
                  {insightPlanName}
                </p>
                <p className="mt-1 text-xs text-[var(--color-textSecondary)]">
                  {insightBalanceLabel}
                </p>
                <p className="text-xl font-bold text-[var(--color-text)]">
                  {insightBalanceValue}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      <PersonalizePlanModal isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} />
    </>
  );
};

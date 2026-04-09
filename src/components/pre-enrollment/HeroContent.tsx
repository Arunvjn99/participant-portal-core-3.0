import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { PersonalizePlanModal } from "@/components/enrollment/PersonalizePlanModal";
import { useUser } from "@/context/UserContext";
import { safeT } from "@/lib/safeT";

export function HeroContent() {
  const { t } = useTranslation();
  const { profile } = useUser();
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const displayName =
    profile?.name?.trim() || safeT(t, "dashboard.greetingFallbackName", "there");

  const scrollToLearning = () => {
    document.getElementById("recommended-learning")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div className="relative z-10 flex min-w-0 max-w-3xl flex-col text-left">
        <p className="mb-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {safeT(t, "dashboard.greetingTitle", "Good Morning")}
          </span>
          {", "}
          <span className="text-foreground">{displayName}</span>
        </p>

        <h1 className="max-w-3xl text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
          {safeT(t, "dashboard.heroTitlePart1", "Let's build your")}{" "}
          <span className="text-primary">
            {safeT(t, "dashboard.heroTitlePart2", "future, together.")}
          </span>
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg">
          {safeT(
            t,
            "dashboard.heroSubtitle",
            "You're one step away from activating your 401(k). We've simplified everything so you can focus on what matters.",
          )}
        </p>

        <div className="mt-6 flex max-w-xl flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <button
            type="button"
            onClick={() => setIsWizardOpen(true)}
            className="group flex w-full flex-col items-center justify-center rounded-xl bg-primary px-6 py-4 text-[var(--color-text-on-primary)] shadow-md transition-all duration-200 hover:bg-primary-hover hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-safe:hover:scale-[1.02] sm:w-auto sm:min-w-[220px]"
          >
            <span className="flex items-center justify-center gap-2 text-base font-semibold leading-tight">
              {safeT(t, "dashboard.startEnrollment", "Start My Enrolment")}
              <ArrowRight className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
            </span>
          </button>

          <button
            type="button"
            onClick={scrollToLearning}
            className="px-1 text-left text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background md:text-base"
          >
            {safeT(t, "dashboard.heroLearnMoreCta", "Learn about the plan")}
            <span aria-hidden> →</span>
          </button>
        </div>
      </div>

      <PersonalizePlanModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        userName={displayName}
      />
    </>
  );
}

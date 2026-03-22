import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { PersonalizePlanModal } from "@/components/enrollment/PersonalizePlanModal";
import { useUser } from "@/context/UserContext";
import { useResolvedUIAsset } from "@/hooks/useResolvedUIAsset";

function HeroCopy() {
  const { t } = useTranslation();
  const { profile } = useUser();
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const displayName = profile?.name || "there";

  const scrollToLearning = () => {
    document.getElementById("recommended-learning")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div className="relative z-10 min-w-0 md:pr-4">
        <p className="mb-2 font-medium text-blue-600 dark:text-blue-400">
          {t("dashboard.greetingTitle")}, {displayName}
        </p>

        <h1 className="text-3xl font-semibold leading-tight text-gray-900 dark:text-slate-50 md:text-5xl">
          {t("dashboard.heroTitlePart1")}{" "}
          <span className="text-blue-600 dark:text-blue-400">{t("dashboard.heroTitlePart2")}</span>
        </h1>

        <p className="mt-4 max-w-lg text-gray-700 dark:text-slate-300">{t("dashboard.heroSubtitle")}</p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <button
            type="button"
            onClick={() => setIsWizardOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]"
          >
            {t("dashboard.startEnrollment")}
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
          </button>

          <button
            type="button"
            onClick={scrollToLearning}
            className="rounded font-medium text-gray-700 transition hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] dark:text-slate-300 dark:hover:text-slate-100"
          >
            {t("preEnrollment.learnAboutPlanCta")}
            <span aria-hidden> →</span>
          </button>
        </div>

        <p className="mt-3 text-sm text-gray-500 dark:text-slate-400">{t("dashboard.takesMinutes")}</p>
      </div>

      <PersonalizePlanModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        userName={displayName}
      />
    </>
  );
}

export function HeroSection() {
  const heroImage = useResolvedUIAsset("dashboardHero");

  return (
    <section className="relative -mt-[72px] w-full bg-[var(--color-background)] pt-[72px]">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="grid min-h-[420px] grid-cols-1 items-center gap-10 md:min-h-[480px] lg:min-h-[520px] md:grid-cols-2 md:gap-12">
          <HeroCopy />

          <div className="flex w-full justify-end">
            <div className="relative h-[min(280px,42vh)] w-full md:h-[min(440px,52vh)]">
              {heroImage.trim() ? (
                <img
                  src={heroImage}
                  alt=""
                  loading="eager"
                  decoding="async"
                  className="h-full w-full object-contain object-right"
                />
              ) : (
                <div
                  className="h-full w-full rounded-xl bg-[var(--color-border)]/25"
                  aria-hidden
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

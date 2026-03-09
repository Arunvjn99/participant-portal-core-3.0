import { useState } from "react";
import { Bot } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ADVISORS } from "./constants";
import { AdvisorBookingFlow } from "./AdvisorBookingFlow";
import { AdvisorOptionCard } from "./AdvisorOptionCard";
import { useCoreAIModalOptional } from "../../context/CoreAIModalContext";
import type { Advisor } from "./types";

export const AdvisorSection = () => {
  const { t } = useTranslation();
  const coreAI = useCoreAIModalOptional();
  const [showBookingFlow, setShowBookingFlow] = useState(false);

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-[var(--color-surface)] border-t border-[var(--color-border)] w-full rounded-2xl min-w-0 overflow-hidden px-4 sm:px-6 md:px-8">
      <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-12">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-[var(--color-text)] mb-2 sm:mb-3 md:mb-4">
          {t("preEnrollment.guidanceTitle")}
        </h2>
        <p className="text-[var(--color-textSecondary)] text-sm sm:text-base md:text-lg">
          {t("preEnrollment.guidanceSubtext")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <AdvisorOptionCard
          borderAccent="blue"
          title={t("preEnrollment.humanAdvisorTitle")}
          description={t("preEnrollment.humanAdvisorDescription")}
          badge={t("preEnrollment.humanAdvisorBadge")}
          primaryAction={{
            label: t("preEnrollment.viewAvailability"),
            onClick: () => setShowBookingFlow(true),
          }}
          secondaryAction={{
            label: t("preEnrollment.visitAdvisorPortal"),
            onClick: () => {},
          }}
          icon={
            <div className="flex -space-x-3">
              {ADVISORS.slice(0, 3).map((advisor) => {
                const name = t(`preEnrollment.advisor${advisor.id}Name` as const);
                return (
                  <div
                    key={advisor.id}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-white shadow-md ring-2 ring-[var(--color-surface)]"
                  >
                    <img src={advisor.image} alt={name} className="w-full h-full object-cover" />
                  </div>
                );
              })}
            </div>
          }
        />

        <AdvisorOptionCard
          borderAccent="purple"
          title={t("preEnrollment.aiAdvisorTitle")}
          description={t("preEnrollment.aiAdvisorDescription")}
          badge={t("preEnrollment.aiAdvisorBadge")}
          primaryAction={{
            label: t("preEnrollment.startAIChat"),
            onClick: () => coreAI?.open(),
          }}
          icon={
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center">
              <Bot size={24} className="text-[var(--color-primary)]" />
            </div>
          }
          highlight
        />
      </div>

      <AdvisorBookingFlow
        isOpen={showBookingFlow}
        onClose={() => setShowBookingFlow(false)}
        advisors={ADVISORS}
        getAdvisorDisplayName={(a) => t(`preEnrollment.advisor${a.id}Name` as const)}
        getAdvisorRole={(a) => t(`preEnrollment.advisor${a.id}Role` as const)}
        getAdvisorBio={(a) => t(`preEnrollment.advisor${a.id}Bio` as const)}
      />
    </section>
  );
};

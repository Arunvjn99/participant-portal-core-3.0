import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Calendar } from "lucide-react";
import { ActionCard } from "@/components/pre-enrollment/ActionCard";
import { ActionGridAiAssistantCard } from "@/components/pre-enrollment/ActionGridAiAssistantCard";
import { ADVISORS } from "@/components/pre-enrollment/constants";
import { AdvisorBookingFlow } from "@/components/pre-enrollment/AdvisorBookingFlow";
import { useCoreAIModalOptional } from "@/context/CoreAIModalContext";

export function ActionCards() {
  const { t } = useTranslation();
  const coreAI = useCoreAIModalOptional();
  const [showBookingFlow, setShowBookingFlow] = useState(false);

  return (
    <>
      <section
        id="action-cards"
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
        aria-label={t("preEnrollment.guidanceTitle")}
      >
        <ActionCard
          icon={Calendar}
          title={t("preEnrollment.humanAdvisorTitle")}
          description={t("preEnrollment.humanAdvisorDescription")}
          ctaLabel={t("preEnrollment.scheduleCallCta")}
          onCta={() => setShowBookingFlow(true)}
          iconVariant="primary"
        />

        <ActionGridAiAssistantCard
          title={t("preEnrollment.aiAdvisorTitle")}
          description={t("preEnrollment.aiAdvisorDescription")}
          ctaLabel={t("preEnrollment.startChattingCta")}
          onCta={() => coreAI?.open()}
        />
      </section>

      <AdvisorBookingFlow
        isOpen={showBookingFlow}
        onClose={() => setShowBookingFlow(false)}
        advisors={ADVISORS}
        getAdvisorDisplayName={(a) => t(`preEnrollment.advisor${a.id}Name` as const)}
        getAdvisorRole={(a) => t(`preEnrollment.advisor${a.id}Role` as const)}
        getAdvisorBio={(a) => t(`preEnrollment.advisor${a.id}Bio` as const)}
      />
    </>
  );
}

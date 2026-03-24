import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { safeT } from "@/lib/safeT";
import { AdvisorAssistanceCard } from "@/components/dashboard/AdvisorAssistanceCard";
import { AICard } from "@/components/dashboard/AICard";
import { ADVISORS } from "@/components/pre-enrollment/constants";
import { AdvisorBookingFlow } from "@/components/pre-enrollment/AdvisorBookingFlow";
import { useAIAssistantStore } from "@/stores/aiAssistantStore";

export function AssistanceSection({ className }: { className?: string }) {
  const { t } = useTranslation();
  const openAIModal = useAIAssistantStore((s) => s.openAIModal);
  const [showBookingFlow, setShowBookingFlow] = useState(false);

  return (
    <section
      id="action-cards"
      className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}
      aria-labelledby="premium-assistance-heading"
    >
      <h2
        id="premium-assistance-heading"
        className="mb-4 text-lg font-semibold tracking-tight text-foreground md:mb-6 md:text-xl"
      >
        {safeT(t, "dashboard.assistanceSectionHeading", "Need Assistance?")}
      </h2>

      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12 lg:gap-8">
        <AdvisorAssistanceCard
          className="h-full min-h-0 lg:col-span-7"
          title={safeT(t, "dashboard.assistanceHumanTitle", "Speak with a retirement specialist")}
          description={safeT(
            t,
            "dashboard.assistanceAdvisorRowDescription",
            "Schedule a one-on-one conversation to review your plan",
          )}
          actionLabel={safeT(t, "dashboard.assistanceAdvisorScheduleNow", "Schedule now")}
          onAction={() => setShowBookingFlow(true)}
        />

        <AICard
          className="h-full min-h-0 lg:col-span-5"
          title={safeT(t, "dashboard.assistanceAiTitle", "Ask Core AI")}
          description={safeT(
            t,
            "dashboard.assistanceAiDescription",
            "Get instant answers and personalized retirement insights anytime.",
          )}
          actionLabel={safeT(t, "dashboard.assistanceAiCta", "Start chatting")}
          onAction={() => openAIModal()}
          betaLabel={safeT(t, "dashboard.assistanceAiBeta", "BETA")}
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
}

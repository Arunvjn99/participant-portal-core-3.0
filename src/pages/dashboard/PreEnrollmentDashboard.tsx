import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import DashboardSection from "../../components/dashboard/DashboardSection";
import {
  HeroSection,
  InsightCards,
  EnrollmentStepsStrip,
  LearningBanner,
  AdvisorSection,
  FAQSection,
} from "../../components/pre-enrollment";
import { PersonalizeWizard } from "../../features/enrollment/personalize";
import { useUser } from "../../context/UserContext";

/**
 * Pre-enrollment dashboard: hero, insights, enrollment steps strip,
 * learning banner, advisor section, and FAQ.
 * Route: /dashboard
 * Start Enrollment CTA opens Personalize wizard; on complete navigates to /enrollment-v2/choose-plan.
 */
export const PreEnrollmentDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { profile } = useUser();
  const [personalizeWizardOpen, setPersonalizeWizardOpen] = useState(false);
  const userName = profile?.name || "there";

  return (
    <DashboardLayout header={<DashboardHeader />}>
      <div className="flex flex-col space-y-8">
        <HeroSection
          onPrimaryClick={() => setPersonalizeWizardOpen(true)}
        />
        <InsightCards />
        <EnrollmentStepsStrip />
        <LearningBanner />
        <DashboardSection title={t("enrollment.needHelpDecidingTitle")}>
          <AdvisorSection />
        </DashboardSection>
        <FAQSection />
      </div>

      <PersonalizeWizard
        isOpen={personalizeWizardOpen}
        onClose={() => setPersonalizeWizardOpen(false)}
        onComplete={() => {
          setPersonalizeWizardOpen(false);
          navigate("/enrollment-v2/choose-plan");
        }}
        userName={userName}
      />
    </DashboardLayout>
  );
};

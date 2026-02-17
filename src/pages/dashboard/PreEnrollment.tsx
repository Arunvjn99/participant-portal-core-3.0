import { useTranslation } from "react-i18next";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { HeroSection, LearningSection, AdvisorSection } from "../../components/pre-enrollment";

export const PreEnrollment = () => {
  const { i18n } = useTranslation();
  return (
    <DashboardLayout header={<DashboardHeader />}>
      <div key={i18n.language}>
        <HeroSection />
        <LearningSection />
        <AdvisorSection />
      </div>
    </DashboardLayout>
  );
};

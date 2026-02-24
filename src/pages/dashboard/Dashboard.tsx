import { useTranslation } from "react-i18next";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { useUser } from "../../context/UserContext";
import { SaveToast } from "../../components/ui/SaveToast";
import { SHARED_LEARNING_RESOURCES } from "../../assets/learning";
import { advisorAvatars } from "../../assets/avatars";
import { HeroEnrollmentCard } from "../../components/dashboard/HeroEnrollmentCard";
import DashboardSection from "../../components/dashboard/DashboardSection";
import { LearningResourceCard } from "../../components/dashboard/LearningResourceCard";
import { LearningResourcesCarousel } from "../../components/dashboard/LearningResourcesCarousel";
import { PersonalizedScoreCard } from "../../components/dashboard/PersonalizedScoreCard";
import { AdvisorList } from "../../components/dashboard/AdvisorList";
import { AdvisorCard } from "../../components/dashboard/AdvisorCard";
import { ValuePropGrid } from "../../components/dashboard/ValuePropGrid";
import { ValuePropCard } from "../../components/dashboard/ValuePropCard";
import { ScrollIndicator } from "../../components/ui/ScrollIndicator";

export const Dashboard = () => {
  const { t } = useTranslation();
  const { profile } = useUser();

  return (
    <DashboardLayout header={<DashboardHeader />}>
      <SaveToast />
      <div>
      <div className="relative" data-hero-section>
        <HeroEnrollmentCard
          greeting={t("dashboard.greeting", { name: profile?.name || "there" })}
          headline={t("dashboard.heroTitle")}
          description={t("dashboard.heroSubtitle")}
          enrollmentBadge={t("dashboard.enrollmentOpen")}
          primaryCtaLabel={t("dashboard.startEnrollment")}
        />
        <ScrollIndicator />
      </div>

      {/* Learning Resources (left) + Personalized Score (right) - canonical grid like Plans */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px] 2xl:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        {/* Section 1: Learning Resources - Figma: white rounded container, title left, carousel inside */}
        <div className="relative min-w-0 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm md:p-8">
          <h2 className="mb-5 text-left text-xl font-bold text-[var(--color-text)] md:text-2xl">
            {t("dashboard.learningResources")}
          </h2>
          <LearningResourcesCarousel>
            {SHARED_LEARNING_RESOURCES.map((resource, index) => (
              <LearningResourceCard
                key={resource.id}
                title={resource.title}
                subtitle={resource.subtitle}
                imageSrc={resource.imageSrc}
                badge={resource.badge}
                index={index}
              />
            ))}
          </LearningResourcesCarousel>
        </div>

        {/* Section 2: Goal Simulator - fixed width on desktop (360/400/420) */}
        <div className="flex min-h-[320px] min-w-0">
          <PersonalizedScoreCard />
        </div>
      </section>

      <DashboardSection title={t("dashboard.meetAdvisors")}>
        <AdvisorList>
          <AdvisorCard
            name="Alex Morgan"
            role={t("dashboard.advisor1Role")}
            description={t("dashboard.advisor1Desc")}
            avatarSrc={advisorAvatars.alex}
          />
          <AdvisorCard
            name="Maya Patel"
            role={t("dashboard.advisor2Role")}
            description={t("dashboard.advisor2Desc")}
            avatarSrc={advisorAvatars.maya}
          />
          <AdvisorCard
            name="Jordan Lee"
            role={t("dashboard.advisor3Role")}
            description={t("dashboard.advisor3Desc")}
            avatarSrc={advisorAvatars.jordan}
          />
        </AdvisorList>
      </DashboardSection>
      <DashboardSection title={t("dashboard.whyChoosePlan")}>
        <ValuePropGrid>
          <ValuePropCard
            icon="dollar"
            title={t("dashboard.employerMatch")}
            description={t("dashboard.employerMatchDesc")}
          />
          <ValuePropCard
            icon="shield"
            title={t("dashboard.taxAdvantages")}
            description={t("dashboard.taxAdvantagesDesc")}
          />
          <ValuePropCard
            icon="chart"
            title={t("dashboard.compoundGrowth")}
            description={t("dashboard.compoundGrowthDesc")}
          />
        </ValuePropGrid>
      </DashboardSection>
      </div>
    </DashboardLayout>
  );
};

import { DashboardLayout } from "../../layouts/DashboardLayout";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
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

export const Dashboard = () => {
  return (
    <DashboardLayout header={<DashboardHeader />}>
      <SaveToast />
      <HeroEnrollmentCard />

      {/* Learning Resources (left) + Personalized Score (right) - canonical grid like Plans */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px] 2xl:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        {/* Section 1: Learning Resources - Figma: white rounded container, title left, carousel inside */}
        <div className="relative min-w-0 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 md:p-8">
          <h2 className="mb-5 text-left text-xl font-bold text-slate-900 dark:text-slate-100 md:text-2xl">
            Learning Resources
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

      <DashboardSection title="Want help choosing a plan? Meet our advisors.">
        <AdvisorList>
          <AdvisorCard
            name="Alex Morgan"
            role="Retirement Advisor"
            description="Helping employees make confident retirement decisions with simple, personalized guidance."
            avatarSrc={advisorAvatars.alex}
          />
          <AdvisorCard
            name="Maya Patel"
            role="Certified Planner"
            description="Experienced CFP providing clear recommendations tailored for busy professionals."
            avatarSrc={advisorAvatars.maya}
          />
        </AdvisorList>
      </DashboardSection>
      <DashboardSection title="Why Choose Our Plan">
        <ValuePropGrid>
          <ValuePropCard
            icon="dollar"
            title="Employer Match"
            description="Get free money. We match 100% up to 6% of your salary."
          />
          <ValuePropCard
            icon="shield"
            title="Tax Advantages"
            description="Lower your taxable income now or enjoy tax-free withdrawals later."
          />
          <ValuePropCard
            icon="chart"
            title="Compound Growth"
            description="Start early. Even small contributions grow significantly over time."
          />
        </ValuePropGrid>
      </DashboardSection>
    </DashboardLayout>
  );
};

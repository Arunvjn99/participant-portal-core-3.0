import { DashboardLayout } from "@/layouts/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { HeroSkeleton } from "@/components/pre-enrollment";
import { useUser } from "@/context/UserContext";
import { SearchBar } from "@/components/search/SearchBar";
import { HeroSection } from "./HeroSection";
import FeaturedLearningSection from "@/components/pre-enrollment/FeaturedLearningSection";
import { AssistanceSection } from "@/components/pre-enrollment/dashboard-premium";

function MainContentSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-4" aria-hidden>
        <div className="h-7 w-48 animate-pulse rounded bg-[var(--color-background-tertiary)]" />
        <div className="h-32 w-full animate-pulse rounded-2xl bg-[var(--color-background-secondary)]" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2" aria-hidden>
        <div className="h-48 animate-pulse rounded-2xl bg-[var(--color-background-secondary)]" />
        <div className="h-48 animate-pulse rounded-2xl bg-[var(--color-background-secondary)]" />
      </div>
    </div>
  );
}

export const PreEnrollment = () => {
  const { loading } = useUser();

  return (
    <DashboardLayout header={<DashboardHeader />} fullWidthChildren allowMainOverflowX>
      <>
        {loading ? (
          <>
            <HeroSkeleton />
            <MainContentSkeleton />
          </>
        ) : (
          <div
            className="relative"
            style={{
              backgroundImage: `
                linear-gradient(180deg, rgb(var(--color-primary-rgb) / 0.06) 0%, transparent 30%),
                linear-gradient(120deg, rgb(var(--color-primary-rgb) / 0.04) 0%, transparent 50%)
              `,
            }}
          >
            <HeroSection />
            <div className="relative z-20 -mt-3 px-4 sm:-mt-4 sm:px-6 lg:px-8">
              <SearchBar className="mx-auto max-w-3xl xl:max-w-4xl" />
            </div>
            <div className="mx-auto max-w-7xl space-y-10 px-4 pb-10 pt-8 sm:space-y-12 sm:px-6 sm:pt-10 md:space-y-12 lg:px-8">
              <FeaturedLearningSection />
              <AssistanceSection />
            </div>
          </div>
        )}
      </>
    </DashboardLayout>
  );
};

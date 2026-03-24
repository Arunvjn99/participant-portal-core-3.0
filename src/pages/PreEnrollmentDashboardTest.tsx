/**
 * Test page for the AI Studio pre-enrollment dashboard prototype.
 * Route: /test/pre-enrollment-dashboard
 * Global header only (no footer). All sections use the same grid; hero image stays outside the grid.
 */
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import {
  HeroSection,
  LearningSection,
  SupportSection,
} from "@/components/dashboard/pre-enrollment-test";

/** Shared grid container: max-w-7xl, consistent padding. Hero image is outside this. */
const GRID_CONTAINER_CLASS =
  "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";

export function PreEnrollmentDashboardTest() {
  return (
    <DashboardLayout
      header={<DashboardHeader />}
      hideFooter
      fullWidthChildren
      transparentBackground
    >
      <div className="min-h-full bg-[#F4F7FB] text-slate-900 font-sans selection:bg-blue-100">
        <HeroSection gridContainerClass={GRID_CONTAINER_CLASS} />
        <div className={`${GRID_CONTAINER_CLASS} py-24`}>
          <LearningSection />
          <SupportSection />
        </div>
      </div>
    </DashboardLayout>
  );
}

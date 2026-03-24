import { Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { EnrollmentHeaderWithStepper } from "@/components/enrollment/EnrollmentHeaderWithStepper";
import { EnrollmentProvider } from "@/enrollment/context/EnrollmentContext";
import { getStepIndex, isEnrollmentStepPath, ENROLLMENT_STEP_PATHS, ENROLLMENT_STEP_LABEL_KEYS } from "@/enrollment/enrollmentStepPaths";

function useIsEnrollmentStepPath(): boolean {
  const { pathname } = useLocation();
  return isEnrollmentStepPath(pathname);
}

/**
 * Use Outlet for step content so the router controls which page is shown.
 * When navigate() is called (e.g. Contribution → Auto Increase), the router
 * updates and Outlet renders the matched route element immediately.
 */
function EnrollmentStepLayout() {
  const location = useLocation();
  const { t } = useTranslation();
  const isStep = useIsEnrollmentStepPath();
  const pathname = location.pathname;
  const step = getStepIndex(pathname);
  const stepLabels = ENROLLMENT_STEP_PATHS.map((p) => t(ENROLLMENT_STEP_LABEL_KEYS[p] ?? ""));

  if (isStep) {
    return (
      <DashboardLayout
        header={<DashboardHeader />}
        subHeader={
          <EnrollmentHeaderWithStepper
            activeStep={step}
            totalSteps={ENROLLMENT_STEP_PATHS.length}
            stepLabels={stepLabels}
          />
        }
        transparentBackground
      >
        <Outlet key={pathname} />
      </DashboardLayout>
    );
  }
  return (
    <div key={pathname}>
      <Outlet />
    </div>
  );
}

/**
 * EnrollmentLayout - Wraps enrollment routes with EnrollmentProvider.
 * For step routes (choose-plan, contribution, auto-increase, investments, review),
 * wraps with DashboardLayout using the global DashboardHeader + enrollment stepper bar.
 * Seeds draft when available.
 *
 * Key by pathname so that when the URL changes (e.g. Contribution → Auto Increase),
 * the step layout remounts and always shows the correct page without requiring a reload.
 */
export const EnrollmentLayout = () => {
  const { pathname } = useLocation();
  return (
    <EnrollmentProvider>
      <EnrollmentStepLayout key={pathname} />
    </EnrollmentProvider>
  );
};

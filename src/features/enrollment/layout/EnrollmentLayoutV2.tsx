import { Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "../../../layouts/DashboardLayout";
import { DashboardHeader } from "../../../components/dashboard/DashboardHeader";
import { EnrollmentHeaderWithStepper } from "../../../components/enrollment/EnrollmentHeaderWithStepper";
import { EnrollmentProvider } from "../../../enrollment/context/EnrollmentContext";
import {
  ENROLLMENT_V2_STEP_PATHS,
  ENROLLMENT_V2_STEP_LABEL_KEYS,
  getV2StepIndex,
  isEnrollmentV2Path,
} from "../config/stepConfig";

/**
 * V2 enrollment step layout — 6 steps, pathname-driven.
 * Reuses EnrollmentProvider, DashboardLayout, EnrollmentHeaderWithStepper.
 */
function EnrollmentV2StepLayout() {
  const location = useLocation();
  const { t } = useTranslation();
  const pathname = location.pathname;
  const isStep = isEnrollmentV2Path(pathname);
  const step = getV2StepIndex(pathname);
  const stepLabels = ENROLLMENT_V2_STEP_PATHS.map((p) => t(ENROLLMENT_V2_STEP_LABEL_KEYS[p] ?? ""));

  if (isStep) {
    return (
      <DashboardLayout
        header={<DashboardHeader />}
        subHeader={
          <EnrollmentHeaderWithStepper
            activeStep={step}
            totalSteps={ENROLLMENT_V2_STEP_PATHS.length}
            stepLabels={stepLabels}
          />
        }
        transparentBackground
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
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
 * EnrollmentLayoutV2 — Wraps /enrollment-v2/* with EnrollmentProvider and 6-step stepper.
 * Does not modify existing EnrollmentLayout or enrollmentStepPaths.
 */
export function EnrollmentLayoutV2() {
  const { pathname } = useLocation();
  return (
    <EnrollmentProvider>
      <EnrollmentV2StepLayout key={pathname} />
    </EnrollmentProvider>
  );
}

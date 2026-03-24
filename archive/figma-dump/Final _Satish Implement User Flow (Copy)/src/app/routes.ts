import { createBrowserRouter } from "react-router";
import { EnrollmentLayout } from "./components/enrollment-layout";
import { PersonalizationWizard } from "./components/personalization-wizard";
import { PlanSelection } from "./components/plan-selection";
import { ContributionSetup } from "./components/contribution-setup";
import { ContributionSource } from "./components/contribution-source";
import { AutoIncrease } from "./components/auto-increase";
import { AutoIncreaseSetup } from "./components/auto-increase-setup";
import { AutoIncreaseSkip } from "./components/auto-increase-skip";
import { InvestmentStrategy } from "./components/investment-strategy";
import { RetirementReadiness } from "./components/retirement-readiness";
import { Review } from "./components/review";
import { Success } from "./components/success";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: EnrollmentLayout,
    children: [
      { index: true, Component: PersonalizationWizard },
      { path: "wizard", Component: PersonalizationWizard },
      { path: "plan", Component: PlanSelection },
      { path: "contribution", Component: ContributionSetup },
      { path: "contribution-source", Component: ContributionSource },
      { path: "auto-increase", Component: AutoIncrease },
      { path: "auto-increase-setup", Component: AutoIncreaseSetup },
      { path: "auto-increase-skip", Component: AutoIncreaseSkip },
      { path: "investment", Component: InvestmentStrategy },
      { path: "readiness", Component: RetirementReadiness },
      { path: "review", Component: Review },
      { path: "success", Component: Success },
    ],
  },
]);
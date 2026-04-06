import type { ScenarioId } from "@/data/scenarios";

/**
 * Controlled demo journeys: every persona starts on a dashboard surface and may only
 * visit routes that match the story (not arbitrary deep links).
 */
export type ScenarioFlowConfig = {
  start: string;
  /** Patterns: exact path, or `prefix/*` for subtree (e.g. `/enrollment/*`). */
  allowedRoutes: string[];
  redirectIfInvalid: string;
  /** Highlighted hero action for this demo (i18n key under common). */
  primaryCTA: {
    titleKey: string;
    /** Unversioned path passed to `withVersion` where needed */
    to: string;
  };
};

export const scenarioFlows: Record<ScenarioId, ScenarioFlowConfig> = {
  sarah: {
    start: "/dashboard/pre-enrollment",
    allowedRoutes: ["/dashboard/pre-enrollment", "/enrollment", "/enrollment/*", "/demo", "/demo/*"],
    redirectIfInvalid: "/dashboard/pre-enrollment",
    primaryCTA: {
      titleKey: "demo.primaryCTA.sarah",
      to: "/enrollment",
    },
  },
  alex: {
    start: "/dashboard/post-enrollment",
    allowedRoutes: [
      "/dashboard/post-enrollment",
      "/dashboard/investment-portfolio",
      "/investments",
      "/investments/*",
      "/transactions",
      "/transactions/*",
      "/profile",
      "/profile/*",
      "/enrollment",
      "/enrollment/*",
      "/demo",
      "/demo/*",
    ],
    redirectIfInvalid: "/dashboard/post-enrollment",
    primaryCTA: {
      titleKey: "demo.primaryCTA.alex",
      to: "/enrollment/contribution",
    },
  },
  john: {
    start: "/dashboard/post-enrollment",
    allowedRoutes: [
      "/dashboard/post-enrollment",
      "/transactions",
      "/transactions/*",
      "/demo",
      "/demo/*",
    ],
    redirectIfInvalid: "/dashboard/post-enrollment",
    primaryCTA: {
      titleKey: "demo.primaryCTA.john",
      to: "/transactions/loan/eligibility",
    },
  },
  mike: {
    start: "/dashboard/post-enrollment",
    allowedRoutes: [
      "/dashboard/post-enrollment",
      "/dashboard/investment-portfolio",
      "/investments",
      "/investments/*",
      "/transactions",
      "/transactions/*",
      "/enrollment",
      "/enrollment/*",
      "/profile",
      "/profile/*",
      "/demo",
      "/demo/*",
    ],
    redirectIfInvalid: "/dashboard/post-enrollment",
    primaryCTA: {
      titleKey: "demo.primaryCTA.mike",
      to: "/dashboard/investment-portfolio",
    },
  },
  linda: {
    start: "/dashboard/post-enrollment",
    allowedRoutes: [
      "/dashboard/post-enrollment",
      "/transactions/withdraw",
      "/transactions/withdraw/*",
      "/profile",
      "/profile/*",
      "/demo",
      "/demo/*",
    ],
    redirectIfInvalid: "/dashboard/post-enrollment",
    primaryCTA: {
      titleKey: "demo.primaryCTA.linda",
      to: "/transactions/withdraw",
    },
  },
};

export function getScenarioFlowStart(id: ScenarioId): string {
  return scenarioFlows[id].start;
}

export function getScenarioFlowConfig(id: ScenarioId): ScenarioFlowConfig {
  return scenarioFlows[id];
}

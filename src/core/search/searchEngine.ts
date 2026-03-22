import { withVersion } from "@/core/version";

export type SearchResult =
  | { type: "navigation"; route: string }
  | { type: "ai"; prompt: string }
  | { type: "action"; action: string };

/** Exact palette / quick-action labels → routes (lowercase keys). */
const PRESET_COMMANDS: Record<string, (version: string) => string> = {
  "start enrollment": (v) => withVersion(v, "/enrollment"),
  "increase contribution": (v) => withVersion(v, "/enrollment/contribution"),
  "view balance": (v) => withVersion(v, "/dashboard"),
  "change investments": () => "/dashboard/investment-portfolio",
};

const NL_HINT =
  /\b(what|how|why|when|where|should|could|would|explain|tell me|tell us|am i|is my|do i|can i)\b/i;

/**
 * Intent-driven routing for global search / command palette.
 * Natural-language questions → Core AI; keywords → navigation; quick actions use preset map.
 */
export function handleGlobalSearch(query: string, routeVersion: string): SearchResult {
  const raw = query.trim();
  const q = raw.toLowerCase();

  if (!q) {
    return { type: "ai", prompt: raw };
  }

  if (NL_HINT.test(raw) || raw.includes("?")) {
    return { type: "ai", prompt: raw };
  }

  const presetHit = Object.keys(PRESET_COMMANDS).find((key) => q === key || q.startsWith(`${key} `));
  if (presetHit) {
    return { type: "navigation", route: PRESET_COMMANDS[presetHit](routeVersion) };
  }

  if (q.includes("settings")) {
    return { type: "navigation", route: "/settings" };
  }

  if (q.includes("enroll")) {
    return { type: "navigation", route: withVersion(routeVersion, "/enrollment") };
  }

  if (q.includes("contribution") || q.includes("deferral")) {
    return { type: "navigation", route: withVersion(routeVersion, "/enrollment/contribution") };
  }

  if (q.includes("vest") && q.includes("balance")) {
    return { type: "ai", prompt: raw };
  }

  if ((q.includes("view") && q.includes("balance")) || q === "balance") {
    return { type: "navigation", route: withVersion(routeVersion, "/dashboard") };
  }

  if (q.includes("investment") || q.includes("portfolio")) {
    return { type: "navigation", route: "/dashboard/investment-portfolio" };
  }

  if (q.includes("plan")) {
    return { type: "navigation", route: withVersion(routeVersion, "/enrollment") };
  }

  if (q.includes("transaction")) {
    return { type: "navigation", route: withVersion(routeVersion, "/transactions") };
  }

  if (q.includes("profile") || q.includes("account")) {
    return { type: "navigation", route: "/profile" };
  }

  return { type: "ai", prompt: raw };
}

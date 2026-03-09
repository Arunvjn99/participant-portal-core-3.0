/**
 * Small environment label (DEV / STAGING / PROD). Shown only when not production.
 * Positioned top-right so it does not block content.
 */
import { ENV } from "../../lib/env";

const LABEL: Record<string, string> = {
  development: "DEV",
  staging: "STAGING",
  production: "PROD",
};

export function EnvironmentBadge() {
  if (ENV === "production") return null;

  const label = LABEL[ENV] ?? ENV.toUpperCase();

  return (
    <div
      className="fixed top-2 right-2 z-[9998] rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-wide shadow-sm pointer-events-none"
      style={{
        background: ENV === "staging" ? "#f59e0b" : "#22c55e",
        color: "#fff",
      }}
      aria-label={`Environment: ${ENV}`}
    >
      {label}
    </div>
  );
}

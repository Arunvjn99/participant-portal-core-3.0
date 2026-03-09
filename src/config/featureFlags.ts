/**
 * Feature flags — temporary toggles. Do not remove old logic when disabling.
 * USE_ENROLLMENT_V2: when true, redirect /enrollment/* step routes to /enrollment-v2/*.
 */

export const USE_ENROLLMENT_V2 =
  typeof import.meta.env.VITE_USE_ENROLLMENT_V2 !== "undefined"
    ? import.meta.env.VITE_USE_ENROLLMENT_V2 === "true" || import.meta.env.VITE_USE_ENROLLMENT_V2 === "1"
    : true;

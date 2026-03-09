/**
 * Environment helper. Use VITE_ENV for predictable dev/staging/production behavior.
 * Set in .env.* files or Netlify Environment variables.
 */
export const ENV = (import.meta.env.VITE_ENV as string) || "development";

export const isDev = ENV === "development";
export const isStaging = ENV === "staging";
export const isProduction = ENV === "production";

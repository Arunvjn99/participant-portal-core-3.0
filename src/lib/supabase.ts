import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { timeoutFetch } from "./network/timeoutFetch";

const currentEnv = (import.meta.env.VITE_ENV as string) || "development";
console.info("Environment:", import.meta.env.MODE, "| Running environment:", currentEnv);

// These variables must be set in Netlify Environment Settings for production,
// or in a local .env file for development (prefixed with VITE_).
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? "";
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ?? "";

const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isConfigured) {
  console.error(
    "[Supabase] Missing environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. " +
      "Local: add to .env. Production: Netlify → Site settings → Environment variables. " +
      "Auth and Supabase-backed features will not work until configured.",
  );
}

const PLACEHOLDER_PATTERNS = [
  "your-project",
  "YOUR_PROJECT_ID",
  "your-anon-key",
  "YOUR_ANON_KEY",
  "PASTE_REAL_ANON_KEY_HERE",
];

if (
  isConfigured &&
  PLACEHOLDER_PATTERNS.some(
    (p) => supabaseUrl.includes(p) || supabaseAnonKey.includes(p),
  )
) {
  console.warn(
    "[Supabase] Environment variables look like placeholders. " +
      "Replace with real credentials from Supabase project dashboard (Settings → API).",
  );
}

const SUPABASE_FETCH_TIMEOUT_MS = 10_000;

/** True when VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set and non-empty. Use for optional UI warnings. */
export const isSupabaseConfigured = isConfigured;

// Use placeholder URL/key when not configured so createClient() never throws (avoids blank screen).
// Supabase lib throws "SupabaseUrl is required" on empty string; auth will fail at runtime until .env is loaded.
const url = isConfigured ? supabaseUrl : "https://placeholder.supabase.co";
const anonKey = isConfigured ? supabaseAnonKey : "placeholder-anon-key";

let supabase: SupabaseClient;
try {
  supabase = createClient(url, anonKey, {
    global: {
      fetch: (reqUrl: RequestInfo | string, options?: RequestInit) =>
        timeoutFetch(reqUrl, options ?? {}, SUPABASE_FETCH_TIMEOUT_MS),
    },
  });
} catch (err) {
  console.error("[Supabase] createClient failed:", err);
  // Fallback so app always renders; auth/queries will fail until env is fixed.
  supabase = createClient("https://placeholder.supabase.co", "placeholder-anon-key");
}

export { supabase };

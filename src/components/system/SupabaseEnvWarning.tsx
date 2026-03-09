/**
 * Shows a clear UI warning when Supabase env vars are missing (dev/staging only).
 * Prevents confusion from blank screens or silent auth failures.
 */
import { isSupabaseConfigured } from "../../lib/supabase";

const isDev = import.meta.env.DEV;

export function SupabaseEnvWarning() {
  if (isDev && !isSupabaseConfigured) {
    return (
      <div
        role="alert"
        className="fixed bottom-4 left-4 right-4 z-[9999] rounded-lg border-2 border-amber-400 bg-amber-50 px-4 py-3 text-sm shadow-lg dark:border-amber-500 dark:bg-amber-950/90 md:left-6 md:right-auto md:max-w-md"
        style={{ color: "var(--color-text)" }}
      >
        <p className="font-semibold text-amber-800 dark:text-amber-200">
          Supabase not configured
        </p>
        <p className="mt-1 text-amber-700 dark:text-amber-300">
          Set <code className="rounded bg-amber-200/50 px-1 dark:bg-amber-800/50">VITE_SUPABASE_URL</code> and{" "}
          <code className="rounded bg-amber-200/50 px-1 dark:bg-amber-800/50">VITE_SUPABASE_ANON_KEY</code> in{" "}
          <code className="rounded bg-amber-200/50 px-1 dark:bg-amber-800/50">.env</code>.{" "}
          Login and Supabase-backed features will not work until then.
        </p>
      </div>
    );
  }
  return null;
}

/**
 * Connectivity watchdog: navigator.onLine + periodic Supabase health check.
 * Marks network as "degraded" on timeout or fetch failure (e.g. DNS poisoning, ISP blocking).
 * Polls every 20 seconds. Uses timeoutFetch so the health check itself cannot hang.
 */

import { timeoutFetch } from "./timeoutFetch";

export type NetworkStatus = "healthy" | "offline" | "degraded";

const HEALTH_CHECK_INTERVAL_MS = 20_000;
const HEALTH_CHECK_TIMEOUT_MS = 10_000;

function getSupabaseEnv(): { url: string; anonKey: string } | null {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

async function runHealthCheck(url: string, anonKey: string): Promise<boolean> {
  try {
    const response = await timeoutFetch(
      `${url}/rest/v1/`,
      {
        method: "HEAD",
        headers: { apikey: anonKey },
      },
      HEALTH_CHECK_TIMEOUT_MS
    );
    return response.ok || response.status === 401; // 401 = endpoint exists, auth required
  } catch {
    return false;
  }
}

/**
 * Starts the connectivity monitor. Calls `onStatus(status)` when status changes.
 * Returns a cleanup function to stop listening and clear the interval.
 */
export function startConnectivityMonitor(
  onStatus: (status: NetworkStatus) => void
): () => void {
  if (typeof window === "undefined") {
    onStatus("healthy");
    return () => {};
  }

  const env = getSupabaseEnv();

  function resolveStatus(online: boolean, checkOk: boolean | null): NetworkStatus {
    if (!online) return "offline";
    if (checkOk === null) return "healthy"; // no env, assume healthy
    return checkOk ? "healthy" : "degraded";
  }

  let lastCheckOk: boolean | null = env ? null : true;
  let intervalId: ReturnType<typeof setInterval> | null = null;

  async function doCheck() {
    if (!env) {
      onStatus(resolveStatus(navigator.onLine, true));
      return;
    }
    const ok = await runHealthCheck(env.url, env.anonKey);
    lastCheckOk = ok;
    onStatus(resolveStatus(navigator.onLine, ok));
  }

  function updateFromOnline() {
    if (lastCheckOk !== null) {
      onStatus(resolveStatus(navigator.onLine, lastCheckOk));
    } else {
      doCheck();
    }
  }

  const handleOnline = () => {
    if (import.meta.env.DEV) console.log("[network] navigator.onLine = true");
    doCheck();
  };

  const handleOffline = () => {
    if (import.meta.env.DEV) console.log("[network] navigator.onLine = false");
    onStatus("offline");
  };

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  doCheck();
  intervalId = setInterval(doCheck, HEALTH_CHECK_INTERVAL_MS);

  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
    if (intervalId !== null) clearInterval(intervalId);
    intervalId = null;
  };
}

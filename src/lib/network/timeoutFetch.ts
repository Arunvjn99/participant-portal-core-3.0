/**
 * Global fetch wrapper with timeout. Prevents infinite hangs from DNS poisoning,
 * ISP blocking, or unresponsive servers. No request can hang indefinitely.
 */

const DEFAULT_TIMEOUT_MS = 10_000;

export type TimeoutFetch = (
  url: RequestInfo,
  options?: RequestInit,
  timeout?: number
) => Promise<Response>;

/**
 * Classify network-related errors for logging and UI.
 * - AbortError = timeout (request aborted after N seconds)
 * - "Failed to fetch" = connectivity (DNS, CORS, blocked, etc.)
 */
export function classifyNetworkError(error: unknown): "timeout" | "connectivity" | "unknown" {
  if (error instanceof Error) {
    if (error.name === "AbortError") return "timeout";
    if (
      error.message?.includes("Failed to fetch") ||
      error.message?.includes("Load failed") ||
      error.message?.includes("NetworkError")
    ) {
      return "connectivity";
    }
  }
  return "unknown";
}

/**
 * Fetch with a guaranteed timeout. After `timeout` ms the request is aborted.
 * Caller's request init is merged; our AbortController takes precedence so no request hangs forever.
 */
export const timeoutFetch: TimeoutFetch = async (
  url: RequestInfo,
  options: RequestInit = {},
  timeout = DEFAULT_TIMEOUT_MS
): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const mergedSignal = controller.signal;
  const mergedOptions: RequestInit = {
    ...options,
    signal: mergedSignal,
  };

  try {
    const response = await fetch(url, mergedOptions);
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (import.meta.env.DEV) {
      const kind = classifyNetworkError(error);
      if (kind === "timeout") {
        console.error(
          "[network] Request timed out — possible DNS or ISP blocking:",
          typeof url === "string" ? url : (url as Request).url
        );
      } else if (kind === "connectivity") {
        console.error(
          "[network] Supabase connectivity failed — possible DNS or ISP blocking:",
          error
        );
      }
    }
    throw error;
  }
};

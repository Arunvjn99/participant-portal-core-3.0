const CLARITY_PROJECT_ID = "vlsu7y65s0";

let clarityInitialized = false;

export function loadClarity(): void {
  if (typeof window === "undefined") return;
  if (window.location.hostname === "localhost") return;
  if (import.meta.env.VITE_ENABLE_CLARITY !== "true") return;

  if (clarityInitialized) return;
  clarityInitialized = true;

  if (document.querySelector('script[src*="clarity.ms"]')) return;

  const win = window as Record<string, unknown>;
  win["clarity"] =
    win["clarity"] ||
    function (...args: unknown[]) {
      ((win["clarity"] as { q: unknown[][] }).q =
        (win["clarity"] as { q: unknown[][] }).q || []).push(args);
    };

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`;
  document.head.appendChild(script);
}

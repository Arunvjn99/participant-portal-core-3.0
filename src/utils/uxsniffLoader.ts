export function loadUXsniff(): void {
  if (typeof window === "undefined") return;
  if (window.location.hostname === "localhost") return;
  if (import.meta.env.VITE_ENABLE_UX_SNIFF !== "true") return;

  if ((window as Record<string, unknown>).__uxsniff_loaded) return;
  (window as Record<string, unknown>).__uxsniff_loaded = true;

  if (document.querySelector('script[src*="uxsnf_track"]')) return;

  const ux = function (...args: unknown[]) {
    (ux as unknown as { q: unknown[][] }).q.push(args);
  } as unknown as { q: unknown[][] } & ((...args: unknown[]) => void);
  ux.q = [];
  (window as Record<string, unknown>).ux = ux;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://api.uxsniff.com/cdn/js/uxsnf_track.js";
  document.head.appendChild(script);
}

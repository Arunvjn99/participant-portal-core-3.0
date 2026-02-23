export function loadUXsniff(): void {
  console.log("UXSniff Debug:", {
    hostname: window.location.hostname,
    enabled: import.meta.env.VITE_ENABLE_UX_SNIFF,
  });

  if (window.location.hostname === "localhost") return;
  if (import.meta.env.VITE_ENABLE_UX_SNIFF !== "true") return;
  if (document.getElementById("uxsniff-script")) return;

  const script = document.createElement("script");
  script.id = "uxsniff-script";
  script.async = true;
  script.defer = true;
  script.src = "https://api.uxsniff.com/cdn/js/uxsnf_track.js";
  document.head.appendChild(script);
}

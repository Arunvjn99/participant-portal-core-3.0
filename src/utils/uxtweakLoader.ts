const UXTWEAK_SNIPPET_ID = "7356cea4-1eb4-4e36-9944-5a76303aa6fe";
const UXTWEAK_API = "https://api.uxtweak.com/snippet/";
const STORAGE_KEY = `uxt:${UXTWEAK_SNIPPET_ID}`;

interface UXTweakTool {
  u: string; // script URL
  c: unknown; // config object
  g: string; // global variable name
}

function bootstrapTool(tool: UXTweakTool): void {
  const globalName = tool.g;

  const queue: { q: unknown[][]; t: number; c: unknown } & ((...args: unknown[]) => void) =
    Object.assign(
      (...args: unknown[]) => { queue.q.push(args); },
      { q: [] as unknown[][], t: Date.now(), c: tool.c },
    );

  (window as Record<string, unknown>)[globalName] = queue;

  const script = document.createElement("script");
  script.async = true;
  script.src = tool.u;
  document.head.appendChild(script);
}

function processConfig(raw: string): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, raw);
  } catch { /* storage full or blocked — non-critical */ }

  const tools: UXTweakTool[] = JSON.parse(raw);
  tools.forEach(bootstrapTool);
}

export function loadUXtweak(): void {
  if (window.location.hostname === "localhost") return;
  if (document.getElementById("uxtweak-marker")) return;

  const marker = document.createElement("meta");
  marker.id = "uxtweak-marker";
  document.head.appendChild(marker);

  const cached = sessionStorage.getItem(STORAGE_KEY);
  if (cached) {
    processConfig(cached);
    return;
  }

  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      processConfig(xhr.responseText);
    }
  };
  xhr.open("POST", `${UXTWEAK_API}${UXTWEAK_SNIPPET_ID}`);
  xhr.send(document.URL);
}

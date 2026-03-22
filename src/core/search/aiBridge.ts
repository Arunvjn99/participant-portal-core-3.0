/** Dispatched with `detail: { prompt: string }` — {@link CoreAIModalProvider} opens Core AI with that prompt. */
export const CORE_AI_SEARCH_EVENT = "core-ai-search";

/** Opens the Core AI modal without a pre-filled prompt (optional UX hook). */
export const OPEN_AI_ASSISTANT_EVENT = "open-ai-assistant";

export function triggerCoreAI(prompt: string) {
  window.dispatchEvent(
    new CustomEvent(CORE_AI_SEARCH_EVENT, {
      detail: { prompt },
    }),
  );
}

export function openCoreAIAssistant() {
  window.dispatchEvent(new Event(OPEN_AI_ASSISTANT_EVENT));
}

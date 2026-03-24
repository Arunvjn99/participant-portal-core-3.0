import { useCallback, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getRoutingVersion } from "@/core/version";
import { getQuickAnswer } from "@/core/search/answerEngine";
import { executeScenario, submitSearchQuery, type ScenarioExecutionContext } from "@/core/search/executeScenario";
import { getSuggestions, type SuggestionItem } from "@/core/search/suggestionEngine";
import { useAIAssistantStore } from "@/stores/aiAssistantStore";

export type UseSearchOptions = {
  /** Command palette seed when the host mounts (e.g. ⌘K with prefilled text). */
  initialQuery?: string;
};

/**
 * Shared scripted search: typeahead suggestions + scenario execution + Core AI fallback.
 * Must be used under `BrowserRouter` / `RouterProvider`.
 */
export function useSearch(options?: UseSearchOptions) {
  const navigate = useNavigate();
  const location = useLocation();
  const routeVersion = getRoutingVersion(location.pathname);
  const openAIModal = useAIAssistantStore((s) => s.openAIModal);

  const ctx = useMemo<ScenarioExecutionContext>(
    () => ({
      navigate: (to: string) => {
        navigate(to);
      },
      routeVersion,
      openAIModal,
    }),
    [navigate, routeVersion, openAIModal],
  );

  const [query, setQuery] = useState(() => options?.initialQuery ?? "");

  const suggestions = useMemo(() => getSuggestions(query), [query]);
  const answer = useMemo(() => getQuickAnswer(query), [query]);

  const handleSelect = useCallback(
    (scenarioId: string, label?: string) => {
      executeScenario(scenarioId, ctx, label ? { promptOverride: label } : undefined);
    },
    [ctx],
  );

  const suggestionPayload = useMemo(
    () => suggestions.map((s) => ({ scenarioId: s.scenarioId, label: s.label })),
    [suggestions],
  );

  /** Enter / submit: keyboard selection → scenario match → first suggestion → Core AI. */
  const submitWithIndex = useCallback(
    (activeIndex: number) => {
      submitSearchQuery(query, ctx, suggestionPayload, activeIndex);
    },
    [query, ctx, suggestionPayload],
  );

  /** No local matches (palette “ask AI” card). */
  const submitFreeform = useCallback(
    (raw: string) => {
      submitSearchQuery(raw, ctx, [], -1);
    },
    [ctx],
  );

  /** Opens Core AI with an empty composer (wired through store only). */
  const openAIModalEmpty = useCallback(() => {
    useAIAssistantStore.getState().openAIModal(undefined);
  }, []);

  return {
    query,
    setQuery,
    suggestions,
    answer,
    handleSelect,
    submitWithIndex,
    submitFreeform,
    openAIModalEmpty,
  };
}

export type { SuggestionItem };

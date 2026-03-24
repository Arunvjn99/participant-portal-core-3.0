import { getScenarioById, SEARCH_SCENARIOS } from "./scenarioConfig";

export interface SuggestionItem {
  /** Stable row id for list keys / aria */
  id: string;
  label: string;
  scenarioId: string;
}

function slugId(scenarioId: string, suffix: string) {
  return `${scenarioId}__${suffix}`.replace(/\s+/g, "-");
}

/**
 * Typeahead suggestions: empty input → sample queries per scenario; else match query text + keywords.
 */
export function getSuggestions(input: string): SuggestionItem[] {
  const q = input.trim().toLowerCase();

  if (!q) {
    const rows = SEARCH_SCENARIOS.flatMap((s) =>
      s.queries.slice(0, 2).map((query, i) => ({
        id: slugId(s.id, `def-${i}`),
        label: query,
        scenarioId: s.id,
      })),
    );
    /* Cap so empty-state palette stays scrollable (75+ scenarios × 2 queries). */
    return rows.slice(0, 64);
  }

  const out: SuggestionItem[] = [];
  let idx = 0;

  for (const scenario of SEARCH_SCENARIOS) {
    const matchedQueries = scenario.queries.filter((query) => query.toLowerCase().includes(q));
    for (const query of matchedQueries) {
      out.push({
        id: slugId(scenario.id, `q-${idx++}`),
        label: query,
        scenarioId: scenario.id,
      });
    }

    const keywordHit = scenario.keywords.some(
      (k) => k.toLowerCase().includes(q) || q.includes(k.toLowerCase()),
    );
    if (keywordHit && matchedQueries.length === 0) {
      out.push({
        id: slugId(scenario.id, `kw-${idx++}`),
        label: scenario.queries[0] ?? scenario.keywords[0],
        scenarioId: scenario.id,
      });
    }
  }

  return out;
}

function paletteSubtitle(scenario: ReturnType<typeof getScenarioById>): string | undefined {
  if (!scenario) return undefined;
  if (scenario.subtitle) return scenario.subtitle;
  if (scenario.quickAnswer) {
    const t = scenario.quickAnswer;
    return t.length > 72 ? `${t.slice(0, 69)}…` : t;
  }
  return undefined;
}

/** Map suggestions to command-palette list rows (title + subtitle). */
export function suggestionsToPaletteRows(items: SuggestionItem[]): PaletteRowItem[] {
  return items.map((s) => {
    const scenario = getScenarioById(s.scenarioId);
    return {
      id: s.id,
      title: s.label,
      subtitle: paletteSubtitle(scenario),
      scenarioId: s.scenarioId,
    };
  });
}

export interface PaletteRowItem {
  id: string;
  title: string;
  subtitle?: string;
  scenarioId: string;
}

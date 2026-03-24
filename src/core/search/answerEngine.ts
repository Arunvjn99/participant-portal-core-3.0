import { SEARCH_SCENARIOS } from "./scenarioConfig";

export type QuickAnswerResult = {
  scenarioId: string;
  question: string;
  answer: string;
};

/**
 * Inline quick answer: first scenario whose canned query prefix appears in the user string
 * and that defines `quickAnswer`.
 */
export function getQuickAnswer(input: string): QuickAnswerResult | null {
  const q = input.toLowerCase().trim();

  if (!q) return null;

  const match = SEARCH_SCENARIOS.find((scenario) =>
    scenario.queries.some((query) => {
      const needle = query.toLowerCase().slice(0, 12);
      return needle.length > 0 && q.includes(needle);
    }),
  );

  if (match?.quickAnswer) {
    return {
      scenarioId: match.id,
      question: match.queries[0] ?? q,
      answer: match.quickAnswer,
    };
  }

  return null;
}

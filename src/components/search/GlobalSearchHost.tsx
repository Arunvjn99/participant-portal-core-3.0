import { useGlobalSearch } from "@/hooks/useGlobalSearch";
import { CommandSearch } from "./CommandSearch";

/**
 * Mounts the global command palette (⌘/Ctrl+K). Scenario routing lives in `useSearch` + `scenarioConfig`.
 */
export function GlobalSearchHost() {
  const { open, closeSearch, initialQuery } = useGlobalSearch();

  if (!open) return null;

  return <CommandSearch initialQuery={initialQuery} onClose={closeSearch} />;
}

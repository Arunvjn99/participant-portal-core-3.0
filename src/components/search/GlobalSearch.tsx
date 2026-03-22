import { Search } from "lucide-react";
import { requestOpenGlobalSearch } from "@/hooks/useGlobalSearch";

export interface GlobalSearchProps {
  className?: string;
  /** @deprecated Palette uses current route from URL; kept for API compatibility. */
  routeVersion?: string;
}

/**
 * Header control that opens the global command palette (⌘/Ctrl+K).
 */
export function GlobalSearch({ className = "" }: GlobalSearchProps) {
  return (
    <button
      type="button"
      onClick={() => requestOpenGlobalSearch()}
      className={`flex min-w-0 max-w-sm flex-1 items-center justify-end gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-left text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-background-secondary)] hover:text-[var(--color-text-primary)] xl:max-w-md ${className}`.trim()}
      aria-label="Open command palette"
    >
      <Search className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
      <span className="hidden min-w-0 flex-1 truncate sm:inline">Search…</span>
      <kbd className="hidden shrink-0 rounded border border-[var(--color-border)] bg-[var(--color-background-secondary)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--color-text-secondary)] sm:inline">
        ⌘K
      </kbd>
    </button>
  );
}

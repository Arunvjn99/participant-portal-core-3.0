import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Search } from "lucide-react";

const QUICK_ACTIONS = [
  "Start Enrollment",
  "Increase Contribution",
  "View Balance",
  "Change Investments",
] as const;

const TRENDING = [
  "How much should I contribute?",
  "What is my vested balance?",
  "How do I withdraw money?",
] as const;

export interface GlobalSearchOverlayProps {
  onClose: () => void;
  /** Runs intent routing (navigation, Core AI, future actions). */
  onSearchSubmit: (query: string) => void;
}

export function GlobalSearchOverlay({ onClose, onSearchSubmit }: GlobalSearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogId = useId();

  useEffect(() => {
    const t = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const runSearch = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    onSearchSubmit(trimmed);
    onClose();
  };

  const overlayUI = (
    <div className="fixed inset-0 z-[10020]" role="presentation">
      <div
        className="animate-fade-in absolute inset-0 bg-black/40 backdrop-blur-sm"
        aria-hidden
        onClick={onClose}
      />

      <div className="relative flex items-start justify-center px-4 pt-16 sm:pt-24">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${dialogId}-title`}
          className="animate-palette-in w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] shadow-2xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 id={`${dialogId}-title`} className="sr-only">
            Command palette — search or ask Core AI
          </h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              runSearch(query);
            }}
          >
            <div className="flex items-center gap-3 border-b border-[var(--color-border)] p-4 dark:border-slate-700">
              <Search className="h-5 w-5 shrink-0 text-[var(--color-text-secondary)]" aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search or ask anything about your retirement plan..."
                className="w-full bg-transparent text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-secondary)]"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
              <span className="shrink-0 rounded border border-[var(--color-border)] bg-[var(--color-background-secondary)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--color-text-secondary)] dark:border-slate-600">
                ESC
              </span>
            </div>
          </form>

          <div className="max-h-[min(60vh,520px)] overflow-y-auto overscroll-contain">
            <div className="p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
                What can we help you with?
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {QUICK_ACTIONS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => runSearch(item)}
                    className="rounded-xl border border-[var(--color-border)] p-3 text-left text-sm transition-colors hover:bg-[var(--color-background-secondary)] dark:border-slate-600 dark:hover:bg-slate-800"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 border-t border-[var(--color-border)] p-4 sm:grid-cols-2 dark:border-slate-700">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
                  Trending
                </p>
                <ul className="space-y-1">
                  {TRENDING.map((q) => (
                    <li key={q}>
                      <button
                        type="button"
                        onClick={() => runSearch(q)}
                        className="w-full py-1.5 text-left text-sm text-[var(--color-text)] hover:underline"
                      >
                        {q}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
                  Insights
                </p>
                <div className="space-y-2">
                  <div className="rounded-lg bg-blue-50 p-2 text-sm text-slate-800 dark:bg-blue-950/40 dark:text-blue-100">
                    You are contributing 6%. Increase to 10%.
                  </div>
                  <div className="rounded-lg bg-blue-50 p-2 text-sm text-slate-800 dark:bg-blue-950/40 dark:text-blue-100">
                    On track for $1.2M at retirement.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(overlayUI, document.body);
}

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
  /** Seed from hero / inline search when opening the palette. */
  initialQuery?: string;
}

export function GlobalSearchOverlay({
  onClose,
  onSearchSubmit,
  initialQuery = "",
}: GlobalSearchOverlayProps) {
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogId = useId();

  useEffect(() => {
    const t = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    document.body.classList.add("global-search-open");
    return () => {
      document.body.classList.remove("global-search-open");
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
      <div className="global-search-overlay__scrim animate-fade-in absolute inset-0" aria-hidden onClick={onClose} />

      <div className="relative flex items-start justify-center px-4 pt-16 sm:pt-24">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${dialogId}-title`}
          className="global-search-dialog animate-palette-in w-full max-w-2xl overflow-hidden"
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
            <div className="search-container search-container--modal-top">
              <div className="search-container__inner">
                <span className="search-container__icon-slot" aria-hidden>
                  <Search className="icon search-container__icon h-5 w-5" strokeWidth={2} />
                </span>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search or ask anything about your account..."
                  className="search-container__input"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                />
                <kbd className="search-container__kbd search-container__kbd--collapse-sm">ESC</kbd>
              </div>
            </div>
          </form>

          <div className="max-h-[min(60vh,520px)] overflow-y-auto overscroll-contain">
            <div className="p-4">
              <p className="global-search-dialog__hint">What can we help you with?</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {QUICK_ACTIONS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => runSearch(item)}
                    className="global-search-dialog__action"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="global-search-dialog__section grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="global-search-dialog__hint">Trending</p>
                <ul className="space-y-1">
                  {TRENDING.map((q) => (
                    <li key={q}>
                      <button type="button" onClick={() => runSearch(q)} className="global-search-dialog__link">
                        {q}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="global-search-dialog__hint">Insights</p>
                <div className="space-y-2">
                  <div className="global-search-dialog__insight">You are contributing 6%. Increase to 10%.</div>
                  <div className="global-search-dialog__insight">On track for $1.2M at retirement.</div>
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

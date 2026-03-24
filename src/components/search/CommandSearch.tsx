import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { suggestionsToPaletteRows } from "@/core/search/suggestionEngine";
import { useSearch } from "@/hooks/useSearch";
import { SearchOverlay } from "./SearchOverlay";
import { SearchInput } from "./SearchInput";
import { SearchResults } from "./SearchResults";
import { EmptyState } from "./EmptyState";
import { AiFallbackCard } from "./AiFallbackCard";

export type CommandSearchProps = {
  onClose: () => void;
  initialQuery?: string;
};

type UiPhase = "idle" | "focused" | "typing" | "results" | "no-results";

function useDebouncedTyping(query: string, ms: number) {
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    setTyping(true);
    const t = window.setTimeout(() => setTyping(false), ms);
    return () => window.clearTimeout(t);
  }, [query, ms]);

  return typing;
}

/**
 * Global command palette: scripted scenarios + Core AI fallback (same engine as hero search).
 */
export function CommandSearch({ onClose, initialQuery = "" }: CommandSearchProps) {
  const { query, setQuery, suggestions, answer, handleSelect, submitWithIndex, submitFreeform } = useSearch({
    initialQuery,
  });
  const [inputFocused, setInputFocused] = useState(true);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const titleId = useId();
  const listId = useId();
  const emptyHeadingId = useId();

  const matches = useMemo(() => suggestionsToPaletteRows(suggestions), [suggestions]);

  const isTyping = useDebouncedTyping(query, 240);
  const trimmed = query.trim();

  const showQuickAnswer = Boolean(answer && trimmed.length > 0);
  const noLocalMatches = trimmed.length > 0 && matches.length === 0;
  const showTypingDots = isTyping && trimmed.length > 0;
  const showNoResults = !isTyping && noLocalMatches;

  const uiPhase: UiPhase = useMemo(() => {
    if (showTypingDots) return "typing";
    if (showNoResults) return "no-results";
    if (matches.length > 0) return "results";
    if (inputFocused) return "focused";
    return "idle";
  }, [showTypingDots, showNoResults, matches.length, inputFocused]);

  const listOptionIds = useMemo(
    () => matches.map((m) => `${listId}-opt-${m.id}`),
    [matches, listId],
  );

  const activeDescendantId = activeIndex >= 0 && activeIndex < listOptionIds.length ? listOptionIds[activeIndex] : undefined;

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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  const runSubmit = useCallback(() => {
    if (activeIndex < 0 && !query.trim()) return;
    submitWithIndex(activeIndex);
    onClose();
  }, [query, activeIndex, submitWithIndex, onClose]);

  const activateItem = useCallback(
    (item: (typeof matches)[number]) => {
      handleSelect(item.scenarioId, item.title);
      onClose();
    },
    [handleSelect, onClose],
  );

  const scrollActiveIntoView = useCallback(
    (index: number) => {
      const el = listRef.current?.querySelector<HTMLElement>(`#${CSS.escape(listOptionIds[index] ?? "")}`);
      el?.scrollIntoView({ block: "nearest" });
    },
    [listOptionIds],
  );

  const onFormKeyDown = useCallback(
    (e: KeyboardEvent<HTMLFormElement>) => {
      if (showNoResults) {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
        }
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => {
          const next = i < matches.length - 1 ? i + 1 : 0;
          requestAnimationFrame(() => scrollActiveIntoView(next));
          return next;
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => {
          const next = i <= 0 ? matches.length - 1 : i - 1;
          requestAnimationFrame(() => scrollActiveIntoView(next));
          return next;
        });
      } else if (e.key === "Enter" && activeIndex >= 0 && matches[activeIndex]) {
        e.preventDefault();
        activateItem(matches[activeIndex]);
      }
    },
    [showNoResults, matches, activeIndex, activateItem, scrollActiveIntoView],
  );

  const sectionLabel = trimmed ? "Matching commands" : "Suggested commands";

  const overlay = (
    <SearchOverlay onClose={onClose} labelId={titleId}>
      <div
        className="ai-command-stage-inner animate-palette-in"
        data-ui-phase={uiPhase}
      >
        <h2 id={titleId} className="sr-only">
          AI command search
        </h2>
        <form
          className="ai-command-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (showNoResults) {
              if (trimmed) submitFreeform(trimmed);
              onClose();
              return;
            }
            if (activeIndex >= 0 && matches[activeIndex]) {
              activateItem(matches[activeIndex]);
              return;
            }
            runSubmit();
          }}
          onKeyDown={onFormKeyDown}
        >
          <SearchInput
            id={`${titleId}-input`}
            value={query}
            onChange={setQuery}
            onClear={() => {
              setQuery("");
              setActiveIndex(-1);
              inputRef.current?.focus();
            }}
            inputRef={inputRef}
            placeholder="Search or ask anything about your account…"
            aria-controls={showNoResults ? undefined : listId}
            aria-activedescendant={showNoResults ? undefined : activeDescendantId}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
          />

          {showTypingDots ? (
            <div className="ai-command-typing" aria-hidden>
              <span className="ai-command-typing__dot" />
              <span className="ai-command-typing__dot" />
              <span className="ai-command-typing__dot" />
            </div>
          ) : (
            <div className="ai-command-typing ai-command-typing--placeholder" aria-hidden />
          )}

          {showQuickAnswer && answer ? (
            <div className="search-palette-quick-answer" role="region" aria-label="Quick answer">
              <p className="answer-question">{answer.question}</p>
              <p className="answer-text">{answer.answer}</p>
              <button
                type="button"
                className="answer-cta"
                onClick={() => {
                  handleSelect(answer.scenarioId, trimmed || answer.question);
                  onClose();
                }}
              >
                View more →
              </button>
            </div>
          ) : null}

          <div className="ai-command-panel">
            {showNoResults ? (
              <>
                <EmptyState query={query} listLabelId={emptyHeadingId} />
                <AiFallbackCard
                  query={query}
                  onActivate={() => {
                    if (trimmed) submitFreeform(trimmed);
                  }}
                />
              </>
            ) : (
              <SearchResults
                ref={listRef}
                items={matches}
                listId={listId}
                activeDescendantId={activeDescendantId}
                onSelect={activateItem}
                sectionLabel={sectionLabel}
              />
            )}
          </div>
        </form>
      </div>
    </SearchOverlay>
  );

  return createPortal(overlay, document.body);
}

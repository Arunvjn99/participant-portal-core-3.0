import { useCallback, useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { HERO_SEARCH_FOCUS_EVENT } from "@/lib/heroSearchFocus";
import { useSearch } from "@/hooks/useSearch";
import { SearchPanel } from "./SearchPanel";

const BLUR_CLOSE_MS = 200;

/** Stable anchor for scroll-into-view from the header. */
export const HERO_CONTEXTUAL_SEARCH_ID = "hero-contextual-search";

export interface SearchBarProps {
  className?: string;
}

/**
 * Contextual hero search — anchored dropdown, suggestions, quick answer, trending chips.
 */
export function SearchBar({ className }: SearchBarProps) {
  const { t } = useTranslation();
  const { query, setQuery, suggestions, answer, handleSelect, submitWithIndex, openAIModalEmpty } = useSearch();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelId = useId();
  const baseId = useId();

  const chips = [
    t("preEnrollment.heroSearchChip1"),
    t("preEnrollment.heroSearchChip2"),
    t("preEnrollment.heroSearchChip3"),
    t("preEnrollment.heroSearchChip4"),
  ] as const;

  const clearBlurTimer = useCallback(() => {
    if (blurTimer.current != null) {
      clearTimeout(blurTimer.current);
      blurTimer.current = null;
    }
  }, []);

  useEffect(() => () => clearBlurTimer(), [clearBlurTimer]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  const focusFromHeader = useCallback(() => {
    clearBlurTimer();
    document.getElementById(HERO_CONTEXTUAL_SEARCH_ID)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    window.setTimeout(() => {
      inputRef.current?.focus();
      setOpen(true);
    }, 280);
  }, [clearBlurTimer]);

  useEffect(() => {
    const onFocusRequest = () => focusFromHeader();
    window.addEventListener(HERO_SEARCH_FOCUS_EVENT, onFocusRequest);
    return () => window.removeEventListener(HERO_SEARCH_FOCUS_EVENT, onFocusRequest);
  }, [focusFromHeader]);

  const handleFocus = () => {
    clearBlurTimer();
    setOpen(true);
  };

  const handleBlur = () => {
    clearBlurTimer();
    blurTimer.current = setTimeout(() => setOpen(false), BLUR_CLOSE_MS);
  };

  const handleChipPick = (text: string) => {
    clearBlurTimer();
    setQuery(text);
    inputRef.current?.focus();
    setOpen(true);
  };

  const submit = () => {
    clearBlurTimer();
    setOpen(false);
    const trimmed = query.trim();
    if (!trimmed && activeIndex < 0) {
      openAIModalEmpty();
    } else {
      submitWithIndex(activeIndex);
    }
    setQuery("");
    setActiveIndex(-1);
  };

  const onSubmitForm = (e: FormEvent) => {
    e.preventDefault();
    submit();
  };

  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const listLen = suggestions.length;
    if (!open || listLen === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i < listLen - 1 ? i + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? listLen - 1 : i - 1));
    }
  };

  const listboxId = `${panelId}-suggestions`;

  const pickSuggestion = (scenarioId: string, label: string) => {
    clearBlurTimer();
    handleSelect(scenarioId, label);
    setOpen(false);
    setQuery("");
    setActiveIndex(-1);
  };

  const onQuickAnswerCta = () => {
    if (!answer) return;
    clearBlurTimer();
    handleSelect(answer.scenarioId, query.trim() || answer.question);
    setOpen(false);
    setQuery("");
    setActiveIndex(-1);
  };

  return (
    <div
      id={HERO_CONTEXTUAL_SEARCH_ID}
      className={cn("search-container intelligent-search w-full", className)}
    >
      <form onSubmit={onSubmitForm} noValidate className="intelligent-search-form">
        <div className="search-wrapper search-wrapper--animated w-full">
          <div className="search-inner">
            <span className="search-icon" aria-hidden>
              <Sparkles className="size-[1.15rem] sm:size-5" strokeWidth={2} />
            </span>

            <input
              ref={inputRef}
              id={`${baseId}-input`}
              type="search"
              name="hero-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={onInputKeyDown}
              placeholder={t("preEnrollment.heroSearchPlaceholder")}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              aria-expanded={open}
              aria-controls={open ? `${panelId} ${listboxId}` : undefined}
              aria-autocomplete="list"
              aria-activedescendant={
                open && activeIndex >= 0 ? `${listboxId}-opt-${suggestions[activeIndex]?.id}` : undefined
              }
              className="search-input"
            />

            <button type="submit" className="search-action" aria-label={t("preEnrollment.heroSearchSubmitAria")}>
              <ArrowRight className="size-5" strokeWidth={2} aria-hidden />
            </button>
          </div>
        </div>
      </form>

      {open ? (
        <div id={panelId} className="search-dropdown">
          {suggestions.length > 0 ? (
            <div className="section">
              <p className="section-title">
                {t("preEnrollment.heroSearchSuggestions", { defaultValue: "Suggestions" })}
              </p>
              <ul
                id={listboxId}
                role="listbox"
                aria-label={t("preEnrollment.heroSearchSuggestions", { defaultValue: "Suggestions" })}
                className="m-0 max-h-48 list-none space-y-0 overflow-y-auto p-0"
              >
                {suggestions.map((s, index) => {
                  const oid = `${listboxId}-opt-${s.id}`;
                  const isActive = index === activeIndex;
                  return (
                    <li key={s.id} role="presentation">
                      <button
                        type="button"
                        role="option"
                        id={oid}
                        aria-selected={isActive}
                        className={cn("suggestion-item", isActive && "suggestion-item--active")}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          pickSuggestion(s.scenarioId, s.label);
                        }}
                      >
                        {s.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          {answer ? (
            <div
              className="answer-card"
              role="region"
              aria-label={t("preEnrollment.heroQuickAnswer", { defaultValue: "Quick answer" })}
            >
              <p className="answer-question">{answer.question}</p>
              <p className="answer-text">{answer.answer}</p>
              <button
                type="button"
                className="answer-cta"
                onMouseDown={(e) => e.preventDefault()}
                onClick={onQuickAnswerCta}
              >
                {t("preEnrollment.heroQuickAnswerCta", { defaultValue: "View more →" })}
              </button>
            </div>
          ) : null}

          <SearchPanel
            id={`${panelId}-trending`}
            className="search-dropdown-trending mt-0 border-0 bg-transparent p-0 shadow-none"
            trendingTitle={t("preEnrollment.heroSearchTrending")}
            chips={chips}
            onChipPick={handleChipPick}
          />
        </div>
      ) : null}
    </div>
  );
}

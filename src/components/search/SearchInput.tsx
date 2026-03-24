import type { RefObject } from "react";
import { Sparkles, X, ArrowRight } from "lucide-react";
import { UnifiedSearchInput } from "./UnifiedSearchInput";

export type SearchInputProps = {
  id: string;
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
  inputRef: RefObject<HTMLInputElement | null>;
  placeholder: string;
  "aria-controls"?: string;
  "aria-activedescendant"?: string;
  onFocus?: () => void;
  onBlur?: () => void;
};

/**
 * Command palette field — same `search-wrapper` / `search-inner` stack as hero search.
 */
export function SearchInput({
  id,
  value,
  onChange,
  onClear,
  inputRef,
  placeholder,
  "aria-controls": ariaControls,
  "aria-activedescendant": ariaActivedescendant,
  onFocus,
  onBlur,
}: SearchInputProps) {
  const showClear = value.length > 0;

  return (
    <UnifiedSearchInput variant="palette">
      <span className="search-icon search-icon--palette" aria-hidden>
        <Sparkles className="size-[1.25rem]" strokeWidth={2} />
      </span>
      <input
        ref={inputRef}
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        className="search-input"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        aria-autocomplete="list"
        aria-controls={ariaControls}
        aria-activedescendant={ariaActivedescendant}
      />
      <div className="search-palette-actions">
        {showClear ? (
          <button
            type="button"
            className="search-palette-clear"
            onClick={onClear}
            aria-label="Clear search"
          >
            <X className="size-4" strokeWidth={2} aria-hidden />
          </button>
        ) : null}
        <button type="submit" className="search-palette-submit" aria-label="Submit search">
          <ArrowRight className="size-5" strokeWidth={2} aria-hidden />
        </button>
      </div>
    </UnifiedSearchInput>
  );
}

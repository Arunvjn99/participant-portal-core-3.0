import { useState, useEffect } from "react";
import type { Fund } from "./types";
import { FundSlider } from "./FundSlider";

interface FundAllocationRowProps {
  fund: Fund;
  onAllocationChange: (id: string, allocation: number) => void;
  onRemove: (id: string) => void;
}

/**
 * Single fund row: name, ticker badge, category label, slider (0–100), percent input, remove.
 * Slider and input stay in sync; changing either updates fund.allocation.
 */
export function FundAllocationRow({
  fund,
  onAllocationChange,
  onRemove,
}: FundAllocationRowProps) {
  const clamped = Math.min(100, Math.max(0, fund.allocation));
  const displayValue = Number.isNaN(clamped) ? 0 : clamped;

  const [inputValue, setInputValue] = useState(String(displayValue));
  useEffect(() => {
    setInputValue(String(displayValue));
  }, [displayValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, "");
    setInputValue(raw);
    if (raw === "" || raw === ".") {
      onAllocationChange(fund.id, 0);
      return;
    }
    const value = parseFloat(raw);
    if (!Number.isNaN(value)) onAllocationChange(fund.id, Math.min(100, Math.max(0, value)));
  };

  const handleInputBlur = () => {
    const value = parseFloat(inputValue);
    if (Number.isNaN(value)) {
      onAllocationChange(fund.id, 0);
      setInputValue("0");
    } else {
      const clamped = Math.min(100, Math.max(0, value));
      onAllocationChange(fund.id, clamped);
      setInputValue(String(clamped));
    }
  };

  return (
    <div
      className="flex flex-wrap items-center gap-3 py-3 border-b last:border-b-0"
      style={{ borderColor: "var(--border-subtle)" }}
    >
      <div className="min-w-0 flex-1">
        <p
          className="text-sm font-medium truncate"
          style={{ color: "var(--text-primary)" }}
        >
          {fund.name}
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <span
            className="text-xs px-1.5 py-0.5 rounded-[var(--radius-sm)]"
            style={{
              background: "var(--enroll-soft-bg)",
              color: "var(--text-secondary)",
            }}
          >
            {fund.ticker}
          </span>
          {fund.category && (
            <span
              className="text-xs"
              style={{ color: "var(--text-secondary)" }}
            >
              {fund.category}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <FundSlider
          value={displayValue}
          onChange={(v) => onAllocationChange(fund.id, v)}
          ariaLabel={`${fund.name} allocation`}
        />
        <div className="flex items-center gap-1 w-16">
          <input
            type="text"
            inputMode="decimal"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className="w-10 text-right text-sm rounded-[var(--radius-sm)] border px-1 py-1"
            style={{
              background: "var(--surface-1)",
              borderColor: "var(--border-subtle)",
              color: "var(--text-primary)",
            }}
            aria-label={`${fund.name} percent`}
          />
          <span
            className="text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            %
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onRemove(fund.id)}
        className="p-1.5 rounded-[var(--radius-sm)] transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
        style={{
          background: "var(--enroll-soft-bg)",
          color: "var(--text-secondary)",
        }}
        aria-label={`Remove ${fund.name}`}
      >
        <span className="sr-only">Remove</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

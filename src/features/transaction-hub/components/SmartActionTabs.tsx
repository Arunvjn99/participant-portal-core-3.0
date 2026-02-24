import { useRef, useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";

const TAB_KEYS = ["loan", "withdraw", "rebalance", "contribution", "rollover"] as const;
export type TabKey = (typeof TAB_KEYS)[number];

interface SmartActionTabsProps {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
}

export function SmartActionTabs({ activeTab, onChange }: SmartActionTabsProps) {
  const { t } = useTranslation();
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const updateIndicator = useCallback(() => {
    const idx = TAB_KEYS.indexOf(activeTab);
    const el = tabsRef.current[idx];
    const container = containerRef.current;
    if (el && container) {
      const cRect = container.getBoundingClientRect();
      const eRect = el.getBoundingClientRect();
      setIndicator({
        left: eRect.left - cRect.left,
        width: eRect.width,
      });
    }
  }, [activeTab]);

  useEffect(() => {
    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [updateIndicator]);

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    let next = idx;
    if (e.key === "ArrowRight") next = (idx + 1) % TAB_KEYS.length;
    else if (e.key === "ArrowLeft") next = (idx - 1 + TAB_KEYS.length) % TAB_KEYS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TAB_KEYS.length - 1;
    else return;

    e.preventDefault();
    onChange(TAB_KEYS[next]);
    tabsRef.current[next]?.focus();
  };

  return (
    <div
      ref={containerRef}
      role="tablist"
      aria-label={t("transactionHub.tabs.loan")}
      className="relative flex overflow-x-auto rounded-xl border border-[var(--color-border)] p-1"
      style={{ backgroundColor: "var(--color-background-secondary, var(--color-surface))" }}
    >
      <div
        className="absolute bottom-1 top-1 rounded-lg transition-all duration-250 ease-out"
        style={{
          left: indicator.left,
          width: indicator.width,
          backgroundColor: "var(--color-surface-elevated, var(--color-surface))",
          boxShadow: "var(--shadow-sm)",
        }}
        aria-hidden
      />

      {TAB_KEYS.map((key, i) => {
        const isActive = activeTab === key;
        return (
          <button
            key={key}
            ref={(el) => { tabsRef.current[i] = el; }}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${key}`}
            id={`tab-${key}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(key)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className={`relative z-10 flex-1 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150 ${
              isActive
                ? "text-[var(--color-text)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            }`}
          >
            {t(`transactionHub.tabs.${key}`)}
          </button>
        );
      })}
    </div>
  );
}

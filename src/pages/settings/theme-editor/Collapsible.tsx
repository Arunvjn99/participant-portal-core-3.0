import { useState, type ReactNode } from "react";

interface CollapsibleProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  "aria-label"?: string;
}

export function Collapsible({
  title,
  children,
  defaultOpen = false,
  "aria-label": ariaLabel,
}: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={ariaLabel ?? title}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:opacity-90"
        style={{ color: "var(--color-text)" }}
      >
        <span className="text-base font-semibold">{title}</span>
        <span
          className="transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          aria-hidden
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="border-t px-5 py-4" style={{ borderColor: "var(--color-border)" }}>
          {children}
        </div>
      )}
    </div>
  );
}

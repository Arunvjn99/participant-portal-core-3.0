import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import type { ActionTileConfig } from "../types";
const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

const TILES: ActionTileConfig[] = [
  {
    type: "loan",
    title: "Take Loan",
    subtext: `Eligible up to ${formatCurrency(50000)}`,
    statusBadge: "Eligible",
    route: "/transactions/loan/start",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    type: "withdrawal",
    title: "Make Withdrawal",
    subtext: `Available: ${formatCurrency(32000)}`,
    route: "/transactions/withdrawal/start",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
  {
    type: "rollover",
    title: "Start Rollover",
    subtext: `${formatCurrency(129500)} eligible`,
    statusBadge: "Eligible",
    route: "/transactions/rollover/start",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 21m16-10v10l-8 4" />
      </svg>
    ),
  },
  {
    type: "transfer",
    title: "Adjust Contributions",
    subtext: "Currently 9%",
    route: "/enrollment/contribution",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
];

export const ActionHub = memo(function ActionHub() {
  const navigate = useNavigate();
  const reduced = !!useReducedMotion();

  return (
    <section className="space-y-2">
      <h2 className="text-sm font-semibold" style={{ color: "var(--color-text-secondary)" }}>
        Quick actions
      </h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {TILES.map((tile, i) => (
          <motion.button
            key={tile.type}
            type="button"
            onClick={() => navigate(tile.route)}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.05, ease: "easeOut" }}
            whileHover={reduced ? undefined : { scale: 1.01 }}
            style={{ transition: "box-shadow 0.2s ease" }}
            className="flex flex-col items-start gap-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] p-[var(--spacing-4)] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
            style={{
              background: "var(--color-surface)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)]" style={{ background: "var(--color-background-secondary)", color: "var(--color-primary)" }}>
              {tile.icon}
            </span>
            <span className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
              {tile.title}
            </span>
            <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
              {tile.subtext}
            </span>
            {tile.statusBadge && (
              <span
                className="rounded-[var(--radius-sm)] px-1.5 py-0.5 text-[10px] font-medium"
                style={{ background: "var(--color-success-light)", color: "var(--color-success)" }}
              >
                {tile.statusBadge}
              </span>
            )}
          </motion.button>
        ))}
      </div>
    </section>
  );
});

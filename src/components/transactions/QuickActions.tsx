import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import type { TransactionType } from "../../types/transactions";

type QuickActionConfig = {
  type: TransactionType;
  label: string;
  icon: React.ReactNode;
  iconBgStyle: React.CSSProperties;
};

const actions: QuickActionConfig[] = [
  {
    type: "loan",
    label: "Take Loan",
    iconBgStyle: { background: "var(--txn-brand-soft)", color: "var(--enroll-brand)" },
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    ),
  },
  {
    type: "withdrawal",
    label: "Make Withdrawal",
    iconBgStyle: { background: "var(--txn-brand-soft)", color: "var(--enroll-brand)" },
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
  {
    type: "distribution",
    label: "Distribution",
    iconBgStyle: { background: "var(--color-success-light)", color: "var(--color-success)" },
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    type: "rollover",
    label: "Start Rollover",
    iconBgStyle: { background: "var(--color-warning-light)", color: "var(--color-warning)" },
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 21m16-10v10l-8 4" />
      </svg>
    ),
  },
  {
    type: "transfer",
    label: "Investment",
    iconBgStyle: { background: "var(--txn-brand-soft)", color: "var(--enroll-brand)" },
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

const container = {
  hidden: { opacity: 0 },
  visible: (reduced: boolean) => ({
    opacity: 1,
    transition: {
      staggerChildren: reduced ? 0 : 0.05,
      delayChildren: reduced ? 0 : 0.05,
    },
  }),
};

const card = {
  hidden: { opacity: 0, y: 12 },
  visible: (reduced: boolean) => ({
    opacity: 1,
    y: 0,
    transition: { duration: reduced ? 0 : 0.25, ease: "easeOut" },
  }),
};

/**
 * Quick action cards - What would you like to do? (Figma 613-2059)
 */
export const QuickActions = () => {
  const navigate = useNavigate();
  const reduced = !!useReducedMotion();

  const handleAction = (type: TransactionType) => {
    navigate(`/transactions/${type}/start`);
  };

  return (
    <section>
      <h2 className="text-lg font-semibold" style={{ color: "var(--enroll-text-primary)" }}>
        What would you like to do?
      </h2>
      <motion.div
        className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5"
        variants={container}
        initial="hidden"
        animate="visible"
        custom={reduced}
      >
        {actions.map((action) => (
          <motion.button
            key={action.type}
            type="button"
            onClick={() => handleAction(action.type)}
            variants={card}
            custom={reduced}
            whileHover={reduced ? undefined : { scale: 1.03, y: -2 }}
            whileTap={reduced ? undefined : { scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="transaction-widget-button flex flex-col items-center gap-3 rounded-xl border p-5 text-center transition-shadow focus:outline-none"
            style={{
              borderColor: "var(--enroll-card-border)",
              background: "var(--enroll-card-bg)",
              boxShadow: "var(--enroll-elevation-1)",
            }}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl" style={action.iconBgStyle}>
              {action.icon}
            </span>
            <span className="text-sm font-medium" style={{ color: "var(--enroll-text-primary)" }}>
              {action.label}
            </span>
          </motion.button>
        ))}
      </motion.div>
    </section>
  );
};

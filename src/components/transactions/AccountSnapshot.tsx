import { motion, useReducedMotion } from "framer-motion";
import { ACCOUNT_OVERVIEW } from "../../data/accountOverview";

const formatCurrency = (amount: number, decimals = 2) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);

const container = {
  hidden: { opacity: 0 },
  visible: (reduced: boolean) => ({
    opacity: 1,
    transition: {
      staggerChildren: reduced ? 0 : 0.06,
      delayChildren: reduced ? 0 : 0.03,
    },
  }),
};

const item = {
  hidden: { opacity: 0, y: 10 },
  visible: (reduced: boolean) => ({
    opacity: 1,
    y: 0,
    transition: { duration: reduced ? 0 : 0.25, ease: "easeOut" },
  }),
};

/**
 * Account snapshot - Total Balance, metrics grid, On Track card (Figma 613-2059)
 */
export const AccountSnapshot = () => {
  const reduced = !!useReducedMotion();

  return (
    <motion.section
      className="rounded-xl border p-6"
      style={{
        borderColor: "var(--enroll-card-border)",
        background: "var(--enroll-card-bg)",
        boxShadow: "var(--enroll-elevation-1)",
      }}
      variants={container}
      initial="hidden"
      animate="visible"
      custom={reduced}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Total Balance - prominent left */}
        <motion.div
          className="lg:col-span-4"
          variants={item}
          custom={reduced}
        >
          <p className="text-sm font-medium" style={{ color: "var(--enroll-text-muted)" }}>
            Total Balance
          </p>
          <p className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: "var(--enroll-text-primary)" }}>
            {formatCurrency(ACCOUNT_OVERVIEW.totalBalance)}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-sm font-medium" style={{ color: "var(--color-success)" }}>
            <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>+{ACCOUNT_OVERVIEW.ytdPercent}% YTD</span>
          </div>
        </motion.div>

        {/* Metrics - two columns */}
        <motion.div
          className="grid grid-cols-2 gap-4 lg:col-span-4"
          variants={item}
          custom={reduced}
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--enroll-text-muted)" }}>
              Vested Balance
            </p>
            <p className="mt-0.5 text-lg font-semibold" style={{ color: "var(--enroll-text-primary)" }}>
              {formatCurrency(ACCOUNT_OVERVIEW.vestedBalance, 0)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--enroll-text-muted)" }}>
              Outstanding Loan
            </p>
            <p className="mt-0.5 text-lg font-semibold" style={{ color: "var(--enroll-text-primary)" }}>
              {formatCurrency(ACCOUNT_OVERVIEW.outstandingLoan)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--enroll-text-muted)" }}>
              YTD Contribution
            </p>
            <p className="mt-0.5 text-lg font-semibold" style={{ color: "var(--enroll-text-primary)" }}>
              {formatCurrency(ACCOUNT_OVERVIEW.ytdContribution, 0)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--enroll-text-muted)" }}>
              Rate of Return
            </p>
            <p className="mt-0.5 text-lg font-semibold" style={{ color: "var(--color-success)" }}>
              {ACCOUNT_OVERVIEW.rateOfReturnPercent}%
            </p>
          </div>
        </motion.div>

        {/* On Track card - right */}
        <motion.div
          className="lg:col-span-4"
          variants={item}
          custom={reduced}
        >
          <div
            className="rounded-xl px-4 py-4"
            style={{
              background: "var(--enroll-brand)",
              color: "var(--color-text-inverse)",
              boxShadow: "var(--enroll-elevation-1)",
            }}
          >
            <div className="flex items-center gap-2">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ background: "rgb(var(--color-text-inverse-rgb, 255 255 255) / 0.2)" }}
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </span>
              <span className="font-semibold">{ACCOUNT_OVERVIEW.onTrack.title}</span>
            </div>
            <p className="mt-2 text-sm" style={{ opacity: 0.95 }}>
              {ACCOUNT_OVERVIEW.onTrack.message}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

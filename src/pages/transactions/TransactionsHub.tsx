import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { AccountSnapshot } from "../../components/transactions/AccountSnapshot";
import { QuickActions } from "../../components/transactions/QuickActions";
import { RecentTransactions } from "../../components/transactions/RecentTransactions";
import type { Transaction } from "../../types/transactions";

const pageVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (reduced: boolean) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: reduced ? 0 : 0.3,
      ease: "easeOut",
      staggerChildren: reduced ? 0 : 0.08,
      delayChildren: reduced ? 0 : 0.05,
    },
  }),
};

const sectionVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: (reduced: boolean) => ({
    opacity: 1,
    y: 0,
    transition: { duration: reduced ? 0 : 0.3, ease: "easeOut" },
  }),
};

/**
 * Account Activity & Actions page (Figma 613-2059)
 * Account overview, quick actions, recent transactions.
 */
export const TransactionsHub = () => {
  const navigate = useNavigate();
  const reduced = !!useReducedMotion();

  const handleTransactionAction = (transaction: Transaction) => {
    switch (transaction.status) {
      case "draft":
        navigate(`/transactions/${transaction.type}/${transaction.id}`);
        break;
      case "active":
        navigate(`/transactions/${transaction.type}/${transaction.id}`);
        break;
      case "completed":
        navigate(`/transactions/${transaction.id}`);
        break;
      default:
        navigate(`/transactions/${transaction.id}`);
    }
  };

  return (
    <DashboardLayout header={<DashboardHeader />}>
      <motion.div
        className="mx-auto max-w-6xl space-y-8 pb-8"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        custom={reduced}
      >
        <motion.header className="space-y-1" variants={sectionVariants} custom={reduced}>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white md:text-3xl">
            Account Activity & Actions
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            View your account overview, start new transactions, and manage your activity.
          </p>
        </motion.header>

        <motion.div variants={sectionVariants} custom={reduced}>
          <AccountSnapshot />
        </motion.div>

        <motion.div variants={sectionVariants} custom={reduced}>
          <QuickActions />
        </motion.div>

        <motion.div variants={sectionVariants} custom={reduced}>
          <RecentTransactions onTransactionAction={handleTransactionAction} />
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

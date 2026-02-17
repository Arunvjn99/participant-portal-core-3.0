import { memo, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { transactionStore } from "../../../data/transactionStore";
import { SectionHeader } from "../../../components/dashboard/shared/SectionHeader";
import { TransactionCard } from "./TransactionCard";
import type { Transaction } from "../../../types/transactions";
import type { ActivityItem } from "../types";

type GroupKey = "This Week" | "This Month" | "Earlier";

function getGroupKey(dateStr: string): GroupKey {
  const d = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 7) return "This Week";
  if (diffDays <= 31) return "This Month";
  return "Earlier";
}

export const TransactionTimeline = memo(function TransactionTimeline() {
  const reduced = !!useReducedMotion();
  const transactions = useMemo(() => transactionStore.getAllTransactions(), []);
  const grouped = useMemo(() => {
    const map = new Map<GroupKey, Transaction[]>();
    const order: GroupKey[] = ["This Week", "This Month", "Earlier"];
    order.forEach((k) => map.set(k, []));
    [...transactions]
      .sort((a, b) => new Date(b.dateInitiated).getTime() - new Date(a.dateInitiated).getTime())
      .forEach((t) => {
        const key = getGroupKey(t.dateInitiated);
        map.get(key)!.push(t);
      });
    return order.map((key) => ({ key, items: map.get(key)! })).filter((g) => g.items.length > 0);
  }, [transactions]);

  return (
    <motion.section
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-4"
    >
      <SectionHeader title="Detailed Activity" subtitle="Recent transactions grouped by period" />
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {grouped.map(({ key, items }) => (
            <div key={key} className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--color-text-tertiary)" }}>
                {key}
              </p>
              <ul className="space-y-2">
                {items.map((t) => (
                  <li key={t.id}>
                    <TransactionCard
                      transaction={t}
                      lifecycleStatus={(t as ActivityItem).lifecycleStatus}
                      planName={(t as ActivityItem).planName}
                      taxType={(t as ActivityItem).taxType}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  );
});

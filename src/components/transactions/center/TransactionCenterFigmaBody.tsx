import { useMemo } from "react";
import {
  DollarSign,
  HandCoins,
  ArrowLeftRight,
  PieChart,
  RefreshCcw,
  Sparkles,
  FilePen,
  AlertTriangle,
  ChartBar,
} from "lucide-react";
import { motion } from "framer-motion";
import { TransactionCenterSectionHeader } from "./TransactionCenterSectionHeader";
import { TransactionCenterPlanOverview } from "./TransactionCenterPlanOverview";
import { TransactionCenterQuickActionButton } from "./TransactionCenterQuickActionButton";
import {
  TransactionCenterAttentionTimeline,
  type AttentionTimelineItem,
} from "./TransactionCenterAttentionTimeline";
import { TransactionCenterDraftList } from "./TransactionCenterDraftList";
import { TransactionCenterRecentList, type RecentListRow } from "./TransactionCenterRecentList";
import { TransactionCenterFinancialGuidance } from "./TransactionCenterFinancialGuidance";
import { TransactionCenterRetirementWidget } from "./TransactionCenterRetirementWidget";

export type TransactionCenterFigmaBodyProps = {
  planName: string;
  planBalanceLabel: string;
  vestedBalanceLabel: string;
  vestedPctLabel: string;
  onQuickLoan: () => void;
  onQuickWithdraw: () => void;
  onQuickTransfer: () => void;
  onQuickRebalance: () => void;
  onQuickRollover: () => void;
  onResumeDraft: (relativePath: string) => void;
  onResolveAttention?: () => void;
  recentRows?: RecentListRow[];
  onRecentRowClick?: (id: string) => void;
  attentionItems?: AttentionTimelineItem[];
};

/**
 * Figma dump “Transaction Center” main column — max-width 1100px per DS; sits inside app shell (DashboardLayout).
 */
export function TransactionCenterFigmaBody({
  planName,
  planBalanceLabel,
  vestedBalanceLabel,
  vestedPctLabel,
  onQuickLoan,
  onQuickWithdraw,
  onQuickTransfer,
  onQuickRebalance,
  onQuickRollover,
  onResumeDraft,
  onResolveAttention,
  recentRows,
  onRecentRowClick,
  attentionItems,
}: TransactionCenterFigmaBodyProps) {
  const attention = useMemo(() => {
    if (attentionItems) return attentionItems;
    const base: AttentionTimelineItem[] = [
      {
        id: "1",
        title: "Loan Request — Action Required",
        description: "Upload required documents to continue processing your loan request.",
        amount: "$5,000",
        actionLabel: "Resolve issue",
        onAction: onResolveAttention,
      },
      {
        id: "2",
        title: "Withdrawal — Verification",
        description: "Additional documentation needed for hardship review.",
        amount: "$1,200",
        actionLabel: "Resolve issue",
        onAction: onResolveAttention,
      },
      {
        id: "3",
        title: "Rollover — In progress",
        description: "Awaiting custodian transfer confirmation.",
        amount: "$18,500",
        actionLabel: "Resolve issue",
        onAction: onResolveAttention,
      },
      {
        id: "4",
        title: "Transfer — Review",
        description: "Large transfer flagged for secondary approval.",
        amount: "$4,000",
        actionLabel: "Resolve issue",
        onAction: onResolveAttention,
      },
    ];
    return base;
  }, [attentionItems, onResolveAttention]);

  const attentionCount = attention.length;

  return (
    <div className="tx-center-figma-root">
      <div
        className="mx-auto w-full max-w-[75rem] px-[var(--ds-spacing-xl,1.5rem)] sm:px-12 pt-8 pb-24"
        style={{ boxSizing: "border-box" }}
      >
        <TransactionCenterPlanOverview
          planName={planName}
          planBalanceLabel={planBalanceLabel}
          vestedBalanceLabel={vestedBalanceLabel}
          vestedPctLabel={vestedPctLabel}
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 }}
          className="mb-5 sm:mb-6"
        >
          <TransactionCenterSectionHeader
            icon={<Sparkles className="w-4 h-4" />}
            title="Quick Actions"
            subtitle="Start a new transaction"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1.5 sm:gap-2">
            <TransactionCenterQuickActionButton
              icon={<HandCoins className="w-4 h-4" />}
              title="Take a Loan"
              contextInfo="Borrow up to $10,000"
              additionalInfo="Typical approval: 1–3 days"
              onClick={onQuickLoan}
            />
            <TransactionCenterQuickActionButton
              icon={<DollarSign className="w-4 h-4" />}
              title="Withdraw Money"
              contextInfo="Available: $5,000"
              additionalInfo="Tax impact: 10–20%"
              onClick={onQuickWithdraw}
            />
            <TransactionCenterQuickActionButton
              icon={<ArrowLeftRight className="w-4 h-4" />}
              title="Transfer Funds"
              contextInfo="Reallocate balance"
              additionalInfo="No fees or penalties"
              onClick={onQuickTransfer}
            />
            <TransactionCenterQuickActionButton
              icon={<PieChart className="w-4 h-4" />}
              title="Rebalance"
              contextInfo="Current: Moderate risk"
              additionalInfo="Last: 6 months ago"
              onClick={onQuickRebalance}
            />
            <TransactionCenterQuickActionButton
              icon={<RefreshCcw className="w-4 h-4" />}
              title="Roll Over"
              contextInfo="Consolidate savings"
              additionalInfo="No tax penalty"
              onClick={onQuickRollover}
            />
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-5 sm:gap-6 mb-5 sm:mb-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.16 }}
            className="w-full md:w-[60%]"
          >
            <TransactionCenterSectionHeader
              icon={<AlertTriangle className="w-4 h-4" />}
              title="Attention Required"
              badge={{
                text: `${attentionCount} items`,
                color: "bg-amber-500/15 text-amber-900 dark:bg-amber-950/50 dark:text-amber-100",
              }}
            />
            <TransactionCenterAttentionTimeline items={attention} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.24 }}
            className="w-full md:w-[40%]"
          >
            <TransactionCenterSectionHeader
              icon={<FilePen className="w-4 h-4" />}
              title="Draft Transactions"
              badge={{
                text: "2 drafts",
                color: "bg-[color-mix(in srgb, var(--color-primary) 14%, var(--background))] text-[var(--color-primary)]",
              }}
              subtitle="Resume where you left off"
            />
            <div
              style={{
                background: "var(--card-bg)",
                borderRadius: 16,
                border: "1px solid var(--border)",
                padding: "20px 24px",
              }}
            >
              <TransactionCenterDraftList onResume={onResumeDraft} />
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col md:flex-row gap-5 sm:gap-6 mb-5 sm:mb-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.32 }}
            className="w-full md:w-[60%]"
          >
            <TransactionCenterSectionHeader
              icon={<ChartBar className="w-4 h-4" />}
              title="Recent Transactions"
              subtitle="Last 90 days"
            />
            <div
              style={{
                background: "var(--card-bg)",
                borderRadius: 16,
                border: "1px solid var(--border)",
                padding: "24px 28px",
              }}
            >
              <TransactionCenterRecentList rows={recentRows} maxItems={4} onRowClick={onRecentRowClick} />
            </div>
          </motion.div>

          <div className="w-full md:w-[40%]">
            <TransactionCenterSectionHeader
              icon={<ChartBar className="w-4 h-4" />}
              title="Retirement Outlook"
              subtitle="Projected growth"
            />
            <TransactionCenterRetirementWidget delay={0.36} />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          className="mb-6 sm:mb-8"
        >
          <TransactionCenterSectionHeader
            icon={<Sparkles className="w-4 h-4" />}
            title="Financial Guidance"
            subtitle="Personalized insights"
            variant="ai"
            badge={{
              text: "AI Insights",
              color: "bg-violet-500/15 text-violet-700 dark:bg-violet-950/50 dark:text-violet-200",
            }}
          />
          <TransactionCenterFinancialGuidance />
        </motion.div>
      </div>
    </div>
  );
}

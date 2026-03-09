/**
 * Investment / asset allocation summary: label + percent + animated bar per segment.
 * Figma parity: "Asset Class Distribution" with Stocks, Bonds, Other (or Pre-Tax, Roth, After-Tax).
 */
import { motion } from "framer-motion";
import { PiggyBank } from "lucide-react";
import { ReviewSummaryCard } from "./ReviewSummaryCard";

export interface InvestmentSummaryItem {
  label: string;
  percent: number;
  color?: string;
}

const DEFAULT_COLORS = ["var(--color-primary)", "var(--color-success)", "var(--color-warning)"];

export interface InvestmentSummaryProps {
  editHref: string;
  items: InvestmentSummaryItem[];
  title?: string;
  animationDelay?: number;
}

export function InvestmentSummary({
  editHref,
  items,
  title = "Asset Class Distribution",
  animationDelay = 0.25,
}: InvestmentSummaryProps) {
  return (
    <ReviewSummaryCard
      title={title}
      editHref={editHref}
      editLabel="Edit"
      icon={<PiggyBank className="w-4 h-4 text-[var(--color-primary)]" />}
      animationDelay={animationDelay}
      accentStrip="blue"
    >
      <div className="space-y-4">
        {items.map((item, i) => {
          const color = item.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length];
          return (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-bold text-[var(--color-text-primary)]">
                  {item.label}
                </span>
                <span className="text-xl font-black" style={{ color }}>
                  {item.percent}%
                </span>
              </div>
              <div className="relative h-3 rounded-full overflow-hidden bg-[var(--color-border)]">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ backgroundColor: color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, Math.max(0, item.percent))}%` }}
                  transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </ReviewSummaryCard>
  );
}

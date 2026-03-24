import { useState } from "react";
import {
  Eye,
  Download,
  ArrowLeftRight,
  HandCoins,
  DollarSign,
  RefreshCcw,
  Repeat,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

export type RecentListRow = {
  id: string;
  type: "Loan" | "Withdrawal" | "Transfer" | "Rebalance" | "Rollover";
  amount: string;
  status: "Completed" | "Processing" | "Cancelled";
  date: string;
  description: string;
  transactionId: string;
};

const FALLBACK_ROWS: RecentListRow[] = [
  {
    id: "4",
    type: "Transfer",
    amount: "$1,500",
    status: "Completed",
    date: "March 5, 2026",
    description: "Reallocation from Conservative to Growth Fund",
    transactionId: "TRX-2026-0305-001",
  },
  {
    id: "5",
    type: "Loan",
    amount: "$2,000",
    status: "Completed",
    date: "February 28, 2026",
    description: "General Purpose Loan - 12 month term",
    transactionId: "LN-2026-0228-045",
  },
  {
    id: "6",
    type: "Withdrawal",
    amount: "$1,000",
    status: "Completed",
    date: "February 15, 2026",
    description: "Hardship withdrawal for medical expenses",
    transactionId: "WD-2026-0215-023",
  },
  {
    id: "7",
    type: "Rebalance",
    amount: "—",
    status: "Completed",
    date: "January 20, 2026",
    description: "Quarterly portfolio rebalance to target allocation",
    transactionId: "RB-2026-0120-012",
  },
];

const typeIcons: Record<RecentListRow["type"], ReactNode> = {
  Loan: <HandCoins className="w-[13px] h-[13px]" />,
  Withdrawal: <DollarSign className="w-[13px] h-[13px]" />,
  Transfer: <ArrowLeftRight className="w-[13px] h-[13px]" />,
  Rebalance: <RefreshCcw className="w-[13px] h-[13px]" />,
  Rollover: <Repeat className="w-[13px] h-[13px]" />,
};

const typeColors: Record<RecentListRow["type"], { bg: string; color: string }> = {
  Loan: { bg: "color-mix(in srgb, var(--color-primary) 14%, var(--background))", color: "var(--color-primary)" },
  Withdrawal: { bg: "color-mix(in srgb, var(--color-danger) 16%, var(--background))", color: "var(--color-danger)" },
  Transfer: { bg: "color-mix(in srgb, var(--color-primary) 14%, var(--background))", color: "var(--color-primary)" },
  Rebalance: { bg: "color-mix(in srgb, var(--color-success) 16%, var(--background))", color: "var(--color-success)" },
  Rollover: { bg: "color-mix(in srgb, var(--color-primary) 14%, var(--background))", color: "var(--color-primary)" },
};

type FilterType = "All" | "Loans" | "Withdrawals" | "Transfers" | "Rebalance" | "Rollovers";

function getStatusBadge(status: RecentListRow["status"]) {
  switch (status) {
    case "Completed":
      return {
        bg: "color-mix(in srgb, var(--color-success) 16%, var(--background))",
        color: "var(--color-success)",
        dot: "var(--color-success)",
      };
    case "Processing":
      return { bg: "color-mix(in srgb, var(--color-primary) 14%, var(--background))", color: "var(--color-primary)", dot: "var(--color-primary)" };
    case "Cancelled":
      return { bg: "var(--color-background-secondary)", color: "var(--color-text-secondary)", dot: "var(--color-text-tertiary)" };
  }
}

export function TransactionCenterRecentList({
  rows,
  maxItems = 4,
  onRowClick,
}: {
  rows?: RecentListRow[];
  maxItems?: number;
  onRowClick?: (id: string) => void;
}) {
  const source = rows && rows.length > 0 ? rows : FALLBACK_ROWS;
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("All");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const filters: FilterType[] = ["All", "Loans", "Withdrawals", "Transfers", "Rebalance", "Rollovers"];

  const filtered = source.filter((transaction) => {
    if (selectedFilter === "All") return true;
    if (selectedFilter === "Loans") return transaction.type === "Loan";
    if (selectedFilter === "Withdrawals") return transaction.type === "Withdrawal";
    if (selectedFilter === "Transfers") return transaction.type === "Transfer";
    if (selectedFilter === "Rebalance") return transaction.type === "Rebalance";
    if (selectedFilter === "Rollovers") return transaction.type === "Rollover";
    return true;
  });

  const displayed = filtered.slice(0, maxItems);

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
        <div
          className="hidden sm:flex items-center gap-1 p-1"
          style={{
            background: "var(--color-background-secondary)",
            borderRadius: 12,
            border: "1px solid var(--border)",
          }}
        >
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setSelectedFilter(filter)}
              className="transition-all duration-200"
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: selectedFilter === filter ? 700 : 500,
                background: selectedFilter === filter ? "var(--card-bg)" : "transparent",
                color: selectedFilter === filter ? "var(--color-primary)" : "var(--color-text-secondary)",
                boxShadow: selectedFilter === filter ? "0 1px 3px rgba(0,0,0,0.06)" : undefined,
                border: selectedFilter === filter ? "1px solid var(--border)" : "1px solid transparent",
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="sm:hidden relative w-full">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="w-full flex items-center justify-between"
            style={{
              padding: "9px 14px",
              borderRadius: 10,
              border: "1.5px solid var(--border)",
              background: "var(--card-bg)",
              fontSize: 13,
              fontWeight: 600,
              color: "var(--color-text-secondary)",
            }}
          >
            <span>Filter: {selectedFilter}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${mobileFilterOpen ? "rotate-180" : ""}`}
              style={{ color: "var(--color-text-tertiary)" }}
            />
          </button>
          {mobileFilterOpen ? (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 right-0 mt-1 z-20 overflow-hidden"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            >
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => {
                    setSelectedFilter(filter);
                    setMobileFilterOpen(false);
                  }}
                  className="w-full text-left transition-colors"
                  style={{
                    padding: "10px 16px",
                    fontSize: 13,
                    fontWeight: selectedFilter === filter ? 700 : 500,
                    background: selectedFilter === filter ? "color-mix(in srgb, var(--color-primary) 14%, var(--background))" : "transparent",
                    color: selectedFilter === filter ? "var(--color-primary)" : "var(--color-text-secondary)",
                  }}
                >
                  {filter}
                </button>
              ))}
            </motion.div>
          ) : null}
        </div>

        <span className="hidden sm:block" style={{ fontSize: 12, color: "var(--color-text-tertiary)", fontWeight: 500 }}>
          Showing {filtered.length} transaction{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="sm:hidden space-y-3">
        {displayed.map((transaction, idx) => {
          const badge = getStatusBadge(transaction.status);
          const tc = typeColors[transaction.type];
          return (
            <motion.button
              key={transaction.id}
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="w-full text-left"
              style={{
                padding: "14px 16px",
                borderRadius: 14,
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
              }}
              onClick={() => onRowClick?.(transaction.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex items-center justify-center"
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      background: tc.bg,
                      color: tc.color,
                    }}
                  >
                    {typeIcons[transaction.type]}
                  </span>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>{transaction.type}</p>
                    <p className="font-mono" style={{ fontSize: 10, color: "var(--color-text-tertiary)", fontWeight: 500 }}>
                      {transaction.transactionId}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p style={{ fontSize: 14, fontWeight: 800, color: "var(--foreground)" }}>{transaction.amount}</p>
                  <span
                    className="inline-flex items-center gap-1"
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: 20,
                      background: badge.bg,
                      color: badge.color,
                    }}
                  >
                    <span
                      className={`rounded-full ${transaction.status === "Processing" ? "animate-pulse" : ""}`}
                      style={{ width: 5, height: 5, background: badge.dot }}
                    />
                    {transaction.status}
                  </span>
                </div>
              </div>
              <p className="line-clamp-2" style={{ fontSize: 12, color: "var(--color-text-secondary)", fontWeight: 500, marginBottom: 8 }}>
                {transaction.description}
              </p>
              <div className="flex items-center justify-between pt-2" style={{ borderTop: "1px solid var(--border)" }}>
                <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", fontWeight: 500 }}>{transaction.date}</span>
                <div className="flex items-center gap-1">
                  <span
                    className="flex items-center justify-center"
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 7,
                      border: "1px solid var(--border)",
                      background: "var(--card-bg)",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </span>
                  <span
                    className="flex items-center justify-center"
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 7,
                      border: "1px solid var(--border)",
                      background: "var(--card-bg)",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
        {filtered.length === 0 ? (
          <div className="text-center py-8">
            <p style={{ fontSize: 13, color: "var(--color-text-tertiary)", fontWeight: 500 }}>No transactions found</p>
          </div>
        ) : null}
      </div>

      <div
        className="hidden sm:block overflow-x-auto"
        style={{
          borderRadius: 14,
          border: "1px solid var(--border)",
        }}
      >
        <table className="w-full">
          <thead>
            <tr
              style={{
                background: "linear-gradient(135deg, var(--color-background-secondary), var(--border))",
                borderBottom: "1px solid var(--border)",
              }}
            >
              {["Type", "Description", "Amount", "Status", "Date"].map((header) => (
                <th
                  key={header}
                  className="text-left uppercase"
                  style={{
                    padding: "12px 16px",
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: "var(--color-text-secondary)",
                    letterSpacing: "0.5px",
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayed.map((transaction, idx) => {
              const badge = getStatusBadge(transaction.status);
              const tc = typeColors[transaction.type];
              return (
                <motion.tr
                  key={transaction.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.04 }}
                  className="group transition-colors duration-200 cursor-pointer"
                  style={{ borderBottom: "1px solid var(--border)" }}
                  onClick={() => onRowClick?.(transaction.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--muted)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "";
                  }}
                >
                  <td style={{ padding: "14px 16px" }}>
                    <div className="flex items-center gap-2">
                      <span
                        className="flex items-center justify-center"
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 8,
                          background: tc.bg,
                          color: tc.color,
                        }}
                      >
                        {typeIcons[transaction.type]}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>{transaction.type}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", maxWidth: 220 }}>
                    <span className="truncate block" style={{ fontSize: 13, color: "var(--color-text-secondary)", fontWeight: 500 }}>
                      {transaction.description}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>{transaction.amount}</span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      className="inline-flex items-center gap-1.5"
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        padding: "4px 10px",
                        borderRadius: 6,
                        background: badge.bg,
                        color: badge.color,
                      }}
                    >
                      <span
                        className={`rounded-full ${transaction.status === "Processing" ? "animate-pulse" : ""}`}
                        style={{ width: 6, height: 6, background: badge.dot }}
                      />
                      {transaction.status}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontSize: 12, color: "var(--color-text-secondary)", fontWeight: 500 }}>{transaction.date}</span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p style={{ fontSize: 13, color: "var(--color-text-tertiary)", fontWeight: 500 }}>No transactions found</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

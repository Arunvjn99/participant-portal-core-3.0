import { Button } from "./ui/button";
import { motion } from "motion/react";
import {
  FileEdit,
  Clock,
  HandCoins,
  DollarSign,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router";

interface Draft {
  id: string;
  type: "Loan" | "Withdrawal" | "Transfer" | "Rollover";
  icon: React.ReactNode;
  description: string;
  savedDate: string;
  progress: number; // percent complete
  resumePath: string;
}

const mockDrafts: Draft[] = [
  {
    id: "draft-1",
    type: "Loan",
    icon: <HandCoins className="w-[13px] h-[13px]" />,
    description: "General Purpose Loan — $3,500",
    savedDate: "March 7, 2026",
    progress: 40,
    resumePath: "/loan/configuration",
  },
  {
    id: "draft-2",
    type: "Withdrawal",
    icon: <DollarSign className="w-[13px] h-[13px]" />,
    description: "Hardship Withdrawal — Medical",
    savedDate: "March 4, 2026",
    progress: 20,
    resumePath: "/withdrawal/type",
  },
];

export function DraftTransactions() {
  const navigate = useNavigate();

  if (mockDrafts.length === 0) {
    return (
      <div className="text-center py-6">
        <FileEdit className="w-8 h-8 mx-auto mb-2" style={{ color: "#E2E8F0" }} />
        <p style={{ fontSize: 13, color: "#94A3B8", fontWeight: 500 }}>
          No draft transactions
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {mockDrafts.map((draft, idx) => (
        <motion.div
          key={draft.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.08, duration: 0.3 }}
          className="flex items-center gap-3.5 group transition-all duration-200"
          style={{
            padding: "14px 16px",
            borderRadius: 12,
            border: "1px solid #F1F5F9",
            background: "#fff",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#CBD5E1";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#F1F5F9";
          }}
        >
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "#EFF6FF",
              color: "#2563EB",
            }}
          >
            {draft.icon}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <p
                className="truncate"
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#1E293B",
                }}
              >
                {draft.description}
              </p>
              <span
                className="flex-shrink-0"
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: 6,
                  background: "#EFF6FF",
                  color: "#2563EB",
                }}
              >
                Draft
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3" style={{ color: "#CBD5E1" }} />
              <span style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500 }}>
                {draft.savedDate}
              </span>
              <span style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500 }}>
                · {draft.progress}% complete
              </span>
            </div>

            {/* Progress bar */}
            <div
              className="mt-2.5 overflow-hidden"
              style={{
                height: 6,
                borderRadius: 3,
                background: "#E2E8F0",
              }}
            >
              <div
                className="h-full transition-all duration-[400ms] ease-in-out"
                style={{
                  width: `${draft.progress}%`,
                  borderRadius: 3,
                  background: "linear-gradient(90deg, #2563EB, #1E40AF)",
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex-shrink-0">
            <button
              onClick={() => navigate(draft.resumePath)}
              className="flex items-center justify-center transition-all duration-200"
              title="Resume"
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: "1px solid #E8ECF1",
                background: "#fff",
                color: "#2563EB",
              }}
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              className="flex items-center justify-center transition-all duration-200"
              title="Delete"
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: "1px solid #E8ECF1",
                background: "#fff",
                color: "#64748B",
              }}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

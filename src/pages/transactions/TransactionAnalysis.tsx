import { useNavigate, useParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatusBadge } from "@/components/transactions/StatusBadge";
import { getRoutingVersion, withVersion } from "@/core/version";
import { getTransaction } from "@/services/transactionService";
import type { Transaction } from "@/types/transactions";
import { FlowNavButtons } from "@/components/transactions/FigmaFlowUI";
import { AiCoreBridgeButton } from "@/components/ai/AiCoreBridgeButton";

function formatMoney(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

function detailStatus(t: Transaction): "completed" | "pending" | "failed" | "draft" {
  if (t.status === "draft") return "draft";
  if (t.status === "completed" || t.status === "funded") return "completed";
  if (t.status === "rejected" || t.status === "cancelled") return "failed";
  return "pending";
}

export function TransactionAnalysis() {
  const { t } = useTranslation();
  const { transactionId } = useParams<{ transactionId: string }>();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const version = getRoutingVersion(pathname);
  const tx = transactionId ? getTransaction(transactionId) : undefined;

  const back = () => navigate(withVersion(version, "/transactions"));

  if (!transactionId || !tx) {
    return (
      <DashboardLayout header={<DashboardHeader />}>
        <div className="mx-auto w-full max-w-[75rem] px-6 py-12">
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "var(--foreground)", marginBottom: 8 }}>Transaction not found</h2>
          <p style={{ fontSize: 14, color: "var(--color-text-secondary)", marginBottom: 24 }}>This link may be expired or invalid.</p>
          <button
            type="button"
            onClick={back}
            style={{ background: "var(--color-primary)", color: "var(--btn-primary-text)", padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}
          >
            Back to Transaction Center
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const status = detailStatus(tx);
  const metrics = [
    { label: "Amount", value: formatMoney(tx.amount) },
    ...(tx.netAmount != null ? [{ label: "Net Amount", value: formatMoney(tx.netAmount) }] : []),
    ...(tx.fees != null ? [{ label: "Fees", value: formatMoney(tx.fees) }] : []),
  ];

  return (
    <DashboardLayout header={<DashboardHeader />}>
      <div className="mx-auto w-full max-w-[75rem] px-6 py-10 space-y-5">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 style={{ fontSize: 26, fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.5px", marginBottom: 6 }}>
                {tx.displayName ?? `${tx.type} request`}
              </h2>
              <p style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)" }}>
                Started {tx.dateInitiated} · Reference {tx.id.slice(0, 8)}
              </p>
            </div>
            <StatusBadge variant={status}>{status}</StatusBadge>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}>
          <div style={{ background: "var(--card-bg)", borderRadius: 16, border: "1px solid var(--border)", padding: "24px 28px" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)", marginBottom: 20 }}>Transaction Details</h3>
            <div className="grid grid-cols-3 gap-6">
              {metrics.map((m) => (
                <div key={m.label}>
                  <p style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 4 }}>{m.label}</p>
                  <p style={{ fontSize: 20, fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.3px" }}>{m.value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <div className="ai-insight rounded-[14px] p-5">
            <p className="ai-insight__label">{t("aiSystem.aiInsight")}</p>
            <p className="ai-insight__body mt-2 text-[var(--foreground)]">
              {tx.retirementImpact?.rationale ??
                t("aiSystem.txDetailAiBody")}
            </p>
            <AiCoreBridgeButton
              className="mt-3"
              prompt={`Transaction: ${tx.displayName ?? tx.type}, amount ${formatMoney(tx.amount)}, status ${status}. ${tx.retirementImpact?.rationale ?? ""} ${t("aiSystem.txDetailAiBody")}`}
            />
          </div>
        </motion.div>

        <FlowNavButtons
          backLabel="Back to Transaction Center"
          nextLabel="Close"
          onBack={back}
          onNext={back}
        />
      </div>
    </DashboardLayout>
  );
}

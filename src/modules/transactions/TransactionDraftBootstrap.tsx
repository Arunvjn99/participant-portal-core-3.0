import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getRoutingVersion, withVersion } from "@/core/version";
import type { TransactionType } from "@/types/transactions";
import { TRANSACTION_FLOW_ENTRY } from "@/core/transactionFlowRoutes";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

type Props = { type: TransactionType };

/**
 * Redirects into the versioned multi-step transaction UI (no legacy draft id routes).
 */
export function TransactionDraftBootstrap({ type }: Props) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const version = getRoutingVersion(pathname);

  useEffect(() => {
    navigate(withVersion(version, TRANSACTION_FLOW_ENTRY[type]), { replace: true });
  }, [navigate, type, version]);

  return (
    <DashboardLayout header={<DashboardHeader />}>
      <div className="txn-dash">
        <div className="txn-surface-card txn-flow-stack">
          <p className="txn-alert-card__body">Opening your request…</p>
        </div>
      </div>
    </DashboardLayout>
  );
}

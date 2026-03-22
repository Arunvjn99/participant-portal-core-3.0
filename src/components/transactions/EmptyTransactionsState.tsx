import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { DashboardCard } from "../dashboard/DashboardCard";
import { useResolvedUIAsset } from "@/hooks/useResolvedUIAsset";
import Button from "../ui/Button";
import { NewRequestModal } from "./NewRequestModal";

/**
 * EmptyTransactionsState component shown when no transactions exist
 */
export const EmptyTransactionsState = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <DashboardCard>
        <div className="empty-transactions-state">
          {emptyStateUrl.trim() ? (
            <img
              src={emptyStateUrl}
              alt=""
              className="empty-transactions-state__illustration mx-auto mb-2 h-36 w-auto max-w-full object-contain"
            />
          ) : (
            <div className="empty-transactions-state__icon">📋</div>
          )}
          <h2 className="empty-transactions-state__title">No Transactions Yet</h2>
          <p className="empty-transactions-state__description">
            This is where you'll see requests related to your retirement account.
          </p>
          <p className="empty-transactions-state__subdescription">
            You can start a new transaction request using the options above, or use the button below.
          </p>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="empty-transactions-state__cta"
          >
            Start a New Request
          </Button>
        </div>
      </DashboardCard>
      <NewRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

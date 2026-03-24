import { useNavigate, useLocation } from "react-router-dom";
import { getRoutingVersion, withVersion } from "@/core/version";
import { Modal } from "../ui/Modal";
import Button from "../ui/Button";
import type { TransactionType } from "@/types/transactions";
import { TRANSACTION_FLOW_ENTRY } from "@/core/transactionFlowRoutes";

interface TransactionOption {
  type: TransactionType;
  label: string;
  description: string;
}

const TRANSACTION_OPTIONS: TransactionOption[] = [
  {
    type: "loan",
    label: "Take a Loan",
    description: "Borrow from your 401(k) account",
  },
  {
    type: "withdrawal",
    label: "Make a Withdrawal",
    description: "Hardship withdrawal from your account",
  },
  {
    type: "distribution",
    label: "Make a Distribution",
    description: "Receive a distribution from your account",
  },
  {
    type: "rollover",
    label: "Rollover Funds",
    description: "Transfer funds to another retirement account",
  },
  {
    type: "transfer",
    label: "Transfer Investments",
    description: "Move investments between accounts",
  },
  {
    type: "rebalance",
    label: "Rebalance Portfolio",
    description: "Adjust your investment allocation",
  },
];

/**
 * Mock eligibility check - returns true for all transaction types
 * In production, this would check actual eligibility rules
 */
const checkEligibility = async (type: TransactionType): Promise<boolean> => {
  // Mock eligibility check - always allowed for POC
  return true;
};

interface NewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (type: TransactionType) => void; // Optional for backward compatibility
}

export const NewRequestModal = ({ isOpen, onClose, onSelect }: NewRequestModalProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const version = getRoutingVersion(pathname);

  const handleSelect = async (type: TransactionType) => {
    // Perform eligibility check
    const isEligible = await checkEligibility(type);
    
    if (!isEligible) {
      // TODO: Show eligibility error message
      console.error("User is not eligible for this transaction type");
      return;
    }

    navigate(withVersion(version, TRANSACTION_FLOW_ENTRY[type]));
    onClose();
    
    // Call onSelect for backward compatibility if provided
    if (onSelect) {
      onSelect(type);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="new-request-modal">
        <h2 className="new-request-modal__title">Start a New Request</h2>
        <p className="new-request-modal__description">
          Select the type of transaction you'd like to initiate.
        </p>
        <div className="new-request-modal__options">
          {TRANSACTION_OPTIONS.map((option) => (
            <button
              key={option.type}
              type="button"
              className="new-request-modal__option"
              onClick={() => handleSelect(option.type)}
            >
              <div className="new-request-modal__option-content">
                <span className="new-request-modal__option-label">{option.label}</span>
                <span className="new-request-modal__option-description">{option.description}</span>
              </div>
              <span className="new-request-modal__option-arrow" aria-hidden="true">
                →
              </span>
            </button>
          ))}
        </div>
        <div className="new-request-modal__footer">
          <Button onClick={onClose} className="new-request-modal__cancel">
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

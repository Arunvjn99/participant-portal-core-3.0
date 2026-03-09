import type { ReactNode } from "react";
import { Modal } from "./Modal";

export interface WizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Optional aria label for the dialog */
  "aria-label"?: string;
}

export function WizardModal({ isOpen, onClose, children, "aria-label": ariaLabel }: WizardModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      wizard
      dialogClassName="wizard-modal max-w-lg rounded-2xl shadow-lg overflow-hidden bg-[var(--color-background)]"
    >
      <div
        className="flex max-h-[90vh] flex-col"
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
      >
        {children}
      </div>
    </Modal>
  );
}

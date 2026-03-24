import type { ReactNode } from "react";

export type QuickActionCardProps = {
  icon: ReactNode;
  title: string;
  contextInfo: string;
  additionalInfo: string;
  onClick: () => void;
};

/**
 * Dashboard quick action tile (horizontal card grid).
 */
export function QuickActionCard({ icon, title, contextInfo, additionalInfo, onClick }: QuickActionCardProps) {
  return (
    <button type="button" className="txn-quick-action-card" onClick={onClick}>
      <span className="txn-quick-action-card__icon" aria-hidden>
        {icon}
      </span>
      <p className="txn-quick-action-card__title">{title}</p>
      <p className="txn-quick-action-card__line">{contextInfo}</p>
      <p className="txn-quick-action-card__line">{additionalInfo}</p>
    </button>
  );
}

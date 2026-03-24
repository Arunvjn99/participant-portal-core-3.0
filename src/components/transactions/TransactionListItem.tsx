import type { ReactNode } from "react";

export type TransactionListItemProps = {
  title: string;
  subtitle?: string;
  amount: string;
  trailing?: ReactNode;
  onClick?: () => void;
};

/**
 * Row in recent / activity lists.
 */
export function TransactionListItem({ title, subtitle, amount, trailing, onClick }: TransactionListItemProps) {
  const inner = (
    <>
      <div>
        <p className="txn-list-item__title">{title}</p>
        {subtitle ? <p className="txn-list-item__meta">{subtitle}</p> : null}
      </div>
      <div className="txn-list-item__right">
        <span className="txn-list-item__amount">{amount}</span>
        {trailing}
      </div>
    </>
  );

  if (onClick) {
    return (
      <button type="button" className="txn-list-item" onClick={onClick}>
        {inner}
      </button>
    );
  }

  return <div className="txn-list-item">{inner}</div>;
}

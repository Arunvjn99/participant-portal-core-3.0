import type { ReactNode } from "react";
import { TxCalloutInfo, TxCalloutWarn } from "./TxCard";

export type TransactionAlertProps = {
  variant?: "warning" | "info";
  title?: string;
  children: ReactNode;
  id?: string;
  icon?: ReactNode;
};

/**
 * Plan restrictions, documentation, and attention callouts inside flow steps.
 */
export function TransactionAlert({ variant = "warning", title, children, id, icon }: TransactionAlertProps) {
  if (variant === "info") {
    return (
      <TxCalloutInfo title={title} icon={icon}>
        {children}
      </TxCalloutInfo>
    );
  }
  return (
    <TxCalloutWarn title={title} id={id}>
      {children}
    </TxCalloutWarn>
  );
}

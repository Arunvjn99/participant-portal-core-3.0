import type { ReactNode } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardLayout } from "@/layouts/DashboardLayout";

type Props = { children: ReactNode };

/** Wraps core-retirement-platform style transaction wizards (single route, store-driven steps). */
export function CrpTransactionFlowPageLayout({ children }: Props) {
  return (
    <DashboardLayout header={<DashboardHeader />} fullWidthChildren mainCompactTop>
      {children}
    </DashboardLayout>
  );
}

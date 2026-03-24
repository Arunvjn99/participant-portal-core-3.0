import { createBrowserRouter } from "react-router";
import { Dashboard } from "./Dashboard";
import { LoanFlowLayout } from "./flows/loan/LoanFlowLayout";
import { LoanEligibility } from "./flows/loan/LoanEligibility";
import { LoanSimulator } from "./flows/loan/LoanSimulator";
import { LoanConfiguration } from "./flows/loan/LoanConfiguration";
import { LoanFees } from "./flows/loan/LoanFees";
import { LoanDocuments } from "./flows/loan/LoanDocuments";
import { LoanReview } from "./flows/loan/LoanReview";
import { WithdrawalFlowLayout } from "./flows/withdrawal/WithdrawalFlowLayout";
import { WithdrawalEligibility } from "./flows/withdrawal/WithdrawalEligibility";
import { WithdrawalType } from "./flows/withdrawal/WithdrawalType";
import { WithdrawalSource } from "./flows/withdrawal/WithdrawalSource";
import { WithdrawalFees } from "./flows/withdrawal/WithdrawalFees";
import { WithdrawalPayment } from "./flows/withdrawal/WithdrawalPayment";
import { WithdrawalReview } from "./flows/withdrawal/WithdrawalReview";
import { TransferFlowLayout } from "./flows/transfer/TransferFlowLayout";
import { TransferType } from "./flows/transfer/TransferType";
import { TransferSourceFunds } from "./flows/transfer/TransferSourceFunds";
import { TransferDestination } from "./flows/transfer/TransferDestination";
import { TransferAmount } from "./flows/transfer/TransferAmount";
import { TransferImpact } from "./flows/transfer/TransferImpact";
import { TransferReview } from "./flows/transfer/TransferReview";
import { RebalanceFlowLayout } from "./flows/rebalance/RebalanceFlowLayout";
import { RebalanceCurrentAllocation } from "./flows/rebalance/RebalanceCurrentAllocation";
import { RebalanceAdjustAllocation } from "./flows/rebalance/RebalanceAdjustAllocation";
import { RebalanceTradePreview } from "./flows/rebalance/RebalanceTradePreview";
import { RebalanceReview } from "./flows/rebalance/RebalanceReview";
import { RolloverFlowLayout } from "./flows/rollover/RolloverFlowLayout";
import { RolloverPlanDetails } from "./flows/rollover/RolloverPlanDetails";
import { RolloverValidation } from "./flows/rollover/RolloverValidation";
import { RolloverAllocation } from "./flows/rollover/RolloverAllocation";
import { RolloverDocuments } from "./flows/rollover/RolloverDocuments";
import { RolloverReview } from "./flows/rollover/RolloverReview";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Dashboard,
  },
  {
    path: "/loan",
    Component: LoanFlowLayout,
    children: [
      { index: true, Component: LoanEligibility },
      { path: "simulator", Component: LoanSimulator },
      { path: "configuration", Component: LoanConfiguration },
      { path: "fees", Component: LoanFees },
      { path: "documents", Component: LoanDocuments },
      { path: "review", Component: LoanReview },
    ],
  },
  {
    path: "/withdrawal",
    Component: WithdrawalFlowLayout,
    children: [
      { index: true, Component: WithdrawalEligibility },
      { path: "type", Component: WithdrawalType },
      { path: "source", Component: WithdrawalSource },
      { path: "fees", Component: WithdrawalFees },
      { path: "payment", Component: WithdrawalPayment },
      { path: "review", Component: WithdrawalReview },
    ],
  },
  {
    path: "/transfer",
    Component: TransferFlowLayout,
    children: [
      { index: true, Component: TransferType },
      { path: "source", Component: TransferSourceFunds },
      { path: "destination", Component: TransferDestination },
      { path: "amount", Component: TransferAmount },
      { path: "impact", Component: TransferImpact },
      { path: "review", Component: TransferReview },
    ],
  },
  {
    path: "/rebalance",
    Component: RebalanceFlowLayout,
    children: [
      { index: true, Component: RebalanceCurrentAllocation },
      { path: "adjust", Component: RebalanceAdjustAllocation },
      { path: "trades", Component: RebalanceTradePreview },
      { path: "review", Component: RebalanceReview },
    ],
  },
  {
    path: "/rollover",
    Component: RolloverFlowLayout,
    children: [
      { index: true, Component: RolloverPlanDetails },
      { path: "validation", Component: RolloverValidation },
      { path: "allocation", Component: RolloverAllocation },
      { path: "documents", Component: RolloverDocuments },
      { path: "review", Component: RolloverReview },
    ],
  },
]);

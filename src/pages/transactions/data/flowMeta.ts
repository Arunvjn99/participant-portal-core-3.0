import type { StepperStep } from "@/components/transactions/Stepper";

export const LOAN_FLOW_STEPS: StepperStep[] = [
  { id: "eligibility", label: "Eligibility" },
  { id: "simulator", label: "Simulator" },
  { id: "configuration", label: "Configuration" },
  { id: "fees", label: "Fees" },
  { id: "documents", label: "Documents" },
  { id: "review", label: "Review" },
];

export const WITHDRAW_FLOW_STEPS: StepperStep[] = [
  { id: "eligibility", label: "Eligibility" },
  { id: "type", label: "Type" },
  { id: "source", label: "Source" },
  { id: "fees", label: "Fees" },
  { id: "payment", label: "Payment" },
  { id: "review", label: "Review" },
];

export const TRANSFER_FLOW_STEPS: StepperStep[] = [
  { id: "type", label: "Type" },
  { id: "source", label: "Source" },
  { id: "destination", label: "Destination" },
  { id: "amount", label: "Amount" },
  { id: "impact", label: "Impact" },
  { id: "review", label: "Review" },
];

export const REBALANCE_FLOW_STEPS: StepperStep[] = [
  { id: "current", label: "Current" },
  { id: "adjust", label: "Target" },
  { id: "trades", label: "Trades" },
  { id: "review", label: "Review" },
];

export const ROLLOVER_FLOW_STEPS: StepperStep[] = [
  { id: "plan", label: "Plan details" },
  { id: "validation", label: "Validation" },
  { id: "allocation", label: "Allocation" },
  { id: "documents", label: "Documents" },
  { id: "review", label: "Review" },
];

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type TransferFlowState = {
  transferType?: string;
  sourceLabel?: string;
  destinationLabel?: string;
  amount?: number;
};

type Ctx = {
  data: TransferFlowState;
  setData: (p: Partial<TransferFlowState>) => void;
};

const TransferFlowContext = createContext<Ctx | null>(null);

export function TransferFlowProvider({ children }: { children: ReactNode }) {
  const [data, setState] = useState<TransferFlowState>({});
  const setData = (p: Partial<TransferFlowState>) => setState((prev) => ({ ...prev, ...p }));
  const value = useMemo(() => ({ data, setData }), [data]);
  return <TransferFlowContext.Provider value={value}>{children}</TransferFlowContext.Provider>;
}

export function useTransferFlow() {
  const c = useContext(TransferFlowContext);
  if (!c) throw new Error("useTransferFlow must be used within TransferTransactionLayout");
  return c;
}

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type WithdrawFlowState = {
  amount?: number;
  withdrawalType?: string;
};

type Ctx = {
  data: WithdrawFlowState;
  setData: (p: Partial<WithdrawFlowState>) => void;
};

const WithdrawFlowContext = createContext<Ctx | null>(null);

export function WithdrawFlowProvider({ children }: { children: ReactNode }) {
  const [data, setState] = useState<WithdrawFlowState>({});
  const setData = (p: Partial<WithdrawFlowState>) => setState((prev) => ({ ...prev, ...p }));
  const value = useMemo(() => ({ data, setData }), [data]);
  return <WithdrawFlowContext.Provider value={value}>{children}</WithdrawFlowContext.Provider>;
}

export function useWithdrawFlow() {
  const c = useContext(WithdrawFlowContext);
  if (!c) throw new Error("useWithdrawFlow must be used within WithdrawTransactionLayout");
  return c;
}

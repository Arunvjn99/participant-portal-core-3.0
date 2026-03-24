import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type RolloverFlowState = {
  previousEmployer?: string;
  planAdministrator?: string;
  accountNumber?: string;
  estimatedAmount?: number;
  rolloverType?: string;
};

type Ctx = {
  data: RolloverFlowState;
  setData: (p: Partial<RolloverFlowState>) => void;
};

const RolloverFlowContext = createContext<Ctx | null>(null);

export function RolloverFlowProvider({ children }: { children: ReactNode }) {
  const [data, setState] = useState<RolloverFlowState>({});
  const setData = (p: Partial<RolloverFlowState>) => setState((prev) => ({ ...prev, ...p }));
  const value = useMemo(() => ({ data, setData }), [data]);
  return <RolloverFlowContext.Provider value={value}>{children}</RolloverFlowContext.Provider>;
}

export function useRolloverFlow() {
  const c = useContext(RolloverFlowContext);
  if (!c) throw new Error("useRolloverFlow must be used within RolloverTransactionLayout");
  return c;
}

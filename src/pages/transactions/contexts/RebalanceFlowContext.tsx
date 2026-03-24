import { createContext, useContext, useState, type ReactNode } from "react";

export interface RebalanceFund {
  id: string;
  name: string;
  currentAllocation: number;
  targetAllocation: number;
  balance: string;
  color: string;
}

export interface RebalanceFlowData {
  funds: RebalanceFund[];
}

const DEFAULT_FUNDS: RebalanceFund[] = [
  { id: "tdf", name: "Target Date 2045", currentAllocation: 45, targetAllocation: 45, balance: "$13,500", color: "var(--color-primary)" },
  {
    id: "lci",
    name: "Large Cap Index",
    currentAllocation: 30,
    targetAllocation: 30,
    balance: "$9,000",
    color: "color-mix(in srgb, var(--color-primary) 55%, var(--color-success))",
  },
  { id: "sv", name: "Stable Value", currentAllocation: 15, targetAllocation: 15, balance: "$4,500", color: "var(--color-success)" },
  { id: "intl", name: "International Equity", currentAllocation: 10, targetAllocation: 10, balance: "$3,000", color: "var(--color-warning)" },
];

interface RebalanceFlowContextType {
  rebalanceData: RebalanceFlowData;
  updateRebalanceData: (data: Partial<RebalanceFlowData>) => void;
  setFundTarget: (id: string, target: number) => void;
  resetTargets: () => void;
  totalTarget: number;
  isValid: boolean;
}

const RebalanceFlowContext = createContext<RebalanceFlowContextType | undefined>(undefined);

export function RebalanceFlowProvider({ children }: { children: ReactNode }) {
  const [rebalanceData, setRebalanceData] = useState<RebalanceFlowData>({ funds: DEFAULT_FUNDS });

  const updateRebalanceData = (data: Partial<RebalanceFlowData>) => {
    setRebalanceData((prev) => ({ ...prev, ...data }));
  };

  const setFundTarget = (id: string, target: number) => {
    setRebalanceData((prev) => ({
      ...prev,
      funds: prev.funds.map((f) => (f.id === id ? { ...f, targetAllocation: target } : f)),
    }));
  };

  const resetTargets = () => {
    setRebalanceData((prev) => ({
      ...prev,
      funds: prev.funds.map((f) => ({ ...f, targetAllocation: f.currentAllocation })),
    }));
  };

  const totalTarget = rebalanceData.funds.reduce((sum, f) => sum + f.targetAllocation, 0);
  const isValid = totalTarget === 100;

  return (
    <RebalanceFlowContext.Provider
      value={{ rebalanceData, updateRebalanceData, setFundTarget, resetTargets, totalTarget, isValid }}
    >
      {children}
    </RebalanceFlowContext.Provider>
  );
}

export function useRebalanceFlow(): RebalanceFlowContextType {
  const ctx = useContext(RebalanceFlowContext);
  if (!ctx) {
    const funds = DEFAULT_FUNDS;
    return {
      rebalanceData: { funds },
      updateRebalanceData: () => {},
      setFundTarget: () => {},
      resetTargets: () => {},
      totalTarget: 100,
      isValid: true,
    };
  }
  return ctx;
}

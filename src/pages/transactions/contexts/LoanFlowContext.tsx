import { createContext, useContext, useState, type ReactNode } from "react";

export interface LoanFlowData {
  amount: number;
  tenure: number;
  loanType: string;
  reason: string;
  disbursementMethod: string;
  bankAccountNumber: string;
  routingNumber: string;
  accountType: string;
  repaymentFrequency: string;
  repaymentMethod: string;
}

const DEFAULT_DATA: LoanFlowData = {
  amount: 5000,
  tenure: 3,
  loanType: "general",
  reason: "",
  disbursementMethod: "eft",
  bankAccountNumber: "",
  routingNumber: "",
  accountType: "checking",
  repaymentFrequency: "biweekly",
  repaymentMethod: "payroll",
};

interface LoanFlowContextType {
  loanData: LoanFlowData;
  updateLoanData: (data: Partial<LoanFlowData>) => void;
  resetLoanData: () => void;
}

const LoanFlowContext = createContext<LoanFlowContextType | undefined>(undefined);

export function LoanFlowProvider({ children }: { children: ReactNode }) {
  const [loanData, setLoanData] = useState<LoanFlowData>(DEFAULT_DATA);

  const updateLoanData = (data: Partial<LoanFlowData>) => {
    setLoanData((prev) => ({ ...prev, ...data }));
  };

  const resetLoanData = () => setLoanData(DEFAULT_DATA);

  return (
    <LoanFlowContext.Provider value={{ loanData, updateLoanData, resetLoanData }}>
      {children}
    </LoanFlowContext.Provider>
  );
}

export function useLoanFlow(): LoanFlowContextType {
  const ctx = useContext(LoanFlowContext);
  if (!ctx) {
    return {
      loanData: DEFAULT_DATA,
      updateLoanData: () => {},
      resetLoanData: () => {},
    };
  }
  return ctx;
}

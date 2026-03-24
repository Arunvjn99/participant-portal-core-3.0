import { Outlet, useLocation, useNavigate } from "react-router";
import { FlowProgress } from "../../components/FlowProgress";
import { Button } from "../../components/ui/button";
import { X, HandCoins } from "lucide-react";
import { useState, createContext, useContext } from "react";

interface LoanData {
  amount?: number;
  tenure?: number;
  loanType?: string;
  reason?: string;
  disbursementMethod?: string;
  bankAccount?: string;
  repaymentFrequency?: string;
  repaymentStartDate?: string;
  repaymentMethod?: string;
  bankAccountNumber?: string;
  routingNumber?: string;
  accountType?: string;
}

interface LoanFlowContextType {
  loanData: LoanData;
  updateLoanData: (data: Partial<LoanData>) => void;
}

const LoanFlowContext = createContext<LoanFlowContextType | undefined>(undefined);

export function useLoanFlow() {
  const context = useContext(LoanFlowContext);
  if (!context) {
    // Return safe defaults during hot reload or when rendered outside provider
    return {
      loanData: {} as LoanData,
      updateLoanData: (_data: Partial<LoanData>) => {},
    };
  }
  return context;
}

const steps = [
  { number: 1, label: "Eligibility", path: "/loan" },
  { number: 2, label: "Simulator", path: "/loan/simulator" },
  { number: 3, label: "Configuration", path: "/loan/configuration" },
  { number: 4, label: "Fees", path: "/loan/fees" },
  { number: 5, label: "Documents", path: "/loan/documents" },
  { number: 6, label: "Review", path: "/loan/review" },
];

export function LoanFlowLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loanData, setLoanData] = useState<LoanData>({});

  const updateLoanData = (data: Partial<LoanData>) => {
    setLoanData((prev) => ({ ...prev, ...data }));
  };

  const currentStepIndex = steps.findIndex((step) => step.path === location.pathname);
  const currentStep = currentStepIndex >= 0 ? currentStepIndex + 1 : 1;

  const handleExit = () => {
    navigate("/");
  };

  return (
    <LoanFlowContext.Provider value={{ loanData, updateLoanData }}>
      <div className="min-h-screen" style={{ background: "#F8FAFC" }}>
        {/* Header */}
        <div
          className="sticky top-0 z-50"
          style={{
            background: "#F8FAFC",
            borderBottom: "1px solid #E2E8F0",
          }}
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-12 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "#2563EB",
                  boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
                }}
              >
                <HandCoins className="w-4 h-4 text-white" />
              </div>
              <div>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#1E293B",
                    letterSpacing: "-0.3px",
                    lineHeight: "18px",
                  }}
                >
                  Loan Request
                </p>
                <p
                  className="uppercase"
                  style={{
                    fontSize: 10,
                    color: "#94A3B8",
                    letterSpacing: "0.5px",
                    fontWeight: 600,
                  }}
                >
                  Step {currentStep} of {steps.length}
                </p>
              </div>
            </div>
            <button
              onClick={handleExit}
              className="flex items-center justify-center transition-all duration-200 cursor-pointer"
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: "1px solid #E8ECF1",
                background: "#fff",
                color: "#64748B",
              }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress */}
        <div
          style={{
            background: "#fff",
            borderBottom: "1px solid #F1F5F9",
          }}
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-12">
            <FlowProgress steps={steps} currentStep={currentStep} />
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <Outlet />
        </div>
      </div>
    </LoanFlowContext.Provider>
  );
}
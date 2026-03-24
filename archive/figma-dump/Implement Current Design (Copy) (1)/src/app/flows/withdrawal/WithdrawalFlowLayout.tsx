import { Outlet, useLocation, useNavigate } from "react-router";
import { FlowProgress } from "../../components/FlowProgress";
import { X, DollarSign } from "lucide-react";
import { useState, createContext, useContext } from "react";

interface WithdrawalData {
  type?: string;
  amount?: number;
  sources?: { name: string; amount: number }[];
  paymentMethod?: string;
  address?: string;
  grossNetElection?: string;
  federalWithholding?: number;
  stateWithholding?: number;
}

interface WithdrawalFlowContextType {
  withdrawalData: WithdrawalData;
  updateWithdrawalData: (data: Partial<WithdrawalData>) => void;
}

const WithdrawalFlowContext = createContext<WithdrawalFlowContextType | undefined>(undefined);

export function useWithdrawalFlow() {
  const context = useContext(WithdrawalFlowContext);
  if (!context) {
    throw new Error("useWithdrawalFlow must be used within WithdrawalFlowLayout");
  }
  return context;
}

const steps = [
  { number: 1, label: "Eligibility", path: "/withdrawal" },
  { number: 2, label: "Type", path: "/withdrawal/type" },
  { number: 3, label: "Source", path: "/withdrawal/source" },
  { number: 4, label: "Fees", path: "/withdrawal/fees" },
  { number: 5, label: "Payment", path: "/withdrawal/payment" },
  { number: 6, label: "Review", path: "/withdrawal/review" },
];

export function WithdrawalFlowLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [withdrawalData, setWithdrawalData] = useState<WithdrawalData>({});

  const updateWithdrawalData = (data: Partial<WithdrawalData>) => {
    setWithdrawalData((prev) => ({ ...prev, ...data }));
  };

  const currentStepIndex = steps.findIndex((step) => step.path === location.pathname);
  const currentStep = currentStepIndex >= 0 ? currentStepIndex + 1 : 1;

  const handleExit = () => {
    navigate("/");
  };

  return (
    <WithdrawalFlowContext.Provider value={{ withdrawalData, updateWithdrawalData }}>
      <div className="min-h-screen" style={{ background: "#F8FAFC" }}>
        <div
          className="sticky top-0 z-50"
          style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-12 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: "#2563EB",
                  boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
                }}
              >
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#1E293B", letterSpacing: "-0.3px", lineHeight: "18px" }}>
                  Withdrawal Request
                </p>
                <p className="uppercase" style={{ fontSize: 10, color: "#94A3B8", letterSpacing: "0.5px", fontWeight: 600 }}>
                  Step {currentStep} of {steps.length}
                </p>
              </div>
            </div>
            <button
              onClick={handleExit}
              className="flex items-center justify-center transition-all duration-200 cursor-pointer"
              style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #E8ECF1", background: "#fff", color: "#64748B" }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div style={{ background: "#fff", borderBottom: "1px solid #F1F5F9" }}>
          <div className="max-w-[1200px] mx-auto px-4 sm:px-12">
            <FlowProgress steps={steps} currentStep={currentStep} />
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          <Outlet />
        </div>
      </div>
    </WithdrawalFlowContext.Provider>
  );
}

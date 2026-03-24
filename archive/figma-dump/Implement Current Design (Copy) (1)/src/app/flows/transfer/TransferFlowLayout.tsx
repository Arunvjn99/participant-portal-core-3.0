import { Outlet, useLocation, useNavigate } from "react-router";
import { FlowProgress } from "../../components/FlowProgress";
import { X, ArrowLeftRight } from "lucide-react";
import { useState, createContext, useContext } from "react";

interface Fund {
  name: string;
  currentAllocation: number;
  newAllocation: number;
}

interface TransferData {
  transferType?: string;
  funds?: Fund[];
}

interface TransferFlowContextType {
  transferData: TransferData;
  updateTransferData: (data: Partial<TransferData>) => void;
}

const TransferFlowContext = createContext<TransferFlowContextType | undefined>(
  undefined
);

export function useTransferFlow() {
  const context = useContext(TransferFlowContext);
  if (!context) {
    throw new Error("useTransferFlow must be used within TransferFlowLayout");
  }
  return context;
}

const steps = [
  { number: 1, label: "Type", path: "/transfer" },
  { number: 2, label: "Source", path: "/transfer/source" },
  { number: 3, label: "Destination", path: "/transfer/destination" },
  { number: 4, label: "Amount", path: "/transfer/amount" },
  { number: 5, label: "Impact", path: "/transfer/impact" },
  { number: 6, label: "Review", path: "/transfer/review" },
];

export function TransferFlowLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [transferData, setTransferData] = useState<TransferData>({});

  const updateTransferData = (data: Partial<TransferData>) => {
    setTransferData((prev) => ({ ...prev, ...data }));
  };

  const currentStepIndex = steps.findIndex(
    (step) => step.path === location.pathname
  );
  const currentStep = currentStepIndex >= 0 ? currentStepIndex + 1 : 1;

  return (
    <TransferFlowContext.Provider value={{ transferData, updateTransferData }}>
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
                <ArrowLeftRight className="w-4 h-4 text-white" />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#1E293B", letterSpacing: "-0.3px", lineHeight: "18px" }}>
                  Transfer Funds
                </p>
                <p className="uppercase" style={{ fontSize: 10, color: "#94A3B8", letterSpacing: "0.5px", fontWeight: 600 }}>
                  Step {currentStep} of {steps.length}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/")}
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
    </TransferFlowContext.Provider>
  );
}

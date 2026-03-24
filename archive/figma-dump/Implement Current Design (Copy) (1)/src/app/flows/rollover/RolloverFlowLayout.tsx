import { Outlet, useLocation, useNavigate } from "react-router";
import { FlowProgress } from "../../components/FlowProgress";
import { X, RefreshCcw } from "lucide-react";
import { useState, createContext, useContext } from "react";

interface RolloverData {
  previousEmployer?: string;
  planAdministrator?: string;
  accountNumber?: string;
  estimatedAmount?: number;
  rolloverType?: string;
  isCompatible?: boolean;
  allocation?: { fundName: string; percentage: number }[];
}

interface RolloverFlowContextType {
  rolloverData: RolloverData;
  updateRolloverData: (data: Partial<RolloverData>) => void;
}

const RolloverFlowContext = createContext<RolloverFlowContextType | undefined>(
  undefined
);

export function useRolloverFlow() {
  const context = useContext(RolloverFlowContext);
  if (!context) {
    throw new Error(
      "useRolloverFlow must be used within RolloverFlowLayout"
    );
  }
  return context;
}

const steps = [
  { number: 1, label: "Plan Details", path: "/rollover" },
  { number: 2, label: "Validation", path: "/rollover/validation" },
  { number: 3, label: "Allocation", path: "/rollover/allocation" },
  { number: 4, label: "Documents", path: "/rollover/documents" },
  { number: 5, label: "Review", path: "/rollover/review" },
];

export function RolloverFlowLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [rolloverData, setRolloverData] = useState<RolloverData>({});

  const updateRolloverData = (data: Partial<RolloverData>) => {
    setRolloverData((prev) => ({ ...prev, ...data }));
  };

  const currentStepIndex = steps.findIndex(
    (step) => step.path === location.pathname
  );
  const currentStep = currentStepIndex >= 0 ? currentStepIndex + 1 : 1;

  const handleExit = () => {
    navigate("/");
  };

  return (
    <RolloverFlowContext.Provider value={{ rolloverData, updateRolloverData }}>
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
                <RefreshCcw className="w-4 h-4 text-white" />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#1E293B", letterSpacing: "-0.3px", lineHeight: "18px" }}>
                  Rollover Request
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
    </RolloverFlowContext.Provider>
  );
}

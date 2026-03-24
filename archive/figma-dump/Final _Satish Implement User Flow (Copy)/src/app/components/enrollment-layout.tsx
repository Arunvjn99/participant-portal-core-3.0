import { Outlet, useLocation } from "react-router";
import { EnrollmentProvider, useEnrollment } from "./enrollment-context";
import {
  LayoutDashboard,
  Landmark,
  ArrowLeftRight,
  TrendingUp,
  User,
  Bell,
} from "lucide-react";

const steps = [
  { label: "Plan", path: "/plan" },
  { label: "Contribution", path: "/contribution" },
  { label: "Source", path: "/contribution-source" },
  { label: "Auto Increase", path: "/auto-increase" },
  { label: "Investment", path: "/investment" },
  { label: "Readiness", path: "/readiness" },
  { label: "Review", path: "/review" },
];

const navTabs: { label: string; icon: typeof LayoutDashboard; active?: boolean }[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Retirement Plan", icon: Landmark, active: true },
  { label: "Transactions", icon: ArrowLeftRight },
  { label: "Investments", icon: TrendingUp },
  { label: "Profile", icon: User },
];

function EnrollmentLayoutInner() {
  const { currentStep } = useEnrollment();
  const location = useLocation();
  const isSuccess = location.pathname === "/success";
  const isWizard = location.pathname === "/" || location.pathname === "/wizard";
  const showStepper = !isSuccess && !isWizard;

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex flex-col">
      {/* Top Nav */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Landmark className="w-4 h-4 text-white" />
          </div>
          <span className="hidden sm:inline text-gray-900" style={{ fontWeight: 600 }}>RetireWell</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center relative">
            <Bell className="w-4 h-4 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700" style={{ fontWeight: 600, fontSize: "0.8rem" }}>
            JD
          </div>
        </div>
      </header>

      {/* Secondary Nav Tabs */}
      <nav className="bg-white border-b border-gray-200 overflow-x-auto">
        <div className="flex px-2 max-w-4xl mx-auto">
          {navTabs.map((tab) => (
            <button
              key={tab.label}
              className={`flex items-center gap-1.5 px-3 py-2.5 whitespace-nowrap border-b-2 transition-colors ${
                tab.active
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              style={{ fontSize: "0.8rem" }}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Wizard Banner (when on wizard) */}
      {isWizard && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-center">
          <p className="text-white" style={{ fontSize: "0.85rem", fontWeight: 500 }}>
            Let's personalize your retirement plan in a few quick steps
          </p>
        </div>
      )}

      {/* Progress Stepper (enrollment flow only) */}
      {showStepper && (
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="max-w-3xl mx-auto">
            <p className="text-gray-500 mb-2" style={{ fontSize: "0.75rem" }}>
              Step {currentStep} of 7
            </p>
            <div className="flex items-center gap-1">
              {steps.map((step, i) => {
                const stepNum = i + 1;
                const isCompleted = stepNum < currentStep;
                const isCurrent = stepNum === currentStep;
                return (
                  <div key={step.label} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex items-center">
                      <div
                        className={`w-full h-1.5 rounded-full transition-colors ${
                          isCompleted
                            ? "bg-blue-600"
                            : isCurrent
                            ? "bg-blue-400"
                            : "bg-gray-200"
                        }`}
                      />
                    </div>
                    <span
                      className={`hidden md:block transition-colors ${
                        isCurrent ? "text-blue-600" : isCompleted ? "text-gray-700" : "text-gray-400"
                      }`}
                      style={{ fontSize: "0.7rem", fontWeight: isCurrent ? 600 : 400 }}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 max-w-5xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
}

export function EnrollmentLayout() {
  return (
    <EnrollmentProvider>
      <EnrollmentLayoutInner />
    </EnrollmentProvider>
  );
}

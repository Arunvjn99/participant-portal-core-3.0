import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { branding } from "../../config/branding";
import { EnrollmentStepper } from "./EnrollmentStepper";

export interface EnrollmentHeaderWithStepperProps {
  /** Current step index (0-based). Plan=0, Contribution=1, Auto Increase=2, Investment=3, Review=4 */
  activeStep: number;
}

function useCompactStepper() {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 600px)");
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return compact;
}

function useDesktopStepper() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return desktop;
}

/**
 * Enrollment header with embedded stepper (DealShip-style).
 * Top bar: logo | "Enrollment" | user/menu. Below: divider + horizontal stepper.
 * Stays visible while scrolling (sticky is on the parent header in DashboardLayout).
 */
export function EnrollmentHeaderWithStepper({ activeStep }: EnrollmentHeaderWithStepperProps) {
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const compact = useCompactStepper();
  const desktop = useDesktopStepper();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuOpen]);

  const { logo, footer } = branding;

  return (
    <div className="enrollment-header flex flex-col w-full">
      {/* Top bar: logo | context | actions */}
      <div className="enrollment-header__top flex h-14 sm:h-16 items-center w-full">
        <div className="enrollment-header__inner flex w-full max-w-[1440px] mx-auto px-6 lg:px-8 items-center justify-between gap-4">
          <div className="flex shrink-0 items-center gap-3">
            <img
              src={footer.core.src}
              alt={footer.core.label}
              className="h-7 w-auto object-contain sm:h-8"
            />
            <span className="h-5 w-px shrink-0 bg-slate-200 dark:bg-slate-600" aria-hidden />
            <img src={logo.src} alt={logo.alt} className="h-7 w-auto object-contain sm:h-8" />
            <span className="h-5 w-px shrink-0 bg-slate-200 dark:bg-slate-600 hidden sm:block" aria-hidden />
            <span className="hidden sm:inline text-sm font-medium text-slate-600 dark:text-slate-400">
              Enrollment
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              aria-label="User menu"
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
              onClick={() => setUserMenuOpen((o) => !o)}
            >
              <span className="w-5 h-5 flex items-center justify-center text-lg" aria-hidden>👤</span>
            </button>
            <div className="relative" ref={userMenuRef}>
              {userMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-1 z-50 min-w-[160px] rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800"
                  role="menu"
                >
                  <button
                    type="button"
                    className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                    role="menuitem"
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate("/profile");
                    }}
                  >
                    Profile
                  </button>
                  <button
                    type="button"
                    className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                    role="menuitem"
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate("/");
                    }}
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Single reusable stepper: intelligent-plan-selector style (emerald completed, indigo current). */}
      <div className="enrollment-header__stepper-bar border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-3">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <EnrollmentStepper
            currentStep={activeStep}
            stepLabels={["Plan", "Contribution", "Auto Increase", "Investment", "Review"]}
            compact={!desktop && compact}
          />
        </div>
      </div>
    </div>
  );
}

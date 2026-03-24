import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  HelpCircle,
  Info,
  Landmark,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { pathForWizardStep } from "../flow/v1WizardPaths";
import type { SelectedPlanOption } from "../store/useEnrollmentStore";
import { useEnrollmentStore } from "../store/useEnrollmentStore";
import { cn } from "@/lib/utils";

export function ChoosePlan() {
  const navigate = useNavigate();
  const data = useEnrollmentStore();
  const updateField = useEnrollmentStore((s) => s.updateField);
  const nextStep = useEnrollmentStore((s) => s.nextStep);

  const [showAI, setShowAI] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlanOption | null>(data.selectedPlan);
  const [showTooltip, setShowTooltip] = useState(false);

  const companyPlans = data.companyPlans;
  const hasTwoPlans = companyPlans.length >= 2;

  const confirmPlan = (plan: SelectedPlanOption) => {
    updateField("selectedPlan", plan);
    nextStep();
    navigate(pathForWizardStep(1));
  };

  const handleCardClick = (plan: SelectedPlanOption) => {
    setSelectedPlan(plan);
  };

  if (!hasTwoPlans) {
    const onlyPlan = companyPlans[0] ?? "traditional";
    const planLabel = onlyPlan === "traditional" ? "Traditional 401(k)" : "Roth 401(k)";

    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="card w-full max-w-md space-y-5 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Landmark className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground md:text-xl">
              Your employer offers a {planLabel} retirement plan
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {onlyPlan === "traditional"
                ? "This plan allows tax-deferred retirement savings. Your contributions reduce your taxable income today."
                : "This plan allows you to contribute after-tax dollars and withdraw tax-free in retirement."}
            </p>
          </div>

          <div className="success-callout success-callout--compact">
            <Info className="success-callout-icon h-4 w-4" aria-hidden />
            <p className="text-left text-xs text-foreground/90">
              Your employer matches contributions up to 6%.
            </p>
          </div>

          <button
            type="button"
            onClick={() => confirmPlan(onlyPlan)}
            className="btn btn-primary w-full"
          >
            Continue to Contributions
            <ArrowRight className="size-4 shrink-0" aria-hidden />
          </button>
          <p className="text-xs text-muted-foreground">
            You can change this plan later from your account settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="text-center md:text-left">
        <h1 className="text-xl font-semibold text-foreground md:text-2xl">Choose Your Retirement Plan</h1>
        <p className="mt-1 text-sm text-muted-foreground md:text-base">
          Select the retirement plan that fits your tax strategy.
        </p>
      </div>

      <div className="callout-bar">
        <Info className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
        <p className="text-xs text-muted-foreground md:text-sm">
          Your employer matches contributions up to <strong className="text-foreground">6%</strong> of your
          salary — that&apos;s free money toward your retirement.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div
          role="button"
          tabIndex={0}
          onClick={() => handleCardClick("traditional")}
          onKeyDown={(e) => e.key === "Enter" && handleCardClick("traditional")}
          className={cn(
            "plan-option-card",
            selectedPlan === "traditional" && "plan-option-card--selected",
          )}
        >
          <div className="relative mb-1">
            <span
              className="badge-pill badge-pill--warning"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              Most Common Choice
              <HelpCircle className="h-3 w-3 opacity-70" aria-hidden />
            </span>
            {showTooltip ? (
              <div className="enroll-tooltip">
                Chosen by most employees because it reduces taxable income today.
              </div>
            ) : null}
          </div>

          <h3 className="font-semibold text-foreground">Traditional 401(k)</h3>
          <p className="mt-1 text-sm text-muted-foreground">Lower taxes today and grow savings tax-deferred.</p>

          <ul className="mt-4 flex-1 space-y-2">
            {["Lower taxable income today", "Employer match eligible", "Tax-deferred growth"].map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-foreground/90">
                <Check className="icon-check-success" aria-hidden />
                {b}
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              confirmPlan("traditional");
            }}
            className="btn btn-primary mt-5 w-full"
          >
            Continue with Traditional 401(k)
            <ArrowRight className="size-4 shrink-0" aria-hidden />
          </button>
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => handleCardClick("roth")}
          onKeyDown={(e) => e.key === "Enter" && handleCardClick("roth")}
          className={cn("plan-option-card", selectedPlan === "roth" && "plan-option-card--selected")}
        >
          <h3 className="font-semibold text-foreground">Roth 401(k)</h3>
          <p className="mt-1 text-sm text-muted-foreground">Pay taxes now and withdraw tax-free in retirement.</p>

          <ul className="mt-4 flex-1 space-y-2">
            {[
              "Tax-free withdrawals in retirement",
              "Flexible retirement income",
              "No required minimum distributions",
            ].map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-foreground/90">
                <Check className="icon-check-success" aria-hidden />
                {b}
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              confirmPlan("roth");
            }}
            className="btn btn-outline mt-5 w-full"
          >
            Choose Roth 401(k)
            <ArrowRight className="size-4 shrink-0" aria-hidden />
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground md:text-sm">
        You can change this plan later from your account settings.
      </p>

      <div className="border-t border-border pt-2" />

      <div className="card-soft space-y-3">
        <p className="font-medium text-foreground">Not sure which plan is right for you?</p>
        <p className="text-sm text-muted-foreground">Our AI assistant can help explain the differences.</p>
        <div className="mt-3 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              setShowAI(!showAI);
              setShowCompare(false);
            }}
            className={cn("btn w-full sm:w-auto", showAI ? "btn-primary" : "btn-outline")}
          >
            <Sparkles className="size-4 shrink-0" aria-hidden />
            Ask AI
          </button>
          <button
            type="button"
            onClick={() => {
              setShowCompare(!showCompare);
              setShowAI(false);
            }}
            className={cn("btn btn-outline w-full sm:w-auto", showCompare && "btn--pressed")}
          >
            <MessageCircle className="size-4 shrink-0" aria-hidden />
            Compare Plans
          </button>
        </div>

        {showAI ? (
          <div className="card-highlight mt-4">
            <div className="flex items-start gap-2">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <div className="text-sm">
                <p className="font-semibold text-foreground">AI Recommendation</p>
                <p className="mt-1 text-muted-foreground">
                  <strong className="text-foreground">Traditional 401(k)</strong> is ideal if you expect to be in
                  a lower tax bracket in retirement — your contributions reduce your taxable income now.{" "}
                  <strong className="text-foreground">Roth 401(k)</strong> is better if you expect higher income
                  later — you pay taxes now but withdraw tax-free. Most employees benefit from the Traditional plan
                  due to the immediate tax savings and employer match.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {showCompare ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-2 text-left font-medium text-muted-foreground">Feature</th>
                  <th className="py-2 text-left font-semibold text-foreground">Traditional</th>
                  <th className="py-2 text-left font-semibold text-foreground">Roth</th>
                </tr>
              </thead>
              <tbody className="text-foreground/90">
                <tr className="border-b border-border/60">
                  <td className="py-2 text-muted-foreground">Contributions</td>
                  <td className="py-2">Pre-tax</td>
                  <td className="py-2">After-tax</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="py-2 text-muted-foreground">Withdrawals</td>
                  <td className="py-2">Taxed</td>
                  <td className="py-2">Tax-free</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="py-2 text-muted-foreground">Tax benefit</td>
                  <td className="py-2">Now</td>
                  <td className="py-2">In retirement</td>
                </tr>
                <tr className="border-b border-border/60">
                  <td className="py-2 text-muted-foreground">RMDs</td>
                  <td className="py-2">Required</td>
                  <td className="py-2">None</td>
                </tr>
                <tr>
                  <td className="py-2 text-muted-foreground">Best for</td>
                  <td className="py-2">Higher tax bracket now</td>
                  <td className="py-2">Higher tax bracket later</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}

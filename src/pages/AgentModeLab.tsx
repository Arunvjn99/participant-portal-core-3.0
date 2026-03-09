/**
 * Agent Mode Lab — SAFE EXPERIMENTAL SANDBOX
 *
 * Simulates an AI advisor guided experience with:
 * - Left: 3D avatar scene (AgentAvatarScene)
 * - Center: Simulated enrollment step UI (plan → contribution → … → review)
 * - Bottom-left: Advisor message panel
 *
 * Route: /agent-lab
 * Do not connect to Supabase or existing enrollment logic.
 */

import { useState } from "react";
import { AgentAvatarScene } from "../components/AgentAvatarScene";

type StepId =
  | "plan"
  | "contribution"
  | "autoIncrease"
  | "investment"
  | "readiness"
  | "review";

const STEPS: StepId[] = [
  "plan",
  "contribution",
  "autoIncrease",
  "investment",
  "readiness",
  "review",
];

const STEP_LABELS: Record<StepId, string> = {
  plan: "Plan",
  contribution: "Contribution",
  autoIncrease: "Auto Increase",
  investment: "Investment",
  readiness: "Readiness",
  review: "Review",
};

/* ─── Step: Plan (Roth vs Traditional) ─── */

function PlanStepCard() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-lg w-full border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900">Choose your plan</h2>
      <p className="text-gray-600 mt-1">Select Roth or Traditional for this prototype.</p>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border-2 border-indigo-200 bg-indigo-50/50 cursor-pointer hover:border-indigo-400 transition-colors">
          <p className="font-semibold text-gray-900">Roth</p>
          <p className="text-sm text-gray-600 mt-1">Contributions after tax; tax-free growth.</p>
        </div>
        <div className="p-4 rounded-xl border-2 border-gray-200 bg-gray-50 cursor-pointer hover:border-gray-300 transition-colors">
          <p className="font-semibold text-gray-900">Traditional</p>
          <p className="text-sm text-gray-600 mt-1">Pre-tax contributions; taxed in retirement.</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Step: Contribution ─── */

function ContributionStepCard() {
  const [percent, setPercent] = useState(6);
  const matchLimit = 6;
  const isAtMatch = percent >= matchLimit;
  const employerMatchAmount = 173.08;
  const paycheckImpact = 180;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-lg w-full border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900">Contribution</h2>
      <p className="text-gray-600 mt-1">How much would you like to save from each paycheck?</p>

      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Contribution</span>
          <span className="text-2xl font-bold text-indigo-600">{percent}%</span>
        </div>
        <input
          type="range"
          min={1}
          max={25}
          value={percent}
          onChange={(e) => setPercent(Number(e.target.value))}
          className="w-full h-3 rounded-full appearance-none cursor-pointer accent-indigo-600"
          style={{
            background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${(percent / 25) * 100}%, #e5e7eb ${(percent / 25) * 100}%, #e5e7eb 100%)`,
          }}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1%</span>
          <span className="font-semibold text-indigo-600">MATCH LIMIT</span>
          <span>25%</span>
        </div>
      </div>

      <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-800">Employer Match</p>
            <p className="text-2xl font-bold text-emerald-700">${employerMatchAmount.toFixed(2)}</p>
          </div>
          {isAtMatch && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white">
              Max match unlocked
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
        <p className="text-sm text-gray-700">
          This contribution reduces take-home pay by approximately{" "}
          <strong>${paycheckImpact}</strong> per paycheck.
        </p>
      </div>
    </div>
  );
}

/* ─── Step: Auto Increase ─── */

function AutoIncreaseStepCard() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-lg w-full border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900">Auto Increase</h2>
      <p className="text-gray-600 mt-1">How would you like your contribution to change over time?</p>
      <div className="mt-6 space-y-4">
        <div className="p-4 rounded-xl border-2 border-gray-200 bg-gray-50 cursor-pointer hover:border-indigo-300 transition-colors">
          <p className="font-semibold text-gray-900">Keep steady</p>
          <p className="text-sm text-gray-600 mt-1">No automatic increases.</p>
        </div>
        <div className="p-4 rounded-xl border-2 border-indigo-200 bg-indigo-50/50 cursor-pointer hover:border-indigo-400 transition-colors">
          <p className="font-semibold text-gray-900">Grow gradually</p>
          <p className="text-sm text-gray-600 mt-1">Increase by 1% each year until cap.</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Step: Investment ─── */

function InvestmentStepCard() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-lg w-full border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900">Investment</h2>
      <p className="text-gray-600 mt-1">Allocation placeholder for the prototype.</p>
      <div className="mt-6 p-6 rounded-xl bg-gray-100 border border-gray-200">
        <div className="h-40 flex items-center justify-center text-gray-500">
          [ Allocation chart placeholder ]
        </div>
        <p className="text-center text-sm text-gray-500 mt-2">Stocks / Bonds / Other</p>
      </div>
    </div>
  );
}

/* ─── Step: Readiness ─── */

function ReadinessStepCard() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-lg w-full border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900">Readiness</h2>
      <p className="text-gray-600 mt-1">Your readiness score and gap.</p>
      <div className="mt-6 p-6 rounded-xl bg-indigo-50 border border-indigo-100">
        <p className="text-4xl font-bold text-indigo-600">72</p>
        <p className="text-sm font-medium text-indigo-800 mt-1">Readiness score</p>
      </div>
      <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-100">
        <p className="text-sm font-medium text-amber-800">Gap</p>
        <p className="text-sm text-amber-700 mt-1">
          Increasing contribution by 2% could improve your score.
        </p>
      </div>
    </div>
  );
}

/* ─── Step: Review ─── */

function ReviewStepCard() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-lg w-full border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900">Review</h2>
      <p className="text-gray-600 mt-1">Summary for this prototype.</p>
      <div className="mt-6 space-y-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Plan</span>
          <span className="font-medium text-gray-900">Roth</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Contribution</span>
          <span className="font-medium text-gray-900">6%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Auto increase</span>
          <span className="font-medium text-gray-900">Grow gradually</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Readiness</span>
          <span className="font-medium text-gray-900">72</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Step router ─── */

function StepCard({ step }: { step: StepId }) {
  switch (step) {
    case "plan":
      return <PlanStepCard />;
    case "contribution":
      return <ContributionStepCard />;
    case "autoIncrease":
      return <AutoIncreaseStepCard />;
    case "investment":
      return <InvestmentStepCard />;
    case "readiness":
      return <ReadinessStepCard />;
    case "review":
      return <ReviewStepCard />;
    default:
      return <ContributionStepCard />;
  }
}

/* ─── Advisor panel ─── */

function AdvisorPanel() {
  return (
    <div
      className="absolute bottom-6 left-6 right-auto w-full max-w-sm rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl p-4"
      style={{ left: "calc(35% + 1rem)", bottom: "1.5rem" }}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-indigo-200 mb-2">
        Advisor
      </p>
      <p className="text-sm text-white/95 leading-relaxed mb-4">
        Your employer matches up to 6%. Contributing at least 6% ensures you receive the full
        employer match.
      </p>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          className="w-full py-2.5 px-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-sm transition-colors duration-150"
        >
          Set Contribution to 6%
        </button>
        <button
          type="button"
          className="w-full py-2.5 px-4 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold text-sm transition-colors duration-150 border border-white/30"
        >
          Ask Core AI
        </button>
      </div>
    </div>
  );
}

/* ─── Page ─── */

type AnimationState = "talking" | "pointing";

export function AgentModeLab() {
  const [stepIndex, setStepIndex] = useState(0);
  const [animationState, setAnimationState] = useState<AnimationState>("talking");
  const step = STEPS[stepIndex];

  const goNext = () => {
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    setAnimationState("pointing");
    window.setTimeout(() => setAnimationState("talking"), 3000);
  };
  const goBack = () => {
    setStepIndex((i) => Math.max(i - 1, 0));
  };

  return (
    <div
      className="min-h-screen w-full flex relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900"
    >
      {/* Left: 3D avatar (35%) */}
      <div className="w-[35%] min-w-[300px] h-screen flex-shrink-0 flex items-center justify-center bg-black/10">
        <div className="w-full h-full rounded-xl overflow-hidden">
          <AgentAvatarScene animationState={animationState} />
        </div>
      </div>

      {/* Center: Enrollment step UI */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <p className="text-sm text-white/80 mb-2">
          Step {stepIndex + 1} of {STEPS.length}: {STEP_LABELS[step]}
        </p>
        <StepCard step={step} />
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={goBack}
            disabled={stepIndex === 0}
            className="px-5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:pointer-events-none text-white font-semibold text-sm transition-colors border border-white/30"
          >
            Back
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={stepIndex === STEPS.length - 1}
            className="px-5 py-2.5 rounded-xl bg-white text-indigo-700 hover:bg-white/95 font-semibold text-sm transition-colors disabled:opacity-50 disabled:pointer-events-none"
          >
            Next Step
          </button>
        </div>
      </div>

      {/* Bottom-left: Advisor panel */}
      <AdvisorPanel />
    </div>
  );
}

export default AgentModeLab;

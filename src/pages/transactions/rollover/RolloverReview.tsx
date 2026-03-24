import { useState } from "react";
import { FlowPageHeader, FlowCard, FlowCardTitle, FlowNavButtons, FlowSuccessState } from "@/components/transactions/FigmaFlowUI";
import { useVersionedTxNavigate } from "../lib/nav";
import { getRoutingVersion, withVersion } from "@/core/version";
import { useNavigate, useLocation } from "react-router-dom";

const DETAILS = [
  { label: "Rollover Type", value: "Traditional 401(k)" },
  { label: "Previous Employer", value: "Acme Corporation" },
  { label: "Plan Administrator", value: "Fidelity Investments" },
  { label: "Estimated Amount", value: "$48,500" },
  { label: "Allocation Method", value: "Match current election" },
  { label: "Processing Time", value: "5–10 business days" },
];

export default function RolloverReviewPage() {
  const go = useVersionedTxNavigate();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const version = getRoutingVersion(pathname);

  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => navigate(withVersion(version, "/transactions"), { replace: true }), 2000);
    }, 1500);
  };

  if (submitted) {
    return <FlowSuccessState title="Rollover Submitted" description="Your rollover request has been submitted. Processing typically takes 5–10 business days." />;
  }

  return (
    <div className="space-y-4 w-full">
      <FlowPageHeader
        title="Review & Submit"
        description="Review your rollover details before submitting."
      />

      <FlowCard delay={0.05}>
        <FlowCardTitle>Rollover Summary</FlowCardTitle>
        <div className="grid grid-cols-2 gap-5">
          {DETAILS.map((item) => (
            <div key={item.label}>
              <p style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 4 }}>{item.label}</p>
              <p style={{ fontSize: 16, fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.3px" }}>{item.value}</p>
            </div>
          ))}
        </div>
      </FlowCard>

      <FlowCard delay={0.1}>
        <FlowCardTitle>Authorization</FlowCardTitle>
        <div
          style={{
            background: "var(--color-background-secondary)",
            borderRadius: 12,
            padding: "16px 20px",
            border: "1px solid var(--border)",
            marginBottom: 16,
            fontSize: 12,
            fontWeight: 500,
            color: "var(--color-text-secondary)",
            lineHeight: "20px",
          }}
        >
          By submitting, I authorize the rollover of funds from my previous employer&apos;s plan into my current 401(k). I understand that once initiated, this process cannot be reversed.
        </div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>
            I authorize this rollover request
          </span>
        </label>
      </FlowCard>

      <FlowNavButtons
        backLabel="Back to Allocation"
        nextLabel={isSubmitting ? "Submitting..." : "Submit Rollover"}
        onBack={() => go("rollover/allocation")}
        onNext={handleSubmit}
        disabled={!agreed}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

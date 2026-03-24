import { useState } from "react";
import { FlowPageHeader, FlowCard, FlowCardTitle, FlowNavButtons, FlowSuccessState } from "@/components/transactions/FigmaFlowUI";
import { useVersionedTxNavigate } from "../lib/nav";
import { getRoutingVersion, withVersion } from "@/core/version";
import { useNavigate, useLocation } from "react-router-dom";

const DETAILS = [
  { label: "Transfer Type", value: "Existing Balance" },
  { label: "From", value: "Stable Value Fund" },
  { label: "To", value: "Target Date 2045" },
  { label: "Amount", value: "$4,200" },
  { label: "Trade Date", value: "Next market close" },
  { label: "Tax Impact", value: "None" },
];

export default function TransferReviewPage() {
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
    return <FlowSuccessState title="Transfer Submitted" description="Your transfer request has been submitted. It will be processed at the next market close." />;
  }

  return (
    <div className="space-y-4 w-full">
      <FlowPageHeader
        title="Review & Confirm"
        description="Review your transfer details before submitting."
      />

      <FlowCard delay={0.05}>
        <FlowCardTitle>Transfer Summary</FlowCardTitle>
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
        <FlowCardTitle>Confirmation</FlowCardTitle>
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
          By confirming, I authorize this transfer within my retirement plan. I understand that transfers are executed at market close and cannot be cancelled once submitted.
        </div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>
            I confirm this transfer request
          </span>
        </label>
      </FlowCard>

      <FlowNavButtons
        backLabel="Back to Impact"
        nextLabel={isSubmitting ? "Submitting..." : "Confirm Transfer"}
        onBack={() => go("transfer/impact")}
        onNext={handleSubmit}
        disabled={!agreed}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

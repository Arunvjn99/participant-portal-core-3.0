import { useState } from "react";
import { FlowPageHeader, FlowCard, FlowCardTitle, FlowNavButtons, FlowSuccessState } from "@/components/transactions/FigmaFlowUI";
import { useVersionedTxNavigate } from "../lib/nav";
import { getRoutingVersion, withVersion } from "@/core/version";
import { useNavigate, useLocation } from "react-router-dom";

const SUMMARY = [
  { label: "Gross Amount", value: "$2,500" },
  { label: "Withdrawal Type", value: "Hardship" },
  { label: "Federal Withholding", value: "$500" },
  { label: "State Withholding", value: "$125" },
  { label: "Processing Fee", value: "$25" },
  { label: "Estimated Net", value: "$1,850" },
];

export default function WithdrawReviewPage() {
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
    return <FlowSuccessState title="Withdrawal Submitted" description="Your withdrawal request has been submitted. You'll receive a confirmation email shortly." />;
  }

  return (
    <div className="space-y-4 w-full">
      <FlowPageHeader
        title="Review & Submit"
        description="Confirm your withdrawal details before submitting."
      />

      <FlowCard delay={0.05}>
        <FlowCardTitle>Withdrawal Summary</FlowCardTitle>
        <div className="grid grid-cols-2 gap-5">
          {SUMMARY.map((item) => (
            <div key={item.label}>
              <p style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 4 }}>{item.label}</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.3px" }}>{item.value}</p>
            </div>
          ))}
        </div>
      </FlowCard>

      <FlowCard delay={0.1}>
        <FlowCardTitle>Terms &amp; Agreement</FlowCardTitle>
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
          By submitting, I authorize this withdrawal and acknowledge that taxes and applicable penalties will be withheld as described above.
        </div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer"
          />
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>
            I agree to the withdrawal terms and disclosures
          </span>
        </label>
      </FlowCard>

      <FlowNavButtons
        backLabel="Back to Payment"
        nextLabel={isSubmitting ? "Submitting..." : "Submit Withdrawal"}
        onBack={() => go("withdraw/payment")}
        onNext={handleSubmit}
        disabled={!agreed}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

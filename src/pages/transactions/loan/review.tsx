import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { FlowPageHeader, FlowCard, FlowCardTitle, FlowNavButtons, FlowSuccessState } from "@/components/transactions/FigmaFlowUI";
import { useLoanFlow } from "../contexts/LoanFlowContext";
import { useVersionedTxNavigate } from "../lib/nav";
import { getRoutingVersion, withVersion } from "@/core/version";
import { useNavigate, useLocation } from "react-router-dom";

const INTEREST_RATE = 0.08;

export default function LoanReviewPage() {
  const go = useVersionedTxNavigate();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const version = getRoutingVersion(pathname);
  const { loanData } = useLoanFlow();

  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const loanAmount = loanData.amount || 5000;
  const tenure = loanData.tenure || 3;
  const r = INTEREST_RATE / 12;
  const n = tenure * 12;
  const monthly = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalFees = 100;
  const netAmount = loanAmount - totalFees;

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => navigate(withVersion(version, "/transactions"), { replace: true }), 2000);
    }, 1500);
  };

  if (submitted) {
    return <FlowSuccessState title="Loan Request Submitted" description="Your loan request has been submitted successfully. You'll receive an email confirmation shortly." />;
  }

  const summaryItems = [
    { label: "Loan Amount", value: `$${loanAmount.toLocaleString()}` },
    { label: "Net Amount (after fees)", value: `$${netAmount.toLocaleString()}` },
    { label: "Monthly Payment", value: `$${Math.round(monthly).toLocaleString()}` },
    { label: "Interest Rate", value: "8%" },
    { label: "Loan Tenure", value: `${tenure} ${tenure === 1 ? "year" : "years"}` },
    { label: "Total Fees", value: `$${totalFees}` },
  ];

  return (
    <div className="space-y-4 w-full">
      <FlowPageHeader
        title="Review and Submit"
        description="Please review all details carefully before submitting your loan request."
      />

      <FlowCard delay={0.05}>
        <FlowCardTitle>Loan Summary</FlowCardTitle>
        <div className="grid grid-cols-2 gap-6">
          {summaryItems.map((item) => (
            <div key={item.label}>
              <p style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 4 }}>{item.label}</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.3px" }}>{item.value}</p>
            </div>
          ))}
        </div>
      </FlowCard>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}>
        <div style={{ background: "var(--card-bg)", borderRadius: 16, border: "1px solid var(--border)", padding: "24px 28px" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.3px", marginBottom: 16 }}>
            Terms &amp; Agreement
          </h3>
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
            By submitting this loan request, I authorize payroll deduction for repayment and agree to the loan terms and
            disclosures. I understand that missed payments may result in default and a taxable distribution.
          </div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>
              I have read and agree to the loan terms and disclosures
            </span>
          </label>
        </div>
      </motion.div>

      <FlowNavButtons
        backLabel="Back to Documents"
        nextLabel={isSubmitting ? "Submitting..." : "Submit Loan Request"}
        onBack={() => go("loan/documents")}
        onNext={handleSubmit}
        disabled={!agreed}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

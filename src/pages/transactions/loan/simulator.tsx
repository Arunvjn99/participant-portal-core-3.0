import { motion } from "framer-motion";
import { DollarSign, Calendar } from "lucide-react";
import { Slider } from "@/components/ui/Slider";
import { FlowPageHeader, FlowNavButtons } from "@/components/transactions/FigmaFlowUI";
import { TransactionCenterRetirementWidget } from "@/components/transactions/center/TransactionCenterRetirementWidget";
import { useLoanFlow } from "../contexts/LoanFlowContext";
import { useVersionedTxNavigate } from "../lib/nav";

const INTEREST_RATE = 0.08;

function calcMonthlyPayment(principal: number, years: number) {
  const r = INTEREST_RATE / 12;
  const n = years * 12;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export default function LoanSimulatorPage() {
  const go = useVersionedTxNavigate();
  const { loanData, updateLoanData } = useLoanFlow();

  const loanAmount = loanData.amount;
  const tenure = loanData.tenure;
  const maxLoan = 10000;

  const monthly = calcMonthlyPayment(loanAmount, tenure);
  const totalInterest = monthly * tenure * 12 - loanAmount;
  const totalPayback = loanAmount + totalInterest;
  const retirementImpact = Math.round(loanAmount * 1.64);
  const loanPayoffDate = new Date(2026 + tenure, 2, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="space-y-4 w-full">
      <FlowPageHeader
        title="Loan Simulator"
        description="Adjust the loan amount and tenure to see how it affects your payments and retirement."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {/* Input Controls */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
        >
          <div
            style={{
              background: "var(--card-bg)",
              borderRadius: 16,
              border: "1px solid var(--border)",
              padding: "20px 22px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background:
                  "linear-gradient(90deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 72%, var(--foreground)))",
                borderRadius: "16px 16px 0 0",
              }}
            />
            <h3
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--color-text-secondary)",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Loan Details
            </h3>

            <div className="space-y-3.5">
              {/* Loan Amount Slider */}
              <div>
                <div className="flex items-center gap-2" style={{ marginBottom: 10 }}>
                  <div
                    className="flex items-center justify-center"
                    style={{ width: 28, height: 28, borderRadius: 8, background: "var(--color-primary)", color: "var(--btn-primary-text)" }}
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-secondary)" }}>Loan Amount</span>
                </div>
                <div
                  style={{
                    background: "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 14%, var(--background)) 0%, color-mix(in srgb, var(--color-primary) 10%, var(--muted)) 100%)",
                    borderRadius: 14,
                    padding: "10px 16px",
                    marginBottom: 10,
                  }}
                >
                  <span style={{ fontSize: 26, fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.8px", lineHeight: 1 }}>
                    ${loanAmount.toLocaleString()}
                  </span>
                </div>
                <Slider
                  value={[loanAmount]}
                  onValueChange={(v) => updateLoanData({ amount: v[0] })}
                  min={1000}
                  max={maxLoan}
                  step={100}
                  className="mb-1.5"
                />
                <div className="flex justify-between">
                  <span style={{ fontSize: 9, color: "var(--color-text-tertiary)", fontWeight: 500 }}>$1,000</span>
                  <span style={{ fontSize: 9, color: "var(--color-text-tertiary)", fontWeight: 500 }}>${maxLoan.toLocaleString()} max</span>
                </div>
              </div>

              <div style={{ height: 1, background: "linear-gradient(90deg, transparent, var(--border), transparent)" }} />

              {/* Tenure Slider */}
              <div>
                <div className="flex items-center gap-2" style={{ marginBottom: 10 }}>
                  <div
                    className="flex items-center justify-center"
                    style={{ width: 28, height: 28, borderRadius: 8, background: "var(--color-primary)", color: "var(--btn-primary-text)" }}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-secondary)" }}>Loan Tenure</span>
                </div>
                <div
                  style={{
                    background: "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 6%, var(--muted)) 0%, color-mix(in srgb, var(--color-primary) 12%, var(--muted)) 100%)",
                    borderRadius: 14,
                    padding: "10px 16px",
                    marginBottom: 10,
                  }}
                >
                  <span style={{ fontSize: 26, fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.8px", lineHeight: 1 }}>
                    {tenure}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-secondary)", marginLeft: 6 }}>
                    {tenure === 1 ? "year" : "years"}
                  </span>
                </div>
                <Slider
                  value={[tenure]}
                  onValueChange={(v) => updateLoanData({ tenure: v[0] })}
                  min={1}
                  max={5}
                  step={1}
                  className="mb-1.5"
                />
                <div className="flex justify-between">
                  <span style={{ fontSize: 9, color: "var(--color-text-tertiary)", fontWeight: 500 }}>1 year</span>
                  <span style={{ fontSize: 9, color: "var(--color-text-tertiary)", fontWeight: 500 }}>5 years max</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Live Calculations + Retirement Widget */}
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            <div
              style={{
                background: "var(--card-bg)",
                borderRadius: 16,
                border: "1px solid var(--border)",
                padding: "20px 22px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background:
                  "linear-gradient(90deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 72%, var(--foreground)))",
                  borderRadius: "16px 16px 0 0",
                }}
              />
              <h3
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--color-text-secondary)",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}
              >
                Payment Details
              </h3>

              {/* Monthly Payment Hero */}
              <div
                style={{
                  background: "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 14%, var(--background)) 0%, color-mix(in srgb, var(--color-primary) 10%, var(--muted)) 100%)",
                  borderRadius: 12,
                  padding: "14px 18px",
                  marginBottom: 12,
                }}
              >
                <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
                  <div
                    className="flex items-center justify-center"
                    style={{ width: 28, height: 28, borderRadius: 8, background: "var(--color-primary)", color: "var(--btn-primary-text)" }}
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "var(--color-primary)" }}>Monthly Payment</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span style={{ fontSize: 28, fontWeight: 800, color: "var(--foreground)", letterSpacing: "-1px", lineHeight: 1 }}>
                    ${Math.round(monthly).toLocaleString()}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-secondary)" }}>/mo</span>
                </div>
              </div>

              {/* Secondary Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  {
                    label: "Total Interest",
                    value: `$${Math.round(totalInterest).toLocaleString()}`,
                    bg: "color-mix(in srgb, var(--color-primary) 14%, var(--background))",
                    color: "var(--color-primary)",
                    dot: "var(--color-primary)",
                  },
                  {
                    label: "Total Payback",
                    value: `$${Math.round(totalPayback).toLocaleString()}`,
                    bg: "color-mix(in srgb, var(--color-success) 16%, var(--background))",
                    color: "var(--color-success)",
                    dot: "var(--color-success)",
                  },
                ].map((item) => (
                  <div key={item.label} style={{ background: item.bg, borderRadius: 10, padding: "10px 14px" }}>
                    <div className="flex items-center gap-1.5" style={{ marginBottom: 4 }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: item.dot }} />
                      <span style={{ fontSize: 10, fontWeight: 600, color: item.color }}>{item.label}</span>
                    </div>
                    <p style={{ fontSize: 17, fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.5px" }}>{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Payoff Date */}
              <div
                className="flex items-center justify-between"
                style={{ marginTop: 8, background: "var(--color-background-secondary)", borderRadius: 10, padding: "10px 14px", border: "1px solid var(--border)" }}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3" style={{ color: "var(--color-primary)" }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-secondary)" }}>Loan Payoff Date</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.2px" }}>
                  {loanPayoffDate}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            <TransactionCenterRetirementWidget
              compact
              impactAmount={-retirementImpact}
              impactLabel={`−$${retirementImpact.toLocaleString()} projected impact from loan`}
              estimatedValue={38420}
              onTrack={loanAmount <= 5000}
            />
          </motion.div>
        </div>
      </div>

      <FlowNavButtons
        backLabel="Back"
        nextLabel="Continue to Configuration"
        onBack={() => go("loan/eligibility")}
        onNext={() => go("loan/configuration")}
      />
    </div>
  );
}

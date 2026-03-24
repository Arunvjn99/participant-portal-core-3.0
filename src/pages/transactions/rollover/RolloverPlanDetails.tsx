import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, ShieldCheck, Hash, DollarSign, Info, CheckCircle2 } from "lucide-react";
import { FlowPageHeader, FlowCard, FlowCardTitle, FlowNavButtons, FlowInfoBanner } from "@/components/transactions/FigmaFlowUI";
import { useVersionedTxNavigate } from "../lib/nav";

const ROLLOVER_TYPES = [
  { id: "traditional", label: "Traditional 401(k)", description: "Pre-tax contributions from a previous employer plan", Icon: Building2 },
  { id: "roth", label: "Roth 401(k)", description: "After-tax contributions with tax-free growth", Icon: ShieldCheck },
  { id: "ira", label: "Traditional IRA", description: "Individual retirement account rollover", Icon: DollarSign },
];

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: 12,
  border: "1.5px solid var(--border)",
  fontSize: 14,
  fontWeight: 500,
  color: "var(--foreground)",
  background: "var(--card-bg)",
  outline: "none",
};

export default function RolloverPlanDetailsPage() {
  const go = useVersionedTxNavigate();
  const [rolloverType, setRolloverType] = useState("");
  const [previousEmployer, setPreviousEmployer] = useState("");
  const [planAdministrator, setPlanAdministrator] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [estimatedAmount, setEstimatedAmount] = useState("");

  const isValid = rolloverType && previousEmployer.trim() && planAdministrator.trim() && accountNumber.trim() && estimatedAmount.trim();

  return (
    <div className="space-y-4 w-full">
      <FlowPageHeader
        title="Previous Plan Details"
        description="Enter details about the retirement plan you'd like to roll over into your current 401(k)."
      />

      {/* Rollover Type */}
      <FlowCard delay={0.05}>
        <FlowCardTitle>Rollover Type</FlowCardTitle>
        <p style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 16 }}>
          Select the type of account you&apos;re rolling over
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {ROLLOVER_TYPES.map((type) => {
            const isSelected = rolloverType === type.id;
            const Icon = type.Icon;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => setRolloverType(type.id)}
                className="relative text-left transition-all duration-200 cursor-pointer"
                style={{
                  padding: "16px 20px",
                  borderRadius: 14,
                  border: isSelected ? "1.5px solid var(--color-primary)" : "1.5px solid var(--border)",
                  background: isSelected ? "color-mix(in srgb, var(--color-primary) 14%, var(--background))" : "var(--card-bg)",
                }}
              >
                {isSelected && (
                  <CheckCircle2 className="absolute top-3 right-3" style={{ width: 16, height: 16, color: "var(--color-primary)" }} />
                )}
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: isSelected ? "color-mix(in srgb, var(--color-primary) 10%, var(--muted))" : "var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 10,
                  }}
                >
                  <Icon style={{ width: 18, height: 18, color: isSelected ? "var(--color-primary)" : "var(--color-text-secondary)" }} />
                </div>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)", marginBottom: 4 }}>{type.label}</h4>
                <p style={{ fontSize: 11, color: "var(--color-text-secondary)", lineHeight: "17px" }}>{type.description}</p>
              </button>
            );
          })}
        </div>
      </FlowCard>

      {/* Plan Information */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}>
        <div style={{ background: "var(--card-bg)", borderRadius: 16, border: "1px solid var(--border)", padding: "24px 28px" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.3px", marginBottom: 4 }}>Plan Information</h3>
          <p style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)", marginBottom: 20 }}>
            Provide details about your previous employer&apos;s retirement plan
          </p>
          <div className="space-y-4">
            {[
              { label: "Previous Employer Name", placeholder: "e.g., Acme Corporation", value: previousEmployer, onChange: setPreviousEmployer, Icon: Building2 },
              { label: "Plan Administrator", placeholder: "e.g., Fidelity Investments", value: planAdministrator, onChange: setPlanAdministrator, Icon: ShieldCheck },
              { label: "Account Number", placeholder: "e.g., 1234-5678-90", value: accountNumber, onChange: setAccountNumber, Icon: Hash },
            ].map((field) => (
              <div key={field.label}>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 8 }}>
                  <field.Icon style={{ width: 14, height: 14 }} />
                  {field.label}
                </label>
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder={field.placeholder}
                  style={inputStyle}
                />
              </div>
            ))}
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 8 }}>
                <DollarSign style={{ width: 14, height: 14 }} />
                Estimated Rollover Amount
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 16, fontWeight: 700, color: "var(--color-text-tertiary)" }}>$</span>
                <input
                  type="text"
                  value={estimatedAmount}
                  onChange={(e) => setEstimatedAmount(e.target.value.replace(/[^0-9.,]/g, ""))}
                  placeholder="0.00"
                  style={{ ...inputStyle, paddingLeft: 36 }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}>
        <FlowInfoBanner variant="info">
          <div className="flex items-start gap-2.5">
            <Info className="flex-shrink-0 mt-0.5" style={{ width: 16, height: 16, color: "var(--color-primary)" }} />
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "var(--color-primary)", marginBottom: 6 }}>What you&apos;ll need</p>
              <ul className="space-y-1.5">
                {[
                  "Your most recent statement from the previous plan",
                  "Contact information for the previous plan administrator",
                  "A check or transfer form from the previous plan (if applicable)",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span style={{ color: "var(--color-primary)", marginTop: 2, flexShrink: 0 }}>•</span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "var(--color-primary)" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </FlowInfoBanner>
      </motion.div>

      <FlowNavButtons
        backLabel="Cancel"
        nextLabel="Continue to Validation"
        onBack={() => go("transactions")}
        onNext={() => go("rollover/validation")}
        disabled={!isValid}
      />
    </div>
  );
}

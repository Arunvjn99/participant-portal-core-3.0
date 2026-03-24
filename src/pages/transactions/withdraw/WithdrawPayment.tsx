import { useState } from "react";
import { FlowPageHeader, FlowCard, FlowCardTitle, FlowNavButtons } from "@/components/transactions/FigmaFlowUI";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";
import { useVersionedTxNavigate } from "../lib/nav";

const METHODS = [
  { value: "ach", label: "ACH to linked bank", desc: "3–5 business days" },
  { value: "check", label: "Paper check by mail", desc: "7–10 business days" },
];

export default function WithdrawPaymentPage() {
  const go = useVersionedTxNavigate();
  const [method, setMethod] = useState("ach");

  return (
    <div className="space-y-4 w-full">
      <FlowPageHeader
        title="Payment Method"
        description="Choose how you want to receive your withdrawal."
      />

      <FlowCard delay={0.05}>
        <FlowCardTitle>Delivery Method</FlowCardTitle>
        <RadioGroup value={method} onValueChange={setMethod}>
          <div className="space-y-3">
            {METHODS.map((opt) => (
              <label
                key={opt.value}
                htmlFor={`pay-${opt.value}`}
                className="flex items-center gap-4 cursor-pointer transition-all duration-200"
                style={{
                  padding: "14px 18px",
                  borderRadius: 14,
                  border: method === opt.value ? "2px solid var(--color-primary)" : "1.5px solid var(--border)",
                  background: method === opt.value ? "color-mix(in srgb, var(--color-primary) 8%, var(--card-bg))" : "var(--card-bg)",
                }}
              >
                <RadioGroupItem value={opt.value} id={`pay-${opt.value}`} />
                <div className="flex-1">
                  <span style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)", display: "block" }}>{opt.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-tertiary)", display: "block", marginTop: 3 }}>{opt.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </RadioGroup>

        {method === "ach" && (
          <div style={{ marginTop: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 8 }}>Bank Account (last 4)</p>
            <input
              type="text"
              defaultValue="1234"
              className="w-full"
              style={{
                padding: "12px 16px",
                borderRadius: 12,
                border: "1.5px solid var(--border)",
                fontSize: 14,
                fontWeight: 600,
                color: "var(--foreground)",
                background: "var(--card-bg)",
                outline: "none",
              }}
            />
          </div>
        )}
      </FlowCard>

      <FlowNavButtons
        backLabel="Back to Fees"
        nextLabel="Continue to Review"
        onBack={() => go("withdraw/fees")}
        onNext={() => go("withdraw/review")}
      />
    </div>
  );
}

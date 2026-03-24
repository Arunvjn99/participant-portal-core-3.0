import { useState } from "react";
import { FlowPageHeader, FlowCard, FlowCardTitle, FlowNavButtons } from "@/components/transactions/FigmaFlowUI";
import { useVersionedTxNavigate } from "../lib/nav";

export default function TransferAmountPage() {
  const go = useVersionedTxNavigate();
  const [amount, setAmount] = useState("4,200");
  const [mode, setMode] = useState<"dollar" | "percent">("dollar");

  return (
    <div className="space-y-4 w-full">
      <FlowPageHeader
        title="Transfer Amount"
        description="Enter how much you want to move from the source fund."
      />

      <FlowCard delay={0.05}>
        <FlowCardTitle>Amount to Transfer</FlowCardTitle>

        <div className="flex gap-2" style={{ marginBottom: 16 }}>
          {[
            { id: "dollar" as const, label: "Dollar Amount ($)" },
            { id: "percent" as const, label: "Percentage (%)" },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setMode(opt.id)}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: 10,
                border: mode === opt.id ? "2px solid var(--color-primary)" : "1.5px solid var(--border)",
                background: mode === opt.id ? "color-mix(in srgb, var(--color-primary) 14%, var(--background))" : "var(--card-bg)",
                fontSize: 12,
                fontWeight: 600,
                color: mode === opt.id ? "var(--color-primary)" : "var(--color-text-secondary)",
                cursor: "pointer",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div style={{ position: "relative" }}>
          <span
            style={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 18,
              fontWeight: 700,
              color: "var(--color-text-tertiary)",
            }}
          >
            {mode === "dollar" ? "$" : "%"}
          </span>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="decimal"
            className="w-full"
            style={{
              paddingLeft: 36,
              paddingRight: 16,
              paddingTop: 14,
              paddingBottom: 14,
              borderRadius: 12,
              border: "1.5px solid var(--border)",
              fontSize: 22,
              fontWeight: 800,
              color: "var(--foreground)",
              letterSpacing: "-0.5px",
              background: "var(--card-bg)",
              outline: "none",
            }}
          />
        </div>
        <p style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-tertiary)", marginTop: 8 }}>
          You can transfer up to your full source balance, less any restricted amounts.
        </p>
      </FlowCard>

      <FlowNavButtons
        backLabel="Back to Source"
        nextLabel="Continue to Destination"
        onBack={() => go("transfer/source")}
        onNext={() => go("transfer/destination")}
        disabled={!amount || amount === "0"}
      />
    </div>
  );
}

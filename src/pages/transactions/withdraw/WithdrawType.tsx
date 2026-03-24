import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Info } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";
import { FlowPageHeader, FlowNavButtons, FlowInfoBanner } from "@/components/transactions/FigmaFlowUI";
import { useVersionedTxNavigate } from "../lib/nav";

const WITHDRAWAL_TYPES = [
  {
    id: "hardship",
    label: "Hardship Withdrawal",
    description:
      "For immediate and heavy financial needs such as medical expenses, preventing eviction, or funeral expenses. Documentation required.",
    warning: "May be subject to 10% early withdrawal penalty if under age 59½",
    warningColor: "var(--color-warning)",
  },
  {
    id: "in-service",
    label: "In-Service Withdrawal",
    description:
      "Available for participants who have reached age 59½ while still employed. No early withdrawal penalty applies.",
    warning: "Only available if you are age 59½ or older",
    warningColor: "var(--color-primary)",
  },
  {
    id: "termination",
    label: "Termination Withdrawal",
    description:
      "Full or partial distribution available after separation from service. You may also choose to roll over funds to another plan or IRA.",
    warning: "Requires proof of separation from employment",
    warningColor: "var(--color-text-secondary)",
  },
  {
    id: "rmd",
    label: "Required Minimum Distribution (RMD)",
    description:
      "Mandatory distribution required by law beginning at age 73. Failure to take RMDs may result in a 25% excise tax on the shortfall.",
    warning: "Calculated based on your account balance and life expectancy",
    warningColor: "var(--color-success)",
  },
  {
    id: "one-time",
    label: "One-Time Withdrawal",
    description:
      "Standard withdrawal for any purpose. Taxes and penalties may apply depending on your age and account type.",
    warning: undefined,
    warningColor: "",
  },
  {
    id: "full-balance",
    label: "Full Balance Withdrawal",
    description:
      "Withdraw your entire vested account balance. This will close your retirement account with this plan.",
    warning: "Warning: This action cannot be undone",
    warningColor: "var(--color-danger)",
  },
];

export default function WithdrawTypePage() {
  const go = useVersionedTxNavigate();
  const [selectedType, setSelectedType] = useState("");

  return (
    <div className="space-y-6 w-full">
      <FlowPageHeader
        title="Select Withdrawal Type"
        description="Select the type of withdrawal you want to make. Each type has different eligibility requirements and tax implications."
      />

      <RadioGroup value={selectedType} onValueChange={setSelectedType}>
        <div className="space-y-3">
          {WITHDRAWAL_TYPES.map((type, idx) => {
            const isSelected = selectedType === type.id;
            return (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + idx * 0.04, duration: 0.3 }}
              >
                <label
                  htmlFor={type.id}
                  className="block transition-all duration-200 cursor-pointer"
                  style={{
                    padding: "20px 24px",
                    borderRadius: 16,
                    border: isSelected ? "1.5px solid var(--color-primary)" : "1.5px solid var(--border)",
                    background: isSelected ? "color-mix(in srgb, var(--color-primary) 14%, var(--background))" : "var(--card-bg)",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <RadioGroupItem value={type.id} id={type.id} className="mt-0.5" />
                    <div className="flex-1">
                      <span style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)", display: "block" }}>
                        {type.label}
                      </span>
                      <p style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)", marginTop: 6, lineHeight: "20px" }}>
                        {type.description}
                      </p>
                      {type.warning && (
                        <p
                          className="flex items-center gap-1.5 mt-2"
                          style={{ fontSize: 12, fontWeight: 600, color: type.warningColor }}
                        >
                          <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                          {type.warning}
                        </p>
                      )}
                    </div>
                  </div>
                </label>
              </motion.div>
            );
          })}
        </div>
      </RadioGroup>

      {selectedType === "rmd" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <FlowInfoBanner variant="success">
            <div className="flex items-start gap-2.5">
              <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="mb-1 text-[13px] font-bold">RMD Calculation</p>
                <p className="text-xs font-medium leading-relaxed">
                  Your estimated RMD for 2026 is <span className="font-bold">$1,125</span> based on your current account
                  balance of $30,000 and the IRS Uniform Lifetime Table. This amount must be distributed by December 31,
                  2026.
                </p>
              </div>
            </div>
          </FlowInfoBanner>
        </motion.div>
      )}

      <FlowNavButtons
        backLabel="Back"
        nextLabel="Continue to Source Selection"
        onBack={() => go("withdraw/eligibility")}
        onNext={() => go("withdraw/source")}
        disabled={!selectedType}
      />
    </div>
  );
}

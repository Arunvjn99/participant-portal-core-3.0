import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  Building2,
  RefreshCw,
  Check,
  Clock,
  DollarSign,
  Calendar,
  CreditCard,
  BarChart3,
  Sparkles,
  X,
  ChevronDown,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/Select";
import { FlowPageHeader, FlowNavButtons } from "@/components/transactions/FigmaFlowUI";
import { cn } from "@/lib/utils";
import { purposeToReasonValue, storePurposeToParsed } from "@/core/ai/utils/parseLoanInput";
import { useLoanStore } from "@/stores/loanStore";
import { useLoanFlow } from "../contexts/LoanFlowContext";
import { useVersionedTxNavigate } from "../lib/nav";

function bannerPurposeLabel(p: string | null): string {
  if (p === "home") return "home";
  if (p === "medical") return "medical";
  if (p === "education") return "education";
  if (p === "general") return "general";
  return p ?? "";
}

const LOAN_TYPES = [
  {
    id: "general",
    label: "General Purpose Loan",
    description: "For personal expenses like education, travel, or medical",
    icon: Wallet,
    iconBg: "color-mix(in srgb, var(--color-primary) 14%, var(--background))",
    iconColor: "var(--color-primary)",
  },
  {
    id: "residential",
    label: "Home Purchase",
    description: "Primary residence loan from your retirement plan",
    icon: Building2,
    iconBg: "color-mix(in srgb, var(--color-success) 16%, var(--background))",
    iconColor: "var(--color-success)",
  },
  {
    id: "refinance",
    label: "Refinance",
    description: "Refinance an existing plan loan at current rates",
    icon: RefreshCw,
    iconBg: "color-mix(in srgb, var(--color-primary) 16%, var(--background))",
    iconColor: "var(--color-primary)",
  },
];

export default function LoanConfigurationPage() {
  const go = useVersionedTxNavigate();
  const { loanData, updateLoanData } = useLoanFlow();
  const aiPrefill = useLoanStore((s) => s.loanData);
  const showAiPrefillBanner = useLoanStore((s) => s.showAiPrefillBanner);
  const dismissAiPrefillBanner = useLoanStore((s) => s.dismissAiPrefillBanner);

  const [loanType, setLoanType] = useState(loanData.loanType || "general");
  const [reason, setReason] = useState(loanData.reason || "");
  const [disbursementMethod, setDisbursementMethod] = useState(loanData.disbursementMethod || "eft");
  const [showEftTip, setShowEftTip] = useState(true);
  const [showAmortization, setShowAmortization] = useState(false);
  const [repaymentFrequency, setRepaymentFrequency] = useState(loanData.repaymentFrequency || "biweekly");
  const [repaymentMethod, setRepaymentMethod] = useState(loanData.repaymentMethod || "payroll");

  const prefillAppliedKey = useRef<string | null>(null);
  useEffect(() => {
    if (aiPrefill.amount == null) return;
    const key = `${aiPrefill.amount}:${aiPrefill.purpose ?? ""}:${aiPrefill.loanType ?? ""}`;
    if (prefillAppliedKey.current === key) return;
    prefillAppliedKey.current = key;
    const lt = aiPrefill.loanType === "residential" ? "residential" : "general";
    const reasonVal = purposeToReasonValue(storePurposeToParsed(aiPrefill.purpose ?? null));
    updateLoanData({
      amount: aiPrefill.amount,
      loanType: lt,
      ...(reasonVal ? { reason: reasonVal } : {}),
    });
    setLoanType(lt);
    if (reasonVal) setReason(reasonVal);
  }, [aiPrefill.amount, aiPrefill.loanType, aiPrefill.purpose, updateLoanData]);

  const handleContinue = () => {
    updateLoanData({ loanType, reason, disbursementMethod, repaymentFrequency, repaymentMethod });
    go("loan/fees");
  };

  return (
    <div className="space-y-4 w-full">
      <FlowPageHeader
        title="Loan Configuration"
        description="Provide additional details about your loan request. Expand advanced sections for more options."
      />

      {showAiPrefillBanner && aiPrefill.amount != null ? (
        <div
          className="prefill-banner rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-[var(--foreground)]"
          role="status"
        >
          <span className="font-semibold text-[var(--color-primary)]">Prefilled from your request:</span>{" "}
          <span className="font-medium">${aiPrefill.amount.toLocaleString()}</span>
          {aiPrefill.purpose ? (
            <span className="text-[var(--color-text-secondary)]"> for {bannerPurposeLabel(aiPrefill.purpose)}</span>
          ) : null}
          <button
            type="button"
            className="ml-3 text-xs font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline"
            onClick={() => dismissAiPrefillBanner()}
          >
            Dismiss
          </button>
        </div>
      ) : null}

      {/* Loan Type Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
      >
        <div style={{ background: "var(--card-bg)", borderRadius: 16, border: "1px solid var(--border)", padding: "28px 32px" }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.3px", marginBottom: 4 }}>
            What type of loan do you need?
          </h3>
          <p style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-tertiary)", marginBottom: 16 }}>
            Select the loan type that best fits your situation
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
            {LOAN_TYPES.map((type) => {
              const isSelected = loanType === type.id;
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setLoanType(type.id)}
                  className="cursor-pointer transition-all duration-200"
                  style={{
                    position: "relative",
                    background: isSelected ? "color-mix(in srgb, var(--color-primary) 8%, var(--card-bg))" : "var(--card-bg)",
                    border: isSelected ? "2px solid var(--color-primary)" : "1.5px solid var(--border)",
                    borderRadius: 12,
                    padding: "16px 14px",
                    textAlign: "left",
                    minHeight: 130,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                  }}
                >
                  {isSelected && (
                    <div
                      style={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        background: "var(--color-primary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
                      }}
                    >
                      <Check style={{ width: 14, height: 14, color: "var(--btn-primary-text)" }} strokeWidth={3} />
                    </div>
                  )}
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: type.iconBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 16,
                    }}
                  >
                    <Icon style={{ width: 20, height: 20, color: type.iconColor }} />
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)", display: "block", marginBottom: 6, letterSpacing: "-0.2px" }}>
                    {type.label}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-tertiary)", lineHeight: "19px", display: "block" }}>
                    {type.description}
                  </span>
                </button>
              );
            })}
          </div>

          <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.3px", marginBottom: 10 }}>
            What&apos;s the loan for?
          </h3>
          <Select value={reason} onValueChange={setReason}>
            <SelectTrigger style={{ height: 48 }}>
              <SelectValue placeholder="Select a reason for your loan..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="home-purchase">Home Purchase</SelectItem>
              <SelectItem value="home-repair">Home Repair/Renovation</SelectItem>
              <SelectItem value="education">Education Expenses</SelectItem>
              <SelectItem value="medical">Medical Expenses</SelectItem>
              <SelectItem value="debt-consolidation">Debt Consolidation</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Processing Time Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
      >
        <div
          style={{
            background:
              "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 14%, var(--background)) 0%, color-mix(in srgb, var(--color-primary) 6%, var(--card-bg)) 100%)",
            borderRadius: 14,
            border: "1px solid color-mix(in srgb, var(--color-primary) 10%, var(--muted))",
            padding: "18px 22px",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: "color-mix(in srgb, var(--color-primary) 14%, var(--background))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Clock style={{ width: 20, height: 20, color: "var(--color-primary)" }} />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)", marginBottom: 2 }}>
              Processing time: 10 business days
            </p>
            <p style={{ fontSize: 13, fontWeight: 500, color: "var(--color-primary)" }}>
              You&apos;ll receive email updates at each stage of review
            </p>
          </div>
        </div>
      </motion.div>

      {/* Payment Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
      >
        <div style={{ background: "var(--card-bg)", borderRadius: 16, border: "1px solid var(--border)", padding: "28px 32px" }}>
          <div className="flex items-center gap-3" style={{ marginBottom: 18 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "color-mix(in srgb, var(--color-primary) 14%, var(--background))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CreditCard style={{ width: 20, height: 20, color: "var(--color-primary)" }} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.3px" }}>Payment Details</h3>
          </div>

          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--color-text-secondary)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 10 }}>
            Payment Method
          </p>

          <RadioGroup value={disbursementMethod} onValueChange={setDisbursementMethod}>
            <div className="space-y-2.5">
              {[
                { value: "eft", label: "Electronic Funds Transfer (EFT)", desc: "Direct deposit to your bank account" },
                { value: "check", label: "Mail check to address", desc: "Physical check mailed to your address" },
              ].map((opt) => (
                <label
                  key={opt.value}
                  htmlFor={opt.value}
                  className="flex items-center gap-4 cursor-pointer transition-all duration-200"
                  style={{
                    padding: "14px 18px",
                    borderRadius: 14,
                    border: disbursementMethod === opt.value ? "2px solid var(--color-primary)" : "1.5px solid var(--border)",
                    background: disbursementMethod === opt.value ? "color-mix(in srgb, var(--color-primary) 8%, var(--card-bg))" : "var(--card-bg)",
                  }}
                >
                  <RadioGroupItem value={opt.value} id={opt.value} />
                  <div className="flex-1">
                    <span style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)", display: "block" }}>{opt.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-tertiary)", display: "block", marginTop: 3 }}>{opt.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </RadioGroup>

          {disbursementMethod === "eft" && showEftTip && (
            <div
              className={cn(
                "relative mt-4 rounded-xl border border-primary/25 bg-gradient-to-br from-primary/12 to-primary/5 p-3.5 pr-11",
                "dark:border-primary/35 dark:from-primary/20 dark:to-primary/10",
              )}
            >
              <button
                type="button"
                onClick={() => setShowEftTip(false)}
                className="absolute right-3.5 top-3.5 cursor-pointer border-0 bg-transparent p-0.5 text-primary/70 transition-colors hover:text-primary"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                  <Sparkles className="h-3.5 w-3.5" style={{ color: "var(--btn-primary-text)" }} />
                </div>
                <span className="text-[13px] font-bold tracking-wide text-primary">
                  <span className="mr-1.5 text-[10px] font-semibold opacity-70">AI</span>
                  EFT Recommended
                </span>
              </div>
              <p className="pr-5 text-[13px] font-medium leading-[21px] text-[var(--color-text-secondary)]">
                EFT is the <strong className="text-primary">fastest disbursement method</strong> — funds typically arrive in 2-3 business days.
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Repayment Settings Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      >
        <div style={{ background: "var(--card-bg)", borderRadius: 16, border: "1px solid var(--border)", padding: "22px 28px" }}>
          <div className="flex items-start justify-between" style={{ marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.3px", marginBottom: 2 }}>
                Repayment Settings
              </h3>
              <p style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-tertiary)" }}>Configure how you want to repay your loan</p>
            </div>
            <button
              type="button"
              onClick={() => setShowAmortization(!showAmortization)}
              className="flex items-center gap-1.5 cursor-pointer transition-all duration-200"
              style={{
                background: "var(--card-bg)",
                border: "1.5px solid var(--color-primary)",
                borderRadius: 20,
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--color-primary)",
                whiteSpace: "nowrap",
              }}
            >
              <ChevronDown
                style={{ width: 13, height: 13, transform: showAmortization ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
              />
              Amortization
            </button>
          </div>

          {showAmortization && (
            <div
              style={{
                background: "var(--color-background-secondary)",
                borderRadius: 10,
                border: "1px solid var(--border)",
                padding: "12px 16px",
                marginBottom: 16,
              }}
            >
              <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
                <BarChart3 style={{ width: 14, height: 14, color: "var(--color-primary)" }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--foreground)" }}>Amortization Preview</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {[
                  { label: "Total Repayment", value: "$5,200.00" },
                  { label: "Total Interest", value: "$200.00", valueColor: "var(--color-primary)" },
                  { label: "Number of Payments", value: "52" },
                ].map((item) => (
                  <div key={item.label} style={{ background: "var(--card-bg)", borderRadius: 8, padding: "8px 10px", border: "1px solid var(--border)" }}>
                    <p style={{ fontSize: 10, fontWeight: 500, color: "var(--color-text-tertiary)", marginBottom: 2 }}>{item.label}</p>
                    <p style={{ fontSize: 14, fontWeight: 700, color: item.valueColor ?? "var(--foreground)" }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 8 }}>
                <Calendar style={{ width: 12, height: 12, display: "inline", marginRight: 4 }} />
                Repayment Frequency
              </p>
              <Select value={repaymentFrequency} onValueChange={setRepaymentFrequency}>
                <SelectTrigger style={{ height: 44 }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 8 }}>
                <DollarSign style={{ width: 12, height: 12, display: "inline", marginRight: 4 }} />
                Repayment Method
              </p>
              <Select value={repaymentMethod} onValueChange={setRepaymentMethod}>
                <SelectTrigger style={{ height: 44 }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="payroll">Payroll Deduction</SelectItem>
                  <SelectItem value="ach">ACH Auto-debit</SelectItem>
                  <SelectItem value="manual">Manual Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </motion.div>

      <FlowNavButtons
        backLabel="Back to Simulator"
        nextLabel="Continue to Fees"
        onBack={() => go("loan/simulator")}
        onNext={handleContinue}
      />
    </div>
  );
}

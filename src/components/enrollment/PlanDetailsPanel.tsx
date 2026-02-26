import * as React from "react";
import { useTranslation } from "react-i18next";
import { Check, X, Lock, User, Briefcase, Calendar, MapPin, PiggyBank, Clock } from "lucide-react";
import type { PlanOption } from "../../types/enrollment";

export interface PlanDetailsUserSnapshot {
  age: number;
  retirementAge: number;
  salary: number;
  yearsToRetire?: number;
  retirementLocation?: string;
  otherSavings?: number;
}

export interface PlanDetailsPanelProps {
  plan: PlanOption | null;
  user: PlanDetailsUserSnapshot;
  /** Optional i18n key for rationale (e.g. enrollment.rationaleRothYoung). When set, rationale text is translated. */
  rationaleKey?: string;
  /** Fallback rationale text when rationaleKey is not used. */
  rationale?: string;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

/* ── Shared card style using tokens ── */
const cardStyle: React.CSSProperties = {
  background: "var(--enroll-card-bg)",
  border: "1px solid var(--enroll-card-border)",
  borderRadius: "var(--enroll-card-radius)",
  boxShadow: "var(--enroll-elevation-2)",
};

const softBgStyle: React.CSSProperties = {
  background: "var(--enroll-soft-bg)",
  border: "1px solid var(--enroll-card-border)",
};

function YourDetailsCard({ user }: { user: PlanDetailsUserSnapshot }) {
  const { t } = useTranslation();
  return (
    <div className="p-5" style={cardStyle}>
      <h4
        className="text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2"
        style={{ color: "var(--enroll-text-muted)" }}
      >
        <User size={12} /> {t("enrollment.yourDetails")}
      </h4>
      <div className="grid grid-cols-3 gap-3">
        <DetailCell icon={<User size={10} />} label={t("enrollment.age")} value={String(user.age)} />
        <DetailCell icon={<Calendar size={10} />} label={t("enrollment.retiringAt")} value={String(user.retirementAge)} />
        <DetailCell icon={<Briefcase size={10} />} label={t("enrollment.salary")} value={typeof user.salary === "number" ? formatCurrency(user.salary) : String(user.salary)} />
        {user.yearsToRetire != null && user.yearsToRetire >= 0 && (
          <DetailCell icon={<Clock size={10} />} label={t("enrollment.yearsToRetire")} value={String(user.yearsToRetire)} colSpan />
        )}
        {user.retirementLocation && (
          <DetailCell icon={<MapPin size={10} />} label={t("enrollment.retirementLocation")} value={user.retirementLocation} colSpan />
        )}
        {user.otherSavings != null && user.otherSavings > 0 && (
          <DetailCell icon={<PiggyBank size={10} />} label={t("enrollment.otherSavings")} value={formatCurrency(user.otherSavings)} colSpan />
        )}
      </div>
    </div>
  );
}

export function PlanDetailsPanel({ plan, user, rationaleKey, rationale }: PlanDetailsPanelProps) {
  const { t } = useTranslation();

  if (!plan) {
    return (
      <div className="animate-fade-in space-y-6">
        <div
          className="p-6 flex flex-col items-center justify-center min-h-[120px] text-center"
          style={{ ...cardStyle, opacity: 0.85 }}
        >
          <p className="text-sm" style={{ color: "var(--enroll-text-muted)" }}>{t("enrollment.selectPlanToSeeDetails")}</p>
        </div>
        <YourDetailsCard user={user} />
      </div>
    );
  }

  if (plan.isEligible === false) {
    return (
      <div className="animate-fade-in h-full">
        <div
          className="p-6 flex flex-col items-center text-center h-full justify-center min-h-[400px]"
          style={{ ...cardStyle, opacity: 0.7 }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ background: "var(--enroll-soft-bg)", color: "var(--enroll-text-muted)" }}
          >
            <Lock size={24} />
          </div>
          <h3 className="text-sm font-bold mb-2" style={{ color: "var(--enroll-text-primary)" }}>{t("enrollment.planUnavailable")}</h3>
          <p className="text-xs leading-relaxed max-w-[200px]" style={{ color: "var(--enroll-text-muted)" }}>
            {plan.ineligibilityReason ?? t("enrollment.planNotAvailableDefault")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* Plan Overview — no match score / gamification */}
      <div className="p-6" style={cardStyle}>
        <h4
          className="text-[10px] font-bold uppercase tracking-widest mb-3"
          style={{ color: "var(--enroll-text-muted)" }}
        >
          {t("enrollment.planOverview")}
        </h4>
        <p className="text-lg font-medium leading-snug mb-2" style={{ color: "var(--enroll-text-primary)" }}>
          {plan.isRecommended
            ? t("enrollment.bestForTaxFree")
            : t("enrollment.solidOption")}
        </p>
        {(rationaleKey || (rationale != null && rationale !== "")) && (
          <p className="text-sm leading-relaxed" style={{ color: "var(--enroll-text-secondary)" }}>
            {rationaleKey ? t(rationaleKey, { years: user.yearsToRetire ?? 0 }) : rationale}
          </p>
        )}
      </div>

      <YourDetailsCard user={user} />

      {/* Pros / Cons — hidden per product requirement */}
      {false && (
        <div className="p-6 space-y-6" style={cardStyle}>
          <div className="space-y-3">
            <h5
              className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"
              style={{ color: "var(--enroll-text-primary)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--enroll-accent)" }} aria-hidden /> {t("enrollment.pros")}
            </h5>
            <ul className="space-y-2.5">
              {(plan.benefits ?? []).map((value, i) => (
                <li key={i} className="flex gap-2.5 text-xs" style={{ color: "var(--enroll-text-secondary)" }}>
                  <Check size={14} className="shrink-0" style={{ color: "var(--enroll-accent)" }} />
                  <span>{value}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full h-px" style={{ background: "var(--enroll-card-border)" }} aria-hidden />
          <div className="space-y-3">
            <h5
              className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"
              style={{ color: "var(--enroll-text-primary)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-warning)]" aria-hidden /> {t("enrollment.cons")}
            </h5>
            <ul className="space-y-2.5">
              <li className="flex gap-2.5 text-xs" style={{ color: "var(--enroll-text-muted)" }}>
                <X size={14} className="shrink-0" style={{ color: "var(--enroll-text-muted)" }} />
                <span>{plan.id === "roth-401k" || plan.isRecommended ? t("enrollment.conNoTaxBreakToday") : t("enrollment.conPayTaxesWithdraw")}</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Sub-components ── */

const DetailCell: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  colSpan?: boolean;
}> = ({ icon, label, value, colSpan }) => (
  <div
    className={`p-3 rounded-xl flex flex-col justify-center ${colSpan ? "col-span-3 sm:col-span-1" : ""}`}
    style={softBgStyle}
  >
    <div className="flex items-center gap-1.5 mb-1">
      <span style={{ color: "var(--enroll-text-muted)" }}>{icon}</span>
      <span className="text-[10px] font-medium" style={{ color: "var(--enroll-text-muted)" }}>{label}</span>
    </div>
    <div className="text-sm font-bold truncate" style={{ color: "var(--enroll-text-primary)" }} title={value}>
      {value}
    </div>
  </div>
);

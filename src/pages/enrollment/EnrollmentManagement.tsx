import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronRight, Info } from "lucide-react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import Button from "@/components/ui/Button";
import { MOCK_ENROLLED_PLANS, type EnrolledPlan, type PlanStatus } from "@/data/mockEnrolledPlans";
import { getRoutingVersion, withVersion } from "@/core/version";

const getCurrencyLocale = (lng: string) => (lng && lng !== "en" ? lng : "en-US");

const pageVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (reduced: boolean) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: reduced ? 0 : 0.2,
      ease: "easeOut",
      staggerChildren: reduced ? 0 : 0.06,
      delayChildren: reduced ? 0 : 0.04,
    },
  }),
};

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (reduced: boolean) => ({
    opacity: 1,
    y: 0,
    transition: { duration: reduced ? 0 : 0.2, ease: "easeOut" },
  }),
};

const FILTER_KEYS: { value: PlanStatus | "all"; key: string }[] = [
  { value: "all", key: "enrollment.filterAll" },
  { value: "enrolled", key: "enrollment.filterEnrolled" },
  { value: "eligible", key: "enrollment.filterEligible" },
  { value: "ineligible", key: "enrollment.filterIneligible" },
];

function getFilterCount(value: PlanStatus | "all"): number {
  if (value === "all") return MOCK_ENROLLED_PLANS.length;
  return MOCK_ENROLLED_PLANS.filter((p) => p.status === value).length;
}

/**
 * Enrollment Management - List view matching Figma (Enrollment Management frame).
 * Filter pills with counts, 2-column plan cards, inline CTAs.
 */
export const EnrollmentManagement = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const version = getRoutingVersion(pathname);
  const [filter, setFilter] = useState<PlanStatus | "all">("all");
  const reducedMotion = useReducedMotion();
  const formatCurrency = (n: number) =>
    new Intl.NumberFormat(getCurrencyLocale(i18n.language), {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);

  const filteredPlans = useMemo(() => {
    if (filter === "all") return MOCK_ENROLLED_PLANS;
    return MOCK_ENROLLED_PLANS.filter((plan) => plan.status === filter);
  }, [filter]);

  const handlePlanAction = (plan: EnrolledPlan) => {
    if (plan.status === "enrolled") {
      navigate(withVersion(version, `/enrollment/manage/${plan.id}`));
    } else if (plan.status === "eligible") {
      navigate(withVersion(version, "/enrollment/choose-plan"));
    }
  };

  const getStatusLabel = (status: PlanStatus): string => {
    switch (status) {
      case "enrolled":
        return t("enrollment.statusEnrolled");
      case "eligible":
        return t("enrollment.statusEligible");
      case "ineligible":
        return t("enrollment.statusIneligible");
    }
  };

  return (
    <DashboardLayout header={<DashboardHeader />}>
      <motion.div
        className="enrollment-management mx-auto w-full max-w-[1280px] px-8 py-10"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        custom={!!reducedMotion}
      >
        <header className="mb-10 space-y-2">
          <h1
            className="text-[30px] font-bold leading-9"
            style={{ color: "var(--color-text)" }}
          >
            {t("enrollment.managementTitle")}
          </h1>
          <p
            className="text-base leading-6"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {t("enrollment.managementDescription")}
          </p>
        </header>

        {/* Filter pills with counts */}
        <div
          className="mb-10 flex flex-wrap gap-3"
          role="group"
          aria-label={t("enrollment.filterByStatus")}
        >
          {FILTER_KEYS.map((f) => {
            const count = getFilterCount(f.value);
            const isActive = filter === f.value;
            return (
              <motion.button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                aria-pressed={isActive}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isActive
                    ? "text-white focus:ring-[var(--color-primary)]"
                    : "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-background-secondary)] focus:ring-[var(--color-border)]"
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: "var(--color-primary)",
                        borderColor: "var(--color-primary)",
                      }
                    : undefined
                }
                whileHover={reducedMotion ? undefined : { scale: 1.02 }}
                whileTap={reducedMotion ? undefined : { scale: 0.98 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                {t(f.key)}
                <span
                  className={`rounded-xl px-2 py-0.5 text-xs font-medium ${
                    isActive ? "bg-white/20 text-white" : "bg-[var(--color-background-secondary)] text-[var(--color-text-secondary)]"
                  }`}
                >
                  {count}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Plan cards grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {filteredPlans.length === 0 ? (
            <motion.div
              className="col-span-full rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] px-8 py-12 text-center"
              variants={cardVariants}
              custom={!!reducedMotion}
            >
              <p style={{ color: "var(--color-text-secondary)" }} className="text-base">
                {t("enrollment.noPlansFound")}
              </p>
            </motion.div>
          ) : (
            filteredPlans.map((plan) => (
              <motion.article
                key={plan.id}
                variants={cardVariants}
                custom={!!reducedMotion}
                className="enrollment-management__card flex flex-col rounded-3xl border bg-[var(--color-surface)] p-8 shadow-sm"
                style={{
                  borderColor: "var(--color-border)",
                  boxShadow:
                    plan.status === "ineligible"
                      ? "none"
                      : "0 20px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05)",
                }}
              >
                {/* Card header: title, plan ID, status badge */}
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1 space-y-1">
                    <h3
                      className="text-2xl font-bold leading-8"
                      style={{
                        color:
                          plan.status === "ineligible"
                            ? "var(--color-text-secondary)"
                            : "var(--color-text)",
                      }}
                    >
                      {plan.planName}
                    </h3>
                    <p
                      className="text-sm font-semibold uppercase tracking-wider"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {t("enrollment.planIdLabel")}: {plan.planId}
                    </p>
                  </div>
                  <span
                    className="shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide"
                    style={{
                      backgroundColor:
                        plan.status === "enrolled"
                          ? "var(--color-success-light, #ecfdf5)"
                          : plan.status === "eligible"
                            ? "var(--color-primary-light, #eff6ff)"
                            : "var(--color-background-secondary)",
                      color:
                        plan.status === "enrolled"
                          ? "var(--color-success, #059669)"
                          : plan.status === "eligible"
                            ? "var(--color-primary)"
                            : "var(--color-text-secondary)",
                    }}
                  >
                    {getStatusLabel(plan.status)}
                  </span>
                </div>

                {/* Ineligible: info message box */}
                {plan.status === "ineligible" && plan.ineligibilityReason && (
                  <div
                    className="mb-6 flex gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <Info
                      className="h-5 w-5 shrink-0"
                      style={{ color: "var(--color-text-secondary)" }}
                    />
                    <p
                      className="text-sm leading-[1.4]"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {plan.ineligibilityReason}
                    </p>
                  </div>
                )}

                {/* Enrolled: current balance box */}
                {plan.status === "enrolled" && plan.balance !== undefined && (
                  <div
                    className="mb-6 rounded-2xl border px-6 py-6"
                    style={{
                      backgroundColor: "var(--color-background-secondary)",
                      borderColor: "var(--color-border)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="text-base font-medium"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {t("enrollment.currentBalance")}
                      </span>
                      <span
                        className="text-3xl font-bold leading-9"
                        style={{ color: "var(--color-text)" }}
                      >
                        {formatCurrency(plan.balance)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Eligible: description */}
                {plan.status === "eligible" && plan.description && (
                  <p
                    className="mb-6 text-base leading-6"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {plan.description}
                  </p>
                )}

                {/* Spacer when content is short */}
                <div className="flex-1" aria-hidden />

                {/* CTA button */}
                <div className="mt-auto">
                  {plan.status === "enrolled" && (
                    <Button
                      onClick={() => handlePlanAction(plan)}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-lg font-bold"
                      style={{
                        backgroundColor: "var(--color-primary)",
                        color: "var(--color-text-on-primary, #fff)",
                      }}
                    >
                      {t("enrollment.actionManage")}
                      <ChevronRight className="h-5 w-5" aria-hidden />
                    </Button>
                  )}
                  {plan.status === "eligible" && (
                    <Button
                      onClick={() => handlePlanAction(plan)}
                      type="button"
                      className="w-full rounded-2xl border-2 py-4 text-lg font-bold"
                      style={{
                        borderColor: "var(--color-primary)",
                        color: "var(--color-primary)",
                        backgroundColor: "transparent",
                      }}
                    >
                      {t("enrollment.actionEnroll")}
                    </Button>
                  )}
                  {plan.status === "ineligible" && (
                    <button
                      type="button"
                      disabled
                      className="w-full rounded-2xl py-4 text-lg font-bold"
                      style={{
                        backgroundColor: "var(--color-border)",
                        color: "var(--color-text-secondary)",
                        cursor: "not-allowed",
                      }}
                    >
                      {t("enrollment.actionNotAvailable")}
                    </button>
                  )}
                </div>
              </motion.article>
            ))
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

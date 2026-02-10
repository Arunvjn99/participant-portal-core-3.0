import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import Button from "../../components/ui/Button";
import { MOCK_ENROLLED_PLANS, type EnrolledPlan, type PlanStatus } from "../../data/mockEnrolledPlans";

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

const FILTERS: { value: PlanStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "enrolled", label: "Enrolled" },
  { value: "eligible", label: "Eligible" },
  { value: "ineligible", label: "Ineligible" },
];

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

/**
 * Enrollment Management - Post-enrollment management page.
 * All information visible; flat cards, Tailwind, subtle Framer Motion.
 */
export const EnrollmentManagement = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<PlanStatus | "all">("all");
  const reducedMotion = useReducedMotion();

  const filteredPlans = useMemo(() => {
    if (filter === "all") return MOCK_ENROLLED_PLANS;
    return MOCK_ENROLLED_PLANS.filter((plan) => plan.status === filter);
  }, [filter]);

  const handlePlanAction = (plan: EnrolledPlan) => {
    if (plan.status === "enrolled") {
      navigate(`/enrollment/manage/${plan.id}`);
    } else if (plan.status === "eligible") {
      navigate("/enrollment/choose-plan");
    }
  };

  const getActionLabel = (plan: EnrolledPlan): string => {
    if (plan.status === "enrolled") return "Manage";
    if (plan.status === "eligible") return "Enroll";
    return "Not available";
  };

  const getStatusStyles = (status: PlanStatus): string => {
    switch (status) {
      case "enrolled":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
      case "eligible":
        return "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case "ineligible":
        return "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400";
    }
  };

  const getStatusLabel = (status: PlanStatus): string => {
    switch (status) {
      case "enrolled": return "Enrolled";
      case "eligible": return "Eligible";
      case "ineligible": return "Ineligible";
    }
  };

  return (
    <DashboardLayout header={<DashboardHeader />}>
      <motion.div
        className="mx-auto w-full max-w-6xl space-y-8 pb-8"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        custom={!!reducedMotion}
      >
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 md:text-3xl">
            Enrollment Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            View and manage your retirement plan enrollments
          </p>
        </header>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
          {FILTERS.map((f) => (
            <motion.button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              aria-pressed={filter === f.value}
              className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
                filter === f.value
                  ? "border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-600"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:bg-slate-700"
              }`}
              whileHover={reducedMotion ? undefined : { scale: 1.02 }}
              whileTap={reducedMotion ? undefined : { scale: 0.98 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              {f.label}
            </motion.button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredPlans.length === 0 ? (
            <motion.div
              className="col-span-full rounded-xl border border-slate-200 bg-slate-50/50 px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-800/40"
              variants={cardVariants}
              custom={!!reducedMotion}
            >
              <p className="text-sm text-slate-600 dark:text-slate-400">
                No plans found matching the selected filter.
              </p>
            </motion.div>
          ) : (
            filteredPlans.map((plan) => (
              <motion.article
                key={plan.id}
                variants={cardVariants}
                custom={!!reducedMotion}
                className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-[box-shadow,border-color] duration-200 ease-out hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600 dark:hover:shadow-lg dark:hover:shadow-black/10"
              >
                <div className="flex flex-1 flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1 space-y-1">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {plan.planName}
                      </h3>
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-sm text-slate-500 dark:text-slate-400">
                        <span>Plan ID: {plan.planId}</span>
                        <span className="italic">{plan.planType}</span>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium uppercase tracking-wide ${getStatusStyles(plan.status)}`}
                    >
                      {getStatusLabel(plan.status)}
                    </span>
                  </div>

                  {plan.status === "ineligible" && plan.ineligibilityReason && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50/80 px-4 py-3 dark:border-amber-800/50 dark:bg-amber-900/20">
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        {plan.ineligibilityReason}
                      </p>
                    </div>
                  )}

                  {plan.status === "enrolled" && plan.balance !== undefined && (
                    <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/80 px-4 py-3 dark:border-slate-700 dark:bg-slate-700/30">
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        Current Balance:
                      </span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {formatCurrency(plan.balance)}
                      </span>
                    </div>
                  )}

                  <div className="mt-auto pt-2">
                    <Button
                      onClick={() => handlePlanAction(plan)}
                      disabled={plan.status === "ineligible"}
                      className="w-full"
                    >
                      {getActionLabel(plan)}
                    </Button>
                  </div>
                </div>
              </motion.article>
            ))
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

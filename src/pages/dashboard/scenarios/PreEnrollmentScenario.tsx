import { useTranslation } from "react-i18next";
import type { PersonaProfile } from "@/mock/personas";
import { ScenarioShell } from "./ScenarioShell";

export function PreEnrollmentScenario({ user }: { user: PersonaProfile }) {
  const { t } = useTranslation();
  return (
    <ScenarioShell user={user} accentColor="#6366f1">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          title={t("dashboard.employerMatch")}
          value={t("demo.matchAvailable", { percent: user.employerMatchRate })}
          description={t("demo.employerMatchCardDesc")}
          color="#10b981"
        />
        <Card
          title={t("demo.enrollmentStatus")}
          value={t("demo.notYetEnrolled")}
          description={t("demo.enrollmentStatusDesc")}
          color="#f59e0b"
        />
        <Card
          title={t("demo.autoEnrollment")}
          value={user.flags.autoEnrollment ? t("demo.active") : t("demo.inactive")}
          description={
            user.flags.autoEnrollment
              ? t("demo.autoEnrollmentDescActive")
              : t("demo.autoEnrollmentDescInactive")
          }
          color="#6366f1"
        />
      </div>

      <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-6 dark:border-indigo-800 dark:bg-indigo-900/20">
        <h2 className="text-lg font-semibold text-indigo-900 dark:text-indigo-200">
          {t("demo.readyToStartTitle")}
        </h2>
        <p className="mt-2 text-sm text-indigo-700 dark:text-indigo-300">
          {t("demo.readyToStartDesc", { age: user.age, years: 65 - user.age })}
        </p>
        <button
          type="button"
          className="mt-4 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          {t("demo.startEnrollmentButton")}
        </button>
      </div>
    </ScenarioShell>
  );
}

function Card({ title, value, description, color }: { title: string; value: string; description: string; color: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</p>
      <p className="mt-1 text-xl font-bold" style={{ color }}>{value}</p>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{description}</p>
    </div>
  );
}

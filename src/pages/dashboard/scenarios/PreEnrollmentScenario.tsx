import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { PersonaProfile } from "@/mock/personas";
import { ScenarioShell } from "./ScenarioShell";
import { PersonalizePlanModal } from "@/components/enrollment/PersonalizePlanModal";

export function PreEnrollmentScenario({ user }: { user: PersonaProfile }) {
  const { t } = useTranslation();
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const firstName = user.name.split(/\s+/)[0] || user.name;

  return (
    <ScenarioShell user={user} accentColor="var(--color-primary)">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          title={t("dashboard.employerMatch")}
          value={t("demo.matchAvailable", { percent: user.employerMatchRate })}
          description={t("demo.employerMatchCardDesc")}
          color="var(--color-success)"
        />
        <Card
          title={t("demo.enrollmentStatus")}
          value={t("demo.notYetEnrolled")}
          description={t("demo.enrollmentStatusDesc")}
          color="var(--color-warning)"
        />
        <Card
          title={t("demo.autoEnrollment")}
          value={user.flags.autoEnrollment ? t("demo.active") : t("demo.inactive")}
          description={
            user.flags.autoEnrollment
              ? t("demo.autoEnrollmentDescActive")
              : t("demo.autoEnrollmentDescInactive")
          }
          color="var(--color-primary)"
        />
      </div>

      <div className="rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 p-6">
        <h2 className="text-lg font-semibold text-[var(--color-text)]">
          {t("demo.readyToStartTitle")}
        </h2>
        <p className="mt-2 text-sm text-[var(--color-textSecondary)]">
          {t("demo.readyToStartDesc", { age: user.age, years: 65 - user.age })}
        </p>
        <button
          type="button"
          onClick={() => setIsWizardOpen(true)}
          className="mt-4 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          {t("demo.startEnrollmentButton")}
        </button>
      </div>
      <PersonalizePlanModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        userName={firstName}
      />
    </ScenarioShell>
  );
}

function Card({ title, value, description, color }: { title: string; value: string; description: string; color: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-textSecondary)]">{title}</p>
      <p className="mt-1 text-xl font-bold" style={{ color }}>{value}</p>
      <p className="mt-2 text-sm text-[var(--color-textSecondary)]">{description}</p>
    </div>
  );
}

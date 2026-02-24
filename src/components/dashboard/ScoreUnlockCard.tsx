import { DashboardCard } from "./DashboardCard";
import Button from "../ui/Button";
import { PadlockIcon } from "../../assets/dashboard/icons";

export const ScoreUnlockCard = () => {
  return (
    <DashboardCard>
      <div className="flex flex-col gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-background)] text-[var(--color-primary)]"
          aria-hidden="true"
        >
          <PadlockIcon size={28} />
        </div>
        <h3 className="text-lg font-semibold text-[var(--color-text)]">
          Unlock Your Personalized Score
        </h3>
        <p className="text-sm leading-relaxed text-[var(--color-textSecondary)]">
          Enroll in the plan to see your projected retirement income and earn badges.
        </p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button className="w-fit rounded-lg bg-primary px-5 py-2.5 font-medium text-white hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
            Enroll Now
          </Button>
          <a
            href="#"
            className="inline-flex w-fit items-center rounded-lg border border-primary px-5 py-2.5 text-sm font-medium text-primary no-underline transition-colors hover:bg-primary/10 hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Learn more
          </a>
        </div>
      </div>
    </DashboardCard>
  );
};

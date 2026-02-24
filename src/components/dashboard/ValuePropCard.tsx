import { DashboardCard } from "./DashboardCard";
import { DollarIcon, ShieldIcon, ChartIcon } from "../../assets/dashboard/icons";

type ValuePropIconType = "dollar" | "shield" | "chart";

interface ValuePropCardProps {
  icon?: ValuePropIconType;
  title: string;
  description: string;
}

const iconMap = {
  dollar: DollarIcon,
  shield: ShieldIcon,
  chart: ChartIcon,
};

export const ValuePropCard = ({ icon = "dollar", title, description }: ValuePropCardProps) => {
  const IconComponent = iconMap[icon];
  return (
    <DashboardCard>
      <div className="flex flex-col gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
            icon === "shield"
              ? "bg-[var(--color-background)] text-[var(--color-success)]"
              : "bg-primary/10 text-primary"
          }`}
          aria-hidden="true"
        >
          <IconComponent size={24} />
        </div>
        <h3 className="text-lg font-semibold text-[var(--color-text)]">{title}</h3>
        <p className="text-sm leading-relaxed text-[var(--color-textSecondary)]">{description}</p>
      </div>
    </DashboardCard>
  );
};

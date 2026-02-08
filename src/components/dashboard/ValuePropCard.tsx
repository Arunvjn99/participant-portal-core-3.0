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
              ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400"
              : "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
          }`}
          aria-hidden="true"
        >
          <IconComponent size={24} />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{description}</p>
      </div>
    </DashboardCard>
  );
};

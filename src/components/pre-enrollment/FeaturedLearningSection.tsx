import { FeaturedLearningSurface } from "./dashboard-premium/FeaturedLearningSurface";

type FeaturedLearningSectionProps = {
  className?: string;
};

export default function FeaturedLearningSection({ className }: FeaturedLearningSectionProps) {
  return <FeaturedLearningSurface className={className} />;
}

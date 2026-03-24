import type { LucideIcon } from "lucide-react";
import { BookOpen, Clock, Leaf, Scale } from "lucide-react";
import { useTranslation } from "react-i18next";
import { RESOURCES } from "@/components/pre-enrollment/constants";
import { FeaturedLearningCard, type FeaturedLearningSlide } from "@/components/pre-enrollment/FeaturedLearningCard";

const RESOURCE_ICONS: Record<string, LucideIcon> = {
  "1": BookOpen,
  "2": Scale,
  "3": Clock,
  "4": Leaf,
};

export function RecommendedLearning() {
  const { t } = useTranslation();

  const slides: FeaturedLearningSlide[] = RESOURCES.map((r) => ({
    id: r.id,
    tag: r.category.toUpperCase(),
    meta: r.duration,
    title: t(`preEnrollment.resource${r.id}Title` as const),
    description:
      r.id === "3" ? t("preEnrollment.resource3LearningTeaser") : t("preEnrollment.learnSubtitle"),
    icon: RESOURCE_ICONS[r.id] ?? BookOpen,
  }));

  const scrollToActions = () => {
    document.getElementById("action-cards")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="recommended-learning" aria-labelledby="recommended-learning-heading">
      <h2 id="recommended-learning-heading" className="mb-4 text-xl font-semibold text-foreground md:mb-6">
        {t("preEnrollment.recommendedLearningTitle")}
      </h2>

      <FeaturedLearningCard
        slides={slides}
        ctaLabel={t("preEnrollment.exploreLearningCta")}
        onCta={scrollToActions}
      />
    </section>
  );
}

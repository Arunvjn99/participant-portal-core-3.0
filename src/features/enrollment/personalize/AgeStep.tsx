import { useTranslation } from "react-i18next";
import { AgeCard } from "../../../components/ui/AgeCard";
import { AgeSelector } from "../../../components/ui/AgeSelector";
import { PopularRecommendation } from "../../../components/ui/PopularRecommendation";
import { TimelineBar } from "../../../components/ui/TimelineBar";
import { Input } from "../../../components/ui/Input";
import { Card, CardContent } from "../../../components/ui/card";
import { getAgeFromDOB, formatDOB } from "./usePersonalizeState";

const POPULAR_RETIREMENT_AGE = 58;

export interface AgeStepProps {
  userName: string;
  dateOfBirth: string;
  retirementAge: number;
  minRetirementAge: number;
  maxRetirementAge: number;
  onDateOfBirthChange: (value: string) => void;
  onRetirementAgeChange: (value: number) => void;
  /** Used by wizard footer to disable Continue */
  nextDisabled?: boolean;
}

export function AgeStep({
  dateOfBirth,
  retirementAge,
  minRetirementAge,
  maxRetirementAge,
  onDateOfBirthChange,
  onRetirementAgeChange,
  nextDisabled = false,
}: AgeStepProps) {
  const { t } = useTranslation();
  const currentAge = getAgeFromDOB(dateOfBirth);
  const yearsRemaining = Math.max(0, retirementAge - currentAge);
  const currentYear = new Date().getFullYear();
  const retirementYear = currentYear + yearsRemaining;

  return (
    <div className="space-y-5">
      <AgeCard
        title={t("personalize.youAreYearsOld", "You're {{age}} years old", { age: currentAge })}
        subtitle={t("personalize.bornOn", "Born on {{date}}", { date: formatDOB(dateOfBirth) })}
      >
        <Input
          label={t("personalize.editDateOfBirth", "Edit date of birth")}
          type="date"
          value={dateOfBirth}
          onChange={(e) => onDateOfBirthChange(e.target.value)}
          name="dateOfBirth"
        />
      </AgeCard>

      <AgeSelector
        value={retirementAge}
        min={minRetirementAge}
        max={maxRetirementAge}
        onChange={onRetirementAgeChange}
        label={t("personalize.retirementAgeQuestion", "At what age would you like to retire?")}
        valueSubline={t("personalize.planToRetireAt", "I plan to retire at")}
        showSlider={true}
      />

      <PopularRecommendation
        title={t("personalize.mostPeopleRetireAt", "Most people retire at {{age}}", {
          age: POPULAR_RETIREMENT_AGE,
        })}
        subtitle={t("personalize.basedOnUsers", "Based on 2.4M users")}
        badge={t("personalize.popular", "Popular")}
        actionLabel={t("personalize.applyThisAge", "Apply this age")}
        onAction={() => onRetirementAgeChange(POPULAR_RETIREMENT_AGE)}
      />

      <Card className="rounded-xl p-4" role="region" aria-live="polite">
        <CardContent className="p-0">
          <p className="text-center text-sm text-[var(--color-text-primary)]">
            <span className="font-semibold">
              {t("personalize.retiringAt", "Retiring at {{age}}", { age: retirementAge })}
            </span>{" "}
            {t("personalize.meansYouHave", "means you have")}{" "}
            <span className="font-semibold text-[var(--color-primary)]">
              {t("personalize.yearsUntil", "{{years}} years", { years: yearsRemaining })}
            </span>{" "}
            {t("personalize.untilRetirement", "until retirement.")}
          </p>
          <p className="mt-1 text-center text-xs text-[var(--color-text-secondary)] sm:text-sm">
            {t("personalize.estimatedRetirementYear", "Your estimated retirement year:")}{" "}
            <span className="font-bold text-[var(--color-primary)]">{retirementYear}</span>
          </p>
          <TimelineBar
            nowLabel={t("personalize.now", "Now")}
            nowValue={currentYear}
            centerLabel={t("personalize.yearsCount", "{{years}} years", { years: yearsRemaining })}
            endLabel={t("personalize.retire", "Retire")}
            endValue={retirementYear}
          />
        </CardContent>
      </Card>
    </div>
  );
}

import { DashboardCard } from "./DashboardCard";
import { useState } from "react";
import type { KeyboardEvent } from "react";

interface ResourceCardProps {
  title: string;
  description: string;
  /** Learning thumbnail image. Uses placeholder if missing. */
  imageSrc?: string;
  badge?: string;
  onClick?: () => void;
}

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='220' viewBox='0 0 400 220'%3E%3Crect fill='%e2e8f0' width='400' height='220'/%3E%3Ctext fill='%94a3b8' font-family='sans-serif' font-size='16' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle'%3EThumbnail%3C/text%3E%3C/svg%3E";

const ResourceCard = ({ title, description, imageSrc, badge, onClick }: ResourceCardProps) => {
  const [imageError, setImageError] = useState(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick();
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const imgSrc = imageSrc && !imageError ? imageSrc : PLACEHOLDER_IMAGE;

  const cardContent = (
    <>
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-[var(--color-background)]">
        <img
          src={imgSrc}
          alt=""
          className="h-full w-full object-cover"
          onError={handleImageError}
        />
        {badge && (
          <span
            className="absolute right-2 top-2 rounded bg-black/80 px-2 py-1 text-xs font-medium text-white"
            aria-label={`Content type: ${badge}`}
          >
            {badge}
          </span>
        )}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-[var(--color-text)]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-textSecondary)]">
        {description}
      </p>
    </>
  );

  const baseClasses =
    "flex cursor-default flex-col transition-transform focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2";

  if (onClick) {
    return (
      <DashboardCard>
        <div
          className={`${baseClasses} cursor-pointer hover:-translate-y-0.5`}
          role="button"
          tabIndex={0}
          onClick={onClick}
          onKeyDown={handleKeyDown}
          aria-label={`${title}. ${description}`}
        >
          {cardContent}
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard>
      <div className={baseClasses}>{cardContent}</div>
    </DashboardCard>
  );
};

export default ResourceCard;

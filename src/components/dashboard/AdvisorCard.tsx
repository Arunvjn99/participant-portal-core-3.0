import { DashboardCard } from "./DashboardCard";
import Button from "../ui/Button";

/** UI Avatars (Tailwind design system style) - initials-based placeholder */
function getAvatarUrl(name: string, size = 128): string {
  const params = new URLSearchParams({
    name,
    size: String(size),
    background: "3b82f6", // Tailwind blue-500
    color: "ffffff",
    bold: "true",
  });
  return `https://ui-avatars.com/api/?${params}`;
}

const FALLBACK_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle fill='%93c5fd' cx='32' cy='32' r='32'/%3E%3Cpath fill='%3b82f6' d='M32 20a8 8 0 110 16 8 8 0 010-16zm0 24c-8 0-14 4-18 10 2-6 8-10 18-10s16 4 18 10c-4-6-10-10-18-10z'/%3E%3C/svg%3E";

interface AdvisorCardProps {
  name: string;
  role: string;
  description: string;
  /** Advisor avatar image. Uses ui-avatars.com initials if not provided. */
  avatarSrc?: string;
}

export const AdvisorCard = ({
  name,
  role,
  description,
  avatarSrc,
}: AdvisorCardProps) => {
  const avatarUrl = avatarSrc ?? getAvatarUrl(name);

  return (
    <DashboardCard>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
        <div className="shrink-0">
          <img
            src={avatarUrl}
            alt=""
            aria-hidden="true"
            className="h-16 w-16 rounded-full object-cover ring-2 ring-[var(--color-border)]"
            onError={(e) => {
              (e.target as HTMLImageElement).src = FALLBACK_AVATAR;
            }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-[var(--color-text)]">{name}</h3>
          <p className="mt-0.5 text-sm text-[var(--color-textSecondary)]">{role}</p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-textSecondary)]">
            {description}
          </p>
          <div className="mt-4">
            <Button className="rounded-lg bg-[var(--color-primary)] px-5 py-2.5 font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2">
              Contact
            </Button>
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};

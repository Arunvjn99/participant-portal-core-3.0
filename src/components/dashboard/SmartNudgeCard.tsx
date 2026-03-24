import { useNavigate, useLocation } from "react-router-dom";
import { getRoutingVersion, withVersionIfEnrollment } from "@/core/version";
import type { SmartNudge } from "@/data/postEnrollmentDashboard";

interface SmartNudgeCardProps {
  nudge: SmartNudge;
}

const NudgeIcon = ({ title }: { title: string }) => {
  if (title.toLowerCase().includes("match")) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M3 3v18h18" />
        <path d="M7 16l4-4 4 4 5-5" />
      </svg>
    );
  }
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
};

/**
 * Smart Nudge card: title, insight, action CTA
 */
export const SmartNudgeCard = ({ nudge }: SmartNudgeCardProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const version = getRoutingVersion(pathname);

  return (
    <article className="ped-nudge">
      <div className="ped-nudge__icon">
        <NudgeIcon title={nudge.title} />
      </div>
      <div className="ped-nudge__body">
        <h3 className="ped-nudge__title">{nudge.title}</h3>
        <p className="ped-nudge__insight">{nudge.insight}</p>
        <button
          type="button"
          className="ped-nudge__cta"
          onClick={() => navigate(withVersionIfEnrollment(version, nudge.actionRoute))}
        >
          {nudge.actionLabel}
        </button>
      </div>
    </article>
  );
};

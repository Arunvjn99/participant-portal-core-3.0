import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loadEnrollmentDraft } from "@/enrollment/enrollmentDraftStore";
import { getRoutingVersion, withVersion } from "@/core/version";
import { ChoosePlan } from "./ChoosePlan";

/**
 * Plans page - decision engine.
 * Guards: redirect to dashboard if enrollment draft is missing.
 * Does NOT recalculate wizard values; reads draft for display.
 */
export const PlansPage = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const version = getRoutingVersion(pathname);
  const draft = loadEnrollmentDraft();

  useEffect(() => {
    if (!draft) {
      navigate(withVersion(version, "/dashboard"), { replace: true });
    }
  }, [draft, navigate, version]);

  if (!draft) {
    return null;
  }

  return <ChoosePlan />;
};

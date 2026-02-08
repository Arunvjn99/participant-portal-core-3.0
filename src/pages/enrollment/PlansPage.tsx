import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadEnrollmentDraft } from "../../enrollment/enrollmentDraftStore";
import { ChoosePlan } from "./ChoosePlan";

/**
 * Plans page - decision engine.
 * Guards: redirect to dashboard if enrollment draft is missing.
 * Does NOT recalculate wizard values; reads draft for display.
 */
export const PlansPage = () => {
  const navigate = useNavigate();
  const draft = loadEnrollmentDraft();

  useEffect(() => {
    if (!draft) {
      navigate("/dashboard", { replace: true });
    }
  }, [draft, navigate]);

  if (!draft) {
    return null;
  }

  return <ChoosePlan />;
};

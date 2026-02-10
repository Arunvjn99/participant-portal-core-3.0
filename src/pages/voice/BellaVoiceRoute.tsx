import { useNavigate, useLocation } from "react-router-dom";
import { BellaScreen } from "../../bella";

/**
 * Route wrapper for Core AI - provides onClose that navigates back to previous route.
 * When user clicks mic in header, they navigate to /voice with state.from;
 * onClose navigates back to that route or /dashboard.
 * Uses full-page layout (variant default). For embedded panel, mount BellaScreen with
 * variant="embedded" elsewhere (e.g. floating search/command UI) and pass onClose to close the panel.
 */
export const BellaVoiceRoute = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from ?? "/dashboard";

  return <BellaScreen onClose={() => navigate(from)} />;
};

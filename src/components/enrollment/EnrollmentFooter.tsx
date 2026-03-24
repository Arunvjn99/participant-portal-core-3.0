import { useNavigate, useLocation } from "react-router-dom";
import { getRoutingVersion, stripRoutingVersionPrefix, withVersion } from "@/core/version";
import { useTranslation } from "react-i18next";
import Button from "../ui/Button";
import {
  loadEnrollmentDraft,
  saveEnrollmentDraft,
  ENROLLMENT_SAVED_TOAST_KEY,
} from "@/enrollment/enrollmentDraftStore";
import { getStepIndex, isEnrollmentStepPath, ENROLLMENT_STEP_PATHS } from "@/enrollment/enrollmentStepPaths";

interface EnrollmentFooterProps {
  primaryLabel: string;
  primaryDisabled?: boolean;
  /** Side effects before navigate (e.g. save draft). Footer drives Next route from pathname. */
  onPrimary?: () => void;
  summaryText?: string;
  /** When true, summary text uses error styling */
  summaryError?: boolean;
  getDraftSnapshot?: () => Record<string, unknown>;
  /** When true, use in-content styling (border-top, spacing) for use inside step content */
  inContent?: boolean;
}

/**
 * EnrollmentFooter - Pathname-driven Next/Back. All steps use fixed ENROLLMENT_STEP_PATHS.
 * Back → prev path; Primary → onPrimary() then navigate(next path). No step prop.
 */
export const EnrollmentFooter = ({
  primaryLabel,
  primaryDisabled = false,
  onPrimary,
  summaryText,
  summaryError = false,
  getDraftSnapshot,
  inContent = false,
}: EnrollmentFooterProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const version = getRoutingVersion(pathname);
  const currentStepIndex = getStepIndex(pathname);
  const onStepPath = isEnrollmentStepPath(pathname);
  const normalizedPath = stripRoutingVersionPrefix(pathname).replace(/\/$/, "") || "/";

  const nextPath = onStepPath ? ENROLLMENT_STEP_PATHS[currentStepIndex + 1] : undefined;
  let prevPath = currentStepIndex > 0 ? ENROLLMENT_STEP_PATHS[currentStepIndex - 1] : undefined;
  // Defensive: ensure Contribution page always has Back to choose-plan (handles pathname/step mismatch)
  if (!prevPath && normalizedPath === "/enrollment/contribution") {
    prevPath = "/enrollment/choose-plan";
  }

  const handleBack = () => {
    if (prevPath) navigate(withVersion(version, prevPath));
  };

  const handlePrimary = () => {
    onPrimary?.();
    if (nextPath) {
      // Full page navigation so the next step always loads (avoids client router not updating the view)
      window.location.href = withVersion(version, nextPath);
    }
  };

  const handleSaveAndExit = () => {
    const draft = loadEnrollmentDraft();
    if (draft) {
      const snapshot = getDraftSnapshot?.();
      saveEnrollmentDraft(snapshot ? { ...draft, ...snapshot } : draft);
      sessionStorage.setItem(ENROLLMENT_SAVED_TOAST_KEY, "1");
    }
    navigate(withVersion(version, "/dashboard"));
  };

  const isFirstStep = currentStepIndex === 0 && prevPath === undefined;

  return (
    <footer
      className={`enrollment-footer${inContent ? " enrollment-footer--in-content" : ""}`}
      role="contentinfo"
      aria-label={t("enrollment.footerAria")}
    >
      <div className="enrollment-footer__inner">
        <div className="enrollment-footer__left">
          <Button
            type="button"
            onClick={handleBack}
            disabled={isFirstStep}
            className="enrollment-footer__back"
            aria-label={isFirstStep ? t("enrollment.footerBackDisabledAria") : t("enrollment.footerBackAria")}
          >
            {t("enrollment.footerBack")}
          </Button>
        </div>
        <div className="enrollment-footer__center" aria-live="polite">
          {summaryText && (
            <span className={`enrollment-footer__summary ${summaryError ? "enrollment-footer__summary--error" : ""}`}>
              {summaryText}
            </span>
          )}
        </div>
        <div className="enrollment-footer__right">
          <Button
            type="button"
            onClick={handleSaveAndExit}
            className="enrollment-footer__save-exit"
          >
            {t("enrollment.footerSaveAndExit")}
          </Button>
          {nextPath ? (
            <a
              href={withVersion(version, nextPath)}
              onClick={(e) => {
                e.preventDefault();
                if (primaryDisabled) return;
                handlePrimary(); // saves draft then sets window.location.href
              }}
              className="button enrollment-footer__primary"
              aria-disabled={primaryDisabled}
              style={primaryDisabled ? { pointerEvents: "none", opacity: 0.6 } : undefined}
              role="button"
            >
              {primaryLabel}
            </a>
          ) : (
            <Button
              type="button"
              onClick={() => handlePrimary()}
              disabled={primaryDisabled}
              className="enrollment-footer__primary"
            >
              {primaryLabel}
            </Button>
          )}
        </div>
      </div>
    </footer>
  );
};

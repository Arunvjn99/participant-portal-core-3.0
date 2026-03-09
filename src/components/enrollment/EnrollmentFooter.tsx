import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../ui/Button";
import {
  loadEnrollmentDraft,
  saveEnrollmentDraft,
  ENROLLMENT_SAVED_TOAST_KEY,
} from "../../enrollment/enrollmentDraftStore";
import { getStepIndex, isEnrollmentStepPath, ENROLLMENT_STEP_PATHS } from "../../enrollment/enrollmentStepPaths";

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
  /** When true, hide "Save & Exit" so footer matches figma (Back + Continue only) */
  hideSaveAndExit?: boolean;
  /** Optional step paths (e.g. ENROLLMENT_V2_STEP_PATHS). When provided, next/back use these instead of ENROLLMENT_STEP_PATHS. */
  stepPaths?: readonly string[];
  /** When true, show arrow icon after primary button label (e.g. "Continue to Contribution" →) */
  primaryShowArrow?: boolean;
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
  hideSaveAndExit = false,
  stepPaths,
  primaryShowArrow = false,
}: EnrollmentFooterProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const normalizedPath = pathname.replace(/\/$/, "") || "/";

  const paths = stepPaths ?? ENROLLMENT_STEP_PATHS;
  const currentStepIndex = stepPaths
    ? paths.findIndex((p) => normalizedPath === p || normalizedPath.startsWith(p + "/"))
    : getStepIndex(pathname);
  const resolvedIndex = currentStepIndex >= 0 ? currentStepIndex : 0;
  const onStepPath = stepPaths
    ? resolvedIndex >= 0 && resolvedIndex < paths.length
    : isEnrollmentStepPath(pathname);

  const nextPath = onStepPath ? paths[resolvedIndex + 1] : undefined;
  let prevPath = resolvedIndex > 0 ? paths[resolvedIndex - 1] : undefined;
  // Defensive: ensure Contribution page always has Back to choose-plan (handles pathname/step mismatch)
  if (!prevPath && normalizedPath === "/enrollment/contribution") {
    prevPath = "/enrollment/choose-plan";
  }
  if (!prevPath && normalizedPath === "/enrollment-v2/contribution") {
    prevPath = "/enrollment-v2/choose-plan";
  }

  const handleBack = () => {
    if (prevPath) navigate(prevPath);
  };

  const handlePrimary = () => {
    onPrimary?.();
    if (nextPath) {
      // Full page navigation so the next step always loads (avoids client router not updating the view)
      window.location.href = nextPath;
    }
  };

  const handleSaveAndExit = () => {
    const draft = loadEnrollmentDraft();
    if (draft) {
      const snapshot = getDraftSnapshot?.();
      saveEnrollmentDraft(snapshot ? { ...draft, ...snapshot } : draft);
      sessionStorage.setItem(ENROLLMENT_SAVED_TOAST_KEY, "1");
    }
    navigate("/dashboard");
  };

  const isFirstStep = resolvedIndex === 0 && prevPath === undefined;
  const isContributionPage =
    normalizedPath === "/enrollment/contribution" || normalizedPath === "/enrollment-v2/contribution";
  const showPrimaryArrow = primaryShowArrow || isContributionPage;

  return (
    <footer
      className={`enrollment-footer${inContent ? " enrollment-footer--in-content" : ""}${isContributionPage ? " enrollment-footer--contribution" : ""}`}
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
            {isContributionPage ? <ChevronLeft className="enrollment-footer__back-icon" aria-hidden /> : null}
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
          {!hideSaveAndExit && (
            <Button
              type="button"
              onClick={handleSaveAndExit}
              className="enrollment-footer__save-exit"
            >
              {t("enrollment.footerSaveAndExit")}
            </Button>
          )}
          {nextPath ? (
            <a
              href={nextPath}
              onClick={(e) => {
                e.preventDefault();
                if (primaryDisabled) return;
                handlePrimary(); // saves draft then sets window.location.href
              }}
              className="button enrollment-footer__primary"
              aria-disabled={primaryDisabled}
              role="button"
            >
              {primaryLabel}
              {showPrimaryArrow ? <ChevronRight className="enrollment-footer__primary-icon" aria-hidden /> : null}
            </a>
          ) : (
            <Button
              type="button"
              onClick={() => handlePrimary()}
              disabled={primaryDisabled}
              className="enrollment-footer__primary"
            >
              {primaryLabel}
              {showPrimaryArrow ? <ChevronRight className="enrollment-footer__primary-icon" aria-hidden /> : null}
            </Button>
          )}
        </div>
      </div>
    </footer>
  );
};

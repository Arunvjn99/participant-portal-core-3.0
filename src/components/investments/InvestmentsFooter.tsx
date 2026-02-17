import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useInvestment } from "../../context/InvestmentContext";
import { loadEnrollmentDraft, saveEnrollmentDraft } from "../../enrollment/enrollmentDraftStore";
import { EnrollmentFooter } from "../enrollment/EnrollmentFooter";

/**
 * InvestmentsFooter - Renders EnrollmentFooter for enrollment flow.
 * Primary action confirms allocation and navigates to Review.
 */
export const InvestmentsFooter = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { canConfirmAllocation, confirmAllocation, getInvestmentSnapshot } = useInvestment();

  const isEnrollmentFlow = location.pathname === "/enrollment/investments";

  const handleContinue = () => {
    if (!canConfirmAllocation) return;
    confirmAllocation();
    const draft = loadEnrollmentDraft();
    if (draft) {
      saveEnrollmentDraft({
        ...draft,
        investment: getInvestmentSnapshot(),
      });
    }
    navigate("/enrollment/review");
  };

  if (!isEnrollmentFlow) return null;

  const summaryText = canConfirmAllocation
    ? t("enrollment.allocationValid100")
    : t("enrollment.allocationMustTotal");

  return (
    <EnrollmentFooter
      step={3}
      primaryLabel={t("enrollment.continueToReview")}
      primaryDisabled={!canConfirmAllocation}
      onPrimary={handleContinue}
      summaryText={summaryText}
      getDraftSnapshot={() => ({ investment: getInvestmentSnapshot() })}
    />
  );
};

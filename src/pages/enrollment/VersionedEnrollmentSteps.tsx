import { useParams } from "react-router-dom";
import { ChoosePlan as V1ChoosePlan } from "@/archive/enrollment-v0/ChoosePlan";
import { ChoosePlan as V2ChoosePlan } from "@/versions/v2/enrollment/ChoosePlan";
import { Contribution as V1Contribution } from "@/archive/enrollment-v0/Contribution";
import { Contribution as V2Contribution } from "@/versions/v2/enrollment/Contribution";
import { EnrollmentInvestmentsGuard as V1EnrollmentInvestmentsGuard } from "@/archive/enrollment-v0/EnrollmentInvestmentsGuard";
import { EnrollmentInvestmentsGuard as V2EnrollmentInvestmentsGuard } from "@/versions/v2/enrollment/EnrollmentInvestmentsGuard";
import { EnrollmentInvestmentsContent as V1EnrollmentInvestmentsContent } from "@/archive/enrollment-v0/EnrollmentInvestmentsContent";
import { EnrollmentInvestmentsContent as V2EnrollmentInvestmentsContent } from "@/versions/v2/enrollment/EnrollmentInvestmentsContent";
import { EnrollmentReviewContent as V1EnrollmentReviewContent } from "@/archive/enrollment-v0/EnrollmentReviewContent";
import { EnrollmentReviewContent as V2EnrollmentReviewContent } from "@/versions/v2/enrollment/EnrollmentReviewContent";

export function VersionedChoosePlan() {
  const { version } = useParams<{ version?: string }>();
  if (version === "v2") return <V2ChoosePlan />;
  return <V1ChoosePlan />;
}

export function VersionedContribution() {
  const { version } = useParams<{ version?: string }>();
  if (version === "v2") return <V2Contribution />;
  return <V1Contribution />;
}

export function VersionedEnrollmentInvestments() {
  const { version } = useParams<{ version?: string }>();
  if (version === "v2") {
    return (
      <V2EnrollmentInvestmentsGuard>
        <V2EnrollmentInvestmentsContent />
      </V2EnrollmentInvestmentsGuard>
    );
  }
  return (
    <V1EnrollmentInvestmentsGuard>
      <V1EnrollmentInvestmentsContent />
    </V1EnrollmentInvestmentsGuard>
  );
}

export function VersionedEnrollmentReviewContent() {
  const { version } = useParams<{ version?: string }>();
  if (version === "v2") return <V2EnrollmentReviewContent />;
  return <V1EnrollmentReviewContent />;
}

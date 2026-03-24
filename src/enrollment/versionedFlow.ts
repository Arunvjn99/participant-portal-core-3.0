/**
 * Direct re-exports of **v1** enrollment modules (for tooling/tests that need a fixed implementation).
 * The app router uses `VersionedEnrollment` + `VersionedEnrollmentSteps` to mount v1 or v2 under `/:version/enrollment`.
 * v2 copies live in `src/versions/v2/enrollment/`.
 */
export { EnrollmentLayout } from "@/archive/enrollment-v0/EnrollmentLayout";
export { ChoosePlan } from "@/archive/enrollment-v0/ChoosePlan";
export { Contribution } from "@/archive/enrollment-v0/Contribution";
export { Review } from "@/archive/enrollment-v0/Review";
export { EnrollmentReviewContent } from "@/archive/enrollment-v0/EnrollmentReviewContent";
export { EnrollmentInvestmentsGuard } from "@/archive/enrollment-v0/EnrollmentInvestmentsGuard";
export { EnrollmentInvestmentsContent } from "@/archive/enrollment-v0/EnrollmentInvestmentsContent";

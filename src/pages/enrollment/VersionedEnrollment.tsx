import { useParams } from "react-router-dom";
import { EnrollmentLayout as V1EnrollmentLayout } from "@/archive/enrollment-v0/EnrollmentLayout";
import { EnrollmentLayout as V2EnrollmentLayout } from "@/versions/v2/enrollment/EnrollmentLayout";

/**
 * Selects enrollment shell for `/:version/enrollment/*`.
 * Legacy `/enrollment` (no version param) resolves to v1 via `version !== "v2"`.
 */
export function VersionedEnrollment() {
  const { version } = useParams<{ version?: string }>();

  if (version === "v2") {
    return <V2EnrollmentLayout />;
  }

  return <V1EnrollmentLayout />;
}

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "../../enrollment-v2/components/PageHeader";

interface EnrollmentPageContentProps {
  /** Page title (H1). Omit when using headerContent. */
  title?: string;
  /** Optional subtitle (text-base muted) */
  subtitle?: string;
  /** Optional badge above the title */
  badge?: ReactNode;
  /** When provided, replaces the default title/subtitle header entirely */
  headerContent?: ReactNode;
  children: ReactNode;
}

/**
 * Shared inner wrapper for all enrollment step pages.
 * Uses PageHeader for consistent typography (text-3xl font-semibold tracking-tight / text-base muted).
 * Provides full-bleed enrollment background via design tokens.
 *
 * NOTE: This does NOT replace the route-level EnrollmentLayout.
 */
export function EnrollmentPageContent({
  title,
  subtitle,
  badge,
  headerContent,
  children,
}: EnrollmentPageContentProps) {
  const hasHeader = title != null || headerContent != null;

  return (
    <div
      className="enrollment-page-content min-h-[60vh] pb-12 w-screen relative left-1/2 -translate-x-1/2 overflow-hidden"
      style={{
        background: "linear-gradient(140deg, rgb(var(--enroll-brand-rgb) / 0.06) 0%, var(--enroll-soft-bg) 35%, var(--enroll-bg) 65%, rgb(var(--enroll-accent-rgb) / 0.05) 100%)",
      }}
    >
      {/* Subtle blurred gradient orbs for depth (token-based, no layout impact) */}
      <div
        className="absolute pointer-events-none inset-0 overflow-hidden"
        aria-hidden
      >
        <div
          className="absolute rounded-full opacity-30"
          style={{
            width: "min(80vw, 600px)",
            height: "min(80vw, 600px)",
            top: "-20%",
            left: "-10%",
            background: "radial-gradient(circle, rgb(var(--enroll-brand-rgb) / 0.15) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute rounded-full opacity-25"
          style={{
            width: "min(70vw, 500px)",
            height: "min(70vw, 500px)",
            bottom: "-15%",
            right: "-5%",
            background: "radial-gradient(circle, rgb(var(--enroll-accent-rgb) / 0.12) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />
      </div>
      <div className="relative max-w-6xl mx-auto px-6 py-8">
        {hasHeader && (
          <div className="mb-6">
            {headerContent != null ? (
              headerContent
            ) : (
              <PageHeader title={title!} subtitle={subtitle} badge={badge} />
            )}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

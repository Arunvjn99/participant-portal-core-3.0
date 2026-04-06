import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useDemoUser } from "@/hooks/useDemoUser";
import { useFeedbackStore } from "@/store/feedbackStore";
import { cn } from "@/lib/utils";

const HIDE_FEEDBACK_PATH_PREFIXES = [
  "/v1/login",
  "/v2/login",
  "/login",
  "/v1/verify",
  "/v2/verify",
  "/verify",
  "/signup",
  "/forgot-password",
  "/forgot-password-verify",
  "/reset-password",
];

function shouldHideFeedbackFab(pathname: string): boolean {
  if (pathname === "/") return true;
  return HIDE_FEEDBACK_PATH_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

/**
 * Global floating entry to open feedback. Mounted once in {@link RootLayout}.
 * Shown when the user has a Supabase session, is in demo mode, or is past public auth routes (best-effort).
 */
export function FeedbackButton() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { user } = useAuth();
  const demoUser = useDemoUser();
  const openFeedback = useFeedbackStore((s) => s.openFeedback);

  const hideByRoute = shouldHideFeedbackFab(pathname);
  const hasAppSession = Boolean(user || demoUser);
  if (hideByRoute || !hasAppSession) return null;

  return (
    <motion.button
      type="button"
      onClick={() => openFeedback()}
      aria-label={t("nav.shareFeedback")}
      title={t("nav.shareFeedback")}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.96 }}
      className={cn(
        "fixed flex h-14 w-14 items-center justify-center rounded-full border border-border",
        "bg-primary text-primary-foreground shadow-lg",
        "transition-shadow hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      )}
      style={{ bottom: 24, right: 24, zIndex: 9999 }}
    >
      <MessageCircle className="h-6 w-6" aria-hidden strokeWidth={2} />
    </motion.button>
  );
}

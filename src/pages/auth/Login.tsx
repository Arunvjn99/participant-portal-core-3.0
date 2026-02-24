import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AuthLayout,
  AuthFormShell,
  AuthInput,
  AuthPasswordInput,
  AuthButton,
} from "../../components/auth";
import { Logo } from "../../components/brand/Logo";
import { useAuth } from "../../context/AuthContext";
import { useOtp } from "../../context/OtpContext";
import { supabase } from "../../lib/supabase";
import { personas, SCENARIO_LABELS } from "@/mock/personas";
import { setDemoUser } from "@/hooks/useDemoUser";
import type { PersonaProfile } from "@/mock/personas";

const DOMAIN_LOOKUP_DEBOUNCE_MS = 500;

/* ─────────────────────────────────────────────────────────────────────────
   Scenario colors for the demo persona picker
   ───────────────────────────────────────────────────────────────────────── */

const SCENARIO_COLORS: Record<string, string> = {
  pre_enrollment: "#6366f1",
  new_enrollee: "#6366f1",
  young_accumulator: "#10b981",
  mid_career: "#0b5fff",
  pre_retiree: "#f59e0b",
  at_risk: "#ef4444",
  loan_active: "#f97316",
  retired: "#8b5cf6",
};

export const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, loading: authLoading, signIn } = useAuth();
  const { isOtpVerified } = useOtp();
  const [showDemoPanel, setShowDemoPanel] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [detectedLogo, setDetectedLogo] = useState<string | null>(null);
  const domainLookupTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (user && isOtpVerified) {
      navigate("/dashboard", { replace: true });
    }
  }, [authLoading, user, isOtpVerified, navigate]);

  /* ── Email domain → company logo preview (debounced; no theme change) ── */
  useEffect(() => {
    const domain = email.trim().split("@")[1];
    if (!domain) {
      setDetectedLogo(null);
      return;
    }
    if (domainLookupTimeoutRef.current) {
      clearTimeout(domainLookupTimeoutRef.current);
      domainLookupTimeoutRef.current = null;
    }
    domainLookupTimeoutRef.current = setTimeout(async () => {
      domainLookupTimeoutRef.current = null;
      try {
        const { data } = await supabase
          .from("companies")
          .select("logo_url")
          .eq("domain", domain.toLowerCase())
          .maybeSingle();
        if (data?.logo_url) {
          setDetectedLogo(typeof data.logo_url === "string" ? data.logo_url.trim() : null);
        } else {
          setDetectedLogo(null);
        }
      } catch {
        setDetectedLogo(null);
      }
    }, DOMAIN_LOOKUP_DEBOUNCE_MS);
    return () => {
      if (domainLookupTimeoutRef.current) {
        clearTimeout(domainLookupTimeoutRef.current);
      }
    };
  }, [email]);

  const handleLogin = async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setSubmitting(true);
    try {
      await signIn(email, password);
      navigate("/verify?mode=login", { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot");
  };

  const handleHelpCenter = () => {
    navigate("/help");
  };

  /* ── Demo login ── */
  const handleDemoLogin = (persona: PersonaProfile) => {
    setDemoUser(persona);
    navigate("/demo");
  };

  /* ── CORE product branding (pre-auth only; tenant logo shown after login) ── */
  const headerSlot = <Logo />;

  /* ── Standard login form body ── */
  const standardBody = (
    <>
      {detectedLogo && (
        <div className="flex justify-center mb-4">
          <img
            src={detectedLogo}
            alt="Company Preview"
            className="h-10 w-auto object-contain transition-opacity duration-300"
          />
        </div>
      )}
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-[var(--color-danger)]/20 bg-[var(--color-danger)]/5 px-4 py-3 text-sm text-[var(--color-danger)]"
        >
          {error}
        </div>
      )}

      <AuthInput
        label={t("auth.email")}
        type="email"
        name="email"
        id="email"
        placeholder={t("auth.enterEmail")}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className="flex flex-col gap-2">
        <AuthPasswordInput
          label={t("auth.password")}
          name="password"
          id="password"
          placeholder={t("auth.enterPassword")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex justify-end">
          <a
            href="#"
            className="text-sm text-[var(--color-primary)] no-underline transition-colors hover:underline"
            onClick={(e) => {
              e.preventDefault();
              handleForgotPassword();
            }}
          >
            {t("auth.forgotPassword")}
          </a>
        </div>
      </div>
      <AuthButton onClick={handleLogin} disabled={submitting} className="w-full">
        {submitting ? t("auth.loggingIn", "Logging in…") : t("auth.login")}
      </AuthButton>

      {/* ── Divider ── */}
      <div className="relative flex items-center py-1">
        <div className="flex-1 border-t border-[var(--color-border)]" />
        <span className="mx-3 text-xs font-medium text-[var(--color-textSecondary)]">{t("auth.or")}</span>
        <div className="flex-1 border-t border-[var(--color-border)]" />
      </div>

      {/* ── Explore Scenarios CTA ── */}
      <button
        type="button"
        onClick={() => setShowDemoPanel(true)}
        className="group flex w-full items-center justify-center gap-2.5 rounded-lg border-2 border-dashed border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5 px-5 py-3.5 text-sm font-semibold text-[var(--color-primary)] transition-all hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-primary)]/10"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden>
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <line x1="20" y1="8" x2="20" y2="14" />
          <line x1="23" y1="11" x2="17" y2="11" />
        </svg>
        {t("auth.exploreDemoScenarios")}
        <span className="rounded-full bg-[var(--color-primary)]/10 px-2 py-0.5 text-[10px] font-bold text-[var(--color-primary)]">
          {personas.length} {t("auth.personas")}
        </span>
      </button>

      <p className="text-center text-sm text-[var(--color-textSecondary)]">
        Don&apos;t have an account?{" "}
        <Link
          to="/signup"
          className="text-[var(--color-primary)] no-underline hover:underline"
        >
          Sign up
        </Link>
      </p>

      <p className="text-center text-sm text-[var(--color-textSecondary)]">
        {t("auth.stillNeedHelp")}{" "}
        <a
          href="#"
          className="text-[var(--color-primary)] no-underline hover:underline"
          onClick={(e) => {
            e.preventDefault();
            handleHelpCenter();
          }}
        >
          {t("auth.helpCenter")}
        </a>
      </p>
    </>
  );

  return (
    <AuthLayout>
      <AuthFormShell
        headerSlot={headerSlot}
        title={t("auth.login")}
        bodySlot={standardBody}
      />

      {/* ── Demo Scenario Picker Modal ── */}
      {showDemoPanel && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDemoPanel(false)}
            aria-hidden
          />

          {/* Panel */}
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-[var(--color-text)]">
                  {t("auth.exploreScenarios")}
                </h2>
                <p className="mt-0.5 text-sm text-[var(--color-textSecondary)]">
                  {t("auth.pickPersona")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDemoPanel(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-textSecondary)] transition-colors hover:bg-[var(--color-background)] hover:text-[var(--color-text)]"
                aria-label={t("auth.close")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Persona list */}
            <div className="max-h-[60vh] overflow-y-auto p-3">
              <div className="flex flex-col gap-1.5">
                {personas.map((persona) => {
                  const color = SCENARIO_COLORS[persona.scenario] ?? "#6b7280";
                  const fmt = Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

                  return (
                    <button
                      key={persona.id}
                      type="button"
                      onClick={() => handleDemoLogin(persona)}
                      className="flex w-full items-center gap-3 rounded-xl border-2 border-transparent p-4 text-left transition-all hover:border-[var(--color-border)] hover:bg-[var(--color-background)]"
                    >
                      {/* Avatar */}
                      <span
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                        style={{ backgroundColor: color }}
                      >
                        {persona.name.charAt(0)}
                      </span>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[var(--color-text)]">
                            {persona.name}
                          </span>
                          <span
                            className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
                            style={{ backgroundColor: color }}
                          >
                            {SCENARIO_LABELS[persona.scenario]}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-[var(--color-textSecondary)]">
                          Age {persona.age} · {fmt.format(persona.balance)} · Score {persona.retirementScore}
                        </p>
                      </div>

                      {/* Arrow */}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-[var(--color-border)]" aria-hidden>
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-[var(--color-border)] px-5 py-3">
              <p className="text-center text-xs text-[var(--color-textSecondary)]">
                No password required — click any persona to explore instantly.
              </p>
            </div>
          </div>
        </div>
      )}
    </AuthLayout>
  );
};

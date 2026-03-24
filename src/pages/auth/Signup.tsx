import { useState, useEffect, useRef, useMemo, useLayoutEffect, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as Label from "@radix-ui/react-label";
import {
  AuthLayout,
  AuthFormShell,
  AuthInput,
  AuthPasswordInput,
  AuthButton,
} from "@/components/auth";
import { Logo } from "@/components/brand/Logo";
import { useAuth } from "@/context/AuthContext";
import { useOtp } from "@/context/OtpContext";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { US_STATES } from "@/constants/usStates";

/** Normalized state option for combobox; supports string[] or { code?, name?, label?, state_name? }[] from source. */
interface StateOption {
  code: string;
  name: string;
}

function normalizeStateOptions(source: unknown): StateOption[] {
  const list = Array.isArray(source) ? source : [];
  return list
    .filter((item): item is NonNullable<typeof item> => item != null)
    .map((item): StateOption => {
      if (typeof item === "string") {
        return { code: item, name: item };
      }
      const obj = item as Record<string, unknown>;
      const name = (obj?.name ?? obj?.label ?? obj?.state_name ?? "").toString();
      const code = (obj?.code ?? obj?.name ?? obj?.label ?? name).toString();
      return { code: code || name, name: name || code };
    })
    .filter((s) => (s.name ?? "").trim() !== "");
}

interface Company {
  id: string;
  name: string;
}

interface FormErrors {
  name?: string;
  location?: string;
  companyId?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(
  name: string,
  selectedState: string | null,
  companyId: string,
  email: string,
  password: string,
  confirmPassword: string,
  t: (key: string) => string,
): FormErrors {
  const errors: FormErrors = {};
  if (!name.trim()) errors.name = t("auth.signupValidationNameRequired");
  if (!selectedState) errors.location = t("auth.signupValidationStateRequired");
  if (!companyId) errors.companyId = t("auth.signupValidationCompanyRequired");
  if (!email.trim()) errors.email = t("auth.signupValidationEmailRequired");
  else if (!EMAIL_REGEX.test(email)) errors.email = t("auth.signupValidationEmailInvalid");
  if (password.length < 6) errors.password = t("auth.signupValidationPasswordMin");
  if (password !== confirmPassword) errors.confirmPassword = t("auth.signupValidationPasswordsDontMatch");
  return errors;
}

type PasswordStrength = "weak" | "medium" | "strong";

function getPasswordStrength(password: string): { level: PasswordStrength; score: number } {
  if (!password) return { level: "weak", score: 0 };
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  const level: PasswordStrength =
    score >= 5 ? "strong" : score >= 3 ? "medium" : "weak";
  return { level, score };
}

export const Signup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { resetOtp } = useOtp();

  const [name, setName] = useState("");
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [stateSearchQuery, setStateSearchQuery] = useState("");
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [stateHighlightIndex, setStateHighlightIndex] = useState(0);
  const [dropdownRect, setDropdownRect] = useState<{ top: number; left: number; width: number } | null>(null);
  const stateDropdownRef = useRef<HTMLDivElement>(null);
  const stateInputRef = useRef<HTMLInputElement>(null);
  const stateListboxRef = useRef<HTMLUListElement>(null);

  const [companyId, setCompanyId] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabaseReady = isSupabaseConfigured();

  const stateOptions = useMemo(() => normalizeStateOptions(US_STATES), []);

  const filteredStates = useMemo(() => {
    const q = (stateSearchQuery ?? "").trim().toLowerCase();
    if (!q) return stateOptions;
    return stateOptions.filter((s) =>
      (s?.name ?? "").toLowerCase().includes(q)
    );
  }, [stateSearchQuery, stateOptions]);

  const selectedStateName = selectedState
    ? (stateOptions.find((s) => s?.code === selectedState)?.name ?? "")
    : "";

  useEffect(() => {
    let cancelled = false;

    const fetchCompanies = async () => {
      if (!supabase) {
        if (!cancelled) {
          setCompanies([]);
          setCompaniesLoading(false);
        }
        return;
      }
      try {
        const { data, error } = await supabase
          .from("companies")
          .select("id, name");

        if (cancelled) return;
        if (error) {
          setServerError(
            error.code === "PGRST301" || error.message?.includes("permission") || error.message?.includes("row-level security")
              ? t("auth.signupErrorCompaniesUnavailable")
              : t("auth.signupErrorLoadCompaniesFailed")
          );
        } else {
          setCompanies(data ?? []);
        }
      } catch (e) {
        if (cancelled) return;
        setServerError(t("auth.signupErrorConnection"));
      } finally {
        if (!cancelled) setCompaniesLoading(false);
      }
    };

    fetchCompanies();
    return () => { cancelled = true; };
  }, [t]);

  useLayoutEffect(() => {
    if (!stateDropdownOpen || !stateInputRef.current) return;
    const el = stateInputRef.current;
    const updateRect = () => {
      const rect = el.getBoundingClientRect();
      setDropdownRect({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    };
    updateRect();
    window.addEventListener("scroll", updateRect, true);
    window.addEventListener("resize", updateRect);
    return () => {
      window.removeEventListener("scroll", updateRect, true);
      window.removeEventListener("resize", updateRect);
    };
  }, [stateDropdownOpen, stateSearchQuery, filteredStates.length]);

  useEffect(() => {
    if (!stateDropdownOpen) {
      setDropdownRect(null);
      return;
    }
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        stateDropdownRef.current?.contains(target) ||
        stateListboxRef.current?.contains(target)
      ) {
        return;
      }
      setStateDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [stateDropdownOpen]);

  useEffect(() => {
    setStateHighlightIndex(0);
  }, [stateSearchQuery, stateDropdownOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setSuccessMessage(null);

    const fieldErrors = validate(name, selectedState, companyId, email, password, confirmPassword, t);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setLoading(true);
    try {
      if (!supabase) {
        setServerError("Supabase not configured");
        return;
      }
      const { user: newUser } = await signUp(email, password, {
        name: name.trim(),
        company_id: companyId,
        location: selectedState ?? "",
      });

      // Application-layer profile write (no DB trigger). Upsert so row exists even if no trigger.
      const selectedCompanyUUID = (companyId ?? "").trim() || null;
      if (!newUser?.id) {
        setServerError(t("auth.signupErrorGeneric"));
        return;
      }

      const { error: upsertError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: newUser.id,
            name: name.trim(),
            location: selectedState ?? "",
            company_id: selectedCompanyUUID,
            role: "user",
          },
          { onConflict: "id" }
        );

      if (upsertError) {
        console.error("[Signup] profiles upsert failed:", upsertError);
        setServerError(t("auth.signupErrorGeneric"));
        return;
      }

      const { data: verifyProfile } = await supabase
        .from("profiles")
        .select("company_id")
        .eq("id", newUser.id)
        .single();

      if (!verifyProfile?.company_id) {
        console.warn("[Signup] company_id missing after upsert");
      }

      await supabase.auth.signOut();
      resetOtp();
      navigate("/verify?mode=signup", { replace: true });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : String(err).replace(/^Error:\s*/, "") || t("auth.signupErrorGeneric");
      if (message.includes("already registered") || message.includes("already exists")) {
        setServerError(t("auth.signupErrorAlreadyRegistered"));
      } else if (message.includes("signup disabled") || message.includes("Sign-up is currently disabled")) {
        setServerError(t("auth.signupErrorSignupDisabled"));
      } else {
        setServerError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const headerSlot = <Logo className="h-10 w-auto" />;

  const bodySlot = (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 overflow-visible md:grid-cols-2 md:gap-6" noValidate>
      {!supabaseReady && (
        <div
          role="status"
          className="md:col-span-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background-secondary)] px-4 py-3 text-sm text-[var(--color-text)]"
        >
          Running in demo mode (no backend). Sign up is disabled until you configure{" "}
          <code className="rounded bg-[var(--color-surface)] px-1 text-xs">VITE_SUPABASE_URL</code> and{" "}
          <code className="rounded bg-[var(--color-surface)] px-1 text-xs">VITE_SUPABASE_ANON_KEY</code> in{" "}
          <code className="rounded bg-[var(--color-surface)] px-1 text-xs">.env</code> — see README. Use Explore Demo on the login page to try the app.
        </div>
      )}
      {serverError && (
        <div
          role="alert"
          className="md:col-span-2 rounded-lg border border-[var(--color-danger)]/20 bg-[var(--color-danger)]/5 px-4 py-3 text-sm text-[var(--color-danger)]"
        >
          {serverError}
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="md:col-span-2 rounded-lg border border-[var(--color-success)]/20 bg-[var(--color-success)]/5 px-4 py-3 text-sm text-[var(--color-success)]"
        >
          {successMessage}
        </div>
      )}

      <AuthInput
        label={t("auth.signupName")}
        type="text"
        name="name"
        id="signup-name"
        placeholder={t("auth.signupNamePlaceholder")}
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
      />

      <AuthInput
        label={t("auth.signupEmail")}
        type="email"
        name="email"
        id="signup-email"
        placeholder={t("auth.signupEmailPlaceholder")}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />

      <div className="flex w-full flex-col gap-2 overflow-visible" ref={stateDropdownRef}>
        <Label.Root
          htmlFor="signup-state"
          className="text-sm font-medium text-[var(--color-text)]"
        >
          {t("auth.signupState")}
        </Label.Root>
        <div className="relative">
          <input
            ref={stateInputRef}
            id="signup-state"
            type="text"
            autoComplete="off"
            role="combobox"
            aria-expanded={stateDropdownOpen}
            aria-haspopup="listbox"
            aria-controls="signup-state-listbox"
            aria-activedescendant={
              stateDropdownOpen && filteredStates[stateHighlightIndex]
                ? `signup-state-option-${filteredStates[stateHighlightIndex].code}`
                : undefined
            }
            aria-autocomplete="list"
            aria-invalid={errors.location ? true : undefined}
            aria-describedby={errors.location ? "signup-state-error" : undefined}
            placeholder={t("auth.signupStatePlaceholder")}
            value={stateDropdownOpen ? stateSearchQuery : selectedStateName}
            onChange={(e) => {
              setStateSearchQuery(e.target.value);
              setStateDropdownOpen(true);
            }}
            onFocus={() => setStateDropdownOpen(true)}
            onKeyDown={(e) => {
              if (!stateDropdownOpen) {
                if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
                  e.preventDefault();
                  setStateDropdownOpen(true);
                }
                return;
              }
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setStateHighlightIndex((i) =>
                  i < filteredStates.length - 1 ? i + 1 : 0
                );
                return;
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setStateHighlightIndex((i) =>
                  i > 0 ? i - 1 : filteredStates.length - 1
                );
                return;
              }
              if (e.key === "Enter") {
                e.preventDefault();
                const option = filteredStates[stateHighlightIndex];
                if (option) {
                  setSelectedState(option.code);
                  setStateSearchQuery("");
                  setStateDropdownOpen(false);
                  setErrors((prev) => ({ ...prev, location: undefined }));
                }
                return;
              }
              if (e.key === "Escape") {
                e.preventDefault();
                setStateDropdownOpen(false);
                setStateSearchQuery("");
              }
            }}
            className={`h-[2.75rem] w-full rounded-lg border bg-[var(--color-surface)] px-4 py-3 text-base transition-colors focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 ${
              selectedStateName
                ? "text-[var(--color-text)]"
                : "text-[var(--color-textSecondary)]"
            } ${
              errors.location
                ? "border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]/20"
                : "border-[var(--color-border)]"
            }`}
          />
          {stateDropdownOpen &&
            dropdownRect &&
            createPortal(
              <ul
                ref={stateListboxRef}
                id="signup-state-listbox"
                role="listbox"
                className="z-50 max-h-60 overflow-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] py-1 shadow-lg"
                style={{
                  position: "fixed",
                  top: dropdownRect.top,
                  left: dropdownRect.left,
                  width: dropdownRect.width,
                  minWidth: dropdownRect.width,
                }}
              >
                {filteredStates.length === 0 ? (
                  <li
                    role="option"
                    aria-disabled="true"
                    className="px-4 py-3 text-sm text-[var(--color-textSecondary)]"
                  >
                    {t("auth.signupNoMatchingState")}
                  </li>
                ) : (
                  filteredStates.map((state, index) => (
                    <li
                      key={state.code}
                      id={`signup-state-option-${state.code}`}
                      role="option"
                      aria-selected={selectedState === state.code}
                      className={`cursor-pointer px-4 py-2.5 text-sm ${
                        index === stateHighlightIndex
                          ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                          : "text-[var(--color-text)]"
                      }`}
                      onMouseEnter={() => setStateHighlightIndex(index)}
                      onClick={() => {
                        setSelectedState(state.code);
                        setStateSearchQuery("");
                        setStateDropdownOpen(false);
                        setErrors((prev) => ({ ...prev, location: undefined }));
                      }}
                    >
                      {state.name}
                    </li>
                  ))
                )}
              </ul>,
              document.body
            )}
        </div>
        {errors.location && (
          <span id="signup-state-error" className="text-sm text-[var(--color-danger)]" role="alert">
            {errors.location}
          </span>
        )}
      </div>

      <div className="flex w-full flex-col gap-2">
        <Label.Root
          htmlFor="signup-company"
          className="text-sm font-medium text-[var(--color-text)]"
        >
          {t("auth.signupCompany")}
        </Label.Root>
        <select
          id="signup-company"
          name="company"
          value={companyId}
          onChange={(e) => setCompanyId(e.target.value)}
          disabled={companiesLoading}
          aria-invalid={errors.companyId ? true : undefined}
          aria-describedby={errors.companyId ? "signup-company-error" : undefined}
          className={`h-[2.75rem] w-full rounded-lg border bg-[var(--color-surface)] px-4 py-3 text-base transition-colors focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 ${
            companyId
              ? "text-[var(--color-text)]"
              : "text-[var(--color-textSecondary)]"
          } ${
            errors.companyId
              ? "border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]/20"
              : "border-[var(--color-border)]"
          }`}
        >
          <option value="">
            {companiesLoading ? t("auth.signupCompanyLoading") : t("auth.signupCompanyPlaceholder")}
          </option>
          {/* Option value is company UUID (c.id); stored as profile.company_id on signup */}
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.companyId && (
          <span id="signup-company-error" className="text-sm text-[var(--color-danger)]" role="alert">
            {errors.companyId}
          </span>
        )}
      </div>

      <div className="flex w-full flex-col gap-2">
        <AuthPasswordInput
          label={t("auth.signupPassword")}
          name="password"
          id="signup-password"
          placeholder={t("auth.signupPasswordPlaceholder")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        {(() => {
          const { level } = getPasswordStrength(password);
          const segmentCount = level === "weak" ? 1 : level === "medium" ? 2 : 3;
          const label =
            level === "weak"
              ? t("auth.signupPasswordStrengthWeak")
              : level === "medium"
                ? t("auth.signupPasswordStrengthMedium")
                : t("auth.signupPasswordStrengthStrong");
          const barColor =
            level === "weak"
              ? "var(--color-danger)"
              : level === "medium"
                ? "var(--color-warning, #ca8a04)"
                : "var(--color-success)";
          return (
            <div
              role="status"
              aria-live="polite"
              className="flex flex-col gap-1.5"
              aria-label={`Password strength: ${label}`}
            >
              <div className="flex gap-0.5" aria-hidden>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-1 flex-1 rounded-full transition-colors"
                    style={{
                      backgroundColor:
                        i <= segmentCount ? barColor : "var(--color-border)",
                    }}
                  />
                ))}
              </div>
              <span
                className="text-xs font-medium"
                style={{ color: barColor }}
              >
                {label}
              </span>
            </div>
          );
        })()}
      </div>

      <AuthPasswordInput
        label={t("auth.signupConfirmPassword")}
        name="confirmPassword"
        id="signup-confirm-password"
        placeholder={t("auth.signupConfirmPasswordPlaceholder")}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={errors.confirmPassword}
      />

      <div className="md:col-span-2">
        <AuthButton
          type="submit"
          disabled={loading || companiesLoading || selectedState === null || !supabaseReady}
          aria-busy={loading}
          className="w-full"
        >
          {loading ? t("auth.signupSubmitting") : t("auth.signupSubmit")}
        </AuthButton>
      </div>

      <div className="md:col-span-2">
        <p className="text-center text-sm text-[var(--color-textSecondary)]">
          {t("auth.signupAlreadyHaveAccount")}{" "}
          <Link
            to="/"
            className="text-[var(--color-primary)] no-underline hover:underline"
          >
            {t("auth.signupSignIn")}
          </Link>
        </p>
      </div>
    </form>
  );

  return (
    <AuthLayout>
      <AuthFormShell
        headerSlot={headerSlot}
        title={t("auth.signupTitle")}
        description={t("auth.signupDesc")}
        bodySlot={bodySlot}
      />
    </AuthLayout>
  );
};

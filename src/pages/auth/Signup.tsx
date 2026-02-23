import { useState, useEffect, useRef, useMemo, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as Label from "@radix-ui/react-label";
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
import { US_STATES } from "../../constants/usStates";

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

function validate(
  name: string,
  selectedState: string | null,
  companyId: string,
  email: string,
  password: string,
  confirmPassword: string,
): FormErrors {
  const errors: FormErrors = {};
  if (!name.trim()) errors.name = "Name is required.";
  if (!selectedState) errors.location = "Please select a state.";
  if (!companyId) errors.companyId = "Please select a company.";
  if (!email.trim()) errors.email = "Email is required.";
  if (password.length < 6) errors.password = "Password must be at least 6 characters.";
  if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match.";
  return errors;
}

export const Signup = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { resetOtp } = useOtp();

  const [name, setName] = useState("");
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [stateSearchQuery, setStateSearchQuery] = useState("");
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [stateHighlightIndex, setStateHighlightIndex] = useState(0);
  const stateDropdownRef = useRef<HTMLDivElement>(null);

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

  const filteredStates = useMemo(() => {
    const q = stateSearchQuery.trim().toLowerCase();
    if (!q) return US_STATES;
    return US_STATES.filter((s) => s.name.toLowerCase().includes(q));
  }, [stateSearchQuery]);

  const selectedStateName = selectedState
    ? US_STATES.find((s) => s.code === selectedState)?.name ?? ""
    : "";

  useEffect(() => {
    let cancelled = false;

    const fetchCompanies = async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("id, name");

      if (cancelled) return;
      if (error) {
        setServerError("Failed to load companies. Please refresh.");
      } else {
        setCompanies(data ?? []);
      }
      setCompaniesLoading(false);
    };

    fetchCompanies();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!stateDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (stateDropdownRef.current && !stateDropdownRef.current.contains(e.target as Node)) {
        setStateDropdownOpen(false);
      }
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

    const fieldErrors = validate(name, selectedState, companyId, email, password, confirmPassword);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setLoading(true);
    try {
      await signUp(email, password, {
        name: name.trim(),
        company_id: companyId,
        location: selectedState ?? "",
      });

      await supabase.auth.signOut();
      resetOtp();
      navigate("/verify?mode=signup", { replace: true });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Signup failed. Please try again.";
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  const headerSlot = <Logo className="h-10 w-auto" />;

  const bodySlot = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      {serverError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400"
        >
          {serverError}
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400"
        >
          {successMessage}
        </div>
      )}

      <AuthInput
        label="Name"
        type="text"
        name="name"
        id="signup-name"
        placeholder="Enter your full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
      />

      <div className="flex w-full flex-col gap-2" ref={stateDropdownRef}>
        <Label.Root
          htmlFor="signup-state"
          className="text-sm font-medium text-slate-900 dark:text-slate-100"
        >
          State
        </Label.Root>
        <div className="relative">
          <input
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
            placeholder="Search or select state"
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
            className={`w-full rounded-lg border bg-white px-4 py-3 text-base transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-800 dark:focus:border-blue-400 dark:focus:ring-blue-400/20 ${
              selectedStateName
                ? "text-slate-900 dark:text-slate-100"
                : "text-slate-500 dark:text-slate-400"
            } ${
              errors.location
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500"
                : "border-slate-200 dark:border-slate-600"
            }`}
          />
          {stateDropdownOpen && (
            <ul
              id="signup-state-listbox"
              role="listbox"
              className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-600 dark:bg-slate-800"
            >
              {filteredStates.length === 0 ? (
                <li className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                  No matching state
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
                        ? "bg-blue-50 text-blue-900 dark:bg-blue-900/30 dark:text-blue-100"
                        : "text-slate-900 dark:text-slate-100"
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
            </ul>
          )}
        </div>
        {errors.location && (
          <span id="signup-state-error" className="text-sm text-red-500" role="alert">
            {errors.location}
          </span>
        )}
      </div>

      <div className="flex w-full flex-col gap-2">
        <Label.Root
          htmlFor="signup-company"
          className="text-sm font-medium text-slate-900 dark:text-slate-100"
        >
          Company
        </Label.Root>
        <select
          id="signup-company"
          name="company"
          value={companyId}
          onChange={(e) => setCompanyId(e.target.value)}
          disabled={companiesLoading}
          aria-invalid={errors.companyId ? true : undefined}
          aria-describedby={errors.companyId ? "signup-company-error" : undefined}
          className={`w-full rounded-lg border bg-white px-4 py-3 text-base transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-800 dark:focus:border-blue-400 dark:focus:ring-blue-400/20 ${
            companyId
              ? "text-slate-900 dark:text-slate-100"
              : "text-slate-500 dark:text-slate-400"
          } ${
            errors.companyId
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500"
              : "border-slate-200 dark:border-slate-600"
          }`}
        >
          <option value="">
            {companiesLoading ? "Loading companies…" : "Select a company"}
          </option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.companyId && (
          <span id="signup-company-error" className="text-sm text-red-500" role="alert">
            {errors.companyId}
          </span>
        )}
      </div>

      <AuthInput
        label="Email"
        type="email"
        name="email"
        id="signup-email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />

      <AuthPasswordInput
        label="Password"
        name="password"
        id="signup-password"
        placeholder="Create a password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />

      <AuthPasswordInput
        label="Confirm Password"
        name="confirmPassword"
        id="signup-confirm-password"
        placeholder="Re-enter your password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={errors.confirmPassword}
      />

      <AuthButton
        type="submit"
        disabled={loading || companiesLoading || selectedState === null}
        className="w-full"
      >
        {loading ? "Creating account…" : "Sign Up"}
      </AuthButton>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{" "}
        <Link
          to="/"
          className="text-primary no-underline hover:underline dark:text-blue-400"
        >
          Sign in
        </Link>
      </p>
    </form>
  );

  return (
    <AuthLayout>
      <AuthFormShell
        headerSlot={headerSlot}
        title="Create Account"
        description="Sign up to get started with your retirement plan."
        bodySlot={bodySlot}
      />
    </AuthLayout>
  );
};

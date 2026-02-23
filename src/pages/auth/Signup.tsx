import { useState, useEffect, type FormEvent } from "react";
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
import { supabase } from "../../lib/supabase";

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
  location: string,
  companyId: string,
  email: string,
  password: string,
  confirmPassword: string,
): FormErrors {
  const errors: FormErrors = {};
  if (!name.trim()) errors.name = "Name is required.";
  if (!location.trim()) errors.location = "Location is required.";
  if (!companyId) errors.companyId = "Please select a company.";
  if (!email.trim()) errors.email = "Email is required.";
  if (password.length < 6) errors.password = "Password must be at least 6 characters.";
  if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match.";
  return errors;
}

export const Signup = () => {
  const navigate = useNavigate();
  const { signUp, user: authUser, loading: authLoading } = useAuth();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
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

  useEffect(() => {
    if (authLoading) return;
    if (authUser) {
      navigate("/dashboard", { replace: true });
    }
  }, [authLoading, authUser, navigate]);

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setSuccessMessage(null);

    const fieldErrors = validate(name, location, companyId, email, password, confirmPassword);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setLoading(true);
    try {
      const { session: newSession } = await signUp(email, password, {
        name: name.trim(),
        company_id: companyId,
        location: location.trim(),
      });

      if (newSession) {
        navigate("/dashboard", { replace: true });
      } else {
        setSuccessMessage("Account created! Please sign in.");
        setTimeout(() => navigate("/", { replace: true }), 2000);
      }
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

      <AuthInput
        label="Location"
        type="text"
        name="location"
        id="signup-location"
        placeholder="City, State"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        error={errors.location}
      />

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

      <AuthButton type="submit" disabled={loading || companiesLoading} className="w-full">
        {loading ? "Creating account…" : "Sign Up"}
      </AuthButton>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{" "}
        <Link
          to="/"
          className="text-blue-600 no-underline hover:underline dark:text-blue-400"
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

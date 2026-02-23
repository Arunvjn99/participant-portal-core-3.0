import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  AuthLayout,
  AuthFormShell,
  AuthInput,
  AuthPasswordInput,
  AuthButton,
} from "../../components/auth";
import { Logo } from "../../components/brand/Logo";
import { useAuth } from "../../context/AuthContext";

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function validate(email: string, password: string, confirmPassword: string): FormErrors {
  const errors: FormErrors = {};
  if (!email.trim()) errors.email = "Email is required.";
  if (password.length < 6) errors.password = "Password must be at least 6 characters.";
  if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match.";
  return errors;
}

export const Signup = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setSuccessMessage(null);

    const fieldErrors = validate(email, password, confirmPassword);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setLoading(true);
    try {
      const { session: newSession } = await signUp(email, password);
      if (newSession) {
        setSuccessMessage("Account created! Taking you to the dashboard…");
        navigate("/dashboard", { replace: true });
      } else {
        setSuccessMessage(
          "Account created! Check your email to confirm, then sign in.",
        );
        setTimeout(() => navigate("/", { replace: true }), 3000);
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

      <AuthButton type="submit" disabled={loading} className="w-full">
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

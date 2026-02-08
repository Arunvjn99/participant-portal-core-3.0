import { useNavigate } from "react-router-dom";
import {
  AuthLayout,
  AuthFormShell,
  AuthInput,
  AuthPasswordInput,
  AuthButton,
} from "../../components/auth";
import { Logo } from "../../components/brand/Logo";

export const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/verify");
  };

  const handleForgotPassword = () => {
    navigate("/forgot");
  };

  const handleHelpCenter = () => {
    navigate("/help");
  };

  const headerSlot = (
    <Logo className="h-10 w-auto" />
  );

  const bodySlot = (
    <>
      <AuthInput
        label="Email"
        type="text"
        name="email"
        id="email"
        placeholder="Enter your Email or Username"
      />
      <div className="flex flex-col gap-2">
        <AuthPasswordInput
          label="Password"
          name="password"
          id="password"
          placeholder="Enter your password"
        />
        <div className="flex justify-end">
          <a
            href="#"
            className="text-sm text-blue-600 no-underline transition-colors hover:underline dark:text-blue-400"
            onClick={(e) => {
              e.preventDefault();
              handleForgotPassword();
            }}
          >
            Forgot password?
          </a>
        </div>
      </div>
      <AuthButton onClick={handleLogin} className="w-full">
        Login
      </AuthButton>
      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Still need help? Contact{" "}
        <a
          href="#"
          className="text-blue-600 no-underline hover:underline dark:text-blue-400"
          onClick={(e) => {
            e.preventDefault();
            handleHelpCenter();
          }}
        >
          Help Center
        </a>
      </p>
    </>
  );

  return (
    <AuthLayout>
      <AuthFormShell
        headerSlot={headerSlot}
        title="Login"
        bodySlot={bodySlot}
      />
    </AuthLayout>
  );
};

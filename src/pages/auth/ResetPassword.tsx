import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AuthLayout,
  AuthFormShell,
  AuthPasswordInput,
  AuthButton,
} from "../../components/auth";
import { Logo } from "../../components/brand/Logo";
import { PasswordStrength } from "../../components/ui/PasswordStrength";

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = () => {
    navigate("/");
  };

  const handleBackToSignIn = () => {
    navigate("/");
  };

  const headerSlot = (
    <Logo className="h-10 w-auto" />
  );

  const bodySlot = (
    <>
      <div className="flex flex-col gap-2">
        <AuthPasswordInput
          label="New password"
          name="newPassword"
          id="newPassword"
          placeholder="Enter your new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <PasswordStrength password={newPassword} />
      </div>
      <AuthPasswordInput
        label="Confirm password"
        name="confirmPassword"
        id="confirmPassword"
        placeholder="Confirm your new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <AuthButton onClick={handleResetPassword}>Reset password</AuthButton>
      <a
        href="#"
        className="text-center text-sm text-blue-600 no-underline hover:underline dark:text-blue-400"
        onClick={(e) => {
          e.preventDefault();
          handleBackToSignIn();
        }}
      >
        Back to sign in
      </a>
    </>
  );

  return (
    <AuthLayout>
      <AuthFormShell
        headerSlot={headerSlot}
        title="Reset your password"
        description="Your password must be at least 8 characters long and include a mix of letters, numbers, and special characters."
        bodySlot={bodySlot}
      />
    </AuthLayout>
  );
};

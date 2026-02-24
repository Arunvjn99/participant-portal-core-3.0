import { useRef, useEffect } from "react";
import type { KeyboardEvent, ChangeEvent } from "react";

interface AuthOTPInputProps {
  onComplete?: (value: string) => void;
  length?: number;
  className?: string;
}

export const AuthOTPInput = ({
  onComplete,
  length = 6,
  className = "",
}: AuthOTPInputProps) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const values = useRef<string[]>(Array(length).fill(""));

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, [length]);

  const handleInput = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value && !/^\d$/.test(value)) {
      e.target.value = values.current[index];
      return;
    }
    values.current[index] = value;
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    const otpValue = values.current.join("");
    if (otpValue.length === length && onComplete) {
      onComplete(otpValue);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);
    const digits = pastedData.match(/\d/g) || [];
    digits.forEach((digit, i) => {
      if (i < length) {
        values.current[i] = digit;
        if (inputRefs.current[i]) {
          inputRefs.current[i]!.value = digit;
        }
      }
    });
    const nextIndex = Math.min(digits.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
    const otpValue = values.current.join("");
    if (otpValue.length === length && onComplete) {
      onComplete(otpValue);
    }
  };

  return (
    <div
      className={`flex justify-center gap-3 ${className}`.trim()}
      role="group"
      aria-label={`${length}-digit verification code`}
    >
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className="h-12 w-12 shrink-0 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-0 text-center text-2xl font-semibold text-[var(--color-text)] transition-colors focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
          onChange={(e) => handleInput(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          aria-label={`Digit ${index + 1} of ${length}`}
        />
      ))}
    </div>
  );
};

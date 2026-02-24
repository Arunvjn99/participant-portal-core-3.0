export type PasswordStrengthLevel = "weak" | "fair" | "good" | "strong";

export function getPasswordStrength(password: string): { level: PasswordStrengthLevel; score: number } {
  if (!password) return { level: "weak", score: 0 };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  const level: PasswordStrengthLevel =
    score <= 1 ? "weak" : score <= 2 ? "fair" : score <= 3 ? "good" : "strong";
  return { level, score };
}

const LEVEL_CONFIG: Record<
  PasswordStrengthLevel,
  { label: string; color: string; bgColor: string; segments: number }
> = {
  weak: { label: "Weak", color: "text-[var(--color-danger)]", bgColor: "bg-[var(--color-danger)]", segments: 1 },
  fair: { label: "Fair", color: "text-[var(--color-warning)]", bgColor: "bg-[var(--color-warning)]", segments: 2 },
  good: { label: "Good", color: "text-[var(--color-warning)]", bgColor: "bg-[var(--color-warning)]", segments: 3 },
  strong: { label: "Strong", color: "text-[var(--color-success)]", bgColor: "bg-[var(--color-success)]", segments: 4 },
};

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

export function PasswordStrength({ password, className = "" }: PasswordStrengthProps) {
  const { level } = getPasswordStrength(password);
  const config = LEVEL_CONFIG[level];

  return (
    <div className={`flex flex-col gap-1.5 ${className}`} role="status" aria-live="polite">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-200 ${
              i < config.segments ? config.bgColor : "bg-[var(--color-border)]"
            }`}
          />
        ))}
      </div>
      <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
    </div>
  );
}

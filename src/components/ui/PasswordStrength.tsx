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
  weak: { label: "Weak", color: "text-red-600 dark:text-red-400", bgColor: "bg-red-500", segments: 1 },
  fair: { label: "Fair", color: "text-amber-600 dark:text-amber-400", bgColor: "bg-amber-500", segments: 2 },
  good: { label: "Good", color: "text-yellow-500 dark:text-yellow-400", bgColor: "bg-yellow-500", segments: 3 },
  strong: { label: "Strong", color: "text-emerald-600 dark:text-emerald-400", bgColor: "bg-emerald-500", segments: 4 },
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
              i < config.segments ? config.bgColor : "bg-slate-200 dark:bg-slate-600"
            }`}
          />
        ))}
      </div>
      <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
    </div>
  );
}

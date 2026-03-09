interface InvestmentHelpBannerProps {
  onChatNow?: () => void;
  onConnect?: () => void;
}

/**
 * Gradient banner: "Need investment help? Chat with AI experts instantly."
 * Buttons: Chat Now, Connect. Uses design tokens.
 */
export function InvestmentHelpBanner({ onChatNow, onConnect }: InvestmentHelpBannerProps) {
  return (
    <div
      className="rounded-[var(--radius-xl)] p-5 border-0"
      style={{
        background: "var(--banner-gradient)",
      }}
    >
      <p
        className="text-base font-semibold"
        style={{ color: "var(--color-text-inverse)" }}
      >
        Need investment help?
      </p>
      <p
        className="mt-1 text-sm opacity-90"
        style={{ color: "var(--color-text-inverse)" }}
      >
        Chat with AI experts instantly.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onChatNow}
          className="px-4 py-2 rounded-[var(--radius-lg)] font-medium text-sm transition-opacity hover:opacity-90"
          style={{
            background: "rgba(255,255,255,0.2)",
            color: "var(--color-text-inverse)",
            border: "1px solid rgba(255,255,255,0.3)",
          }}
        >
          Chat Now
        </button>
        <button
          type="button"
          onClick={onConnect}
          className="px-4 py-2 rounded-[var(--radius-lg)] font-medium text-sm transition-opacity hover:opacity-90"
          style={{
            background: "var(--color-text-inverse)",
            color: "var(--brand-primary)",
          }}
        >
          Connect
        </button>
      </div>
    </div>
  );
}

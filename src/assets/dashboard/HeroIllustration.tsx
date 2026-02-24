/**
 * Hero illustration from Figma: person relaxing in hammock with phone.
 * Blue/yellow palette, abstract clouds and birds.
 */
interface HeroIllustrationProps {
  className?: string;
}

export const HeroIllustration = ({ className = "" }: HeroIllustrationProps) => (
  <svg
    viewBox="0 0 400 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden
  >
    {/* Sky / background gradient */}
    <defs>
      <linearGradient id="hero-sky" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#e0f2fe" />
        <stop offset="100%" stopColor="#bae6fd" />
      </linearGradient>
      <linearGradient id="hero-hammock" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#2563eb" />
      </linearGradient>
      <linearGradient id="hero-blanket" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#hero-sky)" className="" />

    {/* Abstract clouds */}
    <ellipse cx="80" cy="50" rx="40" ry="25" fill="white" fillOpacity="0.9" />
    <ellipse cx="320" cy="70" rx="50" ry="20" fill="white" fillOpacity="0.8" />
    <ellipse cx="200" cy="40" rx="35" ry="18" fill="white" fillOpacity="0.7" />

    {/* Abstract birds */}
    <path
      d="M60 90 Q70 85 80 90"
      stroke="#94a3b8"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
      opacity="0.6"
    />
    <path
      d="M300 100 Q310 95 320 100"
      stroke="#94a3b8"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
      opacity="0.6"
    />

    {/* Hammock / lounger structure - curved blue shape */}
    <path
      d="M80 220 Q120 180 200 170 Q280 160 320 200 L340 240 L60 240 Z"
      fill="url(#hero-hammock)"
      className=""
    />

    {/* Yellow/amber blanket/cushion */}
    <ellipse cx="200" cy="200" rx="100" ry="30" fill="url(#hero-blanket)" opacity="0.9" />

    {/* Person silhouette - simplified */}
    <g transform="translate(170, 140)">
      {/* Head */}
      <circle cx="30" cy="10" r="18" fill="#1e293b" className="" />
      {/* Body */}
      <ellipse cx="30" cy="55" rx="35" ry="25" fill="#334155" className="" />
      {/* Arm holding phone */}
      <path
        d="M55 45 L75 35 L75 55 L55 65 Z"
        fill="#475569"
        className=""
      />
      {/* Phone */}
      <rect x="72" y="38" width="18" height="28" rx="2" fill="#1e293b" className="" />
      <rect x="74" y="42" width="14" height="20" rx="1" fill="#0f172a" className="" />
    </g>
  </svg>
);

/** Matches core-retirement-platform `config/motion` for consistent pre-enrollment animations. */
export const motionTokens = {
  fast: { duration: 0.15 },
  normal: { duration: 0.25 },
  slow: { duration: 0.35 },
  ease: [0.4, 0, 0.2, 1] as const,
};

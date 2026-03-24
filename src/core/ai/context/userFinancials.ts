/**
 * Mock participant financial snapshot — deterministic, replace with profile service later.
 */
export type UserFinancials = {
  totalBalance: number;
  vestedBalance: number;
  /** Plan / IRS-style cap used in assistant copy (here: 50% of vested, mock). */
  maxLoan: number;
};

export function getUserFinancials(): UserFinancials {
  const vestedBalance = 16_000;
  const totalBalance = 20_000;
  const maxLoan = Math.round(vestedBalance * 0.5);

  return {
    totalBalance,
    vestedBalance,
    maxLoan,
  };
}

/** Figma-aligned 30-year projection curve (7% growth, employer match up to 6%). */
export function generateContributionProjectionData(percent: number, salary: number) {
  const annual = salary * (percent / 100);
  const matchPercent = Math.min(percent, 6);
  const matchAnnual = salary * (matchPercent / 100);
  const data: {
    year: string;
    value: number;
    contributions: number;
    marketGain: number;
  }[] = [];
  let total = 0;
  let contributions = 0;
  for (let year = 0; year <= 30; year++) {
    const yearlyContribution = annual + matchAnnual;
    contributions += yearlyContribution;
    total = (total + yearlyContribution) * 1.07;
    data.push({
      year: `${year}yr`,
      value: Math.round(total),
      contributions: Math.round(contributions),
      marketGain: Math.round(total - contributions),
    });
  }
  return data;
}

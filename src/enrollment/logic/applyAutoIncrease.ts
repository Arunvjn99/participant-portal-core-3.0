/**
 * Calculate yearly contribution percentages with auto-increase applied
 * 
 * @param initialPercentage Starting contribution percentage (0-100)
 * @param increasePercentage Annual increase percentage (e.g., 1 = 1% increase per year)
 * @param maxPercentage Maximum contribution percentage cap (0-100)
 * @param years Number of years to project
 * @returns Array of contribution percentages for each year (index 0 = year 1)
 */
export const applyAutoIncrease = (
  initialPercentage: number,
  increasePercentage: number,
  maxPercentage: number,
  years: number
): number[] => {
  const percentages: number[] = [];
  for (let year = 0; year < years; year++) {
    const pct = Math.min(initialPercentage + year * increasePercentage, maxPercentage);
    percentages.push(pct);
  }

  return percentages;
};

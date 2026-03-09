/**
 * Full US states dataset for retirement location selector.
 */

export type CostIndex = "low" | "medium" | "high";
export type IncomeTax = "none" | "low" | "high";
export type Climate = "warm" | "cold" | "mixed";

export interface UsStateRow {
  name: string;
  abbreviation: string;
  costIndex: CostIndex;
  incomeTax: IncomeTax;
  climate: Climate;
  retirementPopularityScore: number;
}

export const US_STATES_DATA: UsStateRow[] = [
  { name: "Alabama", abbreviation: "AL", costIndex: "low", incomeTax: "low", climate: "warm", retirementPopularityScore: 6 },
  { name: "Alaska", abbreviation: "AK", costIndex: "high", incomeTax: "none", climate: "cold", retirementPopularityScore: 4 },
  { name: "Arizona", abbreviation: "AZ", costIndex: "medium", incomeTax: "low", climate: "warm", retirementPopularityScore: 9 },
  { name: "Arkansas", abbreviation: "AR", costIndex: "low", incomeTax: "low", climate: "mixed", retirementPopularityScore: 5 },
  { name: "California", abbreviation: "CA", costIndex: "high", incomeTax: "high", climate: "warm", retirementPopularityScore: 7 },
  { name: "Colorado", abbreviation: "CO", costIndex: "high", incomeTax: "low", climate: "mixed", retirementPopularityScore: 7 },
  { name: "Connecticut", abbreviation: "CT", costIndex: "high", incomeTax: "high", climate: "mixed", retirementPopularityScore: 4 },
  { name: "Delaware", abbreviation: "DE", costIndex: "medium", incomeTax: "low", climate: "mixed", retirementPopularityScore: 6 },
  { name: "District of Columbia", abbreviation: "DC", costIndex: "high", incomeTax: "high", climate: "mixed", retirementPopularityScore: 3 },
  { name: "Florida", abbreviation: "FL", costIndex: "medium", incomeTax: "none", climate: "warm", retirementPopularityScore: 10 },
  { name: "Georgia", abbreviation: "GA", costIndex: "low", incomeTax: "low", climate: "warm", retirementPopularityScore: 8 },
  { name: "Hawaii", abbreviation: "HI", costIndex: "high", incomeTax: "high", climate: "warm", retirementPopularityScore: 6 },
  { name: "Idaho", abbreviation: "ID", costIndex: "medium", incomeTax: "low", climate: "cold", retirementPopularityScore: 6 },
  { name: "Illinois", abbreviation: "IL", costIndex: "medium", incomeTax: "high", climate: "mixed", retirementPopularityScore: 4 },
  { name: "Indiana", abbreviation: "IN", costIndex: "low", incomeTax: "low", climate: "mixed", retirementPopularityScore: 5 },
  { name: "Iowa", abbreviation: "IA", costIndex: "low", incomeTax: "low", climate: "cold", retirementPopularityScore: 5 },
  { name: "Kansas", abbreviation: "KS", costIndex: "low", incomeTax: "low", climate: "mixed", retirementPopularityScore: 4 },
  { name: "Kentucky", abbreviation: "KY", costIndex: "low", incomeTax: "low", climate: "mixed", retirementPopularityScore: 5 },
  { name: "Louisiana", abbreviation: "LA", costIndex: "low", incomeTax: "low", climate: "warm", retirementPopularityScore: 5 },
  { name: "Maine", abbreviation: "ME", costIndex: "medium", incomeTax: "high", climate: "cold", retirementPopularityScore: 6 },
  { name: "Maryland", abbreviation: "MD", costIndex: "high", incomeTax: "high", climate: "mixed", retirementPopularityScore: 4 },
  { name: "Massachusetts", abbreviation: "MA", costIndex: "high", incomeTax: "high", climate: "mixed", retirementPopularityScore: 4 },
  { name: "Michigan", abbreviation: "MI", costIndex: "low", incomeTax: "low", climate: "cold", retirementPopularityScore: 5 },
  { name: "Minnesota", abbreviation: "MN", costIndex: "medium", incomeTax: "high", climate: "cold", retirementPopularityScore: 5 },
  { name: "Mississippi", abbreviation: "MS", costIndex: "low", incomeTax: "low", climate: "warm", retirementPopularityScore: 5 },
  { name: "Missouri", abbreviation: "MO", costIndex: "low", incomeTax: "low", climate: "mixed", retirementPopularityScore: 6 },
  { name: "Montana", abbreviation: "MT", costIndex: "medium", incomeTax: "low", climate: "cold", retirementPopularityScore: 6 },
  { name: "Nebraska", abbreviation: "NE", costIndex: "low", incomeTax: "low", climate: "mixed", retirementPopularityScore: 4 },
  { name: "Nevada", abbreviation: "NV", costIndex: "medium", incomeTax: "none", climate: "warm", retirementPopularityScore: 8 },
  { name: "New Hampshire", abbreviation: "NH", costIndex: "high", incomeTax: "none", climate: "cold", retirementPopularityScore: 7 },
  { name: "New Jersey", abbreviation: "NJ", costIndex: "high", incomeTax: "high", climate: "mixed", retirementPopularityScore: 3 },
  { name: "New Mexico", abbreviation: "NM", costIndex: "low", incomeTax: "low", climate: "warm", retirementPopularityScore: 7 },
  { name: "New York", abbreviation: "NY", costIndex: "high", incomeTax: "high", climate: "mixed", retirementPopularityScore: 4 },
  { name: "North Carolina", abbreviation: "NC", costIndex: "low", incomeTax: "low", climate: "mixed", retirementPopularityScore: 9 },
  { name: "North Dakota", abbreviation: "ND", costIndex: "low", incomeTax: "low", climate: "cold", retirementPopularityScore: 3 },
  { name: "Ohio", abbreviation: "OH", costIndex: "low", incomeTax: "low", climate: "mixed", retirementPopularityScore: 5 },
  { name: "Oklahoma", abbreviation: "OK", costIndex: "low", incomeTax: "low", climate: "mixed", retirementPopularityScore: 5 },
  { name: "Oregon", abbreviation: "OR", costIndex: "high", incomeTax: "high", climate: "mixed", retirementPopularityScore: 6 },
  { name: "Pennsylvania", abbreviation: "PA", costIndex: "medium", incomeTax: "low", climate: "mixed", retirementPopularityScore: 6 },
  { name: "Rhode Island", abbreviation: "RI", costIndex: "high", incomeTax: "high", climate: "mixed", retirementPopularityScore: 4 },
  { name: "South Carolina", abbreviation: "SC", costIndex: "low", incomeTax: "low", climate: "warm", retirementPopularityScore: 9 },
  { name: "South Dakota", abbreviation: "SD", costIndex: "low", incomeTax: "none", climate: "cold", retirementPopularityScore: 5 },
  { name: "Tennessee", abbreviation: "TN", costIndex: "low", incomeTax: "none", climate: "mixed", retirementPopularityScore: 8 },
  { name: "Texas", abbreviation: "TX", costIndex: "medium", incomeTax: "none", climate: "warm", retirementPopularityScore: 8 },
  { name: "Utah", abbreviation: "UT", costIndex: "medium", incomeTax: "low", climate: "mixed", retirementPopularityScore: 6 },
  { name: "Vermont", abbreviation: "VT", costIndex: "high", incomeTax: "high", climate: "cold", retirementPopularityScore: 5 },
  { name: "Virginia", abbreviation: "VA", costIndex: "medium", incomeTax: "low", climate: "mixed", retirementPopularityScore: 6 },
  { name: "Washington", abbreviation: "WA", costIndex: "high", incomeTax: "none", climate: "mixed", retirementPopularityScore: 7 },
  { name: "West Virginia", abbreviation: "WV", costIndex: "low", incomeTax: "low", climate: "mixed", retirementPopularityScore: 5 },
  { name: "Wisconsin", abbreviation: "WI", costIndex: "medium", incomeTax: "high", climate: "cold", retirementPopularityScore: 5 },
  { name: "Wyoming", abbreviation: "WY", costIndex: "low", incomeTax: "none", climate: "cold", retirementPopularityScore: 5 },
];

export const US_STATE_NAMES = US_STATES_DATA.map((s) => s.name);

export function findStateByName(name: string): UsStateRow | undefined {
  const normalized = name.trim();
  return US_STATES_DATA.find((s) => s.name.toLowerCase() === normalized.toLowerCase());
}

export function filterStatesBySearch(query: string): UsStateRow[] {
  const q = query.trim().toLowerCase();
  if (!q) return US_STATES_DATA;
  return US_STATES_DATA.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.abbreviation.toLowerCase().includes(q),
  );
}

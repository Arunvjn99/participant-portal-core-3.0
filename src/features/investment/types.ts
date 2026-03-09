/**
 * Fund model for portfolio allocation editor.
 * allocation is 0–100 (percentage).
 */
export type Fund = {
  id: string;
  name: string;
  ticker: string;
  category: string;
  allocation: number;
};

/** Portfolio state: funds per source. Each source's funds should sum to 100%. */
export type Portfolio = {
  pretax: Fund[];
  roth: Fund[];
  aftertax: Fund[];
};

/** Source key for which bucket we're editing */
export type PortfolioSource = "pretax" | "roth" | "aftertax";

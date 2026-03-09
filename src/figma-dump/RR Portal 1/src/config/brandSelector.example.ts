/**
 * QUICK START: Using Brand Presets
 * 
 * Uncomment one of the examples below to quickly switch brands.
 * For full customization, edit branding.ts directly.
 */

import { brandPresets } from './brandPresets';

// ===== EXAMPLE 1: Using a complete preset =====
// const selectedBrand = brandPresets.wealthBuilders;

// ===== EXAMPLE 2: Using a preset with overrides =====
// const selectedBrand = {
//   ...brandPresets.futureFocus,
//   colors: {
//     ...brandPresets.futureFocus.colors,
//     primary: "#8B5CF6", // Override just the primary color
//   }
// };

// ===== EXAMPLE 3: Custom brand from scratch =====
const selectedBrand = {
  brand: {
    name: "YourBrand",
    tagline: "Your Tagline Here",
    companyName: "Your Company Name",
  },
  colors: {
    primary: "#0043AA",
    primaryHover: "#003388",
    primaryLight: "#E6F0FF",
  },
};

export { selectedBrand };

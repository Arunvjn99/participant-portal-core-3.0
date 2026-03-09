/**
 * Brand Theme Presets
 * 
 * Pre-configured brand themes for quick testing and demos.
 * Import these in branding.ts to quickly switch between brands.
 */

export const brandPresets = {
  // Default: RetirePro (Blue)
  retirePro: {
    brand: {
      name: "RetirePro",
      tagline: "Your Future, Simplified",
      companyName: "RetirePro Financial Services",
    },
    colors: {
      primary: "#0043AA",
      primaryHover: "#003388",
      primaryLight: "#E6F0FF",
    },
  },

  // WealthBuilders (Green - Finance)
  wealthBuilders: {
    brand: {
      name: "WealthBuilders",
      tagline: "Build Your Legacy",
      companyName: "WealthBuilders Financial Group",
    },
    colors: {
      primary: "#047857",
      primaryHover: "#065F46",
      primaryLight: "#D1FAE5",
    },
  },

  // FutureFocus (Purple - Modern)
  futureFocus: {
    brand: {
      name: "FutureFocus",
      tagline: "Your Tomorrow Starts Today",
      companyName: "FutureFocus Retirement Solutions",
    },
    colors: {
      primary: "#7C3AED",
      primaryHover: "#6D28D9",
      primaryLight: "#EDE9FE",
    },
  },

  // SecureRetire (Teal - Trust)
  secureRetire: {
    brand: {
      name: "SecureRetire",
      tagline: "Confidence in Every Step",
      companyName: "SecureRetire Financial Partners",
    },
    colors: {
      primary: "#0891B2",
      primaryHover: "#0E7490",
      primaryLight: "#CFFAFE",
    },
  },

  // ProspectWealth (Orange - Energy)
  prospectWealth: {
    brand: {
      name: "ProspectWealth",
      tagline: "Ignite Your Financial Future",
      companyName: "ProspectWealth Advisors",
    },
    colors: {
      primary: "#EA580C",
      primaryHover: "#C2410C",
      primaryLight: "#FFEDD5",
    },
  },

  // TrustPath (Navy - Corporate)
  trustPath: {
    brand: {
      name: "TrustPath",
      tagline: "Navigate Your Financial Journey",
      companyName: "TrustPath Retirement Services",
    },
    colors: {
      primary: "#1E40AF",
      primaryHover: "#1E3A8A",
      primaryLight: "#DBEAFE",
    },
  },

  // HorizonPlan (Indigo - Professional)
  horizonPlan: {
    brand: {
      name: "HorizonPlan",
      tagline: "See Beyond Tomorrow",
      companyName: "HorizonPlan Financial Solutions",
    },
    colors: {
      primary: "#4F46E5",
      primaryHover: "#4338CA",
      primaryLight: "#E0E7FF",
    },
  },

  // VerdantRetirement (Forest Green - Stable)
  verdantRetirement: {
    brand: {
      name: "Verdant Retirement",
      tagline: "Grow Your Future Naturally",
      companyName: "Verdant Retirement Group",
    },
    colors: {
      primary: "#15803D",
      primaryHover: "#166534",
      primaryLight: "#DCFCE7",
    },
  },
};

/**
 * Usage in branding.ts:
 * 
 * import { brandPresets } from './brandPresets';
 * 
 * // Choose your preset:
 * const selectedPreset = brandPresets.wealthBuilders;
 * 
 * export const brandingConfig = {
 *   brand: selectedPreset.brand,
 *   colors: {
 *     ...selectedPreset.colors,
 *     // Add other color properties...
 *   },
 *   // ... rest of config
 * };
 */

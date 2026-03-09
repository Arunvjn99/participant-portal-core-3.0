/**
 * White Label Branding Configuration
 * 
 * Update this file to customize the application for different brands.
 * All colors, fonts, logos, and brand-specific text can be configured here.
 */

export const brandingConfig = {
  // Brand Identity
  brand: {
    name: "RetirePro",
    tagline: "Your Future, Simplified",
    companyName: "RetirePro Financial Services",
    logoUrl: "", // Add your logo URL here
    faviconUrl: "", // Add your favicon URL here
  },

  // Color Palette
  colors: {
    // Primary brand color (used for buttons, links, highlights)
    primary: "#0043AA",
    primaryHover: "#003388",
    primaryLight: "#E6F0FF",
    
    // Secondary colors
    secondary: "#6366F1",
    secondaryHover: "#4F46E5",
    
    // Accent colors
    accent1: "#10B981", // Success/Green
    accent2: "#F59E0B", // Warning/Amber
    accent3: "#EF4444", // Error/Red
    accent4: "#8B5CF6", // Purple
    
    // Gradient definitions
    gradients: {
      primary: "from-blue-600 to-purple-600",
      primaryBg: "from-blue-50 via-white to-purple-50",
      card: "from-slate-50 to-blue-50",
      shimmer: "from-transparent via-white/60 to-transparent",
    },
    
    // UI Colors
    ui: {
      background: "#FFFFFF",
      backgroundAlt: "#F9FAFB",
      border: "#E5E7EB",
      borderLight: "#F3F4F6",
      text: "#111827",
      textMuted: "#6B7280",
      textLight: "#9CA3AF",
    },
  },

  // Typography
  typography: {
    fontFamily: {
      primary: "Inter, system-ui, -apple-system, sans-serif",
      heading: "Inter, system-ui, -apple-system, sans-serif",
      mono: "ui-monospace, monospace",
    },
    fontSizes: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
    },
  },

  // Spacing & Layout
  layout: {
    borderRadius: {
      sm: "0.5rem",
      md: "0.75rem",
      lg: "1rem",
      xl: "1.5rem",
      "2xl": "2rem",
    },
    shadow: {
      sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
      lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
      xl: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
    },
  },

  // Feature Flags
  features: {
    showAIFeatures: true,
    showAdvisorConnect: true,
    showSocialProof: true, // "95% of employees choose this"
    enableAnimations: true,
    showBrandingWatermark: false,
  },

  // Content Customization
  content: {
    // App-wide
    appTitle: "Retirement Plan Enrollment",
    
    // Plan Selection Step
    planSelection: {
      title: "Choose Your Retirement Plan",
      subtitle: "Select the plan that best fits your financial goals and tax strategy.",
      compareButtonText: "View Detailed Comparison",
      compareTitle: "Need help deciding?",
      compareDescription: "Not sure which plan is right for you? Our AI-powered comparison tool can help you understand the differences and make an informed decision.",
    },
    
    // Contribution Step
    contribution: {
      title: "Set Your Contribution Amount",
      subtitle: "Decide how much to contribute to your retirement plan",
    },
    
    // Auto Increase Step
    autoIncrease: {
      title: "Set Up Automatic Increases",
      subtitle: "Grow your retirement savings automatically over time",
    },
    
    // Investment Step
    investment: {
      title: "Choose Your Investment Strategy",
      subtitle: "Select a portfolio that matches your risk tolerance and retirement timeline",
      defaultPortfolioTitle: "Plan Default Portfolio",
      defaultPortfolioDescription: "Your contributions are already set to a recommended allocation designed for tax efficiency.",
      socialProofBadge: "✨ Most Popular Choice",
      socialProofText: "95% of employees choose this option. Professionally managed, optimized for your timeline, and rebalanced automatically.",
      advisorTitle: "Need expert guidance?",
      advisorDescription: "Connect with a certified advisor to build a custom portfolio.",
      advisorButtonText: "Connect Advisor",
      selectButtonText: "Select Default Portfolio",
      editButtonText: "Edit Investments",
    },
    
    // Review Step
    review: {
      title: "Review Your Selections",
      subtitle: "Review and confirm your retirement plan enrollment",
      submitButtonText: "Submit Enrollment",
      acknowledgmentText: "I acknowledge that I have reviewed and agree to the terms of this retirement plan enrollment.",
    },
    
    // Dashboard
    dashboard: {
      welcomeMessage: "Welcome back",
      accountOverviewTitle: "Account Overview",
    },
  },

  // Investment Portfolio Styling
  portfolios: {
    aggressive: {
      color: "#dc2626",
      gradient: "from-red-500 to-orange-500",
      bgGradient: "from-red-50 to-orange-50",
    },
    growth: {
      color: "#ea580c",
      gradient: "from-orange-500 to-amber-500",
      bgGradient: "from-orange-50 to-amber-50",
    },
    moderate: {
      color: "#2563eb",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
    },
    conservative: {
      color: "#16a34a",
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50",
    },
    income: {
      color: "#7c3aed",
      gradient: "from-violet-500 to-purple-500",
      bgGradient: "from-violet-50 to-purple-50",
    },
  },

  // External Links
  links: {
    support: "https://support.example.com",
    privacy: "https://example.com/privacy",
    terms: "https://example.com/terms",
    contactUs: "https://example.com/contact",
  },
};

// Type exports for TypeScript support
export type BrandingConfig = typeof brandingConfig;
export type BrandColors = typeof brandingConfig.colors;
export type BrandContent = typeof brandingConfig.content;

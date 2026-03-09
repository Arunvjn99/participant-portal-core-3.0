# White Label Configuration Guide

This application is fully white-labelable, allowing you to customize branding, colors, fonts, and content for different clients.

## Quick Start

All white label configuration is centralized in `/src/config/branding.ts`. Update this single file to customize the entire application.

## Configuration Sections

### 1. Brand Identity

```typescript
brand: {
  name: "RetirePro",                      // Your brand name
  tagline: "Your Future, Simplified",      // Brand tagline
  companyName: "RetirePro Financial Services",
  logoUrl: "",                             // URL to your logo
  faviconUrl: "",                          // URL to favicon
}
```

### 2. Color Palette

#### Primary Colors
- `primary`: Main brand color (buttons, links, highlights)
- `primaryHover`: Hover state for primary elements
- `primaryLight`: Light variant for backgrounds

#### Example Color Schemes

**Tech Startup (Blue)**
```typescript
colors: {
  primary: "#0043AA",
  primaryHover: "#003388",
  primaryLight: "#E6F0FF",
}
```

**Finance (Green)**
```typescript
colors: {
  primary: "#047857",
  primaryHover: "#065F46",
  primaryLight: "#D1FAE5",
}
```

**Corporate (Purple)**
```typescript
colors: {
  primary: "#7C3AED",
  primaryHover: "#6D28D9",
  primaryLight: "#EDE9FE",
}
```

### 3. Typography

```typescript
typography: {
  fontFamily: {
    primary: "Inter, system-ui, -apple-system, sans-serif",
    heading: "Inter, system-ui, -apple-system, sans-serif",
    mono: "ui-monospace, monospace",
  },
}
```

**Custom Font Example:**
```typescript
fontFamily: {
  primary: "Poppins, sans-serif",
  heading: "Montserrat, sans-serif",
}
```

Don't forget to add font imports to `/src/styles/fonts.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&display=swap');
```

### 4. Feature Flags

Enable or disable features without code changes:

```typescript
features: {
  showAIFeatures: true,           // Show AI-powered features
  showAdvisorConnect: true,       // Show advisor connection option
  showSocialProof: true,          // Show "95% of employees" badges
  enableAnimations: true,         // Enable motion animations
  showBrandingWatermark: false,   // Show "Powered by" watermark
}
```

### 5. Content Customization

All user-facing text is configurable:

```typescript
content: {
  planSelection: {
    title: "Choose Your Retirement Plan",
    subtitle: "Select the plan that best fits...",
    compareButtonText: "View Detailed Comparison",
  },
  investment: {
    title: "Choose Your Investment Strategy",
    advisorTitle: "Need expert guidance?",
    advisorButtonText: "Connect Advisor",
    selectButtonText: "Select Default Portfolio",
  },
  // ... more sections
}
```

## Complete White Label Examples

### Example 1: "WealthBuilders" Brand

```typescript
export const brandingConfig = {
  brand: {
    name: "WealthBuilders",
    tagline: "Build Your Legacy",
    companyName: "WealthBuilders Financial Group",
  },
  colors: {
    primary: "#047857",      // Green
    primaryHover: "#065F46",
    primaryLight: "#D1FAE5",
  },
  typography: {
    fontFamily: {
      primary: "Roboto, sans-serif",
      heading: "Roboto, sans-serif",
    },
  },
  features: {
    showAIFeatures: false,
    showAdvisorConnect: true,
    showSocialProof: false,
  },
};
```

### Example 2: "FutureFocus" Brand

```typescript
export const brandingConfig = {
  brand: {
    name: "FutureFocus",
    tagline: "Your Tomorrow Starts Today",
    companyName: "FutureFocus Retirement Solutions",
  },
  colors: {
    primary: "#7C3AED",      // Purple
    primaryHover: "#6D28D9",
    primaryLight: "#EDE9FE",
  },
  typography: {
    fontFamily: {
      primary: "Open Sans, sans-serif",
      heading: "Poppins, sans-serif",
    },
  },
  features: {
    showAIFeatures: true,
    showAdvisorConnect: true,
    showSocialProof: true,
  },
};
```

## Advanced Customization

### Portfolio Colors

Customize investment portfolio color schemes:

```typescript
portfolios: {
  aggressive: {
    color: "#dc2626",
    gradient: "from-red-500 to-orange-500",
    bgGradient: "from-red-50 to-orange-50",
  },
  // ... other portfolios
}
```

### External Links

```typescript
links: {
  support: "https://support.yourcompany.com",
  privacy: "https://yourcompany.com/privacy",
  terms: "https://yourcompany.com/terms",
  contactUs: "https://yourcompany.com/contact",
}
```

## Using Branding in Components

Components automatically use the branding configuration via the `useBranding()` hook:

```typescript
import { useBranding } from '../../hooks/useBranding';

function MyComponent() {
  const branding = useBranding();
  
  return (
    <div>
      <h1>{branding.content.planSelection.title}</h1>
      <button style={{ backgroundColor: branding.colors.primary }}>
        Click Me
      </button>
    </div>
  );
}
```

## Deployment Workflow

### Single Client Deployment
1. Update `/src/config/branding.ts`
2. Build: `npm run build`
3. Deploy

### Multi-Client Deployment
1. Create separate branding configs:
   - `branding.client-a.ts`
   - `branding.client-b.ts`
2. Use environment variables to switch:
```typescript
const clientId = process.env.CLIENT_ID || 'default';
export const brandingConfig = 
  await import(`./branding.${clientId}.ts`);
```

## Testing Different Brands

Create a branch for each client:
- `main` - Default branding
- `client/acme-corp` - ACME Corporation branding
- `client/globex` - Globex branding

## Style Guidelines

### Color Contrast
Ensure your primary color has sufficient contrast with white text:
- Minimum contrast ratio: 4.5:1 for normal text
- Recommended: 7:1 for better accessibility

### Font Loading
Always provide fallback fonts:
```typescript
"Custom Font, system-ui, -apple-system, sans-serif"
```

### Responsive Design
All branding configurations work across:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## Troubleshooting

### Colors Not Updating
- Clear browser cache (Ctrl+Shift+R / Cmd+Shift+R)
- Check that you're using inline `style` props for dynamic colors
- Tailwind classes like `bg-[#0043AA]` should be replaced with inline styles

### Fonts Not Loading
- Verify font import in `/src/styles/fonts.css`
- Check browser console for font loading errors
- Ensure font URLs are accessible

### Content Not Changing
- Verify you're using `branding.content.*` references
- Check for hardcoded strings in components
- Search codebase for literal strings

## Support

For technical support with white labeling, contact:
- Email: dev-support@example.com
- Docs: https://docs.example.com/white-label

## Version History

- v1.0.0 - Initial white label implementation
- Full brand configuration system
- Dynamic color theming
- Content customization

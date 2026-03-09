# White Label Application - Complete Setup

## 🎨 What's Been Implemented

This retirement planning application is now **fully white-labelable**. Every aspect of branding can be customized without touching component code.

### Key Features
- ✅ Centralized branding configuration
- ✅ Dynamic color theming
- ✅ Customizable typography
- ✅ Content/text customization
- ✅ Feature flags
- ✅ 8 pre-built brand presets
- ✅ Development brand switcher
- ✅ Comprehensive documentation

## 📁 File Structure

```
src/
├── config/
│   ├── branding.ts              # Main configuration file
│   ├── brandPresets.ts          # 8 ready-to-use brand themes
│   └── brandSelector.example.ts # Quick start examples
├── hooks/
│   └── useBranding.ts          # React hook for accessing branding
├── app/
│   ├── App.tsx                 # Updated to use branding
│   └── components/
│       ├── InvestmentStep.tsx  # Updated to use branding
│       └── BrandSwitcher.tsx   # Dev tool for testing brands
└── ...
```

## 🚀 Quick Start (3 Steps)

### Step 1: Choose Your Colors
Open `/src/config/branding.ts` and update:

```typescript
colors: {
  primary: "#YOUR_PRIMARY_COLOR",        // Main brand color
  primaryHover: "#YOUR_HOVER_COLOR",     // Hover state
  primaryLight: "#YOUR_LIGHT_COLOR",     // Light backgrounds
}
```

### Step 2: Update Brand Identity
```typescript
brand: {
  name: "Your Brand Name",
  tagline: "Your Tagline",
  companyName: "Your Company Legal Name",
  logoUrl: "https://your-domain.com/logo.png",
}
```

### Step 3: Customize Content (Optional)
```typescript
content: {
  planSelection: {
    title: "Your Custom Title",
    subtitle: "Your custom subtitle...",
  },
  // ... more sections
}
```

## 🎨 Using Pre-Built Themes

We've included 8 professionally designed themes:

1. **RetirePro** (Blue) - Default, tech-focused
2. **WealthBuilders** (Green) - Financial, trustworthy
3. **FutureFocus** (Purple) - Modern, innovative
4. **SecureRetire** (Teal) - Trust-focused
5. **ProspectWealth** (Orange) - Energetic, bold
6. **TrustPath** (Navy) - Corporate, professional
7. **HorizonPlan** (Indigo) - Professional services
8. **VerdantRetirement** (Forest) - Stable, natural

### To use a preset:

```typescript
import { brandPresets } from './brandPresets';

export const brandingConfig = {
  brand: brandPresets.wealthBuilders.brand,
  colors: {
    ...brandPresets.wealthBuilders.colors,
    // ... add remaining color properties
  },
  // ... rest of config
};
```

## 🛠️ Development Tools

### Brand Switcher
A floating button (bottom-right corner) lets you preview different brand presets during development. Click the palette icon to see all options.

**To remove in production:**
Remove `<BrandSwitcher />` from `/src/app/App.tsx`

## 📋 Customization Checklist

- [ ] Update brand name and tagline
- [ ] Set primary brand color
- [ ] Add company logo URL
- [ ] Customize typography (optional)
- [ ] Review and update content text
- [ ] Set feature flags
- [ ] Update external links
- [ ] Test on all screen sizes
- [ ] Remove BrandSwitcher for production

## 🎯 Common Use Cases

### Use Case 1: Multi-Tenant SaaS
Serve different brands from the same codebase using environment variables:

```typescript
const clientId = process.env.VITE_CLIENT_ID || 'default';
const config = await import(`./branding.${clientId}.ts`);
```

### Use Case 2: White Label Partner
Create a partner-specific configuration:

```typescript
// branding.partner-xyz.ts
export const brandingConfig = {
  brand: {
    name: "Partner XYZ Retirement",
    // ... partner branding
  },
  features: {
    showBrandingWatermark: true, // Show "Powered by YourCompany"
  },
};
```

### Use Case 3: A/B Testing Brands
Test different brand identities:

```typescript
const variants = {
  a: brandPresets.retirePro,
  b: brandPresets.futureFocus,
};

const selectedVariant = getABTestVariant(); // Your A/B logic
export const brandingConfig = variants[selectedVariant];
```

## 🎨 Color Palette Guidelines

### Choosing Your Primary Color

**Good primary colors:**
- High contrast with white (#FFFFFF)
- Minimum 4.5:1 contrast ratio (WCAG AA)
- Distinctive and memorable

**Testing contrast:**
Use tools like WebAIM Contrast Checker to ensure your colors meet accessibility standards.

### Example Color Schemes by Industry

**Finance/Banking:** Blues, Greens
- `#0043AA`, `#047857`, `#0891B2`

**Healthcare:** Teals, Blues, Purples
- `#0891B2`, `#4F46E5`, `#7C3AED`

**Technology:** Blues, Purples, Indigos
- `#0043AA`, `#4F46E5`, `#7C3AED`

**Legal/Corporate:** Navy, Dark Blues, Grays
- `#1E40AF`, `#1E3A8A`, `#374151`

## 📱 Responsive Design

All branding works seamlessly across:
- **Mobile:** 320px - 767px
- **Tablet:** 768px - 1023px
- **Laptop:** 1024px - 1919px
- **Desktop:** 1920px+

## 🔧 Advanced Configuration

### Custom Fonts

1. Add font import to `/src/styles/fonts.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
```

2. Update branding config:
```typescript
typography: {
  fontFamily: {
    primary: "Poppins, system-ui, sans-serif",
    heading: "Poppins, system-ui, sans-serif",
  },
}
```

### Feature Flags

Control which features are visible:

```typescript
features: {
  showAIFeatures: true,        // AI recommendations
  showAdvisorConnect: true,    // Advisor connection button
  showSocialProof: true,       // "95% of employees..." badges
  enableAnimations: true,      // Motion animations
  showBrandingWatermark: false, // "Powered by" footer
}
```

## 📖 Documentation Files

- **WHITE_LABEL_GUIDE.md** - Complete customization guide
- **This file** - Quick reference and setup
- **branding.ts** - Inline documentation for all options

## 🐛 Troubleshooting

**Problem:** Colors not updating
- Clear browser cache (Ctrl+Shift+R)
- Check that inline styles are being used for dynamic colors

**Problem:** Fonts not loading
- Verify font import in `/src/styles/fonts.css`
- Check browser console for errors

**Problem:** Text not changing
- Ensure using `branding.content.*` references
- Search for hardcoded strings in components

## 📧 Support

For questions or issues:
- Review WHITE_LABEL_GUIDE.md
- Check component implementations
- Test with BrandSwitcher tool

## ✅ Production Checklist

Before deploying:
- [ ] Remove `<BrandSwitcher />` component
- [ ] Test all pages/steps
- [ ] Verify color contrast (accessibility)
- [ ] Check logo/images load correctly
- [ ] Test on mobile devices
- [ ] Verify all custom text is appropriate
- [ ] Review feature flags settings
- [ ] Test with real data

## 🎉 You're Ready!

Your application is now fully white-labelable. Update `/src/config/branding.ts` to create your branded experience.

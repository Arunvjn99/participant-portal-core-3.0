# PLANS PAGE LAYOUT CONTRACT (Source of Truth)
# DO NOT MODIFY ChoosePlan.tsx - This documents its layout behavior

## Layout Contract (from ChoosePlan.tsx inspection)

// PLANS PAGE LAYOUT CONTRACT
// - Centering: From .dashboard-layout__main in index.css (max-width: 1280px + margin: 0 auto)
// - Max width: 1280px (from .dashboard-layout__main)
// - Padding: .dashboard-layout__main provides padding (var(--spacing-4) → spacing-6 → spacing-8)
// - Grid ownership: page-level (.choose-plan__content defines 65fr 35fr at lg+)
// - Outermost page wrapper: .choose-plan (flex column)
// - Grid container: .choose-plan__content (grid 1fr mobile, 65fr 35fr desktop)
// - Sidebar: .choose-plan__right (sticky, flex column)

## Structure (Plans)
```
DashboardLayout
  └─ main.dashboard-layout__main  ← max-width 1280px, margin 0 auto, padding
      └─ div (flex flex-col gap-6)
          └─ .choose-plan
              └─ .choose-plan__content  ← GRID (65fr 35fr at lg)
                  ├─ .choose-plan__left (main)
                  └─ .choose-plan__right (sidebar, sticky)
```

## Rules to replicate
1. Page-level max-width + centering (mx-auto max-w-[1440px] per user spec)
2. Canonical grid: lg:grid-cols-[minmax(0,1fr)_360px] xl:_400px 2xl:_420px
3. Horizontal padding: px-6 lg:px-8
4. One grid per page, no flex for layout

COLOR PALETTE
Primary Colors
Primary Blue: #2563EB (buttons, active states, links)
Primary Blue Hover: #1D4ED8
Slate Dark: #1E293B (headings, primary text)
Slate Medium: #475569 (secondary text)
Slate Light: #64748B (labels, tertiary text)
Slate Lighter: #94A3B8 (muted text, placeholders)
Background Colors
White: #fff (card backgrounds)
Gray Ultra Light: #F8FAFC (header backgrounds, subtle fills)
Gray Light: #FAFBFC (input backgrounds, hover states)
Gray Soft: #F1F5F9 (borders, dividers)
Border Colors
Standard Border: #E2E8F0 (primary border color - used throughout)
Light Border: #E8ECF1 (subtle borders)
Soft Border: #F1F5F9 (very light borders)
Hover Border: #CBD5E1 (interactive element borders on hover)
Status & Semantic Colors
Success (Green)

Primary: #10B981
Dark: #059669, #16A34A, #166534
Light: #BBF7D0, #DCFCE7, #F0FDF4, #ECFDF5
Warning (Orange/Amber)

Primary: #F59E0B
Dark: #B45309, #92400E
Light: #FED7AA, #FFEDD5, #FFF7ED, #FFFBEB
Error (Red)

Primary: #DC2626, #EF4444
Dark: #991B1B, #B91C1C
Light: #FCA5A5, #FEE2E2, #FEF2F2, #FECACA
Info (Blue)

Primary: #2563EB, #3B82F6
Dark: #1E40AF
Light: #BFDBFE, #DBEAFE, #EFF6FF
Purple (AI Insights)

Primary: #8B5CF6
Light: #F5F3FF
Sky Blue

Primary: #0EA5E9
Light: #F0F9FF
📐 SPACING & LAYOUT
Container & Card Spacing
Max Container Width: 1200px
Container Padding: 32px 48px 100px
Card Padding (Large): 24px 28px
Card Padding (Medium): 20px 24px
Card Padding (Small): 14px 16px, 16px 20px 14px
Section Margin Bottom: 20px, 24px
Grid Layouts
3-Column Stats Grid: gridTemplateColumns: "1fr 1fr 1fr"
2-Column Main Layout: gridTemplateColumns: "1fr 380px" (65% / 35%)
Transaction Table: gridTemplateColumns: "120px 1fr 120px 80px"
Grid Gaps: 16px, 20px
Border Radius
Large Cards: 16px
Standard Cards: 14px
Medium Elements: 12px, 10px
Small Elements: 8px, 7px, 6px
Pills/Badges: 20px (circular)
✍️ TYPOGRAPHY
Font Family
Primary: Inter, system-ui (inherited from global styles)
Font Sizes
Hero Numbers: 36px, 32px, 28px
Large Headings: 26px, 20px
Section Headings: 16px, 15px
Body Text: 14px, 13px
Small Text: 12px, 11px
Micro Text: 10.5px, 10px, 9.5px, 9px
Font Weights
Extra Bold: 800 (hero numbers, primary headings)
Bold: 700 (section headings, important labels)
Semi-Bold: 600 (buttons, secondary text)
Medium: 500 (default body text)
Letter Spacing
Uppercase Labels: 0.5px, 0.08em, 0.06em
Headings: -0.3px, -0.5px (tight tracking for large text)
Text Transforms
Labels: textTransform: "uppercase" (with increased letter-spacing)
🔘 BUTTONS
Primary Button
background: #2563EB
color: #fff
padding: 10px 16px
border-radius: 10px
font-size: 13px
font-weight: 600
border: none

/* Hover */
background: #1D4ED8
Secondary Button (Outline)
background: #fff
border: 1.5px solid #E2E8F0
color: #475569
padding: 14px 16px
border-radius: 10px
font-size: 13px
font-weight: 600

/* Hover */
background: #2563EB
border-color: #2563EB
color: #fff
transform: translateY(-2px)
box-shadow: 0 4px 12px rgba(37,99,235,0.3)
Icon Buttons
width: 32px
height: 32px
border-radius: 8px
border: 1px solid #E8ECF1
background: #fff
font-size: 16px
color: #64748B
📊 CARDS & CONTAINERS
Standard Card
background: #fff
border-radius: 16px
padding: 24px 28px
border: 1px solid #F1F5F9
Card Header (Gradient Background)
background: linear-gradient(135deg, #F8FAFC, #F1F5F9)
padding: 16px 20px 14px
border-bottom: 1px solid #F1F5F9
Gradient Cards
Blue Info Card

background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)
border: 1px solid #BFDBFE
border-radius: 16px
padding: 20px 24px
Green Success Card

background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)
border: 1px solid #BBF7D0
Orange Warning Card

background: linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)
border: 1px solid #FED7AA
Yellow Pending Card

background: linear-gradient(135deg, #FFFBEB, #FFF7ED)
border: 1px solid #FED7AA
📝 FORMS & INPUTS
Text Input
width: 100%
padding: 9px 12px 9px 34px /* with icon */
border-radius: 9px
border: 1.5px solid #E8ECF1
font-size: 13px
color: #1E293B
background: #FAFBFC
outline: none
Select Dropdown
padding: 9px 36px 9px 14px
border-radius: 10px
border: 1.5px solid #E2E8F0
background: #fff
font-size: 13px
font-weight: 600
appearance: none

/* Hover */
border-color: #CBD5E1
background: #F8FAFC
🏷️ BADGES & LABELS
Status Badge
padding: 4px 10px
border-radius: 6px
font-size: 12px
font-weight: 700
background: #ECFDF5
color: #059669
text-transform: capitalize
Count Badge
padding: 3px 10px
border-radius: 6px
background: #EFF6FF
font-size: 11px
font-weight: 700
color: #2563EB
YTD Pill Badge
display: inline-flex
padding: 2px 8px
border-radius: 20px
background: #F0FDF4
border: 1px solid #BBF7D0
font-size: 11px
font-weight: 700
color: #16A34A
🎭 ANIMATIONS & TRANSITIONS
Standard Transitions
transition: all 0.2s
transition: background 0.2s
transition: transform 0.2s, box-shadow 0.2s
transition: width 0.4s ease
Fade-in Animation
opacity: mounted ? 1 : 0
transform: mounted ? "none" : "translateY(12px)"
transition: all 0.6s ease
Hover Effects
/* Button Lift */
transform: translateY(-2px)
box-shadow: 0 4px 12px rgba(37,99,235,0.3)

/* Card Lift */
transform: translateY(-2px)
box-shadow: 0 8px 24px rgba(37,99,235,0.18)
📈 DATA VISUALIZATION
Progress Bar
/* Container */
height: 8px (or 6px for compact)
border-radius: 4px (or 3px)
background: #E2E8F0
overflow: hidden
border: 1px solid #FED7AA (optional)

/* Fill */
background: linear-gradient(90deg, #10B981, #059669)
transition: width 0.4s ease
Icon Badges (Transaction Types)
width: 30px
height: 30px
border-radius: 8px
background: [semantic color bg]
color: [semantic color]
font-size: 13px
font-weight: 700
🔔 ALERTS & BANNERS
Warning Banner
background: linear-gradient(135deg, #FFFBEB, #FFF7ED)
border: 1px solid #FED7AA
border-radius: 14px
padding: 16px 22px
display: flex
align-items: center
gap: 14px
Action Required Banner
background: linear-gradient(135deg, #FEF2F2, #FEE2E2)
border: 1px solid #FCA5A5
border-radius: 10px
padding: 10px 14px
Success Banner
background: linear-gradient(135deg, #F0FDF4, #DCFCE7)
border: 1px solid #BBF7D0
border-radius: 8px
padding: 9px 10px

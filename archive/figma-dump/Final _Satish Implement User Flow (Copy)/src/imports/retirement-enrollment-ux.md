Refactor the current retirement enrollment flow and improve the UX while keeping the existing visual design system.

The experience should start with a **short personalization wizard before the plan selection page**. This wizard collects basic information so the system can personalize retirement projections and recommendations.

Design must remain **mobile-first and responsive**, scaling from mobile to desktop.

---

GOAL

Improve onboarding clarity and reduce decision complexity.

Apply UX principles:
• Hick’s Law – reduce decision overload
• Progressive Disclosure – reveal complexity step by step
• Fitts’s Law – large tap targets for mobile
• Goal Gradient Effect – show clear progress
• Aesthetic Usability – clean fintech UI

---

NEW FLOW STRUCTURE

Dashboard

↓ Personalization Wizard

1 Retirement Age
2 Retirement Location
3 Current Savings
4 Investment Comfort

↓ Enrollment Flow

5 Plan Selection
6 Contribution
7 Auto Increase
8 Investment Allocation
9 Retirement Readiness
10 Review
11 Success

---

PERSONALIZATION WIZARD

Display wizard as a centered modal card.

Show a step progress indicator at top.

Example:

Step 1 of 4
Age → Location → Savings → Investment Comfort

Use conversational microcopy.

---

STEP 1 — RETIREMENT AGE

Title
When would you like to retire?

Show current age automatically.

Slider input:
Retirement age (50–75)

Display timeline preview:
Now → Retirement year

Show suggestion chip:
Most people retire at 65

Quick select buttons:
60
65
67

---

STEP 2 — RETIREMENT LOCATION

Title
Where do you imagine retiring?

Subtitle
Location helps estimate cost of living.

Primary input
Search field for city or state.

Below show selectable cards:

Popular retirement locations.

Example cards:
Florida
Arizona
North Carolina
South Carolina

Add option
Not sure yet.

---

STEP 3 — CURRENT SAVINGS

Title
What are your current personal savings?

Subtitle
Include personal savings or investments outside your employer plan.

Currency input field.

Add quick option chips:

$0
$5K
$10K
$50K+

Show encouraging insight message below input.

Example:
Every dollar saved today grows through compound interest.

---

STEP 4 — INVESTMENT COMFORT

Title
How comfortable are you with investment risk?

Display four selectable cards:

Conservative
Low risk, stable growth.

Balanced
Moderate growth and moderate risk.

Growth
Higher growth potential with market fluctuations.

Aggressive
Highest growth potential with higher volatility.

Highlight Balanced as the most common choice.

---

PLAN SELECTION PAGE (FIX UX)

After wizard completion, show the plan selection screen.

Title
Choose Your Retirement Plan

Subtitle
Your employer plan options.

Handle two cases dynamically.

CASE 1 — COMPANY OFFERS TWO PLANS

Display two cards:

Traditional 401(k)
Roth 401(k)

Each card includes:

Short description
Three key benefits
Primary CTA button

Example benefits:

Traditional
• Lower taxable income today
• Employer match eligible
• Tax-deferred growth

Roth
• Tax-free withdrawals in retirement
• Flexible retirement income
• No required minimum distributions

Below cards show:

Need help deciding?

Buttons:
Ask AI
Compare Plans

Add helper text:
You can change this later.

---

CASE 2 — COMPANY OFFERS ONE PLAN ONLY

Skip comparison layout.

Instead show confirmation card.

Example:

Your employer offers a Traditional 401(k).

Description:
This plan allows tax-deferred retirement savings.

Primary button:
Continue to Contributions

---

PLAN PAGE UI IMPROVEMENTS

• Entire card should be selectable, not just the button
• Recommended labels only if backed by logic
• Use subtle card elevation for emphasis
• Keep information scannable with short bullet points

---

VISUAL STYLE

Maintain the existing design system.

Modern fintech style:
Soft cards
Rounded corners
Clean typography
Light shadows

Use strong spacing hierarchy.

Ensure components are responsive for:

Mobile
Tablet
Desktop

---

AI GUIDELINES

AI should only appear in two places:

Plan explanation
Contribution recommendation

Avoid placing AI buttons everywhere.

---

FINAL RESULT

A smooth onboarding experience that:

• Personalizes projections before enrollment
• Simplifies the retirement decision process
• Works for both single-plan and multi-plan employers
• Feels modern, calm, and trustworthy

You are a senior fintech product designer and UX architect.

Design a **mobile-first retirement plan enrollment experience** for a **401(k) Participant Portal** used by employees during onboarding.

The goal is to create a **clear, simple, and trustworthy enrollment flow** that guides users step-by-step through retirement setup with minimal cognitive load.

The design must be **mobile-first** and then scale responsively to **tablet and desktop**.

---

CORE DESIGN PRINCIPLES

Apply these UX laws and principles throughout the flow:

Hick’s Law
Limit choices and highlight recommended options.

Progressive Disclosure
Show advanced financial options only when needed.

Fitts’s Law
Primary actions must be large and easy to tap on mobile.

Miller’s Law
Avoid showing too many elements at once.

Goal Gradient Effect
Show progress clearly to motivate completion.

Aesthetic Usability Effect
Use clean fintech visuals that feel simple and trustworthy.

Peak-End Rule
End the flow with a strong success experience.

---

RESPONSIVE DESIGN REQUIREMENTS

Design mobile-first.

Breakpoints:

Mobile
375–430px width

Tablet
768px width

Desktop
1280px width

Layout behavior:

Mobile
Single column layout
Stacked cards
Bottom sticky CTA

Tablet
Two-column layout when needed
Cards arranged in responsive grid

Desktop
Left: Inputs
Right: projections / explanations

All components must adapt smoothly between breakpoints.

---

GLOBAL LAYOUT

Top Navigation (mobile)

Left:
Logo

Right:
Profile avatar
Notifications

Secondary Navigation Tabs:
Dashboard
Retirement Plan
Transactions
Investments
Profile

Below navigation show a **progress stepper**.

Stepper (horizontal):

Plan
Contribution
Auto Increase
Investment
Readiness
Review

Show progress like:
Step 2 of 6

---

ENROLLMENT FLOW SCREENS

1. Plan Selection
2. Contribution Setup
3. Auto Increase
4. Investment Strategy
5. Retirement Readiness
6. Review
7. Success

---

SCREEN 1 — PLAN SELECTION

Mobile Layout:
Stacked selectable cards.

Title
Choose Your Retirement Plan

Subtitle
Most employees choose the recommended option.

Card 1 (Highlighted)
Recommended

Traditional 401(k)

Short description:
Lower taxes today and grow savings tax-deferred.

Benefits
• Lower taxable income
• Employer match eligible
• Most common choice

CTA
Select Plan

Card 2

Roth 401(k)

Short description:
Pay taxes now and withdraw tax-free in retirement.

Benefits
• Tax-free withdrawals
• Flexible retirement income
• No required minimum distributions

CTA
Select Plan

Footer section:

Need help deciding?

Buttons:
Ask AI
Compare Plans

AI should explain the difference in simple language.

---

SCREEN 2 — CONTRIBUTION

Title
How much would you like to contribute?

Subtitle
Your employer matches up to 6%.

AI Insight Banner

Example:
Contributing at least 6% ensures you receive the full employer match.

Mobile Layout

Contribution Card

Monthly paycheck display

Contribution slider
Large mobile-friendly slider

Quick options buttons

4%
6% Match
10%
15%

Dynamic summary text

Example:
You are saving $720 per month.

Expandable section

Tax Strategy

Default:
Pre-tax contributions

Advanced toggle

Split contributions between
Pre-tax
Roth
After-tax

Projection Card

Projected retirement savings value

Line chart showing growth

Breakdown

You
Employer
Investment growth

---

SCREEN 3 — AUTO INCREASE

Title
Increase your savings automatically

Subtitle
Small increases today can grow your retirement savings over time.

Two option cards

Card 1

Keep Contributions Fixed

Example projection
$124,621

Button
Skip Auto Increase

Card 2 (Highlighted)

Enable Auto Increase

Example projection
$185,943

Label
Recommended

Button
Enable Auto Increase

Below cards show

Savings impact

Example
Automatic increases could add +$61,322 over 10 years.

---

SCREEN 4 — INVESTMENT STRATEGY

Title
Choose Your Investment Strategy

Step 1

Risk comfort selector

Options displayed as large selectable chips

Conservative
Balanced
Growth
Aggressive

Step 2

Recommended Portfolio

Donut allocation chart

Example allocation

S&P 500 Index 35%
Small Cap 25%
International 25%
Mid Cap 15%

Primary button

Use Recommended Portfolio

Secondary button

Customize Investments

Customization opens fund allocation editor.

---

SCREEN 5 — RETIREMENT READINESS

Title
Your Retirement Readiness

Large circular score indicator.

Instead of negative messaging show encouragement.

Example

You are getting started.

Projection summary cards

Projected retirement value
Annual contributions
Employer contributions

Insight card

Example

Increasing your contribution by 2% could improve your readiness score.

---

SCREEN 6 — REVIEW

Title
Review Your Retirement Plan

Stacked summary cards

Selected Plan
Contribution Rate
Auto Increase
Investment Strategy
Projected Retirement Value

Each section has an Edit action.

Final confirmation checkbox

I agree to the retirement plan terms.

Primary CTA

Confirm Enrollment

Sticky bottom button on mobile.

---

SCREEN 7 — SUCCESS

Centered success modal.

Large success icon.

Headline

Congratulations!

Text

Your retirement plan has been successfully activated.

Information card

What happens next

• Contributions start next pay period
• Confirmation email will be sent
• Track savings from dashboard

Primary button

Go to Dashboard

---

AI GUIDELINES

AI should appear only in these areas

Plan explanation
Contribution recommendation
Investment explanation
Readiness improvement

Avoid AI controls on every screen.

---

VISUAL STYLE

Modern fintech UI.

Soft cards
Rounded corners
Light shadows

Color palette

Primary Blue
Success Green
Warning Orange
AI Purple Accent

Typography

Clear hierarchy
Readable on mobile

Spacing

Generous padding
Clear grouping

Charts

Simple projections
Readable financial visuals

The interface should feel

Calm
Trustworthy
Easy to understand

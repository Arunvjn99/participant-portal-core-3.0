Refactor the Investment Strategy screen to use a contribution-source-first structure instead of a portfolio-first structure.

The current design shows a single portfolio allocation first, and only later allows users to customize funds. This creates confusion because users cannot clearly see how their different contribution sources (Roth, Pre-tax, After-tax) are invested.

The goal is to make the investment structure clearer by presenting contribution sources first, then allowing users to configure the investment portfolio for each source.

---

PAGE STRUCTURE

Replace the current portfolio-first layout with the following structure:

1. Investor Profile
2. Contribution Sources
3. Portfolio configuration per source
4. Continue CTA

---

INVESTOR PROFILE SECTION

Keep the existing risk profile card at the top.

Example:

Balanced Investor
A mix of growth and stability designed for long-term retirement investing.

Include a "Change Risk Profile" action.

---

CONTRIBUTION SOURCES SECTION

Add a new section titled:

Your Contribution Sources

Display each contribution source as a card showing:

Source name (Roth, Pre-tax, After-tax)
Monthly contribution amount
Number of funds used
Brief allocation summary

Example:

Roth Contributions
$425 per month
2 funds

Pre-Tax Contributions
$425 per month
4 funds

After-Tax Contributions
Not currently used

Each card should have an Edit Portfolio button.

---

SOURCE PORTFOLIO EDITING

When a user clicks Edit Portfolio on a source card, open the existing portfolio customization modal.

The modal should show funds specific to that contribution source and allow:

Adjusting allocation percentages
Adding new funds
Removing funds
Ensuring the total allocation equals 100%

---

VISUAL CLARITY

Make it visually clear that each source may have a different investment allocation.

Display small allocation previews on the source cards using either:

Mini pie charts
Or a simple asset class summary.

---

REMOVE PORTFOLIO-FIRST HERO CARD

The large "Recommended Portfolio" hero card should no longer dominate the page.

Instead, the recommended allocation should appear as the default configuration within each source.

---

PRIMARY ACTION

The final action remains:

Continue

This proceeds to the Readiness step.

---

UX GOAL

Users should immediately understand:

Which contribution sources they have
How each source is invested
How to edit the portfolio for each source independently

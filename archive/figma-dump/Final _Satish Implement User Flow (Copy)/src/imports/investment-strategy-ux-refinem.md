Refine the Investment Strategy screen and Custom Portfolio editor to improve clarity, usability, and advanced investor controls while preserving the existing layout and architecture.

The current system correctly supports recommended portfolios and source-wise customization, but several UX improvements are needed.

Do not redesign the screen structure. Only improve clarity, interaction behavior, and advanced portfolio editing.

---

INVESTMENT STRATEGY PAGE IMPROVEMENTS

1. Improve the recommended portfolio label.

Change the badge text from:

"Recommended for you"

To:

"Recommended for Balanced Investors"

This reinforces the connection between the user's risk profile and the portfolio recommendation.

---

2. Add portfolio outcome context.

Below the allocation chart add a small informational line explaining the long-term expectation of the portfolio.

Example text:

Expected long-term annual growth: ~6–7%
Based on historical market performance. Actual returns may vary.

This helps users understand why the allocation matters.

---

3. Improve the Customize Portfolio section.

Rename the section to:

Customize Portfolio (Advanced)

Add supporting text:

Select funds and control allocations across your contribution sources.

This makes the feature discoverable for advanced investors.

---

CUSTOM PORTFOLIO MODAL IMPROVEMENTS

1. Improve the portfolio sharing toggle description.

Current label:

"Use same portfolio for all contribution sources"

Update to:

"Apply the same portfolio to Roth, Pre-tax, and After-tax accounts"

Add helper text below:

Disable this option if you want different portfolios for each contribution source.

---

2. Improve source tabs with contribution context.

Update source tabs to display contribution percentages from the earlier step.

Example:

Roth (40%)
Pre-tax (60%)
After-tax (0%)

This helps users understand how their contributions relate to their investments.

---

3. Add asset class allocation summary.

Above the fund lists display a small asset class summary.

Example:

Equity: 60%
Fixed Income: 25%
International: 10%
Real Estate: 5%

This helps users quickly understand diversification.

---

4. Improve allocation editing controls.

In addition to sliders, add small plus and minus buttons beside the percentage input for fine adjustments.

Example:

[-] 20% [+]

This improves precision when adjusting allocations.

---

5. Add portfolio risk feedback.

Display a dynamic indicator showing the portfolio risk level based on equity vs fixed income allocation.

Example:

Portfolio Risk Level: Balanced

Update this label automatically as allocations change.

---

6. Add fund management controls.

Each fund row should support:

Remove fund icon
Editable percentage input
Slider control

Below each asset class group include:

* Add Fund

Clicking this opens a fund picker with plan-approved funds.

---

7. Add portfolio copying option between sources.

When multiple contribution sources are enabled, allow users to copy allocations between them.

Example action:

Copy Roth Portfolio → Pre-tax

This helps users avoid rebuilding portfolios multiple times.

---

8. Improve allocation validation feedback.

Display validation states clearly.

Examples:

Allocation balanced — 100% ✓

Allocation incomplete — 85% ⚠

Disable the Save button until allocation equals exactly 100%.

---

9. Improve save action clarity.

Primary button:

Save Custom Portfolio

After saving, the investment page should display a banner:

Custom Portfolio Active

Provide a link:

Reset to Recommended Portfolio

---

UX GOAL

The investment step should:

Provide a simple recommended path for most users
Support advanced investors with full fund-level control
Clearly connect portfolios to risk profiles
Maintain transparency into the underlying funds

Refactor the Retirement Readiness screen to use a two-column layout that improves visibility of improvement actions.

The current design stacks the readiness score and improvement suggestions vertically, which requires users to scroll before discovering how they can improve their score.

The goal is to present the readiness score and improvement suggestions side by side to strengthen the cause-and-effect relationship between current readiness and potential improvements.

---

LAYOUT STRUCTURE

Convert the page into a two-column layout.

Left column (primary information):

Readiness score visualization
Score explanation text
Projected retirement balance

Right column (action panel):

Ways to improve your readiness
Improvement suggestion cards

---

LEFT COLUMN CONTENT

Keep the readiness score card as the main visual element.

Include:

Readiness score (out of 100)
Short explanation of readiness level
Projected retirement balance
Supporting text explaining the projection timeline.

This column should remain visually dominant.

---

RIGHT COLUMN CONTENT

Move the "Ways to improve your readiness" section into the right column.

Display up to three improvement suggestion cards such as:

Increase contribution by 2%
Enable automatic contribution increases
Adjust investment strategy for higher growth

Each card should display:

Potential score increase
Additional annual retirement savings
Updated projected retirement balance

---

IMPROVEMENT INTERACTION

When a user clicks a suggestion card:

Open a preview modal showing:

Current value
New value
Readiness score change
Additional savings
Projected balance change

Include two buttons:

Cancel
Apply Change

---

LIVE FEEDBACK

After applying a change:

Update the readiness score dynamically
Animate the score update
Display a small confirmation message.

---

RESPONSIVE BEHAVIOR

On smaller screens, collapse the layout into a single column:

Readiness score
Ways to improve
Continue button

---

UX GOAL

Users should immediately see both their current readiness and the available improvement actions without scrolling, encouraging them to experiment with changes before finalizing their retirement plan.

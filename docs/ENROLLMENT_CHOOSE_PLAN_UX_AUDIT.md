# Choose Plan Page — UX & Structure Audit

## Findings (pre-fix)

- **Top spacing:** EnrollmentPageContent uses `py-8 md:py-10` and header `mb-8`; content pushed down, causes scroll.
- **Heading/subtext:** "Select your retirement plan" / "Choose an option to see how it affects your future savings." — institutional tone.
- **AI gamification:** PlanRail shows "98% Fit" (fitLabel), "AI Recommended Strategy", Trophy icon; PlanDetailsPanel shows Match Score block with confidence % and progress bar; metrics use score-driven labels.
- **Fixed footer:** EnrollmentFooter (Back, Save & Exit, Continue to Contributions) is sticky on ChoosePlan; breaks flow.
- **CTA:** Small "Select" button in card; primary CTA in footer. Selection state: scale and border only for recommended+selected.
- **No in-card AI:** No "Ask AI about this plan" in plan cards.
- **Layout:** Dense; could feel more premium/calm (Betterment-style).

## Implementation plan

1. Reduce top padding to pt-6/pt-8; reduce header margin; tighten gaps so heading + first plan card fit above fold.
2. Replace heading/subtitle with conversational copy (enrollment.choosePlanHeading / choosePlanSubtitle).
3. Remove fit badge, AI Recommended label, Match Score block, score-driven metrics.
4. Remove EnrollmentFooter from ChoosePlan; CTA moves into selected plan card.
5. Plan card: "Select Plan" when unselected; "Continue with [Plan Name]" primary button when selected; full width, below benefits.
6. Selection state: 2px brand border, tint, shadow-lg, check icon top-right, scale-[1.01] for any selected card.
7. Add "Ask AI" button in plan card header; open Core AI with plan-specific initial prompt (context + CoreAssistantModal).
8. Modernize cards: more padding, softer borders, minimal benefit tags; typography 24–28px heading.
9. Responsive and structure validation after changes.

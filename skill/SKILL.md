---
name: exelo-agent-builder
description: Implement or extend an Exelo-style AI receptionist operating system landing page from this repository. Use for rebuilding the page, adding its workflow, calculator, pricing, FAQ, responsive UI, or turning the static demo into a real product.
---

# Exelo Agent Builder

## Goal
Produce a maintainable, responsive web implementation of the product described in this repository. Prefer the existing stack. If no stack exists, use React + TypeScript + Vite or the host project's standard web template.

## Required reading
Read `AGENTS.md`, then read `spec/PRODUCT_SPEC.md`, `spec/UI_SPEC.md`, and `spec/ACCEPTANCE.md`. Load `data/product.json` before changing workflow or calculator behavior.

## Implementation order
1. Inspect the current project and preserve its routing/build conventions.
2. Establish design tokens: cream background, dark product panels, gold accent, muted ink, hairline borders, rounded cards.
3. Build the shared shell: sticky header, anchor navigation, responsive footer, section containers, buttons, eyebrow labels, headings.
4. Implement the hero as a phone call state plus stacked call outcomes. Do not use a generic stock image.
5. Implement the portal dashboard as a structured mockup with metrics and activity.
6. Implement workflow data as a single array. Render the six-step navigator and a preview selected by active step.
7. Implement the calculator from derived state. Use `usageCost = minutes * 0.30`, `margin = price - usageCost`.
8. Implement pricing state for plan tabs and monthly/annual billing.
9. Implement the FAQ using native disclosure semantics unless a stronger requirement exists.
10. Add responsive rules and reduced-motion support.
11. Run the validation and build commands in `AGENTS.md`.

## Guardrails
- Keep core anchors stable: `top`, `how`, `calculator`, `pricing`, `faq`, `close`.
- Keep all primary controls keyboard operable.
- Do not hard-code calculator outputs.
- Do not duplicate the six workflow screen layouts; use one renderer with data.
- Do not claim real telephony, AI calls, billing, or business-data scanning unless a backend is implemented and configured.
- Treat the observed public page as a UX reference. Do not copy private source code, credentials, or proprietary assets.

## Delivery checklist
Verify each item in `spec/ACCEPTANCE.md`. Report changed files, commands run, and any intentionally mocked backend behavior.

# AGENTS.md

## Mission
Build and maintain the Exelo-style AI receptionist operating system landing experience in this repository. Keep the page functional, responsive, accessible, and data-driven.

## Start here
1. Read `README.md`.
2. Read `spec/PRODUCT_SPEC.md`, `spec/UI_SPEC.md`, and `spec/ACCEPTANCE.md`.
3. Inspect `src/main.jsx` and `src/styles.css` before changing architecture.
4. Run `npm install`, `npm run validate`, and `npm run build`.

## Implementation rules
- Use React and keep all UI state local unless a backend is explicitly requested.
- Keep product copy, workflow data, plans, and FAQ content outside presentation components where practical.
- Preserve the existing section IDs: `top`, `how`, `calculator`, `pricing`, `faq`, and `close`.
- Preserve keyboard access for buttons, range inputs, navigation, and FAQ disclosure elements.
- Use native `<details>`/`<summary>` for FAQ behavior unless a product requirement needs a custom accordion.
- Keep the workflow preview driven by the active step; do not duplicate six independent page layouts.
- Keep pricing and calculator values derived from state rather than hard-coded output text.
- Treat the current design as a visual reference, not as permission to copy private source code or proprietary production assets.

## Definition of done
- `npm run validate` passes.
- `npm run build` passes.
- Header anchors work.
- Mobile navigation opens and closes.
- Workflow steps change the preview.
- Both calculator sliders update outputs.
- Plan and billing controls update pricing.
- FAQ items open and close.
- Layout works at desktop and mobile widths.
- No console errors are introduced.

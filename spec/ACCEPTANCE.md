# Acceptance criteria

## Navigation
- [ ] Clicking How it works, Pricing, FAQ, Profit calculator, and the closing CTA moves to the correct section.
- [ ] Mobile menu opens, exposes the same links, and closes after a link is selected.

## Hero and demos
- [ ] Hero shows the product promise, two CTAs, phone mockup, and four call outcome cards.
- [ ] Portal demo shows metrics, recent activity, booking request, summary, and urgent alert context.

## Workflow
- [ ] Six workflow steps are visible.
- [ ] Selecting a step changes the right-side preview without a page reload.
- [ ] The selected step is visually distinct.

## Calculator
- [ ] Monthly price accepts values from 150 through 800 in increments of 10.
- [ ] Monthly minutes accepts values from 250 through 1500 in increments of 25.
- [ ] Price, usage cost, estimated margin, and margin percentage update immediately.
- [ ] Usage cost is calculated at 0.30 per minute.

## Pricing and FAQ
- [ ] Starter, Growth, and Empire controls change the active pricing card.
- [ ] Monthly and annual controls change billing display.
- [ ] FAQ rows open and close and remain keyboard accessible.

## Quality
- [ ] `npm run validate` passes.
- [ ] `npm run build` passes.
- [ ] No horizontal overflow is introduced at 375px viewport width.
- [ ] No unhandled console errors appear during normal interaction.

# UI specification

## Visual language
- Warm cream editorial background for explanatory sections.
- Near-black interface panels for product mockups.
- Gold accent for primary actions and key outcomes.
- Inter-like sans for UI and body text; serif or italic display treatment for emphasized phrases; monospace for labels and statuses.
- Use rounded cards, thin hairline borders, compact uppercase eyebrows, and generous vertical whitespace.

## Responsive behavior
- Desktop: two-column hero, portal demo, workflow, and calculator.
- Tablet: collapse major compositions to one column where necessary.
- Mobile: hamburger menu, stacked mockups, one-column cards, two-column metric grid, and horizontally readable comparison table.
- Do not hide core functionality on mobile.

## Motion
Use short, subtle transitions for buttons, active workflow states, menu open/close, and expandable content. Avoid distracting autoplay animation and respect `prefers-reduced-motion`.

## Accessibility
- All controls have readable labels.
- Menu control exposes open/closed state through `aria-label`.
- Range inputs remain keyboard operable.
- FAQ uses native disclosure semantics.
- Maintain visible focus styles.
- Keep body copy contrast readable against both cream and dark surfaces.

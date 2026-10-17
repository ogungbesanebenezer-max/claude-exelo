# Acceptance criteria

## Installation and commands

- [ ] `bash install.sh` installs the Exelo hub skill, runtime helper, specialist agents, Node dependencies, and Chromium.
- [ ] `bash -n install.sh uninstall.sh scripts/exelo` passes.
- [ ] `/exelo doctor` reports Node, Playwright, Chromium, Overpass, workspace, and scoring readiness without secrets.
- [ ] `/exelo setup` creates `.exelo/config.json` and is safe to run again.

## Local website crawling

- [ ] `/exelo crawl <URL>` launches local headless Chromium through Playwright.
- [ ] The crawl stays on the supplied origin by default and has a configurable page cap.
- [ ] Mozilla Readability and Turndown produce agent-readable Markdown.
- [ ] Output contains `website.json`, `scan.json`, `evidence.json`, and `opportunity-report.md`.
- [ ] Extracted fields include title, description, headings, phones, emails, booking links, social links, Markdown, and internal links.
- [ ] Page failures are represented as structured results rather than hidden.

## OpenStreetMap discovery

- [ ] `/exelo osm "dentists in San Diego"` geocodes the location with Nominatim and queries Overpass.
- [ ] Output preserves OSM IDs, names, addresses, websites, phones, hours, coordinates, OSM URLs, and provider attribution.
- [ ] Empty results and geocoding failures are explicit states.
- [ ] The runtime does not scrape the consumer Google Maps interface or require a paid API key.

## Scoring and evidence

- [ ] `/exelo score <run-dir>` writes a transparent `score.json`.
- [ ] Signals expose points, maximum points, status, rationale, and confidence.
- [ ] Unknown or not-observed signals remain visible and are not silently treated as factual absence.
- [ ] Evidence records include claim, source, observed time, confidence, and verification.
- [ ] Reports distinguish observed facts from estimates and unknowns.
- [ ] The skill does not claim telephony, voice, billing, calendar, email, or live business operations.

## Quality

- [ ] `npm run validate` passes.
- [ ] `npm run build` passes.
- [ ] No secrets are committed.

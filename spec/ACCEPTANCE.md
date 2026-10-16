# Acceptance criteria

## Installation and commands

- [ ] `bash install.sh` installs the Exelo hub skill, runtime helper, and specialist agents.
- [ ] `bash -n install.sh uninstall.sh scripts/exelo` passes.
- [ ] `/exelo doctor` reports crawler and Google Places readiness without exposing the API key.
- [ ] `/exelo setup` creates `.exelo/config.json` and is safe to run again.

## Website crawling

- [ ] `/exelo crawl <URL>` stays on the supplied origin by default.
- [ ] The crawl has a configurable page cap.
- [ ] Output contains `website.json`, `scan.json`, `evidence.json`, and `opportunity-report.md`.
- [ ] Extracted fields include title, description, headings, phones, emails, booking links, social links, and internal links.
- [ ] Fetch failures are represented as structured results rather than hidden.

## Google Places

- [ ] `/exelo maps <query>` uses `https://places.googleapis.com/v1/places:searchText` when `GOOGLE_MAPS_API_KEY` exists.
- [ ] The request sends `X-Goog-FieldMask` and does not request unneeded fields.
- [ ] Output preserves place ID, business name, address, website, rating, review count, status, type, and Maps URL when returned.
- [ ] Missing API credentials produce `provider-not-configured` without fabricated business results.
- [ ] API errors are surfaced with provider status and a safe error summary.

## Evidence and agent behavior

- [ ] Evidence records include claim, source, observed time, confidence, and verification.
- [ ] Reports distinguish observed facts from estimates and unknowns.
- [ ] The skill does not claim telephony, voice, billing, calendar, email, or live business operations.

## Quality

- [ ] `npm run validate` passes.
- [ ] `npm run build` passes.
- [ ] No secrets are committed.

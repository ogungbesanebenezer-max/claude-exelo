# Claude Exelo

An installable, portable agent skill for Claude Code and other coding agents. It discovers local businesses with OpenStreetMap, crawls public websites with a local headless Chromium browser, preserves evidence, scores opportunity signals, and generates research reports and proposals.

## Install for Claude Code

```bash
git clone https://github.com/ogungbesanebenezer-max/claude-exelo.git
cd claude-exelo
bash install.sh
claude
```

`install.sh` installs the skill, specialist agents, Node dependencies, and the Playwright Chromium browser. No paid API key is required for the default workflow.

Then run:

```text
/exelo doctor
/exelo setup
/exelo scan "dentists in San Diego"
/exelo crawl https://example-business.com
/exelo osm "dentists in San Diego"
/exelo score .exelo/runs/<slug>
/exelo report .exelo/runs/<slug>
/exelo proposal .exelo/runs/<slug>
```

## Local crawling

The crawler runs Chromium locally through Playwright. It renders JavaScript, extracts the readable main content with `@mozilla/readability`, and converts it to clean Markdown with Turndown. It also records titles, descriptions, headings, phone and email signals, hours language, services, booking links, social links, and internal links.

The crawler stays on the supplied origin by default, limits the number of pages, identifies itself, and does not access private or authenticated areas. Configure the limits with `EXELO_MAX_PAGES`, `EXELO_PAGE_TIMEOUT`, and `EXELO_SETTLE_MS`.

## OpenStreetMap discovery

Use a query such as:

```bash
/exelo osm "dentists in San Diego"
```

Claude Exelo geocodes the location with Nominatim and queries the Overpass API for nearby OpenStreetMap nodes, ways, and relations. Results include OSM IDs, names, addresses, websites, phones, opening hours, coordinates, and OSM URLs. OSM is community-maintained discovery data, so the agent must crawl and verify each website before presenting current business claims. Research exports should retain `© OpenStreetMap contributors` attribution.

## Business-opportunity scoring

`/exelo score <run-dir>` writes `score.json`. The deterministic baseline scores four dimensions: business fit, market proof, conversion friction, and website quality. Every signal exposes points, maximum points, status, rationale, and confidence.

The score is a triage aid, not a prediction of revenue, rankings, missed calls, or conversion. A missing booking link is marked `not-observed` and becomes a verification task; it is not silently treated as proof that no booking exists. Unknown signals lower confidence.

## Outputs

Each run is stored under `.exelo/runs/<slug>/`:

```text
scan.json
osm.json or website.json
evidence.json
score.json
opportunity-report.md
```

## Validate locally

```bash
npm install
npx playwright install chromium
npm run validate
npm run build
bash -n install.sh uninstall.sh scripts/exelo
```

## Scope boundary

This repo is a public research and sales-enablement skill. It does not provision or operate telephony, voice, email delivery, calendars, billing, phone numbers, or live business systems.

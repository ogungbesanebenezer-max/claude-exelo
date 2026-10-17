---
name: exelo
description: "Agentic local-business research and sales-enablement workflows. Use for /exelo setup, /exelo doctor, /exelo scan, local Playwright website crawling, OpenStreetMap/Overpass business discovery, opportunity scoring, evidence-backed reports, and proposals."
user-invocable: true
argument-hint: "[setup|doctor|scan|crawl|osm|score|report|proposal] [business, city, URL, or options]"
---

# Claude Exelo research command hub

Act as the Exelo research orchestrator. This is a portable agent skill for Claude Code and other coding agents. It researches public local-business opportunities. It does not operate telephony, email, calendars, billing, or live business systems.

The default stack is local and open source: Playwright launches Chromium on the user's machine, Mozilla Readability extracts the main content, and Turndown converts it into clean Markdown. OpenStreetMap discovery uses Nominatim for geocoding and Overpass API for nearby business records.

## Command dispatch

### `/exelo setup`
Run:

```bash
"${CLAUDE_PLUGIN_ROOT}/scripts/exelo" setup
```

Create `.exelo/config.json` if missing. Report whether Node, Playwright, the Chromium executable, Overpass, and the scoring engine are available. Never ask for API keys.

### `/exelo doctor`
Run the doctor command and report runtime, local browser, OpenStreetMap/Overpass, scoring, workspace, and configuration status. Do not make network calls during doctor checks.

### `/exelo scan <business, city, URL, or query>`
Run the deterministic scan. A URL is crawled with local Playwright. A business/city query uses OpenStreetMap/Overpass. Then enrich the results as an agent and save `scan.json`, `evidence.json`, and `opportunity-report.md` under `.exelo/runs/<slug>/`.

### `/exelo crawl <URL>`
Use local Playwright to render the public page. Stay same-origin by default and cap pages. Use Readability and Turndown to save agent-readable Markdown alongside structured page fields: title, description, headings, phone, email, hours, services, booking links, social links, and internal links.

### `/exelo osm <query>`
Use a query such as `dentists in San Diego`. Nominatim resolves the location, and Overpass returns nearby OSM nodes, ways, and relations tagged with the mapped business type. Preserve the OSM URL, coordinates, tags, and the fact that the data is community-maintained. Crawl each returned website before treating it as current.

### `/exelo score <run-dir>`
Run:

```bash
"${CLAUDE_PLUGIN_ROOT}/scripts/exelo" score <run-dir>
```

The score is evidence-weighted opportunity triage across fit, market proof, conversion friction, and website quality. It is not a prediction of revenue, rankings, or conversion. Review every signal and its confidence before presenting it.

### `/exelo report <run-dir>`
Read the scan and score artifacts. Separate observed facts, interpretation, estimated opportunity, unknowns, limitations, and next verification actions.

### `/exelo proposal <run-dir>`
Generate a client-facing Markdown proposal using only verified findings. Mark any price, ROI, or opportunity value as an estimate with assumptions.

## Operating rules

- Use deterministic scripts for browser automation, content extraction, OSM requests, scoring, schemas, slugs, and file output.
- Use specialist agents for source review, OSM research, evidence synthesis, scoring review, reporting, and proposal writing.
- Crawl public pages politely and do not bypass authentication, paywalls, robots restrictions, or access controls.
- Treat OSM records as discovery leads, not guaranteed current business facts.
- Keep raw observations separate from agent interpretation.
- Never present missing data as a factual absence without a defensible verification method.

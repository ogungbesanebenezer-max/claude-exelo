---
name: claude-exelo
description: Run and extend the Claude Exelo agentic local-business research workflow using local Playwright crawling, OpenStreetMap/Overpass discovery, readable Markdown extraction, evidence preservation, opportunity scoring, and report generation.
---

# Claude Exelo agent skill

Claude Exelo is a portable coding-agent workflow. Its core runtime is local and open source: Playwright launches Chromium, Mozilla Readability extracts the main content, Turndown converts it to Markdown, and Nominatim plus Overpass discover local-business candidates.

## Required reading

Read `AGENTS.md`, `skills/exelo/SKILL.md`, `spec/PRODUCT_SPEC.md`, and `spec/ACCEPTANCE.md` before changing runtime behavior. Read `data/product.json` for provider and scoring contracts.

## Commands

Use the `/exelo` hub or the bundled runtime:

```text
/exelo setup
/exelo doctor
/exelo scan "dentists in San Diego"
/exelo crawl https://example.com
/exelo osm "dentists in San Diego"
/exelo score .exelo/runs/<slug>
/exelo report .exelo/runs/<slug>
```

## Evidence contract

Every evidence record must contain `claim`, `value`, `source`, `observed_at`, `confidence`, and `verification`. Treat OpenStreetMap records as discovery leads and verify current business details on public websites. Keep unknown and not-observed signals visible.

## Safety and scope

Crawl only public pages, stay same-origin by default, cap pages, identify the crawler, and do not bypass authentication, paywalls, robots restrictions, or access controls. Do not add Google Places, Bright Data, telephony, voice, email delivery, calendar, billing, phone provisioning, or live business operations.

## Validation

Before delivery, run `npm run validate`, `npm run build`, `bash -n install.sh uninstall.sh scripts/exelo`, and a local Playwright crawl smoke test.

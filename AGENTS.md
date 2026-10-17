# AGENTS.md

Build and maintain a portable agentic research and sales-enablement skill for Claude Code and other coding agents. The core system discovers local businesses with OpenStreetMap/Overpass, crawls public websites with local Playwright Chromium, converts pages into readable Markdown, preserves evidence, scores opportunity signals, and generates reports and proposals.

Keep command orchestration in `skills/exelo/SKILL.md`, deterministic work in `scripts/`, and research judgment in `agents/`. Use Playwright for rendering, `@mozilla/readability` for main-content extraction, and Turndown for Markdown. Use Nominatim and Overpass for discovery. OSM data is community-maintained and must be verified against current websites.

Stay public and same-origin by default, cap pages, identify the crawler, and do not bypass robots, authentication, paywalls, or access controls. Every evidence record needs claim, source, observed_at, confidence, and verification. Unknown and not-observed signals must stay visible.

Run `npm run validate`, `npm run build`, `bash -n install.sh uninstall.sh scripts/exelo`, and `npx playwright install chromium` before delivery. Do not add Google Places, Bright Data, telephony, voice, email, calendar, billing, or live business-operation features.

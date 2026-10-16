# AGENTS.md

## Mission
Build and maintain a portable agentic research and sales-enablement skill for Claude Code and other coding agents. The core system discovers local businesses, crawls public websites, queries Google Places, preserves evidence, scores opportunity signals, and generates reports and proposals.

## Start here
Read `README.md`, `skills/exelo/SKILL.md`, `spec/PRODUCT_SPEC.md`, `spec/ACCEPTANCE.md`, and `CLAUDE.md`. Run `npm run validate` and `bash -n install.sh uninstall.sh scripts/exelo` before changing runtime behavior.

## Implementation rules
- Keep command orchestration in `skills/exelo/SKILL.md`.
- Keep deterministic work in `scripts/`: URL fetching, same-origin crawling, extraction, Google Places requests, slugs, schemas, and file output.
- Keep research judgment in specialist files under `agents/`.
- Keep observations separate from interpretations. Every evidence record needs claim, value, source, observed_at, confidence, and verification.
- Use public HTTP sources only. Stay same-origin by default, cap crawl pages, identify the crawler, and do not bypass robots, authentication, paywalls, or rate limits.
- Use Google Places API (New), not consumer Google Maps UI scraping.
- Never invent a provider result when an API key is missing or a request fails.
- Preserve the distinction between observed, estimated, inferred, unknown, and provider-not-configured.
- The `src/` Vite app is an optional visual demo; it is not the runtime engine.

## Definition of done
- `/exelo doctor` reports crawler and Google Places readiness without exposing secrets.
- `/exelo setup` is idempotent.
- `/exelo crawl <URL>` creates structured website, scan, evidence, and report artifacts.
- `/exelo maps <query>` uses Google Places when configured and returns an explicit missing-provider state otherwise.
- `npm run validate` and `npm run build` pass.
- No runtime feature claims telephony, voice, email, calendar, billing, phone provisioning, or live business operations.

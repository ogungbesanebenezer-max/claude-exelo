# Exelo Agent Kit

An installable, portable agent skill for Claude Code and other coding agents. It discovers local businesses, crawls public websites, queries Google Places, preserves evidence, scores opportunity signals, and generates research reports and proposals.

The React/Vite page in `src/` is an optional visual demo of the product concept. The core deliverable is the agent system under `skills/`, `agents/`, `scripts/`, and `.claude-plugin/`.

## Install for Claude Code

```bash
git clone YOUR_REPO_URL exelo-agent-kit
cd exelo-agent-kit
bash install.sh
claude
```

Then run:

```text
/exelo doctor
/exelo setup
/exelo scan "dentists in San Diego"
/exelo crawl https://example-business.com
/exelo maps "dentists in San Diego"
/exelo score .exelo/runs/<slug>
/exelo report .exelo/runs/<slug>
/exelo proposal .exelo/runs/<slug>
```

The installer places the hub at `~/.claude/skills/exelo/SKILL.md`, the runtime at `~/.claude/skills/exelo/scripts/exelo`, and specialist agents in `~/.claude/agents/`. Set `EXELO_FORCE=1` to replace an existing install. Use `bash uninstall.sh` to remove the manual install.

## Providers

The website crawler is built in and uses public HTTP fetches with same-origin and page-count limits. It extracts titles, descriptions, headings, phone and email signals, hours language, services, booking links, social links, and internal links.

Google business discovery uses the Google Places API (New) Text Search endpoint when `GOOGLE_MAPS_API_KEY` is configured. The adapter requests place ID, name, address, phone, website, rating, review count, business status, type, and Maps URL. Without a key, it returns an explicit `provider-not-configured` result and makes no business claims.

```bash
export GOOGLE_MAPS_API_KEY="your-key"
/exelo setup
/exelo maps "dentists in San Diego"
```

Enable Places API (New) and billing in the Google Cloud project that owns the key. The repo does not scrape the consumer Google Maps UI.

## Outputs

Each run is stored under `.exelo/runs/<slug>/`:

```text
scan.json
maps.json or website.json
evidence.json
opportunity-report.md
```

Agents should enrich these artifacts with source URLs, observation times, confidence, verification notes, opportunity rationale, and limitations.

## Validate locally

```bash
npm install
npm run validate
npm run build
bash -n install.sh uninstall.sh scripts/exelo
```

## Scope boundary

This repo is a research and sales-enablement skill. It does not provision or operate telephony, voice, email delivery, calendars, billing, phone numbers, or live business systems.

---
name: exelo
description: "Agentic local-business research and sales-enablement workflows. Use when the user asks to run /exelo setup, /exelo doctor, /exelo scan, crawl a business website, search Google Maps or Places, score an opportunity, generate an evidence-backed report, or create a proposal from public business data."
user-invocable: true
argument-hint: "[setup|doctor|scan|crawl|maps|score|report|proposal] [business, city, URL, or options]"
---

# Exelo research command hub

Act as the Exelo research orchestrator. This is a portable agent skill for Claude Code and other coding agents. It researches public local-business opportunities; it is not a telephony, billing, calendar, voice, or email-delivery platform.

Write artifacts under `.exelo/` unless the user requests another location. Keep the distinction between observed facts, estimates, inferences, and unknowns.

## Command dispatch

### `/exelo setup`
Run:

```bash
"${CLAUDE_PLUGIN_ROOT}/scripts/exelo" setup
```

Create `.exelo/config.json` if it does not exist. Use this default shape:

```json
{
  "version": 1,
  "workspace": ".exelo",
  "crawler": { "provider": "built-in-fetch", "maxPages": 8, "sameOriginOnly": true },
  "businessData": { "provider": "google-places", "configured": false },
  "scoring": { "version": 1 }
}
```

Never invent or print API keys. Report whether Google Places is configured from `GOOGLE_MAPS_API_KEY`.

### `/exelo doctor`
Run:

```bash
"${CLAUDE_PLUGIN_ROOT}/scripts/exelo" doctor
```

Report runtime, crawler, Google Places, workspace, and configuration status. Doctor must not make network calls or modify credentials.

### `/exelo scan <business, city, URL, or query>`
Run:

```bash
"${CLAUDE_PLUGIN_ROOT}/scripts/exelo" scan <user arguments>
```

The runtime performs the deterministic part:

- A URL is crawled with the built-in public website crawler.
- A business/city query uses Google Places Text Search (New) when `GOOGLE_MAPS_API_KEY` is configured.
- Without a key, it creates a clearly labeled provider-missing result instead of pretending to have live Maps data.

Then inspect and enrich the results as an agent. Save:

```text
.exelo/runs/<slug>/scan.json
.exelo/runs/<slug>/evidence.json
.exelo/runs/<slug>/opportunity-report.md
```

Every evidence item must include `claim`, `source`, `observed_at`, `confidence`, and `verification`. Never present estimated missed calls, revenue, or pricing as facts.

### `/exelo crawl <URL>`
Crawl only the supplied public origin unless the user explicitly authorizes broader scope. Extract page titles, descriptions, headings, phone/email signals, hours, services, booking links, contact links, social links, robots directives, and internal links. Save the raw structured result and a compact evidence list.

### `/exelo maps <query>`
Use the Google Places adapter for public business discovery. Prefer fields needed for research: place ID, display name, formatted address, national phone number, website URI, rating, user rating count, business status, primary type, and Google Maps URI. Respect Google API terms and configured quotas. Do not scrape the consumer Google Maps UI.

### `/exelo score <run-or-business>`
Score only from evidence. Use signals such as website presence, online booking, listed hours, review count, contact clarity, service urgency, and evidence of lead friction. Return a transparent score with per-signal rationale and confidence, not a fabricated precision metric.

### `/exelo report <run-or-business>`
Generate an opportunity report for a business owner or operator. Separate observed facts, interpretation, estimated opportunity, limitations, and recommended next actions.

### `/exelo proposal <run-or-business>`
Read the latest verified scan and score. Generate a client-facing Markdown proposal using the operator's brand and chosen price. Include source-backed findings and mark all financial figures as estimates. Do not claim an AI receptionist, phone line, bookings, or any other operational service is live.

## Operating rules

- Use specialist agents for website crawling review, Maps research, evidence synthesis, scoring, and proposal writing.
- Use deterministic scripts for HTTP fetching, extraction, JSON schemas, slugs, and calculations.
- Crawl public pages politely, stay same-origin by default, cap pages, identify the tool, and avoid private/authenticated areas.
- Keep raw observations separate from agent interpretation.
- Prefer Google Places API responses over search snippets when configured.
- Do not access private data, bypass robots/authentication, or scrape the Google Maps consumer interface.
- This skill generates research and sales-enablement artifacts. It does not provision or operate telephony, email, calendar, payments, or live business systems.

# Product specification

## Positioning
Exelo is an agentic local-business research and sales-enablement skill. It helps an operator find promising businesses, verify public signals, understand booking and contact friction, score opportunity, and create evidence-backed reports and proposals.

## Core loop

```text
Business query or public URL
        ↓
Google Places discovery or website crawl
        ↓
Structured public observations
        ↓
Evidence review by specialist agent
        ↓
Transparent opportunity score
        ↓
Opportunity report and proposal
```

## Functional areas

- `/exelo setup`: create local config and report provider readiness.
- `/exelo doctor`: check runtime, crawler, workspace, and Google Places configuration.
- `/exelo scan`: route URL targets to crawling and business/city queries to Google Places.
- `/exelo crawl`: fetch public same-origin pages with a page cap and extract business signals.
- `/exelo maps`: query Google Places API (New) Text Search with an explicit field mask.
- `/exelo score`: turn evidence into a transparent opportunity score with rationale.
- `/exelo report`: write a fact/interpretation/estimate/limitation report.
- `/exelo proposal`: turn verified findings into a client-facing Markdown proposal.

## Evidence fields

Every evidence record must contain `claim`, `value`, `source`, `observed_at`, `confidence`, and `verification`. Missing information is `unknown`; it is not evidence of absence unless the source and method justify that conclusion.

## Crawler requirements

The crawler stays same-origin by default, caps pages, follows useful internal links, extracts page metadata, headings, contact signals, hours language, services language, booking links, social links, and robots directives, and writes raw structured output before agent interpretation.

## Google Places requirements

Use the Places API (New) Text Search endpoint with `GOOGLE_MAPS_API_KEY`. Request only fields needed for discovery and verification. Save place IDs and Maps URLs. Never scrape the consumer Maps UI. Without a key, return `provider-not-configured` and do not fabricate listings.

## Explicit non-goals

This repo does not implement telephony, speech-to-text, text-to-speech, email delivery, calendar booking, billing, phone-number provisioning, or live business operations.

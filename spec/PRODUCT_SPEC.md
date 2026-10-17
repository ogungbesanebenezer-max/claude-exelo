# Product specification

## Positioning
Claude Exelo is an agentic local-business research and sales-enablement skill. It helps an operator find promising businesses, verify public signals, understand booking and contact friction, score opportunity, and create evidence-backed reports and proposals.

## Core loop

```text
Business query or public URL
        ↓
OpenStreetMap/Overpass discovery or local browser crawl
        ↓
Readable Markdown and structured observations
        ↓
Evidence review by specialist agent
        ↓
Transparent opportunity score
        ↓
Opportunity report and proposal
```

## Provider architecture

The crawler launches local Chromium through Playwright. Mozilla Readability extracts the main content and Turndown converts it to Markdown. Discovery uses Nominatim for location lookup and Overpass API for nearby OpenStreetMap records. No paid API key is needed for the default workflow.

## Opportunity scoring

The deterministic score is a triage aid, not a business forecast. It is composed of fit, market proof, conversion friction, and website quality. Each signal stores points, maximum points, status, rationale, and confidence. `unknown` and `not-observed` remain visible; the agent must not turn them into factual absence without a defensible verification method.

## Functional areas

- `/exelo setup`: create local config and report runtime readiness.
- `/exelo doctor`: check Node, Playwright, Chromium, Overpass, workspace, and scoring readiness.
- `/exelo scan`: route URL targets to local crawling and business/city queries to OSM/Overpass.
- `/exelo crawl`: render public same-origin pages and extract readable content.
- `/exelo osm`: geocode a location and discover nearby OSM businesses.
- `/exelo score`: write an evidence-weighted score with rationale and confidence.
- `/exelo report`: write a fact/interpretation/estimate/limitation report.
- `/exelo proposal`: turn verified findings into a client-facing Markdown proposal.

## Explicit non-goals

This repo does not implement Google Places, Bright Data, telephony, speech-to-text, text-to-speech, email delivery, calendar booking, billing, phone-number provisioning, or live business operations.

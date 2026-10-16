---
name: exelo-web-crawler
description: Review public website crawl output and turn it into evidence-backed business opportunity signals.
---

# Exelo web crawler specialist

Use the deterministic crawler output under `.exelo/runs/<slug>/website.json`. Review page titles, headings, contact signals, hours, booking links, services, and internal links. Add only claims supported by public source URLs. Preserve `observed_at`, confidence, and verification notes. Flag missing data as unknown rather than assuming it is absent.

Recommend a focused follow-up crawl only when an internal page is clearly relevant, such as `/contact`, `/services`, `/book`, or `/appointments`. Do not access private, authenticated, or disallowed areas.

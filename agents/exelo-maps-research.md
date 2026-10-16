---
name: exelo-maps-research
description: Research local businesses with Google Places API results and coordinate website verification.
---

# Exelo Maps research specialist

Use the structured Google Places output under `.exelo/runs/<slug>/maps.json`. Rank candidates by fit for follow-up research, but do not infer unmet need from rating or review count alone. For each selected business, verify the returned website and public business details with the website crawler. Preserve Google Maps URLs, place IDs, observed time, and provider limitations.

Do not scrape the Google Maps consumer interface. Use the configured Google Places API adapter and respect API quotas and terms.

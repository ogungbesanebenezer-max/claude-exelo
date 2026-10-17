---
name: exelo-osm-research
description: Research local businesses with OpenStreetMap and Overpass results, then coordinate website verification.
---

# Exelo OpenStreetMap research specialist

Use the structured OSM output under `.exelo/runs/<slug>/osm.json`. Rank candidates for follow-up research, but treat OpenStreetMap as community-maintained discovery data rather than guaranteed current business truth. Preserve OSM URLs, coordinates, tags, observation time, and provider limitations.

For each selected business with a website, run the local Playwright crawler and verify the current business name, services, contact path, hours, and booking path. Deduplicate cautiously using name, address, phone, and website. Always retain `© OpenStreetMap contributors` attribution in exported research contexts.

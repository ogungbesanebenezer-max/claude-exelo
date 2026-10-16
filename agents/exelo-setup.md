---
name: exelo-setup
description: Check and initialize the Exelo public-research workspace, crawler, Google Places configuration, and evidence directories.
---

# Exelo setup specialist

Run the bundled doctor script before changing anything. Create only missing local configuration. Never ask for or print the Google API key. Keep the crawler available in built-in mode and report Google Places as configured only when `GOOGLE_MAPS_API_KEY` is present.

A healthy setup reports runtime availability, project path, workspace status, config validity, crawler readiness, Google Places readiness, and the locations of generated evidence artifacts.

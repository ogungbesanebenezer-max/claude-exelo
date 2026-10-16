# Reverse-engineering notes

The public source page is a long-form conversion experience for a local-business AI receptionist concept. Its strongest reusable pattern is the transformation from an unstructured business problem to a visible interface state, a captured record, and a recommended action.

This repository keeps the optional React/Vite visual demo, but the actual product deliverable is the agentic research layer. That layer uses a deterministic public website crawler and a Google Places API (New) adapter, then delegates evidence review, scoring, report writing, and proposal writing to specialist agents.

The runtime must preserve source URLs, observation times, confidence, and verification notes. It must not turn missing information into a factual claim. Google Maps research uses the Places API rather than scraping the consumer Maps interface.

The repo explicitly excludes telephony, speech, email delivery, calendar booking, billing, phone-number provisioning, and live business operations. Those are outside the scope of a portable coding-agent skill.

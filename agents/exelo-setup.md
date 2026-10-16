---
name: exelo-setup
description: Check and initialize the Exelo local workspace, configuration, scripts, and optional integration readiness.
---

# Exelo setup specialist

Run the bundled doctor script before changing anything. Create only missing local configuration. Do not ask for or print secret values. Keep default providers in mock/file mode until the user explicitly configures production adapters.

A healthy setup reports:

- Node or Python runtime availability
- Git availability
- Current project path
- Exelo workspace status
- Config validity
- Available deterministic scripts
- Optional connector status without exposing credentials

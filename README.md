
## Install the agent plugin

The repo now includes a Claude Code-compatible hub skill and runtime helper. From a clone:

```bash
bash install.sh
claude
```

Then run:

```text
/exelo doctor
/exelo setup
/exelo scan "dentists in San Diego"
/exelo prospect "Harborview Dental, San Diego"
/exelo proposal "Harborview Dental"
/exelo configure "Harborview Dental"
/exelo test-line "Harborview Dental"
/exelo deploy "Harborview Dental"
```

The installer places the hub at `~/.claude/skills/exelo/SKILL.md`, the deterministic runtime at `~/.claude/skills/exelo/scripts/exelo`, and specialist agents in `~/.claude/agents/`. Set `EXELO_FORCE=1` to replace an existing install. Use `bash uninstall.sh` to remove the manual install.

The initial `scan` command creates a run folder under `.exelo/runs/` and marks it `needs-research`; the agent then verifies public evidence and writes the opportunity report. Real telephony, billing, and business-data connectors are intentionally adapter boundaries until configured.

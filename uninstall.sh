#!/usr/bin/env bash
set -euo pipefail
SKILL_DIR="${EXELO_SKILL_DIR:-${HOME}/.claude/skills/exelo}"
AGENT_DIR="${EXELO_AGENT_DIR:-${HOME}/.claude/agents}"
rm -rf "$SKILL_DIR"
rm -f "$AGENT_DIR/exelo-scan.md" "$AGENT_DIR/exelo-setup.md"
echo "Exelo removed from $SKILL_DIR"

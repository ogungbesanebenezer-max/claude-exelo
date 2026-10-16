#!/usr/bin/env bash
set -euo pipefail

# Exelo Agent Kit installer
# Installs the user-invocable /exelo hub skill and bundled specialist agents.

main() {
  local script_dir repo_root
  script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  repo_root="${EXELO_SOURCE_DIR:-$script_dir}"
  local skill_dir="${EXELO_SKILL_DIR:-${HOME}/.claude/skills/exelo}"
  local agent_dir="${EXELO_AGENT_DIR:-${HOME}/.claude/agents}"
  local force="${EXELO_FORCE:-0}"

  command -v cp >/dev/null 2>&1 || { echo 'cp is required.' >&2; exit 1; }
  command -v mkdir >/dev/null 2>&1 || { echo 'mkdir is required.' >&2; exit 1; }
  [ -d "$repo_root" ] || { echo "Source directory not found: $repo_root" >&2; exit 1; }
  [ -f "$repo_root/skills/exelo/SKILL.md" ] || { echo 'skills/exelo/SKILL.md is missing.' >&2; exit 1; }
  [ -x "$repo_root/scripts/exelo" ] || chmod +x "$repo_root/scripts/exelo"

  if [ "$force" != "1" ] && [ -f "$skill_dir/SKILL.md" ]; then
    echo "Exelo is already installed at $skill_dir. Set EXELO_FORCE=1 to replace it."
    exit 0
  fi

  mkdir -p "$skill_dir" "$skill_dir/scripts" "$agent_dir"
  cp "$repo_root/skills/exelo/SKILL.md" "$skill_dir/SKILL.md"
  cp "$repo_root/scripts/exelo" "$skill_dir/scripts/exelo"
  chmod +x "$skill_dir/scripts/exelo"
  # Manual installs do not receive CLAUDE_PLUGIN_ROOT. Rewrite only the
  # installed copy; marketplace installs keep the portable token in source.
  skill_dir_escaped="$(printf '%s' "$skill_dir" | sed 's/[#&\\]/\\&/g')"
  sed -i "s#\${CLAUDE_PLUGIN_ROOT}/scripts/exelo#${skill_dir_escaped}/scripts/exelo#g" "$skill_dir/SKILL.md"

  if [ -d "$repo_root/agents" ]; then
    cp "$repo_root/agents/"*.md "$agent_dir/" 2>/dev/null || true
  fi
  if [ -f "$repo_root/.claude-plugin/plugin.json" ]; then
    cp "$repo_root/.claude-plugin/plugin.json" "$skill_dir/runtime-plugin.json"
  fi

  echo "Exelo installed."
  echo "Skill:  $skill_dir/SKILL.md"
  echo "Agents: $agent_dir/exelo-*.md"
  echo
  echo 'Start Claude Code and run:'
  echo '  /exelo doctor'
  echo '  /exelo setup'
  echo '  /exelo scan "dentists in San Diego"'
}

main "$@"

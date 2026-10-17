#!/usr/bin/env bash
set -euo pipefail

# Claude Exelo installer: local Playwright crawler, OSM/Overpass discovery, and agent skills.
main() {
  local script_dir repo_root
  script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  repo_root="${EXELO_SOURCE_DIR:-$script_dir}"
  local skill_dir="${EXELO_SKILL_DIR:-${HOME}/.claude/skills/exelo}"
  local agent_dir="${EXELO_AGENT_DIR:-${HOME}/.claude/agents}"
  local force="${EXELO_FORCE:-0}"
  command -v cp >/dev/null 2>&1 || { echo 'cp is required.' >&2; exit 1; }
  command -v mkdir >/dev/null 2>&1 || { echo 'mkdir is required.' >&2; exit 1; }
  command -v node >/dev/null 2>&1 || { echo 'Node.js is required for local crawling.' >&2; exit 1; }
  command -v npm >/dev/null 2>&1 || { echo 'npm is required for local crawling.' >&2; exit 1; }
  [ -f "$repo_root/skills/exelo/SKILL.md" ] || { echo 'skills/exelo/SKILL.md is missing.' >&2; exit 1; }
  if [ "$force" != "1" ] && [ -f "$skill_dir/SKILL.md" ]; then echo "Claude Exelo is already installed at $skill_dir. Set EXELO_FORCE=1 to replace it."; exit 0; fi
  mkdir -p "$skill_dir" "$skill_dir/scripts" "$agent_dir"
  cp -r "$repo_root/skills/exelo/SKILL.md" "$skill_dir/SKILL.md"
  cp "$repo_root/scripts/"*.mjs "$skill_dir/scripts/"
  cp "$repo_root/scripts/exelo" "$skill_dir/scripts/exelo"
  chmod +x "$skill_dir/scripts/exelo"
  skill_dir_escaped="$(printf '%s' "$skill_dir" | sed 's/[#&\\]/\\&/g')"
  sed -i "s#\${CLAUDE_PLUGIN_ROOT}/scripts/exelo#${skill_dir_escaped}/scripts/exelo#g" "$skill_dir/SKILL.md"
  cp "$repo_root/package.json" "$skill_dir/package.json"
  echo 'Installing local browser dependencies...'
  npm install --prefix "$skill_dir" --no-save playwright turndown @mozilla/readability jsdom >/dev/null
  "$skill_dir/node_modules/.bin/playwright" install chromium >/dev/null
  cp "$repo_root/agents/"*.md "$agent_dir/" 2>/dev/null || true
  cp "$repo_root/.claude-plugin/plugin.json" "$skill_dir/runtime-plugin.json" 2>/dev/null || true
  echo 'Claude Exelo installed with local Playwright Chromium.'
  echo 'Run: /exelo doctor, /exelo setup, /exelo osm "dentists in San Diego"'
}
main "$@"

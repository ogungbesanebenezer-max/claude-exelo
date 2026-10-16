import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  'README.md', 'AGENTS.md', 'CLAUDE.md', 'install.sh', 'uninstall.sh',
  '.claude-plugin/plugin.json', 'skills/exelo/SKILL.md',
  'agents/exelo-scan.md', 'agents/exelo-setup.md', 'agents/exelo-web-crawler.md',
  'agents/exelo-maps-research.md', 'scripts/exelo', 'scripts/crawl.mjs',
  'scripts/google-places.mjs', 'spec/PRODUCT_SPEC.md', 'spec/ACCEPTANCE.md',
  'data/product.json'
];
const missing = required.filter(file => !fs.existsSync(path.join(root, file)));
if (missing.length) {
  console.error(`Missing required files:\n${missing.join('\n')}`);
  process.exit(1);
}
const product = JSON.parse(fs.readFileSync(path.join(root, 'data/product.json'), 'utf8'));
if (product.providers?.crawler !== 'built-in-fetch') throw new Error('Crawler provider is not configured');
if (product.providers?.businessData !== 'google-places') throw new Error('Google Places provider is not configured');
if (!product.googlePlaces?.requiredEnv) throw new Error('Google Places environment variable is missing');
for (const file of ['scripts/crawl.mjs', 'scripts/google-places.mjs']) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  if (!source.includes('evidence.json')) throw new Error(`${file} must write evidence output`);
}
const skill = fs.readFileSync(path.join(root, 'skills/exelo/SKILL.md'), 'utf8');
for (const command of ['/exelo setup', '/exelo doctor', '/exelo scan', '/exelo crawl', '/exelo maps']) {
  if (!skill.includes(command)) throw new Error(`Missing command contract: ${command}`);
}
console.log('Content validation passed.');

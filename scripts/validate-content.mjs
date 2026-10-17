import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  'README.md', 'AGENTS.md', 'CLAUDE.md', 'install.sh', 'uninstall.sh',
  '.claude-plugin/plugin.json', 'skills/exelo/SKILL.md',
  'agents/exelo-scan.md', 'agents/exelo-setup.md', 'agents/exelo-web-crawler.md',
  'agents/exelo-maps-research.md', 'agents/exelo-scoring.md', 'scripts/exelo',
  'scripts/crawl.mjs', 'scripts/overpass.mjs', 'scripts/score.mjs',
  'spec/PRODUCT_SPEC.md', 'spec/ACCEPTANCE.md', 'data/product.json'
];
const missing = required.filter(file => !fs.existsSync(path.join(root, file)));
if (missing.length) { console.error(`Missing required files:\n${missing.join('\n')}`); process.exit(1); }
const product = JSON.parse(fs.readFileSync(path.join(root, 'data/product.json'), 'utf8'));
if (product.providers?.crawler !== 'local-playwright') throw new Error('Local Playwright crawler is not configured');
if (product.providers?.businessData !== 'openstreetmap-overpass') throw new Error('Overpass provider is not configured');
if (product.providers?.contentParser !== '@mozilla/readability+turndown') throw new Error('Readable content parser is not configured');
for (const file of ['scripts/crawl.mjs', 'scripts/overpass.mjs', 'scripts/score.mjs']) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  if (!source.includes('evidence') && file !== 'scripts/score.mjs') throw new Error(`${file} must write evidence output`);
}
const skill = fs.readFileSync(path.join(root, 'skills/exelo/SKILL.md'), 'utf8');
for (const command of ['/exelo setup', '/exelo doctor', '/exelo scan', '/exelo crawl', '/exelo osm', '/exelo score']) {
  if (!skill.includes(command)) throw new Error(`Missing command contract: ${command}`);
}
console.log('Content validation passed.');

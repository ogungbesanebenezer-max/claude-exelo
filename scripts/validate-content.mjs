import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  'README.md', 'AGENTS.md', 'src/main.jsx', 'src/styles.css',
  'spec/PRODUCT_SPEC.md', 'spec/UI_SPEC.md', 'spec/ACCEPTANCE.md',
  'data/product.json', 'skill/SKILL.md'
];
const missing = required.filter(file => !fs.existsSync(path.join(root, file)));
if (missing.length) {
  console.error(`Missing required files:\n${missing.join('\n')}`);
  process.exit(1);
}
const product = JSON.parse(fs.readFileSync(path.join(root, 'data/product.json'), 'utf8'));
const { price, minutes, usageRate } = product.calculator;
if (price.min !== 150 || price.max !== 800 || price.step !== 10) throw new Error('Unexpected price calculator range');
if (minutes.min !== 250 || minutes.max !== 1500 || minutes.step !== 25) throw new Error('Unexpected minutes calculator range');
if (usageRate !== 0.3) throw new Error('Unexpected usage rate');
if (product.workflow.length !== 6) throw new Error('Workflow must contain six steps');
const source = fs.readFileSync(path.join(root, 'src/main.jsx'), 'utf8');
for (const anchor of ['id="how"', 'id="calculator"', 'id="pricing"', 'id="faq"', 'id="close"']) {
  if (!source.includes(anchor)) throw new Error(`Missing page anchor: ${anchor}`);
}
console.log('Content validation passed.');

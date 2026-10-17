#!/usr/bin/env node
import fs from 'node:fs/promises';
import { URL } from 'node:url';
import { chromium } from 'playwright';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';
import TurndownService from 'turndown';

const [target, runDir] = process.argv.slice(2);
if (!target || !runDir) { console.error('Usage: crawl.mjs <url> <run-dir>'); process.exit(2); }
const maxPages = Number(process.env.EXELO_MAX_PAGES || 8);
const origin = new URL(target).origin;
const queue = [new URL(target).href];
const seen = new Set();
const pages = [];
const evidence = [];
const clean = value => String(value || '').replace(/\s+/g, ' ').trim();
const absolutize = (href, base) => { try { return new URL(href, base).href; } catch { return null; } };
const matches = (html, re) => [...html.matchAll(re)].map(m => clean(m[1] || m[0])).filter(Boolean);
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ userAgent: process.env.EXELO_USER_AGENT || 'ClaudeExeloResearchBot/0.1 (+public research)', viewport: { width: 1280, height: 800 } });
const turndown = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });

try {
  while (queue.length && pages.length < maxPages) {
    const url = queue.shift();
    if (seen.has(url)) continue;
    seen.add(url);
    const page = await context.newPage();
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: Number(process.env.EXELO_PAGE_TIMEOUT || 30000) });
      await page.waitForTimeout(Number(process.env.EXELO_SETTLE_MS || 500));
      const finalUrl = page.url();
      const rawHtml = await page.content();
      const dom = new JSDOM(rawHtml, { url: finalUrl });
      const article = new Readability(dom.window.document).parse();
      const bodyText = clean(article?.textContent || dom.window.document.body?.textContent || '');
      const markdown = article?.content ? turndown.turndown(article.content) : bodyText;
      const links = [...new Set([...rawHtml.matchAll(/<a[^>]+href=["']([^"']+)["']/gi)].map(m => absolutize(m[1], finalUrl)).filter(Boolean))];
      const internal = links.filter(h => { try { return new URL(h).origin === origin; } catch { return false; } });
      for (const link of internal) if (!seen.has(link) && queue.length + pages.length < maxPages) queue.push(link);
      const title = clean((rawHtml.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || article?.title);
      const description = clean((rawHtml.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) || [])[1]);
      const headings = matches(rawHtml, /<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi).map(x => clean(x.replace(/<[^>]+>/g, ' '))).slice(0, 30);
      const phones = [...new Set(matches(rawHtml, /(?:tel:|\+?\d[\d .()/-]{7,}\d)/gi))].slice(0, 10);
      const emails = [...new Set(matches(rawHtml, /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi))].slice(0, 10);
      const bookingLinks = links.filter(h => /book|booking|appointment|schedule|reserve|calendly|mindbody|squareup/i.test(h));
      const socialLinks = links.filter(h => /facebook|instagram|linkedin|yelp|youtube|tiktok/i.test(h));
      pages.push({ url: finalUrl, status: 'crawled', title, description, headings, phones, emails, bookingLinks, socialLinks, internalLinks: internal.slice(0, 50), markdown: markdown.slice(0, 12000) });
      const add = (claim, value, confidence = 'medium') => evidence.push({ claim, value, source: finalUrl, observed_at: new Date().toISOString(), confidence, verification: 'review source page' });
      if (title) add('Page title exists', title, 'high');
      if (description) add('Meta description exists', description, 'high');
      if (phones.length) add('Public phone signal found', phones, 'high');
      if (bookingLinks.length) add('Online booking signal found', bookingLinks, 'high');
      if (/hours|open today|mon(day)?|tue(sday)?|wed(nesday)?|thu(rsday)?|fri(day)?|sat(urday)?|sun(day)?/i.test(bodyText)) add('Hours or opening-day language found', true, 'medium');
      if (/emergency|urgent|same day|24[ /-]?hour/i.test(bodyText)) add('Urgent or after-hours service language found', true, 'medium');
    } catch (error) {
      pages.push({ url, status: 'fetch-error', error: error.message });
    } finally { await page.close(); }
  }
} finally { await browser.close(); }

const result = { target, origin, provider: 'local-playwright', parser: '@mozilla/readability+turndown', status: pages.length ? 'crawled' : 'no-pages', crawled_at: new Date().toISOString(), pages, limits: { maxPages, sameOriginOnly: true } };
await fs.mkdir(runDir, { recursive: true });
await fs.writeFile(`${runDir}/website.json`, JSON.stringify(result, null, 2));
await fs.writeFile(`${runDir}/evidence.json`, JSON.stringify(evidence, null, 2));
await fs.writeFile(`${runDir}/scan.json`, JSON.stringify({ query: target, mode: 'website-crawl', provider: result.provider, status: result.status, sources: pages.map(p => p.url), evidence_count: evidence.length, crawled_at: result.crawled_at }, null, 2));
await fs.writeFile(`${runDir}/opportunity-report.md`, `# Opportunity report\n\nTarget: ${target}\n\nCrawler: local Playwright\n\nThe crawl found **${evidence.length} evidence signals** across **${pages.length} pages**. Review the evidence before assigning an opportunity score.\n`);
console.log(JSON.stringify({ run_dir: runDir, provider: result.provider, status: result.status, pages: pages.length, evidence: evidence.length }, null, 2));

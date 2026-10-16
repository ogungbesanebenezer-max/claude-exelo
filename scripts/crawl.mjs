#!/usr/bin/env node
import fs from 'node:fs/promises';
import { URL } from 'node:url';

const [target, runDir] = process.argv.slice(2);
if (!target || !runDir) { console.error('Usage: crawl.mjs <url> <run-dir>'); process.exit(2); }
const maxPages = Number(process.env.EXELO_MAX_PAGES || 8);
const origin = new URL(target).origin;
const queue = [new URL(target).href];
const seen = new Set();
const pages = [];
const evidence = [];
const headers = { 'user-agent': process.env.EXELO_USER_AGENT || 'ExeloResearchBot/0.1 (+public research; contact operator before crawling)' };
const clean = value => String(value || '').replace(/\s+/g, ' ').trim();
const absolutize = (href, base) => { try { return new URL(href, base).href; } catch { return null; } };
const textOf = html => clean(html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' '));
const matches = (html, re) => [...html.matchAll(re)].map(m => clean(m[1] || m[0])).filter(Boolean);

while (queue.length && pages.length < maxPages) {
  const url = queue.shift();
  if (seen.has(url)) continue;
  seen.add(url);
  let response;
  try { response = await fetch(url, { headers, redirect: 'follow' }); } catch (error) {
    pages.push({ url, status: 'fetch-error', error: error.message });
    continue;
  }
  const type = response.headers.get('content-type') || '';
  if (!type.includes('text/html')) { pages.push({ url, status: response.status, contentType: type }); continue; }
  const html = await response.text();
  const finalUrl = response.url;
  const title = clean((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1]);
  const description = clean((html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) || [])[1]);
  const headings = matches(html, /<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi).map(textOf).slice(0, 30);
  const links = matches(html, /<a[^>]+href=["']([^"']+)["']/gi).map(h => absolutize(h, finalUrl)).filter(Boolean);
  const internal = links.filter(h => { try { return new URL(h).origin === origin; } catch { return false; } });
  for (const link of internal) if (!seen.has(link) && queue.length + pages.length < maxPages) queue.push(link);
  const body = textOf(html);
  const phones = [...new Set(matches(html, /(?:tel:|\+?\d[\d .()/-]{7,}\d)/gi))].slice(0, 10);
  const emails = [...new Set(matches(html, /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi))].slice(0, 10);
  const bookingLinks = links.filter(h => /book|booking|appointment|schedule|reserve|calendly|mindbody|squareup/i.test(h));
  const socialLinks = links.filter(h => /facebook|instagram|linkedin|yelp|youtube|tiktok/i.test(h));
  const page = { url: finalUrl, status: response.status, title, description, headings, phones, emails, bookingLinks, socialLinks, internalLinks: internal.slice(0, 50), textSample: body.slice(0, 1200) };
  pages.push(page);
  const add = (claim, value, confidence = 'medium') => evidence.push({ claim, value, source: finalUrl, observed_at: new Date().toISOString(), confidence, verification: 'review source page' });
  if (title) add('Page title exists', title, 'high');
  if (description) add('Meta description exists', description, 'high');
  if (phones.length) add('Public phone signal found', phones, 'high');
  if (bookingLinks.length) add('Online booking signal found', bookingLinks, 'high');
  if (/hours|open today|mon(day)?|tue(sday)?|wed(nesday)?|thu(rsday)?|fri(day)?|sat(urday)?|sun(day)?/i.test(body)) add('Hours or opening-day language found', true, 'medium');
  if (/emergency|urgent|same day|24[ /-]?hour/i.test(body)) add('Urgent or after-hours service language found', true, 'medium');
}
const result = { target, origin, status: pages.length ? 'crawled' : 'no-pages', crawled_at: new Date().toISOString(), pages, limits: { maxPages, sameOriginOnly: true } };
await fs.mkdir(runDir, { recursive: true });
await fs.writeFile(`${runDir}/website.json`, JSON.stringify(result, null, 2));
await fs.writeFile(`${runDir}/evidence.json`, JSON.stringify(evidence, null, 2));
await fs.writeFile(`${runDir}/scan.json`, JSON.stringify({ query: target, mode: 'website-crawl', status: result.status, sources: pages.map(p => p.url), evidence_count: evidence.length, crawled_at: result.crawled_at }, null, 2));
await fs.writeFile(`${runDir}/opportunity-report.md`, `# Opportunity report\n\nTarget: ${target}\n\nThe public website crawl found **${evidence.length} evidence signals** across **${pages.length} pages**. Review the evidence before assigning an opportunity score.\n`);
console.log(JSON.stringify({ run_dir: runDir, status: result.status, pages: pages.length, evidence: evidence.length }, null, 2));

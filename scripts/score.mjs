#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const runDir = process.argv[2];
if (!runDir) { console.error('Usage: score.mjs <run-dir>'); process.exit(2); }
const readJson = async name => { try { return JSON.parse(await fs.readFile(path.join(runDir, name), 'utf8')); } catch { return null; } };
const website = await readJson('website.json');
const osm = await readJson('osm.json');
const evidence = (await readJson('evidence.json')) || [];
const pages = website?.pages || [];
const place = osm?.places?.[0];
const text = pages.map(p => `${p.title || ''} ${p.description || ''} ${p.headings || ''} ${p.markdown || ''}`).join(' ').toLowerCase();
const signals = [];
const add = (name, category, points, max, status, rationale, confidence = 'medium') => signals.push({ name, category, points, max, status, rationale, confidence });
if (place) add('Business listing verified', 'fit', 10, 10, 'observed', `${place.name || 'A business'} was returned by OpenStreetMap.`, 'medium');
else add('Business listing verified', 'fit', 0, 10, 'unknown', 'No OSM business record was available in this run.', 'low');
const hasReviews = /review|rating|testimonial/.test(text);
add('Market proof', 'fit', hasReviews ? 8 : 0, 15, hasReviews ? 'observed' : 'unknown', hasReviews ? 'Review or testimonial language was found on the public site.' : 'No review signal was found in the crawl; this is not evidence of no demand.', hasReviews ? 'medium' : 'low');
const hasBooking = evidence.some(e => /booking/i.test(e.claim)) || pages.some(p => p.bookingLinks?.length);
const hasPhone = evidence.some(e => /phone/i.test(e.claim)) || pages.some(p => p.phones?.length);
const hasHours = evidence.some(e => /hours/i.test(e.claim));
const urgent = evidence.some(e => /urgent/i.test(e.claim));
add('Booking path', 'friction', hasBooking ? 0 : (pages.length ? 15 : 0), 15, hasBooking ? 'observed' : (pages.length ? 'not-observed' : 'unknown'), hasBooking ? 'A booking path was found.' : 'No booking link was found in the crawled pages; verify manually before treating this as a gap.', hasBooking ? 'high' : 'medium');
add('Contact path', 'friction', hasPhone ? 0 : (pages.length ? 8 : 0), 8, hasPhone ? 'observed' : (pages.length ? 'not-observed' : 'unknown'), hasPhone ? 'A public phone signal was found.' : 'No phone signal was found in the crawled pages; verify manually.', hasPhone ? 'high' : 'medium');
add('Hours clarity', 'friction', hasHours ? 0 : (pages.length ? 7 : 0), 7, hasHours ? 'observed' : (pages.length ? 'not-observed' : 'unknown'), hasHours ? 'Opening-hours language was found.' : 'Opening-hours language was not found in the crawl.', 'medium');
add('Urgency fit', 'fit', urgent ? 15 : 0, 15, urgent ? 'observed' : 'not-observed', urgent ? 'Urgent or same-day service language was found.' : 'No urgent-service language was found.', 'medium');
const quality = pages.length && pages.every(p => p.title && p.description) ? 10 : pages.length ? 5 : 0;
add('Website quality signals', 'friction', quality, 10, pages.length ? 'observed' : 'unknown', quality >= 10 ? 'All crawled pages exposed basic metadata.' : 'Some basic website metadata is missing or unavailable.', 'medium');
const rawTotal = signals.reduce((sum, s) => sum + s.points, 0);
const maxTotal = signals.reduce((sum, s) => sum + s.max, 0);
const unknowns = signals.filter(s => s.status === 'unknown').length;
const score = Math.round((rawTotal / maxTotal) * 100);
const confidence = unknowns >= 3 ? 'low' : unknowns >= 1 ? 'medium' : 'high';
const result = { version: 1, run_dir: runDir, scored_at: new Date().toISOString(), score, label: score >= 70 ? 'high-priority-review' : score >= 40 ? 'promising-review' : 'insufficient-evidence', confidence, raw_points: rawTotal, max_points: maxTotal, unknown_signals: unknowns, signals, method: 'Evidence-weighted opportunity triage; not a prediction of revenue, rankings, or conversion.' };
await fs.writeFile(path.join(runDir, 'score.json'), JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));

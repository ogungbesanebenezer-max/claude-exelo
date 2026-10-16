#!/usr/bin/env node
import fs from 'node:fs/promises';

const [query, runDir] = process.argv.slice(2);
if (!query || !runDir) { console.error('Usage: google-places.mjs <query> <run-dir>'); process.exit(2); }
const key = process.env.GOOGLE_MAPS_API_KEY;
await fs.mkdir(runDir, { recursive: true });
if (!key) {
  const result = { query, mode: 'google-places', status: 'provider-not-configured', provider: 'Google Places API (New)', observed_at: new Date().toISOString(), next_steps: ['Set GOOGLE_MAPS_API_KEY', 'Enable Places API (New) and billing in the Google Cloud project', 'Run the same scan again'] };
  await fs.writeFile(`${runDir}/maps.json`, JSON.stringify(result, null, 2));
  await fs.writeFile(`${runDir}/scan.json`, JSON.stringify(result, null, 2));
  await fs.writeFile(`${runDir}/evidence.json`, '[]\n');
  await fs.writeFile(`${runDir}/opportunity-report.md`, `# Opportunity report\n\nQuery: ${query}\n\nGoogle Places is not configured. No business claims were made.\n`);
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}
const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
  method: 'POST',
  headers: { 'content-type': 'application/json', 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.businessStatus,places.primaryType,places.googleMapsUri' },
  body: JSON.stringify({ textQuery: query, pageSize: Number(process.env.EXELO_MAPS_PAGE_SIZE || 10), languageCode: 'en' })
});
const raw = await response.text();
let payload; try { payload = JSON.parse(raw); } catch { payload = { raw }; }
if (!response.ok) { console.error(JSON.stringify({ status: response.status, provider: 'Google Places API (New)', error: payload }, null, 2)); process.exit(1); }
const places = (payload.places || []).map(p => ({ id: p.id, name: p.displayName?.text, address: p.formattedAddress, phone: p.nationalPhoneNumber, website: p.websiteUri, rating: p.rating, reviewCount: p.userRatingCount, businessStatus: p.businessStatus, primaryType: p.primaryType, mapsUrl: p.googleMapsUri }));
const observed = new Date().toISOString();
const evidence = places.flatMap(p => [
  p.name && { claim: 'Business listing found', value: p.name, source: p.mapsUrl, observed_at: observed, confidence: 'high', verification: 'Google Places API response' },
  p.website === undefined && { claim: 'No website returned by Places response', value: true, source: p.mapsUrl, observed_at: observed, confidence: 'medium', verification: 'Confirm manually; absence may reflect incomplete listing data' },
  p.reviewCount !== undefined && { claim: 'Review count returned', value: p.reviewCount, source: p.mapsUrl, observed_at: observed, confidence: 'high', verification: 'Google Places API response' }
].filter(Boolean));
const result = { query, mode: 'google-places', status: 'crawled', provider: 'Google Places API (New)', observed_at: observed, places, evidence_count: evidence.length };
await fs.writeFile(`${runDir}/maps.json`, JSON.stringify(result, null, 2));
await fs.writeFile(`${runDir}/scan.json`, JSON.stringify(result, null, 2));
await fs.writeFile(`${runDir}/evidence.json`, JSON.stringify(evidence, null, 2));
await fs.writeFile(`${runDir}/opportunity-report.md`, `# Opportunity report\n\nQuery: ${query}\n\nGoogle Places returned **${places.length} businesses**. Review the evidence and crawl each selected website before scoring opportunity.\n`);
console.log(JSON.stringify({ run_dir: runDir, status: result.status, places: places.length, evidence: evidence.length }, null, 2));

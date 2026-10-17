#!/usr/bin/env node
import fs from 'node:fs/promises';

const [query, runDir] = process.argv.slice(2);
if (!query || !runDir) { console.error('Usage: overpass.mjs <query> <run-dir>'); process.exit(2); }
const observed = new Date().toISOString();
const slugParts = query.split(/\bin\b/i);
const rawType = (slugParts[0] || query).trim().toLowerCase();
const location = (slugParts[1] || '').trim();
const typeMap = { dentist: 'dentist', dentists: 'dentist', restaurant: 'restaurant', restaurants: 'restaurant', cafe: 'cafe', cafes: 'cafe', salon: 'hairdresser', salons: 'hairdresser', plumber: 'plumber', plumbers: 'plumber', lawyer: 'lawyer', lawyers: 'lawyer', hotel: 'hotel', hotels: 'hotel' };
const amenity = typeMap[rawType] || rawType.replace(/s$/, '') || 'place';
await fs.mkdir(runDir, { recursive: true });
if (!location) {
  const result = { query, provider: 'openstreetmap-overpass', status: 'needs-location', observed_at: observed, next_steps: ['Use a query such as "dentists in San Diego"'] };
  await fs.writeFile(`${runDir}/osm.json`, JSON.stringify(result, null, 2)); await fs.writeFile(`${runDir}/scan.json`, JSON.stringify(result, null, 2)); await fs.writeFile(`${runDir}/evidence.json`, '[]\n'); console.log(JSON.stringify(result, null, 2)); process.exit(0);
}
const nominatim = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(location)}`, { headers: { 'user-agent': 'ClaudeExeloResearchBot/0.1 (public research)' } });
if (!nominatim.ok) throw new Error(`Nominatim HTTP ${nominatim.status}`);
const geocodes = await nominatim.json();
if (!geocodes.length) {
  const result = { query, provider: 'openstreetmap-overpass', status: 'location-not-found', location, observed_at: observed };
  await fs.writeFile(`${runDir}/osm.json`, JSON.stringify(result, null, 2)); await fs.writeFile(`${runDir}/scan.json`, JSON.stringify(result, null, 2)); await fs.writeFile(`${runDir}/evidence.json`, '[]\n'); console.log(JSON.stringify(result, null, 2)); process.exit(0);
}
const { lat, lon, display_name: displayName } = geocodes[0];
const radius = Number(process.env.EXELO_OSM_RADIUS || 10000);
const overpassQuery = `[out:json][timeout:30];(nwr["amenity"="${amenity}"](around:${radius},${lat},${lon});nwr["craft"="${amenity}"](around:${radius},${lat},${lon});nwr["shop"="${amenity}"](around:${radius},${lat},${lon}););out center tags;`;
const endpoints = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter', 'https://overpass.private.coffee/api/interpreter'];
let payload;
let endpointUsed;
const errors = [];
for (const endpoint of endpoints) {
  try {
    const overpass = await fetch(endpoint, { method: 'POST', headers: { 'content-type': 'text/plain', 'user-agent': 'ClaudeExeloResearchBot/0.1 (public research)' }, body: overpassQuery });
    if (!overpass.ok) { errors.push(`${endpoint}: HTTP ${overpass.status}`); continue; }
    payload = await overpass.json();
    endpointUsed = endpoint;
    break;
  } catch (error) { errors.push(`${endpoint}: ${error.message}`); }
}
if (!payload) {
  const result = { query, provider: 'openstreetmap-overpass', status: 'provider-error', location: displayName, observed_at: observed, errors, next_steps: ['Retry later', 'Use another configured Overpass endpoint', 'Keep the business query for a later run'] };
  await fs.writeFile(`${runDir}/osm.json`, JSON.stringify(result, null, 2)); await fs.writeFile(`${runDir}/scan.json`, JSON.stringify(result, null, 2)); await fs.writeFile(`${runDir}/evidence.json`, '[]\n'); await fs.writeFile(`${runDir}/opportunity-report.md`, `# Opportunity report\n\nQuery: ${query}\n\nOpenStreetMap discovery was temporarily unavailable. No business claims were made.\n`); console.log(JSON.stringify(result, null, 2)); process.exit(0);
}
const places = (payload.elements || []).map(el => { const t = el.tags || {}; const latOut = el.lat ?? el.center?.lat; const lonOut = el.lon ?? el.center?.lon; return { id: `${el.type}/${el.id}`, name: t.name || null, address: [t['addr:housenumber'], t['addr:street'], t['addr:city'] || location].filter(Boolean).join(', '), website: t.website || t['contact:website'] || null, phone: t.phone || t['contact:phone'] || null, openingHours: t.opening_hours || null, type: t.amenity || t.craft || t.shop || amenity, coordinates: { lat: latOut, lon: lonOut }, osmUrl: `https://www.openstreetmap.org/${el.type}/${el.id}` }; });
const evidence = places.flatMap(p => [p.name && { claim: 'Business listing found', value: p.name, source: p.osmUrl, observed_at: observed, confidence: 'medium', verification: 'OpenStreetMap community data; verify current details' }, p.website && { claim: 'Website listed in OpenStreetMap', value: p.website, source: p.osmUrl, observed_at: observed, confidence: 'medium', verification: 'Crawl the listed website' }, p.openingHours && { claim: 'Opening hours listed', value: p.openingHours, source: p.osmUrl, observed_at: observed, confidence: 'medium', verification: 'Verify on business website' }].filter(Boolean));
const result = { query, provider: 'openstreetmap-overpass', status: 'crawled', endpoint: endpointUsed, location: displayName, search: { amenity, radiusMeters: radius }, observed_at: observed, places, evidence_count: evidence.length };
await fs.writeFile(`${runDir}/osm.json`, JSON.stringify(result, null, 2)); await fs.writeFile(`${runDir}/scan.json`, JSON.stringify(result, null, 2)); await fs.writeFile(`${runDir}/evidence.json`, JSON.stringify(evidence, null, 2)); await fs.writeFile(`${runDir}/opportunity-report.md`, `# Opportunity report\n\nQuery: ${query}\n\nOpenStreetMap returned **${places.length} candidate listings** near ${displayName}. Verify websites and current business details before scoring.\n`);
console.log(JSON.stringify({ run_dir: runDir, provider: result.provider, status: result.status, places: places.length, evidence: evidence.length }, null, 2));

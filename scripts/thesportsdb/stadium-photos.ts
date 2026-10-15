/**
 * Fotos de estadio para el snapshot de TheSportsDB: con las coordenadas del
 * estadio se busca en Wikidata el recinto deportivo más cercano (≤ 1 km) que
 * tenga imagen (P18), se elige por parecido de nombre y se toma la foto de
 * Commons solo si la licencia es libre (CC0, dominio público, CC BY, CC BY-SA)
 * y mide ≥ 1000 px. Ante la duda, sin foto.
 *   npx tsx scripts/thesportsdb/stadium-photos.ts [--refresh]
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { ClubFacts, TsdbSnapshot, VenuePhoto } from '../../src/lib/thesportsdb';

const OUT = join(process.cwd(), 'src/data/thesportsdb-snapshot.json');
const UA = 'mundiales-de-futbol.com (fotos de estadio; contacto@mundiales-de-futbol.com)';
const STALE_MS = 30 * 86_400_000;
const REFRESH = process.argv.includes('--refresh');
const OK_LICENSE = /^(cc0|public domain|pd|cc by(-sa)?( \d(\.\d)?)?)$/i;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const STOP = new Set(['estadio', 'stadium', 'stadion', 'stade', 'stadio', 'arena', 'de', 'del', 'la', 'el', 'the', 'of', 'municipal', 'campo', 'center', 'centre', 'park', 'field']);
const tokens = (s: string) => new Set(s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w)));
const overlap = (a: Set<string>, b: Set<string>) => [...a].filter((x) => b.has(x)).length;
const strip = (h: string) => h.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

async function getJson(url: string, init?: RequestInit): Promise<any> {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url, { ...init, headers: { 'User-Agent': UA, ...(init?.headers ?? {}) }, signal: AbortSignal.timeout(30_000) });
      if (r.status === 429) { await sleep(30_000); continue; }
      return r.ok ? await r.json() : null;
    } catch { await sleep(5_000); }
  }
  return null;
}

/** Recintos deportivos con imagen a ≤ 1 km del punto. */
async function nearby(lat: number, lng: number) {
  const q = `SELECT ?item ?label ?alt ?img ?dist WHERE {
    SERVICE wikibase:around { ?item wdt:P625 ?loc . bd:serviceParam wikibase:center "Point(${lng} ${lat})"^^geo:wktLiteral . bd:serviceParam wikibase:radius "1" . bd:serviceParam wikibase:distance ?dist . }
    ?item wdt:P31/wdt:P279* wd:Q1076486 . ?item wdt:P18 ?img .
    OPTIONAL { ?item rdfs:label ?label . FILTER(LANG(?label) IN ("es","en")) }
    OPTIONAL { ?item skos:altLabel ?alt . FILTER(LANG(?alt) IN ("es","en")) }
  }`;
  const j = await getJson(`https://query.wikidata.org/sparql?query=${encodeURIComponent(q)}`, { headers: { Accept: 'application/sparql-results+json' } });
  const byItem = new Map<string, { id: string; names: string[]; img: string; dist: number }>();
  for (const b of j?.results?.bindings ?? []) {
    const id = b.item.value.split('/').pop();
    const e = byItem.get(id) ?? { id, names: [] as string[], img: decodeURIComponent(b.img.value.split('FilePath/')[1] ?? ''), dist: Number(b.dist?.value ?? 9) };
    for (const k of ['label', 'alt']) if (b[k]?.value && !e.names.includes(b[k].value)) e.names.push(b[k].value);
    byItem.set(id, e);
  }
  return [...byItem.values()];
}

async function commons(file: string): Promise<Omit<VenuePhoto, 'wikidata' | 'label'> | null> {
  const p = new URLSearchParams({ action: 'query', format: 'json', titles: `File:${file}`, prop: 'imageinfo', iiprop: 'url|size|extmetadata|mime', iiurlwidth: '1600' });
  const j = await getJson(`https://commons.wikimedia.org/w/api.php?${p}`);
  const ii: any = (Object.values(j?.query?.pages ?? {})[0] as any)?.imageinfo?.[0];
  if (!ii) return null;
  const m = ii.extmetadata ?? {};
  const license = strip(String(m.LicenseShortName?.value ?? ''));
  const artist = strip(String(m.Artist?.value ?? '')) || 'Wikimedia Commons';
  if (!OK_LICENSE.test(license) || !/^image\/(jpeg|png)$/.test(ii.mime) || !(Number(ii.width) >= 1000)) return null;
  return {
    url: String(ii.thumburl ?? ii.url), width: Number(ii.thumbwidth ?? ii.width), height: Number(ii.thumbheight ?? ii.height),
    credit: `${artist.slice(0, 120)} · ${license} · Wikimedia Commons`, license, page: String(ii.descriptionurl ?? ''),
  };
}

(async () => {
  const snap: TsdbSnapshot = JSON.parse(readFileSync(OUT, 'utf8'));
  const clubs = Object.values(snap.teams).filter((e): e is ClubFacts => !('miss' in e) && e.venue?.lat !== undefined);
  const todo = clubs.filter((c) => REFRESH || !c.venue!.photoCheckedAt || Date.now() - Date.parse(c.venue!.photoCheckedAt) > STALE_MS);
  console.log(`Fotos de estadio: ${clubs.length} estadios con coordenadas, ${todo.length} por revisar`);
  const cache = new Map<string, VenuePhoto | null>();
  let hit = 0;
  for (const [i, c] of todo.entries()) {
    const v = c.venue!;
    const key = `${v.lat!.toFixed(4)},${v.lng!.toFixed(4)}`;
    if (!cache.has(key)) {
      const want = tokens([v.name, ...(v.alternate ?? [])].join(' '));
      const cands = (await nearby(v.lat!, v.lng!))
        .map((x) => ({ ...x, score: overlap(want, tokens(x.names.join(' '))) }))
        .sort((a, b) => b.score - a.score || a.dist - b.dist);
      await sleep(600);
      // Nombre parecido, o un único recinto muy cerca (≤ 300 m) si no hay parecido.
      const best = cands[0] && (cands[0].score > 0 || (cands.length === 1 && cands[0].dist <= 0.3)) ? cands[0] : null;
      let photo: VenuePhoto | null = null;
      if (best?.img) {
        const img = await commons(best.img);
        await sleep(300);
        if (img) photo = { ...img, wikidata: best.id, label: best.names[0] ?? v.name };
      }
      cache.set(key, photo);
    }
    const photo = cache.get(key);
    if (photo) { v.photo = photo; hit++; } else delete v.photo;
    v.photoCheckedAt = new Date().toISOString();
    if ((i + 1) % 50 === 0) { writeFileSync(OUT, JSON.stringify(snap, null, 1) + '\n'); console.log(`  ${i + 1}/${todo.length} · ${hit} con foto`); }
  }
  writeFileSync(OUT, JSON.stringify(snap, null, 1) + '\n');
  console.log(`Hecho: ${hit} de ${todo.length} con foto`);
})();

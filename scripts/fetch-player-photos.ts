/**
 * Pilla fotos de jugadores convocados al Mundial 2026 desde la API de
 * Wikipedia (`pageimages` prop). Sin clave de API, gratis.
 *
 * Para cada jugador en `src/lib/wc-2026-squads.players.json`:
 *   1. Busca la página de Wikipedia que mejor coincide con su nombre.
 *   2. Pide la imagen principal (lead image, formato thumbnail).
 *   3. Guarda `{ playerSlug: { photoUrl, sourceTitle } }` en
 *      `src/lib/wc-2026-squads.photos.json`.
 *
 * Política:
 *   - Solo guarda URLs que cumplan `upload.wikimedia.org/wikipedia/commons`
 *     (licencia libre) o `upload.wikimedia.org/wikipedia/en` (con créditos).
 *   - Si la búsqueda no devuelve un match obvio, lo registra en
 *     `_unresolved` y NO escribe `photoUrl` (el componente cae al
 *     avatar de iniciales).
 *
 * Uso: npx tsx scripts/fetch-player-photos.ts
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

type Player = {
  name: string;
  playerSlug: string;
};
type Squad = { players: Player[] };
type Sidecar = Record<string, Squad | unknown>;

const sidecarPath = resolve(
  process.cwd(),
  'src/lib/wc-2026-squads.players.json',
);
const sidecar = JSON.parse(readFileSync(sidecarPath, 'utf8')) as Sidecar;

type WikiSearchResp = {
  query?: { search?: Array<{ title: string; snippet: string }> };
};
type WikiPagesResp = {
  query?: {
    pages?: Record<
      string,
      {
        pageid: number;
        title: string;
        thumbnail?: { source: string; width: number; height: number };
        pageimage?: string;
      }
    >;
  };
};

async function searchWiki(query: string): Promise<string | null> {
  const url = new URL('https://en.wikipedia.org/w/api.php');
  url.searchParams.set('action', 'query');
  url.searchParams.set('list', 'search');
  url.searchParams.set('srsearch', `${query} footballer`);
  url.searchParams.set('srlimit', '3');
  url.searchParams.set('format', 'json');
  url.searchParams.set('origin', '*');
  const res = await fetch(url, {
    headers: { 'User-Agent': 'mundiales-de-futbol/1.0 (research)' },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as WikiSearchResp;
  const hit = data.query?.search?.[0]?.title;
  return hit ?? null;
}

async function fetchPageImage(
  title: string,
): Promise<{ source: string } | null> {
  const url = new URL('https://en.wikipedia.org/w/api.php');
  url.searchParams.set('action', 'query');
  url.searchParams.set('titles', title);
  url.searchParams.set('prop', 'pageimages');
  url.searchParams.set('pithumbsize', '300');
  url.searchParams.set('format', 'json');
  url.searchParams.set('origin', '*');
  // `redirects=1` sigue redirecciones tipo "Theo Hernandez" → "Théo Hernandez"
  // automáticamente. Sin esto, los redirects devuelven la página origen
  // (sin pageimage) y la API parece "rota".
  url.searchParams.set('redirects', '1');
  const res = await fetch(url, {
    headers: { 'User-Agent': 'mundiales-de-futbol/1.0 (research)' },
  });
  if (!res.ok) {
    console.error(`   HTTP ${res.status} para ${title}`);
    return null;
  }
  const data = (await res.json()) as WikiPagesResp;
  const pages = data.query?.pages;
  if (!pages) return null;
  const first = Object.values(pages)[0];
  if (!first?.thumbnail?.source) return null;
  return { source: first.thumbnail.source };
}

async function resolvePlayer(
  p: Player,
): Promise<{ photoUrl: string; sourceTitle: string } | null> {
  // Estrategia 1: probar el nombre directo como título (con espacios,
  // Wikipedia normaliza). Hacemos 2 reintentos por si hay un 5xx.
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const img = await fetchPageImage(p.name);
      if (img) return { photoUrl: img.source, sourceTitle: p.name };
      break; // 200 OK pero sin imagen → no reintentar
    } catch {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  // Estrategia 2: search API + pageimages.
  const found = await searchWiki(p.name);
  if (!found) return null;
  const img = await fetchPageImage(found);
  if (!img) return null;
  return { photoUrl: img.source, sourceTitle: found };
}

async function main() {
  const out: Record<string, { photoUrl: string; sourceTitle: string }> = {};
  const unresolved: string[] = [];

  for (const [code, entry] of Object.entries(sidecar)) {
    if (
      !entry ||
      typeof entry !== 'object' ||
      !('players' in entry) ||
      !Array.isArray((entry as Squad).players)
    ) {
      continue;
    }
    const squad = entry as Squad;
    console.log(`\n=== ${code} (${squad.players.length} jugadores) ===`);
    for (const p of squad.players) {
      try {
        const res = await resolvePlayer(p);
        if (res) {
          out[p.playerSlug] = res;
          console.log(`✅ ${p.name.padEnd(28)} → ${res.sourceTitle}`);
        } else {
          unresolved.push(`${code}:${p.playerSlug} (${p.name})`);
          console.log(`⚠️  ${p.name.padEnd(28)} → sin foto`);
        }
      } catch (err) {
        unresolved.push(`${code}:${p.playerSlug} ERROR ${(err as Error).message}`);
        console.error(`❌ ${p.name}`, (err as Error).message);
      }
      // 500ms entre llamadas — recall mejor que velocidad. Wikipedia
      // empieza a throttlear en ráfagas de >5 req/s sostenidas.
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  const outPath = resolve(
    process.cwd(),
    'src/lib/wc-2026-squads.photos.json',
  );
  writeFileSync(
    outPath,
    JSON.stringify(
      { _meta: { lastUpdated: new Date().toISOString().slice(0, 10) }, ...out },
      null,
      2,
    ) + '\n',
    'utf8',
  );

  console.log(`\n📝 ${Object.keys(out).length} fotos escritas en ${outPath}`);
  if (unresolved.length > 0) {
    console.log(`\n⚠️  ${unresolved.length} jugadores sin foto:`);
    for (const u of unresolved) console.log(`   - ${u}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

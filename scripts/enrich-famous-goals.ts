/**
 * Enriquecimiento de `FAMOUS_GOALS` con datos reales de YouTube.
 *
 * Para cada gol del catálogo `src/lib/wc-famous-goals.ts`:
 *   1. Si tiene `youtubeId`, llamamos a `videos.list` para refrescar
 *      `duration` / `uploadDate` / `channelTitle` / `viewCount`.
 *   2. Si NO tiene `youtubeId`, llamamos a `search.list` con
 *      `youtubeQuery`, puntuamos los 5 mejores resultados (canal oficial
 *      FIFA/UEFA + popularidad), y seleccionamos el mejor.
 *
 * Política:
 *   - El script NO modifica `wc-famous-goals.ts` automáticamente. Vuelca
 *     un sidecar JSON en `src/lib/wc-famous-goals.yt.json` con la
 *     metadata enriquecida, indexada por `slug`. El runtime puede
 *     fusionarla con el catálogo curado.
 *   - Los IDs candidatos con score bajo se marcan `needsReview: true`
 *     y NO se commitean al sidecar — se imprimen en stdout para
 *     decidir a mano.
 *
 * Quota:
 *   - search.list = 100 u  •  videos.list = 1 u
 *   - 18 goles × (1 search + 1 videos batch) ≈ 1.800 u (quota diaria 10k).
 *
 * Uso: npx tsx scripts/enrich-famous-goals.ts
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// ─── Cargar .env.local ───────────────────────────────────────────────
const envFile = resolve(process.cwd(), '.env.local');
try {
  const content = readFileSync(envFile, 'utf8');
  for (const line of content.split('\n')) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*"?(.*?)"?\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {}

const YT_KEY = process.env.YOUTUBE_API_KEY;
if (!YT_KEY) {
  console.error('Falta YOUTUBE_API_KEY en .env.local');
  process.exit(1);
}

// ─── Importar catálogo (tsx soporta TS) ─────────────────────────────
import { FAMOUS_GOALS } from '../src/lib/wc-famous-goals';

// ─── Tipos ──────────────────────────────────────────────────────────
type YtSearchItem = {
  id: { videoId: string };
  snippet: {
    title: string;
    channelTitle: string;
    channelId: string;
    publishedAt: string;
  };
};

type YtVideoItem = {
  id: string;
  snippet: {
    title: string;
    channelTitle: string;
    channelId: string;
    publishedAt: string;
  };
  contentDetails: { duration: string };
  statistics: { viewCount?: string };
};

type EnrichedGoal = {
  slug: string;
  videoId: string;
  title: string;
  channelTitle: string;
  channelId: string;
  publishedAt: string;
  durationIso: string;
  durationSeconds: number;
  viewCount: number;
  score: number;
  needsReview: boolean;
  source: 'preset' | 'search';
};

// ─── YouTube API helpers ────────────────────────────────────────────
async function ytSearch(query: string): Promise<YtSearchItem[]> {
  const url = new URL('https://www.googleapis.com/youtube/v3/search');
  url.searchParams.set('part', 'snippet');
  url.searchParams.set('q', query);
  url.searchParams.set('type', 'video');
  url.searchParams.set('maxResults', '5');
  url.searchParams.set('videoEmbeddable', 'true');
  // Filtra vídeos reproducibles fuera de youtube.com (descarta geo-bloqueos
  // tipo FIFA "no disponible en tu país").
  url.searchParams.set('videoSyndicated', 'true');
  // Reproducibles desde España (audiencia principal). Cambia a 'MX' / 'US'
  // si la audiencia es otra. Sin este filtro, FIFA cuela vídeos bloqueados.
  url.searchParams.set('regionCode', 'ES');
  url.searchParams.set('key', YT_KEY!);
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`search.list ${res.status}: ${body.slice(0, 300)}`);
  }
  const data = (await res.json()) as { items: YtSearchItem[] };
  return data.items ?? [];
}

async function ytVideos(ids: string[]): Promise<YtVideoItem[]> {
  if (ids.length === 0) return [];
  const url = new URL('https://www.googleapis.com/youtube/v3/videos');
  url.searchParams.set('part', 'snippet,contentDetails,statistics');
  url.searchParams.set('id', ids.join(','));
  url.searchParams.set('key', YT_KEY!);
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`videos.list ${res.status}: ${body.slice(0, 300)}`);
  }
  const data = (await res.json()) as { items: YtVideoItem[] };
  return data.items ?? [];
}

/** ISO 8601 PT#M#S → segundos */
function isoDurationToSeconds(iso: string): number {
  const m = iso.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!m) return 0;
  return (+(m[1] || 0)) * 3600 + (+(m[2] || 0)) * 60 + (+(m[3] || 0));
}

// ─── Scoring ────────────────────────────────────────────────────────
// Canales de selección/federación: máximo valor (oficiales y rara vez
// geo-restringen su propio contenido histórico).
const SELECTION_RE =
  /\b(AFA|RFEF|DFB|FFF|CBF|KNVB|The FA|England Football|Selección|seleção)\b/i;
// FIFA y UEFA son oficiales PERO geo-restringen mucho. Damos boost menor
// y dejamos que el filtro regionCode=ES + videoSyndicated descarte los
// bloqueados antes incluso de llegar al scoring.
const FIFA_UEFA_RE = /\b(FIFA|UEFA|FIFATV|FIFA World Cup)\b/i;
// Medios establecidos con licencia (no geo-bloquean tanto en ES).
const MEDIA_RE = /\b(ESPN|FOX Sports|BBC Sport|ITV|RTVE|TyC Sports|Globo|beIN)\b/i;
const BAD_RE =
  /\b(short|tiktok|edit|tribute|fanmade|whatsapp|status|reaction|reaccion)\b/i;

function scoreCandidate(v: YtVideoItem, queryTokens: string[]): number {
  let s = 0;
  // Canal oficial de la selección > FIFA > medio establecido
  if (SELECTION_RE.test(v.snippet.channelTitle)) s += 70;
  else if (FIFA_UEFA_RE.test(v.snippet.channelTitle)) s += 25;
  else if (MEDIA_RE.test(v.snippet.channelTitle)) s += 35;
  // Penalización por contenido derivativo
  if (BAD_RE.test(v.snippet.title) || BAD_RE.test(v.snippet.channelTitle)) s -= 25;
  // Popularidad (log10 de views, max ~7 = 10M)
  const views = parseInt(v.statistics.viewCount ?? '0', 10);
  s += Math.min(Math.log10(views + 1), 8) * 4;
  // Match de tokens en título
  const titleLower = v.snippet.title.toLowerCase();
  for (const tok of queryTokens) {
    if (tok.length > 2 && titleLower.includes(tok)) s += 2;
  }
  // Duración razonable (10s - 5min). Penaliza highlights largos (>15min)
  const dur = isoDurationToSeconds(v.contentDetails.duration);
  if (dur > 10 && dur < 300) s += 10;
  if (dur > 900) s -= 10;
  return Math.round(s);
}

// ─── Main ───────────────────────────────────────────────────────────
const REVIEW_THRESHOLD = 35;

async function enrichOne(goal: (typeof FAMOUS_GOALS)[number]): Promise<EnrichedGoal | null> {
  // Caso 1: youtubeId ya definido → solo refresh metadata
  if (goal.youtubeId) {
    const [v] = await ytVideos([goal.youtubeId]);
    if (!v) {
      console.warn(`⚠️  [${goal.slug}] youtubeId ${goal.youtubeId} no responde (eliminado/privado)`);
      return null;
    }
    const durationSeconds = isoDurationToSeconds(v.contentDetails.duration);
    return {
      slug: goal.slug,
      videoId: v.id,
      title: v.snippet.title,
      channelTitle: v.snippet.channelTitle,
      channelId: v.snippet.channelId,
      publishedAt: v.snippet.publishedAt,
      durationIso: v.contentDetails.duration,
      durationSeconds,
      viewCount: parseInt(v.statistics.viewCount ?? '0', 10),
      score: 100,
      needsReview: false,
      source: 'preset',
    };
  }

  // Caso 2: solo query → search + score
  const candidates = await ytSearch(goal.youtubeQuery);
  if (candidates.length === 0) {
    console.warn(`⚠️  [${goal.slug}] sin resultados para "${goal.youtubeQuery}"`);
    return null;
  }
  const ids = candidates.map((c) => c.id.videoId);
  const videos = await ytVideos(ids);
  const queryTokens = goal.youtubeQuery.toLowerCase().split(/\s+/);
  const scored = videos
    .map((v) => ({ v, score: scoreCandidate(v, queryTokens) }))
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) return null;
  const best = scored[0];
  const durationSeconds = isoDurationToSeconds(best.v.contentDetails.duration);

  return {
    slug: goal.slug,
    videoId: best.v.id,
    title: best.v.snippet.title,
    channelTitle: best.v.snippet.channelTitle,
    channelId: best.v.snippet.channelId,
    publishedAt: best.v.snippet.publishedAt,
    durationIso: best.v.contentDetails.duration,
    durationSeconds,
    viewCount: parseInt(best.v.statistics.viewCount ?? '0', 10),
    score: best.score,
    needsReview: best.score < REVIEW_THRESHOLD,
    source: 'search',
  };
}

async function main() {
  console.log(`Enriqueciendo ${FAMOUS_GOALS.length} goles con YouTube API…\n`);
  const out: Record<string, EnrichedGoal> = {};
  const reviewQueue: EnrichedGoal[] = [];

  for (const g of FAMOUS_GOALS) {
    try {
      const enriched = await enrichOne(g);
      if (!enriched) continue;
      const mark = enriched.needsReview ? '⚠️ ' : '✅';
      console.log(
        `${mark} [${g.slug}]\n   → ${enriched.channelTitle} · ${enriched.title.slice(0, 70)}\n   videoId=${enriched.videoId}  views=${enriched.viewCount.toLocaleString()}  score=${enriched.score}\n`,
      );
      if (enriched.needsReview) {
        reviewQueue.push(enriched);
      } else {
        out[g.slug] = enriched;
      }
    } catch (err) {
      console.error(`❌ [${g.slug}]`, (err as Error).message);
    }
    // Pequeño respiro para no saturar la API
    await new Promise((r) => setTimeout(r, 250));
  }

  // Volcar sidecar (solo aprobados)
  const sidecarPath = resolve(process.cwd(), 'src/lib/wc-famous-goals.yt.json');
  writeFileSync(sidecarPath, JSON.stringify(out, null, 2) + '\n', 'utf8');
  console.log(`\n📝 Sidecar escrito: ${sidecarPath}`);
  console.log(`   ${Object.keys(out).length} goles aprobados automáticamente.`);

  if (reviewQueue.length > 0) {
    console.log(`\n🔍 ${reviewQueue.length} goles necesitan revisión manual:`);
    for (const r of reviewQueue) {
      console.log(
        `   - ${r.slug}\n     candidato: https://youtu.be/${r.videoId}  (score ${r.score}, canal "${r.channelTitle}")`,
      );
    }
    const reviewPath = resolve(process.cwd(), 'src/lib/wc-famous-goals.yt-review.json');
    writeFileSync(
      reviewPath,
      JSON.stringify(reviewQueue, null, 2) + '\n',
      'utf8',
    );
    console.log(`   Detalle en: ${reviewPath}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

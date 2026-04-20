/**
 * Seed curated YouTube videos from FIFA's official channel. Only
 * video IDs that were confirmed to exist through research are hardcoded.
 * The PressWall component handles `source='youtube'` via the existing
 * ArchiveVideos renderer (same pattern as archive.org).
 *
 * Usage: npx tsx scripts/seed-youtube-videos.ts
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const envFile = resolve(process.cwd(), '.env.local');
try {
  const content = readFileSync(envFile, 'utf8');
  for (const line of content.split('\n')) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*"?(.*?)"?\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

type YTVideo = {
  year: number;
  videoId: string;
  title_es: string;
  title_en?: string;
  featured?: boolean;
};

// Verified YouTube video IDs (from FIFA's official channel and affiliated uploads).
const VIDEOS: YTVideo[] = [
  // 2014
  { year: 2014, videoId: 'OUhE_FaJRqY', title_es: 'Brasil 2014 — Película oficial FIFA', title_en: '2014 FIFA World Cup | The Official Film', featured: true },
  { year: 2014, videoId: 'L6sbfskaTDQ', title_es: 'Partido completo: Brasil 1 — 7 Alemania · Mineirazo', title_en: 'Full match: Brazil 1-7 Germany' },
  { year: 2014, videoId: 'c0cUE-ePDEc', title_es: 'Top 10 goles del Mundial 2014', title_en: 'Top 10 goals 2014' },
  { year: 2014, videoId: 'JP67IM1LX-M', title_es: 'Ceremonia de apertura oficial 2014', title_en: 'Official TV opening 2014' },

  // 2018
  { year: 2018, videoId: 'MiAcU2DvbXM', title_es: 'Rusia 2018 — Película oficial FIFA', title_en: '2018 FIFA World Cup | The Official Film', featured: true },

  // 2022
  { year: 2022, videoId: 'Mxkg3qLIPC8', title_es: 'Argentina vs Francia — resumen oficial de la Final 2022', title_en: 'Argentina vs France Highlights | 2022 FIFA World Cup Final', featured: true },
  { year: 2022, videoId: 'lAJVri8pFn8', title_es: 'Final 2022 — tanda de penales completa', title_en: 'Full Penalty Shoot-out | Argentina vs France' },
  { year: 2022, videoId: 'wiiO9Fx5uLs', title_es: 'Argentina vs Países Bajos — penales en cuartos', title_en: 'Argentina vs Netherlands penalty shoot-out QF' },
  { year: 2022, videoId: '1F3vlnJXzKs', title_es: 'Argentina vs México · partido en 10 minutos', title_en: '10-Minute Match: Argentina vs Mexico' },

  // 2002
  { year: 2002, videoId: 'RRavTplKnkM', title_es: 'Todos los goles de las finales del Mundial (2002-2022)', title_en: 'Every FIFA World Cup Final Goal | 2002-2022' },

  // 2018 extras — FIFA's classic highlight collections
  { year: 2018, videoId: 'qqsaGPndVqY', title_es: 'Top 10 goles · Rusia 2018', title_en: 'Top 10 goals 2018' },

  // 1970 — famous FIFA archive uploads
  { year: 1970, videoId: 'F0AT7T1Afsk', title_es: 'Brasil 4 — 1 Italia · Final 1970', title_en: 'Brazil 4-1 Italy, 1970 Final' },

  // 1986 — Hand of God, Goal of the Century (FIFA / El Gráfico archives)
  { year: 1986, videoId: 'dEi5oRC3SEs', title_es: 'Maradona · el Gol del Siglo vs Inglaterra', title_en: 'Maradona Goal of the Century vs England', featured: true },

  // 1990 — classic
  { year: 1990, videoId: 'hEsbbvzOrDs', title_es: 'Italia 90 · resumen oficial', title_en: '1990 Italy highlights' },

  // 1998 — Zidane final
  { year: 1998, videoId: 'RYgrK2mOFCI', title_es: 'Francia 3 — 0 Brasil · Final 1998', title_en: 'France 3-0 Brazil, 1998 Final' },

  // 2006 — Zidane headbutt / Italy's penalty shoot-out
  { year: 2006, videoId: 'd2_ADG8pLzg', title_es: 'Italia 5 — 3 Francia · penales final 2006', title_en: 'Italy 5-3 France penalty shootout, 2006' },

  // 2010 — Iniesta goal
  { year: 2010, videoId: 'SvEwS-ppz8U', title_es: 'Iniesta · el gol que coronó a España (2010)', title_en: 'Iniesta\'s goal, 2010 Final', featured: true },
];

async function main() {
  console.log(`Seeding ${VIDEOS.length} YouTube videos…`);
  const rows = VIDEOS.map((v) => ({
    kind: 'video',
    source: 'youtube',
    source_id: v.videoId,
    url: `https://www.youtube.com/watch?v=${v.videoId}`,
    embed_url: `https://www.youtube-nocookie.com/embed/${v.videoId}`,
    thumbnail_url: `https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`,
    tournament_year: v.year,
    title_i18n: { es: v.title_es, ...(v.title_en ? { en: v.title_en } : {}) },
    license: 'embed-only',
    attribution: 'FIFA · YouTube',
    featured: !!v.featured,
  }));

  // Idempotent: remove existing rows with the same (source, source_id)
  await supabase
    .from('media')
    .delete()
    .eq('source', 'youtube')
    .in('source_id', rows.map((r) => r.source_id));

  const { error } = await supabase.from('media').insert(rows);
  if (error) throw error;

  const years = [...new Set(VIDEOS.map((v) => v.year))];
  console.log(`  ✓ ${rows.length} videos across ${years.length} World Cups.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

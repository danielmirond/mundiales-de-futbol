/**
 * Seed curated archive.org videos for historic World Cups.
 *
 * Usage: npx tsx scripts/seed-media-archive.ts
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

type Video = {
  year: number;
  identifier: string;
  title_es: string;
  title_en?: string;
  featured?: boolean;
  source?: 'archive.org' | 'youtube';
};

const VIDEOS: Video[] = [
  // 1958
  {
    year: 1958,
    identifier: 'wc58_20220910',
    title_es: 'Suecia 1958 — Película oficial FIFA',
    title_en: '1958 Sweden — FIFA World Cup Official Film',
    featured: true,
  },
  {
    year: 1958,
    identifier: 'world-cup-1958.-final-brazil-sweden-ru',
    title_es: 'Final 1958: Brasil — Suecia',
  },
  // 1962
  {
    year: 1962,
    identifier: 'world-cup-final-62',
    title_es: 'Final Chile 1962',
    featured: true,
  },
  {
    year: 1962,
    identifier: 'FifaFilmWorldCupChile1962ARABIC',
    title_es: 'Película oficial FIFA — Chile 1962',
  },
  // 1970
  {
    year: 1970,
    identifier: 'BoysFromBrazil',
    title_es: 'Boys From Brazil — historia de Brasil 1970 (BBC)',
    featured: true,
  },
  {
    year: 1970,
    identifier: '1970-fifa-world-cup-semi-final-brazil-uruguay',
    title_es: 'Semifinal 1970: Brasil — Uruguay',
  },
  {
    year: 1970,
    identifier: 'WorldCupFinal1970DigitsInThree',
    title_es: 'Final 1970: Brasil — Italia',
  },
  // 1974
  {
    year: 1974,
    identifier: '1974-fifa-world-cup-final-netherlands-vs-west-germany',
    title_es: 'Final 1974: Países Bajos — Alemania Occidental',
    featured: true,
  },
  {
    year: 1974,
    identifier: 'holandavsbrasil1974',
    title_es: 'Países Bajos — Brasil · Segunda fase 1974',
  },
  // 1978
  {
    year: 1978,
    identifier: '1978-fifa-world-cup-argentina-highlights-review',
    title_es: 'Argentina 1978 — resumen de Kempes y cía.',
    featured: true,
  },
  {
    year: 1978,
    identifier: '1978-fifa-world-cup-argentina-vs-france',
    title_es: '1978: Argentina — Francia',
  },
  // 1986
  {
    year: 1986,
    identifier: 'Maradona_201808',
    title_es: 'Maradona 1986 — el mejor gol de la historia del Mundial',
    featured: true,
  },
  {
    year: 1986,
    identifier: 'youtube-mOOeiave6U8',
    title_es: 'Héroes — película oficial del Mundial de México 1986',
    source: 'youtube',
  },
  // 1990
  {
    year: 1990,
    identifier: 'heroes-ii-italia-90-hd-audio-latino',
    title_es: 'Heroes II — película oficial Italia 90 (audio latino)',
    featured: true,
  },
  // 1998
  {
    year: 1998,
    identifier: 'lbry-60c45cb64b2628a24c366181fa156ebf0bf5c018',
    title_es: 'Argentina — Inglaterra · Octavos Francia 98',
    featured: true,
  },
  {
    year: 1998,
    identifier: 'chile-v-italy-fifa-world-cup-france-1998-994035108575',
    title_es: '1998: Chile — Italia',
  },
  // 2002
  {
    year: 2002,
    identifier: 'brasil-vs-alemania-final-copa-mundial-de-futbol-2002-partido-completofull-match-',
    title_es: 'Final 2002: Brasil — Alemania (partido completo)',
    featured: true,
  },
  // 2006
  {
    year: 2006,
    identifier: 'italia-x-franca-final-da-copa-2006',
    title_es: 'Final 2006: los penales de Italia — Francia',
    featured: true,
  },
  // 2010
  {
    year: 2010,
    identifier: '2340292-wk-finale-2010-de-karatetrap-de-teen-van-casillas-en-de-dreun-van-iniesta',
    title_es: 'Final 2010: la patada, el dedo de Casillas y el gol de Iniesta',
    featured: true,
  },
  // 2014
  {
    year: 2014,
    identifier: 'brazil-vs-germany-2014-fifa-world-cup',
    title_es: 'Semifinal 2014: Brasil 1 — 7 Alemania · Mineirazo',
    featured: true,
  },
];

function embedUrl(identifier: string) {
  return `https://archive.org/embed/${identifier}`;
}
function thumbnailUrl(identifier: string) {
  return `https://archive.org/services/img/${identifier}`;
}

async function main() {
  console.log(`Seeding ${VIDEOS.length} archive.org videos…`);

  const rows = VIDEOS.map((v) => ({
    kind: 'video',
    source: v.source ?? 'archive.org',
    source_id: v.identifier,
    url: `https://archive.org/details/${v.identifier}`,
    embed_url: embedUrl(v.identifier),
    thumbnail_url: thumbnailUrl(v.identifier),
    tournament_year: v.year,
    title_i18n: { es: v.title_es, ...(v.title_en ? { en: v.title_en } : {}) },
    license: 'mixed',
    attribution: 'Internet Archive',
    featured: !!v.featured,
  }));

  // Clear old archive.org rows for these years to keep idempotent
  const years = [...new Set(VIDEOS.map((v) => v.year))];
  await supabase
    .from('media')
    .delete()
    .eq('source', 'archive.org')
    .in('tournament_year', years);

  const { error } = await supabase.from('media').insert(rows);
  if (error) throw error;

  console.log(`  ✓ Inserted ${rows.length} videos across ${years.length} mundials.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

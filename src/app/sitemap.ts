import type { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';
import { TOURNAMENTS } from '@/lib/tournaments';
import { HISTORIAS } from '@/lib/historias';
import { SEDES_2026 } from '@/lib/wc-2026-sedes';
import { GROUPS_2026 } from '@/lib/wc-2026';
import { NEWS_ITEMS } from '@/lib/news';
import { SQUADS_2026 } from '@/lib/wc-2026-squads';
import { JERSEY_HISTORIES } from '@/lib/wc-jerseys';
import { routing } from '@/i18n/routing';

/**
 * Páginas de récords disponibles en /records/[slug]. Lista cerrada
 * porque son páginas explícitas con su propio file en `src/app`.
 */
const RECORD_PAGES = [
  'maximos-goleadores',
  'mas-amarillas',
  'mas-rojas',
  'mas-minutos',
  'mas-mundiales-jugados',
  'goles-en-propia',
  'selecciones-mas-tarjetas',
] as const;

// Defensive `.trim()`: una env var con `\n` accidental rompía cada `<loc>`
// del sitemap → 11k errores en GSC. Nunca más.
const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mundiales-de-futbol.com').trim();

type Row = { slug?: string; code?: string; tournament_year?: number; match_number?: number };

async function fetchRows(path: string): Promise<Row[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    const supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const all: Row[] = [];
    let from = 0;
    const page = 1000;
    while (true) {
      const q = supabase.from(path).select('*').range(from, from + page - 1);
      const { data, error } = await q;
      if (error || !data || data.length === 0) break;
      all.push(...(data as Row[]));
      if (data.length < page) break;
      from += page;
    }
    return all;
  } catch {
    return [];
  }
}

function localeHref(locale: string, path: string): string {
  if (locale === routing.defaultLocale) return `${SITE}${path}`;
  return `${SITE}/${locale}${path === '/' ? '' : path}`;
}

function entry(
  path: string,
  lastMod: Date,
  changeFreq: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly',
  priority = 0.5,
): MetadataRoute.Sitemap[number] {
  return {
    url: `${SITE}${path}`,
    lastModified: lastMod,
    changeFrequency: changeFreq,
    priority,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, localeHref(l, path)]),
      ),
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const out: MetadataRoute.Sitemap = [];

  // Static routes
  out.push(entry('/', now, 'daily', 1.0));
  out.push(entry('/ediciones', now, 'weekly', 0.9));
  out.push(entry('/jugadores', now, 'weekly', 0.9));
  out.push(entry('/selecciones', now, 'weekly', 0.9));
  out.push(entry('/estadios', now, 'weekly', 0.8));
  out.push(entry('/2026', now, 'daily', 0.95));
  out.push(entry('/2026/entradas', now, 'daily', 0.9));
  out.push(entry('/2026/donde-ver', now, 'daily', 0.9));
  out.push(entry('/2026/fan-zone', now, 'weekly', 0.85));
  out.push(entry('/2026/sedes', now, 'weekly', 0.9));
  out.push(entry('/2026/grupos', now, 'weekly', 0.9));
  out.push(entry('/2026/calendario', now, 'weekly', 0.9));
  out.push(entry('/2026/convocatorias', now, 'daily', 0.9));
  out.push(entry('/2026/listas', now, 'daily', 0.9));
  out.push(entry('/2026/mascotas', now, 'monthly', 0.8));
  out.push(entry('/coleccionismo/panini-mundial-2026', now, 'weekly', 0.95));
  // Cluster Panini Mundial 2026 (sub-páginas pilar)
  out.push(entry('/coleccionismo/panini-mundial-2026/precio', now, 'weekly', 0.85));
  out.push(entry('/coleccionismo/panini-mundial-2026/donde-comprar', now, 'weekly', 0.85));
  out.push(entry('/coleccionismo/panini-mundial-2026/cuando-sale', now, 'weekly', 0.8));
  out.push(entry('/coleccionismo/panini-mundial-2026/digital', now, 'weekly', 0.8));
  out.push(entry('/coleccionismo/panini-mundial-2026/tapa-dura', now, 'monthly', 0.75));
  out.push(entry('/coleccionismo/panini-mundial-2026/cromos-mas-caros', now, 'weekly', 0.85));
  out.push(entry('/coleccionismo/panini-mundial-2026/figurinhas-copa-2026', now, 'weekly', 0.9));
  out.push(entry('/coleccionismo/panini-mundial-2026/coca-cola', now, 'weekly', 0.8));
  out.push(entry('/coleccionismo/panini-mundial-2026/topps-vs-panini', now, 'monthly', 0.7));
  out.push(entry('/selecciones/ESP/grupo-h', now, 'weekly', 0.9));
  out.push(entry('/historias', now, 'daily', 0.9));
  out.push(entry('/galeria', now, 'weekly', 0.85));
  out.push(entry('/aviso-afiliados', now, 'monthly', 0.4));
  out.push(entry('/palmares', now, 'weekly', 0.9));
  out.push(entry('/records', now, 'weekly', 0.85));
  out.push(entry('/contacto', now, 'yearly', 0.3));
  out.push(entry('/privacidad', now, 'yearly', 0.2));
  out.push(entry('/cookies', now, 'yearly', 0.2));

  // Editions
  for (const t of TOURNAMENTS) {
    out.push(entry(`/ediciones/${t.slug}`, now, 'monthly', 0.8));
  }

  // Sedes 2026
  for (const s of SEDES_2026) {
    out.push(entry(`/2026/sedes/${s.citySlug}`, now, 'weekly', 0.85));
  }

  // Listas 2026 (48 selecciones)
  for (const sq of SQUADS_2026) {
    out.push(entry(`/2026/listas/${sq.teamCode}`, now, 'daily', 0.8));
  }

  // Camisetas por selección (cluster editorial)
  for (const h of JERSEY_HISTORIES) {
    out.push(entry(`/selecciones/${h.teamCode}/camisetas`, now, 'monthly', 0.8));
  }

  // Grupos 2026 (A-L)
  for (const g of GROUPS_2026) {
    out.push(entry(`/2026/grupo/${g.letter}`, now, 'weekly', 0.8));
  }

  // Records detallados
  for (const slug of RECORD_PAGES) {
    out.push(entry(`/records/${slug}`, now, 'weekly', 0.7));
  }

  // Historias (calendario editorial)
  for (const h of HISTORIAS) {
    out.push(entry(`/historias/${h.slug}`, new Date(h.publishDate), 'monthly', 0.7));
  }

  // Noticias del Mundial 2026 (cobertura editorial diaria)
  out.push(entry('/noticias', now, 'daily', 0.9));
  for (const n of NEWS_ITEMS) {
    out.push(entry(`/noticias/${n.slug}`, new Date(n.publishedAt), 'weekly', 0.75));
  }

  // Matches
  const matches = await fetchRows('matches');
  for (const m of matches) {
    const year = m.tournament_year;
    const num = m.match_number;
    if (!year || !num) continue;
    const t = TOURNAMENTS.find((t) => t.year === year);
    if (!t) continue;
    out.push(entry(`/ediciones/${t.slug}/partido/${num}`, now, 'yearly', 0.5));
  }

  // Players
  const players = await fetchRows('players');
  for (const p of players) {
    if (!p.slug) continue;
    out.push(entry(`/jugadores/${p.slug}`, now, 'monthly', 0.6));
  }

  // Teams (use code as slug)
  const teams = await fetchRows('teams');
  for (const team of teams) {
    if (!team.code) continue;
    out.push(entry(`/selecciones/${team.code}`, now, 'monthly', 0.6));
  }

  // Venues
  const venues = await fetchRows('venues');
  for (const v of venues) {
    if (!v.slug) continue;
    out.push(entry(`/estadios/${v.slug}`, now, 'monthly', 0.5));
  }

  return out;
}

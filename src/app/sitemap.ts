import type { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';
import { TOURNAMENTS } from '@/lib/tournaments';
import { HISTORIAS } from '@/lib/historias';
import { routing } from '@/i18n/routing';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mundiales-de-futbol.com';

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
  out.push(entry('/historias', now, 'daily', 0.9));
  out.push(entry('/palmares', now, 'weekly', 0.9));
  out.push(entry('/records', now, 'weekly', 0.85));
  out.push(entry('/contacto', now, 'yearly', 0.3));
  out.push(entry('/privacidad', now, 'yearly', 0.2));
  out.push(entry('/cookies', now, 'yearly', 0.2));

  // Editions
  for (const t of TOURNAMENTS) {
    out.push(entry(`/ediciones/${t.slug}`, now, 'monthly', 0.8));
  }

  // Historias (calendario editorial)
  for (const h of HISTORIAS) {
    out.push(entry(`/historias/${h.slug}`, new Date(h.publishDate), 'monthly', 0.7));
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

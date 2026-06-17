import type { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';
import { TOURNAMENTS } from '@/lib/tournaments';
import { HISTORIAS } from '@/lib/historias';
import { SEDES_2026 } from '@/lib/wc-2026-sedes';
import { GROUPS_2026, FIXTURES_2026, matchSlug } from '@/lib/wc-2026';
import { allHeadToHeadSlugs } from '@/lib/wc-head-to-head';
import { NEWS_ITEMS } from '@/lib/news';
import { SQUADS_2026 } from '@/lib/wc-2026-squads';
import { JERSEY_HISTORIES } from '@/lib/wc-jerseys';
import { HOSPITALITY_CITIES, FMT_TEAM_PARAMS } from '@/lib/wc-2026-hospitality';
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
  'goles-por-seleccion',
  'mundiales-por-pais',
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
  /**
   * @deprecated Mantenemos por compat: si true, NO emite alternates.
   * Equivale a pasar availableLocales = ['es'].
   */
  esOnly = false,
  /**
   * Locales con contenido REAL traducido. Por defecto sólo ES.
   * Sólo se emiten `<xhtml:link>` alternates para los locales listados.
   * NUNCA pases locales sin traducción real — Google penaliza hreflang
   * apuntando a contenido duplicado.
   */
  availableLocales: readonly string[] = ['es'],
): MetadataRoute.Sitemap[number] {
  const locales = esOnly ? ['es'] : availableLocales;
  return {
    url: `${SITE}${path}`,
    lastModified: lastMod,
    changeFrequency: changeFreq,
    priority,
    // Sólo emite alternates si hay más de un locale real.
    ...(locales.length > 1
      ? {
          alternates: {
            languages: Object.fromEntries(
              locales.map((l) => [l, localeHref(l, path)]),
            ),
          },
        }
      : {}),
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
  out.push(entry('/2026/amistosos', now, 'daily', 0.9));
  out.push(entry('/2026/cuando-empieza', now, 'weekly', 0.9));
  out.push(entry('/cuando-juega-espana', now, 'daily', 0.9));
  out.push(entry('/2026/partidos-hoy', now, 'daily', 0.95));
  // Página por partido (104)
  for (const f of FIXTURES_2026) {
    out.push(entry(`/2026/partido/${matchSlug(f)}`, now, 'daily', 0.8));
  }
  // Head-to-head (cara a cara) entre selecciones en los Mundiales (es).
  for (const slug of allHeadToHeadSlugs()) {
    out.push(entry(`/historial/${slug}`, now, 'monthly', 0.6));
  }
  out.push(entry('/2026/cuadro', now, 'weekly', 0.9));
  // Hub Dónde ver por país
  out.push(entry('/2026/donde-ver/mexico', now, 'weekly', 0.9));
  out.push(entry('/2026/donde-ver/brasil', now, 'weekly', 0.9, false, ['pt']));
  out.push(entry('/2026/donde-ver/usa', now, 'weekly', 0.9, false, ['es', 'en']));
  out.push(entry('/2026/donde-ver/argentina', now, 'weekly', 0.9));
  out.push(entry('/2026/donde-ver/colombia', now, 'weekly', 0.85));
  out.push(entry('/2026/donde-ver/chile', now, 'weekly', 0.85));
  out.push(entry('/2026/donde-ver/reino-unido', now, 'weekly', 0.9, false, ['en']));
  out.push(entry('/2026/donde-ver/francia', now, 'weekly', 0.9, false, ['fr']));
  out.push(entry('/2026/donde-ver/alemania', now, 'weekly', 0.9));
  out.push(entry('/legal/terminos', now, 'monthly', 0.3));
  out.push(entry('/2026/sub-17-qatar', now, 'weekly', 0.85));
  out.push(entry('/2030', now, 'monthly', 0.85));
  out.push(entry('/goles-famosos', now, 'monthly', 0.9));
  out.push(entry('/2026/favoritos-ganar-mundial', now, 'weekly', 0.95));
  out.push(entry('/2026/convocatorias', now, 'daily', 0.9));
  out.push(entry('/2026/listas', now, 'daily', 0.9));
  out.push(entry('/2026/mascotas', now, 'monthly', 0.8));
  // Cluster Normas Estadios Mundial 2026 (pillar + 6 sub-páginas)
  out.push(entry('/2026/normas-estadios', now, 'weekly', 0.95, true));
  out.push(entry('/2026/normas-estadios/mochila-transparente', now, 'weekly', 0.85, true));
  out.push(entry('/2026/normas-estadios/items-prohibidos', now, 'weekly', 0.85, true));
  out.push(entry('/2026/normas-estadios/que-puedes-llevar', now, 'weekly', 0.85, true));
  out.push(entry('/2026/normas-estadios/alcohol-por-pais', now, 'weekly', 0.85, true));
  out.push(entry('/2026/normas-estadios/banderas-y-mensajes', now, 'weekly', 0.85, true));
  out.push(entry('/2026/normas-estadios/sanciones', now, 'weekly', 0.8, true));
  // Cluster Hospitality Mundial 2026 (pillar + 6 fijas + 2 índices)
  out.push(entry('/2026/hospitality', now, 'weekly', 0.95, true));
  out.push(entry('/2026/hospitality/productos', now, 'weekly', 0.9, true));
  out.push(entry('/2026/hospitality/precios', now, 'weekly', 0.9, true));
  out.push(entry('/2026/hospitality/private-suites', now, 'weekly', 0.85, true));
  out.push(entry('/2026/hospitality/faq', now, 'weekly', 0.75, true));
  out.push(entry('/2026/hospitality/sedes', now, 'weekly', 0.9, true));
  out.push(entry('/2026/hospitality/selecciones', now, 'weekly', 0.9, true));
  for (const c of HOSPITALITY_CITIES) {
    out.push(entry(`/2026/hospitality/sedes/${c.citySlug}`, now, 'weekly', 0.8, true));
  }
  for (const code of Object.keys(FMT_TEAM_PARAMS)) {
    out.push(entry(`/2026/hospitality/selecciones/${code}`, now, 'weekly', 0.75, true));
  }
  out.push(entry('/coleccionismo/panini-mundial-2026', now, 'weekly', 0.95, true));
  out.push(entry('/coleccionismo/lego-mundial-2026', now, 'weekly', 0.9));
  // Cluster Panini Mundial 2026 (sub-páginas pilar)
  out.push(entry('/coleccionismo/panini-mundial-2026/precio', now, 'weekly', 0.85, true));
  out.push(entry('/coleccionismo/panini-mundial-2026/donde-comprar', now, 'weekly', 0.85, true));
  out.push(entry('/coleccionismo/panini-mundial-2026/cuando-sale', now, 'weekly', 0.8, true));
  out.push(entry('/coleccionismo/panini-mundial-2026/digital', now, 'weekly', 0.8, true));
  out.push(entry('/coleccionismo/panini-mundial-2026/tapa-dura', now, 'monthly', 0.75, true));
  out.push(entry('/coleccionismo/panini-mundial-2026/cromos-mas-caros', now, 'weekly', 0.85, true));
  out.push(entry('/coleccionismo/panini-mundial-2026/figurinhas-copa-2026', now, 'weekly', 0.9, true));
  out.push(entry('/coleccionismo/panini-mundial-2026/cuantos-cromos-tiene', now, 'weekly', 0.9, true));
  out.push(entry('/coleccionismo/panini-mundial-2026/caja-50-sobres', now, 'weekly', 0.85, true));
  out.push(entry('/coleccionismo/panini-mundial-2026/edicion-dorada', now, 'weekly', 0.8, true));
  out.push(entry('/coleccionismo/panini-mundial-2026/check-list-cromos', now, 'weekly', 0.8, true));
  out.push(entry('/coleccionismo/panini-mundial-2026/donde-comprar/mexico', now, 'weekly', 0.85, true));
  out.push(entry('/coleccionismo/panini-mundial-2026/donde-comprar/brasil', now, 'weekly', 0.85, true));
  out.push(entry('/coleccionismo/panini-mundial-2026/donde-comprar/usa', now, 'weekly', 0.85, true));
  out.push(entry('/coleccionismo/panini-mundial-2026/coca-cola', now, 'weekly', 0.8, true));
  out.push(entry('/coleccionismo/panini-mundial-2026/topps-vs-panini', now, 'monthly', 0.7, true));
  out.push(entry('/coleccionismo/monedas-mundial-2026', now, 'weekly', 0.95, true));
  out.push(entry('/coleccionismo/monedas-mundial-2026/donde-comprar', now, 'weekly', 0.85, true));
  out.push(entry('/coleccionismo/monedas-mundial-2026/precio', now, 'weekly', 0.85, true));
  out.push(entry('/coleccionismo/monedas-mundial-2026/oro', now, 'weekly', 0.85, true));
  out.push(entry('/coleccionismo/monedas-mundial-2026/plata', now, 'weekly', 0.85, true));
  out.push(entry('/coleccionismo/monedas-mundial-2026/banxico', now, 'weekly', 0.85, true));
  out.push(entry('/coleccionismo/monedas-mundial-2026/canada', now, 'weekly', 0.8, true));
  // Equipamiento audiovisual (TVs + proyectores con afiliación Amazon)
  out.push(entry('/coleccionismo/televisores-mundial-2026', now, 'weekly', 0.9, true));
  out.push(entry('/coleccionismo/proyectores-mundial-2026', now, 'weekly', 0.85, true));
  // Cluster Camisetas Mundial 2026 (pillar + 5 sub-páginas)
  out.push(entry('/coleccionismo/camisetas-mundial-2026', now, 'weekly', 0.95, true));
  out.push(entry('/coleccionismo/camisetas-mundial-2026/comprar', now, 'weekly', 0.9, true));
  out.push(entry('/coleccionismo/camisetas-mundial-2026/precio', now, 'weekly', 0.9, true));
  out.push(entry('/coleccionismo/camisetas-mundial-2026/authentic-vs-replica', now, 'weekly', 0.85, true));
  out.push(entry('/coleccionismo/camisetas-mundial-2026/tallas', now, 'weekly', 0.85, true));
  out.push(entry('/coleccionismo/camisetas-mundial-2026/falsificaciones', now, 'weekly', 0.85, true));
  out.push(entry('/selecciones/ESP/grupo-h', now, 'weekly', 0.9, true));
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
    // availableLocales = es siempre + los que tengan i18n rellenado.
    const locales = ['es', ...Object.keys(n.i18n ?? {})];
    out.push(
      entry(
        `/noticias/${n.slug}`,
        new Date(n.publishedAt),
        'weekly',
        0.75,
        false,
        locales,
      ),
    );
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

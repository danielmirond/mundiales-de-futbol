/**
 * Imágenes con licencia desde Wikimedia Commons para las piezas diarias.
 *
 * Reglas del manual Discover que aplica: IM1 (≥1200 px), IM3 (derechos:
 * solo CC0/dominio público/CC BY/CC BY-SA, nunca NC/ND), IM9 (crédito y alt
 * descriptivo), IM11 (foto real, no escudos ni banderas). Devuelve null antes
 * que una imagen dudosa: sin foto, la pieza sale con la tarjeta de marca.
 */

export type CommonsImage = {
  url: string;        // derivada 1600 px (JPEG) → < 200 KB en la mayoría de casos
  width: number;
  height: number;
  alt: string;
  credit: string;     // "Autor · CC BY-SA 4.0 · Wikimedia Commons"
  license: string;
  page: string;       // URL de la página del fichero en Commons
};

const API = 'https://commons.wikimedia.org/w/api.php';
const UA = 'mundiales-de-futbol.com (bot editorial; contacto@mundiales-de-futbol.com)';
const OK_LICENSE = /^(cc0|public domain|pd|cc by(-sa)?( \d(\.\d)?)?)$/i;

function strip(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

/**
 * Alias de sedes: ESPN usa el nombre comercial o una variante (y algún typo),
 * Commons titula por el nombre histórico. Se buscan en orden hasta acertar.
 */
const VENUE_ALIASES: Record<string, string[]> = {
  'estadio la cartuja': ['Estadio Olímpico de Sevilla', 'La Cartuja Sevilla'],
  'reale arena': ['Anoeta', 'Estadio de Anoeta'],
  'el sardineros': ['El Sardinero', 'Estadios de El Sardinero'],
  'el sardinero': ['Estadios de El Sardinero'],
  'riyadh air metropolitano': ['Estadio Metropolitano Madrid', 'Wanda Metropolitano'],
  'spotify camp nou': ['Camp Nou'],
  'estadio santiago bernabeu': ['Santiago Bernabéu'],
  'coliseum alfonso perez': ['Coliseum Alfonso Pérez'],
  'estadio de mestalla': ['Mestalla'],
  'estadio de vallecas': ['Vallecas'],
  'estadio el sadar': ['El Sadar'],
  'abanca balaidos': ['Balaídos'],
  'estadio de gran canaria': ['Gran Canaria stadium'],
  'san mames': ['San Mamés'],
  'etihad stadium': ['City of Manchester Stadium'],
  'tottenham hotspur stadium': ['Tottenham Hotspur Stadium'],
};

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();

/** Consultas a probar: nombre tal cual, alias conocidos y sin patrocinador delante. */
function queriesFor(query: string): string[] {
  const qs = [query, ...(VENUE_ALIASES[norm(query)] ?? [])];
  const sinSponsor = query.replace(/^(riyadh air|spotify|abanca|reale|cívitas|civitas|mutua|coliseum)\s+/i, '');
  if (sinSponsor !== query) qs.push(sinSponsor);
  return [...new Set(qs)];
}

/**
 * Mejor foto para una sede (p. ej. "Estadio Benito Villamarín"): bitmap JPEG,
 * licencia libre, ≥1200 px, apaisada y con el nombre en el título del fichero.
 * Prueba también los alias. `avoid` evita repetir foto entre piezas (IM10).
 */
export async function findImage(query: string, altText: string, avoid: Set<string> = new Set()): Promise<CommonsImage | null> {
  for (const q of queriesFor(query)) {
    const img = await searchOne(q, altText, avoid);
    if (img) return img;
  }
  return null;
}

async function searchOne(query: string, altText: string, avoid: Set<string>): Promise<CommonsImage | null> {
  const params = new URLSearchParams({
    action: 'query', format: 'json', generator: 'search', gsrnamespace: '6', gsrlimit: '12',
    gsrsearch: `${query} filetype:bitmap`,
    prop: 'imageinfo', iiprop: 'url|size|extmetadata|mime', iiurlwidth: '1600',
  });
  let pages: any[] = [];
  try {
    const res = await fetch(`${API}?${params}`, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(15000) });
    if (!res.ok) return null;
    const j = await res.json();
    pages = Object.values(j.query?.pages ?? {});
  } catch {
    return null;
  }

  const needle = norm(query);
  const scored = pages
    .map((p) => {
      const ii = p.imageinfo?.[0];
      if (!ii) return null;
      const m = ii.extmetadata ?? {};
      const license = strip(String(m.LicenseShortName?.value ?? ''));
      const artist = strip(String(m.Artist?.value ?? '')) || 'Wikimedia Commons';
      const title = String(p.title ?? '').replace(/^File:/, '');
      const w = Number(ii.width), h = Number(ii.height);
      if (!OK_LICENSE.test(license)) return null;
      if (ii.mime !== 'image/jpeg' || !(w >= 1200) || w <= h) return null;
      if (avoid.has(ii.thumburl ?? ii.url)) return null;
      const t = title.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
      // Puntuación: nombre en el título > apaisada (16:9 ideal) > resolución > sin "satellite/map/logo".
      const ratio = w / h;
      let score = 0;
      if (needle.split(' ').filter((x) => x.length > 3).every((x) => t.includes(x))) score += 5;
      score += ratio >= 1.4 && ratio <= 2 ? 3 : ratio > 1 ? 1 : 0;
      score += Math.min(w, 4000) / 2000;
      if (/satellite|mapa|map|logo|escudo|plano|ticket|entrada/i.test(title)) score -= 6;
      return { score, img: {
        url: String(ii.thumburl ?? ii.url),
        width: Number(ii.thumbwidth ?? w), height: Number(ii.thumbheight ?? h),
        alt: altText,
        credit: `${artist} · ${license} · Wikimedia Commons`,
        license,
        page: String(ii.descriptionurl ?? ''),
      } as CommonsImage };
    })
    .filter(Boolean) as { score: number; img: CommonsImage }[];

  scored.sort((a, b) => b.score - a.score);
  // Estricto: si el título del fichero no contiene el nombre buscado, no hay
  // foto (antes la tarjeta de marca que una sede equivocada).
  const best = scored[0];
  return best && best.score >= 5 ? best.img : null;
}

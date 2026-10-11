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
 * Mejor foto para una consulta (p. ej. "Estadio Benito Villamarín"):
 * bitmap JPEG, licencia libre, ≥1200 px, apaisada, título que contenga la
 * consulta. `avoid` evita repetir la misma foto entre piezas (IM10).
 */
export async function findImage(query: string, altText: string, avoid: Set<string> = new Set()): Promise<CommonsImage | null> {
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

  const needle = query.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
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
  return scored[0]?.img ?? null;
}

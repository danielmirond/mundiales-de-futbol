import pin from '../data/apertura.json';
import { getLatestNews, getNewsBySlug, newsKind, type NewsItem } from './news';

/** Sección donde abre la noticia: portada, un deporte o una competición. */
export type AperturaScope = { sport?: string; competition?: string };

type Pin = { slug: string | null; hasta: string | null };
const HOUR = 3_600_000;
const DAY = 24 * HOUR;
/** Cuántas piezas recientes se turnan en la apertura (una por hora). */
const ROTATION = 6;

/** Clave de la sección en `apertura.json`: `portada`, `futbol` o `futbol/laliga`. */
export const scopeKey = ({ sport, competition }: AperturaScope = {}) =>
  sport ? (competition ? `${sport}/${competition}` : sport) : 'portada';

const inScope = (n: NewsItem, { sport, competition }: AperturaScope) =>
  (!sport || (n.competition?.sport ?? 'futbol') === sport) && (!competition || n.competition?.slug === competition);

/**
 * Apertura de una sección: la noticia que la abre.
 * Manual: `src/data/apertura.json` → `{ "futbol/laliga": { "slug": "...", "hasta": "2026-10-21T23:59:00+02:00" } }`
 * (sin `hasta`, fija hasta que se cambie). Si no hay fijada, ROTA cada hora entre
 * las seis más recientes de la sección con foto propia que no sean agenda ni
 * clasificación. Solo entran piezas recientes (portada 2 días, deporte 3,
 * competición 7): una apertura vieja envejece la sección, mejor no poner nada.
 */
export function getApertura(scope: AperturaScope = {}): NewsItem | undefined {
  const pins = pin as Record<string, Pin | undefined>;
  const p = pins[scopeKey(scope)];
  if (p?.slug && (!p.hasta || Date.parse(p.hasta) > Date.now())) {
    const n = getNewsBySlug(p.slug);
    if (n && Date.parse(n.publishedAt) <= Date.now()) return n;
  }
  // Candidatas: las recientes de la sección con foto propia, sin agenda ni clasificación.
  const maxAge = scope.competition ? 7 * DAY : scope.sport ? 3 * DAY : 2 * DAY;
  const fresh = getLatestNews(scope.sport ? 400 : 60).filter((n) => inScope(n, scope) && Date.now() - Date.parse(n.publishedAt) <= maxAge);
  const pool = fresh.filter((n) => n.image?.url && !['agenda', 'clasificacion'].includes(newsKind(n))).slice(0, ROTATION);
  if (pool.length === 0) return scope.sport ? undefined : getLatestNews(1)[0];
  // Rota cada hora entre las candidatas (cambia en la siguiente regeneración ISR).
  return pool[Math.floor(Date.now() / HOUR) % pool.length];
}

/** Quita el marcado markdown en línea (enlaces, negritas, cursivas). */
const plain = (s: string) =>
  s
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Párrafo de preview: la entradilla real de la pieza (primer párrafo de texto del
 * cuerpo, sin titulillos, listas, citas ni tablas), cortado en frase hasta ~340
 * caracteres. Si el cuerpo no da una entradilla útil, el resumen.
 */
export function leadParagraph(n: NewsItem, max = 340): string {
  const first = n.body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .find((p) => p && !/^(#|>|[-*+] |\d+\. |\||<)/.test(p));
  const text = first ? plain(first) : '';
  if (text.length < 80) return n.summary;
  if (text.length <= max) return text;
  const sentences = text.match(/[^.!?…]+[.!?…]+(?:[»”"])?\s*/g) ?? [text];
  let out = '';
  for (const s of sentences) {
    if ((out + s).trim().length > max) break;
    out += s;
  }
  out = out.trim();
  if (out.length >= 80) return out;
  return `${text.slice(0, max).replace(/\s+\S*$/, '')}…`;
}

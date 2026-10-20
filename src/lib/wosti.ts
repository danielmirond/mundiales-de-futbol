/**
 * Canales de TV por partido (fútbol) a partir del feed WOSTI.
 *
 * Portado de guia-tv (lib/wosti.ts + lib/canal-partido.ts). Aquí NO se pide
 * el feed en runtime: se lee src/data/wosti-snapshot.json, que GitHub Actions
 * refresca una vez al día (scripts/wosti/snapshot.mjs) copiando el snapshot de
 * Guía TV. Así la web no gasta la cuota de RapidAPI que usa Guía TV.
 *
 * Emparejado con ESPN por FECHA (Madrid) + los DOS equipos normalizados; nunca
 * por un solo equipo (la repetición del partido iría a parar al canal
 * equivocado). WOSTI es un feed mundial: se filtra a lo que se emite en
 * España, y "Canal por confirmar" se trata como ausencia (antes callar que
 * mentir).
 */
import snapshot from '@/data/wosti-snapshot.json';

type RawEvent = {
  Id?: number | string;
  Date?: string;
  LocalTeam?: { Name?: string };
  AwayTeam?: { Name?: string };
  Competition?: { Name?: string };
  Channels?: { Name?: string }[];
};

const MADRID = 'Europe/Madrid';
const madridDate = (iso: string) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: MADRID, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(iso));

// ── Filtro "se emite en España" (autocontenido; guia-tv usa su catálogo onedata) ──
const PLATAFORMAS_ES =
  /^(laliga tv|dazn|m\+|movistar|gol|eurosport|esport|tv3|etb|a punt|tvg|canal sur|aragon|telemadrid|ib3|tv canaria|real madrid tv|barca tv|rtve|la 1|la 2|teledeporte|tdp|cuatro|telecinco|antena 3|lasexta|mediaset|atresmedia|orange|vamos|#vamos|liga de campeones|ellas)/;

function limpiaCanal(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\s*:\s*ver partido\s*$/i, '')
    .replace(/\s*\((?:(?:[A-Z]?\d+(?:\s*(?:y|,)\s*\d+)?\s*)+|ver en directo|acceder|s[ií]guelo en directo|ver gratis)\)/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}
const emitidoEnEspana = (canales: { Name?: string }[]) =>
  canales.some((c) => PLATAFORMAS_ES.test(limpiaCanal(String(c.Name ?? ''))));

/** Nombre limpio para mostrar (sin diales ni coletillas; conserva regionales). */
function nombreCanal(raw: string): string {
  return raw
    .replace(/\s*:\s*ver partido\s*$/i, '')
    .replace(/\s*\((?:(?:[A-Z]?\d+(?:\s*(?:y|,)\s*\d+)?\s*)+|ver en directo|acceder|s[ií]guelo en directo|ver gratis)\)/gi, '')
    .trim();
}

// ── Normalización de equipos (ESPN escribe entero; WOSTI abrevia) ──
function claveEquipo(nombre: string): string {
  const base = nombre
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const sinPrefijos = base
    .replace(/\b(fc|cf|rc|rcd|ca|sd|ud|cd|sc|ad|club|de|real|deportivo|athletic|atletico|afc|cfc)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return sinPrefijos || base;
}
/** Clave normalizada de equipo (sin prefijos ni acentos) para cruzar feeds. */
export function normaliza(nombre: string): string {
  const expandido = nombre
    .toLowerCase()
    .replace(/\bat\.?\s/g, 'atletico ')
    .replace(/\bo\.?\s/g, 'olympique ')
    .replace(/\bsp\.?\s/g, 'sporting ')
    .replace(/\bbor\.?\s/g, 'borussia ')
    .replace(/\butd\.?\b/g, 'united')
    .replace(/\bman\.?\s/g, 'manchester ');
  return claveEquipo(expandido);
}

const FEMENINO = /\bfemen|\bfem\b|\bwomen\b/i;
const SIN_CONFIRMAR = /por confirmar/i;
/**
 * Variantes técnicas del mismo canal que no aportan al "dónde ver" y ensucian
 * el chip: emisión HDR, señal para bares, promos "App Gratis" y los
 * multicanales M2/M5 de LaLiga TV. Se quitan solo si queda algún canal.
 */
const VARIANTE_RUIDO = /\bhdr\b|\bbar\b|app gratis|\bm\d\b/i;

type Entry = { home: string; away: string; channels: string[] };
export type WostiIndex = Map<string, Entry[]>;

function buildIndex(events: RawEvent[]): WostiIndex {
  const idx: WostiIndex = new Map();
  for (const e of events) {
    const home = String(e.LocalTeam?.Name ?? '');
    const away = String(e.AwayTeam?.Name ?? '');
    if (!home || !away || !e.Date) continue;
    if (FEMENINO.test(home) || FEMENINO.test(away)) continue;
    const raw = e.Channels ?? [];
    if (!emitidoEnEspana(raw)) continue;
    const seen = new Set<string>();
    const channels = raw
      .map((c) => nombreCanal(String(c.Name ?? '')))
      .filter((n) => n && !SIN_CONFIRMAR.test(n) && PLATAFORMAS_ES.test(limpiaCanal(n)))
      .filter((n) => { const k = n.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; });
    if (channels.length === 0) continue;
    const limpios = channels.filter((n) => !VARIANTE_RUIDO.test(n));
    const finales = limpios.length > 0 ? limpios : channels;
    const day = madridDate(e.Date);
    const list = idx.get(day) ?? [];
    // Gana la primera entrada del par: el feed lista antes el directo y luego las reemisiones.
    if (!list.some((x) => x.home === normaliza(home) && x.away === normaliza(away))) {
      list.push({ home: normaliza(home), away: normaliza(away), channels: finales });
    }
    idx.set(day, list);
  }
  return idx;
}

let INDEX: WostiIndex | null = null;

/**
 * Índice fecha(Madrid) → partidos con canal, construido SOLO desde el snapshot
 * del repo. La web nunca llama a RapidAPI: el snapshot se refresca una vez al
 * día en GitHub Actions (scripts/wosti/snapshot.mjs), que copia el de Guía TV.
 * Pedir UNA vez por render y pasarlo a `channelsFor`.
 */
export async function getWostiIndex(): Promise<WostiIndex> {
  INDEX ??= buildIndex(snapshot as RawEvent[]);
  return INDEX;
}

const same = (a: string, b: string) => !!a && !!b && (a === b || a.includes(b) || b.includes(a));

/**
 * Canales (nombres limpios) de un partido de ESPN, o [] si no se sabe.
 * Se prueban nombre completo y corto de cada equipo, con contención laxa.
 */
export function channelsFor(idx: WostiIndex, isoDate: string, home: string[], away: string[]): string[] {
  const list = idx.get(madridDate(isoDate));
  if (!list || list.length === 0) return [];
  const H = home.filter(Boolean).map(normaliza);
  const A = away.filter(Boolean).map(normaliza);
  for (const e of list) {
    if (H.some((h) => same(h, e.home)) && A.some((a) => same(a, e.away))) return e.channels;
  }
  return [];
}

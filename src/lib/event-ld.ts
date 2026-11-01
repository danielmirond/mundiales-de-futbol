/**
 * Normalizador de datos estructurados de evento (2026-11-01).
 *
 * Google exige en cada Event/SportsEvent `name`, `startDate` y `location` con
 * `address` (Place + PostalAddress), y recomienda eventStatus, eventAttendanceMode,
 * endDate, image, description, organizer y performer. Las ~20 plantillas del sitio
 * lo generaban cada una a su manera; aquí se completa todo en un único sitio
 * (lo aplica `JsonLd`), sin inventar datos:
 *  - `location` como texto, Country o Place sin dirección → Place + PostalAddress.
 *  - `superEvent` sin fecha (Google lo trataba como un segundo evento roto) →
 *    se quita y su nombre pasa a `organizer` si no lo había.
 *  - eventStatus/eventAttendanceMode por defecto (programado, presencial).
 *  - endDate = inicio + 2 h en partidos con hora; image y description por defecto.
 *  - performer = competidores/equipos si existen.
 *  - Un evento sin startDate o sin lugar deja de declararse como evento (pasa a Thing):
 *    mejor sin rich result que con un error.
 */

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mundiales-de-futbol.com').trim();
const DEFAULT_IMAGE = `${SITE}/opengraph-image`;
type Obj = Record<string, unknown>;

const isEventType = (t: unknown) => t === 'SportsEvent' || t === 'Event' || (Array.isArray(t) && t.some((x) => x === 'SportsEvent' || x === 'Event'));
const isObj = (v: unknown): v is Obj => !!v && typeof v === 'object' && !Array.isArray(v);

function postalFromText(text: string): Obj {
  const parts = text.split(',').map((s) => s.trim()).filter(Boolean);
  if (parts.length >= 2) return { '@type': 'PostalAddress', addressLocality: parts.slice(0, -1).join(', '), addressCountry: parts[parts.length - 1] };
  return { '@type': 'PostalAddress', addressLocality: text };
}

function normalizePlace(loc: unknown): Obj | null {
  if (!loc) return null;
  if (typeof loc === 'string') return { '@type': 'Place', name: loc, address: postalFromText(loc) };
  if (!isObj(loc)) return null;
  const type = loc['@type'];
  if (type === 'VirtualLocation') return loc;
  const name = typeof loc.name === 'string' ? loc.name : undefined;
  if (type === 'Country' || type === 'City' || type === 'AdministrativeArea') {
    if (!name) return null;
    return { '@type': 'Place', name, address: type === 'Country' ? { '@type': 'PostalAddress', addressCountry: name } : postalFromText(name) };
  }
  let address = loc.address;
  if (typeof address === 'string' && address.trim()) address = postalFromText(address);
  if (!isObj(address)) address = name ? postalFromText(name) : undefined;
  if (!address) return null;
  return { ...loc, '@type': 'Place', ...(name ? { name } : {}), address };
}

function normalizeEvent(e: Obj): Obj {
  const out: Obj = { ...e };
  // superEvent sin fecha → organizer (Google lo valida como evento y fallaba).
  if (isObj(out.superEvent) && !out.superEvent.startDate) {
    const se = out.superEvent;
    if (!out.organizer && typeof se.name === 'string') out.organizer = { '@type': 'SportsOrganization', name: se.name };
    delete out.superEvent;
  }
  const locs = (Array.isArray(out.location) ? out.location : [out.location]).map(normalizePlace).filter(Boolean) as Obj[];
  if (!out.startDate || locs.length === 0) {
    // Sin fecha o sin lugar no es un evento válido: se declara como Thing con el mismo nombre.
    const { name, url, description, image } = out;
    return { '@type': 'Thing', ...(name ? { name } : {}), ...(url ? { url } : {}), ...(description ? { description } : {}), ...(image ? { image } : {}) };
  }
  out.location = locs.length === 1 ? locs[0] : locs;
  out.eventStatus ??= 'https://schema.org/EventScheduled';
  out.eventAttendanceMode ??= 'https://schema.org/OfflineEventAttendanceMode';
  if (!out.endDate && typeof out.startDate === 'string' && out.startDate.includes('T')) {
    const t = Date.parse(out.startDate);
    if (!Number.isNaN(t)) out.endDate = new Date(t + 2 * 3_600_000).toISOString();
  }
  out.image ??= DEFAULT_IMAGE;
  out.description ??= typeof out.name === 'string' ? out.name : undefined;
  if (!out.performer) {
    const teams = [out.homeTeam, out.awayTeam].filter(Boolean);
    const comp = Array.isArray(out.competitor) ? out.competitor : teams;
    if (comp.length) out.performer = comp;
  }
  return out;
}

/** Recorre el JSON-LD y normaliza cada Event/SportsEvent (también dentro de ItemList, @graph…). */
export function normalizeEvents<T>(node: T): T {
  if (Array.isArray(node)) return node.map(normalizeEvents) as T;
  if (!isObj(node)) return node;
  const walked: Obj = {};
  for (const [k, v] of Object.entries(node)) walked[k] = normalizeEvents(v);
  return (isEventType(walked['@type']) ? normalizeEvent(walked) : walked) as T;
}

/**
 * Mundial de MotoGP desde la API pública que alimenta motogp.com (Pulselive / Dorna):
 * calendario, sesiones de cada gran premio, resultados y clasificación de MotoGP,
 * Moto2 y Moto3. No está documentada: todo con caché y sin romper la página si falla.
 */

const RES = 'https://api.motogp.pulselive.com/motogp/v1/results';
const EVT = 'https://api.motogp.pulselive.com/motogp/v1/events';
const HEADERS = { 'User-Agent': 'Mozilla/5.0 (mundiales-de-futbol.com)' };

export type MotoCategory = 'MotoGP' | 'Moto2' | 'Moto3';
export type MotoRider = { pos: number; name: string; number?: number; countryIso?: string; country?: string; team?: string; bike?: string; points?: number; time?: string; gap?: string; status?: string };
export type MotoStanding = MotoRider & { points: number; wins: number; podiums: number };
export type MotoSession = { type: string; label: string; date: string; done: boolean };
export type MotoEvent = { id: string; short: string; name: string; circuit: string; countryIso?: string; start: string; end: string; finished: boolean; timeZone?: string };
export type MotoGPData = {
  year: number;
  standings: Record<MotoCategory, MotoStanding[]>;
  calendar: MotoEvent[];
  last?: { event: MotoEvent; race: MotoRider[]; sprint: MotoRider[] };
  next?: { event: MotoEvent; sessions: MotoSession[] };
};

/* eslint-disable @typescript-eslint/no-explicit-any */
async function get(url: string, revalidate: number) {
  try { const r = await fetch(url, { headers: HEADERS, next: { revalidate } }); return r.ok ? r.json() : null; } catch { return null; }
}

const regionEs = new Intl.DisplayNames(['es'], { type: 'region' });
const countryName = (iso?: string) => { try { return iso ? regionEs.of(iso.toUpperCase()) ?? iso : undefined; } catch { return iso; } };

/** Nombre del gran premio en español; los que comparten país se distinguen por su nombre propio. */
const GP_ES: Record<string, string> = {
  SPA: 'Gran Premio de España', CAT: 'Gran Premio de Cataluña', ARA: 'Gran Premio de Aragón', VAL: 'Gran Premio de la Comunitat Valenciana',
  ITA: 'Gran Premio de Italia', RSM: 'Gran Premio de San Marino', EMI: 'Gran Premio de Emilia-Romaña', GBR: 'Gran Premio de Gran Bretaña',
  NED: 'Gran Premio de los Países Bajos', USA: 'Gran Premio de las Américas', AME: 'Gran Premio de las Américas', CZE: 'Gran Premio de la República Checa',
};
const gpName = (short: string, iso?: string, raw?: string) => GP_ES[short] ?? (iso ? `Gran Premio de ${countryName(iso)}` : String(raw ?? short));

const SESSION_ES: Record<string, string> = { FP: 'Libres', PR: 'Práctica', Q: 'Clasificación', SPR: 'Sprint', WUP: 'Warm up', RAC: 'Carrera' };
const sessionLabel = (s: any) => `${SESSION_ES[s.type] ?? s.type}${s.number ? ` ${s.number}` : ''}`;

/**
 * La API de resultados da la hora local del circuito marcada como UTC («14:00+00:00»
 * en Phillip Island es a las 14:00 de Melbourne). La convertimos con la zona del evento.
 */
function wallToUtc(wall: string, timeZone?: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(wall);
  if (!m || !timeZone) return wall;
  const asUtc = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
  try {
    const parts = new Intl.DateTimeFormat('en-US', { timeZone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).formatToParts(new Date(asUtc));
    const p = (t: string) => Number(parts.find((x) => x.type === t)?.value);
    const shown = Date.UTC(p('year'), p('month') - 1, p('day'), p('hour'), p('minute'));
    return new Date(asUtc - (shown - asUtc)).toISOString();
  } catch { return wall; }
}
/** «AUSTRALIA/MELBOURNE» → «Australia/Melbourne». */
const tzName = (s?: string) => s?.split('/').map((w) => w.toLowerCase().replace(/(^|_)([a-z])/g, (_, a, b) => a + b.toUpperCase())).join('/');

const rider = (x: any): MotoRider => ({
  pos: Number(x.position), name: String(x.rider?.full_name ?? ''), number: x.rider?.number ? Number(x.rider.number) : undefined,
  countryIso: x.rider?.country?.iso, country: countryName(x.rider?.country?.iso), team: x.team?.name, bike: x.constructor?.name,
  points: typeof x.points === 'number' ? x.points : undefined, time: x.time ?? undefined, gap: x.gap?.first && x.gap.first !== '0.000' ? `+${x.gap.first}` : undefined, status: x.status,
});

export async function fetchMotoGP(): Promise<MotoGPData | null> {
  const year = new Date().getUTCFullYear();
  const seasons = await get(`${RES}/seasons`, 86_400);
  const season = (seasons ?? []).find((s: any) => Number(s.year) === year);
  if (!season) return null;
  const [cats, done, pending, sched] = await Promise.all([
    get(`${RES}/categories?seasonUuid=${season.id}`, 86_400),
    get(`${RES}/events?seasonUuid=${season.id}&isFinished=true`, 1800),
    get(`${RES}/events?seasonUuid=${season.id}&isFinished=false`, 1800),
    get(`${EVT}?seasonYear=${year}`, 21_600),
  ]);
  const catId = (name: MotoCategory) => (cats ?? []).find((c: any) => String(c.name).replace(/™/g, '').trim() === name)?.id as string | undefined;
  const tzByShort = new Map<string, string>(((sched ?? []) as any[]).map((e) => [String(e.shortname ?? e.short_name ?? '').toUpperCase(), tzName(e.time_zone) ?? '']));
  const toEvent = (e: any, finished: boolean): MotoEvent => ({
    id: e.id, short: e.short_name, name: gpName(e.short_name, e.country?.iso, e.name), circuit: e.circuit?.name, countryIso: e.country?.iso,
    start: e.date_start, end: e.date_end, finished, timeZone: tzByShort.get(String(e.short_name).toUpperCase()) || undefined,
  });
  const calendar = [...((done ?? []) as any[]).filter((e) => !e.test).map((e) => toEvent(e, true)), ...((pending ?? []) as any[]).filter((e) => !e.test).map((e) => toEvent(e, false))]
    .sort((a, b) => a.start.localeCompare(b.start));

  const standingsOf = async (c: MotoCategory, n: number) => {
    const id = catId(c);
    if (!id) return [];
    const d = await get(`${RES}/standings?seasonUuid=${season.id}&categoryUuid=${id}`, 1800);
    return ((d?.classification ?? []) as any[]).slice(0, n).map((x) => ({ ...rider(x), points: Number(x.points ?? 0), wins: Number(x.race_wins ?? 0), podiums: Number(x.podiums ?? 0) }));
  };
  const gp = catId('MotoGP');
  const lastEv = [...calendar].reverse().find((e) => e.finished);
  const nextEv = calendar.find((e) => !e.finished);

  const [mgp, m2, m3, lastSessions, nextSessions] = await Promise.all([
    standingsOf('MotoGP', 30), standingsOf('Moto2', 10), standingsOf('Moto3', 10),
    lastEv && gp ? get(`${RES}/sessions?eventUuid=${lastEv.id}&categoryUuid=${gp}`, 3600) : null,
    nextEv && gp ? get(`${RES}/sessions?eventUuid=${nextEv.id}&categoryUuid=${gp}`, 1800) : null,
  ]);
  const classify = async (sessions: any, type: string) => {
    const s = ((sessions ?? []) as any[]).find((x) => x.type === type);
    if (!s) return [];
    const d = await get(`${RES}/session/${s.id}/classification?test=false`, 3600);
    return ((d?.classification ?? []) as any[]).map(rider);
  };
  const [race, sprint] = await Promise.all([classify(lastSessions, 'RAC'), classify(lastSessions, 'SPR')]);

  return {
    year,
    standings: { MotoGP: mgp, Moto2: m2, Moto3: m3 },
    calendar,
    last: lastEv && race.length ? { event: lastEv, race, sprint } : undefined,
    next: nextEv ? {
      event: nextEv,
      sessions: ((nextSessions ?? []) as any[]).map((s) => ({ type: s.type, label: sessionLabel(s), date: wallToUtc(String(s.date), nextEv.timeZone), done: s.status !== 'NOT-STARTED' })),
    } : undefined,
  };
}

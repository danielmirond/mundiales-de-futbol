/**
 * Equipos de una competición vía ESPN: lista (id + slug), ficha, calendario de
 * temporada (resultados) y plantilla. Todo cacheado; nada se inventa: si un
 * endpoint no da un dato, el bloque no se pinta.
 */
import type { Competition } from './competitions';

const API = 'https://site.api.espn.com/apis/site/v2/sports';
const HEADERS = { 'User-Agent': 'Mozilla/5.0 (mundiales-de-futbol.com)' };

export type TeamRef = { id: string; slug: string; name: string; abbr: string; logo?: string };
export type TeamInfo = TeamRef & {
  color?: string;
  record?: string;          // "8-0-0"
  standingSummary?: string; // "1st in Spanish LALIGA"
  nextEvent?: { id: string; date: string; name: string; home: string; away: string };
};
export type TeamGame = {
  id: string; date: string; state: 'pre' | 'in' | 'post'; status: string;
  isHome: boolean; rival: string; rivalLogo?: string; gf: number | null; ga: number | null; venue?: string;
  result: 'W' | 'D' | 'L' | null;
};
export type Player = { name: string; jersey: string; pos: string; age?: number; nationality?: string };

/** URL slug de nuestro sitio a partir del slug de ESPN ("esp.barcelona" → "barcelona"). */
export const teamSlug = (espnSlug: string) => String(espnSlug ?? '').replace(/^[a-z]{2,3}\./, '');

const path = (c: Competition) => `${API}/${c.espn!.sport}/${c.espn!.league}`;

async function getJson(url: string, revalidate: number): Promise<any | null> {
  try {
    const res = await fetch(url, { headers: HEADERS, next: { revalidate } });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

const num = (s: unknown): number | null => {
  if (s && typeof s === 'object') { const o = s as any; return num(o.value ?? o.displayValue); }
  return s === undefined || s === null || s === '' ? null : Number(s);
};

/** Todos los equipos de la competición (24 h). */
export async function fetchTeams(c: Competition): Promise<TeamRef[]> {
  if (!c.espn) return [];
  const j = await getJson(`${path(c)}/teams?limit=200`, 86_400);
  const list: any[] = j?.sports?.[0]?.leagues?.[0]?.teams ?? [];
  return list.map((x) => ({
    id: String(x.team?.id ?? ''), slug: teamSlug(x.team?.slug), name: x.team?.displayName ?? x.team?.name ?? '',
    abbr: String(x.team?.abbreviation ?? '').toUpperCase(), logo: x.team?.logos?.[0]?.href,
  })).filter((t) => t.id && t.slug);
}

/** Resuelve por slug de URL o por id numérico. */
export async function resolveTeam(c: Competition, slugOrId: string): Promise<TeamRef | null> {
  const teams = await fetchTeams(c);
  return teams.find((t) => t.slug === slugOrId || t.id === slugOrId) ?? null;
}

export async function fetchTeam(c: Competition, id: string): Promise<TeamInfo | null> {
  const j = await getJson(`${path(c)}/teams/${id}`, 3_600);
  const t = j?.team; if (!t) return null;
  const ne = t.nextEvent?.[0];
  const comp = ne?.competitions?.[0];
  const h = comp?.competitors?.find((x: any) => x.homeAway === 'home'), a = comp?.competitors?.find((x: any) => x.homeAway === 'away');
  return {
    id: String(t.id), slug: teamSlug(t.slug), name: t.displayName ?? t.name, abbr: String(t.abbreviation ?? '').toUpperCase(),
    logo: t.logos?.[0]?.href, color: t.color,
    record: t.record?.items?.[0]?.summary, standingSummary: t.standingSummary,
    nextEvent: ne ? { id: String(ne.id), date: ne.date, name: ne.shortName ?? ne.name ?? '', home: h?.team?.displayName ?? '', away: a?.team?.displayName ?? '' } : undefined,
  };
}

/** Calendario de temporada (resultados jugados y, si ESPN los da, próximos). */
export async function fetchTeamSchedule(c: Competition, id: string): Promise<TeamGame[]> {
  const j = await getJson(`${path(c)}/teams/${id}/schedule`, 1_800);
  const out: TeamGame[] = [];
  for (const e of j?.events ?? []) {
    const comp = e.competitions?.[0]; if (!comp) continue;
    const me = (comp.competitors ?? []).find((x: any) => String(x.team?.id) === String(id));
    const riv = (comp.competitors ?? []).find((x: any) => String(x.team?.id) !== String(id));
    if (!me || !riv) continue;
    const state = (comp.status?.type?.state ?? e.status?.type?.state ?? 'pre') as TeamGame['state'];
    const gf = num(me.score), ga = num(riv.score);
    out.push({
      id: String(e.id), date: e.date ?? '', state, status: comp.status?.type?.shortDetail ?? '',
      isHome: me.homeAway === 'home', rival: riv.team?.displayName ?? riv.team?.name ?? '', rivalLogo: riv.team?.logos?.[0]?.href ?? riv.team?.logo,
      gf, ga, venue: comp.venue?.fullName,
      result: state === 'post' && gf != null && ga != null ? (gf > ga ? 'W' : gf < ga ? 'L' : 'D') : null,
    });
  }
  return out.sort((a, b) => a.date.localeCompare(b.date));
}

export async function fetchTeamRoster(c: Competition, id: string): Promise<{ players: Player[]; coach?: string }> {
  const j = await getJson(`${path(c)}/teams/${id}/roster`, 21_600);
  const raw: any[] = Array.isArray(j?.athletes) && j.athletes[0]?.items ? j.athletes.flatMap((g: any) => g.items) : (j?.athletes ?? []);
  const players: Player[] = raw.map((p) => ({
    name: p.displayName ?? p.fullName ?? '', jersey: String(p.jersey ?? ''), pos: p.position?.abbreviation ?? p.position?.name ?? '',
    age: typeof p.age === 'number' ? p.age : undefined, nationality: p.citizenship ?? p.birthPlace?.country,
  })).filter((p) => p.name);
  const coach = j?.coach?.[0] ? `${j.coach[0].firstName ?? ''} ${j.coach[0].lastName ?? ''}`.trim() : undefined;
  return { players, coach };
}

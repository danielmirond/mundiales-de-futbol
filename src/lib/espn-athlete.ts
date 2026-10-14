/**
 * Ficha de jugador (ESPN `apis/common/v3`): biografía, resumen de la
 * temporada y estadísticas por temporada y equipo.
 */
import type { Competition } from './competitions';
import { countryEs } from './i18n-sport';

const COMMON = 'https://site.web.api.espn.com/apis/common/v3/sports';
const HEADERS = { 'User-Agent': 'Mozilla/5.0 (mundiales-de-futbol.com)' };

export type AthleteBio = { id: string; name: string; position?: string; team?: string; teamId?: string; jersey?: string; age?: number; dob?: string; height?: string; country?: string; headshot?: string };
export type AthleteSummaryStat = { label: string; value: string; rank?: string };
export type AthleteSeasonRow = { season: string; team: string; stats: string[] };
export type AthleteProfile = { bio: AthleteBio; summaryTitle?: string; summary: AthleteSummaryStat[]; labels: string[]; titles: string[]; rows: AthleteSeasonRow[] };

/** Etiquetas de fútbol en español (las de baloncesto son internacionales). */
const LABEL_ES: Record<string, [string, string]> = {
  STRT: ['Tit.', 'Partidos como titular'], FC: ['FC', 'Faltas cometidas'], FA: ['FR', 'Faltas recibidas'], YC: ['TA', 'Tarjetas amarillas'], RC: ['TR', 'Tarjetas rojas'],
  G: ['Goles', 'Goles'], A: ['Asist.', 'Asistencias'], SHOT: ['Tiros', 'Tiros'], SOG: ['A puerta', 'Tiros a puerta'], OF: ['FJ', 'Fueras de juego'],
  SV: ['Paradas', 'Paradas'], GA: ['GC', 'Goles encajados'], CS: ['Imbatido', 'Porterías a cero'],
};
const POS_ES: Record<string, string> = { Forward: 'Delantero', Midfielder: 'Centrocampista', Defender: 'Defensa', Goalkeeper: 'Portero', Center: 'Pívot', Guard: 'Base/escolta', 'Point Guard': 'Base', 'Shooting Guard': 'Escolta', 'Small Forward': 'Alero', 'Power Forward': 'Ala-pívot' };
const SUMMARY_ES: Record<string, string> = {
  'Starts-Substitute Appearances': 'Titular (suplente)', Shots: 'Tiros', 'Total Shots': 'Tiros', Saves: 'Paradas', 'Goals Conceded': 'Goles encajados', 'Clean Sheet': 'Porterías a cero', 'Total Goals': 'Goles', Assists: 'Asistencias', 'Shots On Target': 'Tiros a puerta', 'Shots On Goal': 'Tiros a puerta',
  'Points Per Game': 'Puntos por partido', 'Rebounds Per Game': 'Rebotes por partido', 'Assists Per Game': 'Asistencias por partido', 'Field Goal Percentage': '% de tiro', 'Player Efficiency Rating': 'Valoración (PER)',
};

/** «5' 9"» → «175 cm». */
const toCm = (h?: string) => { const m = /(\d+)'\s*(\d+)/.exec(h ?? ''); return m ? `${Math.round((Number(m[1]) * 12 + Number(m[2])) * 2.54)} cm` : h; };

/* eslint-disable @typescript-eslint/no-explicit-any */
async function get(url: string) {
  try { const r = await fetch(url, { headers: HEADERS, next: { revalidate: 3600 } }); return r.ok ? r.json() : null; } catch { return null; }
}
const base = (c: Competition) => (c.espn!.sport === 'soccer' ? `${COMMON}/soccer` : `${COMMON}/${c.espn!.sport}/${c.espn!.league}`);

export async function fetchAthlete(c: Competition, id: string): Promise<AthleteProfile | null> {
  if (!c.espn || !/^\d{2,10}$/.test(id)) return null;
  const [main, stats] = await Promise.all([get(`${base(c)}/athletes/${id}`), get(`${base(c)}/athletes/${id}/stats`)]);
  const a = main?.athlete;
  if (!a?.displayName) return null;
  const pos = a.position?.displayName as string | undefined;
  const bio: AthleteBio = {
    id, name: String(a.displayName), position: pos ? POS_ES[pos] ?? pos : undefined, team: a.team?.displayName, teamId: a.team?.id ? String(a.team.id) : undefined,
    jersey: a.displayJersey ? String(a.displayJersey).replace('#', '') : undefined, age: typeof a.age === 'number' ? a.age : undefined, dob: a.displayDOB, height: toCm(a.displayHeight),
    country: countryEs(a.citizenship ?? a.flag?.alt), headshot: a.headshot?.href,
  };
  const summary: AthleteSummaryStat[] = (main?.athlete?.statsSummary?.statistics ?? main?.statsSummary?.statistics ?? []).map((s: any) => ({ label: SUMMARY_ES[s.displayName] ?? s.displayName, value: String(s.displayValue ?? ''), rank: s.rankDisplayValue }));
  const cat = (stats?.categories ?? [])[0];
  const labels: string[] = cat?.labels ?? [];
  const teamsById = new Map<string, string>(Object.values(stats?.teams ?? {}).map((t: any) => [String(t.id), String(t.displayName ?? t.name ?? '')]));
  const rows: AthleteSeasonRow[] = [...(cat?.statistics ?? [])].reverse().slice(0, 8).map((r: any) => ({
    season: (String(r.season?.displayName ?? r.season?.type?.name ?? r.season?.year ?? '').match(/\d{4}-\d{2}/) ?? [String(r.season?.year ?? '')])[0],
    team: teamsById.get(String(r.teamId)) ?? '', stats: (r.stats ?? []).map(String),
  }));
  return {
    bio, summaryTitle: main?.athlete?.statsSummary?.displayName ?? main?.statsSummary?.displayName, summary,
    labels: labels.map((l) => LABEL_ES[l]?.[0] ?? l), titles: labels.map((l, i) => LABEL_ES[l]?.[1] ?? cat?.displayNames?.[i] ?? l), rows,
  };
}

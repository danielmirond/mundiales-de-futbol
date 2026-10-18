/**
 * Sueldos de la NBA desde las plantillas de ESPN: cada jugador trae su
 * historial de contratos (salario por temporada) y su país de nacimiento.
 * 30 peticiones (una por equipo), caché de un día. Sin IA.
 */
import { countryEs } from './i18n-sport';

const SITE = 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba';
const HEADERS = { 'User-Agent': 'Mozilla/5.0 (mundiales-de-futbol.com)' };

export type SalaryYear = { season: number; label: string; salary: number };
export type NbaSalaryPlayer = {
  id: string;
  name: string;
  teamId: string;
  team: string;
  teamAbbr: string;
  teamLogo?: string;
  position?: string;
  country?: string;
  /** Salario de la temporada en curso (dólares), o null si ESPN aún no lo tiene. */
  salary: number | null;
  /** Historial, de la temporada más reciente a la más antigua. */
  history: SalaryYear[];
};
/**
 * `ranked`: jugadores con sueldo registrado esta temporada, de mayor a menor.
 * `all`: todos los que tienen algún contrato en ESPN (para fichas y para los españoles).
 * `missing`: jugadores en plantilla sin contrato de esta temporada en ESPN. No se
 * calcula masa salarial por equipo: con contratos sin cargar saldría falsa.
 */
export type NbaSalaries = { season: number; label: string; ranked: NbaSalaryPlayer[]; all: NbaSalaryPlayer[]; missing: number; rostered: number };

const POS_ES: Record<string, string> = { Center: 'Pívot', Guard: 'Escolta', Forward: 'Alero', 'Point Guard': 'Base', 'Shooting Guard': 'Escolta', 'Small Forward': 'Alero', 'Power Forward': 'Ala-pívot', 'Guard-Forward': 'Escolta-alero', 'Forward-Center': 'Ala-pívot' };

/** Jugadores españoles en la NBA por id de ESPN (Santi Aldama, Hugo González). Ampliar al llegar uno nuevo. */
export const SPANISH_NBA_IDS = new Set(['4593125', '5175647']);

/** Temporada NBA en curso según ESPN: la 2026-27 es la 2027 (empieza en octubre). */
export function currentNbaSeason(d = new Date()): number {
  return d.getUTCMonth() >= 6 ? d.getUTCFullYear() + 1 : d.getUTCFullYear();
}
export const seasonLabel = (y: number) => `${y - 1}-${String(y).slice(2)}`;

/** «17.007.043 $» */
export const usd = (n: number) => `${Math.round(n).toLocaleString('es-ES')} $`;
/** «17 M$» para titulares y tarjetas. */
export const usdShort = (n: number) => (n >= 1e6 ? `${(n / 1e6).toLocaleString('es-ES', { maximumFractionDigits: 1 })} M$` : usd(n));

/* eslint-disable @typescript-eslint/no-explicit-any */
async function get(url: string) {
  try { const r = await fetch(url, { headers: HEADERS, next: { revalidate: 86_400 } }); return r.ok ? r.json() : null; } catch { return null; }
}

export async function fetchNbaSalaries(): Promise<NbaSalaries | null> {
  const teamsJson = await get(`${SITE}/teams`);
  const teams: any[] = teamsJson?.sports?.[0]?.leagues?.[0]?.teams?.map((t: any) => t.team) ?? [];
  if (!teams.length) return null;
  const season = currentNbaSeason();
  const rosters = await Promise.all(teams.map((t) => get(`${SITE}/teams/${t.id}/roster`).then((r) => ({ t, r }))));
  const players: NbaSalaryPlayer[] = [];
  let rostered = 0;
  for (const { t, r } of rosters) {
    for (const a of (r?.athletes ?? []) as any[]) {
      rostered += 1;
      const history: SalaryYear[] = ((a.contracts ?? []) as any[])
        .map((c) => ({ season: Number(c.season?.year), salary: Number(c.salary) }))
        .filter((c) => c.season && c.salary > 0)
        .sort((x, y) => y.season - x.season)
        .map((c) => ({ ...c, label: seasonLabel(c.season) }));
      if (!history.length) continue;
      const pos = a.position?.displayName as string | undefined;
      const birth = a.birthPlace?.country as string | undefined;
      players.push({
        id: String(a.id), name: String(a.displayName), teamId: String(t.id), team: String(t.displayName), teamAbbr: String(t.abbreviation),
        teamLogo: t.logos?.[0]?.href, position: pos ? POS_ES[pos] ?? pos : undefined,
        country: countryEs(birth === 'USA' ? 'Estados Unidos' : birth), salary: history.find((h) => h.season === season)?.salary ?? null, history,
      });
    }
  }
  if (!players.length) return null;
  // Españoles que ESPN no marca (sin lugar de nacimiento ni nacionalidad): lista editorial comprobada.
  for (const p of players) if (SPANISH_NBA_IDS.has(p.id)) p.country = 'España';
  // Sin lugar de nacimiento en la plantilla (rookies, sobre todo): la ficha trae la nacionalidad.
  await Promise.all(players.filter((p) => !p.country).map(async (p) => {
    const d = await get(`https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/${p.id}`);
    p.country = countryEs(d?.athlete?.citizenship ?? d?.athlete?.flag?.alt ?? undefined);
  }));
  // Un jugador puede salir en dos plantillas tras un traspaso: nos quedamos con la primera aparición.
  const seen = new Set<string>();
  const all = players.filter((p) => (seen.has(p.id) ? false : (seen.add(p.id), true)));
  const ranked = all.filter((p) => p.salary !== null).sort((a, b) => (b.salary ?? 0) - (a.salary ?? 0));
  return { season, label: seasonLabel(season), ranked, all, missing: rostered - ranked.length, rostered };
}

/** Contrato de un jugador concreto (para su ficha), desde el mismo cálculo cacheado. */
export async function nbaPlayerSalary(id: string): Promise<{ player: NbaSalaryPlayer; rank: number | null; ranked: number; label: string } | null> {
  const s = await fetchNbaSalaries();
  const player = s?.all.find((p) => p.id === id);
  if (!s || !player) return null;
  const i = s.ranked.findIndex((p) => p.id === id);
  return { player, rank: i < 0 ? null : i + 1, ranked: s.ranked.length, label: s.label };
}

/**
 * Cuadro (bracket) del Mundial 2026 y trazado del "camino a la final".
 *
 * A partir de los `label` de los cruces eliminatorios (FIXTURES_2026) se modela
 * qué posiciones de grupo alimentan cada partido y el árbol R32→Final. Con eso,
 * dada una selección y su posición de grupo (1.º/2.º), se traza su ruta hasta
 * el MetLife (Nueva York/Nueva Jersey) y los posibles rivales en cada ronda.
 *
 * 100% determinista (estructura del cuadro). El emparejamiento de semifinales
 * (97-98 / 99-100) es el estándar de bracket; los rivales se dan en cualitativo.
 */
import { FIXTURES_2026, GROUPS_2026, TEAMS_2026, VENUES_2026 } from './wc-2026';

export type Slot = { pos: 1 | 2; group: string } | { third: true };

// Cruces de dieciseisavos (R32): qué dos "casillas" se enfrentan.
const R32: Record<number, [Slot, Slot]> = {
  73: [{ pos: 2, group: 'A' }, { pos: 2, group: 'B' }],
  74: [{ pos: 1, group: 'E' }, { third: true }],
  75: [{ pos: 1, group: 'F' }, { pos: 2, group: 'C' }],
  76: [{ pos: 1, group: 'C' }, { pos: 2, group: 'F' }],
  77: [{ pos: 1, group: 'I' }, { third: true }],
  78: [{ pos: 2, group: 'E' }, { pos: 2, group: 'I' }],
  79: [{ pos: 1, group: 'A' }, { third: true }],
  80: [{ pos: 1, group: 'L' }, { third: true }],
  81: [{ pos: 1, group: 'D' }, { third: true }],
  82: [{ pos: 1, group: 'G' }, { third: true }],
  83: [{ pos: 2, group: 'K' }, { pos: 2, group: 'L' }],
  84: [{ pos: 1, group: 'H' }, { pos: 2, group: 'J' }],
  85: [{ pos: 1, group: 'B' }, { third: true }],
  86: [{ pos: 1, group: 'J' }, { pos: 2, group: 'H' }],
  87: [{ pos: 1, group: 'K' }, { third: true }],
  88: [{ pos: 2, group: 'D' }, { pos: 2, group: 'G' }],
};

// Árbol: partido → sus dos partidos hijos (ganadores que lo alimentan).
const TREE: Record<number, [number, number]> = {
  89: [74, 77], 90: [73, 75], 91: [76, 78], 92: [79, 80],
  93: [83, 84], 94: [81, 82], 95: [86, 88], 96: [85, 87],
  97: [89, 90], 98: [93, 94], 99: [91, 92], 100: [95, 96],
  101: [97, 98], 102: [99, 100],
  104: [101, 102],
};

const ROUND_LABEL: Record<string, string> = {
  R32: 'Dieciseisavos',
  R16: 'Octavos',
  QF: 'Cuartos',
  SF: 'Semifinal',
  FINAL: 'Final',
};

function roundOf(n: number): string {
  if (n >= 73 && n <= 88) return 'R32';
  if (n >= 89 && n <= 96) return 'R16';
  if (n >= 97 && n <= 100) return 'QF';
  if (n === 101 || n === 102) return 'SF';
  if (n === 104) return 'FINAL';
  return '';
}

const parentOf: Record<number, number> = {};
for (const [p, kids] of Object.entries(TREE)) for (const k of kids) parentOf[k] = Number(p);

const fixtureByN = new Map(FIXTURES_2026.map((f) => [f.n, f]));
const venueCity = (slug?: string) => {
  const v = VENUES_2026.find((x) => x.slug === slug);
  return v ? `${v.hostCity}` : '';
};
const teamName = (c: string) => TEAMS_2026[c]?.name ?? c;
const groupTeams = (g: string) => (GROUPS_2026.find((x) => x.letter === g)?.teams ?? []).filter(Boolean) as string[];

function leafSlots(n: number): Slot[] {
  if (R32[n]) return R32[n];
  const kids = TREE[n];
  if (!kids) return [];
  return [...leafSlots(kids[0]), ...leafSlots(kids[1])];
}

function slotKey(s: Slot): string {
  return 'third' in s ? '3' : `${s.pos}${s.group}`;
}

export type RivalInfo = { groups: string[]; third: boolean; teams: string[] };
function rivalsFromSlots(slots: Slot[]): RivalInfo {
  const groups = new Set<string>();
  let third = false;
  for (const s of slots) {
    if ('third' in s) third = true;
    else groups.add(s.group);
  }
  const sorted = [...groups].sort();
  const teams = sorted.flatMap((g) => groupTeams(g));
  return { groups: sorted, third, teams };
}

export type PathStep = {
  round: string;
  roundLabel: string;
  city: string;
  rival: RivalInfo;
  /** Texto del cruce de R32 (cuando es exacto). */
  exactRivalSlot?: string;
};

/** Encuentra el cruce de R32 de una posición concreta (1.º/2.º de un grupo). */
function r32ForSlot(pos: 1 | 2, group: string): number | null {
  for (const [n, slots] of Object.entries(R32)) {
    if (slots.some((s) => !('third' in s) && s.pos === pos && s.group === group)) return Number(n);
  }
  return null;
}

/**
 * Camino de una selección que acaba en la posición `pos` (1 o 2) de su grupo.
 * Devuelve la ruta ronda a ronda con sede y posibles rivales.
 */
export function pathFor(group: string, pos: 1 | 2): PathStep[] {
  const start = r32ForSlot(pos, group);
  if (start == null) return [];

  const ourSlotKey = `${pos}${group}`;
  const chain: number[] = [start];
  let cur = start;
  while (parentOf[cur] != null) {
    cur = parentOf[cur];
    chain.push(cur);
  }

  const steps: PathStep[] = [];
  chain.forEach((m, i) => {
    const round = roundOf(m);
    const f = fixtureByN.get(m);
    const city = round === 'FINAL' ? 'Nueva York / Nueva Jersey' : venueCity(f?.venue);
    let rivalSlots: Slot[];
    let exact: string | undefined;
    if (i === 0) {
      const other = R32[m].find((s) => slotKey(s) !== ourSlotKey)!;
      rivalSlots = [other];
      if (!('third' in other)) exact = `${other.pos}.º del Grupo ${other.group}`;
      else exact = 'un mejor tercero';
    } else {
      const prev = chain[i - 1];
      const [c1, c2] = TREE[m];
      const otherChild = c1 === prev ? c2 : c1;
      rivalSlots = leafSlots(otherChild);
    }
    steps.push({
      round,
      roundLabel: ROUND_LABEL[round] ?? round,
      city,
      rival: rivalsFromSlots(rivalSlots),
      exactRivalSlot: exact,
    });
  });
  return steps;
}

export { teamName, groupTeams };

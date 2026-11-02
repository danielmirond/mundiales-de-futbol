import data from '../data/padel.json';

/** Lectura de la copia diaria de Padel API (scripts/padel/snapshot.ts). */
export type PadelPlayer = { id: number; name: string };
export type PadelMatch = { id: number; category: 'men' | 'women'; round: number; roundName: string; date: string; status: string; score: [string, string][] | null; winner: 'team_1' | 'team_2' | null; team1: PadelPlayer[]; team2: PadelPlayer[] };
export type PadelTournament = { id: number; name: string; level: string; status: string; start: string; end: string; location: string; country: string; photo?: string; winners: { men: PadelPlayer[]; women: PadelPlayer[] } | null };
export type PadelRankRow = { id: number; name: string; country: string; pos: number; diff: number; points: number };

export const LEVEL_LABEL: Record<string, string> = { major: 'Major', p1: 'P1', p2: 'P2', finals: 'Finals' };

type PadelData = {
  updatedAt: string; season: number; tournaments: (PadelTournament & { city?: string })[]; draws: Record<string, PadelMatch[]>;
  current: number | null; last: number | null; ranking_men?: { date: string; rows: PadelRankRow[] }; ranking_women?: { date: string; rows: PadelRankRow[] };
};

/* ── Nombres en español ─────────────────────────────────────────────────────
 * Padel API da nombres sin tildes ("Agustin Tapia", "Ariana Sanchez Fallada")
 * y torneos/sedes en inglés ("Brussels P2", "Kuwait City"). Se normalizan al
 * leer la copia para que todas las vistas salgan igual. */

const ACCENTS: Record<string, string> = {
  Agustin: 'Agustín', Galan: 'Galán', Lebron: 'Lebrón', Josemaria: 'Josemaría', Martin: 'Martín', Tomas: 'Tomás',
  Alvaro: 'Álvaro', Jesus: 'Jesús', Jose: 'José', Maria: 'María', Andres: 'Andrés', Inigo: 'Iñigo', Victor: 'Víctor',
  Sofia: 'Sofía', Lucia: 'Lucía', Veronica: 'Verónica', Noemi: 'Noemí', Agueda: 'Águeda', Aimee: 'Aimée', Clement: 'Clément',
  Sanchez: 'Sánchez', Gonzalez: 'González', Fernandez: 'Fernández', Rodriguez: 'Rodríguez', Martinez: 'Martínez', Lopez: 'López',
  Perez: 'Pérez', Garcia: 'García', Gomez: 'Gómez', Diaz: 'Díaz', Dominguez: 'Domínguez', Hernandez: 'Hernández', Gutierrez: 'Gutiérrez',
  Talavan: 'Talaván', Castello: 'Castelló', Canovas: 'Cánovas', Caparros: 'Caparrós', Castillon: 'Castillón', Pelegri: 'Pelegrí',
  Quilez: 'Quílez', Esbri: 'Esbrí', 'Moltò': 'Moltó', Fortun: 'Fortún', Aragon: 'Aragón', Melendez: 'Meléndez', Jimenez: 'Jiménez',
};
/** Segundo nombre de pila: "Juan Ignacio Rubini" no se acorta a "Juan Ignacio". */
const SECOND_GIVEN = new Set(['Ignacio', 'Cruz', 'Antonio', 'Laura', 'Catarina', 'Evangelina', 'Tomas', 'Eulalia', 'Luis', 'Fdz']);
const PARTICLES = new Set(['De', 'Del', 'La', 'Las', 'Los', 'Di', 'Dal', 'Da', 'Van', 'Al']);
/** Nombres portugueses: Sofia Araujo no lleva tilde. */
const NO_ACCENT_IDS = new Set([411, 439]);

export function playerName(id: number, raw: string): string {
  const parts = raw.trim().split(/\s+/);
  // "Ariana Sanchez Fallada" → "Ariana Sánchez": nombre + primer apellido, como en la prensa.
  const short = parts.length === 3 && !SECOND_GIVEN.has(parts[1]) && !parts.some((w) => PARTICLES.has(w)) ? parts.slice(0, 2) : parts;
  if (NO_ACCENT_IDS.has(id)) return short.join(' ');
  return short.map((w) => w.split('-').map((x) => ACCENTS[x] ?? x).join('-')).join(' ');
}

/** Ciudad/país del nombre del torneo → español. */
const CITY_ES: Record<string, string> = {
  'Riyadh Season': 'Riad', Brussels: 'Bruselas', Italy: 'Italia', Bordeaux: 'Burdeos', London: 'Londres', Paris: 'París',
  Germany: 'Alemania', Milano: 'Milán', Dubai: 'Dubái', Mexico: 'México', Newgiza: 'Nueva Giza',
};
const LOCATION_ES: Record<string, string> = {
  Riyadh: 'Riad', 'New Giza': 'Nueva Giza', Brussels: 'Bruselas', Rome: 'Roma', Bordeaux: 'Burdeos', London: 'Londres',
  Paris: 'París', Milan: 'Milán', 'Kuwait City': 'Ciudad de Kuwait', Dubai: 'Dubái', 'Mexico City': 'Ciudad de México',
};

function normalize(raw: PadelData): PadelData {
  const fix = (p: PadelPlayer): PadelPlayer => ({ ...p, name: playerName(p.id, p.name) });
  const tournaments = raw.tournaments.map((t) => {
    const m = t.name.match(/^(.*?)\s+(Major|P1|P2|Finals)\s+(\d{4})$/);
    const city = m ? CITY_ES[m[1]] ?? m[1] : t.name.replace(/\s+\d{4}$/, '');
    const label = LEVEL_LABEL[t.level] ?? t.level;
    return {
      ...t,
      city,
      // "Kuwait Major 2026" → "Major de Kuwait 2026"
      name: m ? `${label} de ${city} ${m[3]}` : t.name,
      location: LOCATION_ES[t.location] ?? t.location,
      winners: t.winners ? { men: t.winners.men.map(fix), women: t.winners.women.map(fix) } : null,
    };
  });
  const draws = Object.fromEntries(Object.entries(raw.draws).map(([k, ms]) => [k, ms.map((m) => ({ ...m, team1: m.team1.map(fix), team2: m.team2.map(fix) }))]));
  const rank = (r?: { date: string; rows: PadelRankRow[] }) => r && { ...r, rows: r.rows.map((x) => ({ ...x, name: playerName(x.id, x.name) })) };
  return { ...raw, tournaments, draws, ranking_men: rank(raw.ranking_men), ranking_women: rank(raw.ranking_women) };
}

const D = normalize(data as unknown as PadelData);

export const padel = () => D;
export const padelTournament = (id: number | null) => (id == null ? undefined : D.tournaments.find((t) => t.id === id));
export const padelDraw = (id: number | null) => (id == null ? [] : D.draws[String(id)] ?? []);

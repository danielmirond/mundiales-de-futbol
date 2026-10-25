import data from '../data/padel.json';

/** Lectura de la copia diaria de Padel API (scripts/padel/snapshot.ts). */
export type PadelPlayer = { id: number; name: string };
export type PadelMatch = { id: number; category: 'men' | 'women'; round: number; roundName: string; date: string; status: string; score: [string, string][] | null; winner: 'team_1' | 'team_2' | null; team1: PadelPlayer[]; team2: PadelPlayer[] };
export type PadelTournament = { id: number; name: string; level: string; status: string; start: string; end: string; location: string; country: string; photo?: string; winners: { men: PadelPlayer[]; women: PadelPlayer[] } | null };
export type PadelRankRow = { id: number; name: string; country: string; pos: number; diff: number; points: number };

const D = data as unknown as {
  updatedAt: string; season: number; tournaments: PadelTournament[]; draws: Record<string, PadelMatch[]>;
  current: number | null; last: number | null; ranking_men?: { date: string; rows: PadelRankRow[] }; ranking_women?: { date: string; rows: PadelRankRow[] };
};

export const padel = () => D;
export const padelTournament = (id: number | null) => (id == null ? undefined : D.tournaments.find((t) => t.id === id));
export const padelDraw = (id: number | null) => (id == null ? [] : D.draws[String(id)] ?? []);
export const LEVEL_LABEL: Record<string, string> = { major: 'Major', p1: 'P1', p2: 'P2', finals: 'Finals' };

/**
 * Datos avanzados de la NFL (nflverse, CC-BY 4.0) desde la copia `src/data/nfl-advanced.json`,
 * que genera `scripts/nfl/snapshot.ts`: probabilidad de victoria por partido (id de ESPN)
 * y ranking de quarterbacks por EPA y CPOE.
 */
import data from '@/data/nfl-advanced.json';

export type NflTeam = { name: string; nick: string; color: string };
export type NflQb = { name: string; espnId?: string; team: string; plays: number; games: number; epa: number; cpoe: number | null };
export type NflWinProb = { home: string; away: string; final: [number, number]; pts: [number, number][]; scores: { t: number; team: string; text: string }[] };
type Snap = { updatedAt: string; season: number; week: number; minPlays: number; teams: Record<string, NflTeam>; qbs: NflQb[]; wp: Record<string, NflWinProb> };

const S = data as unknown as Snap;
export const nflSnapshot = () => S;
export const nflWinProb = (espnId: string) => S.wp[espnId];
export const nflTeam = (abbr: string) => S.teams[abbr];

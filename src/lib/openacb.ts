/**
 * OpenACB (github.com/juantorrecillas/openacb, AGPL-3.0): estadísticas
 * avanzadas de la Liga Endesa a partir del play-by-play de acb.com, con
 * actualización semanal. Se consume como fuente de datos (JSON publicados en
 * el repositorio) con crédito visible; aquí solo se lee el snapshot que
 * genera `scripts/openacb/snapshot.ts`.
 */
import snapshotRaw from '@/data/openacb-snapshot.json';

export type AcbTeam = {
  team: string; teamId: string; season: number; games: number; wins: number; losses: number;
  ppg: number; opp_ppg: number; pace: number; ortg: number; drtg: number; netRtg: number;
  efg: number; ts: number; threeRate: number; threePct: number; tovRate: number; orbPct: number; drbPct: number; ftRate: number; astRate: number;
  rpg: number; apg: number; logo?: string;
};
export type AcbPace = { team: string; teamId: string; games: number; quarters: { scored: number[]; allowed: number[]; diff: number[] }; bestQ: number; worstQ: number };
export type OpenAcbSnapshot = { updatedAt: string; source: string; season: number; seasonName: string; teams: AcbTeam[]; pace: AcbPace[] };

export const OPENACB_REPO = 'https://github.com/juantorrecillas/openacb';
export const OPENACB_RAW = 'https://raw.githubusercontent.com/juantorrecillas/openacb/HEAD/openacb_react/public/data';

export const getOpenAcb = (): OpenAcbSnapshot => snapshotRaw as unknown as OpenAcbSnapshot;

/**
 * Trayectoria de pilotos de Fórmula 1 desde una copia guardada en el repo
 * (`src/data/f1-pilotos.json`), generada con `scripts/f1/snapshot.ts` a partir de
 * Jolpica (sucesora de Ergast). La web no depende de que Jolpica esté en pie.
 */
import data from '@/data/f1-pilotos.json';

export type F1Season = { season: number; position: number | null; points: number; wins: number; teams: string[] };
export type F1Driver = {
  id: string;
  slug: string;
  name: string;
  code?: string;
  number?: string;
  nationality?: string;
  birth?: string;
  starts: number;
  wins: number;
  podiums: number;
  poles: number;
  titles: number[];
  firstRace?: { season: number; race: string };
  firstWin?: { season: number; race: string };
  lastWin?: { season: number; race: string };
  seasons: F1Season[];
};
export type F1Snapshot = { updatedAt: string; drivers: F1Driver[] };

const SNAP = data as F1Snapshot;

export const f1Drivers = () => SNAP.drivers;
export const f1Driver = (slug: string) => SNAP.drivers.find((d) => d.slug === slug);
export const f1UpdatedAt = () => SNAP.updatedAt;

const NAT_ES: Record<string, string> = {
  Spanish: 'España', British: 'Reino Unido', Dutch: 'Países Bajos', Monegasque: 'Mónaco', Australian: 'Australia', Mexican: 'México', German: 'Alemania',
  French: 'Francia', Canadian: 'Canadá', Finnish: 'Finlandia', Thai: 'Tailandia', Japanese: 'Japón', Chinese: 'China', Danish: 'Dinamarca', American: 'Estados Unidos',
  Italian: 'Italia', Brazilian: 'Brasil', Argentine: 'Argentina', 'New Zealander': 'Nueva Zelanda', Austrian: 'Austria', Polish: 'Polonia', Swiss: 'Suiza', Belgian: 'Bélgica',
};
export const nationalityEs = (n?: string) => (n ? NAT_ES[n] ?? n : undefined);

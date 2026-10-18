/**
 * UFC desde la copia guardada en el repo (`src/data/ufc-snapshot.json`), que genera
 * `scripts/ufc/snapshot.ts` con la cuota gratuita de Cito (500 consultas al mes).
 * La web nunca llama a Cito: una URL que no esté en la copia da 404.
 */
import data from '@/data/ufc-snapshot.json';
import type { UfcDivision, UfcEvent, UfcFighter } from './cito-ufc';

export type UfcEventRef = { slug: string; title: string; startsAt: string; place?: string };
export type UfcSnapshot = {
  updatedAt: string;
  usage: { month: string; calls: number };
  rankings?: { at: string; system: string; divisions: UfcDivision[] };
  events?: { at: string; upcoming: UfcEventRef[]; recent: UfcEventRef[] };
  eventDetails: Record<string, UfcEvent & { fetchedAt: string }>;
  fighters: Record<string, UfcFighter & { fetchedAt: string }>;
  missing?: string[];
};

const S = data as unknown as UfcSnapshot;

export const ufcRankings = () => S.rankings?.divisions ?? [];
export const ufcFighter = (slug: string) => S.fighters[slug];
export const hasUfcFighter = (slug?: string) => Boolean(slug && S.fighters[slug]);
export const ufcFighterSlugs = () => Object.keys(S.fighters);
export const ufcEvent = (slug: string) => S.eventDetails[slug];
export const hasUfcEvent = (slug?: string) => Boolean(slug && S.eventDetails[slug]);
/** Veladas con ficha: las próximas (por fecha) y las ya disputadas (de la más reciente a la más antigua). */
export function ufcEventList(now = Date.now()) {
  const all = Object.values(S.eventDetails).sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  return {
    upcoming: all.filter((e) => e.status !== 'completed' && Date.parse(e.startsAt) > now - 8 * 3600_000),
    recent: all.filter((e) => e.status === 'completed').reverse(),
  };
}

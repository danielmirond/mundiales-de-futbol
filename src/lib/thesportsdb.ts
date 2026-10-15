/**
 * Datos de club y estadio de TheSportsDB (clave gratuita, sin imágenes ni
 * textos: solo hechos). Se leen de un snapshot en el repo que genera
 * `scripts/thesportsdb/snapshot.ts`; en runtime no se llama a la API.
 * Clave del snapshot: `{deporte ESPN}:{id de equipo ESPN}` (p. ej. `soccer:90`).
 */
import snapshot from '@/data/thesportsdb-snapshot.json';

export const TSDB_SITE = 'https://www.thesportsdb.com';

/** Foto del estadio en Wikimedia Commons (vía Wikidata P18), con licencia libre. */
export type VenuePhoto = { url: string; width: number; height: number; credit: string; license: string; page: string; wikidata: string; label: string };
export type ClubVenue = {
  name: string;
  photo?: VenuePhoto;
  /** Última búsqueda de foto (con o sin resultado), para no repetirla cada mes. */
  photoCheckedAt?: string;
  alternate?: string[];
  capacity?: number;
  opened?: number;
  location?: string;
  lat?: number;
  lng?: number;
};
export type ClubFacts = {
  tsdbId: string;
  formed?: number;
  alternate?: string[];
  website?: string;
  social?: { instagram?: string; x?: string; facebook?: string; youtube?: string };
  /** Canal oficial de YouTube (UC…), para el feed RSS de vídeos recientes. */
  youtubeChannelId?: string;
  venue?: ClubVenue;
  checkedAt: string;
};
export type ClubEntry = ClubFacts | { miss: true; checkedAt: string };
export type TsdbSnapshot = { updatedAt: string; source: string; teams: Record<string, ClubEntry> };

const SNAP = snapshot as unknown as TsdbSnapshot;

/** Hechos del club por equipo ESPN, o `null` si no hay cruce. */
export function clubFacts(espnSport: string | undefined, espnTeamId: string | undefined): ClubFacts | null {
  if (!espnSport || !espnTeamId) return null;
  const e = SNAP.teams?.[`${espnSport}:${espnTeamId}`];
  return e && !('miss' in e) ? e : null;
}

import data from '../data/stadium-photos.json';

/** Foto genérica 16:9 del estadio de cada equipo (Wikimedia Commons, licencia libre). Clave: id de equipo de ESPN. */
export type StadiumPhoto = { team: string; venue: string; url: string; alt: string; credit: string; license: string };

const BANK = data as Record<string, StadiumPhoto>;

export const stadiumPhoto = (teamId?: string): StadiumPhoto | undefined => (teamId ? BANK[teamId] : undefined);

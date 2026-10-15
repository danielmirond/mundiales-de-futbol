/**
 * Campañas de afiliado (Movistar Plus+, DAZN) para los huecos publicitarios.
 * Fuente: src/data/campanas-afiliado.json, alimentado desde los correos de
 * los programas en Awin. Sin red: se resuelve en el render.
 */
import data from '@/data/campanas-afiliado.json';

export type Placement = 'home' | 'noticia' | 'competicion' | 'directo';
export type Campaign = {
  id: string;
  anunciante: 'movistar' | 'dazn';
  tipo: string;
  titulo: string;
  texto: string;
  cta: string;
  url: string;
  imagen: string | null;
  desde: string;
  hasta: string;
  ubicaciones: Placement[];
  deportes: string[];
};

const ALL = data.campanas as Campaign[];
const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(new Date());

/** Campañas activas para una ubicación; las del deporte de la página primero. */
export function activeCampaigns(placement: Placement, sport?: string): Campaign[] {
  const d = today();
  return ALL.filter((c) => c.desde <= d && d <= c.hasta && c.ubicaciones.includes(placement)
    && (c.deportes.length === 0 || (sport ? c.deportes.includes(sport) : false)))
    .sort((a, b) => Number(Boolean(sport && b.deportes.includes(sport))) - Number(Boolean(sport && a.deportes.includes(sport))));
}

/** Una campaña para un hueco: rota por día entre las activas (estable dentro del día). */
export function pickCampaign(placement: Placement, sport?: string, salt = 0): Campaign | null {
  const list = activeCampaigns(placement, sport);
  if (list.length === 0) return null;
  const specific = list.filter((c) => sport && c.deportes.includes(sport));
  const pool = specific.length ? specific : list;
  const day = Math.floor(Date.now() / 86_400_000);
  return pool[(day + salt) % pool.length];
}

export const ADVERTISER: Record<Campaign['anunciante'], { name: string; bg: string; fg: string }> = {
  movistar: { name: 'Movistar Plus+', bg: '#0b1f3a', fg: '#ffffff' },
  dazn: { name: 'DAZN', bg: '#0c161c', fg: '#f7ff1a' },
};

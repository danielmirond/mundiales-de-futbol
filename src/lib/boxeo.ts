/**
 * Boxeo: calendario curado de veladas (no hay API abierta que lo cubra: ESPN
 * no tiene boxeo y TheSportsDB gratis solo da 5). Se alimenta de las alertas
 * del programa de afiliados de DAZN y de las webs oficiales.
 */
import data from '@/data/boxeo-veladas.json';

export type Velada = {
  slug: string;
  fecha: string;
  horaEspana: string | null;
  pelea: { a: string; b: string };
  titulo: string | null;
  sede: string | null; ciudad: string | null; pais: string | null;
  tv: { plataforma: string; modalidad: string; precio: string | null } | null;
  contexto: string | null;
  fuente: string;
};

const ALL = (data.veladas as Velada[]).slice().sort((a, b) => a.fecha.localeCompare(b.fecha));

export const madridToday = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(new Date());
export const veladas = () => ALL;
export const proximasVeladas = () => ALL.filter((v) => v.fecha >= madridToday());
export const pasadasVeladas = () => ALL.filter((v) => v.fecha < madridToday()).reverse();
export const getVelada = (slug: string) => ALL.find((v) => v.slug === slug);
export const veladaNombre = (v: Velada) => `${v.pelea.a} - ${v.pelea.b}`;

export const fechaLarga = (iso: string) =>
  new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`));

/** Enlace de afiliado de DAZN (Awin 126263, publisher 2898755). */
export const DAZN_AFF = 'https://www.awin1.com/cread.php?awinmid=126263&awinaffid=2898755&ued=' + encodeURIComponent('https://www.dazn.com/es-ES/home');

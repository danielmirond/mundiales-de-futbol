import { SPORTS, COMPETITIONS, liveCompetitions, competitionPath } from '@/lib/competitions';

export type NavSport = { slug: string; name: string; live: boolean; count: number };
export type NavComp = { slug: string; sport: string; name: string; href: string; live: boolean };

/** Deportes con datos en vivo (barra) y en cola (mega-menú). */
export const NAV_SPORTS: NavSport[] = SPORTS.map((s) => ({
  slug: s.slug, name: s.name, live: liveCompetitions(s.slug).length > 0 || COMPETITIONS.some((c) => c.sport === s.slug && !!c.stats), count: COMPETITIONS.filter((c) => c.sport === s.slug).length,
}));

/** Competiciones por deporte (subnav), serializables para componentes cliente. */
export const NAV_COMPS: NavComp[] = COMPETITIONS.map((c) => ({
  slug: c.slug, sport: c.sport, name: c.shortName ?? c.name, href: competitionPath(c), live: !!c.espn || !!c.href || !!c.stats,
}));

/** Deportes sin fuente todavía (mega-menú «Más deportes»). `href` solo si existe la página. */
export const MORE_SPORTS: { icon: string; name: string; items: string[]; href?: string; soon?: boolean }[] = [
  { icon: 'ciclismo', name: 'Ciclismo', items: ['Tour · Giro · Vuelta', 'Clásicas · Mundial'], soon: true },
  { icon: 'atletismo', name: 'Atletismo y natación', items: ['Mundiales', 'Diamond League · maratones'], soon: true },
  { icon: 'baloncesto', name: 'Universitario (NCAA)', items: ['Baloncesto masculino y femenino', 'Fútbol americano · ranking AP'], href: '/universitario' },
  { icon: 'combate', name: 'Boxeo', items: ['Veladas y títulos mundiales'], href: '/combate/boxeo' },
  { icon: 'trofeo', name: 'Multideporte', items: ['Juegos Olímpicos 2028', 'Juegos de Invierno 2030'], soon: true },
];

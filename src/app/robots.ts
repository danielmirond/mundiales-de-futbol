import type { MetadataRoute } from 'next';

const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mundiales-de-futbol.com').trim();

const SPORTS = ['futbol', 'baloncesto', 'futbol-americano', 'rugby', 'hockey', 'beisbol', 'motor', 'tenis', 'golf', 'combate', 'balonmano', 'padel'];

/**
 * Rastreo bloqueado (2026-10-25) solo en patrones que Google no tenía indexados
 * (0-4 % en la inspección de 751 URLs) y que ya llevan noindex por index-policy.ts:
 * así no gasta rastreo en ellos ni quedan URLs «indexadas aunque bloqueadas».
 * Las fichas de equipo de ligas menores y las crónicas automáticas siguen solo con
 * noindex (robots.txt no distingue liga menor de grande). Los patrones de
 * partidos-hoy y alineaciones van por deporte para no tocar /2026/… del archivo.
 */
const DISALLOW = [
  '/api/',
  '/*/equipo/*/calendario',
  '/*/equipo/*/resultados',
  '/*/equipo/*/plantilla',
  '/*/goleadores',
  '/*/lesionados',
  '/*/jugador/',
  '/*/resultados/jornada-',
  '/futbol/*/alineaciones',
  ...SPORTS.map((s) => `/${s}/*/partidos-hoy`),
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: DISALLOW,
      },
    ],
    sitemap: [
      `${SITE}/sitemap.xml`,
      `${SITE}/news.xml`,
      `${SITE}/image-sitemap.xml`,
    ],
    host: SITE,
  };
}

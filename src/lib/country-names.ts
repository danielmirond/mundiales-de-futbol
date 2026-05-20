/**
 * Mapeo de códigos FIFA / ISO de 3 letras a nombres de país en español.
 *
 * Cobertura:
 *  - Las 48 selecciones del Mundial 2026 (re-exportadas desde TEAMS_2026).
 *  - Países no-Mundial cuyos clubes aparecen como `clubCountry` de
 *    jugadores convocados (RUS, DEN, SAU, etc.).
 *
 * Si llega un código que no está mapeado, devolvemos el código tal cual
 * — preferimos un "FRA" visible a un fallo silencioso.
 */

import { TEAMS_2026 } from './wc-2026';

const EXTRA_COUNTRIES: Record<string, string> = {
  // Países cuyos clubes albergan jugadores pero no compiten en el Mundial.
  RUS: 'Rusia',
  DEN: 'Dinamarca',
  SAU: 'Arabia Saudí',
  GRE: 'Grecia',
  UKR: 'Ucrania',
  CHN: 'China',
  JPN: 'Japón',
  ROU: 'Rumanía',
  BUL: 'Bulgaria',
  POL: 'Polonia',
  HUN: 'Hungría',
  ISR: 'Israel',
  CYP: 'Chipre',
  // Selecciones que NO compiten en 2026 pero sí aparecen en datos
  // históricos (goles famosos, palmarés, etc.):
  CMR: 'Camerún',
  SRB: 'Serbia',
  // Variantes comunes (3 letras alternativas vs ISO):
  HOL: 'Países Bajos',
  GBR: 'Reino Unido',
};

export function countryName(code: string | undefined | null): string {
  if (!code) return '';
  const upper = code.toUpperCase();
  const teamName = TEAMS_2026[upper]?.name;
  if (teamName) return teamName;
  return EXTRA_COUNTRIES[upper] ?? upper;
}

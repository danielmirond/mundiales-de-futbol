/**
 * Zonas de clasificación por competición (marca de 3 px junto a la posición).
 * ESPN no las sirve en `standings`, así que van en configuración.
 * Rangos [desde, hasta] inclusivos sobre la posición.
 */
export type ZoneKey = 'ucl' | 'uel' | 'uecl' | 'up' | 'down' | 'playoff';
export type ZoneDef = { key: ZoneKey; range: [number, number]; label: string };

export const ZONE_VAR: Record<ZoneKey, string> = {
  ucl: 'var(--zone-ucl)', uel: 'var(--zone-uel)', uecl: 'var(--zone-uecl)',
  up: 'var(--zone-up)', down: 'var(--zone-down)', playoff: 'var(--zone-playoff)',
};

const BIG5 = (ucl: number, uel: number, uecl: number, down: [number, number]): ZoneDef[] => [
  { key: 'ucl', range: [1, ucl], label: 'Champions' },
  { key: 'uel', range: [ucl + 1, ucl + uel], label: 'Europa League' },
  { key: 'uecl', range: [ucl + uel + 1, ucl + uel + uecl], label: 'Conference' },
  { key: 'down', range: down, label: 'Descenso' },
];

export const ZONES: Record<string, ZoneDef[]> = {
  laliga: BIG5(4, 1, 1, [18, 20]),
  'premier-league': BIG5(5, 1, 1, [18, 20]),
  'serie-a': BIG5(4, 1, 1, [18, 20]),
  bundesliga: BIG5(4, 1, 1, [16, 18]),
  'ligue-1': BIG5(3, 1, 1, [16, 18]),
  'laliga-2': [
    { key: 'up', range: [1, 2], label: 'Ascenso directo' },
    { key: 'playoff', range: [3, 6], label: 'Playoff de ascenso' },
    { key: 'down', range: [19, 22], label: 'Descenso' },
  ],
  'champions-league': [
    { key: 'up', range: [1, 8], label: 'Octavos directos' },
    { key: 'playoff', range: [9, 24], label: 'Playoff' },
  ],
  'europa-league': [
    { key: 'up', range: [1, 8], label: 'Octavos directos' },
    { key: 'playoff', range: [9, 24], label: 'Playoff' },
  ],
  'conference-league': [
    { key: 'up', range: [1, 8], label: 'Octavos directos' },
    { key: 'playoff', range: [9, 24], label: 'Playoff' },
  ],
  nba: [
    { key: 'up', range: [1, 6], label: 'Playoff directo' },
    { key: 'playoff', range: [7, 10], label: 'Play-in' },
  ],
  euroliga: [
    { key: 'up', range: [1, 6], label: 'Playoff directo' },
    { key: 'playoff', range: [7, 10], label: 'Play-in' },
  ],
};

export function zoneFor(compSlug: string, rank: number): ZoneDef | undefined {
  return ZONES[compSlug]?.find((z) => rank >= z.range[0] && rank <= z.range[1]);
}

import { createClient } from '@/lib/supabase/server';
import historicalMatchesRaw from '@/lib/wc-historical-matches.json';
import teamsRaw from '@/lib/wc-teams.json';

export type Match = {
  match_number: number;
  stage: string;
  match_date: string;
  home_code: string;
  away_code: string;
  home_score: number | null;
  away_score: number | null;
  home_score_pk: number | null;
  away_score_pk: number | null;
  winner_code: string | null;
  home_team: { name_official: string; flag_emoji: string | null } | null;
  away_team: { name_official: string; flag_emoji: string | null } | null;
  venue: { name: string; city: string | null } | null;
  referee: { full_name: string } | null;
};

export const STAGE_ORDER: Record<string, number> = {
  group: 0,
  group2: 1,
  r16: 2,
  qf: 3,
  sf: 4,
  '3rd': 5,
  final_group: 5,
  final: 6,
};

export const STAGE_LABEL_ES: Record<string, string> = {
  group: 'Fase de grupos',
  group2: 'Segunda fase de grupos',
  r16: 'Octavos de final',
  qf: 'Cuartos de final',
  sf: 'Semifinales',
  '3rd': 'Tercer puesto',
  final_group: 'Grupo final',
  final: 'Final',
};

type HistoricalRow = {
  match_number: number;
  stage: string;
  match_date: string;
  home_code: string;
  away_code: string;
  home_score: number | null;
  away_score: number | null;
  home_score_et: number | null;
  away_score_et: number | null;
  home_score_pk: number | null;
  away_score_pk: number | null;
  winner_code: string | null;
  venue_name: string | null;
  venue_city: string | null;
};

type TeamRow = { code: string; name_official: string; flag_emoji: string | null };

const HISTORICAL_MATCHES = historicalMatchesRaw as Record<string, HistoricalRow[]>;
const TEAMS_BY_CODE: Record<string, TeamRow> = (() => {
  const idx: Record<string, TeamRow> = {};
  for (const t of teamsRaw as TeamRow[]) idx[t.code] = t;
  return idx;
})();

function historicalToMatch(row: HistoricalRow): Match {
  const home = TEAMS_BY_CODE[row.home_code];
  const away = TEAMS_BY_CODE[row.away_code];
  // split "Stadium, City" into venue name + city
  let venueName: string | null = row.venue_name ?? null;
  let venueCity: string | null = row.venue_city ?? null;
  if (venueName && !venueCity && venueName.includes(',')) {
    const idx = venueName.lastIndexOf(',');
    venueCity = venueName.slice(idx + 1).trim();
    venueName = venueName.slice(0, idx).trim();
  }
  return {
    match_number: row.match_number,
    stage: row.stage,
    match_date: row.match_date,
    home_code: row.home_code,
    away_code: row.away_code,
    home_score: row.home_score,
    away_score: row.away_score,
    home_score_pk: row.home_score_pk,
    away_score_pk: row.away_score_pk,
    winner_code: row.winner_code,
    home_team: home ? { name_official: home.name_official, flag_emoji: home.flag_emoji } : null,
    away_team: away ? { name_official: away.name_official, flag_emoji: away.flag_emoji } : null,
    venue: venueName ? { name: venueName, city: venueCity } : null,
    referee: null,
  };
}

export function getHistoricalMatches(year: number): Match[] {
  const rows = HISTORICAL_MATCHES[String(year)] ?? [];
  return rows.map(historicalToMatch);
}

export async function getMatchesForTournament(year: number): Promise<Match[]> {
  // For pre-2018 tournaments, use static historical dataset (openfootball).
  // Supabase only has full data for 2018+ and only knockouts for older.
  if (year < 2018) {
    const historical = getHistoricalMatches(year);
    if (historical.length > 0) return historical;
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('matches')
      .select(
        `match_number, stage, match_date, home_code, away_code,
         home_score, away_score, home_score_pk, away_score_pk, winner_code,
         home_team:teams!matches_home_code_fkey(name_official, flag_emoji),
         away_team:teams!matches_away_code_fkey(name_official, flag_emoji),
         venue:venues!matches_venue_id_fkey(name, city),
         referee:referees!matches_referee_id_fkey(full_name)`,
      )
      .eq('tournament_year', year)
      .order('match_date', { ascending: true });

    if (error) throw error;
    return (data ?? []) as unknown as Match[];
  } catch (err) {
    console.error('getMatchesForTournament failed:', err);
    return [];
  }
}

export function groupByStage(matches: Match[]): Array<{ stage: string; matches: Match[] }> {
  const groups = new Map<string, Match[]>();
  for (const m of matches) {
    if (!groups.has(m.stage)) groups.set(m.stage, []);
    groups.get(m.stage)!.push(m);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => (STAGE_ORDER[a] ?? 99) - (STAGE_ORDER[b] ?? 99))
    .map(([stage, matches]) => ({ stage, matches }));
}

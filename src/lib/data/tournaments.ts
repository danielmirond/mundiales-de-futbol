import { createClient } from '@/lib/supabase/server';
import { TOURNAMENTS as STATIC_TOURNAMENTS, type Tournament } from '@/lib/tournaments';

export type TournamentRow = {
  year: number;
  slug: string;
  host_country: string;
  host_countries: string[] | null;
  champion_code: string | null;
  teams: number | null;
  matches_played: number | null;
  goals: number | null;
  attendance: number | null;
  start_date: string | null;
  end_date: string | null;
  top_scorer_name: string | null;
  top_scorer_goals: number | null;
  top_scorer_team: string | null;
  palette_from: string | null;
  palette_to: string | null;
  tagline_i18n: Record<string, string> | null;
  summary_i18n: Record<string, string> | null;
  hero_image_url: string | null;
};

// Lookup by champion_code → localized display name (until we read from `teams`).
// Lookup `seoIconic` (descriptor SEO largo) por año desde el seed estático,
// porque Supabase aún no tiene esa columna.
const STATIC_SEO_ICONIC: Record<number, string> = Object.fromEntries(
  STATIC_TOURNAMENTS.map((t) => [t.year, t.seoIconic]),
);

/**
 * Lookup de campos de palmarés (runnerUp, third, fourth, finalResult, bestPlayer)
 * desde el seed estático. Estos no existen en Supabase aún, así que los
 * resolvemos por año con esta tabla derivada.
 */
const STATIC_PALMARES: Record<
  number,
  Pick<Tournament, 'runnerUp' | 'runnerUpCode' | 'third' | 'thirdCode' | 'fourth' | 'fourthCode' | 'finalResult' | 'bestPlayer'>
> = Object.fromEntries(
  STATIC_TOURNAMENTS.map((t) => [
    t.year,
    {
      runnerUp: t.runnerUp,
      runnerUpCode: t.runnerUpCode,
      third: t.third,
      thirdCode: t.thirdCode,
      fourth: t.fourth,
      fourthCode: t.fourthCode,
      finalResult: t.finalResult,
      bestPlayer: t.bestPlayer,
    },
  ]),
);

const TEAM_NAME_ES: Record<string, string> = {
  URU: 'Uruguay', ARG: 'Argentina', BRA: 'Brasil', ITA: 'Italia', FRA: 'Francia',
  GER: 'Alemania', FRG: 'Alemania Occidental', ENG: 'Inglaterra', ESP: 'España',
  MEX: 'México', USA: 'Estados Unidos', CAN: 'Canadá', CHI: 'Chile', SUI: 'Suiza',
  SWE: 'Suecia', KOR: 'Corea del Sur', JPN: 'Japón', RSA: 'Sudáfrica', RUS: 'Rusia',
  QAT: 'Qatar',
};

function rowToTournament(row: TournamentRow, locale: string): Tournament {
  const tagline =
    row.tagline_i18n?.[locale] ??
    row.tagline_i18n?.es ??
    '';
  const summary =
    row.summary_i18n?.[locale] ??
    row.summary_i18n?.es ??
    undefined;
  return {
    year: row.year,
    slug: row.slug,
    host: row.host_country,
    hostCode: row.host_countries?.[0] ?? '',
    hostCountries: row.host_countries ?? undefined,
    champion: row.champion_code ? (TEAM_NAME_ES[row.champion_code] ?? row.champion_code) : '—',
    championCode: row.champion_code ?? 'TBD',
    teams: row.teams ?? 0,
    matches: row.matches_played ?? 0,
    goals: row.goals ?? 0,
    attendance: row.attendance ?? 0,
    startDate: row.start_date ?? '',
    endDate: row.end_date ?? '',
    topScorer:
      row.top_scorer_name && row.top_scorer_goals
        ? { name: row.top_scorer_name, goals: row.top_scorer_goals, team: row.top_scorer_team ?? '' }
        : undefined,
    palette: {
      from: row.palette_from ?? '#222',
      to: row.palette_to ?? '#444',
    },
    tagline,
    seoIconic: STATIC_SEO_ICONIC[row.year] ?? tagline,
    ...(STATIC_PALMARES[row.year] ?? {}),
    summary,
    heroImageUrl: row.hero_image_url,
  };
}

/**
 * Fetch all tournaments from Supabase, falling back to static seed if the DB
 * is unavailable (e.g. during local development without credentials).
 */
export async function getAllTournaments(locale = 'es'): Promise<Tournament[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('tournaments')
      .select(
        'year,slug,host_country,host_countries,champion_code,teams,matches_played,goals,attendance,start_date,end_date,top_scorer_name,top_scorer_goals,top_scorer_team,palette_from,palette_to,tagline_i18n,summary_i18n,hero_image_url',
      )
      .order('year', { ascending: true });

    if (error) throw error;
    if (!data || data.length === 0) return STATIC_TOURNAMENTS;

    return (data as TournamentRow[]).map((r) => rowToTournament(r, locale));
  } catch {
    return STATIC_TOURNAMENTS;
  }
}

export async function getTournamentBySlug(slug: string, locale = 'es'): Promise<Tournament | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('tournaments')
      .select(
        'year,slug,host_country,host_countries,champion_code,teams,matches_played,goals,attendance,start_date,end_date,top_scorer_name,top_scorer_goals,top_scorer_team,palette_from,palette_to,tagline_i18n,summary_i18n,hero_image_url',
      )
      .eq('slug', slug)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      const fallback = STATIC_TOURNAMENTS.find((t) => t.slug === slug);
      return fallback ?? null;
    }
    return rowToTournament(data as TournamentRow, locale);
  } catch {
    return STATIC_TOURNAMENTS.find((t) => t.slug === slug) ?? null;
  }
}

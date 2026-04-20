import { createClient } from '@/lib/supabase/server';

export type Venue = {
  id: string;
  slug: string;
  name: string;
  city: string | null;
  country_code: string | null;
  latitude: number | null;
  longitude: number | null;
  hero_image_url: string | null;
};

export type VenueWithStats = Venue & {
  matches_played: number;
  wc_years: number[];
};

export async function getAllVenues(): Promise<VenueWithStats[]> {
  try {
    const supabase = await createClient();
    const { data: venues, error } = await supabase
      .from('venues')
      .select('id, slug, name, city, country_code, latitude, longitude, hero_image_url')
      .order('name', { ascending: true });
    if (error) throw error;
    if (!venues) return [];

    // Count matches + distinct years per venue in one query.
    const { data: matches } = await supabase
      .from('matches')
      .select('venue_id, tournament_year')
      .not('venue_id', 'is', null);

    type Bucket = { count: number; years: Set<number> };
    const byVenue = new Map<string, Bucket>();
    for (const m of (matches ?? []) as { venue_id: string; tournament_year: number }[]) {
      let b = byVenue.get(m.venue_id);
      if (!b) {
        b = { count: 0, years: new Set() };
        byVenue.set(m.venue_id, b);
      }
      b.count++;
      b.years.add(m.tournament_year);
    }

    return venues
      .map((v) => ({
        ...(v as Venue),
        matches_played: byVenue.get(v.id)?.count ?? 0,
        wc_years: [...(byVenue.get(v.id)?.years ?? [])].sort(),
      }))
      .sort((a, b) => b.matches_played - a.matches_played);
  } catch (err) {
    console.error('getAllVenues:', err);
    return [];
  }
}

export async function getVenueBySlug(slug: string): Promise<Venue | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('venues')
      .select('id, slug, name, city, country_code, latitude, longitude, hero_image_url')
      .eq('slug', slug)
      .maybeSingle();
    if (error) throw error;
    return (data as Venue | null) ?? null;
  } catch (err) {
    console.error('getVenueBySlug:', err);
    return null;
  }
}

export type VenueMatchRow = {
  id: string;
  tournament_year: number;
  match_number: number;
  stage: string | null;
  match_date: string;
  home_code: string;
  away_code: string;
  home_score: number | null;
  away_score: number | null;
  attendance: number | null;
};

export async function getVenueMatches(venueId: string): Promise<VenueMatchRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('matches')
      .select(
        'id, tournament_year, match_number, stage, match_date, home_code, away_code, home_score, away_score, attendance',
      )
      .eq('venue_id', venueId)
      .order('match_date', { ascending: false });
    if (error) throw error;
    return (data ?? []) as VenueMatchRow[];
  } catch (err) {
    console.error('getVenueMatches:', err);
    return [];
  }
}

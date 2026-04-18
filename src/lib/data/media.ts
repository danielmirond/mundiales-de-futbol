import { createClient } from '@/lib/supabase/server';

export type MediaItem = {
  id: string;
  kind: string;
  source: string;
  source_id: string | null;
  url: string | null;
  embed_url: string | null;
  thumbnail_url: string | null;
  tournament_year: number | null;
  title_i18n: Record<string, string> | null;
  description_i18n: Record<string, string> | null;
  attribution: string | null;
  featured: boolean;
};

export async function getMediaForTournament(year: number): Promise<MediaItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('media')
      .select(
        'id, kind, source, source_id, url, embed_url, thumbnail_url, tournament_year, title_i18n, description_i18n, attribution, featured',
      )
      .eq('tournament_year', year)
      .order('featured', { ascending: false });
    if (error) throw error;
    return (data ?? []) as MediaItem[];
  } catch {
    return [];
  }
}

export function mediaTitle(m: MediaItem, locale = 'es') {
  return (m.title_i18n?.[locale] ?? m.title_i18n?.es ?? m.title_i18n?.en ?? 'Video') as string;
}

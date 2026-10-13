import { createClient } from '@/lib/supabase/server';

export type EditionScorer = { slug: string | null; name: string; team_code: string; goals: number; penalties: number };

/**
 * Goleadores de una edición a partir de los eventos de partido (gol y gol de
 * penalti; los autogoles no cuentan). Solo ediciones con eventos cargados
 * (2018 en adelante y las eliminatorias de algunas anteriores).
 */
export async function getScorersForTournament(year: number, limit = 15): Promise<EditionScorer[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('match_events')
      .select(`event_type, team_code, player:players!match_events_player_id_fkey(full_name, known_as, slug), match:matches!inner(tournament_year)`)
      .eq('match.tournament_year', year)
      .in('event_type', ['goal', 'penalty_goal']);
    if (error) throw error;
    const acc = new Map<string, EditionScorer>();
    for (const row of (data ?? []) as unknown as { event_type: string; team_code: string; player: { full_name: string; known_as: string | null; slug: string | null } | null }[]) {
      if (!row.player) continue;
      const key = row.player.slug ?? row.player.full_name;
      const cur = acc.get(key) ?? { slug: row.player.slug, name: row.player.known_as ?? row.player.full_name, team_code: row.team_code, goals: 0, penalties: 0 };
      cur.goals += 1;
      if (row.event_type === 'penalty_goal') cur.penalties += 1;
      acc.set(key, cur);
    }
    return [...acc.values()].sort((a, b) => b.goals - a.goals || a.penalties - b.penalties || a.name.localeCompare(b.name)).slice(0, limit);
  } catch (err) {
    console.error('getScorersForTournament:', err);
    return [];
  }
}

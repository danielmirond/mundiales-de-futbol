import { createClient } from '@/lib/supabase/server';

type ShotRow = {
  minute: number | null;
  team_code: string | null;
  player_id: string | null;
  start_x: number | null;
  start_y: number | null;
  body_part: string | null;
  outcome: string;
  xg: number | null;
  pattern: string | null;
  player: { known_as: string | null; full_name: string; slug: string } | null;
};

const PITCH_W = 120;
const PITCH_H = 80;

function outcomeColor(outcome: string) {
  if (outcome === 'goal') return 'var(--color-pitch)';
  if (outcome === 'post') return 'var(--color-sun)';
  if (outcome === 'saved') return '#9ea3ad';
  return 'rgba(255, 59, 59, 0.75)';
}

function outcomeLabel(outcome: string): string {
  return {
    goal: 'Gol',
    saved: 'Parada',
    off_target: 'Fuera',
    blocked: 'Bloqueado',
    post: 'Palo',
  }[outcome] ?? outcome;
}

type Stats = { shots: number; goals: number; xg: number };

function accumulate(rows: ShotRow[]): Stats {
  return rows.reduce<Stats>(
    (s, r) => ({
      shots: s.shots + 1,
      goals: s.goals + (r.outcome === 'goal' ? 1 : 0),
      xg: s.xg + (r.xg ?? 0),
    }),
    { shots: 0, goals: 0, xg: 0 },
  );
}

function radius(xg: number | null) {
  const v = xg ?? 0.05;
  return 0.9 + Math.sqrt(v) * 3.3;
}

/**
 * Full-pitch shot map. The home team attacks right → shots drawn as-is
 * on the right half; the away team attacks left → mirror their shots
 * to the left half. Radius ∝ √xG, colour encodes outcome.
 */
export async function ShotMap({
  matchId,
  homeCode,
  awayCode,
}: {
  matchId: string;
  homeCode: string;
  awayCode: string;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('match_shot_events')
    .select(
      `minute, team_code, player_id, start_x, start_y, body_part, outcome, xg, pattern,
       player:players!match_shot_events_player_id_fkey(known_as, full_name, slug)`,
    )
    .eq('match_id', matchId)
    .order('minute', { ascending: true });

  if (error || !data || data.length === 0) return null;
  const shots = data as unknown as ShotRow[];
  const homeShots = shots.filter((s) => s.team_code === homeCode);
  const awayShots = shots.filter((s) => s.team_code === awayCode);

  const homeStats = accumulate(homeShots);
  const awayStats = accumulate(awayShots);

  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            Tiros · StatsBomb xG
          </div>
          <h2 className="mt-3 font-display text-fluid-h2 uppercase leading-none">
            Mapa de tiros
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-[var(--color-fg-muted)]">
            Cada círculo es un tiro. El tamaño es proporcional a su xG (expected goals).
            El color indica desenlace.
          </p>
        </div>
        <Legend />
      </div>

      <figure className="relative mt-10 overflow-hidden rounded-3xl border border-[var(--color-border)]">
        <svg
          viewBox={`0 0 ${PITCH_W} ${PITCH_H}`}
          className="block w-full h-auto"
          style={{ background: '#0a1f12' }}
          role="img"
          aria-label="Mapa de tiros"
        >
          <defs>
            <pattern id="pitchStripes" width="12" height="80" patternUnits="userSpaceOnUse">
              <rect width="12" height="80" fill="#0a1f12" />
              <rect width="6" height="80" fill="#0d2618" opacity="0.55" />
            </pattern>
            <radialGradient id="fieldVignette" cx="50%" cy="50%" r="70%">
              <stop offset="65%" stopColor="#000" stopOpacity="0" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.35" />
            </radialGradient>
          </defs>
          <rect width={PITCH_W} height={PITCH_H} fill="url(#pitchStripes)" />

          {/* Pitch lines */}
          <g fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.22">
            <rect x="0.3" y="0.3" width={PITCH_W - 0.6} height={PITCH_H - 0.6} />
            <line x1={PITCH_W / 2} y1="0" x2={PITCH_W / 2} y2={PITCH_H} />
            <circle cx={PITCH_W / 2} cy={PITCH_H / 2} r="9.15" />
            <circle cx={PITCH_W / 2} cy={PITCH_H / 2} r="0.4" fill="rgba(255,255,255,0.4)" />
            <rect x="0" y="18" width="16" height="44" />
            <rect x="0" y="30" width="5.5" height="20" />
            <circle cx="11" cy={PITCH_H / 2} r="0.4" fill="rgba(255,255,255,0.4)" />
            <rect x={PITCH_W - 16} y="18" width="16" height="44" />
            <rect x={PITCH_W - 5.5} y="30" width="5.5" height="20" />
            <circle cx={PITCH_W - 11} cy={PITCH_H / 2} r="0.4" fill="rgba(255,255,255,0.4)" />
          </g>
          <rect width={PITCH_W} height={PITCH_H} fill="url(#fieldVignette)" />

          {/* Away shots (mirrored to left) */}
          <g>
            {awayShots.map((s, i) => {
              if (s.start_x == null || s.start_y == null) return null;
              const x = PITCH_W - s.start_x;
              const y = PITCH_H - s.start_y;
              const r = radius(s.xg);
              return (
                <circle
                  key={`a-${i}`}
                  cx={x}
                  cy={y}
                  r={r}
                  fill={outcomeColor(s.outcome)}
                  fillOpacity={s.outcome === 'goal' ? 0.95 : 0.55}
                  stroke={s.outcome === 'goal' ? '#fff' : 'transparent'}
                  strokeWidth="0.3"
                >
                  <title>
                    {s.player?.known_as ?? s.player?.full_name ?? '?'} — {outcomeLabel(s.outcome)} · xG {(s.xg ?? 0).toFixed(2)} · min {s.minute ?? '?'}
                  </title>
                </circle>
              );
            })}
          </g>

          {/* Home shots (as-is) */}
          <g>
            {homeShots.map((s, i) => {
              if (s.start_x == null || s.start_y == null) return null;
              const r = radius(s.xg);
              return (
                <circle
                  key={`h-${i}`}
                  cx={s.start_x}
                  cy={s.start_y}
                  r={r}
                  fill={outcomeColor(s.outcome)}
                  fillOpacity={s.outcome === 'goal' ? 0.95 : 0.55}
                  stroke={s.outcome === 'goal' ? '#fff' : 'transparent'}
                  strokeWidth="0.3"
                >
                  <title>
                    {s.player?.known_as ?? s.player?.full_name ?? '?'} — {outcomeLabel(s.outcome)} · xG {(s.xg ?? 0).toFixed(2)} · min {s.minute ?? '?'}
                  </title>
                </circle>
              );
            })}
          </g>

          {/* Direction + team arrows */}
          <text x="3" y="4" fontFamily="'Geist Mono', ui-monospace, monospace" fontSize="2.2" fill="rgba(255,255,255,0.7)">
            {homeCode} →
          </text>
          <text
            x={PITCH_W - 3}
            y="4"
            textAnchor="end"
            fontFamily="'Geist Mono', ui-monospace, monospace"
            fontSize="2.2"
            fill="rgba(255,255,255,0.7)"
          >
            ← {awayCode}
          </text>
        </svg>
      </figure>

      {/* Totals */}
      <div className="mt-6 grid gap-px bg-[var(--color-border)] overflow-hidden rounded-2xl border border-[var(--color-border)] sm:grid-cols-2">
        <StatBlock code={homeCode} stats={homeStats} />
        <StatBlock code={awayCode} stats={awayStats} />
      </div>
    </section>
  );
}

function StatBlock({ code, stats }: { code: string; stats: Stats }) {
  return (
    <div className="bg-[var(--color-bg-2)] p-6">
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
        {code}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-6 font-display text-2xl">
        <div>
          <div className="text-[var(--color-fg)]">{stats.shots}</div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-subtle)]">
            tiros
          </div>
        </div>
        <div>
          <div className="text-[var(--color-pitch)]">{stats.goals}</div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-subtle)]">
            goles
          </div>
        </div>
        <div>
          <div className="text-[var(--color-sun)] tab-num">{stats.xg.toFixed(2)}</div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-subtle)]">
            xG total
          </div>
        </div>
      </div>
    </div>
  );
}

function Legend() {
  const items = [
    { label: 'Gol', color: 'var(--color-pitch)' },
    { label: 'Palo', color: 'var(--color-sun)' },
    { label: 'Parada', color: '#9ea3ad' },
    { label: 'Fuera / bloqueado', color: 'rgba(255,59,59,0.75)' },
  ];
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--color-fg-muted)]">
      {items.map((it) => (
        <span key={it.label} className="flex items-center gap-2">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ background: it.color }}
          />
          {it.label}
        </span>
      ))}
    </div>
  );
}

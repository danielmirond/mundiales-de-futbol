import { padel, padelTournament, padelDraw, LEVEL_LABEL, type PadelMatch, type PadelPlayer, type PadelRankRow, type PadelTournament } from '@/lib/padel';

const region = new Intl.DisplayNames(['es'], { type: 'region' });
const country = (c: string) => { try { return region.of(c) ?? c; } catch { return c; } };
const dayFmt = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', timeZone: 'UTC' });
const range = (a: string, b: string) => `${dayFmt.format(new Date(a))} – ${dayFmt.format(new Date(b))}`;
const names = (p: PadelPlayer[]) => p.map((x) => x.name).join(' / ') || 'Por definir';
const ROUND_ES: Record<string, string> = { Finals: 'Final', Semifinals: 'Semifinales', Quarterfinals: 'Cuartos', 'Round of 16': 'Octavos', 'Round of 32': 'Dieciseisavos', 'Round of 64': 'Treintaidosavos' };
const roundEs = (r: string) => ROUND_ES[r] ?? r;

function MatchRow({ m }: { m: PadelMatch }) {
  const done = m.status === 'finished' && m.score;
  const side = (t: 'team_1' | 'team_2', p: PadelPlayer[]) => (
    <span className={`truncate ${m.winner === t ? 'font-semibold text-[var(--color-fg)]' : 'text-[var(--color-fg-muted)]'}`}>{names(p)}</span>
  );
  return (
    <li className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-2.5 text-sm">
      <span className="grid gap-0.5">{side('team_1', m.team1)}{side('team_2', m.team2)}</span>
      <span className="font-mono tab-num text-xs text-[var(--color-fg)]">
        {done ? m.score!.map(([a, b], i) => <span key={i} className="ml-2 inline-grid text-center">{a}<br />{b}</span>) : <span className="text-[var(--color-fg-subtle)]">{m.status === 'live' ? 'En juego' : 'Por jugar'}</span>}
      </span>
    </li>
  );
}

function Draw({ t, matches }: { t: PadelTournament; matches: PadelMatch[] }) {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {(['men', 'women'] as const).map((cat) => {
        const ms = matches.filter((m) => m.category === cat && (m.team1.length || m.team2.length));
        const rounds = [...new Set(ms.map((m) => m.round))].sort((a, b) => a - b).slice(0, 4);
        return (
          <div key={cat}>
            <div className="sub-label mb-2">{cat === 'men' ? 'Masculino' : 'Femenino'}</div>
            {rounds.length === 0 && <p className="text-sm text-[var(--color-fg-muted)]">El cuadro aún no tiene parejas confirmadas.</p>}
            {rounds.map((r) => (
              <div key={r} className="mb-4">
                <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-fg-subtle)]">{roundEs(ms.find((m) => m.round === r)!.roundName)}</div>
                <ul className="divide-y divide-[var(--color-border)] rounded-2xl border border-[var(--color-border)]">{ms.filter((m) => m.round === r).map((m) => <MatchRow key={m.id} m={m} />)}</ul>
              </div>
            ))}
          </div>
        );
      })}
      <span className="sr-only">{t.name}</span>
    </div>
  );
}

function Ranking({ title, rows, date }: { title: string; rows: PadelRankRow[]; date: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--color-border)]">
      <div className="border-b border-[var(--color-border)] px-4 py-3"><div className="kicker">{title}</div><div className="mt-1 text-xs text-[var(--color-fg-muted)]">Ranking oficial FIP · {dayFmt.format(new Date(date))}</div></div>
      <ol className="divide-y divide-[var(--color-border)] text-sm">
        {rows.slice(0, 20).map((r) => (
          <li key={r.id} className={`grid grid-cols-[2rem_1fr_auto_3rem] items-center gap-2 px-4 py-2 ${r.country === 'ES' ? 'bg-[var(--color-bg-2)]' : ''}`}>
            <span className="font-display tab-num text-lg text-[var(--color-fg)]">{r.pos}</span>
            <span className="truncate"><b className="font-semibold text-[var(--color-fg)]">{r.name}</b> <span className="text-xs text-[var(--color-fg-subtle)]">{country(r.country)}</span></span>
            <span className="font-mono tab-num text-xs text-[var(--color-fg-muted)]">{r.points.toLocaleString('es-ES')}</span>
            <span className={`text-right font-mono text-[11px] ${r.diff > 0 ? 'text-[var(--color-win)]' : r.diff < 0 ? 'text-[var(--color-loss)]' : 'text-[var(--color-fg-subtle)]'}`}>{r.diff > 0 ? `▲${r.diff}` : r.diff < 0 ? `▼${-r.diff}` : '='}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Pádel profesional: torneo en juego, último campeón, ranking y calendario de la temporada. */
export function PadelHub() {
  const d = padel();
  const cur = padelTournament(d.current);
  const last = padelTournament(d.last);
  const finals = (id: number | null) => padelDraw(id).filter((m) => m.round === 1 && m.status === 'finished');
  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 py-10 md:px-10">
      {cur && (
        <section>
          <div className="kicker">{cur.status === 'live' ? 'En juego' : 'Próximo torneo'} · {LEVEL_LABEL[cur.level] ?? cur.level}</div>
          <h2 className="t-h2 mt-2 text-[var(--color-fg)]">{cur.name}</h2>
          <p className="mt-1 text-sm text-[var(--color-fg-muted)]">{cur.location}, {country(cur.country)} · {range(cur.start, cur.end)}</p>
          <div className="mt-6"><Draw t={cur} matches={padelDraw(cur.id)} /></div>
        </section>
      )}

      {last && (
        <section className="mt-12 border-t border-[var(--color-border)] pt-10">
          <div className="kicker">Último torneo · {LEVEL_LABEL[last.level] ?? last.level}</div>
          <h2 className="t-h2 mt-2 text-[var(--color-fg)]">{last.name}</h2>
          <div className="mt-5 grid gap-6 md:grid-cols-2">
            {(['men', 'women'] as const).map((cat) => {
              const f = finals(last.id).find((m) => m.category === cat);
              return (
                <div key={cat} className="rounded-2xl border border-[var(--color-border)] p-5">
                  <div className="sub-label">{cat === 'men' ? 'Campeones' : 'Campeonas'}</div>
                  <p className="mt-2 text-lg font-semibold text-[var(--color-fg)]">{last.winners ? names(last.winners[cat]) : '—'}</p>
                  {f && <p className="mt-1 text-sm text-[var(--color-fg-muted)]">Final: {names(f.winner === 'team_1' ? f.team1 : f.team2)} ganaron a {names(f.winner === 'team_1' ? f.team2 : f.team1)} por {f.score!.map(([a, b]) => (f.winner === 'team_1' ? `${a}-${b}` : `${b}-${a}`)).join(', ')}.</p>}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {(d.ranking_men || d.ranking_women) && (
        <section className="mt-12 border-t border-[var(--color-border)] pt-10">
          <h2 className="t-h2 text-[var(--color-fg)]">Ranking mundial</h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            {d.ranking_men && <Ranking title="Masculino" rows={d.ranking_men.rows} date={d.ranking_men.date} />}
            {d.ranking_women && <Ranking title="Femenino" rows={d.ranking_women.rows} date={d.ranking_women.date} />}
          </div>
        </section>
      )}

      <section className="mt-12 border-t border-[var(--color-border)] pt-10">
        <h2 className="t-h2 text-[var(--color-fg)]">Calendario {d.season}</h2>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--color-border)]">
          <table className="w-full text-sm">
            <thead className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-fg-subtle)]">
              <tr className="border-b border-[var(--color-border)]"><th className="px-4 py-2 text-left">Fechas</th><th className="px-2 py-2 text-left">Torneo</th><th className="hidden px-2 py-2 text-left md:table-cell">Campeones</th><th className="hidden px-4 py-2 text-left md:table-cell">Campeonas</th></tr>
            </thead>
            <tbody>
              {d.tournaments.map((t) => (
                <tr key={t.id} className={`border-b border-[var(--color-border)] last:border-0 ${t.status === 'live' ? 'bg-[var(--color-bg-2)]' : ''}`}>
                  <td className="whitespace-nowrap px-4 py-2 font-mono text-xs text-[var(--color-fg-muted)]">{range(t.start, t.end)}</td>
                  <td className="px-2 py-2"><b className="font-semibold text-[var(--color-fg)]">{t.name.replace(/ \d{4}$/, '')}</b> <span className="ml-1 rounded border border-[var(--color-border)] px-1 font-mono text-[10px] uppercase">{LEVEL_LABEL[t.level] ?? t.level}</span>{t.status === 'live' && <span className="ml-2 text-xs text-[var(--color-live-ink)]">en juego</span>}</td>
                  <td className="hidden px-2 py-2 text-[var(--color-fg-muted)] md:table-cell">{t.winners ? names(t.winners.men) : ''}</td>
                  <td className="hidden px-4 py-2 text-[var(--color-fg-muted)] md:table-cell">{t.winners ? names(t.winners.women) : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 font-mono text-[11px] text-[var(--color-fg-subtle)]">Datos: <a href="https://padelapi.org" rel="nofollow noopener" target="_blank" className="underline">Padel API</a> · se actualiza a diario</p>
      </section>
    </div>
  );
}

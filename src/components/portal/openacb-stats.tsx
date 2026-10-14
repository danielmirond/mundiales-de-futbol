import Link from 'next/link';
import { getOpenAcb, OPENACB_REPO } from '@/lib/openacb';
import { Crest } from './crest';

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
const n1 = (v: number) => v.toFixed(1);

/** Liga Endesa: estadísticas avanzadas por equipo (OpenACB) y ritmo por cuartos. */
export function OpenAcbStats() {
  const d = getOpenAcb();
  if (!d.teams.length) return null;
  const paceOf = new Map(d.pace.map((p) => [p.teamId, p]));
  const updated = d.updatedAt ? new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', day: 'numeric', month: 'long' }).format(new Date(d.updatedAt)) : '';
  const cols: { key: string; label: string; title: string; fmt: (t: (typeof d.teams)[number]) => string; strong?: boolean }[] = [
    { key: 'wl', label: 'V-D', title: 'Victorias y derrotas', fmt: (t) => `${t.wins}-${t.losses}` },
    { key: 'ppg', label: 'PTS', title: 'Puntos por partido', fmt: (t) => n1(t.ppg) },
    { key: 'opp', label: 'PTS C', title: 'Puntos encajados por partido', fmt: (t) => n1(t.opp_ppg) },
    { key: 'ortg', label: 'ORtg', title: 'Rating ofensivo (puntos por 100 posesiones)', fmt: (t) => n1(t.ortg) },
    { key: 'drtg', label: 'DRtg', title: 'Rating defensivo (puntos encajados por 100 posesiones)', fmt: (t) => n1(t.drtg) },
    { key: 'net', label: 'Net', title: 'Rating neto', fmt: (t) => (t.netRtg > 0 ? `+${n1(t.netRtg)}` : n1(t.netRtg)), strong: true },
    { key: 'pace', label: 'Pace', title: 'Posesiones por partido', fmt: (t) => n1(t.pace) },
    { key: 'efg', label: 'eFG%', title: 'Porcentaje efectivo de tiro', fmt: (t) => pct(t.efg) },
    { key: 'ts', label: 'TS%', title: 'True shooting', fmt: (t) => pct(t.ts) },
    { key: 'tov', label: 'TOV%', title: 'Pérdidas por posesión', fmt: (t) => pct(t.tovRate) },
    { key: 'orb', label: 'ORB%', title: 'Rebote ofensivo', fmt: (t) => pct(t.orbPct) },
  ];
  return (
    <>
      <section className="mx-auto w-full max-w-[1400px] px-6 py-12 md:px-10">
        <div className="kicker">Estadísticas avanzadas · {d.seasonName}</div>
        <h2 className="t-h2 mt-3 text-[var(--color-fg)]">Equipos por rating neto</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--color-fg-muted)]">Ratings ofensivo y defensivo por 100 posesiones, ritmo y cuatro factores de los 18 equipos, calculados sobre el play-by-play de cada partido.</p>
        <div className="mt-6 overflow-x-auto rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)] px-3 md:px-5">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
                <th className="w-11 px-2 py-3 text-center font-medium">#</th>
                <th className="px-2 py-3 text-left font-medium">Equipo</th>
                {cols.map((c) => <th key={c.key} className={`px-2 py-3 text-center font-medium ${['opp', 'tov', 'orb', 'ts'].includes(c.key) ? 'hidden md:table-cell' : ''}`} title={c.title}>{c.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {d.teams.map((t, i) => (
                <tr key={t.teamId} className="border-t border-[var(--color-border)]">
                  <td className="h-11 px-2 text-center font-mono text-xs tab-num text-[var(--color-fg-subtle)]">{i + 1}</td>
                  <td className="h-11 px-2"><span className="flex items-center gap-2.5 font-medium text-[var(--color-fg)]"><Crest src={t.logo} abbr={t.team.slice(0, 3).toUpperCase()} size="s" /><span className="truncate">{t.team}</span></span></td>
                  {cols.map((c) => <td key={c.key} className={`h-11 px-2 text-center tab-num ${['opp', 'tov', 'orb', 'ts'].includes(c.key) ? 'hidden md:table-cell' : ''} ${c.strong ? 'text-[15px] font-semibold text-[var(--color-fg)]' : 'text-[var(--color-fg-muted)]'}`}>{c.fmt(t)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {d.pace.length > 0 && (
        <section className="mx-auto w-full max-w-[1400px] px-6 pb-12 md:px-10">
          <div className="kicker">Ritmo por cuartos</div>
          <h2 className="t-h2 mt-3 text-[var(--color-fg)]">Dónde gana y pierde cada equipo</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {d.teams.map((t) => {
              const p = paceOf.get(t.teamId);
              if (!p) return null;
              return (
                <div key={t.teamId} className="rounded-[14px] border border-[var(--color-border)] bg-[var(--color-bg-2)] p-4">
                  <div className="flex items-center gap-2 font-semibold text-[var(--color-fg)]"><Crest src={t.logo} abbr={t.team.slice(0, 3).toUpperCase()} size="s" />{t.team}</div>
                  <div className="mt-3 grid grid-cols-4 gap-1 text-center">
                    {p.quarters.diff.map((v, q) => (
                      <div key={q} className={`rounded-[8px] px-1 py-2 ${q + 1 === p.bestQ ? 'bg-[color-mix(in_oklab,var(--color-win)_18%,transparent)]' : q + 1 === p.worstQ ? 'bg-[color-mix(in_oklab,var(--color-loss)_18%,transparent)]' : 'bg-[var(--color-surface)]'}`}>
                        <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--color-fg-subtle)]">{q + 1}.º</div>
                        <div className={`tab-num text-sm font-semibold ${v > 0 ? 'text-[var(--color-win)]' : v < 0 ? 'text-[var(--color-loss)]' : 'text-[var(--color-fg-muted)]'}`}>{v > 0 ? `+${n1(v)}` : n1(v)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-[var(--color-fg-muted)]">Diferencia media de puntos por cuarto; el mejor en verde y el peor en rojo.</p>
        </section>
      )}

      <section className="mx-auto w-full max-w-[1400px] px-6 pb-12 md:px-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
          Datos: <Link href={OPENACB_REPO} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-[var(--color-fg)]">OpenACB</Link> (AGPL-3.0), sobre el play-by-play de acb.com{updated ? ` · actualizado el ${updated}` : ''}
        </p>
      </section>
    </>
  );
}

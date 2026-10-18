import type { Competition } from '@/lib/competitions';
import { fetchRaceWeekend, fetchRaceStandings } from '@/lib/espn-racing';
import { madridDateKey } from '@/lib/espn';
import { countryEs } from '@/lib/i18n-sport';
import Link from 'next/link';
import { f1Drivers } from '@/lib/f1-history';

/** «Fernando Alonso» → slug de su ficha histórica, si existe en la copia de Jolpica. */
const norm = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z]+/g, ' ').trim();
const f1Slug = (name: string) => f1Drivers().find((d) => norm(d.name) === norm(name))?.slug;

const MADRID = 'Europe/Madrid';
const dayTime = new Intl.DateTimeFormat('es-ES', { timeZone: MADRID, weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
const dayFmt = new Intl.DateTimeFormat('es-ES', { timeZone: MADRID, day: 'numeric', month: 'short' });

/** Fórmula 1: gran premio en curso o próximo, clasificaciones del mundial y calendario. */
export async function RacingHub({ comp, locale = 'es' }: { comp: Competition; locale?: string }) {
  const base = locale === 'es' ? '' : `/${locale}`;
  if (!comp.feed) return null;
  const [{ weekend, calendar }, { drivers, teams }] = await Promise.all([fetchRaceWeekend(comp.feed), fetchRaceStandings(comp.feed)]);
  const today = madridDateKey();
  const next = calendar.find((c) => madridDateKey(new Date(c.end)) >= today);
  const done = weekend && weekend.sessions.every((s) => s.state === 'post');
  const race = weekend?.sessions.find((s) => s.type === 'Race');

  return (
    <>
      {weekend && (
        <section className="mx-auto w-full max-w-[1400px] px-6 py-12 md:px-10" data-sport="motor">
          <div className="kicker">{done ? 'Último gran premio' : 'Gran premio en curso'}</div>
          <h2 className="t-h2 mt-3 text-[var(--color-fg)]">{weekend.name}</h2>
          <p className="mt-2 text-[var(--color-fg-muted)]">{[...new Set([weekend.circuit, countryEs(weekend.city), weekend.country].filter(Boolean))].join(' · ')}{weekend.circuit || weekend.city || weekend.country ? ' · ' : ''}{dayFmt.format(new Date(weekend.start))}{dayFmt.format(new Date(weekend.end)) !== dayFmt.format(new Date(weekend.start)) ? ` – ${dayFmt.format(new Date(weekend.end))}` : ''}</p>
          {race && race.state === 'post' && race.top.length > 0 && (
            <ol className="mt-6 grid gap-3 sm:grid-cols-3">
              {race.top.map((p) => (
                <li key={p.pos} className={`rounded-[18px] border p-5 ${p.pos === 1 ? 'border-[var(--color-gold)] bg-[color-mix(in_oklab,var(--color-gold)_10%,transparent)]' : 'border-[var(--color-border)] bg-[var(--color-bg-2)]'}`}>
                  <div className="n-xl leading-none text-[var(--color-fg)]">{p.pos}.º</div>
                  <div className="mt-2 text-[17px] font-semibold text-[var(--color-fg)]">{p.name}</div>
                  {p.country && <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">{p.country}</div>}
                </li>
              ))}
            </ol>
          )}
          <div className="mt-6 overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)]">
            <ul className="divide-y divide-[var(--color-border)]">
              {weekend.sessions.map((s) => (
                <li key={s.type + s.date} className="grid grid-cols-[120px_1fr] items-center gap-4 px-5 py-3 md:grid-cols-[150px_200px_1fr]">
                  <span className={`font-mono text-[12px] tab-num ${s.state === 'in' ? 'text-[var(--color-live-ink)]' : 'text-[var(--color-fg-muted)]'}`}>{s.state === 'in' ? <span className="inline-flex items-center gap-2"><i className="pulse" />En curso</span> : dayTime.format(new Date(s.date))}</span>
                  <span className="text-sm font-semibold text-[var(--color-fg)]">{s.label}</span>
                  <span className="col-span-2 text-sm text-[var(--color-fg-muted)] md:col-span-1">{s.state === 'post' && s.top[0] ? `1.º ${s.top[0].name}${s.top[1] ? ` · 2.º ${s.top[1].name}` : ''}${s.top[2] ? ` · 3.º ${s.top[2].name}` : ''}` : s.state === 'pre' ? 'Hora peninsular' : ''}</span>
                </li>
              ))}
            </ul>
          </div>
          {done && next && madridDateKey(new Date(next.start)) > madridDateKey(new Date(weekend.end)) && (
            <p className="mt-4 text-sm text-[var(--color-fg-muted)]">Próximo: <strong className="text-[var(--color-fg)]">{next.name}</strong>, del {dayFmt.format(new Date(next.start))} al {dayFmt.format(new Date(next.end))}.</p>
          )}
        </section>
      )}

      {(drivers.length > 0 || teams.length > 0) && (
        <section className="mx-auto w-full max-w-[1400px] px-6 pb-12 md:px-10" data-sport="motor">
          <div className="kicker">Mundial</div>
          <h2 className="t-h2 mt-3 text-[var(--color-fg)]">Clasificación del campeonato</h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            {[{ title: 'Pilotos', rows: drivers.map((d) => ({ rank: d.rank, name: d.name, sub: d.country, points: d.points })) },
              { title: 'Constructores', rows: teams.map((t) => ({ rank: t.rank, name: t.name, sub: undefined as string | undefined, points: t.points, color: t.color })) }].map((tbl) => (
              <div key={tbl.title}>
                <h3 className="sub-label mb-3">{tbl.title}</h3>
                <div className="overflow-x-auto rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)] px-3 md:px-5">
                  <table className="w-full border-collapse text-sm">
                    <thead><tr className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]"><th className="w-11 px-2 py-3 text-center font-medium">#</th><th className="px-2 py-3 text-left font-medium">{tbl.title === 'Pilotos' ? 'Piloto' : 'Escudería'}</th><th className="px-2 py-3 text-center font-medium">Pts</th></tr></thead>
                    <tbody>
                      {tbl.rows.map((r) => (
                        <tr key={r.name} className="border-t border-[var(--color-border)]">
                          <td className="h-11 px-2 text-center font-mono text-xs tab-num text-[var(--color-fg-subtle)]">{r.rank}</td>
                          <td className="h-11 px-2 font-medium text-[var(--color-fg)]">
                            <span className="flex items-center gap-2.5">
                              {'color' in r && r.color ? <i className="h-3 w-1 rounded-sm" style={{ background: `#${r.color}` }} aria-hidden /> : null}
                              {comp.slug === 'formula-1' && tbl.title === 'Pilotos' && f1Slug(r.name) ? <Link href={`${base}/motor/formula-1/piloto/${f1Slug(r.name)}`} className="hover:text-[var(--accent-ink)] hover:underline">{r.name}</Link> : r.name}{r.sub ? <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-fg-subtle)]">{r.sub}</span> : null}
                            </span>
                          </td>
                          <td className="h-11 px-2 text-center text-[15px] font-semibold tab-num text-[var(--color-fg)]">{r.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {calendar.length > 0 && (
        <section className="mx-auto w-full max-w-[1400px] px-6 pb-16 md:px-10" data-sport="motor">
          <div className="kicker">Temporada</div>
          <h2 className="t-h2 mt-3 text-[var(--color-fg)]">Calendario de grandes premios</h2>
          <ol className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {calendar.map((c, i) => {
              const past = madridDateKey(new Date(c.end)) < today;
              const isNext = next?.name === c.name;
              return (
                <li key={c.name + c.start} className={`flex items-center justify-between gap-3 rounded-[14px] border px-4 py-3 ${isNext ? 'border-[var(--accent)]' : 'border-[var(--color-border)]'} ${past ? 'opacity-60' : ''} bg-[var(--color-bg-2)]`}>
                  <span className="min-w-0"><span className="font-mono text-[10px] text-[var(--color-fg-subtle)]">R{i + 1} · </span><span className="text-sm font-medium text-[var(--color-fg)]">{c.name.replace(/^Gran Premio de /, 'GP de ')}</span></span>
                  <span className="shrink-0 font-mono text-[11px] tab-num text-[var(--color-fg-muted)]">{dayFmt.format(new Date(c.start))}</span>
                </li>
              );
            })}
          </ol>
        </section>
      )}
    </>
  );
}

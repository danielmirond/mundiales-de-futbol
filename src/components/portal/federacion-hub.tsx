import type { Competition } from '@/lib/competitions';
import { fcGroup, type FcGroup, type FcMatch } from '@/lib/footballcharts';
import { FormChips } from './standings-table';
import { ObfuscatedLink } from '@/components/ui/obfuscated-link';

const dayFmt = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', weekday: 'short', day: 'numeric', month: 'short' });
const timeFmt = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
const groupNo = (code: string) => code.replace(/\D/g, '');
const FORM: Record<string, 'W' | 'D' | 'L'> = { W: 'W', D: 'D', L: 'L' };

/** Resultados de la última jornada: los partidos de los 4 días anteriores al último jugado. */
function lastRound(results: FcMatch[]): FcMatch[] {
  if (results.length === 0) return [];
  const last = Math.max(...results.map((m) => Date.parse(m.date)));
  return results.filter((m) => last - Date.parse(m.date) <= 4 * 86_400_000).sort((a, b) => a.date.localeCompare(b.date));
}

function MatchLine({ m }: { m: FcMatch }) {
  const d = new Date(m.date);
  const [hs, as] = (m.score ?? '').split(':');
  return (
    <li className="grid grid-cols-[92px_1fr_auto_1fr] items-center gap-3 px-4 py-2.5 text-sm">
      <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg-muted)]">{dayFmt.format(d)}{m.score ? '' : ` · ${timeFmt.format(d)}`}</span>
      <span className="truncate text-right text-[var(--color-fg)]">{m.home}</span>
      <span className="font-display tab-num min-w-[3.2rem] text-center text-lg text-[var(--color-fg)]">{m.score ? `${hs}-${as}` : '–'}</span>
      <span className="truncate text-[var(--color-fg)]">{m.away}</span>
    </li>
  );
}

function Group({ code, g, name }: { code: string; g: FcGroup; name: string }) {
  const round = lastRound(g.results);
  const next = [...g.fixtures].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 10);
  return (
    <section id={`grupo-${groupNo(code)}`} className="scroll-mt-40 border-t border-[var(--color-border)] pt-10">
      <div className="kicker">{name}</div>
      <h2 className="t-h2 mt-2 text-[var(--color-fg)]">Grupo {groupNo(code)}</h2>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)]">
          <table className="w-full text-sm">
            <caption className="sr-only">Clasificación de {name}, grupo {groupNo(code)}</caption>
            <thead className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-fg-subtle)]">
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-3 py-2 text-left">#</th><th className="px-2 py-2 text-left">Equipo</th>
                <th className="px-2 py-2 text-right">PJ</th><th className="hidden px-2 py-2 text-right sm:table-cell">G</th><th className="hidden px-2 py-2 text-right sm:table-cell">E</th><th className="hidden px-2 py-2 text-right sm:table-cell">P</th>
                <th className="hidden px-2 py-2 text-right md:table-cell">GF</th><th className="hidden px-2 py-2 text-right md:table-cell">GC</th><th className="px-2 py-2 text-right">DG</th>
                <th className="px-3 py-2 text-right">Pts</th><th className="hidden px-3 py-2 text-left lg:table-cell">Últimos 5</th>
              </tr>
            </thead>
            <tbody className="tab-num">
              {g.table.map((r) => (
                <tr key={r.team} className="border-b border-[var(--color-border)] last:border-0">
                  <td className="px-3 py-2 text-[var(--color-fg-muted)]">{r.pos}</td>
                  <td className="px-2 py-2 font-semibold text-[var(--color-fg)]">{r.team}</td>
                  <td className="px-2 py-2 text-right">{r.pj}</td>
                  <td className="hidden px-2 py-2 text-right sm:table-cell">{r.g}</td><td className="hidden px-2 py-2 text-right sm:table-cell">{r.e}</td><td className="hidden px-2 py-2 text-right sm:table-cell">{r.p}</td>
                  <td className="hidden px-2 py-2 text-right md:table-cell">{r.gf}</td><td className="hidden px-2 py-2 text-right md:table-cell">{r.gc}</td>
                  <td className="px-2 py-2 text-right">{r.dg > 0 ? `+${r.dg}` : r.dg}</td>
                  <td className="px-3 py-2 text-right font-display text-base text-[var(--color-fg)]">{r.pts}</td>
                  <td className="hidden px-3 py-2 lg:table-cell"><FormChips results={[...r.form].map((x) => FORM[x]).filter(Boolean)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid content-start gap-8">
          {round.length > 0 && (
            <div>
              <div className="sub-label mb-2">Última jornada</div>
              <ul className="divide-y divide-[var(--color-border)] rounded-2xl border border-[var(--color-border)]">{round.map((m) => <MatchLine key={`${m.date}${m.home}`} m={m} />)}</ul>
            </div>
          )}
          {next.length > 0 && (
            <div>
              <div className="sub-label mb-2">Próximos partidos <span className="normal-case tracking-normal">(hora peninsular)</span></div>
              <ul className="divide-y divide-[var(--color-border)] rounded-2xl border border-[var(--color-border)]">{next.map((m) => <MatchLine key={`${m.date}${m.home}`} m={m} />)}</ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/** Primera y Segunda Federación: clasificación, última jornada y próximos partidos de cada grupo. */
export function FederacionHub({ comp }: { comp: Competition }) {
  const groups = (comp.fc ?? []).map((code) => ({ code, g: fcGroup(code) })).filter((x): x is { code: string; g: FcGroup } => !!x.g);
  if (groups.length === 0) return null;
  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 py-10 md:px-10">
      {groups.length > 1 && (
        <nav aria-label="Grupos" className="mb-8 flex flex-wrap gap-2">
          {groups.map(({ code }) => (
            <a key={code} href={`#grupo-${groupNo(code)}`} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-sm font-semibold hover:border-[var(--accent)] hover:text-[var(--accent-ink)]">Grupo {groupNo(code)}</a>
          ))}
        </nav>
      )}
      <div className="grid gap-12">{groups.map(({ code, g }) => <Group key={code} code={code} g={g} name={comp.name} />)}</div>
      <p className="mt-10 font-mono text-[11px] text-[var(--color-fg-subtle)]">
        Data by <ObfuscatedLink href={groups[0].g.sourceUrl}>football-charts.com</ObfuscatedLink> · se actualiza una vez al día; los partidos de hoy aparecen al día siguiente.
      </p>
    </div>
  );
}

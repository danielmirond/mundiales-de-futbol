import Link from 'next/link';
import type { TeamCost, CostMatch, PlanResult } from '@/lib/tv-cost';
import { SEASON_MONTHS } from '@/lib/tv-cost';

const AFF = {
  dazn: 'https://www.awin1.com/cread.php?awinmid=126263&awinaffid=2898755&ued=https%3A%2F%2Fwww.dazn.com%2Fes-ES%2Fwelcome',
  movistar: 'https://www.awin1.com/cread.php?awinmid=114230&awinaffid=2898755&ued=https%3A%2F%2Fwww.movistarplus.es%2Fdeportes%2Ffutbol',
};
const eur = (n: number) => `${n.toLocaleString('es-ES', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })} €`;
const dayFmt = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', weekday: 'short', day: 'numeric', month: 'short' });

function Cta({ r, primary = false }: { r: PlanResult; primary?: boolean }) {
  const cls = primary
    ? 'inline-flex items-center rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-bold text-black hover:opacity-90'
    : 'inline-flex items-center rounded-full border border-[var(--color-border-strong)] px-3 py-1.5 text-xs font-semibold hover:border-[var(--accent)] hover:text-[var(--accent-ink)]';
  const links = r.plan.affiliate === 'ambos' ? (['dazn', 'movistar'] as const) : [r.plan.affiliate];
  return (
    <span className="flex flex-wrap gap-2">
      {links.map((k) => (
        <a key={k} href={AFF[k]} rel="sponsored nofollow noopener" target="_blank" className={cls}>
          {r.plan.id === 'gratis' ? 'Registrarse gratis en DAZN' : `Ver ${k === 'dazn' ? 'DAZN' : 'Movistar Plus+'}`} →
        </a>
      ))}
    </span>
  );
}

function Chip({ m }: { m: CostMatch }) {
  const base = 'rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em]';
  if (m.op === 'pendiente') return <span className={`${base} border border-dashed border-[var(--color-border-strong)] text-[var(--color-fg-subtle)]`}>Por asignar</span>;
  return (
    <span className="flex flex-wrap gap-1">
      <span className={`${base} ${m.op === 'dazn' ? 'bg-[#f8fc00] text-black' : 'bg-[#0b66ff] text-white'}`}>{m.op === 'dazn' ? 'DAZN' : 'Movistar'}</span>
      {m.free && <span className={`${base} bg-[var(--color-win)] text-black`}>Gratis</span>}
      {m.libre && <span className={`${base} border border-[var(--color-border-strong)]`}>Plan Libre</span>}
    </span>
  );
}

/** Vista de la calculadora para un equipo. */
export function TvCostView({ team, cost, teamHref }: { team: string; cost: TeamCost; teamHref: string }) {
  const { results, cheapestFull, matches, inChampions } = cost;
  const pending = matches.filter((m) => m.op === 'pendiente').length;
  const upcoming = matches.filter((m) => m.state !== 'post');
  const partial = results.filter((r) => r.plan.monthly < cheapestFull.plan.monthly).sort((a, b) => a.plan.monthly - b.plan.monthly);

  return (
    <>
      <section className="mx-auto w-full max-w-[1100px] px-6 pt-8 md:px-10">
        <div className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:p-8">
          <div className="kicker">La respuesta corta</div>
          <p className="mt-3 text-[22px] font-semibold leading-[1.25] tracking-[-0.02em] text-[var(--color-fg)] md:text-[28px]">
            Para ver los {matches.length} partidos del {team} en LaLiga{inChampions ? ' y la Champions' : ''} necesitas <span className="text-[var(--accent-ink)]">{cheapestFull.plan.name}</span>: {eur(cheapestFull.plan.monthly)} al mes, unos {eur(cheapestFull.season)} de agosto a mayo.
          </p>
          <p className="mt-3 text-sm text-[var(--color-fg-muted)]">{cheapestFull.plan.note}. No hay ninguna opción más barata que lo dé todo: LaLiga se reparte entre DAZN y Movistar{inChampions ? ', y la Champions es solo de Movistar' : ''}.</p>
          <div className="mt-5"><Cta r={cheapestFull} primary /></div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1100px] px-6 py-10 md:px-10">
        <h2 className="t-h2 text-[var(--color-fg)]">Si quieres gastar menos, esto es lo que te pierdes</h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--color-fg-muted)]">«Por asignar» son partidos a los que LaLiga aún no ha puesto canal (lo hace unas dos semanas antes); la última columna estima cuántos verás al final, sabiendo que DAZN tiene la mitad de cada jornada y que el partido gratis y el del plan Libre son uno de cada diez.</p>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--color-border)]">
          <table className="w-full text-sm">
            <thead className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-fg-subtle)]">
              <tr className="border-b border-[var(--color-border)]"><th className="px-4 py-2 text-left">Opción</th><th className="px-2 py-2 text-right">Al mes</th><th className="px-2 py-2 text-right">Ves</th><th className="px-2 py-2 text-right">Te pierdes</th><th className="hidden px-2 py-2 text-right sm:table-cell">Por asignar</th><th className="px-2 py-2 text-right">Al final, aprox.</th><th className="px-4 py-2" /></tr>
            </thead>
            <tbody className="tab-num">
              {[...partial, cheapestFull].map((r) => (
                <tr key={r.plan.id} className={`border-b border-[var(--color-border)] last:border-0 ${r === cheapestFull ? 'bg-[var(--color-bg-2)]' : ''}`}>
                  <td className="px-4 py-3"><div className="font-semibold text-[var(--color-fg)]">{r.plan.name}</div><div className="text-xs text-[var(--color-fg-muted)]">{r.plan.note}</div></td>
                  <td className="px-2 py-3 text-right font-semibold">{r.plan.monthly ? eur(r.plan.monthly) : 'Gratis'}</td>
                  <td className="px-2 py-3 text-right">{r.seen}</td>
                  <td className="px-2 py-3 text-right">{r.missed}</td>
                  <td className="hidden px-2 py-3 text-right text-[var(--color-fg-muted)] sm:table-cell">{r.unknown}</td>
                  <td className="px-2 py-3 text-right font-display text-lg text-[var(--color-fg)]">{r.estimate}<span className="text-xs text-[var(--color-fg-subtle)]">/{r.total}</span></td>
                  <td className="px-4 py-3"><Cta r={r} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-[var(--color-fg-subtle)]">Precios de las webs de DAZN y Movistar Plus+, la OCU y Mundoplus. Los de Movistar incluyen fibra y móvil con su tarifa más barata. Coste de temporada: {SEASON_MONTHS} meses.</p>
      </section>

      <section className="mx-auto w-full max-w-[1100px] px-6 pb-12 md:px-10">
        <h2 className="t-h2 text-[var(--color-fg)]">Partido a partido</h2>
        <p className="mt-2 text-sm text-[var(--color-fg-muted)]">{upcoming.length} partidos por jugar{pending ? `, ${pending} todavía sin canal` : ''}. Las jornadas 4, 15 y 27 de LaLiga son enteras de Movistar.</p>
        <ul className="mt-5 divide-y divide-[var(--color-border)] rounded-2xl border border-[var(--color-border)]">
          {matches.map((m) => (
            <li key={m.comp + m.id} className={`grid grid-cols-[86px_1fr_auto] items-center gap-3 px-4 py-2.5 text-sm ${m.state === 'post' ? 'opacity-60' : ''}`}>
              <span className="font-mono text-[11px] uppercase text-[var(--color-fg-muted)]">{dayFmt.format(new Date(m.date))}</span>
              <span className="truncate text-[var(--color-fg)]"><span className="mr-2 font-mono text-[10px] uppercase text-[var(--color-fg-subtle)]">{m.comp === 'laliga' ? 'LaLiga' : 'Champions'}</span>{m.isHome ? 'vs' : 'en'} {m.rival}{m.state === 'post' && m.gf != null ? ` · ${m.gf}-${m.ga}` : ''}</span>
              <Chip m={m} />
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-[var(--color-fg-muted)]">
          Más en la <Link href={teamHref} className="underline">ficha del {team}</Link> y en las guías de <Link href="/noticias/donde-ver-laliga-2026-27-movistar-dazn-precios-jornadas-exclusivas-clasico" className="underline">dónde ver LaLiga</Link> y <Link href="/noticias/donde-ver-champions-league-2026-27-espana-movistar-precios-final-metropolitano" className="underline">la Champions</Link>. Las páginas de esta calculadora incluyen enlaces de afiliado: si contratas desde ellos, Mundiales recibe una comisión sin coste extra para ti.
        </p>
      </section>
    </>
  );
}

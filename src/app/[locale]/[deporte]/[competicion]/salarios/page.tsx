import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getCompetition } from '@/lib/competitions';
import { fetchNbaSalaries, usd, usdShort, type NbaSalaryPlayer } from '@/lib/nba-salaries';
import { Crest } from '@/components/portal/crest';
import { CompetitionHeader } from '@/components/portal/competition-header';
import { resolveCompetition, compBase, withLocale } from '@/lib/competition-page';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';

// Contratos: cambian poco; una regeneración al día basta.
export const revalidate = 86400;
export const dynamicParams = true;
export async function generateStaticParams() { return []; }
type Params = Promise<{ locale: string; deporte: string; competicion: string }>;

/** De momento solo la NBA: es la única liga en la que ESPN da el salario dentro de la plantilla. */
const supported = (deporte: string, competicion: string) => deporte === 'baloncesto' && competicion === 'nba';

export async function generateMetadata({ params }: { params: Params }) {
  const { locale, deporte, competicion } = await params;
  const c = getCompetition(deporte, competicion);
  if (!c || !supported(deporte, competicion)) return {};
  const s = await fetchNbaSalaries();
  const label = s?.label ?? 'temporada en curso';
  return pageMetadata({
    locale, path: `${compBase(c)}/salarios`,
    title: `Sueldos de la NBA ${label}: lo que cobra cada jugador`,
    description: `Ranking de salarios de la NBA en la temporada ${label}, jugador por jugador y con su equipo, y lo que cobran los españoles. Datos de los contratos registrados por ESPN.`,
    keywords: [`sueldos NBA ${label}`, 'salarios NBA', 'jugador mejor pagado NBA', 'cuánto cobra un jugador de la NBA', 'españoles NBA sueldo'],
  });
}

function SalaryTable({ rows, locale, start = 1 }: { rows: NbaSalaryPlayer[]; locale: Locale; start?: number }) {
  return (
    <div className="overflow-x-auto rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)] px-3 md:px-5">
      <table className="w-full border-collapse text-sm">
        <thead><tr className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]"><th className="w-11 px-2 py-3 text-center font-medium">#</th><th className="px-2 py-3 text-left font-medium">Jugador</th><th className="px-2 py-3 text-left font-medium">Equipo</th><th className="hidden px-2 py-3 text-left font-medium sm:table-cell">País</th><th className="px-2 py-3 text-right font-medium">Salario</th></tr></thead>
        <tbody>
          {rows.map((p, i) => (
            <tr key={p.id} className="border-t border-[var(--color-border)]">
              <td className="h-11 px-2 text-center font-mono text-xs tab-num text-[var(--color-fg-subtle)]">{start + i}</td>
              <td className="h-11 px-2 font-medium text-[var(--color-fg)]"><Link href={withLocale(locale, `/baloncesto/nba/jugador/${p.id}`)} className="hover:text-[var(--accent-ink)]">{p.name}</Link></td>
              <td className="h-11 px-2 text-[var(--color-fg-muted)]"><Link href={withLocale(locale, `/baloncesto/nba/equipo/${p.teamId}`)} className="flex items-center gap-2 hover:text-[var(--accent-ink)]"><Crest src={p.teamLogo} abbr={p.teamAbbr} size="s" /><span className="truncate">{p.team}</span></Link></td>
              <td className="hidden h-11 px-2 text-[var(--color-fg-muted)] sm:table-cell">{p.country ?? '—'}</td>
              <td className="h-11 whitespace-nowrap px-2 text-right font-semibold tab-num text-[var(--color-fg)]">{p.salary !== null ? usd(p.salary) : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function NbaSalariesPage({ params }: { params: Params }) {
  const { locale, deporte, competicion } = await params;
  if (!supported(deporte, competicion)) notFound();
  const { s, c } = resolveCompetition(locale, deporte, competicion);
  setRequestLocale(locale);
  const L = locale as Locale;
  const data = await fetchNbaSalaries();
  if (!data) notFound();
  const top = data.ranked[0];
  const spaniards = data.all.filter((p) => p.country === 'España');
  const median = data.ranked[Math.floor(data.ranked.length / 2)]?.salary ?? 0;
  return (
    <main className="pt-28" data-sport={s.slug}>
      <CompetitionHeader
        s={s} c={c} locale={locale} section="salarios"
        title={`Sueldos de la NBA ${data.label}`}
        description={top ? `${top.name} (${top.team}) es el jugador mejor pagado de la temporada ${data.label}: ${usd(top.salary ?? 0)}. El salario mediano entre los ${data.ranked.length} contratos registrados es de ${usd(median)}.` : `Salarios de la temporada ${data.label}.`}
      />

      {spaniards.length > 0 && (
        <section className="mx-auto w-full max-w-[1400px] px-6 pt-8 md:px-10">
          <div className="kicker">España</div>
          <h2 className="t-h2 mt-3 text-[var(--color-fg)]">Lo que cobran los españoles</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {spaniards.map((p) => {
              const last = p.history[0];
              const prev = p.history[1];
              return (
                <Link key={p.id} href={withLocale(L, `/baloncesto/nba/jugador/${p.id}`)} className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5 transition-colors hover:border-[var(--accent)]">
                  <div className="flex items-center gap-2 text-sm text-[var(--color-fg-muted)]"><Crest src={p.teamLogo} abbr={p.teamAbbr} size="s" />{p.team}</div>
                  <div className="mt-2 text-lg font-semibold text-[var(--color-fg)]">{p.name}</div>
                  <div className="n-xl mt-2 leading-none text-[var(--color-fg)]">{usdShort(last.salary)}</div>
                  <div className="mt-2 text-sm text-[var(--color-fg-muted)]">Temporada {last.label}{prev ? ` · ${usdShort(prev.salary)} en la ${prev.label}` : ''}</div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="mx-auto w-full max-w-[1400px] px-6 py-8 md:px-10">
        <div className="kicker">Ranking</div>
        <h2 className="t-h2 mt-3 text-[var(--color-fg)]">Los jugadores mejor pagados</h2>
        <div className="mt-5"><SalaryTable rows={data.ranked.slice(0, 50)} locale={L} /></div>
        {data.ranked.length > 50 && (
          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-semibold text-[var(--accent-ink)]">Ver los {data.ranked.length - 50} siguientes</summary>
            <div className="mt-4"><SalaryTable rows={data.ranked.slice(50)} locale={L} start={51} /></div>
          </details>
        )}
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--color-fg-muted)]">
          Salario bruto de la temporada {data.label} en dólares, según los contratos que registra ESPN. De los {data.rostered} jugadores en plantilla, {data.missing} aún no tienen cargado el contrato de esta temporada (sobre todo renovaciones y fichajes del verano), así que no publicamos la masa salarial por equipo: saldría incompleta.
        </p>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">Fuente: ESPN · actualizado cada día</p>
      </section>
    </main>
  );
}

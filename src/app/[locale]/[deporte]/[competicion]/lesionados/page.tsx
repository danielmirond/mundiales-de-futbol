import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getCompetition } from '@/lib/competitions';
import { fetchLeagueInjuries, hasInjuryReport } from '@/lib/espn-preview';
import { CompetitionHeader } from '@/components/portal/competition-header';
import { InjuryList } from '@/components/portal/injuries';
import { resolveCompetition, compBase, withLocale } from '@/lib/competition-page';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';

// Regeneración periódica (ISR): el parte cambia a lo largo del día.
export const revalidate = 1800;
// Sin prerender en build: cada URL se genera en la primera visita y queda en caché (ISR).
export const dynamicParams = true;
export async function generateStaticParams() { return []; }
type Params = Promise<{ locale: string; deporte: string; competicion: string }>;

const updatedEs = () => new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Madrid' }).format(new Date());

export async function generateMetadata({ params }: { params: Params }) {
  const { locale, deporte, competicion } = await params;
  const c = getCompetition(deporte, competicion);
  if (!c || !hasInjuryReport(c)) return {};
  const n = c.shortName ?? c.name;
  return pageMetadata({
    locale, path: `${compBase(c)}/lesionados`,
    title: `Lesionados de la ${n}: parte de bajas y dudas por equipo`,
    description: `Parte de lesionados de ${c.name} equipo por equipo: quién es baja, quién está en duda, la zona de la lesión y la fecha prevista de vuelta. Actualizado varias veces al día.`,
    keywords: [`lesionados ${n}`, `bajas ${n}`, `parte de lesiones ${n}`, `${n} injuries`, `lesiones ${n} hoy`],
  });
}

export default async function CompetitionInjuriesPage({ params }: { params: Params }) {
  const { locale, deporte, competicion } = await params;
  const { s, c } = resolveCompetition(locale, deporte, competicion);
  if (!hasInjuryReport(c)) notFound();
  setRequestLocale(locale);
  const L = locale as Locale;
  const teams = await fetchLeagueInjuries(c);
  const all = teams.flatMap((t) => t.injuries);
  const out = all.filter((i) => i.severity === 'out').length;
  const doubt = all.filter((i) => i.severity === 'doubt').length;
  const n = c.shortName ?? c.name;
  const teamBase = withLocale(L, `${compBase(c)}/equipo`);
  const playerBase = withLocale(L, `${compBase(c)}/jugador`);
  return (
    <main className="pt-28" data-sport={s.slug}>
      <CompetitionHeader
        s={s} c={c} locale={locale} section="lesionados"
        title={`Lesionados de la ${n}`}
        description={teams.length > 0
          ? `${all.length} jugadores en el parte de ${teams.length} equipos: ${out} ${out === 1 ? 'baja' : 'bajas'} y ${doubt} en duda. Actualizado el ${updatedEs()}.`
          : `Ahora mismo no hay jugadores en el parte de lesionados de ${c.name}.`}
      />
      {teams.length > 0 && (
        <section className="mx-auto w-full max-w-[1400px] px-6 py-8 md:px-10">
          <nav aria-label="Equipos" className="no-scrollbar mb-6 flex gap-1.5 overflow-x-auto">
            {teams.map((t) => (
              <a key={t.id} href={`#equipo-${t.id}`} className="inline-flex h-8 shrink-0 items-center rounded-full border border-[var(--color-border)] px-3.5 text-[13px] text-[var(--color-fg-muted)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-fg)]">{t.name} <span className="ml-1.5 font-mono text-[10px] tab-num text-[var(--color-fg-subtle)]">{t.injuries.length}</span></a>
            ))}
          </nav>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {teams.map((t) => (
              <div key={t.id} id={`equipo-${t.id}`} className="scroll-mt-40 rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5">
                <h2 className="t-h3 text-[var(--color-fg)]"><Link href={`${teamBase}/${t.id}`} className="hover:text-[var(--accent-ink)]">{t.name}</Link></h2>
                <div className="mt-2"><InjuryList items={t.injuries} playerBase={playerBase} /></div>
              </div>
            ))}
          </div>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">Fuente: ESPN · Rojo: baja · Amarillo: duda</p>
        </section>
      )}
    </main>
  );
}

import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';
import { getSport, getCompetition, competitionsOf, competitionPath } from '@/lib/competitions';
import { TodayBoard } from '@/components/portal/today-board';
import { StandingsTable } from '@/components/portal/standings-table';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';

export const dynamic = 'force-dynamic';

const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);

export async function generateMetadata({ params }: { params: Promise<{ locale: string; deporte: string; competicion: string }> }) {
  const { locale, deporte, competicion } = await params;
  const c = getCompetition(deporte, competicion);
  if (!c) return {};
  const soon = !c.espn && !c.href;
  return pageMetadata({
    locale,
    path: `/${c.sport}/${c.slug}`,
    title: soon
      ? `${c.name}: calendario y resultados`
      : `${c.name}: resultados, calendario${c.hasStandings ? ' y clasificación' : ''} en directo`,
    description: c.description,
    keywords: c.keywords,
    noIndex: soon, // sin datos aún → no indexar páginas finas
  });
}

export default async function CompetitionPage({ params }: { params: Promise<{ locale: string; deporte: string; competicion: string }> }) {
  const { locale, deporte, competicion } = await params;
  const s = getSport(deporte);
  const c = getCompetition(deporte, competicion);
  if (!s || !c) notFound();
  if (c.href) redirect(withLocale(locale as Locale, c.href));
  setRequestLocale(locale);
  const L = locale as Locale;
  const soon = !c.espn;
  const siblings = competitionsOf(s.slug).filter((x) => x.slug !== c.slug && (x.espn || x.href));

  return (
    <main className="pt-28" data-sport={s.slug}>
      <JsonLd data={[
        breadcrumbLd(locale, [{ name: 'Inicio', path: '/' }, { name: s.name, path: `/${s.slug}` }, { name: c.name, path: `/${c.sport}/${c.slug}` }]),
        { '@context': 'https://schema.org', '@type': 'SportsOrganization', name: c.name, sport: s.name, url: localeUrl(locale, `/${c.sport}/${c.slug}`) },
      ]} />
      <header className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <Link href={withLocale(L, `/${s.slug}`)} className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> {s.name}
        </Link>
        <h1 className="mt-6 font-display text-fluid-display uppercase leading-[0.9]">{c.name}</h1>
        <p className="mt-4 max-w-2xl text-lg text-[var(--color-fg-muted)]">{c.description}</p>
      </header>

      {soon ? (
        <section className="mx-auto w-full max-w-[1400px] px-6 py-12 md:px-10">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-8 text-[var(--color-fg-muted)]">
            Estamos conectando los datos en directo de <strong className="text-[var(--color-fg)]">{c.name}</strong>. Mientras tanto, puedes seguir el resto de competiciones de {s.name.toLowerCase()}.
          </div>
        </section>
      ) : (
        <>
          <TodayBoard locale={L} competitions={[c]} range="today" kicker="Hoy" title="Partidos de hoy" emptyText={`Hoy no hay partidos de ${c.name}.`} />
          <TodayBoard locale={L} competitions={[c]} range={[1, 10]} kicker="Calendario" title="Próximos partidos" emptyText="Sin partidos programados en los próximos días." />
          <TodayBoard locale={L} competitions={[c]} range={[-10, -1]} kicker="Resultados" title="Últimos resultados" emptyText="Sin resultados recientes." />
          {c.hasStandings && <StandingsTable comp={c} locale={L} />}
        </>
      )}

      {siblings.length > 0 && (
        <section className="mx-auto w-full max-w-[1400px] px-6 pb-16 md:px-10">
          <div className="kicker mb-3">Más {s.name.toLowerCase()}</div>
          <div className="flex flex-wrap gap-2">
            {siblings.map((x) => (
              <Link key={x.slug} href={withLocale(L, competitionPath(x))} className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-sm font-semibold hover:border-[var(--accent)] hover:text-[var(--accent-ink)]">
                {x.shortName ?? x.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

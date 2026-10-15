import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';
import { getSport, competitionsOf, liveCompetitions, competitionPath, KIND_LABEL, type CompetitionKind } from '@/lib/competitions';
import { TodayBoard } from '@/components/portal/today-board';
import { LiveStrip } from '@/components/feed/live-strip';
import { AdSlot } from '@/components/affiliate/ad-slot';
import { RacingHub } from '@/components/portal/racing-hub';
import { TennisHub } from '@/components/portal/tennis-hub';
import { GolfHub, FightHub } from '@/components/portal/individual-hubs';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd } from '@/lib/seo';

// Regeneración periódica (ISR): rápida y estable sin pedir a las fuentes en cada visita.
export const revalidate = 300;
// Sin prerender en build: cada URL se genera en la primera visita y queda en caché (ISR).
export const dynamicParams = true;
export async function generateStaticParams() { return []; }

const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);

export async function generateMetadata({ params }: { params: Promise<{ locale: string; deporte: string }> }) {
  const { locale, deporte } = await params;
  const s = getSport(deporte);
  if (!s) return {};
  return pageMetadata({
    locale,
    path: `/${s.slug}`,
    title: `${s.name}: resultados, calendario y clasificaciones en directo`,
    description: `${s.description} Todas las competiciones de ${s.name.toLowerCase()} con marcadores en directo y partidos de hoy.`,
    keywords: [`resultados ${s.name.toLowerCase()}`, `partidos ${s.name.toLowerCase()} hoy`, `clasificación ${s.name.toLowerCase()}`, s.name.toLowerCase()],
  });
}

export default async function SportPage({ params }: { params: Promise<{ locale: string; deporte: string }> }) {
  const { locale, deporte } = await params;
  const s = getSport(deporte);
  if (!s) notFound();
  setRequestLocale(locale);
  const L = locale as Locale;
  const comps = competitionsOf(s.slug);
  const kinds = [...new Set(comps.map((c) => c.kind))] as CompetitionKind[];

  return (
    <main className="pt-28" data-sport={s.slug}>
      <JsonLd data={breadcrumbLd(locale, [{ name: 'Inicio', path: '/' }, { name: s.name, path: `/${s.slug}` }])} />
      <header className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <Link href={withLocale(L, '/')} className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Inicio
        </Link>
        <h1 className="mt-6 font-display text-fluid-display uppercase leading-[0.9]">{s.name}</h1>
        <p className="mt-4 max-w-2xl text-lg text-[var(--color-fg-muted)]">{s.description}</p>
      </header>

      <LiveStrip locale={L} sport={s.slug} title={`Lo último de ${s.name.toLowerCase()}`} />

      <section className="mx-auto w-full max-w-[1400px] px-6 py-10 md:px-10">
        {kinds.map((k) => (
          <div key={k} className="mb-6">
            <div className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">{s.slug === 'tenis' || s.slug === 'golf' ? 'Circuitos' : s.slug === 'motor' ? 'Campeonatos' : s.slug === 'combate' ? 'Organizaciones' : KIND_LABEL[k]}</div>
            <div className="flex flex-wrap gap-2">
              {comps.filter((c) => c.kind === k).map((c) => {
                const soon = !c.espn && !c.href && !c.stats;
                return (
                  <Link key={c.slug} href={withLocale(L, competitionPath(c))}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm ${soon ? 'border-[var(--color-border)] text-[var(--color-fg-subtle)]' : 'border-[var(--color-border-strong)] font-semibold text-[var(--color-fg)] hover:border-[var(--accent)] hover:text-[var(--accent-ink)]'}`}>
                    {c.name}{soon && <span className="font-mono text-[9px] uppercase tracking-wider">pronto</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      {/* Deportes sin partido local-visitante: la plantilla propia de su competición principal. */}
      {comps.filter((c) => !c.espn && (c.stats === 'racing' || c.stats === 'tennis' || c.stats === 'combat')).map((c) => c.stats === 'racing' ? <RacingHub key={c.slug} comp={c} /> : c.stats === 'combat' ? <FightHub key={c.slug} comp={c} /> : <TennisHub key={c.slug} comp={c} />)}
      {/* Golf: solo el primer circuito en la página del deporte (evita tres tablas seguidas). */}
      {comps.filter((c) => c.stats === 'golf').slice(0, 1).map((c) => <GolfHub key={c.slug} comp={c} />)}

      {liveCompetitions(s.slug).length > 0 && <>
      <TodayBoard locale={L} competitions={liveCompetitions(s.slug)} range="today" kicker="Hoy" title={`Partidos de ${s.name.toLowerCase()} hoy`} emptyText={`Hoy no hay partidos de ${s.name.toLowerCase()} en las competiciones que seguimos.`} />
      <AdSlot placement="competicion" sport={s.slug} className="py-4" />
      <TodayBoard locale={L} competitions={liveCompetitions(s.slug)} range={[1, 7]} kicker="Próximos 7 días" title="Lo que viene" limitPerGroup={6} />
      </>}
    </main>
  );
}

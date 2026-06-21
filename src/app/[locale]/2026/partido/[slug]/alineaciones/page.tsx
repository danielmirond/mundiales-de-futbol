import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';
import {
  FIXTURES_2026,
  TEAMS_2026,
  STAGE_LABEL,
  matchSlug,
  getFixtureBySlug,
} from '@/lib/wc-2026';
import { fetchScores, buildScoreMap, scoreKey } from '@/lib/live-scores';
import { fetchMatchSummary } from '@/lib/wc-2026-match-summary';
import { Lineup } from '@/components/match/match-summary';
import { routing } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd } from '@/lib/seo';

export const dynamicParams = true;

function withLocale(locale: string, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export function generateStaticParams() {
  return FIXTURES_2026.filter((f) => f.home && f.away).map((f) => ({
    locale: routing.defaultLocale,
    slug: matchSlug(f),
  }));
}

const tName = (c?: string, fb?: string) => (c && TEAMS_2026[c]?.name) || fb || c || 'Por definir';
const tFlag = (c?: string) => (c && TEAMS_2026[c]?.flag) || '🏳️';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const f = getFixtureBySlug(slug);
  if (!f) return {};
  const hn = tName(f.home, f.label);
  const an = tName(f.away);
  return pageMetadata({
    locale,
    path: `/2026/partido/${slug}/alineaciones`,
    title: `Alineaciones de ${hn} - ${an}: onces y suplentes | Mundial 2026`,
    description: `Alineaciones confirmadas de ${hn} y ${an} en el Mundial 2026: los onces titulares, la formación de cada equipo y los suplentes. Se confirman aproximadamente una hora antes del partido.`,
    keywords: [
      `alineaciones ${hn} ${an}`,
      `alineación ${hn} ${an}`,
      `once de ${hn}`,
      `once de ${an}`,
      `onces confirmados ${hn} ${an}`,
      `alineación ${hn} Mundial 2026`,
    ],
  });
}

export default async function AlineacionesPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const f = getFixtureBySlug(slug);
  if (!f) notFound();

  const hn = tName(f!.home, f!.label);
  const an = tName(f!.away);
  const stageLabel = f!.stage.length === 1 ? `Grupo ${f!.stage}` : (STAGE_LABEL[f!.stage] ?? f!.stage);

  const scoreMap = buildScoreMap(await fetchScores());
  const sc = f!.home && f!.away ? scoreMap.get(scoreKey(f!.home, f!.away)) : undefined;
  const summary = sc?.id && f!.home && f!.away ? await fetchMatchSummary(sc.id, f!.home, f!.away) : null;

  return (
    <main className="mx-auto w-full max-w-[1000px] px-6 pb-24 pt-28 md:px-10 md:pt-32">
      <JsonLd
        data={breadcrumbLd(locale, [
          { name: 'Inicio', path: '/' },
          { name: 'Mundial 2026', path: '/2026' },
          { name: `${hn} - ${an}`, path: `/2026/partido/${slug}` },
          { name: 'Alineaciones', path: `/2026/partido/${slug}/alineaciones` },
        ])}
      />

      <Link
        href={withLocale(locale, `/2026/partido/${slug}`)}
        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-pitch)]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Ficha del partido
      </Link>

      <header className="mt-6">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Alineaciones · {stageLabel} · Mundial 2026
        </div>
        <h1 className="mt-3 font-display text-fluid-h1 uppercase leading-[0.95]">
          Alineaciones de {hn} - {an}
        </h1>
      </header>

      {summary?.hasLineups ? (
        <>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--color-fg-muted)]">
            Estos son los <strong className="text-[var(--color-fg)]">onces confirmados</strong> de{' '}
            {hn} y {an}, con la formación de cada equipo y los suplentes.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Lineup
              team={hn}
              flag={tFlag(f!.home)}
              formation={summary.formationHome}
              starters={summary.startHome}
              subs={summary.subsHome}
            />
            <Lineup
              team={an}
              flag={tFlag(f!.away)}
              formation={summary.formationAway}
              starters={summary.startAway}
              subs={summary.subsAway}
            />
          </div>
        </>
      ) : (
        <div className="mt-8 rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-7 md:p-8">
          <p className="text-base leading-relaxed text-[var(--color-fg-muted)]">
            Las alineaciones de <strong className="text-[var(--color-fg)]">{hn} - {an}</strong> se
            confirman <strong className="text-[var(--color-fg)]">aproximadamente una hora antes</strong>{' '}
            del inicio. Cuando los entrenadores publiquen los onces, aparecerán aquí.
          </p>
          <Link
            href={withLocale(locale, `/2026/partido/${slug}`)}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-black transition-transform hover:scale-[1.03]"
          >
            Ver la ficha del partido
          </Link>
        </div>
      )}

      <p className="mt-10 text-sm text-[var(--color-fg-muted)]">
        Sigue el partido al completo —marcador, narración minuto a minuto y estadísticas— en la{' '}
        <Link
          href={withLocale(locale, `/2026/partido/${slug}`)}
          className="underline decoration-[var(--color-fg-subtle)] underline-offset-4 hover:text-[var(--color-pitch)]"
        >
          ficha de {hn} - {an}
        </Link>
        .
      </p>
    </main>
  );
}

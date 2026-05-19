import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight, Play, Trophy } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';
import {
  FAMOUS_GOALS,
  youtubeSearchUrl,
  youtubeThumbnailUrl,
  videoObjectLd,
  type FamousGoal,
} from '@/lib/wc-famous-goals';
import { TEAMS_2026 } from '@/lib/wc-2026';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/goles-famosos',
    title: 'Goles famosos de los Mundiales · Mano de Dios, Iniesta, Carlos Alberto, Messi',
    description:
      'Los goles más icónicos de la historia de los Mundiales de Fútbol: el gol del siglo de Maradona, la Mano de Dios, la chilena de Pelé 1958, Carlos Alberto en el 70, Iniesta en Johannesburgo 2010, Götze en el Maracaná 2014, Messi y Argentina campeona 2022. 18 goles con vídeo y contexto.',
    keywords: [
      'goles famosos Mundial',
      'mejores goles Mundial historia',
      'gol del siglo Maradona',
      'mano de Dios',
      'gol Iniesta Mundial 2010',
      'gol Carlos Alberto 1970',
      'gol Messi final 2022',
      'gol Pavard Mundial 2018',
      'Premio Puskas Mundial',
    ],
    type: 'article',
  });
}

function GoalCard({ goal, locale }: { goal: FamousGoal; locale: string }) {
  const team = TEAMS_2026[goal.teamCode as keyof typeof TEAMS_2026];
  const opp = TEAMS_2026[goal.opponentCode as keyof typeof TEAMS_2026];
  const hasVideo = Boolean(goal.youtubeId);
  const thumbnail = goal.youtubeId ? youtubeThumbnailUrl(goal.youtubeId) : null;
  const watchUrl = goal.youtubeId
    ? `https://www.youtube.com/watch?v=${goal.youtubeId}`
    : youtubeSearchUrl(goal.youtubeQuery);

  return (
    <article
      id={goal.slug}
      className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 scroll-mt-32"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            Mundial {goal.year} · {goal.stage.toUpperCase()} · min {goal.minute}
          </div>
          <h2 className="mt-1 font-display text-2xl uppercase leading-tight">{goal.title}</h2>
        </div>
        <div className="font-mono text-sm text-[var(--color-pitch)]">
          {team?.flag} {goal.teamCode} <span className="text-[var(--color-fg-subtle)]">{goal.finalScore.team}-{goal.finalScore.opponent}</span> {goal.opponentCode} {opp?.flag}
        </div>
      </div>

      <p className="mt-3 font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
        Jugador: {goal.player}
      </p>

      <p className="mt-4 text-base leading-relaxed text-[var(--color-fg-muted)]">
        {goal.description}
      </p>

      {/* Video thumbnail / link */}
      <a
        href={watchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 group relative block overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]"
      >
        {thumbnail ? (
          <>
            <img
              src={thumbnail}
              alt={`Vídeo del gol: ${goal.title}`}
              loading="lazy"
              className="aspect-video w-full object-cover transition-opacity group-hover:opacity-90"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-2 rounded-full bg-black/70 px-4 py-2.5 backdrop-blur transition-transform group-hover:scale-105">
                <Play className="h-5 w-5 fill-current text-[var(--color-pitch)]" />
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-white">
                  Ver en YouTube
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex aspect-video w-full items-center justify-center bg-[var(--color-bg)] transition-colors group-hover:bg-[var(--color-bg-2)]">
            <div className="flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-bg-2)] px-4 py-2.5">
              <Play className="h-5 w-5 fill-current text-[var(--color-pitch)]" />
              <span className="font-mono text-xs uppercase tracking-[0.3em]">
                Buscar gol en YouTube
              </span>
            </div>
          </div>
        )}
      </a>

      {/* Why iconic */}
      <div className="mt-5 rounded-xl border border-[var(--color-pitch)]/30 bg-[var(--color-pitch)]/5 p-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Por qué es icónico
        </div>
        <p className="mt-1.5 text-sm text-[var(--color-fg-muted)]">{goal.whyIconic}</p>
      </div>

      {/* Related historia */}
      {goal.relatedHistoriaSlug && (
        <div className="mt-4">
          <Link
            href={withLocale(locale as Locale, `/historias/${goal.relatedHistoriaSlug}`)}
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-pitch)] hover:underline"
          >
            Leer la historia completa <ArrowRight className="h-3 w-3 rtl:rotate-180" />
          </Link>
        </div>
      )}
    </article>
  );
}

export default async function GolesFamososPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mundiales-de-futbol.com').trim();

  // Agrupar por década
  const decades = new Map<number, FamousGoal[]>();
  for (const g of FAMOUS_GOALS) {
    const d = Math.floor(g.year / 10) * 10;
    if (!decades.has(d)) decades.set(d, []);
    decades.get(d)!.push(g);
  }
  const sortedDecades = [...decades.entries()].sort((a, b) => a[0] - b[0]);

  // JSON-LD: VideoObject por cada gol + ItemList
  const videoLds = FAMOUS_GOALS.map((g) => videoObjectLd(g, siteUrl));

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Goles famosos en la historia de los Mundiales',
    url: localeUrl(locale, '/goles-famosos'),
    inLanguage: locale,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: FAMOUS_GOALS.length,
      itemListElement: FAMOUS_GOALS.map((g, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: g.title,
      })),
    },
  };

  return (
    <article className="pt-32 pb-24">
      <JsonLd
        data={[
          itemListLd,
          ...videoLds,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Goles famosos', path: '/goles-famosos' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Trophy className="mr-2 inline h-3 w-3" /> Antología editorial
        </div>
        <h1 className="mt-3 font-display text-4xl uppercase leading-[1] md:text-5xl">
          Goles famosos de los Mundiales
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)]">
          Los <strong>{FAMOUS_GOALS.length} goles más icónicos</strong> de la historia
          de la Copa del Mundo: la <strong>Mano de Dios</strong> y el <strong>gol del siglo</strong>{' '}
          de Maradona, la chilena de <strong>Pelé</strong> en Suecia 1958, el <strong>gol de
          Carlos Alberto</strong> en México 70 (FIFA lo declaró el mejor de la historia), el cabezazo
          imposible de <strong>Iniesta</strong> en Johannesburgo 2010 que dio España al mundo,
          la volea de <strong>Pavard</strong> en Rusia 2018 (Premio Puskas), la chilena de
          <strong> Richarlison</strong> en Catar 2022 y el gol de <strong>Messi</strong> que
          coronó a Argentina por tercera vez.
        </p>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--color-fg-muted)]">
          Cada gol incluye contexto del partido, jugada exacta, fecha y enlace al vídeo en
          YouTube. Los goles están agrupados por década y enlazan a las historias editoriales
          relacionadas en {' '}<Link href={withLocale(locale as Locale, '/historias')} className="underline">/historias</Link>.
        </p>
      </header>

      {/* Por década */}
      {sortedDecades.map(([decade, goals]) => (
        <section key={decade} className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10">
          <div className="flex items-baseline gap-3">
            <h2 className="font-display text-3xl uppercase">Años {decade}</h2>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
              {goals.length} {goals.length === 1 ? 'gol' : 'goles'}
            </span>
          </div>
          <div className="mt-6 space-y-5">
            {goals.map((g) => (
              <GoalCard key={g.slug} goal={g} locale={locale} />
            ))}
          </div>
        </section>
      ))}

      {/* CTAs */}
      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
          <h2 className="font-display text-lg uppercase">Sigue por aquí</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={withLocale(locale as Locale, '/historias')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Historias editoriales
            </Link>
            <Link href={withLocale(locale as Locale, '/ediciones')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              22 Mundiales 1930-2022
            </Link>
            <Link href={withLocale(locale as Locale, '/selecciones')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Selecciones históricas
            </Link>
            <Link href={withLocale(locale as Locale, '/2026')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Mundial 2026
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

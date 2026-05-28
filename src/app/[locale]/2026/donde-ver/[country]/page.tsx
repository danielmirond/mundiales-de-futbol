import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight, Tv, Radio, Smartphone, Play, AlertTriangle } from 'lucide-react';
import {
  BROADCASTS_2026,
  getBroadcastBySlug,
  type BroadcastChannel,
} from '@/lib/wc-2026-broadcasts';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl, SEO } from '@/lib/seo';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export function generateStaticParams() {
  return BROADCASTS_2026.flatMap((b) =>
    routing.locales.map((locale) => ({ locale, country: b.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}) {
  const { locale, country } = await params;
  const broadcast = getBroadcastBySlug(country);
  if (!broadcast) return {};

  const labels: Record<string, { title: string; description: string }> = {
    es: {
      title: `Dónde ver el Mundial 2026 en ${broadcast.name}: TV, streaming y precios`,
      description: `Guía oficial de dónde ver el Mundial 2026 en ${broadcast.name}: cadenas con derechos, plataformas de streaming, precios y cobertura partido a partido.`,
    },
    pt: {
      title: `Onde assistir à Copa do Mundo 2026 ${broadcast.name === 'Brasil' ? 'no Brasil' : `em ${broadcast.name}`}: TV, streaming e preços`,
      description: `Guia oficial de onde assistir à Copa do Mundo 2026 ${broadcast.name === 'Brasil' ? 'no Brasil' : `em ${broadcast.name}`}: canais com direitos, plataformas de streaming, preços e cobertura jogo a jogo.`,
    },
    en: {
      title: `Where to watch the 2026 World Cup in ${broadcast.name === 'Estados Unidos' ? 'the USA' : broadcast.name}: TV, streaming and prices`,
      description: `Official guide on where to watch the 2026 World Cup in ${broadcast.name === 'Estados Unidos' ? 'the USA' : broadcast.name}: networks with rights, streaming platforms, prices and match-by-match coverage.`,
    },
  };

  const l = labels[locale] ?? labels[broadcast.locale] ?? labels.es;
  // availableLocales: el del país + ES y EN si difieren
  const available = Array.from(new Set([broadcast.locale, 'es'].concat(broadcast.code === 'USA' ? ['en'] : [])));

  return pageMetadata({
    locale,
    path: `/2026/donde-ver/${broadcast.slug}`,
    title: l.title,
    description: l.description,
    keywords:
      broadcast.slug === 'mexico'
        ? ['donde ver mundial 2026 mexico', 'mundial 2026 televisa', 'mundial 2026 vix', 'mundial 2026 azteca', 'partido inaugural mexico 2026 donde ver']
        : broadcast.slug === 'brasil'
          ? ['onde assistir copa do mundo 2026', 'globo copa 2026', 'cazetv copa 2026', 'sportv copa do mundo 2026', 'globoplay copa 2026']
          : broadcast.slug === 'usa'
            ? ['where to watch World Cup 2026 USA', '2026 World Cup FOX', '2026 World Cup Telemundo', 'Peacock World Cup 2026', 'donde ver mundial 2026 estados unidos']
            : [`donde ver mundial 2026 ${broadcast.name.toLowerCase()}`],
    type: 'article',
    availableLocales: available,
  });
}

const ICON_FOR_TYPE: Record<BroadcastChannel['type'], React.ReactNode> = {
  free: <Radio className="h-4 w-4" />,
  pay: <Tv className="h-4 w-4" />,
  streaming: <Smartphone className="h-4 w-4" />,
  youtube: <Play className="h-4 w-4" />,
};

export default async function DondeVerPaisPage({
  params,
}: {
  params: Promise<{ locale: string; country: string }>;
}) {
  const { locale, country } = await params;
  setRequestLocale(locale);

  const broadcast = getBroadcastBySlug(country);
  if (!broadcast) notFound();

  const pageUrl = localeUrl(locale, `/2026/donde-ver/${broadcast.slug}`);
  const isEn = locale === 'en';
  const isPt = locale === 'pt';

  // Heurística etiqueta principal según locale del usuario
  const labels = isEn
    ? {
        kicker: 'Where to watch',
        h1: `Where to watch the 2026 World Cup in ${broadcast.name === 'Estados Unidos' ? 'the USA' : broadcast.name}`,
        rightsTitle: 'Broadcasting rights',
        channelsTitle: 'Networks and platforms',
        faqTitle: 'Frequently asked',
        legal: 'Legal note',
        back: '2026 World Cup',
        backDondeVer: 'All countries',
        coverageAll: 'All 104 matches',
        coveragePartial: 'Selected matches',
      }
    : isPt
      ? {
          kicker: 'Onde assistir',
          h1: `Onde assistir à Copa do Mundo 2026 ${broadcast.name === 'Brasil' ? 'no Brasil' : `em ${broadcast.name}`}`,
          rightsTitle: 'Direitos de transmissão',
          channelsTitle: 'Canais e plataformas',
          faqTitle: 'Perguntas frequentes',
          legal: 'Nota legal',
          back: 'Copa do Mundo 2026',
          backDondeVer: 'Todos os países',
          coverageAll: 'Todos os 104 jogos',
          coveragePartial: 'Jogos selecionados',
        }
      : {
          kicker: 'Dónde ver',
          h1: `Dónde ver el Mundial 2026 en ${broadcast.name}`,
          rightsTitle: 'Estado de los derechos',
          channelsTitle: 'Canales y plataformas',
          faqTitle: 'Preguntas frecuentes',
          legal: 'Nota legal',
          back: 'Mundial 2026',
          backDondeVer: 'Todos los países',
          coverageAll: 'Todos los 104 partidos',
          coveragePartial: 'Partidos seleccionados',
        };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: broadcast.faq.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: labels.h1,
    description: broadcast.rightsSummary.slice(0, 200),
    url: pageUrl,
    inLanguage: locale,
    publisher: { '@type': 'Organization', name: SEO.siteName, url: SEO.siteUrl },
    about: {
      '@type': 'SportsEvent',
      name: 'FIFA World Cup 2026',
      startDate: '2026-06-11',
      endDate: '2026-07-19',
    },
  };

  return (
    <article className="pt-32 pb-24">
      <JsonLd
        data={[
          articleLd,
          faqLd,
          breadcrumbLd(locale, [
            { name: isEn ? 'Home' : isPt ? 'Início' : 'Inicio', path: '/' },
            { name: isEn ? 'World Cup 2026' : isPt ? 'Copa do Mundo 2026' : 'Mundial 2026', path: '/2026' },
            { name: isEn ? 'Where to watch' : isPt ? 'Onde assistir' : 'Dónde ver', path: '/2026/donde-ver' },
            { name: broadcast.name, path: `/2026/donde-ver/${broadcast.slug}` },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/2026/donde-ver')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> {labels.backDondeVer}
        </Link>

        <div className="mt-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <span aria-hidden className="text-2xl">{broadcast.flag}</span>
          <span>{labels.kicker} · {broadcast.name}</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          {labels.h1}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          {broadcast.rightsSummary}
        </p>

        {broadcast.inWorldCup && broadcast.group && (
          <p className="mt-6 inline-flex items-center gap-3 rounded-full border border-[var(--color-pitch)]/30 bg-[var(--color-pitch)]/5 px-5 py-2 text-sm font-mono uppercase tracking-[0.25em] text-[var(--color-pitch)]">
            {isEn ? `Group ${broadcast.group} · in the World Cup` : isPt ? `Grupo ${broadcast.group} · na Copa` : `Grupo ${broadcast.group} · participa`}
          </p>
        )}
      </header>

      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Tv className="inline h-3 w-3 mr-2" />
          {labels.channelsTitle}
        </div>
        <h2 className="mt-3 font-display text-3xl uppercase leading-[1] md:text-4xl">
          {broadcast.channels.length} {isEn ? 'options' : isPt ? 'opções' : 'opciones'}
        </h2>

        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {broadcast.channels.map((c) => (
            <li
              key={c.name}
              className="flex flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:p-7"
            >
              <div className="flex items-center gap-3">
                <span className="text-[var(--color-pitch)]">{ICON_FOR_TYPE[c.type]}</span>
                <h3 className="font-display text-lg uppercase leading-tight text-[var(--color-fg)] md:text-xl">
                  {c.name}
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-2 font-mono text-[9px] uppercase tracking-[0.25em]">
                <span
                  className={`inline-flex rounded-full border px-2.5 py-1 ${
                    c.coverage === 'all'
                      ? 'border-[var(--color-pitch)]/40 text-[var(--color-pitch)]'
                      : 'border-[var(--color-border)] text-[var(--color-fg-muted)]'
                  }`}
                >
                  {c.coverage === 'all' ? labels.coverageAll : labels.coveragePartial}
                </span>
                <span className="text-[var(--color-fg-muted)]">{c.price}</span>
                {c.language && (
                  <span className="text-[var(--color-fg-subtle)]">· {c.language}</span>
                )}
              </div>
              <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">
                {c.detail}
              </p>
              <a
                href={c.url}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="mt-auto inline-flex items-center gap-1 self-start font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-pitch)] hover:underline"
              >
                {isEn ? 'Visit official site' : isPt ? 'Site oficial' : 'Web oficial'} →
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto mt-20 w-full max-w-[900px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          {labels.faqTitle}
        </div>
        <h2 className="mt-3 font-display text-3xl uppercase leading-[1] md:text-4xl">
          {isEn ? 'Most asked' : isPt ? 'Mais perguntado' : 'Lo que más se pregunta'}
        </h2>

        <ul className="mt-10 space-y-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)]">
          {broadcast.faq.map((item) => (
            <li key={item.q} className="bg-[var(--color-bg)] p-6 md:p-7">
              <h3 className="font-display text-lg uppercase leading-tight text-[var(--color-fg)] md:text-xl">
                {item.q}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)] md:text-base">
                {item.a}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {broadcast.legalNote && (
        <section className="mx-auto mt-16 w-full max-w-[900px] px-6 md:px-10">
          <div className="flex gap-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-400" />
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-300">
                {labels.legal}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                {broadcast.legalNote}
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-pitch)]/8 via-[var(--color-bg-2)] to-[var(--color-bg-2)] p-8 md:p-14">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            {isEn ? 'Other countries' : isPt ? 'Outros países' : 'Otros países'}
          </div>
          <h2 className="mt-3 max-w-2xl font-display text-2xl uppercase leading-tight md:text-3xl">
            {isEn
              ? 'Where to watch the 2026 World Cup around the world'
              : isPt
                ? 'Onde assistir à Copa do Mundo 2026 ao redor do mundo'
                : 'Dónde ver el Mundial 2026 en otros países'}
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {BROADCASTS_2026.filter((b) => b.slug !== broadcast.slug).map((b) => (
              <Link
                key={b.slug}
                href={withLocale(locale as Locale, `/2026/donde-ver/${b.slug}`)}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
              >
                <span aria-hidden>{b.flag}</span>
                {b.name}
                <ArrowRight className="h-3 w-3 rtl:rotate-180" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}

import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ArrowLeft, Trophy, TrendingUp, AlertCircle } from 'lucide-react';
import { TEAMS_2026 } from '@/lib/wc-2026';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl, SEO } from '@/lib/seo';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.favoritosGanarMundial.meta' });
  return pageMetadata({
    locale,
    path: '/2026/favoritos-ganar-mundial',
    title: t('title'),
    description: t('description'),
    keywords: t.raw('keywords') as string[],
    type: 'article',
  });
}

type FavoritoStatus =
  | 'campeona'
  | 'finalista'
  | 'semifinalista'
  | 'cabeza-serie'
  | 'anfitriona'
  | 'outsider';

type Favorito = {
  code: string;
  rank: number;
  cuota: string;
  cuotaNum: number;
  group: string;
  status: FavoritoStatus;
};

// Datos no-traducibles. Las strings (fortaleza/riesgo/estrella/partidoClave)
// viven en messages/<locale>.json bajo pages.favoritosGanarMundial.favoritos.<code>.
const FAVORITOS: Favorito[] = [
  { code: 'ARG', rank: 1, cuota: '5/1', cuotaNum: 5, group: 'J', status: 'campeona' },
  { code: 'FRA', rank: 2, cuota: '6/1', cuotaNum: 6, group: 'I', status: 'finalista' },
  { code: 'BRA', rank: 3, cuota: '7/1', cuotaNum: 7, group: 'C', status: 'cabeza-serie' },
  { code: 'ESP', rank: 4, cuota: '8/1', cuotaNum: 8, group: 'H', status: 'cabeza-serie' },
  { code: 'ENG', rank: 5, cuota: '9/1', cuotaNum: 9, group: 'L', status: 'finalista' },
  { code: 'GER', rank: 6, cuota: '12/1', cuotaNum: 12, group: 'E', status: 'cabeza-serie' },
  { code: 'POR', rank: 7, cuota: '14/1', cuotaNum: 14, group: 'K', status: 'cabeza-serie' },
  { code: 'NED', rank: 8, cuota: '20/1', cuotaNum: 20, group: 'F', status: 'cabeza-serie' },
  { code: 'CRO', rank: 9, cuota: '30/1', cuotaNum: 30, group: 'L', status: 'semifinalista' },
  { code: 'BEL', rank: 10, cuota: '35/1', cuotaNum: 35, group: 'G', status: 'cabeza-serie' },
  { code: 'USA', rank: 11, cuota: '50/1', cuotaNum: 50, group: 'D', status: 'anfitriona' },
  { code: 'MEX', rank: 12, cuota: '50/1', cuotaNum: 50, group: 'A', status: 'anfitriona' },
];

type StatItem = { label: string; value: string };
type FaqItem = { q: string; a: string };
type PronoItem = { label: string; text: string };

export default async function FavoritosGanarMundial({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'pages.favoritosGanarMundial' });

  const stats = (t.raw('stats') as StatItem[]) ?? [];
  const faqItems = (t.raw('faq.items') as FaqItem[]) ?? [];
  const pronoItems = (t.raw('pronostico.items') as PronoItem[]) ?? [];

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: t('articleHeadline'),
    description: t('articleDescription'),
    publisher: { '@type': 'Organization', name: SEO.siteName, url: SEO.siteUrl },
    datePublished: '2026-05-04',
    dateModified: '2026-05-04',
    mainEntityOfPage: localeUrl(locale, '/2026/favoritos-ganar-mundial'),
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <article className="pt-32">
      <JsonLd
        data={[
          articleLd,
          faqLd,
          breadcrumbLd(locale, [
            { name: t('breadcrumb.inicio'), path: '/' },
            { name: t('breadcrumb.mundial'), path: '/2026' },
            { name: t('breadcrumb.favoritos'), path: '/2026/favoritos-ganar-mundial' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/2026')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> {t('back')}
        </Link>

        <div className="mt-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Trophy className="h-4 w-4" />
          <span>{t('kicker')}</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          {t('h1Line1')}<br />{t('h1Line2')}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          {t.rich('intro', {
            strong: (chunks) => <strong className="text-[var(--color-fg)]">{chunks}</strong>,
          })}
        </p>

        <ul className="mt-12 grid gap-3 md:grid-cols-4">
          {stats.map((f) => (
            <li
              key={f.label}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                {f.label}
              </div>
              <div className="mt-2 font-display text-2xl tab-num text-[var(--color-pitch)]">
                {f.value}
              </div>
            </li>
          ))}
        </ul>
      </header>

      <section className="mx-auto mt-20 w-full max-w-[1200px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <TrendingUp className="inline h-3 w-3 mr-1" />
          {t('ranking.kicker')}
        </div>
        <h2 className="mt-3 font-display text-3xl uppercase">{t('ranking.h2')}</h2>
        <p className="mt-4 max-w-3xl text-[var(--color-fg-muted)]">
          {t('ranking.intro')}
        </p>

        <div className="mt-8 overflow-hidden rounded-3xl border border-[var(--color-border)]">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-bg-2)]">
              <tr>
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                  {t('ranking.tableRank')}
                </th>
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                  {t('ranking.tableTeam')}
                </th>
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                  {t('ranking.tableGroup')}
                </th>
                <th className="px-4 py-3 text-right font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                  {t('ranking.tableOdds')}
                </th>
                <th className="px-4 py-3 text-right font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                  {t('ranking.tableProbability')}
                </th>
                <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)] hidden md:table-cell">
                  {t('ranking.tableStatus')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {FAVORITOS.map((f) => {
                const team = TEAMS_2026[f.code];
                const probability = ((1 / (f.cuotaNum + 1)) * 100).toFixed(1);
                return (
                  <tr key={f.code} className={f.rank <= 5 ? 'bg-[var(--color-pitch)]/5' : ''}>
                    <td className="px-4 py-3 font-mono tab-num">{String(f.rank).padStart(2, '0')}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={withLocale(locale as Locale, `/selecciones/${f.code}`)}
                        className="inline-flex items-center gap-2 hover:text-[var(--color-pitch)]"
                      >
                        <span aria-hidden>{team?.flag ?? ''}</span>
                        <span className="font-medium">{team?.name ?? f.code}</span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-mono">
                      <Link
                        href={withLocale(locale as Locale, `/2026/grupo/${f.group}`)}
                        className="hover:text-[var(--color-pitch)]"
                      >
                        {f.group}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right font-mono tab-num text-[var(--color-pitch)]">
                      {f.cuota}
                    </td>
                    <td className="px-4 py-3 text-right font-mono tab-num text-[var(--color-fg-muted)]">
                      {probability} %
                    </td>
                    <td className="px-4 py-3 text-xs uppercase tracking-[0.2em] text-[var(--color-fg-subtle)] hidden md:table-cell">
                      {t(`statusLabels.${f.status}`)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-[1200px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          {t('analysis.kicker')}
        </div>
        <h2 className="mt-3 font-display text-3xl uppercase">{t('analysis.h2')}</h2>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {FAVORITOS.map((f) => {
            const team = TEAMS_2026[f.code];
            return (
              <article
                key={f.code}
                className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-7"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl" aria-hidden>{team?.flag}</span>
                    <div>
                      <h3 className="font-display text-xl uppercase">{team?.name}</h3>
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                        {t('analysis.groupOddsTpl', { group: f.group, cuota: f.cuota })}
                      </div>
                    </div>
                  </div>
                  <span className="font-display text-3xl tab-num text-[var(--color-fg-muted)]">
                    {String(f.rank).padStart(2, '0')}
                  </span>
                </div>

                <div className="mt-5 space-y-3 text-sm leading-relaxed">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-400">
                      {t('analysis.fortalezaLabel')}
                    </div>
                    <p className="mt-1 text-[var(--color-fg-muted)]">{t(`favoritos.${f.code}.fortaleza`)}</p>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400">
                      {t('analysis.riesgoLabel')}
                    </div>
                    <p className="mt-1 text-[var(--color-fg-muted)]">{t(`favoritos.${f.code}.riesgo`)}</p>
                  </div>
                  <div className="border-t border-[var(--color-border)] pt-3">
                    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
                      {t('analysis.estrellaLabel')}
                    </div>
                    <p className="mt-1 text-[var(--color-fg)]">{t(`favoritos.${f.code}.estrella`)}</p>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                      {t('analysis.partidoClaveLabel')}
                    </div>
                    <p className="mt-1 text-[var(--color-fg-muted)]">{t(`favoritos.${f.code}.partidoClave`)}</p>
                  </div>
                </div>

                <Link
                  href={withLocale(locale as Locale, `/selecciones/${f.code}`)}
                  className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)] hover:text-[var(--color-fg)]"
                >
                  {t('analysis.verPerfilTpl', { team: team?.name ?? f.code })}
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-[1200px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-pitch)]/30 bg-[var(--color-pitch)]/5 p-7 md:p-10">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            <AlertCircle className="h-4 w-4" />
            <span>{t('pronostico.kicker')}</span>
          </div>
          <h2 className="mt-3 font-display text-2xl uppercase md:text-3xl">
            {t('pronostico.h2')}
          </h2>
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-[var(--color-fg-muted)] md:text-base">
            {pronoItems.map((p) => (
              <p key={p.label}>
                <strong className="text-[var(--color-fg)]">{p.label}</strong>: {p.text}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-[1200px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          {t('faq.kicker')}
        </div>
        <h2 className="mt-3 font-display text-3xl uppercase md:text-4xl">{t('faq.h2')}</h2>
        <div className="mt-10 divide-y divide-[var(--color-border)] border-t border-b border-[var(--color-border)]">
          {faqItems.map(({ q, a }) => (
            <details key={q} className="group py-5">
              <summary className="flex cursor-pointer items-start justify-between gap-6 text-base md:text-lg">
                <span className="font-medium text-[var(--color-fg)]">{q}</span>
                <span className="mt-1 inline-flex h-5 w-5 items-center justify-center font-mono text-sm text-[var(--color-fg-subtle)] transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-[var(--color-fg-muted)]">
                {a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 mb-24 w-full max-w-[1200px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-10">
          <h2 className="font-display text-2xl uppercase">{t('related.h2')}</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={withLocale(locale as Locale, '/2026/grupos')}
              className="rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black"
            >
              {t('related.grupos')}
            </Link>
            <Link
              href={withLocale(locale as Locale, '/2026/calendario')}
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm"
            >
              {t('related.calendario')}
            </Link>
            <Link
              href={withLocale(locale as Locale, '/2026/sedes')}
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm"
            >
              {t('related.sedes')}
            </Link>
            <Link
              href={withLocale(locale as Locale, '/noticias/espana-mundial-2026-opciones-pronosticos-grupo-h-yamal-rodri')}
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm"
            >
              {t('related.analisisEspana')}
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

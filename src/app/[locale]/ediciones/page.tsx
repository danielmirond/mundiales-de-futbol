import { setRequestLocale, getTranslations } from 'next-intl/server';
import { EditionsGrid } from '@/components/home/editions-grid';
import type { Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl, SEO } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home.editions' });
  return pageMetadata({
    locale,
    path: '/ediciones',
    title: `${t('title')} · 1930 — 2026`,
    description:
      'Las 23 ediciones de la Copa del Mundo masculina, de Uruguay 1930 al Mundial 2026 de Estados Unidos, México y Canadá. Resultados, sedes, campeones y crónicas.',
    keywords: [
      'ediciones Mundial',
      'historia Mundiales 1930-2026',
      'campeones Copa del Mundo',
      'Mundiales FIFA',
    ],
  });
}

export default async function EditionsIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home.editions');

  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: t('title'),
    url: localeUrl(locale, '/ediciones'),
    isPartOf: { '@type': 'WebSite', name: SEO.siteName, url: SEO.siteUrl },
    inLanguage: locale,
    description:
      'Listado completo de las 23 ediciones de la Copa del Mundo masculina (1930–2026).',
  };

  return (
    <div className="pt-32">
      <JsonLd
        data={[
          collectionLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: t('title'), path: '/ediciones' },
          ]),
        ]}
      />
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Archivo · 1930 — 2026
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          {t('title')}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-[var(--color-fg-muted)]">{t('subtitle')}</p>
      </div>
      <EditionsGrid locale={locale as Locale} />
    </div>
  );
}

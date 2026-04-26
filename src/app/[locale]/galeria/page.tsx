import { setRequestLocale, getTranslations } from 'next-intl/server';
import { PhotoGallery } from '@/components/gallery/photo-gallery';
import { GALLERY } from '@/lib/gallery';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.galeria' });
  return pageMetadata({
    locale,
    path: '/galeria',
    title: t('title'),
    description:
      t('description'),
    keywords: [
      'fotos históricas Mundiales',
      'imágenes Copa del Mundo',
      'fotos selecciones Mundial',
      'galería Mundiales fútbol',
      'fotos Maracanazo',
      'fotos Brasil 1970',
      'fotos España 2010',
      'fotos Mundial 86',
    ],
  });
}

export default async function GaleriaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // ImageGallery schema con todas las fotos curadas.
  const galleryLd = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: 'Galería de fotos · Selecciones a lo largo de los Mundiales',
    url: localeUrl(locale, '/galeria'),
    description:
      'Imágenes históricas de las selecciones nacionales en los Mundiales de fútbol, de 1930 a 2026.',
    numberOfItems: GALLERY.length,
    associatedMedia: GALLERY.map((p) => ({
      '@type': 'ImageObject',
      contentUrl: p.url,
      url: p.sourceUrl,
      caption: p.caption,
      description: p.alt,
      datePublished: `${p.year}-01-01`,
      creditText: p.credit,
      license: p.sourceUrl,
      acquireLicensePage: p.sourceUrl,
    })),
  };

  return (
    <div className="pt-32">
      <JsonLd
        data={[
          galleryLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Galería', path: '/galeria' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Archivo visual · 1930 — 2026
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          Galería de<br />los Mundiales
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          Las imágenes que han contado la historia de las selecciones nacionales
          a lo largo de un siglo de Copa del Mundo. {GALLERY.length} fotos curadas,
          todas con licencia libre, atribuidas a sus autores originales.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
          <span>{GALLERY.length} imágenes</span>
          <span>1930 — 2018</span>
          <span>Wikimedia · Bundesarchiv · Archivos PD</span>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1400px] px-6 pb-24 md:px-10 md:pb-32">
        <PhotoGallery />
      </div>
    </div>
  );
}

import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, Ban } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';
import {
  PROHIBITED_ITEMS,
  getProhibitedByCategory,
  CATEGORY_LABELS_ES,
} from '@/lib/wc-2026-stadium-rules';

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
  return pageMetadata({
    locale,
    path: '/2026/normas-estadios/items-prohibidos',
    title: '22 items prohibidos en los estadios del Mundial 2026',
    description:
      'Lista completa y razonada de los items prohibidos por FIFA en los 16 estadios del Mundial 2026: drones, GoPro, palos selfie, banderas con asta, botellas llenas, megáfonos, paraguas y más. Por qué se prohíben.',
    keywords: [
      'items prohibidos Mundial 2026',
      'qué no puedo llevar al estadio Mundial 2026',
      'lista prohibidos FIFA 2026',
      'drones estadio Mundial 2026',
      'palos selfie estadio Mundial 2026',
      'banderas estadio Mundial 2026',
      'comida estadio Mundial 2026',
    ],
    type: 'article',
  });
}

export default async function ProhibitedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const grouped = getProhibitedByCategory();
  const categories = Object.keys(grouped) as (keyof typeof grouped)[];

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: '22 items prohibidos en los estadios del Mundial 2026',
    url: localeUrl(locale, '/2026/normas-estadios/items-prohibidos'),
    inLanguage: locale,
  };

  return (
    <article className="pt-32 pb-24">
      <JsonLd
        data={[
          articleLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Mundial 2026', path: '/2026' },
            { name: 'Normas estadios', path: '/2026/normas-estadios' },
            { name: 'Items prohibidos', path: '/2026/normas-estadios/items-prohibidos' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/2026/normas-estadios')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-pitch)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Normas estadios
        </Link>

        <div className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Ban className="mr-2 inline h-3 w-3" /> Lista prohibida FIFA
        </div>
        <h1 className="mt-3 font-display text-4xl uppercase leading-[1] md:text-5xl">
          {PROHIBITED_ITEMS.length} items que no entran al estadio
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)]">
          FIFA define una lista común a las 16 sedes USA + Canadá + México. Algunas
          prohibiciones son clásicas (armas, pirotecnia). Otras son del siglo XXI: drones,
          GoPro, palos selfie. Aquí está la lista completa, agrupada por motivo.
        </p>
      </header>

      <section className="mx-auto mt-16 w-full max-w-[1100px] space-y-10 px-6 md:px-10">
        {categories.map((cat) => (
          <div key={cat}>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              {CATEGORY_LABELS_ES[cat]}
            </div>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {grouped[cat].map((item) => (
                <li
                  key={item.name}
                  className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-red-500">
                      <Ban className="h-3.5 w-3.5" />
                    </span>
                    <div>
                      <div className="font-display text-base uppercase leading-tight">
                        {item.name}
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                        {item.reason}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="mx-auto mt-20 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
          <h2 className="font-display text-lg uppercase">Sigue con las normas</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={withLocale(locale as Locale, '/2026/normas-estadios/que-puedes-llevar')} className="rounded-full bg-[var(--color-pitch)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] font-semibold text-black">
              Lo que SÍ se permite
            </Link>
            <Link href={withLocale(locale as Locale, '/2026/normas-estadios/mochila-transparente')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Mochila transparente
            </Link>
            <Link href={withLocale(locale as Locale, '/2026/normas-estadios/sanciones')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Sanciones
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

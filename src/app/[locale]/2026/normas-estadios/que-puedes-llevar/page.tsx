import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';
import { ALLOWED_ITEMS } from '@/lib/wc-2026-stadium-rules';
import { AmazonCard } from '@/components/affiliate/amazon-card';
import { AMAZON_PRODUCTS } from '@/lib/amazon-products';

const PICK = (id: number) => AMAZON_PRODUCTS.find((p) => p.id === id)!;

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
    path: '/2026/normas-estadios/que-puedes-llevar',
    title: 'Qué puedes llevar al estadio del Mundial 2026',
    description:
      'Lista de items permitidos por FIFA en los estadios del Mundial 2026: móvil, cargador, camiseta oficial, banderas sin asta, botella reutilizable vacía, productos de higiene, medicación y más.',
    keywords: [
      'qué llevar al estadio Mundial 2026',
      'items permitidos Mundial 2026',
      'qué entra al estadio Mundial 2026',
      'botella estadio Mundial 2026',
      'camiseta estadio Mundial 2026',
    ],
    type: 'article',
  });
}

export default async function AllowedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Qué puedes llevar al estadio del Mundial 2026',
    url: localeUrl(locale, '/2026/normas-estadios/que-puedes-llevar'),
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
            { name: 'Qué puedes llevar', path: '/2026/normas-estadios/que-puedes-llevar' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[900px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/2026/normas-estadios')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-pitch)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Normas estadios
        </Link>

        <div className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <CheckCircle2 className="mr-2 inline h-3 w-3" /> Items permitidos
        </div>
        <h1 className="mt-3 font-display text-4xl uppercase leading-[1] md:text-5xl">
          Qué SÍ puedes llevar al estadio
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-fg-muted)]">
          La política FIFA del Mundial 2026 prohíbe muchos items, pero permite todo lo
          esencial para el aficionado. Aquí la lista verde.
        </p>
      </header>

      <section className="mx-auto mt-16 w-full max-w-[900px] px-6 md:px-10">
        <ul className="space-y-3">
          {ALLOWED_ITEMS.map((item) => (
            <li
              key={item.name}
              className="flex items-start gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5"
            >
              <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-pitch)]/15 text-[var(--color-pitch)]">
                <CheckCircle2 className="h-4 w-4" />
              </span>
              <div>
                <div className="font-display text-base uppercase leading-tight text-[var(--color-fg)]">
                  {item.name}
                </div>
                {item.notes && (
                  <p className="mt-1 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                    {item.notes}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto mt-12 w-full max-w-[900px] px-6 md:px-10">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
          <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">
            ⚠️ <strong className="text-[var(--color-fg)]">El operativo de seguridad de cada sede
            tiene la última palabra.</strong> FIFA define la lista general, pero la
            jurisdicción local y la operativa de cada estadio pueden aplicar criterios
            adicionales (sobre todo en sedes mexicanas, donde el alcohol está totalmente
            prohibido por ley federal).
          </p>
        </div>
      </section>

      {/* Imprescindibles para entrar al estadio */}
      <section className="mx-auto mt-20 w-full max-w-[1100px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Imprescindibles
        </div>
        <h2 className="mt-3 font-display text-2xl uppercase leading-tight md:text-3xl">
          Lo que sí puedes —y debes— meter en la mochila
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-fg-muted)]">
          Cuatro productos que cumplen las normas FIFA y resuelven los problemas reales
          de pasar 3-5 horas en una sede USA en julio: calor, hidratación, batería del móvil
          y entrar sin que te paren en seguridad.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <AmazonCard product={PICK(65)} variant="default" />
          <AmazonCard product={PICK(68)} variant="default" />
          <AmazonCard product={PICK(69)} variant="default" />
          <AmazonCard product={PICK(67)} variant="default" />
        </div>
        <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
          Enlaces afiliados · Cobramos comisión sin coste extra para ti
        </p>
      </section>

      <section className="mx-auto mt-20 w-full max-w-[900px] px-6 md:px-10">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
          <h2 className="font-display text-lg uppercase">Sigue con las normas</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={withLocale(locale as Locale, '/2026/normas-estadios/items-prohibidos')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              22 items prohibidos
            </Link>
            <Link href={withLocale(locale as Locale, '/2026/normas-estadios/mochila-transparente')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Mochila transparente
            </Link>
            <Link href={withLocale(locale as Locale, '/2026/normas-estadios/banderas-y-mensajes')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Banderas y mensajes
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

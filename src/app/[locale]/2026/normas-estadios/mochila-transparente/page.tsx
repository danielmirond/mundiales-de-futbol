import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, Briefcase, Check, X } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';
import { CLEAR_BAG_POLICY } from '@/lib/wc-2026-stadium-rules';

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
    path: '/2026/normas-estadios/mochila-transparente',
    title: 'Mochila Mundial 2026: clear bag policy unificada para los 16 estadios',
    description:
      'Política de bolsa transparente del Mundial 2026: tamaño máximo 12×6×12 pulgadas (30×15×30 cm), materiales aceptados (plástico, vinilo, PVC), excepción de clutch del tamaño de la mano y qué hacer con tu mochila normal.',
    keywords: [
      'mochila Mundial 2026',
      'clear bag policy Mundial 2026',
      'bolsa transparente Mundial 2026',
      'qué bolsa puedo llevar al estadio Mundial 2026',
      'tamaño mochila estadio FIFA',
      'consigna estadio Mundial 2026',
    ],
    type: 'article',
  });
}

export default async function MochilaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Mochila y bolsa transparente para el Mundial 2026',
    description:
      'Política unificada de bolsa transparente para los 16 estadios del Mundial 2026.',
    url: localeUrl(locale, '/2026/normas-estadios/mochila-transparente'),
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
            { name: 'Mochila', path: '/2026/normas-estadios/mochila-transparente' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[900px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/2026/normas-estadios')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-pitch)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" />
          Normas estadios
        </Link>

        <div className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Briefcase className="mr-2 inline h-3 w-3" />
          Clear bag policy
        </div>
        <h1 className="mt-3 font-display text-4xl uppercase leading-[1] md:text-5xl">
          La mochila unificada del Mundial 2026
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-fg-muted)]">
          FIFA estrena una política de bolsas idéntica para los 16 estadios en Estados
          Unidos, Canadá y México. Primera vez en la historia mundialista que el reglamento
          de equipaje se unifica entre tres países anfitriones.
        </p>
      </header>

      {/* Numero clave grande */}
      <section className="mx-auto mt-16 w-full max-w-[900px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-pitch)]/40 bg-gradient-to-br from-[var(--color-bg-2)] to-[var(--color-bg-3)] p-8 md:p-10 text-center">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            Tamaño máximo permitido
          </div>
          <div className="mt-4 font-display text-6xl font-extrabold tab-num text-[var(--color-pitch)] md:text-7xl">
            {CLEAR_BAG_POLICY.maxSize.width}″ × {CLEAR_BAG_POLICY.maxSize.depth}″ × {CLEAR_BAG_POLICY.maxSize.height}″
          </div>
          <p className="mt-3 font-mono text-sm uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
            ≈ {CLEAR_BAG_POLICY.maxSizeCm.width} × {CLEAR_BAG_POLICY.maxSizeCm.depth} × {CLEAR_BAG_POLICY.maxSizeCm.height} cm
          </p>
        </div>
      </section>

      {/* Detalles en columnas */}
      <section className="mx-auto mt-12 w-full max-w-[900px] px-6 md:px-10">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
            <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              <Check className="h-3 w-3" /> Sí se permite
            </div>
            <h2 className="mt-3 font-display text-xl uppercase">Materiales aceptados</h2>
            <ul className="mt-4 space-y-2 text-sm text-[var(--color-fg-muted)]">
              {CLEAR_BAG_POLICY.materials.map((m) => (
                <li key={m} className="flex items-baseline gap-2">
                  <span className="text-[var(--color-pitch)]">✓</span>
                  <span className="capitalize">{m}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-[var(--color-fg-subtle)]">
              La bolsa debe ser <strong>completamente transparente</strong>: el operativo
              de seguridad inspecciona el contenido visualmente sin abrirla.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
            <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-red-500">
              <X className="h-3 w-3" /> No se permite
            </div>
            <h2 className="mt-3 font-display text-xl uppercase">Bolsas opacas</h2>
            <ul className="mt-4 space-y-2 text-sm text-[var(--color-fg-muted)]">
              <li className="flex items-baseline gap-2"><span className="text-red-500">✗</span><span>Mochilas convencionales (de tela, cuero, sintéticas)</span></li>
              <li className="flex items-baseline gap-2"><span className="text-red-500">✗</span><span>Riñoneras opacas</span></li>
              <li className="flex items-baseline gap-2"><span className="text-red-500">✗</span><span>Maletas, neveras portátiles</span></li>
              <li className="flex items-baseline gap-2"><span className="text-red-500">✗</span><span>Cualquier bolsa con compartimentos no visibles desde fuera</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* Excepción clutch */}
      <section className="mx-auto mt-12 w-full max-w-[900px] px-6 md:px-10">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:p-7">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            Excepción: clutch / monedero pequeño
          </div>
          <h2 className="mt-3 font-display text-xl uppercase">No tiene que ser transparente si es muy pequeño</h2>
          <p className="mt-4 text-sm leading-relaxed text-[var(--color-fg-muted)]">
            Se permite además de la bolsa transparente (o como única bolsa) un clutch o
            monedero «aproximadamente del tamaño de una mano», con un máximo de{' '}
            <strong className="text-[var(--color-fg)]">
              {CLEAR_BAG_POLICY.clutchException.maxSize.width}″ × {CLEAR_BAG_POLICY.clutchException.maxSize.height}″
            </strong>{' '}
            (≈ {CLEAR_BAG_POLICY.clutchException.maxSizeCm.width} ×{' '}
            {CLEAR_BAG_POLICY.clutchException.maxSizeCm.height} cm). Este sí puede ser
            opaco. Pensado para llevar lo esencial sin necesidad de la bolsa
            transparente: tarjeta, móvil, llaves.
          </p>
        </div>
      </section>

      {/* Plan B */}
      <section className="mx-auto mt-12 w-full max-w-[900px] px-6 md:px-10">
        <h2 className="font-display text-2xl uppercase">
          Si has llegado con una mochila normal
        </h2>
        <ol className="mt-6 space-y-4 text-base leading-relaxed text-[var(--color-fg-muted)]">
          <li className="flex gap-4">
            <span className="font-display text-2xl font-extrabold text-[var(--color-pitch)] leading-none">1.</span>
            <span>
              <strong className="text-[var(--color-fg)]">Consigna externa.</strong> Cada
              sede dispone de consignas externas operadas por terceros (precio típico
              10-20 USD). Suelen estar en la primera fila de comercios fuera del estadio.
            </span>
          </li>
          <li className="flex gap-4">
            <span className="font-display text-2xl font-extrabold text-[var(--color-pitch)] leading-none">2.</span>
            <span>
              <strong className="text-[var(--color-fg)]">Vuelta al coche</strong> si llegas
              en transporte propio. El problema: muchas sedes tienen aparcamiento lejos
              del recinto y volver te puede costar 30-60 minutos.
            </span>
          </li>
          <li className="flex gap-4">
            <span className="font-display text-2xl font-extrabold text-[var(--color-pitch)] leading-none">3.</span>
            <span>
              <strong className="text-[var(--color-fg)]">Tirarla.</strong> Algunos
              estadios incluso prevén punto de descarte. No suele ser la opción
              recomendada.
            </span>
          </li>
        </ol>
        <p className="mt-6 text-sm text-[var(--color-fg-subtle)]">
          La recomendación FIFA: <strong>compra una clear bag antes de viajar</strong>.
          Las venden en supermercados Walmart, Target, Walgreens (USA) y Costco (CAN y
          MEX) por 5-15 USD.
        </p>
      </section>

      {/* CTA al resto del cluster */}
      <section className="mx-auto mt-20 w-full max-w-[900px] px-6 md:px-10">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
          <h2 className="font-display text-lg uppercase">Sigue con las normas</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={withLocale(locale as Locale, '/2026/normas-estadios/items-prohibidos')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              22 items prohibidos
            </Link>
            <Link href={withLocale(locale as Locale, '/2026/normas-estadios/que-puedes-llevar')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Lo que sí entra
            </Link>
            <Link href={withLocale(locale as Locale, '/2026/normas-estadios/alcohol-por-pais')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Alcohol por país
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

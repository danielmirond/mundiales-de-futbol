import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, AlertTriangle, ShieldX } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';
import { FAKE_DETECTION } from '@/lib/wc-2026-kits-info';

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
    path: '/coleccionismo/camisetas-mundial-2026/falsificaciones',
    title: 'Cómo detectar camisetas falsas Mundial 2026 · 6 señales clave',
    description:
      'Las 6 señales para detectar camisetas falsificadas del Mundial 2026: precio sospechoso, logo estampado, etiqueta sin holograma FIFA, costuras defectuosas, vendedores opacos y embalaje genérico.',
    keywords: [
      'camiseta falsa Mundial 2026',
      'como detectar camiseta falsa',
      'camiseta replica vs falsa',
      'camiseta china futbol',
      'falsificacion camiseta seleccion',
      'aliexpress camiseta mundial',
    ],
    type: 'article',
  });
}

const SEVERITY_LABEL = {
  critical: 'Crítica',
  medium: 'Media',
  minor: 'Menor',
} as const;

const SEVERITY_STYLES = {
  critical: 'border-red-500/50 text-red-500',
  medium: 'border-[var(--color-sun)]/50 text-[var(--color-sun)]',
  minor: 'border-[var(--color-border-strong)] text-[var(--color-fg-muted)]',
} as const;

export default async function FalsificacionesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Cómo detectar camisetas falsificadas Mundial 2026',
    url: localeUrl(locale, '/coleccionismo/camisetas-mundial-2026/falsificaciones'),
    inLanguage: locale,
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAKE_DETECTION.map((sign) => ({
      '@type': 'Question',
      name: sign.signal,
      acceptedAnswer: {
        '@type': 'Answer',
        text: sign.detail,
      },
    })),
  };

  return (
    <article className="pt-32 pb-24">
      <JsonLd
        data={[
          articleLd,
          faqLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Camisetas Mundial 2026', path: '/coleccionismo/camisetas-mundial-2026' },
            { name: 'Falsificaciones', path: '/coleccionismo/camisetas-mundial-2026/falsificaciones' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/coleccionismo/camisetas-mundial-2026')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-pitch)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Camisetas Mundial 2026
        </Link>

        <div className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-red-500">
          <ShieldX className="mr-2 inline h-3 w-3" /> Alerta de fraude
        </div>
        <h1 className="mt-3 font-display text-4xl uppercase leading-[1] md:text-5xl">
          Cómo detectar una camiseta falsa del Mundial 2026
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)]">
          Las copias chinas del Mundial circulan en AliExpress, Wallapop,
          Vinted, eBay y en sellers no oficiales de Amazon. Algunas son tan
          buenas que cuesta diferenciarlas a simple vista. Estas son las 6
          señales que las delatan, ordenadas de más grave a menos grave.
        </p>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-red-500">
          <AlertTriangle className="h-3 w-3" /> Comprar una falsa = financiar trabajo infantil y propiedad intelectual robada
        </div>
      </header>

      <section className="mx-auto mt-12 w-full max-w-[1100px] space-y-5 px-6 md:px-10">
        {FAKE_DETECTION.map((sign) => (
          <div
            key={sign.id}
            className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:p-7"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-3xl text-[var(--color-pitch)]">{String(sign.id).padStart(2, '0')}</span>
                <h2 className="font-display text-2xl uppercase">{sign.signal}</h2>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border bg-[var(--color-bg)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] ${SEVERITY_STYLES[sign.severity]}`}
              >
                Gravedad: {SEVERITY_LABEL[sign.severity]}
              </span>
            </div>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-fg-muted)]">
              {sign.detail}
            </p>
          </div>
        ))}
      </section>

      <section className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10 grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:p-7">
          <h2 className="font-display text-xl uppercase">Dónde compran falsificadores</h2>
          <ul className="mt-3 space-y-2 text-sm text-[var(--color-fg-muted)]">
            <li className="flex gap-2"><span className="text-red-500">−</span>AliExpress (sellers chinos con &ldquo;1:1 quality&rdquo;)</li>
            <li className="flex gap-2"><span className="text-red-500">−</span>DHgate (mayoristas Yiwu / Putian)</li>
            <li className="flex gap-2"><span className="text-red-500">−</span>Wallapop / Vinted (revendedores sin trazabilidad)</li>
            <li className="flex gap-2"><span className="text-red-500">−</span>eBay sellers sin reseñas y de Asia</li>
            <li className="flex gap-2"><span className="text-red-500">−</span>Top manta y mercadillos turísticos</li>
          </ul>
        </div>

        <div className="rounded-3xl border border-[var(--color-pitch)]/40 bg-[var(--color-bg-2)] p-6 md:p-7">
          <h2 className="font-display text-xl uppercase">Dónde compras oficial</h2>
          <ul className="mt-3 space-y-2 text-sm text-[var(--color-fg-muted)]">
            <li className="flex gap-2"><span className="text-[var(--color-pitch)]">+</span>adidas.es, Nike.com, Puma.com (web oficial marca técnica)</li>
            <li className="flex gap-2"><span className="text-[var(--color-pitch)]">+</span>Amazon España con seller oficial &ldquo;adidas&rdquo; o &ldquo;Nike&rdquo;</li>
            <li className="flex gap-2"><span className="text-[var(--color-pitch)]">+</span>Fútbol Emotion (cadena oficial en España)</li>
            <li className="flex gap-2"><span className="text-[var(--color-pitch)]">+</span>Tienda oficial de la federación (RFEF, FFF, AFA, CBF, etc.)</li>
            <li className="flex gap-2"><span className="text-[var(--color-pitch)]">+</span>FIFA Store (matchworn certificado)</li>
          </ul>
        </div>
      </section>

      <section className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-red-500/40 bg-[var(--color-bg-2)] p-6 md:p-7">
          <h2 className="font-display text-2xl uppercase text-red-500">Qué hacer si te llega una falsa</h2>
          <ol className="mt-4 space-y-3 text-sm text-[var(--color-fg-muted)] list-decimal pl-5">
            <li><strong>No te la pongas.</strong> El estampado puede tener tintes no certificados.</li>
            <li><strong>Documenta:</strong> haz fotos de etiqueta, logo, costuras, embalaje y de la conversación con el vendedor.</li>
            <li><strong>Reclama al marketplace:</strong> Amazon y eBay tienen política de A-to-Z guarantee para devolver el pago al detectar producto falso. Wallapop / Vinted son más difíciles.</li>
            <li><strong>Denuncia a la marca:</strong> adidas, Nike y Puma tienen formularios para reportar falsificaciones (anti-counterfeit@adidas.com, helpme@nike.com, etc.).</li>
            <li><strong>Si compraste con tarjeta:</strong> pide contracargo al banco aportando las pruebas de falsificación.</li>
          </ol>
        </div>
      </section>

      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
          <h2 className="font-display text-lg uppercase">Sigue con el cluster</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={withLocale(locale as Locale, '/coleccionismo/camisetas-mundial-2026/comprar')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Dónde comprar
            </Link>
            <Link href={withLocale(locale as Locale, '/coleccionismo/camisetas-mundial-2026/precio')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Precios
            </Link>
            <Link href={withLocale(locale as Locale, '/coleccionismo/camisetas-mundial-2026/authentic-vs-replica')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Authentic vs Replica
            </Link>
            <Link href={withLocale(locale as Locale, '/coleccionismo/camisetas-mundial-2026/tallas')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Tallas
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

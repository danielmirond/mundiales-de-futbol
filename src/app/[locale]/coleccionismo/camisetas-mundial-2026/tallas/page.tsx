import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, Ruler } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';
import { SIZE_GUIDE_ADULT, SIZE_GUIDE_KIDS } from '@/lib/wc-2026-kits-info';

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
    path: '/coleccionismo/camisetas-mundial-2026/tallas',
    title: 'Guía de tallas camisetas Mundial 2026 · EU UK US MX adulto y niño',
    description:
      'Tabla completa de tallas para camisetas oficiales del Mundial 2026: equivalencias EU/UK/US/MX para adulto (XS a XXL) y niño (4Y a 14Y). Cómo medirse y diferencias authentic vs replica.',
    keywords: [
      'tallas camiseta Mundial 2026',
      'equivalencia talla EU US UK',
      'guia tallas adidas mundial',
      'tabla tallas nike futbol',
      'camiseta talla niño mundial',
      'como medirse camiseta',
    ],
    type: 'article',
  });
}

export default async function TallasPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Guía de tallas camisetas Mundial 2026',
    url: localeUrl(locale, '/coleccionismo/camisetas-mundial-2026/tallas'),
    inLanguage: locale,
  };

  return (
    <article className="pt-32 pb-24">
      <JsonLd
        data={[
          articleLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Camisetas Mundial 2026', path: '/coleccionismo/camisetas-mundial-2026' },
            { name: 'Tallas', path: '/coleccionismo/camisetas-mundial-2026/tallas' },
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

        <div className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Ruler className="mr-2 inline h-3 w-3" /> Tablas oficiales
        </div>
        <h1 className="mt-3 font-display text-4xl uppercase leading-[1] md:text-5xl">
          Guía de tallas: camisetas Mundial 2026
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)]">
          La talla &ldquo;M&rdquo; en España no es la misma que la &ldquo;M&rdquo;
          en Estados Unidos o México. Y dentro de la misma marca, la
          camiseta authentic talla 1 más pequeña que la replica. Aquí tienes
          las equivalencias para no fallar al comprar online.
        </p>
      </header>

      <section className="mx-auto mt-12 w-full max-w-[1100px] px-6 md:px-10">
        <h2 className="font-display text-2xl uppercase">Talla adulto</h2>
        <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
          Medida del pecho en cm e in. Mide bajo las axilas, pasando por el
          punto más ancho del torso. Si estás entre dos tallas, sube una.
        </p>

        <div className="mt-5 overflow-x-auto rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)]">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-5 py-4 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-pitch)]">EU</th>
                <th className="px-5 py-4 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">UK</th>
                <th className="px-5 py-4 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">US</th>
                <th className="px-5 py-4 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">MX</th>
                <th className="px-5 py-4 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Pecho (cm)</th>
                <th className="px-5 py-4 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Pecho (in)</th>
              </tr>
            </thead>
            <tbody>
              {SIZE_GUIDE_ADULT.map((row, i) => (
                <tr
                  key={row.eu}
                  className={i % 2 === 0 ? 'bg-[var(--color-bg)]/40' : ''}
                >
                  <td className="px-5 py-3 font-mono text-sm font-semibold text-[var(--color-pitch)]">{row.eu}</td>
                  <td className="px-5 py-3 text-[var(--color-fg-muted)]">{row.uk}</td>
                  <td className="px-5 py-3 text-[var(--color-fg-muted)]">{row.us}</td>
                  <td className="px-5 py-3 text-[var(--color-fg-muted)]">{row.mx}</td>
                  <td className="px-5 py-3 text-[var(--color-fg)]">{row.chestCm}</td>
                  <td className="px-5 py-3 text-[var(--color-fg)]">{row.chestIn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10">
        <h2 className="font-display text-2xl uppercase">Talla niño</h2>
        <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
          Tallas por edad. Si el niño está creciendo rápido, sube una
          talla; los modelos &ldquo;youth&rdquo; encogen entre 1 y 2 cm tras
          los primeros lavados.
        </p>

        <div className="mt-5 overflow-x-auto rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)]">
          <table className="w-full min-w-[500px] text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-5 py-4 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-pitch)]">Edad</th>
                <th className="px-5 py-4 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Altura</th>
                <th className="px-5 py-4 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Pecho</th>
              </tr>
            </thead>
            <tbody>
              {SIZE_GUIDE_KIDS.map((row, i) => (
                <tr
                  key={row.age}
                  className={i % 2 === 0 ? 'bg-[var(--color-bg)]/40' : ''}
                >
                  <td className="px-5 py-3 font-mono text-sm font-semibold text-[var(--color-pitch)]">{row.age}</td>
                  <td className="px-5 py-3 text-[var(--color-fg-muted)]">{row.height}</td>
                  <td className="px-5 py-3 text-[var(--color-fg)]">{row.cmRange}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10 grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:p-7">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            Cómo medirse
          </div>
          <ol className="mt-3 space-y-2 text-sm text-[var(--color-fg-muted)] list-decimal pl-5">
            <li>De pie, relajado, sin camiseta o con una camiseta fina.</li>
            <li>Cinta métrica horizontal pasando por las axilas y el punto más ancho del pecho.</li>
            <li>No aprietes la cinta: debe quedar firme pero no marcar la piel.</li>
            <li>Repite la medición 2 veces para asegurar.</li>
            <li>Si estás entre dos tallas en cm, sube una si quieres holgura, baja si quieres ceñido.</li>
          </ol>
        </div>

        <div className="rounded-3xl border border-[var(--color-pitch)]/40 bg-[var(--color-bg-2)] p-6 md:p-7">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            Authentic vs Replica
          </div>
          <p className="mt-3 text-sm text-[var(--color-fg-muted)]">
            La camiseta <strong>authentic</strong> (player version) tiene fit
            slim: si en replica usas talla M, en authentic considera M o
            incluso S si eres delgado. La <strong>replica</strong> (fan) es
            la talla estándar de calle. Para detalles técnicos, ver <Link href={withLocale(locale as Locale, '/coleccionismo/camisetas-mundial-2026/authentic-vs-replica')} className="underline">authentic vs replica</Link>.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:p-7">
          <h2 className="font-display text-2xl uppercase">Devoluciones por talla</h2>
          <p className="mt-3 text-base leading-relaxed text-[var(--color-fg-muted)]">
            Tanto adidas.es como Nike.com aceptan devolución gratuita en
            30 días si la camiseta no se ha personalizado con dorsal. Si la
            has personalizado (dorsal y nombre), la devolución por talla
            equivocada no aplica: solo si la marca cometió un error de
            envío. Amazon España acepta devolución 30 días incluso si has
            quitado la etiqueta, siempre que esté sin uso.
          </p>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-fg-muted)]">
            Fútbol Emotion permite probarse la camiseta en tienda física
            antes de comprar: especialmente útil si vas a invertir 150 €
            en una authentic.
          </p>
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
            <Link href={withLocale(locale as Locale, '/coleccionismo/camisetas-mundial-2026/falsificaciones')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Detectar copias
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

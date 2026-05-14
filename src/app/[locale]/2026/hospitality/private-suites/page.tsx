import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, Crown, ArrowRight } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';
import { HOSPITALITY_PRODUCTS, fifaProductUrl } from '@/lib/wc-2026-hospitality';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/2026/hospitality/private-suites',
    title: 'Private Suites Mundial 2026 · Desde 43.200 USD por partido',
    description:
      'Suites privadas oficiales del Mundial 2026: capacidad 8-20 personas, cocina y bar privados, catering chef-driven, aparcamiento VIP. Desde 43.200 USD por partido. Disponibles para grupos corporate o familias premium.',
    keywords: [
      'private suite mundial 2026',
      'suite privada fifa',
      'suite vip mundial',
      'pp suite mundial 2026',
      'corporate hospitality mundial',
      'palco mundial 2026',
    ],
    type: 'article',
  });
}

const PS = HOSPITALITY_PRODUCTS.find((p) => p.id === 'PS')!;
const PPS = HOSPITALITY_PRODUCTS.find((p) => p.id === 'PPS')!;

export default async function PrivateSuitesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <article className="pt-32 pb-24">
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Private Suites Mundial 2026',
            url: localeUrl(locale, '/2026/hospitality/private-suites'),
            inLanguage: locale,
          },
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Mundial 2026', path: '/2026' },
            { name: 'Hospitality', path: '/2026/hospitality' },
            { name: 'Private Suites', path: '/2026/hospitality/private-suites' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/2026/hospitality')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-pitch)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Hospitality Mundial 2026
        </Link>

        <div className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Crown className="mr-2 inline h-3 w-3" /> Producto premium FIFA
        </div>
        <h1 className="mt-3 font-display text-4xl uppercase leading-[1] md:text-5xl">
          Private Suites &amp; PP-Suites
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)]">
          El escalón top del hospitality oficial. Suites privadas en el
          estadio para grupos corporate o familias premium: cocina propia,
          bar privado, baño dentro de la suite y vista panorámica al campo.
          Hay dos niveles: Private Suites y PP-Suites (Pitch Premium).
        </p>
      </header>

      <section className="mx-auto mt-12 w-full max-w-[1100px] grid gap-5 px-6 md:px-10 md:grid-cols-2">
        {[PS, PPS].map((p) => (
          <div
            key={p.id}
            className="rounded-3xl border border-[var(--color-pitch)]/40 bg-[var(--color-bg-2)] p-6 md:p-7"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">{p.id}</div>
            <h2 className="mt-1 font-display text-2xl uppercase">{p.name}</h2>
            {p.priceFromUsd && (
              <div className="mt-2 font-mono text-base text-[var(--color-pitch)]">
                desde {p.priceFromUsd.toLocaleString('es-ES')} USD
                {p.priceCeilingUsd && (
                  <span className="block text-xs text-[var(--color-fg-subtle)]">
                    hasta {p.priceCeilingUsd.toLocaleString('es-ES')} USD (toda la serie)
                  </span>
                )}
              </div>
            )}
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-fg-muted)]">{p.description}</p>

            <div className="mt-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">Detalles</div>
              <ul className="mt-2 space-y-1.5 text-sm text-[var(--color-fg-muted)]">
                {p.details.map((d) => (
                  <li key={d} className="flex gap-2">
                    <span className="text-[var(--color-pitch)]">·</span>{d}
                  </li>
                ))}
              </ul>
            </div>

            <a
              href={fifaProductUrl(p)}
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-[1.02]"
            >
              Ver disponibilidad
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </a>
          </div>
        ))}
      </section>

      <section className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:p-7">
          <h2 className="font-display text-2xl uppercase">Para quién es una suite privada</h2>
          <ul className="mt-3 space-y-2 text-base leading-relaxed text-[var(--color-fg-muted)]">
            <li className="flex gap-2"><span className="text-[var(--color-pitch)]">→</span><strong>Empresas que invitan a clientes</strong> a un partido como cierre de deal o regalo corporativo</li>
            <li className="flex gap-2"><span className="text-[var(--color-pitch)]">→</span><strong>Familias premium</strong> de 8-12 personas que quieren ver el partido con privacidad y catering personalizado</li>
            <li className="flex gap-2"><span className="text-[var(--color-pitch)]">→</span><strong>Patrocinadores oficiales</strong> y partners FIFA que reciben PP-Suites como parte de su acuerdo de patrocinio</li>
            <li className="flex gap-2"><span className="text-[var(--color-pitch)]">→</span><strong>High net worth individuals</strong> coleccionistas de experiencias deportivas</li>
          </ul>
        </div>
      </section>

      <section className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:p-7">
          <h2 className="font-display text-xl uppercase">Coste real con grupo</h2>
          <p className="mt-3 text-base leading-relaxed text-[var(--color-fg-muted)]">
            Una Private Suite a 43.200 USD para 12 personas son <strong>3.600 USD/persona</strong>
            — apenas un 44 % por encima del Single Match standard de 2.500 USD, con privacidad,
            cocina propia y vista panorámica. Si llenas la suite, el coste por persona se
            acerca al Single Match individual pero con experiencia corporate.
          </p>
          <p className="mt-3 text-base leading-relaxed text-[var(--color-fg-muted)]">
            Para Venue Series completa (8 partidos) la suite arranca en <strong>250.000 USD</strong>
            (≈20.800 USD/partido) y llega a <strong>500.000 USD</strong> en estadios con final
            (MetLife) o partido inaugural (Azteca).
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
          <h2 className="font-display text-lg uppercase">Sigue con el cluster</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={withLocale(locale as Locale, '/2026/hospitality/productos')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Productos
            </Link>
            <Link href={withLocale(locale as Locale, '/2026/hospitality/precios')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Precios
            </Link>
            <Link href={withLocale(locale as Locale, '/2026/hospitality/sedes')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Por sede
            </Link>
            <Link href={withLocale(locale as Locale, '/2026/hospitality/faq')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              FAQ
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

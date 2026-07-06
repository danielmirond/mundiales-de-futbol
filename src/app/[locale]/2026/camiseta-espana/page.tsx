import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight, Shirt, Ruler, ShieldAlert, ShoppingBag } from 'lucide-react';
import { TEAMS_2026 } from '@/lib/wc-2026';
import { getTeamKit, amazonSearchUrl } from '@/lib/team-kit-2026';
import { KIT_TIERS, SIZE_GUIDE_ADULT, FAKE_DETECTION } from '@/lib/wc-2026-kits-info';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';

export const dynamic = 'force-static';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

const BUY_URL = amazonSearchUrl('España', 'Adidas'); // Amazon España, tag afiliado

// Solo las versiones a la venta al aficionado (la match-worn es mercado secundario).
const SHOP_TIERS = KIT_TIERS.filter((t) => t.id !== 'match-worn');

const FAQ: { q: string; a: string }[] = [
  {
    q: '¿Qué marca hace la camiseta de España en el Mundial 2026?',
    a: 'Adidas. La marca alemana viste a la selección española de fútbol de forma ininterrumpida desde 1992 y es su proveedor técnico también para el Mundial 2026.',
  },
  {
    q: '¿Cuánto cuesta la camiseta de España 2026?',
    a: 'La réplica de aficionado (versión Fan) se mueve entre 70 y 100 €, la versión auténtica de jugador (Player Version) entre 130 y 180 €, y la talla infantil entre 50 y 80 €. Cualquier camiseta por debajo de 35 € es casi con seguridad una falsificación.',
  },
  {
    q: '¿Dónde comprar la camiseta de España del Mundial 2026?',
    a: 'En Amazon España, con envío en 24-48 h, verificando que el vendedor sea Amazon o Adidas para evitar réplicas no oficiales.',
  },
  {
    q: '¿Qué versión comprar, réplica o auténtica?',
    a: 'La réplica (AEROREADY) es más holgada y cómoda para el día a día y el estadio. La auténtica (HEAT.RDY) es más fina, entallada y la que visten los jugadores; talla más pequeña, conviene valorar subir una talla.',
  },
];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/2026/camiseta-espana',
    title: 'Camiseta de España del Mundial 2026: dónde comprarla, versiones y tallas',
    description:
      'Todo sobre la camiseta de España para el Mundial 2026: marca (Adidas), versiones (réplica y auténtica), precios, guía de tallas y cómo evitar falsificaciones. Dónde comprarla en España.',
    keywords: [
      'camiseta españa mundial 2026',
      'camiseta de españa 2026',
      'equipación españa mundial 2026',
      'camiseta selección española 2026',
      'comprar camiseta españa mundial 2026',
      'camiseta españa adidas 2026',
      'primera equipación españa 2026',
    ],
    type: 'article',
  });
}

function Buy({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <a
      href={BUY_URL}
      target="_blank"
      rel="sponsored nofollow noopener"
      className={`inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-bold text-black transition-transform hover:scale-[1.03] ${className}`}
    >
      <ShoppingBag className="h-4 w-4" /> {children}
    </a>
  );
}

export default async function CamisetaEspanaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const L = locale as Locale;
  const kit = getTeamKit('ESP');
  const esp = TEAMS_2026.ESP;
  const pageUrl = localeUrl(locale, '/2026/camiseta-espana');

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 pt-28">
      <JsonLd
        data={[
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Mundial 2026', path: '/2026' },
            { name: 'Camiseta de España', path: '/2026/camiseta-espana' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            inLanguage: locale,
            url: pageUrl,
            mainEntity: FAQ.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          },
        ]}
      />

      <nav className="mb-6 text-sm text-[var(--color-fg-muted)]">
        <Link href={withLocale(L, '/2026')} className="inline-flex items-center gap-1 hover:text-[var(--color-fg)]">
          <ArrowLeft className="h-4 w-4" /> Mundial 2026
        </Link>
      </nav>

      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
          <Shirt className="mr-1 inline h-3 w-3" /> Equipación · Adidas
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          {esp?.flag} Camiseta de España para el Mundial 2026
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-[var(--color-fg-muted)]">
          La primera equipación de España para el Mundial 2026 la fabrica <strong className="text-[var(--color-fg)]">Adidas</strong>,
          su proveedor técnico ininterrumpido desde 1992, sobre el clásico rojo de <em>La Roja</em>. Aquí tienes
          las versiones a la venta, precios orientativos, la guía de tallas y cómo asegurarte de que compras una
          camiseta oficial y no una falsificación.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Buy>Ver la camiseta de España en Amazon</Buy>
          {kit?.verified === 'confirmed' && (
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-pitch)]">
              Proveedor confirmado
            </span>
          )}
        </div>
        <p className="mt-3 text-xs text-[var(--color-fg-subtle)]">
          El diseño definitivo se confirma en el lanzamiento oficial de Adidas; actualizamos esta página cuando se presente.
        </p>
      </header>

      {/* Versiones */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold tracking-tight">Qué versión comprar</h2>
        <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
          Adidas fabrica la camiseta de España en tres versiones a la venta. La diferencia está en el tejido, el
          corte y el precio.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {SHOP_TIERS.map((t) => (
            <article key={t.id} className="flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <h3 className="text-lg font-semibold">{t.name}</h3>
              <p className="mt-1 font-display tab-num text-2xl text-[var(--color-pitch)]">
                {t.priceRangeEur[0]}-{t.priceRangeEur[1]} €
              </p>
              <p className="mt-2 text-xs text-[var(--color-fg-muted)]">{t.audience}</p>
              {t.techByBrand.adidas && (
                <p className="mt-3 text-sm">
                  <span className="text-[var(--color-fg-subtle)]">Tejido Adidas:</span>{' '}
                  <strong className="text-[var(--color-fg)]">{t.techByBrand.adidas}</strong>
                </p>
              )}
              <p className="mt-2 text-sm text-[var(--color-fg-muted)]">{t.fitNotes}</p>
            </article>
          ))}
        </div>
        <div className="mt-5">
          <Buy>Comprar la camiseta de España</Buy>
        </div>
      </section>

      {/* Tallas */}
      <section className="mt-12">
        <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <Ruler className="h-5 w-5 text-[var(--color-pitch)]" /> Guía de tallas (adulto)
        </h2>
        <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
          La versión auténtica (Player Version) talla más justa que la réplica: si dudas y no eres delgado,
          valora subir una talla.
        </p>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-[var(--color-border)]">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[var(--color-surface)] text-left font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
                <th className="px-3 py-3">Talla (EU)</th>
                <th className="px-3 py-3">UK</th>
                <th className="px-3 py-3">US</th>
                <th className="px-3 py-3">Pecho (cm)</th>
              </tr>
            </thead>
            <tbody>
              {SIZE_GUIDE_ADULT.map((s) => (
                <tr key={s.eu} className="border-t border-[var(--color-border)]">
                  <td className="px-3 py-2.5 font-semibold text-[var(--color-fg)]">{s.eu}</td>
                  <td className="px-3 py-2.5 text-[var(--color-fg-muted)]">{s.uk}</td>
                  <td className="px-3 py-2.5 text-[var(--color-fg-muted)]">{s.us}</td>
                  <td className="px-3 py-2.5 tab-num text-[var(--color-fg-muted)]">{s.chestCm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Falsificaciones */}
      <section className="mt-12">
        <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <ShieldAlert className="h-5 w-5 text-[var(--color-flame)]" /> Cómo evitar una camiseta falsa
        </h2>
        <ul className="mt-4 space-y-3">
          {FAKE_DETECTION.filter((f) => f.severity !== 'minor').map((f) => (
            <li key={f.id} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              <p className="font-semibold text-[var(--color-fg)]">{f.signal}</p>
              <p className="mt-1 text-sm text-[var(--color-fg-muted)]">{f.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold tracking-tight">Preguntas frecuentes</h2>
        <dl className="mt-4 space-y-4">
          {FAQ.map((f) => (
            <div key={f.q} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <dt className="font-semibold text-[var(--color-fg)]">{f.q}</dt>
              <dd className="mt-2 text-sm text-[var(--color-fg-muted)]">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Enlaces internos */}
      <div className="mt-12 flex flex-wrap gap-3">
        <Link
          href={withLocale(L, '/selecciones/ESP/camisetas')}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-sm font-semibold transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
        >
          <Shirt className="h-4 w-4" /> Evolución de la camiseta (1930-2026)
        </Link>
        <Link
          href={withLocale(L, '/selecciones/ESP')}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-sm font-semibold transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
        >
          Selección de España
        </Link>
        <Link
          href={withLocale(L, '/coleccionismo/camisetas-mundial-2026')}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-sm font-semibold transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
        >
          Todas las camisetas del Mundial 2026 <ArrowRight className="h-3 w-3 rtl:rotate-180" />
        </Link>
      </div>
    </main>
  );
}

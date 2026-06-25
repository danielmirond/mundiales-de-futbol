import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, Wine, XCircle, CheckCircle2 } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';
import { ALCOHOL_BY_COUNTRY } from '@/lib/wc-2026-stadium-rules';

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
    path: '/2026/normas-estadios/alcohol-por-pais',
    title: 'Alcohol en los estadios del Mundial 2026 · USA, Canadá y México',
    description:
      'Diferencias por país anfitrión en venta de alcohol: USA y Canadá permiten cerveza, vino y cócteles en zonas autorizadas. México prohíbe alcohol en sus 3 estadios por ley federal. Edades mínimas e identificación.',
    keywords: [
      'alcohol estadio Mundial 2026',
      'cerveza estadio Mundial 2026',
      'alcohol Azteca Mundial 2026',
      'alcohol BBVA Monterrey',
      'alcohol BMO Field Toronto',
      'edad mínima alcohol estadios FIFA',
    ],
    type: 'article',
  });
}

export default async function AlcoholPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Alcohol en los estadios del Mundial 2026 por país anfitrión',
    url: localeUrl(locale, '/2026/normas-estadios/alcohol-por-pais'),
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
            { name: 'Alcohol por país', path: '/2026/normas-estadios/alcohol-por-pais' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1000px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/2026/normas-estadios')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-pitch)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Normas estadios
        </Link>

        <div className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Wine className="mr-2 inline h-3 w-3" /> Reglas por país
        </div>
        <h1 className="mt-3 font-display text-4xl uppercase leading-[1] md:text-5xl">
          Alcohol por país en el Mundial 2026
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-fg-muted)]">
          La política FIFA del Mundial 2026 unifica casi todo entre los tres anfitriones,
          excepto el alcohol. Cada país aplica su propia legislación, y la diferencia más
          notable está en México: <strong>cero alcohol</strong> en los 3 estadios
          mexicanos.
        </p>
      </header>

      <section className="mx-auto mt-12 w-full max-w-[1000px] space-y-4 px-6 md:px-10">
        {ALCOHOL_BY_COUNTRY.map((c) => {
          const banned = c.alcohol === 'banned-total';
          return (
            <div
              key={c.countryCode}
              className={`rounded-3xl border p-6 md:p-8 ${
                banned
                  ? 'border-red-500/40 bg-red-500/5'
                  : 'border-[var(--color-pitch)]/30 bg-[var(--color-bg-2)]'
              }`}
            >
              <div className="flex flex-wrap items-baseline gap-3">
                <span aria-hidden className="text-4xl">{c.flag}</span>
                <h2 className="font-display text-2xl uppercase">{c.countryName}</h2>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] ${
                    banned ? 'bg-red-500/15 text-red-500' : 'bg-[var(--color-pitch)]/15 text-[var(--color-pitch)]'
                  }`}
                >
                  {banned ? <XCircle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                  {banned ? 'Alcohol prohibido' : 'Permitido en zonas autorizadas'}
                </span>
              </div>
              <p className="mt-4 text-base leading-relaxed text-[var(--color-fg-muted)]">
                {c.details}
              </p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
                Base legal: {c.legalSource}
              </p>
            </div>
          );
        })}
      </section>

      {/* Implicaciones prácticas */}
      <section className="mx-auto mt-16 w-full max-w-[1000px] px-6 md:px-10">
        <h2 className="font-display text-2xl uppercase">Implicaciones prácticas</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              Para el aficionado europeo
            </div>
            <h3 className="mt-2 font-display text-lg uppercase">Costumbre vs reglamento local</h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">
              Si vienes acostumbrado a la cerveza pre/post partido, en USA y Canadá vas a
              estar cómodo (concesiones oficiales en cada sector, opción cócteles en zonas
              VIP). En México vas a tener que adaptar el ritual: ni en el bar dentro del
              estadio podrás pedir alcohol.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              Para el ID
            </div>
            <h3 className="mt-2 font-display text-lg uppercase">Lleva pasaporte o licencia</h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">
              En USA y Canadá la verificación de edad es estricta. El bartender pedirá ID
              incluso a personas claramente mayores. Pasaporte siempre vale; tarjeta de
              embarque o DNI español no se aceptan como ID válido en USA.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-[1000px] px-6 md:px-10">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
          <h2 className="font-display text-lg uppercase">Sigue con las normas</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={withLocale(locale as Locale, '/2026/normas-estadios/que-puedes-llevar')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Items permitidos
            </Link>
            <Link href={withLocale(locale as Locale, '/2026/normas-estadios/banderas-y-mensajes')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Banderas y mensajes
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

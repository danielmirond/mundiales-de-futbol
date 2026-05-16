import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight, ShoppingBag, ShieldCheck, MapPin, Globe } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/coleccionismo/monedas-mundial-2026/donde-comprar',
    title: 'Dónde comprar las monedas del Mundial 2026 · Banxico, Casa de Moneda, MIDE, Royal Canadian Mint',
    description:
      'Los canales oficiales para conseguir las 13 monedas conmemorativas del Mundial 2026. Bancos comerciales mexicanos para las bimetálicas, Casa de Moneda de México y MIDE para plata y oro, Royal Canadian Mint para el loonie canadiense.',
    keywords: [
      'donde comprar monedas mundial 2026',
      'comprar monedas banxico mundial',
      'casa de moneda mexico mundial 2026',
      'donde comprar monedas conmemorativas mundial',
      'tienda oficial casa de moneda mundial 2026',
      'royal canadian mint loonie world cup',
      'distribuidores autorizados banxico',
      'mide museo interactivo economia',
    ],
    type: 'article',
  });
}

const CANALES = [
  {
    icon: ShoppingBag,
    title: 'Bancos comerciales mexicanos',
    coverage: 'Bimetálicas $20 MXN',
    detail:
      'Las 4 monedas bimetálicas de $20 MXN entran en circulación general a través del sistema bancario mexicano (BBVA, Banamex, Santander, HSBC, Banorte, Scotiabank, Inbursa). Estarán disponibles a partir del tercer día hábil bancario después de su puesta en circulación (es decir, a partir del 18-19 de mayo de 2026).',
    pros: ['Sin sobrecoste sobre el valor facial', 'Acceso amplio en cualquier sucursal', 'Para empezar la colección sin compromiso'],
    cons: ['Stock dependiente de la sucursal', 'No garantizado tener las 4 en una sola visita', 'Sin certificado de autenticidad numismática'],
    url: 'https://www.banxico.org.mx/',
    urlLabel: 'banxico.org.mx',
  },
  {
    icon: ShieldCheck,
    title: 'Casa de Moneda de México',
    coverage: 'Bimetálicas $20 + plata $10 + oro $25',
    detail:
      'La Casa de Moneda de México (cmm.gob.mx) es el organismo oficial que acuña las monedas. Tiene tienda online y tienda física en CDMX. Es el canal preferente para las versiones de plata y oro, que vienen con estuche oficial y certificado de autenticidad. Ventas al público a partir de la segunda quincena de mayo (15-31 mayo 2026).',
    pros: ['Garantía oficial de autenticidad', 'Estuche y certificado incluidos', 'Acceso a sets coleccionistas (3-piezas o 12-piezas)'],
    cons: ['Stock limitado especialmente en oro', 'Posibles colas online en lanzamiento', 'Envío internacional con coste'],
    url: 'https://www.cmm.gob.mx/',
    urlLabel: 'cmm.gob.mx',
  },
  {
    icon: MapPin,
    title: 'Museo Interactivo de Economía (MIDE)',
    coverage: 'Plata $10 + oro $25',
    detail:
      'El MIDE en el Centro Histórico de Ciudad de México (Tacuba 17) ofrece una experiencia presencial de compra. Tiene asignada una cuota limitada de las monedas de plata y oro y suele recibirlas antes que distribuidores generales. Recomendable para coleccionistas que visiten CDMX.',
    pros: ['Experiencia presencial', 'Asesoría numismática del museo', 'Combina visita cultural + compra'],
    cons: ['Solo en CDMX', 'Sin venta online', 'Stock limitado'],
    url: 'https://www.mide.org.mx/',
    urlLabel: 'mide.org.mx',
  },
  {
    icon: Globe,
    title: 'Distribuidores autorizados Banxico',
    coverage: 'Plata $10 + oro $25',
    detail:
      'Banxico publica en su web la lista actualizada de distribuidores autorizados (numismáticas físicas y online certificadas) que pueden vender las monedas de plata y oro al público. Esta lista incluye casas especializadas como Casa Numismática Diocesana, Coleccionismo Numismático Mexicano y plataformas online certificadas. Los precios pueden tener premium sobre el precio Casa de Moneda.',
    pros: ['Acceso desde fuera de CDMX', 'Sets pre-armados disponibles', 'Garantía limitada pero menos riesgo que reventa'],
    cons: ['Sobrecoste habitual 5-15% sobre Casa de Moneda', 'No todos los distribuidores tienen las 4 monedas', 'Algunos sin envío internacional'],
    url: 'https://www.banxico.org.mx/billetes-y-monedas/distribuidores-autorizados.html',
    urlLabel: 'Lista oficial Banxico',
  },
  {
    icon: ShoppingBag,
    title: 'Royal Canadian Mint',
    coverage: 'Loonie $1 CAD (Canadá)',
    detail:
      'La Royal Canadian Mint (mint.ca) vende online el loonie conmemorativo $1 CAD del Mundial 2026 en versión tradicional sin color (1 millón de piezas) y versión coloreada (2 millones). Envío a Estados Unidos, México y Europa. Sets de coleccionista con estuche disponibles. Bancos canadienses también la distribuyen en circulación general.',
    pros: ['Compra internacional facilitada', 'Versiones coloreadas exclusivas online', 'Combo con plata canadiense disponible'],
    cons: ['Envío internacional costoso (>20 CAD a Europa)', 'No emite versiones de oro para Mundial', 'Stock limitado de versión coloreada'],
    url: 'https://www.mint.ca/',
    urlLabel: 'mint.ca',
  },
];

const ALERT_ITEMS = [
  {
    title: 'Mercados secundarios (eBay, Mercado Libre)',
    detail:
      'En reventa online los precios pueden multiplicarse 2-5x sobre el precio oficial Casa de Moneda. Riesgo elevado de falsificaciones especialmente en oro y plata. Solo recomendable si el vendedor tiene historial verificable, certificado físico del distribuidor original, y aceptas pagar premium importante.',
  },
  {
    title: 'Subastas internacionales (Sotheby\'s, Heritage, Künker)',
    detail:
      'Las versiones de oro pueden aparecer en subastas internacionales en 6-12 meses post-emisión. Los precios alcanzados son referencia de mercado pero no del precio oficial. La autenticidad está garantizada por la casa.',
  },
  {
    title: 'Cuidado con imitaciones chinas',
    detail:
      'En AliExpress y Wish circulan ya réplicas que copian el diseño de Banxico pero sin metal precioso (zinc bañado en plata o latón). Las monedas oficiales pesan exactamente 1/2 onza para oro (15,5 g) y 1 onza para plata (31,1 g). Si el vendedor no aporta peso ni certificado, es copia.',
  },
];

export default async function DondeComprarPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <article className="pt-32 pb-24">
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Dónde comprar las monedas del Mundial 2026',
            url: localeUrl(locale, '/coleccionismo/monedas-mundial-2026/donde-comprar'),
            inLanguage: locale,
          },
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Monedas Mundial 2026', path: '/coleccionismo/monedas-mundial-2026' },
            { name: 'Dónde comprar', path: '/coleccionismo/monedas-mundial-2026/donde-comprar' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/coleccionismo/monedas-mundial-2026')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-pitch)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Monedas Mundial 2026
        </Link>

        <div className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <ShoppingBag className="mr-2 inline h-3 w-3" /> 5 canales oficiales
        </div>
        <h1 className="mt-3 font-display text-4xl uppercase leading-[1] md:text-5xl">
          Dónde comprar las monedas del Mundial 2026
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)]">
          Las 13 monedas oficiales del Mundial 2026 (12 de México + 1 de Canadá) se distribuyen
          por cinco canales principales. Las bimetálicas de uso corriente entran en el sistema
          bancario. Las de plata y oro se venden a través de Casa de Moneda y distribuidores
          autorizados.
        </p>
      </header>

      <section className="mx-auto mt-12 w-full max-w-[1100px] space-y-5 px-6 md:px-10">
        {CANALES.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.title}
              className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:p-7"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <Icon className="h-5 w-5 text-[var(--color-pitch)]" />
                  <h2 className="mt-2 font-display text-2xl uppercase">{c.title}</h2>
                </div>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                  {c.coverage}
                </span>
              </div>
              <p className="mt-4 text-base leading-relaxed text-[var(--color-fg-muted)]">
                {c.detail}
              </p>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
                    ✓ Pros
                  </div>
                  <ul className="mt-2 space-y-1.5 text-sm text-[var(--color-fg-muted)]">
                    {c.pros.map((p) => (
                      <li key={p} className="flex gap-2">
                        <span className="text-[var(--color-pitch)]">+</span>{p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-red-500">
                    ✗ Contras
                  </div>
                  <ul className="mt-2 space-y-1.5 text-sm text-[var(--color-fg-muted)]">
                    {c.cons.map((co) => (
                      <li key={co} className="flex gap-2">
                        <span className="text-red-500">−</span>{co}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <a
                href={c.url}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-[1.02]"
              >
                Ir a {c.urlLabel}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </a>
            </div>
          );
        })}
      </section>

      {/* Alertas y reventa */}
      <section className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-red-500/40 bg-[var(--color-bg-2)] p-6 md:p-7">
          <h2 className="font-display text-2xl uppercase text-red-500">
            Atención: canales NO oficiales
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[var(--color-fg-muted)]">
            Comprar en mercados de reventa multiplica el riesgo de falsificación
            y el precio. Solo recurre a estos canales si has agotado los oficiales:
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {ALERT_ITEMS.map((a) => (
              <div key={a.title} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
                <h3 className="font-display text-base uppercase">{a.title}</h3>
                <p className="mt-2 text-sm text-[var(--color-fg-muted)]">{a.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTAs */}
      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
          <h2 className="font-display text-lg uppercase">Sigue con el cluster</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={withLocale(locale as Locale, '/coleccionismo/monedas-mundial-2026/precio')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Precios
            </Link>
            <Link href={withLocale(locale as Locale, '/coleccionismo/monedas-mundial-2026/oro')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Oro
            </Link>
            <Link href={withLocale(locale as Locale, '/coleccionismo/monedas-mundial-2026/plata')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Plata
            </Link>
            <Link href={withLocale(locale as Locale, '/coleccionismo/monedas-mundial-2026/banxico')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Banxico
            </Link>
            <Link href={withLocale(locale as Locale, '/coleccionismo/monedas-mundial-2026/canada')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Canadá
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

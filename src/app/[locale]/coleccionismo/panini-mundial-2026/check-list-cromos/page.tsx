import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ListChecks, Download } from 'lucide-react';
import { TEAMS_2026, GROUPS_2026 } from '@/lib/wc-2026';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl, SEO } from '@/lib/seo';
import { AmazonProductGrid } from '@/components/affiliate/amazon-card';
import { AMAZON_PRODUCTS } from '@/lib/amazon-products';

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
    path: '/coleccionismo/panini-mundial-2026/check-list-cromos',
    title: 'Check list cromos Panini Mundial 2026: lista completa por selección y especiales',
    description:
      'Check list completa del álbum Panini Mundial 2026: 980 cromos numerados por selección (48 países), cromos especiales (capitanes foil, holograma, FIFA Legends, Coca-Cola, Extra Stickers). Lista organizada por grupo del Mundial para tachar lo que ya tienes.',
    keywords: [
      'check list album mundial 2026',
      'lista cromos mundial 2026',
      'numeracion cromos panini mundial 2026',
      'lista figurinhas copa do mundo 2026',
      'lista completa cromos panini',
      'mundial 2026 numero cromo',
    ],
    type: 'article',
  });
}

const ESPECIALES_BLOQUES = [
  {
    bloque: 'Logo Mundial 2026',
    rango: 'FWC 1-6',
    cantidad: 6,
    detalle: 'Logo FIFA, Trofeu (holograma), mascotas Maple/Zayu/Clutch, balón oficial Trionda.',
  },
  {
    bloque: 'Sedes',
    rango: 'STD 1-16',
    cantidad: 16,
    detalle:
      'Una página por las 16 ciudades anfitrionas (México, USA, Canadá): Atlanta, Boston, Dallas, Guadalajara, Houston, Kansas City, Los Ángeles, Ciudad de México, Miami, Monterrey, Nueva York/NJ, Filadelfia, San Francisco, Seattle, Toronto, Vancouver.',
  },
  {
    bloque: 'Capitanes foil',
    rango: 'CAP 1-12',
    cantidad: 12,
    detalle:
      'Los 12 capitanes de las cabezas de serie del Mundial (USA, México, Canadá, España, Argentina, Brasil, Francia, Alemania, Inglaterra, Países Bajos, Portugal, Italia) en material foil metálico.',
  },
  {
    bloque: 'FIFA Legends',
    rango: 'LEG 1-12',
    cantidad: 12,
    detalle:
      'Pelé, Maradona, Cruyff, Beckenbauer, Zidane, Ronaldo (Brasil), Iniesta y otros 5 leyendas. Cromo retrospectivo, no aparecen en el Mundial 2026.',
  },
  {
    bloque: 'Coca-Cola promo',
    rango: 'CC 1-12',
    cantidad: 12,
    detalle:
      'Doble página exclusiva con cromos solo disponibles dentro de etiquetas de botellas Coca-Cola desde mediados de mayo de 2026.',
  },
  {
    bloque: 'Extra Stickers (4 colores)',
    rango: 'EXT 1-20 + variantes',
    cantidad: 80,
    detalle:
      '20 cromos exclusivos en 4 variantes de color cada uno (80 totales). Inserción aleatoria 1 a cada 100 sobres. Las piezas más raras del álbum.',
  },
];

const FAQ = [
  {
    q: '¿Cómo se numeran los cromos en el álbum Panini Mundial 2026?',
    a: 'Los cromos se numeran por selección en orden alfabético FIFA: cada selección recibe un rango de 19 cromos (escudo + 18 jugadores). Los cromos especiales se numeran con prefijos: FWC para logo Mundial, STD para sedes, CAP para capitanes foil, LEG para leyendas FIFA, CC para Coca-Cola, EXT para Extra Stickers.',
  },
  {
    q: '¿Cuántos cromos por selección en la check list?',
    a: '19 por selección en la edición estándar Panini (escudo + 18 jugadores). Las convocatorias FIFA son de 26 jugadores; los 7 que no entran en la edición inicial se añaden con Update Stickers después del lanzamiento, con dorsales y plantilla final. Total: 48 × 19 = 912 cromos por selección + 68 especiales = 980.',
  },
  {
    q: '¿Hay PDF descargable de la check list completa?',
    a: 'Panini publica la check list oficial en su web cuando se confirman las plantillas finales, normalmente 2-4 semanas antes del Mundial. Puedes descargar versiones provisionales en grupos de Telegram «Panini Mundial 2026 ES» y comunidades como r/PaniniWC2026. La check list definitiva, con números actualizados tras Update Stickers, sale a comienzos de junio de 2026.',
  },
  {
    q: '¿Hay app que tache automáticamente los cromos?',
    a: 'Sí. La app oficial FIFA Panini Digital Album permite escanear cromos físicos con cámara y los marca automáticamente como «poseídos» en una check list digital. Alternativamente, hay apps comunitarias como Stickermanager o Cardtopia que hacen lo mismo con bases de datos públicas.',
  },
  {
    q: '¿Cuántos cromos «especiales» tiene la check list?',
    a: '68 cromos especiales en total: 6 logo Mundial, 16 sedes, 12 capitanes foil, 12 FIFA Legends, 12 Coca-Cola exclusivos, 20 Extra Stickers (cada uno × 4 variantes de color = 80 totales si los cuentas como individuales).',
  },
];

export default async function CheckListCromos({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Check list completa cromos Panini Mundial 2026',
    publisher: { '@type': 'Organization', name: SEO.siteName, url: SEO.siteUrl },
    datePublished: '2026-05-03',
    mainEntityOfPage: localeUrl(locale, '/coleccionismo/panini-mundial-2026/check-list-cromos'),
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <article className="pt-32">
      <JsonLd
        data={[
          articleLd,
          faqLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Panini Mundial 2026', path: '/coleccionismo/panini-mundial-2026' },
            {
              name: 'Check list',
              path: '/coleccionismo/panini-mundial-2026/check-list-cromos',
            },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Panini Mundial 2026
        </Link>

        <div className="mt-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <ListChecks className="h-4 w-4" />
          <span>Check list completa · 980 cromos</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          Check list<br />Mundial 2026
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          Lista completa del álbum Panini Mundial 2026 organizada por grupo (A-L), con las 48 selecciones y los 68 cromos especiales (capitanes foil, holograma del Trofeo, FIFA Legends, Coca-Cola y Extra Stickers). Úsalo para tachar lo que ya tienes y planificar intercambios.
        </p>
      </header>

      <section className="mx-auto mt-20 w-full max-w-[1100px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Por grupo
        </div>
        <h2 className="mt-3 font-display text-3xl uppercase">
          Las 48 selecciones · 19 cromos cada una
        </h2>

        <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {GROUPS_2026.map((g) => (
            <div
              key={g.letter}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
                Grupo {g.letter}
              </div>
              <ul className="mt-3 space-y-2">
                {g.teams.filter((c): c is string => Boolean(c)).map((code) => {
                  const team = TEAMS_2026[code];
                  if (!team) return null;
                  return (
                    <li key={code} className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm">
                        <span aria-hidden>{team.flag}</span>
                        <Link
                          href={withLocale(locale as Locale, `/selecciones/${code}`)}
                          className="hover:text-[var(--color-pitch)]"
                        >
                          {team.name}
                        </Link>
                      </span>
                      <span className="font-mono text-[10px] tab-num text-[var(--color-fg-subtle)]">
                        19 cromos
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-[1100px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Especiales · 68 cromos
        </div>
        <h2 className="mt-3 font-display text-3xl uppercase">
          Cromos especiales del álbum
        </h2>

        <div className="mt-8 space-y-3">
          {ESPECIALES_BLOQUES.map((b) => (
            <article
              key={b.bloque}
              className="grid gap-4 rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:grid-cols-[8rem_1fr_auto] md:items-start md:p-8"
            >
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                  Rango
                </div>
                <div className="mt-1 font-mono tab-num text-[var(--color-pitch)]">{b.rango}</div>
              </div>
              <div>
                <h3 className="font-display text-lg uppercase">{b.bloque}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                  {b.detalle}
                </p>
              </div>
              <div className="md:text-right">
                <div className="font-display text-3xl tab-num text-[var(--color-pitch)]">
                  {b.cantidad}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                  cromos
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-pitch)]/30 bg-[var(--color-pitch)]/5 p-7 md:p-10">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            <Download className="h-4 w-4" />
            <span>Recursos</span>
          </div>
          <h2 className="mt-3 font-display text-2xl uppercase md:text-3xl">
            Cómo usar la check list
          </h2>
          <ul className="mt-6 grid gap-2 text-sm text-[var(--color-fg-muted)] md:text-base">
            <li>
              · <strong className="text-[var(--color-fg)]">App oficial FIFA Panini</strong>: escanea cromos con la cámara y se marcan automáticamente.
            </li>
            <li>
              · <strong className="text-[var(--color-fg)]">PDF Panini.es</strong>: descargable cuando se confirmen las plantillas finales (2-4 semanas antes del Mundial).
            </li>
            <li>
              · <strong className="text-[var(--color-fg)]">Telegram «Panini Mundial 2026 ES»</strong>: comunidad de intercambio con check list compartida en spreadsheet Google.
            </li>
            <li>
              · <strong className="text-[var(--color-fg)]">r/PaniniWC2026</strong>: subreddit con check lists comunitarias y mercado secundario.
            </li>
          </ul>
        </div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-[1100px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Preguntas frecuentes
        </div>
        <h2 className="mt-3 font-display text-3xl uppercase md:text-4xl">FAQ</h2>
        <div className="mt-10 divide-y divide-[var(--color-border)] border-t border-b border-[var(--color-border)]">
          {FAQ.map(({ q, a }) => (
            <details key={q} className="group py-5">
              <summary className="flex cursor-pointer items-start justify-between gap-6 text-base md:text-lg">
                <span className="font-medium text-[var(--color-fg)]">{q}</span>
                <span className="mt-1 inline-flex h-5 w-5 items-center justify-center font-mono text-sm text-[var(--color-fg-subtle)] transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-[var(--color-fg-muted)]">
                {a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <AmazonProductGrid
        products={AMAZON_PRODUCTS.filter((p) =>
          /panini|cromos|álbum mundial|sobres/i.test(p.title),
        ).slice(0, 4)}
        title="Empezar a llenar la check list"
        subtitle="Caja oficial, sobres y álbum disponibles en Amazon (afiliación nuus-21)."
      />

      <section className="mx-auto mt-16 mb-24 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-10">
          <h2 className="font-display text-2xl uppercase">Sigue explorando</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/cuantos-cromos-tiene')}
              className="rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black"
            >
              980 cromos · desglose
            </Link>
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/cromos-mas-caros')}
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm"
            >
              Cromos más caros
            </Link>
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/digital')}
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm"
            >
              App digital
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, Package, TrendingUp } from 'lucide-react';
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
    path: '/coleccionismo/panini-mundial-2026/caja-50-sobres',
    title: 'Caja 50 sobres Panini Mundial 2026: precio, cromos y por qué conviene',
    description:
      'La caja oficial Panini Mundial 2026 incluye 50 sobres × 5 cromos (250 piezas) por 80 € en España. Cubre entre el 35 % y el 50 % del álbum según la suerte. Análisis del coste por cromo, dónde comprarla y comparativa con sobre suelto y caja completa.',
    keywords: [
      'caja album mundial 2026',
      'caja sobres mundial 2026',
      'caja de cromos mundial 2026',
      'caja de sobres del mundial 2026',
      'caja panini mundial 2026 50 sobres',
      'precio caja album mundial 2026',
      'caja completa mundial 2026',
    ],
    type: 'article',
  });
}

const FACTS = [
  { label: 'Sobres', value: '50' },
  { label: 'Cromos', value: '250' },
  { label: 'Precio España', value: '80 €' },
  { label: 'Cobertura álbum', value: '35-50 %' },
];

const VARIANTES = [
  {
    pais: 'España',
    formato: 'Caja 50 sobres + álbum tapa blanda',
    precio: '80 €',
    coste: '0,32 € / cromo',
    canal: 'Panini.es, Amazon España, FNAC, El Corte Inglés',
    nota: 'Envío gratis península desde 20 €. Stock limitado por canal.',
  },
  {
    pais: 'México',
    formato: 'Caja 100 sobres (sin álbum)',
    precio: '~1.250 MXN',
    coste: '~2,5 MXN / cromo',
    canal: 'Sanborns, Walmart, Sam\'s Club, Costco México',
    nota: 'Sam\'s y Costco suelen tener mejor relación calidad-precio. Confirmar membresía.',
  },
  {
    pais: 'Argentina',
    formato: 'Caja 50 sobres',
    precio: '~25.000 ARS (referencial)',
    coste: '~100 ARS / cromo',
    canal: 'Distribuidores oficiales, MercadoLibre, Carrefour',
    nota: 'Inflación: el precio puede variar mes a mes. Comprar lo antes posible es la regla.',
  },
  {
    pais: 'Brasil',
    formato: 'Caixa 50 pacotes',
    precio: '~R$ 250',
    coste: '~R$ 1 / figurinha',
    canal: 'Panini.com.br, livrarias (Saraiva, Cultura), Mercado Livre',
    nota: 'Algumas edições incluem álbum capa mole de brinde.',
  },
];

const ROI = [
  {
    titulo: 'Caja 50 sobres = 250 cromos',
    detalle:
      'Asumiendo distribución uniforme de los 980 cromos por sobre, los 250 cromos teóricos suelen contener 200-220 únicos y 30-50 repeticiones. Cobertura efectiva: 25-30 % del álbum por caja.',
  },
  {
    titulo: 'A partir de la 2ª caja: ley de los rendimientos decrecientes',
    detalle:
      'Cada caja adicional reduce su tasa de cromos nuevos. La 2ª caja añade ~150 cromos únicos. La 3ª, ~80. La 4ª, ~40. A partir de ahí merece más la pena ir a sobres sueltos buscando faltas o, mejor, intercambiar.',
  },
  {
    titulo: 'Caja vs sobre suelto: la caja siempre gana',
    detalle:
      'El sobre suelto en kiosco está a 1 €. La caja sale a 0,32 €/cromo (un 25 % menos). El único motivo para preferir el sobre suelto es la experiencia o si solo te faltan 5-10 cromos concretos (mejor intercambiar).',
  },
  {
    titulo: 'Las cajas premium (multi-cajas) cubren más, pero no completan',
    detalle:
      'Tres cajas (≈240 €) te dan ~440 cromos únicos: 45 % del álbum. Para llegar al 80 % necesitarías 5-6 cajas (~480 €) y aún te faltarían los Extra Stickers y la promo Coca-Cola. Por eso completar sin intercambios cuesta 800-1.200 €.',
  },
];

const FAQ = [
  {
    q: '¿Cuánto cuesta la caja del álbum del Mundial 2026?',
    a: 'La caja oficial Panini Mundial 2026 con 50 sobres + álbum tapa blanda incluido cuesta 80 € en España (Panini.es y distribuidores oficiales). En México la caja de 100 sobres ronda los 1.250 MXN. Argentina ~25.000 ARS. Brasil ~R$ 250.',
  },
  {
    q: '¿Cuántos cromos vienen en la caja?',
    a: '250 cromos en la caja española estándar (50 sobres × 5 cromos por sobre). En la caja mexicana de 100 sobres son 500 cromos. Los cromos se reparten estadísticamente entre los 980 totales del álbum, con repeticiones inevitables.',
  },
  {
    q: '¿La caja incluye álbum?',
    a: 'En España y Brasil suele incluirlo (tapa blanda). En México y Argentina la caja se vende sola; el álbum se compra aparte por 80-150 MXN o 4.000-6.000 ARS. Verifica el envoltorio antes de comprar.',
  },
  {
    q: '¿Cuánto del álbum cubre una caja?',
    a: 'Entre el 25 % y el 30 % del álbum por caja, según suerte estadística. Para cubrir el 50 % real necesitas 2 cajas (~160 €). Para llegar al 80 %, 4-5 cajas (~320-400 €). Y para completar al 100 % sin intercambios, 8-10 cajas (~640-800 €) más los Extra Stickers y los cromos Coca-Cola.',
  },
  {
    q: '¿Dónde comprar la caja al mejor precio?',
    a: 'Panini.es a precio oficial (80 €), Amazon España con descuentos puntuales hasta 70-75 €, FNAC y El Corte Inglés sin descuento. Costco España y Carrefour España tienen ofertas en lanzamiento. En LATAM, Sam\'s Club y Costco México suelen tener el mejor precio por cromo.',
  },
  {
    q: '¿Conviene comprar caja o sobres sueltos?',
    a: 'Caja siempre gana en relación calidad-precio (0,32 € vs 1 €/sobre suelto). Solo merece la pena el sobre suelto si te faltan 5-10 cromos muy específicos del álbum y prefieres no intercambiar — en ese caso busca por código de letra de impresión o cambia con grupos de Telegram.',
  },
];

export default async function Caja50Sobres({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const relatedPanini = AMAZON_PRODUCTS.filter((p) =>
    /panini|cromos|álbum mundial|sobres/i.test(p.title),
  ).slice(0, 6);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Caja 50 sobres Panini Mundial 2026: precio, contenido y por qué conviene',
    description:
      'Análisis completo de la caja Panini Mundial 2026: 250 cromos por 80 € en España, cobertura real del álbum y comparativa por país.',
    publisher: { '@type': 'Organization', name: SEO.siteName, url: SEO.siteUrl },
    datePublished: '2026-05-03',
    mainEntityOfPage: localeUrl(locale, '/coleccionismo/panini-mundial-2026/caja-50-sobres'),
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
              name: 'Caja 50 sobres',
              path: '/coleccionismo/panini-mundial-2026/caja-50-sobres',
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
          <Package className="h-4 w-4" />
          <span>Caja oficial · 50 sobres × 5 cromos</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          La caja del<br />Mundial 2026
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          La caja oficial Panini Mundial 2026 trae <strong className="text-[var(--color-fg)]">50 sobres con 5 cromos cada uno</strong> (250 cromos en total) por <strong className="text-[var(--color-fg)]">80 € en España</strong>. Es la mejor relación calidad-precio del cluster: 0,32 € por cromo frente a 1 € del sobre suelto. Cubre entre el 35 % y el 50 % del álbum según suerte estadística.
        </p>

        <ul className="mt-12 grid gap-3 md:grid-cols-4">
          {FACTS.map((f) => (
            <li
              key={f.label}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                {f.label}
              </div>
              <div className="mt-2 font-display text-3xl tab-num text-[var(--color-pitch)]">
                {f.value}
              </div>
            </li>
          ))}
        </ul>
      </header>

      <section className="mx-auto mt-20 w-full max-w-[1100px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Por país
        </div>
        <h2 className="mt-3 font-display text-3xl uppercase">Variantes y precios oficiales</h2>

        <div className="mt-8 space-y-3">
          {VARIANTES.map((v) => (
            <article
              key={v.pais}
              className="grid gap-4 rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:grid-cols-[6rem_1fr_auto] md:items-start md:p-8"
            >
              <div className="font-display text-2xl tab-num">{v.pais}</div>
              <div>
                <h3 className="font-display text-lg uppercase">{v.formato}</h3>
                <p className="mt-2 text-sm text-[var(--color-fg-muted)]">{v.canal}</p>
                <p className="mt-2 font-mono text-xs text-[var(--color-fg-subtle)]">
                  Nota · {v.nota}
                </p>
              </div>
              <div className="md:text-right">
                <div className="font-display text-2xl tab-num text-[var(--color-pitch)]">
                  {v.precio}
                </div>
                <div className="font-mono text-xs text-[var(--color-fg-subtle)]">{v.coste}</div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-[1100px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <TrendingUp className="inline h-3 w-3 mr-2" />
          ROI
        </div>
        <h2 className="mt-3 font-display text-3xl uppercase">¿Conviene comprar la caja?</h2>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {ROI.map((r) => (
            <div
              key={r.titulo}
              className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-7"
            >
              <h3 className="font-display text-lg uppercase">{r.titulo}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                {r.detalle}
              </p>
            </div>
          ))}
        </div>
      </section>

      {relatedPanini.length > 0 && (
        <AmazonProductGrid
          products={relatedPanini}
          title="Comprar online"
          subtitle="Cajas, sobres y álbumes del Mundial 2026 con afiliación nuus-21."
        />
      )}

      <section className="mx-auto mt-20 w-full max-w-[1100px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Preguntas frecuentes
        </div>
        <h2 className="mt-3 font-display text-3xl uppercase md:text-4xl">
          Lo que más se pregunta
        </h2>
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

      <section className="mx-auto mt-16 mb-24 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-10">
          <h2 className="font-display text-2xl uppercase">Sigue explorando</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/precio')}
              className="rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black"
            >
              Precios oficiales
            </Link>
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/donde-comprar')}
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm"
            >
              Dónde comprar
            </Link>
            <Link
              href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/cuantos-cromos-tiene')}
              className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm"
            >
              980 cromos del álbum
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

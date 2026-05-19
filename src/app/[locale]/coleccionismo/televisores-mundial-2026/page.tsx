import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight, Tv, ShieldCheck, Sparkles } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';
import { TVS, CATEGORY_LABELS_TVS, getAmazonUrl, type TV } from '@/lib/wc-2026-viewing-gear';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/coleccionismo/televisores-mundial-2026',
    title: 'Mejores televisores para ver el Mundial 2026 · Comparativa 10 modelos OLED, Mini-LED y QLED',
    description:
      'Guía editorial de los 10 mejores televisores para ver el Mundial 2026: OLED LG C5, Mini-LED Hisense U7N, QD-OLED Samsung S95D, Sony Bravia 7/9, TCL C855. Comparativa por presupuesto, panel, frecuencia (120/144 Hz), HDR (Dolby Vision/HDR10+) y enlaces directos a Amazon España.',
    keywords: [
      'mejor televisor mundial 2026',
      'tv para ver el mundial',
      'smart tv 4k 120hz futbol',
      'oled vs mini led futbol',
      'television oled mundial',
      'comparativa tv mundial 2026',
      'tcl hisense lg samsung sony 2026',
    ],
    type: 'article',
  });
}

function TVCard({ tv }: { tv: TV }) {
  return (
    <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            {tv.panelType} · {tv.refreshHz} Hz · {tv.baseSize}"
          </div>
          <h3 className="mt-1 font-display text-xl uppercase">{tv.brand} {tv.model}</h3>
        </div>
        <div className="font-mono text-sm text-[var(--color-pitch)]">
          {tv.priceRangeEur[0]}–{tv.priceRangeEur[1]} €
        </div>
      </div>
      <p className="mt-3 text-base leading-relaxed text-[var(--color-fg-muted)]">{tv.pitch}</p>

      <div className="mt-4 grid gap-1.5 text-sm md:grid-cols-2">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">HDR</span>
          <div className="text-[var(--color-fg-muted)]">{tv.hdr.join(', ')}</div>
        </div>
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Motion</span>
          <div className="text-[var(--color-fg-muted)]">{tv.motionFeatures.join(', ')}</div>
        </div>
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Sistema</span>
          <div className="text-[var(--color-fg-muted)]">{tv.os}</div>
        </div>
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Tamaño base</span>
          <div className="text-[var(--color-fg-muted)]">{tv.baseSize}" (también 55/65/75)</div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">✓ Pros</div>
          <ul className="mt-2 space-y-1.5 text-sm text-[var(--color-fg-muted)]">
            {tv.pros.map((p) => (
              <li key={p} className="flex gap-2"><span className="text-[var(--color-pitch)]">+</span>{p}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-red-500">✗ Contras</div>
          <ul className="mt-2 space-y-1.5 text-sm text-[var(--color-fg-muted)]">
            {tv.cons.map((c) => (
              <li key={c} className="flex gap-2"><span className="text-red-500">−</span>{c}</li>
            ))}
          </ul>
        </div>
      </div>

      <a
        href={getAmazonUrl(tv.amazonQuery)}
        target="_blank"
        rel="sponsored nofollow noopener noreferrer"
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-[1.02]"
      >
        Ver {tv.brand} {tv.model} en Amazon
        <ArrowRight className="h-4 w-4 rtl:rotate-180" />
      </a>
    </div>
  );
}

export default async function TVsPillar({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const categories: Array<'budget' | 'mid' | 'high' | 'premium'> = ['budget', 'mid', 'high', 'premium'];

  return (
    <article className="pt-32 pb-24">
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Mejores televisores para el Mundial 2026',
            url: localeUrl(locale, '/coleccionismo/televisores-mundial-2026'),
            inLanguage: locale,
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: TVS.map((tv, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: `${tv.brand} ${tv.model}`,
              })),
            },
          },
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Coleccionismo', path: '/coleccionismo/panini-mundial-2026' },
            { name: 'Televisores Mundial 2026', path: '/coleccionismo/televisores-mundial-2026' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Tv className="mr-2 inline h-3 w-3" /> Equipamiento para ver el Mundial
        </div>
        <h1 className="mt-3 font-display text-4xl uppercase leading-[1] md:text-5xl">
          Los mejores televisores para el Mundial 2026
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)]">
          Hemos seleccionado <strong>{TVS.length} televisores</strong> recomendados por
          calidad de imagen para fútbol: panel OLED, Mini-LED o QLED, refresco mínimo de
          100/120 Hz para que el balón se vea fluido y soporte HDR (Dolby Vision o HDR10+).
          Comparativa por presupuesto, desde el TCL C655 a 350 € hasta el Sony Bravia 9 a 4.500 €.
        </p>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-pitch)]/40 bg-[var(--color-pitch)]/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-pitch)]">
          <ShieldCheck className="h-3 w-3" /> Enlaces Amazon España con afiliación nuus-21
        </div>
      </header>

      {/* Criterios técnicos */}
      <section className="mx-auto mt-12 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:p-7">
          <h2 className="font-display text-2xl uppercase">Cómo elegir un TV para fútbol</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-display text-base uppercase">1. Refresco (Hz)</h3>
              <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
                <strong>120 Hz mínimo</strong> para que el balón no deje rastro. 100 Hz también vale (mayoría TVs EU). 60 Hz solo aceptable en presupuesto bajo. 144 Hz es premium y solo importa para gaming.
              </p>
            </div>
            <div>
              <h3 className="font-display text-base uppercase">2. Panel</h3>
              <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
                <strong>OLED</strong>: negros perfectos, ángulo total, mejor para sala oscura.
                <strong>Mini-LED</strong>: mejor brillo HDR, mejor en sala luminosa.
                <strong>QLED</strong>: color saturado, pero ángulo limitado.
              </p>
            </div>
            <div>
              <h3 className="font-display text-base uppercase">3. HDR</h3>
              <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
                <strong>Dolby Vision</strong> ideal (mejor calibración escena-a-escena). HDR10+ es alternativa Samsung. HDR10 mínimo. HLG para broadcasts en directo (FIFA).
              </p>
            </div>
            <div>
              <h3 className="font-display text-base uppercase">4. Brillo (nits)</h3>
              <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
                Salón claro durante el día: <strong>+1.000 nits</strong> (Mini-LED). Salón oscuro de noche: 600-800 nits OLED bastan. Picos HDR 4.000 nits son lujo (Sony Bravia 9).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Por categoría */}
      {categories.map((cat) => {
        const items = TVS.filter((t) => t.category === cat);
        const label = CATEGORY_LABELS_TVS[cat];
        return (
          <section key={cat} className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10">
            <h2 className="font-display text-2xl uppercase">{label.label}</h2>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">{label.range}</p>
            <div className="mt-6 space-y-5">
              {items.map((tv) => (
                <TVCard key={tv.id} tv={tv} />
              ))}
            </div>
          </section>
        );
      })}

      {/* Alternativa proyectores */}
      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/coleccionismo/proyectores-mundial-2026')}
          className="group flex flex-col gap-3 rounded-3xl border border-[var(--color-pitch)]/30 bg-gradient-to-br from-[var(--color-pitch)]/8 via-[var(--color-bg-2)] to-[var(--color-bg-2)] p-7 transition-colors hover:border-[var(--color-pitch)] md:flex-row md:items-center md:justify-between"
        >
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              <Sparkles className="h-3 w-3" /> Alternativa: imagen grande
            </div>
            <h2 className="mt-2 font-display text-2xl uppercase">¿Por qué no un proyector?</h2>
            <p className="mt-2 max-w-2xl text-sm text-[var(--color-fg-muted)]">
              Para una fan zone casera de 100" o más, un proyector láser es competitivo en
              precio y mucho más cinematográfico. Hemos comparado 7 modelos.
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black md:self-auto">
            Ver proyectores
            <ArrowRight className="h-3 w-3 rtl:rotate-180" />
          </span>
        </Link>
      </section>

      {/* Cross-links */}
      <section className="mx-auto mt-12 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
          <h2 className="font-display text-lg uppercase">Más sobre el Mundial 2026</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={withLocale(locale as Locale, '/2026/calendario')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Calendario completo
            </Link>
            <Link href={withLocale(locale as Locale, '/2026/donde-ver')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Dónde ver el Mundial
            </Link>
            <Link href={withLocale(locale as Locale, '/coleccionismo/camisetas-mundial-2026')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Camisetas oficiales
            </Link>
            <Link href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Panini cromos
            </Link>
          </div>
          <p className="mt-5 text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
            Algunos enlaces son de afiliación. Si compras desde aquí recibimos una pequeña
            comisión que financia esta cobertura editorial. <Link className="underline" href={withLocale(locale as Locale, '/aviso-afiliados')}>Aviso completo</Link>.
          </p>
        </div>
      </section>
    </article>
  );
}

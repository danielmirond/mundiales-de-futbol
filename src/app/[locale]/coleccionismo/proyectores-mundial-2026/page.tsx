import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight, Projector, ShieldCheck, Tv } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';
import { PROJECTORS, CATEGORY_LABELS_PROJECTORS, getAmazonUrl, type Projector as ProjectorType } from '@/lib/wc-2026-viewing-gear';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/coleccionismo/proyectores-mundial-2026',
    title: 'Mejores proyectores para ver el Mundial 2026 · 7 modelos láser, portátiles y 4K',
    description:
      'Guía editorial de los 7 mejores proyectores para ver el Mundial 2026 en pantalla gigante: Anker Nebula Capsule 3, XGIMI MoGo 3 Pro, Epson EH-TW7100, BenQ W2710, Samsung The Premiere, Epson LS12000, XGIMI Horizon Ultra. Por categoría (portátil, home cinema, tiro corto, láser premium), lúmenes ANSI, resolución y enlaces directos a Amazon España.',
    keywords: [
      'mejor proyector mundial 2026',
      'proyector para ver el mundial',
      'proyector 4k laser futbol',
      'proyector portatil mundial',
      'fan zone casera proyector',
      'comparativa proyectores mundial 2026',
      'xgimi epson benq anker samsung',
    ],
    type: 'article',
  });
}

function ProjectorCard({ p }: { p: ProjectorType }) {
  return (
    <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            {p.nativeResolution} · {p.lumensAnsi} ANSI · {p.lightSource}
          </div>
          <h3 className="mt-1 font-display text-xl uppercase">{p.brand} {p.model}</h3>
        </div>
        <div className="font-mono text-sm text-[var(--color-pitch)]">
          {p.priceRangeEur[0]}–{p.priceRangeEur[1]} €
        </div>
      </div>
      <p className="mt-3 text-base leading-relaxed text-[var(--color-fg-muted)]">{p.pitch}</p>

      <div className="mt-4 grid gap-1.5 text-sm md:grid-cols-2">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Lúmenes ANSI</span>
          <div className="text-[var(--color-fg-muted)]">{p.lumensAnsi.toLocaleString('es-ES')}</div>
        </div>
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Vida útil</span>
          <div className="text-[var(--color-fg-muted)]">{p.lifespanHours.toLocaleString('es-ES')} horas</div>
        </div>
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Distancia 100"</span>
          <div className="text-[var(--color-fg-muted)]">{p.throwRatio}</div>
        </div>
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Smart</span>
          <div className="text-[var(--color-fg-muted)]">{p.smart.join(', ')}</div>
        </div>
        <div className="md:col-span-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">Audio integrado</span>
          <div className="text-[var(--color-fg-muted)]">{p.audio}</div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">✓ Pros</div>
          <ul className="mt-2 space-y-1.5 text-sm text-[var(--color-fg-muted)]">
            {p.pros.map((pr) => (
              <li key={pr} className="flex gap-2"><span className="text-[var(--color-pitch)]">+</span>{pr}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-red-500">✗ Contras</div>
          <ul className="mt-2 space-y-1.5 text-sm text-[var(--color-fg-muted)]">
            {p.cons.map((co) => (
              <li key={co} className="flex gap-2"><span className="text-red-500">−</span>{co}</li>
            ))}
          </ul>
        </div>
      </div>

      <a
        href={getAmazonUrl(p.amazonQuery)}
        target="_blank"
        rel="sponsored nofollow noopener noreferrer"
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-[1.02]"
      >
        Ver {p.brand} {p.model} en Amazon
        <ArrowRight className="h-4 w-4 rtl:rotate-180" />
      </a>
    </div>
  );
}

export default async function ProjectorsPillar({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const categories: Array<'portable' | 'home-cinema' | 'short-throw' | 'premium-laser'> = [
    'portable', 'home-cinema', 'short-throw', 'premium-laser',
  ];

  return (
    <article className="pt-32 pb-24">
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Mejores proyectores para el Mundial 2026',
            url: localeUrl(locale, '/coleccionismo/proyectores-mundial-2026'),
            inLanguage: locale,
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: PROJECTORS.map((p, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: `${p.brand} ${p.model}`,
              })),
            },
          },
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Coleccionismo', path: '/coleccionismo/panini-mundial-2026' },
            { name: 'Proyectores Mundial 2026', path: '/coleccionismo/proyectores-mundial-2026' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Projector className="mr-2 inline h-3 w-3" /> Equipamiento para ver el Mundial
        </div>
        <h1 className="mt-3 font-display text-4xl uppercase leading-[1] md:text-5xl">
          Los mejores proyectores para el Mundial 2026
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)]">
          Una fan zone casera de <strong>100 pulgadas</strong> es la mejor manera de
          ver el Mundial con un grupo. Hemos seleccionado <strong>{PROJECTORS.length} proyectores</strong>{' '}
          recomendados desde el portátil Anker Nebula Capsule 3 Laser (600 €) hasta el
          láser 4K Epson LS12000 (4.500 €). Ojo a los lúmenes ANSI (no LED inflados) y a la
          resolución nativa: 1080p es suficiente para 100", 4K solo merece la pena en 130"+.
        </p>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-pitch)]/40 bg-[var(--color-pitch)]/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-pitch)]">
          <ShieldCheck className="h-3 w-3" /> Enlaces Amazon España con afiliación nuus-21
        </div>
      </header>

      {/* Criterios técnicos */}
      <section className="mx-auto mt-12 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:p-7">
          <h2 className="font-display text-2xl uppercase">Cómo elegir proyector para fútbol</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-display text-base uppercase">1. Lúmenes ANSI (no LED)</h3>
              <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
                Los <strong>"lúmenes LED" están inflados 3-5 veces</strong>. Solo cuenta ANSI lumens (estándar honesto). Para sala oscura: 300-500 ANSI. Sala penumbra: 1.500-2.000 ANSI. Sala con luz natural: 2.500+ ANSI o desistir.
              </p>
            </div>
            <div>
              <h3 className="font-display text-base uppercase">2. Resolución y tamaño</h3>
              <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
                <strong>1080p</strong> es suficiente para pantallas de 100" (3-4m de distancia). <strong>4K UHD</strong> (pixel-shifting) merece la pena solo para 130"+ o si estás muy cerca. 4K nativo real es muy caro y rara vez justifica el precio.
              </p>
            </div>
            <div>
              <h3 className="font-display text-base uppercase">3. Fuente luminosa</h3>
              <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
                <strong>Láser</strong>: 20.000-30.000 horas vida útil, color estable.
                <strong>LED</strong>: 20.000h, color más pobre.
                <strong>Lámpara</strong>: solo 3.000-5.000h, reemplazo caro 200-400 €.
              </p>
            </div>
            <div>
              <h3 className="font-display text-base uppercase">4. Throw ratio</h3>
              <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
                <strong>Tiro estándar</strong> (1.2:1): 100" a 2.7m distancia.
                <strong>Tiro corto</strong> (0.6:1): 100" a 1.5m.
                <strong>Ultra-corto</strong> (0.2:1): 100" a 30cm de la pared (caro pero ideal salón sin sitio para colgar).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Por categoría */}
      {categories.map((cat) => {
        const items = PROJECTORS.filter((p) => p.category === cat);
        if (items.length === 0) return null;
        const label = CATEGORY_LABELS_PROJECTORS[cat];
        return (
          <section key={cat} className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10">
            <h2 className="font-display text-2xl uppercase">{label.label}</h2>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">{label.range}</p>
            <div className="mt-6 space-y-5">
              {items.map((p) => (
                <ProjectorCard key={p.id} p={p} />
              ))}
            </div>
          </section>
        );
      })}

      {/* Alternativa TV */}
      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/coleccionismo/televisores-mundial-2026')}
          className="group flex flex-col gap-3 rounded-3xl border border-[var(--color-pitch)]/30 bg-gradient-to-br from-[var(--color-pitch)]/8 via-[var(--color-bg-2)] to-[var(--color-bg-2)] p-7 transition-colors hover:border-[var(--color-pitch)] md:flex-row md:items-center md:justify-between"
        >
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              <Tv className="h-3 w-3" /> Alternativa: TV
            </div>
            <h2 className="mt-2 font-display text-2xl uppercase">¿Mejor un televisor?</h2>
            <p className="mt-2 max-w-2xl text-sm text-[var(--color-fg-muted)]">
              Si tu sala tiene luz natural o no quieres apagar luces para ver el partido,
              un TV OLED o Mini-LED es mucho mejor. Comparativa de 10 modelos por presupuesto.
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black md:self-auto">
            Ver televisores
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
            <Link href={withLocale(locale as Locale, '/2026/hospitality')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Hospitality
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

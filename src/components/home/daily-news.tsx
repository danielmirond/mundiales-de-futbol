import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Newspaper } from 'lucide-react';
import { getLatestNews, relativeTimeEs, newsImageUrl, newsImageAlt, type NewsItem } from '@/lib/news';
import { routing, type Locale } from '@/i18n/routing';

const CATEGORY_LABELS: Record<NewsItem['category'], string> = {
  panini: 'Panini',
  convocatorias: 'Convocatorias',
  sedes: 'Sedes',
  entradas: 'Entradas',
  jugadores: 'Jugadores',
  mascotas: 'Mascotas',
  ceremonia: 'Ceremonia',
  polemica: 'Polémica',
  tv: 'TV / Streaming',
  patrocinios: 'Patrocinios',
  amistosos: 'Amistosos',
  lesiones: 'Lesiones',
  tecnico: 'Cuerpo técnico',
  general: 'General',
  historica: 'Historia',
  curiosa: 'Curiosidades',
};

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

/**
 * Carrusel de noticias diarias en la home. Renderiza las 8 más recientes
 * en scroll horizontal con `scroll-snap` nativo CSS (sin JS, server-only).
 *
 * Cada card enlaza al artículo editorial propio en `/noticias/[slug]`.
 * En desktop: 3 cards visibles; en mobile: 1 card snap centro con peek
 * de las adyacentes. Sin librerías de carrusel: gestos táctiles nativos
 * + scroll wheel + arrastre con cursor (rueda de Magic Mouse, trackpad).
 */
export function DailyNews({ locale }: { locale: Locale }) {
  const items = getLatestNews(8);
  if (items.length === 0) return null;

  return (
    <section className="relative border-y border-[var(--color-border)] bg-[var(--color-bg-2)]">
      <div className="mx-auto w-full max-w-[1400px] px-6 pt-12 pb-6 md:px-10 md:pt-16 md:pb-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              <Newspaper className="h-3 w-3" />
              <span>Lo último · Mundial 2026</span>
            </div>
            <h2 className="mt-3 font-display text-3xl uppercase leading-[0.95] text-[var(--color-fg)] md:text-4xl">
              Noticias del día
            </h2>
          </div>
          <Link
            href={withLocale(locale, '/noticias')}
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-4 py-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
          >
            Todas las noticias
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
          </Link>
        </div>
      </div>

      {/* Carrusel · scroll horizontal con snap */}
      <div
        className="news-carousel relative pb-12 md:pb-16"
        aria-label="Carrusel de noticias del Mundial 2026"
      >
        <ul
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 pb-4 md:px-10 md:gap-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          role="list"
        >
          {items.map((n) => (
            <li
              key={n.slug}
              className="snap-start shrink-0 basis-[85%] sm:basis-[55%] md:basis-[44%] lg:basis-[32%] xl:basis-[26%]"
            >
              <Link
                href={withLocale(locale, `/noticias/${n.slug}`)}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] transition-colors hover:border-[var(--color-pitch)]/40 hover:bg-[var(--color-bg-2)]"
              >
                {/* Imagen 16:9 con placeholder editorial cuando no hay foto */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--color-bg-2)]">
                  {/* Placeholder siempre visible detrás */}
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-1"
                    style={{
                      background: `linear-gradient(135deg, color-mix(in oklch, var(--color-pitch) 14%, var(--color-bg-2)), var(--color-bg-2))`,
                    }}
                  >
                    <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--color-pitch)] opacity-60">
                      {CATEGORY_LABELS[n.category]}
                    </span>
                    <span className="font-display text-4xl font-semibold uppercase text-[var(--color-fg)] opacity-[0.05] leading-none text-center px-3 line-clamp-2">
                      {n.title}
                    </span>
                  </div>
                  <Image
                    src={newsImageUrl(n)}
                    alt={newsImageAlt(n)}
                    fill
                    sizes="(max-width: 640px) 85vw, (max-width: 1024px) 44vw, 32vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-[var(--color-pitch)] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.3em] text-black z-10">
                    {CATEGORY_LABELS[n.category]}
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                    {relativeTimeEs(n.publishedAt)}
                  </span>

                  <h3 className="font-display text-lg uppercase leading-tight text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-pitch)] md:text-xl">
                    {n.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-[var(--color-fg-muted)] line-clamp-3">
                    {n.summary}
                  </p>

                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-[var(--color-border)] pt-3">
                    <span className="truncate font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                      Fuente · {n.sourceName}
                    </span>
                    <ArrowRight className="h-3 w-3 flex-shrink-0 text-[var(--color-fg-subtle)] transition-all group-hover:translate-x-1 group-hover:text-[var(--color-pitch)]" />
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* Hint mobile: arrastra para ver más */}
        <p className="mt-2 px-6 font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)] md:hidden">
          Desliza para ver más →
        </p>
      </div>
    </section>
  );
}

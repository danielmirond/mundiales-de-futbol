import Link from 'next/link';
import { ArrowRight, Newspaper } from 'lucide-react';
import { getLatestNews, relativeTimeEs, type NewsItem } from '@/lib/news';
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
  general: 'General',
};

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

/**
 * Módulo de noticias diarias en la home. Renderiza las 6 más recientes
 * con enlace interno al artículo editorial propio en `/noticias/[slug]`.
 *
 * Cada noticia tiene body editorial propio (200-400 palabras) que cita
 * y enlaza a la fuente original.
 */
export function DailyNews({ locale }: { locale: Locale }) {
  const items = getLatestNews(6);
  if (items.length === 0) return null;

  return (
    <section className="relative border-y border-[var(--color-border)] bg-[var(--color-bg-2)]">
      <div className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              <Newspaper className="h-3 w-3" />
              <span>Lo último · Mundial 2026</span>
            </div>
            <h2 className="mt-3 font-display text-3xl uppercase leading-[0.95] text-[var(--color-fg)] md:text-4xl">
              Noticias del día
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-[var(--color-fg-muted)] md:text-base">
              Cobertura editorial propia con datos verificados y citas a
              fuentes originales.
            </p>
          </div>
          <Link
            href={withLocale(locale, '/noticias')}
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-4 py-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
          >
            Todas las noticias
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
          </Link>
        </div>

        <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((n) => (
            <li key={n.slug}>
              <Link
                href={withLocale(locale, `/noticias/${n.slug}`)}
                className="group flex h-full flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-6 transition-colors hover:border-[var(--color-pitch)]/40 hover:bg-[var(--color-bg-2)]"
              >
                <div className="flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.3em]">
                  <span className="rounded-full bg-[var(--color-pitch)]/10 px-2.5 py-1 text-[var(--color-pitch)]">
                    {CATEGORY_LABELS[n.category]}
                  </span>
                  <span className="text-[var(--color-fg-subtle)]">
                    {relativeTimeEs(n.publishedAt)}
                  </span>
                </div>

                <h3 className="font-display text-lg uppercase leading-tight text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-pitch)] md:text-xl">
                  {n.title}
                </h3>

                <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">
                  {n.summary}
                </p>

                <div className="mt-auto flex items-center justify-between gap-3 border-t border-[var(--color-border)] pt-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                    Fuente · {n.sourceName}
                  </span>
                  <ArrowRight className="h-3 w-3 text-[var(--color-fg-subtle)] transition-all group-hover:translate-x-1 group-hover:text-[var(--color-pitch)]" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

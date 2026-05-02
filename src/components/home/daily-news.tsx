import { ExternalLink, Newspaper } from 'lucide-react';
import { getLatestNews, relativeTimeEs, type NewsItem } from '@/lib/news';

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

/**
 * Módulo de noticias diarias en la home. Server Component puro: lee
 * `NEWS_ITEMS` estático y renderiza las 6 más recientes.
 *
 * No reproducimos contenido del medio. Solo título original (citado) +
 * resumen propio + link externo con `rel="noopener noreferrer"`.
 */
export function DailyNews() {
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
              Selección curada de noticias publicadas en medios deportivos
              relevantes. Resumen editorial propio · enlaces externos al medio
              original.
            </p>
          </div>
        </div>

        <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((n) => (
            <li key={n.slug}>
              <a
                href={n.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
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
                    {n.sourceName}
                  </span>
                  <ExternalLink className="h-3 w-3 text-[var(--color-fg-subtle)] transition-colors group-hover:text-[var(--color-pitch)]" />
                </div>
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-10 max-w-3xl font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
          Citamos titulares textuales y enlazamos al medio original. Los
          resúmenes son editorial propio. Mundial de Fútbol no se hace
          responsable del contenido externo.
        </p>
      </div>
    </section>
  );
}

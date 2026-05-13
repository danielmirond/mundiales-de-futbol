import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ArrowRight, Quote, History } from 'lucide-react';
import { HISTORIAS, getPublishedHistorias } from '@/lib/historias';
import { routing, type Locale } from '@/i18n/routing';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

/**
 * Widget «Hoy en la historia».
 *
 * Selecciona la historia del calendario editorial cuyo `publishDate` coincida
 * con el día de hoy (timezone server). Si no hay una hoy exacta, retorna la
 * última publicada. Si todavía no hay ninguna publicada (pre-launch),
 * retorna null y la sección no se renderiza.
 *
 * Server component: lectura síncrona de `HISTORIAS` estático.
 * Adyacentes (ayer / mañana) se calculan en build-time para evitar JS de
 * navegación.
 */
export async function TodayInHistory({ locale }: { locale: Locale }) {
  const t = await getTranslations('home.todayHistory');
  const today = new Date().toISOString().slice(0, 10);

  // Busca la historia de HOY exacta; si no, la última publicada.
  const todayPiece =
    HISTORIAS.find((h) => h.publishDate === today) ??
    getPublishedHistorias(today).slice(-1)[0];

  if (!todayPiece) return null;

  // Adyacentes en el calendario (-1 día y +1 día respecto a la pieza actual).
  const idx = HISTORIAS.findIndex((h) => h.slug === todayPiece.slug);
  const prev = idx > 0 ? HISTORIAS[idx - 1] : undefined;
  const next = idx >= 0 && idx < HISTORIAS.length - 1 ? HISTORIAS[idx + 1] : undefined;

  return (
    <section className="relative mx-auto w-full max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            <History className="mr-2 inline h-3 w-3" />
            {t('kicker')}
          </div>
          <h2 className="mt-3 font-display text-fluid-h1 uppercase leading-[0.92]">
            {t('title')}
          </h2>
        </div>
        <Link
          href={withLocale(locale, '/historias')}
          className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-pitch)]"
        >
          {t('viewAll')}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
        </Link>
      </div>

      <article className="mt-12 grid gap-8 rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-8 md:grid-cols-[2fr_1fr] md:p-12">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
            #{todayPiece.n} · {todayPiece.protagonist}
          </div>
          <h3 className="mt-3 font-display text-3xl uppercase leading-[1.05] md:text-4xl">
            {todayPiece.title}
          </h3>
          <p className="mt-6 text-base leading-relaxed text-[var(--color-fg-muted)] md:text-lg">
            {todayPiece.excerpt}
          </p>
          <Link
            href={withLocale(locale, `/historias/${todayPiece.slug}`)}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-[1.02]"
          >
            {t('read')}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>

          {(prev || next) && (
            <div className="mt-8 flex flex-wrap gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
              {prev && (
                <Link
                  href={withLocale(locale, `/historias/${prev.slug}`)}
                  className="rounded-full border border-[var(--color-border-strong)] px-3 py-1.5 transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
                  title={prev.title}
                >
                  ⏪ {t('yesterday')} · {prev.protagonist.split(' / ')[0]}
                </Link>
              )}
              {next && next.publishDate <= today && (
                <Link
                  href={withLocale(locale, `/historias/${next.slug}`)}
                  className="rounded-full border border-[var(--color-border-strong)] px-3 py-1.5 transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
                  title={next.title}
                >
                  {next.protagonist.split(' / ')[0]} · {t('tomorrow')} ⏩
                </Link>
              )}
            </div>
          )}
        </div>

        <aside className="self-start rounded-2xl bg-[var(--color-bg)] p-6 md:p-7">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            <Quote className="mr-2 inline h-3 w-3" />
            {t('quoteOfTheDay')}
          </div>
          <blockquote className="mt-4 font-display text-xl leading-tight md:text-2xl">
            «{todayPiece.quote}»
          </blockquote>
          <cite className="mt-4 block font-mono text-[10px] uppercase not-italic tracking-[0.25em] text-[var(--color-fg-subtle)]">
            — {todayPiece.protagonist.split(' / ')[0]} · {todayPiece.quoteDate}
          </cite>
        </aside>
      </article>
    </section>
  );
}

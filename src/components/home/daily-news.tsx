import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getLatestNews } from '@/lib/news';
import { NewsCard, autoVariant } from '@/components/news/news-card';
import { routing, type Locale } from '@/i18n/routing';

const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);

/**
 * «Lo último» en portada (sistema de diseño · 09): una destacada ancha,
 * tres tarjetas (con foto o con dato) y una lista compacta.
 */
export function DailyNews({ locale }: { locale: Locale }) {
  const items = getLatestNews(8);
  if (items.length === 0) return null;
  const [feat, ...rest] = items;
  const cards = rest.slice(0, 3);
  const list = rest.slice(3, 7);

  return (
    <section className="relative border-y border-[var(--color-border)] bg-[var(--color-bg-2)]">
      <div className="mx-auto w-full max-w-[1400px] px-6 py-12 md:px-10 md:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="kicker">Lo último</div>
            <h2 className="t-h2 mt-3 text-[var(--color-fg)]">Noticias del día</h2>
          </div>
          <Link href={withLocale(locale, '/noticias')} className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-sm font-semibold text-[var(--color-fg)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent-ink)]">
            Todas las noticias <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-12 gap-x-7 gap-y-11">
          <div className="col-span-12"><NewsCard n={feat} locale={locale} variant="feat" priority /></div>
          {cards.map((n) => <div key={n.slug} className="col-span-12 sm:col-span-6 lg:col-span-4"><NewsCard n={n} locale={locale} variant={autoVariant(n)} /></div>)}
          {list.length > 0 && (
            <div className="col-span-12 lg:col-span-6">
              <div className="sub-label mb-2">Más piezas</div>
              {list.map((n) => <NewsCard key={n.slug} n={n} locale={locale} variant="list" />)}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

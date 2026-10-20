import Link from 'next/link';
import { watchGuideFor } from '@/lib/watch-guides';
import { routing, type Locale } from '@/i18n/routing';

/** Franja «Dónde ver»: enlaza la guía de la competición (plataformas, precios y lo gratis). */
export function WatchGuideLink({ compSlug, compName, locale, className = '' }: { compSlug: string; compName: string; locale: Locale; className?: string }) {
  const g = watchGuideFor(compSlug, compName);
  const href = `${locale === routing.defaultLocale ? '' : `/${locale}`}/noticias/${g.slug}`;
  return (
    <section className={`mx-auto w-full max-w-[1000px] px-6 md:px-10 ${className}`}>
      <Link href={href} className="group flex items-center justify-between gap-4 rounded-[14px] border border-[var(--color-border)] bg-[var(--color-bg-2)] px-4 py-3 hover:border-[var(--accent)]">
        <span>
          <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">Dónde ver</span>
          <span className="block text-[14px] font-semibold text-[var(--color-fg)]">Cómo ver {g.label} en España: plataformas, precios y lo que es gratis</span>
        </span>
        <span aria-hidden="true" className="text-[var(--accent-ink)] transition-transform group-hover:translate-x-0.5">→</span>
      </Link>
    </section>
  );
}

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SPORTS, COMPETITIONS, competitionPath, type Competition } from '@/lib/competitions';
import { routing, type Locale } from '@/i18n/routing';

const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);

function CompChip({ c, locale }: { c: Competition; locale: Locale }) {
  const soon = !c.espn && !c.href;
  return (
    <Link
      href={withLocale(locale, competitionPath(c))}
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
        soon
          ? 'border-[var(--color-border)] text-[var(--color-fg-subtle)] hover:text-[var(--color-fg-muted)]'
          : 'border-[var(--color-border-strong)] text-[var(--color-fg)] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]'
      }`}
    >
      {c.flag && <span aria-hidden>{c.flag}</span>}
      {c.shortName ?? c.name}
      {soon && <span className="font-mono text-[9px] uppercase tracking-wider">pronto</span>}
    </Link>
  );
}

/** Grid de deportes con sus competiciones (entrada al portal). */
export function CompetitionsGrid({ locale, title = 'Competiciones', kicker = 'Todas las secciones' }: { locale: Locale; title?: string; kicker?: string }) {
  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 py-12 md:px-10">
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">{kicker}</div>
      <h2 className="mt-3 font-display text-fluid-h2 uppercase leading-none">{title}</h2>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {SPORTS.map((s) => {
          const comps = COMPETITIONS.filter((c) => c.sport === s.slug);
          return (
            <article key={s.slug} className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
              <Link href={withLocale(locale, `/${s.slug}`)} className="group flex items-center justify-between">
                <span className="flex items-center gap-3">
                  <span className="text-3xl leading-none" aria-hidden>{s.emoji}</span>
                  <span className="font-display text-2xl uppercase text-[var(--color-fg)] group-hover:text-[var(--color-pitch)]">{s.name}</span>
                </span>
                <ArrowRight className="h-4 w-4 text-[var(--color-fg-subtle)] transition-transform group-hover:translate-x-1 rtl:rotate-180" />
              </Link>
              <p className="mt-2 text-sm text-[var(--color-fg-muted)]">{s.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {comps.map((c) => <CompChip key={c.slug} c={c} locale={locale} />)}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

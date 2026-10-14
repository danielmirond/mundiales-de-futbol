import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Icon, sportIcon } from '@/components/ui/icon';
import { SPORTS, COMPETITIONS, competitionPath, type Competition } from '@/lib/competitions';
import { routing, type Locale } from '@/i18n/routing';

const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);

function CompChip({ c, locale }: { c: Competition; locale: Locale }) {
  const soon = !c.espn && !c.href && !c.stats;
  return (
    <Link
      href={withLocale(locale, competitionPath(c))}
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
        soon
          ? 'border-[var(--color-border)] text-[var(--color-fg-subtle)] hover:text-[var(--color-fg-muted)]'
          : 'border-[var(--color-border-strong)] text-[var(--color-fg)] hover:border-[var(--accent)] hover:text-[var(--accent-ink)]'
      }`}
    >
      {c.shortName ?? c.name}
      {soon && <span className="font-mono text-[9px] uppercase tracking-wider">pronto</span>}
    </Link>
  );
}

/** Grid de deportes con sus competiciones (entrada al portal). */
export function CompetitionsGrid({ locale, title = 'Competiciones', kicker = 'Todas las secciones' }: { locale: Locale; title?: string; kicker?: string }) {
  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 py-12 md:px-10">
      <div className="kicker">{kicker}</div>
      <h2 className="t-h2 mt-3 text-[var(--color-fg)]">{title}</h2>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {SPORTS.map((s) => {
          const comps = COMPETITIONS.filter((c) => c.sport === s.slug);
          return (
            <article key={s.slug} data-sport={s.slug} className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
              <Link href={withLocale(locale, `/${s.slug}`)} className="group flex items-center justify-between">
                <span className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-[11px] bg-[color-mix(in_oklab,var(--accent)_16%,transparent)] text-[var(--accent)]"><Icon name={sportIcon(s.slug)} size={22} /></span>
                  <span className="text-[18px] font-semibold text-[var(--color-fg)] group-hover:text-[var(--accent-ink)]">{s.name}</span>
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

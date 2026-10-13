import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Icon } from '@/components/ui/icon';
import { routing, type Locale } from '@/i18n/routing';
import { HISTORY_TOTALS, fmtEs } from '@/lib/tournaments';

const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);

/** Entrada única al archivo histórico desde la portada (acento dorado, un botón). */
export function MundialesEntry({ locale }: { locale: Locale }) {
  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 py-12 md:px-10">
      <div className="grid gap-6 rounded-[28px] border border-[color-mix(in_oklab,var(--color-gold)_45%,transparent)] bg-[radial-gradient(70%_80%_at_0%_0%,color-mix(in_oklab,var(--color-gold)_12%,transparent),transparent_70%),var(--color-bg-2)] p-8 md:grid-cols-[1fr_auto] md:items-center md:p-10">
        <div>
          <div className="kicker flex items-center gap-2" style={{ color: 'var(--color-gold)' }}><Icon name="trofeo" /> Mundiales · 1930–2026</div>
          <h2 className="mt-3 font-display text-4xl uppercase leading-[0.9] md:text-5xl">La historia de los Mundiales</h2>
          <p className="mt-3 max-w-2xl text-[var(--color-fg-muted)]">España, campeona de 2026. Las 23 ediciones, selecciones y camisetas, palmarés, goleadores, estadios, galería, récords y coleccionismo. Y el camino al Mundial 2030.</p>
          <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
            {[[String(HISTORY_TOTALS.editions), 'ediciones'], [fmtEs(HISTORY_TOTALS.matches), 'partidos'], [fmtEs(HISTORY_TOTALS.goals), 'goles'], [String(HISTORY_TOTALS.champions), 'campeones']].map(([n, l]) => (
              <div key={l} className="flex items-baseline gap-2"><dt className="n-l text-[var(--color-fg)]">{n}</dt><dd>{l}</dd></div>
            ))}
          </dl>
        </div>
        <Link href={withLocale(locale, '/mundiales')} className="inline-flex h-12 shrink-0 items-center gap-2 self-start rounded-full bg-[var(--color-gold)] px-6 text-sm font-bold text-black hover:opacity-90 md:self-center">
          Entrar en Mundiales <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
      </div>
    </section>
  );
}

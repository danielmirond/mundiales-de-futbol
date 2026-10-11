import Link from 'next/link';
import { ArrowRight, Trophy, Target, ListTree } from 'lucide-react';
import { TEAMS_2026 } from '@/lib/wc-2026';
import { resolveKnockoutFixture, koWinner } from '@/lib/wc-2026-knockout';
import { routing, type Locale } from '@/i18n/routing';

const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);

/** Bloque del Mundial 2026 ya cerrado: campeón, final y accesos al archivo. */
export async function WorldCup2026Closed({ locale }: { locale: Locale }) {
  const final = await resolveKnockoutFixture(104);
  const w = final && final.state === 'post' ? koWinner(final) : null;
  const champ = w ? (w === 'home' ? final!.home : final!.away) : undefined;
  const runner = w ? (w === 'home' ? final!.away : final!.home) : undefined;
  const t = (c?: string) => (c && TEAMS_2026[c]) || undefined;

  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 py-12 md:px-10">
      <div className="rounded-3xl border border-[var(--color-pitch)]/30 bg-[var(--color-bg-2)] p-8 md:p-10">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">Mundial 2026 · archivo</div>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
          <div>
            {champ ? (
              <>
                <h2 className="font-display text-4xl uppercase leading-none md:text-5xl">
                  <Trophy className="mr-2 inline h-8 w-8 text-[var(--color-pitch)]" />
                  {t(champ)?.flag} {t(champ)?.name}, campeón del mundo
                </h2>
                <p className="mt-3 text-[var(--color-fg-muted)]">
                  Final: {t(champ)?.name} {final!.homeScore}-{final!.awayScore} {t(runner)?.name}
                  {final!.shootoutHome != null ? ` (${final!.shootoutHome}-${final!.shootoutAway} pen.)` : ''} · 19 de julio · MetLife Stadium.
                </p>
              </>
            ) : (
              <h2 className="font-display text-4xl uppercase leading-none md:text-5xl">Revive el Mundial 2026</h2>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={withLocale(locale, '/2026/cuadro')} className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-sm font-semibold hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"><ListTree className="h-4 w-4" /> Cuadro completo</Link>
            <Link href={withLocale(locale, '/2026/goleadores')} className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-sm font-semibold hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"><Target className="h-4 w-4" /> Bota de Oro</Link>
            <Link href={withLocale(locale, '/2026')} className="inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-4 py-2 text-sm font-bold text-black hover:opacity-90">Todo el Mundial 2026 <ArrowRight className="h-3 w-3 rtl:rotate-180" /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}

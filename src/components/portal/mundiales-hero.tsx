import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { TEAMS_2026 } from '@/lib/wc-2026';
import { resolveKnockoutFixture, koWinner } from '@/lib/wc-2026-knockout';
import { getAllTournaments } from '@/lib/data/tournaments';
import { Icon } from '@/components/ui/icon';
import { routing, type Locale } from '@/i18n/routing';

const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);

/** Hero de Mundiales: campeón vigente arriba y selector de todas las ediciones debajo. */
export async function MundialesHero({ locale }: { locale: Locale }) {
  const [final, tournaments] = await Promise.all([resolveKnockoutFixture(104), getAllTournaments(locale)]);
  const w = final && final.state === 'post' ? koWinner(final) : null;
  const champ = w ? (w === 'home' ? final!.home : final!.away) : undefined;
  const runner = w ? (w === 'home' ? final!.away : final!.home) : undefined;
  const t = (c?: string) => (c && TEAMS_2026[c]) || undefined;
  const editions = [...tournaments].sort((a, b) => a.year - b.year)
    .map((ed) => (ed.year === 2026 && champ ? { ...ed, champion: t(champ)?.name ?? ed.champion } : ed));
  if (!editions.some((e) => e.year === 2030)) editions.push({ ...editions[editions.length - 1], year: 2030, slug: '2030', host: 'España · Portugal · Marruecos', champion: '', palette: { from: '#c60b1e', to: '#006233' } });
  const hrefOf = (year: number, slug: string) => (year === 2026 ? '/2026' : year === 2030 ? '/2030' : `/ediciones/${slug}`);

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,color-mix(in_oklab,var(--color-gold)_16%,transparent),transparent_70%)]" />
      <div className="mx-auto w-full max-w-[1400px] px-6 pb-10 md:px-10">
        <div className="kicker flex items-center gap-2" style={{ color: 'var(--color-gold)' }}><Icon name="trofeo" /> Mundiales · 1930–2030</div>
        <h1 className="mt-5 font-display text-fluid-display uppercase leading-[0.9]">
          <span className="block">Historia de</span>
          <span className="block text-[var(--color-gold)]">los Mundiales</span>
        </h1>

        {/* Campeón vigente */}
        <div className="mt-8 grid gap-5 rounded-[28px] border border-[color-mix(in_oklab,var(--color-gold)_45%,transparent)] bg-[var(--color-bg-2)] p-6 md:grid-cols-[auto_1fr_auto] md:items-center md:p-8">
          <span className="text-6xl leading-none md:text-7xl" aria-hidden>{t(champ)?.flag ?? '🏆'}</span>
          <div>
            <div className="sub-label">Campeón vigente · Mundial 2026</div>
            <div className="mt-2 font-display text-4xl uppercase leading-[0.9] md:text-5xl">{t(champ)?.name ?? 'Mundial 2026'}</div>
            {champ && (
              <p className="mt-2 text-[var(--color-fg-muted)]">
                Final: {t(champ)?.name} {final!.homeScore}-{final!.awayScore} {t(runner)?.name}{final!.shootoutHome != null ? ` (${final!.shootoutHome}-${final!.shootoutAway} pen.)` : ''} · 19 de julio de 2026 · MetLife Stadium.
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2 md:flex-col">
            <Link href={withLocale(locale, '/2026')} className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[var(--color-gold)] px-5 text-sm font-bold text-black hover:opacity-90">Mundial 2026 <ArrowRight className="h-4 w-4 rtl:rotate-180" /></Link>
            <Link href={withLocale(locale, '/2026/cuadro')} className="inline-flex h-10 items-center justify-center rounded-full border border-[var(--color-border-strong)] px-5 text-sm font-semibold hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]">Cuadro</Link>
          </div>
        </div>

        {/* Selector de ediciones */}
        <nav className="mt-8" aria-label="Elige un Mundial">
          <div className="sub-label mb-3">Elige un Mundial</div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
            {editions.map((ed) => {
              const current = ed.year === 2026, next = ed.year >= 2030;
              return (
                <Link key={ed.year} href={withLocale(locale, hrefOf(ed.year, ed.slug))} title={`${ed.year} · ${ed.host}${ed.champion ? ` · ${ed.champion}` : ''}`}
                  className={`group grid shrink-0 gap-1 rounded-[14px] border px-3.5 py-2.5 transition-colors ${current ? 'border-[var(--color-gold)] bg-[color-mix(in_oklab,var(--color-gold)_12%,transparent)]' : next ? 'border-dashed border-[var(--color-border-strong)]' : 'border-[var(--color-border)] hover:border-[var(--color-gold)]'}`}>
                  <span className="font-display text-2xl leading-none tab-num text-[var(--color-fg)]">{ed.year}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-fg-subtle)]">{ed.host}</span>
                  <span className="text-[12px] text-[var(--color-fg-muted)] group-hover:text-[var(--color-fg)]">{next ? 'Próximo' : ed.champion || 'Por disputar'}</span>
                  <span aria-hidden className="mt-1 h-1 rounded-full" style={{ background: `linear-gradient(90deg, ${ed.palette.from}, ${ed.palette.to})` }} />
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </section>
  );
}

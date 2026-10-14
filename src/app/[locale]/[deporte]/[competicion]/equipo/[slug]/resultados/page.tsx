import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { fetchTeam, fetchTeamSchedule } from '@/lib/espn-team';
import { loadTeam, teamBase } from '@/lib/team-page';
import { TeamHeader } from '@/components/portal/team-header';
import { FormChips } from '@/components/portal/standings-table';
import { routing, type Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';

// Regeneración periódica (ISR): rápida y estable sin pedir a las fuentes en cada visita.
export const revalidate = 900;
type Params = Promise<{ locale: string; deporte: string; competicion: string; slug: string }>;
const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);
const dayFmt = new Intl.DateTimeFormat('es', { timeZone: 'Europe/Madrid', weekday: 'short', day: 'numeric', month: 'short' });

export async function generateMetadata({ params }: { params: Params }) {
  const { locale, deporte, competicion, slug } = await params;
  const ctx = await loadTeam(deporte, competicion, slug);
  if (!ctx) return {};
  const { c, ref } = ctx;
  return pageMetadata({
    locale, path: `${teamBase(c, ref)}/resultados`,
    title: `Resultados del ${ref.name}: todos los partidos de la temporada · ${c.shortName ?? c.name}`,
    description: `Resultados del ${ref.name} en ${c.name} esta temporada: marcador de cada partido, racha de victorias, empates y derrotas y balance de goles.`,
    keywords: [`${ref.name} resultados`, `resultados ${ref.name}`, `${ref.name} último partido`, `${ref.name} racha`],
  });
}

export default async function TeamResultsPage({ params }: { params: Params }) {
  const { locale, deporte, competicion, slug } = await params;
  const ctx = await loadTeam(deporte, competicion, slug);
  if (!ctx) notFound();
  setRequestLocale(locale);
  const L = locale as Locale;
  const { s, c, ref } = ctx;
  const [team, schedule] = await Promise.all([fetchTeam(c, ref.id), fetchTeamSchedule(c, ref.id)]);
  const played = schedule.filter((g) => g.state === 'post').reverse();
  const w = played.filter((g) => g.result === 'W').length, d = played.filter((g) => g.result === 'D').length, l = played.filter((g) => g.result === 'L').length;
  const gf = played.reduce((a, g) => a + (g.gf ?? 0), 0), ga = played.reduce((a, g) => a + (g.ga ?? 0), 0);
  return (
    <main className="pt-28" data-sport={s.slug}>
      <TeamHeader ctx={ctx} locale={locale} section="resultados" title={`Resultados del ${ref.name}`} description={played.length ? `${played.length} partidos jugados en ${c.name}: ${w} victorias, ${d} empates y ${l} derrotas (${gf} a favor, ${ga} en contra).` : `El ${ref.name} aún no ha jugado en ${c.name} esta temporada.`} logo={team?.logo} color={team?.color} />
      {played.length > 0 && (
        <section className="mx-auto w-full max-w-[1400px] px-6 py-8 md:px-10">
          <div className="mb-5 flex items-center gap-3"><span className="sub-label !mb-0">Racha</span><FormChips results={played.slice(0, 10).map((g) => g.result ?? 'D')} /></div>
          <ul className="divide-y divide-[var(--color-border)] overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)]">
            {played.map((g) => (
              <li key={g.id}>
                <Link href={withLocale(L, `/${c.sport}/${c.slug}/partido/${g.id}`)} className="flex items-center gap-3 px-5 py-3 hover:bg-[var(--color-surface)]">
                  <span className="w-24 shrink-0 font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg-muted)]">{dayFmt.format(new Date(g.date).getTime())}</span>
                  <FormChips results={[g.result ?? 'D']} />
                  <span className="flex-1 truncate text-sm text-[var(--color-fg)]">{g.isHome ? 'vs' : 'en casa de'} <strong>{g.rival}</strong>{g.venue ? <span className="hidden text-[var(--color-fg-subtle)] md:inline"> · {g.venue}</span> : null}</span>
                  <span className="n-m tab-num text-[var(--color-fg)]">{g.gf}–{g.ga}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

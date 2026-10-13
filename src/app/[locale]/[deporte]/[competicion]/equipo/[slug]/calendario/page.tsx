import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { fetchTeam } from '@/lib/espn-team';
import { fetchWindow, dayKeys } from '@/lib/espn';
import { getWostiIndex } from '@/lib/wosti';
import { loadTeam, teamBase } from '@/lib/team-page';
import { TeamHeader } from '@/components/portal/team-header';
import { MatchRow, MatchList } from '@/components/portal/match-row';
import { routing, type Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';
type Params = Promise<{ locale: string; deporte: string; competicion: string; slug: string }>;
const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);

export async function generateMetadata({ params }: { params: Params }) {
  const { locale, deporte, competicion, slug } = await params;
  const ctx = await loadTeam(deporte, competicion, slug);
  if (!ctx) return {};
  const { c, ref } = ctx;
  return pageMetadata({
    locale, path: `${teamBase(c, ref)}/calendario`,
    title: `Calendario del ${ref.name}: próximos partidos, horarios y dónde ver · ${c.shortName ?? c.name}`,
    description: `Próximos partidos del ${ref.name} en ${c.name}: fecha, hora en España, rival, estadio y canal de televisión de los próximos 60 días.`,
    keywords: [`${ref.name} calendario`, `${ref.name} próximo partido`, `cuándo juega el ${ref.name}`, `${ref.name} horarios`, `dónde ver ${ref.name}`],
  });
}

export default async function TeamCalendarPage({ params }: { params: Params }) {
  const { locale, deporte, competicion, slug } = await params;
  const ctx = await loadTeam(deporte, competicion, slug);
  if (!ctx) notFound();
  setRequestLocale(locale);
  const L = locale as Locale;
  const { s, c, ref } = ctx;
  const [team, window, wosti] = await Promise.all([fetchTeam(c, ref.id), fetchWindow([c], dayKeys(0, 60), 600), s.slug === 'futbol' ? getWostiIndex() : Promise.resolve(new Map())]);
  const next = window.filter((m) => m.state !== 'post' && (m.home.id === ref.id || m.away.id === ref.id || m.home.abbr === ref.abbr || m.away.abbr === ref.abbr));
  const { channelsFor } = await import('@/lib/wosti');
  return (
    <main className="pt-28" data-sport={s.slug}>
      <TeamHeader ctx={ctx} locale={locale} section="calendario" title={`Calendario del ${ref.name}`} description={next.length ? `${next.length} partidos en los próximos 60 días en ${c.name}, con hora en España y canal de televisión.` : `Sin partidos programados en ${c.name} en los próximos 60 días.`} logo={team?.logo} color={team?.color} />
      <section className="mx-auto w-full max-w-[1400px] px-6 py-8 md:px-10">
        {next.length > 0 && (
          <MatchList sport={s.slug} kicker={c.name} title="Próximos partidos">
            {next.map((m) => (
              <MatchRow key={m.id} m={m} showDay channels={s.slug === 'futbol' ? channelsFor(wosti, m.date, [m.home.fullName, m.home.name], [m.away.fullName, m.away.name]) : []} href={withLocale(L, `/${c.sport}/${c.slug}/partido/${m.id}`)} teamHref={(id) => withLocale(L, `/${c.sport}/${c.slug}/equipo/${id}`)} />
            ))}
          </MatchList>
        )}
      </section>
    </main>
  );
}

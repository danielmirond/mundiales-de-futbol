import Link from 'next/link';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { fetchToday } from '@/lib/espn';
import { liveCompetitions } from '@/lib/competitions';
import { routing, type Locale } from '@/i18n/routing';
import { channelsFor, getWostiIndex } from '@/lib/wosti';
import { MatchRow, MatchList } from './match-row';
import { Icon } from '@/components/ui/icon';

const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);
const dayFmt = new Intl.DateTimeFormat('es', { timeZone: 'Europe/Madrid', weekday: 'long', day: 'numeric', month: 'long' });

/** Hero del portal: qué se juega hoy en todas las competiciones (en directo primero). */
export async function PortalHero({ locale }: { locale: Locale }) {
  const today = dayFmt.format(new Date());
  const matches = await fetchToday(liveCompetitions());
  const live = matches.filter((m) => m.state === 'in');
  const upcoming = matches.filter((m) => m.state === 'pre');
  const featured = [...live, ...upcoming, ...matches.filter((m) => m.state === 'post')].slice(0, 6);
  const sports = new Set(matches.map((m) => m.competition.sport)).size;
  const wosti = featured.some((m) => m.competition.sport === 'futbol') ? await getWostiIndex() : new Map();

  return (
    <section className="relative overflow-hidden pt-28 md:pt-36">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 pitch-glow opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg)]/30 via-[var(--color-bg)]/60 to-[var(--color-bg)]" />
      </div>
      <div className="mx-auto w-full max-w-[1400px] px-6 pb-12 md:px-10">
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          {live.length > 0 ? <i className="pulse" /> : <span className="inline-flex h-2 w-2 rounded-full bg-[var(--color-pitch)]" />}
          {live.length > 0 ? `${live.length} en directo ahora` : 'Resultados y calendario en directo'}
        </div>
        <h1 className="mt-6 font-display text-fluid-display uppercase leading-[0.9]">
          <span className="block text-[var(--color-fg)]">Hoy en juego</span>
          <span className="block bg-gradient-to-r from-[var(--color-pitch)] via-[var(--color-sun)] to-[var(--color-flame)] bg-clip-text text-transparent">
            {matches.length > 0 ? `${matches.length} partidos · ${sports} ${sports === 1 ? 'deporte' : 'deportes'}` : 'Fútbol, baloncesto y más'}
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-[var(--color-fg-muted)]">
          {today}. Marcadores en directo, calendario y clasificación de LaLiga, Champions, Premier, NBA, Euroliga y el resto de competiciones.
        </p>

        {featured.length > 0 && (
          <div className="mt-8 max-w-3xl">
            <MatchList sport="futbol" kicker={live.length > 0 ? 'En directo' : 'Destacados'} title="Hoy" more={{ href: withLocale(locale, '/partidos-hoy'), label: 'Todos los partidos' }}>
              {featured.map((m) => (
                <MatchRow
                  key={`${m.competition.slug}-${m.id}`}
                  m={m}
                  showCompetition
                  href={withLocale(locale, `/${m.competition.sport}/${m.competition.slug}/partido/${m.id}`)}
                  teamHref={(id) => withLocale(locale, `/${m.competition.sport}/${m.competition.slug}/equipo/${id}`)}
                  chipMax={1}
                  channels={m.competition.sport === 'futbol' ? channelsFor(wosti, m.date, [m.home.fullName, m.home.name], [m.away.fullName, m.away.name]) : []}
                />
              ))}
            </MatchList>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={withLocale(locale, '/partidos-hoy')} className="inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-bold text-black hover:opacity-90">
            <CalendarDays className="h-4 w-4" /> Todos los partidos de hoy <ArrowRight className="h-3 w-3 rtl:rotate-180" />
          </Link>
          <Link href={withLocale(locale, '/futbol')} className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm font-semibold hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"><Icon name="futbol" /> Fútbol</Link>
          <Link href={withLocale(locale, '/baloncesto')} className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm font-semibold hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"><Icon name="baloncesto" /> Baloncesto</Link>
        </div>
      </div>
    </section>
  );
}

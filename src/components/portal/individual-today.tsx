import Link from 'next/link';
import { COMPETITIONS } from '@/lib/competitions';
import { fetchRaceWeekend } from '@/lib/espn-racing';
import { fetchTennis } from '@/lib/espn-tennis';
import { Icon } from '@/components/ui/icon';
import { routing, type Locale } from '@/i18n/routing';

const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);
const MADRID = 'Europe/Madrid';
const dayTime = new Intl.DateTimeFormat('es-ES', { timeZone: MADRID, weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });

/** Portada: «Hoy en el motor y el tenis» (deportes sin partido local-visitante). */
export async function IndividualToday({ locale }: { locale: Locale }) {
  const f1 = COMPETITIONS.find((c) => c.slug === 'formula-1');
  const tennisComps = COMPETITIONS.filter((c) => c.stats === 'tennis' && c.feed);
  const [race, ...tennis] = await Promise.all([
    f1?.feed ? fetchRaceWeekend(f1.feed) : Promise.resolve({ weekend: null, calendar: [] }),
    ...tennisComps.map(async (c) => ({ c, ts: await fetchTennis(c.feed!) })),
  ]);
  const now = Date.now();
  const w = race.weekend;
  const nextSession = w?.sessions.find((s) => s.state !== 'post');
  const lastSession = w ? [...w.sessions].reverse().find((s) => s.state === 'post') : undefined;
  const nextGp = race.calendar.find((c) => new Date(c.end).getTime() > now);
  const tCards = tennis.flatMap(({ c, ts }) => ts.filter((t) => t.today.length > 0).map((t) => ({ c, t })));
  if (!w && tCards.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 py-12 md:px-10">
      <div className="kicker">Motor y tenis</div>
      <h2 className="t-h2 mt-3 text-[var(--color-fg)]">Hoy en el motor y el tenis</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {w && (
          <Link href={withLocale(locale, '/motor/formula-1')} data-sport="motor" className="group grid content-start gap-3 rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5 transition-colors hover:border-[var(--accent)]">
            <span className="flex items-center gap-2"><span className="grid h-9 w-9 place-items-center rounded-[10px] bg-[color-mix(in_oklab,var(--accent)_16%,transparent)] text-[var(--accent)]"><Icon name="motor" size={20} /></span><span className="kicker">Fórmula 1</span></span>
            <span className="text-[17px] font-semibold text-[var(--color-fg)] group-hover:text-[var(--accent-ink)]">{nextSession ? w.name : nextGp?.name ?? w.name}</span>
            {nextSession ? (
              <span className="text-sm text-[var(--color-fg-muted)]">{nextSession.state === 'in' ? <span className="inline-flex items-center gap-2 text-[var(--color-live-ink)]"><i className="pulse" />{nextSession.label} en curso</span> : `${nextSession.label}: ${dayTime.format(new Date(nextSession.date))}`}</span>
            ) : lastSession?.top[0] ? (
              <span className="text-sm text-[var(--color-fg-muted)]">{lastSession.label}: ganó {lastSession.top[0].name}{nextGp ? ` · siguiente, ${nextGp.name}` : ''}</span>
            ) : null}
          </Link>
        )}
        {tCards.slice(0, 4).map(({ c, t }) => {
          const live = t.today.filter((m) => m.state === 'in').length;
          const nextM = t.today.find((m) => m.state === 'pre');
          const done = t.today.filter((m) => m.state === 'post').length;
          return (
            <Link key={c.slug + t.id} href={withLocale(locale, `/tenis/${c.slug}`)} data-sport="tenis" className="group grid content-start gap-3 rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5 transition-colors hover:border-[var(--accent)]">
              <span className="flex items-center gap-2"><span className="grid h-9 w-9 place-items-center rounded-[10px] bg-[color-mix(in_oklab,var(--accent)_16%,transparent)] text-[var(--accent)]"><Icon name="tenis" size={20} /></span><span className="kicker">{c.name}{t.city ? ` · ${t.city}` : ''}</span></span>
              <span className="text-[17px] font-semibold text-[var(--color-fg)] group-hover:text-[var(--accent-ink)]">{t.name}</span>
              <span className="text-sm text-[var(--color-fg-muted)]">
                {live > 0 && <span className="mr-2 inline-flex items-center gap-1.5 text-[var(--color-live-ink)]"><i className="pulse" />{live} en juego</span>}
                {t.today.length} {t.today.length === 1 ? 'partido' : 'partidos'} hoy{done ? ` · ${done} terminados` : ''}{nextM ? ` · siguiente: ${nextM.a.name} - ${nextM.b.name}` : ''}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

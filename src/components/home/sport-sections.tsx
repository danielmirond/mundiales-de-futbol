import Link from 'next/link';
import type { ReactNode } from 'react';
import { getCompetition, liveCompetitions } from '@/lib/competitions';
import { fetchToday, fetchWindow, fetchStandings, dayKeys, type Match } from '@/lib/espn';
import { fetchLeaders } from '@/lib/leaders';
import { fetchRaceStandings, fetchRaceWeekend } from '@/lib/espn-racing';
import { fetchTennis } from '@/lib/espn-tennis';
import { fetchMotoGP } from '@/lib/motogp';
import { fetchNbaSalaries, usdShort } from '@/lib/nba-salaries';
import { proximasVeladas, veladaNombre } from '@/lib/boxeo';
import { getApertura } from '@/lib/apertura';
import { getLatestNews, newsImageUrl, newsImageAlt, NEWS_KIND_LABEL, newsKind, type NewsItem } from '@/lib/news';
import { Crest } from '@/components/portal/crest';
import { LiveStrip } from '@/components/feed/live-strip';
import { routing, type Locale } from '@/i18n/routing';

const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);
const MADRID = 'Europe/Madrid';
const hourFmt = new Intl.DateTimeFormat('es-ES', { timeZone: MADRID, hour: '2-digit', minute: '2-digit' });
const dayTime = new Intl.DateTimeFormat('es-ES', { timeZone: MADRID, weekday: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });

/* ---------- Mosaico: tamaños de widget ---------- */

export type WidgetSize = 'hero' | 'tall' | 'wide' | 'm' | 's';
const SIZE: Record<WidgetSize, string> = {
  hero: 'col-span-2 lg:col-span-6 lg:row-span-2',
  tall: 'col-span-2 lg:col-span-3 lg:row-span-2',
  wide: 'col-span-2 lg:col-span-6',
  m: 'col-span-2 lg:col-span-3',
  s: 'col-span-1 lg:col-span-3',
};

function Widget({ size, kicker, title, href, more, children, className = '' }: { size: WidgetSize; kicker: string; title?: string; href?: string; more?: string; children: ReactNode; className?: string }) {
  return (
    <article className={`${SIZE[size]} flex min-w-0 flex-col rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)] p-4 md:p-5 ${className}`}>
      <div className="kicker">{kicker}</div>
      {title && <h3 className="mt-1.5 text-[17px] font-semibold leading-snug text-[var(--color-fg)]">{title}</h3>}
      <div className="mt-3 flex-1">{children}</div>
      {href && <Link href={href} className="mt-3 inline-flex text-[13px] font-semibold text-[var(--accent-ink)] hover:underline">{more ?? 'Ver todo'} →</Link>}
    </article>
  );
}

/** Pieza de portada del deporte: foto a sangre y titular encima. */
function LeadNews({ n, locale, size = 'hero' }: { n: NewsItem; locale: Locale; size?: WidgetSize }) {
  return (
    <Link href={withLocale(locale, `/noticias/${n.slug}`)} className={`${SIZE[size]} group relative flex min-h-[260px] overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-black`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={newsImageUrl(n)} alt={newsImageAlt(n)} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
      <span className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />
      <span className="relative mt-auto flex flex-col gap-2 p-5 md:p-6">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]">{n.competition?.name ?? NEWS_KIND_LABEL[newsKind(n)]}</span>
        <span className="text-[20px] font-semibold leading-[1.15] text-white md:text-[26px]">{n.title}</span>
      </span>
    </Link>
  );
}

function NewsList({ items, locale }: { items: NewsItem[]; locale: Locale }) {
  return (
    <ul className="divide-y divide-[var(--color-border)]">
      {items.map((n) => (
        <li key={n.slug}><Link href={withLocale(locale, `/noticias/${n.slug}`)} className="block py-2.5 text-[14px] font-medium leading-snug text-[var(--color-fg)] hover:text-[var(--accent-ink)]">{n.title}</Link></li>
      ))}
    </ul>
  );
}

function MatchLines({ matches, locale }: { matches: Match[]; locale: Locale }) {
  return (
    <ul className="divide-y divide-[var(--color-border)]">
      {matches.map((m) => {
        const live = m.state === 'in';
        const status = live ? (m.clock ?? m.status) : m.state === 'post' ? 'Final' : hourFmt.format(new Date(m.date));
        return (
          <li key={`${m.competition.slug}-${m.id}`}>
            <Link href={withLocale(locale, `/${m.competition.sport}/${m.competition.slug}/partido/${m.id}`)} className="grid grid-cols-[1fr_auto] items-center gap-x-3 py-2 hover:text-[var(--accent-ink)]">
              <span className="min-w-0">
                {[m.home, m.away].map((t, i) => (
                  <span key={i} className="flex items-center justify-between gap-2 text-[13px] leading-tight text-[var(--color-fg)]">
                    <span className="flex min-w-0 items-center gap-1.5"><Crest src={t.logo} abbr={t.abbr} size="s" /><span className="truncate">{t.name}</span></span>
                    {m.state !== 'pre' && <span className="font-mono tab-num">{t.score ?? '-'}</span>}
                  </span>
                ))}
              </span>
              <span className={`w-14 text-right font-mono text-[10px] uppercase tracking-[0.1em] ${live ? 'text-[var(--color-live-ink)]' : 'text-[var(--color-fg-subtle)]'}`}>{status}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function MiniTable({ rows, valueLabel, locale, teamBase }: { rows: { rank: number; name: string; abbr?: string; logo?: string; value: string; id?: string }[]; valueLabel: string; locale: Locale; teamBase?: string }) {
  return (
    <table className="w-full border-collapse text-[13px]">
      <thead><tr className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]"><th className="w-6 pb-1.5 text-left font-medium">#</th><th className="pb-1.5 text-left font-medium">Equipo</th><th className="pb-1.5 text-right font-medium">{valueLabel}</th></tr></thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.name} className="border-t border-[var(--color-border)]">
            <td className="py-1.5 font-mono text-[11px] tab-num text-[var(--color-fg-subtle)]">{r.rank}</td>
            <td className="py-1.5 text-[var(--color-fg)]">
              {teamBase && r.id ? (
                <Link href={withLocale(locale, `${teamBase}/${r.id}`)} className="flex min-w-0 items-center gap-1.5 hover:text-[var(--accent-ink)]"><Crest src={r.logo} abbr={r.abbr ?? r.name.slice(0, 3)} size="s" /><span className="truncate">{r.name}</span></Link>
              ) : <span className="flex min-w-0 items-center gap-1.5">{r.logo || r.abbr ? <Crest src={r.logo} abbr={r.abbr ?? r.name.slice(0, 3)} size="s" /> : null}<span className="truncate">{r.name}</span></span>}
            </td>
            <td className="py-1.5 text-right font-semibold tab-num text-[var(--color-fg)]">{r.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Cabecera de sección + mosaico + carrusel del deporte. */
function SportSection({ sport, title, href, locale, children, carouselTitle }: { sport: string; title: string; href: string; locale: Locale; children: ReactNode; carouselTitle: string }) {
  return (
    <div data-sport={sport}>
      <section className="mx-auto w-full max-w-[1400px] px-6 pt-14 md:px-10" aria-labelledby={`sec-${sport}`}>
        <div className="flex items-end justify-between gap-4 border-b border-[var(--color-border)] pb-3">
          <h2 id={`sec-${sport}`} className="font-display text-[34px] uppercase leading-none text-[var(--color-fg)] md:text-[44px]">{title}</h2>
          <Link href={withLocale(locale, href)} className="shrink-0 text-[13px] font-semibold text-[var(--accent-ink)] hover:underline">Todo {title.toLowerCase()} →</Link>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-12">{children}</div>
      </section>
      {/* Carrusel del deporte: prensa, piezas propias y marcadores, deslizando. */}
      <LiveStrip locale={locale} sport={sport} title={carouselTitle} className="pt-6" />
    </div>
  );
}

// La apertura ya sale arriba: no se repite en los bloques de cada deporte.
const newsOf = (sport: string, n = 80) => {
  const apertura = getApertura()?.slug;
  return getLatestNews(n).filter((x) => x.slug !== apertura && (x.competition?.sport ?? 'futbol') === sport);
};
/** La pieza grande: la propia más reciente con foto; si no hay, la más reciente. */
const leadOf = (items: NewsItem[]) => items.find((n) => newsKind(n) === 'noticia' && n.image) ?? items.find((n) => n.image) ?? items[0];

/* ---------- Fútbol ---------- */

export async function FootballSection({ locale }: { locale: Locale }) {
  const laliga = getCompetition('futbol', 'laliga')!;
  const [today, table, leaders] = await Promise.all([fetchToday(liveCompetitions('futbol')), fetchStandings(laliga), fetchLeaders(laliga, 5)]);
  const news = newsOf('futbol');
  const lead = leadOf(news);
  const games = [...today].sort((a, b) => Number(b.state === 'in') - Number(a.state === 'in') || a.date.localeCompare(b.date)).slice(0, 4);
  const rows = (table.groups[0]?.rows ?? []).slice(0, 8);
  return (
    <SportSection sport="futbol" title="Fútbol" href="/futbol" locale={locale} carouselTitle="Lo último del fútbol">
      {lead && <LeadNews n={lead} locale={locale} />}
      {rows.length > 0 && (
        <Widget size="tall" kicker="LaLiga" title="Clasificación" href={withLocale(locale, '/futbol/laliga/clasificacion')} more="Tabla completa">
          <MiniTable rows={rows.map((r) => ({ rank: r.rank, name: r.name, abbr: r.abbr, logo: r.logo, value: r.stats.points ?? '–' }))} valueLabel="Pts" locale={locale} />
        </Widget>
      )}
      <Widget size="m" kicker={games.some((g) => g.state === 'in') ? 'En directo' : 'Hoy'} title="Partidos de hoy" href={withLocale(locale, '/partidos-hoy')} more="Todos los partidos">
        {games.length ? <MatchLines matches={games} locale={locale} /> : <p className="text-[13px] text-[var(--color-fg-muted)]">Hoy no hay partidos en las ligas que seguimos.</p>}
      </Widget>
      {leaders.goals.length > 0 && (
        <Widget size="m" kicker="LaLiga" title="Máximos goleadores" href={withLocale(locale, '/futbol/laliga/goleadores')} more="Goleadores">
          <MiniTable rows={leaders.goals.map((g) => ({ rank: g.rank, name: g.name, logo: g.team?.logo, abbr: g.team?.abbr, value: String(g.value) }))} valueLabel="Goles" locale={locale} />
        </Widget>
      )}
      {news.length > 1 && (
        <Widget size="wide" kicker="Noticias" title="Más fútbol">
          <NewsList items={news.filter((n) => n !== lead).slice(0, 4)} locale={locale} />
        </Widget>
      )}
    </SportSection>
  );
}

/* ---------- Baloncesto ---------- */

export async function BasketballSection({ locale }: { locale: Locale }) {
  const nba = getCompetition('baloncesto', 'nba')!;
  const euro = getCompetition('baloncesto', 'euroliga')!;
  const [last, euroTable, pay] = await Promise.all([fetchWindow([nba], dayKeys(-1, 0), 300), fetchStandings(euro), fetchNbaSalaries()]);
  const nights = last.filter((m) => m.state === 'post').sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const news = newsOf('baloncesto');
  const lead = leadOf(news);
  const rows = (euroTable.groups[0]?.rows ?? []).slice(0, 8);
  const spaniards = pay?.all.filter((p) => p.country === 'España') ?? [];
  return (
    <SportSection sport="baloncesto" title="Baloncesto" href="/baloncesto" locale={locale} carouselTitle="Lo último del baloncesto">
      {lead && <LeadNews n={lead} locale={locale} />}
      {rows.length > 0 && (
        <Widget size="tall" kicker="Euroliga" title="Clasificación" href={withLocale(locale, '/baloncesto/euroliga/clasificacion')} more="Tabla completa">
          <MiniTable rows={rows.map((r) => ({ rank: r.rank, name: r.name, abbr: r.abbr, logo: r.logo, value: `${r.stats.wins ?? '–'}-${r.stats.losses ?? '–'}` }))} valueLabel="G-P" locale={locale} />
        </Widget>
      )}
      <Widget size="m" kicker="NBA" title="Resultados de anoche" href={withLocale(locale, '/baloncesto/nba/resultados')} more="Todos los resultados">
        {nights.length ? <MatchLines matches={nights} locale={locale} /> : <p className="text-[13px] text-[var(--color-fg-muted)]">Anoche no hubo partidos de la NBA.</p>}
      </Widget>
      {pay && pay.ranked.length > 0 && (
        <Widget size="m" kicker={`NBA ${pay.label}`} title="Los sueldos más altos" href={withLocale(locale, '/baloncesto/nba/salarios')} more="Todos los sueldos">
          <ul className="space-y-1.5 text-[13px]">
            {pay.ranked.slice(0, 3).map((p, i) => (
              <li key={p.id} className="flex items-center justify-between gap-2"><Link href={withLocale(locale, `/baloncesto/nba/jugador/${p.id}`)} className="truncate text-[var(--color-fg)] hover:text-[var(--accent-ink)]">{i + 1}. {p.name}</Link><span className="font-semibold tab-num">{usdShort(p.salary ?? 0)}</span></li>
            ))}
          </ul>
          {spaniards.length > 0 && (
            <p className="mt-3 border-t border-[var(--color-border)] pt-2.5 text-[12px] leading-relaxed text-[var(--color-fg-muted)]">
              Españoles: {spaniards.map((p) => `${p.name} (${usdShort(p.history[0].salary)})`).join(', ')}.
            </p>
          )}
        </Widget>
      )}
      {news.length > 1 && (
        <Widget size="wide" kicker="Noticias" title="Más baloncesto">
          <NewsList items={news.filter((n) => n !== lead).slice(0, 4)} locale={locale} />
        </Widget>
      )}
    </SportSection>
  );
}

/* ---------- Motor ---------- */

/** Primera carrera del calendario que aún no ha pasado (con un día de margen). */
function nextRace(cal: { name: string; start: string; end: string }[]) {
  const since = Date.now() - 86_400_000;
  return cal.find((c) => new Date(c.end || c.start).getTime() >= since);
}

export async function MotorSection({ locale }: { locale: Locale }) {
  const [moto, f1, f1Weekend, indy] = await Promise.all([
    fetchMotoGP(), fetchRaceStandings({ sport: 'racing', league: 'f1' }), fetchRaceWeekend({ sport: 'racing', league: 'f1' }), fetchRaceStandings({ sport: 'racing', league: 'irl' }),
  ]);
  const news = newsOf('motor');
  const lead = leadOf(news);
  const [a, b] = moto?.standings.MotoGP ?? [];
  const race = moto?.next?.sessions.find((s) => s.type === 'RAC');
  const gap = a && b ? a.points - b.points : 0;
  const share = a && b ? Math.round((a.points / (a.points + b.points)) * 100) : 50;
  const f1Next = nextRace(f1Weekend.calendar);
  const champ = indy.drivers[0];
  return (
    <SportSection sport="motor" title="Motor" href="/motor" locale={locale} carouselTitle="Lo último del motor">
      {a && b && (
        <Widget size="wide" kicker={`MotoGP · Mundial ${moto?.year}`} title={`${a.name} y ${b.name}, separados por ${gap} ${gap === 1 ? 'punto' : 'puntos'}`} href={withLocale(locale, '/motor/motogp')} more="Clasificación y horarios">
          <div className="flex items-center justify-between text-[13px] font-semibold text-[var(--color-fg)]"><span>{a.name} · {a.points}</span><span>{b.points} · {b.name}</span></div>
          <div className="mt-2 flex h-3 overflow-hidden rounded-full bg-[var(--color-border)]" role="img" aria-label={`${a.name} ${a.points} puntos, ${b.name} ${b.points} puntos`}>
            <span className="bg-[var(--accent)]" style={{ width: `${share}%` }} /><span className="flex-1 bg-[color-mix(in_oklab,var(--accent)_35%,transparent)]" />
          </div>
          <p className="mt-3 text-[13px] text-[var(--color-fg-muted)]">
            {a.name}: {a.wins} {a.wins === 1 ? 'victoria' : 'victorias'} y {a.podiums} podios. {b.name}: {b.wins} {b.wins === 1 ? 'victoria' : 'victorias'} y {b.podiums} podios.
            {moto?.next && race ? ` Próxima carrera: ${moto.next.event.name}, ${dayTime.format(new Date(race.date))} (hora peninsular).` : ''}
          </p>
        </Widget>
      )}
      {lead && <LeadNews n={lead} locale={locale} />}
      {f1.drivers.length > 0 && (
        <Widget size="m" kicker="Fórmula 1" title="Mundial de pilotos" href={withLocale(locale, '/motor/formula-1')} more={f1Next ? `Próximo: ${f1Next.name.replace(/^Gran Premio de /, 'GP de ')}` : 'Calendario y clasificación'}>
          <MiniTable rows={f1.drivers.slice(0, 5).map((d) => ({ rank: d.rank, name: d.name, value: String(d.points) }))} valueLabel="Pts" locale={locale} />
        </Widget>
      )}
      {champ && (
        <Widget size="m" kicker="IndyCar" title={`${champ.name}, ${champ.points} puntos`} href={withLocale(locale, '/motor/indycar')} more="Clasificación IndyCar">
          <p className="text-[13px] leading-relaxed text-[var(--color-fg-muted)]">{indy.drivers[1] ? `${indy.drivers[1].points} para ${indy.drivers[1].name}, segundo.` : ''}</p>
        </Widget>
      )}
    </SportSection>
  );
}

/* ---------- Tenis ---------- */

export async function TennisSection({ locale }: { locale: Locale }) {
  const [atp, wta] = await Promise.all([fetchTennis({ sport: 'tennis', league: 'atp' }), fetchTennis({ sport: 'tennis', league: 'wta' })]);
  const news = newsOf('tenis');
  const lead = leadOf(news);
  const block = (ts: typeof atp, tour: string, href: string) => {
    const t = ts.find((x) => x.today.length) ?? ts[0];
    if (!t) return null;
    // Los partidos con españoles, delante.
    const ms = [...t.today, ...t.recent].sort((x, y) => Number([y.a, y.b].some((p) => p.country === 'España')) - Number([x.a, x.b].some((p) => p.country === 'España'))).slice(0, 4);
    return (
      <Widget size="m" kicker={tour} title={t.name} href={withLocale(locale, href)} more={`Todo el ${tour}`}>
        <ul className="divide-y divide-[var(--color-border)] text-[13px]">
          {ms.map((m) => (
            <li key={m.id} className="py-2">
              <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">{m.round}{m.state === 'in' ? ' · en juego' : ''}</div>
              {[m.a, m.b].map((p, i) => (
                <div key={i} className={`flex justify-between gap-2 ${p.winner ? 'font-semibold text-[var(--color-fg)]' : 'text-[var(--color-fg-muted)]'}`}><span className="truncate">{p.name}{p.country === 'España' ? <span className="ml-1 font-mono text-[9px] text-[var(--accent-ink)]">ESP</span> : null}</span><span className="font-mono tab-num">{p.sets.join(' ')}</span></div>
              ))}
            </li>
          ))}
        </ul>
      </Widget>
    );
  };
  return (
    <SportSection sport="tenis" title="Tenis" href="/tenis" locale={locale} carouselTitle="Lo último del tenis">
      {lead && <LeadNews n={lead} locale={locale} />}
      {block(atp, 'ATP', '/tenis/atp')}
      {block(wta, 'WTA', '/tenis/wta')}
    </SportSection>
  );
}

/* ---------- Más deportes ---------- */

export async function MoreSportsSection({ locale }: { locale: Locale }) {
  const velada = proximasVeladas()[0];
  const news = getLatestNews(80).filter((n) => !['futbol', 'baloncesto', 'motor', 'tenis'].includes(n.competition?.sport ?? 'futbol')).slice(0, 4);
  if (!velada && !news.length) return null;
  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 pt-12 md:px-10" aria-labelledby="sec-mas">
      <div className="border-b border-[var(--color-border)] pb-3"><h2 id="sec-mas" className="font-display text-[34px] uppercase leading-none text-[var(--color-fg)] md:text-[44px]">Más deportes</h2></div>
      <div className="mt-5 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-12">
        {velada && (
          <Widget size="m" kicker="Boxeo · próxima velada" title={veladaNombre(velada)} href={withLocale(locale, `/combate/boxeo/velada/${velada.slug}`)} more="Horario y dónde verla">
            <p className="text-[13px] leading-relaxed text-[var(--color-fg-muted)]">{velada.titulo} · {velada.sede}, {velada.ciudad}.</p>
          </Widget>
        )}
        {news.map((n) => (n.image ? <LeadNews key={n.slug} n={n} locale={locale} size="m" /> : null))}
      </div>
    </section>
  );
}

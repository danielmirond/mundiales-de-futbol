import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, MapPin, Tv } from 'lucide-react';
import { getSport, getCompetition } from '@/lib/competitions';
import { fetchEventSummary } from '@/lib/wc-2026-match-summary';
import { getWostiIndex, channelsFor } from '@/lib/wosti';
import { LiveMatchSummary } from '@/components/match/live-match-summary';
import { MovistarCintillo } from '@/components/affiliate/movistar-banner';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';

export const dynamic = 'force-dynamic';

const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);
const SAFE_ID = /^[0-9]{5,12}$/;
const SPORT_EMOJI: Record<string, string> = { futbol: '⚽', baloncesto: '🏀', rugby: '🏉' };

const dateFmt = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', weekday: 'long', day: 'numeric', month: 'long' });
const timeFmt = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });

type Params = Promise<{ locale: string; deporte: string; competicion: string; id: string }>;

async function load(deporte: string, competicion: string, id: string) {
  const s = getSport(deporte);
  const c = getCompetition(deporte, competicion);
  if (!s || !c || !c.espn || !SAFE_ID.test(id)) return null;
  const summary = await fetchEventSummary(c.espn, id);
  if (!summary?.header?.home.name) return null;
  return { s, c, summary };
}

export async function generateMetadata({ params }: { params: Params }) {
  const { locale, deporte, competicion, id } = await params;
  const data = await load(deporte, competicion, id);
  if (!data) return {};
  const { c, summary } = data;
  const h = summary.header!;
  const hasLive = summary.hasLineups || summary.hasCommentary;
  return pageMetadata({
    locale,
    path: `/${c.sport}/${c.slug}/partido/${id}`,
    title: `${h.home.name} - ${h.away.name}: resultado${hasLive ? ', alineaciones y narración' : ' y estadísticas'} · ${c.name}`,
    description: `${h.home.name} contra ${h.away.name} en ${c.name}: marcador en directo, alineaciones, momentos clave, narración minuto a minuto, estadísticas y dónde ver el partido en TV.`,
    keywords: [`${h.home.name} ${h.away.name}`, `${h.home.name} - ${h.away.name}`, `${h.home.name} ${h.away.name} resultado`, `${h.home.name} ${h.away.name} alineaciones`, `${h.home.name} ${h.away.name} dónde ver`, c.name.toLowerCase()],
    type: 'article',
  });
}

export default async function PartidoPortalPage({ params }: { params: Params }) {
  const { locale, deporte, competicion, id } = await params;
  const data = await load(deporte, competicion, id);
  if (!data) notFound();
  setRequestLocale(locale);
  const L = locale as Locale;
  const { s, c, summary } = data;
  const h = summary.header!;
  const played = summary.state === 'post' && summary.homeScore != null && summary.awayScore != null;
  const live = summary.state === 'in';
  const ms = h.date ? new Date(h.date).getTime() : 0;
  const emoji = SPORT_EMOJI[s.slug] ?? '🏟️';
  const channels = s.slug === 'futbol' && h.date
    ? channelsFor(await getWostiIndex(), h.date, [h.home.name], [h.away.name])
    : [];

  // Cada equipo enlaza a su página (calendario, resultados, plantilla) por id ESPN.
  const Side = ({ t, win }: { t: { id?: string; name: string; logo?: string }; win: boolean }) => {
    const inner = (
      <span className="flex flex-1 flex-col items-center gap-2 text-center">
        {t.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={t.logo} alt="" width={64} height={64} className="h-14 w-14 object-contain md:h-16 md:w-16" />
        ) : (
          <span className="text-5xl leading-none" aria-hidden>{emoji}</span>
        )}
        <span className={`font-display text-xl uppercase leading-tight md:text-3xl ${win ? 'text-[var(--color-fg)]' : 'text-[var(--color-fg-muted)]'}`}>{t.name}</span>
      </span>
    );
    return t.id ? (
      <Link href={withLocale(L, `/${c.sport}/${c.slug}/equipo/${t.id}`)} className="flex flex-1 transition-colors hover:text-[var(--color-pitch)]">{inner}</Link>
    ) : inner;
  };

  return (
    <article className="pt-32">
      <JsonLd data={[
        breadcrumbLd(locale, [
          { name: 'Inicio', path: '/' },
          { name: s.name, path: `/${s.slug}` },
          { name: c.name, path: `/${c.sport}/${c.slug}` },
          { name: `${h.home.name} - ${h.away.name}`, path: `/${c.sport}/${c.slug}/partido/${id}` },
        ]),
        {
          '@context': 'https://schema.org',
          '@type': 'SportsEvent',
          name: `${h.home.name} - ${h.away.name}`,
          sport: s.name,
          ...(ms ? { startDate: new Date(ms).toISOString() } : {}),
          eventStatus: 'https://schema.org/EventScheduled',
          ...(h.venue ? { location: { '@type': 'Place', name: h.venue } } : {}),
          competitor: [{ '@type': 'SportsTeam', name: h.home.name }, { '@type': 'SportsTeam', name: h.away.name }],
          superEvent: { '@type': 'SportsEvent', name: c.name },
          url: localeUrl(locale, `/${c.sport}/${c.slug}/partido/${id}`),
        },
      ]} />

      <header className="mx-auto w-full max-w-[1000px] px-6 md:px-10">
        <Link href={withLocale(L, `/${c.sport}/${c.slug}`)} className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> {c.name}
        </Link>
        <div className="mt-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <span>{c.flag ? `${c.flag} ` : ''}{c.name}</span>
          <span className="text-[var(--color-fg-subtle)]">· {s.name}</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          {h.home.name} <span className="text-[var(--color-fg-subtle)]">·</span> {h.away.name}
        </h1>
      </header>

      <section className="mx-auto mt-10 w-full max-w-[1000px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-8 md:p-10">
          <div className="flex items-center gap-3">
            <Side t={h.home} win={played && summary.homeScore! > summary.awayScore!} />
            <span className="shrink-0 px-2 text-center">
              {played || live ? (
                <span className="font-display tab-num text-4xl text-[var(--color-fg)] md:text-6xl">
                  {summary.homeScore ?? 0}<span className="mx-1 text-[var(--color-fg-subtle)]">-</span>{summary.awayScore ?? 0}
                </span>
              ) : (
                <span className="font-display text-2xl text-[var(--color-fg-subtle)]">vs</span>
              )}
              {live && <div className="mt-1 font-mono text-[9px] uppercase tracking-widest text-[var(--color-flame)]">🔴 {summary.clock || 'EN VIVO'}</div>}
              {played && !live && <div className="mt-1 font-mono text-[9px] uppercase tracking-widest text-[var(--color-fg-subtle)]">Final</div>}
            </span>
            <Side t={h.away} win={played && summary.awayScore! > summary.homeScore!} />
          </div>

          <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-3">
            <div className="bg-[var(--color-bg)] p-4 text-center">
              <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">Fecha</div>
              <div className="mt-1 text-sm font-medium capitalize text-[var(--color-fg)]">{ms ? dateFmt.format(ms) : '—'}</div>
            </div>
            <div className="bg-[var(--color-bg)] p-4 text-center">
              <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">Hora (España)</div>
              <div className="mt-1 text-sm font-medium tab-num text-[var(--color-fg)]">{ms ? `${timeFmt.format(ms)} h` : '—'}</div>
            </div>
            <div className="bg-[var(--color-bg)] p-4 text-center">
              <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">Dónde ver</div>
              <div className="mt-1 flex items-center justify-center gap-1.5 text-sm font-medium text-[var(--color-fg)]">
                <Tv className="h-3.5 w-3.5 text-[var(--color-pitch)]" />
                {channels.length > 0 ? channels.slice(0, 3).join(' · ') : s.slug === 'futbol' ? 'Por confirmar' : '—'}
              </div>
            </div>
          </div>

          {h.venue && (
            <div className="mt-4 flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--color-fg-muted)]">
              <MapPin className="h-3.5 w-3.5" /> {h.venue}
            </div>
          )}
        </div>
      </section>

      {s.slug === 'futbol' && (
        <section className="mx-auto mt-8 w-full max-w-[1000px] px-6 md:px-10">
          <MovistarCintillo context={`${h.home.name} - ${h.away.name}`} />
        </section>
      )}

      {/* Live-blog: alineaciones · momentos · narración · stats (auto-refresh si en directo) */}
      <LiveMatchSummary
        initial={summary}
        eventId={id}
        home={h.home.abbr}
        away={h.away.abbr}
        homeName={h.home.name}
        awayName={h.away.name}
        homeFlag={emoji}
        awayFlag={emoji}
        espn={c.espn!}
      />

      <section className="mx-auto mt-10 w-full max-w-[1000px] px-6 pb-16 md:px-10">
        <Link href={withLocale(L, `/${c.sport}/${c.slug}`)} className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-sm font-semibold hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
          Calendario y clasificación de {c.shortName ?? c.name}
        </Link>
      </section>
    </article>
  );
}

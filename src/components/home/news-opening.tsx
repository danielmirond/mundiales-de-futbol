import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { getLatestNews, newsImageUrl, newsImageAlt, type NewsItem } from '@/lib/news';
import { getApertura, leadParagraph, type AperturaScope } from '@/lib/apertura';
import { newsKicker, newsByline } from '@/components/news/news-card';
import { routing, type Locale } from '@/i18n/routing';
import { fetchToday } from '@/lib/espn';
import { liveCompetitions, COMPETITIONS } from '@/lib/competitions';
import { fetchEventSummary } from '@/lib/wc-2026-match-summary';
import { liveWeight, LIVE_THRESHOLD } from '@/lib/live-importance';
import { channelsFor, getWostiIndex } from '@/lib/wosti';
import { LiveOpeningBoard } from './live-opening-board';

const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);

/** Piezas que acompañan a la apertura: primero de la misma competición, luego lo último. */
function companions(lead: NewsItem, scope: AperturaScope, n = 3): NewsItem[] {
  const pool = getLatestNews(scope.sport ? 200 : 30).filter(
    (x) => x.slug !== lead.slug && (!scope.sport || (x.competition?.sport ?? 'futbol') === scope.sport) && (!scope.competition || x.competition?.slug === scope.competition),
  );
  const same = lead.competition ? pool.filter((x) => x.competition?.slug === lead.competition!.slug) : [];
  return [...same, ...pool.filter((x) => !same.includes(x))].slice(0, n);
}

/**
 * Apertura de sección (portada, deporte o competición). Si hay un directo
 * importante (ver `live-importance.ts`), abre el directo; si no, la noticia que la abre,
 * con foto grande, titular y su entradilla como preview, más tres piezas
 * relacionadas debajo. Sin pieza reciente de la sección no se pinta.
 */
export async function NewsOpening({ locale, scope = {}, className = '' }: { locale: Locale; scope?: AperturaScope; className?: string }) {
  const live = await LiveOpening({ locale, scope, className });
  if (live) return live;
  const lead = getApertura(scope);
  if (!lead) return null;
  const href = withLocale(locale, `/noticias/${lead.slug}`);
  const more = companions(lead, scope);

  return (
    <section aria-labelledby="apertura-titular" data-sport={lead.competition?.sport} className={`mx-auto w-full max-w-[1400px] px-6 pt-8 md:px-10 md:pt-12 ${className}`}>
      <article className="grid gap-6 md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] md:items-center md:gap-10">
        <Link href={href} tabIndex={-1} aria-hidden className="relative block overflow-hidden rounded-[14px] bg-[var(--color-surface)]" style={{ aspectRatio: '16/9' }}>
          <Image src={newsImageUrl(lead)} alt={newsImageAlt(lead)} fill priority sizes="(max-width: 768px) 100vw, 58vw" className="object-cover" unoptimized />
          {lead.image?.credit && (
            <span className="absolute bottom-2.5 right-3 rounded bg-black/45 px-1.5 py-0.5 font-mono text-[10px] text-white/85">{lead.image.credit.replace(' · Wikimedia Commons', '')}</span>
          )}
        </Link>
        <div className="grid content-center gap-4">
          <span className="kicker">{newsKicker(lead)}</span>
          <h2 id="apertura-titular" className="text-[30px] font-semibold leading-[1.05] tracking-[-0.032em] text-[var(--color-fg)] [text-wrap:balance] md:text-[44px]">
            <Link href={href} className="hover:underline hover:decoration-2 hover:underline-offset-[6px]">{lead.title}</Link>
          </h2>
          <p className="text-[17px] leading-[1.6] text-[var(--color-fg-muted)]">{leadParagraph(lead)}</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link href={href} className="group inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-bold text-black hover:opacity-90">
              Leer la noticia <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
            </Link>
            <span className="font-mono text-[11px] leading-[1.4] tracking-[0.03em] text-[var(--color-fg-subtle)]">{newsByline(lead, true)}</span>
          </div>
        </div>
      </article>

      {more.length > 0 && (
        <ul className="mt-8 grid gap-x-8 border-t border-[var(--color-border)] md:grid-cols-3">
          {more.map((n) => (
            <li key={n.slug} data-sport={n.competition?.sport} className="border-b border-[var(--color-border)] py-4 md:border-b-0">
              <Link href={withLocale(locale, `/noticias/${n.slug}`)} className="group grid gap-1.5 text-[var(--color-fg)]">
                <span className="kicker">{newsKicker(n)}</span>
                <b className="text-[16px] font-semibold leading-[1.3] tracking-[-0.01em] group-hover:underline group-hover:underline-offset-4">{n.title}</b>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/**
 * Apertura en directo: el partido en juego con más peso de la sección. En portada
 * y deportes solo si supera el umbral; en una competición, cualquier directo suyo.
 */
async function LiveOpening({ locale, scope, className }: { locale: Locale; scope: AperturaScope; className: string }) {
  const comps = liveCompetitions(scope.sport).filter((c) => !scope.competition || c.slug === scope.competition);
  if (comps.length === 0) return null;
  const threshold = scope.competition ? 0 : LIVE_THRESHOLD;
  const [m] = (await fetchToday(comps))
    .filter((x) => x.state === 'in' && liveWeight(x) >= threshold)
    .sort((a, b) => liveWeight(b) - liveWeight(a));
  if (!m) return null;
  const c = COMPETITIONS.find((x) => x.sport === m.competition.sport && x.slug === m.competition.slug);
  if (!c?.espn) return null;
  const summary = await fetchEventSummary(c.espn, m.id, m.home.abbr, m.away.abbr, 30);
  if (!summary?.header) return null;
  const channels = c.sport === 'futbol' ? channelsFor(await getWostiIndex(), m.date, [m.home.fullName, m.home.name], [m.away.fullName, m.away.name]) : [];
  const base = `/${c.sport}/${c.slug}`;
  return (
    <section aria-label={`En directo: ${m.home.name} - ${m.away.name}`} data-sport={c.sport} className={`mx-auto w-full max-w-[1000px] px-4 pt-8 md:px-10 md:pt-12 ${className}`}>
      <LiveOpeningBoard
        initial={summary}
        eventId={m.id}
        espn={c.espn}
        href={withLocale(locale, `${base}/partido/${m.id}`)}
        board={{ sport: c.sport, competition: { name: c.name, href: withLocale(locale, base) }, channels, teamBase: withLocale(locale, `${base}/equipo`) }}
      />
    </section>
  );
}

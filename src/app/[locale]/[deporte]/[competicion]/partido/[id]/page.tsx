import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';
import { getSport, getCompetition } from '@/lib/competitions';
import { fetchEventSummary } from '@/lib/wc-2026-match-summary';
import { getWostiIndex, channelsFor } from '@/lib/wosti';
import { lineupFor } from '@/lib/sportapi';
import { MissingPlayers } from '@/components/match/missing-players';
import { LiveMatchSummary } from '@/components/match/live-match-summary';
import { MovistarCintillo } from '@/components/affiliate/movistar-banner';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';

// Regeneración periódica (ISR): rápida y estable sin pedir a las fuentes en cada visita.
export const revalidate = 60;
// Sin prerender en build: cada URL se genera en la primera visita y queda en caché (ISR).
export const dynamicParams = true;
export async function generateStaticParams() { return []; }

const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);
const SAFE_ID = /^[0-9]{5,12}$/;

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
  const ms = h.date ? new Date(h.date).getTime() : 0;
  const channels = s.slug === 'futbol' && h.date
    ? channelsFor(await getWostiIndex(), h.date, [h.home.name], [h.away.name])
    : [];
  const teamBase = withLocale(L, `/${c.sport}/${c.slug}/equipo`);
  const bajas = s.slug === 'futbol' ? lineupFor(c.slug, [h.home.name], [h.away.name]) : null;
  const tabs = [
    summary.hasCommentary && { href: '#narracion', label: 'Narración' },
    summary.hasEvents && { href: '#momentos', label: 'Momentos' },
    summary.hasLineups && { href: '#alineaciones', label: s.slug === 'baloncesto' ? 'Quintetos' : 'Alineaciones' },
    summary.hasStats && { href: '#estadisticas', label: 'Estadísticas' },
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <article className="pt-32" data-sport={s.slug}>
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
          eventStatus: /POSTPONED|CANCELED/.test(summary.statusName ?? '') ? 'https://schema.org/EventPostponed' : 'https://schema.org/EventScheduled',
          homeTeam: { '@type': 'SportsTeam', name: h.home.name },
          awayTeam: { '@type': 'SportsTeam', name: h.away.name },
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
        <h1 className="t-h1 mt-5 text-[var(--color-fg)]">
          {h.home.name} <span className="text-[var(--color-fg-subtle)]">·</span> {h.away.name}
        </h1>
      </header>

      {/* Marcador grande + cabecera pegajosa + liveblog (auto-refresh si en directo) */}
      <LiveMatchSummary
        initial={summary}
        eventId={id}
        home={h.home.abbr}
        away={h.away.abbr}
        homeName={h.home.name}
        awayName={h.away.name}
        espn={c.espn!}
        board={{ sport: s.slug, competition: { name: c.name, href: withLocale(L, `/${c.sport}/${c.slug}`) }, channels, teamBase }}
      >
        {tabs.length > 1 && (
        <nav className="mx-auto mt-5 w-full max-w-[1000px] px-6 md:px-10" aria-label="Secciones del partido">
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
              {tabs.map((t) => (
              <a key={t.href} href={t.href} className="inline-flex h-8 shrink-0 items-center rounded-full border border-[var(--color-border)] px-3.5 text-[13px] text-[var(--color-fg-muted)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-fg)]">{t.label}</a>
            ))}
          </div>
        </nav>
        )}

        {bajas && <MissingPlayers lineup={bajas} homeName={h.home.name} awayName={h.away.name} />}

        {s.slug === 'futbol' && (
        <section className="mx-auto mt-6 w-full max-w-[1000px] px-6 md:px-10">
          <MovistarCintillo context={`${h.home.name} - ${h.away.name}`} />
        </section>
        )}

      </LiveMatchSummary>

      <section className="mx-auto mt-10 w-full max-w-[1000px] px-6 pb-16 md:px-10">
        <Link href={withLocale(L, `/${c.sport}/${c.slug}`)} className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-sm font-semibold hover:border-[var(--accent)] hover:text-[var(--accent-ink)]">
          Calendario y clasificación de {c.shortName ?? c.name}
        </Link>
      </section>
    </article>
  );
}

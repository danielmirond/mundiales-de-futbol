import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, Tv, Users, CalendarDays } from 'lucide-react';
import { getSport, getCompetition, competitionPath } from '@/lib/competitions';
import { fetchStandings } from '@/lib/espn';
import { resolveTeam, fetchTeam, fetchTeamSchedule, fetchTeamRoster, fetchTeamProfile } from '@/lib/espn-team';
import { inkFor } from '@/lib/color';
import { fetchWindow, dayKeys } from '@/lib/espn';
import { getWostiIndex, channelsFor } from '@/lib/wosti';
import { routing, type Locale } from '@/i18n/routing';
import { StandingsTable, FormChips } from '@/components/portal/standings-table';
import { TeamTabs } from '@/components/portal/team-tabs';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';

// Regeneración periódica (ISR): rápida y estable sin pedir a las fuentes en cada visita.
export const revalidate = 900;
// Sin prerender en build: cada URL se genera en la primera visita y queda en caché (ISR).
export const dynamicParams = true;
export async function generateStaticParams() { return []; }

const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);
const dayFmt = new Intl.DateTimeFormat('es', { timeZone: 'Europe/Madrid', weekday: 'short', day: 'numeric', month: 'short' });
const timeFmt = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
const POS_LABEL: Record<string, string> = { G: 'Porteros', D: 'Defensas', M: 'Centrocampistas', F: 'Delanteros', C: 'Pívots', 'G-F': 'Exteriores', 'F-C': 'Interiores', PG: 'Bases', SG: 'Escoltas', SF: 'Aleros', PF: 'Ala-pívots' };

type Params = Promise<{ locale: string; deporte: string; competicion: string; slug: string }>;

async function load(deporte: string, competicion: string, slug: string) {
  const s = getSport(deporte);
  const c = getCompetition(deporte, competicion);
  if (!s || !c || !c.espn) return null;
  const ref = await resolveTeam(c, slug);
  if (!ref) return null;
  return { s, c, ref };
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; deporte: string; competicion: string; slug: string }> }) {
  const { locale, deporte, competicion, slug } = await params;
  const data = await load(deporte, competicion, slug);
  if (!data) return {};
  const { c, ref } = data;
  return pageMetadata({
    locale,
    path: `/${c.sport}/${c.slug}/equipo/${ref.slug}`,
    title: `${ref.name}: calendario, resultados, clasificación y plantilla · ${c.shortName ?? c.name}`,
    description: `${ref.name} en ${c.name}: próximo partido y dónde verlo, resultados de la temporada, posición en la clasificación y plantilla completa con dorsales. Datos actualizados en directo.`,
    keywords: [`${ref.name}`, `${ref.name} calendario`, `${ref.name} resultados`, `${ref.name} plantilla`, `${ref.name} próximo partido`, `${ref.name} clasificación`, c.name.toLowerCase()],
  });
}

export default async function EquipoPage({ params }: { params: Params }) {
  const { locale, deporte, competicion, slug } = await params;
  const data = await load(deporte, competicion, slug);
  if (!data) notFound();
  setRequestLocale(locale);
  const L = locale as Locale;
  const { s, c, ref } = data;

  const [team, schedule, roster, standings, upcoming, profile] = await Promise.all([
    fetchTeam(c, ref.id),
    fetchTeamSchedule(c, ref.id),
    fetchTeamRoster(c, ref.id),
    c.hasStandings ? fetchStandings(c) : Promise.resolve({ groups: [] }),
    fetchWindow([c], dayKeys(0, 14), 300),
    fetchTeamProfile(c, ref.id),
  ]);
  const clubColor = profile.color ?? team?.color;
  const band = clubColor ? { background: `#${clubColor}`, color: inkFor(`#${clubColor}`) } : undefined;
  const homeGames = schedule.filter((g) => g.isHome && g.venue);
  const stadium = profile.venue?.name ?? (homeGames.length ? [...homeGames.reduce((m, g) => m.set(g.venue!, (m.get(g.venue!) ?? 0) + 1), new Map<string, number>()).entries()].sort((a, b) => b[1] - a[1])[0][0] : undefined);
  const row = standings.groups.flatMap((g) => g.rows).find((r) => r.abbr === ref.abbr || r.name === ref.name);
  const played = schedule.filter((g) => g.state === 'post').reverse().slice(0, 10);
  const next = upcoming.filter((m) => m.state !== 'post' && (m.home.abbr === ref.abbr || m.away.abbr === ref.abbr)).slice(0, 5);
  const wosti = s.slug === 'futbol' && next.length ? await getWostiIndex() : new Map();
  const groups = new Map<string, typeof roster.players>();
  for (const p of roster.players) groups.set(p.pos || '—', [...(groups.get(p.pos || '—') ?? []), p]);
  const form = played.slice(0, 5).map((g) => g.result).filter(Boolean) as string[];

  return (
    <main className="pt-28" data-sport={s.slug}>
      <JsonLd data={[
        breadcrumbLd(locale, [
          { name: 'Inicio', path: '/' }, { name: s.name, path: `/${s.slug}` },
          { name: c.name, path: `/${c.sport}/${c.slug}` }, { name: ref.name, path: `/${c.sport}/${c.slug}/equipo/${ref.slug}` },
        ]),
        { '@context': 'https://schema.org', '@type': 'SportsTeam', name: ref.name, sport: s.name, ...(ref.logo ? { logo: ref.logo } : {}),
          memberOf: { '@type': 'SportsOrganization', name: c.name }, url: localeUrl(locale, `/${c.sport}/${c.slug}/equipo/${ref.slug}`) },
      ]} />

      <header className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <Link href={withLocale(L, competitionPath(c))} className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> {c.name}
        </Link>
        <div className="mt-6 flex items-center gap-5 rounded-[18px] px-5 py-4" style={band}>
          {ref.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={ref.logo} alt="" width={96} height={96} className="h-20 w-20 object-contain md:h-24 md:w-24" />
          )}
          <div>
            <h1 className="font-display text-fluid-h1 uppercase leading-[0.9]">{ref.name}</h1>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.25em] opacity-85">
              {c.name}{team?.record ? ` · ${team.record}` : ''}{row ? ` · ${row.rank}.º${row.stats.points ? ` · ${row.stats.points} pts` : ''}` : team?.standingSummary ? ` · ${team.standingSummary}` : ''}
            </p>
            {form.length > 0 && (
              <p className="mt-3 flex items-center gap-2"><span className="sub-label !mb-0">Racha</span><FormChips results={form} /></p>
            )}
          </div>
        </div>
      </header>
      <TeamTabs comp={c} team={ref} active="inicio" locale={L} />

      {/* Próximos partidos */}
      <section className="mx-auto w-full max-w-[1400px] px-6 py-12 md:px-10">
        <div className="kicker"><CalendarDays className="mr-1 inline h-3 w-3" /> Próximos partidos</div>
        {next.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--color-fg-muted)]">Sin partidos programados en los próximos 14 días en {c.name}.</p>
        ) : (
          <ul className="mt-4 divide-y divide-[var(--color-border)] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]">
            {next.map((m) => {
              const home = m.home.abbr === ref.abbr;
              const ch = s.slug === 'futbol' ? channelsFor(wosti, m.date, [m.home.fullName, m.home.name], [m.away.fullName, m.away.name]) : [];
              const ms = new Date(m.date).getTime();
              return (
                <li key={m.id}>
                  <Link href={withLocale(L, `/${c.sport}/${c.slug}/partido/${m.id}`)} className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-bg-2)]">
                    <span className="w-24 shrink-0 font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg-muted)]">{dayFmt.format(ms)} · {timeFmt.format(ms)}</span>
                    <span className="flex-1 text-sm text-[var(--color-fg)]">{home ? 'vs' : 'en casa de'} <strong>{home ? m.away.name : m.home.name}</strong></span>
                    {ch.length > 0 && <span className="hidden items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-[var(--color-fg-muted)] sm:flex"><Tv className="h-3 w-3" /> {ch.slice(0, 2).join(' / ')}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Resultados */}
      {played.length > 0 && (
        <section className="mx-auto w-full max-w-[1400px] px-6 pb-12 md:px-10">
          <div className="kicker">Últimos resultados · {c.shortName ?? c.name}</div>
          <ul className="mt-4 divide-y divide-[var(--color-border)] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]">
            {played.map((g) => (
              <li key={g.id}>
                <Link href={withLocale(L, `/${c.sport}/${c.slug}/partido/${g.id}`)} className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-bg-2)]">
                  <span className="w-20 shrink-0 font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg-muted)]">{dayFmt.format(new Date(g.date).getTime())}</span>
                  <FormChips results={[g.result ?? 'D']} />
                  <span className="flex-1 truncate text-sm text-[var(--color-fg)]">{g.isHome ? 'vs' : 'en casa de'} {g.rival}</span>
                  <span className="font-display tab-num text-lg text-[var(--color-fg)]">{g.gf}-{g.ga}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Clasificación: el equipo con su vecino de arriba y de abajo */}
      {row && <StandingsTable comp={c} locale={L} highlight={ref.abbr} slice />}

      {/* Datos del club */}
      <section className="mx-auto w-full max-w-[1400px] px-6 pb-12 md:px-10">
        <div className="kicker">Datos del club</div>
        <dl className="mt-4 grid gap-px overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Estadio', stadium ? `${stadium}${profile.venue?.city ? ` · ${profile.venue.city}` : ''}` : '—'],
            ['Competición', c.name],
            ['Entrenador', roster.coach ?? '—'],
            ['Plantilla', roster.players.length ? `${roster.players.length} jugadores` : '—'],
            ['Balance', team?.record ?? '—'],
            ['Posición', row ? `${row.rank}.º${row.stats.points ? ` · ${row.stats.points} pts` : ''}` : team?.standingSummary ?? '—'],
            ['Racha', profile.form ? profile.form.split('').map((r) => (r === 'W' ? 'G' : r === 'L' ? 'P' : 'E')).join(' ') : form.length ? form.map((r) => (r === 'W' ? 'G' : r === 'L' ? 'P' : 'E')).join(' ') : '—'],
            ['Abreviatura', ref.abbr],
          ].map(([k, v]) => (
            <div key={k} className="bg-[var(--color-bg-2)] px-5 py-4">
              <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">{k}</dt>
              <dd className="mt-1 text-sm font-medium text-[var(--color-fg)]">{v}</dd>
            </div>
          ))}
          {(clubColor || profile.alternateColor) && (
            <div className="bg-[var(--color-bg-2)] px-5 py-4">
              <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">Colores</dt>
              <dd className="mt-2 flex items-center gap-2">
                {clubColor && <span className="h-6 w-6 rounded-full border border-[var(--color-border-strong)]" style={{ background: `#${clubColor}` }} title={`#${clubColor}`} />}
                {profile.alternateColor && <span className="h-6 w-6 rounded-full border border-[var(--color-border-strong)]" style={{ background: `#${profile.alternateColor}` }} title={`#${profile.alternateColor}`} />}
              </dd>
            </div>
          )}
        </dl>
      </section>

      {/* Plantilla */}
      {roster.players.length > 0 && (
        <section className="mx-auto w-full max-w-[1400px] px-6 pb-16 md:px-10">
          <div className="kicker"><Users className="mr-1 inline h-3 w-3" /> Plantilla{roster.coach ? ` · Entrenador: ${roster.coach}` : ''}</div>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[...groups.entries()].map(([pos, ps]) => (
              <div key={pos} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-4">
                <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-muted)]">{POS_LABEL[pos] ?? pos}</h3>
                <ul className="mt-3 space-y-1.5">
                  {ps.map((p) => (
                    <li key={`${p.jersey}-${p.name}`} className="flex items-center gap-3 text-sm">
                      <span className="inline-grid h-6 w-7 shrink-0 place-items-center rounded-full bg-[var(--color-bg)] font-mono text-[10px] tab-num text-[var(--color-fg-muted)]">{p.jersey && p.jersey !== 'undefined' ? p.jersey : '·'}</span>
                      {p.id ? <Link href={withLocale(L, `/${c.sport}/${c.slug}/jugador/${p.id}`)} className="flex-1 truncate text-[var(--color-fg)] hover:text-[var(--accent-ink)]">{p.name}</Link> : <span className="flex-1 truncate text-[var(--color-fg)]">{p.name}</span>}
                      {p.age && <span className="font-mono text-[10px] text-[var(--color-fg-subtle)]">{p.age}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

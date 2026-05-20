import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  Clock,
  ExternalLink,
  Newspaper,
  Users as UsersIcon,
} from 'lucide-react';
import {
  SQUADS_2026,
  STATUS_LABELS,
  getSquadByTeam,
  type SquadStatus,
  type Player2026,
} from '@/lib/wc-2026-squads';
import { TEAMS_2026 } from '@/lib/wc-2026';
import { countryName } from '@/lib/country-names';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl, SEO } from '@/lib/seo';
import { getNewsByTeam, relativeTimeEs } from '@/lib/news';
import { getFriendliesByTeam } from '@/lib/wc-2026-pre-friendlies';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

const STATUS_COLORS: Record<SquadStatus, string> = {
  pending: 'border-[var(--color-border)] text-[var(--color-fg-subtle)]',
  provisional: 'border-amber-500/40 text-amber-300',
  final: 'border-[var(--color-pitch)]/40 text-[var(--color-pitch)]',
};

const POSITION_LABELS = {
  GK: 'Portero',
  DF: 'Defensa',
  MF: 'Centrocampista',
  FW: 'Delantero',
};

export function generateStaticParams() {
  return SQUADS_2026.flatMap((s) =>
    routing.locales.map((locale) => ({ locale, code: s.teamCode })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { locale, code } = await params;
  const squad = getSquadByTeam(code);
  const team = TEAMS_2026[code];
  if (!squad || !team) return {};

  const status = STATUS_LABELS[squad.status].toLowerCase();
  const title = `Lista ${team.name} Mundial 2026 · ${
    squad.status === 'final'
      ? `${squad.players.length} convocados`
      : status
  }`;
  const description =
    squad.status === 'final'
      ? `Convocatoria definitiva de ${team.name} para el Mundial 2026: los ${squad.players.length} jugadores elegidos por ${squad.coach ?? 'el seleccionador'}.`
      : squad.status === 'provisional'
      ? `Lista provisional de ${team.name} para el Mundial 2026: ${squad.players.length} jugadores citados por ${squad.coach ?? 'el seleccionador'} antes de la definitiva del 1 de junio.`
      : `Convocatoria de ${team.name} para el Mundial 2026 · pendiente de anuncio. Datos del Grupo, rivales, sede y plazos FIFA.`;

  return pageMetadata({
    locale,
    path: `/2026/listas/${code}`,
    title,
    description,
    keywords: [
      `lista ${team.name} Mundial 2026`,
      `convocatoria ${team.name} Mundial 2026`,
      `${team.name} 26 jugadores Mundial`,
      `plantilla ${team.name} Mundial 2026`,
    ],
    type: 'article',
  });
}

function PlayerRow({ p, locale }: { p: Player2026; locale: string }) {
  const nameInitials = p.name
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? '')
    .join('');

  // Avatar: foto si la tenemos, fallback a iniciales sobre fondo.
  const Avatar = (
    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-bg)]">
      {p.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={p.photoUrl}
          alt={`Foto de ${p.name}`}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center font-mono text-xs text-[var(--color-fg-subtle)]">
          {nameInitials || '?'}
        </div>
      )}
    </div>
  );

  const NameBlock = (
    <div className="min-w-0">
      <div className="truncate font-medium text-[var(--color-fg)]">
        {p.name}
        {p.captain && (
          <span className="ml-2 rounded bg-[var(--color-pitch)]/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-[var(--color-pitch)]">
            C
          </span>
        )}
      </div>
      <div className="truncate font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
        {p.club} · {countryName(p.clubCountry)} · {p.age} años
        {p.previousWcs > 0 && ` · ${p.previousWcs + 1}.ª Copa`}
      </div>
      {p.note && (
        <div className="mt-1 text-xs text-[var(--color-fg-muted)]">{p.note}</div>
      )}
    </div>
  );

  // Si el jugador tiene `playerSlug`, hacemos toda la fila enlace a su ficha.
  const inner = p.playerSlug ? (
    <Link
      href={withLocale(locale as Locale, `/jugadores/${p.playerSlug}`)}
      className="contents"
    >
      {Avatar}
      {NameBlock}
    </Link>
  ) : (
    <>
      {Avatar}
      {NameBlock}
    </>
  );

  return (
    <li className="grid grid-cols-[36px_52px_1fr_auto] items-center gap-3 border-t border-[var(--color-border)] py-3 first:border-t-0">
      <span className="font-mono tab-num text-[var(--color-fg-subtle)]">
        {p.shirt ?? '—'}
      </span>
      {inner}
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
        {p.position}
      </span>
    </li>
  );
}

export default async function SquadPage({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { locale, code } = await params;
  setRequestLocale(locale);

  const squad = getSquadByTeam(code);
  const team = TEAMS_2026[code];
  if (!squad || !team) notFound();

  const goalkeepers = squad.players.filter((p) => p.position === 'GK');
  const defenders = squad.players.filter((p) => p.position === 'DF');
  const midfielders = squad.players.filter((p) => p.position === 'MF');
  const forwards = squad.players.filter((p) => p.position === 'FW');

  // SportsTeam JSON-LD con athlete[]
  const sportsTeamLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsTeam',
    name: team.name,
    sport: 'Football (Association)',
    url: localeUrl(locale, `/2026/listas/${code}`),
    member: squad.players.map((p) => ({
      '@type': 'OrganizationRole',
      roleName: POSITION_LABELS[p.position],
      member: {
        '@type': 'Person',
        name: p.name,
        memberOf: { '@type': 'SportsOrganization', name: p.club },
      },
    })),
    coach: squad.coach
      ? { '@type': 'Person', name: squad.coach, nationality: squad.coachNationality }
      : undefined,
  };

  return (
    <article className="pt-32">
      <JsonLd
        data={[
          sportsTeamLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Mundial 2026', path: '/2026' },
            { name: 'Listas', path: '/2026/listas' },
            { name: team.name, path: `/2026/listas/${code}` },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/2026/listas')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Todas las listas
        </Link>

        <div className="mt-8 flex items-center gap-4">
          <span className="text-5xl" aria-hidden>{team.flag}</span>
          <div>
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[9px] uppercase tracking-[0.3em] ${STATUS_COLORS[squad.status]}`}>
              {STATUS_LABELS[squad.status]}
              {squad.players.length > 0 && (
                <span className="opacity-70">· {squad.players.length} jugadores</span>
              )}
            </div>
            <h1 className="mt-3 font-display text-fluid-display uppercase leading-[0.9]">
              {team.name}
            </h1>
            {squad.coach && (
              <p className="mt-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                Seleccionador: <span className="text-[var(--color-fg)]">{squad.coach}</span>
                {squad.coachNationality && ` (${squad.coachNationality})`}
              </p>
            )}
          </div>
        </div>

        {squad.summary && (
          <p className="mt-8 max-w-3xl text-base leading-relaxed text-[var(--color-fg-muted)] md:text-lg">
            {squad.summary}
          </p>
        )}
      </header>

      {squad.status === 'pending' ? (
        <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
          <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-10 md:p-14">
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              <Clock className="h-4 w-4" />
              <span>Pendiente de anuncio</span>
            </div>
            <h2 className="mt-4 font-display text-2xl uppercase md:text-3xl">
              {team.name} aún no ha publicado su lista
            </h2>
            <p className="mt-4 max-w-2xl text-base text-[var(--color-fg-muted)] md:text-lg">
              FIFA fija dos plazos para todas las selecciones del Mundial 2026:
            </p>
            <ul className="mt-6 space-y-3 text-sm md:text-base">
              <li className="border-l-2 border-[var(--color-pitch)] pl-4">
                <strong className="text-[var(--color-fg)]">11 de mayo de 2026.</strong>{' '}
                Lista provisional (35-55 jugadores). FIFA NO la hace pública,
                pero las federaciones suelen anunciarla en rueda de prensa los
                días previos.
              </li>
              <li className="border-l-2 border-[var(--color-pitch)] pl-4">
                <strong className="text-[var(--color-fg)]">1 de junio de 2026.</strong>{' '}
                Lista definitiva (23-26 jugadores con 3 porteros obligatorios).
                Tras esta fecha, solo se permiten reemplazos por lesión hasta
                24 h antes del primer partido del equipo.
              </li>
            </ul>
            <p className="mt-6 text-sm text-[var(--color-fg-muted)]">
              En cuanto {team.name} anuncie su convocatoria, esta página se
              actualiza con los nombres, dorsales, club y edad. Mientras tanto:
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={withLocale(locale as Locale, '/2026/convocatorias')}
                className="rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black"
              >
                Calendario de listas FIFA
              </Link>
              <Link
                href={withLocale(locale as Locale, `/selecciones/${code}`)}
                className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm"
              >
                Ficha de {team.name}
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <>
          {squad.announcedAt && (
            <section className="mx-auto mt-12 w-full max-w-[1100px] px-6 md:px-10">
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
                <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
                  <Clock className="h-3 w-3" />
                  Anunciada el {squad.announcedAt}
                </div>
                {squad.announcementSource && (
                  <a
                    href={squad.announcementSource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 font-medium text-[var(--color-fg)] hover:text-[var(--color-pitch)]"
                  >
                    Fuente oficial: {squad.announcementSourceName ?? squad.announcementSource}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </section>
          )}

          <section className="mx-auto mt-12 w-full max-w-[1100px] px-6 md:px-10 space-y-12">
            {[
              { title: 'Porteros', list: goalkeepers },
              { title: 'Defensas', list: defenders },
              { title: 'Centrocampistas', list: midfielders },
              { title: 'Delanteros', list: forwards },
            ].map(({ title, list }) =>
              list.length === 0 ? null : (
                <div key={title}>
                  <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
                    <UsersIcon className="h-3 w-3" />
                    <span>{title} · {list.length}</span>
                  </div>
                  <ul className="mt-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] px-6">
                    {list.map((p, i) => (
                      <PlayerRow key={`${p.name}-${i}`} p={p} locale={locale} />
                    ))}
                  </ul>
                </div>
              ),
            )}
          </section>
        </>
      )}

      {/* Amistosos pre-Mundial 2026 */}
      {(() => {
        const teamFriendlies = getFriendliesByTeam(code);
        if (teamFriendlies.length === 0) return null;
        return (
          <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
            <div className="flex items-baseline gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              <CalendarClock className="h-3 w-3" />
              <span>Amistosos pre-Mundial 2026</span>
            </div>
            <h2 className="mt-2 font-display text-2xl uppercase leading-tight md:text-3xl">
              Últimas pruebas antes del torneo
            </h2>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {teamFriendlies.map((f) => {
                const isHome = f.homeCode === code;
                const opponentCode = isHome ? f.awayCode : f.homeCode;
                const opponent = TEAMS_2026[opponentCode as keyof typeof TEAMS_2026];
                const opponentName = opponent?.name ?? opponentCode;
                const opponentFlag = opponent?.flag ?? '';
                const date = new Date(f.date);
                const dateLabel = date.toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                });
                const timeLabel = date.toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                });
                return (
                  <div
                    key={f.date + f.homeCode + f.awayCode}
                    className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-pitch)]">
                        {isHome ? 'En casa' : 'Visitante'} · {dateLabel}
                      </div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
                        {timeLabel}
                      </div>
                    </div>
                    <h3 className="mt-2 flex items-baseline gap-2 font-display text-lg uppercase">
                      <span>vs</span>
                      <span>{opponentFlag}</span>
                      <span>{opponentName}</span>
                    </h3>
                    {(f.venue || f.city) && (
                      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                        {[f.venue, f.city, f.country].filter(Boolean).join(' · ')}
                      </div>
                    )}
                    {f.notes && (
                      <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">{f.notes}</p>
                    )}
                    {f.result && (
                      <div className="mt-3 font-mono text-sm text-[var(--color-pitch)]">
                        Resultado: {f.result.home}-{f.result.away}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })()}

      {/* Noticias de la selección */}
      {(() => {
        const teamNews = getNewsByTeam(code, 4);
        if (teamNews.length === 0) return null;
        return (
          <section className="mx-auto mt-20 w-full max-w-[1100px] px-6 md:px-10">
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
                  <Newspaper className="h-3 w-3" />
                  <span>Noticias</span>
                </div>
                <h2 className="mt-2 font-display text-2xl uppercase leading-tight md:text-3xl">
                  Lo último sobre {team.name}
                </h2>
              </div>
              <Link
                href={withLocale(locale as Locale, '/noticias')}
                className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)] transition-colors hover:text-[var(--color-pitch)]"
              >
                Todas las noticias <ArrowRight className="h-3 w-3 rtl:rotate-180" />
              </Link>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {teamNews.map((n) => (
                <Link
                  key={n.slug}
                  href={withLocale(locale as Locale, `/noticias/${n.slug}`)}
                  className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5 transition-colors hover:border-[var(--color-pitch)]/60"
                >
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
                    {n.category} · {relativeTimeEs(n.publishedAt)}
                  </div>
                  <h3 className="mt-2 font-display text-base uppercase leading-tight group-hover:text-[var(--color-pitch)]">
                    {n.title}
                  </h3>
                  <p className="mt-3 text-sm text-[var(--color-fg-muted)] line-clamp-3">
                    {n.summary}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-pitch)] group-hover:underline">
                    Leer <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })()}

      <section className="mx-auto mt-12 mb-24 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-10">
          <h2 className="font-display text-2xl uppercase">Más sobre {team.name}</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={withLocale(locale as Locale, `/selecciones/${code}`)} className="rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black">
              Ficha completa
            </Link>
            <Link href={withLocale(locale as Locale, '/2026/grupos')} className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm">
              12 grupos del Mundial
            </Link>
            <Link href={withLocale(locale as Locale, '/2026/listas')} className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm">
              Otras listas
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

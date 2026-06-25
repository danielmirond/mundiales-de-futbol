import Image from 'next/image';
import Link from 'next/link';
import { Users } from 'lucide-react';
import { SQUADS_2026, STATUS_LABELS, type Player2026 } from '@/lib/wc-2026-squads';
import { routing, type Locale } from '@/i18n/routing';
import { FIXTURES_2026 } from '@/lib/wc-2026';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

const POS_LABEL: Record<string, string> = {
  GK: 'POR',
  DF: 'DEF',
  MF: 'MED',
  FW: 'DEL',
};
const POS_COLOR: Record<string, string> = {
  GK: 'oklch(0.72 0.15 50)',
  DF: 'oklch(0.64 0.17 258)',
  MF: 'oklch(0.72 0.19 150)',
  FW: 'oklch(0.64 0.20 22)',
};

function PlayerAvatar({ player }: { player: Player2026 }) {
  const initials = player.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  if (player.photoUrl) {
    return (
      <div className="relative h-20 w-20 overflow-hidden rounded-full bg-[var(--color-bg-2)] flex-none ring-2 ring-[var(--color-border)]">
        <Image
          src={player.photoUrl}
          alt={player.name}
          fill
          sizes="80px"
          className="object-cover object-top"
          unoptimized
        />
      </div>
    );
  }

  return (
    <div
      className="flex h-20 w-20 flex-none items-center justify-center rounded-full ring-2 ring-[var(--color-border)]"
      style={{ background: `${POS_COLOR[player.position] ?? 'var(--color-bg-3)'}22` }}
    >
      <span
        className="font-display text-xl font-semibold"
        style={{ color: POS_COLOR[player.position] ?? 'var(--color-fg-muted)' }}
      >
        {initials}
      </span>
    </div>
  );
}

function PlayerCard({ player, captain }: { player: Player2026; captain?: string }) {
  const isCaptain = captain && player.name === captain;
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-4 transition-colors hover:bg-[var(--color-bg-3)]">
      <PlayerAvatar player={player} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-display text-base font-semibold uppercase leading-tight text-[var(--color-fg)]">
            {player.name}
          </span>
          {isCaptain && (
            <span className="rounded-full bg-[var(--color-pitch)]/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-pitch)]">
              Capitán
            </span>
          )}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span
            className="rounded font-mono text-[9px] font-bold uppercase tracking-[0.1em] px-1.5 py-0.5"
            style={{
              background: `${POS_COLOR[player.position] ?? 'var(--color-bg-3)'}28`,
              color: POS_COLOR[player.position] ?? 'var(--color-fg-muted)',
            }}
          >
            {POS_LABEL[player.position] ?? player.position}
          </span>
          <span className="text-sm text-[var(--color-fg-muted)]">{player.club}</span>
          <span className="font-mono text-[10px] text-[var(--color-fg-subtle)]">
            {player.clubCountry}
          </span>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-0.5 font-mono text-[10px] text-[var(--color-fg-subtle)]">
          <span>{player.age} años</span>
          {player.previousWcs === 0 ? (
            <span className="text-[var(--color-pitch)]">Debutante</span>
          ) : (
            <span>
              {player.previousWcs} {player.previousWcs === 1 ? 'Mundial previo' : 'Mundiales previos'}
            </span>
          )}
          {player.shirt !== null && player.shirt !== undefined && (
            <span className="text-[var(--color-fg-muted)]">Dorsal #{player.shirt}</span>
          )}
        </div>
        {player.note && (
          <p className="mt-1.5 text-xs text-[var(--color-fg-subtle)] leading-relaxed line-clamp-2">
            {player.note}
          </p>
        )}
      </div>
    </div>
  );
}

const POS_ORDER: Record<string, number> = { GK: 0, DF: 1, MF: 2, FW: 3 };
const POS_SECTION: Record<string, string> = {
  GK: 'Porteros',
  DF: 'Defensas',
  MF: 'Mediocampistas',
  FW: 'Delanteros',
};

export function Squad2026Section({
  teamCode,
  locale,
}: {
  teamCode: string;
  locale: Locale;
}) {
  const squad = SQUADS_2026.find((s) => s.teamCode === teamCode);
  // Show section even for teams without players if they have metadata (not pending)
  if (!squad || squad.status === 'pending') return null;

  // Get group matches for this team
  const groupMatches = FIXTURES_2026.filter(
    (f) =>
      /^[A-L]$/.test(f.stage) &&
      (f.home === teamCode || f.away === teamCode),
  ).sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  const group = groupMatches[0]?.stage ?? null;

  const players = [...squad.players].sort(
    (a, b) =>
      (POS_ORDER[a.position] ?? 99) - (POS_ORDER[b.position] ?? 99) ||
      (a.shirt ?? 99) - (b.shirt ?? 99),
  );

  const byPos = players.reduce<Record<string, Player2026[]>>((acc, p) => {
    if (!acc[p.position]) acc[p.position] = [];
    acc[p.position].push(p);
    return acc;
  }, {});

  const statusLabel = STATUS_LABELS[squad.status] ?? squad.status;

  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 mt-16 md:px-10 pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            <Users className="h-3 w-3" />
            <span>Convocatoria · Mundial 2026</span>
          </div>
          <h2 className="mt-3 font-display text-3xl uppercase leading-[0.95] text-[var(--color-fg)] md:text-4xl">
            Lista de 26
          </h2>
          {squad.summary && (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-fg-muted)]">
              {squad.summary}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1.5 text-right">
          {squad.coach && (
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
              Seleccionador
              <span className="ml-2 font-semibold text-[var(--color-fg)]">{squad.coach}</span>
              {squad.coachNationality && (
                <span className="ml-1 text-[var(--color-fg-subtle)]">({squad.coachNationality})</span>
              )}
            </div>
          )}
          {squad.captainName && (
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
              Capitán
              <span className="ml-2 font-semibold text-[var(--color-pitch)]">{squad.captainName}</span>
            </div>
          )}
          {squad.announcedAt && (
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
              Anunciada <span className="text-[var(--color-fg)]">{squad.announcedAt}</span>
            </div>
          )}
          <div className="mt-1">
            <span
              className={`rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] ${
                squad.status === 'final'
                  ? 'bg-[var(--color-pitch)]/15 text-[var(--color-pitch)]'
                  : 'bg-amber-500/15 text-amber-400'
              }`}
            >
              {statusLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Group + fixtures */}
      {(group || groupMatches.length > 0) && (
        <div className="mb-8 overflow-hidden rounded-2xl border border-[var(--color-border)]">
          {group && (
            <div className="flex items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-bg-2)] px-5 py-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                Fase de grupos
              </span>
              <span
                className="rounded-full px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider"
                style={{ background: 'color-mix(in oklch, var(--color-pitch) 18%, transparent)', color: 'var(--color-pitch)' }}
              >
                Grupo {group}
              </span>
            </div>
          )}
          <ul className="divide-y divide-[var(--color-border)]">
            {groupMatches.map((f) => {
              const isHome = f.home === teamCode;
              const opp = isHome ? f.away : f.home;
              return (
                <li key={f.n} className="flex items-center gap-4 bg-[var(--color-bg)] px-5 py-3">
                  <span className="font-mono text-[10px] text-[var(--color-fg-subtle)] w-20 flex-none">
                    {f.date}
                  </span>
                  <span className="font-display text-sm font-semibold uppercase text-[var(--color-fg)] flex-1">
                    {isHome ? 'vs' : '@'} {opp ?? '—'}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--color-fg-subtle)] flex-none">
                    {f.time} UTC
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Players by position */}
      {players.length > 0 ? (
        <div className="space-y-10">
          {(['GK', 'DF', 'MF', 'FW'] as const)
            .filter((pos) => byPos[pos]?.length)
            .map((pos) => (
              <div key={pos}>
                <div className="mb-4 flex items-center gap-3">
                  <span
                    className="h-0.5 w-6 rounded-full"
                    style={{ background: POS_COLOR[pos] }}
                  />
                  <h3
                    className="font-mono text-[11px] uppercase tracking-[0.3em]"
                    style={{ color: POS_COLOR[pos] }}
                  >
                    {POS_SECTION[pos]} ({byPos[pos].length})
                  </h3>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {byPos[pos].map((p, i) => (
                    <PlayerCard key={i} player={p} captain={squad.captainName} />
                  ))}
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] px-6 py-10 text-center">
          <p className="font-mono text-sm text-[var(--color-fg-subtle)]">
            Lista oficial pendiente de publicación —{' '}
            <Link
              href={withLocale(locale, '/2026/convocatorias')}
              className="text-[var(--color-pitch)] hover:underline"
            >
              ver estado de todas las convocatorias
            </Link>
          </p>
        </div>
      )}

      {/* Source link */}
      {squad.announcementSource && (
        <div className="mt-6 text-right">
          <a
            href={squad.announcementSource}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)] hover:text-[var(--color-fg)]"
          >
            Fuente: {squad.announcementSourceName ?? squad.announcementSource} →
          </a>
        </div>
      )}
    </section>
  );
}

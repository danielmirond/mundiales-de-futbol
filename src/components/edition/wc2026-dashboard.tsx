import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { CalendarDays, Trophy, ArrowRight, MapPin, Ticket, Tv } from 'lucide-react';
import { WC_2026, GROUPS_2026, TEAMS_2026 } from '@/lib/wc-2026';
import { routing, type Locale } from '@/i18n/routing';
import { MySelectionPanel } from './my-selection-panel';
import { NextMatchPanel } from './next-match-panel';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

/**
 * Dashboard del Mundial 2026 que se renderiza al inicio de /2026.
 *
 * Tres paneles en grid:
 *  1. Próximo partido (server, próximo partido del torneo)
 *  2. Mi selección (client, persiste en localStorage)
 *  3. Sub-hubs rápidos del Mundial
 *
 * Debajo: chips de acceso rápido a fases (grupos, octavos, cuartos, etc.)
 */
export async function Wc2026Dashboard({ locale }: { locale: Locale }) {
  const t = await getTranslations('pages.wc2026.dashboard');

  // Catálogo simple para "Mi selección": las 48 selecciones con flag + name.
  const teams = Object.values(TEAMS_2026)
    .map((t) => ({ code: t.code, name: t.name, flag: t.flag }))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Grupos resumidos para el panel "Mi selección" (mapping team_code → group).
  const teamToGroup: Record<string, string> = {};
  for (const g of GROUPS_2026) {
    for (const code of g.teams) {
      if (code) teamToGroup[code] = g.letter;
    }
  }

  const subHubs = [
    { href: '/2026/calendario', icon: 'calendar', label: t('hubs.calendar') },
    { href: '/2026/grupos', icon: 'trophy', label: t('hubs.groups') },
    { href: '/2026/sedes', icon: 'pin', label: t('hubs.venues') },
    { href: '/2026/entradas', icon: 'ticket', label: t('hubs.tickets') },
    { href: '/2026/donde-ver', icon: 'tv', label: t('hubs.tv') },
    { href: '/2026/listas', icon: 'roster', label: t('hubs.rosters') },
  ];

  const phases = [
    { key: 'group', href: '/2026/calendario#group', label: t('phases.group') },
    { key: 'r32', href: '/2026/calendario#r32', label: t('phases.r32') },
    { key: 'r16', href: '/2026/calendario#r16', label: t('phases.r16') },
    { key: 'qf', href: '/2026/calendario#qf', label: t('phases.qf') },
    { key: 'sf', href: '/2026/calendario#sf', label: t('phases.sf') },
    { key: 'final', href: '/2026/calendario#final', label: t('phases.final') },
  ];

  return (
    <section className="relative mx-auto w-full max-w-[1400px] px-6 pt-10 md:px-10 md:pt-16">
      {/* Sección de 3 paneles superior */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Panel 1: Próximo partido */}
        <NextMatchPanel locale={locale} />

        {/* Panel 2: Mi selección */}
        <MySelectionPanel
          locale={locale}
          teams={teams}
          teamToGroup={teamToGroup}
          labels={{
            heading: t('mySelection.heading'),
            placeholder: t('mySelection.placeholder'),
            choose: t('mySelection.choose'),
            change: t('mySelection.change'),
            group: t('mySelection.group'),
            seeProfile: t('mySelection.seeProfile'),
            seeJersey: t('mySelection.seeJersey'),
          }}
        />

        {/* Panel 3: Sub-hubs 2026 */}
        <article className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:p-7">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            {t('hubs.heading')}
          </div>
          <h3 className="mt-2 font-display text-lg uppercase leading-tight">
            {t('hubs.title')}
          </h3>

          <ul className="mt-5 space-y-2">
            {subHubs.map((s) => (
              <li key={s.href}>
                <Link
                  href={withLocale(locale, s.href)}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3.5 py-2.5 text-sm transition-colors hover:border-[var(--color-pitch)]/40 hover:bg-[var(--color-bg-3)]"
                >
                  <span className="inline-flex items-center gap-2.5">
                    <SubHubIcon icon={s.icon} />
                    <span>{s.label}</span>
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 opacity-50 transition-transform group-hover:translate-x-1 group-hover:opacity-100 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </article>
      </div>

      {/* Chips de fases */}
      <nav
        aria-label={t('phases.label')}
        className="mt-6 flex flex-wrap gap-2 rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-3"
      >
        <span className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
          {t('phases.label')}
        </span>
        {phases.map((p) => (
          <Link
            key={p.key}
            href={withLocale(locale, p.href)}
            className="rounded-full border border-[var(--color-border-strong)] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
          >
            {p.label}
          </Link>
        ))}
      </nav>
    </section>
  );
}

function SubHubIcon({ icon }: { icon: string }) {
  const className = 'h-4 w-4 text-[var(--color-fg-muted)]';
  if (icon === 'calendar') return <CalendarDays className={className} />;
  if (icon === 'trophy') return <Trophy className={className} />;
  if (icon === 'pin') return <MapPin className={className} />;
  if (icon === 'ticket') return <Ticket className={className} />;
  if (icon === 'tv') return <Tv className={className} />;
  return <ArrowRight className={className} />;
}

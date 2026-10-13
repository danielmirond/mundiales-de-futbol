import Link from 'next/link';
import type { Competition } from '@/lib/competitions';
import type { TeamRef } from '@/lib/espn-team';
import { teamBase } from '@/lib/team-page';
import { routing, type Locale } from '@/i18n/routing';

const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);
export type TeamSection = 'inicio' | 'calendario' | 'resultados' | 'plantilla';

export function teamSections(c: Competition, ref: TeamRef): { key: TeamSection; label: string; path: string }[] {
  const base = teamBase(c, ref);
  return [
    { key: 'inicio', label: 'Inicio', path: base },
    { key: 'calendario', label: 'Calendario', path: `${base}/calendario` },
    { key: 'resultados', label: 'Resultados', path: `${base}/resultados` },
    { key: 'plantilla', label: 'Plantilla', path: `${base}/plantilla` },
  ];
}

/** Pestañas de la ficha de equipo (inicio · calendario · resultados · plantilla). */
export function TeamTabs({ comp, team, active, locale }: { comp: Competition; team: TeamRef; active: TeamSection; locale: Locale }) {
  return (
    <nav className="mx-auto mt-6 w-full max-w-[1400px] px-6 md:px-10" aria-label={`Secciones de ${team.name}`}>
      <div className="no-scrollbar flex gap-1.5 overflow-x-auto border-b border-[var(--color-border)] pb-3">
        {teamSections(comp, team).map((s) => (
          <Link key={s.key} href={withLocale(locale, s.path)} aria-current={s.key === active ? 'page' : undefined}
            className={`inline-flex h-8 shrink-0 items-center rounded-full border px-3.5 text-[13px] transition-colors ${s.key === active ? 'border-transparent bg-[var(--color-fg)] font-semibold text-[var(--color-bg)]' : 'border-[var(--color-border)] text-[var(--color-fg-muted)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-fg)]'}`}>
            {s.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

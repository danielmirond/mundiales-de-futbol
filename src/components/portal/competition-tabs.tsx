import Link from 'next/link';
import type { Competition } from '@/lib/competitions';
import { routing, type Locale } from '@/i18n/routing';

const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);

export type CompetitionSection = 'inicio' | 'partidos-hoy' | 'calendario' | 'resultados' | 'alineaciones' | 'clasificacion' | 'goleadores';

export function competitionSections(c: Competition): { key: CompetitionSection; label: string; path: string }[] {
  const base = `/${c.sport}/${c.slug}`;
  const s: { key: CompetitionSection; label: string; path: string }[] = [
    { key: 'inicio', label: 'Inicio', path: base },
    { key: 'partidos-hoy', label: 'Partidos de hoy', path: `${base}/partidos-hoy` },
    { key: 'calendario', label: 'Calendario', path: `${base}/calendario` },
    { key: 'resultados', label: 'Resultados', path: `${base}/resultados` },
  ];
  if (c.sport === 'futbol') s.push({ key: 'alineaciones', label: 'Alineaciones', path: `${base}/alineaciones` });
  if (c.hasStandings) s.push({ key: 'clasificacion', label: 'Clasificación', path: `${base}/clasificacion` });
  if (c.sport === 'futbol') s.push({ key: 'goleadores', label: 'Goleadores', path: `${base}/goleadores` });
  return s;
}

/** Pestañas de sección de una competición (inicio · hoy · calendario · resultados · alineaciones · clasificación). */
export function CompetitionTabs({ comp, active, locale }: { comp: Competition; active: CompetitionSection; locale: Locale }) {
  return (
    <nav className="mx-auto mt-6 w-full max-w-[1400px] px-6 md:px-10" aria-label={`Secciones de ${comp.name}`}>
      <div className="no-scrollbar flex gap-1.5 overflow-x-auto border-b border-[var(--color-border)] pb-3">
        {competitionSections(comp).map((s) => (
          <Link
            key={s.key}
            href={withLocale(locale, s.path)}
            aria-current={s.key === active ? 'page' : undefined}
            className={`inline-flex h-8 shrink-0 items-center rounded-full border px-3.5 text-[13px] transition-colors ${s.key === active ? 'border-transparent bg-[var(--color-fg)] font-semibold text-[var(--color-bg)]' : 'border-[var(--color-border)] text-[var(--color-fg-muted)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-fg)]'}`}
          >
            {s.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

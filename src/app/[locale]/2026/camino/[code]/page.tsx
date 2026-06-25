import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, MapPin } from 'lucide-react';
import { GROUPS_2026, TEAMS_2026 } from '@/lib/wc-2026';
import { fetchScores, buildScoreMap } from '@/lib/live-scores';
import { computeGroupLive } from '@/lib/data/group-scenarios';
import { pathFor, teamName, type PathStep } from '@/lib/wc-2026-bracket';
import { routing } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd } from '@/lib/seo';

export const dynamicParams = true;

function withLocale(locale: string, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

const groupOf = (code: string) => GROUPS_2026.find((g) => (g.teams as string[]).includes(code));

export function generateStaticParams() {
  return GROUPS_2026.flatMap((g) =>
    (g.teams.filter(Boolean) as string[]).map((code) => ({ locale: routing.defaultLocale, code })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { locale, code } = await params;
  const up = code.toUpperCase();
  const t = TEAMS_2026[up];
  if (!t || !groupOf(up)) return {};
  return pageMetadata({
    locale,
    path: `/2026/camino/${up}`,
    title: `El camino de ${t.name} hacia la final de Nueva York | Mundial 2026`,
    description: `Cuadro, ronda a ronda y posibles rivales de ${t.name} en el Mundial 2026: a quién se enfrentaría en dieciseisavos, octavos, cuartos y semifinales rumbo a la final del MetLife (Nueva York/Nueva Jersey).`,
    keywords: [
      `camino de ${t.name} Mundial 2026`,
      `posibles rivales de ${t.name}`,
      `cuadro de ${t.name}`,
      `a quién se enfrentaría ${t.name}`,
      `${t.name} rumbo a la final`,
    ],
  });
}

function rivalText(s: PathStep): string {
  if (s.round === 'R32') {
    const teams = s.rival.teams.map(teamName).join(', ');
    return `${s.exactRivalSlot}${teams ? ` (uno de: ${teams})` : ''}`;
  }
  if (s.round === 'SF') return 'El ganador de la otra semifinal';
  if (s.round === 'FINAL') return 'El campeón de la otra mitad del cuadro';
  // Octavos / Cuartos
  const groups = s.rival.groups;
  const label = groups.map((g) => `Grupo ${g}`).join(' / ') + (s.rival.third ? ' o un mejor 3.º' : '');
  if (groups.length <= 2) {
    const teams = s.rival.teams.map(teamName).join(', ');
    return `Ganador de ${label}${teams ? ` — posibles: ${teams}` : ''}`;
  }
  return `Ganador de su rama (${label})`;
}

function PathColumn({ title, steps }: { title: string; steps: PathStep[] }) {
  return (
    <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5 md:p-6">
      <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--color-pitch)]">{title}</div>
      <ol className="mt-5 space-y-0">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-4 border-l border-[var(--color-border)] pl-4 pb-5 last:pb-0">
            <span className="-ml-[1.55rem] mt-0.5 grid h-8 w-8 flex-shrink-0 place-items-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] text-base">
              {s.round === 'FINAL' ? '🗽' : ''}
            </span>
            <div className="min-w-0">
              <div className="font-display text-lg uppercase leading-tight text-[var(--color-fg)]">
                {s.roundLabel}
              </div>
              {s.city && (
                <div className="mt-0.5 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-subtle)]">
                  <MapPin className="h-3 w-3" /> {s.city}
                </div>
              )}
              <div className="mt-1 text-sm text-[var(--color-fg-muted)]">{rivalText(s)}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default async function CaminoPage({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { locale, code } = await params;
  setRequestLocale(locale);
  const up = code.toUpperCase();
  const team = TEAMS_2026[up];
  const group = groupOf(up);
  if (!team || !group) notFound();

  // Estado actual del grupo (qué necesita).
  const scoreMap = buildScoreMap(await fetchScores());
  const { scenarios } = computeGroupLive(group!.letter, group!.teams.filter(Boolean) as string[], scoreMap);
  const scenario = scenarios.find((s) => s.code === up);

  const path1 = pathFor(group!.letter, 1);
  const path2 = pathFor(group!.letter, 2);

  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 pb-24 pt-28 md:px-10 md:pt-32">
      <JsonLd
        data={breadcrumbLd(locale, [
          { name: 'Inicio', path: '/' },
          { name: 'Mundial 2026', path: '/2026' },
          { name: `Camino de ${team!.name}`, path: `/2026/camino/${up}` },
        ])}
      />

      <Link
        href={withLocale(locale, `/selecciones/${up}`)}
        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-pitch)]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {team!.name}
      </Link>

      <header className="mt-6">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Rumbo al MetLife · Camino a Nueva York
        </div>
        <h1 className="mt-3 font-display text-fluid-h1 uppercase leading-[0.95]">
          {team!.flag} El camino de {team!.name} hacia la final
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--color-fg-muted)]">
          El cuadro, ronda a ronda, y los posibles rivales de {team!.name} en el Mundial 2026 hasta
          la final del <strong className="text-[var(--color-fg)]">19 de julio en el MetLife
          (Nueva York/Nueva Jersey)</strong>. La rama depende de si termina 1.º o 2.º del{' '}
          <Link
            href={withLocale(locale, `/2026/grupo/${group!.letter.toLowerCase()}`)}
            className="underline decoration-[var(--color-fg-subtle)] underline-offset-4 hover:text-[var(--color-pitch)]"
          >
            Grupo {group!.letter}
          </Link>
          .
        </p>
        {scenario && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-pitch)]/30 bg-[var(--color-pitch)]/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] text-[var(--color-pitch)]">
            Estado: {scenario.label}
            {scenario.detail ? ` · ${scenario.detail}` : ''}
          </div>
        )}
      </header>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <PathColumn title="Si termina 1.º del grupo" steps={path1} />
        <PathColumn title="Si termina 2.º del grupo" steps={path2} />
      </div>

      <p className="mt-8 text-sm leading-relaxed text-[var(--color-fg-subtle)]">
        Si {team!.name} clasifica como <strong className="text-[var(--color-fg)]">uno de los 8 mejores
        terceros</strong>, su rama se asigna según la combinación de terceros clasificados (cruce
        contra un primero de grupo). Rivales en cualitativo: el cuadro se concreta a medida que
        avanzan los grupos. Consulta el{' '}
        <Link
          href={withLocale(locale, '/2026/cuadro')}
          className="underline decoration-[var(--color-fg-subtle)] underline-offset-4 hover:text-[var(--color-pitch)]"
        >
          cuadro completo
        </Link>
        .
      </p>
    </main>
  );
}

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, CalendarDays, MapPin } from 'lucide-react';
import { routing } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd } from '@/lib/seo';
import {
  allHeadToHeadSlugs,
  getHeadToHead,
  STAGE_LABEL_H2H,
  type HeadToHead,
} from '@/lib/wc-head-to-head';

export const dynamicParams = true;

function withLocale(locale: string, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

// Estáticas para el idioma principal (es). El resto se renderiza on-demand.
export function generateStaticParams() {
  return allHeadToHeadSlugs().map((slug) => ({ locale: routing.defaultLocale, slug }));
}

function balanceLine(h: HeadToHead): string {
  if (h.total === 0) return `${h.aName} y ${h.bName} nunca se han enfrentado en un Mundial.`;
  const games = h.total === 1 ? '1 enfrentamiento' : `${h.total} enfrentamientos`;
  return `${games} en Mundiales: ${h.aName} ${h.aWins} · empates ${h.draws} · ${h.bName} ${h.bWins}. Goles ${h.aGoals}-${h.bGoals}.`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const h = getHeadToHead(slug);
  if (!h) return {};
  return pageMetadata({
    locale,
    path: `/historial/${slug}`,
    title: `${h.aName} - ${h.bName}: historial en los Mundiales`,
    description: balanceLine(h),
    keywords: [
      `${h.aName} vs ${h.bName}`,
      `${h.bName} vs ${h.aName}`,
      `${h.aName} ${h.bName} historial`,
      `${h.aName} ${h.bName} Mundial`,
      'historial Copa del Mundo',
    ],
  });
}

function stageLabel(stage: string): string {
  return STAGE_LABEL_H2H[stage] ?? stage;
}
function fmtDate(iso: string | null): string {
  if (!iso) return '';
  return new Intl.DateTimeFormat('es', { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(iso + 'T00:00:00'),
  );
}
function groupLabel(stage: string): string {
  return stage.length === 1 ? `Grupo ${stage}` : 'fase final';
}

export default async function HeadToHeadPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const h = getHeadToHead(slug);
  if (!h) notFound();

  const leader =
    h.aWins > h.bWins ? h.aName : h.bWins > h.aWins ? h.bName : null;

  return (
    <main className="mx-auto w-full max-w-[1000px] px-6 pb-24 pt-28 md:px-10 md:pt-32">
      <JsonLd
        data={breadcrumbLd(locale, [
          { name: 'Inicio', path: '/' },
          { name: 'Historial', path: '/historial' },
          { name: `${h.aName} - ${h.bName}`, path: `/historial/${slug}` },
        ])}
      />

      <Link
        href={withLocale(locale, '/2026/partidos-hoy')}
        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-pitch)]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Mundial 2026
      </Link>

      {/* Cabecera: marcador global */}
      <header className="mt-6">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Cara a cara · Mundiales
        </div>
        <h1 className="mt-3 font-display text-fluid-h1 uppercase leading-[0.95]">
          {h.aName} <span className="text-[var(--color-fg-subtle)]">vs</span> {h.bName}
        </h1>

        {h.total > 0 ? (
          <div className="mt-8 grid grid-cols-3 gap-3 text-center">
            <Stat big={`${h.aFlag} ${h.aWins}`} label={`Victorias ${h.aName}`} />
            <Stat big={`${h.draws}`} label="Empates" />
            <Stat big={`${h.bWins} ${h.bFlag}`} label={`Victorias ${h.bName}`} />
          </div>
        ) : null}

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-fg-muted)]">
          {h.total === 0 ? (
            <>
              <strong className="text-[var(--color-fg)]">{h.aName}</strong> y{' '}
              <strong className="text-[var(--color-fg)]">{h.bName}</strong> no se han enfrentado
              nunca en la fase final de una Copa del Mundo.
            </>
          ) : (
            <>
              En la historia de los Mundiales,{' '}
              <strong className="text-[var(--color-fg)]">{h.aName}</strong> y{' '}
              <strong className="text-[var(--color-fg)]">{h.bName}</strong> se han visto las caras{' '}
              <strong className="text-[var(--color-fg)]">
                {h.total === 1 ? 'una vez' : `${h.total} veces`}
              </strong>
              {leader ? (
                <>
                  , con ventaja para <strong className="text-[var(--color-fg)]">{leader}</strong>
                </>
              ) : (
                <>, con un balance perfectamente igualado</>
              )}
              . El global de goles es de <strong className="text-[var(--color-fg)]">
                {h.aGoals}-{h.bGoals}
              </strong>
              .
            </>
          )}
        </p>
      </header>

      {/* Próximo cruce en 2026 */}
      {h.fixture2026 && (
        <section className="mt-10 rounded-3xl border border-[var(--color-pitch)]/30 bg-gradient-to-br from-[var(--color-pitch)]/8 via-[var(--color-bg-2)] to-[var(--color-bg-2)] p-6 md:p-7">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            Se vuelven a ver en el Mundial 2026
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="inline-flex items-center gap-2 text-sm text-[var(--color-fg-muted)]">
              <CalendarDays className="h-4 w-4 text-[var(--color-pitch)]" />
              {fmtDate(h.fixture2026.date)} · {groupLabel(h.fixture2026.stage)}
            </span>
            <Link
              href={withLocale(locale, `/2026/partido/${h.fixture2026.slug}`)}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-black transition-transform hover:scale-[1.03]"
            >
              Ver el partido
            </Link>
          </div>
        </section>
      )}

      {/* Tabla de enfrentamientos */}
      {h.total > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-fluid-h2 uppercase leading-none">
            Todos los enfrentamientos
          </h2>
          <div className="mt-6 overflow-hidden rounded-3xl border border-[var(--color-border)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--color-bg-2)] font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                  <th className="px-4 py-3 text-left">Año</th>
                  <th className="px-4 py-3 text-left">Fase</th>
                  <th className="px-4 py-3 text-center">Resultado</th>
                  <th className="hidden px-4 py-3 text-left sm:table-cell">Sede</th>
                </tr>
              </thead>
              <tbody>
                {h.meetings.map((m, i) => (
                  <tr
                    key={`${m.year}-${i}`}
                    className="border-t border-[var(--color-border)] odd:bg-[var(--color-bg)] even:bg-[var(--color-bg-2)]/40"
                  >
                    <td className="px-4 py-3 font-mono tab-num text-[var(--color-fg)]">{m.year}</td>
                    <td className="px-4 py-3 text-[var(--color-fg-muted)]">{stageLabel(m.stage)}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={
                          m.winner === 'a'
                            ? 'font-semibold text-[var(--color-pitch)]'
                            : 'text-[var(--color-fg)]'
                        }
                      >
                        {m.aScore}
                      </span>
                      <span className="mx-1 text-[var(--color-fg-subtle)]">-</span>
                      <span
                        className={
                          m.winner === 'b'
                            ? 'font-semibold text-[var(--color-pitch)]'
                            : 'text-[var(--color-fg)]'
                        }
                      >
                        {m.bScore}
                      </span>
                      {m.decided === 'pen' && (
                        <span className="ml-2 font-mono text-[10px] uppercase text-[var(--color-fg-subtle)]">
                          pen.
                        </span>
                      )}
                      {m.decided === 'pr' && (
                        <span className="ml-2 font-mono text-[10px] uppercase text-[var(--color-fg-subtle)]">
                          pró.
                        </span>
                      )}
                    </td>
                    <td className="hidden px-4 py-3 text-[var(--color-fg-subtle)] sm:table-cell">
                      {m.venue ? (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-3 w-3" />
                          {m.venue}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-[var(--color-fg-subtle)]">
            Resultados del tiempo reglamentario; «pró.» indica que se resolvió en la prórroga y
            «pen.» en la tanda de penaltis. El equipo destacado en verde ganó el partido.
          </p>
        </section>
      )}

      <p className="mt-12 text-sm text-[var(--color-fg-muted)]">
        Sigue toda la actualidad en las{' '}
        <Link
          href={withLocale(locale, '/noticias')}
          className="underline decoration-[var(--color-fg-subtle)] underline-offset-4 hover:text-[var(--color-pitch)]"
        >
          noticias del Mundial 2026
        </Link>{' '}
        y consulta el{' '}
        <Link
          href={withLocale(locale, '/2026/calendario')}
          className="underline decoration-[var(--color-fg-subtle)] underline-offset-4 hover:text-[var(--color-pitch)]"
        >
          calendario
        </Link>
        .
      </p>
    </main>
  );
}

function Stat({ big, label }: { big: string; label: string }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-4">
      <div className="font-display text-3xl tab-num text-[var(--color-fg)] md:text-4xl">{big}</div>
      <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
        {label}
      </div>
    </div>
  );
}

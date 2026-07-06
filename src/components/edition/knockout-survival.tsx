import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { TEAMS_2026, STAGE_LABEL } from '@/lib/wc-2026';
import { getKnockoutSurvival } from '@/lib/wc-2026-knockout';
import { routing, type Locale } from '@/i18n/routing';

const tName = (c: string) => TEAMS_2026[c]?.name ?? c;
const tFlag = (c: string) => TEAMS_2026[c]?.flag ?? '🏳️';

function withLocale(locale: Locale, href: string) {
  return locale === routing.defaultLocale ? href : `/${locale}${href}`;
}

/**
 * "Equipos que siguen vivos / equipos eliminados" del Mundial 2026, en vivo.
 * Cubre la demanda de cuadro actualizado / cruces / eliminados / quién queda,
 * todo derivado de los cruces reales de ESPN.
 */
export async function KnockoutSurvival({ locale }: { locale: Locale }) {
  const { alive, eliminated, latestRoundKey } = await getKnockoutSurvival();
  if (alive.length === 0 && eliminated.length === 0) return null;

  const roundNow = latestRoundKey ? (STAGE_LABEL[latestRoundKey] ?? latestRoundKey) : null;

  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 py-12 md:px-10">
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
        Cuadro actualizado
      </div>
      <h2 className="mt-3 font-display text-fluid-h2 uppercase leading-none">
        Quién queda y quién ha caído
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-fg-muted)]">
        Los cruces de las eliminatorias del Mundial 2026, actualizados en directo: estos son
        los <strong className="text-[var(--color-fg)]">{alive.length} equipos que siguen vivos</strong>
        {roundNow ? <> tras los {roundNow.toLowerCase()}</> : null} y los que ya han quedado{' '}
        <strong className="text-[var(--color-fg)]">eliminados</strong> del torneo.
      </p>

      {/* Siguen vivos */}
      {alive.length > 0 && (
        <div className="mt-8">
          <div className="mb-4 flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
              Siguen en pie
            </span>
            <span className="font-mono text-xs tab-num text-[var(--color-pitch)]">{alive.length}</span>
            <span className="h-px flex-1 bg-[var(--color-border)]" />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {alive.map((code) => (
              <Link
                key={code}
                href={withLocale(locale, `/selecciones/${code}`)}
                className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-3 transition-colors hover:border-[var(--color-pitch)]"
              >
                <span className="text-2xl leading-none" aria-hidden>{tFlag(code)}</span>
                <span className="truncate text-sm font-semibold text-[var(--color-fg)]">{tName(code)}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Eliminados */}
      {eliminated.length > 0 && (
        <div className="mt-10">
          <div className="mb-4 flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
              Eliminados
            </span>
            <span className="font-mono text-xs tab-num text-[var(--color-fg-subtle)]">{eliminated.length}</span>
            <span className="h-px flex-1 bg-[var(--color-border)]" />
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {eliminated.map((e) => (
              <Link
                key={e.code}
                href={withLocale(locale, `/selecciones/${e.code}`)}
                className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 transition-colors hover:border-[var(--color-flame)]/60"
              >
                <span className="text-xl leading-none opacity-60" aria-hidden>{tFlag(e.code)}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-[var(--color-fg-muted)] line-through decoration-[var(--color-fg-subtle)]/50">
                    {tName(e.code)}
                  </span>
                  <span className="block truncate font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
                    {e.roundLabel}{e.byCode ? ` · cayó con ${tName(e.byCode)}` : ''}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <Link
        href={withLocale(locale, '/2026/goleadores')}
        className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-pitch)] hover:underline"
      >
        Máximo goleador y Bota de Oro <ArrowRight className="h-3 w-3 rtl:rotate-180" />
      </Link>
    </section>
  );
}

import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import { GROUPS_2026, TEAMS_2026, HOSTS } from '@/lib/wc-2026';
import { routing, type Locale } from '@/i18n/routing';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

/**
 * Heatmap de los 12 grupos del Mundial 2026.
 *
 * Server component. Grid de 12 columnas (responsive a 6/4/3) con una columna
 * por grupo y 4 banderas dentro. Cada bandera linka a /selecciones/{code}.
 *
 * Visual:
 *  - Grupos anfitriones (A=MEX, B=CAN, C=USA) tienen borde verde sutil
 *  - Banderas de selecciones anfitrionas llevan ★ dorado pequeño
 *  - Click bandera → ficha de selección
 *  - Click letra grupo → /2026/grupo/{letter}
 */
export async function GroupsHeatmap({ locale }: { locale: Locale }) {
  const t = await getTranslations('home.groups');
  const hostCodes = new Set<string>(HOSTS.map((h) => h.code));

  return (
    <section className="relative mx-auto w-full max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            {t('kicker')}
          </div>
          <h2 className="mt-3 font-display text-fluid-h1 uppercase leading-[0.92]">
            {t('title')}
          </h2>
        </div>
        <Link
          href={withLocale(locale, '/2026/grupos')}
          className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-pitch)]"
        >
          {t('seeAll')}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-12">
        {GROUPS_2026.map((group) => {
          // `teams` puede tener `null` (plaza de repechaje sin resolver al cierre de catálogo).
          const hostInGroup = group.teams.some(
            (c): c is string => c !== null && hostCodes.has(c),
          );
          return (
            <div
              key={group.letter}
              className={`rounded-2xl border bg-[var(--color-bg-2)] p-3 text-center transition-colors ${
                hostInGroup
                  ? 'border-[var(--color-pitch)]/40'
                  : 'border-[var(--color-border)]'
              }`}
            >
              <Link
                href={withLocale(locale, `/2026/grupo/${group.letter}`)}
                className="block font-display text-2xl font-extrabold text-[var(--color-pitch)] hover:underline"
                aria-label={`${t('groupLabel')} ${group.letter}`}
              >
                {group.letter}
              </Link>
              <div className="mt-3 flex flex-col gap-1.5">
                {group.teams.map((code, i) => {
                  if (!code) {
                    return (
                      <span
                        key={`pending-${i}`}
                        className="inline-flex items-center justify-center text-2xl opacity-30"
                        aria-label="Por confirmar"
                        title="Por confirmar"
                      >
                        ⚪
                      </span>
                    );
                  }
                  const team = TEAMS_2026[code];
                  if (!team) return null;
                  const isHost = hostCodes.has(code);
                  return (
                    <Link
                      key={code}
                      href={withLocale(locale, `/selecciones/${code}`)}
                      title={team.name}
                      className="group/team relative inline-flex items-center justify-center text-2xl transition-transform hover:scale-125"
                    >
                      <span aria-hidden>{team.flag}</span>
                      {isHost && (
                        <span
                          aria-label={t('host')}
                          className="absolute -right-1 -top-1 text-[8px] text-[var(--color-sun)]"
                        >
                          ★
                        </span>
                      )}
                      <span className="sr-only">{team.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
        ★ {t('hostLegend')} · {t('clickHint')}
      </p>
    </section>
  );
}

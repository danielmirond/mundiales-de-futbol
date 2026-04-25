import Link from 'next/link';
import Image from 'next/image';
import {
  displayPlayerName,
  type PlayerStats,
} from '@/lib/data/players';
import { routing, type Locale } from '@/i18n/routing';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export type RecordTableColumn = {
  /** Cabecera (corta, MAX 12 chars) */
  label: string;
  /** Función para extraer el valor */
  value: (p: PlayerStats) => string | number;
  /** Si esta es la columna principal (badge destacado) */
  primary?: boolean;
  /** Esconder en mobile */
  hideOnMobile?: boolean;
};

/**
 * Tabla reutilizable para páginas de récords.
 * Renderiza un podio (top 3) destacado + tabla ordenada con foto, país, datos.
 */
export function RecordTable({
  players,
  columns,
  locale,
  highlightLabel,
}: {
  players: PlayerStats[];
  columns: RecordTableColumn[];
  locale: string;
  /** Texto que aparece bajo el número de podio. Ej: "goles" */
  highlightLabel: string;
}) {
  if (players.length === 0) return null;
  const podium = players.slice(0, 3);
  const rest = players.slice(3);
  const primaryCol = columns.find((c) => c.primary) ?? columns[0];

  return (
    <>
      {/* Podio top 3 */}
      <div className="grid gap-4 md:grid-cols-3 md:gap-6">
        {podium.map((p, i) => {
          const rank = i + 1;
          const value = primaryCol.value(p);
          return (
            <Link
              key={p.id}
              href={withLocale(locale as Locale, `/jugadores/${p.slug}`)}
              className="group relative flex gap-5 overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5 transition-colors hover:border-[var(--color-border-strong)] md:flex-col md:gap-4 md:p-6"
            >
              <div className="absolute right-5 top-5 font-display text-5xl tab-num leading-none text-[var(--color-fg-subtle)] md:text-6xl">
                #{rank}
              </div>
              {p.photo_url ? (
                <div className="relative aspect-[3/4] w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-black md:aspect-[4/5] md:w-full">
                  <Image
                    src={p.photo_url}
                    alt={displayPlayerName(p)}
                    fill
                    sizes="(max-width: 768px) 100px, 25vw"
                    className="object-cover transition-transform group-hover:scale-105"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="aspect-[3/4] w-24 flex-shrink-0 rounded-2xl bg-[var(--color-bg)] md:aspect-[4/5] md:w-full" />
              )}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <div className="font-display text-xl uppercase leading-tight text-[var(--color-fg)] md:text-2xl">
                    {displayPlayerName(p)}
                  </div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
                    {p.nationality_code} · {p.position ?? '—'}
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-display text-4xl tab-num text-[var(--color-pitch)] md:text-5xl">
                    {value}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                    {highlightLabel}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Tabla del resto */}
      {rest.length > 0 && (
        <div className="mt-12 overflow-x-auto rounded-2xl border border-[var(--color-border)]">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-2)] text-left font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                <th className="w-14 px-4 py-4">#</th>
                <th className="px-4 py-4">Jugador</th>
                <th className="hidden px-4 py-4 md:table-cell">País</th>
                {columns.map((c) => (
                  <th
                    key={c.label}
                    className={`px-4 py-4 text-right ${c.hideOnMobile ? 'hidden md:table-cell' : ''}`}
                  >
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {rest.map((p, i) => {
                const rank = i + 4;
                return (
                  <tr key={p.id} className="hover:bg-[var(--color-bg-2)]/40">
                    <td className="px-4 py-3 font-mono text-[var(--color-fg-subtle)] tab-num">{rank}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={withLocale(locale as Locale, `/jugadores/${p.slug}`)}
                        className="flex items-center gap-3 font-medium text-[var(--color-fg)] hover:text-[var(--color-pitch)]"
                      >
                        {p.photo_url ? (
                          <Image
                            src={p.photo_url}
                            alt=""
                            width={36}
                            height={36}
                            className="h-9 w-9 rounded-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <span className="h-9 w-9 rounded-full bg-[var(--color-bg-2)]" />
                        )}
                        <span>{displayPlayerName(p)}</span>
                      </Link>
                    </td>
                    <td className="hidden px-4 py-3 font-mono text-xs text-[var(--color-fg-muted)] md:table-cell">
                      {p.nationality_code}
                    </td>
                    {columns.map((c) => (
                      <td
                        key={c.label}
                        className={`px-4 py-3 text-right tab-num ${c.primary ? 'font-mono text-[var(--color-pitch)]' : 'text-[var(--color-fg-muted)]'} ${c.hideOnMobile ? 'hidden md:table-cell' : ''}`}
                      >
                        {c.value(p)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

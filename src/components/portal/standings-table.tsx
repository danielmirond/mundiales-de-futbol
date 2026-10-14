import Link from 'next/link';
import { fetchStandings, STANDING_COLUMNS, type StandingRow } from '@/lib/espn';
import { fetchTeams } from '@/lib/espn-team';
import type { Competition } from '@/lib/competitions';
import { ZONES, ZONE_VAR, zoneFor } from '@/lib/standings-zones';
import { Crest } from './crest';
import { groupEs } from '@/lib/i18n-sport';
import { routing, type Locale } from '@/i18n/routing';

const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);
/** Columnas que se ocultan en móvil (queda DG). */
const MOBILE_HIDDEN = new Set(['pointsFor', 'pointsAgainst', 'gamesBehind', 'streak']);

/**
 * Clasificación (sistema de diseño · 10): marca de zona de 3 px junto a la
 * posición, fila resaltada, columnas por deporte, leyenda. `slice` muestra
 * solo el equipo resaltado con su vecino de arriba y de abajo (ficha de equipo).
 */
export async function StandingsTable({
  comp, locale = routing.defaultLocale, highlight, slice = false, title,
}: { comp: Competition; locale?: Locale; highlight?: string; slice?: boolean; title?: string }) {
  const [{ season, groups }, teams] = await Promise.all([fetchStandings(comp), fetchTeams(comp)]);
  if (groups.length === 0) return null;
  const cols = STANDING_COLUMNS[comp.espn?.sport ?? 'soccer'] ?? STANDING_COLUMNS.soccer;
  const slugOf = (abbr: string, name: string) => teams.find((t) => t.abbr === abbr || t.name === name)?.slug;
  const zones = ZONES[comp.slug] ?? [];
  const isHl = (r: StandingRow) => !!highlight && (r.abbr === highlight || r.name === highlight);

  const visible = slice
    ? groups.map((g) => {
        const i = g.rows.findIndex(isHl);
        return i < 0 ? null : { ...g, rows: g.rows.slice(Math.max(0, i - 1), i + 2) };
      }).filter(Boolean) as typeof groups
    : groups;
  if (visible.length === 0) return null;

  return (
    <section className={`mx-auto w-full max-w-[1400px] px-6 md:px-10 ${slice ? 'pb-12' : 'py-12'}`} data-sport={comp.sport}>
      <div className="kicker">Clasificación{season && !slice ? ` · ${season}` : ''}</div>
      {!slice && <h2 className="t-h2 mt-3 text-[var(--color-fg)]">{title ?? `Clasificación de ${comp.shortName ?? comp.name}`}</h2>}
      <div className={`mt-6 grid gap-8 ${visible.length > 1 && !slice ? 'lg:grid-cols-2' : ''}`}>
        {visible.map((g) => (
          <div key={g.name}>
            {groups.length > 1 && <h3 className="sub-label mb-3">{groupEs(g.name)}</h3>}
            <div className="overflow-x-auto rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)] px-3 md:px-5">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
                    <th className="w-11 px-2 py-3 text-center font-medium">#</th>
                    <th className="px-2 py-3 text-left font-medium">Equipo</th>
                    {cols.map((c) => <th key={c.key} className={`px-2 py-3 text-center font-medium ${MOBILE_HIDDEN.has(c.key) ? 'hidden md:table-cell' : ''}`} title={c.title}>{c.label}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {g.rows.map((r) => {
                    const z = zoneFor(comp.slug, r.rank);
                    const slug = slugOf(r.abbr, r.name);
                    const hl = isHl(r);
                    const inner = <><Crest src={r.logo} abbr={r.abbr} size="s" /><span className="truncate">{r.name}</span></>;
                    return (
                      <tr key={`${g.name}-${r.abbr}-${r.rank}`} className={`border-t border-[var(--color-border)] ${hl ? 'bg-[color-mix(in_oklab,var(--accent)_9%,transparent)]' : ''}`}>
                        <td className="relative h-11 px-2 text-center font-mono text-xs tab-num text-[var(--color-fg-subtle)]">
                          {z && <span aria-label={z.label} title={z.label} className="absolute left-0 top-[9px] bottom-[9px] w-[3px] rounded-[2px]" style={{ background: ZONE_VAR[z.key] }} />}
                          {r.rank}
                        </td>
                        <td className="h-11 px-2">
                          {slug ? (
                            <Link href={withLocale(locale, `/${comp.sport}/${comp.slug}/equipo/${slug}`)} className="flex items-center gap-2.5 font-medium text-[var(--color-fg)] hover:text-[var(--accent-ink)]">{inner}</Link>
                          ) : <span className="flex items-center gap-2.5 font-medium text-[var(--color-fg)]">{inner}</span>}
                        </td>
                        {cols.map((c) => (
                          <td key={c.key} className={`h-11 px-2 text-center tab-num ${MOBILE_HIDDEN.has(c.key) ? 'hidden md:table-cell' : ''} ${c.key === 'points' || c.key === 'winPercent' ? 'text-[15px] font-semibold text-[var(--color-fg)]' : 'text-[var(--color-fg-muted)]'}`}>
                            {r.stats[c.key] ?? '–'}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
      {zones.length > 0 && !slice && (
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-[var(--color-fg-muted)]">
          {zones.map((z) => <span key={z.key + z.label} className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-[3px]" style={{ background: ZONE_VAR[z.key] }} />{z.label}</span>)}
        </div>
      )}
      {slice && (
        <Link href={withLocale(locale, `/${comp.sport}/${comp.slug}`)} className="mt-3 inline-block font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent-ink)] hover:underline">Tabla completa →</Link>
      )}
    </section>
  );
}

/** Forma: últimos resultados como fichas G/E/P. */
export function FormChips({ results }: { results: ('W' | 'D' | 'L' | string)[] }) {
  const map: Record<string, { c: string; l: string }> = { W: { c: 'g', l: 'G' }, D: { c: 'e', l: 'E' }, L: { c: 'p', l: 'P' } };
  return (
    <span className="form" aria-label={`Últimos resultados: ${results.map((r) => map[r]?.l ?? r).join(', ')}`}>
      {results.map((r, i) => <i key={i} className={map[r]?.c ?? 'e'}>{map[r]?.l ?? r}</i>)}
    </span>
  );
}

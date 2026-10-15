import { fetchWindow, dayKeys } from '@/lib/espn';
import { getWostiIndex, channelsFor } from '@/lib/wosti';
import { platformOf, PLATFORM_LABEL, PLATFORM_URL, DAZN_NFL_AFF, type Platform } from '@/lib/affiliate';
import type { Competition } from '@/lib/competitions';

/**
 * Plataforma conocida por competición cuando no hay guía de TV por partido.
 * Fuente: alertas del programa de afiliados de DAZN (Awin), 15/10/2026.
 */
const DAZN_FUTBOL = 'Incluida en DAZN Fútbol';
const STATIC: Record<string, { p: Platform; note: string; url?: string }[]> = {
  nfl: [{ p: 'dazn', note: 'Todos los partidos con NFL Game Pass', url: DAZN_NFL_AFF }],
  boxeo: [{ p: 'dazn', note: 'Las grandes veladas en PPV' }],
  'formula-1': [{ p: 'dazn', note: 'Incluida en DAZN Motor' }],
  motogp: [{ p: 'dazn', note: 'Incluido en DAZN Motor' }],
  nba: [{ p: 'dazn', note: 'Incluida en DAZN Baloncesto, desde 5,99 €/mes' }],
  'liga-endesa': [{ p: 'dazn', note: 'Incluida en DAZN Baloncesto, desde 5,99 €/mes' }],
  'premier-league': [{ p: 'dazn', note: DAZN_FUTBOL }],
  bundesliga: [{ p: 'dazn', note: DAZN_FUTBOL }],
  'serie-a': [{ p: 'dazn', note: DAZN_FUTBOL }],
  'ligue-1': [{ p: 'dazn', note: DAZN_FUTBOL }],
  'laliga-2': [{ p: 'dazn', note: DAZN_FUTBOL }],
  'primeira-liga': [{ p: 'dazn', note: DAZN_FUTBOL }],
  eredivisie: [{ p: 'dazn', note: DAZN_FUTBOL }],
};

/**
 * «Dónde ver» de una competición con enlaces de afiliado. En fútbol cuenta
 * los partidos de los próximos 10 días que emite cada plataforma según la
 * guía de TV (WOSTI); no afirma nada que la guía no diga.
 */
export async function WhereToWatch({ comp }: { comp: Competition }) {
  let rows: { p: Platform; note: string; url: string }[] = [];
  // Fútbol: primero lo que diga la guía de TV de los próximos partidos.
  if (comp.sport === 'futbol' && comp.espn) {
    const [matches, idx] = await Promise.all([fetchWindow([comp], dayKeys(0, 10), 900), getWostiIndex()]);
    const count: Record<Platform, number> = { movistar: 0, dazn: 0 };
    for (const m of matches.filter((x) => x.state === 'pre')) {
      const ps = new Set(channelsFor(idx, m.date, [m.home.fullName, m.home.name], [m.away.fullName, m.away.name]).map(platformOf).filter(Boolean) as Platform[]);
      ps.forEach((p) => count[p]++);
    }
    rows = (Object.keys(count) as Platform[]).filter((p) => count[p] > 0).sort((a, b) => count[b] - count[a])
      .map((p) => ({ p, note: `${count[p]} ${count[p] === 1 ? 'partido' : 'partidos'} en los próximos 10 días`, url: PLATFORM_URL[p] }));
  }
  // Sin guía (u otros deportes): la plataforma que confirma el anunciante.
  if (rows.length === 0 && STATIC[comp.slug]) {
    rows = STATIC[comp.slug].map((r) => ({ ...r, url: r.url ?? PLATFORM_URL[r.p] }));
  }
  if (rows.length === 0) return null;
  const name = comp.shortName ?? comp.name;
  return (
    <aside aria-label={`Dónde ver ${name}`} className="mx-auto mt-4 w-full max-w-[1400px] px-6 md:px-10">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[16px] border border-[var(--color-border)] bg-[var(--color-bg-2)] px-4 py-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">Dónde ver {name}</span>
        {rows.map((r) => (
          <a key={r.p} href={r.url} target="_blank" rel="sponsored nofollow noopener noreferrer"
            className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-3.5 py-1.5 text-sm hover:border-[var(--color-fg)]">
            <strong className="font-semibold text-[var(--color-fg)]">{PLATFORM_LABEL[r.p]}</strong>
            <span className="text-[var(--color-fg-muted)]">{r.note}</span>
            <span aria-hidden className="text-[var(--color-fg-subtle)]">↗</span>
          </a>
        ))}
        <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-fg-subtle)]">Enlaces de afiliado</span>
      </div>
    </aside>
  );
}

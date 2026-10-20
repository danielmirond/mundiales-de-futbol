import Link from 'next/link';
import { nflSnapshot } from '@/lib/nfl-advanced';
import { routing, type Locale } from '@/i18n/routing';

const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);
const dec = (v: number, d = 2) => v.toFixed(d).replace('.', ',');

/** Ranking de quarterbacks por EPA por jugada (nflverse): cuánto suma cada uno, no cuántas yardas acumula. */
export function NflQbRanking({ locale }: { locale: Locale }) {
  const S = nflSnapshot();
  if (!S.qbs.length) return null;
  const max = Math.max(...S.qbs.map((q) => Math.abs(q.epa)));
  return (
    <section className="mx-auto mt-12 w-full max-w-[1400px] px-6 md:px-10" aria-labelledby="qb-titulo">
      <div className="kicker">Ranking avanzado · semana {S.week}</div>
      <h2 id="qb-titulo" className="t-h2 mt-2 text-[var(--color-fg)]">Los quarterbacks que más suman</h2>
      <p className="mt-2 max-w-3xl text-[14px] text-[var(--color-fg-muted)]">
        Ordenados por EPA por jugada: los puntos esperados que añade de media cada pase, carrera o saco del quarterback, según dónde y cómo deja a su equipo. El CPOE mide cuánto acierta en el pase por encima de lo que se espera por la dificultad de cada lanzamiento. Mínimo {S.minPlays} jugadas.
      </p>
      <div className="mt-5 overflow-x-auto rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)] px-3 md:px-5">
        <table className="w-full min-w-[620px] border-collapse text-sm">
          <thead>
            <tr className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]">
              <th className="px-2 py-3 text-left font-medium">#</th><th className="px-2 py-3 text-left font-medium">Quarterback</th><th className="px-2 py-3 text-left font-medium">Equipo</th>
              <th className="px-2 py-3 text-left font-medium">EPA por jugada</th><th className="px-2 py-3 text-right font-medium">CPOE</th><th className="px-2 py-3 text-right font-medium">Jugadas</th>
            </tr>
          </thead>
          <tbody>
            {S.qbs.map((q, i) => {
              const t = S.teams[q.team];
              return (
                <tr key={q.name + q.team} className="border-t border-[var(--color-border)]">
                  <td className="h-10 px-2 font-mono text-[12px] text-[var(--color-fg-subtle)]">{i + 1}</td>
                  <td className="h-10 px-2 font-medium text-[var(--color-fg)]">{q.espnId ? <Link href={withLocale(locale, `/futbol-americano/nfl/jugador/${q.espnId}`)} className="hover:text-[var(--accent-ink)]">{q.name}</Link> : q.name}</td>
                  <td className="h-10 px-2 text-[var(--color-fg-muted)]"><span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full align-middle" style={{ background: t?.color }} />{t?.nick ?? q.team}</td>
                  <td className="h-10 px-2">
                    <span className="flex items-center gap-2">
                      <span className="tab-num w-12 text-[var(--color-fg)]">{q.epa > 0 ? '+' : ''}{dec(q.epa)}</span>
                      <span className="h-2 w-40 overflow-hidden rounded-full bg-[var(--color-border)]"><span className="block h-full rounded-full" style={{ width: `${(Math.abs(q.epa) / max) * 100}%`, background: q.epa >= 0 ? 'var(--color-win, #2e7d4f)' : 'var(--color-live-ink)' }} /></span>
                    </span>
                  </td>
                  <td className="h-10 px-2 text-right tab-num text-[var(--color-fg-muted)]">{q.cpoe === null ? '–' : `${q.cpoe > 0 ? '+' : ''}${dec(q.cpoe, 1)}`}</td>
                  <td className="h-10 px-2 text-right tab-num text-[var(--color-fg-muted)]">{q.plays}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">Datos: nflverse (CC BY 4.0) · temporada regular {S.season}</p>
    </section>
  );
}

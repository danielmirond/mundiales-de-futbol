import { fcTeamTiming, FC_HOME } from '@/lib/footballcharts';
import { ObfuscatedLink } from '@/components/ui/obfuscated-link';

const LABEL: Record<string, string> = { '0-15': '1-15′', '15-30': '16-30′', '30-45': '31-45′', '45+': '45+′', '46-60': '46-60′', '60-75': '61-75′', '75-90': '76-90′', '90+': '90+′' };

/**
 * «Cuándo marca»: goles a favor del equipo por tramos de 15 minutos esta temporada,
 * con el porcentaje de goles finales comparado con la media de su liga.
 * Datos de football-charts.com (copia diaria); solo ligas con minuto de goles.
 */
export function GoalTiming({ espnLeague, teamId, teamName, compName }: { espnLeague?: string; teamId: string; teamName: string; compName: string }) {
  const t = fcTeamTiming(espnLeague, teamId, teamName);
  if (!t || t.team.total < 3) return null;
  const { league, team } = t;
  const max = Math.max(...team.goals, 1);
  const peak = team.goals.indexOf(Math.max(...team.goals));
  const leagueTotal = league.league.reduce((a, b) => a + b, 0) || 1;
  // «Finales» = 76-90 + 90+, igual que late_share_pct del origen.
  const leagueLate = Math.round((100 * ((league.league[6] ?? 0) + (league.league[7] ?? 0))) / leagueTotal);
  const diff = team.late - leagueLate;

  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 pb-12 md:px-10">
      <div className="kicker">Cuándo marca · {compName} {league.season.replace('-20', '-')}</div>
      <h2 className="t-h2 mt-3 text-[var(--color-fg)]">Los goles del {teamName}, minuto a minuto</h2>
      <p className="mt-3 max-w-2xl text-[var(--color-fg-muted)]">
        {team.total} goles a favor esta temporada. Marca el <b className="text-[var(--color-fg)]">{team.late} %</b> a partir del minuto 76
        {Math.abs(diff) >= 3 ? <> ({diff > 0 ? `${diff} puntos más` : `${-diff} puntos menos`} que la media de la liga, {leagueLate} %)</> : <> (como la media de la liga, {leagueLate} %)</>}
        {' '}y el {team.firstHalf} % en la primera parte. Su tramo más productivo: {LABEL[league.bins[peak]] ?? league.bins[peak]}.
      </p>

      <div className="mt-6 grid h-44 grid-cols-8 items-end gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-4 md:gap-3 md:p-5" role="img" aria-label={`Goles del ${teamName} por tramos: ${league.bins.map((b, i) => `${LABEL[b] ?? b} ${team.goals[i]}`).join(', ')}`}>
        {team.goals.map((g, i) => (
          <div key={league.bins[i]} className="grid h-full grid-rows-[1fr_auto_auto] items-end gap-1 text-center">
            <div className="flex h-full items-end justify-center">
              <div className="w-full max-w-[44px] rounded-t-md" style={{ height: `${Math.max((g / max) * 100, g ? 6 : 2)}%`, background: i === peak ? 'var(--accent)' : 'color-mix(in oklab, var(--accent) 38%, transparent)' }} />
            </div>
            <span className="font-display tab-num text-base leading-none text-[var(--color-fg)]">{g}</span>
            <span className={`font-mono text-[9px] leading-tight md:text-[10px] ${i === 3 || i === 7 ? 'text-[var(--color-fg-subtle)]' : 'text-[var(--color-fg-muted)]'}`}>{LABEL[league.bins[i]] ?? league.bins[i]}</span>
          </div>
        ))}
      </div>
      <p className="mt-2 font-mono text-[11px] text-[var(--color-fg-subtle)]">
        Data by <ObfuscatedLink href={FC_HOME}>football-charts.com</ObfuscatedLink> · {league.matches} partidos de la liga · se actualiza a diario
      </p>
    </section>
  );
}

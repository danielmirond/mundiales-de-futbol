import Link from 'next/link';
import type { MatchPreview, FormGame, TableSpot } from '@/lib/espn-preview';
import { Crest } from '@/components/portal/crest';
import { InjuryList } from '@/components/portal/injuries';

const CHIP: Record<FormGame['result'], string> = { G: 'g', E: 'e', P: 'p' };
const dateEs = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: '2-digit', timeZone: 'Europe/Madrid' }).format(d);
};
const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5 ${className}`}>{children}</div>
);

function FormBlock({ name, games, teamBase }: { name: string; games: FormGame[]; teamBase: string }) {
  const tally = { G: 0, E: 0, P: 0 };
  games.forEach((g) => tally[g.result]++);
  return (
    <Card>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="t-h3 text-[var(--color-fg)]">{name}</h3>
        <span className="form" aria-label={`Últimos resultados de ${name}`}>{[...games].reverse().map((g) => <i key={g.id} className={CHIP[g.result]}>{g.result}</i>)}</span>
      </div>
      <p className="mt-1 text-xs text-[var(--color-fg-subtle)]">{tally.E > 0 ? `${plural(tally.G, 'victoria', 'victorias')}, ${plural(tally.E, 'empate', 'empates')} y ${plural(tally.P, 'derrota', 'derrotas')}` : `${plural(tally.G, 'victoria', 'victorias')} y ${plural(tally.P, 'derrota', 'derrotas')}`} en sus últimos {games.length} partidos</p>
      <ul className="mt-3 divide-y divide-[var(--color-border)]">
        {games.map((g) => (
          <li key={g.id} className="flex items-center gap-3 py-2 text-sm">
            <span className="w-14 shrink-0 font-mono text-[10px] tab-num text-[var(--color-fg-subtle)]">{dateEs(g.date)}</span>
            <span className="w-5 shrink-0 text-center font-mono text-[10px] text-[var(--color-fg-subtle)]">{g.home ? 'vs' : 'en'}</span>
            <Crest src={g.opponent.logo} abbr={g.opponent.abbr} size="s" />
            <span className="min-w-0 flex-1 truncate text-[var(--color-fg)]">
              {g.opponent.id ? <Link href={`${teamBase}/${g.opponent.id}`} className="hover:text-[var(--accent-ink)]">{g.opponent.name}</Link> : g.opponent.name}
            </span>
            <span className="font-semibold tab-num text-[var(--color-fg)]">{g.goalsFor ?? '–'}-{g.goalsAgainst ?? '–'}</span>
            <span className="form"><i className={CHIP[g.result]}>{g.result}</i></span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function Spot({ name, s, total, standingsHref }: { name: string; s?: TableSpot; total: number; standingsHref: string }) {
  if (!s) return null;
  const pts = s.stats.points;
  const { wins, ties, losses } = s.stats;
  const rec = wins && losses ? `${wins}G${ties ? ` ${ties}E` : ''} ${losses}P` : s.stats.overall;
  return (
    <Link href={standingsHref} className="flex items-center gap-4 rounded-[14px] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 hover:border-[var(--color-border-strong)]">
      <span className="font-display text-4xl leading-none tab-num text-[var(--color-fg)]">{s.rank}.º</span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium text-[var(--color-fg)]">{name}</span>
        <span className="block text-xs text-[var(--color-fg-subtle)]">{total >= 10 ? `de ${total}` : 'en su grupo'}{pts ? ` · ${pts} puntos` : ''}{rec ? ` · ${rec}` : ''}</span>
      </span>
    </Link>
  );
}

/** Previa del partido: racha, cara a cara, posición en la tabla y bajas. */
export function MatchPreviewSections({
  preview, homeName, awayName, teamBase, standingsHref, playerBase,
}: { preview: MatchPreview; homeName: string; awayName: string; teamBase: string; standingsHref?: string; playerBase?: string }) {
  const { form, series, injuries, table } = preview;
  const hasForm = form.home.length > 0 || form.away.length > 0;
  const hasInj = injuries.home.length > 0 || injuries.away.length > 0;
  if (!hasForm && !series && !table && !hasInj) return null;
  return (
    <section id="previa" className="mx-auto mt-12 w-full max-w-[1000px] scroll-mt-40 px-6 md:px-10">
      <div className="kicker">Previa</div>
      <h2 className="t-h2 mt-3 text-[var(--color-fg)]">Cómo llegan {homeName} y {awayName}</h2>

      {table && standingsHref && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Spot name={homeName} s={table.home} total={table.total} standingsHref={standingsHref} />
          <Spot name={awayName} s={table.away} total={table.total} standingsHref={standingsHref} />
        </div>
      )}

      {hasForm && (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {form.home.length > 0 && <FormBlock name={homeName} games={form.home} teamBase={teamBase} />}
          {form.away.length > 0 && <FormBlock name={awayName} games={form.away} teamBase={teamBase} />}
        </div>
      )}

      {series && (
        <Card className="mt-4">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="t-h3 text-[var(--color-fg)]">Cara a cara</h3>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">{series.label}</span>
          </div>
          <ul className="mt-3 divide-y divide-[var(--color-border)]">
            {series.games.map((g) => (
              <li key={g.id} className="grid grid-cols-[3.5rem_1fr_auto_1fr] items-center gap-3 py-2 text-sm">
                <span className="font-mono text-[10px] tab-num text-[var(--color-fg-subtle)]">{dateEs(g.date)}</span>
                <span className={`truncate text-right ${g.winner === 'home' ? 'font-semibold text-[var(--color-fg)]' : 'text-[var(--color-fg-muted)]'}`}>{g.homeName}</span>
                <span className="font-semibold tab-num text-[var(--color-fg)]">{g.homeScore}-{g.awayScore}</span>
                <span className={`truncate ${g.winner === 'away' ? 'font-semibold text-[var(--color-fg)]' : 'text-[var(--color-fg-muted)]'}`}>{g.awayName}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {hasInj && (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Card><div className="sub-label">Bajas · {homeName}</div><div className="mt-2"><InjuryList items={injuries.home} playerBase={playerBase} /></div></Card>
          <Card><div className="sub-label">Bajas · {awayName}</div><div className="mt-2"><InjuryList items={injuries.away} playerBase={playerBase} /></div></Card>
        </div>
      )}
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">Fuente: ESPN</p>
    </section>
  );
}

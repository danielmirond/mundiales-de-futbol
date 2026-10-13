import Link from 'next/link';
import type { Match } from '@/lib/data/matches';
import { routing, type Locale } from '@/i18n/routing';

const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);
const ROUNDS: { stage: string; label: string }[] = [
  { stage: 'r32', label: 'Dieciseisavos' }, { stage: 'r16', label: 'Octavos' }, { stage: 'qf', label: 'Cuartos' }, { stage: 'sf', label: 'Semifinales' }, { stage: 'final', label: 'Final' },
];

const score = (m: Match) => (m.home_score == null ? '–' : `${m.home_score}–${m.away_score}${m.home_score_pk != null ? ` (${m.home_score_pk}–${m.away_score_pk} pen.)` : ''}`);
function Side({ code, name, flag, winner }: { code: string; name?: string; flag?: string | null; winner: boolean }) {
  return <span className={`flex items-center gap-2 truncate text-sm ${winner ? 'font-semibold text-[var(--color-fg)]' : 'text-[var(--color-fg-muted)]'}`}><span aria-hidden>{flag ?? ''}</span>{name ?? code}</span>;
}
function Card({ m, slug, locale }: { m: Match; slug: string; locale: Locale }) {
  return (
    <Link href={withLocale(locale, `/ediciones/${slug}/partido/${m.match_number}`)} className="grid w-[230px] shrink-0 gap-1.5 rounded-[14px] border border-[var(--color-border)] bg-[var(--color-bg-2)] p-3 transition-colors hover:border-[var(--color-border-strong)]">
      <Side code={m.home_code} name={m.home_team?.name_official} flag={m.home_team?.flag_emoji} winner={m.winner_code === m.home_code} />
      <Side code={m.away_code} name={m.away_team?.name_official} flag={m.away_team?.flag_emoji} winner={m.winner_code === m.away_code} />
      <span className="font-mono text-[11px] tab-num text-[var(--color-fg-subtle)]">{score(m)}</span>
    </Link>
  );
}

/** Cuadro de eliminatorias de una edición histórica, construido a partir de sus partidos. */
export function EditionBracket({ matches, slug, locale, accent }: { matches: Match[]; slug: string; locale: Locale; accent?: string }) {
  const cols = ROUNDS.map((r) => ({ ...r, ms: matches.filter((m) => m.stage === r.stage).sort((a, b) => a.match_date.localeCompare(b.match_date) || a.match_number - b.match_number) })).filter((c) => c.ms.length > 0);
  const third = matches.find((m) => m.stage === '3rd');
  if (cols.length < 2) return null;


  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 py-10 md:px-10">
      <div className="kicker" style={accent ? { color: accent } : undefined}>Eliminatorias</div>
      <h2 className="t-h2 mt-3 text-[var(--color-fg)]">Cuadro</h2>
      <div className="no-scrollbar mt-6 flex gap-6 overflow-x-auto pb-3">
        {cols.map((c) => (
          <div key={c.stage} className="grid shrink-0 content-start gap-3">
            <div className="sub-label">{c.label} · {c.ms.length}</div>
            <div className="grid gap-3" style={{ justifyItems: 'start' }}>{c.ms.map((m) => <Card key={m.match_number} m={m} slug={slug} locale={locale} />)}</div>
          </div>
        ))}
        {third && (
          <div className="grid shrink-0 content-start gap-3">
            <div className="sub-label">Tercer puesto</div>
            <Card m={third} slug={slug} locale={locale} />
          </div>
        )}
      </div>
    </section>
  );
}

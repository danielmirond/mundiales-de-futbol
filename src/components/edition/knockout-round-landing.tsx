import Link from 'next/link';
import { ArrowLeft, ArrowRight, ListTree, Target, CalendarDays } from 'lucide-react';
import { TEAMS_2026 } from '@/lib/wc-2026';
import {
  getKnockoutRounds, koWinner, wentToShootout, type KnockoutMatch,
} from '@/lib/wc-2026-knockout';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';

const tName = (c: string) => TEAMS_2026[c]?.name ?? c;
const tFlag = (c: string) => TEAMS_2026[c]?.flag ?? '🏳️';

function withLocale(locale: Locale, href: string) {
  return locale === routing.defaultLocale ? href : `/${locale}${href}`;
}
function fmtDay(iso: string) {
  try {
    return new Intl.DateTimeFormat('es', { timeZone: 'Europe/Madrid', weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(iso));
  } catch { return ''; }
}
function fmtHour(iso: string) {
  try {
    return new Intl.DateTimeFormat('es', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(iso));
  } catch { return ''; }
}

export type RoundMeta = {
  key: string;      // clave de KO_STAGES (R32, R16, QF, SF, FINAL)
  slug: string;     // ruta bajo /2026/
  label: string;    // "Cuartos de final"
  kicker: string;   // etiqueta corta
  h1: string;
  intro: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
};

export const ROUND_META: Record<string, RoundMeta> = {
  R32: {
    key: 'R32', slug: 'dieciseisavos-de-final', label: 'Dieciseisavos de final', kicker: 'Ronda de 32',
    h1: 'Dieciseisavos de final del Mundial 2026',
    intro: 'Los 16 cruces de dieciseisavos del Mundial 2026 —la primera eliminatoria del nuevo formato de 48 selecciones—, con equipos, horarios en hora española y resultados actualizados en directo.',
    metaTitle: 'Dieciseisavos de final del Mundial 2026: cruces, horarios y resultados',
    metaDescription: 'Todos los cruces de dieciseisavos de final del Mundial 2026: equipos, horarios en hora española, dónde ver y resultados en directo. Se actualiza solo.',
    keywords: ['dieciseisavos de final mundial 2026', 'dieciseisavos mundial 2026', 'ronda de 32 mundial 2026', 'cruces dieciseisavos mundial 2026'],
  },
  R16: {
    key: 'R16', slug: 'octavos-de-final', label: 'Octavos de final', kicker: 'Ronda de 16',
    h1: 'Octavos de final del Mundial 2026',
    intro: 'Los octavos de final del Mundial 2026: los 8 cruces con sus equipos, horarios en hora española y resultados en directo. Sigue quién avanza a cuartos.',
    metaTitle: 'Octavos de final del Mundial 2026: cruces, horarios y resultados',
    metaDescription: 'Todos los octavos de final del Mundial 2026: equipos, horarios en hora española, dónde ver y resultados en directo. Se actualiza solo tras cada partido.',
    keywords: ['octavos de final mundial 2026', 'octavos mundial 2026', 'cruces octavos mundial 2026', 'octavos de final copa mundial 2026'],
  },
  QF: {
    key: 'QF', slug: 'cuartos-de-final', label: 'Cuartos de final', kicker: 'Ronda de 8',
    h1: 'Cuartos de final del Mundial 2026',
    intro: 'Los cuartos de final del Mundial 2026: los 4 cruces con sus equipos, horarios en hora española y resultados en directo. A un paso de las semifinales.',
    metaTitle: 'Cuartos de final del Mundial 2026: cruces, horarios y resultados',
    metaDescription: 'Todos los cuartos de final del Mundial 2026: equipos, horarios en hora española, dónde ver y resultados en directo. Se actualiza solo tras cada partido.',
    keywords: ['cuartos de final mundial 2026', 'cuartos mundial 2026', 'cruces cuartos mundial 2026', 'cuartos de final copa mundial 2026'],
  },
  SF: {
    key: 'SF', slug: 'semifinales', label: 'Semifinales', kicker: 'Ronda de 4',
    h1: 'Semifinales del Mundial 2026',
    intro: 'Las semifinales del Mundial 2026: los dos cruces que definen a los finalistas, con equipos, horarios en hora española y resultados en directo.',
    metaTitle: 'Semifinales del Mundial 2026: cruces, horarios y resultados',
    metaDescription: 'Las semifinales del Mundial 2026: equipos, horarios en hora española, dónde ver y resultados en directo. Quién llega a la final. Se actualiza solo.',
    keywords: ['semifinales mundial 2026', 'semifinal mundial 2026', 'cruces semifinales mundial 2026', 'semifinales copa mundial 2026'],
  },
};

function MatchCard({ m, locale }: { m: KnockoutMatch; locale: Locale }) {
  const resolved = !!m.home && !!m.away;
  const played = m.state === 'post' && m.homeScore != null && m.awayScore != null;
  const live = m.state === 'in';
  const winner = played ? koWinner(m) : null;
  const pens = wentToShootout(m);
  return (
    <Link
      href={withLocale(locale, `/2026/partido/${m.slug}`)}
      className="flex flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-4 transition-colors hover:border-[var(--color-pitch)]"
    >
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-subtle)]">
        <span>{fmtDay(m.date)}</span>
        {live ? (
          <span className="text-[var(--color-flame)]">🔴 {m.clock || 'EN VIVO'}</span>
        ) : played ? (
          <span>{pens ? 'Final · pen.' : 'Final'}</span>
        ) : (
          <span className="tab-num">{fmtHour(m.date)} h</span>
        )}
      </div>
      {resolved ? (
        <div className="flex items-center justify-between gap-2">
          <span className={`flex items-center gap-2 truncate text-sm ${winner === 'home' ? 'font-semibold text-[var(--color-fg)]' : 'text-[var(--color-fg-muted)]'}`}>
            <span>{tFlag(m.home!)}</span>{tName(m.home!)}
          </span>
          <span className="flex shrink-0 flex-col items-center">
            <span className="font-display tab-num text-xl text-[var(--color-fg)]">
              {played || live ? `${m.homeScore ?? 0}-${m.awayScore ?? 0}` : 'vs'}
            </span>
            {pens && (
              <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
                {m.shootoutHome}-{m.shootoutAway} pen.
              </span>
            )}
          </span>
          <span className={`flex items-center justify-end gap-2 truncate text-sm ${winner === 'away' ? 'font-semibold text-[var(--color-fg)]' : 'text-[var(--color-fg-muted)]'}`}>
            {tName(m.away!)}<span>{tFlag(m.away!)}</span>
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-center py-1 text-center text-sm text-[var(--color-fg-subtle)]">
          {m.label || 'Por definir'}
        </div>
      )}
    </Link>
  );
}

/** Metadata de una página de ronda (para generateMetadata). */
export function roundMetadata(roundKey: string, locale: string) {
  const meta = ROUND_META[roundKey];
  return pageMetadata({
    locale,
    path: `/2026/${meta.slug}`,
    title: meta.metaTitle,
    description: meta.metaDescription,
    keywords: meta.keywords,
    type: 'website',
  });
}

/** Página completa de una ronda de eliminatorias, con cruces reales en vivo. */
export async function KnockoutRoundPage({ locale, roundKey }: { locale: Locale; roundKey: string }) {
  const meta = ROUND_META[roundKey];
  const rounds = await getKnockoutRounds();
  const round = rounds.find((r) => r.key === roundKey);
  const matches = round?.matches ?? [];
  const pageUrl = localeUrl(locale, `/2026/${meta.slug}`);

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 pt-28">
      <JsonLd
        data={breadcrumbLd(locale, [
          { name: 'Inicio', path: '/' },
          { name: 'Mundial 2026', path: '/2026' },
          { name: 'Cuadro', path: '/2026/cuadro' },
          { name: meta.label, path: `/2026/${meta.slug}` },
        ])}
      />
      {matches.some((m) => m.home && m.away) && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: `${meta.label} · Mundial 2026`,
            inLanguage: locale,
            url: pageUrl,
            itemListElement: matches
              .filter((m) => m.home && m.away)
              .map((m, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: `${tName(m.home!)} - ${tName(m.away!)}`,
              })),
          }}
        />
      )}

      <nav className="mb-6 text-sm text-[var(--color-fg-muted)]">
        <Link href={withLocale(locale, '/2026/cuadro')} className="inline-flex items-center gap-1 hover:text-[var(--color-fg)]">
          <ArrowLeft className="h-4 w-4" /> Cuadro y cruces
        </Link>
      </nav>

      <header className="mb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
          <ListTree className="mr-1 inline h-3 w-3" /> {meta.kicker} · Mundial 2026
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{meta.h1}</h1>
        <p className="mt-4 max-w-3xl text-lg text-[var(--color-fg-muted)]">{meta.intro}</p>
      </header>

      {matches.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-8 text-sm text-[var(--color-fg-muted)]">
          Los cruces de {meta.label.toLowerCase()} aparecerán aquí en cuanto se conozcan los equipos clasificados.
        </div>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {matches.map((m) => (
            <MatchCard key={m.n} m={m} locale={locale} />
          ))}
        </div>
      )}

      <p className="mt-6 text-xs text-[var(--color-fg-subtle)]">
        Horarios en hora peninsular española. Resultados y equipos se actualizan en directo tras cada partido.
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href={withLocale(locale, '/2026/cuadro')} className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-sm font-semibold transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
          <ListTree className="h-4 w-4" /> Cuadro completo
        </Link>
        <Link href={withLocale(locale, '/2026/goleadores')} className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-sm font-semibold transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
          <Target className="h-4 w-4" /> Goleadores
        </Link>
        <Link href={withLocale(locale, '/2026/calendario')} className="inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-4 py-2 text-sm font-bold text-black transition-opacity hover:opacity-90">
          <CalendarDays className="h-4 w-4" /> Calendario completo <ArrowRight className="h-3 w-3 rtl:rotate-180" />
        </Link>
      </div>
    </main>
  );
}

/**
 * Crónica/resultado post-partido — RÁPIDO y DETERMINISTA (datos de ESPN).
 *
 * Estrategia "beat AI Overviews": en cuanto un partido termina, publica una
 * pieza con el resultado, los goles, las tarjetas y las estadísticas clave,
 * antes de que Google genere su resumen IA (que tarda horas). Sin redacción
 * inventada: todo sale de la API pública de ESPN (summary) + el fixture.
 *
 * Inserta el artículo al principio de NEWS_ITEMS en `src/lib/news.ts`.
 * Idempotente: si el slug del partido ya existe, no hace nada.
 *
 * Uso:
 *   tsx scripts/match-recap/build.ts            # partidos terminados HOY
 *   tsx scripts/match-recap/build.ts --dry      # solo imprime
 *   DAILY_DATE=2026-06-15 tsx scripts/match-recap/build.ts --dry
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  FIXTURES_2026,
  TEAMS_2026,
  VENUES_2026,
  STAGE_LABEL,
  matchSlug,
} from '../../src/lib/wc-2026';
import { fixtureToUTC } from '../../src/lib/wc-2026-fixture-utc';
import { fetchScores, buildScoreMap, scoreKey } from '../../src/lib/live-scores';
import { fetchMatchSummary } from '../../src/lib/wc-2026-match-summary';
import { pairSlug } from '../../src/lib/wc-head-to-head';

const DRY = process.argv.includes('--dry') || !!process.env.DAILY_DRY;
const NEWS_PATH = join(process.cwd(), 'src/lib/news.ts');
const MADRID = 'Europe/Madrid';

const dateKeyFmt = new Intl.DateTimeFormat('en-CA', {
  timeZone: MADRID, year: 'numeric', month: '2-digit', day: '2-digit',
});
const longDayFmt = new Intl.DateTimeFormat('es-ES', {
  timeZone: MADRID, weekday: 'long', day: 'numeric', month: 'long',
});

const teamName = (code?: string, fallback?: string) =>
  (code && TEAMS_2026[code]?.name) || fallback || code || 'Por definir';
const venueLabel = (slug: string) => {
  const v = VENUES_2026.find((x) => x.slug === slug);
  return v ? `${v.name} (${v.hostCity})` : '';
};
const stageLabel = (stage: string) =>
  stage.length === 1 ? `Grupo ${stage}` : (STAGE_LABEL[stage] ?? stage);

const DAZN = 'https://www.awin1.com/cread.php?awinmid=126263&awinaffid=2898755&campaign=SMSWC2026';
const MOVISTAR =
  'https://www.awin1.com/cread.php?awinmid=114230&awinaffid=2898755&ued=https%3A%2F%2Fwww.movistarplus.es%2Fdeportes%2Ffutbol%2Fmundial';

type Recap = {
  slug: string;
  title: string;
  summary: string;
  body: string;
  category: 'general';
  sourceName: string;
  sourceUrl: string;
  sourceLang: 'es';
  publishedAt: string;
};

async function buildRecap(
  f: (typeof FIXTURES_2026)[number],
  hs: number,
  as: number,
  eventId: string,
): Promise<Recap> {
  const hn = teamName(f.home, f.label);
  const an = teamName(f.away);
  const venue = venueLabel(f.venue);
  const fase = stageLabel(f.stage);
  const ms = new Date(fixtureToUTC(f)).getTime();
  const dayLong = longDayFmt.format(ms).replace(',', '');
  const matchPath = `/2026/partido/${matchSlug(f)}`;

  const summary = f.home && f.away ? await fetchMatchSummary(eventId, f.home, f.away) : null;

  // Titular del marcador y arranque según el desenlace.
  const diff = Math.abs(hs - as);
  let lead: string;
  if (hs === as) {
    lead = `**${hn}** y **${an}** firmaron un **empate ${hs}-${as}** en su partido del **${fase}** del Mundial 2026, disputado el ${dayLong}${venue ? ` en el ${venue}` : ''}.`;
  } else {
    const winner = hs > as ? hn : an;
    const loser = hs > as ? an : hn;
    const verb = diff >= 3 ? 'goleó a' : 'se impuso a';
    lead = `**${winner}** ${verb} **${loser}** por **${hs}-${as}** en el **${fase}** del Mundial 2026, en un partido disputado el ${dayLong}${venue ? ` en el ${venue}` : ''}.`;
  }

  // Goles a partir de los momentos clave.
  let golesBlock = '';
  if (summary?.events?.length) {
    const goles = summary.events.filter((e) => e.kind === 'goal');
    if (goles.length) {
      const list = goles
        .map((g) => {
          const who = g.players[0] ?? '';
          const team = g.side === 'home' ? hn : g.side === 'away' ? an : '';
          const nota = /propia|penalti/i.test(g.type) ? ` · ${g.type}` : '';
          return `- **${g.minute || ''}** ${who}${team ? ` (${team})` : ''}${nota}`;
        })
        .join('\n');
      golesBlock = `\n\n## Goles\n\n${list}`;
    }
  }

  // Estadísticas destacadas.
  let statsBlock = '';
  if (summary?.stats?.length) {
    const pick = ['possessionPct', 'totalShots', 'shotsOnTarget', 'wonCorners'];
    const rows = summary.stats
      .filter((s) => pick.includes(s.key))
      .map((s) => `- ${s.label}: **${s.home}** ${hn} · **${s.away}** ${an}`)
      .join('\n');
    if (rows) statsBlock = `\n\n## Estadísticas del partido\n\n${rows}`;
  }

  const body = `${lead}${golesBlock}${statsBlock}

Tienes la **ficha completa** del partido —con alineaciones, todos los momentos clave y estadísticas ampliadas— en [${hn} - ${an}](${matchPath}). Consulta también el [historial entre ambas selecciones](/historial/${pairSlug(f.home!, f.away!)}) y la clasificación actualizada en [grupos](/2026/grupos).

El Mundial 2026 se puede ver en España en **[DAZN](${DAZN})**, también a través de **[Movistar Plus+ vía DAZN](${MOVISTAR})**, con partidos seleccionados en abierto en La 1 (RTVE).`;

  const title = `${hn} ${hs}-${as} ${an}: resultado, goles y estadísticas | Mundial 2026`;
  const summaryText = `${hs === as ? `Empate ${hs}-${as}` : `Victoria ${hs > as ? `de ${hn}` : `de ${an}`} por ${hs}-${as}`} entre ${hn} y ${an} en el ${fase} del Mundial 2026. Resultado, goles y estadísticas del partido.`;

  // publishedAt determinista: ~2 h tras el inicio (final aproximado).
  const publishedAt = new Date(ms + 2 * 3600_000).toISOString().replace('.000', '');

  return {
    slug: `${matchSlug(f)}-resultado-mundial-2026`,
    title,
    summary: summaryText,
    body,
    category: 'general',
    sourceName: 'Mundiales de Fútbol · datos ESPN',
    sourceUrl: 'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026',
    sourceLang: 'es',
    publishedAt,
  };
}

function serialize(a: Recap): string {
  const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
  return `  {
    slug: '${a.slug}',
    title: ${JSON.stringify(a.title)},
    summary: ${JSON.stringify(a.summary)},
    body: \`${esc(a.body)}\`,
    category: '${a.category}',
    sourceName: ${JSON.stringify(a.sourceName)},
    sourceUrl: '${a.sourceUrl}',
    sourceLang: '${a.sourceLang}',
    publishedAt: '${a.publishedAt}',
  },\n`;
}

async function main() {
  const todayKey = process.env.DAILY_DATE ?? dateKeyFmt.format(Date.now());
  const scoreMap = buildScoreMap(await fetchScores());

  // Partidos cuyo día (Madrid) es hoy y que ya han terminado.
  const finished = FIXTURES_2026.filter((f) => {
    if (!f.home || !f.away) return false;
    const dayKey = dateKeyFmt.format(new Date(fixtureToUTC(f)).getTime());
    if (dayKey !== todayKey) return false;
    const sc = scoreMap.get(scoreKey(f.home, f.away));
    return sc && sc.state === 'post' && sc.homeScore !== null && sc.awayScore !== null;
  });

  if (finished.length === 0) {
    console.log(`[match-recap] No hay partidos terminados el ${todayKey}.`);
    return;
  }

  let src = readFileSync(NEWS_PATH, 'utf8');
  const marker = 'export const NEWS_ITEMS: NewsItem[] = [\n';
  let inserted = 0;

  for (const f of finished) {
    const sc = scoreMap.get(scoreKey(f.home!, f.away!))!;
    const recap = await buildRecap(f, sc.homeScore!, sc.awayScore!, sc.id);

    if (src.includes(`slug: '${recap.slug}'`)) {
      console.log(`[match-recap] Ya existe: ${recap.slug}`);
      continue;
    }
    console.log(`[match-recap] ${recap.title}`);
    if (DRY) {
      console.log('\n----- DRY -----\n');
      console.log(`# ${recap.title}\n> ${recap.summary}\n\n${recap.body}\n`);
      continue;
    }
    const idx = src.indexOf(marker);
    if (idx === -1) throw new Error('No se encontró el marcador NEWS_ITEMS en news.ts');
    const at = idx + marker.length;
    src = src.slice(0, at) + serialize(recap) + src.slice(at);
    inserted++;
  }

  if (!DRY && inserted > 0) {
    writeFileSync(NEWS_PATH, src, 'utf8');
    console.log(`[match-recap] ${inserted} crónica(s) insertada(s) en news.ts ✓`);
  }
}

main();

/**
 * Pieza diaria de partidos — DETERMINISTA (sin IA, coste cero).
 *
 * Cada mañana genera un avance (~400 palabras) de los partidos del Mundial 2026
 * que se juegan HOY (zona Europe/Madrid), a partir de FIXTURES_2026:
 *   - Titular + sumario con la fecha del día.
 *   - Listado de partidos con hora española, grupo/fase y estadio.
 *   - Bloque "dónde ver" (DAZN / Movistar Plus+) y enlaces internos.
 *
 * Inserta el artículo al principio de NEWS_ITEMS en `src/lib/news.ts`.
 * Idempotente: si el slug del día ya existe, no hace nada.
 *
 * Uso:
 *   tsx scripts/daily-matches/build.ts          # genera y patchea
 *   tsx scripts/daily-matches/build.ts --dry     # solo imprime, no escribe
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { FIXTURES_2026, TEAMS_2026, VENUES_2026, STAGE_LABEL, matchSlug } from '../../src/lib/wc-2026';
import { fixtureToUTC } from '../../src/lib/wc-2026-fixture-utc';
import { resolveKnockout } from '../../src/lib/wc-2026-knockout';

const DRY = process.argv.includes('--dry') || !!process.env.DAILY_DRY;
// --refresh: si el artículo del día ya existe, lo REGENERA (en vez de saltarlo).
// Útil para actualizar los avances de eliminatorias con los equipos ya conocidos.
const REFRESH = process.argv.includes('--refresh') || !!process.env.DAILY_REFRESH;
const NEWS_PATH = join(process.cwd(), 'src/lib/news.ts');
const MADRID = 'Europe/Madrid';

const dateKeyFmt = new Intl.DateTimeFormat('en-CA', {
  timeZone: MADRID, year: 'numeric', month: '2-digit', day: '2-digit',
});
const timeFmt = new Intl.DateTimeFormat('es-ES', {
  timeZone: MADRID, hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
});
const longDayFmt = new Intl.DateTimeFormat('es-ES', {
  timeZone: MADRID, weekday: 'long', day: 'numeric', month: 'long',
});

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const teamName = (code?: string, fallback?: string) =>
  (code && TEAMS_2026[code]?.name) || fallback || code || 'Por definir';
const venueLabel = (slug: string) => {
  const v = VENUES_2026.find((x) => x.slug === slug);
  return v ? `${v.name} (${v.hostCity})` : '';
};
const stageLabel = (stage: string) =>
  stage.length === 1 ? `Grupo ${stage}` : (STAGE_LABEL[stage] ?? stage);
// Slug canónico de la ficha: equipos en grupos, `partido-N` en eliminatorias
// (aunque hayamos resuelto los equipos, la URL de KO sigue siendo partido-N).
const linkSlug = (f: (typeof FIXTURES_2026)[number]) =>
  f.stage.length === 1 ? matchSlug(f) : `partido-${f.n}`;

// Selecciones "ancla" para destacar el partido del día.
const MARQUEE = ['ESP', 'BRA', 'ARG', 'FRA', 'ENG', 'GER', 'POR', 'NED', 'MEX', 'ITA', 'BEL', 'URU'];

// Partidos que RTVE emite GRATIS y en abierto (La 1 + RTVE Play) en la fase de grupos.
// Lista oficial RTVE (17 de fase de grupos): un partido destacado por jornada + los 3 de España.
// Mapeados al número de partido (n) de FIXTURES_2026.
//  1 MEX-RSA · 3 CAN-BIH · 6 BRA-MAR · 9 GER-CUW · 13 ESP-CPV · 17 FRA-SEN · 22 ENG-CRO
//  26 SUI-BIH · 29 USA-AUS · 33 NED-SWE · 37 ESP-KSA · 41 ARG-AUT · 46 ENG-GHA · 52 SCO-BRA
//  56 ECU-GER · 64 URU-ESP · 69 COL-POR
const RTVE_FREE_N = new Set([1, 3, 6, 9, 13, 17, 22, 26, 29, 33, 37, 41, 46, 52, 56, 64, 69]);
// RTVE emite en abierto: 17 partidos elegidos de la fase de grupos + TODA la
// eliminatoria desde dieciseisavos (incluida la final).
const isRtveFree = (f: (typeof FIXTURES_2026)[number]) =>
  f.stage.length === 1 ? RTVE_FREE_N.has(f.n) : true;

// Enlaces de afiliación (Awin) — mismos que en la guía /2026/donde-ver.
const DAZN_URL = 'https://www.awin1.com/cread.php?awinmid=126263&awinaffid=2898755&campaign=SMSWC2026';
const MOVISTAR_URL =
  'https://www.awin1.com/cread.php?awinmid=114230&awinaffid=2898755&ued=https%3A%2F%2Fwww.movistarplus.es%2Fdeportes%2Ffutbol%2Fmundial';
const DAZN_LINK = `[DAZN](${DAZN_URL})`;
const MOVISTAR_LINK = `[Movistar Plus+ vía DAZN](${MOVISTAR_URL})`;

type Row = { f: (typeof FIXTURES_2026)[number]; ms: number };

/**
 * En eliminatorias el fixture solo trae el texto del cuadro; resolvemos los
 * equipos reales (ESPN) para que el avance del día muestre los enfrentamientos
 * de verdad y no "Por definir".
 */
async function todaysRows(todayKey: string): Promise<Row[]> {
  const ko = await resolveKnockout();
  const withTeams = (f: (typeof FIXTURES_2026)[number]) => {
    if (f.stage.length === 1 || (f.home && f.away)) return f;
    const r = ko.get(f.n);
    return r?.home && r?.away ? { ...f, home: r.home, away: r.away } : f;
  };
  return FIXTURES_2026
    .map((f) => ({ f: withTeams(f), ms: new Date(fixtureToUTC(f)).getTime() }))
    .filter((r) => dateKeyFmt.format(r.ms) === todayKey)
    .sort((a, b) => a.ms - b.ms);
}

function buildArticle(todayKey: string, rows: Row[]) {
  const dayLong = longDayFmt.format(rows[0].ms).replace(',', ''); // "domingo 14 de junio"
  const dayTitle = cap(dayLong);
  const n = rows.length;
  const onlyOne = n === 1;

  // Partido destacado: el que RTVE elige en abierto (es "el partido del día"); si hoy no hay
  // abierto, el primero con una selección ancla; en último caso, el de cierre (suele ser prime time).
  const marquee =
    rows.find((r) => isRtveFree(r.f)) ??
    rows.find((r) => MARQUEE.includes(r.f.home ?? '') || MARQUEE.includes(r.f.away ?? '')) ??
    rows[n - 1];
  const mHome = teamName(marquee.f.home, marquee.f.label);
  const mAway = teamName(marquee.f.away);

  const espana = rows.find((r) => r.f.home === 'ESP' || r.f.away === 'ESP');

  // Cabecera variable según haya 1 o varios partidos y si juega España.
  let intro: string;
  if (espana) {
    const rival = espana.f.home === 'ESP' ? teamName(espana.f.away) : teamName(espana.f.home, espana.f.label);
    intro = `Día grande para el aficionado español: **España se mide a ${rival}** dentro de la jornada de hoy, ${dayLong}, en el Mundial 2026. ${onlyOne ? 'Este es el único partido del día' : `En total se disputan **${n} partidos**`}, con sus horarios en hora española y dónde verlos.`;
  } else if (onlyOne) {
    intro = `Hoy, ${dayLong}, el Mundial 2026 deja un único partido en el calendario: **${mHome} - ${mAway}**. Aquí tienes el horario en hora española, la sede y dónde verlo en TV.`;
  } else {
    intro = `El Mundial 2026 vive hoy, ${dayLong}, una jornada de **${n} partidos**. Te dejamos todos los horarios en hora española, las sedes y dónde seguirlos, con el foco puesto en el **${mHome} - ${mAway}**.`;
  }

  const list = rows
    .map((r) => {
      const home = teamName(r.f.home, r.f.label);
      const away = teamName(r.f.away);
      const venue = venueLabel(r.f.venue);
      const link = `/2026/partido/${linkSlug(r.f)}`;
      const tv = isRtveFree(r.f) ? `🆓 La 1 (RTVE) y ${DAZN_LINK}` : `${DAZN_LINK} / ${MOVISTAR_LINK}`;
      return `- **[${home} - ${away}](${link})** — ${timeFmt.format(r.ms)} h · ${stageLabel(r.f.stage)}${venue ? ` · ${venue}` : ''} · 📺 ${tv}.`;
    })
    .join('\n');

  // Desglose abierto (La 1) vs pago (DAZN) para la jornada de hoy.
  const freeRows = rows.filter((r) => isRtveFree(r.f));
  const paidRows = rows.filter((r) => !isRtveFree(r.f));
  const matchLine = (r: Row) =>
    `- **${teamName(r.f.home, r.f.label)} - ${teamName(r.f.away)}** — ${timeFmt.format(r.ms)} h.`;

  const freeBlock = freeRows.length
    ? `RTVE emite hoy en **abierto y gratis** en **La 1** (también en RTVE Play, gratis online):

${freeRows.map(matchLine).join('\n')}`
    : `Hoy **RTVE no emite ningún partido en abierto**: todos los encuentros de la jornada son exclusiva de pago en DAZN.`;

  const paidBlock = paidRows.length
    ? `El resto de partidos de hoy solo se pueden ver en **${DAZN_LINK}**, disponible también a través de **${MOVISTAR_LINK}**:

${paidRows.map(matchLine).join('\n')}`
    : `Hoy **todos los partidos de la jornada se ven gratis en La 1**.`;

  const marqueeBlock = onlyOne
    ? `El ${mHome} - ${mAway} concentra hoy toda la atención: un buen aperitivo para ir calentando la jornada mundialista.`
    : `De todo el cartel, el **${mHome} - ${mAway}** es el duelo más llamativo de la jornada y el que más expectación levanta entre los aficionados.`;

  const body = `${intro}

## Partidos de hoy en el Mundial 2026 (hora de España)

${list}

Todos los horarios están convertidos a **hora peninsular española**. Puedes ver la jornada al completo, con resultados en directo, en la página de [partidos de hoy](/2026/partidos-hoy) y en el [calendario del Mundial](/2026/calendario).

## El partido destacado del día

${marqueeBlock} Sigue la clasificación y los grupos actualizados en [grupos y clasificación](/2026/grupos).

## Qué partidos se ven hoy gratis en La 1 (RTVE)

${freeBlock}

## Qué partidos son solo de pago (DAZN / Movistar Plus+)

${paidBlock}

RTVE emite **34 partidos gratis** en total del Mundial 2026: los 3 de España en la fase de grupos, un partido destacado por jornada y toda la fase eliminatoria desde dieciseisavos (incluida la final). Los **104 partidos** están en **${DAZN_LINK}**, también a través de **${MOVISTAR_LINK}**. Desglose completo de plataformas, precios y partidos en abierto en [dónde ver el Mundial 2026](/2026/donde-ver).`;

  const freeTitle = freeRows.length
    ? `${teamName(freeRows[0].f.home, freeRows[0].f.label)} - ${teamName(freeRows[0].f.away)}`
    : '';
  const title = espana
    ? `Partidos del Mundial 2026 hoy, ${dayTitle}: España juega, horarios y dónde ver gratis (La 1) o en DAZN`
    : `Partidos del Mundial 2026 hoy, ${dayTitle}: horarios (hora España) y dónde ver, gratis en La 1 o en DAZN`;

  const tvSummary = freeRows.length
    ? `Hoy en abierto y gratis en La 1: ${freeTitle}. El resto, en DAZN / Movistar Plus+.`
    : `Hoy ningún partido en abierto en La 1: todos en DAZN / Movistar Plus+.`;
  const summary = onlyOne
    ? `Hoy ${dayLong} se juega ${mHome} - ${mAway} en el Mundial 2026. Horario en hora española, sede y dónde verlo en TV. ${tvSummary}`
    : `Calendario de los ${n} partidos del Mundial 2026 de hoy, ${dayLong}: horarios en hora española y dónde verlos. ${tvSummary}`;

  // publishedAt: 06:30 UTC del día (mañana en España). Determinista a partir del todayKey.
  const publishedAt = `${todayKey}T06:30:00Z`;

  return {
    slug: `partidos-mundial-2026-hoy-${todayKey}`,
    title,
    summary,
    body,
    category: 'tv' as const,
    sourceName: 'Mundiales de Fútbol',
    sourceUrl: 'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026',
    sourceLang: 'es' as const,
    publishedAt,
  };
}

/** Serializa el objeto NewsItem como literal TS para insertar en el array. */
function serialize(a: ReturnType<typeof buildArticle>): string {
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

/** Regex del bloque NewsItem de un slug (formato serializado). */
const blockRe = (slug: string) =>
  new RegExp(`  \\{\\n    slug: '${slug}',[\\s\\S]*?\\n  \\},\\n`);

async function main() {
  // "Hoy" en zona Madrid. (En el cron matinal coincide con el día natural español.)
  // Override opcional para previsualizar/rellenar otro día: DAILY_DATE=YYYY-MM-DD.
  const now = process.env.DAILY_DATE ? new Date(`${process.env.DAILY_DATE}T12:00:00Z`) : new Date();
  const todayKey = dateKeyFmt.format(now);

  const rows = await todaysRows(todayKey);
  if (rows.length === 0) {
    console.log(`[daily-matches] No hay partidos el ${todayKey}. Sin artículo.`);
    return;
  }

  const article = buildArticle(todayKey, rows);
  console.log(`[daily-matches] ${rows.length} partido(s) el ${todayKey}.`);
  console.log(`[daily-matches] slug: ${article.slug}`);

  if (DRY) {
    console.log('\n----- DRY RUN — artículo generado -----\n');
    console.log(`# ${article.title}\n`);
    console.log(`> ${article.summary}\n`);
    console.log(article.body);
    return;
  }

  const src = readFileSync(NEWS_PATH, 'utf8');
  const exists = src.includes(`slug: '${article.slug}'`);

  if (exists) {
    if (!REFRESH) {
      console.log('[daily-matches] El artículo del día ya existe. Nada que hacer (usa --refresh para regenerar).');
      return;
    }
    // Reemplazo IN SITU (conserva la posición cronológica en el array).
    const out = src.replace(blockRe(article.slug), serialize(article));
    if (out === src) throw new Error(`No se pudo localizar el bloque del slug ${article.slug}`);
    writeFileSync(NEWS_PATH, out, 'utf8');
    console.log('[daily-matches] Artículo regenerado in situ en src/lib/news.ts ✓');
    return;
  }

  const marker = 'export const NEWS_ITEMS: NewsItem[] = [\n';
  const idx = src.indexOf(marker);
  if (idx === -1) throw new Error('No se encontró el marcador NEWS_ITEMS en news.ts');
  const insertAt = idx + marker.length;
  const out = src.slice(0, insertAt) + serialize(article) + src.slice(insertAt);
  writeFileSync(NEWS_PATH, out, 'utf8');
  console.log('[daily-matches] Artículo insertado en src/lib/news.ts ✓');
}

main();

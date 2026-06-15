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

const DRY = process.argv.includes('--dry') || !!process.env.DAILY_DRY;
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

// Selecciones "ancla" para destacar el partido del día.
const MARQUEE = ['ESP', 'BRA', 'ARG', 'FRA', 'ENG', 'GER', 'POR', 'NED', 'MEX', 'ITA', 'BEL', 'URU'];

type Row = { f: (typeof FIXTURES_2026)[number]; ms: number };

function todaysRows(todayKey: string): Row[] {
  return FIXTURES_2026
    .map((f) => ({ f, ms: new Date(fixtureToUTC(f)).getTime() }))
    .filter((r) => dateKeyFmt.format(r.ms) === todayKey)
    .sort((a, b) => a.ms - b.ms);
}

function buildArticle(todayKey: string, rows: Row[]) {
  const dayLong = longDayFmt.format(rows[0].ms).replace(',', ''); // "domingo 14 de junio"
  const dayTitle = cap(dayLong);
  const n = rows.length;
  const onlyOne = n === 1;

  // Partido destacado: el primero que involucre una selección ancla; si no, el último (suele ser el de prime time).
  const marquee = rows.find((r) => MARQUEE.includes(r.f.home ?? '') || MARQUEE.includes(r.f.away ?? '')) ?? rows[n - 1];
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
      const link = `/2026/partido/${matchSlug(r.f)}`;
      return `- **[${home} - ${away}](${link})** — ${timeFmt.format(r.ms)} h · ${stageLabel(r.f.stage)}${venue ? ` · ${venue}` : ''}.`;
    })
    .join('\n');

  const marqueeBlock = onlyOne
    ? `El ${mHome} - ${mAway} concentra hoy toda la atención: un buen aperitivo para ir calentando la jornada mundialista.`
    : `De todo el cartel, el **${mHome} - ${mAway}** es el duelo más llamativo de la jornada y el que más expectación levanta entre los aficionados.`;

  const body = `${intro}

## Partidos de hoy en el Mundial 2026 (hora de España)

${list}

Todos los horarios están convertidos a **hora peninsular española**. Puedes ver la jornada al completo, con resultados en directo, en la página de [partidos de hoy](/2026/partidos-hoy) y en el [calendario del Mundial](/2026/calendario).

## El partido destacado del día

${marqueeBlock} Sigue la clasificación y los grupos actualizados en [grupos y clasificación](/2026/grupos).

## Dónde ver los partidos de hoy

En España, el Mundial 2026 se ve en **DAZN**, con todos los partidos disponibles de la forma más cómoda a través de **Movistar Plus+ vía DAZN** (los 104 encuentros en un mismo sitio). Algunos partidos seleccionados se emiten además en abierto en **RTVE**. Tienes el desglose completo de plataformas y precios en [dónde ver el Mundial 2026](/2026/donde-ver).`;

  const title = espana
    ? `Partidos del Mundial 2026 hoy, ${dayTitle}: España juega, horarios (hora España) y dónde ver`
    : `Partidos del Mundial 2026 hoy, ${dayTitle}: horarios (hora España), sedes y dónde ver`;

  const summary = onlyOne
    ? `Hoy ${dayLong} se juega ${mHome} - ${mAway} en el Mundial 2026. Horario en hora española, sede y dónde verlo en TV (DAZN / Movistar Plus+).`
    : `Calendario de los ${n} partidos del Mundial 2026 de hoy, ${dayLong}: horarios en hora española, sedes y dónde verlos en TV. Destaca el ${mHome} - ${mAway}.`;

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

function main() {
  // "Hoy" en zona Madrid. (En el cron matinal coincide con el día natural español.)
  const now = new Date();
  const todayKey = dateKeyFmt.format(now);

  const rows = todaysRows(todayKey);
  if (rows.length === 0) {
    console.log(`[daily-matches] No hay partidos el ${todayKey}. Sin artículo.`);
    return;
  }

  const article = buildArticle(todayKey, rows);
  console.log(`[daily-matches] ${rows.length} partido(s) el ${todayKey}.`);
  console.log(`[daily-matches] slug: ${article.slug}`);

  const src = readFileSync(NEWS_PATH, 'utf8');
  if (src.includes(`slug: '${article.slug}'`)) {
    console.log('[daily-matches] El artículo del día ya existe. Nada que hacer.');
    return;
  }

  if (DRY) {
    console.log('\n----- DRY RUN — artículo generado -----\n');
    console.log(`# ${article.title}\n`);
    console.log(`> ${article.summary}\n`);
    console.log(article.body);
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

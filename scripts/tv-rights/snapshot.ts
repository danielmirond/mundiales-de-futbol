/* eslint-disable @typescript-eslint/no-explicit-any -- JSON externo sin tipar */
/**
 * Registro acumulado de quién emite cada partido de LaLiga y Champions en España,
 * para la calculadora «¿cuánto cuesta ver a tu equipo?».
 *
 * WOSTI (vía el feed de Guía TV) solo trae dos semanas vista; este script guarda
 * cada asignación en src/data/tv-asignaciones.json y no la olvida, así que el
 * registro crece cada día. `--seed <archivo.json>` añade una copia antigua de WOSTI.
 *
 * Clasificación por los nombres de canal de WOSTI:
 *   DAZN LaLiga → dazn · «DAZN App Gratis» → gratis en el registro de DAZN
 *   M+ LALIGA / Liga de Campeones → movistar · «Movistar Plus+ (M7)» → entra en el plan Libre
 *
 * Uso: npx tsx scripts/tv-rights/snapshot.ts [--seed copia.json …]
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const FEED = process.env.GUIA_TV_FEED || 'https://www.mundodeportivo.com/guia-tv/api/wosti?formato=crudo';
const OUT = 'src/data/tv-asignaciones.json';
const COMPS: Record<string, string> = { 'La Liga EA Sports': 'laliga', 'Champions League': 'champions-league' };

type Asignacion = { date: string; comp: string; home: string; away: string; op: 'dazn' | 'movistar' | 'otro'; free?: boolean; libre?: boolean; channels: string[] };

function classify(e: any): Asignacion | null {
  const comp = COMPS[e?.Competition?.Name];
  if (!comp) return null;
  const channels: string[] = (e.Channels ?? []).map((c: any) => String(c.Name ?? '')).filter(Boolean);
  const has = (re: RegExp) => channels.some((c) => re.test(c));
  const op = has(/^DAZN LaLiga/i) ? 'dazn' : has(/^M\+ LALIGA|Liga de Campeones|^M\+ /i) ? 'movistar' : 'otro';
  return {
    date: e.Date, comp, home: e.LocalTeam?.Name ?? '', away: e.AwayTeam?.Name ?? '', op,
    ...(has(/DAZN App Gratis/i) ? { free: true } : {}),
    ...(has(/Movistar Plus\+ \(M7\)/i) ? { libre: true } : {}),
    channels,
  };
}

async function main() {
  const db: Record<string, Asignacion> = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')).matches : {};
  const before = Object.keys(db).length;
  const sources: any[][] = [];
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) if (args[i] === '--seed') sources.push(JSON.parse(readFileSync(args[++i], 'utf8')));
  try {
    const res = await fetch(FEED, { headers: { 'User-Agent': 'mundiales-de-futbol' }, signal: AbortSignal.timeout(30000) });
    if (res.ok) sources.push(await res.json());
    else console.log(`feed: HTTP ${res.status}`);
  } catch (err) {
    console.log(`feed: ${String(err)}`);
  }
  for (const list of sources) {
    for (const e of Array.isArray(list) ? list : []) {
      const a = classify(e);
      // Lo más reciente manda (un cambio de canal de última hora sustituye al anterior).
      if (a && e.Id != null && a.op !== 'otro') db[String(e.Id)] = a;
    }
  }
  const sorted = Object.fromEntries(Object.entries(db).sort((x, y) => x[1].date.localeCompare(y[1].date)));
  writeFileSync(OUT, JSON.stringify({ updatedAt: new Date().toISOString(), matches: sorted }) + '\n');
  console.log(`tv-asignaciones: ${Object.keys(sorted).length} partidos (${Object.keys(sorted).length - before} nuevos)`);
}

main();

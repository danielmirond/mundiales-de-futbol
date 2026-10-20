/**
 * Snapshot del feed WOSTI (fútbol en TV, vía RapidAPI) → src/data/wosti-snapshot.json
 *
 * Misma lógica que guia-tv/scripts/fetch-wosti-snapshot.mjs: una llamada,
 * recorte a los campos que usa lib/wosti.ts, y FUSIÓN con lo anterior (los
 * días que trae la respuesta mandan; el resto se conserva; se poda lo
 * anterior a ayer). Sin credenciales se conserva el fichero previo (no rompe).
 *
 * Fuente preferida: el snapshot que ya publica Guía TV (WOSTI_SNAPSHOT_URL,
 * JSON con el array de eventos). Así no se gasta cuota de RapidAPI.
 * Respaldo, solo si no hay URL: una llamada directa a la API.
 *
 * Uso: WOSTI_SNAPSHOT_URL=… node scripts/wosti/snapshot.mjs
 *   o: RAPIDAPI_KEY=… RAPIDAPI_HOST=… node scripts/wosti/snapshot.mjs
 */
import { writeFileSync, existsSync, readFileSync } from 'node:fs';
const OUT = 'src/data/wosti-snapshot.json';
const URL_GUIA_TV = process.env.WOSTI_SNAPSHOT_URL;
const KEY = process.env.RAPIDAPI_KEY;
const HOST = process.env.RAPIDAPI_HOST;
if (!URL_GUIA_TV && (!KEY || !HOST)) { console.log('wosti-snapshot: sin fuente (WOSTI_SNAPSHOT_URL o credenciales) — se conserva el snapshot previo.'); process.exit(0); }
const dia = (e) => String(e?.Date ?? '').slice(0, 10);
const ayer = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
let previo = [];
if (existsSync(OUT)) { try { previo = JSON.parse(readFileSync(OUT, 'utf8')); } catch { previo = []; } if (!Array.isArray(previo)) previo = []; }
try {
  const res = URL_GUIA_TV
    ? await fetch(URL_GUIA_TV, { signal: AbortSignal.timeout(15000) })
    : await fetch(`https://${HOST}/api/Events`, { headers: { 'x-rapidapi-key': KEY, 'x-rapidapi-host': HOST }, signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const raw = await res.json();
  if (!Array.isArray(raw) || raw.length === 0) throw new Error('payload vacío');
  const slim = raw.map((e) => ({
    Id: e.Id, Date: e.Date,
    LocalTeam: { Name: e.LocalTeam?.Name, Image: e.LocalTeam?.Image },
    AwayTeam: { Name: e.AwayTeam?.Name, Image: e.AwayTeam?.Image },
    Competition: { Name: e.Competition?.Name, Image: e.Competition?.Image },
    ...(e.Event?.Name ? { Event: { Name: e.Event.Name } } : {}),
    Channels: (e.Channels ?? []).map((c) => ({ Name: c.Name, Image: c.Image })),
  }));
  const nuevos = new Set(slim.map(dia));
  const conservados = previo.filter((e) => dia(e) >= ayer && !nuevos.has(dia(e)));
  const fundido = [...conservados, ...slim].sort((a, b) => String(a.Date).localeCompare(String(b.Date)));
  writeFileSync(OUT, JSON.stringify(fundido));
  const dias = [...new Set(fundido.map(dia))].filter(Boolean).sort();
  console.log(`wosti-snapshot (${URL_GUIA_TV ? 'Guía TV' : 'API'}): ${slim.length} nuevos + ${conservados.length} conservados = ${fundido.length}. Cubre ${dias[0]} → ${dias.at(-1)} (${dias.length} días).`);
} catch (err) {
  console.log(`wosti-snapshot: falló (${err.message}). Se conserva el respaldo previo (${previo.length} eventos).`);
}

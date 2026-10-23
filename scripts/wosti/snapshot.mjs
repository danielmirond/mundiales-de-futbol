/**
 * Snapshot del feed WOSTI (fútbol en TV, vía RapidAPI) → src/data/wosti-snapshot.json
 *
 * Misma lógica que guia-tv/scripts/fetch-wosti-snapshot.mjs: una llamada,
 * recorte a los campos que usa lib/wosti.ts, y FUSIÓN con lo anterior (los
 * días que trae la respuesta mandan; el resto se conserva; se poda lo
 * anterior a ayer). Sin credenciales se conserva el fichero previo (no rompe).
 *
 * Uso: node scripts/wosti/snapshot.mjs
 * Desde el 23-oct-2026 lee la parrilla de Guía TV en crudo, sin clave ni cuota
 * («hay que coger el respaldo, no la clave»): solo Guía TV llama a WOSTI.
 * Otra URL con GUIA_TV_FEED.
 */
import { writeFileSync, existsSync, readFileSync } from 'node:fs';
const OUT = 'src/data/wosti-snapshot.json';
const FEED = process.env.GUIA_TV_FEED || 'https://www.mundodeportivo.com/guia-tv/api/wosti?formato=crudo';
const dia = (e) => String(e?.Date ?? '').slice(0, 10);
const ayer = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
let previo = [];
if (existsSync(OUT)) { try { previo = JSON.parse(readFileSync(OUT, 'utf8')); } catch { previo = []; } if (!Array.isArray(previo)) previo = []; }
try {
  const res = await fetch(FEED, { headers: { 'User-Agent': 'mundiales-de-futbol' }, signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const raw = (await res.json())?.eventos;
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
  console.log(`wosti-snapshot: ${slim.length} nuevos + ${conservados.length} conservados = ${fundido.length}. Cubre ${dias[0]} → ${dias.at(-1)} (${dias.length} días).`);
} catch (err) {
  console.log(`wosti-snapshot: falló (${err.message}). Se conserva el respaldo previo (${previo.length} eventos).`);
}

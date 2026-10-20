/**
 * Buscador de citas y experiencias de deportistas para las piezas Discover.
 *
 *   Buscar entrevistas, podcasts y documentales recientes en YouTube:
 *     npx tsx --env-file=.env.local scripts/research/quote-finder.ts "Andrés Iniesta" [--days 60] [--lang es|en]
*   Buscar por tema (pódcast y entrevistas recientes de actualidad):
 *     npx tsx --env-file=.env.local scripts/research/quote-finder.ts "podcast futbol entrevista" --topic --days 7
 *   Transcripción con minuto y segundo de un vídeo (subtítulos del propio vídeo o automáticos):
 *     npx tsx --env-file=.env.local scripts/research/quote-finder.ts --subs <videoId> [--grep "palabra"] [--lang es]
 *
 * La transcripción sirve para comprobar la frase exacta y enlazar el vídeo en ese segundo
 * (https://www.youtube.com/watch?v=<id>&t=<segundos>s). Los subtítulos automáticos se
 * equivocan: si la frase no es inequívoca, se parafrasea en vez de entrecomillar.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const opt = (k: string, d?: string) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const LANG = opt('--lang', 'es')!;
const KEY = process.env.YOUTUBE_API_KEY;

async function search(name: string, days: number, topic = false) {
  if (!KEY) { console.error('Falta YOUTUBE_API_KEY'); process.exit(1); }
  const after = new Date(Date.now() - days * 86_400_000).toISOString();
  // --topic: búsqueda libre (p. ej. «podcast fútbol entrevista») en vez de por persona.
  const q = topic ? name : LANG === 'es' ? `"${name}" entrevista|podcast|documental` : `"${name}" interview|podcast|documentary`;
  const u = new URL('https://www.googleapis.com/youtube/v3/search');
  Object.entries({ part: 'snippet', type: 'video', q, publishedAfter: after, maxResults: '20', order: 'relevance', relevanceLanguage: LANG, videoDuration: 'any', key: KEY }).forEach(([k, v]) => u.searchParams.set(k, v));
  const s: any = await (await fetch(u)).json();
  if (s.error) { console.error(s.error.message); process.exit(1); }
  const ids = (s.items ?? []).map((i: any) => i.id.videoId).join(',');
  if (!ids) { console.log('Sin resultados.'); return; }
  const v: any = await (await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${ids}&key=${KEY}`)).json();
  const rows = (v.items ?? []).map((x: any) => ({
    id: x.id, title: x.snippet.title, channel: x.snippet.channelTitle, date: x.snippet.publishedAt.slice(0, 10),
    views: Number(x.statistics.viewCount ?? 0), dur: String(x.contentDetails.duration).replace(/^PT/, '').toLowerCase(),
  })).filter((r: any) => !/^(\d+s|[0-1]m\d*s?)$/.test(r.dur)); // fuera los cortos de menos de 2 minutos
  rows.sort((a: any, b: any) => b.views - a.views);
  for (const r of rows) console.log(`${r.date}  ${String(r.views).padStart(9)} visitas  ${r.dur.padEnd(9)} ${r.channel} · ${r.title}\n           https://www.youtube.com/watch?v=${r.id}`);
}

function subs(id: string, grep?: string) {
  if (!/^[\w-]{11}$/.test(id)) { console.error('Id de vídeo no válido'); process.exit(1); }
  const dir = join(process.cwd(), '.cache/quotes', id);
  mkdirSync(dir, { recursive: true });
  try {
    execFileSync('yt-dlp', ['--skip-download', '--write-subs', '--write-auto-subs', '--sub-langs', `${LANG}.*,${LANG}`, '--sub-format', 'vtt', '-o', join(dir, '%(id)s.%(ext)s'), `https://www.youtube.com/watch?v=${id}`], { stdio: 'ignore' });
  } catch { /* sin subtítulos */ }
  const files = readdirSync(dir).filter((f) => f.endsWith('.vtt'));
  if (!files.length) { console.log('El vídeo no tiene subtítulos en ese idioma.'); return; }
  const manual = files.find((f) => !/\.auto|-orig/.test(f)) ?? files[0];
  console.log(`Subtítulos: ${manual} (pueden ser automáticos: escucha el fragmento antes de entrecomillar)`);
  // VTT → líneas con segundo de inicio, sin repeticiones de los automáticos.
  const lines: { t: number; text: string }[] = [];
  let t = 0; const seen = new Set<string>();
  for (const raw of readFileSync(join(dir, manual), 'utf8').split('\n')) {
    const m = raw.match(/^(\d{2}):(\d{2}):(\d{2})\.\d{3} -->/);
    if (m) { t = +m[1] * 3600 + +m[2] * 60 + +m[3]; continue; }
    const text = raw.replace(/<[^>]+>/g, '').trim();
    if (!text || text === 'WEBVTT' || /^(Kind|Language):/.test(text) || seen.has(text)) continue;
    seen.add(text); lines.push({ t, text });
  }
  const g = grep?.toLowerCase();
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  lines.forEach((l, i) => {
    if (g && !l.text.toLowerCase().includes(g)) return;
    const ctx = g ? lines.slice(Math.max(0, i - 2), i + 3).map((x) => x.text).join(' ') : l.text;
    console.log(`[${fmt(l.t)}] ${ctx}   → https://www.youtube.com/watch?v=${id}&t=${l.t}s`);
  });
}

(async () => {
  if (args.includes('--subs')) return subs(opt('--subs')!, opt('--grep'));
  const name = args.find((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'));
  if (!name) { console.error('Uso: quote-finder.ts "Nombre" [--days 60] | --subs <id> [--grep palabra]'); process.exit(1); }
  await search(name, Number(opt('--days', '60')), args.includes('--topic'));
})();

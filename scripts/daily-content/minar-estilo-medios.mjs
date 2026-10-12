#!/usr/bin/env node
/**
 * Mina el estilo de los medios de referencia (Marca, As, Goal) sobre artículos
 * reales: verbos de resultado, expresiones de racha/situación, conectores y
 * aperturas de párrafo, con su frecuencia. Método portado de
 * previas-partidos/scripts/minar-estilo.mjs (ED): el generador solo elige
 * entre lo minado con ≥3 usos; nunca inventa un giro. No se guarda texto,
 * solo recuentos y aperturas de 4 palabras.
 *
 *   node scripts/daily-content/minar-estilo-medios.mjs [--max 40]
 *   → scripts/daily-content/data/estilo-medios.json
 */
import { writeFileSync, mkdirSync } from 'node:fs';

const MAX = Number(process.argv[process.argv.indexOf('--max') + 1]) || 30;
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36';
const H = { 'User-Agent': UA, 'Accept-Language': 'es-ES,es;q=0.9' };

const MEDIOS = {
  marca: { portada: 'https://www.marca.com/futbol/primera-division.html', art: /marca\.com\/futbol\/[a-z-]+\/20\d\d\/\d\d\/\d\d\/[^"#]+\.html/ },
  as: { portada: 'https://as.com/futbol/primera/', art: /as\.com\/futbol\/(?:primera\/)?[a-z0-9-]+-f20\d{4}-n\// },
  goal: { portada: 'https://www.goal.com/es/competici%C3%B3n/primera-division/noticias/34pl8szyvrbwcmfkuocjm3r6t', art: /goal\.com\/es\/noticias\/[a-z0-9-]+\/blt[a-z0-9]+/ },
};

const VERBOS = ['venció', 'se impuso', 'doblegó', 'superó', 'derrotó', 'cayó', 'perdió', 'sucumbió', 'empató', 'firmó tablas', 'igualó', 'goleó', 'remontó', 'asaltó', 'arrolló', 'se llevó', 'tumbó', 'ganó', 'batió', 'sometió'];
const EXPRESIONES = ['no conoce la victoria', 'pleno de victorias', 'zona noble', 'puestos de descenso', 'la parte baja', 'la parte alta', 'puestos europeos', 'en racha', 'reencontrarse con la victoria', 'sumar de tres en tres', 'a domicilio', 'en su feudo', 'como local', 'como visitante', 'mal momento', 'buen momento', 'reaccionar', 'levantar cabeza', 'por delante', 'de ventaja', 'se vieron las caras', 'el último duelo', 'líder', 'colíder', 'tres puntos', 'reparto de puntos', 'punto de oro', 'goleada', 'remontada', 'tiempo añadido', 'a balón parado', 'desde el punto de penalti', 'en propia puerta', 'a la contra', 'posesión'];
const CONECTORES = ['mientras', 'aunque', 'además', 'en cambio', 'tras', 'por su parte', 'por otro lado', 'sin embargo', 'de hecho', 'pese a', 'a pesar de', 'con todo', 'eso sí', 'al final', 'al descanso', 'en la segunda parte', 'en la primera parte', 'desde el inicio', 'hasta el final'];
const TICS_PROHIBIDOS = ['correspondiente a la jornada', 'puntos separan a', 'ha alternado resultados', 'instalado en la zona noble', 'el balón echa a rodar', 'afrontan así la jornada', 'la serie suma una entrega'];

const clean = (s) => s.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/\s+/g, ' ').trim();
async function get(url) {
  try { const r = await fetch(url, { headers: H, signal: AbortSignal.timeout(20000) }); return r.ok ? await r.text() : ''; } catch { return ''; }
}
function parrafos(html) {
  const body = (html.match(/<(?:article|main)[^>]*>([\s\S]*)<\/(?:article|main)>/) || [, html])[1];
  return [...body.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map((m) => clean(m[1]))
    .filter((p) => p.split(' ').length >= 12 && !/cookies|suscr|newsletter|comparte|síguenos|descarga la app|©|ver más|lee también|^redacci[oó]n|actualizado \d\d\/\d\d\/\d{4}|compartir en/i.test(p));
}
function titulo(html) { const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/); return m ? clean(m[1]) : ''; }

const out = { generado: new Date().toISOString(), medios: {} };
for (const [medio, cfg] of Object.entries(MEDIOS)) {
  const portada = await get(cfg.portada);
  const urls = [...new Set([...portada.matchAll(/href="([^"]+)"/g)].map((m) => m[1]).map((u) => (u.startsWith('/') ? new URL(u, cfg.portada).href : u)).filter((u) => cfg.art.test(u)))].slice(0, MAX);
  const textos = []; const titulos = [];
  for (const u of urls) {
    const h = await get(u); if (!h) continue;
    const ps = parrafos(h); if (ps.length < 3) continue;
    textos.push(ps); titulos.push(titulo(h));
    await new Promise((r) => setTimeout(r, 400)); // cortesía
  }
  const corpus = textos.flat().join('\n').toLowerCase();
  const cuenta = (lista) => Object.fromEntries(lista.map((v) => [v, (corpus.match(new RegExp(`\\b${v.replace(/ /g, '\\s+')}\\b`, 'g')) ?? []).length]).filter(([, n]) => n >= 3).sort((a, b) => b[1] - a[1]));
  const frases = textos.flat().flatMap((p) => p.split(/(?<=[.!?])\s+/)).filter((f) => f.split(' ').length > 3);
  const palabras = textos.flat().reduce((a, p) => a + p.split(' ').length, 0);
  const aperturas = {};
  for (const ps of textos) for (const p of ps.slice(0, 3)) { const k = p.split(' ').slice(0, 4).join(' '); aperturas[k] = (aperturas[k] ?? 0) + 1; }
  const titularMedias = titulos.filter(Boolean).map((t) => t.length);
  out.medios[medio] = {
    articulos: textos.length,
    medianas: {
      palabrasPorPieza: Math.round(palabras / Math.max(1, textos.length)),
      parrafosPorPieza: Math.round(textos.reduce((a, p) => a + p.length, 0) / Math.max(1, textos.length)),
      palabrasPorParrafo: Math.round(palabras / Math.max(1, textos.flat().length)),
      palabrasPorFrase: Math.round(palabras / Math.max(1, frases.length)),
      caracteresTitular: Math.round(titularMedias.reduce((a, b) => a + b, 0) / Math.max(1, titularMedias.length)),
    },
    verbosResultado: cuenta(VERBOS),
    expresiones: cuenta(EXPRESIONES),
    conectores: cuenta(CONECTORES),
    ticsProhibidosVistos: cuenta(TICS_PROHIBIDOS),
    aperturasFrecuentes: Object.entries(aperturas).filter(([, n]) => n >= 2).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([k, n]) => `${k}×${n}`),
    titularesMuestra: titulos.filter(Boolean).slice(0, 8),
  };
  console.log(`${medio}: ${textos.length} artículos · ${palabras} palabras · verbos ${Object.keys(out.medios[medio].verbosResultado).length} · expresiones ${Object.keys(out.medios[medio].expresiones).length}`);
}
mkdirSync('scripts/daily-content/data', { recursive: true });
writeFileSync('scripts/daily-content/data/estilo-medios.json', JSON.stringify(out, null, 2) + '\n');
console.log('→ scripts/daily-content/data/estilo-medios.json');

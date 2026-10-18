/**
 * El tiempo en el estadio a la hora del partido.
 *
 * Fuentes (las dos permiten uso comercial con atribución):
 *  - AEMET OpenData para partidos en España, si hay `AEMET_API_KEY`.
 *  - MET Norway (api.met.no, CC BY 4.0) para el resto del mundo y como
 *    respaldo cuando AEMET no responde.
 * Coordenadas del estadio: Wikidata (P625) por nombre del recinto, con la
 * ciudad como respaldo. Sin IA.
 */

const UA = 'mundiales-de-futbol.com (contacto@mundiales-de-futbol.com)';
const DAY = 86_400;

export type WeatherSource = 'aemet' | 'met';
export type MatchWeather = {
  source: WeatherSource;
  /** Hora local de la previsión usada (ISO). */
  time: string;
  temp: number | null;
  /** km/h */
  wind: number | null;
  /** mm en la hora (MET) o probabilidad en % (AEMET). */
  rainMm?: number | null;
  rainProb?: number | null;
  sky: string;
  icon: WeatherIcon;
  place: string;
};
export type WeatherIcon = 'sol' | 'nubes-claros' | 'nubes' | 'lluvia' | 'tormenta' | 'nieve' | 'niebla' | 'noche';

/* eslint-disable @typescript-eslint/no-explicit-any */
async function getJson(url: string, revalidate: number, headers: Record<string, string> = {}) {
  try {
    const r = await fetch(url, { headers: { 'User-Agent': UA, ...headers }, next: { revalidate } });
    if (!r.ok) return null;
    const buf = await r.arrayBuffer();
    // AEMET sirve los datos en ISO-8859-15.
    const text = /charset=iso-8859/i.test(r.headers.get('content-type') ?? '') ? new TextDecoder('iso-8859-15').decode(buf) : new TextDecoder().decode(buf);
    return JSON.parse(text);
  } catch { return null; }
}

/* ---------- Coordenadas ---------- */

const VENUE_RE = /estadio|recinto deportivo|stadium|arena|campo de f|ground|stade|stadion|stadio|estádio|circuito|circuit|park|field|velódromo|hipódromo/i;
const CITY_RE = /ciudad|municipio|capital|localidad|town|city|commune|comune|gemeinde|village|villa/i;

async function wikidataCoords(query: string, re: RegExp): Promise<{ lat: number; lon: number } | null> {
  const s = await getJson(`https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&language=es&uselang=es&type=item&limit=6&search=${encodeURIComponent(query)}`, 30 * DAY);
  const ids = ((s?.search ?? []) as any[]).filter((r) => re.test(String(r.description ?? ''))).map((r) => String(r.id)).slice(0, 3);
  if (!ids.length) return null;
  const e = await getJson(`https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=claims&ids=${ids.join('|')}`, 30 * DAY);
  for (const id of ids) {
    const v = e?.entities?.[id]?.claims?.P625?.[0]?.mainsnak?.datavalue?.value;
    if (v && typeof v.latitude === 'number') return { lat: v.latitude, lon: v.longitude };
  }
  return null;
}

export async function venueCoords(venue: string | undefined, city: string | undefined): Promise<{ lat: number; lon: number } | null> {
  if (venue) {
    const v = await wikidataCoords(venue, VENUE_RE);
    if (v) return v;
  }
  return city ? wikidataCoords(city, CITY_RE) : null;
}

/* ---------- Iconos y textos ---------- */

function metSky(code: string): { sky: string; icon: WeatherIcon } {
  const c = code.replace(/_(day|night|polartwilight)$/, '');
  const night = code.endsWith('_night');
  if (/thunder/.test(c)) return { sky: 'Tormenta', icon: 'tormenta' };
  if (/snow/.test(c)) return { sky: 'Nieve', icon: 'nieve' };
  if (/sleet/.test(c)) return { sky: 'Aguanieve', icon: 'nieve' };
  if (/heavyrain/.test(c)) return { sky: 'Lluvia fuerte', icon: 'lluvia' };
  if (/rainshowers/.test(c)) return { sky: 'Chubascos', icon: 'lluvia' };
  if (/lightrain/.test(c)) return { sky: 'Lluvia débil', icon: 'lluvia' };
  if (/rain/.test(c)) return { sky: 'Lluvia', icon: 'lluvia' };
  if (/fog/.test(c)) return { sky: 'Niebla', icon: 'niebla' };
  if (c === 'cloudy') return { sky: 'Nublado', icon: 'nubes' };
  if (c === 'partlycloudy') return { sky: 'Intervalos nubosos', icon: 'nubes-claros' };
  if (c === 'fair') return { sky: 'Poco nuboso', icon: night ? 'noche' : 'nubes-claros' };
  return { sky: 'Despejado', icon: night ? 'noche' : 'sol' };
}

function aemetIcon(desc: string, hour: number): WeatherIcon {
  const d = desc.toLowerCase();
  if (/tormenta/.test(d)) return 'tormenta';
  if (/nieve/.test(d)) return 'nieve';
  if (/lluvia|chubasco|llovizna/.test(d)) return 'lluvia';
  if (/niebla|bruma|calima/.test(d)) return 'niebla';
  if (/cubierto|muy nuboso/.test(d)) return 'nubes';
  if (/nuboso|intervalos|poco nuboso/.test(d)) return 'nubes-claros';
  return hour >= 20 || hour < 7 ? 'noche' : 'sol';
}

/* ---------- MET Norway ---------- */

async function metWeather(lat: number, lon: number, kickoff: Date, place: string): Promise<MatchWeather | null> {
  const d = await getJson(`https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}`, 3600);
  const series: any[] = d?.properties?.timeseries ?? [];
  if (!series.length) return null;
  const target = kickoff.getTime();
  let best: any = null, diff = Infinity;
  for (const t of series) {
    const dt = Math.abs(Date.parse(t.time) - target);
    if (dt < diff) { diff = dt; best = t; }
  }
  // Más allá de 3 h del inicio no hay previsión útil para ese momento.
  if (!best || diff > 3 * 3600_000) return null;
  const inst = best.data?.instant?.details ?? {};
  const next = best.data?.next_1_hours ?? best.data?.next_6_hours;
  const { sky, icon } = metSky(String(next?.summary?.symbol_code ?? 'cloudy'));
  return {
    source: 'met', time: best.time, place, sky, icon,
    temp: typeof inst.air_temperature === 'number' ? Math.round(inst.air_temperature) : null,
    wind: typeof inst.wind_speed === 'number' ? Math.round(inst.wind_speed * 3.6) : null,
    rainMm: typeof next?.details?.precipitation_amount === 'number' ? next.details.precipitation_amount : null,
    rainProb: typeof next?.details?.probability_of_precipitation === 'number' ? Math.round(next.details.probability_of_precipitation) : null,
  };
}

/* ---------- AEMET (España) ---------- */

/** Municipio de AEMET más cercano a unas coordenadas (lista maestra, caché diaria). */
async function aemetMunicipio(lat: number, lon: number, key: string): Promise<{ id: string; name: string } | null> {
  const list = await getJson(`https://opendata.aemet.es/opendata/api/maestro/municipios?api_key=${key}`, DAY);
  const arr: any[] = Array.isArray(list) ? list : [];
  let best: any = null, bd = Infinity;
  for (const m of arr) {
    const la = Number(m.latitud_dec), lo = Number(m.longitud_dec);
    if (!Number.isFinite(la) || !Number.isFinite(lo)) continue;
    const dd = (la - lat) ** 2 + ((lo - lon) * Math.cos((lat * Math.PI) / 180)) ** 2;
    if (dd < bd) { bd = dd; best = m; }
  }
  // Más de ~15 km del municipio más cercano: probablemente fuera de España.
  if (!best || Math.sqrt(bd) > 0.14) return null;
  return { id: String(best.id).replace(/^id/, ''), name: String(best.nombre) };
}

async function aemetWeather(lat: number, lon: number, kickoff: Date, key: string): Promise<MatchWeather | null> {
  const mun = await aemetMunicipio(lat, lon, key);
  if (!mun) return null;
  const meta = await getJson(`https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/horaria/${mun.id}?api_key=${key}`, 3600);
  if (!meta?.datos) return null;
  const data = await getJson(String(meta.datos), 3600);
  const dias: any[] = data?.[0]?.prediccion?.dia ?? [];
  const local = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23' }).formatToParts(kickoff);
  const part = (t: string) => local.find((p) => p.type === t)?.value ?? '';
  const ymd = `${part('year')}-${part('month')}-${part('day')}`;
  const hh = part('hour');
  const dia = dias.find((x) => String(x.fecha).startsWith(ymd));
  if (!dia) return null;
  const at = (arr: any[] | undefined) => (arr ?? []).find((v) => String(v.periodo) === hh);
  // La probabilidad viene por tramos de 6 h («0814», «1420»…).
  const inRange = (arr: any[] | undefined) => (arr ?? []).find((v) => { const p = String(v.periodo); return p.length === 4 && Number(hh) >= Number(p.slice(0, 2)) && Number(hh) < Number(p.slice(2)); });
  const skyV = at(dia.estadoCielo);
  if (!skyV) return null;
  const wind = (dia.vientoAndRachaMax ?? []).find((v: any) => String(v.periodo) === hh && v.velocidad);
  const sky = String(skyV.descripcion ?? '').trim() || 'Sin datos';
  return {
    source: 'aemet', time: kickoff.toISOString(), place: mun.name, sky, icon: aemetIcon(sky, Number(hh)),
    temp: at(dia.temperatura) ? Number(at(dia.temperatura).value) : null,
    wind: wind ? Number(wind.velocidad?.[0]) : null,
    rainMm: at(dia.precipitacion) ? Number(String(at(dia.precipitacion).value).replace('Ip', '0')) : null,
    rainProb: inRange(dia.probPrecipitacion) ? Number(inRange(dia.probPrecipitacion).value) : null,
  };
}

/* ---------- Entrada ---------- */

/** Deportes al aire libre en las fichas de partido (baloncesto y hockey se juegan a cubierto). */
export const OUTDOOR_SPORTS = new Set(['futbol', 'rugby', 'futbol-americano', 'beisbol']);
const SPAIN = /^(spain|españa)$/i;

export async function matchWeather(opts: { venue?: string; city?: string; country?: string; kickoff: string; indoor?: boolean }): Promise<MatchWeather | null> {
  if (opts.indoor) return null;
  const kickoff = new Date(opts.kickoff);
  const now = Date.now();
  // Solo con previsión real: hasta 9 días antes y mientras dura el partido.
  if (kickoff.getTime() - now > 9 * DAY * 1000 || now - kickoff.getTime() > 3 * 3600_000) return null;
  const coords = await venueCoords(opts.venue, opts.city);
  if (!coords) return null;
  const place = opts.city ?? opts.venue ?? '';
  const key = process.env.AEMET_API_KEY;
  if (key && SPAIN.test(opts.country ?? '')) {
    const a = await aemetWeather(coords.lat, coords.lon, kickoff, key);
    if (a) return a;
  }
  return metWeather(coords.lat, coords.lon, kickoff, place);
}

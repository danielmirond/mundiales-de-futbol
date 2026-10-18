/**
 * UFC desde Cito API (citoapi.com): rankings por división, fichas de luchador con
 * estadísticas e historial, y veladas con estadísticas por asalto.
 * Clave en `CITO_API_KEY`. Solo la usa `scripts/ufc/snapshot.ts`: la web lee la copia (`ufc-data.ts`).
 * Las imágenes que sirve la API son de ufc.com: no se usan (derechos).
 * Cuota gratuita: 500 consultas al mes y 10 por minuto.
 */

const BASE = 'https://api.citoapi.com/api/v1/ufc';

/* eslint-disable @typescript-eslint/no-explicit-any */
async function get(path: string, revalidate: number): Promise<any> {
  const key = process.env.CITO_API_KEY;
  if (!key) return null;
  try {
    const r = await fetch(`${BASE}${path}`, { headers: { 'x-api-key': key }, next: { revalidate } });
    if (!r.ok) return null;
    const j = await r.json();
    return j?.success ? j.data : null;
  } catch { return null; }
}

const DIVISION_ES: Record<string, string> = {
  Flyweight: 'Peso mosca', Bantamweight: 'Peso gallo', Featherweight: 'Peso pluma', Lightweight: 'Peso ligero', Welterweight: 'Peso wélter',
  Middleweight: 'Peso medio', 'Light Heavyweight': 'Peso semipesado', Heavyweight: 'Peso pesado', "Women's Strawweight": 'Peso paja femenino',
  "Women's Flyweight": 'Peso mosca femenino', "Women's Bantamweight": 'Peso gallo femenino', "Women's Featherweight": 'Peso pluma femenino',
  'Pound-for-Pound': 'Libra por libra', "Men's Pound-for-Pound": 'Libra por libra masculino', "Women's Pound-for-Pound": 'Libra por libra femenino', Catchweight: 'Peso pactado',
};
export const divisionEs = (d?: string) => (d ? DIVISION_ES[d.replace(/ Division$/, '')] ?? d : '');
const METHOD_ES: Record<string, string> = { 'KO/TKO': 'KO/TKO', SUB: 'Sumisión', 'U-DEC': 'Decisión unánime', 'S-DEC': 'Decisión dividida', 'M-DEC': 'Decisión mayoritaria', DQ: 'Descalificación', 'Overturned': 'Anulado', 'CNC': 'Sin resultado', DEC: 'Decisión' };
export const methodEs = (m?: string) => (m ? METHOD_ES[m] ?? m : '');
const DETAIL_ES: Record<string, string> = {
  Punch: 'Puñetazo', Punches: 'Puñetazos', Kick: 'Patada', Kicks: 'Patadas', Knee: 'Rodillazo', Knees: 'Rodillazos', Elbow: 'Codazo', Elbows: 'Codazos', 'Head Kick': 'Patada a la cabeza',
  'Spinning Back Fist': 'Puño giratorio', 'Spinning Back Kick': 'Patada giratoria', Slam: 'Proyección', 'Rear Naked Choke': 'Mataleón', Guillotine: 'Guillotina', 'Guillotine Choke': 'Guillotina',
  'Arm Triangle': 'Triángulo de brazo', Triangle: 'Triángulo', 'Triangle Choke': 'Triángulo', Armbar: 'Palanca de brazo', Kimura: 'Kimura', 'Neck Crank': 'Torsión de cuello',
  "D'Arce Choke": 'Estrangulación D’Arce', 'Anaconda Choke': 'Anaconda', 'Heel Hook': 'Talonera', Kneebar: 'Palanca de rodilla', 'Von Flue Choke': 'Estrangulación Von Flue', 'Doctor Stoppage': 'Parada médica',
};
/** Detalle del método en castellano; si no está en el mapa se omite antes que dejarlo en inglés. */
const detailEs = (d?: string | null) => (d ? DETAIL_ES[d] : undefined);
const STANCE_ES: Record<string, string> = { Orthodox: 'Ortodoxa', Southpaw: 'Zurda', Switch: 'Cambiante' };
const COUNTRY_ES: Record<string, string> = { Spain: 'España', Germany: 'Alemania', Georgia: 'Georgia', 'United States': 'Estados Unidos', Brazil: 'Brasil', Russia: 'Rusia', Mexico: 'México', Canada: 'Canadá', Australia: 'Australia', England: 'Inglaterra', Ireland: 'Irlanda', France: 'Francia', Poland: 'Polonia', 'New Zealand': 'Nueva Zelanda', Nigeria: 'Nigeria', China: 'China', Japan: 'Japón', Kazakhstan: 'Kazajistán', Dagestan: 'Daguestán', Cameroon: 'Camerún', Argentina: 'Argentina', Peru: 'Perú', Chile: 'Chile', Venezuela: 'Venezuela', Colombia: 'Colombia', Netherlands: 'Países Bajos', Sweden: 'Suecia', Italy: 'Italia', Kyrgyzstan: 'Kirguistán', Uzbekistan: 'Uzbekistán', Armenia: 'Armenia', Ukraine: 'Ucrania', Scotland: 'Escocia', Wales: 'Gales' };
export const countryEs = (c?: string | null) => (c ? COUNTRY_ES[c] ?? c : undefined);

/* ---------- Rankings ---------- */

export type UfcRankRow = { rank: number | null; rankText: string; slug: string; name: string; champion: boolean; country?: string; change?: string | null };
export type UfcDivision = { division: string; name: string; rows: UfcRankRow[] };

export async function fetchUfcRankings(system: 'meta' | 'media' = 'media'): Promise<UfcDivision[] | null> {
  const d = await get(system === 'meta' ? '/rankings/meta' : '/rankings/media', 21_600);
  const arr: any[] = Array.isArray(d) ? d : [];
  if (!arr.length) return null;
  const byDiv = new Map<string, UfcDivision>();
  for (const r of arr) {
    const key = String(r.normalizedDivision ?? r.division);
    const div = byDiv.get(key) ?? { division: key, name: divisionEs(r.division), rows: [] };
    div.rows.push({ rank: r.rank ?? null, rankText: String(r.rankText ?? ''), slug: String(r.fighterSlug), name: String(r.fighterName), champion: Boolean(r.isChampion), country: countryEs(r.country), change: r.rankChangeText ?? null });
    byDiv.set(key, div);
  }
  for (const d2 of byDiv.values()) d2.rows.sort((a, b) => Number(b.champion) - Number(a.champion) || (a.rank ?? 99) - (b.rank ?? 99));
  return [...byDiv.values()];
}

/* ---------- Luchador ---------- */

export type UfcFight = { opponent: string; opponentSlug?: string; outcome: string; method: string; round?: number; time?: string; title: boolean; event: string; eventSlug: string; date: string; upcoming: boolean };
export type UfcFighter = {
  slug: string; name: string; nickname?: string; division: string; record: string; wins: number; losses: number; draws: number;
  age?: number; heightCm?: number; reachCm?: number; weightKg?: number; stance?: string; born?: string; trainsAt?: string; debut?: string;
  champion: boolean; ranks: { system: string; division: string; rankText: string }[];
  stats?: {
    strikingAccuracy?: number; strikesLandedPerMin?: number; strikesAbsorbedPerMin?: number; strikeDefense?: number;
    takedownAccuracy?: number; takedownsPer15?: number; takedownDefense?: number; submissionsPer15?: number; knockdownAvg?: number; avgFightSeconds?: number;
    byTarget?: { label: string; percent: number }[]; byPosition?: { label: string; percent: number }[]; winsByMethod?: { label: string; count: number }[];
  };
  fights: UfcFight[];
};

const inchToCm = (n?: number | null) => (n ? Math.round(n * 2.54) : undefined);
const TARGET_ES: Record<string, string> = { head: 'Cabeza', body: 'Cuerpo', leg: 'Piernas', standing: 'De pie', clinch: 'Clinch', ground: 'Suelo', 'ko-tko': 'KO/TKO', sub: 'Sumisión', dec: 'Decisión' };
const parts = (o: any, key = 'percent') => Object.entries(o ?? {}).map(([k, v]: [string, any]) => ({ label: TARGET_ES[k] ?? v.label ?? k, percent: Number(v.percent ?? 0), count: Number(v.count ?? 0), [key]: v[key] }));

export async function fetchUfcFighter(slug: string): Promise<UfcFighter | null> {
  if (!/^[a-z0-9-]{2,80}$/.test(slug)) return null;
  const [p, s, f] = await Promise.all([get(`/fighters/${slug}`, 86_400), get(`/fighters/${slug}/stats`, 86_400), get(`/fighters/${slug}/fights`, 86_400)]);
  if (!p?.name) return null;
  const stats = s ? {
    strikingAccuracy: s.strikingAccuracy, strikesLandedPerMin: s.sigStrikesLandedPerMin, strikesAbsorbedPerMin: s.sigStrikesAbsorbedPerMin, strikeDefense: s.sigStrikeDefense,
    takedownAccuracy: s.takedownAccuracy, takedownsPer15: s.takedownAvgPer15Min, takedownDefense: s.takedownDefense, submissionsPer15: s.submissionAvgPer15Min,
    knockdownAvg: s.knockdownAvg, avgFightSeconds: s.averageFightTimeSeconds,
    byTarget: parts(s.sigStrikesByTarget), byPosition: parts(s.sigStrikesByPosition), winsByMethod: parts(s.winsByMethod).map((x) => ({ label: x.label, count: x.count })),
  } : undefined;
  const fights: UfcFight[] = ((Array.isArray(f) ? f : []) as any[]).map((x) => ({
    opponent: String(x.opponent?.name ?? ''), opponentSlug: x.opponent?.slug, outcome: String(x.outcome ?? ''), method: methodEs(x.bout?.method),
    round: x.bout?.resultRound ?? undefined, time: x.bout?.resultTime ?? undefined, title: Boolean(x.bout?.titleBout), event: String(x.event?.title ?? ''),
    eventSlug: String(x.event?.slug ?? ''), date: String(x.event?.eventDate ?? x.event?.startsAt ?? ''), upcoming: Boolean(x.isUpcoming),
  }));
  return {
    slug: p.slug, name: p.name, nickname: p.nickname ?? undefined, division: divisionEs(p.division), record: `${p.recordWins}-${p.recordLosses}-${p.recordDraws}`,
    wins: Number(p.recordWins ?? 0), losses: Number(p.recordLosses ?? 0), draws: Number(p.recordDraws ?? 0),
    age: p.age ?? undefined, heightCm: inchToCm(p.heightInches), reachCm: inchToCm(p.reachInches), weightKg: p.weightLbs ? Math.round(p.weightLbs * 0.4536) : undefined,
    stance: p.stance ? STANCE_ES[p.stance] ?? p.stance : undefined, born: countryEs(p.placeOfBirth) ?? undefined, trainsAt: p.trainsAt ?? undefined, debut: p.octagonDebut ?? undefined,
    champion: p.championStatus === 'champion',
    ranks: ((p.rankings ?? []) as any[]).map((r) => ({ system: String(r.system), division: divisionEs(r.division), rankText: String(r.rankText) })),
    stats, fights,
  };
}

/* ---------- Velada ---------- */

export type UfcRoundRow = { round: number; sig: string; total: string; td: string; ctrl: string; kd: number; head: string; body: string; leg: string };
export type UfcCorner = { slug: string; name: string; outcome: string; record?: string; country?: string; totals?: UfcRoundRow; rounds: UfcRoundRow[] };
export type UfcBout = { id: string; section: string; division: string; title: boolean; method: string; methodDetail?: string; round?: number; time?: string; referee?: string; status: string; a: UfcCorner; b: UfcCorner };
export type UfcEvent = { slug: string; title: string; date: string; startsAt: string; place?: string; status: string; bouts: UfcBout[] };

const row = (x: any): UfcRoundRow => ({ round: Number(x.round ?? 0), sig: String(x.significantStrikes ?? ''), total: String(x.totalStrikes ?? ''), td: String(x.takedowns ?? ''), ctrl: String(x.controlTime ?? ''), kd: Number(x.knockdowns ?? 0), head: String(x.head ?? ''), body: String(x.body ?? ''), leg: String(x.leg ?? '') });
const SECTION_ES: Record<string, string> = { 'Main Card': 'Cartelera principal', Prelims: 'Preliminares', 'Early Prelims': 'Preliminares tempranas' };

export async function fetchUfcEvent(slug: string): Promise<UfcEvent | null> {
  if (!/^[a-z0-9-]{2,100}$/.test(slug)) return null;
  const ev = await get(`/events/${slug}`, 3600);
  if (!ev?.title) return null;
  const done = ev.status === 'completed';
  const bd = await get(`/events/${slug}/bouts`, done ? 86_400 : 3600);
  const bouts: any[] = Array.isArray(bd) ? bd : bd?.bouts ?? [];
  return {
    slug: ev.slug, title: ev.title, date: ev.eventDate ?? ev.startsAt, startsAt: ev.startsAt, place: ev.locationText ?? undefined, status: ev.status,
    bouts: bouts.filter((b) => !b.isCancelled).map((b) => {
      const corner = (f: any): UfcCorner => ({
        slug: f.fighterSlug, name: f.fighterName, outcome: f.outcome ?? '', record: f.profile?.recordText?.replace(/ \(W-L-D\)$/, ''), country: countryEs(f.country),
        totals: ((b.boutStats ?? []) as any[]).filter((s) => s.fighterSlug === f.fighterSlug).map(row)[0],
        rounds: ((b.roundStats ?? []) as any[]).filter((s) => s.fighterSlug === f.fighterSlug).map(row).sort((x, y) => x.round - y.round),
      });
      const [a, c] = (b.fighters ?? []) as any[];
      return {
        id: String(b.id), section: SECTION_ES[b.cardSection] ?? String(b.cardSection ?? ''), division: divisionEs(b.weightClass), title: Boolean(b.titleBout),
        method: methodEs(b.method), methodDetail: detailEs(b.methodDetails), round: b.resultRound ?? undefined, time: b.resultTime ?? undefined,
        referee: b.referee?.name ?? undefined, status: String(b.status ?? ''), a: corner(a ?? {}), b: corner(c ?? {}),
      };
    }),
  };
}

export async function fetchUfcEvents(): Promise<{ upcoming: { slug: string; title: string; startsAt: string; place?: string }[]; recent: { slug: string; title: string; startsAt: string; place?: string }[] } | null> {
  const [up, rec] = await Promise.all([get('/events/upcoming', 3600), get('/events/recent', 3600)]);
  if (!up && !rec) return null;
  const map = (arr: any) => ((Array.isArray(arr) ? arr : []) as any[]).map((e) => ({ slug: e.slug, title: e.title, startsAt: e.startsAt, place: e.locationText ?? undefined }));
  return { upcoming: map(up), recent: map(rec) };
}

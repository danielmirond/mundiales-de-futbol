/**
 * Motor de voz DETERMINISTA para las piezas diarias (sin IA).
 *
 * Variantes de arranque, transición y cierre elegidas por semilla (el slug de
 * la pieza), para que dos piezas del mismo tipo no suenen iguales. Registro
 * de mesa de deportes: frase corta, dato delante, nada de muletillas de IA.
 *
 * Guardas del manual Discover: titular con la entidad en las cinco primeras
 * palabras (H1), objetivo 70-79 caracteres (CTR), y linter anticlickbait
 * (dos señales bloquean). Las palabras no son esfuerzo (ES2): no se rellena.
 */

export function seedFrom(s: string): () => number {
  // xmur3 + mulberry32: estable entre ejecuciones para el mismo slug.
  let h = 1779033703 ^ s.length;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = (h >>> 0) || 1;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const pick = <T,>(rnd: () => number, list: T[]): T => list[Math.floor(rnd() * list.length)];

export const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);

/** Lista en prosa: "A, B y C". */
export const prose = (xs: string[]) =>
  xs.length <= 1 ? (xs[0] ?? '') : `${xs.slice(0, -1).join(', ')} y ${xs[xs.length - 1]}`;

// ── Linter anticlickbait (dos señales = reescribir) ──
const GANCHO = /\b(brutal|bombazo|ojo|atenci[oó]n|confirmado|filtrado|desvelado|incre[ií]ble|impactante|esc[aá]ndalo)\b/i;
export function clickbaitSignals(title: string): string[] {
  const s: string[] = [];
  if (/[!?¡¿]/.test(title)) s.push('exclamación/interrogación');
  if (/\b[A-ZÁÉÍÓÚÑ]{4,}\b/.test(title)) s.push('mayúsculas sostenidas');
  if (GANCHO.test(title)) s.push('léxico gancho');
  if (/^\d/.test(title.trim())) s.push('empieza por número');
  if (/\.\.\.|…/.test(title)) s.push('puntos suspensivos');
  return s;
}

/** Comprueba titular: sin clickbait, ≤110, entidad delante. Lanza si no pasa. */
export function assertTitle(title: string, entity: string) {
  const cb = clickbaitSignals(title);
  if (cb.length >= 2) throw new Error(`Titular con clickbait (${cb.join(', ')}): ${title}`);
  if (title.length > 110) throw new Error(`Titular > 110: ${title}`);
  const first5 = title.split(/\s+/).slice(0, 5).join(' ').toLowerCase();
  const ent = entity.toLowerCase().split(/\s+/)[0];
  if (!first5.includes(ent)) throw new Error(`Entidad "${entity}" fuera de las 5 primeras palabras: ${title}`);
}

// ── Formateo de fechas (Madrid) ──
const MADRID = 'Europe/Madrid';
export const fmtDayLong = (d: Date | number) =>
  new Intl.DateTimeFormat('es-ES', { timeZone: MADRID, weekday: 'long', day: 'numeric', month: 'long' }).format(d).replace(',', '');
export const fmtTime = (d: Date | number) =>
  new Intl.DateTimeFormat('es-ES', { timeZone: MADRID, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(d);
export const dayKey = (d: Date | number) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: MADRID, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// ── Variantes ──
export const V = {
  hoyIntro: [
    (n: number, dep: string, dia: string) => `${cap(dia)} deja ${n} ${plural(n, 'partido', 'partidos')} de ${dep} en las competiciones que seguimos. Aquí van, con la hora en España y el canal donde se ven.`,
    (n: number, dep: string, dia: string) => `Jornada de ${dep} con ${n} ${plural(n, 'cita', 'citas')} este ${dia}. Horarios en hora peninsular y dónde verlas, competición por competición.`,
    (n: number, dep: string, dia: string) => `${n} ${plural(n, 'partido', 'partidos')} de ${dep} para ${dia}. Repasamos qué se juega, a qué hora y en qué canal, sin más vueltas.`,
    (n: number, dep: string, dia: string) => `El ${dep} no para: ${n} ${plural(n, 'encuentro', 'encuentros')} este ${dia}. Esta es la agenda completa con horarios de España y televisión.`,
  ],
  hoyCierre: [
    'Todos los horarios están en hora peninsular. Los marcadores se actualizan en directo en cada ficha de partido.',
    'Hora peninsular en todos los casos. Si un canal cambia a última hora, la ficha del partido lo recoge.',
    'Horarios en hora de España; los resultados y la narración de cada partido van en su ficha.',
  ],
  cronicaLead: {
    win: [
      (w: string, l: string, sc: string, comp: string) => `${w} se impuso a ${l} por ${sc} en ${comp}.`,
      (w: string, l: string, sc: string, comp: string) => `Victoria de ${w} ante ${l} (${sc}) en ${comp}.`,
      (w: string, l: string, sc: string, comp: string) => `${w} ganó ${sc} a ${l} en el partido de ${comp}.`,
    ],
    draw: [
      (h: string, a: string, sc: string, comp: string) => `${h} y ${a} empataron ${sc} en ${comp}.`,
      (h: string, a: string, sc: string, comp: string) => `Reparto de puntos entre ${h} y ${a} (${sc}) en ${comp}.`,
      (h: string, a: string, sc: string, comp: string) => `${h} y ${a} firmaron tablas (${sc}) en ${comp}.`,
    ],
  },
  cronicaGoles: [
    (xs: string) => `Los goles: ${xs}.`,
    (xs: string) => `Marcaron ${xs}.`,
    (xs: string) => `En el marcador, ${xs}.`,
  ],
  cronicaSinGoles: [
    'El partido acabó sin goles.',
    'Ninguno de los dos consiguió marcar.',
    'Sin goles en el marcador.',
  ],
  cronicaDatos: [
    (h: string, a: string, ph: string, pa: string, th: string, ta: string, oh: string, oa: string) =>
      `${h} tuvo el ${ph} % de la posesión por el ${pa} % de ${a}; remató ${th} veces (${oh} a puerta) frente a ${ta} (${oa}) del rival.`,
    (h: string, a: string, ph: string, pa: string, th: string, ta: string, oh: string, oa: string) =>
      `La posesión fue ${ph} %-${pa} % para ${h}. En remates, ${th} de ${h} (${oh} a puerta) por ${ta} de ${a} (${oa}).`,
    (h: string, a: string, ph: string, pa: string, th: string, ta: string, oh: string, oa: string) =>
      `${h} manejó el balón (${ph} % por ${pa} %) y tiró ${th} veces, ${oh} entre los tres palos; ${a} se quedó en ${ta} remates (${oa} a puerta).`,
  ],
  previaIntro: [
    (h: string, a: string, comp: string, dia: string) => `${h} y ${a} se ven las caras este ${dia} en ${comp}.`,
    (h: string, a: string, comp: string, dia: string) => `${h} recibe a ${a} este ${dia} en ${comp}.`,
    (h: string, a: string, comp: string, dia: string) => `Cita de ${comp} este ${dia}: ${h} contra ${a}.`,
  ],
  clasifIntro: [
    (comp: string, lider: string, pts: number) => `${lider} manda en ${comp} con ${pts} puntos tras la última jornada.`,
    (comp: string, lider: string, pts: number) => `Así está ${comp}: ${lider} lidera la tabla con ${pts} puntos.`,
    (comp: string, lider: string, pts: number) => `${lider} sigue arriba en ${comp} (${pts} puntos). Repasamos la clasificación completa.`,
  ],
};

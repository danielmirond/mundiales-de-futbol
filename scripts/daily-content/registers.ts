/**
 * Registros de crónica modelados sobre cuatro medios (patrones ESTRUCTURALES,
 * nunca texto copiado). Se elige uno por semilla; todos son deterministas y
 * solo escriben hechos que vienen en los datos (ES1/MC5 del manual).
 *
 *  marca    · titular resultado + consecuencia en la tabla; entradilla-balance;
 *             ladillos temáticos cortos; cierre con "lo que viene".
 *  as       · titular a dos equipos; entradilla con quién decidió y qué faltó;
 *             arranque de contexto (cómo llegaban); "En cifras"; cierre con
 *             ficha técnica (tarjetas, cambios).
 *  athletic · marcador en el titular + tres claves; arranque en el momento
 *             decisivo; ladillos declarativos; "Qué cambia" y "Qué viene ahora".
 *  goal     · protagonista + verbo + consecuencia; párrafos muy cortos;
 *             "Resumen", "Los goles", "El dato", "Lee también".
 *
 * Ver scripts/daily-content/VOZ.md para el detalle de cada patrón.
 */
import { pick, prose, plural, fmtDayLong, fmtTime } from './voice';

export type Goal = { player: string; minute: string; team: string; own: boolean; pen: boolean };
export type Side = { name: string; rank?: number; points?: string; record?: string; last?: string; next?: string };
export type CronicaCtx = {
  comp: string; compShort: string; compPath: string; fichaPath: string;
  home: Side; away: Side;
  hs: number; as: number;
  goals: Goal[]; topScorer?: string; topN: number;
  possession?: [string, string]; shots?: [string, string]; onTarget?: [string, string]; corners?: [string, string];
  yellows: number; reds: string[]; subs: number;
  channels: string[];
  date: Date;
};
export type Register = 'marca' | 'as' | 'athletic' | 'goal';
export const REGISTERS: Register[] = ['marca', 'as', 'athletic', 'goal'];

const ord = (n?: number) => (n ? `${n}.º` : '');
const score = (c: CronicaCtx) => `${c.hs}-${c.as}`;
const winner = (c: CronicaCtx) => (c.hs === c.as ? null : c.hs > c.as ? c.home : c.away);
const loser = (c: CronicaCtx) => (c.hs === c.as ? null : c.hs > c.as ? c.away : c.home);
const wsc = (c: CronicaCtx) => (c.hs >= c.as ? `${c.hs}-${c.as}` : `${c.as}-${c.hs}`);
const goalLine = (g: Goal) => `${g.player} (${g.minute}, ${g.team}${g.own ? ', p.p.' : g.pen ? ', de penalti' : ''})`;
const golesTxt = (c: CronicaCtx, rnd: () => number) =>
  c.goals.length
    ? pick(rnd, [`Los goles: ${prose(c.goals.map(goalLine))}.`, `Marcaron ${prose(c.goals.map(goalLine))}.`, `En el marcador, ${prose(c.goals.map(goalLine))}.`])
    : pick(rnd, ['El partido acabó sin goles.', 'Ninguno de los dos consiguió marcar.', 'Sin goles en el marcador.']);
const tablaTxt = (c: CronicaCtx) => {
  const f = (s: Side) => (s.rank ? `${s.name} ${ord(s.rank)}${s.points ? ` con ${s.points} puntos` : s.record ? ` (${s.record})` : ''}` : '');
  const parts = [f(c.home), f(c.away)].filter(Boolean);
  return parts.length ? `Tras el partido, ${parts.join(' y ')} en la [clasificación de ${c.compShort}](${c.compPath}).` : `La [clasificación de ${c.compShort}](${c.compPath}) se actualiza al momento.`;
};
const vieneTxt = (c: CronicaCtx) => {
  const parts = [c.home.next && `${c.home.name}: ${c.home.next}`, c.away.next && `${c.away.name}: ${c.away.next}`].filter(Boolean) as string[];
  return parts.length ? `Lo que viene. ${parts.join('. ')}.` : '';
};
const llegabanTxt = (c: CronicaCtx) => {
  const parts = [c.home.last && `${c.home.name} llegaba ${c.home.last}`, c.away.last && `${c.away.name}, ${c.away.last}`].filter(Boolean) as string[];
  return parts.length ? `${parts.join('; ')}.` : '';
};
const cifrasTxt = (c: CronicaCtx, rnd: () => number) => {
  if (!c.possession || !c.shots || !c.onTarget) return '';
  const [ph, pa] = c.possession, [th, ta] = c.shots, [oh, oa] = c.onTarget;
  return pick(rnd, [
    `${c.home.name} tuvo el ${ph} % de la posesión por el ${pa} % de ${c.away.name}; remató ${th} veces (${oh} a puerta) frente a ${ta} (${oa}) del rival.`,
    `La posesión fue ${ph} %-${pa} % para ${c.home.name}. En remates, ${th} de ${c.home.name} (${oh} a puerta) por ${ta} de ${c.away.name} (${oa}).`,
    `${c.home.name} manejó el balón (${ph} % por ${pa} %) y tiró ${th} veces, ${oh} entre los tres palos; ${c.away.name} se quedó en ${ta} remates (${oa} a puerta).`,
  ]) + (c.corners ? ` Córners: ${c.corners[0]} por ${c.corners[1]}.` : '');
};
const fichaTxt = (c: CronicaCtx) => {
  const bits = [c.yellows ? `${c.yellows} ${plural(c.yellows, 'amarilla', 'amarillas')}` : '', c.reds.length ? `${plural(c.reds.length, 'expulsado', 'expulsados')}: ${prose(c.reds)}` : '', c.subs ? `${c.subs} cambios` : ''].filter(Boolean);
  return bits.length ? `Ficha: ${bits.join(' · ')}.` : '';
};
const gancho = (c: CronicaCtx) =>
  c.topN >= 3 ? `hat-trick de ${c.topScorer}` : c.topN === 2 ? `doblete de ${c.topScorer}` : c.goals.filter((g) => !g.own).length === 1 && c.goals.length === 1 && c.topScorer ? `gol de ${c.topScorer}` : '';
/** Goleadores como clave: "goles de A, B y C" (≤3 autores) o "N goles". */
const golesClave = (c: CronicaCtx) => {
  const g = gancho(c); if (g) return g;
  const autores = [...new Set(c.goals.filter((x) => !x.own).map((x) => x.player))];
  return autores.length === 0 ? '' : autores.length <= 3 ? `goles de ${prose(autores)}` : `${c.goals.length} goles`;
};
/**
 * Gol decisivo: el que puso al ganador por delante sin volver a perder la
 * ventaja (no el último). Recorre el marcador gol a gol.
 */
const golDecisivo = (c: CronicaCtx): Goal | undefined => {
  const w = winner(c); if (!w) return undefined;
  let h = 0, a = 0, cand: Goal | undefined;
  for (const g of c.goals) {
    if (g.team === c.home.name) h++; else if (g.team === c.away.name) a++; else continue;
    const lead = w === c.home ? h - a : a - h;
    if (lead === 1 && (w === c.home ? g.team === c.home.name : g.team === c.away.name)) cand = g; // se pone por delante
    if (lead <= 0) cand = undefined; // perdió la ventaja: se reinicia
  }
  return cand;
};
const canalTxt = (c: CronicaCtx) => (c.channels.length ? ` Se emitió en ${prose(c.channels.slice(0, 2))}.` : '');
const fichaLink = (c: CronicaCtx) => `Alineaciones, momentos clave, estadísticas completas y la narración minuto a minuto, en la [ficha del partido](${c.fichaPath}).`;

export type Rendered = { title: string; entity: string; summary: string; body: string };

export function renderCronica(reg: Register, c: CronicaCtx, rnd: () => number): Rendered {
  const w = winner(c), l = loser(c), g = gancho(c), sc = score(c);
  const vs = w ? `${w.name} ${wsc(c)} ${l!.name}` : `${c.home.name} ${sc} ${c.away.name}`;

  if (reg === 'marca') {
    const cons = w?.rank ? (w.rank === 1 ? 'y sigue líder' : `y es ${ord(w.rank)}`) : '';
    const title = w
      ? `${w.name} ${c.hs > c.as ? 'gana' : 'gana fuera'} ${wsc(c)} a ${l!.name} ${cons || `en ${c.compShort}`}`.replace(/\s+/g, ' ')
      : `${c.home.name} y ${c.away.name} empatan ${sc} en ${c.compShort}${g ? `, con ${g}` : ''}`;
    const summary = w
      ? `${w.name} suma tres puntos ante ${l!.name} (${wsc(c)}) en ${c.comp}${w.rank ? ` y es ${ord(w.rank)}${w.points ? ` con ${w.points} puntos` : ''}` : ''}${l!.rank ? `; ${l!.name} se queda ${ord(l!.rank)}` : ''}.`
      : `${c.home.name} y ${c.away.name} reparten puntos (${sc}) en ${c.comp}.${c.home.rank && c.away.rank ? ` ${c.home.name} es ${ord(c.home.rank)} y ${c.away.name}, ${ord(c.away.rank)}.` : ''}`;
    const body = [
      `${w ? `${w.name} se impuso ${wsc(c)} a ${l!.name}` : `${c.home.name} y ${c.away.name} empataron ${sc}`} en ${c.comp}${g ? `, con ${g}` : ''}.${canalTxt(c)}`,
      `## Los goles\n\n${golesTxt(c, rnd)}${c.reds.length ? ` ${c.reds.length === 1 ? 'Expulsado' : 'Expulsados'}: ${prose(c.reds)}.` : ''}`,
      `## La tabla\n\n${tablaTxt(c)}`,
      `## Lo que viene\n\n${vieneTxt(c) || 'El calendario completo está en la página de la competición.'} ${fichaLink(c)}`,
    ].join('\n\n');
    return { title, entity: w?.name ?? c.home.name, summary, body };
  }

  if (reg === 'as') {
    const title = w
      ? `${w.name} se impone a ${l!.name} (${wsc(c)})${g ? ` con ${g}` : ''} en ${c.compShort}`
      : `${c.home.name} y ${c.away.name} firman tablas (${sc}) en ${c.compShort}`;
    const quien = c.topScorer ? `${c.topScorer} ${c.topN > 1 ? `marcó ${c.topN}` : 'marcó'}` : '';
    const falta = l && c.shots && c.onTarget ? `${l.name} remató ${l === c.home ? c.shots[0] : c.shots[1]} veces (${l === c.home ? c.onTarget[0] : c.onTarget[1]} a puerta)` : '';
    const summary = [quien, falta].filter(Boolean).join('; ') ? `${[quien, falta].filter(Boolean).join('; ')} en el ${vs} de ${c.comp}.` : `${vs} en ${c.comp}: resultado, goles y datos.`;
    const body = [
      `${llegabanTxt(c)} ${w ? `Acabó ganando ${w.name} ${wsc(c)}` : `Acabó ${sc}`}${g ? `, con ${g}` : ''}. ${golesTxt(c, rnd)}`.trim(),
      `## En cifras\n\n${cifrasTxt(c, rnd) || 'Las estadísticas completas están en la ficha del partido.'}${canalTxt(c)}`,
      `## La clasificación\n\n${tablaTxt(c)}`,
      `${fichaTxt(c)} ${fichaLink(c)}`.trim(),
    ].join('\n\n');
    return { title, entity: w?.name ?? c.home.name, summary, body };
  }

  if (reg === 'athletic') {
    const claves = [
      golesClave(c),
      w?.rank ? `${w.name} ${ord(w.rank)}` : c.home.rank ? `${c.home.name} ${ord(c.home.rank)}` : '',
      c.possession ? `posesión del ${c.possession[0]} % para ${c.home.name}` : c.onTarget ? `${c.onTarget[0]}+${c.onTarget[1]} tiros a puerta` : '',
    ].filter(Boolean).slice(0, 3);
    // ≤110 caracteres (T2): se van quitando claves por la cola; si aun así no
    // cabe, los goleadores pasan a "N goles".
    const mk = (ks: string[]) => `${c.home.name} ${c.hs} ${c.away.name} ${c.as}: ${prose(ks) || c.comp}`;
    let title = mk(claves);
    for (let n = claves.length - 1; title.length > 110 && n >= 1; n--) title = mk(claves.slice(0, n));
    if (title.length > 110) title = mk([c.goals.length ? `${c.goals.length} goles` : c.compShort]);
    const decisive = golDecisivo(c);
    const last = [...c.goals].reverse().find((x) => !x.own);
    const lead = w
      ? decisive
        ? `${decisive.own ? `Un gol en propia puerta en el ${decisive.minute}` : `${decisive.player} marcó en el ${decisive.minute} el gol que`} puso por delante a ${w.name}, que ya no soltó la ventaja: ${wsc(c)} final ante ${l!.name} en ${c.comp}.`
        : `${w.name} se llevó el partido ${wsc(c)} ante ${l!.name} en ${c.comp}.`
      : `${c.home.name} y ${c.away.name} empataron ${sc} en ${c.comp}${last ? `; el último gol fue de ${last.player} en el ${last.minute}` : ''}.`;
    const sub1 = c.topScorer ? `${c.topScorer} decidió${c.topN > 1 ? ` con ${c.topN} goles` : ''}` : 'Cómo se decidió';
    const sub2 = l && c.possession && Number(l === c.home ? c.possession[0] : c.possession[1]) > 50 ? `${l.name} tuvo el balón, no el gol` : 'Los números del partido';
    const body = [
      lead,
      `## ${sub1}\n\n${golesTxt(c, rnd)}${c.reds.length ? ` Expulsados: ${prose(c.reds)}.` : ''}`,
      `## ${sub2}\n\n${cifrasTxt(c, rnd) || 'Estadísticas completas en la ficha.'}${canalTxt(c)}`,
      `## Qué cambia en la tabla\n\n${tablaTxt(c)}`,
      `## Qué viene ahora\n\n${vieneTxt(c) || 'Próximos partidos en la página de la competición.'} ${fichaLink(c)}`,
    ].join('\n\n');
    return { title, entity: c.home.name, summary: `${lead} ${claves.length ? `Claves: ${prose(claves)}.` : ''}`.trim(), body };
  }

  // goal
  const prota = c.topScorer && w && !c.goals.find((x) => x.player === c.topScorer && x.own) ? c.topScorer : null;
  const title = prota
    ? `${prota} guía a ${w!.name} ante ${l!.name} (${wsc(c)})${w!.rank ? ` y lo deja ${ord(w!.rank)} en ${c.compShort}` : ` en ${c.compShort}`}`
    : w
      ? `${w.name} supera a ${l!.name} (${wsc(c)})${w.rank ? ` y es ${ord(w.rank)} en ${c.compShort}` : ` en ${c.compShort}`}`
      : `${c.home.name} y ${c.away.name} empatan ${sc}${c.home.rank ? `; ${c.home.name} sigue ${ord(c.home.rank)} en ${c.compShort}` : ` en ${c.compShort}`}`;
  const dato = c.possession && c.shots ? `${c.home.name} ${c.possession[0]} % de posesión y ${c.shots[0]} remates; ${c.away.name} ${c.possession[1]} % y ${c.shots[1]}.` : c.onTarget ? `Tiros a puerta: ${c.onTarget[0]} por ${c.onTarget[1]}.` : '';
  const body = [
    `## Resumen\n\n${w ? `${w.name} ganó ${wsc(c)} a ${l!.name}` : `${c.home.name} y ${c.away.name} empataron ${sc}`} en ${c.comp}${g ? `, con ${g}` : ''}.${canalTxt(c)}`,
    `## Los goles\n\n${c.goals.length ? c.goals.map((x) => `- ${x.minute} · ${x.player} (${x.team}${x.own ? ', p.p.' : x.pen ? ', penalti' : ''})`).join('\n') : 'Sin goles.'}`,
    `## El dato\n\n${dato || tablaTxt(c)}`,
    `## Lo que viene\n\n${vieneTxt(c) || tablaTxt(c)}`,
    `**Lee también:** la [ficha del partido](${c.fichaPath}) con alineaciones y narración · la [clasificación de ${c.compShort}](${c.compPath}) · [partidos de hoy](/partidos-hoy).`,
  ].join('\n\n');
  return { title, entity: prota ?? w?.name ?? c.home.name, summary: `${w ? `${w.name} ${wsc(c)} ${l!.name}` : `${c.home.name} ${sc} ${c.away.name}`} en ${c.comp}${prota ? `: ${prota} marcó${c.topN > 1 ? ` ${c.topN}` : ''}` : ''}. ${dato}`.trim(), body };
}

/** Previa (patrón Marca de servicio): P1 factual, "cómo llegan", "dónde ver". */
export function renderPrevia(c: { home: Side; away: Side; comp: string; compShort: string; compPath: string; fichaPath: string; date: Date; venue?: string; channels: string[] }, rnd: () => number): Rendered {
  const dia = fmtDayLong(c.date), hora = fmtTime(c.date);
  const p1 = pick(rnd, [
    `${c.home.name} y ${c.away.name} se enfrentan este ${dia} a las ${hora} h${c.venue ? ` en ${c.venue}` : ''}, en partido de ${c.comp}.`,
    `${c.home.name} recibe a ${c.away.name} este ${dia} (${hora} h${c.venue ? `, ${c.venue}` : ''}) en ${c.comp}.`,
    `Cita de ${c.comp} este ${dia}: ${c.home.name} - ${c.away.name}, a las ${hora} h${c.venue ? ` en ${c.venue}` : ''}.`,
  ]);
  const llega = (s: Side) => `${s.name} llega${s.last ? ` ${s.last}` : ''}${s.rank ? ` y ocupa la ${ord(s.rank)} plaza${s.points ? ` con ${s.points} puntos` : ''}${s.record ? ` (${s.record})` : ''}` : ''}.`;
  const body = [
    p1,
    `## Cómo llegan\n\n${llega(c.home)} ${llega(c.away)} La [clasificación de ${c.compShort}](${c.compPath}), al día.`,
    `## Dónde ver el partido\n\n${c.channels.length ? `Se emite en **${prose(c.channels.slice(0, 3))}**.` : 'Canal por confirmar; se actualiza en la ficha del partido.'} Alineaciones en cuanto se confirmen, marcador en directo y narración en la [ficha del ${c.home.name} - ${c.away.name}](${c.fichaPath}). El resto de la jornada, en [partidos de hoy](/partidos-hoy).`,
  ].join('\n\n');
  const title = `${c.home.name} - ${c.away.name}: horario, dónde ver y cómo llegan al partido de ${c.compShort}`;
  return { title, entity: c.home.name, summary: `${p1} ${c.home.rank && c.away.rank ? `${c.home.name} es ${ord(c.home.rank)} y ${c.away.name}, ${ord(c.away.rank)}.` : ''} ${c.channels.length ? `TV: ${prose(c.channels.slice(0, 2))}.` : ''}`.replace(/\s+/g, ' ').trim(), body };
}

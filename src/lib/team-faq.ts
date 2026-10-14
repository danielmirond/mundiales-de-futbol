import { teamWorldCupRecord, bestWorldCupStage, worldCupFinals } from './wc-head-to-head';

export type Faq = { q: string; a: string };

const yearsEs = (ys: string[]) => (ys.length <= 1 ? ys.join('') : `${ys.slice(0, -1).join(', ')} y ${ys[ys.length - 1]}`);
const REACHED: Record<string, string> = {
  third: 'terminó tercera', fourth: 'terminó cuarta', final: 'fue subcampeona', final_group: 'jugó la liguilla final',
  sf: 'llegó a las semifinales', qf: 'llegó a los cuartos de final', r16: 'llegó a los octavos de final',
  r32: 'llegó a los dieciseisavos de final', group2: 'llegó a la segunda fase',
};
const bestSentence = (b: { stage: string; year: string }) =>
  REACHED[b.stage] ? ` Su mejor resultado fue en ${b.year}, cuando ${REACHED[b.stage]}.` : ' Nunca ha pasado de la fase de grupos.';
const n = (x: number, one: string, many: string) => `${x} ${x === 1 ? one : many}`;

/**
 * Preguntas frecuentes de una selección en los Mundiales (incluye 2026).
 * La primera frase de cada respuesta contesta la pregunta tal cual, para que
 * pueda salir como fragmento destacado; el detalle va detrás.
 */
export function teamWorldCupFaq(name: string, codes: string[]): Faq[] {
  const r = teamWorldCupRecord(codes);
  const best = bestWorldCupStage(codes);
  const { won, lost } = worldCupFinals(codes);
  const out: Faq[] = [];
  if (won.length > 0) {
    out.push({ q: `¿Cuántos Mundiales ha ganado ${name}?`, a: `${name} ha ganado ${n(won.length, 'Mundial', 'Mundiales')}: ${yearsEs(won)}.${lost.length ? ` Además, fue subcampeona en ${yearsEs(lost)}.` : ''}` });
  } else {
    out.push({ q: `¿Ha ganado ${name} algún Mundial?`, a: `No, ${name} no ha ganado ningún Mundial.${lost.length ? ` Perdió la final en ${yearsEs(lost)}.` : best ? bestSentence(best) : ''}` });
  }
  if (r.wcCount > 0) {
    out.push({ q: `¿Cuántos Mundiales ha jugado ${name}?`, a: `${name} ha jugado ${n(r.wcCount, 'Mundial', 'Mundiales')}, con ${n(r.played, 'partido', 'partidos')}: ${n(r.wins, 'victoria', 'victorias')}, ${n(r.draws, 'empate', 'empates')} y ${n(r.losses, 'derrota', 'derrotas')}.` });
  }
  if (best && won.length > 0) {
    out.push({ q: `¿Cuál es el mejor resultado de ${name} en un Mundial?`, a: `El mejor resultado de ${name} es campeona del mundo, en ${yearsEs(won)}.` });
  }
  if (r.played > 0) {
    const diff = r.goalsFor - r.goalsAgainst;
    out.push({ q: `¿Cuántos goles ha marcado ${name} en los Mundiales?`, a: `${name} ha marcado ${n(r.goalsFor, 'gol', 'goles')} y ha encajado ${r.goalsAgainst} en los Mundiales, con una diferencia de ${diff > 0 ? '+' : ''}${diff}.` });
  }
  return out;
}

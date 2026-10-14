import { teamWorldCupRecord, bestWorldCupStage, worldCupFinals } from './wc-head-to-head';

export type Faq = { q: string; a: string };

const yearsEs = (ys: string[]) => (ys.length <= 1 ? ys.join('') : `${ys.slice(0, -1).join(', ')} y ${ys[ys.length - 1]}`);
const ARTICLE: Record<string, string> = { third: 'el tercer puesto', fourth: 'el cuarto puesto', final: 'el subcampeonato', sf: 'las semifinales', qf: 'los cuartos de final', r16: 'los octavos de final', r32: 'los dieciseisavos de final' };
const bestEs = (b: { stage: string; label: string }) => ARTICLE[b.stage] ?? `la ${b.label.toLowerCase()}`;
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
    out.push({ q: `¿Ha ganado ${name} algún Mundial?`, a: `No, ${name} no ha ganado ningún Mundial.${best ? ` Su mejor resultado es ${bestEs(best)}, en ${best.year}.` : ''}${lost.length ? ` Jugó la final en ${yearsEs(lost)}.` : ''}` });
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

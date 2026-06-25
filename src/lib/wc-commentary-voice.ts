/**
 * Voz editorial del directo: reescribe la narración neutra de ESPN al tono de
 * un redactor especialista en Mundiales, SIN llamar a ninguna API (determinista).
 *
 * Funciona con un BANCO DE FRASES por tipo de jugada (gol, falta, córner,
 * tarjeta, cambio, fuera de juego, parada, saque…). A partir de la línea de
 * ESPN se detecta el tipo y se extraen las entidades (jugador, equipo) y se
 * re-renderiza con una variante del banco, alternando para no sonar a plantilla.
 *
 * El banco se "alimenta" con narraciones reales de redacción (ver TODO abajo).
 * Mientras el banco no cubra un tipo, se devuelve el texto original (la línea
 * neutra de ESPN), así el directo nunca se degrada.
 */
import type { CommentaryLine } from './wc-2026-match-summary';

// ─────────────────────────────────────────────────────────────────────────
// TODO(voz): banco de frases por tipo de jugada, derivado de las ~50
// narraciones de redacción. Cada tipo tendrá varias variantes con huecos
// {jugador} / {equipo} / {rival} para alternar. De momento, vacío → passthrough.
// ─────────────────────────────────────────────────────────────────────────

/**
 * Adapta la narración. Hoy es passthrough determinista (devuelve el original);
 * cuando esté cargado el banco de frases reescribirá línea a línea localmente,
 * sin coste ni dependencias externas.
 */
export async function enrichCommentary(
  _eventId: string,
  _homeName: string,
  _awayName: string,
  lines: CommentaryLine[],
): Promise<CommentaryLine[]> {
  return lines;
}

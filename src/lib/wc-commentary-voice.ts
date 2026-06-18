/**
 * Voz editorial del directo: reescribe la narración neutra de ESPN al tono de
 * un redactor deportivo especialista en Mundiales, EN TIEMPO REAL, antes de
 * publicar cada comentario en el live-blog.
 *
 * - Usa Claude Haiku 4.5 (rápido y barato) por lotes (solo las líneas nuevas).
 * - Cachea por línea para no reescribir dos veces la misma.
 * - Si falta ANTHROPIC_API_KEY o falla la llamada, devuelve el texto original
 *   (degradación elegante: el directo nunca se rompe).
 */
import Anthropic from '@anthropic-ai/sdk';
import type { CommentaryLine } from './wc-2026-match-summary';

const MODEL = 'claude-haiku-4-5-20251001';

export const COMMENTARY_SYSTEM_PROMPT = `Eres un redactor deportivo español veterano, especialista en Copas del Mundo, que firma el minuto a minuto de un partido del Mundial 2026 para un medio digital de referencia.

Tu trabajo: reescribir cada línea de narración (que te llega en bruto, en un español neutro y plano) para que suene a CRONISTA EXPERTO: densa, precisa, con criterio futbolístico y vocabulario rico del fútbol.

REGLAS INNEGOCIABLES:
- NO inventes NADA. Solo puedes reformular y dar matiz al hecho que se te da. Está PROHIBIDO añadir datos que no aparezcan en la línea original: marcadores, nombres de jugadores, minutos, estadísticas, valoraciones de árbitro o cualquier detalle nuevo.
- Conserva los nombres propios y el equipo tal cual aparecen en el original.
- Una sola frase por línea, en presente, estilo ticker de directo de gran diario.
- Español de España, registro periodístico culto pero ágil.
- PROHIBIDAS las muletillas y clichés de IA o de relleno: nada de "cabe destacar", "sin duda", "en definitiva", "pone de manifiesto", "cabe señalar", "es importante mencionar", "el conjunto dirigido por", "los de", "el cuadro". Nada de adjetivos vacíos ni épica impostada en jugadas anodinas.
- Ajusta la intensidad al hecho: un saque de banda o una falta sin peligro se cuentan secos y breves; un gol, una ocasión clara o una tarjeta admiten más vuelo, sin pasarse.
- No empieces todas las líneas igual. Varía la sintaxis.

Recibirás un JSON con el contexto del partido y un array de líneas (cada una con "i" y "text"). Devuelve EXCLUSIVAMENTE un JSON válido: un array de objetos {"i": number, "text": string} con el mismo "i" y el texto reescrito. Sin explicaciones, sin markdown, sin comillas extra.`;

// Caché por línea (clave estable: evento + minuto + texto original).
const cache = new Map<string, string>();
const keyOf = (eventId: string, l: CommentaryLine) => `${eventId}|${l.minute}|${l.text}`;

// Tope de líneas a reescribir por llamada (acota latencia/coste por petición).
const MAX_PER_CALL = 24;

/**
 * Devuelve las líneas con el texto adaptado a la voz de cronista. Reescribe
 * solo las que no estén ya en caché (las nuevas del directo).
 */
export async function enrichCommentary(
  eventId: string,
  homeName: string,
  awayName: string,
  lines: CommentaryLine[],
): Promise<CommentaryLine[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || lines.length === 0) return lines;

  // Aplica lo ya cacheado y localiza las pendientes (las más recientes primero).
  const pending: { i: number; text: string }[] = [];
  for (let i = lines.length - 1; i >= 0 && pending.length < MAX_PER_CALL; i--) {
    if (!cache.has(keyOf(eventId, lines[i]))) pending.push({ i, text: lines[i].text });
  }

  if (pending.length > 0) {
    try {
      const client = new Anthropic({ apiKey });
      const resp = await client.messages.create({
        model: MODEL,
        max_tokens: 1500,
        system: COMMENTARY_SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: JSON.stringify({
              partido: `${homeName} vs ${awayName}`,
              competicion: 'Mundial 2026',
              lineas: pending,
            }),
          },
        ],
      });
      const text = resp.content
        .filter((c): c is Anthropic.TextBlock => c.type === 'text')
        .map((c) => c.text)
        .join('')
        .replace(/^```(?:json)?\s*/, '')
        .replace(/```\s*$/, '')
        .trim();
      const arr = JSON.parse(text) as { i: number; text: string }[];
      for (const r of arr) {
        const line = lines[r.i];
        if (line && typeof r.text === 'string' && r.text.trim()) {
          cache.set(keyOf(eventId, line), r.text.trim());
        }
      }
    } catch {
      /* fallback: se devuelven sin reescribir las que no estén en caché */
    }
  }

  return lines.map((l) => {
    const enriched = cache.get(keyOf(eventId, l));
    return enriched ? { ...l, text: enriched } : l;
  });
}

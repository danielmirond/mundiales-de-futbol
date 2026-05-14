/**
 * Llama a Claude API para convertir un `ScoredItem` (item RSS) en un
 * `GeneratedNews` con la estructura editorial de `news.ts`.
 *
 * Reglas críticas del prompt:
 *  - Idioma de salida: ESPAÑOL siempre, aunque el origen sea EN/PT/FR.
 *  - NO traducir literal el lead del medio. Reescribir con contexto.
 *  - summary: 40-60 palabras
 *  - body: 250-450 palabras en 4-6 párrafos
 *  - Categorías permitidas: panini, convocatorias, sedes, entradas, jugadores,
 *    mascotas, ceremonia, polemica, tv, patrocinios, general
 *  - slug: kebab-case, ≤80 chars
 *  - Atribución obligatoria a sourceName + sourceUrl
 *
 * Requiere ANTHROPIC_API_KEY en el entorno.
 */

import Anthropic from '@anthropic-ai/sdk';
import type { ScoredItem, GeneratedNews, NewsCategory } from './types';

const CATEGORIES: NewsCategory[] = [
  'panini', 'convocatorias', 'sedes', 'entradas', 'jugadores',
  'mascotas', 'ceremonia', 'polemica', 'tv', 'patrocinios', 'general',
];

function normLang(l: string): 'es' | 'en' | 'pt' | 'fr' {
  if (l === 'es' || l === 'en' || l === 'pt' || l === 'fr') return l;
  return 'en';
}

const SYSTEM_PROMPT = `Eres editor de un sitio editorial sobre el Mundial de Fútbol (mundiales-de-futbol.com), enfocado en SEO y voz periodística sobria con datos verificados.

Tu tarea: convertir un artículo de un medio internacional (RSS feed) en una noticia editorial propia en ESPAÑOL para el sitio.

Reglas de redacción:
- IDIOMA: español de España, claro y directo. No reescribir literal: ofrece valor añadido (contexto, dato, opinión sutil).
- summary: 40-60 palabras. Frase nucleo del qué + por qué importa para el aficionado.
- body: 250-450 palabras, 4-6 párrafos separados por \\n\\n. NO copiar oraciones literales del feed. Aporta contexto histórico / numérico / editorial.
- Si la noticia menciona una selección, sede o producto, enlaza a la página interna correspondiente con markdown link: [texto](/ruta).
  Rutas habituales:
    /2026/hospitality, /2026/hospitality/sedes/<citySlug>, /2026/hospitality/selecciones/<TEAM>
    /2026/sedes/<citySlug>
    /coleccionismo/panini-mundial-2026, /coleccionismo/camisetas-mundial-2026
    /selecciones/<TEAM>/camisetas
    /2026/normas-estadios
  Si no estás 100% seguro de la ruta exacta, NO inventes: omite el link.
- Atribución: NO citar más de 1 frase del medio original (≤15 palabras). Si quieres citar, ponlo entre comillas.

Categorías permitidas (elige UNA):
${CATEGORIES.map((c) => `  - ${c}`).join('\\n')}

slug: kebab-case, ≤80 chars, sin acentos, descriptivo del contenido.

OUTPUT: devuelve EXCLUSIVAMENTE un JSON válido con esta forma exacta, sin markdown wrapper:
{
  "slug": "string",
  "title": "string (≤120 chars)",
  "summary": "string (40-60 palabras)",
  "body": "string (250-450 palabras, párrafos separados por \\\\n\\\\n)",
  "category": "una-de-las-permitidas"
}

Si NO consideras la noticia relevante para el Mundial 2026 (es de otro torneo, sub-20, femenino, transferencias de club sin contexto Mundial), devuelve:
{ "skip": true, "reason": "string breve" }`;

function userPrompt(item: ScoredItem): string {
  return `Fuente: ${item.feedName} (${item.feedLang})
Título original: ${item.title}
URL: ${item.link}
Publicado: ${item.pubDate}
Lead/snippet: ${item.contentSnippet ?? '(sin lead disponible)'}
${item.content ? `Cuerpo (puede estar truncado):\n${item.content.slice(0, 2000)}` : ''}

Coincidencias detectadas:
  Selecciones: ${item.matches.teams.join(', ') || '—'}
  Sedes: ${item.matches.venues.join(', ') || '—'}
  Productos: ${item.matches.products.join(', ') || '—'}

Score: ${item.score}

Genera el JSON.`;
}

export async function generateNewsItem(item: ScoredItem): Promise<GeneratedNews | { skip: true; reason: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('Falta ANTHROPIC_API_KEY');

  const client = new Anthropic({ apiKey });
  const resp = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt(item) }],
  });

  const text = resp.content
    .filter((c): c is Anthropic.TextBlock => c.type === 'text')
    .map((c) => c.text)
    .join('\n')
    .trim();

  // Limpia posibles fences ```json
  const cleaned = text.replace(/^```(?:json)?\s*/, '').replace(/```\s*$/, '').trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`Respuesta no es JSON válido: ${cleaned.slice(0, 200)}`);
  }

  if (typeof parsed === 'object' && parsed && 'skip' in parsed && (parsed as { skip: boolean }).skip) {
    return parsed as { skip: true; reason: string };
  }

  const p = parsed as Partial<GeneratedNews>;
  if (!p.slug || !p.title || !p.summary || !p.body || !p.category) {
    throw new Error(`Campos faltantes: ${JSON.stringify(parsed)}`);
  }
  if (!CATEGORIES.includes(p.category as NewsCategory)) {
    throw new Error(`Categoría inválida: ${p.category}`);
  }

  return {
    slug: p.slug,
    title: p.title,
    summary: p.summary,
    body: p.body,
    category: p.category as NewsCategory,
    sourceName: item.feedName,
    sourceUrl: item.link,
    sourceLang: normLang(item.feedLang),
    publishedAt: item.pubDate,
  };
}

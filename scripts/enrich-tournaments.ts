/**
 * Enrich the 22 tournament rows with bilingual mottos + editorial notes
 * extracted from the brand-kit `data.js` prototype.
 *
 *   tagline_i18n  ← motto (short punchy line, per locale)
 *   summary_i18n  ← note (contextual one-liner, per locale)
 *
 * Usage: npx tsx scripts/enrich-tournaments.ts
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const envFile = resolve(process.cwd(), '.env.local');
try {
  const content = readFileSync(envFile, 'utf8');
  for (const line of content.split('\n')) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*"?(.*?)"?\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

type Entry = {
  year: number;
  motto_es: string;
  motto_en: string;
  note_es: string;
  note_en: string;
};

const ENTRIES: Entry[] = [
  { year: 1930, motto_es: 'La primera final', motto_en: 'The first final', note_es: 'Nace el torneo. Centenario repleto.', note_en: "The tournament is born. Centenario packed." },
  { year: 1934, motto_es: 'Eliminación directa', motto_en: 'Knockout, from day one', note_es: 'Primer título europeo.', note_en: 'First European title.' },
  { year: 1938, motto_es: 'Bicampeón en guerra', motto_en: "Back-to-back, on war's edge", note_es: 'Última edición antes del paréntesis bélico.', note_en: 'The last tournament before the war hiatus.' },
  { year: 1950, motto_es: 'Maracanazo', motto_en: 'Maracanazo', note_es: 'El silencio en el Maracaná.', note_en: 'Silence at the Maracanã.' },
  { year: 1954, motto_es: 'El milagro de Berna', motto_en: 'The Miracle of Bern', note_es: 'La media gol por partido más alta de la historia.', note_en: 'Highest goals-per-match on record.' },
  { year: 1958, motto_es: 'Debut de un prodigio', motto_en: 'A prodigy debuts', note_es: 'Un chico de 17 años anota en la final.', note_en: 'A 17-year-old scores in the final.' },
  { year: 1962, motto_es: 'Doblete sudamericano', motto_en: 'Back-to-back for Brazil', note_es: 'Seis goleadores empatados en la cima.', note_en: 'Six players tied atop the scoring chart.' },
  { year: 1966, motto_es: 'El único título inglés', motto_en: "England's only title", note_es: 'Un hat-trick en la final.', note_en: 'A hat-trick in the final.' },
  { year: 1970, motto_es: 'Tricampeón, Jules Rimet queda', motto_en: 'Three-time champs, Jules Rimet stays', note_es: 'La primera Copa a color.', note_en: 'First World Cup broadcast in color.' },
  { year: 1974, motto_es: 'Fútbol total vs. eficiencia', motto_en: 'Total Football vs. efficiency', note_es: 'Estreno del trofeo FIFA actual.', note_en: 'Debut of the modern FIFA trophy.' },
  { year: 1978, motto_es: 'Papelitos en el Monumental', motto_en: 'Confetti at the Monumental', note_es: 'Primer título para la albiceleste.', note_en: 'First title for Argentina.' },
  { year: 1982, motto_es: 'Torneo ampliado a 24', motto_en: 'Expanded to 24 teams', note_es: 'Italia vuelve a ser campeona 44 años después.', note_en: 'Italy champion again after 44 years.' },
  { year: 1986, motto_es: 'El torneo de los dos goles', motto_en: 'The tournament of two goals', note_es: 'Un cuarto de final inolvidable.', note_en: 'An unforgettable quarter-final.' },
  { year: 1990, motto_es: 'Notti magiche', motto_en: 'Magic nights', note_es: 'Mínimo histórico de goles por partido.', note_en: 'Record-low goals per match.' },
  { year: 1994, motto_es: 'La final por penales', motto_en: 'The first final on penalties', note_es: 'Récord de asistencia total.', note_en: 'Highest-ever total attendance.' },
  { year: 1998, motto_es: 'Primer título local en 20 años', motto_en: 'First home title in 20 years', note_es: 'Se amplía a 32 selecciones.', note_en: 'Expanded to 32 teams.' },
  { year: 2002, motto_es: 'Primera sede asiática', motto_en: 'First Asian host', note_es: 'Dos países organizan por primera vez.', note_en: 'First joint-hosted tournament.' },
  { year: 2006, motto_es: 'Una última jugada', motto_en: 'One last play', note_es: 'La final se define en penales.', note_en: 'Final decided on penalties.' },
  { year: 2010, motto_es: 'Primera Copa africana', motto_en: 'First African World Cup', note_es: 'España, debut en la cima.', note_en: 'Spain, a first-time champion.' },
  { year: 2014, motto_es: 'Marcada por una semi', motto_en: 'Defined by one semi', note_es: 'Una semifinal entra a la historia.', note_en: 'A semifinal enters the record books.' },
  { year: 2018, motto_es: 'VAR se estrena', motto_en: 'VAR makes its debut', note_es: 'Debut de la asistencia por video.', note_en: 'Video review debuts.' },
  { year: 2022, motto_es: 'La final más bonita de la historia', motto_en: 'The most beautiful final ever', note_es: 'La Scaloneta hizo historia en Lusail.', note_en: 'La Scaloneta made history at Lusail.' },
  { year: 2026, motto_es: '48 selecciones, 3 países', motto_en: '48 teams, 3 countries', note_es: 'Primera edición a 48 equipos.', note_en: 'First-ever 48-team tournament.' },
];

async function main() {
  console.log(`Enriching ${ENTRIES.length} tournaments with bilingual mottos + notes…`);
  for (const e of ENTRIES) {
    const { error } = await supabase
      .from('tournaments')
      .update({
        tagline_i18n: { es: e.motto_es, en: e.motto_en },
        summary_i18n: { es: e.note_es, en: e.note_en },
      })
      .eq('year', e.year);
    if (error) {
      console.error(`  ✗ ${e.year}: ${error.message}`);
    }
  }
  console.log('✓ Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

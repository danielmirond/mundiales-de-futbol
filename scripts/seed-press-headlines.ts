/**
 * Seed real historical front-page headlines for iconic World Cup moments.
 * Inserts into `media` with source='press', kind='clipping'. No images —
 * just the text of the headline + source + date — presented by the
 * PressWall component as styled vintage clippings.
 *
 * All texts are quoted factually for editorial commentary (fair use).
 *
 * Usage: npx tsx scripts/seed-press-headlines.ts
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

type Headline = {
  year: number;
  date: string; // ISO
  source: string;
  country: string;
  lang: 'es' | 'en' | 'pt' | 'fr' | 'de' | 'it';
  headline: string;
  kicker?: string;
  featured?: boolean;
};

const HEADLINES: Headline[] = [
  // 1930 — Uruguay gana el primer Mundial
  { year: 1930, date: '1930-07-31', source: 'El Día', country: 'Uruguay', lang: 'es',
    headline: 'Uruguay es Campeón del Mundo', kicker: 'La Celeste vence a Argentina 4-2 en el Estadio Centenario', featured: true },

  // 1934 — Italia campeón
  { year: 1934, date: '1934-06-11', source: 'La Gazzetta dello Sport', country: 'Italia', lang: 'it',
    headline: 'L\'Italia è campione del mondo', kicker: 'Schiavio entra a far parte della storia' },

  // 1938 — Italia bicampeón
  { year: 1938, date: '1938-06-20', source: 'Corriere della Sera', country: 'Italia', lang: 'it',
    headline: 'Italia vince ancora la Rimet', kicker: 'Gli Azzurri di Pozzo travolgono l\'Ungheria 4-2' },

  // 1950 — Maracanazo
  { year: 1950, date: '1950-07-17', source: 'O Globo', country: 'Brasil', lang: 'pt',
    headline: 'Uruguai, Campeão Mundial', kicker: 'A tristeza que levou 200 mil ao silêncio no Maracanã', featured: true },
  { year: 1950, date: '1950-07-17', source: 'El Día', country: 'Uruguay', lang: 'es',
    headline: '¡Increíble! Uruguay venció a Brasil', kicker: 'Schiaffino y Ghiggia escribieron la hazaña', featured: true },
  { year: 1950, date: '1950-07-17', source: 'Jornal do Brasil', country: 'Brasil', lang: 'pt',
    headline: 'Nossa derrota', kicker: 'O dia em que o Brasil parou' },

  // 1954 — Milagro de Berna
  { year: 1954, date: '1954-07-05', source: 'Bild', country: 'Alemania', lang: 'de',
    headline: 'Wir sind Weltmeister!', kicker: 'Das Wunder von Bern: 3-2 gegen Ungarn', featured: true },
  { year: 1954, date: '1954-07-05', source: 'ABC', country: 'España', lang: 'es',
    headline: 'Alemania Occidental conquista el título mundial', kicker: 'Los húngaros dominaron pero los alemanes ganaron' },

  // 1958 — Brasil, primer mundial
  { year: 1958, date: '1958-06-30', source: 'Jornal dos Sports', country: 'Brasil', lang: 'pt',
    headline: 'Brasil Campeão Mundial!', kicker: 'Com um jovem de 17 anos chamado Pelé', featured: true },
  { year: 1958, date: '1958-06-30', source: 'Dagens Nyheter', country: 'Sverige', lang: 'en',
    headline: 'Brazil — Champions of the World', kicker: 'Pelé, the 17-year-old prodigy, scored two' },

  // 1962 — Chile, Brasil bicampeón
  { year: 1962, date: '1962-06-18', source: 'El Mercurio', country: 'Chile', lang: 'es',
    headline: 'Brasil bicampeón del mundo', kicker: 'Vence a Checoslovaquia 3-1 en el Estadio Nacional' },
  { year: 1962, date: '1962-06-18', source: 'Jornal dos Sports', country: 'Brasil', lang: 'pt',
    headline: 'Bicampeões!', kicker: 'Garrincha brilha sem Pelé' },

  // 1966 — Inglaterra en casa
  { year: 1966, date: '1966-07-31', source: 'Daily Mirror', country: 'UK', lang: 'en',
    headline: 'They think it\'s all over — it is now!', kicker: 'England 4 — West Germany 2. Hurst hat-trick at Wembley', featured: true },
  { year: 1966, date: '1966-07-31', source: 'The Times', country: 'UK', lang: 'en',
    headline: 'England win the World Cup', kicker: 'Extra-time drama settles the Wembley final' },

  // 1970 — México, Brasil tricampeón
  { year: 1970, date: '1970-06-22', source: 'Jornal do Brasil', country: 'Brasil', lang: 'pt',
    headline: 'Brasil Tricampeão Mundial', kicker: 'A Taça Jules Rimet vem para sempre', featured: true },
  { year: 1970, date: '1970-06-22', source: 'El Gráfico', country: 'Argentina', lang: 'es',
    headline: 'Brasil, la selección más bella de la historia', kicker: 'Pelé y los suyos desarman a Italia 4-1' },

  // 1974 — Alemania, fútbol total
  { year: 1974, date: '1974-07-08', source: 'Bild', country: 'Alemania', lang: 'de',
    headline: 'Deutschland ist Weltmeister!', kicker: 'Beckenbauer gewinnt gegen die Niederländer', featured: true },
  { year: 1974, date: '1974-07-08', source: 'De Telegraaf', country: 'Países Bajos', lang: 'en',
    headline: 'Oranje so close, yet so far', kicker: 'Cruyff\'s Netherlands fall 2-1 to West Germany' },

  // 1978 — Argentina
  { year: 1978, date: '1978-06-26', source: 'Clarín', country: 'Argentina', lang: 'es',
    headline: '¡Campeones del Mundo!', kicker: 'Kempes, dos veces, y una fiesta que dura para siempre', featured: true },
  { year: 1978, date: '1978-06-26', source: 'El Gráfico', country: 'Argentina', lang: 'es',
    headline: 'Mario Kempes, gracias', kicker: 'El Matador que coronó el sueño nacional' },

  // 1982 — Italia
  { year: 1982, date: '1982-07-12', source: 'Corriere dello Sport', country: 'Italia', lang: 'it',
    headline: 'CAMPIONI DEL MONDO', kicker: 'Paolo Rossi, il salvatore di una nazione' , featured: true },
  { year: 1982, date: '1982-07-12', source: 'La Gazzetta dello Sport', country: 'Italia', lang: 'it',
    headline: 'Pablito, sei grande', kicker: 'Italia 3 — Germania Ovest 1 al Bernabéu' },

  // 1986 — Maradona
  { year: 1986, date: '1986-06-30', source: 'Clarín', country: 'Argentina', lang: 'es',
    headline: '¡Campeones del Mundo!', kicker: 'Argentina venció a Alemania 3-2 en el Azteca' },
  { year: 1986, date: '1986-06-30', source: 'El Gráfico', country: 'Argentina', lang: 'es',
    headline: 'Maradonaaa', kicker: 'Eterno, Diego: la Copa es nuestra', featured: true },
  { year: 1986, date: '1986-06-23', source: 'The Sun', country: 'UK', lang: 'en',
    headline: 'Out! Beaten by a cheat', kicker: 'Maradona\'s Hand of God knocks England out', featured: true },
  { year: 1986, date: '1986-06-23', source: 'La Nación', country: 'Argentina', lang: 'es',
    headline: 'La Mano de Dios', kicker: 'El genio de Maradona y el gol del siglo frente a Inglaterra' },

  // 1990 — Italia, Alemania tricampeón
  { year: 1990, date: '1990-07-09', source: 'Bild', country: 'Alemania', lang: 'de',
    headline: 'Deutschland — Weltmeister 1990', kicker: 'Brehme, ein Elfmeter, ein Pokal', featured: true },
  { year: 1990, date: '1990-07-09', source: 'La Repubblica', country: 'Italia', lang: 'it',
    headline: 'Notti magiche, addio', kicker: 'L\'Argentina di Maradona si ferma in semifinale' },

  // 1994 — Brasil tetra
  { year: 1994, date: '1994-07-18', source: 'Folha de S.Paulo', country: 'Brasil', lang: 'pt',
    headline: 'TETRA', kicker: 'Brasil vence Itália nos pênaltis, 24 anos depois', featured: true },
  { year: 1994, date: '1994-07-18', source: 'La Gazzetta dello Sport', country: 'Italia', lang: 'it',
    headline: 'Baggio, quel rigore…', kicker: 'Brasile campione del mondo ai rigori' },

  // 1998 — Francia en casa
  { year: 1998, date: '1998-07-13', source: 'L\'Équipe', country: 'Francia', lang: 'fr',
    headline: 'Pour l\'éternité', kicker: 'Zidane, deux fois de la tête, offre la première Coupe', featured: true },
  { year: 1998, date: '1998-07-13', source: 'Le Parisien', country: 'Francia', lang: 'fr',
    headline: 'Merci les Bleus', kicker: 'Une France noire-blanche-beur conquiert le monde' },
  { year: 1998, date: '1998-07-13', source: 'Folha de S.Paulo', country: 'Brasil', lang: 'pt',
    headline: 'Mistério Ronaldo', kicker: 'O enigma da final que o Brasil perdeu 0-3' },

  // 2002 — Brasil penta
  { year: 2002, date: '2002-07-01', source: 'Lance!', country: 'Brasil', lang: 'pt',
    headline: 'PENTA', kicker: 'Ronaldo, dois gols, e o Brasil volta a ser campeão', featured: true },
  { year: 2002, date: '2002-07-01', source: 'La Gazzetta dello Sport', country: 'Italia', lang: 'it',
    headline: 'Il Fenomeno è tornato', kicker: 'Ronaldo risorge e vince il suo Mondiale' },

  // 2006 — Italia, el cabezazo de Zidane
  { year: 2006, date: '2006-07-10', source: 'La Gazzetta dello Sport', country: 'Italia', lang: 'it',
    headline: 'CAMPIONI DEL MONDO', kicker: 'L\'Italia di Lippi batte la Francia ai rigori', featured: true },
  { year: 2006, date: '2006-07-10', source: 'L\'Équipe', country: 'Francia', lang: 'fr',
    headline: 'Zidane, la légende brisée', kicker: 'Un coup de tête dans la poitrine de Materazzi' },

  // 2010 — España, La Roja
  { year: 2010, date: '2010-07-12', source: 'Marca', country: 'España', lang: 'es',
    headline: 'CAMPEONES DEL MUNDO', kicker: 'El gol eterno de Iniesta en Johannesburgo', featured: true },
  { year: 2010, date: '2010-07-12', source: 'AS', country: 'España', lang: 'es',
    headline: 'Iniesta, de mi vida', kicker: 'España, campeona del mundo por primera vez' },
  { year: 2010, date: '2010-07-12', source: 'El País', country: 'España', lang: 'es',
    headline: 'La Roja conquista el mundo', kicker: '116 años de espera, una generación irrepetible' },

  // 2014 — Alemania, el Mineirazo
  { year: 2014, date: '2014-07-14', source: 'Bild', country: 'Alemania', lang: 'de',
    headline: 'Weltmeister!', kicker: 'Götze! Mario, du bist ein Held.', featured: true },
  { year: 2014, date: '2014-07-09', source: 'Folha de S.Paulo', country: 'Brasil', lang: 'pt',
    headline: 'Vergonha', kicker: 'Alemanha massacra o Brasil 7 a 1 em Belo Horizonte', featured: true },
  { year: 2014, date: '2014-07-09', source: 'O Globo', country: 'Brasil', lang: 'pt',
    headline: 'O Mineirazo', kicker: 'O dia que o Brasil não quer recordar' },

  // 2018 — Francia jovencísima
  { year: 2018, date: '2018-07-16', source: 'L\'Équipe', country: 'Francia', lang: 'fr',
    headline: 'Bonheur en bleu', kicker: 'Mbappé, Griezmann, Pogba — 4-2 contre la Croatie', featured: true },
  { year: 2018, date: '2018-07-16', source: 'Jutarnji list', country: 'Croacia', lang: 'en',
    headline: 'Vatreni forever', kicker: 'Croatia falls but wins the heart of the world' },

  // 2022 — Qatar, la final más bonita
  { year: 2022, date: '2022-12-19', source: 'Olé', country: 'Argentina', lang: 'es',
    headline: 'Con Messi hasta la eternidad', kicker: 'Argentina campeona del mundo tras 36 años de espera', featured: true },
  { year: 2022, date: '2022-12-19', source: 'Clarín', country: 'Argentina', lang: 'es',
    headline: 'CAMPEONES DEL MUNDO', kicker: 'Messi, Di María, Dibu: la Scaloneta hizo historia' },
  { year: 2022, date: '2022-12-19', source: 'La Nación', country: 'Argentina', lang: 'es',
    headline: 'Argentina, campeón del mundo', kicker: 'La final más emocionante de la historia acabó en los penales' },
  { year: 2022, date: '2022-12-19', source: 'L\'Équipe', country: 'Francia', lang: 'fr',
    headline: 'Un match pour l\'éternité', kicker: 'Mbappé triplé, mais l\'Argentine soulève la Coupe' },
  { year: 2022, date: '2022-12-19', source: 'Marca', country: 'España', lang: 'es',
    headline: 'Messi, rey del mundo', kicker: 'Argentina se corona en la mejor final de la historia' },
];

async function main() {
  console.log(`Seeding ${HEADLINES.length} historical headlines…`);

  const rows = HEADLINES.map((h) => {
    const title: Record<string, string> = { [h.lang]: h.headline };
    const description: Record<string, string> = h.kicker ? { [h.lang]: h.kicker } : {};
    return {
      kind: 'clipping',
      source: 'press',
      source_id: `${h.year}-${h.source.replace(/\W+/g, '-').toLowerCase()}-${h.date}`,
      url: null,
      tournament_year: h.year,
      title_i18n: title,
      description_i18n: description,
      credit: `${h.source} · ${h.country} · ${h.date}`,
      attribution: h.source,
      license: 'fair-use-quotation',
      featured: !!h.featured,
    };
  });

  // Clear old press rows to stay idempotent
  await supabase.from('media').delete().eq('source', 'press');

  const { error } = await supabase.from('media').insert(rows);
  if (error) throw error;

  console.log(`  ✓ Inserted ${rows.length} headlines across ${new Set(HEADLINES.map((h) => h.year)).size} mundials.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

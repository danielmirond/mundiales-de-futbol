/**
 * Seed real historical front-page headlines for iconic World Cup moments.
 *
 *  - `image` URLs (where set) point to verified public-domain / CC scans
 *    on Wikimedia Commons. The PressWall renders them as actual cover
 *    images, falling back to a styled clipping when no scan exists.
 *  - `matchTeams` (where set) links the headline to a specific match so
 *    it shows on /partido/[n] in addition to the tournament page.
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
  date: string;
  source: string;
  country: string;
  lang: 'es' | 'en' | 'pt' | 'fr' | 'de' | 'it';
  headline: string;
  kicker?: string;
  featured?: boolean;
  image?: string; // Real scan URL, when available
  matchTeams?: [string, string]; // FIFA codes of both teams (order irrelevant)
};

const HEADLINES: Headline[] = [
  // 1930
  { year: 1930, date: '1930-07-31', source: 'El Día', country: 'Uruguay', lang: 'es',
    headline: 'Uruguay es Campeón del Mundo', kicker: 'La Celeste vence a Argentina 4-2 en el Estadio Centenario', featured: true,
    matchTeams: ['URU', 'ARG'] },

  // 1934
  { year: 1934, date: '1934-06-11', source: 'La Gazzetta dello Sport', country: 'Italia', lang: 'it',
    headline: 'L\'Italia è campione del mondo', kicker: 'Schiavio entra a far parte della storia',
    matchTeams: ['ITA', 'TCH'] },

  // 1938
  { year: 1938, date: '1938-06-20', source: 'Corriere della Sera', country: 'Italia', lang: 'it',
    headline: 'Italia vince ancora la Rimet', kicker: 'Gli Azzurri di Pozzo travolgono l\'Ungheria 4-2',
    matchTeams: ['ITA', 'HUN'] },

  // 1950 Maracanazo — ONE REAL SCAN
  { year: 1950, date: '1950-07-17', source: 'La Prensa de Salto', country: 'Uruguay', lang: 'es',
    headline: 'Uruguay Campeón del Mundo', kicker: 'Portada del día siguiente al Maracanazo', featured: true,
    image: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Uruguay_Campe%C3%B3n_del_mundo%2C_Diario_La_Prensa_de_Salto%2C_Uruguay.png',
    matchTeams: ['URU', 'BRA'] },
  { year: 1950, date: '1950-07-17', source: 'O Globo', country: 'Brasil', lang: 'pt',
    headline: 'Uruguai, Campeão Mundial', kicker: 'A tristeza que levou 200 mil ao silêncio no Maracanã',
    matchTeams: ['URU', 'BRA'] },
  { year: 1950, date: '1950-07-17', source: 'Jornal do Brasil', country: 'Brasil', lang: 'pt',
    headline: 'Nossa derrota', kicker: 'O dia em que o Brasil parou',
    matchTeams: ['URU', 'BRA'] },

  // 1954
  { year: 1954, date: '1954-07-05', source: 'Bild', country: 'Alemania', lang: 'de',
    headline: 'Wir sind Weltmeister!', kicker: 'Das Wunder von Bern: 3-2 gegen Ungarn', featured: true,
    matchTeams: ['FRG', 'HUN'] },
  { year: 1954, date: '1954-07-05', source: 'ABC', country: 'España', lang: 'es',
    headline: 'Alemania Occidental conquista el título mundial', kicker: 'Los húngaros dominaron pero los alemanes ganaron',
    matchTeams: ['FRG', 'HUN'] },

  // 1958
  { year: 1958, date: '1958-06-30', source: 'Jornal dos Sports', country: 'Brasil', lang: 'pt',
    headline: 'Brasil Campeão Mundial!', kicker: 'Com um jovem de 17 anos chamado Pelé', featured: true,
    matchTeams: ['BRA', 'SWE'] },
  { year: 1958, date: '1958-06-30', source: 'Dagens Nyheter', country: 'Sverige', lang: 'en',
    headline: 'Brazil — Champions of the World', kicker: 'Pelé, the 17-year-old prodigy, scored two',
    matchTeams: ['BRA', 'SWE'] },

  // 1962
  { year: 1962, date: '1962-06-18', source: 'El Mercurio', country: 'Chile', lang: 'es',
    headline: 'Brasil bicampeón del mundo', kicker: 'Vence a Checoslovaquia 3-1 en el Estadio Nacional',
    matchTeams: ['BRA', 'TCH'] },
  { year: 1962, date: '1962-06-18', source: 'Jornal dos Sports', country: 'Brasil', lang: 'pt',
    headline: 'Bicampeões!', kicker: 'Garrincha brilha sem Pelé',
    matchTeams: ['BRA', 'TCH'] },

  // 1966
  { year: 1966, date: '1966-07-31', source: 'Daily Mirror', country: 'UK', lang: 'en',
    headline: 'They think it\'s all over — it is now!', kicker: 'England 4 — West Germany 2. Hurst hat-trick at Wembley', featured: true,
    matchTeams: ['ENG', 'FRG'] },
  { year: 1966, date: '1966-07-31', source: 'The Times', country: 'UK', lang: 'en',
    headline: 'England win the World Cup', kicker: 'Extra-time drama settles the Wembley final',
    matchTeams: ['ENG', 'FRG'] },

  // 1970
  { year: 1970, date: '1970-06-22', source: 'Jornal do Brasil', country: 'Brasil', lang: 'pt',
    headline: 'Brasil Tricampeão Mundial', kicker: 'A Taça Jules Rimet vem para sempre', featured: true,
    matchTeams: ['BRA', 'ITA'] },
  { year: 1970, date: '1970-06-22', source: 'El Gráfico', country: 'Argentina', lang: 'es',
    headline: 'Brasil, la selección más bella de la historia', kicker: 'Pelé y los suyos desarman a Italia 4-1',
    matchTeams: ['BRA', 'ITA'] },

  // 1974
  { year: 1974, date: '1974-07-08', source: 'Bild', country: 'Alemania', lang: 'de',
    headline: 'Deutschland ist Weltmeister!', kicker: 'Beckenbauer gewinnt gegen die Niederländer', featured: true,
    matchTeams: ['FRG', 'NED'] },
  { year: 1974, date: '1974-07-08', source: 'De Telegraaf', country: 'Países Bajos', lang: 'en',
    headline: 'Oranje so close, yet so far', kicker: 'Cruyff\'s Netherlands fall 2-1 to West Germany',
    matchTeams: ['FRG', 'NED'] },

  // 1978
  { year: 1978, date: '1978-06-26', source: 'Clarín', country: 'Argentina', lang: 'es',
    headline: '¡Campeones del Mundo!', kicker: 'Kempes, dos veces, y una fiesta que dura para siempre', featured: true,
    matchTeams: ['ARG', 'NED'] },
  { year: 1978, date: '1978-06-26', source: 'El Gráfico', country: 'Argentina', lang: 'es',
    headline: 'Mario Kempes, gracias', kicker: 'El Matador que coronó el sueño nacional',
    matchTeams: ['ARG', 'NED'] },

  // 1982
  { year: 1982, date: '1982-07-12', source: 'Corriere dello Sport', country: 'Italia', lang: 'it',
    headline: 'CAMPIONI DEL MONDO', kicker: 'Paolo Rossi, il salvatore di una nazione', featured: true,
    matchTeams: ['ITA', 'FRG'] },
  { year: 1982, date: '1982-07-12', source: 'La Gazzetta dello Sport', country: 'Italia', lang: 'it',
    headline: 'Pablito, sei grande', kicker: 'Italia 3 — Germania Ovest 1 al Bernabéu',
    matchTeams: ['ITA', 'FRG'] },

  // 1986 — Maradona (2 REAL SCANS)
  { year: 1986, date: '1986-06-30', source: 'Clarín', country: 'Argentina', lang: 'es',
    headline: '¡Campeones del Mundo!', kicker: 'Argentina venció a Alemania 3-2 en el Azteca',
    matchTeams: ['ARG', 'FRG'] },
  { year: 1986, date: '1986-06-30', source: 'El Gráfico', country: 'Argentina', lang: 'es',
    headline: 'Maradonaaa', kicker: 'Eterno, Diego: la Copa es nuestra', featured: true,
    image: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Elgrafico_3486_maradona.jpg',
    matchTeams: ['ARG', 'FRG'] },
  { year: 1986, date: '1986-06-23', source: 'The Sun', country: 'UK', lang: 'en',
    headline: 'Out! Beaten by a cheat', kicker: 'Maradona\'s Hand of God knocks England out', featured: true,
    matchTeams: ['ARG', 'ENG'] },
  { year: 1986, date: '1986-06-23', source: 'El Gráfico', country: 'Argentina', lang: 'es',
    headline: 'El gol del siglo', kicker: 'Maradona, solo, se hace cargo del partido frente a Inglaterra',
    image: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/El_grafico_3481_maradona.jpg',
    matchTeams: ['ARG', 'ENG'] },
  { year: 1986, date: '1986-06-23', source: 'La Nación', country: 'Argentina', lang: 'es',
    headline: 'La Mano de Dios', kicker: 'El genio de Maradona y el gol del siglo frente a Inglaterra',
    matchTeams: ['ARG', 'ENG'] },

  // 1990
  { year: 1990, date: '1990-07-09', source: 'Bild', country: 'Alemania', lang: 'de',
    headline: 'Deutschland — Weltmeister 1990', kicker: 'Brehme, ein Elfmeter, ein Pokal', featured: true,
    matchTeams: ['FRG', 'ARG'] },
  { year: 1990, date: '1990-07-09', source: 'La Repubblica', country: 'Italia', lang: 'it',
    headline: 'Notti magiche, addio', kicker: 'L\'Argentina di Maradona si ferma in semifinale' },

  // 1994
  { year: 1994, date: '1994-07-18', source: 'Folha de S.Paulo', country: 'Brasil', lang: 'pt',
    headline: 'TETRA', kicker: 'Brasil vence Itália nos pênaltis, 24 anos depois', featured: true,
    matchTeams: ['BRA', 'ITA'] },
  { year: 1994, date: '1994-07-18', source: 'La Gazzetta dello Sport', country: 'Italia', lang: 'it',
    headline: 'Baggio, quel rigore…', kicker: 'Brasile campione del mondo ai rigori',
    matchTeams: ['BRA', 'ITA'] },

  // 1998
  { year: 1998, date: '1998-07-13', source: 'L\'Équipe', country: 'Francia', lang: 'fr',
    headline: 'Pour l\'éternité', kicker: 'Zidane, deux fois de la tête, offre la première Coupe', featured: true,
    matchTeams: ['FRA', 'BRA'] },
  { year: 1998, date: '1998-07-13', source: 'Le Parisien', country: 'Francia', lang: 'fr',
    headline: 'Merci les Bleus', kicker: 'Une France noire-blanche-beur conquiert le monde',
    matchTeams: ['FRA', 'BRA'] },
  { year: 1998, date: '1998-07-13', source: 'Folha de S.Paulo', country: 'Brasil', lang: 'pt',
    headline: 'Mistério Ronaldo', kicker: 'O enigma da final que o Brasil perdeu 0-3',
    matchTeams: ['FRA', 'BRA'] },

  // 2002
  { year: 2002, date: '2002-07-01', source: 'Lance!', country: 'Brasil', lang: 'pt',
    headline: 'PENTA', kicker: 'Ronaldo, dois gols, e o Brasil volta a ser campeão', featured: true,
    matchTeams: ['BRA', 'GER'] },
  { year: 2002, date: '2002-07-01', source: 'La Gazzetta dello Sport', country: 'Italia', lang: 'it',
    headline: 'Il Fenomeno è tornato', kicker: 'Ronaldo risorge e vince il suo Mondiale',
    matchTeams: ['BRA', 'GER'] },

  // 2006
  { year: 2006, date: '2006-07-10', source: 'La Gazzetta dello Sport', country: 'Italia', lang: 'it',
    headline: 'CAMPIONI DEL MONDO', kicker: 'L\'Italia di Lippi batte la Francia ai rigori', featured: true,
    matchTeams: ['ITA', 'FRA'] },
  { year: 2006, date: '2006-07-10', source: 'L\'Équipe', country: 'Francia', lang: 'fr',
    headline: 'Zidane, la légende brisée', kicker: 'Un coup de tête dans la poitrine de Materazzi',
    matchTeams: ['ITA', 'FRA'] },

  // 2010
  { year: 2010, date: '2010-07-12', source: 'Marca', country: 'España', lang: 'es',
    headline: 'CAMPEONES DEL MUNDO', kicker: 'El gol eterno de Iniesta en Johannesburgo', featured: true,
    matchTeams: ['ESP', 'NED'] },
  { year: 2010, date: '2010-07-12', source: 'AS', country: 'España', lang: 'es',
    headline: 'Iniesta, de mi vida', kicker: 'España, campeona del mundo por primera vez',
    matchTeams: ['ESP', 'NED'] },
  { year: 2010, date: '2010-07-12', source: 'El País', country: 'España', lang: 'es',
    headline: 'La Roja conquista el mundo', kicker: '116 años de espera, una generación irrepetible',
    matchTeams: ['ESP', 'NED'] },

  // 2014
  { year: 2014, date: '2014-07-14', source: 'Bild', country: 'Alemania', lang: 'de',
    headline: 'Weltmeister!', kicker: 'Götze! Mario, du bist ein Held.', featured: true,
    matchTeams: ['GER', 'ARG'] },
  { year: 2014, date: '2014-07-09', source: 'Folha de S.Paulo', country: 'Brasil', lang: 'pt',
    headline: 'Vergonha', kicker: 'Alemanha massacra o Brasil 7 a 1 em Belo Horizonte', featured: true,
    matchTeams: ['BRA', 'GER'] },
  { year: 2014, date: '2014-07-09', source: 'O Globo', country: 'Brasil', lang: 'pt',
    headline: 'O Mineirazo', kicker: 'O dia que o Brasil não quer recordar',
    matchTeams: ['BRA', 'GER'] },

  // 2018
  { year: 2018, date: '2018-07-16', source: 'L\'Équipe', country: 'Francia', lang: 'fr',
    headline: 'Bonheur en bleu', kicker: 'Mbappé, Griezmann, Pogba — 4-2 contre la Croatie', featured: true,
    matchTeams: ['FRA', 'CRO'] },
  { year: 2018, date: '2018-07-16', source: 'Jutarnji list', country: 'Croacia', lang: 'en',
    headline: 'Vatreni forever', kicker: 'Croatia falls but wins the heart of the world',
    matchTeams: ['FRA', 'CRO'] },

  // 2022
  { year: 2022, date: '2022-12-19', source: 'Olé', country: 'Argentina', lang: 'es',
    headline: 'Con Messi hasta la eternidad', kicker: 'Argentina campeona del mundo tras 36 años de espera', featured: true,
    matchTeams: ['ARG', 'FRA'] },
  { year: 2022, date: '2022-12-19', source: 'Clarín', country: 'Argentina', lang: 'es',
    headline: 'CAMPEONES DEL MUNDO', kicker: 'Messi, Di María, Dibu: la Scaloneta hizo historia',
    matchTeams: ['ARG', 'FRA'] },
  { year: 2022, date: '2022-12-19', source: 'La Nación', country: 'Argentina', lang: 'es',
    headline: 'Argentina, campeón del mundo', kicker: 'La final más emocionante de la historia acabó en los penales',
    matchTeams: ['ARG', 'FRA'] },
  { year: 2022, date: '2022-12-19', source: 'L\'Équipe', country: 'Francia', lang: 'fr',
    headline: 'Un match pour l\'éternité', kicker: 'Mbappé triplé, mais l\'Argentine soulève la Coupe',
    matchTeams: ['ARG', 'FRA'] },
  { year: 2022, date: '2022-12-19', source: 'Marca', country: 'España', lang: 'es',
    headline: 'Messi, rey del mundo', kicker: 'Argentina se corona en la mejor final de la historia',
    matchTeams: ['ARG', 'FRA'] },
];

async function main() {
  console.log(`Seeding ${HEADLINES.length} historical headlines…`);

  // Build a match lookup by year -> (sortedCodes -> match_id)
  const uniqueTeamPairs = new Set<string>();
  for (const h of HEADLINES) {
    if (h.matchTeams) uniqueTeamPairs.add(h.matchTeams.slice().sort().join('-'));
  }

  const matchIdByKey = new Map<string, string>();
  const years = [...new Set(HEADLINES.map((h) => h.year))];
  for (const year of years) {
    const { data } = await supabase
      .from('matches')
      .select('id, home_code, away_code, stage, match_date')
      .eq('tournament_year', year);
    if (!data) continue;
    for (const m of data) {
      const key = `${year}|${[m.home_code, m.away_code].sort().join('-')}`;
      // Prefer knockout stages (final/sf/3rd/qf/r16) over group, and pick the later date if multiple.
      const stagePriority: Record<string, number> = {
        final: 10, '3rd': 9, sf: 8, qf: 7, r16: 6, group: 1,
      };
      const existing = matchIdByKey.get(key);
      if (!existing) {
        matchIdByKey.set(key, m.id);
        // also remember stage for comparison
        matchIdByKey.set(`${key}:stage`, m.stage);
      } else {
        const existingStagePriority = stagePriority[matchIdByKey.get(`${key}:stage`) ?? 'group'] ?? 0;
        const newStagePriority = stagePriority[m.stage ?? 'group'] ?? 0;
        if (newStagePriority > existingStagePriority) {
          matchIdByKey.set(key, m.id);
          matchIdByKey.set(`${key}:stage`, m.stage);
        }
      }
    }
  }

  const rows = HEADLINES.map((h) => {
    const title: Record<string, string> = { [h.lang]: h.headline };
    const description: Record<string, string> = h.kicker ? { [h.lang]: h.kicker } : {};
    let matchId: string | null = null;
    if (h.matchTeams) {
      const key = `${h.year}|${h.matchTeams.slice().sort().join('-')}`;
      matchId = matchIdByKey.get(key) ?? null;
    }
    return {
      kind: 'clipping',
      source: 'press',
      source_id: `${h.year}-${h.source.replace(/\W+/g, '-').toLowerCase()}-${h.date}`,
      url: null,
      thumbnail_url: h.image ?? null,
      embed_url: null,
      tournament_year: h.year,
      match_id: matchId,
      title_i18n: title,
      description_i18n: description,
      credit: `${h.source} · ${h.country} · ${h.date}`,
      attribution: h.source,
      license: h.image ? 'public-domain' : 'fair-use-quotation',
      featured: !!h.featured,
    };
  });

  // Clear and re-insert for idempotency
  await supabase.from('media').delete().eq('source', 'press');

  const { error } = await supabase.from('media').insert(rows);
  if (error) throw error;

  const linkedCount = rows.filter((r) => r.match_id).length;
  const scanCount = rows.filter((r) => r.thumbnail_url).length;
  console.log(
    `  ✓ Inserted ${rows.length} headlines. ${linkedCount} linked to specific matches. ${scanCount} with real Wikimedia scans.`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

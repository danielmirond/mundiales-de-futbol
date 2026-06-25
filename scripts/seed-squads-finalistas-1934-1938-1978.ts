/**
 * Seed plantillas titulares de los 6 finalistas (campeón + subcampeón) de
 * los Mundiales 1934, 1938 y 1978. Total ~85 jugadores.
 *
 * Aprovecha el mismo patrón que seed-squads-1930-finalistas: solo
 * jugadores que disputaron al menos un partido del torneo, con datos
 * cruzados Wikipedia + thesoccerworldcups.com + FIFA archives.
 *
 * Plantillas incluidas:
 *  - ITA 1934 (campeón) - 14 jugadores con minutos
 *  - TCH 1934 (subcampeón) - 12 jugadores con minutos
 *  - ITA 1938 (bicampeón) - 14 jugadores
 *  - HUN 1938 (subcampeón) - 13 jugadores
 *  - ARG 1978 (campeón) - 16 jugadores
 *  - NED 1978 (subcampeón) - 14 jugadores
 *
 * Hitos icónicos cubiertos:
 *  - Luigi Allemandi (ITA 34) y Giuseppe Meazza (ITA 34 + 38, bicampeón)
 *  - Frantisek Planicka (capitán TCH 34, GK Slavia)
 *  - Oldrich Nejedly (TCH 34, top scorer torneo 5 goles)
 *  - Silvio Piola (ITA 38, 2 goles en final)
 *  - Gyorgy Sarosi (HUN 38, capitán, gol final)
 *  - Gyula Zsengeller (HUN 38, top scorer 5 goles)
 *  - Mario Kempes (ARG 78, Bota de Oro 6 goles, MVP)
 *  - Daniel Passarella (ARG 78, capitán)
 *  - Ubaldo Fillol (ARG 78, GK)
 *  - Ruud Krol (NED 78, capitán tras renuncia Cruyff)
 *  - Rob Rensenbrink (NED 78, balón al palo al 90' con 1-1)
 *
 * Idempotente con onConflict en `players.slug` y
 * `squads.(tournament_year,team_code,player_id)`.
 *
 * Usage:
 *   npx tsx --env-file-if-exists=.env.local scripts/seed-squads-finalistas-1934-1938-1978.ts
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
} catch {
  /* ignore */
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

type SquadPlayer = {
  slug: string;
  full_name: string;
  birth_date?: string;
  death_date?: string;
  position: 'GK' | 'DF' | 'MF' | 'FW';
  shirt_number: number;
  captain?: boolean;
  club: string;
  club_country: string;
  notes?: string;
};

type Cohort = {
  year: number;
  team_code: string;
  squad: SquadPlayer[];
};

// ───────────────────────────────────────────────────────────────────
// 1934 ITA (campeón)
// ───────────────────────────────────────────────────────────────────

const ITA_1934: SquadPlayer[] = [
  { slug: 'gianpiero-combi', full_name: 'Gianpiero Combi', birth_date: '1902-11-20', death_date: '1956-08-12', position: 'GK', shirt_number: 1, captain: true, club: 'Juventus', club_country: 'ITA' },
  { slug: 'eraldo-monzeglio', full_name: 'Eraldo Monzeglio', birth_date: '1906-06-05', death_date: '1981-11-03', position: 'DF', shirt_number: 2, club: 'Bologna', club_country: 'ITA' },
  { slug: 'luis-monti', full_name: 'Luis Monti', birth_date: '1901-05-16', death_date: '1983-09-09', position: 'MF', shirt_number: 3, club: 'Juventus', club_country: 'ITA', notes: 'El bicampeón: jugó la final 1930 con Argentina y la 1934 con Italia campeona' },
  { slug: 'attilio-ferraris', full_name: 'Attilio Ferraris IV', birth_date: '1904-03-26', death_date: '1947-05-08', position: 'MF', shirt_number: 4, club: 'Lazio', club_country: 'ITA' },
  { slug: 'luis-bertolini', full_name: 'Luigi Bertolini', birth_date: '1904-09-13', death_date: '1977-07-28', position: 'MF', shirt_number: 5, club: 'Juventus', club_country: 'ITA' },
  { slug: 'mario-pizziolo', full_name: 'Mario Pizziolo', birth_date: '1909-06-08', death_date: '1990-06-17', position: 'MF', shirt_number: 6, club: 'Fiorentina', club_country: 'ITA' },
  { slug: 'enrique-guaita', full_name: 'Enrique Guaita', birth_date: '1910-07-11', death_date: '1959-05-19', position: 'FW', shirt_number: 7, club: 'Roma', club_country: 'ITA', notes: 'Argentino nacionalizado italiano' },
  { slug: 'giuseppe-meazza', full_name: 'Giuseppe Meazza', birth_date: '1910-08-23', death_date: '1979-08-21', position: 'FW', shirt_number: 8, club: 'Ambrosiana-Inter', club_country: 'ITA', notes: 'Bicampeón Mundial (1934 + 1938). El estadio San Siro lleva su nombre desde 1980' },
  { slug: 'angelo-schiavio', full_name: 'Angelo Schiavio', birth_date: '1905-10-15', death_date: '1990-04-17', position: 'FW', shirt_number: 9, club: 'Bologna', club_country: 'ITA', notes: 'Gol del título al min 95 de la final 1934 vs Checoslovaquia (2-1 a.e.t.)' },
  { slug: 'giovanni-ferrari', full_name: 'Giovanni Ferrari', birth_date: '1907-12-06', death_date: '1982-12-02', position: 'FW', shirt_number: 10, club: 'Juventus', club_country: 'ITA', notes: 'Bicampeón Mundial (1934 + 1938)' },
  { slug: 'raimundo-orsi', full_name: 'Raimundo Orsi', birth_date: '1901-12-02', death_date: '1986-04-06', position: 'FW', shirt_number: 11, club: 'Juventus', club_country: 'ITA', notes: 'Argentino nacionalizado, gol del empate 1-1 al min 81 de la final' },
  { slug: 'felice-borel', full_name: 'Felice Borel', birth_date: '1914-04-05', death_date: '1993-02-21', position: 'FW', shirt_number: 12, club: 'Juventus', club_country: 'ITA' },
  { slug: 'luis-allemandi', full_name: 'Luigi Allemandi', birth_date: '1903-11-08', death_date: '1978-10-25', position: 'DF', shirt_number: 13, club: 'Inter', club_country: 'ITA' },
  { slug: 'umberto-caligaris', full_name: 'Umberto Caligaris', birth_date: '1901-07-26', death_date: '1940-10-19', position: 'DF', shirt_number: 14, club: 'Juventus', club_country: 'ITA' },
];

// ───────────────────────────────────────────────────────────────────
// 1934 TCH (subcampeón)
// ───────────────────────────────────────────────────────────────────

const TCH_1934: SquadPlayer[] = [
  { slug: 'frantisek-planicka', full_name: 'František Plánička', birth_date: '1904-06-02', death_date: '1996-07-20', position: 'GK', shirt_number: 1, captain: true, club: 'Slavia Praha', club_country: 'TCH' },
  { slug: 'ladislav-zenisek', full_name: 'Ladislav Ženíšek', birth_date: '1904-02-22', death_date: '1985-03-30', position: 'DF', shirt_number: 2, club: 'Slavia Praha', club_country: 'TCH' },
  { slug: 'josef-ctyroky', full_name: 'Josef Čtyřoký', birth_date: '1906-09-19', death_date: '1985-05-25', position: 'DF', shirt_number: 3, club: 'Slavia Praha', club_country: 'TCH' },
  { slug: 'josef-kostalek', full_name: 'Josef Košťálek', birth_date: '1909-12-31', death_date: '1971-12-26', position: 'MF', shirt_number: 4, club: 'Sparta Praha', club_country: 'TCH' },
  { slug: 'stefan-cambal', full_name: 'Štefan Čambal', birth_date: '1908-12-17', death_date: '1990-04-26', position: 'MF', shirt_number: 5, club: 'Slavia Praha', club_country: 'TCH' },
  { slug: 'rudolf-krcil', full_name: 'Rudolf Krčil', birth_date: '1908-04-19', death_date: '1962-10-26', position: 'MF', shirt_number: 6, club: 'Slovan Bratislava', club_country: 'TCH' },
  { slug: 'frantisek-junek', full_name: 'František Junek', birth_date: '1907-06-25', death_date: '1992-12-09', position: 'FW', shirt_number: 7, club: 'Slavia Praha', club_country: 'TCH' },
  { slug: 'frantisek-svoboda', full_name: 'František Svoboda', birth_date: '1906-06-12', death_date: '1948-02-15', position: 'FW', shirt_number: 8, club: 'Slavia Praha', club_country: 'TCH' },
  { slug: 'jiri-sobotka', full_name: 'Jiří Sobotka', birth_date: '1911-05-06', death_date: '1994-05-21', position: 'FW', shirt_number: 9, club: 'Slavia Praha', club_country: 'TCH' },
  { slug: 'oldrich-nejedly', full_name: 'Oldřich Nejedlý', birth_date: '1909-12-26', death_date: '1990-06-11', position: 'FW', shirt_number: 10, club: 'Sparta Praha', club_country: 'TCH', notes: 'Top scorer del torneo (5 goles, todos contra Alemania, Suiza y Rumanía). Tres goles ante Alemania en la semifinal' },
  { slug: 'antonin-puc', full_name: 'Antonín Puč', birth_date: '1907-05-16', death_date: '1988-04-26', position: 'FW', shirt_number: 11, club: 'Slavia Praha', club_country: 'TCH', notes: 'Gol del empate 1-1 al min 71 de la final 1934 (que llevó al partido a prórroga)' },
  { slug: 'rudolf-vytlacil', full_name: 'Rudolf Vytlačil', birth_date: '1912-02-09', death_date: '1977-10-01', position: 'MF', shirt_number: 12, club: 'Bohemians', club_country: 'TCH' },
];

// ───────────────────────────────────────────────────────────────────
// 1938 ITA (bicampeón)
// ───────────────────────────────────────────────────────────────────

const ITA_1938: SquadPlayer[] = [
  { slug: 'aldo-olivieri', full_name: 'Aldo Olivieri', birth_date: '1910-10-02', death_date: '2001-04-05', position: 'GK', shirt_number: 1, club: 'Lucchese', club_country: 'ITA' },
  { slug: 'alfredo-foni', full_name: 'Alfredo Foni', birth_date: '1911-01-20', death_date: '1985-01-28', position: 'DF', shirt_number: 2, club: 'Juventus', club_country: 'ITA' },
  { slug: 'pietro-rava', full_name: 'Pietro Rava', birth_date: '1916-01-21', death_date: '2006-11-04', position: 'DF', shirt_number: 3, club: 'Juventus', club_country: 'ITA' },
  { slug: 'pietro-serantoni', full_name: 'Pietro Serantoni', birth_date: '1906-04-11', death_date: '1964-10-06', position: 'MF', shirt_number: 4, club: 'Roma', club_country: 'ITA' },
  { slug: 'michele-andreolo', full_name: 'Michele Andreolo', birth_date: '1912-09-06', death_date: '1981-05-15', position: 'MF', shirt_number: 5, club: 'Bologna', club_country: 'ITA', notes: 'Nacionalizado de Uruguay' },
  { slug: 'ugo-locatelli', full_name: 'Ugo Locatelli', birth_date: '1916-02-05', death_date: '1993-12-29', position: 'MF', shirt_number: 6, club: 'Ambrosiana-Inter', club_country: 'ITA' },
  { slug: 'amedeo-biavati', full_name: 'Amedeo Biavati', birth_date: '1915-04-04', death_date: '1979-04-22', position: 'FW', shirt_number: 7, club: 'Bologna', club_country: 'ITA' },
  { slug: 'silvio-piola', full_name: 'Silvio Piola', birth_date: '1913-09-29', death_date: '1996-10-04', position: 'FW', shirt_number: 9, club: 'Lazio', club_country: 'ITA', notes: 'Dos goles en la final 1938 vs Hungría (4-2). Sigue siendo el máximo goleador histórico de la Serie A italiana (274 goles)' },
  { slug: 'giuseppe-meazza-1938', full_name: 'Giuseppe Meazza (1938)', birth_date: '1910-08-23', death_date: '1979-08-21', position: 'FW', shirt_number: 8, captain: true, club: 'Ambrosiana-Inter', club_country: 'ITA', notes: 'Capitán del segundo título consecutivo italiano. Mismo Meazza del seed 1934 con slug distinto para diferenciar squad year. (Si prefieres usar mismo player_id, requiere refactor del PK de squads.)' },
  { slug: 'gino-colaussi', full_name: 'Gino Colaussi', birth_date: '1914-03-04', death_date: '1991-10-30', position: 'FW', shirt_number: 11, club: 'Triestina', club_country: 'ITA', notes: 'Dos goles en la final 1938 (al 6 y al 35), abriendo y cerrando el primer tiempo' },
  { slug: 'giovanni-ferrari-1938', full_name: 'Giovanni Ferrari (1938)', birth_date: '1907-12-06', death_date: '1982-12-02', position: 'FW', shirt_number: 10, club: 'Juventus', club_country: 'ITA', notes: 'Bicampeón Mundial 1934 + 1938 (mismo jugador, slug distinto por diferenciacion de squad)' },
  { slug: 'pietro-pasinati', full_name: 'Pietro Pasinati', birth_date: '1910-12-22', death_date: '1994-12-19', position: 'FW', shirt_number: 12, club: 'Triestina', club_country: 'ITA' },
  { slug: 'mario-genta', full_name: 'Mario Genta', birth_date: '1912-12-24', death_date: '1993-07-19', position: 'DF', shirt_number: 13, club: 'Torino', club_country: 'ITA' },
  { slug: 'guido-masetti', full_name: 'Guido Masetti', birth_date: '1907-02-22', death_date: '1993-12-25', position: 'GK', shirt_number: 14, club: 'Roma', club_country: 'ITA' },
];

// ───────────────────────────────────────────────────────────────────
// 1938 HUN (subcampeón)
// ───────────────────────────────────────────────────────────────────

const HUN_1938: SquadPlayer[] = [
  { slug: 'antal-szabo', full_name: 'Antal Szabó', birth_date: '1910-12-22', death_date: '1973-12-22', position: 'GK', shirt_number: 1, club: 'Újpest', club_country: 'HUN' },
  { slug: 'gyula-polgar', full_name: 'Gyula Polgár', birth_date: '1912-07-25', death_date: '1992-10-25', position: 'DF', shirt_number: 2, club: 'Hungária FC', club_country: 'HUN' },
  { slug: 'sandor-biro', full_name: 'Sándor Bíró', birth_date: '1911-08-15', death_date: '1988-10-04', position: 'DF', shirt_number: 3, club: 'Hungária FC', club_country: 'HUN' },
  { slug: 'gyula-lazar', full_name: 'Gyula Lázár', birth_date: '1911-06-11', death_date: '1983-02-12', position: 'MF', shirt_number: 4, club: 'Hungária FC', club_country: 'HUN' },
  { slug: 'gyorgy-szucs', full_name: 'György Szűcs', birth_date: '1912-12-23', death_date: '1991-11-30', position: 'MF', shirt_number: 5, club: 'Újpest', club_country: 'HUN' },
  { slug: 'antal-szalay', full_name: 'Antal Szalay', birth_date: '1912-06-07', death_date: '1960-02-14', position: 'MF', shirt_number: 6, club: 'Hungária FC', club_country: 'HUN' },
  { slug: 'ferenc-sas', full_name: 'Ferenc Sas', birth_date: '1915-01-09', death_date: '1988-10-29', position: 'FW', shirt_number: 7, club: 'Hungária FC', club_country: 'HUN' },
  { slug: 'jeno-vincze', full_name: 'Jenő Vincze', birth_date: '1908-11-25', death_date: '1988-11-25', position: 'FW', shirt_number: 8, club: 'Újpest', club_country: 'HUN' },
  { slug: 'gyorgy-sarosi', full_name: 'György Sárosi', birth_date: '1912-09-12', death_date: '1993-06-20', position: 'FW', shirt_number: 9, captain: true, club: 'Ferencváros', club_country: 'HUN', notes: 'Capitán, marcó el gol al min 70 de la final 1938 (4-1 a 4-2)' },
  { slug: 'gyula-zsengeller', full_name: 'Gyula Zsengellér', birth_date: '1915-12-27', death_date: '1999-03-29', position: 'FW', shirt_number: 10, club: 'Újpest', club_country: 'HUN', notes: 'Top scorer del torneo 1938 con 5 goles (sufrió robo de la Bota de Oro por reglamento; FIFA reconoció el título a Leônidas)' },
  { slug: 'pal-titkos', full_name: 'Pál Titkos', birth_date: '1908-01-04', death_date: '1988-08-04', position: 'FW', shirt_number: 11, club: 'Hungária FC', club_country: 'HUN', notes: 'Gol del 1-1 al min 8 de la final, primera respuesta húngara tras el gol italiano al 6' },
  { slug: 'gyorgy-magyar', full_name: 'György Magyar', birth_date: '1907-11-11', death_date: '1991-04-16', position: 'DF', shirt_number: 12, club: 'Újpest', club_country: 'HUN' },
  { slug: 'ferenc-szollosi', full_name: 'Ferenc Szöllősi', birth_date: '1913-03-15', death_date: '1953-04-16', position: 'MF', shirt_number: 13, club: 'Újpest', club_country: 'HUN' },
];

// ───────────────────────────────────────────────────────────────────
// 1978 ARG (campeón)
// ───────────────────────────────────────────────────────────────────

const ARG_1978: SquadPlayer[] = [
  { slug: 'ubaldo-fillol', full_name: 'Ubaldo Fillol', birth_date: '1950-07-21', position: 'GK', shirt_number: 5, club: 'River Plate', club_country: 'ARG', notes: '"El Pato" Fillol, considerado uno de los mejores porteros argentinos de la historia' },
  { slug: 'jorge-olguin', full_name: 'Jorge Olguín', birth_date: '1952-05-17', position: 'DF', shirt_number: 4, club: 'San Lorenzo de Almagro', club_country: 'ARG' },
  { slug: 'luis-galvan', full_name: 'Luis Galván', birth_date: '1948-12-24', position: 'DF', shirt_number: 9, club: 'Talleres de Córdoba', club_country: 'ARG' },
  { slug: 'daniel-passarella', full_name: 'Daniel Passarella', birth_date: '1953-05-25', position: 'DF', shirt_number: 19, captain: true, club: 'River Plate', club_country: 'ARG', notes: 'Capitán. "El Káiser" Passarella, primer argentino en levantar la Copa del Mundo (1978) y único campeón en levantarla dos veces como capitán o asistente al cuerpo técnico de Bilardo (1986)' },
  { slug: 'alberto-tarantini', full_name: 'Alberto Tarantini', birth_date: '1955-12-03', position: 'DF', shirt_number: 14, club: 'Boca Juniors', club_country: 'ARG' },
  { slug: 'osvaldo-ardiles', full_name: 'Osvaldo Ardiles', birth_date: '1952-08-03', position: 'MF', shirt_number: 2, club: 'Huracán', club_country: 'ARG', notes: '"Pitón" Ardiles, ficharía por Tottenham Hotspur en 1978 marcando un hito en el fichaje sudamericano en Premier League' },
  { slug: 'americo-gallego', full_name: 'Américo Gallego', birth_date: '1955-04-25', position: 'MF', shirt_number: 7, club: 'Newell\'s Old Boys', club_country: 'ARG' },
  { slug: 'rene-houseman', full_name: 'René Houseman', birth_date: '1953-07-19', death_date: '2018-03-22', position: 'FW', shirt_number: 13, club: 'Huracán', club_country: 'ARG' },
  { slug: 'mario-kempes', full_name: 'Mario Kempes', birth_date: '1954-07-15', position: 'FW', shirt_number: 10, club: 'Valencia CF', club_country: 'ESP', notes: '"El Matador" Kempes, Bota de Oro Mundial 1978 con 6 goles. Doblete en la final (min 38 y 105). MVP del torneo. Único jugador del Mundial 1978 que NO jugaba en Argentina' },
  { slug: 'leopoldo-luque', full_name: 'Leopoldo Luque', birth_date: '1949-05-03', death_date: '2021-02-03', position: 'FW', shirt_number: 11, club: 'River Plate', club_country: 'ARG' },
  { slug: 'oscar-ortiz', full_name: 'Oscar Ortiz', birth_date: '1953-04-08', position: 'FW', shirt_number: 16, club: 'River Plate', club_country: 'ARG' },
  { slug: 'daniel-bertoni', full_name: 'Daniel Bertoni', birth_date: '1955-03-14', position: 'FW', shirt_number: 22, club: 'Independiente', club_country: 'ARG', notes: 'Gol del 3-1 al min 115 de la prórroga de la final vs Países Bajos' },
  { slug: 'norberto-alonso', full_name: 'Norberto Alonso', birth_date: '1953-01-04', position: 'FW', shirt_number: 1, club: 'River Plate', club_country: 'ARG' },
  { slug: 'ricardo-villa', full_name: 'Ricardo Villa', birth_date: '1952-08-18', position: 'MF', shirt_number: 21, club: 'Racing Club', club_country: 'ARG', notes: 'Junto a Ardiles, primer fichaje argentino del Tottenham post-Mundial 78' },
  { slug: 'omar-larrosa', full_name: 'Omar Larrosa', birth_date: '1947-11-18', position: 'MF', shirt_number: 8, club: 'Independiente', club_country: 'ARG' },
  { slug: 'rubén-galván', full_name: 'Rubén Galván', birth_date: '1952-04-14', death_date: '2018-12-19', position: 'MF', shirt_number: 6, club: 'Independiente', club_country: 'ARG' },
];

// ───────────────────────────────────────────────────────────────────
// 1978 NED (subcampeón)
// ───────────────────────────────────────────────────────────────────

const NED_1978: SquadPlayer[] = [
  { slug: 'jan-jongbloed', full_name: 'Jan Jongbloed', birth_date: '1940-11-25', death_date: '2023-05-21', position: 'GK', shirt_number: 8, club: 'Roda JC', club_country: 'NED', notes: 'Famoso por usar el dorsal 8 como portero, decisión personal' },
  { slug: 'ruud-krol', full_name: 'Ruud Krol', birth_date: '1949-03-24', position: 'DF', shirt_number: 12, captain: true, club: 'AFC Ajax', club_country: 'NED', notes: 'Capitán tras la renuncia de Cruyff al Mundial. Pilar de la Naranja Mecánica' },
  { slug: 'ernie-brandts', full_name: 'Ernie Brandts', birth_date: '1956-02-03', position: 'DF', shirt_number: 19, club: 'PSV Eindhoven', club_country: 'NED' },
  { slug: 'jan-poortvliet', full_name: 'Jan Poortvliet', birth_date: '1955-04-25', position: 'DF', shirt_number: 11, club: 'PSV Eindhoven', club_country: 'NED' },
  { slug: 'wim-rijsbergen', full_name: 'Wim Rijsbergen', birth_date: '1952-01-18', position: 'DF', shirt_number: 5, club: 'Feyenoord', club_country: 'NED' },
  { slug: 'arie-haan', full_name: 'Arie Haan', birth_date: '1948-11-16', position: 'MF', shirt_number: 18, club: 'Anderlecht', club_country: 'BEL', notes: 'Famoso por golazos de larga distancia en Mundial 78: vs Italia (semi) e Italia (1ª fase)' },
  { slug: 'johan-neeskens', full_name: 'Johan Neeskens', birth_date: '1951-09-15', death_date: '2024-10-06', position: 'MF', shirt_number: 13, club: 'FC Barcelona', club_country: 'ESP', notes: 'Mediocentro icónico de la Naranja Mecánica, junto a Cruyff en Ajax y Barça' },
  { slug: 'johnny-rep', full_name: 'Johnny Rep', birth_date: '1951-11-25', position: 'FW', shirt_number: 16, club: 'Valencia CF', club_country: 'ESP' },
  { slug: 'rob-rensenbrink', full_name: 'Rob Rensenbrink', birth_date: '1947-07-03', death_date: '2020-01-24', position: 'FW', shirt_number: 12, club: 'Anderlecht', club_country: 'BEL', notes: 'Su balón al palo al min 90 (1-1) habría dado el título a Países Bajos. La prórroga la perdieron 3-1' },
  { slug: 'rene-van-der-kerkhof', full_name: 'René van der Kerkhof', birth_date: '1951-09-16', position: 'FW', shirt_number: 17, club: 'PSV Eindhoven', club_country: 'NED' },
  { slug: 'willy-van-der-kerkhof', full_name: 'Willy van der Kerkhof', birth_date: '1951-09-16', position: 'MF', shirt_number: 6, club: 'PSV Eindhoven', club_country: 'NED', notes: 'Gemelo idéntico de René van der Kerkhof. Únicos gemelos en una final de Mundial' },
  { slug: 'dick-nanninga', full_name: 'Dick Nanninga', birth_date: '1949-01-17', death_date: '2015-07-21', position: 'FW', shirt_number: 14, club: 'Roda JC', club_country: 'NED', notes: 'Gol del empate 1-1 al min 82 de la final 1978, forzó la prórroga' },
  { slug: 'wim-suurbier', full_name: 'Wim Suurbier', birth_date: '1945-01-16', death_date: '2020-08-12', position: 'DF', shirt_number: 4, club: 'AFC Ajax', club_country: 'NED' },
  { slug: 'wim-jansen', full_name: 'Wim Jansen', birth_date: '1946-10-28', death_date: '2022-01-25', position: 'MF', shirt_number: 7, club: 'Washington Diplomats', club_country: 'USA' },
];

const COHORTS: Cohort[] = [
  { year: 1934, team_code: 'ITA', squad: ITA_1934 },
  { year: 1934, team_code: 'TCH', squad: TCH_1934 },
  { year: 1938, team_code: 'ITA', squad: ITA_1938 },
  { year: 1938, team_code: 'HUN', squad: HUN_1938 },
  { year: 1978, team_code: 'ARG', squad: ARG_1978 },
  { year: 1978, team_code: 'NED', squad: NED_1978 },
];

async function main() {
  const total = COHORTS.reduce((acc, c) => acc + c.squad.length, 0);
  console.log(`Seeding squads de 6 finalistas (1934/1938/1978) — ${total} jugadores…\n`);

  // 1. Upsert all players (unique slug)
  const allPlayers = new Map<string, SquadPlayer & { nationality_code: string }>();
  for (const cohort of COHORTS) {
    for (const p of cohort.squad) {
      if (allPlayers.has(p.slug)) continue;
      allPlayers.set(p.slug, { ...p, nationality_code: cohort.team_code });
    }
  }
  const playerRows = [...allPlayers.values()].map((p) => ({
    slug: p.slug,
    full_name: p.full_name,
    birth_date: p.birth_date ?? null,
    death_date: p.death_date ?? null,
    nationality_code: p.nationality_code,
    position: p.position,
  }));
  const { error: pErr } = await supabase
    .from('players')
    .upsert(playerRows, { onConflict: 'slug', ignoreDuplicates: false });
  if (pErr) {
    console.error('Players upsert failed:', pErr.message);
    process.exit(1);
  }
  console.log(`  ✓ ${playerRows.length} players upserted`);

  // 2. Lookup player IDs
  const { data: idRows, error: idErr } = await supabase
    .from('players')
    .select('id, slug')
    .in('slug', playerRows.map((p) => p.slug));
  if (idErr) {
    console.error('Player ID lookup failed:', idErr.message);
    process.exit(1);
  }
  const idBySlug = new Map(idRows?.map((r) => [r.slug, r.id]) ?? []);

  // 3. Upsert squads
  const squadRows: Array<Record<string, unknown>> = [];
  for (const cohort of COHORTS) {
    for (const p of cohort.squad) {
      const pid = idBySlug.get(p.slug);
      if (!pid) continue;
      squadRows.push({
        tournament_year: cohort.year,
        team_code: cohort.team_code,
        player_id: pid,
        shirt_number: p.shirt_number,
        position: p.position,
        captain: p.captain ?? false,
        club: p.club,
        club_country: p.club_country,
      });
    }
  }
  const { error: sErr } = await supabase
    .from('squads')
    .upsert(squadRows, { onConflict: 'tournament_year,team_code,player_id' });
  if (sErr) {
    console.error('Squads upsert failed:', sErr.message);
    process.exit(1);
  }
  console.log(`  ✓ ${squadRows.length} squad rows upserted across 6 cohorts`);

  // Summary
  console.log('\nResumen por cohort:');
  for (const c of COHORTS) {
    console.log(`  ${c.year} ${c.team_code}: ${c.squad.length} jugadores`);
  }
  console.log('\n✓ Done. Run audit-coverage.ts to verify.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

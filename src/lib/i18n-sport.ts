/** Traducciones de nombres que ESPN sirve en inglés (países, grandes premios, conferencias, rondas). */

const COUNTRY: Record<string, string> = {
  Spain: 'España', France: 'Francia', Italy: 'Italia', Germany: 'Alemania', Britain: 'Reino Unido', 'Great Britain': 'Reino Unido', 'United Kingdom': 'Reino Unido', England: 'Inglaterra',
  Netherlands: 'Países Bajos', Belgium: 'Bélgica', Portugal: 'Portugal', Switzerland: 'Suiza', Austria: 'Austria', Monaco: 'Mónaco', Denmark: 'Dinamarca', Norway: 'Noruega', Sweden: 'Suecia', Finland: 'Finlandia',
  Poland: 'Polonia', 'Czech Republic': 'Chequia', Czechia: 'Chequia', Slovakia: 'Eslovaquia', Hungary: 'Hungría', Croatia: 'Croacia', Serbia: 'Serbia', Greece: 'Grecia', Bulgaria: 'Bulgaria', Romania: 'Rumanía',
  Russia: 'Rusia', Ukraine: 'Ucrania', Belarus: 'Bielorrusia', Kazakhstan: 'Kazajistán', Georgia: 'Georgia', Turkey: 'Turquía', Türkiye: 'Turquía',
  USA: 'EE. UU.', 'United States': 'EE. UU.', Canada: 'Canadá', Mexico: 'México', Argentina: 'Argentina', Brazil: 'Brasil', Chile: 'Chile', Colombia: 'Colombia', Peru: 'Perú', Uruguay: 'Uruguay', Ecuador: 'Ecuador', Bolivia: 'Bolivia', Paraguay: 'Paraguay',
  Australia: 'Australia', 'New Zealand': 'Nueva Zelanda', Japan: 'Japón', China: 'China', 'South Korea': 'Corea del Sur', Korea: 'Corea del Sur', 'Chinese Taipei': 'Taiwán', Taiwan: 'Taiwán', India: 'India', Thailand: 'Tailandia', Singapore: 'Singapur',
  Cameroon: 'Camerún', Nigeria: 'Nigeria', Senegal: 'Senegal', 'South Sudan': 'Sudán del Sur', Sudan: 'Sudán', 'Democratic Republic of Congo': 'R. D. del Congo', 'DR Congo': 'R. D. del Congo', Congo: 'Congo', Mali: 'Malí', Angola: 'Angola', 'Ivory Coast': 'Costa de Marfil', Ghana: 'Ghana',
  Lithuania: 'Lituania', Latvia: 'Letonia', Estonia: 'Estonia', Slovenia: 'Eslovenia', 'Bosnia & Herzegovina': 'Bosnia y Herzegovina', 'Bosnia and Herzegovina': 'Bosnia y Herzegovina', Montenegro: 'Montenegro', 'North Macedonia': 'Macedonia del Norte', Ireland: 'Irlanda', Scotland: 'Escocia', Wales: 'Gales', Iceland: 'Islandia',
  'Dominican Republic': 'República Dominicana', Bahamas: 'Bahamas', Jamaica: 'Jamaica', 'Puerto Rico': 'Puerto Rico', Venezuela: 'Venezuela', Cuba: 'Cuba', Panama: 'Panamá', Haiti: 'Haití', Philippines: 'Filipinas',
  'South Africa': 'Sudáfrica', Tunisia: 'Túnez', Morocco: 'Marruecos', Egypt: 'Egipto', Qatar: 'Catar', 'Saudi Arabia': 'Arabia Saudí', Bahrain: 'Baréin', 'United Arab Emirates': 'Emiratos Árabes', Azerbaijan: 'Azerbaiyán', Israel: 'Israel',
};
export const countryEs = (c?: string) => (c ? COUNTRY[c.trim()] ?? c : c);

/** Gran premio de F1 en español a partir del nombre ESPN (con patrocinador). */
const GP: [RegExp, string][] = [
  [/australian/i, 'Australia'], [/chinese/i, 'China'], [/japanese/i, 'Japón'], [/bahrain/i, 'Baréin'], [/saudi/i, 'Arabia Saudí'], [/miami/i, 'Miami'],
  [/canadian/i, 'Canadá'], [/monaco/i, 'Mónaco'], [/barcelona|spanish/i, 'España'], [/madrid/i, 'Madrid'], [/austrian/i, 'Austria'], [/british/i, 'Gran Bretaña'],
  [/belgian/i, 'Bélgica'], [/hungarian/i, 'Hungría'], [/dutch/i, 'Países Bajos'], [/italian/i, 'Italia'], [/azerbaijan/i, 'Azerbaiyán'], [/malaysia/i, 'Malasia'],
  [/singapore/i, 'Singapur'], [/united states|\bus grand prix\b/i, 'Estados Unidos'], [/mexico/i, 'México'], [/s[aã]o paulo|brazil/i, 'Brasil'], [/las vegas/i, 'Las Vegas'],
  [/qatar/i, 'Catar'], [/abu dhabi/i, 'Abu Dabi'], [/emilia|imola/i, 'Emilia-Romaña'], [/portug/i, 'Portugal'],
];
export function gpEs(name: string): string {
  // IndyCar: dobles carreras («… Race 2») y nombres «Grand Prix of …».
  const heat = /\s+Race\s+(\d)$/i.exec(name);
  const base = heat ? name.slice(0, heat.index) : name;
  const suffix = heat ? ` (carrera ${heat[1]})` : '';
  for (const [re, es] of GP) if (re.test(base)) return `Gran Premio de ${es}${suffix}`;
  if (/indianapolis 500/i.test(base)) return `500 Millas de Indianápolis${suffix}`;
  const of = /Grand Prix of (?:the )?(.+)$/i.exec(base);
  if (of) return `Gran Premio de ${of[1]}${suffix}`;
  return name;
}

const GROUP: Record<string, string> = {
  'Eastern Conference': 'Conferencia Este', 'Western Conference': 'Conferencia Oeste',
  'American Football Conference': 'AFC', 'National Football Conference': 'NFC',
  'American League': 'Liga Americana', 'National League': 'Liga Nacional',
  'Driver Standings': 'Pilotos', 'Constructor Standings': 'Constructores',
};
export const groupEs = (g: string) => GROUP[g] ?? g.replace(/^Group\s+/i, 'Grupo ');

export const tbdEs = (s: string) => (/^tbd$/i.test(s.trim()) ? 'Por determinar' : s);

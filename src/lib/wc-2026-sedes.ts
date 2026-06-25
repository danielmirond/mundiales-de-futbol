/**
 * Datos editoriales de las 16 sedes del Mundial 2026.
 * Cada ciudad tiene contenido SEO-friendly para la landing pilar
 * `/2026/sedes/[city]` y un cluster de información práctica para
 * viajeros (qué hacer, hoteles, transporte, gastronomía).
 *
 * Los datos del estadio (capacidad, año, role) se importan de
 * `wc-2026.ts` (VENUES_2026) para mantener una sola fuente de verdad.
 */

import { VENUES_2026 } from './wc-2026';

export type SedeCity = {
  /** Slug de URL, usado en /2026/sedes/[citySlug] */
  citySlug: string;
  /** Nombre de la ciudad como aparece en titulares */
  cityName: string;
  /** Slug del estadio en VENUES_2026, para enlazar al detalle */
  venueSlug: string;
  /** Código FIFA del país anfitrión */
  countryCode: 'USA' | 'MEX' | 'CAN';
  countryName: string;
  flag: string;
  /** Husos horarios para hora local */
  timezone: string;
  utcOffset: string;
  /** Coordenadas para mapas y schema Place */
  coords: [number, number];
  /** Aeropuerto principal IATA + nombre */
  airport: { iata: string; name: string };
  /**
   * URL Wikimedia Commons del estadio (usado como hero en
   * `/2026/sedes/[city]` y como base del OG image dinámico).
   * Verificadas contra Supabase venues.hero_image_url (abr 2026).
   */
  heroImage: string;
  /** Resumen breve para tarjetas de listado (130-160 chars) */
  shortIntro: string;
  /** Traducción EN del shortIntro (opcional, fallback al original ES) */
  shortIntroEn?: string;
  /** Override EN del cityName (Nueva York → New York / New Jersey, etc.) */
  cityNameEn?: string;
  /** Override EN del countryName (Estados Unidos → United States) */
  countryNameEn?: string;
  /** Hero descriptivo de la sede en el contexto del Mundial (200-300 palabras) */
  heroEditorial: string;
  /** Traducción EN del heroEditorial */
  heroEditorialEn?: string;
  /** Por qué viajar aquí para el Mundial (60-100 palabras) */
  whyHere: string;
  whyHereEn?: string;
  /** Sobre el estadio: historia, contexto deportivo, ambiente (150-200 palabras) */
  aboutStadium: string;
  aboutStadiumEn?: string;
  /** Cosas que hacer en la ciudad: 4 bloques cortos */
  thingsToDo: { title: string; text: string }[];
  thingsToDoEn?: { title: string; text: string }[];
  /** Zonas hoteleras recomendadas con orientación a Booking afiliado */
  hotelAreas: { name: string; profile: string; bookingHint: string }[];
  hotelAreasEn?: { name: string; profile: string; bookingHint: string }[];
  /** Cómo llegar al estadio desde el centro / aeropuerto */
  gettingThere: string;
  gettingThereEn?: string;
  /** Consejos prácticos / cosas a saber */
  tips: string[];
  tipsEn?: string[];
};

/**
 * Devuelve los campos de la sede en el locale solicitado, con fallback ES.
 * Útil para evitar `locale === 'en' ? sede.fooEn ?? sede.foo : sede.foo` en cada
 * uso en la página.
 */
export function getSedeLocalized(sede: SedeCity, locale: string): {
  cityName: string;
  countryName: string;
  shortIntro: string;
  heroEditorial: string;
  whyHere: string;
  aboutStadium: string;
  thingsToDo: { title: string; text: string }[];
  hotelAreas: { name: string; profile: string; bookingHint: string }[];
  gettingThere: string;
  tips: string[];
} {
  const en = locale === 'en';
  return {
    cityName: en && sede.cityNameEn ? sede.cityNameEn : sede.cityName,
    countryName: en && sede.countryNameEn ? sede.countryNameEn : sede.countryName,
    shortIntro: en && sede.shortIntroEn ? sede.shortIntroEn : sede.shortIntro,
    heroEditorial: en && sede.heroEditorialEn ? sede.heroEditorialEn : sede.heroEditorial,
    whyHere: en && sede.whyHereEn ? sede.whyHereEn : sede.whyHere,
    aboutStadium: en && sede.aboutStadiumEn ? sede.aboutStadiumEn : sede.aboutStadium,
    thingsToDo: en && sede.thingsToDoEn ? sede.thingsToDoEn : sede.thingsToDo,
    hotelAreas: en && sede.hotelAreasEn ? sede.hotelAreasEn : sede.hotelAreas,
    gettingThere: en && sede.gettingThereEn ? sede.gettingThereEn : sede.gettingThere,
    tips: en && sede.tipsEn ? sede.tipsEn : sede.tips,
  };
}

/**
 * Devuelve los locales en los que la sede tiene contenido editorial real.
 * Una sede tiene EN si los campos críticos (hero, why, stadium) están traducidos.
 */
export function sedeAvailableLocales(sede: SedeCity): readonly string[] {
  const hasEn = !!(sede.heroEditorialEn && sede.whyHereEn && sede.aboutStadiumEn);
  return hasEn ? ['es', 'en'] : ['es'];
}

export const SEDES_2026: SedeCity[] = [
  // ─── USA ──────────────────────────────────────────────────────
  {
    citySlug: 'atlanta',
    cityName: 'Atlanta',
    venueSlug: 'mercedes-benz-stadium',
    countryCode: 'USA',
    countryName: 'Estados Unidos',
    flag: '🇺🇸',
    timezone: 'EDT',
    utcOffset: 'UTC−4 (en jun-jul, horario de verano)',
    coords: [33.7553, -84.4006],
    airport: { iata: 'ATL', name: 'Hartsfield-Jackson Atlanta International' },
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Mercedes_Benz_Stadium_time_lapse_capture_2017-08-13.jpg',
    shortIntro:
      'Atlanta acoge el debut de España (vs Cabo Verde) y otros 7 partidos en el Mercedes-Benz Stadium, con tejado retráctil y conexión metro al estadio.',
    shortIntroEn:
      'Atlanta hosts Spain\'s opener (vs Cape Verde) and 7 more matches at Mercedes-Benz Stadium, with a retractable roof and a direct subway link to the venue.',
    heroEditorial:
      'Atlanta es la sede más conectada del sur de Estados Unidos. Su aeropuerto Hartsfield-Jackson lleva años siendo el más transitado del mundo, así que es la entrada natural para fans europeos y latinoamericanos. Dentro de la ciudad, el Mercedes-Benz Stadium queda a pocos minutos del centro y conecta directamente por metro (línea MARTA, parada GWCC/CNN Center). Para España, además, es la sede del partido inaugural el 13 de junio: vs Cabo Verde a las 21:00 hora peninsular. La tarde del partido la avenida Centennial concentra una fan zone informal alrededor del Coca-Cola Museum y el Centennial Park.',
    whyHere:
      'Si vas a ver a España en su debut, Atlanta es donde aterrizas. Es la sede más fácil de llegar desde Madrid sin escalas (Iberia, Delta) y la única donde puedes ir andando del metro al estadio. Si te quedas un par de días extras, la oferta gastronómica del barrio histórico de West End y el Atlanta BeltLine son de las mejores experiencias urbanas del torneo.',
    aboutStadium:
      'Inaugurado en 2017, el Mercedes-Benz Stadium tiene una de las cubiertas retráctiles más vistosas del mundo: ocho pétalos de acero que se abren en menos de ocho minutos. Aforo Mundial: 75.000. Acoge 8 partidos: cinco de fase de grupos (incluido España-Cabo Verde), un dieciseisavos, un octavos y un cuartos. Es además casa habitual del Atlanta United (MLS), el club con más asistencia media de la liga estadounidense, y los Atlanta Falcons (NFL). En el partido España-Cabo Verde, el techo estará abierto si la temperatura permite (junio en Atlanta = 28-32°C).',
    thingsToDo: [
      {
        title: 'World of Coca-Cola',
        text: 'Pegado al estadio. Una hora con la familia / niños y la entrada cuesta unos 24 $.',
      },
      {
        title: 'Atlanta BeltLine',
        text: 'Camino peatonal/bici de 35 km que rodea la ciudad. Restaurantes pop-up y arte urbano.',
      },
      {
        title: 'Ponce City Market',
        text: 'Antiguo almacén Sears reconvertido en food hall + tiendas. Cervezas locales y empleados de Madrid expat.',
      },
      {
        title: 'Centennial Olympic Park',
        text: 'Parque del 96 con fan zone improvisada los días de partido.',
      },
    ],
    hotelAreas: [
      {
        name: 'Downtown / Centennial',
        profile: 'A 15 minutos andando del estadio, mismo metro',
        bookingHint: 'Hotel medio: 200-350 $/noche. Subida estimada del 30-50% en días de partido.',
      },
      {
        name: 'Midtown',
        profile: 'A 10 minutos en metro, ambiente más urbano y restaurantes',
        bookingHint: 'Mejor relación calidad-precio. 180-280 $/noche.',
      },
      {
        name: 'Buckhead',
        profile: 'Premium, residencial, lejos del estadio',
        bookingHint: 'Alto: 350-600 $/noche. Solo si buscas confort y vienes en transporte privado.',
      },
    ],
    gettingThere:
      'El metro MARTA conecta el aeropuerto ATL con el centro y el estadio en 30 minutos por 2,50 $. Es la opción más eficiente y la única recomendada en horas punta. Uber/Lyft funcionan pero pueden tardar el doble por congestión. Estacionar en el estadio: 50-80 $ por partido.',
    tips: [
      'En Atlanta hace mucho calor en junio. Llega al estadio dos horas antes para hidratarte sin agobios.',
      'El metro MARTA es seguro pero limitado a 4 líneas. Aprende la "Red" y la "Gold" si te alojas en Midtown.',
      'Si llegas con solo equipaje de mano puedes hacer todo el viaje sin coche de alquiler.',
    ],
  },
  {
    citySlug: 'boston',
    cityName: 'Boston',
    venueSlug: 'gillette-stadium',
    countryCode: 'USA',
    countryName: 'Estados Unidos',
    flag: '🇺🇸',
    timezone: 'EDT',
    utcOffset: 'UTC−4',
    coords: [42.0909, -71.2643],
    airport: { iata: 'BOS', name: 'Logan International' },
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/d/db/Gillette_Stadium_%28Top_View%29.jpg',
    shortIntro:
      'Boston (Foxborough) acoge 7 partidos del Mundial 2026 en el Gillette Stadium, casa de los New England Patriots. Combina sede mundialista con uno de los centros culturales más densos de USA.',
    shortIntroEn:
      'Boston (Foxborough) hosts 7 matches at Gillette Stadium, home of the New England Patriots, pairing a World Cup venue with one of the densest cultural hubs in the United States.',
    heroEditorial:
      'Boston tiene una particularidad: la ciudad histórica está en Boston, pero el estadio está en Foxborough, a 47 km al sur. La hora de viaje en coche o en autobús lanzadera es parte del ritual del fan americano (Patriots y Revolution juegan ahí desde 2002). El partido en Gillette Stadium funciona distinto al de otras sedes: la mayoría del público llega en coche, lo que cambia los tiempos de entrada y salida y reduce la fan zone urbana clásica. Boston Common y Fenway Park son el sitio donde verás aficiones internacionales reunidas las horas previas.',
    whyHere:
      'Boston es la sede con más peso cultural del Mundial. Camina por el Freedom Trail (sendero rojo de 4 km que une 16 sitios históricos), pasea por Harvard Yard (Cambridge), come en el North End italiano, y luego viajas al partido. Si te interesa el deporte y la historia americana, ninguna otra sede mezcla ambos como Boston.',
    aboutStadium:
      'Gillette Stadium fue inaugurado en 2002 y reformado en 2023 con una nueva torre lighthouse al lado norte. Capacidad Mundial: 65.000. Acoge 7 partidos: seis de fase de grupos y un dieciseisavos. Es la casa de los New England Patriots (NFL, seis Super Bowls con Tom Brady) y los New England Revolution (MLS). El campo tiene césped natural reinstalado para el Mundial (es césped artificial el resto del año, pero la FIFA exige natural). El barrio de Foxborough es residencial-rural, no esperes ambiente de ciudad alrededor.',
    thingsToDo: [
      {
        title: 'Freedom Trail',
        text: 'Recorrido rojo pintado en el suelo que une los 16 puntos históricos de la independencia americana.',
      },
      {
        title: 'Fenway Park',
        text: 'Estadio de béisbol más antiguo de USA (1912). Tour disponible aunque no haya partido.',
      },
      {
        title: 'Harvard / MIT',
        text: 'En Cambridge, al otro lado del Charles River. Dos paseadas con visitas guiadas gratis.',
      },
      {
        title: 'North End',
        text: 'Barrio italiano. Cena obligada antes o después del Mundial, Mike\'s Pastry, regina pizza.',
      },
    ],
    hotelAreas: [
      {
        name: 'Boston Downtown',
        profile: 'Centro histórico, 50 km al estadio',
        bookingHint: 'Mejor para experiencia ciudad. Hotel medio 280-450 $/noche.',
      },
      {
        name: 'Foxborough / Patriot Place',
        profile: 'A pie del estadio, oferta limitada',
        bookingHint: 'Renaissance Boston Patriot Place, el único de gran tamaño. Reserva 3 meses antes.',
      },
      {
        name: 'Providence (RI)',
        profile: 'A 30 km del estadio, ciudad alternativa',
        bookingHint: 'Más barato (180-280 $) y bonito. Buena opción para quien viene en coche.',
      },
    ],
    gettingThere:
      'Tren MBTA Commuter Rail desde Back Bay Station hasta Foxboro Station (lanzadera al estadio): solo opera en días de partido. 50 minutos, 12 $ ida y vuelta. En coche, 1 hora desde Boston por la I-95. Estacionar en el estadio: 60-80 $.',
    tips: [
      'Foxborough no tiene Uber/Lyft eficientes en días de partido. Trenes lanzadera o coche propio.',
      'La temperatura en junio en Massachusetts puede bajar de 18°C por la noche, lleva chaqueta para el partido.',
      'Si vas con familia, Patriot Place (junto al estadio) tiene tiendas y restaurantes para llenar la mañana.',
    ],
  },
  {
    citySlug: 'dallas',
    cityName: 'Dallas',
    venueSlug: 'att-stadium',
    countryCode: 'USA',
    countryName: 'Estados Unidos',
    flag: '🇺🇸',
    timezone: 'CDT',
    utcOffset: 'UTC−5',
    coords: [32.7473, -97.0945],
    airport: { iata: 'DFW', name: 'Dallas/Fort Worth International' },
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Arlington_June_2020_4_%28AT%26T_Stadium%29.jpg',
    shortIntro:
      'Dallas (Arlington) recibe 9 partidos del Mundial 2026, el AT&T Stadium es la sede con más partidos del torneo. Aforo Mundial 94.000 (FIFA lo nombra «Dallas Stadium»).',
    shortIntroEn:
      'Dallas (Arlington) hosts 9 matches at AT&T Stadium — the venue with the most matches of the tournament. World Cup capacity 94,000 (FIFA brands it "Dallas Stadium").',
    heroEditorial:
      'Si MetLife es la sede de la final y el Azteca la del partido inaugural, AT&T Stadium en Arlington es la sede que más partidos acoge: nueve, incluyendo una de las dos semifinales. Es el estadio más grande del mundo dedicado al fútbol americano y, ahora, también del Mundial. El barrio de Arlington (entre Dallas y Fort Worth) es prácticamente un complejo de estadios: AT&T Stadium para los Cowboys, Globe Life Field para los Texas Rangers (béisbol), y el AT&T Stadium recibe el Mundial. Es un sitio diseñado para grandes eventos con mucho aparcamiento, mucha gastronomía rápida, y un ambiente alejado del centro de Dallas en sí.',
    whyHere:
      'Dallas es probablemente la sede con la mejor relación temperatura-confort del Mundial. El AT&T Stadium tiene cubierta retráctil (clave en Texas en junio-julio) y aire acondicionado. Si vienes a ver una semifinal, esta sede ofrece una capacidad enorme y entradas más asequibles que NY o LA por la diferencia de demanda. La cultura tex-mex local añade un atractivo extra para el aficionado latino.',
    aboutStadium:
      'AT&T Stadium fue inaugurado en 2009 y revolucionó la forma en que se construyen estadios modernos: la pantalla de vídeo central tiene 49 metros de ancho y es la más grande del mundo. La cubierta retráctil se cierra completamente en 12 minutos. Capacidad Mundial: 94.000, la mayor de todo el torneo según FIFA, gracias a las butacas adicionales que sí se usan en Super Bowls. Acoge 9 partidos: cinco de fase de grupos, un dieciseisavos, un octavos, un cuartos y una semifinal el 14 de julio. Es propiedad del magnate Jerry Jones (Cowboys) y conocido por los aficionados como "Jerry World".',
    thingsToDo: [
      {
        title: 'Six Flags Over Texas',
        text: 'Parque temático original de la cadena, en Arlington al lado del estadio.',
      },
      {
        title: 'Sixth Floor Museum (Dallas)',
        text: 'En el Texas School Book Depository, museo del asesinato de JFK. Una hora justa.',
      },
      {
        title: 'Stockyards (Fort Worth)',
        text: 'Zona vaquera viva con desfile de toros dos veces al día. Honky-tonk Billy Bob\'s.',
      },
      {
        title: 'Klyde Warren Park',
        text: 'Parque urbano sobre la autopista en el centro de Dallas. Food trucks, conciertos.',
      },
    ],
    hotelAreas: [
      {
        name: 'Arlington Entertainment District',
        profile: 'Junto al estadio',
        bookingHint: 'Live! by Loews y Westin Dallas, los más cercanos. 250-400 $/noche.',
      },
      {
        name: 'Dallas Downtown',
        profile: 'A 30 km del estadio',
        bookingHint: 'Mejor experiencia ciudad. 220-380 $/noche. Coche/Uber al estadio.',
      },
      {
        name: 'Fort Worth Downtown',
        profile: 'A 30 km del estadio',
        bookingHint: 'Más barato, ambiente vaquero. 180-280 $/noche.',
      },
    ],
    gettingThere:
      'No hay metro a Arlington. Imprescindible coche, Uber o lanzadera. Desde DFW (aeropuerto), 25 minutos en coche. Estacionar en el estadio: 50-100 $. La FIFA está negociando bus lanzadera oficial desde DFW + Dallas Downtown, confirmar antes del torneo.',
    tips: [
      'Texas en junio-julio supera fácilmente los 40°C. Tener cubierta retráctil es un alivio real.',
      'No alquilar coche en Arlington en días de partido, el estacionamiento se agota y el tráfico es brutal.',
      'Probar barbacoa tejana de verdad: Pecan Lodge en Deep Ellum (Dallas), 2 horas de cola pero merece.',
    ],
  },
  {
    citySlug: 'houston',
    cityName: 'Houston',
    venueSlug: 'nrg-stadium',
    countryCode: 'USA',
    countryName: 'Estados Unidos',
    flag: '🇺🇸',
    timezone: 'CDT',
    utcOffset: 'UTC−5',
    coords: [29.6847, -95.4107],
    airport: { iata: 'IAH', name: 'George Bush Intercontinental' },
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Nrg_stadium.jpg',
    shortIntro:
      'Houston acoge 7 partidos del Mundial 2026 en el NRG Stadium, casa de los Texans. La ciudad latina más grande de USA tras Miami.',
    shortIntroEn:
      'Houston hosts 7 World Cup 2026 matches at NRG Stadium, home of the Texans. The largest Latino city in the United States after Miami.',
    heroEditorial:
      'Houston es la cuarta ciudad más grande de Estados Unidos y la más diversa: se hablan más de 145 idiomas en sus calles, una cuarta parte de la población es de origen latinoamericano, y la influencia mexicana es tan fuerte que muchas señales son bilingües. Esto hace de Houston, junto con Miami, la sede más cómoda para el aficionado hispanohablante: comer en español, hablar con taxistas en español, y encontrar peñas mundialistas en cada barrio es habitual. El NRG Stadium tiene cubierta retráctil, necesaria, porque junio-julio en Houston puede superar los 38°C con humedad oceánica.',
    whyHere:
      'Si quieres una sede USA donde el español sea de uso diario y el ambiente festivo se note desde que aterrizas, Houston es la opción. La NASA está aquí (Space Center Houston), la cocina tex-mex original también, y los precios son más bajos que en NY/LA/Miami.',
    aboutStadium:
      'NRG Stadium se inauguró en 2002 y fue el primer estadio de la NFL con cubierta retráctil. Capacidad Mundial: 72.000. Acoge 7 partidos: seis de fase de grupos y un dieciseisavos. Es casa de los Houston Texans (NFL) y se ubica en el complejo NRG Park, donde también se celebran cada año los Houston Livestock Show and Rodeo (la mayor feria ganadera del mundo). El partido tipo Mundial tendrá la cubierta cerrada, la temperatura interior se mantiene a 22°C.',
    thingsToDo: [
      {
        title: 'Space Center Houston',
        text: 'NASA. Mejor que el de Cabo Cañaveral si te interesan los Apollo originales.',
      },
      {
        title: 'Museum District',
        text: '19 museos en 1,5 millas. El Museum of Fine Arts y el Museum of Natural Science son los top.',
      },
      {
        title: 'Houston Livestock Show',
        text: 'Si caes a tiempo (marzo-abril). En verano, el Galleria Mall sustituye como gran centro social.',
      },
      {
        title: 'Hermann Park',
        text: 'Parque urbano con tren a escala y reflecting pool al estilo Washington.',
      },
    ],
    hotelAreas: [
      {
        name: 'Galleria / Uptown',
        profile: 'Zona de compras y oficinas, a 15 minutos del estadio',
        bookingHint: 'Mejor relación calidad-precio. 180-280 $/noche.',
      },
      {
        name: 'Downtown Houston',
        profile: 'Centro, museos y restaurantes',
        bookingHint: '220-350 $/noche. Mejor para quienes no alquilen coche.',
      },
      {
        name: 'Medical Center / Museum District',
        profile: 'Cerca del estadio, ambiente más tranquilo',
        bookingHint: 'TMC Hilton, Marriott. 200-320 $/noche.',
      },
    ],
    gettingThere:
      'El metrorail (METRORail Red Line) conecta el centro con NRG Park en 25 minutos por 1,25 $. La opción más cómoda. Desde IAH (aeropuerto), 35 minutos en coche o 1 hora en transporte público combinado. Uber al estadio en día de partido: 25-40 $.',
    tips: [
      'Houston junio-julio: 38°C con 90% humedad. La cubierta cerrada del NRG es tu mejor amigo.',
      'Probar Tex-Mex en Ninfa\'s on Navigation (el original) o en El Tiempo Cantina.',
      'Si te interesa el espacio, el Space Center merece un día completo, no medio.',
    ],
  },
  {
    citySlug: 'kansas-city',
    cityName: 'Kansas City',
    venueSlug: 'arrowhead-stadium',
    countryCode: 'USA',
    countryName: 'Estados Unidos',
    flag: '🇺🇸',
    timezone: 'CDT',
    utcOffset: 'UTC−5',
    coords: [39.0489, -94.4839],
    airport: { iata: 'MCI', name: 'Kansas City International' },
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Aerial_view_of_Arrowhead_Stadium_08-31-2013.jpg',
    shortIntro:
      'Kansas City acoge 6 partidos del Mundial 2026 en el Arrowhead Stadium, conocido por ser el más ruidoso de la NFL. Capital de la barbacoa americana.',
    shortIntroEn:
      'Kansas City hosts 6 World Cup 2026 matches at Arrowhead Stadium, famous as the loudest venue in the NFL. The capital of American barbecue.',
    heroEditorial:
      'El Arrowhead Stadium tiene un récord Guinness por ruido en evento deportivo (142,2 dB en 2014, gracias a los Chiefs fans). Esto convierte a Kansas City en la sede del Mundial 2026 con mayor volumen ambiental garantizado. El estadio es de los más antiguos del torneo (1972) y el más característico estéticamente: gradas blancas en forma de flecha que dan nombre al sitio. Kansas City como ciudad es famosa por la barbacoa (KC-style barbecue es uno de los cuatro estilos clásicos de USA), el jazz histórico (en torno a la 18th & Vine), y por estar exactamente en el centro geográfico del país.',
    whyHere:
      'Kansas City es la sede menos turística del Mundial y por eso la más americana de raíz. Si quieres ver un partido sin las masas de fans europeos y latinos que llenarán LA, Miami o NY, ésta es tu opción. Comida brutal, precios accesibles y ambiente NFL puro.',
    aboutStadium:
      'Arrowhead Stadium fue inaugurado en 1972 y reformado en 2010. Capacidad Mundial: 73.000. Acoge 6 partidos de fase de grupos. Es la casa de los Kansas City Chiefs, equipo dominante de la NFL en los últimos años (3 Super Bowls 2020-2024). El campo lleva césped natural, sin cubierta. La FIFA exige reformar el sistema de aspersión y temperatura de raíz para que el césped soporte el verano de Missouri.',
    thingsToDo: [
      {
        title: 'Joe\'s Kansas City Bar-B-Que',
        text: 'En una gasolinera, sí. Mejor brisket de la ciudad. Cola de 1 hora pero vale cada minuto.',
      },
      {
        title: '18th & Vine Jazz District',
        text: 'Cuna del Kansas City jazz. Negro Leagues Baseball Museum + American Jazz Museum.',
      },
      {
        title: 'Country Club Plaza',
        text: 'Zona de compras al estilo español-andaluz. Centro neurálgico para cenas y bares.',
      },
      {
        title: 'National WWI Museum',
        text: 'Mejor museo de la Primera Guerra Mundial en USA. Liberty Memorial torre con vistas.',
      },
    ],
    hotelAreas: [
      {
        name: 'Power & Light District',
        profile: 'Centro animado con bares y restaurantes',
        bookingHint: '160-260 $/noche. Mejor opción para quien no alquile coche.',
      },
      {
        name: 'Country Club Plaza',
        profile: 'Compras + restaurantes premium',
        bookingHint: '200-320 $/noche. Ambiente más calmo.',
      },
      {
        name: 'Crown Center',
        profile: 'Hotel zone con tren conector al centro',
        bookingHint: '150-240 $/noche.',
      },
    ],
    gettingThere:
      'Sin metro. Coche imprescindible: 20 minutos del aeropuerto MCI al estadio, 15 desde el centro. Estacionar en Arrowhead: 30-50 $. La FIFA habilita lanzaderas desde el centro en días de partido, confirmar precio.',
    tips: [
      'Probar las dos religiones de KC: barbacoa (Joe\'s, Q39, Arthur Bryant\'s) y jazz (Green Lady Lounge).',
      'Junio en Missouri: 28-32°C con tormentas de tarde frecuentes. Llevar chubasquero al estadio.',
      'No subestimar la distancia interna, Kansas City tiene 815 km² (más que Madrid+Barcelona).',
    ],
  },
  {
    citySlug: 'los-angeles',
    cityName: 'Los Ángeles',
    venueSlug: 'sofi-stadium',
    countryCode: 'USA',
    countryName: 'Estados Unidos',
    flag: '🇺🇸',
    timezone: 'PDT',
    utcOffset: 'UTC−7',
    coords: [33.9534, -118.3387],
    airport: { iata: 'LAX', name: 'Los Angeles International' },
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/SoFi_Stadium_2023.jpg',
    shortIntro:
      'Los Ángeles acoge 8 partidos del Mundial 2026 en SoFi Stadium, el más caro jamás construido (5.000 millones $). Inglewood, junto al aeropuerto LAX.',
    shortIntroEn:
      'Los Angeles hosts 8 World Cup 2026 matches at SoFi Stadium, the most expensive stadium ever built ($5 billion). Inglewood, next to LAX airport.',
    heroEditorial:
      'SoFi Stadium se inauguró en 2020 y costó 5.000 millones de dólares, más que cualquier estadio de la historia. Su diseño es revolucionario: cubierta semi-abierta de ETFE traslúcido (no es retráctil, está siempre semi-cerrada) y una pantalla central llamada Infinity Screen, anillo de vídeo de 360° con 80 metros de diámetro suspendido sobre el campo. Inglewood, donde está, queda a 8 km del aeropuerto LAX y a 15 km del centro de LA. Para el aficionado europeo, SoFi es probablemente la sede más fotogénica del Mundial: nada de lo que has visto antes en un partido se parece visualmente a esto.',
    whyHere:
      'Los Ángeles tiene de todo: estadio espectacular, ciudad mítica, playa, Hollywood y comunidad latina enorme. La oferta gastronómica latinoamericana es la mejor de USA. Pero también es la sede más cara: hoteles, comidas, taxis, todo sube en junio-julio.',
    aboutStadium:
      'SoFi Stadium tiene capacidad Mundial de 70.000 personas. Acoge 8 partidos: cinco de fase de grupos, un dieciseisavos, un octavos y un cuartos. Es casa de dos equipos NFL (Rams y Chargers, único caso del torneo). El campo tiene césped natural (Field Turf el resto del año, FIFA exige natural). El Infinity Screen, la pantalla circular suspendida, es el elemento más comentado por los visitantes. La cubierta semi-abierta deja entrar luz natural pero protege de la lluvia (rara en LA en junio-julio).',
    thingsToDo: [
      {
        title: 'Hollywood Walk of Fame',
        text: 'Estrellas en la acera + TCL Chinese Theatre. Una hora rápida.',
      },
      {
        title: 'Santa Monica Pier + Venice Beach',
        text: 'Día completo. La California que esperabas: surfistas, tablas, atardecer Pacífico.',
      },
      {
        title: 'Griffith Observatory',
        text: 'Vistas de la ciudad y del cartel de Hollywood. Gratis. Ideal al atardecer.',
      },
      {
        title: 'East LA / Boyle Heights',
        text: 'Tacos auténticos: Mariscos Jaliscos, Birria-Landia, El Mercado. La auténtica LA latina.',
      },
    ],
    hotelAreas: [
      {
        name: 'Inglewood / LAX',
        profile: 'Junto al estadio y al aeropuerto',
        bookingHint: 'AC Marriott LAX, Westin LAX. 220-380 $/noche. Limitada oferta cerca de SoFi.',
      },
      {
        name: 'Santa Monica',
        profile: 'Playa, ambiente turístico',
        bookingHint: '350-600 $/noche en pico de Mundial. Ferry/UberX al estadio.',
      },
      {
        name: 'Downtown / DTLA',
        profile: 'Centro animado',
        bookingHint: '280-450 $/noche. Bien comunicado por Metro Crenshaw Line al estadio.',
      },
      {
        name: 'Manhattan Beach / Hermosa',
        profile: 'Playa más tranquila que Santa Monica',
        bookingHint: '300-500 $/noche. Más cerca del estadio que Santa Monica.',
      },
    ],
    gettingThere:
      'La nueva Metro K Line (Crenshaw/LAX) llega hasta Hawthorne, a 1 km del estadio. Lanzadera incluida en el ticket de Mundial. Desde LAX directamente, 15 minutos en coche, 30 en transporte combinado. Estacionar en SoFi: 80-150 $.',
    tips: [
      'Empezar visita en SoFi 3 horas antes del kickoff: la fan zone y el Infinity Screen merecen tiempo.',
      'No subestimar el tráfico de LA, calcula doble del tiempo Google.',
      'Junio en LA: 22-26°C, fresco para los estándares USA. Lleva chaqueta para la noche.',
    ],
  },
  {
    citySlug: 'miami',
    cityName: 'Miami',
    venueSlug: 'hard-rock-stadium',
    countryCode: 'USA',
    countryName: 'Estados Unidos',
    flag: '🇺🇸',
    timezone: 'EDT',
    utcOffset: 'UTC−4',
    coords: [25.9579, -80.2389],
    airport: { iata: 'MIA', name: 'Miami International' },
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Hard_Rock_Stadium_for_Super_Bowl_LIV_%2849606710103%29.jpg',
    shortIntro:
      'Miami (Miami Gardens) acoge 7 partidos del Mundial 2026 en el Hard Rock Stadium. Capital del fútbol latino en USA, casa de Lionel Messi (Inter Miami).',
    shortIntroEn:
      'Miami (Miami Gardens) hosts 7 World Cup 2026 matches at Hard Rock Stadium. The capital of Latin football in the U.S. and the home of Lionel Messi (Inter Miami).',
    heroEditorial:
      'Si hay una sede americana donde el ambiente del Mundial 2026 va a sentirse más latino, es Miami. Tres cuartas partes de la población hablan español como primer idioma, el Inter Miami CF (con Messi desde 2023) ha cambiado el panorama futbolístico local, y el Hard Rock Stadium acoge históricamente final de la Copa América (2024 fue allí). Junio-julio en Miami es temporada de huracanes, el estadio tiene cubierta parcial (solo cubre las tribunas, no el campo), y los partidos de tarde pueden verse afectados por tormentas tropicales. La FIFA tiene protocolo específico de delay weather.',
    whyHere:
      'Miami es la sede más latina del Mundial 2026. Si vienes desde España o LATAM, te sentirás como en casa: idioma, comida, música. Si quieres rendir homenaje a Messi en su nueva ciudad, Inter Miami juega en el DRV PNK Stadium (no en Hard Rock), pero verás su imagen por todas partes.',
    aboutStadium:
      'Hard Rock Stadium se inauguró en 1987 y se reformó completamente en 2016 con cubierta nueva. Capacidad Mundial: 65.000. Acoge 7 partidos: seis de fase de grupos y un cuartos. Es casa de los Miami Dolphins (NFL) y de la Copa Miami Open (tenis). El campo tiene césped natural reinstalado para el Mundial. El barrio de Miami Gardens, donde está, queda a 25 km al norte de South Beach.',
    thingsToDo: [
      {
        title: 'South Beach',
        text: 'La playa icónica. Ocean Drive, Lincoln Road, gente guapa, atardeceres con palmeras.',
      },
      {
        title: 'Little Havana',
        text: 'Calle Ocho y dominó en Domino Park. Mojitos en Versailles. Auténtico cubano.',
      },
      {
        title: 'Wynwood Walls',
        text: 'Distrito de arte urbano con restaurantes hipster y cervecerías.',
      },
      {
        title: 'Cayo Vizcaíno (Key Biscayne)',
        text: 'Playas más tranquilas que South Beach. Crandon Park y faro de Cape Florida.',
      },
    ],
    hotelAreas: [
      {
        name: 'South Beach',
        profile: 'Playa, ambiente nocturno, lejos del estadio',
        bookingHint: '350-700 $/noche en pico Mundial. Hotel Art Decó icónicos.',
      },
      {
        name: 'Brickell / Downtown',
        profile: 'Financiero, rascacielos, mid distance del estadio',
        bookingHint: '280-500 $/noche. Mejor para quien busque ciudad.',
      },
      {
        name: 'Aventura / Sunny Isles',
        profile: 'Cerca del estadio, ambiente residencial latino',
        bookingHint: '220-380 $/noche. Más afín al fan internacional.',
      },
    ],
    gettingThere:
      'No hay metro al estadio. Coche, Uber o lanzadera FIFA. Desde MIA, 30 minutos. Desde South Beach, 35-50 minutos según tráfico. Estacionar en Hard Rock: 80-120 $. La FIFA negocia bus lanzadera oficial desde Brickell y Aventura.',
    tips: [
      'Junio-julio es temporada de huracanes. Comprueba Weather Channel 48h antes del partido.',
      'South Beach vs Estadio: 50 minutos. Sal con tiempo, el tráfico de I-95 es brutal.',
      'Probar Joe\'s Stone Crab (en temporada) y un café cubano en Versailles antes del partido.',
    ],
  },
  {
    citySlug: 'nueva-york',
    cityName: 'Nueva York / Nueva Jersey',
    cityNameEn: 'New York / New Jersey',
    venueSlug: 'metlife-stadium',
    countryCode: 'USA',
    countryName: 'Estados Unidos',
    countryNameEn: 'United States',
    flag: '🇺🇸',
    timezone: 'EDT',
    utcOffset: 'UTC−4',
    coords: [40.8128, -74.0742],
    airport: { iata: 'EWR', name: 'Newark Liberty International' },
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Metlife_stadium_%28Aerial_view%29.jpg',
    shortIntro:
      'Nueva York/Nueva Jersey acoge 8 partidos del Mundial 2026 en el MetLife Stadium, INCLUIDA LA FINAL del 19 de julio. Aforo 82.500.',
    shortIntroEn:
      'New York/New Jersey hosts 8 World Cup 2026 matches at MetLife Stadium, INCLUDING THE FINAL on July 19. Capacity 82,500.',
    heroEditorial:
      'MetLife Stadium es la sede de la final del Mundial 2026. El 19 de julio a las 15:00 ET (21:00 hora peninsular española), el equipo campeón levantará la copa en East Rutherford, Nueva Jersey, a 8 km en línea recta del Empire State Building. La elección no es casual: Nueva York es la marca global más reconocible, MetLife es uno de los pocos estadios del mundo capaz de acoger más de 80.000 personas con seguridad de Super Bowl, y la conexión transatlántica desde EWR/JFK es óptima. Para el aficionado, alojarse en Manhattan y desplazarse al estadio cada día es el plan más razonable: el bus dedicado tarda 25 minutos al Lincoln Tunnel.',
    heroEditorialEn:
      'MetLife Stadium is the venue of the 2026 World Cup final. On July 19 at 3:00 PM ET, the world champions will lift the trophy in East Rutherford, New Jersey, just 8 km in a straight line from the Empire State Building. The choice is no accident: New York is the world\'s most recognisable brand, MetLife is one of the few stadiums on the planet able to host more than 80,000 people at Super Bowl-grade security, and the transatlantic connection from EWR/JFK is unmatched. For the travelling fan, staying in Manhattan and commuting to the stadium each match day is the most reasonable plan: the dedicated bus takes 25 minutes through the Lincoln Tunnel.',
    whyHere:
      'Nueva York es la sede que cierra el torneo: la final y la ciudad icono del mundo a la vez. Si solo puedes permitirte un viaje al Mundial, apunta al MetLife: la final es siempre la final y la ciudad alrededor es Nueva York. El plan no es barato (350-700 $/noche en Manhattan en julio) pero es único.',
    whyHereEn:
      'New York is the host city that closes the tournament: the final and the world\'s iconic city in one trip. If you can only afford one World Cup trip, point it at MetLife: the final is always the final and the city around it is New York. It is not cheap ($350-700/night in Manhattan in July) but it is one of a kind.',
    aboutStadium:
      'MetLife Stadium se inauguró en 2010 reemplazando al Giants Stadium original. Capacidad Mundial: 82.500. Acoge 8 partidos: cinco de fase de grupos, un dieciseisavos, un cuartos y la final del 19 de julio. Es la casa de dos equipos de la NFL (Giants y Jets). FIFA ha negociado la reformación del nombre durante el torneo: oficialmente será "New York New Jersey Stadium" del 11 de junio al 19 de julio (la marca MetLife está prohibida en torneo FIFA). El campo es césped natural reinstalado.',
    aboutStadiumEn:
      'MetLife Stadium opened in 2010, replacing the original Giants Stadium. World Cup capacity: 82,500. It hosts 8 matches: five in the group stage, one Round of 32, one quarter-final and the final on July 19. The venue is the home of two NFL franchises (Giants and Jets). FIFA has negotiated a name change during the tournament: it will officially be the "New York New Jersey Stadium" from June 11 to July 19 (MetLife branding is banned at FIFA tournaments). The pitch is freshly laid natural grass.',
    thingsToDo: [
      { title: 'Times Square + Broadway', text: 'Espectáculo nocturno + un musical al menos. Hamilton, Wicked, Lion King, reservar 2 meses antes.' },
      { title: 'Central Park', text: 'Pic-nic, Belvedere Castle, Bow Bridge. Mejor opción para escapar del calor.' },
      { title: 'Brooklyn Bridge / DUMBO', text: 'Cruzar el puente al amanecer. Dumbo brooklyn para fotos icónicas.' },
      { title: 'High Line + Chelsea Market', text: 'Parque elevado de 2,3 km en una antigua vía de tren. Termina en el Hudson.' },
    ],
    thingsToDoEn: [
      { title: 'Times Square + Broadway', text: 'Evening neon show plus at least one musical. Hamilton, Wicked, Lion King — book 2 months ahead.' },
      { title: 'Central Park', text: 'Picnic, Belvedere Castle, Bow Bridge. The best way to escape the July heat.' },
      { title: 'Brooklyn Bridge / DUMBO', text: 'Walk the bridge at sunrise. DUMBO Brooklyn for the iconic skyline shots.' },
      { title: 'High Line + Chelsea Market', text: 'Elevated 2.3 km park on an old rail line, ends on the Hudson waterfront.' },
    ],
    hotelAreas: [
      { name: 'Midtown Manhattan', profile: 'Times Square, Empire State, Broadway', bookingHint: '350-700 $/noche en julio. Pico Mundial.' },
      { name: 'Lower Manhattan / Financial District', profile: 'Wall Street, World Trade Center', bookingHint: '280-500 $/noche. Más calmo y bien conectado.' },
      { name: 'Brooklyn (Williamsburg / DUMBO)', profile: 'Más auténtico, hipster, vistas Manhattan', bookingHint: '250-400 $/noche. 30 min en metro al estadio.' },
      { name: 'Jersey City / Hoboken', profile: 'Más cerca de MetLife, vistas a Manhattan', bookingHint: '220-380 $/noche. La opción más práctica para el partido.' },
    ],
    hotelAreasEn: [
      { name: 'Midtown Manhattan', profile: 'Times Square, Empire State, Broadway', bookingHint: '$350-700/night in July — World Cup peak.' },
      { name: 'Lower Manhattan / Financial District', profile: 'Wall Street, World Trade Center', bookingHint: '$280-500/night. Calmer and well connected.' },
      { name: 'Brooklyn (Williamsburg / DUMBO)', profile: 'More authentic, hip, Manhattan skyline views', bookingHint: '$250-400/night. 30 min by subway to the stadium.' },
      { name: 'Jersey City / Hoboken', profile: 'Closer to MetLife, Manhattan skyline views', bookingHint: '$220-380/night. The most practical option for matchdays.' },
    ],
    gettingThere:
      'Tren NJ Transit Meadowlands Rail Line al estadio (solo días de partido), 25 minutos desde Penn Station por 5 $. La opción oficial. Coche: peajes y estacionamiento de 50-100 $. Uber: 80-150 $ por el peaje del Lincoln Tunnel.',
    gettingThereEn:
      'NJ Transit Meadowlands Rail Line straight to the stadium (matchdays only), 25 minutes from Penn Station for $5 — the official option. By car: tolls and parking $50-100. Uber: $80-150 including the Lincoln Tunnel toll.',
    tips: [
      'Reservar entradas para musicales, restaurantes, atracciones con 2-3 meses de adelanto.',
      'Comprar MetroCard al llegar y usar metro NYC + NJ Transit. Es la única forma sensata de moverse.',
      'Para la final del 19 jul, llegar al estadio 4 horas antes, controles de seguridad serán Super Bowl-level.',
    ],
    tipsEn: [
      'Book musicals, restaurants and attractions 2-3 months in advance.',
      'Buy a MetroCard on arrival and use NYC Subway + NJ Transit. It is the only sensible way to get around.',
      'For the July 19 final, arrive at the stadium 4 hours early — security checks will be Super Bowl-grade.',
    ],
  },
  {
    citySlug: 'philadelphia',
    cityName: 'Philadelphia',
    venueSlug: 'lincoln-financial-field',
    countryCode: 'USA',
    countryName: 'Estados Unidos',
    flag: '🇺🇸',
    timezone: 'EDT',
    utcOffset: 'UTC−4',
    coords: [39.9008, -75.1675],
    airport: { iata: 'PHL', name: 'Philadelphia International' },
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Lincoln_Financial_Field_%28Aerial_view%29.jpg',
    shortIntro:
      'Philadelphia acoge 6 partidos del Mundial 2026 en el Lincoln Financial Field. Cuna histórica de USA, Filadelfia es la sede menos turística pero más densa culturalmente del corredor noreste.',
    shortIntroEn:
      'Philadelphia hosts 6 World Cup 2026 matches at Lincoln Financial Field. The birthplace of the United States, Philly is the least touristic but most culturally dense venue on the Northeast corridor.',
    heroEditorial:
      'Filadelfia es la primera capital de Estados Unidos: aquí se firmó la Declaración de Independencia (1776) y la Constitución (1787). El Lincoln Financial Field, sede del Mundial 2026, está en el South Philadelphia Sports Complex, junto al estadio de los Phillies (béisbol) y el Wells Fargo Center (básquet, hockey). Es uno de los pocos lugares de USA donde tres deportes profesionales mayores se concentran en un mismo barrio. La ciudad es además el sitio de los Eagles fans, conocidos por ser los más intensos de la NFL, el ambiente del partido tipo Mundial heredará algo de esa intensidad local.',
    whyHere:
      'Philadelphia ofrece densidad histórica única en USA + ambiente fan auténtico + corredor noreste accesible (a 90 minutos de NY en tren). Si vas a la final en MetLife, hacer escala 2 noches en Filadelfia es razonable.',
    aboutStadium:
      'Lincoln Financial Field se inauguró en 2003. Capacidad Mundial: 69.000. Acoge 6 partidos de fase de grupos. Es la casa de los Philadelphia Eagles (NFL, Super Bowl 2018) y se ubica en South Philadelphia, a 5 km del centro histórico. El campo tiene césped natural. La FIFA reforma el sistema de iluminación específicamente para el torneo (los partidos del Mundial requieren más lux que la NFL).',
    thingsToDo: [
      {
        title: 'Independence Hall + Liberty Bell',
        text: 'Donde se firmó la Constitución. Visita gratis con reserva. 1 hora.',
      },
      {
        title: 'Reading Terminal Market',
        text: 'Mercado cubierto de 1893. Probar Philly cheesesteak (Pat\'s o Geno\'s).',
      },
      {
        title: 'Philadelphia Museum of Art',
        text: 'Las "Rocky Steps" del Stallone. Subirlas y bajar la mano arriba es ritual.',
      },
      {
        title: 'Old City',
        text: 'Casas coloniales. Elfreth\'s Alley, la calle habitada continuamente más antigua de USA.',
      },
    ],
    hotelAreas: [
      {
        name: 'Center City / Rittenhouse Square',
        profile: 'Centro histórico y financiero',
        bookingHint: '180-320 $/noche. Mejor base para todo.',
      },
      {
        name: 'University City',
        profile: 'Cerca de Penn y Drexel',
        bookingHint: '160-260 $/noche. Más calmo.',
      },
      {
        name: 'South Philadelphia',
        profile: 'Cerca del estadio',
        bookingHint: '140-220 $/noche. Hotel limit, mucho Airbnb.',
      },
    ],
    gettingThere:
      'Metro SEPTA Broad Street Line: del centro al estadio en 12 minutos por 2,50 $. Es lo más eficiente. Desde PHL aeropuerto, tren SEPTA 30 minutos al centro.',
    tips: [
      'Pedir cheesesteak con "wiz" significa con Cheez Whiz (queso americano clásico). Sin "wiz" = provolone o american.',
      'La I-95 que conecta NYC-Philly-DC es la autopista más usada del país. Mejor tren Amtrak.',
      'Junio-julio en Philadelphia: 28-32°C con humedad. Llevar agua al estadio.',
    ],
  },
  {
    citySlug: 'san-francisco-bay-area',
    cityName: 'San Francisco Bay Area',
    venueSlug: 'levis-stadium',
    countryCode: 'USA',
    countryName: 'Estados Unidos',
    flag: '🇺🇸',
    timezone: 'PDT',
    utcOffset: 'UTC−7',
    coords: [37.4031, -121.9697],
    airport: { iata: 'SFO', name: 'San Francisco International' },
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Levi%27s_Stadium_in_February_2016_prior_to_Super_Bowl_50_%2824398261729%29.jpg',
    shortIntro:
      'San Francisco Bay Area acoge 6 partidos del Mundial 2026 en Levi\'s Stadium (Santa Clara), a 70 km de SF. Sede tecnológica del Silicon Valley.',
    shortIntroEn:
      'The San Francisco Bay Area hosts 6 World Cup 2026 matches at Levi\'s Stadium (Santa Clara), 70 km from SF. The tech-driven Silicon Valley host city.',
    heroEditorial:
      'Levi\'s Stadium se ubica en Santa Clara, en pleno Silicon Valley, a 70 km al sur de San Francisco. Es la sede más nueva de las que acogen el Mundial en California (2014, los Niners pasaron del Candlestick Park al Levi\'s) y el primer estadio profesional con certificación LEED Gold de eficiencia energética. Para el aficionado europeo, "ir al Mundial a San Francisco" requiere precisión geográfica: el estadio NO está en SF. Está más cerca de San José que de San Francisco. La opción razonable para el viajero es alojarse en SF y hacer el viaje en tren Caltrain (90 minutos) los días de partido.',
    whyHere:
      'La Bay Area junta lo mejor: SF es una de las ciudades más bonitas de USA, el Silicon Valley es un fenómeno cultural en sí mismo y Napa Valley queda a 90 minutos al norte para escapadas de vino. Si te gusta la tecnología o el vino, esta sede da más juego que el propio partido.',
    aboutStadium:
      'Levi\'s Stadium se inauguró en 2014. Capacidad Mundial: 71.000. Acoge 6 partidos de fase de grupos. Es la casa de los San Francisco 49ers (NFL, el equipo más exitoso de la liga en los 80-90 con Joe Montana y Steve Young). El campo es césped natural y, a diferencia de la mayoría de los estadios, no tiene cubierta (clima Bay Area es predecible y seco). Junio-julio en Santa Clara: 23-28°C, sin lluvia. Condiciones perfectas.',
    thingsToDo: [
      {
        title: 'Golden Gate Bridge',
        text: 'Cruzar el puente caminando o en bici (Sausalito y vuelta en ferry).',
      },
      {
        title: 'Alcatraz',
        text: 'Reservar entradas con 2 meses. La cárcel + audio guía es de los mejores tours de USA.',
      },
      {
        title: 'Napa Valley',
        text: 'Día de catas a 90 minutos al norte. El francés/italiano del vino californiano.',
      },
      {
        title: 'Computer History Museum',
        text: 'En Mountain View, junto a Google. Para entender el Silicon Valley.',
      },
    ],
    hotelAreas: [
      {
        name: 'San Francisco Downtown',
        profile: 'Union Square, Embarcadero. A 70 km del estadio',
        bookingHint: '320-550 $/noche en pico Mundial. Mejor para experiencia ciudad.',
      },
      {
        name: 'Santa Clara / San José',
        profile: 'Junto al estadio',
        bookingHint: '220-380 $/noche. Perfecto para fans no interesados en SF.',
      },
      {
        name: 'Palo Alto / Mountain View',
        profile: 'Silicon Valley puro',
        bookingHint: '280-450 $/noche. Cerca de Google, Stanford.',
      },
    ],
    gettingThere:
      'Caltrain (tren) desde SF Downtown a Mountain View, después VTA Light Rail a Santa Clara: 90 minutos total. Si vienes en avión y solo te interesa el partido, San José Mineta (SJC) está a solo 6 km del estadio (vs 45 km de SFO). Lanzadera FIFA desde SF Downtown directa al estadio en días de partido. Coche: 70 km, 1-2 horas según tráfico.',
    tips: [
      'San Francisco es siempre fría, la temperatura media de junio es 18°C. Llevar abrigo de verdad.',
      'No alquilar coche en SF, caro, multas brutales, casi imposible aparcar.',
      'Si vas a Napa: reservar restaurantes (French Laundry, Bouchon) con 6 meses de antelación.',
    ],
  },
  {
    citySlug: 'seattle',
    cityName: 'Seattle',
    venueSlug: 'lumen-field',
    countryCode: 'USA',
    countryName: 'Estados Unidos',
    flag: '🇺🇸',
    timezone: 'PDT',
    utcOffset: 'UTC−7',
    coords: [47.5952, -122.3316],
    airport: { iata: 'SEA', name: 'Seattle-Tacoma International' },
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Qwest_Field_North.jpg',
    shortIntro:
      'Seattle acoge 6 partidos del Mundial 2026 en Lumen Field, junto al T-Mobile Park y a 1 km del centro. La sede más cerca de Canadá del Mundial.',
    shortIntroEn:
      'Seattle hosts 6 World Cup 2026 matches at Lumen Field, next to T-Mobile Park and 1 km from downtown. The closest host city to Canada in the tournament.',
    heroEditorial:
      'Lumen Field está en pleno centro de Seattle, a 1 km de Pike Place Market y a 25 km del aeropuerto SEA. Es la sede del Mundial más caminable: del centro al estadio se llega andando en 15 minutos. Seattle es además la ciudad más cercana a Canadá del torneo (160 km a Vancouver) lo que crea un cluster norteño con BC Place. La cultura de Seattle es Starbucks, Amazon, Microsoft, Boeing y café de origen. Junio-julio: 22-26°C, sol intenso, sin lluvia (al revés del cliché, el verano es seco aquí).',
    whyHere:
      'Seattle es la sede del noroeste pacífico, única, con identidad propia, y combinable con Vancouver para hacer cluster Canadá-USA. Si te interesan la tecnología, el café, el grunge histórico, o las islas San Juan, ésta es tu sede.',
    aboutStadium:
      'Lumen Field se inauguró en 2002 (entonces Qwest Field). Capacidad Mundial: 69.000. Acoge 6 partidos de fase de grupos. Es la casa de los Seattle Seahawks (NFL, Super Bowl 2014) y los Seattle Sounders FC (MLS). Tiene la mayor asistencia media de cualquier equipo de la MLS (~40.000), por lo que el ambiente futbolístico local es real. Cubierta parcial: cubre las gradas pero no el campo. El campo es césped natural, clima Pacific Northwest es ideal.',
    thingsToDo: [
      {
        title: 'Pike Place Market',
        text: 'Mercado original de pescado lanzado por aire. Café Starbucks original (al lado).',
      },
      {
        title: 'Space Needle',
        text: 'Torre de 1962 con vistas a la ciudad. Ir al atardecer.',
      },
      {
        title: 'Chihuly Garden and Glass',
        text: 'Junto a la Space Needle. Esculturas de cristal soplado de Dale Chihuly.',
      },
      {
        title: 'Discovery Park',
        text: '210 hectáreas con vistas al Puget Sound, Olympic Mountains y Mt. Rainier.',
      },
    ],
    hotelAreas: [
      {
        name: 'Downtown',
        profile: 'Pike Place, estadio andando',
        bookingHint: '220-380 $/noche.',
      },
      {
        name: 'Capitol Hill',
        profile: 'Ambiente alternativo, bares y restaurantes',
        bookingHint: '200-320 $/noche. 15 min al estadio.',
      },
      {
        name: 'Belltown',
        profile: 'Más calmo, junto al puerto',
        bookingHint: '240-380 $/noche.',
      },
    ],
    gettingThere:
      'Metro Sound Transit Light Rail desde SEA aeropuerto al estadio en 35 minutos por 3,50 $. Lo más eficiente. Desde el centro, andando 15 minutos. Estacionar en Lumen: 50-80 $.',
    tips: [
      'Verano seattle es un mito, junio-julio es soleado y seco. NO llevar paraguas.',
      'Probar el cafe en Caffè Vita o Stumptown, no en Starbucks turístico.',
      'Combinar con Vancouver: tren Amtrak Cascades 4 horas, salida cómoda.',
    ],
  },

  // ─── MÉXICO ──────────────────────────────────────────────────
  {
    citySlug: 'ciudad-de-mexico',
    cityName: 'Ciudad de México',
    venueSlug: 'estadio-azteca',
    countryCode: 'MEX',
    countryName: 'México',
    flag: '🇲🇽',
    timezone: 'CST',
    utcOffset: 'UTC−6 (México no aplica horario de verano desde 2022)',
    coords: [19.3029, -99.1505],
    airport: { iata: 'MEX', name: 'Benito Juárez International' },
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Estadio_Azteca_y_sus_alrededores_46.jpg',
    shortIntro:
      'Ciudad de México acoge la INAUGURACIÓN del Mundial 2026 en el Estadio Azteca el 11 de junio (México vs Sudáfrica). Tercer Mundial en este estadio (1970, 1986, 2026).',
    shortIntroEn:
      'Mexico City hosts the OPENING MATCH of the 2026 World Cup at Estadio Azteca on June 11 (Mexico vs South Africa). Third World Cup at this venue (1970, 1986, 2026).',
    heroEditorial:
      'El Estadio Azteca acoge el partido inaugural del Mundial 2026 el 11 de junio a las 13:00 hora local CST: México vs Sudáfrica. Será la tercera vez que el Azteca abre un Mundial, antes lo hizo en 1970 (México vs URSS, 0-0) y 1986 (Italia vs Bulgaria, 1-1). Ningún otro estadio del mundo ha acogido tres Mundiales. Para los aficionados es seguramente el único partido del torneo que reúne tres planos a la vez: el histórico (la cancha de la Mano de Dios, del Brasil eterno de 1970, del Gol del Siglo), el deportivo (México como anfitrión casi favorito por ambiente) y el urbano (Ciudad de México, una de las metrópolis más vibrantes del mundo).',
    whyHere:
      'CDMX es la sede ineludible del Mundial. Si solo vas a un partido del torneo, ve a la inauguración. La ciudad da más de lo que esperas: cocina fenomenal, museos brutales (Frida Kahlo, Antropología), arquitectura barroca, ambiente fan latino auténtico. Todo a precios un tercio de los de Nueva York.',
    aboutStadium:
      'El Estadio Azteca se inauguró en 1966 con un partido amistoso México-Torino. Capacidad Mundial: 83.000 (FIFA lo nombra «Mexico City Stadium» durante el torneo, sin marca Banorte). Acoge 5 partidos: el inaugural el 11 de junio, tres más de fase de grupos, un dieciseisavos, y un octavos. Es además casa de los Pumas UNAM ocasionalmente, y del América (Liga MX), uno de los clubes más populares de Latinoamérica. Está a 2.250 metros sobre el nivel del mar, una desventaja competitiva real para selecciones europeas que jueguen aquí.',
    thingsToDo: [
      {
        title: 'Centro Histórico',
        text: 'Zócalo, Catedral, Templo Mayor, Palacio de Bellas Artes. Día completo.',
      },
      {
        title: 'Museo Frida Kahlo',
        text: 'Casa Azul en Coyoacán. Reservar online con 2 semanas. Combinar con Casa-Estudio Trotsky.',
      },
      {
        title: 'Xochimilco',
        text: 'Trajineras coloridas en canales prehispánicos. Domingo con familia mexicana.',
      },
      {
        title: 'Teotihuacán',
        text: 'Pirámides a 50 km. Día completo. Ascender la del Sol al amanecer.',
      },
    ],
    hotelAreas: [
      {
        name: 'Polanco',
        profile: 'Zona más cara, restaurantes premium, bien comunicado',
        bookingHint: '150-280 $/noche. Pujol, Quintonil cerca.',
      },
      {
        name: 'Roma / Condesa',
        profile: 'Hipster, terrazas, mejor zona para jóvenes',
        bookingHint: '100-180 $/noche.',
      },
      {
        name: 'Centro Histórico',
        profile: 'Junto a Zócalo, monumental',
        bookingHint: '80-160 $/noche. Más auténtico, también más ruidoso.',
      },
    ],
    gettingThere:
      'Metro Línea 12 (Dorada) desde el centro hasta Calle 11 (15 min andando al Azteca) por 5 pesos (~0,30 €). Tren ligero TaxqueñaXochimilco también para. La opción más eficiente. Desde MEX aeropuerto, 1 hora en taxi. Estacionar en Azteca: 200-400 pesos.',
    tips: [
      'Llegar 4 días antes para aclimatarse a la altitud (2.250 m). Sin agresividad alimenticia los primeros días.',
      'No beber agua del grifo, siempre embotellada. Agua mineral en taquerías es mate.',
      'Para el partido inaugural, llegar 4 horas antes, controles de seguridad serán Super Bowl-level.',
    ],
  },
  {
    citySlug: 'guadalajara',
    cityName: 'Guadalajara',
    venueSlug: 'estadio-akron',
    countryCode: 'MEX',
    countryName: 'México',
    flag: '🇲🇽',
    timezone: 'CST',
    utcOffset: 'UTC−6 (México no aplica horario de verano desde 2022)',
    coords: [20.6817, -103.4625],
    airport: { iata: 'GDL', name: 'Miguel Hidalgo y Costilla International' },
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Estadio_Akron_02-07-2022_cabecera_sur_lado_derecho_%283%29.jpg',
    shortIntro:
      'Guadalajara acoge 4 partidos del Mundial 2026 en el Estadio Akron, INCLUIDO Uruguay-España el 18 de junio. Cuna del mariachi y el tequila.',
    shortIntroEn:
      'Guadalajara hosts 4 World Cup 2026 matches at Estadio Akron, INCLUDING Uruguay vs Spain on June 18. The birthplace of mariachi and tequila.',
    heroEditorial:
      'El Estadio Akron en Zapopan, área metropolitana de Guadalajara, acoge el partido más esperado del Grupo H: Uruguay-España el 18 de junio a las 20:00 hora local CST (las 04:00 de la madrugada del jueves 19 en hora peninsular española). Para los aficionados de la Roja, esta es la segunda sede más importante del torneo. Guadalajara es la segunda ciudad más grande de México y la cuna de dos exportaciones cien por cien mexicanas: el mariachi y el tequila. Tlaquepaque y Tonalá son sub-municipios famosos por la artesanía. La cocina jalisciense (birria, tortas ahogadas, pozole rojo) es una de las más reconocidas del país.',
    whyHere:
      'Si vas a ver España vs Uruguay, esta es tu sede. Guadalajara es además la mejor base para visitar Tequila (el pueblo, no la bebida) y Puerto Vallarta (a 4 horas). Más asequible que CDMX y con identidad única.',
    aboutStadium:
      'El Estadio Akron (oficialmente Estadio Akron por patrocinio) se inauguró en 2010. Capacidad Mundial: 48.000. Acoge 4 partidos de fase de grupos. Es la casa de las Chivas de Guadalajara (Liga MX) y conocido por su diseño moderno con cubierta verde inspirada en el agave. Está en Zapopan, a 25 km del centro de Guadalajara.',
    thingsToDo: [
      {
        title: 'Centro Histórico',
        text: 'Catedral, Plaza Liberación, Hospicio Cabañas (Patrimonio UNESCO con murales de Orozco).',
      },
      {
        title: 'Tlaquepaque',
        text: 'Sub-municipio artesano. Plaza con mariachi en vivo todas las tardes.',
      },
      {
        title: 'Tequila (pueblo)',
        text: 'A 60 km. Tour de destilerías José Cuervo. Tequila Express en tren de fin de semana.',
      },
      {
        title: 'Plaza de los Mariachis',
        text: 'En el centro, junto al Mercado San Juan de Dios. Música en vivo cada noche.',
      },
    ],
    hotelAreas: [
      {
        name: 'Centro Histórico',
        profile: 'Histórico, monumental, vivo',
        bookingHint: '80-180 $/noche.',
      },
      {
        name: 'Providencia',
        profile: 'Zona moderna, mejor base para todo',
        bookingHint: '100-220 $/noche.',
      },
      {
        name: 'Zapopan / cerca del estadio',
        profile: 'Junto al Akron',
        bookingHint: '80-160 $/noche. Limited oferta hotel.',
      },
    ],
    gettingThere:
      'Macrobús (BRT) desde el centro a Zapopan: 30-40 minutos por 11 pesos. Lanzadera FIFA en días de partido. Desde GDL aeropuerto, 25 minutos en taxi al centro. Uber funciona perfectamente.',
    tips: [
      'Probar las tortas ahogadas auténticas, Karne Garibaldi es la más famosa.',
      'Si tienes una tarde libre, ir a Tequila pueblo. Volver al partido el día siguiente.',
      'Junio en Guadalajara: 25-30°C de día, baja a 16°C de noche por la altitud (1.560 m).',
    ],
  },
  {
    citySlug: 'monterrey',
    cityName: 'Monterrey',
    venueSlug: 'estadio-bbva',
    countryCode: 'MEX',
    countryName: 'México',
    flag: '🇲🇽',
    timezone: 'CST',
    utcOffset: 'UTC−6 (México no aplica horario de verano desde 2022)',
    coords: [25.6691, -100.2444],
    airport: { iata: 'MTY', name: 'General Mariano Escobedo International' },
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/5/57/Mexico_Guadalupe_Monterrey_Estadio_BBVA_Bancomer_fifa_world_cup_2026_6.JPG',
    shortIntro:
      'Monterrey acoge 4 partidos del Mundial 2026 en el Estadio BBVA, conocido como "El Gigante de Acero". Capital industrial de México, junto a la Sierra Madre.',
    shortIntroEn:
      'Monterrey hosts 4 World Cup 2026 matches at Estadio BBVA, known as "El Gigante de Acero" (The Steel Giant). Mexico\'s industrial capital, in the Sierra Madre foothills.',
    heroEditorial:
      'Estadio BBVA en Guadalupe, área metropolitana de Monterrey, es el segundo estadio más grande de México y uno de los más modernos de Latinoamérica (2015). Conocido como "El Gigante de Acero", tiene la fachada al sur abierta hacia el Cerro de la Silla, el monte que es el símbolo de Monterrey. Es la única sede del Mundial 2026 con vistas naturales tan distintivas. Monterrey es además la ciudad industrial más importante del norte de México (sede de FEMSA, CEMEX, Banorte), con un ambiente más moderno y americanizado que CDMX o Guadalajara.',
    whyHere:
      'Monterrey ofrece la sede del Mundial menos descubierta por turistas internacionales. Si vienes de Texas (a 200 km), es la sede mexicana más cercana. La gastronomía norteña (cabrito, machaca, frijoles charros) y los bares cerveceros locales hacen del lugar una alternativa fresca a los clásicos de CDMX o Guadalajara.',
    aboutStadium:
      'Estadio BBVA se inauguró en 2015 con un partido Rayados-Benfica. Capacidad Mundial: 53.500. Acoge 4 partidos de fase de grupos. Es la casa de los Rayados de Monterrey (Liga MX), uno de los clubes más exitosos de México (5 títulos de liga, 5 CONCACAF Champions League). El estadio fue diseñado por Populous (los arquitectos de Wembley, MetLife, Etihad). La fachada abierta al sur muestra el Cerro de la Silla, la única sede del torneo con vistas naturales tan claras.',
    thingsToDo: [
      {
        title: 'Macroplaza',
        text: 'Una de las plazas más grandes del mundo (40 ha). Catedral, palacio de gobierno, Faro del Comercio.',
      },
      {
        title: 'Parque Fundidora',
        text: 'Antigua fundición Acerera reconvertida en parque urbano. Nave Lewis con jardín niños.',
      },
      {
        title: 'Cerro de la Silla',
        text: 'Senderismo (4 horas), o foto desde Mirador del Obispado.',
      },
      {
        title: 'Pueblo Mágico Santiago',
        text: 'A 40 km al sur. Cascada Cola de Caballo. Día completo.',
      },
    ],
    hotelAreas: [
      {
        name: 'Centro / Macroplaza',
        profile: 'Centro histórico',
        bookingHint: '80-180 $/noche. Bien para visitas turísticas.',
      },
      {
        name: 'San Pedro Garza García',
        profile: 'Zona premium, restaurantes top',
        bookingHint: '150-280 $/noche.',
      },
      {
        name: 'Guadalupe / cerca del estadio',
        profile: 'Junto al BBVA',
        bookingHint: '80-150 $/noche. Limited oferta.',
      },
    ],
    gettingThere:
      'Metro Línea 1 hasta Estadio (sí, así se llama la estación). 25-30 minutos del centro por 5 pesos. Lo más eficiente. Desde MTY aeropuerto, 30 minutos en taxi al centro. Uber funciona.',
    tips: [
      'Probar cabrito al pastor en El Rey del Cabrito, restaurant clásico desde 1958.',
      'Junio en Monterrey: 35-40°C, más calor que en cualquier otra sede mexicana.',
      'Si vienes de Texas: la frontera de Nuevo Laredo está a 230 km. Bus o coche.',
    ],
  },

  // ─── CANADÁ ───────────────────────────────────────────────────
  {
    citySlug: 'toronto',
    cityName: 'Toronto',
    venueSlug: 'bmo-field',
    countryCode: 'CAN',
    countryName: 'Canadá',
    flag: '🇨🇦',
    timezone: 'EDT',
    utcOffset: 'UTC−4',
    coords: [43.6332, -79.4185],
    airport: { iata: 'YYZ', name: 'Toronto Pearson International' },
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Toronto_BMO_Field_in_2024.jpg',
    shortIntro:
      'Toronto acoge 6 partidos del Mundial 2026 en el BMO Field, junto al lago Ontario. Cuarta ciudad más grande de Norteamérica.',
    shortIntroEn:
      'Toronto hosts 6 World Cup 2026 matches at BMO Field on the shore of Lake Ontario. North America\'s fourth-largest city.',
    heroEditorial:
      'BMO Field se ubica en Exhibition Place, una zona ferial junto al lago Ontario, a 4 km del centro de Toronto. Es uno de los pocos estadios del Mundial 2026 que es exclusivamente de fútbol (la mayoría son NFL adaptados). El estadio se está expandiendo de su capacidad habitual de 30.000 a 45.000 específicamente para el Mundial, ampliación temporal con gradas modulares. Toronto es la ciudad más diversa del mundo según UNESCO: el 51% de sus residentes nacieron fuera de Canadá. Para el aficionado europeo o latinoamericano, es la sede del torneo donde más fácilmente se encuentra comunidad propia.',
    whyHere:
      'Toronto es la entrada natural al Mundial 2026 desde Europa por vuelos directos diarios desde Madrid, Barcelona, Lisboa, Roma. La diversidad cultural es real: barrios chinos, italianos, portugueses, griegos, etíopes, latinos. La oferta gastronómica está al nivel de Nueva York por mucho menos dinero.',
    aboutStadium:
      'BMO Field se inauguró en 2007. Capacidad Mundial: 45.000 (tras ampliación temporal). Acoge 6 partidos: cinco de fase de grupos y un dieciseisavos. Es la casa del Toronto FC (MLS, campeón 2017) y de los Toronto Argonauts (CFL, fútbol americano canadiense). El campo es césped natural, el único césped natural en estadio MLS de Canadá. La FIFA exige estricto control de calidad de césped en junio (riesgo de calor + lluvia).',
    thingsToDo: [
      {
        title: 'CN Tower',
        text: 'Torre icónica de 553 m. Restaurant 360° giratorio en lo alto. Reservar 1 mes.',
      },
      {
        title: 'Distillery District',
        text: 'Antigua destilería victoriana del XIX. Zona peatonal, galerías, restaurantes.',
      },
      {
        title: 'Casa Loma',
        text: 'Castillo gótico-renacentista de 1914. Tour autoguiado.',
      },
      {
        title: 'Niagara Falls',
        text: 'A 130 km. Día completo. Hornblower o Maid of the Mist barco a las cataratas.',
      },
    ],
    hotelAreas: [
      {
        name: 'Downtown / Yonge-Dundas',
        profile: 'Times Square canadiense',
        bookingHint: '200-350 CAD/noche.',
      },
      {
        name: 'Distillery District / Old Town',
        profile: 'Más bohemio, restaurantes',
        bookingHint: '180-300 CAD/noche.',
      },
      {
        name: 'Liberty Village / Exhibition',
        profile: 'Cerca del estadio',
        bookingHint: '160-260 CAD/noche.',
      },
    ],
    gettingThere:
      'Streetcar TTC #511 desde Bathurst Station al estadio: 15 minutos por 3,35 CAD. Andable desde Liberty Village. Desde YYZ aeropuerto, 25 minutos en UP Express tren.',
    tips: [
      'Las propinas son estándar 18-20%, más altas que España.',
      'Tener moneda local (CAD) ayuda, algunos sitios no aceptan tarjeta.',
      'Junio en Toronto: 22-26°C, lluvia eventual. Llevar chaqueta ligera.',
    ],
  },
  {
    citySlug: 'vancouver',
    cityName: 'Vancouver',
    venueSlug: 'bc-place',
    countryCode: 'CAN',
    countryName: 'Canadá',
    flag: '🇨🇦',
    timezone: 'PDT',
    utcOffset: 'UTC−7',
    coords: [49.2766, -123.1119],
    airport: { iata: 'YVR', name: 'Vancouver International' },
    heroImage: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/BC_Place_2015_Women%27s_FIFA_World_Cup.jpg',
    shortIntro:
      'Vancouver acoge 7 partidos del Mundial 2026 en BC Place, único estadio cubierto del torneo en la costa pacífica. La ciudad más bonita del Mundial.',
    shortIntroEn:
      'Vancouver hosts 7 World Cup 2026 matches at BC Place, the only fully roofed stadium on the Pacific coast in the tournament. The most scenic host city of the World Cup.',
    heroEditorial:
      'BC Place está en pleno centro de Vancouver, junto a False Creek y a 10 minutos andando del puerto. Es uno de los pocos estadios del Mundial 2026 con cubierta retráctil 100%, pieza clave para el clima cambiante de la costa pacífica canadiense (junio puede ser lluvioso). Vancouver es regularmente votada como una de las cinco mejores ciudades para vivir del mundo: clima templado, montañas (Whistler está a 90 minutos), océano (Stanley Park, English Bay), bosques milenarios y cultura cosmopolita. Para muchos visitantes europeos, será su primer contacto con el Pacífico canadiense, y la entrada natural a Whistler para los que combinen Mundial con esquí de verano.',
    whyHere:
      'Vancouver es la sede más bonita del Mundial 2026: naturaleza extrema en pleno centro urbano. Si te interesan los paisajes y combinar Mundial con escapada a Whistler o Alaska, ésta es tu base. Encaja muy bien con Seattle (160 km al sur, en USA).',
    aboutStadium:
      'BC Place se inauguró en 1983 con un partido de Cosmos NY-Vancouver Whitecaps (sí, con Pelé jugando para Cosmos). Reformado en 2011 con cubierta retráctil. Capacidad Mundial: 54.000. Acoge 7 partidos: seis de fase de grupos y un dieciseisavos. Es la casa de los Vancouver Whitecaps FC (MLS) y los BC Lions (CFL). Su forma característica, cubierta blanca y abultada, es uno de los iconos visuales de la ciudad.',
    thingsToDo: [
      {
        title: 'Stanley Park',
        text: '400 hectáreas de bosque urbano con seawall (paseo marítimo) de 9 km.',
      },
      {
        title: 'Granville Island',
        text: 'Mercado, talleres de artesanía, cervecería local. Mini ferries Aquabus desde Yaletown.',
      },
      {
        title: 'Capilano Suspension Bridge',
        text: 'Puente colgante en el bosque a 70 metros. 30 minutos en autobús desde el centro.',
      },
      {
        title: 'Whistler',
        text: 'A 120 km. 2 horas en coche/bus. Resort de esquí olímpico (Vancouver 2010). En verano: senderismo + lago Lost Lake.',
      },
    ],
    hotelAreas: [
      {
        name: 'Downtown',
        profile: 'Centro, junto al estadio',
        bookingHint: '220-380 CAD/noche.',
      },
      {
        name: 'Yaletown',
        profile: 'Más moderno, junto al agua',
        bookingHint: '250-400 CAD/noche.',
      },
      {
        name: 'Gastown',
        profile: 'Histórico, restaurantes y bares',
        bookingHint: '180-320 CAD/noche.',
      },
    ],
    gettingThere:
      'SkyTrain Expo Line desde el aeropuerto YVR a Stadium-Chinatown station: 27 minutos por 9 CAD. Imbatible. Desde Downtown al estadio, andando 10 minutos.',
    tips: [
      'Probar el sushi en Tojo\'s o Miku, Vancouver tiene de los mejores sushis fuera de Japón.',
      'Junio en Vancouver: 18-23°C, posibilidad de lluvia. Llevar paraguas plegable.',
      'Combinar con Seattle (en USA, a 4 horas en tren Amtrak Cascades) o Whistler.',
    ],
  },
];

export function getSedeBySlug(slug: string): SedeCity | undefined {
  return SEDES_2026.find((s) => s.citySlug === slug);
}

/** Mapeo inverso: dado el slug del estadio, devuelve la sede que lo usa.
 *  Útil para enlazar desde /estadios/[slug] hacia /2026/sedes/[city]. */
export function getSedeByVenueSlug(venueSlug: string): SedeCity | undefined {
  return SEDES_2026.find((s) => s.venueSlug === venueSlug);
}

export function getSedesByCountry(code: 'USA' | 'MEX' | 'CAN'): SedeCity[] {
  return SEDES_2026.filter((s) => s.countryCode === code);
}

/** Helper: obtiene los datos del estadio asociado a la sede */
export function getVenueForSede(sede: SedeCity) {
  return VENUES_2026.find((v) => v.slug === sede.venueSlug);
}

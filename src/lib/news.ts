/**
 * Noticias diarias del Mundial 2026.
 *
 * Curaduría editorial: cada noticia debe llevar título original del medio
 * + resumen propio (NO copiar el lead del medio · copyright) + URL.
 *
 * Cómo añadir una nueva:
 *   1. Encuentra la noticia en un medio relevante (Marca, AS, ESPN, FIFA,
 *      L'Équipe, The Guardian, BBC, OneFootball, Infobae, TyC Sports, etc.).
 *   2. Verifica fecha de publicación.
 *   3. Escribe un resumen propio en español (40-60 palabras), no traducir
 *      literalmente la entradilla del medio. Aporta contexto tuyo.
 *   4. Añade entrada al array `NEWS_ITEMS` con `publishedAt` ISO 8601.
 *   5. Reordena: las más recientes primero.
 *
 * Frecuencia ideal: 3-5 noticias nuevas por semana.
 *
 * Cuando esto crezca a >100 noticias, migrar a tabla Supabase
 * (migration en `supabase/migrations/20260502000000_news_items.sql`).
 */

export type NewsCategory =
  | 'panini'
  | 'convocatorias'
  | 'sedes'
  | 'entradas'
  | 'jugadores'
  | 'mascotas'
  | 'ceremonia'
  | 'polemica'
  | 'tv'
  | 'patrocinios'
  | 'general';

export type NewsItem = {
  /** Slug interno · usado en `/noticias/[slug]`. */
  slug: string;
  /** Título editorial propio (NO copiar textual del medio). */
  title: string;
  /** Resumen editorial propio en español, 40-60 palabras. */
  summary: string;
  /**
   * Cuerpo editorial propio en español (200-400 palabras), separado por
   * `\n\n` entre párrafos. NO traducción literal del medio. Aporta
   * contexto, datos verificados y opinión sutil.
   */
  body: string;
  /** Categoría para filtrado. */
  category: NewsCategory;
  /** Nombre del medio fuente. */
  sourceName: string;
  /** URL del artículo original (atribución obligatoria). */
  sourceUrl: string;
  /** Idioma del medio (no del resumen, que es ES). */
  sourceLang: 'es' | 'en' | 'pt' | 'fr';
  /** Fechas de publicación / actualización (ISO 8601). */
  publishedAt: string;
  modifiedAt?: string;
  /** Fuentes secundarias (atribución adicional, para verificación cruzada). */
  sourcesSecondary?: { name: string; url: string }[];
  /**
   * Imagen de portada (1200×675 ideal Discover-friendly).
   * Recomendado: Wikimedia Commons via `Special:FilePath` con licencia libre.
   * Si se omite, se usa el OG dinámico de marca como fallback.
   */
  image?: {
    url: string;
    alt: string;
    credit?: string;
    license?: string;
  };
};

export const NEWS_ITEMS: NewsItem[] = [
  {
    slug: 'neymar-mundial-2026-brasil-convocatoria-ancelotti-lesion-pantorrilla-recuperacion',
    title:
      '"Neymar va a jugar el Mundial 2026": Ancelotti lo mantiene en la lista pese a la lesión en la pantorrilla derecha',
    summary:
      'Una de las dudas más buscadas sobre el Mundial 2026 tiene respuesta: Carlo Ancelotti incluyó a Neymar en los 26 convocados de Brasil el pasado 18 de mayo, pero el delantero del Santos sufrió tres días después una lesión muscular en la pantorrilla derecha que le mantiene fuera entre 6 y 10 días. El cuerpo médico brasileño asegura que llegará al debut del 14 de junio contra Marruecos en el MetLife Stadium. Vinícius Júnior, Raphinha, Rodrygo y Endrick acompañan al 10 brasileño en el ataque.',
    body: `**"¿Neymar va a jugar el Mundial 2026?"** Es la pregunta que más usuarios escriben en Google sobre Brasil estos días, con búsquedas en alza desde mediados de mayo. La respuesta corta es **sí, pero con interrogantes médicos**. La larga, abajo.

**El 18 de mayo: Ancelotti lo convoca**. **Carlo Ancelotti**, seleccionador de Brasil desde febrero de 2026 tras el contrato más comentado del año (el Real Madrid le rescindió el contrato a sabiendas para que aceptara la CBF), publicó la lista oficial de 26 convocados desde la sede de Granja Comary. Neymar entró pese a llevar dos años sin disputar un partido oficial completo con la *Seleção*. El número 10 brasileño, hoy en el **Santos** (regresó en enero de 2025 tras siete años en PSG y Al-Hilal), llegó a la convocatoria gracias a 8 goles y 6 asistencias en el **Campeonato Paulista** y los primeros partidos del Brasileirão.

**Los compañeros de ataque**: **Vinícius Júnior** (Real Madrid), **Raphinha** (Barcelona), **Rodrygo** (Real Madrid), **Endrick** (Olympique Lyonnais cedido por el Real Madrid) y **Matheus Cunha** (Manchester United). Es uno de los frentes ofensivos más profundos del torneo. **Gabriel Martinelli** (Arsenal) e **Igor Thiago** (Brentford) completan la rotación.

**El 21 de mayo: la lesión**. Tres días después del anuncio, durante un entrenamiento del Santos previo al partido contra Mirassol, Neymar **sintió una molestia muscular en la pantorrilla derecha**. Las pruebas médicas confirmaron un **edema moderado** —no rotura, lesión muscular leve—. El médico del Santos, Murillo Wagner, declaró: *"Neymar atraviesa una lesión muscular pero, según nuestra planificación, su evolución le permitirá estar apto la próxima semana para integrarse a la selección"*.

**El calendario aprieta**. El plazo médico estimado es de **6 a 10 días sin entrenamiento al máximo nivel**. Brasil concentra a partir del **26 de mayo** en Granja Comary; el primer amistoso pre-Mundial es el **3 de junio contra Croacia** en Sao Paulo; y el debut mundialista es el **14 de junio contra Marruecos** en el **MetLife Stadium de Nueva Jersey**. Los tiempos son ajustados pero realistas si la evolución es la prevista.

**¿Por qué Ancelotti lo mantiene pese a la lesión?** Tres razones, según fuentes próximas al cuerpo técnico:

1. **Reglas FIFA**. La normativa del Mundial 2026 permite reemplazos por lesión **hasta 24 horas antes del primer partido del equipo**. Si Neymar no llega, hay tiempo para sustituirlo. Mantenerlo en la lista no compromete el cupo de 26.
2. **Liderazgo vestuario**. Neymar sigue siendo el referente emocional de la *Seleção* aunque su rendimiento haya bajado. Ancelotti, en sus conversaciones privadas con Marquinhos (capitán) y Casemiro, identificó que el equipo necesita a Neymar al menos como **mentor** para los más jóvenes (Endrick, Rayan).
3. **El factor mediático**. La final del Mundial se juega el 19 de julio. Un Brasil **sin Neymar** en su quinto Mundial sería una historia de derrota generacional; un Brasil **con Neymar despidiéndose** es la historia de la temporada para el mercado norteamericano (cliente principal de FIFA en este Mundial).

**Quiénes se quedan fuera por su presencia**. La sorpresa más comentada es la exclusión de **Pedro** (Flamengo), delantero centro de los $120 millones de tasación, descartado pese a temporada excelente en el club. **Gabriel Jesús** (Arsenal) sigue lesionado de cruzados desde enero 2025 y tampoco entra. **Hulk** (Atlético Mineiro, 39 años) era el outsider sentimental pero Ancelotti lo descartó por edad.

**Brasil debuta el 14 de junio** contra Marruecos en MetLife. Después se enfrenta a Haití (San Francisco, 18 de junio) y cierra el Grupo C contra Escocia (Mercedes-Benz Stadium Atlanta, 22 de junio). Calendario y plantilla completa en [/2026/listas/BRA](/2026/listas/BRA) y previa del [Grupo C](/2026/grupo/C).`,
    category: 'jugadores',
    sourceName: 'CNN Español',
    sourceUrl:
      'https://cnnespanol.cnn.com/2026/05/18/deportes/neymar-lista-ancelotti-brasil-mundial-orix',
    sourceLang: 'es',
    publishedAt: '2026-05-22T08:00:00Z',
    sourcesSecondary: [
      {
        name: 'La FM · alerta lesión Neymar',
        url: 'https://www.lafm.com.co/deportes/neymar-convocatoria-brasil-mundial-2026-ancelotti-lesion-pantorrilla-santos-fm-399964',
      },
      {
        name: 'El Colombiano · lesión pantorrilla',
        url: 'https://www.elcolombiano.com/deportes/futbol/neymar-lesion-pantorilla-santos-mundial-brasil-EM36815652',
      },
      {
        name: 'Infobae · ausencias Brasil',
        url: 'https://www.infobae.com/deportes/2026/05/18/los-grandes-ausentes-en-la-lista-de-brasil-para-el-mundial-el-delantero-de-los-usd-120-millones-al-que-desbanco-neymar/',
      },
      {
        name: 'Telemundo · nueva lesión',
        url: 'https://www.telemundo.com/deportes/copa-mundial-de-la-fifa-2026/neymar-sufre-una-nueva-lesion-y-esto-dicen-los-doctores-sobre-el-mundi-rcna346212',
      },
    ],
  },
  {
    slug: 'ansu-fati-prelista-mundial-2026-espana-monaco-renacimiento-luis-de-la-fuente',
    title:
      'Ansu Fati renace en el Mónaco: 12 goles, prelista del Mundial 2026 y la oportunidad de volver con España tres años después',
    summary:
      'Ansu Fati (22 años) ha marcado 12 goles en 34 partidos con el Mónaco en la temporada 2025-26, su mejor cifra goleadora desde la lesión de menisco en 2021. Luis de la Fuente lo incluyó en la prelista de 35 jugadores para el Mundial 2026 el 11 de mayo, tres años después de su última convocatoria con España. La lista definitiva se anuncia el 25 de mayo en Las Rozas. Si entra, sería su primer Mundial.',
    body: `La historia de **Ansu Fati** y la selección española arrastraba dos años de silencio. La última convocatoria del delantero hispano-guineano fue en marzo de 2023, cuando aún militaba en el Barcelona y se debatía entre cesión y titularidad. El paso por **Brighton** (2023-24, cesión sin pena ni gloria) y la temporada irregular en el club barcelonista (2024-25) parecían haberlo apartado definitivamente del proyecto De la Fuente.

**El Mónaco lo ha resucitado**. El traspaso al **AS Monaco** en agosto de 2025 por **38 millones de euros** —operación cerrada el último día del mercado tras la negativa del Barça a mantenerlo en plantilla— se ha convertido en el movimiento más rentable del fútbol francés esta temporada. Bajo la dirección táctica de **Adolf Hütter**, Fati ha pasado de ser un regateador de banda a **un finalizador de área**. Datos:

- **12 goles** en 34 partidos de la Ligue 1 (su récord personal en una temporada).
- **6 asistencias** y **2 goles en Champions League** (caída de Mónaco en cuartos contra el Bayern).
- **xG/90 minutos** de 0,72 — segundo mejor de toda la Ligue 1 detrás de Mbappé en su etapa PSG.
- **Edad: 22 años**. Cumplirá 23 el 31 de octubre, tres meses después de la final del Mundial.

**La prelista del 11 de mayo: la gran sorpresa**. Luis de la Fuente, en su intervención en la Ciudad del Fútbol de Las Rozas, presentó la **prelista provisional de 35 jugadores** —cifra mínima exigida por FIFA—. Ansu Fati apareció entre los nombres tras semanas de filtraciones contradictorias. Las palabras del seleccionador: *"Ansu ha hecho una temporada extraordinaria. Es un jugador que conoce la selección, que sabe lo que pedimos. Si está aquí es porque entendemos que puede ayudar en cualquiera de los tres frentes ofensivos"*.

**El debate interno: ¿quién cae para que entre?** España tiene una rotación ofensiva profundísima:

- **Yamal** (Barcelona) — extremo derecho titular, intocable.
- **Williams** (Athletic Club) — extremo izquierdo titular.
- **Olmo** (Barcelona) — mediapunta titular.
- **Morata** (Galatasaray, capitán) — nueve referencia.
- **Joselu** (Al-Gharafa) — nueve relevo.
- **Pino** (Crystal Palace) — extremo joven.
- **Ferran Torres** (Barcelona) — versátil.
- **Oyarzabal** (Real Sociedad) — segunda punta y banda izquierda.
- **Ansu Fati** (Mónaco) — el resurrecto.

**Solo cinco puestos** de delantero / extremo para nueve candidatos. La crítica es unánime: Fati ocupa el sitio que en marzo parecía reservado para **Pino** o **Oyarzabal**. Las apuestas de los analistas de Marca, AS y Sport convergen: Fati entra como **cuarto delantero**, por delante de Pino y Joselu.

**El 25 de mayo: el momento de la verdad**. Luis de la Fuente confirmará el lunes 25 de mayo a las 13:00 en la Ciudad del Fútbol los **26 elegidos definitivos** para el Mundial. España viaja a EE.UU. el 7 de junio para concentrarse en Chicago, sede del debut del 15 de junio contra Cabo Verde.

**Si Fati entra**: sería su **primer Mundial**. Estuvo en la prelista de Catar 2022 (Luis Enrique lo dejó fuera del corte final), no llegó a la Eurocopa 2024. El Mundial 2026, con 22 años, sería el momento de validar todo el talento que el Barcelona vio en él cuando lo subió al primer equipo con 16. Más sobre **España en el Mundial 2026** en [/selecciones/ESP/grupo-h](/selecciones/ESP/grupo-h) y la **lista definitiva** se publicará en [/2026/listas/ESP](/2026/listas/ESP) el lunes.`,
    category: 'jugadores',
    sourceName: 'VAVEL España',
    sourceUrl:
      'https://www.vavel.com/es/futbol/2026/05/19/fc-barcelona/1261219-ansu-fati-una-opcion-para-el-mundial.html',
    sourceLang: 'es',
    publishedAt: '2026-05-22T11:00:00Z',
    sourcesSecondary: [
      {
        name: 'El Progresivo · Ansu Fati 2026 resurgimiento',
        url: 'https://elprogresivo.com/2026/05/18/ansu-fati-2026-por-que-su-resurgimiento-en-el-monaco-redefine-su-valor-en-el-futbol-europeo/',
      },
      {
        name: 'Infobae · sorpresas prelista España',
        url: 'https://www.infobae.com/espana/deportes/2026/05/15/las-sorpresas-de-la-prelista-de-luis-de-la-fuente-para-el-mundial-2026-de-los-seis-porteros-a-los-jovenes-futbolistas/',
      },
      {
        name: 'El Español · diseña la lista de De la Fuente',
        url: 'https://www.elespanol.com/deportes/futbol/mundial/20260520/futbolistas-deben-convocados-espana-mundial-disena-lista-luis-fuente/1003744248264_32.html',
      },
    ],
  },
  {
    slug: 'inglaterra-convocatoria-mundial-2026-thomas-tuchel-bellingham-kane-26-jugadores-22-mayo',
    title:
      'Inglaterra revela su lista para el Mundial 2026: Thomas Tuchel apuesta por Bellingham y Kane, deja fuera a Maguire, Cole Palmer y Luke Shaw',
    summary:
      'Thomas Tuchel anunció este viernes 22 de mayo a las 9:45 de la mañana en Wembley los 26 jugadores convocados por Inglaterra para el Mundial 2026. Es el primer Mundial del alemán al frente de los Tres Leones tras suceder a Gareth Southgate. Harry Kane lidera el ataque y Jude Bellingham es el creador de referencia. Sorprenden las ausencias de Harry Maguire, Cole Palmer, Levi Colwill, Lewis Hall y Luke Shaw.',
    body: `**Thomas Tuchel** dio por fin a conocer este **viernes 22 de mayo a las 9:45** de la mañana en el **Wembley Stadium** la lista definitiva de **26 jugadores** convocados por **Inglaterra** para el Mundial 2026. Es la primera convocatoria mundialista del seleccionador alemán, contratado en otoño de 2024 tras la salida de **Gareth Southgate** —cesado pese a la final perdida en la Eurocopa 2024 ante España—.

**La columna del equipo: Kane, Bellingham y Saka**. **Harry Kane** (32 años, Bayern Munich), capitán y máximo goleador histórico de Inglaterra con 71 goles, lidera el ataque a su tercer Mundial (2018, 2022, 2026). **Jude Bellingham** (Real Madrid, 22 años) es el creador titular con licencia total para llegar al área. **Bukayo Saka** (Arsenal, 24 años) ocupa la banda derecha y será el extremo titular del torneo.

**Las cinco ausencias bomba**. La gran sorpresa de la rueda de prensa fueron las exclusiones:

- **Harry Maguire** (Manchester United, 33 años). El central inglés, símbolo emocional de la generación 2018-2022, confirmó en redes media hora antes que NO está en la convocatoria. Tuchel optó por una defensa más ágil con John Stones, Marc Guéhi y Levi Colwill —espera: este último también fue excluido—.
- **Cole Palmer** (Chelsea, 24 años). El creador, máximo asistente de la Premier 2025-26, queda fuera por motivos no aclarados públicamente. La prensa inglesa habla de discrepancias tácticas con Tuchel sobre la posición preferida del jugador.
- **Levi Colwill** (Chelsea, 23 años). El central que parecía titular asegurado tras el cierre defensivo en Catar 2022 cae sin explicación oficial.
- **Lewis Hall** (Newcastle, 21 años). Lateral izquierdo descartado, Luke Shaw recupera su sitio… no, **Luke Shaw también queda fuera**. Tuchel apuesta por **Tino Livramento** y **Rico Lewis** como laterales jóvenes.
- **Marcus Rashford** (Aston Villa, cedido), tampoco aparece.

**La política Tuchel**. El seleccionador alemán siempre ha defendido juventud, sacrificio defensivo y disciplina táctica. La convocatoria refleja esos tres principios: edad media **26,1 años** (más baja que en Catar 2022), seis debutantes mundialistas (Anthony Gordon, Adam Wharton, Conor Gallagher, Morgan Rogers, Tino Livramento, Curtis Jones), y solo **dos jugadores procedentes del Big Six de Londres** (Saka del Arsenal, Reece James del Chelsea) —Tuchel ha cortado el dominio histórico de Manchester City y Manchester United.

**Inglaterra está en el Grupo L del Mundial 2026** con Croacia, Ghana y Panamá. Debuta el **15 de junio en el Hard Rock Stadium de Miami** contra Croacia (revancha de la semifinal Rusia 2018). Después se enfrenta a Ghana en Atlanta (20 de junio) y cierra contra Panamá en Filadelfia (24 de junio).

**Lista completa de los 26 elegidos** en [/2026/listas/ENG](/2026/listas/ENG). Más sobre el [Grupo L del Mundial 2026](/2026/grupo/L) y el [calendario del Hard Rock Stadium](/2026/sedes/miami).`,
    category: 'convocatorias',
    sourceName: 'England Football (FA)',
    sourceUrl:
      'https://www.englandfootball.com/articles/2026/May/20/england-world-cup-squad-announcement-day-what-to-expect-20262005',
    sourceLang: 'en',
    publishedAt: '2026-05-22T08:45:00Z',
    sourcesSecondary: [
      {
        name: 'Athlon Sports · England squad announcement',
        url: 'https://athlonsports.com/soccer/international/when-england-world-cup-squad-announcement-date-time',
      },
      {
        name: 'ESPN · Tuchel England big questions',
        url: 'https://www.espn.com/soccer/story/_/id/48804507/thomas-tuchel-england-world-cup-2026-squad-big-questions-need-answering',
      },
    ],
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Wembley_Stadium_-_geograph.org.uk_-_3197580.jpg/1280px-Wembley_Stadium_-_geograph.org.uk_-_3197580.jpg',
      alt: 'Wembley Stadium, escenario del anuncio de la lista inglesa para el Mundial 2026',
      credit: 'Wikimedia Commons',
      license: 'CC BY-SA 2.0',
    },
  },
  {
    slug: 'alemania-lista-mundial-2026-julian-nagelsmann-manuel-neuer-regreso-musiala-wirtz-sin-gnabry-21-mayo',
    title:
      'Alemania anuncia su lista para el Mundial 2026: Nagelsmann recupera a Neuer del retiro, mantiene a Musiala y Wirtz, deja a Gnabry fuera por lesión',
    summary:
      'Julian Nagelsmann anunció este jueves 21 de mayo en Herzogenaurach los 26 elegidos por Alemania para el Mundial 2026. La gran noticia es el regreso de Manuel Neuer del retiro internacional para ser titular bajo palos a sus 40 años. Jamal Musiala vuelve tras la grave lesión del verano 2025 y Florian Wirtz comanda la creación. Serge Gnabry queda fuera por lesión recurrente; Marc-André ter Stegen tampoco entra.',
    body: `**Julian Nagelsmann** confirmó este **jueves 21 de mayo** en el centro de entrenamiento de **Herzogenaurach** —sede mundial de Adidas y campo base de la *Mannschaft*— los **26 elegidos** por **Alemania** para el Mundial 2026. La convocatoria llega tras semanas de especulación sobre el portero titular, el estado de Jamal Musiala y la dependencia táctica del medio creador. Tres titulares aclarados: **Neuer regresa**, **Musiala llega a tiempo**, **Wirtz es indiscutible**.

**Manuel Neuer sale del retiro internacional**. El portero del Bayern Munich, **40 años**, anunció su retirada de la *Mannschaft* tras la Eurocopa 2024. Nagelsmann lo convenció en una reunión privada en abril en Múnich para volver y ser titular en su **quinto Mundial** (2010, 2014 campeón, 2018, 2022, 2026). Neuer iguala el récord histórico de cinco Mundiales consecutivos que comparten Cristiano Ronaldo (Portugal), Lothar Matthäus (Alemania 1982-1998) y Rafael Márquez (México 2002-2018). Su regreso desplaza a **Oliver Baumann** (Hoffenheim) a suplente —titular en los últimos doce meses tras la retirada de Neuer—.

**Musiala llega a tiempo del horror**. **Jamal Musiala** (Bayern Munich, 23 años) se rompió tibia y peroné durante el Mundial de Clubes 2025 en EE.UU. tras una entrada del portero Donnarumma. Estuvo nueve meses fuera. Nagelsmann confirmó: *"Jamal ha mejorado mes a mes y todavía tiene cuatro semanas para encontrar ritmo. Estará al 100% para el debut del 13 de junio"*. Musiala jugará detrás de la punta junto a Florian Wirtz.

**Las ausencias dolorosas**. **Serge Gnabry** (Bayern Munich, 31 años) queda fuera por recaída muscular. **Marc-André ter Stegen** (Barcelona) ni siquiera entró en discusión —su rendimiento ha bajado y la relación con Nagelsmann está rota desde la Eurocopa—. **Niclas Füllkrug** (West Ham), héroe inesperado de Catar 2022, también queda fuera. **Mats Hummels** (anunció su retiro internacional). **Toni Kroos** (retirado tras la Eurocopa).

**El reemplazo de Gnabry: Jamie Leweling**. El extremo del Stuttgart, **24 años**, entra en su primer Mundial. La banda derecha la cubrirá compartiendo con **Leroy Sané** (Galatasaray) según el rival.

**La columna defensiva**. **Antonio Rüdiger** (Real Madrid) y **Nico Schlotterbeck** (Borussia Dortmund) forman la pareja central titular. Como laterales: **Joshua Kimmich** (capitán, derecha) y **David Raum** (izquierda).

**Alemania está en el Grupo E** con Curaçao, Costa de Marfil y Ecuador. Debuta el **13 de junio en el SoFi Stadium de Los Ángeles** contra Curaçao (sorprendente: la *Mannschaft* nunca antes había jugado contra Curaçao). Después se enfrenta a Costa de Marfil en Boston (18 de junio) y cierra contra Ecuador en Houston (22 de junio).

**Lista completa de los 26** y previa del [Grupo E](/2026/grupo/E) en [/2026/listas/GER](/2026/listas/GER).`,
    category: 'convocatorias',
    sourceName: 'Bundesliga.com',
    sourceUrl:
      'https://www.bundesliga.com/en/bundesliga/news/germany-squad-world-cup-2026-manuel-neuer-nagelsmann-37487',
    sourceLang: 'en',
    publishedAt: '2026-05-21T15:00:00Z',
    sourcesSecondary: [
      {
        name: 'beIN Sports · Neuer recalled',
        url: 'https://www.beinsports.com/en-nz/football/fifa-world-cup-2026/articles-video/neuer-recalled-to-germany-squad-for-world-cup-2026-05-21',
      },
      {
        name: 'World Soccer Talk · Germany squad',
        url: 'https://worldsoccertalk.com/world-cup/manuel-neuers-stunning-return-headlines-germanys-2026-world-cup-squad-and-serge-gnabry-misses-out-as-julian-nagelsmann-balances-experience-and-heartbreak/',
      },
      {
        name: 'Olympics.com · Germany at WC 2026',
        url: 'https://www.olympics.com/en/news/fifa-world-cup-2026-germany-all-players-full-squad-list-key-stats-schedule',
      },
    ],
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/SoFi_Stadium_2023.jpg/1280px-SoFi_Stadium_2023.jpg',
      alt: 'SoFi Stadium de Los Ángeles, sede del debut alemán contra Curaçao en el Mundial 2026',
      credit: 'Wikimedia Commons',
      license: 'CC BY-SA 4.0',
    },
  },
  {
    slug: 'adidas-anuncio-mundial-2026-backyard-legends-messi-bellingham-yamal-bad-bunny-timothee-chalamet-pelicula-cinco-minutos',
    title:
      '"Backyard Legends": el anuncio de cinco minutos de Adidas para el Mundial 2026 con Messi, Bellingham, Yamal, Bad Bunny y Timothée Chalamet rompe Internet',
    summary:
      'Adidas estrenó "Backyard Legends", la pieza publicitaria para el Mundial 2026 que dura cinco minutos y se parece más a un cortometraje que a un spot. El comercial recrea un partido de barrio con Lionel Messi, Zinedine Zidane, David Beckham, Alessandro Del Piero, Jude Bellingham, Lamine Yamal y Trinity Rodman, con apariciones sorpresa de Bad Bunny y Timothée Chalamet. La marca cierra con la frase "A legend is born".',
    body: `**Adidas** ha estrenado **"Backyard Legends"**, la pieza audiovisual que abre su campaña para el Mundial 2026 y que rompió Internet en cuestión de horas. **Cinco minutos** de duración —más cerca de un cortometraje que de un spot publicitario— centrados en una idea sencilla: el fútbol nació en un partido de barrio antes de convertirse en industria global.

**El reparto deportivo**: **Lionel Messi** (40 años, Inter Miami, capitán de Argentina), **Zinedine Zidane** y **David Beckham** (cameos generacionales), **Alessandro Del Piero** (símbolo italiano), **Jude Bellingham** (Real Madrid e Inglaterra), **Lamine Yamal** (Barcelona y España, 18 años) y **Trinity Rodman** (Washington Spirit y USA femenina, hija de Dennis Rodman). Es la primera vez que Adidas mezcla en una misma pieza generaciones tan separadas y géneros tan equilibrados: la presencia de Rodman como única protagonista femenina es deliberada y reconoce el peso creciente del fútbol femenino en la marca.

**El reparto pop**: **Bad Bunny** (puertorriqueño, anuncia gira mundial post-Mundial) y **Timothée Chalamet** (actor de *Dune* y *A Complete Unknown*, embajador adidas Originals). Las apariciones de ambos llegan en escenas con timing cómico —Chalamet entra al partido pidiendo "una camiseta de Argentina, por favor" y Messi le responde "ya, ya, ya" en una mezcla bilingüe que ha sido el clip más compartido en redes—.

**El concepto**: regresar al origen. Adidas se aleja deliberadamente de los efectos especiales futuristas que dominaron sus campañas de Catar 2022 y Rusia 2018 y apuesta por la **estética cinematográfica del barrio**: porterías improvisadas con piedras, balones gastados, polvo en suspensión y una banda sonora original compuesta para la pieza. La idea es que **cualquiera de los figurines** del cortometraje podría haber sido un crío con sueños hace veinte años antes de convertirse en estrella mundial.

**La frase final**: *"A legend is born"*. Una declaración de intenciones para el ciclo 2026: Adidas presenta el Mundial como el momento donde nace la siguiente generación de leyendas —Yamal, Bellingham, Endrick, Wirtz, Doué, Pavlidis— en convivencia con la última de los ya consagrados (Messi, Ronaldo, Modrić, Neymar). El cierre incluye un teaser de la **camiseta dorada conmemorativa** del centenario del primer Mundial, que Adidas lanzará en su Originals line durante junio.

**Datos del lanzamiento**: el spot se subió simultáneamente a **YouTube oficial Adidas Football** y a las cuentas de **adidas.com/es** a las **18:00 hora de Madrid del 21 de mayo**. En **17 horas** acumuló más de **48 millones de visualizaciones**, **2,3 millones de likes** y **870.000 comentarios** —el ranking de comentarios lo lidera el dúo Bad Bunny / Messi—. Adidas confirma que **más contenido llegará** durante mayo y junio, incluido un *Director's Cut* extendido a 12 minutos previsto para inicios de junio.

**Por qué importa para el SEO de marcas**. El query "anuncio adidas mundial 2026" llegó a **+5.000% de crecimiento** en Google Trends España en las últimas 24 horas. Es la búsqueda con mayor crecimiento relativo del periodo en ES y US. La presencia de Bad Bunny como **embajador no-tradicional** (ha llevado camisetas del Madrid históricamente, no es del Barça) y de Chalamet como **embajador adidas Originals** consolida la estrategia de cross-over cultural más allá del deporte.

**Camisetas del Mundial 2026 disponibles** en [/coleccionismo/camisetas-mundial-2026](/coleccionismo/camisetas-mundial-2026) y todas las marcas técnicas oficiales por selección en [/selecciones](/selecciones).`,
    category: 'patrocinios',
    sourceName: 'OneFootball',
    sourceUrl:
      'https://onefootball.com/en/news/lamine-messi-bad-bunny-adidas-la-rompe-con-su-anuncio-del-mundial-42827205',
    sourceLang: 'es',
    publishedAt: '2026-05-22T07:00:00Z',
    sourcesSecondary: [
      {
        name: 'El Universal · Adidas rompe Internet',
        url: 'https://www.eluniversal.com.mx/deportes/adidas-rompe-el-internet-con-un-epico-comercial-rumbo-al-mundial/',
      },
      {
        name: 'Esquire Colombia · crossover cultural',
        url: 'https://esquirecolombia.com/comercial-adidas-mundial-2026-futbolistas-significado/',
      },
      {
        name: '365Scores · viral Messi Bad Bunny',
        url: 'https://www.365scores.com/es/news/mundial-2026-comercial-adidas-messi/',
      },
    ],
  },
  {
    slug: 'shakira-burna-boy-dai-dai-cancion-oficial-mundial-2026-fifa-halftime-show-final-madonna-bts',
    title:
      'Shakira y Burna Boy estrenan "Dai Dai", canción oficial del Mundial 2026, y coheadlinearán el primer halftime show de una final con Madonna y BTS',
    summary:
      'Shakira lanzó el 14 de mayo "Dai Dai", la canción oficial del Mundial 2026, en colaboración con el cantante nigeriano Burna Boy. Es su segundo himno mundialista tras "Waka Waka" en 2010. La FIFA confirma además que la final del 19 de julio en MetLife Stadium tendrá el primer espectáculo de medio tiempo de la historia de los Mundiales, con Shakira, Madonna y la banda surcoreana BTS coheadlinearán.',
    body: `**Shakira** (49 años, colombiana) ha vuelto al mundo del Mundial casi dos décadas después de **"Waka Waka"** —el himno de Sudáfrica 2010, el más reproducido de la historia de los Mundiales con más de **5.300 millones de visualizaciones** en YouTube—. Esta vez, en colaboración con el cantante nigeriano **Burna Boy** (35 años, ganador del Grammy 2021), estrenó el pasado **14 de mayo** la canción oficial del Mundial 2026: **"Dai Dai"**.

**El estilo musical**: fusión de **afrobeats**, **dance pop** y **reggaeton**, con un estribillo coral que canta *"Dai, dai, ikou, dale, allez, let's go"* —seis palabras en seis idiomas (japonés "ikou", español "dale", francés "allez", inglés "let's go", igbo "dai")—. Los dos artistas alternan inglés y español a lo largo de los **3 minutos y 47 segundos** del tema, con frases puntuales en **italiano, francés y japonés** que refuerzan el carácter multicultural del Mundial 2026 (primer torneo en tres países).

**Los datos del lanzamiento**: en **una semana** desde el estreno (14-may), el tema acumuló **180 millones de reproducciones** en Spotify y **350 millones** en YouTube. Es el **debut de canción mundialista con más reproducciones** en una semana, batiendo a "We Are One" (Pitbull / Jennifer Lopez, Brasil 2014) y a "Hayya Hayya" (Trinidad Cardona, Catar 2022).

**La iniciativa social asociada**. La canción no es solo himno: alimenta una **iniciativa global de educación** que la FIFA, Shakira y Burna Boy han diseñado para canalizar **100 millones de dólares** a programas de escolarización en países subdesarrollados. Los royalties del tema y las donaciones cruzadas se destinarán a este fondo. Es la primera vez que un himno mundialista tiene asociado un programa filantrópico estructural.

**El bombazo del halftime show**. La FIFA anunció en paralelo —y este es el dato editorialmente más relevante— que **la final del Mundial 2026** (19 de julio, MetLife Stadium, Nueva Jersey) tendrá **el primer espectáculo de medio tiempo de la historia de los Mundiales**, replicando el modelo de la Super Bowl. Los **tres coheadliners confirmados**:

- **Shakira** (Colombia) — performance en castellano + Latin pop fusion.
- **Madonna** (USA) — 65 años, su primer halftime show estadounidense desde la Super Bowl 2012. La FIFA habría pagado cifra récord (no oficializada, prensa habla de ~$15M).
- **BTS** (Corea del Sur) — la banda K-pop que más entradas vendió en sus giras 2018-2019. Reunión completa de los 7 miembros post-servicio militar.

**El formato del show**: **15 minutos** entre el descanso del primer tiempo y el reinicio. Es la primera vez en la historia del Mundial que se interrumpe el descanso natural con un espectáculo de esta envergadura. Algunos sectores del fútbol europeo (UEFA, federaciones nórdicas) han criticado la "americanización" del torneo.

**Por qué importa**. La final del Mundial 2026 será **el evento deportivo de mayor audiencia mundial de la historia**, con audiencia estimada de **2.500 millones de espectadores** (más que la última final del Mundial Catar 2022 que tuvo 1.500 millones). Multiplicar audiencia × producción de medio tiempo = el primer mega-evento global que aúna deporte y espectáculo musical a esta escala.

**Datos prácticos**:
- "Dai Dai" → [Spotify](https://open.spotify.com/) y [YouTube oficial FIFA](https://www.youtube.com/@FIFA).
- Final 19 de julio → 21:00 hora del Este USA, 03:00 hora de Madrid.
- Audiencia esperada → emisión en 195 países, 16 idiomas oficiales.

Más sobre los **eventos asociados al Mundial 2026** en [/2026/fan-zone](/2026/fan-zone) y la **información de entradas para la final** en [/2026/entradas](/2026/entradas).`,
    category: 'ceremonia',
    sourceName: 'FIFA',
    sourceUrl:
      'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/shakira-and-burna-boy-dai-dai-the-official-song',
    sourceLang: 'en',
    publishedAt: '2026-05-15T18:00:00Z',
    sourcesSecondary: [
      {
        name: 'ESPN · Shakira teaser Burna Boy',
        url: 'https://www.espn.com/soccer/story/_/id/48710188/shakira-unveils-teaser-official-world-cup-anthem-burna-boy',
      },
      {
        name: 'Billboard · Shakira halftime show',
        url: 'https://www.billboard.com/video/shakira-performing-fifa-world-cup-2026-final-halftime-show/',
      },
      {
        name: 'NPR · Shakira returns to World Cup duty',
        url: 'https://www.npr.org/2026/05/15/nx-s1-5823435/world-cup-official-song-shakira-burna-boy',
      },
      {
        name: 'NBC Miami · Dai Dai',
        url: 'https://www.nbcmiami.com/world-cup/shakira-burna-boy-official-2026-fifa-world-cup-anthem-dai-dai/3809481/',
      },
    ],
  },
  {
    slug: 'entradas-mundial-2026-precios-caen-24-por-ciento-reventa-paraguay-australia-140-dolares-cheaper',
    title:
      'Las entradas del Mundial 2026 se desploman un 24% en treinta días: Paraguay-Australia desde $140 y la entrada media de grupos cae de $720 a $560',
    summary:
      'Los precios de reventa del Mundial 2026 acumulan una caída del 24% en el último mes y un 8% solo en la última semana, según TicketData.com. La entrada de "get-in" media de fase de grupos ha bajado de $720 a $560. El partido más barato hoy es Paraguay-Australia ($140). Hasta el debut de EE.UU. en Los Ángeles (12 de junio) sigue sin vender, con reventa por debajo de $1.000. Causas: FIFA libera más stock, demanda más débil de lo esperado, encarecimiento de vuelos por la guerra de Irán y presión inflacionista.',
    body: `Si llevas meses postergando la decisión de comprar entrada al Mundial 2026, la espera te ha salido rentable: los precios **están en caída libre**. Según el agregador de datos **TicketData.com**, los precios de reventa de **más del 90% de los partidos** han caído un **24% en los últimos 30 días** y un **8% solo en la última semana**. Es el primer derrumbe medible del torneo, y se debe a tres factores combinados.

**Causa 1: FIFA libera más stock**. Cada lunes y jueves desde principios de mayo, FIFA descarga nuevas bolsas de inventario en *fifa.com/tickets* dentro de la **Phase 4 (Last-Minute Sales)** activa desde el 1 de abril. Esta liberación obliga a los revendedores (StubHub, SeatGeek, Viagogo) a **bajar sus precios** para seguir compitiendo. Aficionados que en marzo pagaron $1.500 por un asiento ahora ven que el mismo asiento en la oficial baja a $900.

**Causa 2: demanda más débil de lo esperado**. FIFA contaba con vender el 98% del aforo total. Hoy, según fuentes del propio organismo, la cifra está en torno al **88-90%**. **Diecisiete de los 104 partidos** están agotados (la final, la inauguración, todos los choques de USA-Brasil-Argentina en sede norteamericana), pero el resto conserva disponibilidad y el ritmo de venta se ha ralentizado.

**Causa 3: el coste del desplazamiento se ha disparado**. El conflicto en Irán ha disparado los precios del petróleo y, en consecuencia, los **billetes transatlánticos** llevan tres semanas con incrementos del 30-40% sobre tarifas de abril. Vuelos Madrid-Nueva York que en marzo costaban $700 hoy están en $980. Hoteles en host cities (NYC, Boston, Los Ángeles) han subido también, con habitaciones triple-room a partir de $1.200/noche en zonas próximas a estadio.

**Cómo aprovechar la caída ahora mismo**:

- **Entrada media de grupos**: el ticket de *get-in* (la más barata visible) ha bajado de **$720 a $560** en 30 días. Si esperas otra semana podría caer otros $50-80.
- **El partido más barato del torneo**: **Paraguay-Australia** en el AT&T Stadium de Dallas, **$140** la entrada categoría 4. Es el partido menos demandado de toda la fase de grupos.
- **EE.UU. en Los Ángeles (12 de junio)**: *no se ha vendido* y la reventa más barata está **por debajo de $1.000** —cifra impensable hace tres semanas.
- **Sedes mexicanas son las más asequibles**: Estadio Akron (Guadalajara), BBVA (Monterrey) y Azteca (CDMX) cotizan entre $200 y $450 en fase de grupos. Cobertura completa por sede en [/2026/sedes](/2026/sedes).
- **Supporter Tier de $60**: sigue disponible. Cada partido tiene una bolsa fija de unas 1.000-2.000 entradas a este precio. **Refresca fifa.com/tickets a medianoche hora del Este** (cuando suele caer nuevo stock).

**Qué NO va a bajar**: la final del 19 de julio en MetLife (Front Category 1 sigue en **$10.990**), las semifinales y los partidos con Argentina o Brasil como cabecera. Esos siguen en máximo histórico y el resale autorizado por FIFA llegó a $2,3 millones por un asiento de la final hace dos semanas.

**Una advertencia**: la **reventa fuera de FIFA** (StubHub, SeatGeek, Viagogo) ofrece entradas válidas pero **no garantizadas por FIFA** —si cambia la sede o fecha del partido, no hay reembolso. Las entradas oficiales **fifa.com/tickets** siguen siendo el camino más seguro aunque a veces más caro.

Más detalle del sistema de venta en [/2026/entradas](/2026/entradas) y precios actualizados por sede en [/2026/sedes](/2026/sedes).`,
    category: 'entradas',
    sourceName: 'NBC News',
    sourceUrl:
      'https://www.nbcnews.com/business/consumer/world-cup-ticket-prices-resale-market-hotels-rcna344996',
    sourceLang: 'en',
    publishedAt: '2026-05-22T10:30:00Z',
    sourcesSecondary: [
      {
        name: 'Consequence · 24% drop',
        url: 'https://consequence.net/2026/05/fifa-world-cup-ticket-prices-dropping/',
      },
      {
        name: 'Cassius Life · prices fall',
        url: 'https://cassiuslife.com/1400433/fifa-world-cup-2026-ticket-prices-fall/',
      },
      {
        name: 'NBC Bay Area · Bay Area cheapest',
        url: 'https://www.nbcbayarea.com/news/local/world-cup-tickets-cheapest/4086857/',
      },
      {
        name: 'KTVU · prices dropping',
        url: 'https://www.ktvu.com/news/fifa-world-cup-ticket-prices-dropping-good-news-soccer-fans',
      },
      {
        name: 'Gothamist · prices dropping',
        url: 'https://gothamist.com/news/fifa-world-cup-ticket-prices-are-dropping-but-youll-still-pay-through-the-nose',
      },
    ],
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Arlington_June_2020_4_%28AT%26T_Stadium%29.jpg/1280px-Arlington_June_2020_4_%28AT%26T_Stadium%29.jpg',
      alt: 'AT&T Stadium en Arlington (Dallas), sede del Paraguay-Australia más barato del torneo',
      credit: 'Wikimedia Commons',
      license: 'CC BY-SA 4.0',
    },
  },
  {
    slug: 'entradas-mundial-2026-phase-4-last-minute-sales-dynamic-pricing-60-dolares-supporter-tier-mayo-2026',
    title:
      'Entradas Mundial 2026: la Phase 4 con precios dinámicos en tiempo real, $60 para fans y resale a $2,3 millones por la final',
    summary:
      'A 20 días del partido inaugural, FIFA mantiene activa desde el 1 de abril la Phase 4 (Last-Minute Sales) con venta directa first-come first-served en fifa.com/tickets. El sistema de precios dinámicos —estrenado este Mundial— mueve las tarifas en tiempo real según demanda. 17 partidos están agotados, más de 80 conservan inventario. El Supporter Tier de 60 dólares creado tras la presión del Congreso de EE.UU. está disponible para todos los partidos, incluida la final del 19 de julio.',
    body: `A **20 días del partido inaugural** (México-Sudáfrica, 11 de junio en el Estadio Azteca), el sistema de venta de entradas del **Mundial 2026** entra en su tramo más complicado. FIFA mantiene activa desde el **1 de abril** la **Phase 4 (Last-Minute Sales)**, la cuarta y última fase de venta oficial antes y durante el torneo. Funciona como venta directa en **fifa.com/tickets**, sin sorteo ni lista de espera: *first-come, first-served*, con confirmación inmediata cuando hay stock.

**Precios dinámicos: el cambio de modelo más comentado**. Por primera vez en la historia del Mundial, **los precios suben y bajan en tiempo real** según demanda, fase del torneo, selecciones confirmadas y sede del partido. Hace dos semanas, el ticket más barato del torneo era de **$380** para siete partidos concretos de fase de grupos —típicamente partidos con menor demanda comercial—. La entrada más cara registrada hasta hoy: **$4.105 para USA-Paraguay** en el SoFi Stadium de Los Ángeles el **12 de junio**. La final en MetLife Stadium del 19 de julio cotiza **hasta $10.990** en la categoría Front Category 1, mientras que la reventa oficial autorizada por FIFA ha llegado a registrar listados de **$2,3 millones por asiento**.

**El Supporter Tier de $60: la concesión política**. Tras la **presión del Congreso de Estados Unidos** —69 congresistas firmaron en febrero una carta abierta a Gianni Infantino denunciando la inflación de precios— FIFA introdujo durante la Phase 3 el **Supporter Entry Tier**: una bolsa de entradas a **$60 USD planos**, válidas para **todos los partidos incluida la final**. Es la categoría más alejada del campo (parte alta del fondo) pero conserva visibilidad razonable. Disponibilidad muy limitada por partido (entre 500 y 2.000 entradas por estadio según fuente). FIFA no ha publicado el contador exacto restante.

**Estado del inventario al 22 de mayo**. De los **104 partidos del Mundial 2026**, **17 están oficialmente agotados** según el panel de fifa.com/tickets —entre ellos la final, la inauguración y todos los choques con USA, Brasil y Argentina en sede norteamericana—. Más de **80 partidos** conservan disponibilidad pública, principalmente en fase de grupos y en sedes mexicanas (Estadio Azteca, Estadio Akron, Estadio BBVA), donde el precio dinámico tiende a estabilizarse en franjas más bajas que en USA.

**Random Selection Draw ya cerrado**. La **Phase 3** del sistema FIFA —el *Random Selection Draw* o sorteo aleatorio— funcionó como ventana de aplicación entre el **11 de diciembre de 2025 y el 13 de enero de 2026**. Ya no admite nuevas solicitudes. Los aplicantes recibieron asignación entre marzo y abril; los no agraciados pasaron automáticamente a la lista de espera para la Phase 4 actual.

**Cómo comprar hoy mismo**:

1. Entra en **[fifa.com/tickets](https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/tickets)** o desde la **FIFA+ app**.
2. Crea tu cuenta FIFA ID (DNI o pasaporte verificado obligatorio).
3. Filtra por partido, sede o selección.
4. **Vigila el precio dinámico**: refresca varias veces al día — el sistema rebaja en horas valle (madrugada hora local de la sede).
5. Si tu objetivo es el Supporter Tier ($60), entra a las **00:00 GMT-5** (medianoche en Nueva York), franja en la que históricamente liberan más stock de esta categoría.

**Reventa oficial autorizada**: solo a través del marketplace de FIFA. Cualquier otra plataforma (StubHub, Viagogo, Ticombo) puede tener entradas válidas pero **no garantizadas por FIFA**: en caso de cambio de sede o fecha, FIFA no reembolsa al comprador final.

**Si quieres ahorrar**: prioriza partidos en **México** (Akron y BBVA tienen las tarifas más bajas del torneo) y evita los partidos con USA, Brasil o Argentina como local-aparente. Más detalle por sede y precios actuales en [/2026/entradas](/2026/entradas).`,
    category: 'entradas',
    sourceName: 'FIFA',
    sourceUrl:
      'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/sales-phases',
    sourceLang: 'en',
    publishedAt: '2026-05-22T09:00:00Z',
    sourcesSecondary: [
      {
        name: 'FIFA · Last-Minute Sales Phase',
        url: 'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/last-minute-tickets-sales-phase-to-start-on-1-april',
      },
      {
        name: 'FIFA · New Supporter Entry Tier',
        url: 'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/fifa-world-cup-2026-new-ticket-pricing-tier',
      },
      {
        name: 'WorldCupWiki · Tickets May 2026',
        url: 'https://worldcupwiki.com/tickets/',
      },
      {
        name: 'Goal.com · Next Ticket Sale Guide',
        url: 'https://www.goal.com/en-us/news/when-is-the-next-world-cup-ticket-sale-guide/blt6834d6a509343753',
      },
    ],
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Metlife_stadium_%28Aerial_view%29.jpg/1280px-Metlife_stadium_%28Aerial_view%29.jpg',
      alt: 'Vista aérea del MetLife Stadium, sede de la final del Mundial 2026',
      credit: 'Wikimedia Commons',
      license: 'CC BY-SA 4.0',
    },
  },
  {
    slug: 'semana-cierre-convocatorias-mundial-2026-alemania-inglaterra-espana-paises-bajos-marruecos-noruega-deadline-1-junio',
    title:
      'Recta final de las convocatorias del Mundial 2026: Alemania, Marruecos y Noruega anuncian mañana; Inglaterra el viernes; España y Países Bajos cierran el 25 de mayo',
    summary:
      'Quedan once días para el cierre FIFA del 1 de junio y la mayoría de las grandes selecciones todavía no han revelado los 26 elegidos. Alemania de Julian Nagelsmann, Marruecos de Walid Regragui y Noruega de Ståle Solbakken cierran este jueves 21 de mayo. Inglaterra de Thomas Tuchel publica su lista el viernes 22. España (Luis de la Fuente) y Países Bajos (Ronald Koeman) esperan al lunes 25 de mayo. Egipto abrió hoy su prelista provisional de 27 jugadores con Mohamed Salah.',
    body: `Hoy **miércoles 20 de mayo** marca el inicio de la **semana clave de cierres de convocatoria** del Mundial 2026. Faltan **once días** para la fecha límite que la FIFA fijó el **1 de junio** para que las 48 selecciones entreguen su lista definitiva de 26 jugadores. Hasta hoy, 19 selecciones tienen lista cerrada y 10 trabajan con prelista provisional —el resto, 19, todavía no ha pronunciado palabra oficial.

**Mañana, jueves 21 de mayo**, tres pesos pesados rompen el silencio. **Alemania** —dirigida por **Julian Nagelsmann**, que llevó al equipo a las semifinales de la Eurocopa 2024 en casa— anuncia su lista en el centro de entrenamiento de Herzogenaurach. Su agenda incluye amistosos contra Suecia (3 de junio) y Croacia (7 de junio) antes del debut mundialista. **Marruecos**, semifinalista en Catar 2022, hace lo propio bajo **Walid Regragui** desde Salé. **Noruega**, en su primer Mundial desde 1998 con la generación de Erling Haaland, presenta a los 26 elegidos de **Ståle Solbakken** en Oslo.

**El viernes 22 de mayo, Inglaterra**. **Thomas Tuchel**, contratado en otoño de 2024 tras la salida de Gareth Southgate, dará por fin su primera convocatoria mundialista al frente de los Tres Leones. El alemán enfrentará la decisión más complicada de su mandato: si llevar a Harry Kane (33 años, capitán y máximo goleador histórico) o apostar por la nueva generación liderada por Jude Bellingham, Cole Palmer y Bukayo Saka.

**El lunes 25 de mayo cierran España y Países Bajos**, las dos selecciones europeas con calendario más tardío. **Luis de la Fuente** (campeón de la Eurocopa 2024) anunciará su lista en la Ciudad del Fútbol de Las Rozas tras los amistosos pre-Mundial de la última semana de mayo. **Ronald Koeman** y la *Oranje* hacen lo mismo en Zeist el mismo día.

**Egipto abrió la jornada con prelista provisional** de **27 jugadores**, encabezada por **Mohamed Salah** (Liverpool), que viaja a su segundo Mundial a los 33 años tras la frustrante eliminación en cuartos de la AFCON 2026. Hossam Hassan, seleccionador, recortará a 26 antes del **29 de mayo**, fecha de la lista definitiva egipcia. Es la primera prelista africana publicada esta semana —Marruecos lo hará mañana en formato definitivo.

**Lo que queda sin anunciar**: España, Inglaterra, Alemania, Marruecos, Países Bajos, Noruega, EE.UU., Canadá, Uruguay, Senegal, Ecuador, Argelia, Ghana, Panamá, Arabia Saudí, Sudáfrica, Australia, Irak, Paraguay.

**Calendario completo de listas** en [/2026/listas](/2026/listas) y plazos FIFA en [/2026/convocatorias](/2026/convocatorias).`,
    category: 'convocatorias',
    sourceName: 'Sky Sports',
    sourceUrl:
      'https://www.skysports.com/football/news/11095/13543070/world-cup-2026-squad-lists-england-scotland-brazil-usa-spain-france-germany-netherlands-argentina-portugal-and-more',
    sourceLang: 'en',
    publishedAt: '2026-05-20T09:00:00Z',
    sourcesSecondary: [
      {
        name: 'ESPN',
        url: 'https://www.espn.com/soccer/story/_/id/48757621/2026-world-cup-squad-lists-players-announced-all-48-teams',
      },
      {
        name: 'Foot Africa · Switzerland squad',
        url: 'https://foot-africa.com/en/news/world-cup-2026-switzerland-announces-its-squad-list-1212590/',
      },
    ],
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Vista_a%C3%A9rea_del_Estadio_Azteca_-_2026_-_02.jpg/1280px-Vista_a%C3%A9rea_del_Estadio_Azteca_-_2026_-_02.jpg',
      alt: 'Vista aérea del Estadio Azteca remodelado para el Mundial 2026',
      credit: 'Wikimedia Commons',
      license: 'CC BY-SA 4.0',
    },
  },
  {
    slug: 'egipto-prelista-mundial-2026-mohamed-salah-segundo-mundial-hossam-hassan',
    title:
      'Egipto inaugura la semana africana de listas: Hossam Hassan llama a 27 jugadores con Mohamed Salah como referencia para el Mundial 2026',
    summary:
      'La Federación Egipcia de Fútbol publicó este miércoles 20 de mayo la lista provisional de 27 jugadores convocados por Hossam Hassan para el Mundial 2026. Mohamed Salah, capitán y máximo goleador histórico de los Faraones, llega a su segundo Mundial a los 33 años. La definitiva se conocerá el 29 de mayo. Egipto debuta el 14 de junio en Boston contra Argelia en el Grupo F.',
    body: `La **Federación Egipcia de Fútbol (EFA)** anunció este miércoles **20 de mayo** la **lista provisional de 27 jugadores** convocados por el seleccionador **Hossam Hassan** para el Mundial 2026. La noticia, esperada en El Cairo desde hace semanas, abre la fase final de cierres de convocatoria de las selecciones africanas que jugarán en Estados Unidos, Canadá y México.

**Mohamed Salah, capitán y referencia**. El delantero del Liverpool, **33 años**, máximo goleador histórico de Egipto con **57 goles** en 99 partidos internacionales, viaja a su **segundo Mundial**. La primera vez fue en Rusia 2018, donde Egipto cayó eliminado en fase de grupos tras perder contra Uruguay y la anfitriona Rusia, en parte por la lesión de hombro que el propio Salah arrastraba desde la final de Champions con el Liverpool. Esta vez llega en plenitud y con un equipo más maduro: campeón de la AFCON 2026 ante Marruecos en febrero, semifinalista en 2023.

**El núcleo del equipo más allá de Salah**. **Trezeguet** (Trabzonspor), **Mostafa Mohamed** (Nantes) e **Ibrahim Adel** (Pyramids) acompañan al egipcio del Liverpool por delante. En el medio, el regreso de **Mohamed Elneny** (Al-Jazira), recuperado de la lesión de larga duración, y la consolidación del joven **Emam Ashour** (Al-Ahly) como conductor. La defensa la lidera **Mahmoud Hamdy** "El Wensh" (Zamalek) junto a **Omar Kamal** (Pyramids). En el arco, **Mohamed El Shenawy** (Al-Ahly) repite titularidad.

**La fecha clave: 29 de mayo**. Hossam Hassan reducirá la prelista de 27 a los 26 elegidos definitivos el viernes 29 de mayo, una semana antes de viajar a Norteamérica. Antes, Egipto disputará dos amistosos pre-Mundial: ante Cabo Verde en El Cairo (24 de mayo) y ante Túnez en Rades (29 de mayo).

**Grupo F · Argelia, Egipto, Estados Unidos y Australia**. La selección faraónica debutará el **14 de junio en el Gillette Stadium de Foxborough (Boston)** contra Argelia, en el partido más comentado del grupo: dos potencias norteafricanas con rivalidad histórica. Después, Egipto se medirá a EE.UU. en Filadelfia (19 de junio) y cerrará contra Australia en Atlanta (23 de junio).

**Más sobre la AFCON 2026 y el camino de Egipto** en [/selecciones/EGY](/selecciones/EGY) y los amistosos previos en [/2026/listas/EGY](/2026/listas/EGY).`,
    category: 'convocatorias',
    sourceName: 'Daily Sports',
    sourceUrl: 'https://dailysports.net/news/egypts-squad-for-the-2026-world-cup/',
    sourceLang: 'en',
    publishedAt: '2026-05-20T11:30:00Z',
    sourcesSecondary: [
      {
        name: 'FIFA · Egypt team news',
        url: 'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/teams/egypt/team-news',
      },
    ],
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Mohamed_Salah_2018.jpg',
      alt: 'Mohamed Salah, capitán de Egipto y delantero del Liverpool',
      credit: 'Wikimedia Commons',
      license: 'CC BY-SA 3.0',
    },
  },
  {
    slug: 'convocatoria-portugal-mundial-2026-roberto-martinez-cristiano-ronaldo-sexto-mundial-41-anos',
    title:
      'Cristiano Ronaldo a su sexto Mundial: Roberto Martínez confirma a CR7 capitán de Portugal a sus 41 años en la lista de 26 para el Mundial 2026',
    summary:
      'Roberto Martínez anunció este martes 19 de mayo en la Cidade do Futebol de Oeiras la lista definitiva de 26 jugadores de Portugal para el Mundial 2026. Cristiano Ronaldo, a sus 41 años, lidera la convocatoria como capitán para su sexto Mundial consecutivo —récord absoluto que comparte con Modrić, Carlos Cetenstein, Lothar Matthäus y Rafael Márquez. Bruno Fernandes, Bernardo Silva, Vitinha y João Neves forman uno de los mejores mediocampos del torneo. Portugal está en el Grupo K con Colombia, RD Congo y Uzbekistán.',
    body: `**Roberto Martínez** hizo oficial este **martes 19 de mayo a las 13:00 hora de Lisboa** la lista definitiva de 26 jugadores de [Portugal](/selecciones/POR) para el Mundial 2026. El anuncio se realizó en la **Cidade do Futebol de Oeiras**, sede de la Federación Portuguesa de Fútbol (FPF), con rueda de prensa del seleccionador y los siete asistentes técnicos a su cargo.

**La única certeza: Cristiano Ronaldo**. El número 7 de Portugal, capitán histórico de la selección y máximo goleador absoluto del fútbol internacional con **140 goles** acumulados en 222 partidos, llega a su **sexto Mundial consecutivo** (2006, 2010, 2014, 2018, 2022, 2026) a la edad de **41 años**. Iguala el récord histórico de cinco-seis Mundiales consecutivos que comparten ya **Luka Modrić** (Croacia, también 2026), **Lothar Matthäus** (Alemania 1982-1998), **Rafael Márquez** (México 2002-2018) y **Carlos Cetenstein** (México 1950-1966, el primero histórico). En sus 5 Mundiales previos, Cristiano ha marcado **8 goles** —cifra modesta para su nivel goleador en clubes, parcialmente explicada por las eliminaciones tempranas de Portugal en cuartos (2006), grupos (2014) y octavos (2010, 2018, 2022).

**El núcleo creativo: uno de los mejores mediocampos del torneo**. Roberto Martínez mantiene a las dos parejas titulares del centro del campo: **Vitinha** (PSG, MVP de la Champions League 2024) y **João Neves** (PSG, 21 años, sensación de la temporada en Ligue 1) por el lado de la construcción; **Bruno Fernandes** (Manchester United, capitán club) y **Bernardo Silva** (Manchester City) por el lado de la creación. Como cuarta opción, **Rúben Neves** (Al-Hilal) entra de relevo. Sin Renato Sanches (ya retirado) y sin Danilo Pereira (lesionado), la convocatoria refleja la transición generacional clara entre la "generación dorada" y los nacidos en el siglo XXI.

**Las grandes apuestas ofensivas**. **João Félix** (Chelsea), recuperando nivel competitivo tras una temporada irregular, aparece como segundo delantero. **Rafael Leão** (Milan) por la izquierda. **Diogo Jota** (Liverpool) como alternativa al 9. **Gonçalo Ramos** (PSG, autor del hat-trick a Suiza en Catar 2022 cuando sustituyó a Cristiano) está dentro. **Pedro Neto** (Chelsea) como extremo eléctrico. La idea de Martínez ha sido alargar el ataque para tener varias soluciones según el rival.

**Las ausencias notables**. **Pepe** (Porto), defensor histórico de 43 años, **fuera de la convocatoria** —ya había renunciado a la selección en septiembre de 2024. **João Cancelo** (Al-Hilal) queda fuera por discrepancias con Martínez (tras protesta pública por su rol en Catar 2022). **Otávio** (Al-Nassr) excluido por bajo rendimiento. **Hugo Almeida** (Sporting CP) tampoco pese a sus buenos meses. **Joelson Fernandes** (Sporting CP), el extremo juvenil que algunos esperaban como sorpresa, queda fuera.

**Los 26 elegidos por línea**:

**Porteros (3):** Diogo Costa (Porto, titular), Rui Patrício (Al-Ain) y José Sá (Wolves).

**Defensas (8):** Rúben Dias (Manchester City, central referencia), António Silva (Benfica), Diogo Dalot (Manchester United), Nuno Mendes (PSG), Nélson Semedo (Wolves), Renato Veiga (Chelsea, sorpresa juvenil), João Cancelo si vuelve por última hora —no confirmado—, Domingos Duarte (Granada).

**Mediocampistas (6):** Bruno Fernandes (Manchester United, capitán club), Bernardo Silva (Manchester City), Vitinha (PSG), João Neves (PSG), Rúben Neves (Al-Hilal), Otávio fuera, Florentino Luís (Benfica).

**Delanteros (9):** **Cristiano Ronaldo** (Al-Nassr, capitán de selección), João Félix (Chelsea), Rafael Leão (Milan), Diogo Jota (Liverpool), Gonçalo Ramos (PSG), Pedro Neto (Chelsea), Bernardo Silva como mediapunta alternativo, Bruma (Braga), Trincão (Sporting CP).

**Cristiano capitán por última vez**. Lo que muchos sospechan: este **será probablemente el último Mundial** del jugador más mediático del fútbol mundial. Cristiano cumple **42 años en febrero de 2027** y su contrato con el Al-Nassr expira en junio de 2027. Roberto Martínez le ha confirmado en rueda de prensa que será **el capitán de Portugal mientras juegue**, y la decisión final sobre su retirada de la selección la tomará él mismo tras el torneo. *"Esta podría ser la última vez. Por eso quiero hacer historia"*, dijo Cristiano en una entrevista a la Sky Italia hace dos semanas.

**Grupo K: contra Colombia, RD Congo y Uzbekistán**. Portugal cae en uno de los grupos más equilibrados del torneo. **Colombia** (de [Néstor Lorenzo](/noticias/prelista-colombia-mundial-2026-nestor-lorenzo-james-luis-diaz-ospina-falcao-fuera) con James y Luis Díaz) es el principal favorito por detrás del rival vigente —Portugal—. **RD Congo** debuta como sustituta de la generación Mbemba-Bakambu. **Uzbekistán** es la sorpresa absoluta del torneo: primer Mundial de su historia tras una clasificación AFC sin perder un partido. El partido **Portugal-Colombia el 27 de junio en Hard Rock Stadium (Miami)** será el más esperado del grupo.

**Próximos pasos**. Portugal concentra el **27 de mayo en Cidade do Futebol**. Dos amistosos previos al Mundial:
- **6 de junio vs Chile** en el Estádio do Dragão de Oporto
- **10 de junio vs Nigeria** en el Estádio José Alvalade de Lisboa

Después, viaje a Estados Unidos el **12 de junio**. Portugal **debuta el 17 de junio a las 12:00 ET vs RD Congo en el NRG Stadium de Houston**, segundo partido el **24 de junio vs Uzbekistán** y cierre del grupo el **27 de junio vs Colombia**.

**Roberto Martínez busca su primera final**. El seleccionador catalán, contratado en enero de 2023 tras la salida de Fernando Santos, ha llevado a Portugal a un récord histórico de **11 victorias en 12 partidos** de clasificación. Pero el reto en el Mundial es otro: Portugal **nunca ha llegado a una final** (terceros en 1966 con Eusébio, semifinales en 2006 con Scolari, cuartos en 2002, 2010 y 2018). El propio Martínez admitió tras la rueda de prensa: *"El objetivo no es solo participar. Esta plantilla tiene calidad para llegar a semifinales como mínimo"*.

**Calendario completo y previa rival** en [/2026/listas/POR](/2026/listas/POR). Más sobre Cristiano Ronaldo y su carrera con Portugal en [/selecciones/POR](/selecciones/POR).`,
    category: 'convocatorias',
    sourceName: 'RTP Notícias',
    sourceUrl: 'https://www.rtp.pt/noticias/selecao-nacional/mundial2026-lista-de-convocados-de-portugal-divulgada-em-19-de-maio_d1739574',
    sourceLang: 'pt',
    publishedAt: '2026-05-19T13:00:00Z',
    sourcesSecondary: [
      {
        name: 'Diário de Notícias · Roberto Martínez revela convocados para o Mundial 2026',
        url: 'https://www.dn.pt/desporto/roberto-martnez-revela-convocados-de-portugal-para-o-mundial2026-na-tera-feira-19-no-se-esperam-surpresas',
      },
      {
        name: 'Adeptos de Bancada · Convocatoria Portugal 19 maio',
        url: 'https://adeptosdebancada.com/convocatoria-portugal-mundial-2026-terca-feira-19-maio/',
      },
      {
        name: 'Infobae · Portugal anunció la fecha para entregar la lista definitiva',
        url: 'https://www.infobae.com/colombia/deportes/2026/05/07/portugal-anuncio-la-fecha-para-entregar-la-lista-definitiva-de-jugadores-que-estaran-en-el-mundial-de-2026/',
      },
      {
        name: 'FourFourTwo · Portugal World Cup 2026 squad',
        url: 'https://www.fourfourtwo.com/team/portugal-world-cup-2026-squad',
      },
      {
        name: 'Yahoo Sports · Inside Portugal\'s World Cup roster 2026',
        url: 'https://sports.yahoo.com/articles/inside-portugals-world-cup-roster-060002252.html',
      },
    ],
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Cristiano_Ronaldo_2223.jpg/1280px-Cristiano_Ronaldo_2223.jpg',
      alt: 'Cristiano Ronaldo con Portugal en clasificación al Mundial 2026 (Armenia-Portugal, 6 sep 2025)',
      credit: 'YantsImages · Asatur Yesayants',
      license: 'CC BY-SA 4.0 · Wikimedia Commons',
    },
  },
  {
    slug: 'convocatoria-brasil-mundial-2026-ancelotti-26-neymar-cuarto-mundial-rodrygo-fuera',
    title:
      'Ancelotti llama a Neymar para su cuarto Mundial: la convocatoria definitiva de Brasil con sorpresas para el debut de un italiano en la Canarinha',
    summary:
      'Carlo Ancelotti presentó este lunes en el Museu do Amanhã de Río la lista definitiva de 26 jugadores de Brasil para el Mundial 2026. Neymar está dentro tras meses de duda por su forma física. Rodrygo y Antony quedan fuera. Tres porteros (Alisson, Ederson, Weverton), Marquinhos capitán y cuatro debuts mundialistas: Igor Thiago, Wesley, Rayan y Luis Henrique. Brasil debuta el 13 de junio en Filadelfia.',
    body: `Carlo Ancelotti hizo oficial este **lunes 18 de mayo** la **lista definitiva de 26 jugadores** que defenderán a [Brasil](/selecciones/BRA) en el Mundial 2026. El anuncio se realizó a las **16:00 hora de Brasilia** en el Museu do Amanhã de Río de Janeiro, en lo que es la primera convocatoria mundialista del entrenador italiano desde que llegó al banquillo brasileño en mayo de 2026 tras el contrato sin precedentes de la CBF con el técnico tetracampeón de Champions con el Real Madrid.

**El primer Mundial de un entrenador extranjero al frente de Brasil.** Ancelotti es el **primer seleccionador no brasileño** que dirige a la Verdeamarela en una Copa del Mundo. La CBF rompió con la tradición tras dos Mundiales decepcionantes (eliminado en cuartos por Bélgica 2018 y por Croacia 2022) con la apuesta más mediática del fútbol mundial. Carlo trabaja con un cuerpo técnico mixto: **Davide Ancelotti** (su hijo) como asistente principal, **Mauro Tassotti** como segundo asistente y los brasileños **Cesar Sampaio** como puente con la cultura local y **Cleber Xavier** retenido del equipo de Dorival Júnior.

**La gran noticia: Neymar dentro**. Las dudas sobre el capitán histórico se mantuvieron hasta el último día. Neymar Jr., de 34 años, vuelve a un Mundial **cuatro años después** de Catar 2022 (donde se lesionó el tobillo y tuvo que jugar limitado). Es su **cuarto Mundial** consecutivo (2014, 2018, 2022, 2026) y se acerca al récord de Cafú y Ronaldinho. El jugador, ahora en el **Santos** tras abandonar el Al-Hilal en febrero, había recuperado nivel competitivo en las últimas semanas con Vasco da Gama como punto de comparación —dos goles y tres asistencias en abril. Ancelotti zanjó la pregunta más comentada del fútbol brasileño: *"Neymar es un genio y un capitán. No podía dejarlo fuera"*.

**Las grandes ausencias: Rodrygo y Antony**. El extremo del Real Madrid **Rodrygo Goes** queda fuera por segunda convocatoria consecutiva (también estaba fuera de la prelista de 55 publicada el 11 de mayo). Ancelotti, que lo entrenó en Madrid hasta su salida en mayo de 2025, ha decidido apostar por **Endrick** y **Vinícius Júnior** como referencias jóvenes ofensivas, dejando a Rodrygo como víctima de la sobreoferta. **Antony**, del Real Betis, tampoco recibe la llamada pese a su gran segunda mitad de temporada en LaLiga. Otros nombres ausentes notables: **Casimiro** (sí está), **Gabriel Jesús** (lesión rodilla larga, fuera del Mundial), **Bruno Henrique** y **Pedro** del Flamengo, **Richarlison** del Tottenham (forma irregular).

**Los 26 elegidos por línea**:

**Porteros (3):** Alisson Becker (Liverpool, titular indiscutible), Ederson Moraes (Manchester City) y Weverton (Palmeiras).

**Defensas (10):** Alex Sandro (Flamengo), Bremer (Juventus), Danilo (Flamengo, ex-Manchester City), Douglas Santos (Zenit), Gabriel Magalhães (Arsenal), Roger Ibañez (Al-Ahli), Leo Pereira (Flamengo), Marquinhos (PSG, capitán confirmado), Wesley (Roma, debutante mundialista).

**Mediocampistas (5):** Bruno Guimarães (Newcastle), Casemiro (Manchester United), Fabinho (Al-Ittihad), Lucas Paquetá (West Ham, regresa tras suspensión por apuestas levantada en marzo).

**Delanteros (8):** Endrick (Real Madrid, 19 años), Gabriel Martinelli (Arsenal), Igor Thiago (Brentford, debutante), Luis Henrique (Olympique de Marsella, debutante), Matheus Cunha (Manchester United), Neymar (Santos, capitán emocional), Raphinha (Barcelona), Rayan (Vasco da Gama, 18 años debutante), Vinícius Júnior (Real Madrid).

**Cuatro debutantes mundialistas: Wesley, Igor Thiago, Luis Henrique y Rayan**. La novedad más fuerte. **Wesley** llegó al Roma en enero de 2026 desde el Cruzeiro por 20 millones de euros y se convirtió en titular automático del lateral derecho. **Igor Thiago**, ariete del Brentford, recibe la llamada tras seis goles en cinco partidos de la Premier League en abril. **Luis Henrique**, extremo del Marsella, gana posición a Antony por su capacidad de jugar por izquierda o derecha. **Rayan**, juvenil del Vasco da Gama de 18 años, es la apuesta sorpresa de Ancelotti: el técnico italiano lo vio en febrero en un partido de Brasileirão y le dio entrada al grupo absoluto.

**Marquinhos capitán, Neymar capitán emocional**. El defensor del PSG mantiene la cinta por decisión técnica. Pero Ancelotti ha confirmado que **Neymar** será **"el capitán dentro del campo cuando juegue"**, una formula híbrida que combina la jerarquía de Marquinhos con el peso mediático del 10. Es una decisión similar a la que Tite tomó en Catar 2022 con Thiago Silva-Neymar.

**Próximos pasos**. Brasil concentra el **25 de mayo en Granja Comary** (Teresópolis, sede histórica). Los jugadores europeos llegan tras las finales de sus ligas (Liverpool, Manchester City, Arsenal, etc.). El **viaje a Estados Unidos** está previsto para el **3 de junio**, con base de entrenamiento en Orlando hasta el debut. Antes, dos amistosos: **vs Colombia el 27 de mayo** en el Maracaná de Río y **vs Suiza el 4 de junio** en Filadelfia.

**Grupo C: debut el 13 de junio**. Brasil está encuadrada en el [Grupo C](/2026/grupo/C) con Marruecos, Escocia y Haití. **Debuta el 13 de junio a las 18:00 ET vs Marruecos** en el MetLife Stadium de Nueva York/NJ. El segundo partido es el **19 de junio vs Haití** en Lincoln Financial Field (Filadelfia), y el tercero el **24 de junio vs Escocia** en Hard Rock Stadium (Miami). Es un grupo competitivo: Marruecos llega como semifinalista de Catar 2022 con Hakimi y Ziyech.

**El reto de Ancelotti**. Carlo Ancelotti llega al Mundial con **un objetivo declarado: ganarlo todo**. La frase la repitió en su rueda de prensa de presentación en mayo de 2025: *"Brasil no tiene techo. Si los jugadores creen, ganamos"*. Es el primer entrenador europeo que dirige a Brasil en un Mundial (cuatro previos europeos fueron asistentes: Albano de Trani 1934 con Cardetti, etc., pero ninguno como entrenador principal). El reto pesa: Brasil no gana un Mundial desde **2002** (24 años de sequía). Si Ancelotti lo consigue, sería el primer entrenador en ganar Champions League y Mundial. Lippi (Italia 2006 + Champions con Juventus 1996) lo hizo pero no las dos en años distantes.

**Calendario completo de Brasil en Mundial 2026** en [/2026/listas/BRA](/2026/listas/BRA). Más sobre Neymar y su carrera con la Canarinha en [/selecciones/BRA](/selecciones/BRA).`,
    category: 'convocatorias',
    sourceName: 'Crónica',
    sourceUrl: 'https://www.cronica.com.mx/deportes/2026/05/18/ancelotti-anuncia-convocatoria-de-brasil-para-el-mundial-2026-esta-neymar/',
    sourceLang: 'es',
    publishedAt: '2026-05-18T20:00:00Z',
    sourcesSecondary: [
      {
        name: 'Semana · Ancelotti revela convocados de Brasil, decisión final con Neymar',
        url: 'https://www.semana.com/deportes/articulo/carlo-ancelotti-revelo-convocados-de-brasil-para-el-mundial-decision-final-con-neymar/202602/',
      },
      {
        name: 'Ahora · Brasil anuncia convocados al Mundial. Horario y dónde ver',
        url: 'https://ahora.com.pe/deportes/brasil-anuncia-convocados-al-mundial-horario-y-donde-ver-la-lista',
      },
      {
        name: 'Meridiano · Ancelotti publicará la convocatoria de Brasil',
        url: 'https://meridiano.net/mundial-2026/carlo-ancelotti-publicara-la-convocatoria-de-brasil-para-el-mundial-de-2026-en-esta-fecha-202651718400',
      },
      {
        name: 'El Mundo SV · Ancelotti anunciará convocatoria de Brasil el 18 mayo',
        url: 'https://diario.elmundo.sv/deportes/ancelotti-anunciara-convocatoria-de-brasil-para-mundial-el-18-mayo',
      },
    ],
  },
  {
    slug: 'convocatorias-mundial-2026-bosnia-nueva-zelanda-tunez-croacia-18-mayo-actualizacion-listas-definitivas',
    title:
      'Convocatorias Mundial 2026: Bosnia, Nueva Zelanda y Túnez confirman 26 definitivos. Croacia anuncia hoy y Holanda esta semana',
    summary:
      'A las 24 horas del cierre de la semana decisiva de convocatorias, tres selecciones más han confirmado sus listas definitivas de 26 jugadores: Bosnia (Barbarez), Nueva Zelanda (Bazeley) y Túnez (Lamouchi). Croacia (Dalić) anuncia hoy con Modrić de capitán a sus 40 años. Holanda (Koeman) cierra la semana el jueves 21 de mayo.',
    body: `Tres selecciones más han confirmado sus listas definitivas de 26 jugadores para el [Mundial 2026](/2026/calendario) en los últimos días: **Bosnia-Herzegovina** (con Sergej Barbarez), **Nueva Zelanda** (Darren Bazeley) y **Túnez** (Sabri Lamouchi). Con estos anuncios, suman **9 selecciones con lista definitiva** (Suecia, Francia, Japón, Bélgica, Haití, Costa de Marfil + las tres de esta noticia) y **9 más con prelista de 55** (España, Argentina, Brasil, Colombia, México, Corea del Sur, Chequia, Qatar, Paraguay, Uzbekistán). Quedan 30 selecciones pendientes a 14 días del [partido inaugural](/2026/sedes/ciudad-de-mexico) del 11 de junio.

**🇧🇦 Bosnia-Herzegovina — Sergej Barbarez al mando**. Bosnia anunció su definitiva el 11 de mayo, una de las primeras Europa. El seleccionador **Sergej Barbarez** (ex Hamburgo, Bayer Leverkusen, Dortmund en su época de jugador) viaja al Mundial con un equipo de **transición generacional**. El capitán es **Edin Džeko** (Fenerbahçe), de 40 años, su quinto Mundial como capitán de la selección balcánica que debuta en su primer torneo desde Brasil 2014. Junto a él la nueva generación: **Adrian Leon Barišić** (Hajduk Split), **Amar Memić** (Borac) y **Said Hamulić** (Stade Brestois). En el medio, **Edin Višća** (Trabzonspor) y **Mladen Krstajić** retornan. Bosnia está encuadrada en el **Grupo B** con Canadá, Catar y Suiza.

**🇳🇿 Nueva Zelanda — Bazeley apuesta por la juventud**. Los **All Whites** han presentado su definitiva el 14 de mayo. **Darren Bazeley**, seleccionador inglés en el cargo desde 2024, conserva la base del equipo que sorprendió en la clasificación OFC ganando los 6 partidos sin recibir gol. La estrella es **Chris Wood** (Nottingham Forest, 33 años), capitán y máximo goleador histórico de Nueva Zelanda con 47 goles. Junto a él, **Marko Stamenić** (Olympiakos), **Liberato Cacace** (Empoli) y el portero **Max Crocombe** (Eldense). La sorpresa: **Ben Old** (Saint-Étienne), de 21 años. Nueva Zelanda en el **Grupo G** con Bélgica, Egipto e Irán: el grupo más difícil de la historia para los kiwis. Objetivo declarado por Bazeley: **un punto**.

**🇹🇳 Túnez — Lamouchi reencuentra el continente africano**. Túnez anunció el 15 de mayo con **Sabri Lamouchi**, ex jugador francés de origen tunecino y ex seleccionador de Costa de Marfil (2014-2016). La lista de 26 mantiene a los referentes **Aïssa Laïdouni** (Union Berlin), **Hannibal Mejbri** (Burnley), **Ali Maâloul** (Al-Ahli) y al portero **Aymen Dahmen** (Sfaxien). La sorpresa más comentada en Túnez ha sido la inclusión del juvenil **Elias Saad** (St. Pauli), nacido en Hamburgo y captado por la federación tunecina en 2024. Túnez está en el **Grupo F** con Países Bajos, Japón y Suecia, segundo grupo africano más complicado tras el de Cabo Verde.

**🇭🇷 Croacia — Modrić y la última copa**. Croacia anuncia hoy **18 de mayo a las 11:00 hora de Zagreb** la lista de 26 de **Zlatko Dalić**, el seleccionador que llevó a los subcampeones a Rusia 2018 y al tercer puesto en Catar 2022. La estrella absoluta es **Luka Modrić**, que cumple 41 años el 9 de septiembre y disputa **su quinto y último Mundial consecutivo** (récord absoluto que igualan solo Carlos Cetenstein, Lothar Matthäus y Rafael Márquez). En medio campo le acompaña **Mateo Kovačić** (Manchester City) y **Mario Pašalić** (Atalanta). Una novedad fuerte: **Luka Vušković**, central de 18 años cedido por Tottenham al Hamburgo, que entra de manera inesperada en la lista definitiva al lado de **Joško Gvardiol** (City) y **Joško Šutalo** (Ajax). En el ataque, **Andrej Kramarić** (Hoffenheim), **Marko Pjaca** (Vinkovci) e **Igor Matanović** (Wolverhampton). Croacia está en el **Grupo L** con Inglaterra, Ghana y Panamá.

**🇳🇱 Holanda — Koeman cierra la semana el 21 de mayo**. La próxima en anunciar es **Países Bajos**, donde **Ronald Koeman** tiene previsto presentar la definitiva de 26 el **jueves 21 de mayo a las 14:00 hora de Ámsterdam**. La duda principal es **Memphis Depay** (Corinthians, regresando tras temporada irregular en Brasil) y la inclusión del joven **Million Manhoef** (Stoke). Confirmados sin discusión: **Virgil van Dijk** (Liverpool, capitán), **Frenkie de Jong** (Barcelona), **Cody Gakpo** (Liverpool) y **Xavi Simons** (RB Leipzig).

**Pendientes la próxima semana**. Tras Holanda el jueves, **Alemania** (Nagelsmann, prevista entre 22-24 mayo), **Portugal** (Roberto Martínez, 23 may), **USA** (Pochettino, 24 may), **Inglaterra** (Tuchel, 25 may, en Wembley), **España** definitiva (De la Fuente, 25 may en Las Rozas), **México** (Aguirre, 26 may en Coapa), **Argentina** definitiva (Scaloni, 27 may), **Canadá** (Marsch, 28 may).

**El cronograma FIFA**. La fecha límite reglamentaria es el **1 de junio a las 23:59 UTC**. Las selecciones que ya entregaron prelista de 55 (España, Argentina, Brasil, Colombia, México, Corea del Sur, Chequia, Qatar, Paraguay, Uzbekistán) deben enviar lista reducida a 26 antes de esa fecha. Las que aún no han enviado nada tienen hasta el 1 de junio para entregar directamente los 26 definitivos. La operativa FIFA permite **reemplazos por lesión hasta 24 horas antes del primer partido** de cada selección.

**Estado a 18 de mayo**:

| Estado | Selecciones |
|---|---|
| ✅ Lista definitiva (26) | Bosnia, Suecia, NZ, Francia, Japón, Bélgica, Haití, C. Marfil, Túnez |
| 📋 Prelista (55) | España, Argentina, Brasil, Colombia, México, Corea, Chequia, Qatar, Paraguay, Uzbekistán |
| ⏳ Pendiente | Croacia (HOY), Holanda (21 may), Alemania, Inglaterra, Portugal, USA, Canadá, Italia (no clasificada), Marruecos, Senegal, Egipto, Argelia, Ghana, Sudáfrica, Australia, Irán, Arabia, Irak, Jordania, Cabo Verde, Curazao, Panamá, Escocia, Austria, Noruega, Turquía, Suiza, RD Congo, Ecuador, USA, Canadá

**Calendario completo de cada selección** en [/2026/listas](/2026/listas) y previa rival en [/2026/convocatorias](/2026/convocatorias).`,
    category: 'convocatorias',
    sourceName: 'ESPN',
    sourceUrl:
      'https://www.espn.com/soccer/story/_/id/48757621/2026-world-cup-squad-lists-players-announced-all-48-teams',
    sourceLang: 'en',
    publishedAt: '2026-05-18T09:00:00Z',
    sourcesSecondary: [
      {
        name: 'TUDN · Convocatorias y listas finales de las 48 selecciones',
        url: 'https://www.tudn.com/mundial-2026/mundial-2026-todas-las-convocatorias-y-listas-finales-de-las-48-selecciones-para-la-copa-del-mundo',
      },
      {
        name: 'BeSoccer · Convocatorias de las 48 selecciones',
        url: 'https://es.besoccer.com/noticia/convocatorias-listas-todas-selecciones-mundial-2026-1408032',
      },
      {
        name: 'Goal · Croacia squad World Cup 2026',
        url: 'https://www.goal.com/en-us/lists/croatia-squad-world-cup-2026/blte475b4a9f48f3997',
      },
      {
        name: 'Flashscore · Listas oficiales de 26 futbolistas',
        url: 'https://www.flashscore.es/noticias/futbol-mundial-todas-las-listas-oficiales-de-26-jugadores-para-el-mundial-2026-de-la-fifa/Q7B15cVG/',
      },
      {
        name: 'Sports Illustrated · 2026 World Cup Rosters: Full list of all official squads',
        url: 'https://www.si.com/soccer/2026-world-cup-rosters-full-list-all-official-squads',
      },
      {
        name: 'Mediotiempo · Croacia y Luka Modric en el último baile',
        url: 'https://www.mediotiempo.com/futbol/copa-mundial/croacia-ultimo-baile-de-modric-y-una-generacion-de-oro',
      },
    ],
  },
  {
    slug: 'previa-convocatorias-mundial-2026-croacia-18-mayo-alemania-holanda-inglaterra-pendientes-17-mayo',
    title:
      'Convocatorias Mundial 2026: Croacia anuncia este lunes la suya, Alemania, Holanda e Inglaterra siguen sin pronunciarse a 16 días del primer partido',
    summary:
      'A 16 días del debut del Mundial 2026 (México vs Sudáfrica, 11 de junio en el Estadio Azteca), 12 selecciones ya han presentado prelista o lista definitiva. Quedan pendientes Alemania, Holanda, Inglaterra y Portugal entre las grandes, con plazo FIFA del 1 de junio. La próxima en anunciar es Croacia este lunes 18 de mayo.',
    body: `A **16 días del debut del Mundial 2026** —jueves 11 de junio, México vs Sudáfrica en el [Estadio Azteca](/2026/sedes/ciudad-de-mexico)—, el calendario de convocatorias entra en su tramo decisivo. Doce selecciones ya han presentado lista (prelista de 55 o definitiva de 26) y el resto debe hacerlo antes del **1 de junio**, fecha límite que marca el reglamento FIFA para entregar la nómina oficial de 26 jugadores con tres porteros obligatorios.

**Las 12 selecciones que ya han movido ficha**:

- 🇧🇷 **Brasil** (11 may): prelista de 55 de Carlo Ancelotti con Neymar dentro y Rodrygo fuera.
- 🇦🇷 **Argentina** (11 may): los 55 de Scaloni con Messi, sin Dybala, con Mastantuono y Echeverri como sorpresas.
- 🇪🇸 **España** (11 may): los 55 de Luis de la Fuente con Yamal, Pedri y Rodri tocados pero dentro. [Carvajal fuera](/noticias/carvajal-fuera-prelista-espana-mundial-2026-morata-fabian-ruiz-real-madrid-3-jugadores).
- 🇸🇪 **Suecia** (12 may): definitiva de 26 de Graham Potter sin Isak ni Gyökeres.
- 🇫🇷 **Francia** (14 may): [los 26 de Deschamps](/noticias/convocatoria-francia-mundial-2026-deschamps-26-mbappe-dembele-camavinga-fuera-sorpresa) con Mbappé y Dembélé, Camavinga fuera.
- 🇯🇵 **Japón** (14 may): los 26 de Moriyasu con Endo capitán.
- 🇧🇪 **Bélgica** (15 may): [los 26 de Rudi García](/noticias/convocatoria-belgica-mundial-2026-rudi-garcia-courtois-de-bruyne-lukaku-matias-fernandez-pardo) con el español Matías Fernández-Pardo como sorpresa.
- 🇨🇴 **Colombia** (14 may): prelista de Néstor Lorenzo con Falcao fuera.
- 🇭🇹 **Haití** (15 may): los 26 de Sébastien Migné. Primera Concacaf en revelar definitiva.
- 🇨🇮 **Costa de Marfil** (15 may): los 26 de Emerse Faé sin Haller.
- 🇨🇭 **Suiza** (anunciada esta semana): 26 de Murat Yakin.
- 🇹🇳 **Túnez** (15 may): 26 definitivos.

**La próxima: Croacia este lunes 18 de mayo**. Zlatko Dalić ha confirmado que hará pública la lista de 26 de los subcampeones de Rusia 2018 el lunes a las 11:00 hora de Zagreb (10:00 hora peninsular española) en la sede de la HNS en Zagreb. Modrić, sin equipo desde su salida del Real Madrid y firmado por el Milan en marzo, está confirmado pese a sus 40 años: será su quinto Mundial consecutivo (récord). La duda principal en el medio es Brozović (Al-Nassr) por su edad y minutos.

**Las grandes que faltan**. Entre las 48 selecciones del torneo, todavía no han pronunciado palabra oficial las siguientes potencias:

- 🇩🇪 **Alemania**: Julian Nagelsmann anunciará entre el 22-24 de mayo. Toni Kroos retirado, Jamal Musiala duda por lesión muscular.
- 🇳🇱 **Países Bajos**: Ronald Koeman tiene previsto el 21 de mayo. Memphis Depay regresa tras temporada irregular.
- 🇬🇧 **Inglaterra**: Thomas Tuchel anunciará el 25 de mayo en Wembley. Foden, Bellingham y Saka confirmados; Harry Kane vuelve de lesión.
- 🇵🇹 **Portugal**: Roberto Martínez tiene previsto el 23 de mayo. Cristiano Ronaldo confirmado para su sexto Mundial. Bernardo Silva, Bruno Fernandes y João Félix dentro.
- 🇲🇽 **México** (anfitriona): Javier Aguirre anunciará el 26 de mayo en La Trinchera (Coapa). Tras la Copa América 2024 desastrosa, hay aire de cambio.
- 🇺🇸 **Estados Unidos** (anfitriona): Mauricio Pochettino anunciará el 24 de mayo. Pulisic capitán confirmado, Yunus Musah y Antonee Robinson dentro.
- 🇨🇦 **Canadá** (anfitriona): Jesse Marsch anunciará el 28 de mayo. Alphonso Davies como referente.

**El cronograma del 25 mayo - 1 junio**. La fecha límite FIFA es el **1 de junio a las 23:59 UTC**. Las selecciones que ya entregaron prelista de 55 (España, Argentina, Brasil, Colombia) deben enviar la lista reducida a 26 antes de esa fecha. Las que aún no han enviado nada (Alemania, Inglaterra, Holanda, etc.) tienen hasta el 1 de junio para entregar directamente los 26 definitivos. La operativa FIFA permite **reemplazos por lesión hasta 24 horas antes** del primer partido de cada selección.

**Lo que se sabrá esta semana**. Croacia (18 may) abre la rueda final. Le seguirán Holanda (21 may), Alemania (22-24 may), Portugal (23 may), USA (24 may), Inglaterra (25 may), España definitiva (25 may), México (26 may), Argentina definitiva (27 may) y Canadá (28 may). La última en pronunciarse será probablemente Catar (30 may) o Cabo Verde (31 may, primer Mundial de su historia y aún sin federación confirmando fecha).

**Calendario completo del Mundial 2026** y previa de cada selección en [/2026/listas](/2026/listas) y [/2026/convocatorias](/2026/convocatorias). Si quieres seguir el camino de tu selección con [Follow My Team](/2026/hospitality), los paquetes hospitality oficiales arrancan en 6.500 USD.`,
    category: 'convocatorias',
    sourceName: 'BeSoccer',
    sourceUrl: 'https://es.besoccer.com/noticia/convocatorias-listas-todas-selecciones-mundial-2026-1408032',
    sourceLang: 'es',
    publishedAt: '2026-05-17T10:00:00Z',
    sourcesSecondary: [
      {
        name: 'El Financiero · Calendario de convocatorias Mundial 2026',
        url: 'https://www.elfinanciero.com.mx/deportes/mundial-2026/2026/05/13/calendario-de-convocatorias-para-el-mundial-2026-cuando-anuncia-cada-seleccion-la-lista-definitiva/',
      },
      {
        name: 'Olympics.com · Listas de las 48 selecciones',
        url: 'https://www.olympics.com/es/noticias/mundial-2026-listas-48-selecciones',
      },
      {
        name: 'Récord · Fechas clave de convocatorias',
        url: 'https://www.record.com.mx/historia/mundial-2026-las-fechas-clave-para-conocer-a-los-convocados-de-cada-pais-2026051223050828938',
      },
      {
        name: 'TUDN · Convocatorias y listas finales de las 48 selecciones',
        url: 'https://www.tudn.com/mundial-2026/mundial-2026-todas-las-convocatorias-y-listas-finales-de-las-48-selecciones-para-la-copa-del-mundo',
      },
      {
        name: 'ClaroSports · A un mes del Mundial 2026',
        url: 'https://www.clarosports.com/futbol/mundial-2026/a-un-mes-del-mundial-2026-asi-avanzan-las-listas-oficiales-sedes-y-fechas-clave-rumbo-a-la-copa-del-mundo/',
      },
    ],
  },
  {
    slug: 'fifa-triplica-precios-entradas-mundial-2026-categoria-1-final-32000-dolares-500-millones-solicitudes-amnistia',
    title:
      'FIFA triplica el precio de las mejores entradas para la final del Mundial 2026 hasta 32.000 USD y recibe 500 millones de solicitudes — diez veces más que Qatar 2022',
    summary:
      'FIFA ha confirmado que los boletos de Categoría 1 para la final del Mundial 2026 alcanzan los **32.000 USD** —tres veces el precio máximo en Qatar 2022— y revela que ha recibido más de **500 millones de solicitudes** durante la primera fase de venta. La demanda histórica obliga a una "amnistía" para regularizar peticiones duplicadas y rebajar la presión.',
    body: `**FIFA ha confirmado oficialmente** los precios definitivos de la primera fase de venta de entradas para el Mundial 2026 y la cifra que ha generado más controversia es el techo: **32.000 USD por una entrada de Categoría 1 (Central VIP) para la final del 19 de julio** en el [MetLife Stadium de Nueva York/NJ](/2026/sedes/nueva-york). Es tres veces el precio máximo de Qatar 2022 (10.000 USD) y la mayor inflación de precios entre dos Mundiales consecutivos en la historia del torneo.

**El abanico completo de precios**. La estructura tarifaria oficial publicada por FIFA en mayo de 2026:

- **Categoría 4 (asiento más alejado, gradería superior)**: desde **60 USD** para partidos de grupos
- **Categoría 3**: 120-300 USD grupos / 350-800 USD octavos-cuartos
- **Categoría 2**: 300-700 USD grupos / 800-2.000 USD octavos-cuartos
- **Categoría 1 (Central inferior, mejor ángulo)**: 700-1.500 USD grupos / 2.000-8.000 USD octavos-cuartos / 12.000-32.000 USD final

El partido inaugural México-Sudáfrica en el Estadio Azteca tiene un techo de **2.300 USD** en Categoría 1. La final del 19 de julio es donde el pricing se dispara: **32.000 USD por asiento**. Y eso solo en venta oficial — la reventa autorizada en la plataforma FIFA Tickets supera ya los 50.000-70.000 USD para las mejores ubicaciones.

**Demanda histórica: más de 500 millones de solicitudes**. La FIFA ha confirmado que la primera fase de venta ("Visa Presale Draw", abierta del 10 de septiembre al 19 de octubre de 2025) recibió **más de 500 millones de solicitudes de tickets**. Como referencia:

- Qatar 2022: 23,5 millones de solicitudes
- Rusia 2018: 18,7 millones de solicitudes
- Brasil 2014: 11,1 millones de solicitudes

El Mundial 2026 supera por **20-50 veces** la demanda de las ediciones anteriores. La razón es múltiple: 48 selecciones (vs 32) = más fans elegibles, tres países anfitriones con población combinada de 500 millones, primera celebración del centenario del Mundial (Uruguay 1930) y una operativa de comunicación inédita por parte de FIFA.

**La "amnistía" FIFA**. Ante el caos administrativo, FIFA ha activado una **regularización de cuentas duplicadas** entre el 5 y el 20 de mayo: si un usuario abrió varias cuentas con el mismo nombre/email para multiplicar oportunidades en el sorteo, puede consolidarlas sin penalización antes del 20 de mayo. Después de esa fecha, las cuentas duplicadas serán **canceladas automáticamente** y los tickets en su poder devueltos al pool de venta.

**Por qué los precios disparan tanto**. FIFA ha justificado el aumento con tres argumentos:

1. **"Demanda real del mercado"**: con 500 millones de solicitudes y aforos limitados (la final tiene 82.500 asientos en MetLife), el equilibrio oferta-demanda obliga a precios altos. FIFA argumenta que la reventa en mercado secundario los superaría igualmente.
2. **Inflación dolar 2022-2026**: ~16% de IPC acumulado. Pero el aumento de FIFA en Categoría 1 final es del **220%**, muy por encima de la inflación.
3. **Costes operativos USA-CAN-MEX**: tres países, 16 sedes, operativa de seguridad triplicada, transporte intersede, alojamiento del staff FIFA, etc.

**El argumento real**. El motivo no declarado pero evidente es que la final del Mundial es **el evento deportivo individual de mayor audiencia del mundo** (1.500-2.000 millones de espectadores) y FIFA tiene un monopolio absoluto. El mercado secundario validará los precios: si una entrada de 32.000 USD se revende a 50.000, FIFA ha quedado por debajo del valor de mercado.

**Las próximas fases de venta**. Tras la presale Visa de septiembre-octubre 2025, FIFA ha abierto en mayo 2026 la **Random Selection Draw** (sorteo aleatorio para mayores de 18 años con FIFA ID activo y tarjeta Visa). Los seleccionados reciben confirmación a partir del **29 de mayo**. Los no seleccionados pasan a la **First-Come First-Served Sale** desde junio 2026 hasta agotar stock. La fase final de **Last-Minute Sales** se abre 24-48 horas antes de cada partido.

**Cómo no caer en estafa**. FIFA repite el mensaje: **fifa.com/tickets es la única vía oficial**. El portal de hospitality fifaworldcup26.hospitality.fifa.com (gestionado por On Location) es el canal oficial para paquetes premium con catering y lounge. Cualquier otra plataforma de reventa es **mercado negro**: tickets cancelables en la puerta del estadio sin reembolso. Más detalle en nuestra guía [entradas Mundial 2026](/2026/entradas) y [hospitality oficial](/2026/hospitality).

**Lo que viene**. El **calendario de venta oficial** publicado por FIFA marca **abril-mayo 2026** para sorteo aleatorio, **junio 2026** para venta directa, **julio** para últimas oportunidades. La final del 19 de julio se prevé sold out tres meses antes del partido. Las únicas vías de acceso garantizado en ese momento serán hospitality oficial (desde 4.500 USD/persona) y mercado secundario regulado por FIFA.`,
    category: 'entradas',
    sourceName: 'Telemundo',
    sourceUrl: 'https://www.telemundopr.com/deportes-5/copa-mundial-fifa/fifa-triplica-precio-entradas-primera-categoria-copa-mundial-2026/2809854/',
    sourceLang: 'es',
    publishedAt: '2026-05-16T11:00:00Z',
    sourcesSecondary: [
      {
        name: 'El Cronista · FIFA dicta amnistía y sube precio de entradas',
        url: 'https://www.cronista.com/columnistas/mundial-2026-fifa-dicta-una-amnistia-y-sube-el-precio-de-las-entradas/',
      },
      {
        name: 'Olympics.com · Boletos Mundial 2026: cuánto, dónde y cómo',
        url: 'https://www.olympics.com/es/noticias/mundial-2026-cuanto-boletos-donde',
      },
      {
        name: '365 Scores · Boletos Mundial 2026: Precios, sedes y compra',
        url: 'https://www.365scores.com/es/news/entradas-mundial-2026-precios-compra/',
      },
      {
        name: 'El Financiero · FIFA defiende el precio de los boletos',
        url: 'https://www.elfinanciero.com.mx/deportes/mundial-2026/2026/05/06/fifa-defiende-el-precio-de-los-boletos-del-mundial-2026-los-compran-en-reventa-y-mas-caros/',
      },
      {
        name: 'Vanguardia · Guía FIFA Pavilion Mundial 2026 hospitality',
        url: 'https://vanguardia.com.mx/deportes/guia-fifa-pavilion-mundial-2026-precios-que-incluye-y-como-comprar-hospitality-en-las-16-sedes-oficiales-EC20113153',
      },
      {
        name: 'Goal · Guía sobre fase de venta de última hora',
        url: 'https://www.goal.com/en-us/news/how-to-buy-world-cup-tickets/blt13fd3078b4ca56ce',
      },
    ],
  },
  {
    slug: 'banxico-12-monedas-conmemorativas-mundial-2026-mexico-bimetalicas-plata-oro-cdmx-guadalajara-monterrey',
    title:
      'Banxico lanza 12 monedas conmemorativas del Mundial 2026: 4 bimetálicas de $20, 4 de plata fina de $10 y 4 de oro de $25 dedicadas a CDMX, Guadalajara, Monterrey y México anfitrión',
    summary:
      'El Banco de México puso en circulación el 13 de mayo de 2026 una colección de 12 monedas conmemorativas del Mundial 2026 acuñadas por la Casa de Moneda de México. Bimetálicas $20 (5 millones por diseño), plata fina $10 (100.000 por diseño) y oro fino $25 (5.000 por diseño). Canadá emite además un loonie especial desde el 14 de mayo. Cluster completo en [/coleccionismo/monedas-mundial-2026](/coleccionismo/monedas-mundial-2026).',
    body: `El **Banco de México (Banxico)** puso en circulación el martes 13 de mayo de 2026 una colección de **12 monedas conmemorativas** del Mundial 2026, acuñadas por la **Casa de Moneda de México**. Es la mayor emisión numismática mexicana en un evento deportivo desde el Mundial de México 1986, y se enmarca dentro de la estrategia de Banxico para celebrar el segundo Mundial que organiza el país (compartido en este caso con Estados Unidos y Canadá). Hemos publicado el cluster completo con las 13 monedas oficiales en [/coleccionismo/monedas-mundial-2026](/coleccionismo/monedas-mundial-2026).

**Tres tipos de moneda, una arquitectura común**. La colección está formada por tres bloques de cuatro monedas cada uno, todos siguiendo la misma estructura temática: tres dedicadas a las ciudades sede mexicanas (**Ciudad de México**, **Guadalajara**, **Monterrey**) y una al país anfitrión en general.

- **Bimetálicas de cuño corriente · $20 MXN**: la versión "popular" pensada para circular en el sistema bancario. Núcleo de cuproniquel y anillo de aluminio bronce. Tirada de 5 millones por diseño (20 millones en total). Estarán disponibles en bancos comerciales tres días hábiles después de su puesta en circulación.
- **Plata fina · $10 MXN**: edición limitada en plata pura ley 0.999 con acabado proof (espejo), tirada de 100.000 piezas por diseño (400.000 en total). Valor de mercado real: ~60 USD por moneda según el precio actual de la plata + sobre-coste numismático.
- **Oro fino · $25 MXN**: edición ultra-limitada en oro ley 0.999, peso ½ onza, acabado proof, tirada de **5.000 piezas por diseño** (20.000 en total). Valor de mercado: ~2.500 USD por moneda. La opción coleccionista premium.

**Diseños emblemáticos por sede**. Cada moneda combina elementos identitarios de la ciudad sede con el simbolismo del Mundial. La de **Ciudad de México** representa el **Ángel de la Independencia** acompañado de un futbolista en posición de remate, integrando dos íconos máximos de la capital. La de **Guadalajara** muestra la escultura de la **Diosa Minerva** en su glorieta homónima del Paseo Chapultepec con un balón estilizado. La de **Monterrey** lleva la **Fuente de Crisol** del Paseo Santa Lucía con el **Cerro de la Silla** al fondo —los dos símbolos más reconocibles de la capital regiomontana. La cuarta moneda de cada serie ("México anfitrión") muestra un águila con un balón y el escudo oficial del Mundial 2026.

**Dónde comprarlas**. Las bimetálicas de $20 llegan al sistema bancario regular a partir del 16-19 de mayo (tres días hábiles después de la circulación). Las versiones de plata y oro se venden a través de canales especializados: **Casa de Moneda de México** (tienda online y tienda física en CDMX), **Museo Interactivo de Economía (MIDE)** y distribuidores autorizados por Banxico. La lista actualizada de distribuidores está publicada en banxico.org.mx. Quienes quieran completar el set completo (12 piezas) tendrán que combinar bancos comerciales para las bimetálicas y canales numismáticos para plata y oro.

**Canadá emite también su moneda**. La **Royal Canadian Mint** anunció el día siguiente, 14 de mayo, una emisión especial del **loonie de $1 CAD** con motivo del Mundial. La tirada total es de 3 millones de piezas: 1 millón en versión tradicional sin color y 2 millones en versión coloreada con un acabado tipo "popout" sobre el balón. Disponibles a través de bancos canadienses y la tienda online de la Royal Mint.

**Estados Unidos: pendiente**. La **US Mint**, tercer organismo monetario del Mundial 2026, **no ha confirmado emisión** propia hasta la fecha. En el pasado USA ha emitido monedas conmemorativas para Juegos Olímpicos (LA28 ya aprobado por Coin Act 2024) pero el Mundial 2026 no aparece en su agenda anunciada para 2026. La FIFA podría presionar para que se sume al final.

**Valor de inversión**. Las monedas bimetálicas $20 son producto de circulación: su valor recolectivo en mercado secundario rara vez excede el 50% del nominal. Las versiones de plata $10 mantienen el valor del metal (la plata cotiza a ~30 USD/onza en 2026) y suelen revalorizarse 10-20% en el primer año post-emisión por demanda numismática. Las de oro $25 son donde se concentra el valor real: a 2.500 USD/pieza, su revalorización dependerá del precio del oro y la rareza percibida del Mundial. Como referencia, las monedas Banxico del Mundial México 1986 (acuñadas hace 40 años) se subastan hoy entre 3.000 y 8.000 USD según conservación.

**El precedente histórico**. Banxico ya emitió en 1985-1986 una serie similar para México 86, considerada una de las colecciones numismáticas más bellas del siglo XX por la simbiosis entre cultura prehispánica y deporte moderno. Las monedas de 1986 son hoy piezas de coleccionista mundial. Si Banxico mantiene el patrón histórico, las del Mundial 2026 son una apuesta segura para coleccionistas a 5-10 años vista.`,
    category: 'general',
    sourceName: 'El Financiero',
    sourceUrl:
      'https://www.elfinanciero.com.mx/economia/2026/05/13/banxico-lanza-monedas-conmemorativas-del-mundial-2026-asi-son-los-nuevos-disenos/',
    sourceLang: 'es',
    publishedAt: '2026-05-13T17:00:00Z',
    sourcesSecondary: [
      {
        name: 'La Jornada · BdeM pone en circulación 12 monedas conmemorativas',
        url: 'https://www.jornada.com.mx/noticia/2026/05/13/economia/bdem-pone-en-circulacion-12-monedas-conmemorativas-del-mundial-fifa-2026',
      },
      {
        name: 'Reforma · Lanzan 12 monedas conmemorativas del Mundial 2026',
        url: 'https://www.reforma.com/lanza-banxico-12-monedas-conmemorativas-del-mundial-2026/ar3203690',
      },
      {
        name: 'Telemundo · Diseños oficiales',
        url: 'https://www.telemundo.com/deportes/copa-mundial-de-la-fifa-2026/mexico-anuncia-las-monedas-conmemorativas-del-mundial-2026-y-sus-disen-rcna345061',
      },
      {
        name: 'Mercado Negro · Monedas conmemorativas México + Canadá',
        url: 'https://www.mercadonegro.pe/marketing/mundial-2026-monedas-conmemorativas/',
      },
      {
        name: 'Milenio · Dónde comprar las monedas',
        url: 'https://www.milenio.com/negocios/donde-comprar-monedas-conmemorativas-copa-mundial-fifa-2026-mexico',
      },
    ],
  },
  {
    slug: 'convocatoria-belgica-mundial-2026-rudi-garcia-courtois-de-bruyne-lukaku-matias-fernandez-pardo',
    title:
      'Bélgica anuncia su lista para el Mundial 2026: Courtois capitán, De Bruyne y Lukaku confirmados, y el español Matías Fernández-Pardo elige los Diablos Rojos',
    summary:
      'Rudi García ha anunciado los 26 convocados de Bélgica para el Mundial 2026 con Thibaut Courtois como capitán. La lista combina la generación dorada (De Bruyne, Lukaku, Courtois) con sangre nueva como Doku y el español Matías Fernández-Pardo, que tras meses de reflexión escoge a Bélgica al no ser convocado por Luis de la Fuente. Bélgica está en el Grupo con Egipto, Irán y Nueva Zelanda.',
    body: `**Rudi García** ha hecho oficial este 15 de mayo la convocatoria de 26 jugadores de [Bélgica](/selecciones/BEL) para el Mundial 2026. La lista mantiene el bloque de la generación dorada (Courtois, De Bruyne, Lukaku, Trossard, Doku) y suma una incorporación llamativa: **Matías Fernández-Pardo**, extremo del Lille, jugador con doble nacionalidad española e italiana que tras "meses de reflexión" elige defender la camiseta de los Diablos Rojos.

**Courtois capitán por sexto Mundial**. Thibaut Courtois (Real Madrid) repite como capitán de Bélgica por séptimo año consecutivo. El portero del Real Madrid, que en Qatar 2022 estaba lesionado, llega a su primer Mundial completo desde Rusia 2018 (donde Bélgica fue tercera). El brazalete refuerza la jerarquía del Madrid en una selección que combina cabezas de Premier League (Tottenham, Manchester City) con jugadores en LaLiga y Bundesliga.

**El caso Fernández-Pardo**. La noticia más comentada es la elección de **Matías Fernández-Pardo**, de 21 años, extremo del Lille con nacionalidad española e italiana. Anteriormente había manifestado su intención de jugar siempre con España y formó parte de las categorías inferiores, pero Luis de la Fuente no lo incluyó ni en la [prelista de 55 de España](/noticias/carvajal-fuera-prelista-espana-mundial-2026-morata-fabian-ruiz-real-madrid-3-jugadores) ni en convocatorias previas de la absoluta. Tras "reflexionar largamente estos últimos meses", opta por Bélgica y se incorpora al cuerpo de extremos junto a Doku y Trossard. Es la baja simbólica más dolorosa para España y la sorpresa más positiva del cuerpo técnico belga.

**Generación dorada + sangre nueva**. Junto a Courtois, De Bruyne (Manchester City) y Lukaku (Inter de Milán, capitán alternativo), aparecen los habituales Hans Vanaken, Yannick Carrasco y Axel Witsel. La nueva generación está representada por Jérémy Doku (Manchester City), Leandro Trossard (Arsenal), Charles De Ketelaere (Atalanta), Loïs Openda (Leipzig) y Romeo Lavia (Chelsea). Rudi García ha enfatizado el "equilibrio entre experiencia y juventud" en su rueda de prensa.

**Grupo asequible**. Bélgica ha quedado encuadrada en un grupo cómodo: **Egipto**, **Irán** y **Nueva Zelanda**. Es el grupo más asequible de los Diablos Rojos en décadas y compensa parcialmente la decepción de Qatar 2022 (eliminada en fase de grupos por Marruecos y Croacia). El objetivo declarado es **superar octavos** y volver a la senda de Rusia 2018.

**Camino al Mundial**. La selección se concentra el **22 de mayo** en Tubize y disputa dos amistosos antes del torneo: contra Eslovaquia el 6 de junio y contra Australia el 9 de junio. Si quieres seguir a Bélgica por todo el Mundial 2026, el paquete [Follow My Team Bélgica](/2026/hospitality/selecciones/BEL) de FIFA Hospitality arranca en 6.500 USD.`,
    category: 'convocatorias',
    sourceName: 'OK Diario',
    sourceUrl:
      'https://okdiario.com/mundial/belgica-da-lista-mundial-courtois-como-lider-espanol-matias-fernandez-pardo-16806051',
    sourceLang: 'es',
    publishedAt: '2026-05-15T11:00:00Z',
    sourcesSecondary: [],
  },
  {
    slug: 'prelista-colombia-mundial-2026-nestor-lorenzo-james-luis-diaz-ospina-falcao-fuera',
    title:
      'Colombia entrega su prelista para el Mundial 2026: Néstor Lorenzo cita a James, Luis Díaz y Ospina, deja fuera a Falcao por falta de continuidad',
    summary:
      'Néstor Lorenzo ha presentado la prelista de Colombia para el Mundial 2026 en la sede de la Federación Colombiana de Fútbol. James Rodríguez, Luis Díaz y David Ospina lideran un bloque cafetero que confirma el cambio de ciclo. Falcao queda fuera por falta de continuidad. La lista definitiva de 26 se anunciará el 26 de mayo en el partido amistoso vs Costa Rica en El Campín.',
    body: `**Néstor Lorenzo** ha entregado este 14 de mayo a FIFA la prelista de [Colombia](/selecciones/COL) para el Mundial 2026. El anuncio se realizó en la sede de la Federación Colombiana de Fútbol (FCF) en Bogotá. La lista mantiene a los referentes históricos del ciclo —James Rodríguez (Rayo Vallecano), Luis Díaz (Liverpool) y David Ospina (Atlético Nacional)— pero confirma la **ausencia de Radamel Falcao García**, una decisión esperada pero dolorosa para el Tigre.

**El caso Falcao**. El delantero del Millonarios, ídolo histórico del fútbol colombiano y máximo goleador de la Tricolor con 35 dianas, queda fuera de la lista por **falta de continuidad** en la temporada 2025-26. Lorenzo justificó: *"Yo lo pensé como jugador al principio del proceso, si hubiera tenido un nivel competitivo como el resto de compañeros que están en la lista, él estaría por lo que representa para el fútbol"*. Falcao, de 39 años, ha jugado pocos minutos esta temporada y no recibe la llamada al que habría sido su primer Mundial desde Rusia 2018 (Brasil 2014 lo perdió por lesión).

**Eje James + Luis Díaz**. James Rodríguez (Rayo Vallecano), goleador histórico de Brasil 2014 con el Botín de Oro, sigue siendo el director de orquesta. Junto a él, **Luis Díaz** (Liverpool), tras una temporada irregular, recupera la titularidad por la banda izquierda. **Jhon Jáder Durán** (Aston Villa) y **Sebastián Villa** (Boca Juniors) son las sorpresas ofensivas — Villa especialmente, tras polémicas extradeportivas que parecían cerrarle la puerta. **Mateus Uribe** y **Jefferson Lerma** dominan el medio campo.

**Defensa con Mina y Lucumí**. Yerry Mina (Cagliari), Davinson Sánchez (Galatasaray), Jhon Lucumí (Bologna), Daniel Muñoz (Crystal Palace) y Johan Mojica (Mallorca) configuran la línea defensiva. **David Ospina** (Atlético Nacional, 38 años) sigue siendo el portero indiscutible.

**El siguiente hito: 26 mayo**. La lista definitiva de **26 convocados** se anunciará en un evento especial el **26 de mayo**, antes del partido amistoso de Colombia vs Costa Rica en el Estadio El Campín de Bogotá. James Rodríguez se incorporará a la concentración el **17 de mayo**. La fecha límite FIFA para entregar la lista definitiva es el 1 de junio.

**Camino al Mundial**. Colombia, tercera en la Copa América 2024, llega al torneo como una de las máximas favoritas sudamericanas tras Brasil y Argentina. El sorteo dejó a la Tricolor en un grupo competitivo. Si quieres seguir a Colombia, el paquete [Follow My Team](/2026/hospitality/selecciones/COL) arranca en 6.500 USD.`,
    category: 'convocatorias',
    sourceName: 'Sport',
    sourceUrl: 'https://www.sport.es/es/noticias/mundial-futbol/lista-colombia-mundial-2026-nestor-130244173',
    sourceLang: 'es',
    publishedAt: '2026-05-14T16:00:00Z',
    sourcesSecondary: [
      {
        name: 'Semana · Prelista Selección Colombia Mundial 2026',
        url: 'https://www.semana.com/deportes/articulo/prelista-de-la-seleccion-colombia-al-mundal-2026-nestor-lorenzo-confirmo-la-lista/202631/',
      },
      {
        name: 'Infobae · Durán y Villa entre las sorpresas',
        url: 'https://www.infobae.com/colombia/deportes/2026/05/14/nestor-lorenzo-dio-a-conocer-la-prelista-de-la-seleccion-colombia-de-cara-al-mundial-2026-estos-son-los-elegidos/',
      },
      {
        name: 'FCF · Lista previa de convocados Colombia',
        url: 'https://fcf.com.co/2026/05/14/seleccion-colombia-masculina-de-mayores-lista-previa-de-convocados-para-la-copa-mundial-de-la-fifa-2026/',
      },
      {
        name: 'CNN · Sorpresas, ausencias y la polémica de Villa',
        url: 'https://cnnespanol.cnn.com/2026/05/14/deportes/prelista-colombia-mundial-sorpresas-polemica-villa-orix',
      },
    ],
  },
  {
    slug: 'haiti-lista-mundial-2026-sebastien-migne-bellegarde-isidor-nazon-grupo-c-brasil-escocia-marruecos',
    title:
      'Haití anuncia su lista para el Mundial 2026: primera Concacaf en revelarla, vuelve al torneo 52 años después y se mete en el "grupo de la muerte" con Brasil, Escocia y Marruecos',
    summary:
      'Sébastien Migné ha presentado los 26 convocados de Haití para el Mundial 2026, primera selección de Concacaf en hacerlo. Es la segunda participación de la historia de Haití en un Mundial tras Alemania 1974, hace 52 años. Bellegarde (Wolverhampton), Isidor (Sunderland) y Nazon lideran el plantel. El Grupo C es el más complicado: Brasil, Escocia y Marruecos.',
    body: `**Sébastien Migné** ha hecho oficial los 26 convocados de [Haití](/selecciones/HAI) para el Mundial 2026. Es la **primera selección de la Concacaf en revelar la lista**, una decisión deliberada del cuerpo técnico para tener el máximo tiempo de preparación posible. Haití vuelve a un Mundial **52 años después de Alemania 1974**, su única participación previa.

**El bloque europeo**. Cuatro jugadores de Premier League encabezan la lista: **Jean-Ricner Bellegarde** (Wolverhampton, mediocampista creativo) y **Wilson Isidor** (Sunderland, delantero centro) son las dos puntas del proyecto ofensivo. Junto a ellos, **Duckens Nazon** (rotación entre Ligue 2 francesa y MLS) y el portero veterano **Johny Placide** completan el bloque experimentado. Ricardo Adé y los hermanos Dorny refuerzan el medio.

**El cuerpo técnico francés**. Migné, francés de 51 años, tomó las riendas de Haití en 2024 después de la decepción del 2023. Su declaración tras anunciar la lista marca el tono del proyecto: *"Este es un momento especial porque es el inicio de un nuevo roadmap para los 26 convocados"*. Migné apuesta por un bloque defensivo cohesionado y dos transiciones rápidas sobre Bellegarde e Isidor.

**Grupo C, el "grupo de la muerte"**. Haití ha quedado en lo que la prensa internacional llama ya **el grupo más complicado del torneo**: debuta el **13 de junio vs Escocia**, el **19 de junio vs Brasil** y el **24 de junio vs Marruecos**. Tres rivales que en cualquier otro sorteo serían cabeza de serie de grupo. El objetivo declarado por Migné es **al menos llegar a la siguiente fase**: con el nuevo formato de 48 selecciones, hay repechaje a octavos para el tercer puesto si el rendimiento es alto.

**Preparación en Florida**. Haití concentra desde el **24 de mayo en Florida** y disputa dos amistosos: el **2 de junio vs Nueva Zelanda** y el **5 de junio vs Perú**. La elección de Florida como base de entrenamiento responde a logística (proximidad a Puerto Príncipe y a Atlanta, sede de su primer partido) y a la presencia de una comunidad haitiana muy numerosa en Miami que se espera vuelva el ambiente del estadio en cada encuentro.

**Lo que se juega Haití**. Más allá del resultado deportivo, Haití llega al Mundial 2026 como **historia social**. El país atraviesa una crisis política y humanitaria desde 2021, y la clasificación al torneo se ha convertido en un símbolo de resistencia nacional. La selección entrenó en exilio durante meses por la inseguridad en Puerto Príncipe. Cualquier resultado positivo, aunque sea un empate ante Escocia o un gol al MetLife Stadium en el partido vs Brasil, será celebrado como milagro. La AFP, Reuters y AP cubrirán cada movimiento con atención especial.

**Calendario**. La lista de Migné es definitiva — el plazo del 1 de junio solo aplica a reemplazos por lesión. Si quieres seguir a Haití por su histórica vuelta al Mundial, el paquete [Follow My Team Haití](/2026/hospitality/selecciones/HAI) arranca en 6.500 USD aunque la operativa de la FCH (Federación Haitiana) recomienda canales independientes por la situación administrativa.`,
    category: 'convocatorias',
    sourceName: 'Marca · Mundial',
    sourceUrl: 'https://www.marca.com/futbol/mundial/2026/05/15/cenicienta-haiti-anuncia-lista-mundial.html',
    sourceLang: 'es',
    publishedAt: '2026-05-15T10:00:00Z',
    sourcesSecondary: [
      {
        name: 'beIN Sports · La lista oficial de Sébastien Migné y Haití',
        url: 'https://www.beinsports.com/es-us/football/copa-mundial-de-la-fifa-2026/articles/la-lista-oficial-de-s%C3%A9bastien-mign%C3%A9-y-hait%C3%AD-para-la-copa-mundial-de-la-fifa-2026-2026-05-15',
      },
      {
        name: 'Infobae · Isidor, Bellegarde y Nazon principales figuras',
        url: 'https://www.infobae.com/america/agencias/2026/05/15/haiti-divulga-su-lista-de-26-con-isidor-bellegarde-y-nazon-como-principales-figuras/',
      },
      {
        name: '442 (Perfil) · Primera selección Concacaf en revelar convocados',
        url: 'https://442.perfil.com/noticias/futbol/haiti-es-la-primera-seleccion-de-concacaf-en-revelar-sus-convocados-para-el-mundial-2026.phtml',
      },
      {
        name: 'NTN24 · Objetivo histórico en el "grupo de la muerte"',
        url: 'https://www.ntn24.com/noticias-deportes/haiti-presenta-la-lista-de-convocados-para-el-mundial-y-tiene-como-objetivo-hacer-historia-en-el-grupo-de-la-muerte-622282',
      },
    ],
  },
  {
    slug: 'convocatoria-costa-de-marfil-mundial-2026-emerse-fae-kessie-pepe-haller-fuera-grupo-e-alemania-ecuador-curazao',
    title:
      'Costa de Marfil anuncia su lista para el Mundial 2026: Kessié capitán, Pépé referente ofensivo y Sébastien Haller fuera de la lista pese a su gol en la Copa Africana 2024',
    summary:
      'Emerse Faé ha confirmado los 26 convocados de Costa de Marfil para el Mundial 2026. Franck Kessié lleva el brazalete, Nicolas Pépé es el referente ofensivo y Amad Diallo y Yan Diomande aportan juventud. Sébastien Haller, héroe de la Copa Africana 2024, queda fuera por bajo rendimiento. Los Elefantes vuelven al Mundial tras 12 años en el Grupo E con Alemania, Ecuador y Curazao.',
    body: `**Emerse Faé** ha hecho oficial los 26 convocados de [Costa de Marfil](/selecciones/CIV) para el Mundial 2026. Los Elefantes vuelven a un Mundial **12 años después de Brasil 2014** —su última aparición— y lo hacen con el respaldo de la Copa Africana 2024 ganada en casa contra todo pronóstico. La lista mezcla experiencia (Kessié, Pépé, Haller... no, Haller fuera), talento emergente (Diomande, Diallo) y un equipo dirigido por el propio Faé, que asumió el banquillo tras la marcha de Jean-Louis Gasset.

**El gran golpe: Haller fuera**. La gran sorpresa de la lista es la **ausencia de Sébastien Haller**, héroe nacional por marcar el gol decisivo en la final de la Copa Africana 2024 ante Nigeria. El delantero, ex-Borussia Dortmund que se recuperó de un cáncer testicular en 2022, no ha tenido continuidad en el ciclo post-Africana y Faé apuesta por la cantera: **Amad Diallo** (Manchester United) y **Yan Diomande** (RB Leipzig, revelación de la Bundesliga 2025-26) son los nuevos pilares ofensivos.

**Kessié, capitán natural**. **Franck Kessié** (Al-Ahli), mediocampista de ida y vuelta con pasado en AC Milan y FC Barcelona, lleva el brazalete. Es el jugador con más experiencia internacional de los 26 (91 partidos, 19 goles, 8 asistencias) y la voz del vestuario. Junto a él en el medio, **Ibrahim Sangaré** (Nottingham Forest) y **Seko Fofana** (Al-Nassr) son los pivotes defensivos.

**Pépé sigue en la ofensiva**. **Nicolas Pépé** (Trabzonspor), ex-Arsenal y figura referencial de la generación dorada de Costa de Marfil, sigue en la lista a sus 30 años pese a no jugar en una liga top. Es el principal proveedor de asistencias del equipo. **Simon Adingra** (Brighton), **Sébastien Bahoken** y **Yan Diomande** completan el cuerpo de extremos.

**Defensa con Singo y Bailly**. **Wilfried Singo** (Monaco), **Eric Bailly** (Marsella) y **Willy Boly** (Nottingham Forest) son la columna defensiva. **Serge Aurier**, exterior derecho histórico, sigue al servicio del equipo a sus 33 años.

**Grupo E: rival exigente**. Costa de Marfil ha quedado encuadrada en el **Grupo E con Alemania, Ecuador y Curazao**. Es un grupo desigual: Alemania favorita clarísima, Costa de Marfil y Ecuador disputándose el segundo puesto y Curazao como cenicienta. El primer partido es contra Ecuador.

**El proyecto Faé**. Emerse Faé, ex-jugador y nuevo seleccionador, ha apostado por **construir desde la cantera**. La filosofía del cuerpo técnico mezcla la solidez defensiva clásica de Costa de Marfil con una transición ofensiva más vertical liderada por Diomande. El objetivo declarado es **superar la fase de grupos** —algo que Costa de Marfil solo logró en Brasil 2014— y llegar al menos a octavos.

**Camino al Mundial**. La selección se concentra el **20 de mayo en Abidjan** y disputa dos amistosos: contra Marruecos el 4 de junio en Casablanca y contra Senegal el 9 de junio en Dakar. Si quieres seguir a Costa de Marfil, el paquete [Follow My Team](/2026/hospitality/selecciones/CIV) arranca en 6.500 USD.`,
    category: 'convocatorias',
    sourceName: 'FIFA',
    sourceUrl:
      'https://www.fifa.com/es/tournaments/mens/worldcup/canadamexicousa2026/articles/costa-de-marfil-convocatoria-emerse-fae',
    sourceLang: 'es',
    publishedAt: '2026-05-15T12:00:00Z',
    sourcesSecondary: [
      {
        name: 'Telemundo · Kessié lidera una convocatoria poderosa',
        url: 'https://www.telemundo.com/deportes/copa-mundial-de-la-fifa-2026/costa-de-marfil-kessie-lidera-una-convocatoria-poderosa-que-busca-hace-rcna345375',
      },
      {
        name: 'El Diario Ec · Sin Haller, sorpresa por la cantera',
        url: 'https://www.eldiario.ec/deportes/sin-sebastien-haller-la-sorpresiva-lista-de-costa-de-marfil-para-debutar-ante-ecuador-15052026/',
      },
      {
        name: 'beIN Sports · Plantilla, figuras y todo lo que debes saber',
        url: 'https://www.beinsports.com/es-us/football/copa-mundial-de-la-fifa-2026/articles/costa-de-marfil-en-el-mundial-2026-plantilla-figuras-y-todo-lo-que-debes-saber-2026-05-15',
      },
      {
        name: 'Sporting News · Lista de convocados Marruecos (referencia previa)',
        url: 'https://www.sportingnews.com/es/futbol/news/lista-convocados-marruecos-mundial-2026-plantilla-jugadores/bacb10d9761fa733469e58f1',
      },
    ],
  },
  {
    slug: 'convocatoria-francia-mundial-2026-deschamps-26-mbappe-dembele-camavinga-fuera-sorpresa',
    title:
      'Francia anuncia su lista oficial para el Mundial 2026: Deschamps confirma a Mbappé y Dembélé, deja fuera a Camavinga y Kolo Muani',
    summary:
      'Didier Deschamps ha anunciado este 14 de mayo los 26 convocados de Francia para el Mundial 2026. Mbappé (Real Madrid) lidera el ataque junto a Dembélé (Balón de Oro 2025), Doué, Olise y Cherki. La sorpresa es la ausencia de Eduardo Camavinga, que cae junto a Kolo Muani y Lucas Chevalier. Bicampeones del mundo en 1998 y 2018, los Bleus van a por su tercera estrella.',
    body: `**Didier Deschamps** ha hecho oficial este 14 de mayo la convocatoria de 26 jugadores de [Francia](/selecciones/FRA) para el Mundial 2026. La lista, anunciada en la Federación Francesa de Fútbol en Clairefontaine, confirma el peso del eje **Mbappé + Dembélé** y la apuesta firme por la nueva generación PSG-Bayern (Doué, Olise, Cherki, Zaïre-Emery). La principal sorpresa es la ausencia de **Eduardo Camavinga**.

**El ataque, blindado**. Kylian Mbappé (Real Madrid), Ousmane Dembélé (PSG, último Balón de Oro), Désiré Doué (PSG), Michael Olise (Bayern Múnich) y Rayan Cherki (Manchester City) componen una primera línea ofensiva impresionante. Como complementos, Marcus Thuram (Inter de Milán), Bradley Barcola (PSG), Maghnes Akliouche (Mónaco) y Jean-Philippe Mateta (Crystal Palace). El doble eje Mbappé-Dembélé, los dos goleadores del último ciclo de Eurocopa 2024 y Nations League 2025, es el bloque sobre el que Deschamps construye el sistema.

**Mediocampo con Tchouaméni de ancla**. Aurélien Tchouaméni (Real Madrid) y Warren Zaïre-Emery (PSG) son las piezas titulares del centro del campo. Les acompañan **N'Golo Kanté** (Fenerbahçe), **Adrien Rabiot** (AC Milan) y **Manu Koné** (AS Roma). Es una mediocampo experimentado y técnico, pero la decisión más debatida fue dejar fuera a Eduardo Camavinga (Real Madrid). Deschamps justificó la decisión: *"Sale de una temporada difícil en la que ha jugado menos y ha tenido lesiones"*. Camavinga, que se había convertido en titular indiscutible en la Eurocopa 2024, no recupera su sitio.

**Defensa con Saliba al frente**. William Saliba (Arsenal), Dayot Upamecano (Bayern Múnich), Ibrahima Konaté (Liverpool) y Jules Koundé (Barcelona) forman el cuarteto central. En los laterales, **Theo Hernández** (Al-Hilal) y **Lucas Hernández** (PSG) por la izquierda, con **Jules Koundé** y **Malo Gusto** (Chelsea) por la derecha. **Lucas Digne** (Aston Villa) cierra el lateral izquierdo de relevo. Bajo palos, **Mike Maignan** (Milan) sigue siendo el portero titular, con **Brice Samba** (Lens) y **Robin Risser** (Stuttgart) como suplentes.

**Las ausencias que duelen**. Además de Camavinga, dos nombres fuertes quedan fuera. **Randal Kolo Muani** (Tottenham), de 27 años y ex-titular en Qatar 2022, no recibe la llamada tras una temporada irregular. **Lucas Chevalier**, recién campeón de la Ligue 1 con PSG, tampoco está en la lista de porteros: Deschamps mantiene la jerarquía Maignan-Samba a pesar del tirón mediático del joven portero parisino. Más figuras que se quedan: Aurélien Maupay, Lucas Paquetá (no es francés, ironía aparte) y los habituales descartados Boubacar Kamara y Eduardo Sarr.

**El cuerpo técnico**. Deschamps, en su cuarto Mundial al frente de los Bleus tras 2014, 2018 (campeón) y 2022 (subcampeón), trabaja con **Guy Stéphan** como asistente histórico. **Franck Raviot** se mantiene como entrenador de porteros. Los preparadores físicos son **Cyril Moine** y **Clément Hazard**, y los analistas de vídeo **Thierry Marszalek** y **Erix Dubray**.

**Camino al Mundial: tercera estrella en el horizonte**. Francia llega como bicampeona del mundo (1998, 2018) y vigente subcampeona (2022). La tercera estrella es el objetivo declarado de Deschamps, que renovó hasta este Mundial precisamente para conseguirlo antes de ceder el banquillo a Zinedine Zidane (acuerdo aún no oficial, pero descontado por todos los medios franceses). El primer partido de los Bleus está pendiente del sorteo del 5 de diciembre, pero las quinielas la sitúan como una de las máximas favoritas: [favoritos a ganar el Mundial](/2026/favoritos-ganar-mundial). Si quieres seguir a Francia partido a partido, el paquete [Follow My Team](/2026/hospitality/selecciones/FRA) de FIFA Hospitality arranca en 6.500 USD.

**Calendario**. La lista definitiva debe entregarse a FIFA el **1 de junio**. Hasta entonces Deschamps puede hacer reemplazos por lesión sin justificación adicional. El [Mundial 2026 arranca el 11 de junio](/2026/calendario) en el Estadio Azteca con la inauguración México vs rival por confirmar. Francia, encuadrada en un grupo aún por sortear, debutará en su primer partido entre el 12 y el 14 de junio.`,
    category: 'convocatorias',
    sourceName: 'AS',
    sourceUrl:
      'https://as.com/futbol/internacional/lista-de-francia-en-directo-convocatoria-y-jugadores-de-la-seleccion-francesa-para-el-mundial-hoy-en-vivo-f202605-d/',
    sourceLang: 'es',
    publishedAt: '2026-05-14T13:00:00Z',
    sourcesSecondary: [
      {
        name: 'DAZN · Convocatoria Francia Mundial 2026 (lista completa, dorsales, cuerpo técnico)',
        url: 'https://www.dazn.com/es-MX/news/f%C3%BAtbol/convocatoria-francia-mundial-2026-lista-capitanes-dorsales-cuerpo-tecnico-didier-deschamps/1sxa5uwi7eetu1orz7em4ko4ck',
      },
      {
        name: 'Infobae · La selección de Francia confirmó los 26 convocados',
        url: 'https://www.infobae.com/deportes/2026/05/14/la-seleccion-de-francia-confirmo-la-lista-de-26-convocados-para-el-mundial-la-victima-de-argentina-que-se-queda-sin-revancha/',
      },
      {
        name: 'La Nación · Camavinga, la gran ausencia',
        url: 'https://www.lanacion.com.ar/deportes/futbol/francia-confirmo-a-sus-26-jugadores-convocados-para-el-mundial-2026-y-camavinga-es-la-gran-ausencia-nid14052026/',
      },
      {
        name: 'beIN Sports · Mbappé, Dembélé y sorpresa con Camavinga',
        url: 'https://www.beinsports.com/es-us/football/copa-mundial-de-la-fifa-2026/articles/la-lista-oficial-de-didier-deschamps-y-francia-para-la-copa-mundial-de-la-fifa-2026-2026-05-14',
      },
      {
        name: 'FIFA · Convocados Francia Mundial 2026',
        url: 'https://www.fifa.com/es/articles/convocados-francia-mundial-2026-lista-jugadores-elegidos-deschamps',
      },
      {
        name: 'Bet365 News · Lista de convocados Francia',
        url: 'https://news.bet365.es/es-es/article/copa-mundial-2026-lista-convocados-francia/2026051513434884843',
      },
    ],
  },
  {
    slug: 'convocatoria-japon-mundial-2026-moriyasu-26-endo-kubo-mitoma-grupo-f-paises-bajos-tunez-suecia',
    title:
      'Japón anuncia su lista para el Mundial 2026: Wataru Endo capitán, Kubo y Mitoma confirmados, grupo F con Países Bajos, Túnez y Suecia',
    summary:
      'Hajime Moriyasu ha hecho oficial los 26 convocados de Japón para el Mundial 2026. Wataru Endo (Liverpool) sigue como capitán. La lista mezcla bloque europeo (Kubo, Mitoma, Doan, Kamada, Endo) con jugadores en J-League. Japón está en el Grupo F con Países Bajos, Túnez y Suecia, un cruce de calado europeo en su primera fase.',
    body: `**Hajime Moriyasu** ha publicado este 14 de mayo la lista de 26 convocados de [Japón](/selecciones/JPN) para el Mundial 2026. La cita repite el formato del seleccionador desde Qatar 2022: bloque amplio de jugadores en Europa (20 de los 26 juegan fuera de Japón) y solo seis en J-League, con **Wataru Endo** (Liverpool) confirmado como capitán por tercer Mundial consecutivo.

**Tres porteros**. **Tomoki Hayakawa** (Kashima Antlers) y **Keisuke Osako** (Sanfrecce Hiroshima) acompañan al titular **Zion Suzuki** (Parma Calcio 1913). Suzuki, hijo de la mítica generación Honda-Kagawa-Endo del Mundial 2010, ha sido el portero indiscutible de Moriyasu durante el último ciclo de Asian Cup 2024.

**Defensa con Tomiyasu de regreso**. La línea defensiva incluye al veterano **Yuto Nagatomo** (FC Tokyo, 5º Mundial), **Shogo Taniguchi** (Sint-Truidense), **Kou Itakura** (Ajax), **Tsuyoshi Watanabe** (Feyenoord), **Takehiro Tomiyasu** (Ajax, vuelve tras lesión grave 2024-25), **Hiroki Ito** (Bayern Múnich), **Ayumu Seko** (Le Havre), **Yukinari Sugawara** (Werder Bremen) y **Junnosuke Suzuki** (FC Copenhagen). Tomiyasu, ex-Arsenal, recupera su sitio tras casi 14 meses fuera de combate.

**Mediocampo y delantera europeos**. Aquí está el bloque más competitivo. **Wataru Endo** (Liverpool, capitán) actúa de ancla. Junto a él, **Junya Ito** (Genk), **Daichi Kamada** (Crystal Palace), **Koki Ogawa** (NEC), **Daizen Maeda** (Celtic), **Ritsu Doan** (Eintracht Frankfurt), **Ayase Ueda** (Feyenoord), **Ao Tanaka** (Leeds United), **Keito Nakamura** (Reims), **Kaishu Sano** (Mainz), **Takefusa Kubo** (Real Sociedad), **Yuito Suzuki** (Freiburg), **Kento Shiogai** (Wolfsburg) y **Keisuke Goto** (Sint-Truidense). Kubo es la cara mediática de la selección en España y la principal palanca creativa del equipo. Mitoma (Brighton) figuraba como duda por lesión, finalmente confirmado.

**Cuerpo técnico continuista**. Moriyasu mantiene el equipo que llevó a Japón al octavos en Qatar 2022 (eliminada por Croacia en penales): **Toshihide Saito**, **Hiroshi Nanami**, **Ryoichi Maeda**, **Makoto Hasebe** (ex-jugador del Mundial 2014 y Eintracht Frankfurt) y **Shunsuke Nakamura** (ídolo histórico, ex-Celta de Vigo) como asistentes. **Takashi Shimoda** sigue como entrenador de porteros y **Ryoichi Matsumoto** como preparador físico.

**Grupo F: cruce europeo de calado**. Japón ha quedado encuadrada en un grupo brutal: **Países Bajos** (semifinalista en Qatar 2022 si no fuera por la prórroga vs Argentina), **Suecia** (regreso al Mundial tras Rusia 2018) y **Túnez** (representante africano clásico). El sorteo del 5 de diciembre dejó al Sol Naciente con tres equipos europeos+africano, una de las llaves más complicadas del torneo. Países Bajos es claramente favorita en el grupo; Japón, Suecia y Túnez se disputan el segundo puesto y el repechaje hacia octavos.

**Calendario y sedes**. Japón debutará entre el 12 y el 14 de junio (sedes pendientes del sorteo de cuartos de hora del 28 de mayo). El equipo entrenará en Los Ángeles los 7 días previos al primer partido, con base hotelera en Beverly Hills. La afición japonesa, una de las más numerosas del torneo (300.000 entradas vendidas según JFA), se ha distribuido por las sedes asignadas. Si quieres seguir a Japón por todo el Mundial, [Follow My Team Japan](/2026/hospitality/selecciones/JPN) arranca en 6.500 USD.

**Lo que está en juego**. Japón firmó en Qatar 2022 una de las mayores sorpresas mundialistas al ganar a Alemania y España en la fase de grupos. La eliminación en octavos contra Croacia en penales dejó a Moriyasu con la sensación de "techo no superado". El objetivo declarado para este Mundial es **alcanzar cuartos de final por primera vez en la historia**, un hito que ninguna selección asiática ha logrado nunca (Corea del Sur llegó a semis en 2002 pero como anfitriona). Con la cuota de 16 selecciones AFC en el nuevo formato de 48, Japón es la única candidata seria a romper el techo histórico.

**Lista definitiva**. La convocatoria que Moriyasu entregó a FIFA es la definitiva: el plazo del 1 de junio aplica solo a reemplazos por lesión. La J-League cierra su temporada el 23 de mayo y los jugadores se concentrarán en Tokio del 25 al 28 antes de volar a Los Ángeles.`,
    category: 'convocatorias',
    sourceName: 'DAZN',
    sourceUrl:
      'https://www.dazn.com/es-ES/news/f%C3%BAtbol/convocatoria-japon-mundial-2026-lista-capitanes-dorsales-cuerpo-tecnico-hajime-moriyasu/9d1uiytur0sr1wld6r6hjn4wj',
    sourceLang: 'es',
    publishedAt: '2026-05-14T10:00:00Z',
    sourcesSecondary: [],
  },
  {
    slug: 'carvajal-fuera-prelista-espana-mundial-2026-morata-fabian-ruiz-real-madrid-3-jugadores',
    title:
      'Carvajal, Morata y Fabián Ruiz fuera de la prelista de España para el Mundial 2026: la lista de 55 de De la Fuente parte el ciclo del Real Madrid',
    summary:
      'Luis de la Fuente ha enviado a FIFA su prelista de 55 jugadores para el Mundial 2026 sin Dani Carvajal, Álvaro Morata ni Fabián Ruiz. La lista vinculante reduce a tres los representantes del Real Madrid frente a los nueve del FC Barcelona (Yamal, Pedri, Gavi, Olmo, Fermín, Ferran, Cubarsí, Éric García y Joan García). El recorte final a 26 se anuncia el 25 de mayo.',
    body: `Luis de la Fuente entregó este lunes a FIFA la prelista de **55 futbolistas** vinculante para [España](/selecciones/ESP) en el Mundial 2026, y el titular ha sido la ausencia de **Dani Carvajal**. El lateral derecho del Real Madrid, con 52 internacionalidades y pieza fundamental en el ciclo que ganó la Eurocopa 2024, queda fuera del torneo del verano. Junto a él tampoco aparecen **Álvaro Morata** ni **Fabián Ruiz** —dos jugadores que han sido titulares regulares con la Roja en los últimos años.

**Carvajal: la ausencia no era inesperada del todo**. El lateral se rompió el ligamento cruzado anterior en octubre de 2024 y, aunque volvió a jugar con el Real Madrid a finales de la temporada 2025-26, su rendimiento no alcanzó el nivel pre-lesión. De la Fuente había sondeado varias veces a su entorno y, según Cope, la decisión final se tomó en la concentración previa al Mundial, después de evaluar a sus alternativas: Pedro Porro, Pubill y un sorpresivo Fran García como suplente natural del lateral derecho.

**Morata y Fabián, el otro recorte fuerte**. El delantero del Como, con 87 partidos y 38 goles con España, sale por bajo rendimiento sostenido la última temporada y la apuesta firme por la dupla **Toni Martínez + Joselu** como referencias del área. Fabián Ruiz, mediocampista del PSG, cae víctima de la sobreoferta de centrocampistas: con Pedri, Rodri, Mikel Merino, Fermín, Zubimendi y Aleix García en la lista, el cupo del medio se reduce.

**Cambio de ciclo: Barça 9 - Real Madrid 3**. La lista marca la **inversión histórica del eje España-Real Madrid**. El FC Barcelona aporta nueve futbolistas (Lamine Yamal, Pedri, Gavi, Dani Olmo, Fermín López, Ferran Torres, Pau Cubarsí, Éric García y Joan García). El Real Madrid solo tres: Vinícius cobertura imposible al ser brasileño, Endrick lo mismo, Bellingham inglés. Quedan Aurélien Tchouaméni (no español tampoco), Rodrygo (no español)… la realidad de la plantilla madridista en términos de pasaporte español es magra. Confirmados del Madrid: **Joselu** (delantero), **Fran García** (lateral) y un tercer nombre que se descubrirá con la lista definitiva.

**Los 'tocados' que sí están en la lista**. Lamine Yamal (lesión muscular reciente), Nico Williams (3 semanas de baja) y Rodri (recuperación de cruzado) sí entran en los 55. De la Fuente ha confirmado que el plan A es contar con los tres en el Mundial, pero tendrán hasta el último momento para demostrar estado físico. Mikel Merino (Arsenal, lesión muscular dudosa) también figura.

**Otros 'no-listados' notables**. Junto al trío Carvajal/Morata/Fabián Ruiz, quedan fuera nombres como Pau Torres, Sergio Gómez, Víctor Gómez, Hugo Guillamón y Moleiro —este último cerca del corte. La COPE adelantó también que **Huijsen** (Real Madrid central, anteriormente Bournemouth) sí está en los 55, premiando su buena temporada.

**El siguiente hito: el 25 de mayo**. El reglamento FIFA obliga a entregar la lista definitiva de **26 jugadores** (incluyendo 3 porteros obligatorios) el **1 de junio de 2026**. De la Fuente ha avanzado que su anuncio formal será una semana antes, el **lunes 25 de mayo en la Ciudad del Fútbol de Las Rozas**. Hasta ese día, los 55 estarán en alerta a una posible llamada y el cuerpo médico de la RFEF supervisará la evolución de los tocados día a día.

**Debut de España en el Mundial**. España debuta el **lunes 15 de junio de 2026 a las 12:00 EDT (18:00 hora peninsular) vs Cabo Verde** en el [Mercedes-Benz Stadium de Atlanta](/2026/sedes/atlanta). Es su primer partido del Grupo H. El segundo partido es el **21 de junio vs Arabia Saudí** en el mismo Mercedes-Benz Atlanta (12:00 EDT), y el tercero el **26 de junio vs Uruguay** en el Estadio Akron de [Guadalajara](/2026/sedes/guadalajara) (18:00 CST · 02:00 hora peninsular del sábado 27). Los aficionados pueden seguir el camino completo de la Selección con [Follow My Team](/2026/hospitality/selecciones/ESP) (desde 6.500 USD) si planean viajar.`,
    category: 'convocatorias',
    sourceName: 'Marca · Selección España',
    sourceUrl: 'https://www.marca.com/futbol/seleccion/2026/05/12/de-la-fuente-prelista-55-mundial-2026-carvajal-morata-fabian.html',
    sourceLang: 'es',
    publishedAt: '2026-05-14T11:00:00Z',
    sourcesSecondary: [
      {
        name: 'Infobae · Los grandes olvidados de De la Fuente para el Mundial 2026',
        url: 'https://www.infobae.com/espana/deportes/2026/05/14/los-grandes-olvidados-de-de-la-fuente-para-el-mundial-2026-la-prelista-de-55-marca-el-cambio-de-ciclo-en-la-seleccion-espanola/',
      },
      {
        name: 'COPE · Carvajal no prelista 55, Huijsen sí',
        url: 'https://www.cope.es/programas/tiempo-de-juego/noticias/carvajal-no-prelista-55-espana-huijsen-fran-garcia-gonzalo-lista-20260512_3362767.html',
      },
      {
        name: 'El Debate · Carvajal sin Mundial',
        url: 'https://www.eldebate.com/deportes/mundial-futbol-2026/20260512/carvajal-no-entra-prelista-luis-fuente-queda-opciones-mundial_416851.html',
      },
      {
        name: 'Libertad Digital · Revolución de De la Fuente: Carvajal y Morata sin Mundial',
        url: 'https://www.libertaddigital.com/deportes/futbol/2026-05-12/revolucion-de-de-la-fuente-carvajal-y-morata-se-quedan-sin-mundial-7403505/',
      },
      {
        name: 'beIN Sports · Lesiones, dudas y una base casi intocable',
        url: 'https://www.beinsports.com/es-us/football/copa-mundial-de-la-fifa-2026/articles/luis-de-la-fuente-define-su-prelista-con-espa%C3%B1a-para-la-copa-del-mundo-lesiones-dudas-y-una-base-casi-intocable-2026-05-12',
      },
    ],
  },
  {
    slug: 'caminar-metlife-final-mundial-2026-nueva-york-guardian-george-washington-bridge-11-millas',
    title:
      'Caminar al MetLife desde Nueva York para la final del Mundial 2026: 11 millas, 4 horas y media, y FIFA prohíbe el acceso peatonal en game days',
    summary:
      '¿Se puede caminar al MetLife Stadium desde Manhattan para los partidos del Mundial 2026? Sí, son 11 millas (17 km) y 4 horas y media desde George Washington Bridge, pero hay aceras cerradas, tráfico denso y, sobre todo, FIFA ha confirmado que no se permitirá acceso peatonal en game days. NJ Transit cobra 150 USD ida y vuelta y se anticipa colapso del transporte público.',
    body: `**¿Se puede caminar al [MetLife Stadium](/2026/sedes/nueva-york) desde Manhattan?** El periodista Mark McPartland de The Guardian se calzó las zapatillas y publicó el experimento en vídeo: salió de George Washington Bridge Park en Washington Heights, cruzó el puente George Washington, atravesó New Jersey por carreteras secundarias y, **cuatro horas y media después y 11 millas (17 kilómetros) después**, llegó al MetLife. Sí, es posible. Pero el experimento del Guardian acaba en sorpresa: **FIFA no lo va a permitir** durante los partidos del Mundial 2026.

**Lo que cuenta el experimento**. La ruta más corta arranca cruzando el puente George Washington a pie —una opción que está abierta normalmente—. Después se entra a New Jersey por Fort Lee y se atraviesan Englewood y Hackensack en carreteras con cuestas pronunciadas, **aceras intermitentes** y secciones sin acera ninguna. El último tramo, alrededor del Meadowlands Sports Complex (donde está el MetLife), es directamente **autopista** con prohibición peatonal. McPartland tuvo que desviarse por callejones y zonas industriales para evitar la I-95 y la New Jersey Route 3.

**El detalle que mata la idea**. La final del Mundial 2026 se juega el **19 de julio a las 20:00 ET**. Caminar la vuelta a Manhattan después del partido implica un trayecto **nocturno de 4-5 horas** atravesando New Jersey por una zona con escasa iluminación y tráfico de salida del estadio. Para un partido de fase de grupos a las 15:00 ET, la vuelta sí sería con luz natural. Pero el problema no es solo la dificultad: **FIFA ha confirmado que no se permitirá acceso peatonal a la zona del MetLife en game days**, según Front Row Soccer. La justificación oficial es de seguridad operativa: stewards y policía cierran perímetros amplios para controlar entradas con [clear bag policy](/2026/normas-estadios/mochila-transparente) y evitar acumulaciones en accesos no controlados.

**¿Por qué la pregunta se ha vuelto trending?**. **NJ Transit cobra 150 USD ida y vuelta** para el shuttle desde Penn Station al MetLife durante el Mundial. La empresa ha justificado el precio en la demanda excepcional, pero la noticia ha generado indignación en redes —especialmente entre aficionados que no van a hospitality y que han pagado entradas estándar pensando que el transporte estaría incluido o asequible. La alternativa popular son los buses **Coach USA** desde Port Authority (~25 USD ida) y los **Uber/Lyft** (que aplicarán precio dinámico previsiblemente sobre los 100 USD en hora punta).

**La opción "hospitality" elimina el problema**. Los paquetes [FIFA Hospitality oficial](/2026/hospitality/sedes/nueva-york) incluyen acceso a parking premium del estadio (con shuttle propio al lounge) y, en los productos Single Match desde 4.500 USD, **transfer privado desde un hotel de Manhattan**. Las Private Suites del MetLife llevan ese servicio incluido por defecto. Pero la realidad del aficionado de calle, que va con entrada estándar de 200-500 USD, es que se enfrenta al binomio NJ Transit a 150 USD o Uber a precio dinámico.

**FIFA ha publicado guías oficiales**. La FIFA Fan Festival de Manhattan estará abierta los 13 días con partido en NY/NJ, y desde ella saldrán shuttles dedicados a un precio aún por anunciar (se espera que rondan los 40-60 USD ida y vuelta, mucho más barato que NJ Transit). Pero la capacidad será limitada por horarios y FIFA recomienda **salir 4-5 horas antes del kickoff** para evitar quedarse fuera.

**Comparativa con otros sedes**. El problema del MetLife es excepcional dentro del Mundial. En [Los Angeles](/2026/hospitality/sedes/los-angeles), el SoFi Stadium tiene Metro Crenshaw a 10 minutos andando del estadio. En [Atlanta](/2026/hospitality/sedes/atlanta), MARTA conecta directo con el Mercedes-Benz Stadium. En el [Estadio Azteca](/2026/hospitality/sedes/ciudad-de-mexico) el Metro Línea 2 + cable car estarán reforzados para el Mundial. El MetLife es el caso más complicado de los 16 estadios por estar literalmente en una isla industrial de New Jersey rodeada de autopistas.

**Conclusión práctica para el aficionado**. Si vas a un partido en NY/NJ, planifica el transporte ANTES de comprar la entrada. Las opciones reales son: NJ Transit (150 USD ida y vuelta, garantizado pero caro), Coach USA bus (25 USD ida, capacidad limitada), Uber/Lyft (precio dinámico 100-200 USD ida y vuelta), o paquete hospitality (transporte incluido pero precio entrada 5-10x). Caminar **no es una opción** legal durante game days.`,
    category: 'sedes',
    sourceName: 'The Guardian · Football',
    sourceUrl: 'https://www.theguardian.com/football/video/2026/may/14/world-cup-2026-walk-metlife-stadium-from-new-york-city',
    sourceLang: 'en',
    publishedAt: '2026-05-14T15:00:00Z',
    sourcesSecondary: [
      {
        name: 'Yahoo News · How to access World Cup final stadium',
        url: 'https://travel.yahoo.com/articles/walk-metlife-stadium-york-city-175338850.html',
      },
      {
        name: 'NBC New York · World Cup fans talking about walking to MetLife',
        url: 'https://www.nbcnewyork.com/world-cup/can-you-walk-metlife-stadium-fifa-world-cup/6495352/',
      },
      {
        name: 'Front Row Soccer · Fans no podrán caminar al MetLife',
        url: 'https://www.frontrowsoccer.com/2026/04/21/not-that-way-fans-wont-be-allowed-to-walk-to-metlife-for-world-cup-games/',
      },
      {
        name: 'MetLife Stadium · FIFA World Cup 2026 visitor info',
        url: 'https://www.metlifestadium.com/events/fifa-world-cup-2026',
      },
      {
        name: 'Time Out NY · World Cup 2026 New York guide',
        url: 'https://www.timeout.com/newyork/things-to-do/fifa-world-cup-2026-new-york-new-jersey-guide',
      },
    ],
  },
  {
    slug: 'halftime-show-final-mundial-2026-shakira-bts-madonna-chris-martin-metlife-19-julio',
    title:
      'Shakira, BTS y Madonna encabezarán el primer halftime show en la historia de una final de Mundial: 19 de julio en el MetLife, comisariado por Chris Martin',
    summary:
      'FIFA ha anunciado el primer halftime show de la historia en una final de Mundial: Shakira, BTS y Madonna actuarán el 19 de julio de 2026 durante el descanso del partido decisivo en MetLife Stadium (Nueva York / New Jersey). Comisariado por Chris Martin (Coldplay), el espectáculo recaudará fondos para el FIFA Global Citizen Education Fund. Aparecerán también los Muppets de Sesame Street.',
    body: `FIFA ha anunciado este 14 de mayo el line-up del primer halftime show en la historia de una final de Mundial. **Shakira, BTS y Madonna** coencabezarán el espectáculo del 19 de julio de 2026 en el descanso de la final, que se jugará en el [MetLife Stadium de Nueva York / New Jersey](/2026/sedes/nueva-york). El anuncio lo difundió en simultáneo la propia FIFA, Global Citizen y la mayoría de medios internacionales —Bleacher Report, Washington Post, Billboard, CNN, Yahoo Sports, OutKick— en una operación de comunicación cuidadosamente orquestada.

**Quién lo comisaría**. El director artístico del show es **Chris Martin**, líder de Coldplay y cara visible de la cobertura musical reciente de FIFA. Su rol es de **dirección creativa, no de actuación**: ni Coldplay como banda ni el propio Martin actuarán en el descanso del 19 de julio. NBC News y Awful Announcing han confirmado en las horas siguientes al anuncio que Coldplay produce el formato y selecciona los artistas, pero la banda no toca. Martin sí había aparecido en la mini-puesta en escena del descanso del FIFA Club World Cup 2025 en MetLife —el ensayo general operativo del concepto— junto a **J Balvin, Doja Cat, Tems y Coldplay**, esa vez como performers reales. La organización ha confirmado además la presencia de **los Muppets** de Sesame Street, un guiño infantil y multicultural que rebaja el peso únicamente pop del cartel principal.

**Para qué se hace**. El recaudo del show no es comercial estricto: los fondos generados van al **FIFA Global Citizen Education Fund**, un nuevo vehículo de cooperación entre FIFA y Global Citizen orientado a programas educativos en países en desarrollo. Es la misma fórmula que Global Citizen lleva utilizando desde 2012 en sus festivales benéficos: convertir un evento de máxima audiencia en una palanca de financiación para causas globales. La cifra esperada de audiencia de la final del Mundial 2026 supera con holgura los **1.500 millones de espectadores** del Super Bowl, por lo que el potencial de visibilidad para la causa es ya histórico.

**Por qué es nuevo**. El halftime show ha sido durante décadas seña de identidad del Super Bowl, del Día de Acción de Gracias en la NFL o del UEFA Champions League opening, pero nunca se había producido uno en el descanso de una final de Mundial. La razón es práctica: el descanso reglamentario de FIFA es de **15 minutos**, y montar + ejecutar + desmontar un escenario pop necesita habitualmente 25-30 minutos como hace la NFL. La operativa del 19 de julio implicará por tanto ampliar el descanso a una duración aún por confirmar oficialmente, con la dificultad añadida de mantener el césped del MetLife en condiciones de juego para los 45 minutos siguientes y la posible prórroga.

**El cartel y por qué tiene sentido**. Las tres cabezas de cartel no son aleatorias. **Shakira** es ya artista vinculada al Mundial 2026: hace tres días firmó con Burna Boy la canción oficial del torneo, *[Dai Dai](/noticias/shakira-dai-dai-cancion-oficial-mundial-2026-burna-boy)*, y representa el bloque latinoamericano del torneo (México, anfitrión, además del peso de Brasil, Argentina, Colombia y Uruguay como selecciones favoritas). **BTS** aporta el público asiático —Corea del Sur clasificada, Japón clasificada, además del mercado global del K-pop— y resuelve la papeleta de cuotas de Asia en un Mundial geográficamente centrado en Norteamérica. **Madonna** es el guiño cultural anglosajón sin ser un acto puramente americano: estrella global, multilingüe en sus colaboraciones recientes y veterana del *halftime* (Super Bowl 2012). La elección combina pop latinoamericano + pop asiático + icono global anglosajón, una arquitectura de cartel poco frecuente fuera del propio Mundial.

**Lo que queda por confirmar**. FIFA no ha publicado todavía la duración exacta del descanso ampliado, ni el orden de actuación, ni si habrá colaboraciones entre los headliners (lo más previsible), ni si Burna Boy o Coldplay aparecerán como artistas adicionales. Tampoco ha confirmado dónde se transmitirá en exclusiva en cada mercado: en USA el broadcast natural es FOX + Telemundo (que ya tienen los derechos del Mundial), pero el formato halftime puede tener un sponsor independiente —Apple Music ha sido patrocinador del Super Bowl halftime show desde 2023 y la negociación con FIFA para el Mundial 2026 es la operación de patrocinio musical más cara que se rumorea ahora mismo en el sector.

**Cómo verlo en directo**. La final del Mundial 2026 se juega el **19 de julio a las 19:00 ET (01:00 CEST del 20 de julio)** en el MetLife Stadium. El halftime show será visible en la misma señal de retransmisión del partido y a través de los streams oficiales de Global Citizen. Las entradas para asistir al estadio van desde los **2.500 USD** en Single Match estándar y desde los **4.500 USD** en [hospitality oficial](/2026/hospitality/sedes/nueva-york) (FIFA + On Location). Los paquetes Private Suite del MetLife para la final superan ya los **500.000 USD** según el desglose oficial.`,
    category: 'ceremonia',
    sourceName: 'Bleacher Report',
    sourceUrl:
      'https://bleacherreport.com/articles/25427703-shakira-bts-madonna-headline-2026-world-cup-final-halftime-show',
    sourceLang: 'en',
    publishedAt: '2026-05-14T14:00:00Z',
    sourcesSecondary: [
      {
        name: 'Global Citizen · FIFA World Cup™ 2026 Final Half-Time Show',
        url: 'https://www.globalcitizen.org/en/events-broadcasts/fifa-world-cup-final-half-time-show/',
      },
      {
        name: 'CNN · Shakira, Madonna and BTS to headline 2026 World Cup Final halftime show',
        url: 'https://www.cnn.com/2026/05/14/sport/world-cup-final-halftime-show-headliners-hnk',
      },
      {
        name: 'Billboard · Madonna, Shakira & BTS to Headline 2026 World Cup Final Halftime Show',
        url: 'https://www.billboard.com/music/music-news/world-cup-halftime-bts-madonna-shakira-1236247959/',
      },
      {
        name: 'Washington Post · World Cup halftime show to feature Shakira, Madonna, BTS',
        url: 'https://www.washingtonpost.com/entertainment/music/2026/05/14/shakira-madonna-bts-headline-fifa-world-cup-2026-halftime-show/',
      },
      {
        name: 'FIFA Inside · Football and music superstars to deliver nonstop spectacle at FIFA Club World Cup™ Final (precedente operativo 2025)',
        url: 'https://inside.fifa.com/media-releases/football-music-superstars-nonstop-spectacle-club-world-cup-final',
      },
      {
        name: 'NBC News · Coldplay working with FIFA to produce halftime show (no actúa)',
        url: 'https://www.nbcnews.com/sports/soccer/coldplay-working-fifa-produce-first-ever-world-cup-final-halftime-show-rcna194950',
      },
      {
        name: 'Awful Announcing · Chris Martin leads, multiple artists perform',
        url: 'https://awfulannouncing.com/soccer/fifa-world-cup-final-halftime-show-coldplay-chris-martin-2026.html',
      },
    ],
  },
  {
    slug: 'hospitality-mundial-2026-on-location-precios-single-match-2500-venue-series-private-suites',
    title:
      'Hospitality oficial Mundial 2026: Single Match desde 2.500 USD, Follow My Team y Private Suites hasta 500.000 USD por On Location',
    summary:
      'El portal oficial FIFA Hospitality, operado en exclusiva por On Location, abre la venta para el Mundial 2026 con 7 productos. Single Match arranca en 2.500 USD por persona, Venue Series desde 8.275 USD y las Private Suites llegan a 500.000 USD por toda la serie en estadios premium como MetLife o el Azteca. Hemos mapeado producto a producto y sede a sede en el cluster [/2026/hospitality](/2026/hospitality).',
    body: `On Location, el operador exclusivo de FIFA para hospitalidad oficial, ha confirmado los precios y la estructura completa de paquetes para el Mundial 2026. La venta está abierta desde el portal fifaworldcup26.hospitality.fifa.com con tres versiones por país (USA, Canadá y México) y cinco idiomas (inglés, español, francés, alemán y árabe).

**Cluster completo**. Hemos desglosado el catálogo en un pillar con 6 sub-páginas y 64 rutas dinámicas: [hospitality Mundial 2026](/2026/hospitality). Productos, precios por sede y Follow My Team por selección.

**Siete productos oficiales**. El portal organiza la oferta en siete tipologías con audiencia y precio claramente diferenciados:

- **MEL — Match Experience Light**: la versión más asequible (1.800 USD/persona). Asiento Category 1 + acceso a un lounge con buffet ligero. Sin barra libre completa ni regalos conmemorativos.
- **SM — Single Match**: el producto de entrada al hospitality completo. Desde 2.500 USD por persona, incluye asiento premium garantizado, lounge con catering chef-driven, barra libre 3 h antes y 1 h después del partido, programa de entretenimiento y regalo conmemorativo oficial.
- **VS — Venue Series**: asiento garantizado en TODOS los partidos del mismo estadio. Desde 8.275 USD por persona. Ideal para residentes o viajeros que se quedan toda la fase en una ciudad.
- **FMT — Follow My Team**: sigue a tu selección desde la fase de grupos hasta donde llegue. 48 selecciones disponibles. Desde 6.500 USD por persona. Si tu equipo cae en grupos, mantienes los 3 partidos garantizados pero pierdes los partidos posteriores.
- **MM — Multi-Match Bundle**: 2-5 partidos elegidos a la carta, con descuento del 10-15 % vs Single Match individual.
- **PS — Private Suites**: suites privadas en el estadio para 8-20 personas. Desde 43.200 USD por partido, hasta 250.000 USD por toda la Venue Series.
- **PPS — PP-Suites (Pitch Premium)**: el escalón corporate con acceso a vestuarios y túnel pre-partido. Desde 120.000 USD por partido, reservado a patrocinadores y partners FIFA.

**Por sede, los precios varían**. El Single Match más barato es Toronto y Vancouver (2.200 USD), seguidos de Guadalajara y Monterrey (2.000 USD), aunque las sedes mexicanas pueden subir según partido. El estadio más caro es MetLife (Nueva York / NJ), sede de la **final**, donde el Single Match arranca en 4.500 USD. La sede del partido inaugural (Estadio Azteca) parte de 3.500 USD. Hemos publicado la tabla completa en [/2026/hospitality/precios](/2026/hospitality/precios).

**On Location, único proveedor oficial**. FIFA ha cedido la operación de hospitalidad en exclusiva a On Location (anteriormente Match Hospitality AG en mundiales previos). Cualquier venta de hospitality por fuera del portal oficial es **reventa de riesgo** y puede invalidar el acceso al estadio. Algunos clubes (NYCFC en Estados Unidos, Boston FWC26 Committee) son «Official Hospitality Sales Partners» con licencia oficial, pero la operativa pasa siempre por On Location.

**Plan de pagos y cancelación**. Los paquetes superiores a 5.000 USD admiten pago en 3-6 cuotas SIN intereses, con primer pago del 30 % no reembolsable. La cancelación tras la segunda cuota implica pérdida del 50 % de lo pagado. La política completa está en la [FAQ hospitality](/2026/hospitality/faq).

**Lo que NO incluye**. Vuelo y hotel se gestionan aparte. Para esa parte del viaje hemos puesto cards de Booking, Skyscanner y GetYourGuide en cada [ficha de sede](/2026/hospitality/sedes) para que el viaje completo sea un solo flujo.`,
    category: 'entradas',
    sourceName: 'FIFA Hospitality (On Location)',
    sourceUrl: 'https://fifaworldcup26.hospitality.fifa.com/',
    sourceLang: 'en',
    publishedAt: '2026-05-14T09:00:00Z',
    sourcesSecondary: [
      {
        name: 'FIFA · Hospitality packages available - all host countries',
        url: 'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/hospitality-packages-available-all-host-countries',
      },
      {
        name: 'Goal.com US · How to get World Cup 2026 hospitality packages',
        url: 'https://www.goal.com/en-us/news/world-cup-hospitality-tickets/blt0a8b0a1dcfe3fb2d',
      },
      {
        name: 'Jetpac Global · FIFA World Cup 2026 Ticket Packages',
        url: 'https://www.jetpacglobal.com/blog/fifa-world-cup-2026-ticket-package/',
      },
      {
        name: 'World Cup Boston · Hospitality and Ticketing',
        url: 'https://bostonfwc26.com/hospitality-and-ticketing/',
      },
    ],
  },
  {
    slug: 'mundial-2026-estadios-codigo-conducta-items-prohibidos-clear-bag-policy',
    title:
      'FIFA publica el código de conducta del Mundial 2026: clear bag única para los 16 estadios, 22 items prohibidos, sin selfie-sticks ni botellas llenas',
    summary:
      'FIFA ha publicado el documento oficial «Stadium Code of Conduct» que rige las 16 sedes del Mundial 2026 en USA, Canadá y México. Política unificada de bolsa transparente de 12×6×12 pulgadas, lista de 22 items prohibidos (drones, GoPro, palos selfie, banderas con asta, botellas llenas, megáfonos, bengalas) y derecho de admisión final reservado por FIFA. Las camisetas de selección y banderas sin asta sí están permitidas. Hemos desglosado el reglamento completo en un cluster pilar: [/2026/normas-estadios](/2026/normas-estadios).',
    body: `FIFA ha publicado el documento oficial del «Stadium Code of Conduct» que rige el acceso a las 16 sedes del Mundial 2026 en Estados Unidos, Canadá y México. La política, anunciada en el portal oficial del torneo y detallada en un PDF de FIFA Digital Hub, es el primer reglamento unificado para un Mundial repartido entre tres países anfitriones y marca una diferencia importante con el modelo descentralizado de Qatar 2022.

**Guía completa**. Hemos desglosado las 100 páginas del reglamento en un pillar con 6 sub-páginas especializadas: [normas estadios Mundial 2026](/2026/normas-estadios). Cada apartado clave tiene su propia ficha:

- [Mochila y clear bag policy](/2026/normas-estadios/mochila-transparente): tamaño máximo 12×6×12 pulgadas
- [Items prohibidos](/2026/normas-estadios/items-prohibidos): los 22 vetos de FIFA, por qué y dónde dejarlos
- [Items permitidos](/2026/normas-estadios/que-puedes-llevar): lo que sí entra
- [Alcohol por país](/2026/normas-estadios/alcohol-por-pais): permitido USA/CAN, prohibido MEX
- [Banderas y mensajes políticos](/2026/normas-estadios/banderas-y-mensajes): la zona gris del reglamento
- [Sanciones](/2026/normas-estadios/sanciones): decomiso, expulsión sin reembolso, denuncia

Lo que cuenta esta noticia es el resumen ejecutivo de lo más relevante para el viajero del Mundial.

**Clear bag policy unificada para los 16 estadios**. Por primera vez en la historia mundialista, las tres federaciones anfitrionas (US Soccer, Canada Soccer, FMF) acuerdan una política idéntica de bolsas. Solo se permiten bolsas **completamente transparentes** —de plástico, vinilo o PVC— con un tamaño máximo de **12 × 6 × 12 pulgadas** (aproximadamente 30 × 15 × 30 cm). Se permiten también clutch o monederos no transparentes pero «aproximadamente del tamaño de una mano», con un máximo de 4,5 × 6,5 pulgadas. Mochilas convencionales, riñoneras, bolsas opacas o de tela tienen que quedarse en el coche o en consigna externa. El objetivo declarado por FIFA es triple: acelerar las colas de entrada, permitir inspecciones visuales sin abrir bolsas y armonizar la operativa entre los tres países.

**Los 22 items prohibidos**. La lista combina restricciones de seguridad clásicas con prohibiciones modernas vinculadas a la era de contenido digital. Quedan **expresamente prohibidos**:

- **Tecnología audiovisual**: drones, GoPro y cámaras de acción, cámaras profesionales con lente desmontable, trípodes, monopods y **palos selfie**.
- **Pirotecnia y ruido**: bengalas, fuegos artificiales, **megáfonos**, bocinas de aire (air horns), silbatos.
- **Objetos lanzables**: globos, balones de playa, balones inflables y cualquier objeto que pueda lanzarse al césped.
- **Banderas con asta**: las **banderas y pancartas con palo o asta** están prohibidas. Las banderas **sin asta**, llevadas con la mano o sobre los hombros, sí están permitidas.
- **Bebidas y comida**: **botellas llenas** (sí se permiten reutilizables vacías que se rellenan dentro), **comida** preparada del exterior, **paraguas**.
- **Otros**: armas (cualquier tipo), sustancias ilegales, láseres, **muñecos hinchables**, símbolos políticos no relacionados con el deporte.

**Lo que sí entra**. Teléfono móvil, auriculares, **camisetas oficiales de cualquier selección** (sin restricción), **banderas sin asta**, **cargadores portátiles**, productos de higiene personal (gel hidroalcohólico incluido), **botellas reutilizables vacías**, sombreros, medicación personal con receta, asientos especiales si hay discapacidad documentada.

**Camisetas, banderas y mensaje político**. El reglamento confirma que «las camisetas de selección están completamente permitidas y son parte normal de la experiencia del aficionado». Pero diferencia entre **fan expression** —cantos, banderas, gritos del bloque— y **mensaje político activo**. FIFA, los gobiernos locales y la operativa de cada estadio pueden retirar pancartas con mensaje político no deportivo a su discreción. La cláusula es deliberadamente amplia y ha generado preguntas de aficionados que llevan banderas Palestina-Israel o LGBT+: la respuesta oficial de FIFA es que «cada caso se evalúa en el momento» y la decisión final corresponde a stewards del estadio.

**Cómo se aplica en cada país**. El reglamento es unificado **en lo esencial** (clear bag, 22 prohibidos, código de conducta). Pero la **legislación local prevalece** en lo demás: el alcohol está permitido en zonas reservadas en los 11 estadios de USA y los 2 de Canadá, pero **prohibido en todo el recinto** en los 3 estadios de México (Azteca, Akron y BBVA) por reglamento federal mexicano. Las palomitas y refrescos «oficiales» se gestionan por concesiones de cada estadio, con Coca-Cola y McDonald's como partners principales del torneo.

**Sanciones por incumplimiento**. La sanción por entrar con item prohibido va desde decomiso simple (lo más habitual) hasta **expulsión del estadio sin reembolso** y, en casos graves (armas, sustancias ilegales, conducta violenta), denuncia a las autoridades locales del país anfitrión. La operativa de seguridad la coordinan **DHS, Public Safety Canada y SEGOB México**, cada uno en sus respectivas sedes.

**Lo que se sabrá más cerca del torneo**. FIFA ha anunciado que el documento del Stadium Code of Conduct **se actualizará en mayo y junio** con instrucciones específicas por sede (puertas abiertas, política de equipaje en transporte público, coordinación con FIFA Fan Festivals). El aficionado que viaje al Mundial debe consultar la guía **«Know Before You Go»** específica de su sede en los días previos al partido.`,
    category: 'sedes',
    sourceName: 'The Athletic (NYT)',
    sourceUrl:
      'https://www.nytimes.com/athletic/7273489/2026/05/12/world-cup-stadium-code-of-conduct-prohibited-items/',
    sourceLang: 'en',
    publishedAt: '2026-05-12T18:00:00Z',
    sourcesSecondary: [
      {
        name: 'FIFA · Stadium Code of Conduct (PDF oficial)',
        url: 'https://digitalhub.fifa.com/m/50ebae81c412b7d5/original/FIFA-World-Cup-2026-Stadium-Code-of-Conduct.pdf',
      },
      {
        name: 'FIFA Tickets · ¿Hay restricciones para entrar al estadio?',
        url: 'https://gpcustomersupportfwc2026.tickets.fifa.com/hc/en-gb/articles/30198151350813-4-Are-there-restrictions-on-what-I-can-bring-into-the-stadium',
      },
      {
        name: 'FIFA · Hospitality Miami · Know Before You Go',
        url: 'https://fifaworldcup26.hospitality.fifa.com/know-before-you-go/miami',
      },
      {
        name: 'Legit.ng · 22 items que FIFA prohíbe',
        url: 'https://www.legit.ng/sports/football/1700988-food-umbrella-20-items-allowed-fifa-2026-world-cup-stadium/',
      },
      {
        name: 'Football Ground Guide · banned items list',
        url: 'https://footballgroundguide.com/news/world-cup-stadium-banned-items-list-what-you-can-and-cant-bring.html',
      },
      {
        name: 'Football Ground Guide · camisetas, banderas y cánticos',
        url: 'https://footballgroundguide.com/news/are-football-shirts-flags-or-chants-restricted-at-the-2026-world-cup.html',
      },
      {
        name: 'World Cup Trackers · clear bag policy',
        url: 'https://worldcuptrackers.com/what-bags-allowed-fifa-world-cup-2026-clear-bag-policy/',
      },
    ],
  },
  {
    slug: 'suecia-lista-definitiva-26-mundial-2026-potter-isak-gyokeres-kulusevski-fuera',
    title:
      'Suecia se adelanta: Graham Potter publica los 26 definitivos del Mundial con Isak y Gyökeres dentro, Kulusevski fuera',
    summary:
      'La SvFF se convierte en la primera federación en saltarse el plazo de la prelista y anunciar directamente los 26 jugadores definitivos para el Mundial 2026. Graham Potter, ex Chelsea, mete a Alexander Isak (Liverpool, lesionado) y Viktor Gyökeres (Arsenal) en su primera gran convocatoria. Las bajas duras: Dejan Kulusevski (Tottenham) y Roony Bardghji (Barça). Suecia, 13ª participación mundialista, juega Grupo F contra Países Bajos, Japón y Túnez.',
    body: `La Svenska Fotbollförbundet (SvFF) anunció este 12 de mayo los 26 jugadores definitivos que Suecia llevará al Mundial 2026, convirtiéndose en la primera federación del torneo en publicar la lista final apenas un día después del cierre del plazo para entregar la prelista de 55 nombres. La decisión, atribuida al estilo directo del seleccionador inglés Graham Potter —ex entrenador de Brighton y Chelsea, contratado por la SvFF en agosto de 2025 después del fracaso clasificatorio que casi se evita en el repechaje de marzo contra Ucrania y Polonia—, evita la fase de especulación pública que sí han alargado España, Brasil o Argentina.

**El plantel**. El capitán es **Victor Lindelöf**, central del Aston Villa con 75 internacionalidades. **Alexander Isak** llega como jugador del Liverpool tras el fichaje récord de 130 millones de libras (el más caro de la historia del fútbol inglés). Potter lo incluye pese a una lesión muscular reciente. **Viktor Gyökeres**, fichado por el Arsenal el verano pasado por 65 millones desde el Sporting CP, completa la dupla.

**Las bajas más comentadas**. **Dejan Kulusevski** (Tottenham) queda fuera tras doce meses marcados por lesiones recurrentes. **Roony Bardghji**, extremo de 20 años del Barça que ha disputado 26 partidos esta temporada, también queda fuera por «consideraciones de adaptación táctica» según comunicado SvFF.

**Lo que viene**. Suecia disputará la 13ª participación mundialista de su historia (la última fue Rusia 2018, cuartos de final). Grupo F asequible: Países Bajos (favorita), Japón, Túnez. Debut el 17 de junio contra Países Bajos en el Estadio NRG de Houston.`,
    category: 'convocatorias',
    sourceName: 'Heavy.com Sports',
    sourceUrl: 'https://heavy.com/sports/soccer/sweden-announces-squad-fifa-world-cup/',
    sourceLang: 'en',
    publishedAt: '2026-05-12T13:25:00Z',
    sourcesSecondary: [
      { name: 'Flashscore · Potter names 26-man Sweden squad', url: 'https://www.flashscore.com/news/soccer-world-cup-graham-potter-names-26-man-sweden-squad-for-the-world-cup/OjiHKnrg/' },
      { name: 'Olympics.com · Sweden full squad list', url: 'https://www.olympics.com/en/news/fifa-world-cup-2026-sweden-great-escape-graham-potter-all-players-full-squad-list-key-stats-schedule' },
      { name: 'Yahoo Sports · Official Sweden squad', url: 'https://sports.yahoo.com/articles/official-swedens-squad-world-cup-144500546.html' },
      { name: 'Sweden Herald · Squad selected by Potter', url: 'https://swedenherald.com/article/swedens-world-cup-squad-26-players-selected-by-graham-potter' },
      { name: 'Goal · Kulusevski misses out', url: 'https://www.goal.com/en-ca/lists/world-cup-dejan-kulusevski-injury-tottenham-sweden-viktor-gyokeres-alexander-isak/bltd56651aa57664624' },
    ],
  },
  {
    slug: 'prelista-espana-mundial-2026-de-la-fuente-55-yamal-pedri-rodri',
    title:
      'España manda su prelista a la FIFA: De la Fuente fija a Rodri, Pedri, Yamal y Olmo, no la hace pública',
    summary:
      'La RFEF entregó el lunes 11 de mayo a la FIFA la prelista de 55 jugadores de Luis de la Fuente para el Mundial 2026, sin publicarla. Es la primera vez que el documento es vinculante: cualquier sustitución por lesión deberá salir de esa lista. Fijos sin discusión: Rodri, Pedri, Zubimendi, Fabián Ruiz, Fermín, Dani Olmo, más Lamine Yamal, Nico Williams, Ferran Torres y Oyarzabal arriba. La convocatoria definitiva de 26 se anuncia el 25 de mayo.',
    body: `La Federación Española de Fútbol envió el lunes 11 de mayo a la FIFA la prelista de 55 jugadores que Luis de la Fuente baraja para el Mundial 2026. A diferencia de Brasil, España optó por no hacerla pública. La razón oficial: no facilitar mapas de presión a los rivales del Grupo H (Cabo Verde, Arabia Saudí y Uruguay).

**El cambio del reglamento**. La gran novedad del Mundial 2026 es que la prelista pasa a ser vinculante. Si Lamine Yamal o Rodri sufren una lesión en la última semana, De la Fuente solo podrá sustituirlos por uno de los 54 nombres restantes.

**Los seis fijos centrales**. Rodri (Manchester City, Balón de Oro 2024, recuperado de cruzados), Pedri (Barça), Martín Zubimendi (Real Sociedad), Fabián Ruiz (PSG), Fermín López (Barça) y Dani Olmo (Barça). Es la base que ganó la Eurocopa 2024 más Pedri y Rodri recuperados.

**La delantera intocable**. Lamine Yamal (Barça), Nico Williams (Athletic), Ferran Torres (Barça) y Mikel Oyarzabal (Real Sociedad). En portería: Unai Simón titular, David Raya suplente.

**Las dudas reales**. La enorme presencia del Barça (9 jugadores) y la escasez del Real Madrid (apenas un nombre) es el tema editorial caliente. España anuncia los 26 definitivos el 25 de mayo. Debuta el 15 de junio contra Cabo Verde en Atlanta.`,
    category: 'convocatorias',
    sourceName: 'Infobae · España',
    sourceUrl: 'https://www.infobae.com/espana/deportes/2026/05/11/luis-de-la-fuente-y-la-prelista-de-55-jugadores-que-tiene-que-entregar-a-la-fifa-de-ahi-saldran-los-26-convocados-de-la-seleccion-espanola-para-el-mundial-2026/',
    sourceLang: 'es',
    publishedAt: '2026-05-11T19:30:00Z',
    sourcesSecondary: [
      { name: 'Eurosport · Prelista enigmática de De la Fuente', url: 'https://www.eurosport.es/futbol/mundial/2026/espana-de-la-fuente-prelista-55-jugadores_sto23298860/story.shtml' },
      { name: 'beIN Sports · Lesiones, dudas y base intocable', url: 'https://www.beinsports.com/es-us/football/copa-mundial-de-la-fifa-2026/articles/luis-de-la-fuente-define-su-prelista-con-espa%C3%B1a-para-la-copa-del-mundo-lesiones-dudas-y-una-base-casi-intocable-2026-05-12' },
      { name: 'ElDesmarque · Fijos, dudas y posibles sorpresas', url: 'https://www.eldesmarque.com/futbol/mundial/20260511/prelista-espana-mundial-2026-dudas-fijos-posibles-sorpresas_18_019131728.html' },
      { name: 'El Nacional · Catalanes y Barça', url: 'https://www.elnacional.cat/es/deportes/luis-fuente-manda-prelista-espana-mundial-2026-barca-catalanes_1638400_102.html' },
    ],
  },
  {
    slug: 'prelista-brasil-mundial-2026-ancelotti-55-neymar-vinicius-rodrygo-fuera',
    title:
      'Brasil envía la prelista del Mundial: Ancelotti rescata a Neymar y deja fuera a Rodrygo y Militão',
    summary:
      'La CBF entregó este lunes a la FIFA los 55 nombres de Carlo Ancelotti. La sorpresa: el italiano incluye a Neymar pese a su recuperación de ligamentos, busca su cuarto Mundial. Rodrygo, Éder Militão y la joya del Chelsea Estêvão se quedan fuera por lesión. Vinicius Jr. aparece sin dudas. La lista definitiva de 26 se anuncia el 18 de mayo en el Museo del Mañana de Río de Janeiro.',
    body: `La Confederação Brasileira de Futebol envió el lunes 11 de mayo a FIFA la prelista de 55 jugadores que Carlo Ancelotti maneja para el Mundial 2026. Es la primera lista oficial bajo la dirección del entrenador italiano, contratado en mayo de 2025.

**Neymar entra, contra toda predicción**. El delantero del Santos, recuperado de la rotura de ligamento cruzado y menisco sufrida en octubre de 2023, busca su cuarto Mundial (2014, 2018, 2022, 2026) y empatar el récord histórico brasileño que comparten Cafú, Ronaldo Nazário y Dida. La continuidad física de Neymar en las próximas dos semanas determinará si llega o no al corte final.

**Las bajas más sentidas**. Rodrygo Goes (Real Madrid) queda fuera por una lesión muscular. Éder Militão tampoco entra. La noticia más comentada es la baja de Estêvão Willian, la joya del Chelsea de 17 años: lesión de grado 4 en el muslo derecho.

**Lo que sí está**. Vinicius Jr. encabeza la delantera. Le acompañan Raphinha (Barça), Endrick (Real Madrid), Antony (Manchester United) y João Pedro (Brighton). El portero titular: Alisson (Liverpool). Brasil concentra a los 26 elegidos en la Granja Comary el 27 de mayo. Debut: 13 de junio contra Marruecos en el MetLife Stadium de Nueva Jersey.`,
    category: 'convocatorias',
    sourceName: 'Infobae · Deportes',
    sourceUrl: 'https://www.infobae.com/deportes/2026/05/11/ancelotti-presento-la-prelista-de-la-seleccion-de-brasil-de-cara-al-mundial-2026-la-baja-sorpresiva-y-el-guino-a-neymar/',
    sourceLang: 'es',
    publishedAt: '2026-05-11T18:00:00Z',
    sourcesSecondary: [
      { name: '442 (Perfil) · Neymar adentro, Rodrygo afuera', url: 'https://442.perfil.com/noticias/mundial-2026/neymar-adentro-rodrygo-afuera-las-sorpresas-de-ancelotti-en-la-prelista-de-brasil-para-el-mundial-2026-a35.phtml' },
      { name: 'El Gráfico · Carlo Ancelotti define el camino', url: 'https://www.elgrafico.com.ar/articulo/mundial-2026/99856/carlo-ancelotti-define-el-camino-de-brasil-sorpresas-regresos-y-bajas-de-peso-en-la-prelista-para-el-mundial-2026' },
      { name: '365Scores · Lista de 55 jugadores Brasil 2026', url: 'https://www.365scores.com/es/news/brasil-pre-lista-convocados-mundial/' },
    ],
  },
  {
    slug: 'prelista-argentina-mundial-2026-scaloni-55-messi-dybala-fuera-mastantuono-echeverri',
    title:
      'Argentina entrega su prelista del Mundial: Messi sí, Dybala no, Mastantuono y Echeverri irrumpen',
    summary:
      'La AFA envió este lunes a la FIFA los 55 nombres de Lionel Scaloni. Messi entra rumbo a su último Mundial, acompañado por 20 campeones de Qatar 2022. Las bajas dolorosas: Dybala (40 caps), Ángel Correa (Tigres) y Valentín Castellanos (West Ham). Las sorpresas: Franco Mastantuono (Real Madrid) y Claudio Echeverri (Girona) entran con menos de 20 años. La lista definitiva de 26 se anuncia antes del 30 de mayo.',
    body: `La Asociación del Fútbol Argentino entregó el lunes 11 de mayo a la FIFA la prelista de 55 jugadores que Lionel Scaloni maneja para el Mundial 2026. Completa la tríada del mismo día con Brasil y España.

**Messi confirmado**. Lionel Messi entra en la prelista en lo que se anticipa como su último Mundial. El capitán cumplirá 39 años el 24 de junio, en plena fase de grupos. Si entra en la lista de 26, se convertirá en el primer jugador con seis Mundiales disputados en la historia del fútbol (Carbajal, Matthäus, Buffon, Ronaldo Nazário y Casillas/Márquez comparten el récord de 5).

**20 campeones de Qatar 2022** acompañan a Messi: Emiliano Martínez (Aston Villa), Cuti Romero (Tottenham), Otamendi (Benfica), Lisandro Martínez (Manchester United), De Paul (Atlético), Enzo Fernández (Chelsea), Mac Allister (Liverpool), Julián Álvarez (Manchester City), Lautaro Martínez (Inter) y Ángel Di María (Benfica).

**Las bajas más comentadas**. Paulo Dybala (Roma, 40 internacionalidades, goleador final Copa América 2021) queda fuera. Ángel Correa (Tigres UANL) y Valentín Castellanos (West Ham) tampoco entran.

**Las sorpresas generacionales**. Franco Mastantuono (Real Madrid, 18 años, fichaje 45M EUR en enero) y Claudio Echeverri (Girona, 18 años). 6 jugadores de River, 4 de Boca. Lista 26 definitiva antes del 30 de mayo. Debut: 16 de junio contra el ganador del repechaje intercontinental en el SoFi Stadium de Los Ángeles.`,
    category: 'convocatorias',
    sourceName: 'FIFA · Argentina lista 55 jugadores Copa Mundial 2026',
    sourceUrl: 'https://www.fifa.com/es/tournaments/mens/worldcup/canadamexicousa2026/articles/argentina-lista-55-jugadores-copa-mundial-2026',
    sourceLang: 'es',
    publishedAt: '2026-05-11T17:00:00Z',
    sourcesSecondary: [
      { name: 'Infobae · 6 de River, 4 de Boca', url: 'https://www.infobae.com/deportes/2026/05/11/con-6-jugadores-de-river-y-4-de-boca-afa-anuncio-la-prelista-de-55-jugadores-de-la-seleccion-argentina-para-el-mundial/' },
      { name: 'Ámbito · Scaloni presenta la prelista', url: 'https://www.ambito.com/deportes/mundial-2026-lionel-scaloni-presento-la-prelista-55-jugadores-la-seleccion-argentina-n6276122' },
      { name: 'Goal · Messi named in provisional squad', url: 'https://www.goal.com/en-us/lists/lionel-messi-argentina-world-cup-squad-alejandro-garnacho-lisandro-martinez/blta1814607e6572f83' },
      { name: 'La Nación · Los nombres de la prelista', url: 'https://www.lanacion.com.ar/deportes/futbol/la-prelista-de-55-jugadores-para-el-mundial-2026-estos-son-los-nombres-nid11052026/' },
      { name: 'CNN Español · Seis campeones ausentes', url: 'https://cnnespanol.cnn.com/2026/05/11/deportes/prelista-seleccion-argentina-scaloni-mundial-orix' },
    ],
  },
  {
    slug: 'fifa-panini-collection-app-mundial-2026-coca-cola-album-digital',
    title:
      'FIFA y Panini lanzan la app oficial del álbum 2026 con Coca-Cola: 528 cromos digitales, escaneo de etiquetas y packs diarios gratis',
    summary:
      'La aplicación «FIFA Panini Collection by Coca-Cola» abre una pasarela digital al álbum oficial: 48 selecciones, 528 cromos de jugadores, logos, mascotas y trofeos. Cada día regala packs gratis a quien escanee etiquetas de Coca-Cola, sobres físicos Panini y portadas de álbum. Plazo para completar la colección: 30 de septiembre de 2026. iOS y Android.',
    body: `FIFA y Panini activaron oficialmente la app «FIFA Panini Collection by Coca-Cola», su versión digital del álbum 2026, disponible desde esta semana en iOS y Android sin coste de descarga. Es la primera vez que el álbum oficial de un Mundial nace en paralelo en versión física y app desde el primer día, una integración acordada en el marco del contrato Panini-FIFA renovado en 2024 y reforzado con la sponsorship principal de Coca-Cola como Marketing Partner del torneo.

**Lo que contiene**. 48 selecciones participantes, **528 cromos de jugadores** (11 por selección), además de **logos**, **mascotas** (Maple, Zayu y Clutch) y **trofeos** asociados al torneo.

**Cómo se consiguen los packs**. La novedad respecto a colecciones digitales anteriores de Panini está en la integración multimarca: el usuario puede escanear con la cámara del teléfono tres tipos de elementos físicos para conseguir packs gratis cada día.

- Etiquetas y latas de **Coca-Cola** con el branding FIFA 2026
- **Sobres físicos** de Panini comprados en kiosco
- **Portadas de álbum** Panini físico

A esto se suman códigos promocionales puntuales que se reparten en campañas de **Panini, FIFA, Coca-Cola y McDonald's**.

**Modelo de negocio**. La descarga es gratuita. La monetización clave está en los códigos físicos (mantiene la venta del álbum y sobres en kiosco) y, según fuentes consultadas, en futuras opciones de pago dentro de la app para acelerar la colección.

**Plazo**. La colección estará viva hasta el **30 de septiembre de 2026**, fecha en que se cierran las recompensas y se publica la galería final.

**Por qué importa**. La conversión generacional del álbum Panini al móvil llevaba años discutiéndose. Con esta app y el respaldo Coca-Cola, FIFA institucionaliza por primera vez un coleccionable digital con la misma marca que el coleccionable físico. Una hora de paseo por el supermercado escaneando etiquetas durante el verano puede equivaler a 60-80 sobres físicos gratis.`,
    category: 'panini',
    sourceName: 'FIFA · Panini Collection app',
    sourceUrl: 'https://www.fifa.com/es/tournaments/mens/worldcup/canadamexicousa2026/articles/fifa-panini-coleccion-aplicacion-app',
    sourceLang: 'es',
    publishedAt: '2026-05-11T14:00:00Z',
    sourcesSecondary: [
      { name: 'App Store · FIFA Panini Collection', url: 'https://apps.apple.com/us/app/fifa-panini-collection/id6752864987' },
      { name: 'Google Play · FIFA Panini Collection', url: 'https://play.google.com/store/apps/details?id=it.panini.fifacollection' },
      { name: 'Coca-Cola US · FIFA Panini packs', url: 'https://www.coca-cola.com/us/en/offerings/fifa-world-cup-26/panini' },
      { name: 'FIFA Collect · Panini hub', url: 'https://collect.fifa.com/pages/panini' },
      { name: 'Panini America · World Cup 2026 sticker collection', url: 'https://www.paniniamerica.net/sticker-collections/sticker-collection/fifa-world-cup-2026tm.html' },
    ],
  },
  {
    slug: 'shakira-dai-dai-cancion-oficial-mundial-2026-burna-boy',
    title:
      '«Dai Dai»: Shakira firma el himno oficial del Mundial 2026 con Burna Boy 16 años después de «Waka Waka»',
    summary:
      'Shakira vuelve al himno mundialista 16 años después de «Waka Waka». Su nueva canción se llama «Dai Dai», la firma con el nigeriano Burna Boy y la presentó el 7 de mayo en un teaser grabado en el Maracaná. Estreno completo el 14 de mayo. Convive con «Love Always Wins» de Estefan, ahora reposicionada como banda sonora promocional latina.',
    body: `**El regreso 16 años después.** Shakira oficializó la noche del 7 de mayo de 2026 su segundo himno oficial para una Copa del Mundo: «Dai Dai», una colaboración con el cantante nigeriano Burna Boy producida con el sello FIFA. La pieza se estrena por completo el 14 de mayo en plataformas de streaming, dejando un teaser de un minuto disponible desde el día del anuncio. Es la primera canción oficial de FIFA que firma Shakira desde «Waka Waka (This Time for Africa)» en Sudáfrica 2010, un tema que vendió más de cuatro millones de copias y se convirtió en uno de los temas comerciales más exitosos del catálogo mundialista.

**Dónde y con quién.** El videoclip de presentación está grabado en el Estadio Maracaná de Río de Janeiro, no en una sede del Mundial 2026. La elección, fuera de protocolo (los himnos suelen presentarse en el país anfitrión o en estudio neutro), refuerza el pulso latino que FIFA ha impreso al torneo norteamericano. Burna Boy, ganador de un Grammy y figura clave de la fusión afrobeats global, aparece junto a Shakira en una coreografía con bailarines internacionales. La fusión musical mezcla reggaetón, afrobeats y percusión brasileña, con letra en español e inglés.

**El nombre.** «Dai dai» es una expresión italiana que significa «vamos, vamos» y se usa en estadios europeos como cántico de aliento. La elección rompe con la tradición de títulos en español o en inglés americano y apunta directamente al mercado europeo del fútbol, no al norteamericano. Es una pista de que FIFA quiere que el himno funcione tanto en USA como en Italia, Inglaterra o Alemania.

**Coexistencia con «Love Always Wins».** Este sitio publicó el 1 de mayo una nota sobre Emilio Estefan firmando «Love Always Wins» como canción del Mundial. La diferencia se aclara ahora: «Love Always Wins» queda como pieza promocional latina de la banda sonora oficial, mientras «Dai Dai» asume el rol de himno oficial global de FIFA. Es el modelo Qatar 2022, donde «Hayya Hayya» fue el himno mundial y otros temas circularon a nivel regional.`,
    category: 'ceremonia',
    sourceName: 'Olympics.com',
    sourceUrl:
      'https://www.olympics.com/en/news/shakira-2026-fifa-world-cup-anthem-dai-dai-teaser',
    sourceLang: 'en',
    publishedAt: '2026-05-08T10:00:00+00:00',
    sourcesSecondary: [
      {
        name: 'Billboard',
        url: 'https://www.billboard.com/music/latin/shakira-dai-dai-2026-fifa-world-cup-song-burna-boy-teaser-1236241647/',
      },
      {
        name: 'Euronews',
        url: 'https://www.euronews.com/culture/2026/05/08/dai-dai-shakira-teases-official-world-cup-2026-anthem',
      },
      {
        name: 'Yahoo Sports',
        url: 'https://sports.yahoo.com/articles/shakira-announces-long-awaited-fifa-170219112.html',
      },
      {
        name: 'ESPN UK',
        url: 'https://www.espn.co.uk/football/story/_/id/48710188/shakira-unveils-teaser-official-world-cup-anthem-burna-boy',
      },
    ],
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/2023-11-16_Gala_de_los_Latin_Grammy,_03_(cropped)02.jpg?width=1200',
      alt: 'Shakira en la Gala de los Latin Grammy 2023, autora del himno oficial del Mundial 2026 «Dai Dai»',
      credit: 'Foto: Wikimedia Commons',
      license: 'CC BY-SA 4.0',
    },
  },
  {
    slug: 'mundial-2026-entradas-disponibilidad-17-partidos-agotados-mayo',
    title:
      '17 partidos agotados, 80 aún con stock: el mapa real de las entradas del Mundial 2026 a un mes del kickoff',
    summary:
      'A un mes del torneo, FIFA confirma 17 partidos de fase de grupos agotados, entre ellos el inaugural México-Sudáfrica, Brasil-Marruecos en MetLife y Escocia-Brasil en Miami. Más de 80 partidos siguen con stock en fase 4. Categoría 3 más asequible: 380 dólares en siete encuentros concretos. La más cara de la fase de grupos: 4.105 dólares para USA-Paraguay del 12 de junio en SoFi.',
    body: `**El cuadro a un mes vista.** A pocas semanas del partido inaugural en el Estadio Azteca, FIFA mantiene activa la fase 4 (Last-Minute Sales) con un escenario mixto: 17 de los 72 partidos de fase de grupos están oficialmente agotados, mientras que más de 80 partidos siguen con inventario en fifa.com/tickets, según los datos publicados por la organización a principios de mayo. La paradoja explícita: Infantino dijo en enero que la demanda equivalía a «mil años de Copas del Mundo a la vez», y aun así hay disponibilidad amplia.

**Los partidos agotados.** Entre los confirmados como sold out figuran los tres partidos de México (incluido el inaugural ante Sudáfrica, México-Corea del Sur en Guadalajara y México-Chequia en CDMX), Türkiye-USA en Los Ángeles, Brasil-Marruecos en MetLife (Nueva York/NJ) y Escocia-Brasil en Miami. La mayoría son partidos con anfitrión local, partidos de cabezas de serie con grandes diásporas en USA, o duelos morbosos como el Brasil de Vinícius Jr.

**Los más caros, los más baratos.** El asiento más asequible disponible al público parte de 380 dólares y está reservado a siete partidos concretos: Austria-Jordania, Nueva Zelanda-Egipto, Jordania-Argelia, Cabo Verde-Arabia Saudí, Argelia-Austria, RD del Congo-Uzbekistán y Curaçao-Costa de Marfil. En el otro extremo, USA-Paraguay del 12 de junio en SoFi Stadium (partido inaugural compartido) llega a 4.105 dólares en Cat. 1 — el partido más caro de fase de grupos, por encima incluso de Argentina-Austria (2.925 USD), Ecuador-Alemania (2.550) y Uruguay-España (2.520).

**Eliminatorias y final.** La semifinal en Atlanta se vende a 9.660 dólares en Cat. 1 frontal. La final del 19 de julio (MetLife) parte de 1.490 dólares en Cat. 3, llega oficialmente hasta 7.875 USD en Cat. 1, sube a 10.990 dólares en la nueva categoría Front 1 (frontal premium) y, en la plataforma de reventa oficial FIFA, ha aparecido marcada hasta los 2,3 millones de dólares por unidad. La hospitality oficial (paquetes premium en hospitality.fifa.com) sigue disponible para más de 100 partidos.

**Cómo funciona la fase 4.** Desde el 1 de abril, FIFA libera lotes de inventario por orden de llegada (no por sorteo) cada vez que aparece nueva disponibilidad — sea por liberaciones del propio inventario, por entradas devueltas o por reventa oficial. La compra es por orden cronológico de llegada y los precios son dinámicos, ajustándose en tiempo real según la demanda de cada partido.`,
    category: 'entradas',
    sourceName: 'Yahoo Sports',
    sourceUrl:
      'https://sports.yahoo.com/soccer/article/fifa-claims-to-have-508-million-requests-for-7-million-available-tickets-so-why-are-plenty-of-tickets-still-available-235241494.html',
    sourceLang: 'en',
    publishedAt: '2026-05-08T09:00:00+00:00',
    sourcesSecondary: [
      {
        name: 'FIFA · Last-Minute Sales fase 4',
        url: 'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/last-minute-tickets-sales-phase-to-start-on-1-april',
      },
      {
        name: 'FIFA · ticket drop 22 abril',
        url: 'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/last-minute-sales-phase-new-ticket-drop-22-april',
      },
      {
        name: 'FOX LA · pricing strategy backlash',
        url: 'https://www.foxla.com/news/world-cup-2026-ticket-prices-fifa-strategy',
      },
      {
        name: 'Líder en Deportes · entradas primeros partidos',
        url: 'https://www.liderendeportes.com/noticias/futbol/internacional-football/mundial-2026-entradas-para-los-primeros-partidos-siguen-a-la-venta/',
      },
      {
        name: 'El Mañana · precios hasta 4.105 USD',
        url: 'https://www.elmanana.com/deportes/futbol/precios-de-entradas-mundial-2026-hasta-4105-dolares/6127327',
      },
    ],
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/MetLife_Stadium_(36436248206).jpg?width=1200',
      alt: 'MetLife Stadium en Nueva Jersey, sede de la final del Mundial 2026 y de Brasil-Marruecos (partido agotado)',
      credit: 'Foto: Wikimedia Commons',
      license: 'CC BY-SA 2.0',
    },
  },
  {
    slug: 'precios-entradas-mundial-2026-trump-fifa-fse-demanda-ue',
    title:
      'Trump, Football Supporters Europe y la reventa de 2,3 millones: la FIFA defiende los precios dinámicos del Mundial 2026',
    summary:
      'La FIFA encara una doble ofensiva por los precios dinámicos del Mundial 2026. El 7 de mayo Donald Trump dijo que «yo tampoco los pagaría» refiriéndose a los mil dólares por USA-Paraguay del 12 de junio. Football Supporters Europe ha presentado denuncia formal ante la Comisión Europea por precios «abusivos». La reventa oficial llegó a marcar 2,3 millones de dólares por una entrada de la final.',
    body: `**La doble ofensiva contra el precio dinámico.** La FIFA aplica por primera vez en una Copa del Mundo el sistema de dynamic pricing: cada entrada ajusta su precio en tiempo real según demanda, selecciones, sede y momento de compra. La fase 4 de venta (Last-Minute Sales) lleva activa desde el 1 de abril y ha disparado los precios de los partidos calientes muy por encima de la tabla oficial publicada por FIFA. El 7 de mayo, dos voces muy distintas confluyeron en la misma crítica.

**Donald Trump: «yo tampoco los pagaría».** El presidente estadounidense, anfitrión moral del torneo, criticó públicamente los precios al ser preguntado por el partido inaugural compartido USA-Paraguay del 12 de junio en el SoFi Stadium de Los Ángeles. Dijo, textualmente, que ni él pagaría los mil dólares que cuesta hoy una entrada de categoría media para ese partido. La declaración, recogida por Tribuna y El Universal, llega tres días antes del cierre del plazo de listas y a un mes del inicio del torneo.

**Football Supporters Europe demanda en Bruselas.** Más estructurada y potencialmente más seria es la ofensiva legal: la organización Football Supporters Europe (FSE), que agrupa a federaciones de aficionados de toda la UE, ha presentado denuncia formal ante la Comisión Europea calificando la estructura de precios como «abusiva» y como una «traición monumental» al modelo histórico del fútbol como deporte popular. La FSE pide a Bruselas que investigue si el sistema vulnera la regulación europea de prácticas comerciales.

**El dato más comentado: 2,3 millones de dólares.** En la plataforma oficial de reventa de FIFA llegó a aparecer una entrada de la final del 19 de julio (MetLife Stadium) a 2,3 millones de dólares estadounidenses. En la venta directa, las categorías 1 de la final superan los 6.730-7.875 dólares, mientras que las más asequibles parten de 1.490 dólares (Cat. 3). Para comparar: la entrada media de fase de grupos en Qatar 2022 era de 105 dólares; en Norteamérica 2026 parte de 120 dólares en categoría 3 de las sedes con menor demanda.

**La defensa de Infantino.** Gianni Infantino, presidente de FIFA, ha defendido el modelo argumentando que responde a las condiciones del mercado de entretenimiento estadounidense, donde los precios variables son habituales en NBA, NFL y conciertos. La organización ha insistido en que el Supporter Tier de 60 dólares (reservado a Fan Clubs oficiales de las selecciones) sigue siendo la vía asequible para aficionados acreditados.`,
    category: 'polemica',
    sourceName: 'Infobae · Estados Unidos',
    sourceUrl:
      'https://www.infobae.com/estados-unidos/2026/05/07/entradas-de-hasta-usd-23-millones-la-fifa-defendio-los-precios-de-los-tickets-para-el-mundial-2026/',
    sourceLang: 'es',
    publishedAt: '2026-05-08T08:00:00+00:00',
    sourcesSecondary: [
      {
        name: 'Tribuna México · Trump critica',
        url: 'https://tribuna.com.mx/mundo/2026/05/07/donald-trump-critica-altos-precios-de-boletos-para-el-mundial-2026-en-estados-unidos_527672/',
      },
      {
        name: 'El Universal Colombia · Trump',
        url: 'https://www.eluniversal.com.co/deportes/2026/05/07/la-polemica-declaracion-de-donald-trump-sobre-entradas-del-mundial-no-pagaria/',
      },
      {
        name: 'Primicias Ecuador · ley del mercado dinámico',
        url: 'https://www.primicias.ec/deportes/mundial-2026/fifa-ley-oferta-demanda-mercado-dinamico-reventa-precios-venta-entradas-partidos-estadios-122067/',
      },
      {
        name: 'Emol Chile · polémica entradas',
        url: 'https://www.emol.com/noticias/Deportes/2026/05/07/1199321/polemica-entradas-mundal.html',
      },
      {
        name: 'Prensa Libre · Trump',
        url: 'https://www.prensalibre.com/deportes/futbol-internacional/yo-tampoco-los-pagaria-trump-critica-los-precios-de-boletos-para-la-copa-mundial-del-2026/',
      },
    ],
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Official_Presidential_Portrait_of_President_Donald_J._Trump_(2025)_(cropped)(2).jpg?width=1200',
      alt: 'Donald Trump, presidente de Estados Unidos y anfitrión moral del Mundial 2026, criticó públicamente los precios de las entradas',
      credit: 'Retrato presidencial oficial 2025 · Wikimedia Commons',
      license: 'Dominio público (obra del gobierno federal de EE. UU.)',
    },
  },
  {
    slug: 'mundial-2026-entradas-estafas-4000-dominios-sospechosos-profeco',
    title:
      'La cara oscura del Mundial 2026: 4.000 dominios sospechosos detectados y alerta global por estafas con entradas',
    summary:
      'Check Point ha detectado más de 4.000 dominios web vinculados al Mundial 2026 creados para fraudes con boletos, transmisión ilegal y productos falsificados. La PROFECO mexicana emitió alerta a finales de abril. FIFA insiste: cualquier oferta fuera de fifa.com/tickets es estafa. Las modalidades más detectadas: webs que imitan al sitio oficial, ofertas en redes sociales y paquetes turísticos a precio sospechosamente bajo.',
    body: `**El otro lado del Mundial.** Mientras FIFA defiende sus precios dinámicos en pleno escándalo público y libera lotes semanales de entradas en fase 4, la cara oscura del torneo se mueve a otra velocidad. La empresa de ciberseguridad Check Point Software Technologies informó que en apenas dos meses se han registrado más de 4.000 dominios web vinculados al Mundial 2026. La mayoría no son sitios legítimos de información o turismo: están diseñados para fraudes de boletos, transmisión ilegal de partidos y venta de productos falsificados.

**Las modalidades más detectadas.** Los ciberdelincuentes operan en tres frentes principales. **Webs falsas que imitan a fifa.com/tickets**: usan extensiones .com, .online, .shop, .store y .football, copian el diseño oficial y capturan datos de tarjeta cuando el comprador intenta «comprar entradas» a precio asequible. **Ofertas en redes sociales**: posts pagados en Instagram, Facebook y X con precios «especiales» que llevan a chats privados de Telegram o WhatsApp donde piden transferencias bancarias inmediatas. **Paquetes turísticos sospechosos**: agencias inexistentes que venden vuelo + hotel + entrada por debajo del precio de la entrada oficial sola.

**PROFECO México alerta.** La Procuraduría Federal del Consumidor mexicana emitió a finales de abril una alerta formal por el incremento en el número de denuncias por estafa con boletos del Mundial. En el territorio mexicano la reventa de boletos está prohibida, lo que añade una capa legal: comprar a un revendedor en México no solo es arriesgado, también puede ser sancionable.

**FIFA, oficial y único.** La organización repite el mismo mensaje desde febrero de 2026: el único canal oficial es **fifa.com/tickets**. Cualquier otra fuente —incluso sitios que parezcan «socios» o «aliados»— está fuera del sistema. FIFA tiene además una plataforma oficial de reventa dentro de fifa.com/tickets, que es la única forma legal y segura de comprar entradas usadas. Webs de terceros como StubHub o Viagogo no están autorizadas: el ticket puede ser cancelado en la entrada del estadio.

**Cómo no caer.** Las recomendaciones de las autoridades son consistentes: desconfiar de precios demasiado bajos o promociones urgentes, no comprar desde enlaces enviados por redes sociales o mensajería privada, no transferir dinero a cuentas particulares, no compartir códigos de verificación bancarios. Y, ante la duda, comprobar el dominio: el oficial es exactamente **fifa.com/tickets**, sin guiones, sin subdominios extraños, con candado SSL. Cualquier otra cosa, no.`,
    category: 'polemica',
    sourceName: 'Infobae · Tecno',
    sourceUrl:
      'https://www.infobae.com/tecno/2025/10/06/la-otra-cara-de-la-copa-mundial-fifa-2026-cibercriminales-robando-y-mas-de-4000-dominios-sospechosos/',
    sourceLang: 'es',
    publishedAt: '2026-05-08T06:00:00+00:00',
    sourcesSecondary: [
      {
        name: 'PROFECO México · alerta estafas (Informador)',
        url: 'https://www.informador.mx/deportes/mundial-2026-profeco-lanza-alerta-por-incremento-de-estafas-en-venta-de-boletos-20260423-0218.html',
      },
      {
        name: 'Infobae · cómo operan los ciberdelincuentes',
        url: 'https://www.infobae.com/tecno/2026/03/04/autoridades-alertan-por-fraudes-con-boletos-del-mundial-2026-como-operan-los-ciberdelincuentes/',
      },
      {
        name: 'Semana · truco de los delincuentes',
        url: 'https://www.semana.com/tecnologia/articulo/mucho-ojo-con-las-entradas-del-mundial-2026-expertos-lanzan-alerta-sobre-el-truco-que-estan-usando-delincuentes-para-estafar/202600/',
      },
      {
        name: 'Sports Illustrated MX · boletos falsos',
        url: 'https://www.si.com/mx/futbol/estafa-en-juego-advierten-sobre-boletos-falsos-para-el-mundial-2026',
      },
      {
        name: 'Global Rescue · scams Mundial 2026',
        url: 'https://www.globalrescue.com/common/blog/detail/2026-fifa-world-cup-scams',
      },
    ],
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Computer_security.jpg?width=1200',
      alt: 'Imagen genérica de ciberseguridad. Check Point detectó más de 4.000 dominios sospechosos vinculados al Mundial 2026',
      credit: 'Foto: Wikimedia Commons',
      license: 'CC BY-SA 4.0',
    },
  },
  {
    slug: 'lista-provisional-mundial-2026-fecha-tope-11-mayo-fifa',
    title:
      'Esta semana se cierra la lista provisional del Mundial 2026: cuándo dará España la suya y cómo lo hará la FIFA',
    summary:
      'Las 48 selecciones tienen hasta el lunes 11 de mayo para entregar a la FIFA la lista provisional de 35 a 55 jugadores, con 5 porteros mínimo. La RFEF la dará públicamente en Las Rozas. Argentina, Brasil, Francia y Portugal preparan anuncios entre el 9 y el 13 de mayo. La definitiva (23-26 jugadores) se cierra el 1 de junio, diez días antes del kickoff en el Estadio Azteca.',
    body: `**El plazo se cierra el lunes.** Las 48 federaciones que disputarán el Mundial 2026 tienen hasta el final del 11 de mayo (lunes) para entregar a la FIFA la lista provisional —el llamado release list— compuesta por entre 35 y 55 jugadores, con un mínimo obligatorio de cinco porteros. Es una lista interna que la FIFA no hace pública, aunque la mayoría de federaciones aprovecha esos días para anunciar su prelista en rueda de prensa local. Es el punto de partida del calendario oficial de convocatorias publicado por FIFA.

**La RFEF, en Las Rozas.** En España, la Real Federación Española de Fútbol publicará tradicionalmente su prelista en Las Rozas a inicios de mayo. La fecha exacta no está confirmada, pero el patrón histórico (1998, 2010, 2018, 2022) apunta a una rueda de prensa entre el 5 y el 11 de mayo, antes del cierre FIFA. La selección de Luis de la Fuente está en el Grupo H, junto a Uruguay, Arabia Saudí y Cabo Verde. El primer partido es el 15 de junio contra Cabo Verde en Atlanta.

**Argentina, Brasil, Francia y Portugal.** Lionel Scaloni había presentado el 18 de marzo la última prelista previa antes del Mundial; ahora afina los detalles para entregar el listado oficial entre el 9 y el 13 de mayo. La CBF dará la lista provisional brasileña el 18 de mayo, según anuncio de Carlo Ancelotti del 29 de abril. Francia (Didier Deschamps en Clairefontaine) y Portugal (Roberto Martínez en Cidade do Futebol) cerrarán los suyos en la primera quincena de mayo. La lista definitiva, con entre 23 y 26 jugadores y 3 porteros obligatorios, se entrega entre el 25 de mayo y el 1 de junio.

**El calendario completo.** El día siguiente al cierre definitivo (martes 2 de junio) FIFA dará a conocer los nombres de los 1.248 jugadores que disputarán el Mundial. Hasta 24 horas antes del primer partido del equipo, FIFA permite sustituir a un jugador convocado por lesión certificada por un médico de la federación y un médico FIFA. Una vez disputado el primer partido, no se admiten sustituciones: el equipo termina el torneo con los jugadores aptos restantes.

**Lo que cambia respecto a 2022.** El tope de 26 jugadores —elevado por excepción durante Qatar 2022 por la pandemia y la cercanía con la temporada europea— se mantiene en 2026. Es la primera vez que se aplica en condiciones normales y con la nueva ronda de dieciseisavos añadida al calendario. La justificación: 48 selecciones, un torneo de 39 días en lugar de 32, y un partido extra por equipo eliminado en R32.`,
    category: 'convocatorias',
    sourceName: 'Olympics.com · FIFA',
    sourceUrl:
      'https://www.olympics.com/en/news/fifa-world-cup-2026-deadlines-national-team-squad-announcements',
    sourceLang: 'en',
    publishedAt: '2026-05-08T07:00:00+00:00',
    sourcesSecondary: [
      {
        name: 'AFA · convocatorias Mundial 2026',
        url: 'https://www.afa.com.ar/es/posts/todo-sobre-las-listas-de-convocatorias-de-la-copa-mundial-2026',
      },
      {
        name: 'FIFA.com · listas convocatorias',
        url: 'https://www.fifa.com/es/tournaments/mens/worldcup/canadamexicousa2026/articles/listas-convocatorias-copa-mundial-2026-cuantos-jugadores-cuando-se-entregan',
      },
      {
        name: 'Sports Illustrated ES · fechas listas definitivas',
        url: 'https://www.si.com/es-us/futbol/cuando-se-conoceran-las-listas-definitivas-del-mundial-2026-fechas-clave-de-las-convocatorias',
      },
      {
        name: 'Infobae · Scaloni lista marzo',
        url: 'https://www.infobae.com/deportes/2026/03/18/lionel-scaloni-dio-a-conocer-la-ultima-lista-de-la-seleccion-argentina-antes-del-mundial-2026-con-varias-sorpresas/',
      },
    ],
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/FIFA_logo_without_slogan.svg?width=1200',
      alt: 'Logo de la FIFA, organismo que cierra el plazo de listas provisionales del Mundial 2026 el 11 de mayo',
      credit: 'FIFA · vía Wikimedia Commons',
      license: 'Trademark fair use',
    },
  },
  {
    slug: 'lego-mundial-2026-coleccion-9-sets-messi-ronaldo-mbappe-vinicius',
    title:
      'LEGO presenta su colección Mundial 2026: nueve sets con Messi, Ronaldo, Mbappé y Vinícius Jr. desde 24,99 dólares',
    summary:
      'LEGO entra de lleno en el merchandising oficial de la Copa del Mundo con nueve sets que cubren el espectro completo de coleccionista. La gama va de los 24,99 $ del emblema oficial 43032 al set premium «Official Trophy» 43020: una réplica 1:1 del trofeo con 2.842 piezas, 36 cm de altura y la primera vez que LEGO usa tantas piezas en color oro real en un mismo set. Pre-orders activas, llegada a tiendas el 1 de mayo.',
    body: `LEGO ha lanzado su colección oficial vinculada al Mundial 2026, su mayor incursión en merchandising deportivo desde la línea Sports descontinuada en 2009. La gama, anunciada bajo el sello LEGO Editions, está compuesta por nueve sets que cubren los tres tipos de coleccionista: el casual ($24,99), el AFOL (Adult Fan Of LEGO) intermedio ($79,99) y el premium ($199,99).

**Los protagonistas son los Big Four**. Los buildable display de la línea «Football Legend» están dedicados a Cristiano Ronaldo (set 43016) y Lionel Messi (43015) por 79,99 $ cada uno: figuras articuladas de unos 25 cm con base personalizada y placa identificativa. La línea «Football Highlights» a 29,99 $ retrata escenas icónicas de Messi (43011) celebrando con la copa, Cristiano (43012), Mbappé (43013) y Vinícius Jr. (43027) en sus ejecuciones más reconocibles.

**El plato fuerte es la réplica del trofeo**. El set 43020 «FIFA World Cup Official Trophy» reproduce el trofeo a escala 1:1 con 2.842 piezas, 36 cm de altura y un precio de 199,99 $ / 179,99 €. Esconde una sorpresa: un compartimento secreto en la esfera superior con el logo del Mundial 2026 dentro. Incluye una minifigura LEGO exclusiva con un mini-trofeo y una placa en la base con todos los campeones del mundo desde 1974. Es la primera vez que LEGO utiliza tantas piezas en color oro real (combinación de laqueado y moldeado) en un solo set.

**Dos sets «entrada» a 24,99 dólares cierran la gama**: el FIFA World Cup 2026 Official Emblem (set 43032, 298 piezas) reproduce el logo oficial del torneo, y el U.S. Soccer National Team Jersey (167 piezas) la camiseta titular de Estados Unidos en formato display. Ambos pensados para regalo y para iniciar a niños mayores de 10 años en la colección.

**Disponibilidad**. El Trophy 43020 abrió pre-order en marzo de 2026 (la primera pieza de la colección anunciada). Los ocho sets restantes llegan el 1 de mayo a LEGO.com (España, USA, México, Brasil). Amazon España, El Corte Inglés y FNAC empiezan a recibir stock entre el 5 y el 15 de mayo. La distribución LATAM (México, Argentina, Brasil) llega 1-2 semanas más tarde. Como la mayoría de releases LEGO de partner, los precios se mantienen oficiales sin descuentos durante las primeras 6-8 semanas.

**Lo que LEGO logra aquí es un golpe doble**: monetiza la fiebre Mundial sin pisar los terrenos exclusivos de Panini (cromos) ni Funko (figuras), y posiciona la marca en el escaparate del próximo Mundial con cuatro de los rostros más buscados en redes sociales. Es la primera línea LEGO donde Messi y Ronaldo coexisten oficialmente.`,
    category: 'patrocinios',
    sourceName: 'NJ.com (Newsweek media)',
    sourceUrl:
      'https://www.nj.com/shopping-deals/2026/04/lego-unveils-fifa-world-cup-2026-collection-with-sets-that-are-surprisingly-affordable.html',
    sourceLang: 'en',
    publishedAt: '2026-05-04T08:00:00Z',
    sourcesSecondary: [
      {
        name: 'LEGO.com · Official Trophy 43020',
        url: 'https://www.lego.com/en-us/aboutus/news/2025/december/lego-editions-fifa-world-cup-official-trophy',
      },
      {
        name: 'TechRadar · pre-orders',
        url: 'https://www.techradar.com/seasonal-sales/legos-fifa-world-cup-2026-sets-are-up-for-preorder-yes-theres-a-brick-built-lionel-messi',
      },
      {
        name: 'The Brick Fan · LEGO Editions May 2026',
        url: 'https://www.thebrickfan.com/lego-editions-may-2026-sets-officially-announced/',
      },
      {
        name: 'LEGO.com · FIFA World Cup 2026 Emblem 43032',
        url: 'https://www.lego.com/en-us/product/fifa-world-cup-2026-official-emblem-43032',
      },
    ],
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/LEGO_logo.svg?width=1200',
      alt: 'Logo oficial de LEGO, marca que ha lanzado su colección de nueve sets dedicada al Mundial 2026 con Messi, Ronaldo, Mbappé y Vinicius Jr.',
      credit: 'LEGO Group · vía Wikimedia Commons',
      license: 'Trademark fair use',
    },
  },
  {
    slug: 'espana-mundial-2026-opciones-pronosticos-grupo-h-yamal-rodri',
    title:
      'España al Mundial 2026: cuántas opciones reales tiene la campeona de Europa',
    summary:
      'Con Lamine Yamal y Pedri en plenitud, Rodri recuperando ritmo tras la lesión y Luis de la Fuente apuntalando el banquillo, España llega al Mundial 2026 con su mejor generación desde 2010. Las casas de apuestas la sitúan tercera o cuarta favorita, por detrás de Argentina, Francia y Brasil. El Grupo H —Cabo Verde, Arabia Saudí y Uruguay— es el único obstáculo serio antes de los cruces.',
    body: `España llega al Mundial 2026 como campeona vigente de la Eurocopa 2024 y con la generación más prometedora desde el ciclo Sudáfrica 2010. La pregunta no es si compite por el título, sino contra quién y en qué momento.

**El equipo de la campeona europea**. Lamine Yamal, máximo goleador de Eurocopa con 17 años, llega al Mundial con 19 años recién cumplidos y dos temporadas a 50+ partidos en el Barça. Pedri vuelve sin lesiones en condiciones de lanzar el centro del campo. Rodri, Balón de Oro 2024, recuperó ritmo competitivo en abril tras la rotura de cruzados que lo apartó casi un año. Por delante, Nico Williams, Dani Olmo y Mikel Oyarzabal completan un ataque rápido y vertical, distinto al de la posesión clásica de Xavi-Iniesta.

**El Grupo H, asequible pero no de oficio**. España debuta el 15 de junio contra Cabo Verde en el Mercedes-Benz Stadium de Atlanta (jornada 1, 12:00 CDT). El segundo partido es contra Arabia Saudí el 22 de junio en la misma sede. El cruce decisivo: Uruguay el 26 de junio en el Estadio Akron de Guadalajara. Tres puntos de los nueve previsibles deberían sellar el primer puesto, pero la altitud y el calor mexicanos en pleno verano son una variable que España no controla en su preparación.

**Las apuestas la sitúan top-4**. Las casas británicas (Bet365, William Hill) dan a España cuotas de 7-8 a 1 para ganar el torneo, sólo por detrás de Argentina (5-6 a 1), Francia (5-7 a 1) y Brasil (6-8 a 1). Es la mejor cotización española desde 2014, cuando llegó como campeona en ejercicio. La Inglaterra de Bellingham y la Alemania anfitriona del 2024 quedan medio escalón por debajo.

**El cruce hipotético en octavos**: el segundo del Grupo G (Bélgica, Irán, Egipto o Nueva Zelanda) o un tercero de los grupos D-E-F (España jugaría contra el segundo del G por estructura del cuadro). En cuartos podría aparecer Argentina o Brasil, dependiendo de cómo crucen. La travesía está, pero el camino se complica desde semifinales para arriba como lo hace para todos.

**Pronóstico realista**. Cuartos de final como suelo y semifinales como techo razonable. Para repetir 2010 hay que ganar siete eliminatorias seguidas en 39 días contra los mejores del planeta, y eso siempre depende de momentos específicos: un penalti, una lesión, un día concreto. España tiene jugadores para llegar; lo difícil es que coincidan en su mejor versión durante el mes y medio del torneo.`,
    category: 'jugadores',
    sourceName: 'Marca',
    sourceUrl: 'https://www.marca.com/futbol/seleccion/2026/05/01/espana-mundial-2026-opciones-yamal-rodri.html',
    sourceLang: 'es',
    publishedAt: '2026-05-03T08:00:00Z',
    sourcesSecondary: [
      { name: 'AS · La Eurocopa de Yamal', url: 'https://as.com/futbol/seleccion/2024/07/14/lamine-yamal-eurocopa-2024-final.html' },
      { name: 'OneFootball · Cuotas Mundial 2026', url: 'https://onefootball.com/en/news/world-cup-2026-betting-favourites-2026-04-25' },
      { name: 'BBC Sport · Spain at the Euros', url: 'https://www.bbc.com/sport/football/articles/euro-2024-spain-champions' },
    ],
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Senyera_Sud-àfrica_Xavi_i_Puyol.JPG?width=1200',
      alt: 'Xavi Hernández y Carles Puyol con la senyera tras la victoria de España en el Mundial de Sudáfrica 2010, la última vez que España ganó la Copa del Mundo',
      credit: 'Wikimedia Commons',
      license: 'CC BY-SA',
    },
  },
  {
    slug: 'panini-album-mundial-2026-980-cromos-salida-30-abril',
    title:
      'El álbum más largo de la historia de Panini: 980 cromos para un Mundial de 48 selecciones',
    summary:
      'La expansión a 48 equipos llega también a la pegatina. Panini sube de 670 a 980 cromos, 112 páginas y 68 especiales en material premium para abarcar 16 ciudades, tres países y un mes y medio de torneo. Completarlo cuesta entre 800 y 1.200 € sin intercambios; con grupos de Telegram baja a la mitad.',
    body: `Panini ha publicado su álbum oficial del Mundial 2026 con la mayor cifra de cromos de su historia: 980 piezas repartidas en 112 páginas, con 68 especiales en material premium (foil, hologramas, parallels). La cifra refleja la expansión del torneo a 48 selecciones y los nuevos partidos de dieciseisavos.

El precio en kiosco español es de 1 € por sobre de cinco cromos y 5 € por el álbum tapa blanda. La caja de 50 sobres con álbum incluido cuesta 80 € en Panini.es. Existen ediciones tapa dura (~15 €) y oro/lujo numerada (1.500 unidades en España, ~30 €).

Los analistas del coleccionismo deportivo sitúan el coste de completar la colección entre 800 y 1.200 € sin intercambios, lo que equivale a tres cuartas partes del Salario Mínimo Interprofesional español. Los grupos de Telegram «Panini Mundial 2026» y la plataforma Wallapop reducen ese coste a la mitad mediante intercambios 1×1 (un cromo por uno tuyo) y 3×1 para foils y hologramas.

Los cromos rookie son los que más se revalorizan a 5-10 años. Lamine Yamal y Endrick figuran como las apuestas seguras del Mundial 2026, replicando lo que hizo Mbappé en 2018, cuyo cromo cotiza hoy por encima de los 60 € en mercado secundario.

La fecha de salida (30 de abril en España y USA, 2 de mayo en LATAM) cumple el patrón habitual de Panini: lanzar la colección seis semanas antes del partido inaugural, suficiente para generar conversación pre-Mundial sin saturar el mercado antes de tiempo.`,
    category: 'panini',
    sourceName: 'Huffington Post España',
    sourceUrl:
      'https://www.huffingtonpost.es/deporte/980-cromos-112-paginas-1000-euros-completar-album-mundial-2026-lamine-yamal-messi-costara-tres-cuartas-partes-smi-f202604.html',
    sourceLang: 'es',
    publishedAt: '2026-04-30T08:00:00+00:00',
    sourcesSecondary: [
      { name: 'Panini.es', url: 'https://www.panini.es/shp_esp_es/fifa-world-cup-2026-official-sticker-collection-lbum-colecci-n-oficial-panini-005460aew-es01.html' },
      { name: 'Sports Illustrated', url: 'https://www.si.com/soccer/2026-world-cup-sticker-album-what-when-comes-out-where-buy-how-works' },
    ],
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Troca%20de%20cromos%20da%20panini%20-%201.jpg?width=1200',
      alt: 'Niños intercambiando cromos Panini del Mundial de fútbol',
      credit: 'Foto: Wikimedia Commons',
      license: 'CC BY-SA 4.0',
    },
  },
  {
    slug: 'neymar-omitido-album-panini-mundial-2026',
    title: 'Neymar, fuera del álbum Panini global del Mundial 2026',
    summary:
      'Una decisión que dice más sobre la lista de Ancelotti que sobre Panini. La marca italiana, que cierra contenido en marzo y se juega las cifras de imprenta, prefirió no incluirlo cuando ya circulaba el filtrado del Mundial brasileño. Si Ancelotti lo lleva el 18 de mayo, su rookie cromo regional será uno de los más pagados del mercado secundario.',
    body: `La versión global del álbum oficial Panini del Mundial 2026 omite a Neymar Júnior. La omisión ha generado revuelo en Brasil y entre coleccionistas internacionales, pero responde a una mecánica habitual del calendario editorial de Panini: la imprenta cierra contenido a mediados de marzo, casi dos meses antes de que se anuncien las listas FIFA definitivas (1 de junio) y aún antes de que Ancelotti revele la suya el 18 de mayo.

Panini juega siempre con los listados que circulan en los cuerpos técnicos. En el caso brasileño, parece que el ex-Madrid manejaba en marzo una pre-lista que dejaba fuera al ex-Santos por el pobre estado de forma tras varios meses sin competir y la temporada errática en el fútbol saudí. Esa pre-lista se filtró al equipo de Panini, que prefirió no arriesgar imprimir un cromo que podía quedar sin sentido.

La consecuencia: si Ancelotti acaba llamando a Neymar el 18 de mayo, su único cromo posible será una edición regional (el álbum brasileño puede tener tirada propia con jugadores no incluidos en la versión global). Cualquier eventual cromo de Neymar en esa versión brasileña se convertirá en pieza altamente cotizada en mercado secundario internacional, comparable al cromo de Mbappé rookie en 2018.

Otra opción es que Panini incluya un sticker de actualización post-cierre en sobres especiales, como ya hizo en Qatar 2022 con jugadores de última hora. Hasta hoy, sin embargo, no hay confirmación de esa medida.

La omisión también incrementa la presión sobre Endrick, Vinicius Jr. y Rodrygo como referentes del ataque brasileño en el álbum. Sus cromos tendrán carga simbólica reforzada y, previsiblemente, mayor demanda inicial en kiosco.`,
    category: 'panini',
    sourceName: 'OneFootball',
    sourceUrl:
      'https://onefootball.com/en/news/neymar-omitted-from-2026-world-cup-sticker-album-as-panini-confirms-global-version-42771577',
    sourceLang: 'en',
    publishedAt: '2026-04-30T17:00:00+00:00',
    sourcesSecondary: [
      { name: 'The Guardian', url: 'https://www.theguardian.com/football/2026/apr/29/panini-football-stickers-1000-pounds-48-team-world-cup' },
      { name: 'Globo Esporte', url: 'https://ge.globo.com' },
    ],
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Neymar%20Junior%20Brazil%20Austria%20June%202018.jpg?width=1200',
      alt: 'Neymar Júnior con la camiseta de la selección brasileña, junio 2018',
      credit: 'Foto: Wikimedia Commons',
      license: 'CC BY-SA 4.0',
    },
  },
  {
    slug: 'love-always-wins-emilio-estefan-cancion-oficial-mundial-2026',
    title:
      'Emilio Estefan firma «Love Always Wins», la canción del Mundial latino',
    summary:
      'Por primera vez, el lanzamiento de los cromos Panini y la banda sonora oficial caen la misma semana. La elección no es casual: con tres anfitriones (USA, México, Canadá), dos rivales (Argentina y Brasil) y la mitad del público hispano, FIFA apuesta el primer himno por una voz cubano-estadounidense. La balada llega antes que el videoclip.',
    body: `Emilio Estefan ha presentado el álbum musical oficial del Mundial 2026 con la canción principal «Love Always Wins». El productor cubano-estadounidense, ganador de 19 Grammys y artífice musical del fenómeno latino global de los 90 (Gloria Estefan, Shakira, Ricky Martin), firma así su segunda colaboración con FIFA tras participar en la ceremonia inaugural de la Copa América 2024.

La elección rompe el patrón de los himnos mundialistas recientes, dominados por colaboraciones tipo Shakira-Carlinhos Brown («Waka Waka», 2010), Ricky Martin («La Copa de la Vida», 1998) o el más cercano «Hayya Hayya» de FIFA-Qatar 2022. Estefan apuesta por una balada producida íntegramente en español-inglés, con coros latinos y arreglos orquestales más cinematográficos que clubberos.

El timing es deliberado. Que la canción salga la misma semana que el álbum Panini (30 abril) responde a una estrategia de saturación de marca dirigida al consumidor hispano: el mercado latino representa más del 60 % de la audiencia esperada del torneo (3 anfitriones, 2 rivales sudamericanos top, diáspora latinoamericana en USA).

«Love Always Wins» se acompaña de un álbum musical completo con artistas locales de los tres países anfitriones (México, USA, Canadá) y representación de cada confederación. Falta confirmar si se grabará un videoclip oficial coreografiado en alguno de los 16 estadios sede.

La canción está disponible en Spotify, Apple Music y YouTube desde el mediodía del 1 de mayo. La FIFA aún no ha anunciado si se utilizará en la ceremonia inaugural del 11 de junio en el Estadio Azteca, ni si habrá un segundo single.`,
    category: 'ceremonia',
    sourceName: 'La Vanguardia',
    sourceUrl:
      'https://www.lavanguardia.com/gente/20260501/11527408/emilio-estefan-presenta-love-always-wins-cancion-album-musical-mundial-2026.amp.html',
    sourceLang: 'es',
    publishedAt: '2026-05-01T10:00:00+00:00',
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Gloria%20Estefan%20and%20Emilio%20Estefan%20at%202014%20MIFF%20%28cropped%29.jpg?width=1200',
      alt: 'Emilio Estefan, productor musical cubano-estadounidense, autor de la canción oficial del Mundial 2026',
      credit: 'Foto: Wikimedia Commons',
      license: 'CC BY-SA 2.0',
    },
  },
  {
    slug: 'escocia-vuelve-album-panini-mundial-2026',
    title:
      'Escocia vuelve al álbum Panini, fenómeno cultural en Edimburgo y Glasgow',
    summary:
      'Tras tres Mundiales consecutivos sin clasificar (2014, 2018, 2022), Escocia recupera su lugar en el álbum oficial. Los cromos «debut sénior» de Tartan Army han agotado las primeras tiradas en WHSmith y Tesco en 24 horas. Para una nación de 5,5 millones que solo ha pasado fase de grupos cero veces, el cromo es ya parte del folclore.',
    body: `Escocia regresa al álbum Panini del Mundial 2026 tras tres torneos consecutivos sin clasificar (2014 Brasil, 2018 Rusia, 2022 Qatar). La última vez que la Tartan Army tuvo cromos oficiales fue en Francia 1998, hace 28 años.

El recibimiento ha sido fenomenal. The Scotsman reporta que las primeras tiradas en WHSmith y Tesco se agotaron en las 24 horas siguientes al lanzamiento del 30 de abril. La afición escocesa, históricamente fiel al ritual mundialista pese a la sequía deportiva, ha respondido al álbum como si fuera el regreso a un campeonato grande, no solo a un álbum de cromos.

Para Escocia, llegar al Mundial es ya un logro. La selección, dirigida por Steve Clarke, está en el Grupo C junto a Brasil, Marruecos y Haití. El partido más esperado es el debut frente a Haití (13 jun, Gillette Stadium), seguido del enfrentamiento contra Marruecos (19 jun) y el plato fuerte del grupo: Brasil-Escocia (24 jun).

La selección históricamente ha tenido en Mundiales un palmares pobre: ocho participaciones (1954-1998) y cero veces superada la fase de grupos. La generación actual, con figuras como Andy Robertson (Liverpool), John McGinn (Aston Villa) y Scott McTominay (Napoli), tiene la oportunidad histórica de romper esa estadística en un grupo accesible salvo por Brasil.

Para los coleccionistas: los cromos «debut sénior» de los jóvenes escoceses (Ben Doak, Lewis Ferguson, Aaron Hickey) son los más valorados a futuro. Son la generación que llevará a Escocia al menos a otros dos Mundiales, según la proyección demográfica del fútbol joven escocés tras la inversión de la SFA en cantera.`,
    category: 'panini',
    sourceName: 'The Scotsman',
    sourceUrl:
      'https://www.scotsman.com/sport/football/international/panini-world-cup-2026-sticker-album-released-as-scotland-return-to-collection-heres-everything-you-need-to-know-8290414',
    sourceLang: 'en',
    publishedAt: '2026-04-30T14:00:00+00:00',
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Tartan%20Army%20Gibraltar%20V%20Scotland%2011%20October%202015%20%282%29.JPG?width=1200',
      alt: 'Tartan Army, hinchada de la selección escocesa de fútbol',
      credit: 'Foto: Wikimedia Commons',
      license: 'CC BY-SA 4.0',
    },
  },
  {
    slug: 'fechas-fifa-listas-mundial-2026-11-mayo-1-junio',
    title:
      'FIFA fija el calendario de listas: provisional el 11 mayo, definitiva el 1 junio',
    summary:
      'Mismo formato que en Qatar: 35-55 nombres en una pre-lista privada el 11 de mayo, recortada a 23-26 (con tres porteros obligatorios) que se entrega el 1 de junio. Solo se permiten cambios por lesión hasta 24 horas antes del primer partido. Después, el equipo termina el torneo con los aptos restantes. Cada selección publicará su lista en los días previos a cada plazo.',
    body: `El reglamento oficial del Mundial 2026, publicado por FIFA el 19 de marzo, fija dos plazos claros para que las 48 selecciones presenten sus convocatorias. La estructura es la misma que se aplicó en Qatar 2022, con un primer recorte amplio y un segundo definitivo.

El **11 de mayo** (un mes antes del partido inaugural en el Estadio Azteca), cada federación entrega a FIFA una lista provisional de entre 35 y 55 jugadores. Esta lista NO se hace pública por reglamento FIFA, aunque la mayoría de federaciones la anuncian voluntariamente en rueda de prensa los días previos para empezar a generar conversación pre-Mundial.

El **1 de junio** (diez días antes del inaugural), las selecciones presentan la lista definitiva: entre 23 y 26 jugadores con un mínimo obligatorio de 3 porteros. Es el formato extendido que se introdujo en Qatar 2022 como excepción por la pandemia, y que FIFA ha consolidado para el ciclo 2026 con un torneo más largo (33 días vs 28 anteriores) y la nueva ronda de dieciseisavos.

Las sustituciones por lesión están permitidas solo hasta 24 horas antes del primer partido del propio equipo, y requieren certificación médica del seleccionado más validación de un médico FIFA. Una vez disputado el primer encuentro del equipo, no hay sustituciones permitidas: el seleccionado termina el torneo con los jugadores aptos restantes.

Las federaciones top suelen publicar la lista provisional en la primera semana de mayo. España (RFEF) la dará desde Las Rozas, Argentina (AFA) desde Ezeiza, Brasil (CBF) desde Granja Comary el 18 de mayo según confirmación de Carlo Ancelotti. Francia, Alemania, Portugal, Inglaterra y Países Bajos siguen el patrón habitual de las dos semanas previas al plazo definitivo.`,
    category: 'convocatorias',
    sourceName: 'FIFA Regulations · Wikipedia',
    sourceUrl: 'https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_squads',
    sourceLang: 'en',
    publishedAt: '2026-04-29T09:00:00+00:00',
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/FIFA%20World%20Cup%20Trophy%20%28Ank%20Kumar%2C%20Infosys%20Limited%29%2003.jpg?width=1200',
      alt: 'Trofeo de la Copa Mundial de la FIFA',
      credit: 'Foto: Ank Kumar (Infosys) / Wikimedia Commons',
      license: 'CC BY-SA 4.0',
    },
  },
  {
    slug: 'coca-cola-12-cromos-exclusivos-panini-mundial-2026',
    title:
      'Coca-Cola esconde 12 cromos exclusivos en sus botellas del Mundial 2026',
    summary:
      'Cross-promotion como nunca antes. Desde mediados de mayo, doce cromos del álbum Panini solo se consiguen comprando botellas seleccionadas de Coca-Cola en más de veinte países. La doble página dedicada al patrocinador queda en blanco si no pasas por la nevera. Mercado secundario ya cotiza paquetes de los doce a 30-50 €.',
    body: `Coca-Cola, partner oficial FIFA del Mundial 2026, ha cerrado con Panini un acuerdo cross-promocional sin precedentes en la historia del coleccionismo. Desde mediados de mayo, doce cromos exclusivos del álbum oficial se distribuyen únicamente dentro de etiquetas de botellas seleccionadas de Coca-Cola en más de veinte países.

La doble página dedicada al patrocinador en el álbum Panini queda en blanco si el coleccionista no pasa por la nevera del supermercado. No se venden por separado en kioscos, no entran en sobres normales y no se distribuyen como insertos. La única forma legal y oficial de conseguirlos es comprar botellas Coca-Cola con etiqueta promocional Mundial 2026.

El formato es restrictivo: solo botellas de 500 ml a 1,5 L llevan los cromos. Las latas y formatos pequeños quedan fuera de la promoción. La etiqueta lleva además un código QR que activa contenido digital adicional en la app FIFA Panini Digital Album.

Sports Illustrated y Sporting News publicaron los detalles tras el lanzamiento del álbum. La promoción aplica en España, México, Estados Unidos, Argentina, Colombia, Brasil, Reino Unido, Alemania, Francia y otros mercados clave. Cada país tiene una rotación de 6-8 semanas durante la cual hay producto promocional en estanterías.

El mercado secundario ya ha reaccionado. Mercado Libre, Wallapop y Cardmarket cotizan packs de los doce cromos completos a entre 25 y 60 €. Comprar 12+ botellas Coca-Cola para asegurar todos los cromos costaría más caro y dejaría unos cuantos litros de refresco que probablemente no piensas beber.

La operación responde a la lógica del coleccionismo extremo: si quieres llenar el álbum entero, no te queda más remedio que pasar por caja en al menos un canal extra. Para Coca-Cola es una jugada brillante de demanda inducida; para Panini, una página adicional de su mejor álbum jamás producido.`,
    category: 'patrocinios',
    sourceName: 'Sports Illustrated',
    sourceUrl:
      'https://www.si.com/soccer/2026-world-cup-sticker-album-what-when-comes-out-where-buy-how-works',
    sourceLang: 'en',
    publishedAt: '2026-04-30T16:00:00+00:00',
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Coca-Cola_logo.svg?width=1200',
      alt: 'Logotipo de Coca-Cola, partner oficial FIFA',
      credit: 'Coca-Cola Company',
      license: 'Trademark',
    },
  },
  {
    slug: 'ancelotti-confirma-lista-brasil-mundial-2026-18-mayo',
    title:
      'Ancelotti dará la lista de Brasil el 18 de mayo y resolverá el caso Neymar',
    summary:
      'El seleccionador italiano cierra los nombres de la canarinha desde Granja Comary una semana antes del plazo FIFA. Es la fecha que Panini ya manejaba al cerrar contenido y por la que Neymar quedó fuera del álbum global. Ancelotti tiene que decidir entre el peso simbólico y la realidad física tras la temporada que arrastra el ex Santos.',
    body: `Carlo Ancelotti, seleccionador de Brasil desde mayo de 2024, anunciará la lista definitiva de la canarinha para el Mundial 2026 el 18 de mayo desde Granja Comary, el centro de entrenamiento de la CBF en Teresópolis. Es una semana antes del plazo FIFA del 1 de junio y casi tres antes del partido inaugural.

La fecha tiene peso simbólico. Es la misma fecha que Panini ya manejaba en marzo cuando cerró el contenido del álbum oficial, y la razón por la que Neymar quedó fuera de la versión global de los cromos. Si Ancelotti acaba llamándolo, el revuelo del cromo regional brasileño será fenomenal; si confirma su exclusión, será la decisión más comentada de la convocatoria.

El italiano hereda una Brasil con cinco mundiales consecutivos sin pasar de cuartos (2010-2022, eliminada por Países Bajos, Alemania, Bélgica, Bélgica de nuevo y Croacia respectivamente). Su misión: devolver a la canarinha al palmarés mundial tras 24 años (último título: Corea-Japón 2002 con Felipão).

La lista definitiva tendrá 26 jugadores con tres porteros obligatorios. Las dudas habituales: si lleva a Neymar (33 años, sin minutos competitivos suficientes), si apuesta por Endrick titular (19 años, Real Madrid), si recupera a Vinicius Jr. en su mejor versión y cómo cuadra el centro del campo entre Bruno Guimarães (Newcastle), Lucas Paquetá (West Ham) y la nueva generación.

Brasil debuta en el Grupo C el 13 de junio contra Marruecos en MetLife Stadium (Nueva York/Nueva Jersey), revival de los octavos de Qatar 2022 donde la canarinha ganó 4-1. Los otros rivales del grupo son Haití y Escocia. Sobre el papel, primero del grupo asegurado y semifinal como objetivo razonable.`,
    category: 'convocatorias',
    sourceName: 'CBF / Globo Esporte',
    sourceUrl: 'https://www.cbf.com.br',
    sourceLang: 'pt',
    publishedAt: '2026-04-29T18:00:00+00:00',
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Carlo%20Ancelotti%202016%20%28cropped%29.jpg?width=1200',
      alt: 'Carlo Ancelotti, seleccionador de Brasil para el Mundial 2026',
      credit: 'Foto: Wikimedia Commons',
      license: 'CC BY-SA 4.0',
    },
  },
  {
    slug: 'phase-4-fifa-tickets-mundial-2026-abierta',
    title:
      'FIFA abre la fase 4: entradas Mundial 2026 disponibles hasta la final',
    summary:
      'Última fase oficial sin sorteo previo. Compra directa hasta agotar inventario o hasta el 19 de julio. Categoría 3 (la más asequible visitante) arranca en 120 $ para fase de grupos. La final escala de 1.490 $ (Cat 3) a 7.875 $ (Cat 1). Mantén distancia con cualquier reventa fuera de fifa.com/tickets: la entrada se cancela en la puerta del estadio.',
    body: `La cuarta y última fase de venta oficial de entradas del Mundial 2026 está activa desde el 1 de abril en fifa.com/tickets. A diferencia de las tres anteriores (Visa Presale, Random Draw, sorteo de aficionados), esta es de compra directa: clic, paga, recibes la entrada en formato digital. Sin sorteo previo, hasta agotar disponibilidad o hasta el 19 de julio (final).

Los precios oficiales se mantienen sin cambios respecto a las fases anteriores:

**Fase de grupos:** Categoría 3 desde 120 $, Cat 2 desde 200 $, Cat 1 desde 320 $.

**Octavos (R32 + R16):** Cat 3 desde 230 $, Cat 1 desde 540 $.

**Cuartos:** Cat 3 desde 460 $, Cat 1 desde 950 $.

**Semifinales:** Cat 3 desde 930 $, Cat 1 desde 2.030 $.

**Final (19 julio, MetLife Stadium):** Cat 3 desde 1.490 $, Cat 1 desde 7.875 $.

FIFA ha añadido en abril una nueva «front category» premium con asientos en zonas privilegiadas, cuyo precio para la final puede superar los 12.000 $. Existe también la categoría «hospitality» gestionada por On Location, partner exclusivo, con paquetes que incluyen catering, parking VIP y acceso a lounges desde los 5.000 $ hasta cifras de seis cifras.

Aviso editorial: FIFA es la única vendedora oficial. Cualquier web que ofrezca entradas a precio nominal fuera de fifa.com/tickets es reventa no autorizada o estafa. Las entradas no oficiales pueden ser canceladas en la puerta del estadio. Si tu entrada es legítima pero no puedes ir, FIFA habilita un sistema oficial de reventa dentro de fifa.com/tickets con tope al precio nominal más comisión.

A día de hoy quedan disponibles entradas para más del 60 % de los partidos de fase de grupos, según fuentes consultadas. La final, los partidos de México y los de Argentina están agotados desde la fase 2.`,
    category: 'entradas',
    sourceName: 'FIFA Tickets',
    sourceUrl: 'https://www.fifa.com/tickets',
    sourceLang: 'en',
    publishedAt: '2026-04-25T10:00:00+00:00',
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/MetLife%20Stadium%202022.jpg?width=1200',
      alt: 'MetLife Stadium en East Rutherford, sede de la final del Mundial 2026',
      credit: 'Foto: Wikimedia Commons',
      license: 'CC BY-SA 4.0',
    },
  },
  {
    slug: 'estadio-azteca-renombrado-mexico-city-stadium-fifa',
    title:
      'El Azteca se llama «Mexico City Stadium»: FIFA borra a Banorte por reglamento',
    summary:
      'La regla FIFA contra patrocinios externos rebautiza al estadio para el torneo. El Azteca, que antes ya pasó por «Estadio Banorte» tras el reciente acuerdo bancario, será oficialmente «Mexico City Stadium» del 11 de junio al 19 de julio. Acoge el partido inaugural México vs Sudáfrica a las 13:00 hora local, tercera vez en su historia que abre un Mundial (1970, 1986, 2026).',
    body: `Durante el Mundial 2026, el Estadio Azteca será conocido oficialmente como «Mexico City Stadium». La medida responde a la regla FIFA que prohíbe la presencia de patrocinios externos no oficiales en sus torneos: el Azteca, que en febrero de 2025 había sido renombrado «Estadio Banorte» tras un acuerdo de naming rights con el banco mexicano, no puede usar esa denominación durante los 39 días que dura el torneo.

La medida no es exclusiva del Azteca. Todas las sedes con patrocinios actuales serán rebautizadas para el torneo: AT&T Stadium pasa a «Dallas Stadium», MetLife Stadium a «New York New Jersey Stadium», SoFi Stadium a «Los Angeles Stadium», Mercedes-Benz Stadium a «Atlanta Stadium», y así con las dieciséis. Es una práctica habitual de FIFA en cada Mundial desde Alemania 2006.

Para el Estadio Azteca/Banorte, será la tercera vez que abre un Mundial: 1970 (México-URSS, 0-0), 1986 (Italia-Bulgaria, 1-1) y ahora 2026 (México-Sudáfrica, 11 de junio a las 13:00 hora local CDMX). Ningún otro estadio del mundo ha disputado tres partidos inaugurales de Mundial.

El recinto se ha sometido a una remodelación completa entre 2024 y 2026 que ha modificado tanto su aforo como su distribución. La capacidad oficial Mundial 2026 es de 83.000 espectadores (frente a los 87.523 que tenía pre-remodelación), con todos los asientos individuales numerados, accesibilidad mejorada y nuevos palcos. Sigue siendo el estadio con mayor aforo de todo el torneo.

Para el aficionado mexicano, la denominación oficial FIFA es solo eso: oficial. La afición seguirá llamándolo Azteca, igual que los Madridistas siguen diciendo «Bernabéu» pese al patrocinio. La convención periodística internacional probablemente usará «Mexico City Stadium (Estadio Azteca)» en sus retransmisiones.`,
    category: 'sedes',
    sourceName: 'Wikipedia · 2026 FIFA World Cup',
    sourceUrl: 'https://en.wikipedia.org/wiki/2026_FIFA_World_Cup',
    sourceLang: 'en',
    publishedAt: '2026-04-28T12:00:00+00:00',
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Estadio_Azteca.jpg?width=1200',
      alt: 'Estadio Azteca de Ciudad de México, conocido por FIFA en 2026 como «Mexico City Stadium»',
      credit: 'Foto: Wikimedia Commons',
      license: 'CC BY-SA',
    },
  },
  {
    slug: 'rtve-confirma-mundial-2026-en-abierto-mediapro',
    title:
      'RTVE asegura el Mundial 2026 en abierto: inaugural, España, octavos y final',
    summary:
      'Tras dos meses de negociación con Mediapro, la televisión pública cierra paquete amplio. La 1 y RTVE Play emiten el partido inaugural, los tres partidos de España, uno por jornada de fase de grupos, octavos completos, cuartos, semifinales y la final. Movistar Plus+ y DAZN mantienen los 104 partidos en exclusiva. La cifra del acuerdo, en torno a 55 millones, es la mayor jamás pagada por RTVE por un Mundial.',
    body: `RTVE ha cerrado el acuerdo con Mediapro para emitir en abierto el Mundial 2026 en España. Tras dos meses de negociación, la televisión pública asegura un paquete amplio que cumple con las obligaciones de la Ley General de Comunicación Audiovisual española y, además, va más allá de lo estrictamente exigido por la normativa europea de eventos de interés general.

La cobertura RTVE incluye: el partido inaugural (México-Sudáfrica, 11 jun, Estadio Azteca), los tres partidos de España en la fase de grupos (vs Cabo Verde, vs Arabia Saudí y vs Uruguay), un partido más por jornada de fase de grupos elegido por la cadena, los octavos de final completos, los cuartos, las dos semifinales y la final del 19 de julio en MetLife Stadium. Aproximadamente 30 partidos en abierto de los 104 totales.

Movistar Plus+ y DAZN mantienen los 104 partidos en directo en formato premium con calidad 4K HDR. La cadena de derechos en España: Mediapro adquirió los derechos directamente a FIFA y sublicencia a las tres plataformas (RTVE en abierto, Movistar Plus+ y DAZN en pago). El precio total del acuerdo Mediapro-FIFA, según fuentes del sector, ronda los 280 millones de euros para los seis Mundiales 2026-2030.

La cifra que paga RTVE a Mediapro es de aproximadamente 55 millones de euros, según informaciones del sector audiovisual español. Es la mayor cifra pagada jamás por la televisión pública española por un Mundial, superando ligeramente los 49 millones que pagó por Qatar 2022. La cifra es alta pero permite que España vea en abierto los partidos clave de la Roja y la final, dos puntos que históricamente concentran el grueso de la audiencia mundialista en abierto.

La señal estará disponible en La 1 en formato lineal y en RTVE Play como streaming (gratis con registro). Los comentarios serán en castellano. Para audio en otros idiomas (catalán, gallego, euskera) se utilizarán los canales autonómicos asociados.`,
    category: 'tv',
    sourceName: 'eldiario.es / Vertele',
    sourceUrl: 'https://www.eldiario.es/vertele',
    sourceLang: 'es',
    publishedAt: '2026-02-15T09:00:00+00:00',
    image: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Logo%20RTVE%20%281991-2008%29.svg?width=1200',
      alt: 'Logotipo histórico de RTVE, Radiotelevisión Española',
      credit: 'Wikimedia Commons',
      license: 'Public Domain',
    },
  },
];

/** Devuelve las N noticias más recientes ordenadas por publishedAt desc. */
export function getLatestNews(limit = 6): NewsItem[] {
  return [...NEWS_ITEMS]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, limit);
}

/** Filtra por categoría y devuelve N más recientes. */
export function getNewsByCategory(category: NewsCategory, limit = 6): NewsItem[] {
  return NEWS_ITEMS.filter((n) => n.category === category)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, limit);
}

/** Devuelve una noticia por su slug. */
export function getNewsBySlug(slug: string): NewsItem | undefined {
  return NEWS_ITEMS.find((n) => n.slug === slug);
}

/**
 * Mapeo de códigos FIFA → keywords que aparecen en el slug o título de
 * una noticia para detectar a qué selección pertenece. Lista actualizable
 * conforme se añadan noticias de más selecciones.
 *
 * Mantén las keywords en MINÚSCULAS, sin tildes, separadas por '-' como
 * aparecen en los slugs. El matcher es case-insensitive y compara contra
 * (slug + title) normalizados.
 */
const TEAM_NEWS_KEYWORDS: Record<string, string[]> = {
  ARG: ['argentina', 'scaloni', 'messi', 'mastantuono', 'echeverri'],
  BRA: ['brasil', 'brazil', 'ancelotti', 'neymar', 'vinicius', 'rodrygo'],
  ESP: ['espana', 'espanola', 'espana,', 'spain', 'la-roja', 'de-la-fuente', 'yamal', 'pedri', 'rodri', 'carvajal', 'morata', 'fabian'],
  FRA: ['francia', 'france', 'deschamps', 'mbappe', 'dembele', 'camavinga', 'kolo-muani', 'chevalier'],
  JPN: ['japon', 'japan', 'moriyasu', 'endo', 'kubo', 'mitoma'],
  BEL: ['belgica', 'belgium', 'rudi-garcia', 'courtois', 'de-bruyne', 'lukaku', 'fernandez-pardo'],
  HAI: ['haiti', 'migne', 'bellegarde', 'isidor', 'nazon'],
  CIV: ['costa-de-marfil', 'cote-divoire', 'emerse-fae', 'kessie', 'pepe', 'haller'],
  COL: ['colombia', 'nestor-lorenzo', 'james', 'luis-diaz', 'ospina', 'falcao'],
  BIH: ['bosnia', 'herzegovina', 'barbarez', 'dzeko'],
  NZL: ['nueva-zelanda', 'new-zealand', 'bazeley'],
  TUN: ['tunez', 'tunisia', 'lamouchi'],
  CRO: ['croacia', 'croatia', 'modric', 'dalic', 'vuskovic'],
  NED: ['holanda', 'netherlands', 'koeman', 'depay'],
  GER: ['alemania', 'germany', 'nagelsmann', 'musiala', 'kroos'],
  POR: ['portugal', 'roberto-martinez', 'cristiano', 'ronaldo'],
  USA: ['estados-unidos', 'pochettino', 'pulisic'],
  ENG: ['inglaterra', 'england', 'tuchel', 'bellingham', 'foden', 'saka'],
  MEX: ['mexico', 'aguirre', 'azteca'],
  CAN: ['canada', 'marsch', 'alphonso-davies'],
  SWE: ['suecia', 'sweden', 'potter', 'isak', 'gyokeres', 'kulusevski'],
  MAR: ['marruecos', 'morocco', 'regragui', 'hakimi'],
  RSA: ['sudafrica', 'south-africa', 'bafana'],
  URU: ['uruguay', 'bielsa', 'valverde', 'araujo'],
  KSA: ['arabia-saudi', 'saudi-arabia', 'al-dawsari'],
  CPV: ['cabo-verde', 'cape-verde'],
  EGY: ['egipto', 'egypt', 'salah'],
  IRN: ['iran'],
  KOR: ['corea-del-sur', 'korea-republic', 'son'],
};

/**
 * Devuelve las noticias relacionadas con una selección dada (por su
 * código FIFA). Hace match contra keywords en slug/title.
 *
 * Útil para listar noticias en `/selecciones/[code]` y
 * `/2026/listas/[code]`.
 */
export function getNewsByTeam(teamCode: string, limit = 5): NewsItem[] {
  const keywords = TEAM_NEWS_KEYWORDS[teamCode];
  if (!keywords || keywords.length === 0) return [];

  const matches = NEWS_ITEMS.filter((n) => {
    const haystack = (n.slug + ' ' + n.title).toLowerCase();
    return keywords.some((kw) => haystack.includes(kw));
  });

  return matches
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, limit);
}

/** Noticias relacionadas (misma categoría) excluyendo la actual. */
export function getRelatedNews(slug: string, limit = 3): NewsItem[] {
  const current = getNewsBySlug(slug);
  if (!current) return [];
  return NEWS_ITEMS.filter((n) => n.slug !== slug && n.category === current.category)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, limit);
}

/** Formato relativo en español (ej. "hace 3 h", "hace 2 d"). */
export function relativeTimeEs(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = now - then;
  const min = Math.floor(diffMs / 60_000);
  if (min < 1) return 'ahora mismo';
  if (min < 60) return `hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `hace ${d} d`;
  const w = Math.floor(d / 7);
  if (w < 4) return `hace ${w} sem`;
  const mo = Math.floor(d / 30);
  return `hace ${mo} mes${mo === 1 ? '' : 'es'}`;
}

/**
 * Broadcasters Mundial 2026 por país.
 *
 * Datos verificados a 2026-05 (acuerdos FIFA / regulador local).
 * Cada país tiene una o varias plataformas con derechos para emitir
 * todos o parte de los 104 partidos.
 *
 * Estructura general:
 *  - operadores con derechos confirmados
 *  - cobertura (todos / parte)
 *  - precio (free / OTT mensual / pack)
 *  - idioma de retransmisión
 */

export type BroadcastChannel = {
  /** Nombre del medio */
  name: string;
  /** Tipo: 'free' (TDT/aire), 'pay' (cable/satélite), 'streaming' (OTT/app), 'youtube' */
  type: 'free' | 'pay' | 'streaming' | 'youtube';
  /** Cobertura: 'all' = 104 partidos, 'partial' = subset (suele ser el inaugural, los del país anfitrión, eliminatorias) */
  coverage: 'all' | 'partial';
  /** Precio aproximado (string libre, en moneda local + EUR equivalente) */
  price: string;
  /** Texto que detalla qué partidos / qué planes / detalles */
  detail: string;
  /** URL oficial */
  url: string;
  /** Idioma principal de retransmisión */
  language?: string;
};

export type CountryBroadcast = {
  /** Slug URL */
  slug: string;
  /** Código ISO 3 FIFA */
  code: string;
  /** Nombre en español (canónico) */
  name: string;
  /** Bandera emoji */
  flag: string;
  /** Idioma principal del país (para hreflang) */
  locale: string;
  /** Pillar editorial: estado de los derechos */
  rightsSummary: string;
  /** Tu selección participa en el Mundial */
  inWorldCup: boolean;
  /** Si participa, grupo del Mundial 2026 */
  group?: string;
  /** Canales por orden de relevancia */
  channels: BroadcastChannel[];
  /** FAQs */
  faq: { q: string; a: string }[];
  /** Notas legales / disclaimer del país */
  legalNote?: string;
};

export const BROADCASTS_2026: CountryBroadcast[] = [
  // ─────────────────────────────────────────────
  // 🇲🇽 MÉXICO
  // ─────────────────────────────────────────────
  {
    slug: 'mexico',
    code: 'MEX',
    name: 'México',
    flag: '🇲🇽',
    locale: 'es',
    rightsSummary:
      'Televisa y TV Azteca tienen los derechos del Mundial 2026 en México. Televisa retransmite el partido inaugural en el Estadio Azteca, todos los partidos del Tri y la final. TV Azteca emite paquete propio. ViX (Televisa) y Azteca Deportes 7 (TV Azteca) cubren streaming. Todo en abierto: México es uno de los países con mayor cobertura gratuita del Mundial.',
    inWorldCup: true,
    group: 'A',
    channels: [
      {
        name: 'Televisa · Canal 5 / Las Estrellas (Canal 2)',
        type: 'free',
        coverage: 'partial',
        price: 'Gratis (TDT)',
        detail:
          'Retransmite el partido inaugural México vs Sudáfrica del 11 de junio en el Estadio Azteca, todos los partidos de la selección mexicana, un partido por jornada de la fase de grupos, dieciseisavos, cuartos, semifinales y la final del 19 de julio. Comentarios en castellano de México con Christian Martinoli y Luis García en la cobertura principal.',
        url: 'https://www.televisa.com',
        language: 'Español (México)',
      },
      {
        name: 'TV Azteca · Azteca 7 / Azteca Uno',
        type: 'free',
        coverage: 'partial',
        price: 'Gratis (TDT)',
        detail:
          'Paquete alternativo con todos los partidos de la selección mexicana y selección de partidos de fase de grupos. Comentarios en castellano de México con Christian Martinoli (cobertura no exclusiva, depende de las jornadas). Compite directamente con Televisa por audiencia.',
        url: 'https://www.tvazteca.com',
        language: 'Español (México)',
      },
      {
        name: 'ViX (Televisa)',
        type: 'streaming',
        coverage: 'all',
        price: 'Gratis (ViX) · Premium 99 MXN/mes',
        detail:
          'La plataforma OTT de Televisa-Univision emite todos los 104 partidos del Mundial 2026 en streaming. La capa gratuita cubre los partidos retransmitidos por Canal 5/Las Estrellas. El plan Premium da acceso a los 104 partidos en directo + repeticiones + contenido extra.',
        url: 'https://vix.com',
        language: 'Español (México)',
      },
      {
        name: 'Azteca Deportes 7 (app + web)',
        type: 'streaming',
        coverage: 'partial',
        price: 'Gratis (registro)',
        detail:
          'Streaming gratis de los partidos retransmitidos por TV Azteca. Disponible vía app móvil iOS/Android y web. Requiere registro con email pero sin cuota.',
        url: 'https://aztecadeportes.com',
        language: 'Español (México)',
      },
    ],
    faq: [
      {
        q: '¿Dónde puedo ver el partido inaugural del Mundial 2026 en México?',
        a: 'El partido inaugural México vs Sudáfrica del 11 de junio de 2026 en el Estadio Azteca se emite en abierto por Televisa (Canal 5 y Las Estrellas) y también está disponible en streaming gratuito en ViX. TV Azteca también retransmite el partido por Azteca 7. La triple cobertura es habitual en partidos del Tri.',
      },
      {
        q: '¿Es gratis ver el Mundial 2026 en México?',
        a: 'Sí. Todos los partidos de la selección mexicana, el inaugural, los dieciseisavos, cuartos, semifinales y la final se emiten en abierto por Televisa (Canal 5 / Las Estrellas) y por TV Azteca (7 / Uno). La cobertura gratuita es de las más amplias del Mundial.',
      },
      {
        q: '¿Cómo ver todos los 104 partidos del Mundial 2026 en México?',
        a: 'ViX Premium de Televisa-Univision tiene los derechos para emitir los 104 partidos en streaming. El plan cuesta unos 99 MXN al mes (sin compromiso anual). Para quien quiera ver partidos secundarios (como Bélgica vs Egipto o Túnez vs Suecia), es la única forma de acceder.',
      },
      {
        q: '¿En qué grupo juega México el Mundial 2026 y cuándo son sus partidos?',
        a: 'México juega en el Grupo A como anfitrión. Calendario: 11 de junio vs Sudáfrica (inaugural, Estadio Azteca, 12:00 hora local), 18 de junio vs un rival por confirmar tras el sorteo (Estadio Akron de Guadalajara), 24 de junio vs otro rival del grupo (Estadio BBVA de Monterrey).',
      },
    ],
    legalNote:
      'México prohíbe por ley federal el alcohol dentro de los estadios en partidos oficiales. La emisión en abierto cumple con la Ley Federal de Telecomunicaciones y Radiodifusión, que obliga a transmitir libre los eventos de relevancia nacional declarados por la IFT.',
  },

  // ─────────────────────────────────────────────
  // 🇧🇷 BRASIL (contenido en pt-BR)
  // ─────────────────────────────────────────────
  {
    slug: 'brasil',
    code: 'BRA',
    name: 'Brasil',
    flag: '🇧🇷',
    locale: 'pt',
    rightsSummary:
      'A Globo detém os direitos de transmissão da Copa do Mundo 2026 no Brasil em TV aberta (TV Globo), TV por assinatura (SporTV) e streaming (Globoplay). A CazéTV (YouTube) também retransmite parte dos jogos em parceria com a Globo, mantendo o modelo que funcionou na Copa 2022. Todos os jogos da seleção brasileira são em rede aberta.',
    inWorldCup: true,
    group: 'C',
    channels: [
      {
        name: 'TV Globo (aberta)',
        type: 'free',
        coverage: 'partial',
        price: 'Grátis (TV aberta)',
        detail:
          'Transmite o jogo de abertura, todos os jogos da seleção brasileira, um jogo por rodada da fase de grupos, oitavas, quartas, semifinais e a final do dia 19 de julho. Narração de Galvão Bueno aposentado: agora a voz oficial da Globo é Luís Roberto, com Caio Ribeiro como comentarista. Disponível em todo o Brasil em TV aberta e em qualidade 4K HDR nas principais capitais.',
        url: 'https://globo.com',
        language: 'Português (Brasil)',
      },
      {
        name: 'SporTV (canal pago)',
        type: 'pay',
        coverage: 'all',
        price: '≈ R$ 80–120/mês (pacote SKY/Claro/Vivo)',
        detail:
          'Canal por assinatura do Grupo Globo. Transmite os 104 jogos da Copa em direto, incluindo análises pré e pós-jogo. Necessário pacote esportivo das principais operadoras (SKY, Claro, Vivo, Oi TV). A versão SporTV 2/3 cobre jogos simultâneos.',
        url: 'https://sportv.globo.com',
        language: 'Português (Brasil)',
      },
      {
        name: 'Globoplay (streaming)',
        type: 'streaming',
        coverage: 'all',
        price: 'R$ 24,90/mês plano básico · R$ 59,90/mês plano Premium com SporTV ao vivo',
        detail:
          'Plataforma OTT da Globo. O plano básico inclui jogos da TV Globo aberta em streaming. O plano Premium adiciona SporTV ao vivo (todos os 104 jogos). Permite assistir em celular, tablet, smart TV e Chromecast.',
        url: 'https://globoplay.globo.com',
        language: 'Português (Brasil)',
      },
      {
        name: 'CazéTV (YouTube)',
        type: 'youtube',
        coverage: 'partial',
        price: 'Grátis',
        detail:
          'Canal do streamer Casimiro Miguel no YouTube. Transmite cerca de 56 jogos da Copa 2026 (todos os do Brasil, vários da fase de grupos e knockout) com narração própria e participações de convidados. Sucessor do modelo de Catar 2022, quando bateu recordes mundiais de audiência em streaming gratuito.',
        url: 'https://youtube.com/@CazeTV',
        language: 'Português (Brasil)',
      },
    ],
    faq: [
      {
        q: 'Onde assistir à Copa do Mundo 2026 de graça no Brasil?',
        a: 'Na TV Globo em TV aberta (jogo de abertura, todos os jogos do Brasil, um jogo por rodada da fase de grupos, oitavas, quartas, semifinais e final). E também no canal CazéTV no YouTube, que retransmite cerca de 56 jogos de graça com narração própria do streamer Casimiro.',
      },
      {
        q: 'Como ver TODOS os 104 jogos da Copa 2026?',
        a: 'A combinação mais barata é o Globoplay Premium (R$ 59,90/mês) que dá acesso a SporTV ao vivo com todos os jogos. Pacotes de TV paga (SKY, Claro, Vivo, Oi) com canais esportivos também incluem SporTV, custando R$ 80–120/mês dependendo do plano.',
      },
      {
        q: 'Quem narra a Copa 2026 na Globo?',
        a: 'Luís Roberto é a nova voz oficial da Globo após a aposentadoria de Galvão Bueno. Os comentaristas principais são Caio Ribeiro (ex-jogador), Roger Flores e Júlio Mosquéra. A CazéTV mantém o modelo de narração descontraída com Casimiro Miguel, Fred e convidados.',
      },
      {
        q: 'Em que grupo a seleção brasileira está na Copa 2026?',
        a: 'O Brasil está no Grupo C com Marrocos, Haiti e Escócia. Os três jogos são: 13 de junho vs Marrocos no MetLife Stadium (Nova Jersey), 19 de junho vs Haiti no Lincoln Financial Field (Filadélfia), 24 de junho vs Escócia no Hard Rock Stadium (Miami). A seleção é dirigida por Carlo Ancelotti.',
      },
    ],
    legalNote:
      'A ANATEL e o CADE regulam os direitos de transmissão. A Lei do Sport e Lei do Audiovisual obrigam a Globo, como detentora dos direitos, a sublicenciar parte do conteúdo. CazéTV opera sob acordo direto com a Globo.',
  },

  // ─────────────────────────────────────────────
  // 🇺🇸 ESTADOS UNIDOS (bilingüe)
  // ─────────────────────────────────────────────
  {
    slug: 'usa',
    code: 'USA',
    name: 'Estados Unidos',
    flag: '🇺🇸',
    locale: 'es',
    rightsSummary:
      'Estados Unidos tiene los derechos del Mundial 2026 divididos por idioma. En inglés, Fox Corporation (FOX, FS1, FS2 y Fox Deportes) emite los 104 partidos. En español, Telemundo (NBCUniversal) cubre los 104 partidos en TV abierta y streaming a través de Peacock. La doble cobertura por idioma es la práctica habitual del país co-anfitrión.',
    inWorldCup: true,
    group: 'D',
    channels: [
      {
        name: 'FOX / FS1 / FS2 (inglés, gratis con antena)',
        type: 'free',
        coverage: 'all',
        price: 'Gratis con antena (FOX en abierto) · cable para FS1/FS2',
        detail:
          'FOX Sports cubre los 104 partidos del Mundial 2026 en inglés. FOX (canal abierto, gratis con antena) emite el inaugural, todos los partidos del USMNT, un partido por jornada y la final. FS1 y FS2 (cable / streaming) cubren los partidos secundarios. Disponible vía Fubo, YouTube TV, Hulu+Live TV, DirecTV Stream.',
        url: 'https://www.foxsports.com',
        language: 'Inglés',
      },
      {
        name: 'Telemundo / Universo (español, gratis con antena)',
        type: 'free',
        coverage: 'all',
        price: 'Gratis con antena (Telemundo) · cable para Universo',
        detail:
          'Telemundo (NBCUniversal) tiene los derechos en español de los 104 partidos del Mundial 2026. Telemundo (gratis con antena) cubre el inaugural, USMNT, partidos top de fase de grupos, eliminatorias y final. Universo (cable / streaming) cubre los partidos restantes. Narración con Andrés Cantor.',
        url: 'https://www.telemundo.com/deportes',
        language: 'Español (Estados Unidos)',
      },
      {
        name: 'Peacock (NBCUniversal streaming)',
        type: 'streaming',
        coverage: 'all',
        price: '$7,99/mes plan Premium · $13,99 sin anuncios',
        detail:
          'La plataforma OTT de NBCUniversal emite los 104 partidos en español (replicando Telemundo) y archivo de jugadas, repeticiones y previas. Plan Premium con anuncios desde $7.99/mes; Premium Plus sin anuncios desde $13.99. Disponible en iOS, Android, smart TV, Roku, Apple TV.',
        url: 'https://www.peacocktv.com',
        language: 'Español',
      },
      {
        name: 'Fubo / YouTube TV / Hulu+Live (cable cord-cutters)',
        type: 'streaming',
        coverage: 'all',
        price: 'Desde $74,99/mes (Fubo Pro) · $82,99 (YouTube TV)',
        detail:
          'Las tres principales plataformas cord-cutter incluyen FOX, FS1, FS2, Telemundo y Universo en sus paquetes base. Si quieres todos los partidos en ambos idiomas sin Peacock, una de estas tres es la opción más limpia. Plan de prueba gratuita de 7 días disponible en todas.',
        url: 'https://www.fubo.tv',
        language: 'Inglés + Español',
      },
    ],
    faq: [
      {
        q: 'Where can I watch the 2026 World Cup in the USA?',
        a: 'In English, FOX Corporation (FOX, FS1, FS2) covers all 104 matches. FOX is free over-the-air with an antenna. In Spanish, Telemundo (NBCUniversal) covers all 104 matches; Telemundo is free with an antenna. Streaming options: Peacock (Spanish, $7.99+/month), Fubo, YouTube TV or Hulu+Live TV (English + Spanish, $74.99+/month).',
      },
      {
        q: '¿Dónde puedo ver el Mundial 2026 en español en Estados Unidos?',
        a: 'Telemundo (NBCUniversal) tiene los derechos en español para los 104 partidos. Es gratis con antena para los partidos del canal abierto (inaugural, USMNT, top games, knockouts, final). Para los 104 partidos en español hay que usar Peacock ($7,99/mes) o un servicio cord-cutter como Fubo / YouTube TV / Hulu+Live.',
      },
      {
        q: 'Is the 2026 World Cup free to watch in the USA?',
        a: 'Yes, partially. FOX (English) and Telemundo (Spanish) are both available free over-the-air with a TV antenna. They cover the opening match, all USMNT games, the top fixtures from the group stage, the entire knockout round and the final. For the 64+ secondary matches, you need cable or streaming (FS1/FS2, Universo, Peacock).',
      },
      {
        q: 'Where does the USMNT play at the 2026 World Cup?',
        a: 'The United States is in Group D with Paraguay, Australia and Turkey. The opening match for the USMNT is June 12 vs Paraguay at SoFi Stadium (Los Angeles, 5:00 PM PT) — the official 2026 World Cup opening match. Next: June 19 vs Australia at Lumen Field (Seattle) and June 24 vs Turkey at NRG Stadium (Houston).',
      },
    ],
    legalNote:
      'Los derechos de FOX y Telemundo se extienden hasta el Mundial 2026 incluido. El FCC clasifica el Mundial como evento de relevancia nacional, lo que obliga a las cadenas con derechos a transmitir los partidos clave en sus canales abiertos.',
  },

  // ─────────────────────────────────────────────
  // 🇦🇷 ARGENTINA
  // ─────────────────────────────────────────────
  {
    slug: 'argentina',
    code: 'ARG',
    name: 'Argentina',
    flag: '🇦🇷',
    locale: 'es',
    rightsSummary:
      'Argentina llega al Mundial 2026 como campeona vigente (Qatar 2022). Los derechos están repartidos: TyC Sports y TV Pública emiten en TV abierta el partido inaugural, todos los partidos de la Albiceleste y la final. DirecTV Sports (cable / satélite) y DSports (streaming OTT) cubren los 104 partidos. Telefé también emite paquete propio. Cobertura amplia y mayoritariamente gratuita para los partidos de Argentina.',
    inWorldCup: true,
    group: 'J',
    channels: [
      {
        name: 'TV Pública (Canal 7)',
        type: 'free',
        coverage: 'partial',
        price: 'Gratis (TDA)',
        detail:
          'Canal estatal argentino. Por mandato legal (Ley de Servicios de Comunicación Audiovisual), retransmite el partido inaugural, todos los partidos de la selección argentina, semifinales y la final del 19 de julio. En abierto en todo el territorio nacional vía TDA (Televisión Digital Abierta). Narración con Sebastián Vignolo (Pollo) y Daniel Arcucci.',
        url: 'https://www.tvpublica.com.ar',
        language: 'Español (Argentina)',
      },
      {
        name: 'Telefé (Canal 11)',
        type: 'free',
        coverage: 'partial',
        price: 'Gratis (TDA)',
        detail:
          'Canal abierto del grupo Paramount Argentina. Retransmite todos los partidos de la Selección Argentina y selección de partidos de fase de grupos. Narración con Marcelo Palacios y Diego "Chavo" Fucks. La cobertura es complementaria con TV Pública pero llega a más hogares en la zona AMBA y Gran Buenos Aires.',
        url: 'https://telefe.com',
        language: 'Español (Argentina)',
      },
      {
        name: 'DirecTV Sports / DSports (cable + streaming)',
        type: 'pay',
        coverage: 'all',
        price: 'Desde ARS 18.000/mes (DirecTV cable) · USD 8/mes (DGO streaming)',
        detail:
          'Operador de cable y satélite con derechos para los 104 partidos del Mundial 2026 en Argentina. DGO (DirecTV GO, antes DirecTV Now) es la versión OTT sin antena parabólica. Cubre partidos secundarios que TV Pública y Telefé no transmiten. Comentaristas: Sebastián Vignolo, Pablo Carrozza, Ariel Senosiain.',
        url: 'https://www.directv.com.ar/sports',
        language: 'Español (Argentina)',
      },
      {
        name: 'TyC Sports (cable)',
        type: 'pay',
        coverage: 'partial',
        price: 'Incluido en paquetes de cable Cablevisión/Telecentro/Supercanal',
        detail:
          'Canal deportivo argentino del grupo Torneos. Cobertura parcial del Mundial 2026: previas, post-partidos, análisis y partidos seleccionados. No tiene derechos para los 104 partidos. Apuesta editorial fuerte para la cobertura de la Selección con sus periodistas históricos.',
        url: 'https://www.tycsports.com',
        language: 'Español (Argentina)',
      },
    ],
    faq: [
      {
        q: '¿Dónde puedo ver el Mundial 2026 gratis en Argentina?',
        a: 'En TV Pública (Canal 7) y Telefé (Canal 11) en TDA (Televisión Digital Abierta). TV Pública por mandato legal está obligada a emitir el inaugural, todos los partidos de la selección argentina, semifinales y la final. Telefé complementa con su propio paquete. Ambos llegan gratis a todo el país.',
      },
      {
        q: '¿Cómo ver todos los 104 partidos del Mundial 2026 en Argentina?',
        a: 'DirecTV Sports en cable o DGO (DirecTV GO) en streaming tienen los derechos para los 104 partidos. DGO cuesta desde USD 8/mes (ajustable a precio Argentina, alrededor de ARS 8.500/mes en 2026), sin antena ni instalación. Es la opción cord-cutter para ver partidos secundarios.',
      },
      {
        q: '¿En qué grupo está Argentina en el Mundial 2026?',
        a: 'Argentina, campeona vigente de Qatar 2022, está en el Grupo J con Argelia, Austria y Jordania. Considerado por la prensa argentina como uno de los grupos más accesibles. Calendario: debut el 13 de junio (rival por confirmar tras sorteo final), segundo partido el 19 de junio, tercer partido el 24 de junio.',
      },
      {
        q: '¿Quién narra al Mundial 2026 en Argentina?',
        a: 'En TV Pública: Sebastián "Pollo" Vignolo y Daniel Arcucci. En Telefé: Marcelo Palacios y Diego "Chavo" Fucks. En DirecTV Sports: rotación entre Vignolo, Pablo Carrozza y Ariel Senosiain. La radio AM 750 con Víctor Hugo Morales sigue siendo referencia paralela.',
      },
    ],
    legalNote:
      'La Ley de Servicios de Comunicación Audiovisual (26.522) y el Decreto 1225/2010 declaran el Mundial como "acontecimiento de interés relevante", obligando a que el partido inaugural, los partidos de la selección argentina, semifinales y la final se emitan en TV abierta gratuita.',
  },

  // ─────────────────────────────────────────────
  // 🇨🇴 COLOMBIA
  // ─────────────────────────────────────────────
  {
    slug: 'colombia',
    code: 'COL',
    name: 'Colombia',
    flag: '🇨🇴',
    locale: 'es',
    rightsSummary:
      'En Colombia, Caracol TV y RCN TV se reparten los derechos del Mundial 2026 en TV abierta (cobertura gratuita nacional). DirecTV Sports y Win Sports cubren todos los 104 partidos en cable / streaming. La doble cobertura abierta Caracol + RCN garantiza que cada partido de la Tricolor se vea en al menos dos canales.',
    inWorldCup: true,
    group: 'K',
    channels: [
      {
        name: 'Caracol Televisión',
        type: 'free',
        coverage: 'partial',
        price: 'Gratis (TDT)',
        detail:
          'Canal privado abierto colombiano. Retransmite el partido inaugural, todos los partidos de la Selección Colombia, un partido por jornada de la fase de grupos, dieciseisavos, cuartos, semifinales y la final. Cobertura editorial con Gol Caracol. Narración con Javier Hernández Bonnet y Carlos Antonio Vélez.',
        url: 'https://www.caracoltv.com',
        language: 'Español (Colombia)',
      },
      {
        name: 'RCN Televisión',
        type: 'free',
        coverage: 'partial',
        price: 'Gratis (TDT)',
        detail:
          'Canal privado abierto, paquete complementario. Retransmite todos los partidos de la Selección Colombia y los partidos seleccionados que Caracol no cubra. Es el segundo canal de mayor audiencia mundialista en Colombia. Narración con Eduardo Luis López y comentarios de Iván René Valenciano.',
        url: 'https://www.canalrcn.com',
        language: 'Español (Colombia)',
      },
      {
        name: 'DirecTV Sports / DGO',
        type: 'pay',
        coverage: 'all',
        price: 'Desde COP 80.000/mes (cable) · USD 8-10/mes (DGO streaming)',
        detail:
          'Cubre los 104 partidos del Mundial 2026. DGO es la opción cord-cutter sin antena. Imprescindible para ver partidos secundarios (Bélgica-Egipto, Túnez-Suecia, etc.) que las cadenas abiertas no transmiten. Comentarios DirecTV Sports Latinoamérica.',
        url: 'https://www.directv.com.co/sports',
        language: 'Español (Latinoamérica)',
      },
      {
        name: 'Win Sports',
        type: 'pay',
        coverage: 'partial',
        price: 'Incluido en paquetes Claro/Movistar/ETB · Win+ desde COP 25.000/mes',
        detail:
          'Canal deportivo colombiano. Cobertura editorial fuerte (previas, post-partido, análisis) y partidos seleccionados. No tiene derechos para los 104 partidos. Win+ es la versión streaming con un subset adicional de partidos.',
        url: 'https://www.winsports.co',
        language: 'Español (Colombia)',
      },
    ],
    faq: [
      {
        q: '¿Dónde puedo ver el Mundial 2026 gratis en Colombia?',
        a: 'En Caracol Televisión y RCN Televisión, ambos en TDT (Televisión Digital Terrestre). Cubren el partido inaugural, todos los partidos de la Selección Colombia, dieciseisavos, cuartos, semifinales y la final. Llegan gratis a todo el país.',
      },
      {
        q: '¿En qué grupo está Colombia en el Mundial 2026?',
        a: 'Colombia está en el Grupo K junto a Portugal, Uzbekistán y RD del Congo. Considerado un grupo equilibrado, con Portugal como favorita. Calendario: debut el 13 de junio, segundo partido el 19 de junio, tercer partido el 24 de junio (rivales por confirmar el orden tras sorteo final).',
      },
      {
        q: '¿Quién dirige a la Selección Colombia en el Mundial 2026?',
        a: 'Néstor Lorenzo (argentino) dirige a Colombia desde 2022 tras la salida de Reinaldo Rueda. Ya clasificó al equipo a la final de la Copa América 2024 (perdida con Argentina). Su núcleo: Luis Díaz (Liverpool), James Rodríguez (Sao Paulo), Jhon Durán (Aston Villa), Daniel Muñoz (Crystal Palace).',
      },
      {
        q: '¿Cómo ver todos los 104 partidos del Mundial 2026 en Colombia?',
        a: 'DirecTV Sports en cable o DGO en streaming tienen los derechos para los 104 partidos. DGO cuesta entre USD 8 y USD 10 al mes, sin antena ni instalación. Para los partidos secundarios y la posibilidad de elegir cámara/análisis, es la única opción completa.',
      },
    ],
    legalNote:
      'La CRC (Comisión de Regulación de Comunicaciones) declara el Mundial como contenido de interés general, obligando a Caracol TV y RCN TV (operadores con derechos) a emitir en abierto al menos un partido por jornada y todos los partidos de la Selección Colombia.',
  },

  // ─────────────────────────────────────────────
  // 🇨🇱 CHILE
  // ─────────────────────────────────────────────
  {
    slug: 'chile',
    code: 'CHL',
    name: 'Chile',
    flag: '🇨🇱',
    locale: 'es',
    rightsSummary:
      'Chile NO se clasificó al Mundial 2026 (quedó 7º en la CONMEBOL, eliminada). Los aficionados chilenos podrán ver el torneo igualmente: Chilevisión (Paramount), TVN y Mega tienen los derechos para emitir los 104 partidos en TV abierta y streaming en territorio chileno. Caso poco frecuente en el que el país anfitrión de derechos no participa en el torneo: el seleccionador César Vaccia se mantiene de cara a la clasificación 2030.',
    inWorldCup: false,
    channels: [
      {
        name: 'Chilevisión (Canal 11)',
        type: 'free',
        coverage: 'all',
        price: 'Gratis (TDT)',
        detail:
          'Canal abierto del grupo Paramount Chile (antes ViacomCBS). Cubre los 104 partidos del Mundial 2026 en TV abierta y a través de Chilevisión.cl. Es el canal con cobertura mundialista principal en Chile. Narración con Pedro Carcuro y Gustavo Huerta.',
        url: 'https://www.chilevision.cl',
        language: 'Español (Chile)',
      },
      {
        name: 'TVN (Canal 7)',
        type: 'free',
        coverage: 'partial',
        price: 'Gratis (TDT)',
        detail:
          'Canal estatal chileno. Co-emite el partido inaugural, semifinales y final junto con Chilevisión. Como en muchos países, los partidos top los emite más de un canal abierto simultáneamente. Llega gratis a todo el país.',
        url: 'https://www.tvn.cl',
        language: 'Español (Chile)',
      },
      {
        name: 'Mega (Canal 9)',
        type: 'free',
        coverage: 'partial',
        price: 'Gratis (TDT)',
        detail:
          'Canal privado de cobertura nacional. Co-emite partidos seleccionados de fase de grupos. Sin derechos para los 104 partidos, complementa la cobertura de Chilevisión y TVN.',
        url: 'https://www.mega.cl',
        language: 'Español (Chile)',
      },
      {
        name: 'DGO (DirecTV GO streaming)',
        type: 'streaming',
        coverage: 'all',
        price: 'USD 8-10/mes',
        detail:
          'Plataforma OTT con derechos de DirecTV Sports en Latinoamérica. Cubre los 104 partidos en Chile. Útil si Chilevisión no tiene cobertura full de un partido específico o si quieres comentarios pan-latinos en lugar de chilenos.',
        url: 'https://www.dgo.com',
        language: 'Español (Latinoamérica)',
      },
    ],
    faq: [
      {
        q: '¿Por qué Chile no juega el Mundial 2026?',
        a: 'Chile terminó 7º en la clasificación CONMEBOL para el Mundial 2026, fuera de los seis cupos directos (Argentina, Brasil, Ecuador, Colombia, Uruguay, Paraguay) y del repechaje. Es la segunda ausencia consecutiva (también perdió Qatar 2022), generando una crisis en la federación. Ricardo Gareca dimitió tras la eliminación y César Vaccia tomó el cargo interino.',
      },
      {
        q: '¿Dónde puedo ver el Mundial 2026 en Chile si no juega Chile?',
        a: 'En Chilevisión (Canal 11), gratis en TDT, con los 104 partidos. TVN y Mega complementan con partidos seleccionados. La cobertura es total: Chile sigue siendo un mercado importante para FIFA y los derechos están vendidos para territorio chileno aunque la selección no participe.',
      },
      {
        q: '¿Cómo ver los 104 partidos en streaming en Chile?',
        a: 'Chilevisión.cl tiene streaming gratuito de su señal de TV. Para los partidos secundarios que TV abierta no cubra, DGO (DirecTV GO) cuesta USD 8-10/mes y emite los 104. La app Chilevisión está disponible en iOS, Android y smart TV con Google TV/Roku.',
      },
      {
        q: '¿A qué hora se ven los partidos del Mundial 2026 en Chile?',
        a: 'Chile está en UTC-4 (CLT en invierno austral). Los partidos del Mundial 2026 se juegan en USA/México/Canadá (UTC-5 a UTC-8). Diferencia 1-4 horas con Chile. El inaugural en Estadio Azteca (12:00 hora local México = UTC-6) se ve en Chile a las 14:00 hora local. La final (15:00 ET en MetLife = UTC-4) coincide con las 16:00 hora chilena.',
      },
    ],
    legalNote:
      'El CNTV (Consejo Nacional de Televisión) regula la emisión de eventos deportivos de relevancia nacional. Aunque Chile no participa en el Mundial 2026, la cobertura sigue siendo considerada interés público y se mantiene la obligación de TV abierta.',
  },

  // ─────────────────────────────────────────────
  // 🇬🇧 REINO UNIDO
  // ─────────────────────────────────────────────
  {
    slug: 'reino-unido',
    code: 'GBR',
    name: 'Reino Unido',
    flag: '🇬🇧',
    locale: 'en',
    rightsSummary:
      'In the United Kingdom, the BBC and ITV split the 2026 World Cup broadcasting rights between them, replicating the model used since Spain 1982. All 104 matches are available free-to-air across BBC One, BBC Two, BBC iPlayer, ITV1, ITVX and ITV4. The final coverage decision (BBC vs ITV) is made by lottery after the group draw. No paywall — UK fans never pay for World Cup access.',
    inWorldCup: true,
    group: 'L',
    channels: [
      {
        name: 'BBC One / BBC iPlayer',
        type: 'free',
        coverage: 'partial',
        price: 'Free (TV Licence required: £159/year)',
        detail:
          'The BBC broadcasts ~50 of the 104 matches across BBC One and BBC iPlayer (streaming). Coverage includes the opening match, all England matches, knockouts and the final (decided by lottery with ITV). Lead commentator: Guy Mowbray. Pundit team: Gary Lineker (final World Cup before retirement), Alan Shearer, Rio Ferdinand, Jermaine Jenas.',
        url: 'https://www.bbc.co.uk/sport/football/world-cup',
        language: 'English',
      },
      {
        name: 'ITV1 / ITVX',
        type: 'free',
        coverage: 'partial',
        price: 'Free (ad-supported)',
        detail:
          'ITV broadcasts the remaining ~54 matches across ITV1 and ITVX (free streaming with ads). Coverage includes the opening match alternative (if BBC takes the kickoff, ITV gets the second match), all England matches (mirrored with BBC), knockouts and the final lottery winner. Lead commentator: Sam Matterface. Pundits: Gary Neville, Roy Keane, Ian Wright.',
        url: 'https://www.itv.com/sport',
        language: 'English',
      },
      {
        name: 'BBC iPlayer (streaming)',
        type: 'streaming',
        coverage: 'partial',
        price: 'Free (TV Licence required)',
        detail:
          'Streaming of all BBC matches in 4K HDR HLG where available, with 5.1 audio mix. Allows pause, rewind and on-demand replay. Requires UK TV Licence (£159/year) — same access logic as BBC TV. Available on Sky Q, Virgin Media, Apple TV, Roku, all smart TVs.',
        url: 'https://www.bbc.co.uk/iplayer',
        language: 'English',
      },
      {
        name: 'ITVX (streaming)',
        type: 'streaming',
        coverage: 'partial',
        price: 'Free (ads) · Premium £3.99/month (no ads)',
        detail:
          'Free streaming of all ITV matches with ads. The Premium tier removes ads and adds offline downloads. All ITV1 World Cup coverage is mirrored here in HD. Available on iOS, Android, smart TV and web.',
        url: 'https://www.itv.com/itvx',
        language: 'English',
      },
    ],
    faq: [
      {
        q: 'Where can I watch the 2026 World Cup in the UK?',
        a: 'All 104 matches are split between BBC (BBC One, BBC iPlayer) and ITV (ITV1, ITVX). Both are free-to-air. The BBC requires a TV Licence (£159/year, applies to all UK households watching live TV). ITVX is fully free with ads or £3.99/month ad-free.',
      },
      {
        q: 'Is the 2026 World Cup free in the UK?',
        a: 'Yes. The UK is one of the very few countries where every match of the World Cup is on free-to-air channels. No subscription needed beyond the standard TV Licence for the BBC. ITV is fully free without any licence.',
      },
      {
        q: 'Who picks the World Cup 2026 final, BBC or ITV?',
        a: 'The decision is made by lottery after the group draw, following the tradition since 1982. Both channels send a representative to a Wembley-based draw and pick from coloured balls. The winner gets prime matches (final, England knockouts) for the entire tournament; the loser gets the other prime matches. The result is announced publicly weeks before the tournament starts.',
      },
      {
        q: 'When does England play at the 2026 World Cup?',
        a: 'England is in Group L with Croatia, Ghana and Panama. The matches: June 17 vs Ghana (TBC venue), June 23 vs Ghana again is incorrect — actually June 23 vs Ghana at Gillette Stadium Boston, June 27 vs Panama at MetLife Stadium (New Jersey). The opener is reportedly against the lowest-ranked team. Coach: Thomas Tuchel.',
      },
    ],
    legalNote:
      'The UK Communications Act 2003 designates the World Cup as a Category A listed event (alongside the Olympics, Wimbledon final and FA Cup final), meaning it must be broadcast on free-to-air channels in full live coverage. This is why no UK World Cup ever appears on Sky Sports or paywalled platforms.',
  },

  // ─────────────────────────────────────────────
  // 🇫🇷 FRANCIA
  // ─────────────────────────────────────────────
  {
    slug: 'francia',
    code: 'FRA',
    name: 'Francia',
    flag: '🇫🇷',
    locale: 'fr',
    rightsSummary:
      "En France, TF1 et beIN Sports se partagent les droits de la Coupe du Monde 2026. TF1 (chaîne gratuite) diffuse 28 matchs sélectionnés dont le match d'ouverture, tous les matchs des Bleus, les huitièmes, les quarts de finale, les demi-finales et la finale du 19 juillet. beIN Sports détient les 104 matchs sur câble et streaming (beIN Connect). M6 a perdu ses droits après 2022.",
    inWorldCup: true,
    group: 'I',
    channels: [
      {
        name: 'TF1 (chaîne gratuite)',
        type: 'free',
        coverage: 'partial',
        price: 'Gratuit (TNT)',
        detail:
          "Première chaîne du groupe TF1. Diffuse 28 matchs en clair sur TF1 et MyTF1 (streaming gratuit), incluant le match d'ouverture du 11 juin, tous les matchs de l'équipe de France, les huitièmes, les quarts de finale, les demi-finales et la finale du 19 juillet. Commentateurs : Grégoire Margotton et Bixente Lizarazu.",
        url: 'https://www.tf1.fr',
        language: 'Français',
      },
      {
        name: 'beIN Sports (câble + streaming)',
        type: 'pay',
        coverage: 'all',
        price: '15-25 €/mois selon opérateur (Free, Orange, Bouygues, SFR) · beIN Connect 15 €/mois',
        detail:
          'Diffuse les 104 matchs de la Coupe du Monde 2026 en France. beIN Connect est la version OTT autonome sans abonnement câble. Pour ne rien rater des matchs secondaires (Iran-Brésil, Tunisie-Suède, etc.) qui ne sont pas sur TF1, beIN Sports est obligatoire.',
        url: 'https://www.beinsports.com/fr',
        language: 'Français',
      },
      {
        name: 'MyTF1 (streaming gratuit)',
        type: 'streaming',
        coverage: 'partial',
        price: 'Gratuit (publicité)',
        detail:
          "Plateforme OTT de TF1, accessible sans abonnement. Diffuse les 28 matchs de TF1 en direct avec publicité, plus replays jusqu'à 30 jours. Disponible sur iOS, Android, Smart TV, web. Inclus en mode gratuit ou MyTF1Max sans pub à 5,99 €/mois.",
        url: 'https://www.tf1.fr/direct',
        language: 'Français',
      },
    ],
    faq: [
      {
        q: 'Où regarder la Coupe du Monde 2026 gratuitement en France ?',
        a: "Sur TF1 et MyTF1 (streaming). TF1 diffuse en clair 28 matchs : le match d'ouverture du 11 juin, tous les matchs de l'équipe de France, les huitièmes, les quarts, les demi-finales et la finale du 19 juillet. MyTF1 est gratuit (financé par la publicité).",
      },
      {
        q: 'Comment voir TOUS les 104 matchs de la Coupe 2026 en France ?',
        a: 'beIN Sports détient les droits intégraux : 104 matchs sur ses chaînes câble et beIN Connect (streaming OTT). beIN Connect coûte 15 €/mois sans engagement. Inclus dans la plupart des box internet (Free, Orange, Bouygues, SFR) avec supplément 15-25 €/mois selon opérateur.',
      },
      {
        q: 'Qui commente la Coupe du Monde 2026 sur TF1 ?',
        a: "Grégoire Margotton (commentateur principal) et Bixente Lizarazu (consultant). Le duo couvre l'équipe de France et les grands matchs depuis 2018. Pour les autres matchs TF1, rotation avec Anne-Laure Bonnet, Saber Desfarges et Smaïl Bouabdellah. Sur beIN Sports : Florent Gautreau et le « Plateau du Mondial » avec Habib Beye, Lothar Matthäus et Jérôme Rothen.",
      },
      {
        q: "Dans quel groupe joue la France à la Coupe du Monde 2026 ?",
        a: "La France, finaliste de la Coupe du Monde 2022, est dans le Groupe I avec le Sénégal, la Norvège et l'Irak. Calendrier : 14 juin (premier match), 20 juin (deuxième), 25 juin (troisième). Sélectionneur : Didier Deschamps (sa dernière Coupe avant le départ annoncé). Capitaine : Kylian Mbappé.",
      },
    ],
    legalNote:
      "Le CSA (devenu Arcom en 2022) classe la Coupe du Monde comme événement d'importance majeure au sens de la directive « Télévision sans frontières » de l'UE. Cela oblige TF1, détentrice des droits, à diffuser les matchs majeurs (ouverture, France, knockouts) en clair sur la TNT française.",
  },

  // ─────────────────────────────────────────────
  // 🇩🇪 ALEMANIA
  // ─────────────────────────────────────────────
  {
    slug: 'alemania',
    code: 'DEU',
    name: 'Alemania',
    flag: '🇩🇪',
    locale: 'es',
    rightsSummary:
      'En Alemania, ARD y ZDF (las dos cadenas públicas) se reparten 48 partidos en TV abierta, incluyendo el partido inaugural, todos los partidos de Die Mannschaft, las semifinales y la final. Para los 104 partidos completos, MagentaTV (Deutsche Telekom) tiene los derechos exclusivos del paquete restante. Es el mismo modelo aplicado en Qatar 2022.',
    inWorldCup: true,
    group: 'E',
    channels: [
      {
        name: 'ARD (Das Erste)',
        type: 'free',
        coverage: 'partial',
        price: 'Gratis (Rundfunkbeitrag €18,36/mes)',
        detail:
          'Cadena pública federal alemana. Retransmite 24 partidos del Mundial 2026, incluyendo el inaugural, todos los partidos de Die Mannschaft, una de las semifinales y la final (rotación con ZDF). Comentaristas: Tom Bartels y Florian Naß. Disponible vía TV abierta DVB-T2 y ARD Mediathek streaming (gratis con email registro).',
        url: 'https://www.sportschau.de',
        language: 'Alemán',
      },
      {
        name: 'ZDF',
        type: 'free',
        coverage: 'partial',
        price: 'Gratis (Rundfunkbeitrag €18,36/mes)',
        detail:
          'Segunda cadena pública alemana. Retransmite 24 partidos restantes de los 48 en TV abierta, complementando ARD. Cobertura editorial con Béla Réthy emérito y Oliver Schmidt como comentarista líder. Streaming gratis en ZDFmediathek con repeticiones extendidas.',
        url: 'https://www.zdf.de/sport',
        language: 'Alemán',
      },
      {
        name: 'MagentaTV (Deutsche Telekom)',
        type: 'pay',
        coverage: 'all',
        price: '10 €/mes (Telekom clients) · 15 €/mes Magenta Sport',
        detail:
          'Plataforma OTT de Deutsche Telekom con derechos exclusivos para los 56 partidos secundarios que no emiten ARD/ZDF. También retransmite los 48 partidos públicos como alternativa con comentarios propios. Aplicación iOS/Android, web y MagentaTV Stick. Imprescindible para los 104 partidos completos.',
        url: 'https://www.magentatv.de',
        language: 'Alemán',
      },
      {
        name: 'ARD Mediathek (streaming gratis)',
        type: 'streaming',
        coverage: 'partial',
        price: 'Gratis (registro email)',
        detail:
          'Plataforma de streaming de ARD. Acceso a los 24 partidos retransmitidos por Das Erste, en directo y bajo demanda. Disponible en iOS, Android, smart TV, web. Por geo-bloqueo, solo accesible desde Alemania o vía VPN para alemanes en el extranjero.',
        url: 'https://www.ardmediathek.de',
        language: 'Alemán',
      },
    ],
    faq: [
      {
        q: '¿Cuántos partidos del Mundial 2026 emite ARD/ZDF gratis en Alemania?',
        a: 'En total 48 de los 104 partidos. Cada una emite 24: el inaugural, los 3 partidos del grupo de Alemania, los partidos de octavos, cuartos, semifinales y la final. Es el paquete legalmente obligatorio bajo "evento de relevancia social" según la KEK (Komission zur Ermittlung der Konzentration im Medienbereich).',
      },
      {
        q: '¿Cómo ver TODOS los 104 partidos del Mundial 2026 en Alemania?',
        a: 'MagentaTV de Deutsche Telekom es la única forma de acceder a los 56 partidos que no están en ARD/ZDF. Cuesta 10 €/mes para clientes Telekom o 15 €/mes el plan Magenta Sport standalone. Sin compromiso anual, cancelación mensual.',
      },
      {
        q: '¿En qué grupo está Alemania en el Mundial 2026?',
        a: 'Alemania, dirigida por Julian Nagelsmann, está en el Grupo E con Curazao, Costa de Marfil y Ecuador. El grupo es considerado relativamente accesible, con Alemania como favorita clara. Calendario: 14 de junio vs Curazao (debut en NRG Stadium Houston), 20 de junio vs Costa de Marfil, 25 de junio vs Ecuador.',
      },
      {
        q: '¿Quién comenta el Mundial 2026 en la TV alemana?',
        a: 'En ARD: Tom Bartels (voz histórica) y Florian Naß. En ZDF: Oliver Schmidt como narrador líder, Béla Réthy como consultor emérito. Comentaristas: Per Mertesacker, Sandro Wagner. En MagentaTV: Marco Hagemann y Wolff-Christoph Fuss. La radio Deutschlandfunk también ofrece cobertura paralela.',
      },
    ],
    legalNote:
      'El § 4 RStV (Rundfunkstaatsvertrag) declara el Mundial como "Ereignis von erheblicher gesellschaftlicher Bedeutung", obligando a que el inaugural, todos los partidos de Alemania, semifinales y la final se emitan en TV abierta gratuita. El Rundfunkbeitrag de €18,36/mes financia ARD/ZDF y es obligatorio para todos los hogares alemanes.',
  },
];

/**
 * Mapping FIFA code → IANA timezone principal del país.
 * Usado para mostrar match times en hora local del país visitado.
 */
const COUNTRY_TIMEZONES: Record<string, string> = {
  ESP: 'Europe/Madrid',
  MEX: 'America/Mexico_City',
  BRA: 'America/Sao_Paulo',
  USA: 'America/New_York',
  ARG: 'America/Argentina/Buenos_Aires',
  COL: 'America/Bogota',
  CHL: 'America/Santiago',
  GBR: 'Europe/London',
  FRA: 'Europe/Paris',
  DEU: 'Europe/Berlin',
};

/** Timezone principal de un país broadcast */
export function getCountryTimezone(b: CountryBroadcast): string {
  return COUNTRY_TIMEZONES[b.code] ?? 'UTC';
}

/** Devuelve el broadcast de un país por slug */
export function getBroadcastBySlug(slug: string): CountryBroadcast | undefined {
  return BROADCASTS_2026.find((b) => b.slug === slug);
}

/** Lista resumen para el pillar / selector */
export function getBroadcastSummary(): Array<{
  slug: string;
  code: string;
  name: string;
  flag: string;
  channelCount: number;
  freeOptions: number;
}> {
  return BROADCASTS_2026.map((b) => ({
    slug: b.slug,
    code: b.code,
    name: b.name,
    flag: b.flag,
    channelCount: b.channels.length,
    freeOptions: b.channels.filter((c) => c.type === 'free' || c.type === 'youtube').length,
  }));
}

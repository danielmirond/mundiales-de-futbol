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
];

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

/**
 * Datos centralizados del cluster `/2026/normas-estadios`.
 *
 * Una sola fuente de verdad para las 7 páginas del pillar
 * (pillar + 6 sub-páginas). Cuando FIFA actualice el reglamento,
 * basta con tocar este archivo.
 *
 * Fuentes oficiales:
 *  - FIFA Stadium Code of Conduct (PDF oficial, mayo 2026)
 *  - FIFA Tickets Customer Support FAQ
 *  - FIFA Hospitality Know Before You Go
 *
 * Last review: 12 mayo 2026.
 */

export type ProhibitedItem = {
  /** Nombre corto del item */
  name: string;
  /** Categoría del prohibido */
  category:
    | 'tecnologia-av'
    | 'pirotecnia-ruido'
    | 'objetos-lanzables'
    | 'banderas-soportes'
    | 'bebidas-comida'
    | 'armas-sustancias'
    | 'otros';
  /** Razón resumida por la que se prohíbe */
  reason: string;
};

export const PROHIBITED_ITEMS: ProhibitedItem[] = [
  // Tecnología audiovisual
  { name: 'Drones', category: 'tecnologia-av', reason: 'Riesgo aeronáutico, espacio aéreo restringido sobre el estadio' },
  { name: 'GoPro y cámaras de acción', category: 'tecnologia-av', reason: 'FIFA reserva derechos de imagen para broadcaster oficial' },
  { name: 'Cámaras profesionales con lente desmontable', category: 'tecnologia-av', reason: 'Solo prensa acreditada' },
  { name: 'Trípodes y monopods', category: 'tecnologia-av', reason: 'Riesgo de obstrucción visual a otros aficionados' },
  { name: 'Palos selfie', category: 'tecnologia-av', reason: 'Riesgo físico y obstrucción visual' },
  // Pirotecnia y ruido
  { name: 'Bengalas y fuegos artificiales', category: 'pirotecnia-ruido', reason: 'Riesgo de incendio y daño a personas' },
  { name: 'Megáfonos y bocinas de aire (air horns)', category: 'pirotecnia-ruido', reason: 'Volumen excesivo, interferencia con seguridad' },
  { name: 'Silbatos', category: 'pirotecnia-ruido', reason: 'Confusión con señales arbitrales' },
  { name: 'Punteros láser', category: 'pirotecnia-ruido', reason: 'Pueden enfocarse a jugadores y dañar ojos' },
  // Objetos lanzables
  { name: 'Globos', category: 'objetos-lanzables', reason: 'Pueden caer al césped e interrumpir el juego' },
  { name: 'Balones de playa', category: 'objetos-lanzables', reason: 'Mismo motivo' },
  { name: 'Balones inflables', category: 'objetos-lanzables', reason: 'Mismo motivo' },
  { name: 'Muñecos hinchables', category: 'objetos-lanzables', reason: 'Obstrucción visual + riesgo de caída al campo' },
  // Banderas con soporte
  { name: 'Banderas o pancartas con asta o palo', category: 'banderas-soportes', reason: 'El palo puede usarse como arma improvisada. Las banderas sin asta SÍ están permitidas' },
  // Bebidas y comida
  { name: 'Botellas llenas (de cualquier tipo)', category: 'bebidas-comida', reason: 'Pueden lanzarse al campo. Sí se permiten reutilizables vacías' },
  { name: 'Comida preparada del exterior', category: 'bebidas-comida', reason: 'Política de concesiones exclusivas en estadio (Coca-Cola, McDonald\'s, etc.)' },
  { name: 'Paraguas', category: 'bebidas-comida', reason: 'Obstrucción visual + riesgo físico (punta metálica)' },
  // Armas y sustancias
  { name: 'Armas de cualquier tipo', category: 'armas-sustancias', reason: 'Seguridad pública' },
  { name: 'Sustancias ilegales', category: 'armas-sustancias', reason: 'Legalidad local' },
  // Otros
  { name: 'Símbolos políticos no deportivos', category: 'otros', reason: 'Decisión final del operativo de seguridad del estadio' },
  { name: 'Mascotas / animales', category: 'otros', reason: 'Excepto perros de asistencia con documentación' },
  { name: 'Skates, patines, monopatines', category: 'otros', reason: 'No están permitidos dentro del recinto' },
];

export type AllowedItem = {
  name: string;
  notes?: string;
};

export const ALLOWED_ITEMS: AllowedItem[] = [
  { name: 'Teléfono móvil' },
  { name: 'Auriculares', notes: 'Permitidos para uso personal' },
  { name: 'Cargador portátil / power bank', notes: 'Aceptados, recomendado por capacidad del estadio' },
  { name: 'Camiseta oficial de cualquier selección', notes: 'Sin restricciones, parte normal del fan experience' },
  { name: 'Banderas SIN asta', notes: 'Llevadas con la mano o sobre los hombros' },
  { name: 'Pancartas de tela sin palos', notes: 'Sin mensaje político no deportivo' },
  { name: 'Sombreros, gorras y bufandas' },
  { name: 'Productos de higiene personal', notes: 'Gel hidroalcohólico incluido' },
  { name: 'Botellas reutilizables VACÍAS', notes: 'Se rellenan en fuentes de agua dentro del estadio' },
  { name: 'Medicación personal con receta', notes: 'Llevar copia de la prescripción' },
  { name: 'Asientos especiales para discapacidad', notes: 'Coordinar con la sede por adelantado' },
  { name: 'Tickets impresos o digitales' },
  { name: 'Tarjetas de crédito y efectivo', notes: 'Stadium accepts ambas, recomendado tener app oficial FIFA' },
];

export const CLEAR_BAG_POLICY = {
  /** Dimensiones máximas en pulgadas */
  maxSize: { width: 12, depth: 6, height: 12 },
  /** Mismas dimensiones en cm para mercado ES/LATAM */
  maxSizeCm: { width: 30, depth: 15, height: 30 },
  /** Material aceptado */
  materials: ['plástico transparente', 'vinilo transparente', 'PVC transparente'],
  /** Excepción small clutch / monedero */
  clutchException: {
    maxSize: { width: 4.5, height: 6.5 },
    maxSizeCm: { width: 11.5, height: 16.5 },
    notes: 'Aproximadamente del tamaño de una mano, no necesita ser transparente',
  },
};

export type CountryAlcoholRule = {
  countryCode: 'USA' | 'CAN' | 'MEX';
  countryName: string;
  flag: string;
  alcohol: 'allowed-zones' | 'allowed-general' | 'banned-total';
  details: string;
  legalSource: string;
};

export const ALCOHOL_BY_COUNTRY: CountryAlcoholRule[] = [
  {
    countryCode: 'USA',
    countryName: 'Estados Unidos',
    flag: '🇺🇸',
    alcohol: 'allowed-zones',
    details:
      'En los 11 estadios estadounidenses, el alcohol se vende en concesiones oficiales (cerveza, vino, cócteles) en zonas autorizadas. Algunos estadios permiten consumir bebida en la grada, otros la restringen al concourse. Edad mínima: 21 años con ID oficial.',
    legalSource: 'Reglamento de cada Stadium Authority + 21st Amendment',
  },
  {
    countryCode: 'CAN',
    countryName: 'Canadá',
    flag: '🇨🇦',
    alcohol: 'allowed-zones',
    details:
      'BMO Field (Toronto) y BC Place (Vancouver) ambos permiten cerveza y vino en concesiones oficiales. Edad mínima: 19 años en Ontario, 19 en British Columbia. ID obligatorio.',
    legalSource: 'Liquor Control Board provincial',
  },
  {
    countryCode: 'MEX',
    countryName: 'México',
    flag: '🇲🇽',
    alcohol: 'banned-total',
    details:
      'ALCOHOL PROHIBIDO en los 3 estadios mexicanos (Azteca, Akron en Guadalajara, BBVA en Monterrey). Sin excepciones. Esta es la mayor diferencia operativa entre los tres países anfitriones.',
    legalSource: 'Ley General de Salud + reglamento Federación Mexicana de Fútbol',
  },
];

export type SanctionLevel = {
  level: 1 | 2 | 3;
  trigger: string;
  outcome: string;
  authority: string;
};

export const SANCTIONS: SanctionLevel[] = [
  {
    level: 1,
    trigger: 'Llevar un item prohibido no peligroso (p.ej. palo selfie, paraguas, GoPro)',
    outcome: 'Decomiso simple. El item se retira en la entrada y se devuelve al salir del estadio. Acceso permitido.',
    authority: 'Operativo de seguridad del estadio (stewards)',
  },
  {
    level: 2,
    trigger:
      'Conducta disruptiva, vulneración del código de comportamiento, ruido excesivo con megáfono, banderas con mensaje políticamente sensible no autorizado',
    outcome:
      'Aviso primero. Si reincide, expulsión del estadio SIN REEMBOLSO. Tarjeta de prohibición de acceso a futuros eventos FIFA puede emitirse.',
    authority: 'Stadium Authority + FIFA Match Commissioner',
  },
  {
    level: 3,
    trigger: 'Armas, sustancias ilegales, violencia física o verbal grave, daños materiales, violación legal del país anfitrión',
    outcome:
      'Expulsión inmediata + denuncia ante autoridades del país anfitrión (DHS USA, RCMP Canadá, Guardia Nacional México). Cargos criminales según jurisdicción local. Posible prohibición permanente de eventos FIFA.',
    authority: 'Fuerzas de seguridad del país anfitrión + FIFA Disciplinary Committee',
  },
];

export type FaqEntry = { q: string; a: string };

export const FAQ: FaqEntry[] = [
  {
    q: '¿Puedo llevar una cámara fotográfica al estadio del Mundial 2026?',
    a: 'Cámaras compactas con lente fija sí están permitidas. Cámaras profesionales con lente desmontable, GoPro y cámaras de acción NO están permitidas: solo para prensa acreditada. Tu móvil sí es válido para fotos personales.',
  },
  {
    q: '¿Puedo llevar comida al estadio?',
    a: 'No. La comida preparada del exterior está prohibida. Sí puedes llevar una botella reutilizable VACÍA que rellenarás en las fuentes de agua del estadio. Snacks empacados pueden permitirse si son pequeños y sin envase de cristal; queda a discreción del operativo de seguridad.',
  },
  {
    q: '¿Pueden cachearme a la entrada?',
    a: 'Sí. FIFA y el operativo de cada estadio se reservan el derecho a cachear bolsas, ropa exterior y abrigos. El cacheo siempre lo realiza personal del mismo género en los puestos autorizados. Si te niegas, te niegan la entrada sin reembolso.',
  },
  {
    q: '¿Puedo llevar una bandera de Palestina, Israel u otra causa política al estadio del Mundial 2026?',
    a: 'La respuesta oficial de FIFA es que "cada caso se evalúa en el momento" por el operativo de seguridad del estadio. Las banderas de selección y los símbolos deportivos están permitidos; las banderas con mensaje políticamente sensible pueden retirarse a discreción del personal. No es una decisión automática y depende del contexto.',
  },
  {
    q: '¿Qué pasa si llego con una mochila normal al estadio?',
    a: 'No te dejarán entrar con ella. La política de bolsas transparente (12×6×12 pulgadas) es estricta. Las mochilas opacas, sea cual sea su tamaño, no se permiten. Las opciones son: dejarla en consigna externa al estadio (si la hay), volver al coche, u olvidarte de ella.',
  },
  {
    q: '¿Puedo comprar alcohol dentro del estadio del Mundial 2026?',
    a: 'Depende del país: en los 11 estadios de USA y los 2 de Canadá sí se vende alcohol en concesiones oficiales (cerveza, vino, cócteles). En los 3 estadios de México (Azteca, Akron, BBVA) está prohibido por reglamento federal. Edad mínima: 21 años USA, 19 Canadá.',
  },
  {
    q: '¿Puedo llevar a mi bebé o niño pequeño al estadio?',
    a: 'Sí, los menores son bienvenidos. Niños de 2 años o más necesitan ticket propio. Los carritos de bebé no se permiten dentro de la grada pero se pueden dejar en consigna o área de servicios. Lleva audífonos protectores para bebés: el ruido puede ser intenso.',
  },
  {
    q: '¿Puedo grabar el partido con mi móvil y subirlo a TikTok / Instagram?',
    a: 'Para uso personal y fragmentos cortos sí. Para retransmisión en directo de duración mayor o uso comercial NO: los derechos de imagen son exclusivos del broadcaster oficial (FIFA+, Telemundo, RTVE, etc.). FIFA puede retirar contenido que infrinja los derechos.',
  },
];

// ───────────────────────────────────────────────────────────────────
// Catálogo de páginas del cluster (para el sitemap + navegación interna)
// ───────────────────────────────────────────────────────────────────

export const CLUSTER_PAGES = [
  {
    slug: '',
    pathname: '/2026/normas-estadios',
    title: 'Normas en los estadios del Mundial 2026',
    description: 'El reglamento oficial completo: bolsa transparente, 22 items prohibidos, alcohol por país, mensaje político y sanciones por incumplimiento.',
    icon: 'shield',
  },
  {
    slug: 'mochila-transparente',
    pathname: '/2026/normas-estadios/mochila-transparente',
    title: 'Mochila y clear bag policy Mundial 2026',
    description: 'Bolsa transparente unificada para los 16 estadios: tamaño máximo 12×6×12 pulgadas, materiales aceptados, excepción del clutch y dónde dejar mochilas no permitidas.',
    icon: 'briefcase',
  },
  {
    slug: 'items-prohibidos',
    pathname: '/2026/normas-estadios/items-prohibidos',
    title: 'Items prohibidos en los estadios del Mundial 2026',
    description: 'Lista completa de los 22 items que FIFA prohíbe llevar al estadio, agrupados por categoría: tecnología, pirotecnia, objetos lanzables y banderas.',
    icon: 'ban',
  },
  {
    slug: 'que-puedes-llevar',
    pathname: '/2026/normas-estadios/que-puedes-llevar',
    title: 'Qué puedes llevar al estadio del Mundial 2026',
    description: 'Items permitidos: móvil, cargador, camiseta oficial, banderas sin asta, botella reutilizable vacía, productos de higiene y más.',
    icon: 'check',
  },
  {
    slug: 'alcohol-por-pais',
    pathname: '/2026/normas-estadios/alcohol-por-pais',
    title: 'Alcohol en los estadios del Mundial 2026 por país',
    description: 'Estados Unidos y Canadá permiten alcohol en zonas autorizadas. México lo prohíbe en sus 3 estadios. Edades mínimas, identificación y bases legales.',
    icon: 'wine',
  },
  {
    slug: 'banderas-y-mensajes',
    pathname: '/2026/normas-estadios/banderas-y-mensajes',
    title: 'Banderas y mensajes políticos en el Mundial 2026',
    description: 'Banderas de selección sí, banderas con asta no. Mensajes políticos no deportivos: la decisión final corresponde al operativo del estadio.',
    icon: 'flag',
  },
  {
    slug: 'sanciones',
    pathname: '/2026/normas-estadios/sanciones',
    title: 'Sanciones por incumplir las normas del Mundial 2026',
    description: 'Tres niveles de sanción: decomiso simple, expulsión sin reembolso, denuncia a las autoridades del país anfitrión.',
    icon: 'alert',
  },
] as const;

export type ClusterPage = (typeof CLUSTER_PAGES)[number];

// ───────────────────────────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────────────────────────

export function getProhibitedByCategory(): Record<ProhibitedItem['category'], ProhibitedItem[]> {
  const out = {} as Record<ProhibitedItem['category'], ProhibitedItem[]>;
  for (const item of PROHIBITED_ITEMS) {
    if (!out[item.category]) out[item.category] = [];
    out[item.category].push(item);
  }
  return out;
}

export const CATEGORY_LABELS_ES: Record<ProhibitedItem['category'], string> = {
  'tecnologia-av': 'Tecnología audiovisual',
  'pirotecnia-ruido': 'Pirotecnia y ruido',
  'objetos-lanzables': 'Objetos lanzables',
  'banderas-soportes': 'Banderas con soporte',
  'bebidas-comida': 'Bebidas y comida',
  'armas-sustancias': 'Armas y sustancias',
  otros: 'Otros',
};

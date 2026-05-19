/**
 * Equipamiento audiovisual para ver el Mundial 2026.
 *
 * Selección curada de televisores y proyectores recomendados para
 * disfrutar los partidos del Mundial. Cada producto incluye criterios
 * técnicos relevantes para fútbol (refresco 100/120 Hz, HDR, ALLM/VRR,
 * latencia, audio) y un link de búsqueda en Amazon España con tag
 * de afiliación `nuus-21`.
 *
 * Política editorial: solo monetizamos vía Amazon Associates. Las
 * URLs apuntan a búsquedas (no a ASIN específico) para evitar
 * dependencia de stock concreto y mantener relevancia incluso si el
 * modelo cambia de variante (55", 65", 75", etc.).
 *
 * Última revisión: mayo 2026.
 */

const AMAZON_TAG = 'nuus-21';

function amazonSearch(query: string): string {
  const q = encodeURIComponent(query);
  return `https://www.amazon.es/s?k=${q}&tag=${AMAZON_TAG}`;
}

// ───────────────────────────────────────────────────────────────────
// Televisores
// ───────────────────────────────────────────────────────────────────

export type TVCategory = 'budget' | 'mid' | 'high' | 'premium';

export type TV = {
  id: string;
  brand: string;
  model: string;
  category: TVCategory;
  /** Tamaño base recomendado en pulgadas (las variantes 55/65/75 también disponibles) */
  baseSize: 55 | 65 | 75 | 77 | 83;
  panelType: 'LCD' | 'QLED' | 'Mini-LED' | 'OLED' | 'QD-OLED';
  /** Frecuencia nativa */
  refreshHz: 60 | 100 | 120 | 144;
  /** Soporte HDR */
  hdr: ('HDR10' | 'HDR10+' | 'Dolby Vision' | 'HLG')[];
  /** Caracteristicas para gaming/deporte de alta velocidad */
  motionFeatures: string[];
  /** Sistema operativo */
  os: string;
  /** Rango aproximado precio EUR para variante 55" */
  priceRangeEur: [number, number];
  /** Frase corta */
  pitch: string;
  /** Pros editoriales */
  pros: string[];
  /** Cons editoriales */
  cons: string[];
  /** Query Amazon España */
  amazonQuery: string;
};

export const TVS: TV[] = [
  // ─── BUDGET (300-600 €) ────────────────────────────────────
  {
    id: 'tcl-c655-pro',
    brand: 'TCL',
    model: 'C655 / C655 Pro',
    category: 'budget',
    baseSize: 55,
    panelType: 'QLED',
    refreshHz: 60,
    hdr: ['HDR10', 'HDR10+', 'Dolby Vision'],
    motionFeatures: ['MEMC 60 Hz'],
    os: 'Google TV',
    priceRangeEur: [350, 480],
    pitch: 'QLED de entrada con Dolby Vision a precio agresivo. Funcional para deporte sin reflejos extremos.',
    pros: ['Precio agresivo', 'Dolby Vision en gama baja', 'Google TV con todas las apps', 'Buen brillo en QLED para HDR'],
    cons: ['60 Hz nativo (no 120)', 'Tiempo de respuesta moderado', 'Sonido integrado básico'],
    amazonQuery: 'tcl c655 qled 55',
  },
  {
    id: 'hisense-u6n',
    brand: 'Hisense',
    model: 'U6N (Mini-LED)',
    category: 'budget',
    baseSize: 55,
    panelType: 'Mini-LED',
    refreshHz: 60,
    hdr: ['HDR10', 'HDR10+', 'Dolby Vision'],
    motionFeatures: ['MEMC'],
    os: 'VIDAA',
    priceRangeEur: [400, 550],
    pitch: 'Mini-LED a precio QLED. Mejor control de zonas de iluminación para escenas de noche del Mundial.',
    pros: ['Mini-LED en presupuesto bajo', 'Buen brillo HDR', 'Dolby Vision', 'Local dimming superior a LCD básico'],
    cons: ['VIDAA tiene menos apps que Google TV', '60 Hz', 'Sin VRR/ALLM avanzado'],
    amazonQuery: 'hisense u6n mini led 55',
  },

  // ─── MID (600-1.200 €) ─────────────────────────────────────
  {
    id: 'tcl-c855',
    brand: 'TCL',
    model: 'C855 / C865 (Mini-LED)',
    category: 'mid',
    baseSize: 65,
    panelType: 'Mini-LED',
    refreshHz: 144,
    hdr: ['HDR10', 'HDR10+', 'Dolby Vision'],
    motionFeatures: ['MEMC 144 Hz', 'VRR', 'ALLM'],
    os: 'Google TV',
    priceRangeEur: [800, 1100],
    pitch: 'Mini-LED a 144 Hz nativos. Pico de brillo 2.000 nits para HDR en salas luminosas. Mejor relación calidad-precio del Mundial.',
    pros: ['Mini-LED + 144 Hz (raro en este precio)', 'Pico HDR 2.000 nits', 'Audio Onkyo decente', 'Google TV completo'],
    cons: ['Glow lateral residual', 'Ángulo de visión LCD (no OLED)', 'Procesado de movimiento agresivo por defecto'],
    amazonQuery: 'tcl c855 mini led 65',
  },
  {
    id: 'hisense-u7n',
    brand: 'Hisense',
    model: 'U7N / U7K',
    category: 'mid',
    baseSize: 65,
    panelType: 'Mini-LED',
    refreshHz: 144,
    hdr: ['HDR10', 'HDR10+', 'Dolby Vision'],
    motionFeatures: ['MEMC', 'VRR', 'ALLM'],
    os: 'VIDAA',
    priceRangeEur: [750, 1100],
    pitch: 'La favorita de la prensa especializada como mejor calidad-precio Mundial. Mini-LED con 144 Hz y picos altos de brillo.',
    pros: ['Excelente brillo HDR (>1500 nits)', '144 Hz nativos', 'Audio integrado mejor que media', 'Movimiento muy fluido'],
    cons: ['VIDAA menos pulido que Google TV', 'Reflejos sin filtro mate de gama alta', 'Procesado movimiento puede generar artefactos'],
    amazonQuery: 'hisense u7n 65',
  },
  {
    id: 'samsung-q70d',
    brand: 'Samsung',
    model: 'Q70D / QN85D',
    category: 'mid',
    baseSize: 65,
    panelType: 'QLED',
    refreshHz: 120,
    hdr: ['HDR10', 'HDR10+'],
    motionFeatures: ['Motion Xcelerator 120Hz', 'VRR', 'ALLM'],
    os: 'Tizen',
    priceRangeEur: [900, 1300],
    pitch: 'QLED Samsung de gama media con Tizen pulido y procesado de movimiento muy bueno. Samsung NO soporta Dolby Vision.',
    pros: ['Tizen muy pulido', 'Procesado movimiento excelente', 'Diseño delgado', '120 Hz para deportes'],
    cons: ['Sin Dolby Vision (Samsung política)', 'Brillo HDR inferior al Mini-LED Hisense/TCL', 'Reflejos sin filtro mate'],
    amazonQuery: 'samsung q70d qled 65',
  },

  // ─── HIGH (1.200-2.000 €) ──────────────────────────────────
  {
    id: 'lg-c5-oled',
    brand: 'LG',
    model: 'C5 OLED (EVO)',
    category: 'high',
    baseSize: 65,
    panelType: 'OLED',
    refreshHz: 120,
    hdr: ['HDR10', 'Dolby Vision', 'HLG'],
    motionFeatures: ['OLED Motion Pro', 'VRR', 'ALLM', 'G-Sync', 'FreeSync Premium'],
    os: 'webOS',
    priceRangeEur: [1700, 2300],
    pitch: 'El OLED de referencia para fútbol: negros absolutos, contraste infinito, ángulo de visión perfecto. Perfecto para verlo en grupo en el salón.',
    pros: ['Negros absolutos', 'Ángulo de visión 178°', 'Tiempo respuesta <1ms (sin desenfoque)', 'webOS pulido + Dolby Vision'],
    cons: ['Brillo menor a Mini-LED en estancias muy luminosas', 'Más caro', 'Riesgo burn-in (mínimo con uso normal)'],
    amazonQuery: 'lg c5 oled evo 65',
  },
  {
    id: 'sony-bravia-7',
    brand: 'Sony',
    model: 'Bravia 7 (Mini-LED) / Bravia 9',
    category: 'high',
    baseSize: 65,
    panelType: 'Mini-LED',
    refreshHz: 120,
    hdr: ['HDR10', 'HDR10+', 'Dolby Vision'],
    motionFeatures: ['XR Motion Clarity', 'VRR', 'ALLM'],
    os: 'Google TV',
    priceRangeEur: [1800, 2400],
    pitch: 'Sony Bravia con procesador XR (mejor calibración de carne, césped, balón). El detalle más fino para deporte profesional.',
    pros: ['Procesador Sony XR (calibración natural)', 'Audio integrado superior', 'Dolby Vision IQ', 'Mini-LED brillante'],
    cons: ['Más caro que TCL/Hisense similares', 'Sin OLED en gama Bravia 7', 'Diseño no más delgado'],
    amazonQuery: 'sony bravia 7 mini led 65',
  },

  // ─── PREMIUM (>2.000 €) ────────────────────────────────────
  {
    id: 'lg-g5-oled',
    brand: 'LG',
    model: 'G5 OLED EVO 3 (Gallery)',
    category: 'premium',
    baseSize: 65,
    panelType: 'OLED',
    refreshHz: 120,
    hdr: ['HDR10', 'Dolby Vision', 'HLG'],
    motionFeatures: ['OLED Motion Pro', 'VRR 4K/144Hz', 'G-Sync', 'FreeSync Premium', 'Dolby Atmos'],
    os: 'webOS',
    priceRangeEur: [3500, 4500],
    pitch: 'OLED de referencia 2026. Diseño "Gallery" para colgar plano en pared. Para quien quiere lo mejor.',
    pros: ['Panel EVO 3 (35% más brillo que OLED standard)', 'Diseño plano sin separación pared', 'webOS 24', 'Procesador Alpha 11'],
    cons: ['Precio muy alto', 'Requiere instalación especial para diseño gallery', 'Burn-in residual'],
    amazonQuery: 'lg g5 oled gallery 65',
  },
  {
    id: 'samsung-s95d-qd-oled',
    brand: 'Samsung',
    model: 'S95D QD-OLED',
    category: 'premium',
    baseSize: 65,
    panelType: 'QD-OLED',
    refreshHz: 144,
    hdr: ['HDR10', 'HDR10+'],
    motionFeatures: ['Motion Xcelerator', 'VRR 4K/144Hz'],
    os: 'Tizen',
    priceRangeEur: [3000, 4000],
    pitch: 'QD-OLED Samsung con tecnología quantum dot sobre OLED. Brillo HDR superior al WOLED de LG en color rojo (importante para camisetas Brasil/Italia/España).',
    pros: ['Brillo HDR superior al WOLED', 'Color rojo más saturado (camisetas selecciones)', 'Tizen pulido', 'Diseño plano premium'],
    cons: ['Sin Dolby Vision', 'Más caro', 'Riesgo burn-in QD-OLED igual que WOLED'],
    amazonQuery: 'samsung s95d qd oled 65',
  },
  {
    id: 'sony-bravia-9-mini-led',
    brand: 'Sony',
    model: 'Bravia 9 Mini-LED',
    category: 'premium',
    baseSize: 65,
    panelType: 'Mini-LED',
    refreshHz: 120,
    hdr: ['HDR10', 'HDR10+', 'Dolby Vision'],
    motionFeatures: ['XR Motion Clarity', 'XR Triluminos Max', 'VRR'],
    os: 'Google TV',
    priceRangeEur: [3500, 4800],
    pitch: 'Mini-LED top de Sony con procesador XR2. Mejor brillo HDR del mercado (4.000 nits pico) para Mundial en sala luminosa.',
    pros: ['Brillo HDR pico 4.000 nits (récord 2026)', 'Sin riesgo burn-in (LCD)', 'Procesador Sony XR2', 'Dolby Vision'],
    cons: ['Caro', 'Bloom residual en escenas con alto contraste', 'Pesado'],
    amazonQuery: 'sony bravia 9 mini led 65',
  },
];

// ───────────────────────────────────────────────────────────────────
// Proyectores
// ───────────────────────────────────────────────────────────────────

export type ProjectorCategory = 'portable' | 'home-cinema' | 'short-throw' | 'premium-laser';

export type Projector = {
  id: string;
  brand: string;
  model: string;
  category: ProjectorCategory;
  /** Lúmenes ANSI (estándar honesto, no "lúmenes LED" inflados) */
  lumensAnsi: number;
  /** Resolución nativa */
  nativeResolution: '720p' | '1080p' | '4K-UHD' | '4K-Native';
  /** Tipo de fuente luminosa */
  lightSource: 'LED' | 'Lamp' | 'Laser' | 'LED+Laser';
  /** Vida útil estimada (horas) */
  lifespanHours: number;
  /** Distancia mínima a la pared para imagen de 100" */
  throwRatio: string;
  /** Audio integrado */
  audio: string;
  /** Smart features */
  smart: string[];
  priceRangeEur: [number, number];
  pitch: string;
  pros: string[];
  cons: string[];
  amazonQuery: string;
};

export const PROJECTORS: Projector[] = [
  // ─── PORTABLE (300-700 €) ──────────────────────────────────
  {
    id: 'anker-nebula-capsule-3',
    brand: 'Anker Nebula',
    model: 'Capsule 3 Laser',
    category: 'portable',
    lumensAnsi: 300,
    nativeResolution: '1080p',
    lightSource: 'Laser',
    lifespanHours: 25000,
    throwRatio: '1.2:1 (100" a 2.7m)',
    audio: 'Altavoz 8W integrado, Bluetooth out',
    smart: ['Android TV 11', 'Wi-Fi 6', 'Autofocus láser'],
    priceRangeEur: [600, 800],
    pitch: 'Mini-proyector láser autoenfocable del tamaño de una lata de Coca-Cola. Para llevar a casa de amigos o jardín en partidos de noche.',
    pros: ['Portátil real (1.5kg, batería 2.5h)', 'Autofocus láser instantáneo', 'Android TV preinstalado', 'Buena gama de color'],
    cons: ['300 ANSI lumens (insuficiente para salas muy luminosas)', '1080p (no 4K)', 'Audio mejor con altavoz externo', 'Precio alto para portable'],
    amazonQuery: 'anker nebula capsule 3 laser',
  },
  {
    id: 'xgimi-mogo-3',
    brand: 'XGIMI',
    model: 'MoGo 3 Pro',
    category: 'portable',
    lumensAnsi: 450,
    nativeResolution: '1080p',
    lightSource: 'LED',
    lifespanHours: 30000,
    throwRatio: '1.2:1',
    audio: 'Altavoces Harman Kardon 2x5W',
    smart: ['Google TV (con Netflix nativo)', 'Wi-Fi 6', 'Bluetooth 5.0'],
    priceRangeEur: [450, 650],
    pitch: 'Portátil con audio Harman Kardon y Google TV con Netflix nativo (raro en proyectores). Bueno para fan zone casera de salón.',
    pros: ['Audio Harman Kardon excelente para portátil', 'Google TV oficial con Netflix', 'Diseño rotativo en base', 'Buena gama de color'],
    cons: ['LED no láser (durabilidad menor)', 'Necesita oscuridad casi total', '1080p', 'Brillo bajo en estancias luminosas'],
    amazonQuery: 'xgimi mogo 3 pro google tv',
  },

  // ─── HOME CINEMA (700-1.500 €) ─────────────────────────────
  {
    id: 'epson-eh-tw7100',
    brand: 'Epson',
    model: 'EH-TW7100 / EH-TW7400',
    category: 'home-cinema',
    lumensAnsi: 1800,
    nativeResolution: '4K-UHD',
    lightSource: 'Lamp',
    lifespanHours: 5000,
    throwRatio: '1.32-2.15:1 (zoom)',
    audio: 'Sin altavoz interno (HDMI ARC)',
    smart: ['Sin smart TV (usar dispositivo externo)'],
    priceRangeEur: [1100, 1500],
    pitch: 'Proyector 4K UHD pixel-shifting de Epson para sala de cine en casa. 1.800 ANSI lumens permite ver con luz tenue.',
    pros: ['4K UHD pixel-shifting fluido', '1.800 lúmenes ANSI honestos', 'Zoom 1.6x (flexible instalación)', 'HDR10'],
    cons: ['Lámpara (5.000 horas vida)', 'Sin audio integrado', 'Sin smart TV', 'Voluminoso'],
    amazonQuery: 'epson eh tw7100 4k',
  },
  {
    id: 'benq-w2710',
    brand: 'BenQ',
    model: 'W2710 / W2720i',
    category: 'home-cinema',
    lumensAnsi: 2200,
    nativeResolution: '4K-UHD',
    lightSource: 'LED',
    lifespanHours: 20000,
    throwRatio: '1.13-1.47:1 (zoom)',
    audio: '2x5W TreVolo',
    smart: ['Android TV con Netflix oficial'],
    priceRangeEur: [1400, 1700],
    pitch: 'BenQ 4K LED con Android TV nativo y 2.200 lúmenes. Color calibrado de fábrica con CinematicMaster. Buena opción para fan room.',
    pros: ['Android TV nativo con Netflix oficial', '4K UHD', 'LED 20.000 horas', 'Color calibrado fábrica'],
    cons: ['Audio integrado básico', 'Sin Dolby Vision', 'Voluminoso para portar'],
    amazonQuery: 'benq w2710 4k led android tv',
  },

  // ─── SHORT-THROW (1.500-3.000 €) ───────────────────────────
  {
    id: 'samsung-the-premiere',
    brand: 'Samsung',
    model: 'The Premiere LSP9T',
    category: 'short-throw',
    lumensAnsi: 2800,
    nativeResolution: '4K-UHD',
    lightSource: 'Laser',
    lifespanHours: 20000,
    throwRatio: 'Ultra-corto 0.18:1 (130" a 30cm)',
    audio: '40W con Acoustic Beam',
    smart: ['Tizen completo con Netflix, Disney+, etc.'],
    priceRangeEur: [3500, 4800],
    pitch: 'Proyector láser ultra-corto que se coloca apenas 30cm de la pared para imagen de 130". Reemplaza TV en sala completa.',
    pros: ['Imagen 130" a 30cm de pared', 'Tizen completo', 'Audio 40W integrado', '2.800 ANSI'],
    cons: ['Precio muy alto', 'Necesita pared muy plana y blanca', 'Setup inicial complicado'],
    amazonQuery: 'samsung the premiere lsp9t ultra short throw',
  },

  // ─── PREMIUM LASER (3.000+ €) ──────────────────────────────
  {
    id: 'epson-ls12000',
    brand: 'Epson',
    model: 'EH-LS12000 / LS12000B',
    category: 'premium-laser',
    lumensAnsi: 2700,
    nativeResolution: '4K-UHD',
    lightSource: 'Laser',
    lifespanHours: 20000,
    throwRatio: '1.35-2.84:1 (zoom motorizado)',
    audio: 'Sin altavoz (HDMI ARC + AV externo)',
    smart: ['Sin smart TV'],
    priceRangeEur: [4500, 5500],
    pitch: 'La referencia 4K láser hogar 2026. Triple láser RGB para color preciso. Conexión HDMI 2.1 4K/120Hz para máxima fluidez del Mundial.',
    pros: ['HDMI 2.1 4K/120Hz nativo', 'Triple láser RGB', 'Lens shift motorizado +/-96%', '20.000h sin lámparas'],
    cons: ['Caro', 'Sin smart TV (necesita dispositivo)', 'Sin audio integrado', 'Pesado (12.9kg)'],
    amazonQuery: 'epson ls12000 4k laser projector',
  },
  {
    id: 'xgimi-horizon-ultra',
    brand: 'XGIMI',
    model: 'Horizon Ultra',
    category: 'premium-laser',
    lumensAnsi: 2300,
    nativeResolution: '4K-UHD',
    lightSource: 'LED+Laser',
    lifespanHours: 25000,
    throwRatio: '1.2:1',
    audio: '2x12W Harman Kardon Dolby Atmos',
    smart: ['Android TV 11 con Netflix sideloaded'],
    priceRangeEur: [2200, 2800],
    pitch: 'XGIMI con fuente LED+láser híbrida. 2.300 ANSI con tamaño compacto. Mejor balance entre brillo, color y portabilidad media.',
    pros: ['Audio Harman Kardon Dolby Atmos integrado', 'Dolby Vision (raro en proyectores)', 'Diseño compacto', 'Auto-focus + auto-keystone'],
    cons: ['Netflix requiere sideload (no oficial)', 'Más caro que XGIMI MoGo', 'No HDMI 2.1 nativo'],
    amazonQuery: 'xgimi horizon ultra dolby vision',
  },
];

export function getAmazonUrl(query: string): string {
  return amazonSearch(query);
}

// ───────────────────────────────────────────────────────────────────
// Catálogo del cluster
// ───────────────────────────────────────────────────────────────────

export const CATEGORY_LABELS_TVS: Record<TVCategory, { label: string; range: string }> = {
  budget: { label: 'Presupuesto bajo', range: '300-600 €' },
  mid: { label: 'Gama media', range: '600-1.300 €' },
  high: { label: 'Gama alta', range: '1.300-2.400 €' },
  premium: { label: 'Premium', range: '+2.400 €' },
};

export const CATEGORY_LABELS_PROJECTORS: Record<ProjectorCategory, { label: string; range: string }> = {
  portable: { label: 'Portátil', range: '450-800 €' },
  'home-cinema': { label: 'Home cinema fijo', range: '1.100-1.700 €' },
  'short-throw': { label: 'Tiro corto', range: '3.500-4.800 €' },
  'premium-laser': { label: 'Premium láser', range: '2.200-5.500 €' },
};

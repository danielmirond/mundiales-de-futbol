# Brief de agencia · Mundiales de Fútbol

## El producto en 30 segundos

**Mundiales de Fútbol** es la enciclopedia digital definitiva de las 22 Copas del Mundo masculinas (Uruguay 1930 → Norteamérica 2026). Funciona en cinco capas simultáneas:

1. **Archivo histórico profundo**: resultados, plantillas, árbitros, estadios, asistencia y eventos minuto a minuto — hasta coordenadas de tiros con xG para los mundiales más recientes.
2. **Videoteca viva**: cada edición embebe películas oficiales FIFA y noticieros de archive.org, del Mundial de Suecia 1958 al Mineirazo de Brasil 2014.
3. **Narrativa editorial**: crónicas, reportajes y análisis generados con IA y curados por humanos.
4. **Herramientas interactivas**: comparadores de jugadores, quiz, simuladores y un juego de predicciones para 2026.
5. **Experiencia en vivo 2026**: calendario, partidos en directo, crónicas automáticas durante el Mundial de Norteamérica.

Todo en **cinco idiomas nativos**: español, inglés, portugués, francés y árabe (con maquetación RTL).

**Dominio**: https://mundiales-de-futbol.com
**Tecnología**: Next.js 16 · Supabase · StatsBomb · archive.org · Wikidata

---

## Audiencia

| Arquetipo | Qué busca | Qué le enganchará |
|---|---|---|
| **Enciclopédico** | Dato concreto, ficha histórica | Profundidad: 2.000 jugadores, 1.900 eventos, 3.900 tiros ya indexados |
| **Data-lover** | Métricas, comparativas, xG | Mapas de tiros, comparadores, visualizaciones |
| **Nostálgico** | Revivir un mundial | Videoteca archive.org + crónicas editoriales |
| **Casual** | Curiosidad por 2026 | Countdown + grupos + predicciones |
| **Internacional** | Contenido en su idioma | Cinco idiomas + RTL árabe día 1 |

Global, no solo hispano. Mobile-first. Dark mode nativo.

---

## Valores de marca

- **Profundidad** sobre amplitud superficial. Preferimos una ficha de 1986 con 10 datos precisos antes que 100 mundiales con un párrafo cada uno.
- **Memoria viva**. No es un museo: vídeos de 1958 al lado de métricas xG de 2022.
- **Velocidad**. Dark-first, tipografía tabular, scroll controlado. No hay scroll infinito ni banners.
- **Honestidad**. Fuentes citadas siempre (FIFA, StatsBomb, Wikipedia, archive.org). Nada inventado.
- **Disruptivo**. No es Wikipedia ni FIFA.com: tipografía gigante, paletas únicas por mundial, transiciones cinematográficas.

---

## Personalidad de marca

| Es | No es |
|---|---|
| Rigor · enciclopédico | Aburrido · académico |
| Atlético · contundente | Agresivo · de casa de apuestas |
| Editorial · maximalista tipográfico | Minimalista frío |
| Cinematográfico · nocturno | Saturado · festival |
| Internacional · serio | Localista · naif |

---

## Lenguaje visual

### Paleta

- **Negro profundo** `#05060A` como base
- **Verde neón césped** `#00FF85` como acento primario
- **Rojo tarjeta** `#FF3B3B` para destacar urgencia
- **Amarillo tarjeta** `#FFD400` para retro y acento secundario
- Cada una de las 22 ediciones tiene su propia paleta de 2 colores derivada de las banderas de la sede

### Tipografía

- **Display**: Bebas Neue (condensado atlético, siempre mayúsculas)
- **Sans**: Geist (UI moderna, neutral)
- **Mono**: Geist Mono (cifras tabulares, kickers, timestamps)
- **Árabe**: Noto Naskh Arabic

### Gestos tipográficos característicos

- Headlines en `clamp(3.5rem, 13vw, 14rem)` — **muy grandes**
- Kickers en monospace mayúscula con tracking `0.3em` y color verde neón
- Números siempre tabulares
- Segunda línea del headline principal con gradiente `pitch → sun → flame`

### Componentes visuales

- **Cards con borde hairline** de 1px y radio 28px
- **Grid pattern** de fondo a 64px con 4% opacidad
- **Conic gradient** blureado como telón de fondo en hero
- **Radial glows** verde y rojo como luces de estadio
- **Hover**: la barra superior de la card pasa de 1.5px a 2.5px

---

## Entregables que pedimos a una agencia de diseño

### 1. Identidad visual completa (10–15 días)
- **Logotipo** principal + 4 variantes (horizontal, vertical, icon-solo, mono)
- **Sistema tipográfico** documentado (no hace falta fuente custom, ya usamos Bebas Neue y Geist)
- **Paleta extendida** con variantes de contraste y accesibilidad
- **Guidelines PDF** de 12-16 páginas
- **Plantillas Figma** con todos los componentes

### 2. Iconografía custom (5 días)
- Set de 30 iconos SVG 24x24, stroke 1.5px
- Temática fútbol: balón, silbato, portería, tarjetas, estadio, trofeo, bracket, mapa, etc.
- UI genérica: search, menu, chevron, play, share, etc.

### 3. Plantillas redes sociales (5 días)
- **OG images** 1200x630 para home, edición genérica y partido genérico
- **Instagram** cuadrado y reels 9:16: plantillas de "stat del día" y "partido del día"
- **Twitter/X** header y plantillas de anuncio
- **TikTok** portada 9:16 con plantilla de timeline

### 4. Material editorial (7 días)
- **Ilustraciones editoriales** para 5 reportajes destacados (el Maracanazo, la mano de Dios, etc.)
- **Portraits** estilizados de 10 jugadores legendarios
- **Mapa de estadios 2026** interactivo (SVG para incrustar)

### 5. Hero video (10 días)
- **Loop de 6 segundos** para la home, 1920x1080, MP4 H.264 < 3MB
- Versión **corta 3s** para redes sociales
- Versión **larga 15s** para YouTube bumper

### 6. Merchandising opcional
- Set de **posters A2** por mundial (22 piezas)
- Plantilla de **camiseta** con wordmark

---

## Cómo queremos trabajar

- **Sprints de 2 semanas** con entrega revisable al final
- **Figma** como fuente de verdad. Todo entregable incluye archivo Figma editable
- **Guidelines** en Notion / PDF compartible
- **Handoff** directo por Figma Dev Mode o exportación SVG/PNG a la carpeta `/public/brand/` del repo
- **Licencia**: todo el output debe ser propiedad del cliente (no usar imágenes/fuentes con royalties)
- **Iteración**: máximo 3 rondas por entregable
- **Idioma**: trabajamos en español; guidelines finales deben estar en español e inglés

---

## Presupuesto aproximado

| Paquete | Días | Rango |
|---|---|---|
| Identidad visual + guidelines | 10–15 | 4.000–8.000 € |
| Iconografía custom | 5 | 1.500–3.000 € |
| Plantillas RRSS | 5 | 1.500–3.000 € |
| Material editorial (5 reportajes) | 7 | 2.500–5.000 € |
| Hero video | 10 | 3.000–7.000 € |
| **Total primera ola** | | **12.500–26.000 €** |

---

## Referencias que admiramos

- **The Pudding** — narrativa de datos
- **FiveThirtyEight** (época prime) — rigor + color
- **Bloomberg Businessweek** — tipografía editorial valiente
- **Rapha** — premium deportivo con fotografía dramática
- **Copa Magazine** — fútbol retro elegante
- **Pentagram work for NYC** — sistema tipográfico + color

## Referencias que evitamos

- FIFA corporate (azul turquesa, gradientes suaves)
- Cualquier casa de apuestas (naranja + "PROMO")
- Diarios deportivos tradicionales (gris, amarillo, fuentes dispersas)
- Sportswashing estilo PR oficial

---

## Contacto

Propietario: Daniel (danielmirond)
Repositorio: https://github.com/danielmirond/mundiales-monografico (privado)
Hosting: Vercel
Base de datos: Supabase

Para propuestas, adjuntar:
1. 3 casos anteriores relevantes
2. Propuesta de timing + presupuesto desglosado
3. Equipo propuesto

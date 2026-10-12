# Voz de las piezas diarias — patrones derivados (sin IA)

Medios de referencia fijados por Daniel (2026-10-11): **Marca, As, The Athletic, Goal**.
Se modelan patrones **estructurales** (titular, entradilla, arranque, ritmo, ladillos, cierre);
nunca se copia texto. Muestreo real del 11-10-2026 (Marca y As por HTML; Goal titulares;
The Athletic por su estilo de casa, el muro JS impide scraping).

| Medio | Titular | Entradilla | Arranque | Ritmo | Ladillos | Cierre |
|---|---|---|---|---|---|---|
| **Marca** (crónica) | evaluativo/consecuencia, sin marcador | balance en una línea (racha, puesto, primer punto…) | hecho + contexto | ~500 pal., 8 párrafos de ~60 | 2-3 temáticos cortos | **lo que viene** (siguiente compromiso) |
| **Marca** (previa/servicio) | `X - Y: horario y dónde ver…` | — | P1 factual: día, hora, estadio, jornada | ~550 pal., párrafos de ~45 | pocos | cómo llega cada equipo: último resultado + puesto + puntos |
| **As** (crónica) | a dos equipos, valorativo | quién decidió + qué faltó | contexto narrativo (cómo llegaban) | ~700 pal., 15 párrafos de ~45 | "En cifras", temáticos | **ficha técnica** (árbitro, tarjetas) |
| **As** (clasificación) | `Así está la clasificación… jornada N` | los grandes + goleadas en una frase | — | párrafos de ~27 | 1-2 | app/CTA |
| **The Athletic** (match report) | `Home 2 Away 1: clave, clave y clave` | — | el momento decisivo y qué significa | analítico, datos integrados | declarativos ("X decidió…") | "What next" |
| **Goal** | protagonista + verbo + consecuencia en la tabla | — | resumen breve | párrafos de ~30 | "Los goles", "Lee también" | enlaces + fuente preferida (SE2) |

## Cómo se aplica en `registers.ts`

- **Rotación por semilla** (slug): cada crónica sale en uno de los cuatro registros; dos crónicas
  del mismo día no comparten estructura ni arranque (SE1: variar el ángulo, no solo el titular).
- **Solo hechos del feed**: goleadores (con autogol/penalti), minutos, tarjetas, cambios,
  posesión/remates/córners, puesto y puntos tras el partido, canal, último resultado y
  siguiente partido de cada equipo. Nada de valoraciones no sustentadas ("pese a las ocasiones").
- **Titular**: entidad en las 5 primeras palabras (H1), ≤110 (T2), linter anticlickbait (CB1).
  El marcador va en el titular solo en el registro Athletic (es su fórmula); Marca/As/Goal
  llevan el gancho factual (doblete, puesto en la tabla).
- **Cuerpo**: ≥2 H2 (ED6), fuente primaria enlazada (ED10: ESPN) y ≥2 enlaces internos (ED9:
  ficha, clasificación, partidos de hoy). No se rellena para alcanzar palabras (ES2).
- **Previa**: patrón Marca de servicio (P1 factual → cómo llegan → dónde ver).
- **Partidos de hoy / clasificación**: patrón As (frase-resumen con los grandes + lista corta).

## Lo que NO se modela (requiere persona)

Metáforas de titular ("La explosión de Vallecas"), declaraciones (ruedas de prensa),
valoración táctica y aprobados/suspensos. Si algún día se añade un paso humano, va aquí.

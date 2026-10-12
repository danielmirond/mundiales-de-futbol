# Brand assets · Mundiales de Fútbol

Todo lo necesario para producir material gráfico (logo, OG images, iconografía, vídeo, posters) de forma coherente con el producto.

## Archivos en este directorio

| Archivo | Para quién | Qué hace |
| --- | --- | --- |
| `design-tokens.json` | Desarrolladores + Figma | Tokens listos para importar en Figma Tokens plugin, Style Dictionary o Tailwind `@theme`. |
| `agency-brief.md` | Agencias / freelances | Brief formal con audiencia, valores, alcance, entregables, presupuesto estimado y referencias. |
| `visual-dna.html` | Todos | One-pager interactivo con todos los tokens en acción. Abre en navegador y usa Cmd+P para exportar PDF. |

## Cómo usarlos

### 1. Pasar a una agencia
Envía `agency-brief.md` (export a PDF) + `visual-dna.html` + link a https://mundiales-de-futbol.com.

### 2. Importar tokens en Figma
Instala el plugin **Tokens Studio**. Import → JSON → `design-tokens.json`. Los estilos se crean automáticamente.

### 3. Ver el sistema en acción
Abre `visual-dna.html` directamente en un navegador, o imprime a PDF con Cmd+P.

## Actualizar

Al cambiar tokens en código (`globals.css`, `tournaments.ts`), actualiza:
- `design-tokens.json` para que los diseñadores reciban los cambios
- `visual-dna.html` para que la preview refleje la realidad

## Sistema de diseño del portal (2026-10)

Fuente: proyecto Claude Design «Mundiales» (`portal/sistema.html`). Implementado en
`src/app/globals.css` (bloque «Sistema de diseño del portal»), `src/components/ui/icon.tsx`
(set de iconos propio), `src/components/portal/*` (MatchRow, chips, Crest, StandingsTable),
`src/components/match/scoreboard.tsx` (marcador l/m/s), `src/components/news/news-card.tsx`
y `src/components/nav/*` (nav + subnav por deporte).

- El acento se redefine por deporte con `data-sport="…"` en el contenedor.
- Semánticos (`live`, `win`, `draw`, `loss`, `gold`, zonas) son fijos en todos los deportes;
  `flame` y `sun` quedan como alias para el archivo histórico.
- Tema claro: clase `.theme-light` (tokens listos; sin conmutador en UI todavía).
- Bebas Neue queda para marcadores, cabeceras de sección y nombres de equipo; los titulares
  de noticia y las secciones del portal usan Geist 600 (`.t-h1`, `.t-h2`, `.t-h3`).

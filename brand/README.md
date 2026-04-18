# Brand assets · Mundiales de Fútbol

Todo lo necesario para producir material gráfico (logo, OG images, iconografía, vídeo, posters) de forma coherente con el producto.

## Archivos en este directorio

| Archivo | Para quién | Qué hace |
| --- | --- | --- |
| `design-tokens.json` | Desarrolladores + Figma | Tokens listos para importar en Figma Tokens plugin, Style Dictionary o Tailwind `@theme`. |
| `ai-prompts.md` | Tú + IAs generativas | 40+ prompts para Midjourney, Flux, DALL-E, Runway y Sora (logo, vídeo, OG, ilustraciones, iconos, posters). |
| `agency-brief.md` | Agencias / freelances | Brief formal con audiencia, valores, alcance, entregables, presupuesto estimado y referencias. |
| `visual-dna.html` | Todos | One-pager interactivo con todos los tokens en acción. Abre en navegador y usa Cmd+P para exportar PDF. |

## Cómo usarlos

### 1. Pasar a una agencia
Envía `agency-brief.md` (export a PDF) + `visual-dna.html` + link a https://mundiales-de-futbol.com.

### 2. Generar OG images o vídeo con IA
Abre `ai-prompts.md`, copia el prompt relevante, pégalo en Midjourney / Flux / Runway.

### 3. Importar tokens en Figma
Instala el plugin **Tokens Studio**. Import → JSON → `design-tokens.json`. Los estilos se crean automáticamente.

### 4. Ver el sistema en acción
Abre `visual-dna.html` directamente en un navegador, o imprime a PDF con Cmd+P.

## Actualizar

Al cambiar tokens en código (`globals.css`, `tournaments.ts`), actualiza:
- `design-tokens.json` para que los diseñadores reciban los cambios
- `visual-dna.html` para que la preview refleje la realidad

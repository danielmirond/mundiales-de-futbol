# Research diaria — Google Trends + YouTube

Capa autónoma de descubrimiento de contenido viral sobre el Mundial 2026.
Se ejecuta cada día y deja un report Markdown + JSON aquí mismo.

## Qué hace

1. **Google Trends**
   - `dailytrends` por geo (20 países: hosts + LatAm hispano + Europa key + Asia/Oceania + Marruecos).
   - `realtimetrends` categoría sports (cat=s) por geo.
   - Filtra cada trend con un diccionario multilingüe (`MUNDIAL_TOKENS` en `lib.ts`):
     `world cup`, `mundial`, `copa do mundo`, `coupe du monde`, `mondiali`,
     `wm 2026`, `ワールドカップ`, `월드컵`, `panini`, `cromos`, `mascot`, etc.

2. **YouTube Data API v3**
   - `search.list` con queries semilla por idioma (es / en / pt / fr / de / it / ja / ko),
     `order=viewCount`, `publishedAfter=hace 48h`, `regionCode` representativo.
   - `videos.list?chart=mostPopular&videoCategoryId=17` (sports) por cada país.
   - `videos.list?part=statistics` para enriquecer search results con viewCount real.

3. **Cruce con sitemap interno**
   - Para cada query/topic, evalúa si ya existe URL en el site
     (TOURNAMENTS, HISTORIAS, SEDES_2026, GROUPS_2026, NEWS_ITEMS, SQUADS_2026,
     JERSEY_HISTORIES, TEAMS_2026 + paths estáticos).
   - Lo que ya esté cubierto va a la sección "Trends ya cubiertas" — no se sugiere.

4. **Sugerencias priorizadas**
   - Score = `volumen × peso_geo × peso_fuente`.
   - Tipo inferido (noticia / historia / guía / video / youtube-respuesta).
   - Path propuesto (`/noticias/...`, `/historias/...`, `/coleccionismo/...`).
   - Razonamiento corto + evidencia (artículo o video que disparó la pista).

## Uso local

```bash
# necesitas YOUTUBE_API_KEY en .env.local
npm run research          # escribe research/YYYY-MM-DD.{md,json}
npm run research:dry      # imprime el markdown sin escribir
```

Sin `YOUTUBE_API_KEY` el módulo YouTube se salta limpiamente y sólo corre
Google Trends.

## Cron automatizado

`.github/workflows/research-daily.yml` corre todos los días a las 06:30 UTC,
genera el report y commitea sobre `main`. Necesita el secret `YOUTUBE_API_KEY`
configurado en el repo (Settings → Secrets and variables → Actions).

## Dónde mirar primero

Cada report tiene:

- **🟢 Sugerencias priorizadas** — tabla rankeada con tipo, slug, path propuesto,
  y un detalle expandido para las 15 primeras con vídeo/artículo de referencia.
- **🌐 Top queries por idioma** — qué se está buscando exactamente en cada
  mercado (la idea es leer ES, EN, PT primero).
- **✅ Cobertura existente** — verificación de que ya tenemos contenido para
  los términos más buscados (defensiva: ¿debo actualizar la pieza?).

## Ajustes rápidos

- **Añadir geos**: edita `GEOS` en `scripts/research/lib.ts`.
- **Añadir queries semilla**: edita `SEED_QUERIES` por idioma.
- **Tunear scoring**: `weight` en `GEOS` y multiplicadores en `buildSuggestions`.
- **Tipos / paths propuestos**: `pickType` y `pickProposedPath` en `report.ts`.

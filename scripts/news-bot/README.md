# news-bot

Pipeline diario que lee feeds RSS de medios internacionales, filtra noticias relevantes al Mundial 2026, genera un `NewsItem` editorial con Claude API y abre un PR draft con las noticias del día.

## Arquitectura

```
feeds.ts          9 feeds RSS activos (Marca, AS, Mundo Deportivo, BBC,
                  Guardian, ESPN, Globo Esporte, Olé) + 12 desactivados
                  (FIFA, Kicker, L'Équipe, Goal, etc.) listados para
                  reactivar cuando proveen feed válido
   │
   ▼
fetch.ts          rss-parser → FeedItem[] con hash MD5 por (feed+título+url)
   │
   ▼
filter.ts         Scoring por: keyword core + ambient + selecciones (96) +
                  sedes (16) + productos + recencia + peso del feed
   │
   ▼
dedup vs state.json (hashes procesados + slugs publicados)
   │
   ▼
top N por score (default 5)
   │
   ▼
generate.ts       Claude API (claude-sonnet-4-5) genera JSON con
                  slug + title + summary + body + category
                  Idioma de salida: español (aunque origen sea EN/PT/FR)
   │
   ▼
patch.ts          Inserta al inicio de src/lib/news.ts NEWS_ITEMS[]
   │
   ▼
state.json        Actualiza hashes procesados + slugs publicados
   │
   ▼
GHA workflow      Abre PR draft news/auto-YYYY-MM-DD para revisión
```

## Ejecución local

Requiere `ANTHROPIC_API_KEY` en el entorno (`.env.local` o export).

```bash
# Dry-run: imprime candidatos y genera, NO patchea
ANTHROPIC_API_KEY=sk-... NEWS_BOT_DRY=1 npx tsx scripts/news-bot/index.ts

# Run real: patchea news.ts y guarda state.json
ANTHROPIC_API_KEY=sk-... npx tsx scripts/news-bot/index.ts

# Solo testear el fetch RSS (sin filtro, sin Claude)
npx tsx scripts/news-bot/fetch.ts

# Solo testear filter + scoring (sin Claude)
npx tsx scripts/news-bot/filter.ts

# Limitar a un solo feed
npx tsx scripts/news-bot/fetch.ts --only=fifa-es,marca-seleccion
```

Variables de entorno:

| Var | Default | Descripción |
|---|---|---|
| `ANTHROPIC_API_KEY` | — (obligatorio) | API key de Anthropic |
| `NEWS_BOT_LIMIT` | `5` | Máximo de noticias generadas por run |
| `NEWS_BOT_DRY` | `''` | Si `'1'`, no patchea ni guarda estado |

## GitHub Actions

El workflow `.github/workflows/news-bot-daily.yml` corre a las **07:00 UTC** diariamente y abre un PR draft con las noticias del día. También se puede disparar manualmente con `workflow_dispatch`.

**Secrets requeridos en el repo:**
- `ANTHROPIC_API_KEY` — API key de Anthropic (usa Sonnet 4.5)

El `GITHUB_TOKEN` se inyecta automáticamente con permisos `contents: write` + `pull-requests: write`.

## Cómo añadir un feed

Edita `feeds.ts`:

```ts
{
  id: 'kicker-de',           // único, no se reutiliza
  name: 'Kicker · Fußball',  // human-readable, aparece en sourceName
  url: 'https://www.kicker.de/news.rss',
  lang: 'de',
  region: 'DE',
  scope: 'soccer',           // 'wc-2026' | 'soccer' | 'general-sport'
  weight: 1.1,               // ≥1.5 = fuente preferente
},
```

Luego prueba el feed:

```bash
npx tsx scripts/news-bot/fetch.ts --only=kicker-de
```

## Cómo ajustar el filtro

Edita `filter.ts`:

- `KEYWORDS_CORE`: keywords que activan la noticia (gating)
- `KEYWORDS_AMBIENT`: keywords que aportan score pero no son gating
- `TEAMS_ES` / `TEAMS_EN`: selecciones (alias multi-idioma)
- `VENUES`: ciudades y estadios sede
- `PRODUCTS`: hospitality, panini, camisetas...
- `STOPLIST`: temas a descartar (sub-20, femenino, Mundial 2030...)

Scoring base:
- keyword core: 25 pts
- selección: 8 pts
- sede: 8 pts
- producto: 10 pts
- ambient: 4 pts
- multiplica por peso del feed
- multiplica por recencia (1.0 si <6h, 0.4 si <1 semana, 0.15 más viejo)
- mínimo aceptable: 12 pts

## Dedup

`state.json` mantiene:
- `processedHashes`: últimos 5.000 hashes procesados (no se vuelven a evaluar)
- `publishedSlugs`: últimos 2.000 slugs publicados (no se generan duplicados)
- `lastRunAt`: timestamp de última ejecución

El archivo se commitea con cada PR para mantener el estado entre runs.

## Coste

Cada noticia generada consume ~2.000 tokens input + 1.500 tokens output con Sonnet 4.5:
- Input: ~6 $ por millón
- Output: ~22 $ por millón
- **Por noticia**: ~0.045 USD
- **5 noticias/día × 365 días**: ~82 USD/año

## Limitaciones conocidas

- El bot **no fetches el HTML completo del artículo**: trabaja solo con el snippet/content del RSS. Si necesitas el body completo, hay que añadir un fetch HTTP + extractor (e.g. `@extractus/article-extractor`).
- El bot **no usa imágenes**: el campo `image` de `NewsItem` se queda en `undefined` y se renderiza el OG fallback del sitio.
- El bot **no verifica links internos**: si Claude genera `/ruta/inexistente`, el link es 404. Revisión manual en el PR.
- El bot **respeta copyright**: el prompt del sistema le exige reescribir, no copiar más de 15 palabras, atribuir fuente.

## Roadmap

- [ ] Fetch HTML completo del artículo origen para más contexto
- [ ] Extraer imagen OG del artículo origen y rellenar `image`
- [ ] Web search Anthropic para verificar facts antes de redactar
- [ ] Slack notification cuando se abre PR
- [ ] Dashboard de métricas (noticias publicadas/mes, % aceptación)

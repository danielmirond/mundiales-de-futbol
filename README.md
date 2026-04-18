# Mundiales de Fútbol

The definitive encyclopedia of the FIFA Men's World Cup — 22 editions from Uruguay 1930 to North America 2026, delivered as a modern, disruptive web app in five languages (ES, EN, PT, FR, AR).

Three layers running together:

- **Encyclopedia** — tournaments, squads, referees, stadiums, minute-by-minute events.
- **Editorial** — chronicles, videos (archive.org / YouTube), long reads.
- **Interactive** — comparators, simulators, quiz, 2026 prediction game.

---

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19 + TypeScript
- Tailwind v4 (dark-first, disruptive theme)
- next-intl (5 locales incl. RTL Arabic)
- Supabase (Postgres + Realtime for 2026 live)
- Deployed on Vercel, domain: [mundiales-de-futbol.com](https://mundiales-de-futbol.com)

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in Supabase URL and keys
npm run dev
```

Open http://localhost:3000 — the default locale (Spanish) serves on `/`, others on `/en`, `/pt`, `/fr`, `/ar`.

## Project structure

```
src/
├── app/[locale]/          # i18n-aware App Router pages
├── components/            # Server + client UI
│   ├── home/              # Hero, stats, countdown, editions grid, pillars
│   ├── nav/               # SiteNav, LocaleSwitcher, SiteFooter
│   └── ui/                # Button + primitives
├── i18n/                  # next-intl config (routing + request)
├── lib/
│   ├── supabase/          # Browser + server clients
│   ├── tournaments.ts     # Static seed for the 22 editions
│   └── utils.ts           # cn() helper
├── messages/              # Translation JSON per locale
└── middleware.ts          # next-intl locale detection
supabase/
├── migrations/            # SQL schema migrations
└── README.md              # Supabase setup
```

## Translations

Content lives in `src/messages/{es,en,pt,fr,ar}.json`. Keep the shape consistent across locales. Arabic is RTL — the layout switches `dir="rtl"` automatically.

When adding a new key:

1. Add it to **all five** JSON files.
2. Reference it with `useTranslations('namespace')` (client) or `getTranslations` (server).

## Database

See [`supabase/README.md`](./supabase/README.md) for the schema and ingestion workflow. Run the migration in the Supabase SQL editor the first time you connect a project.

## Deploy

Vercel auto-deploys from `main`. Environment variables required in the Vercel dashboard:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only, never expose)
- `NEXT_PUBLIC_SITE_URL`

## Roadmap

- **Phase 0** ✓ Foundation — scaffold, i18n, theme, static home, DB schema.
- **Phase 1** — Enciclopedia: ingest Wikidata + Wikipedia for all 22 editions.
- **Phase 2** — Event-level data via StatsBomb open data.
- **Phase 3** — Editorial: chronicles + curated archive.org videos.
- **Phase 4** — Interactive: comparators, quiz, "¿Qué mundial eres?" test.
- **Phase 5** — 2026 live: realtime match data, AI-generated chronicles, prediction game.

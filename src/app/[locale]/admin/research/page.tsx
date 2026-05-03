import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';

export const dynamic = 'force-static';
export const revalidate = 3600; // 1 h

export const metadata = {
  title: 'Research diaria — admin',
  robots: { index: false, follow: false },
};

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

type ReportSummary = {
  date: string;
  trends: number;
  suggestions: number;
  covered: number;
};

function listReports(): ReportSummary[] {
  const dir = join(process.cwd(), 'research');
  let files: string[] = [];
  try {
    files = readdirSync(dir).filter((f) => f.endsWith('.json'));
  } catch {
    return [];
  }
  const out: ReportSummary[] = [];
  for (const f of files) {
    try {
      const raw = readFileSync(join(dir, f), 'utf8');
      const json = JSON.parse(raw) as {
        trendItems?: unknown[];
        suggestions?: unknown[];
        alreadyCovered?: unknown[];
      };
      const date = (f.replace(/\.json$/, '') || '').trim();
      if (!date) continue;
      out.push({
        date,
        trends: Array.isArray(json.trendItems) ? json.trendItems.length : 0,
        suggestions: Array.isArray(json.suggestions) ? json.suggestions.length : 0,
        covered: Array.isArray(json.alreadyCovered) ? json.alreadyCovered.length : 0,
      });
    } catch {
      // ignora
    }
  }
  return out.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export default async function AdminResearchIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const reports = listReports();

  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 pt-32 pb-24 md:px-10">
      <header>
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <TrendingUp className="inline h-3 w-3 mr-2" />
          Research diaria · interno
        </div>
        <h1 className="mt-3 font-display text-fluid-display uppercase leading-[0.9]">
          Trends Mundial
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)]">
          Captura diaria de Google Trends (20 países) + YouTube Data API (8 idiomas)
          filtrada con tokens del Mundial. Cruzada contra el sitemap interno para
          detectar gaps de cobertura. Actualiza por GitHub Action a las 06:30 UTC.
        </p>
      </header>

      <section className="mt-16">
        {reports.length === 0 ? (
          <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-10 text-center">
            <p className="text-[var(--color-fg-muted)]">
              Aún no hay reports. Ejecuta <code className="font-mono">npm run research</code> o
              espera al cron diario.
            </p>
          </div>
        ) : (
          <ul className="grid gap-3">
            {reports.map((r) => (
              <li key={r.date}>
                <Link
                  href={withLocale(locale as Locale, `/admin/research/${r.date}`)}
                  className="group flex items-center justify-between gap-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] px-6 py-5 transition-colors hover:border-[var(--color-pitch)]"
                >
                  <div className="flex items-center gap-4">
                    <Calendar className="h-5 w-5 text-[var(--color-pitch)]" />
                    <div>
                      <div className="font-display text-2xl tab-num">{r.date}</div>
                      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                        {r.trends} trends · {r.suggestions} sugerencias · {r.covered} ya cubiertas
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[var(--color-fg-muted)] transition-transform group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-16 rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-8">
        <h2 className="font-display text-2xl uppercase">Cómo funciona</h2>
        <ul className="mt-6 space-y-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">
          <li>· <strong>Fuentes</strong>: Google Trends Trending Now (RSS) + YouTube Data API v3 (search.list + mostPopular sports).</li>
          <li>· <strong>Geos</strong>: 20 países con peso (hosts US/MX/CA × 1.4, ES × 1.5, AR/BR × 1.3, resto LatAm 0.8-1.0, Europa key 0.9-1.1, Asia/Oceania 0.7).</li>
          <li>· <strong>Filtro</strong>: tokens fuertes (&quot;world cup 2026&quot;, &quot;mundial 2026&quot;, &quot;panini mundial&quot;…) o débiles (&quot;panini&quot;, &quot;jersey&quot;…) en co-ocurrencia con 2026/2030.</li>
          <li>· <strong>Cobertura</strong>: cruce con TOURNAMENTS, HISTORIAS, SEDES_2026, GROUPS_2026, NEWS_ITEMS, SQUADS_2026, JERSEY_HISTORIES, TEAMS_2026 + paths estáticos.</li>
          <li>· <strong>Cron</strong>: GitHub Action diaria 06:30 UTC (necesita secret <code className="font-mono">YOUTUBE_API_KEY</code>).</li>
          <li>· <strong>Manual</strong>: <code className="font-mono">npm run research</code> escribe a <code className="font-mono">research/YYYY-MM-DD.&#123;md,json&#125;</code>.</li>
        </ul>
      </section>
    </main>
  );
}

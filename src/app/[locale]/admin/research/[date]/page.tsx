import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ExternalLink, Video, Newspaper, TrendingUp, Globe2 } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';

export const dynamic = 'force-static';
export const revalidate = 3600;

export const metadata = {
  title: 'Research diaria — detalle',
  robots: { index: false, follow: false },
};

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

type TrendItem = {
  query: string;
  geo: string;
  language: string;
  source: 'google-trends-daily' | 'google-trends-realtime' | 'youtube-search' | 'youtube-trending';
  score: number;
  videoId?: string;
  videoTitle?: string;
  videoUrl?: string;
  channelTitle?: string;
  publishedAt?: string;
  thumbnailUrl?: string;
  relatedQueries?: string[];
  articles?: Array<{ title: string; url: string; source: string }>;
};

type ContentSuggestion = {
  topic: string;
  type: 'noticia' | 'historia' | 'guía' | 'cluster' | 'video' | 'youtube-respuesta';
  slugSuggestion: string;
  language: string;
  geos: string[];
  score: number;
  reason: string;
  proposedPath: string;
  evidence: TrendItem[];
};

type ResearchReport = {
  generatedAt: string;
  date: string;
  geosCovered: string[];
  trendItems: TrendItem[];
  topByLanguage: Record<string, Array<{ query: string; score: number; geos: string[] }>>;
  suggestions: ContentSuggestion[];
  alreadyCovered: Array<{ query: string; matchUrl: string }>;
};

export function generateStaticParams() {
  const dir = join(process.cwd(), 'research');
  let files: string[] = [];
  try {
    files = readdirSync(dir).filter((f) => f.endsWith('.json'));
  } catch {
    return [];
  }
  return files.flatMap((f) => {
    const date = f.replace(/\.json$/, '');
    return routing.locales.map((locale) => ({ locale, date }));
  });
}

function readReport(date: string): ResearchReport | null {
  try {
    const raw = readFileSync(join(process.cwd(), 'research', `${date}.json`), 'utf8');
    return JSON.parse(raw) as ResearchReport;
  } catch {
    return null;
  }
}

const TYPE_COLORS: Record<ContentSuggestion['type'], string> = {
  noticia: 'bg-blue-500/15 text-blue-300 border-blue-500/40',
  historia: 'bg-purple-500/15 text-purple-300 border-purple-500/40',
  'guía': 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
  cluster: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
  video: 'bg-red-500/15 text-red-300 border-red-500/40',
  'youtube-respuesta': 'bg-pink-500/15 text-pink-300 border-pink-500/40',
};

function SourceBadge({ source }: { source: TrendItem['source'] }) {
  const icon = source.startsWith('youtube') ? <Video className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />;
  const label =
    source === 'google-trends-daily' ? 'Google Trends' :
    source === 'google-trends-realtime' ? 'Trends realtime' :
    source === 'youtube-search' ? 'YouTube search' :
    'YouTube trending';
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
      {icon}
      {label}
    </span>
  );
}

export default async function AdminResearchDetail({
  params,
}: {
  params: Promise<{ locale: string; date: string }>;
}) {
  const { locale, date } = await params;
  setRequestLocale(locale);
  const report = readReport(date);
  if (!report) notFound();

  return (
    <main className="mx-auto w-full max-w-[1300px] px-6 pt-32 pb-24 md:px-10">
      <Link
        href={withLocale(locale as Locale, '/admin/research')}
        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
      >
        <ArrowLeft className="h-3 w-3" /> Index
      </Link>

      <header className="mt-8">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <TrendingUp className="inline h-3 w-3 mr-2" />
          Research · {report.date}
        </div>
        <h1 className="mt-3 font-display text-fluid-display uppercase leading-[0.9]">
          {report.suggestions.length} sugerencias
        </h1>
        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
          <span>{report.trendItems.length} trends totales</span>
          <span>{report.alreadyCovered.length} ya cubiertas</span>
          <span>{report.geosCovered.length} geos</span>
          <span>{Object.keys(report.topByLanguage).length} idiomas</span>
        </div>
      </header>

      <section className="mt-16">
        <h2 className="font-display text-2xl uppercase">🟢 Sugerencias priorizadas</h2>
        {report.suggestions.length === 0 ? (
          <p className="mt-6 text-[var(--color-fg-muted)]">
            Sin trends del Mundial detectadas en este ciclo.
          </p>
        ) : (
          <ul className="mt-6 space-y-4">
            {report.suggestions.map((s, i) => (
              <li
                key={`${s.language}-${s.slugSuggestion}-${i}`}
                className="grid gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:grid-cols-[3rem_1fr_auto] md:items-start"
              >
                <div className="font-display text-3xl tab-num text-[var(--color-fg-muted)]">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] ${TYPE_COLORS[s.type]}`}>
                      {s.type}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                      {s.language} · {s.geos.join(', ')}
                    </span>
                    <span className="font-mono text-[10px] tab-num text-[var(--color-fg-subtle)]">
                      score {Math.round(s.score).toLocaleString()}
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-xl text-[var(--color-fg)]">{s.topic}</h3>
                  <p className="mt-2 text-sm text-[var(--color-fg-muted)]">{s.reason}</p>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-md bg-[var(--color-bg)] px-3 py-1.5 font-mono text-xs">
                    <span className="text-[var(--color-fg-subtle)]">Path</span>
                    <code className="text-[var(--color-pitch)]">{s.proposedPath}</code>
                  </div>

                  {s.evidence.slice(0, 3).map((ev, j) => (
                    <div
                      key={j}
                      className="mt-4 rounded-lg border border-[var(--color-border)] p-3"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <SourceBadge source={ev.source} />
                        {ev.score > 0 && (
                          <span className="font-mono text-[10px] tab-num text-[var(--color-fg-subtle)]">
                            {ev.score.toLocaleString()}
                          </span>
                        )}
                      </div>
                      {ev.videoUrl && ev.videoTitle && (
                        <a
                          href={ev.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-3 text-sm hover:text-[var(--color-pitch)]"
                        >
                          {ev.thumbnailUrl && (
                            <Image
                              src={ev.thumbnailUrl}
                              alt=""
                              width={120}
                              height={68}
                              unoptimized
                              className="flex-shrink-0 rounded"
                            />
                          )}
                          <div className="flex-1">
                            <div className="line-clamp-2 font-medium">{ev.videoTitle}</div>
                            <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                              {ev.channelTitle} · YouTube
                            </div>
                          </div>
                          <ExternalLink className="h-3 w-3 flex-shrink-0 text-[var(--color-fg-subtle)]" />
                        </a>
                      )}
                      {ev.articles?.slice(0, 2).map((a, k) => (
                        <a
                          key={k}
                          href={a.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 flex items-start gap-2 text-sm hover:text-[var(--color-pitch)]"
                        >
                          <Newspaper className="h-3 w-3 flex-shrink-0 mt-0.5 text-[var(--color-fg-subtle)]" />
                          <div className="flex-1">
                            <div className="line-clamp-2">{a.title}</div>
                            <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                              {a.source}
                            </div>
                          </div>
                          <ExternalLink className="h-3 w-3 flex-shrink-0 text-[var(--color-fg-subtle)]" />
                        </a>
                      ))}
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-20">
        <h2 className="font-display text-2xl uppercase">
          <Globe2 className="inline h-5 w-5 mr-2 text-[var(--color-pitch)]" />
          Top queries por idioma
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(report.topByLanguage).map(([lang, items]) => (
            <div
              key={lang}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5"
            >
              <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
                {lang}
              </div>
              <ul className="mt-4 space-y-2">
                {items.slice(0, 12).map((it, i) => (
                  <li key={i} className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="truncate text-[var(--color-fg)]">{it.query}</span>
                    <span className="flex-shrink-0 font-mono text-[10px] tab-num text-[var(--color-fg-subtle)]">
                      {Math.round(it.score).toLocaleString()} · {it.geos.join(',')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {report.alreadyCovered.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl uppercase">✅ Trends ya cubiertas</h2>
          <ul className="mt-6 space-y-2">
            {Array.from(
              new Map(report.alreadyCovered.map((c) => [`${c.query}::${c.matchUrl}`, c])).values(),
            ).map((c, i) => (
              <li
                key={i}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm"
              >
                <span className="text-[var(--color-fg)]">&quot;{c.query}&quot;</span>
                <code className="font-mono text-xs text-[var(--color-pitch)]">{c.matchUrl}</code>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import {
  HISTORIAS,
  BLOCK_LABELS,
  CATEGORY_LABELS,
  type HistoriaBlockCode,
  type HistoriaCategory,
  type Historia,
} from '@/lib/historias';
import { routing, type Locale } from '@/i18n/routing';

const CATEGORY_COLORS: Record<HistoriaCategory, string> = {
  epica: 'bg-emerald-400',
  polemica: 'bg-red-400',
  tragica: 'bg-indigo-400',
  profetica: 'bg-amber-400',
  humor: 'bg-yellow-400',
  historica: 'bg-sky-400',
  mixta: 'bg-fuchsia-400',
};

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

function fmtShortDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('es', {
      day: '2-digit',
      month: 'short',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

const BLOCK_ORDER: HistoriaBlockCode[] = [
  'S1',
  'S2',
  'S3',
  'S4',
  'S5',
  'S6',
  'S7',
  'ARRANQUE',
  'EFEMERIDE',
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mundiales-de-futbol.com';
  const url =
    locale === routing.defaultLocale
      ? `${siteUrl}/historias`
      : `${siteUrl}/${locale}/historias`;
  return {
    title: 'Historias del Mundial · Calendario editorial 2026',
    description:
      'Las frases, polémicas, profecías y narraciones que han definido la historia de los Mundiales de fútbol. Calendario editorial diario hasta el Mundial 2026.',
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        routing.locales.map((l) => [
          l,
          l === routing.defaultLocale
            ? `${siteUrl}/historias`
            : `${siteUrl}/${l}/historias`,
        ]),
      ),
    },
    openGraph: {
      type: 'website',
      title: 'Historias del Mundial · Calendario editorial 2026',
      description:
        'Frases que cambiaron la historia del fútbol mundialista. Una historia diaria hasta el Mundial 2026.',
      url,
    },
  };
}

export default async function HistoriasIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const grouped: Record<HistoriaBlockCode, Historia[]> = {
    S1: [],
    S2: [],
    S3: [],
    S4: [],
    S5: [],
    S6: [],
    S7: [],
    ARRANQUE: [],
    EFEMERIDE: [],
  };
  for (const h of HISTORIAS) grouped[h.blockCode].push(h);

  const totalPublished = HISTORIAS.length;

  return (
    <div className="pt-32">
      <header className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Calendario editorial · 24 abr — 30 jul 2026
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          Historias del<br />Mundial
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          54 frases, narraciones, polémicas y profecías que han definido la historia
          de los Mundiales de fútbol. Una pieza diaria hasta la inauguración del
          Mundial 2026 en el Estadio Azteca, y las efemérides imprescindibles durante
          el torneo.
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
          <span>{totalPublished} historias</span>
          <span>7 bloques temáticos</span>
          <span>5 efemérides obligatorias</span>
        </div>
      </header>

      <div className="mx-auto mt-16 w-full max-w-[1400px] px-6 md:px-10">
        {BLOCK_ORDER.map((blockCode) => {
          const items = grouped[blockCode];
          if (items.length === 0) return null;

          return (
            <section key={blockCode} className="border-t border-[var(--color-border)] py-14 md:py-20">
              <div className="grid gap-10 md:grid-cols-[280px_1fr]">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
                    {blockCode === 'EFEMERIDE' || blockCode === 'ARRANQUE'
                      ? '·'
                      : `Bloque ${blockCode.replace('S', '')}`}
                  </div>
                  <h2 className="mt-3 font-display text-3xl uppercase leading-[1] md:text-4xl">
                    {BLOCK_LABELS[blockCode]}
                  </h2>
                  <p className="mt-4 font-mono text-xs text-[var(--color-fg-subtle)]">
                    {items.length} {items.length === 1 ? 'historia' : 'historias'}
                  </p>
                </div>

                <ul className="grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)]">
                  {items.map((h) => (
                    <li key={h.slug} className="bg-[var(--color-bg)]">
                      <Link
                        href={withLocale(locale as Locale, `/historias/${h.slug}`)}
                        className="group flex flex-col gap-3 p-6 transition-colors hover:bg-[var(--color-bg-2)] md:flex-row md:items-center md:gap-6 md:p-7"
                      >
                        <div className="flex w-full items-center gap-4 md:w-auto md:flex-shrink-0">
                          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                            {fmtShortDate(h.publishDate)}
                          </span>
                          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                            #{String(h.n).padStart(2, '0')}
                          </span>
                          <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em]">
                            <span className={`h-1.5 w-1.5 rounded-full ${CATEGORY_COLORS[h.category]}`} />
                            <span className="text-[var(--color-fg-muted)]">
                              {CATEGORY_LABELS[h.category]}
                            </span>
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-base italic text-[var(--color-fg)] md:text-lg">
                            «{h.quote}»
                          </p>
                          <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
                            {h.protagonist}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 flex-shrink-0 text-[var(--color-fg-subtle)] transition-all group-hover:translate-x-1 group-hover:text-[var(--color-pitch)] rtl:rotate-180" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          );
        })}
      </div>

      <div className="h-24" />
    </div>
  );
}

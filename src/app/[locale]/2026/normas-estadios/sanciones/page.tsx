import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';
import { SANCTIONS } from '@/lib/wc-2026-stadium-rules';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/2026/normas-estadios/sanciones',
    title: 'Sanciones por incumplir las normas del Mundial 2026',
    description:
      'Qué pasa si llevas un item prohibido al estadio del Mundial 2026: tres niveles de sanción (decomiso, expulsión sin reembolso, denuncia). Quién decide, dónde se aplica y procedimiento.',
    keywords: [
      'sanciones estadio Mundial 2026',
      'expulsión estadio Mundial 2026',
      'qué pasa si llevo algo prohibido Mundial 2026',
      'multas estadios FIFA',
      'reembolso entrada Mundial 2026',
    ],
    type: 'article',
  });
}

const LEVEL_COLORS: Record<1 | 2 | 3, { ring: string; chip: string }> = {
  1: { ring: 'border-[var(--color-pitch)]/40', chip: 'bg-[var(--color-pitch)]/15 text-[var(--color-pitch)]' },
  2: { ring: 'border-[var(--color-sun)]/40', chip: 'bg-[var(--color-sun)]/15 text-[var(--color-sun)]' },
  3: { ring: 'border-red-500/40', chip: 'bg-red-500/15 text-red-500' },
};

export default async function SanctionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Sanciones por incumplir las normas del Mundial 2026',
    url: localeUrl(locale, '/2026/normas-estadios/sanciones'),
    inLanguage: locale,
  };

  return (
    <article className="pt-32 pb-24">
      <JsonLd
        data={[
          articleLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Mundial 2026', path: '/2026' },
            { name: 'Normas estadios', path: '/2026/normas-estadios' },
            { name: 'Sanciones', path: '/2026/normas-estadios/sanciones' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1000px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/2026/normas-estadios')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-pitch)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Normas estadios
        </Link>

        <div className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <AlertTriangle className="mr-2 inline h-3 w-3" /> Tres niveles de sanción
        </div>
        <h1 className="mt-3 font-display text-4xl uppercase leading-[1] md:text-5xl">
          Qué pasa si infringes las normas
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-fg-muted)]">
          FIFA aplica un sistema escalonado de tres niveles: <strong>decomiso</strong>,{' '}
          <strong>expulsión sin reembolso</strong>, y <strong>denuncia a las autoridades</strong>{' '}
          del país anfitrión. La gravedad de la conducta determina el nivel; el operativo
          de cada estadio aplica el primero, FIFA y la justicia local los siguientes.
        </p>
      </header>

      <section className="mx-auto mt-16 w-full max-w-[1000px] space-y-6 px-6 md:px-10">
        {SANCTIONS.map((s) => {
          const colors = LEVEL_COLORS[s.level];
          return (
            <div key={s.level} className={`rounded-3xl border ${colors.ring} bg-[var(--color-bg-2)] p-6 md:p-8`}>
              <div className="flex flex-wrap items-baseline gap-3">
                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full font-display text-xl font-extrabold ${colors.chip}`}>
                  {s.level}
                </span>
                <h2 className="font-display text-2xl uppercase">Nivel {s.level}</h2>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-3">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                    Qué lo activa
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                    {s.trigger}
                  </p>
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                    Consecuencia
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                    {s.outcome}
                  </p>
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                    Quién decide
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                    {s.authority}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Reembolso */}
      <section className="mx-auto mt-16 w-full max-w-[1000px] px-6 md:px-10">
        <h2 className="font-display text-2xl uppercase">¿Hay reembolso si me expulsan?</h2>
        <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/5 p-6">
          <p className="font-display text-lg uppercase">NO.</p>
          <p className="mt-3 text-base leading-relaxed text-[var(--color-fg-muted)]">
            La política de FIFA Tickets es explícita: la expulsión por incumplimiento del
            código de conducta <strong>anula el ticket</strong> y no genera derecho a
            reembolso, ni del valor del propio ticket ni de servicios asociados
            (parking, hospitality, viaje). El precio típico de un ticket de fase grupos del
            Mundial 2026 va de los 60 a los 800 USD; entrar el día del partido con una
            mochila normal cuando hay clear bag policy es una pérdida real.
          </p>
        </div>
      </section>

      {/* Procedimiento */}
      <section className="mx-auto mt-16 w-full max-w-[1000px] px-6 md:px-10">
        <h2 className="font-display text-2xl uppercase">Procedimiento si te expulsan</h2>
        <ol className="mt-6 space-y-4 text-base leading-relaxed text-[var(--color-fg-muted)]">
          <li className="flex gap-4">
            <span className="font-display text-2xl font-extrabold text-[var(--color-pitch)] leading-none">1.</span>
            <span>
              <strong className="text-[var(--color-fg)]">Aviso del steward.</strong> Te
              acerca y te pide acompañarle. Niégate y la situación escalará a nivel 3.
            </span>
          </li>
          <li className="flex gap-4">
            <span className="font-display text-2xl font-extrabold text-[var(--color-pitch)] leading-none">2.</span>
            <span>
              <strong className="text-[var(--color-fg)]">Sala de procedimientos.</strong>{' '}
              Cada estadio tiene una. Te explican la infracción y te informan de la
              sanción. Tienes derecho a un intérprete si no hablas inglés/francés/español.
            </span>
          </li>
          <li className="flex gap-4">
            <span className="font-display text-2xl font-extrabold text-[var(--color-pitch)] leading-none">3.</span>
            <span>
              <strong className="text-[var(--color-fg)]">Salida supervisada.</strong> Te
              acompañan al perímetro del estadio. Si la sanción incluye prohibición de
              acceso futuro a eventos FIFA, te entregan el documento en mano.
            </span>
          </li>
          <li className="flex gap-4">
            <span className="font-display text-2xl font-extrabold text-[var(--color-pitch)] leading-none">4.</span>
            <span>
              <strong className="text-[var(--color-fg)]">Apelación.</strong> Tienes 30
              días para apelar la sanción a través de FIFA Disciplinary Committee si
              consideras que el operativo se equivocó. Es un proceso largo, suele
              resolverse después del Mundial.
            </span>
          </li>
        </ol>
      </section>

      <section className="mx-auto mt-20 w-full max-w-[1000px] px-6 md:px-10">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
          <h2 className="font-display text-lg uppercase">Sigue con las normas</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={withLocale(locale as Locale, '/2026/normas-estadios')} className="rounded-full bg-[var(--color-pitch)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] font-semibold text-black">
              Volver al pillar
            </Link>
            <Link href={withLocale(locale as Locale, '/2026/normas-estadios/items-prohibidos')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              22 items prohibidos
            </Link>
            <Link href={withLocale(locale as Locale, '/2026/normas-estadios/mochila-transparente')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Mochila transparente
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

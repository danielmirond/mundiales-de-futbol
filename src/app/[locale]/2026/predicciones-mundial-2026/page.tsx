import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, Trophy, Target, TrendingUp, CheckCircle2, Users } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl, SEO } from '@/lib/seo';

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
    path: '/2026/predicciones-mundial-2026',
    title: 'Predicciones del Mundial 2026: haz tu porra gratis y predice los resultados',
    description:
      'Predice el Mundial 2026: rellena tu porra gratis con los resultados de todos los partidos, el campeón, el Pichichi y las sorpresas. Compite en el ranking público y crea ligas privadas con tus amigos. Pronósticos partido a partido del Mundial de México, EE. UU. y Canadá.',
    keywords: [
      'predicciones mundial 2026',
      'predecir mundial 2026',
      'prediccion mundial 2026',
      'porra mundial 2026',
      'pronosticos mundial 2026',
      'quiniela mundial 2026',
      'predicciones copa del mundo 2026',
      'predecir resultados mundial 2026',
      'porra mundial 2026 gratis',
      'world cup 2026 predictions',
    ],
    type: 'article',
  });
}

const PASOS = [
  {
    icon: Target,
    title: 'Predice cada partido',
    body: 'Rellena el resultado de los 104 partidos del Mundial 2026, desde la fase de grupos hasta la final. Puedes editar tu pronóstico hasta que el partido empieza.',
  },
  {
    icon: Trophy,
    title: 'Apunta tus apuestas grandes',
    body: 'Elige quién será el campeón, el finalista, el Pichichi (Bota de Oro) y las sorpresas del torneo. Aciertos que valen puntos extra.',
  },
  {
    icon: TrendingUp,
    title: 'Suma puntos y sube en el ranking',
    body: 'Cada acierto suma. Consulta tu posición en el ranking público global y mide tu olfato contra el de miles de aficionados.',
  },
  {
    icon: Users,
    title: 'Crea tu liga privada',
    body: 'Monta una porra con tus amigos, tu familia o tu oficina. Comparte un enlace y competid en una clasificación solo vuestra.',
  },
];

const FAQ = [
  {
    q: '¿Cómo se hacen las predicciones del Mundial 2026?',
    a: 'Entra en la porra, regístrate gratis y rellena el resultado de cada partido del Mundial 2026. Puedes predecir los marcadores de la fase de grupos y de las eliminatorias, además del campeón, el finalista y el máximo goleador. Tus pronósticos se bloquean automáticamente cuando empieza cada partido.',
  },
  {
    q: '¿La porra del Mundial 2026 es gratis?',
    a: 'Sí. Participar en la porra y predecir todos los partidos es totalmente gratis. Solo necesitas registrarte para guardar tus pronósticos y aparecer en el ranking.',
  },
  {
    q: '¿Hasta cuándo puedo editar mis predicciones?',
    a: 'Puedes modificar el pronóstico de cada partido hasta el momento del saque inicial. Cuando el partido arranca, tu predicción queda bloqueada y ya no se puede cambiar.',
  },
  {
    q: '¿Cómo se reparten los puntos?',
    a: 'Sumas puntos por acertar el ganador de cada partido y puntos extra por clavar el resultado exacto. Las apuestas globales —campeón, finalista y Bota de Oro— otorgan bonificaciones cuando se confirman.',
  },
  {
    q: '¿Puedo competir solo con mis amigos?',
    a: 'Sí. Además del ranking público global, puedes crear una liga privada, invitar a quien quieras con un enlace y veros únicamente entre vosotros en una clasificación independiente.',
  },
];

export default async function PrediccionesMundial2026({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Predicciones del Mundial 2026: haz tu porra gratis y predice los resultados',
    description:
      'Cómo predecir el Mundial 2026: rellena tu porra gratis con los resultados de cada partido, el campeón y el Pichichi, compite en el ranking público y crea ligas privadas.',
    publisher: { '@type': 'Organization', name: SEO.siteName, url: SEO.siteUrl },
    datePublished: '2026-06-10',
    dateModified: '2026-06-10',
    mainEntityOfPage: localeUrl(locale, '/2026/predicciones-mundial-2026'),
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <article className="pt-32">
      <JsonLd
        data={[
          articleLd,
          faqLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Mundial 2026', path: '/2026' },
            { name: 'Predicciones', path: '/2026/predicciones-mundial-2026' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/2026')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Mundial 2026
        </Link>

        <div className="mt-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Target className="h-4 w-4" />
          <span>Porra gratis · 104 partidos</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          Predicciones<br />del Mundial 2026
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          ¿Te atreves a predecir el Mundial 2026? Rellena tu porra <strong className="text-[var(--color-fg)]">gratis</strong> con los resultados de todos los partidos, elige al campeón y al Pichichi, y compite en el ranking público o en una liga privada con tus amigos. Aquí te explicamos cómo funciona y dónde hacer tus pronósticos.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href={withLocale(locale as Locale, '/porra')}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-6 py-3 text-sm font-bold text-black transition-all hover:opacity-90 active:scale-95"
          >
            <Trophy className="h-4 w-4" /> Hacer mi porra gratis
          </Link>
          <Link
            href={withLocale(locale as Locale, '/2026/favoritos-ganar-mundial')}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-6 py-3 text-sm font-semibold text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
          >
            <TrendingUp className="h-4 w-4" /> Ver los favoritos y cuotas
          </Link>
        </div>
      </header>

      <section className="mx-auto mt-20 w-full max-w-[1200px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <CheckCircle2 className="inline h-3 w-3 mr-1" />
          Cómo funciona
        </div>
        <h2 className="mt-4 font-display text-fluid-h1 uppercase leading-[0.95]">
          Predecir el Mundial, paso a paso
        </h2>
        <ul className="mt-12 grid gap-3 md:grid-cols-2">
          {PASOS.map(({ icon: Icon, title, body }) => (
            <li
              key={title}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-7"
            >
              <Icon className="h-6 w-6 text-[var(--color-pitch)]" />
              <h3 className="mt-4 font-display text-2xl uppercase leading-tight">{title}</h3>
              <p className="mt-3 leading-relaxed text-[var(--color-fg-muted)]">{body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto mt-20 w-full max-w-[1200px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Qué puedes predecir
        </div>
        <h2 className="mt-4 font-display text-fluid-h1 uppercase leading-[0.95]">
          Del primer partido a la final
        </h2>
        <div className="mt-8 max-w-3xl space-y-5 text-lg leading-relaxed text-[var(--color-fg-muted)]">
          <p>
            El Mundial 2026 es el primero con <strong className="text-[var(--color-fg)]">48 selecciones y 104 partidos</strong>, repartidos entre México, Estados Unidos y Canadá del 11 de junio al 19 de julio. Eso son muchas oportunidades de demostrar tu olfato futbolístico.
          </p>
          <p>
            En tu porra puedes predecir el <strong className="text-[var(--color-fg)]">resultado exacto de cada partido</strong> de la fase de grupos, los cruces de octavos, cuartos, semifinales y la final. Y por encima de todo eso, tus <strong className="text-[var(--color-fg)]">apuestas grandes</strong>: quién levanta la Copa, quién pierde la final y quién se lleva la Bota de Oro como máximo goleador.
          </p>
          <p>
            Antes de lanzarte, échale un ojo a quiénes son los <Link className="text-[var(--color-pitch)] underline-offset-4 hover:underline" href={withLocale(locale as Locale, '/2026/favoritos-ganar-mundial')}>favoritos para ganar el Mundial 2026</Link>, repasa el <Link className="text-[var(--color-pitch)] underline-offset-4 hover:underline" href={withLocale(locale as Locale, '/2026/calendario')}>calendario completo</Link> y consulta los <Link className="text-[var(--color-pitch)] underline-offset-4 hover:underline" href={withLocale(locale as Locale, '/2026/grupos')}>grupos del Mundial</Link> para afinar tus pronósticos.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-[1200px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-8 md:p-12">
          <h2 className="font-display text-fluid-h1 uppercase leading-[0.95]">
            ¿Listo para predecir el Mundial?
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--color-fg-muted)]">
            Crea tu porra gratis en menos de un minuto, rellena tus predicciones y empieza a competir. Sin coste, sin letra pequeña.
          </p>
          <Link
            href={withLocale(locale as Locale, '/porra')}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-7 py-3.5 text-sm font-bold text-black transition-all hover:opacity-90 active:scale-95"
          >
            <Trophy className="h-4 w-4" /> Empezar mi porra del Mundial 2026
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-20 mb-24 w-full max-w-[1200px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Preguntas frecuentes
        </div>
        <h2 className="mt-4 font-display text-fluid-h1 uppercase leading-[0.95]">
          Dudas sobre las predicciones
        </h2>
        <dl className="mt-10 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
          {FAQ.map(({ q, a }) => (
            <div key={q} className="py-6">
              <dt className="font-display text-xl uppercase leading-tight text-[var(--color-fg)]">{q}</dt>
              <dd className="mt-3 max-w-3xl leading-relaxed text-[var(--color-fg-muted)]">{a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </article>
  );
}

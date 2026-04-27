import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ArrowLeft, ExternalLink, Tv, Globe, Wifi, AlertTriangle } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';

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
  const t = await getTranslations({ locale, namespace: 'pages.dondeVer' });
  return pageMetadata({
    locale,
    path: '/2026/donde-ver',
    title: t('title'),
    description:
      t('description'),
    keywords: [
      'dónde ver el Mundial 2026',
      'Mundial 2026 España DAZN',
      'Movistar Plus Mundial 2026',
      'cómo ver España Cabo Verde Mundial 2026',
      'cómo ver España Uruguay Mundial 2026',
      'Mundial 2026 gratis',
      'Mundial 2026 RTVE',
      'Mundial 2026 streaming',
      'partidos selección España Mundial',
    ],
  });
}

// ─── Datos verificados (abril 2026) ───────────────────────────────

// Cadena de derechos en España: Mediapro adquirió los derechos
// de FIFA y sublicencia a RTVE (abierto), Movistar Plus+ y DAZN.
// Verificación: comunicados Mediapro/RTVE (febrero 2026).
const PLATAFORMAS = [
  {
    name: 'RTVE',
    sub: 'Acuerdo con Mediapro confirmado',
    price: 'Gratis',
    coverage: 'Inaugural, todos los partidos de España, un partido por jornada, octavos, cuartos, semifinales y final',
    extras: 'Emisión en abierto en La 1 y RTVE Play. Comentarios en castellano.',
    url: 'https://www.rtve.es',
    primary: true,
  },
  {
    name: 'Movistar Plus+',
    sub: 'Sublicencia con Mediapro',
    price: 'Desde 14 €/mes (clientes Movistar) · 9,99 €/mes OTT',
    coverage: 'Los 104 partidos en directo + 4K HDR + audio Dolby',
    extras: 'Análisis previos y post-partido, contenido exclusivo',
    url: 'https://www.movistar.es/movistar-plus',
    primary: true,
  },
  {
    name: 'DAZN',
    sub: 'Sublicencia con Mediapro',
    price: 'Desde 19,99 €/mes (oferta 14,99 € jóvenes)',
    coverage: 'Todos los partidos del Mundial 2026',
    extras: 'App, navegador, smart TV. Múltiples dispositivos',
    url: 'https://www.dazn.com/es-ES/welcome',
    primary: false,
  },
];

// Calendario verificado contra FIXTURES_2026 (sorteo final 5 dic 2025).
// Horarios: hora local de la sede.
const PARTIDOS_ESPAÑA = [
  {
    matchday: 'J1',
    fecha: '15 jun 2026',
    rival: 'España vs Cabo Verde',
    sede: 'Atlanta · Mercedes-Benz Stadium · 12:00 EDT',
    intent: 'Debut de la Roja en el Mundial',
  },
  {
    matchday: 'J2',
    fecha: '22 jun 2026',
    rival: 'España vs Arabia Saudí',
    sede: 'Atlanta · Mercedes-Benz Stadium · 12:00 EDT',
    intent: 'Segunda jornada en suelo americano',
  },
  {
    matchday: 'J3',
    fecha: '26 jun 2026',
    rival: 'Uruguay vs España',
    sede: 'Guadalajara · Estadio Akron · 18:00 CST',
    intent: 'El partido más esperado del grupo H',
  },
];

const FAQ = [
  {
    q: '¿Quién tiene los derechos del Mundial 2026 en España?',
    a: 'Mediapro adquirió los derechos del Mundial 2026 para España y los sublicencia a RTVE (en abierto), Movistar Plus+ y DAZN. RTVE emite el inaugural, todos los partidos de España, un partido por jornada de fase de grupos, octavos, cuartos, semifinales y la final. Movistar Plus+ y DAZN emiten los 104 partidos en directo. La FIFA también ofrece emisión global gratuita en su plataforma DAZN.',
  },
  {
    q: '¿Se podrán ver partidos del Mundial 2026 gratis en España?',
    a: 'Sí. RTVE confirmó en febrero de 2026 el acuerdo con Mediapro: emite en abierto el partido inaugural, los tres partidos de España en fase de grupos, un partido más por jornada, los octavos, los cuartos, las dos semifinales y la final. La señal estará en La 1 y RTVE Play sin coste.',
  },
  {
    q: '¿Cuánto cuesta ver el Mundial 2026 en Movistar Plus+?',
    a: 'El plan más asequible que incluye Movistar Plus+ con cobertura del Mundial parte de unos 14 € al mes. Los planes con todo el deporte (incluyendo La Liga y Champions) están entre 30 y 60 € al mes según promoción.',
  },
  {
    q: '¿Cuándo juega España en el Mundial 2026?',
    a: 'España está en el Grupo H, junto a Uruguay, Arabia Saudí y Cabo Verde. El primer partido es el 15 de junio contra Cabo Verde en Atlanta (Mercedes-Benz Stadium) a las 12:00 EDT. El segundo el 22 de junio contra Arabia Saudí en Atlanta a las 12:00 EDT. El tercero y más esperado, el 26 de junio contra Uruguay en Guadalajara (Estadio Akron) a las 18:00 CST.',
  },
  {
    q: '¿Cómo ver el Mundial 2026 desde el extranjero siendo español?',
    a: 'Los suscriptores de Movistar Plus+ pueden ver contenidos vía la app dentro de la UE por geo-portabilidad. Para fuera de la UE, lo más limpio es contratar una eSIM de datos local (Holafly, Airalo) y usar la app, o suscribirse a la plataforma local del país (Fox/Telemundo en USA, etc.).',
  },
  {
    q: '¿Cuándo es la final del Mundial 2026 y dónde verla?',
    a: 'La final se juega el 19 de julio de 2026 a las 15:00 ET (21:00 hora peninsular española) en el MetLife Stadium de Nueva Jersey, que FIFA renombra «New York New Jersey Stadium» durante el torneo. Se emitirá en abierto en RTVE (La 1 y RTVE Play) y también en Movistar Plus+ y DAZN.',
  },
  {
    q: '¿Cuántos partidos tiene el Mundial 2026?',
    a: 'Por primera vez en la historia se disputan 104 partidos: 72 de fase de grupos (12 grupos × 6 partidos), 16 dieciseisavos, 8 octavos, 4 cuartos, 2 semifinales, partido por el tercer puesto y la final.',
  },
];

// ────────────────────────────────────────────────────────────────────

export default async function DondeVerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Dónde ver el Mundial 2026 en España',
    description:
      'Guía completa de plataformas, precios y opciones para ver todos los partidos del Mundial 2026 en España.',
    author: { '@type': 'Organization', name: 'Mundial de Fútbol' },
    publisher: {
      '@type': 'Organization',
      name: 'Mundial de Fútbol',
      url: localeUrl(locale, '/'),
    },
    datePublished: '2026-04-26',
    dateModified: '2026-04-26',
    mainEntityOfPage: localeUrl(locale, '/2026/donde-ver'),
  };

  return (
    <article className="relative">
      <JsonLd
        data={[
          articleLd,
          faqLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Mundial 2026', path: '/2026' },
            { name: 'Dónde ver', path: '/2026/donde-ver' },
          ]),
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div
            className="absolute inset-x-0 top-0 h-[60%]"
            style={{
              background:
                'radial-gradient(ellipse at top, rgba(78, 222, 128, 0.15), transparent 60%)',
            }}
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1100px] px-6 md:px-10">
          <Link
            href={withLocale(locale as Locale, '/2026')}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
          >
            <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Mundial 2026
          </Link>

          <div className="mt-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            <Tv className="h-4 w-4" />
            <span>España · Mundial 2026</span>
          </div>

          <h1 className="mt-6 font-display text-fluid-display uppercase leading-[0.9]">
            Dónde ver<br />el Mundial 2026
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
            Cómo ver los 104 partidos del Mundial 2026 en España: Movistar Plus+,
            RTVE en abierto, Movistar Plus+, DAZN y consejos para ver España vs Cabo Verde, Arabia Saudí y Uruguay
            sin perderte un minuto. Información actualizada a abril de 2026.
          </p>
        </div>
      </section>

      {/* Plataformas */}
      <section className="mx-auto w-full max-w-[1100px] px-6 py-16 md:px-10 md:py-20">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Plataformas con derechos
        </div>
        <h2 className="mt-4 font-display text-fluid-h2 uppercase leading-[0.95]">
          Las opciones reales en España
        </h2>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PLATAFORMAS.map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className={`group flex flex-col gap-4 rounded-3xl border p-6 transition-colors md:p-7 ${
                p.primary
                  ? 'border-[var(--color-pitch)]/30 bg-gradient-to-br from-[var(--color-pitch)]/5 via-[var(--color-bg-2)] to-[var(--color-bg-2)] hover:border-[var(--color-pitch)]/50'
                  : 'border-[var(--color-border)] bg-[var(--color-bg-2)] hover:border-[var(--color-border-strong)]'
              }`}
            >
              {p.primary && (
                <span className="inline-flex w-fit rounded-full bg-[var(--color-pitch)] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-black">
                  Derechos confirmados
                </span>
              )}
              <h3 className="font-display text-2xl uppercase leading-tight text-[var(--color-fg)]">
                {p.name}
              </h3>
              <p className="text-sm text-[var(--color-fg-muted)]">{p.sub}</p>
              <div className="font-mono text-base text-[var(--color-pitch)]">{p.price}</div>
              <div className="space-y-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                <p>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                    Cobertura
                  </span>
                  <br />
                  {p.coverage}
                </p>
                <p>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                    Extras
                  </span>
                  <br />
                  {p.extras}
                </p>
              </div>
              <div className="mt-auto inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-fg)] transition-colors group-hover:text-[var(--color-pitch)]">
                Ir al sitio oficial <ExternalLink className="h-3 w-3" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* España en el Mundial */}
      <section className="mx-auto w-full max-w-[1100px] px-6 py-16 md:px-10 md:py-20">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          La Roja · Grupo H
        </div>
        <h2 className="mt-4 font-display text-fluid-h2 uppercase leading-[0.95]">
          Partidos de España
        </h2>

        <ol className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)]">
          {PARTIDOS_ESPAÑA.map((p) => (
            <li key={p.matchday} className="bg-[var(--color-bg)] p-6 md:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-3xl text-[var(--color-fg-subtle)]">
                    {p.matchday}
                  </span>
                  <h3 className="font-display text-xl uppercase text-[var(--color-fg)] md:text-2xl">
                    {p.rival}
                  </h3>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
                  {p.fecha}
                </span>
              </div>
              <p className="mt-3 text-sm text-[var(--color-fg-muted)]">{p.intent}</p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                {p.sede}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-6">
          <Link
            href={withLocale(locale as Locale, '/selecciones/ESP')}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-pitch)]"
          >
            Ficha completa España →
          </Link>
        </div>
      </section>

      {/* Desde el extranjero */}
      <section className="mx-auto w-full max-w-[1100px] px-6 py-16 md:px-10 md:py-20">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Si estás de viaje
        </div>
        <h2 className="mt-4 font-display text-fluid-h2 uppercase leading-[0.95]">
          Ver el Mundial desde fuera de España
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-fg-muted)]">
          Si vas a USA/México/Canadá durante el Mundial, hay tres caminos prácticos
          para no perderte un partido.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
            <Globe className="h-5 w-5 text-[var(--color-pitch)]" />
            <h3 className="mt-4 font-display text-lg uppercase">Movistar+ con geo-portabilidad UE</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
              Si viajas a otro país de la UE, la app funciona igual que en España.
              Fuera de la UE necesitas otra solución.
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
            <Wifi className="h-5 w-5 text-[var(--color-pitch)]" />
            <h3 className="mt-4 font-display text-lg uppercase">eSIM española en EE.&nbsp;UU.</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
              Holafly o Airalo te dan datos en USA con IP española en algunos planes.
              30-70 € por todo el viaje.
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
            <Tv className="h-5 w-5 text-[var(--color-pitch)]" />
            <h3 className="mt-4 font-display text-lg uppercase">Plataforma local USA</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
              Fox + Tubi (gratis con anuncios) en inglés. Telemundo / Universo +
              Peacock en español. Pagar Peacock un mes (8 $) cubre todo el torneo.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto w-full max-w-[1100px] px-6 py-16 md:px-10 md:py-20">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Preguntas frecuentes
        </div>
        <h2 className="mt-4 font-display text-fluid-h2 uppercase leading-[0.95]">
          Lo que más se pregunta
        </h2>

        <div className="mt-10 divide-y divide-[var(--color-border)] border-t border-b border-[var(--color-border)]">
          {FAQ.map(({ q, a }) => (
            <details key={q} className="group py-5">
              <summary className="flex cursor-pointer items-start justify-between gap-6 text-base md:text-lg">
                <span className="font-medium text-[var(--color-fg)]">{q}</span>
                <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center font-mono text-sm text-[var(--color-fg-subtle)] transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-[var(--color-fg-muted)]">
                {a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="mx-auto w-full max-w-[1100px] px-6 pb-24 md:px-10 md:pb-32">
        <div className="flex gap-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 md:p-6">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-400" />
          <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">
            <strong className="text-[var(--color-fg)]">Información orientativa.</strong>{' '}
            Los precios, planes y derechos de emisión pueden cambiar. Antes de
            contratar, verifica directamente en la web oficial de la plataforma.
            Los enlaces a Movistar+, DAZN, RTVE y demás son de información
            pública, no de afiliación todavía.
          </p>
        </div>
      </section>
    </article>
  );
}

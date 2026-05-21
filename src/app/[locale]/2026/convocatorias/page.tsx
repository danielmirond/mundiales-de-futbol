import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Users,
  Shield,
  AlertTriangle,
  CheckCircle2,
  FileText,
} from 'lucide-react';
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
    path: '/2026/convocatorias',
    // Patrón confirmado: titular factual con fechas y datos clave en menos de 60 caracteres.
    title:
      'Convocatorias Mundial 2026: lista provisional 11 mayo, definitiva 1 junio',
    description:
      'Cuándo publican las 48 selecciones sus listas para el Mundial 2026. FIFA fija la lista preliminar el 11 de mayo y la definitiva el 1 de junio. 26 jugadores por equipo, 3 porteros obligatorios.',
    keywords: [
      'convocatoria Mundial 2026',
      'lista España Mundial 2026',
      'lista provisional Mundial 2026',
      'lista definitiva Mundial 2026',
      'cuándo se publican las listas del Mundial',
      'convocatoria Argentina Mundial 2026',
      'convocatoria Brasil Mundial 2026',
      '26 jugadores Mundial 2026',
      'reemplazo por lesión Mundial 2026',
    ],
    type: 'article',
  });
}

// ─── Datos verificados (Wikipedia "2026 FIFA World Cup squads", abr 2026) ──

const TIMELINE = [
  {
    date: '11 mayo 2026',
    title: 'Lista provisional (release list)',
    detail:
      'Cada federación entrega a FIFA una lista de entre 35 y 55 jugadores. Es interna: FIFA NO la hace pública. Los seleccionadores suelen anunciar su lista preliminar en rueda de prensa los días previos.',
    icon: 'list',
  },
  {
    date: '1 junio 2026',
    title: 'Lista definitiva',
    detail:
      'Plazo límite para entregar a FIFA la convocatoria final: entre 23 y 26 jugadores, con 3 porteros obligatorios. La gran mayoría de selecciones publica esta lista al mismo día de entregarla.',
    icon: 'check',
  },
  {
    date: '11 junio 2026',
    title: 'Partido inaugural · Estadio Azteca',
    detail:
      'México vs Sudáfrica abre el torneo. A partir de aquí, los reemplazos por lesión solo se permiten hasta 24 horas antes del PRIMER partido del propio equipo, validados por el médico del seleccionado y un médico FIFA.',
    icon: 'kickoff',
  },
];

const SIZE_HISTORY = [
  { year: 1982, size: 22 },
  { year: 1998, size: 22 },
  { year: 2002, size: 23 },
  { year: 2006, size: 23 },
  { year: 2010, size: 23 },
  { year: 2014, size: 23 },
  { year: 2018, size: 23 },
  { year: 2022, size: 26, note: 'Pandemia: FIFA elevó el tope a 26 ya en Qatar.' },
  { year: 2026, size: 26, note: 'Se mantiene el tope de 26 para 48 selecciones.' },
];

const FAQ = [
  {
    q: '¿Cuándo publican las selecciones la lista del Mundial 2026?',
    a: 'FIFA fija dos plazos: el 11 de mayo de 2026 las federaciones envían una lista provisional de 35 a 55 jugadores (que FIFA no hace pública) y el 1 de junio de 2026 entregan la lista definitiva de 23 a 26 jugadores. La mayoría de selecciones anuncia ambas en rueda de prensa el mismo día del envío a FIFA o en los días previos.',
  },
  {
    q: '¿Cuántos jugadores van por selección al Mundial 2026?',
    a: 'Entre 23 y 26 jugadores, con 3 porteros obligatorios. Es el mismo formato que se aplicó en Qatar 2022. En Mundiales anteriores hasta 2018 el tope eran 23 jugadores.',
  },
  {
    q: '¿Cuándo dará la lista España para el Mundial 2026?',
    a: 'La RFEF tradicionalmente publica su lista provisional en una rueda de prensa en Las Rozas a inicios de mayo. La fecha exacta no está confirmada, pero se espera entre el 5 y el 11 de mayo de 2026, antes del plazo FIFA. La lista definitiva se conocerá entre el 25 de mayo y el 1 de junio.',
  },
  {
    q: '¿Qué pasa si un jugador se lesiona después de presentar la lista?',
    a: 'Hasta 24 horas antes del primer partido de su selección, FIFA permite sustituirlo si el médico del equipo y un médico FIFA certifican la lesión. Una vez disputado el primer partido, no hay sustituciones permitidas: el equipo termina el torneo con los jugadores aptos restantes.',
  },
  {
    q: '¿Por qué la lista es de 26 jugadores y no de 23 como antes?',
    a: 'FIFA amplió el tope a 26 en Qatar 2022 como excepción por la pandemia y la cercanía con la temporada europea. Para 2026 se mantiene la cifra: con 48 selecciones y un calendario más exigente (32avos añadidos), tiene sentido permitir más rotación.',
  },
  {
    q: '¿Pueden cambiar la lista entre el 1 y el 11 de junio?',
    a: 'Sí, pero solo por lesión o enfermedad confirmadas. Cada cambio requiere certificado del médico del seleccionado y validación del médico general FIFA. No hay sustituciones libres.',
  },
  {
    q: '¿Cuántos porteros tienen que llevar?',
    a: 'Tres porteros obligatorios dentro del rango 23-26. Si una selección lleva 26 jugadores, tendrá 3 porteros y 23 jugadores de campo. Si lleva 23, tendrá 3 porteros y 20 de campo.',
  },
  {
    q: '¿Cuándo se publican las dorsales (números de camiseta)?',
    a: 'Junto con la lista definitiva del 1 de junio. FIFA exige que cada jugador lleve un número fijo del 1 al 26 durante todo el torneo y la AFA, la RFEF y demás federaciones suelen revelarlas el mismo día del anuncio oficial.',
  },
];

const FEDERATIONS_NEXT_LIST = [
  { code: 'ESP', name: 'España', flag: '🇪🇸', expected: 'Primera semana de mayo (Las Rozas, RFEF)' },
  { code: 'ARG', name: 'Argentina', flag: '🇦🇷', expected: 'Mediados de mayo (Ezeiza, AFA)' },
  { code: 'BRA', name: 'Brasil', flag: '🇧🇷', expected: 'Mediados de mayo (Granja Comary, CBF)' },
  { code: 'FRA', name: 'Francia', flag: '🇫🇷', expected: 'Primera quincena de mayo (Clairefontaine, FFF)' },
  { code: 'GER', name: 'Alemania', flag: '🇩🇪', expected: 'Primera quincena de mayo (Frankfurt, DFB)' },
  { code: 'POR', name: 'Portugal', flag: '🇵🇹', expected: 'Primera quincena de mayo (Cidade do Futebol, FPF)' },
  { code: 'ENG', name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', expected: 'Primera quincena de mayo (St. George\'s Park, FA)' },
  { code: 'NED', name: 'Países Bajos', flag: '🇳🇱', expected: 'Primera quincena de mayo (KNVB Campus, KNVB)' },
];

export default async function Convocatorias2026({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline:
      'Convocatorias Mundial 2026: lista provisional 11 mayo, definitiva 1 junio',
    description:
      'Calendario oficial FIFA para que las 48 selecciones publiquen sus listas del Mundial 2026: lista preliminar el 11 de mayo, definitiva el 1 de junio.',
    url: localeUrl(locale, '/2026/convocatorias'),
    inLanguage: locale,
    publisher: { '@type': 'Organization', name: SEO.siteName, url: SEO.siteUrl },
    about: {
      '@type': 'SportsEvent',
      name: 'FIFA World Cup 2026',
      startDate: '2026-06-11',
      endDate: '2026-07-19',
    },
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
            { name: 'Convocatorias', path: '/2026/convocatorias' },
          ]),
        ]}
      />

      {/* Hero */}
      <header className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/2026')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Mundial 2026
        </Link>

        <div className="mt-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <FileText className="h-4 w-4" />
          <span>Convocatorias · Plazos FIFA</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          Listas<br />Mundial 2026
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          Las 48 selecciones del Mundial 2026 entregan a FIFA la lista
          provisional el 11 de mayo y la definitiva el 1 de junio. Aquí el
          calendario oficial, el tamaño del squad, las reglas de sustitución
          por lesión y cuándo se espera el anuncio público de cada federación.
        </p>
      </header>

      {/* Timeline 3 hitos */}
      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <div className="grid gap-px overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-border)] md:grid-cols-3">
          {TIMELINE.map((t) => (
            <div key={t.date} className="bg-[var(--color-bg-2)] p-7 md:p-8">
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
                <Calendar className="h-3 w-3" />
                {t.date}
              </div>
              <h3 className="mt-3 font-display text-xl uppercase leading-tight text-[var(--color-fg)] md:text-2xl">
                {t.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                {t.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Datos del squad */}
      <section className="mx-auto mt-20 w-full max-w-[1100px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Users className="inline h-3 w-3 mr-2" />
          Tamaño del squad
        </div>
        <h2 className="mt-3 font-display text-3xl uppercase leading-[1] md:text-4xl">
          26 jugadores por selección
        </h2>
        <p className="mt-6 max-w-3xl text-base leading-relaxed text-[var(--color-fg-muted)] md:text-lg">
          Entre 23 y 26 jugadores totales por convocatoria, con un mínimo
          obligatorio de <strong className="text-[var(--color-fg)]">3 porteros</strong>.
          Es el mismo tope que se aplicó por primera vez en Qatar 2022.
          Hasta Rusia 2018 inclusive, las selecciones podían llevar como
          máximo 23 jugadores. La ampliación se introdujo durante la pandemia
          para dar más rotación, y FIFA la consolida en 2026 con un torneo
          más largo y exigente (la nueva ronda de 32avos añade un partido).
        </p>

        <div className="mt-10 overflow-hidden rounded-2xl border border-[var(--color-border)]">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-2)] text-left font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                <th className="px-4 py-4">Mundial</th>
                <th className="px-4 py-4 text-right">Tope de jugadores</th>
                <th className="px-4 py-4">Nota</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {SIZE_HISTORY.map((row) => (
                <tr
                  key={row.year}
                  className={`hover:bg-[var(--color-bg-2)]/40 ${
                    row.year === 2026 ? 'bg-[var(--color-pitch)]/5' : ''
                  }`}
                >
                  <td className="px-4 py-3 font-mono tab-num text-[var(--color-fg)]">
                    {row.year}
                  </td>
                  <td className="px-4 py-3 text-right font-mono tab-num text-[var(--color-fg)]">
                    {row.size}
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--color-fg-muted)]">
                    {row.note ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Reemplazos por lesión */}
      <section className="mx-auto mt-20 w-full max-w-[1100px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Shield className="inline h-3 w-3 mr-2" />
          Sustituciones
        </div>
        <h2 className="mt-3 font-display text-3xl uppercase leading-[1] md:text-4xl">
          Reglas de reemplazo por lesión
        </h2>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-7">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              Permitido
            </div>
            <h3 className="mt-3 font-display text-xl uppercase leading-tight">
              Antes del primer partido
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">
              Hasta 24 horas antes del primer partido del equipo, FIFA permite
              sustituir a un jugador convocado por lesión o enfermedad. El
              médico del seleccionado certifica el caso y un médico general
              FIFA lo valida. Ocurre habitualmente en cada Mundial: la última
              cesión de Bayern, Madrid o Manchester deja a alguien fuera y
              entra el suplente que estaba en la lista provisional.
            </p>
          </div>
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-7">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-amber-300">
              <AlertTriangle className="h-4 w-4" />
              Prohibido
            </div>
            <h3 className="mt-3 font-display text-xl uppercase leading-tight">
              Una vez empezado el torneo
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">
              Disputado el primer partido del equipo, FIFA NO admite
              sustituciones. Aunque un jugador caiga lesionado en la primera
              jornada, el seleccionado completa el torneo con los jugadores
              aptos restantes. Esa fue la situación de Italia con Cabrini en
              1990, Argentina con Caniggia y muchas otras: una vez dentro,
              dentro hasta el final.
            </p>
          </div>
        </div>
      </section>

      {/* Cuándo lo dirá cada federación */}
      <section className="mx-auto mt-20 w-full max-w-[1100px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Federaciones top
        </div>
        <h2 className="mt-3 font-display text-3xl uppercase leading-[1] md:text-4xl">
          Cuándo lo dirá cada selección
        </h2>
        <p className="mt-6 max-w-3xl text-base text-[var(--color-fg-muted)]">
          Estimación de fecha y lugar del anuncio público de la lista,
          basada en el patrón de cada federación en Mundiales anteriores.
          Las cifras se confirmarán a medida que cada selección las haga
          oficiales.
        </p>

        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {FEDERATIONS_NEXT_LIST.map((f) => (
            <li
              key={f.code}
              className="flex items-start gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5"
            >
              <span aria-hidden className="text-3xl">
                {f.flag}
              </span>
              <div className="flex-1">
                <div className="font-display text-xl uppercase leading-none text-[var(--color-fg)]">
                  {f.name}
                </div>
                <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
                  {f.expected}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section className="mx-auto mt-20 w-full max-w-[900px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Preguntas frecuentes
        </div>
        <h2 className="mt-3 font-display text-3xl uppercase leading-[1] md:text-4xl">
          Lo que más se pregunta
        </h2>

        <ul className="mt-10 space-y-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)]">
          {FAQ.map((item) => (
            <li key={item.q} className="bg-[var(--color-bg)] p-6 md:p-7">
              <h3 className="font-display text-lg uppercase leading-tight text-[var(--color-fg)] md:text-xl">
                {item.q}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)] md:text-base">
                {item.a}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
          Fuente: «Regulations, FIFA World Cup 26» (PDF, 19 marzo 2026) ·
          Wikipedia «2026 FIFA World Cup squads». Última verificación: abril
          2026.
        </p>
      </section>

      {/* CTA hub */}
      <section className="mx-auto mb-24 mt-20 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-pitch)]/8 via-[var(--color-bg-2)] to-[var(--color-bg-2)] p-10 md:p-14">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            Más del Mundial 2026
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={withLocale(locale as Locale, '/2026/calendario')}
              className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
            >
              Calendario por fase
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
            </Link>
            <Link
              href={withLocale(locale as Locale, '/2026/grupos')}
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              12 grupos
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
            </Link>
            <Link
              href={withLocale(locale as Locale, '/2026/sedes')}
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              16 sedes
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
            </Link>
            <Link
              href={withLocale(locale as Locale, '/selecciones/ESP/grupo-h')}
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              España · Grupo H
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight, CalendarClock, Clock, MapPin, Tv } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl, SEO } from '@/lib/seo';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

/**
 * Landing dedicada a la query "cuándo juega España" (18.100 búsquedas
 * mensuales en ES + 8.100 de "a qué hora juega España"). Captura el
 * intent transaccional clásico: "¿cuándo es el próximo partido y
 * dónde lo veo?".
 *
 * La página se actualiza manualmente cuando cambia el próximo partido.
 * Estructura: próximo partido como bloque hero + amistosos pre-Mundial
 * + calendario Mundial completo (Grupo H) + canales de TV + FAQ.
 */

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/cuando-juega-espana',
    title:
      '¿Cuándo juega España? Próximo partido, hora, canal de TV y calendario Mundial 2026',
    description:
      '¿Cuándo juega España y a qué hora? Próximo partido de la selección española: amistosos pre-Mundial 2026 (Irak en Riazor el 4 de junio, Perú en Puebla el 8 de junio), debut contra Cabo Verde el 15 de junio en el Mercedes-Benz Stadium de Atlanta, calendario completo del Grupo H con Arabia Saudí y Uruguay. Horario español, canal de TV (RTVE La 1, Movistar Plus+), streaming gratis y datos del estadio.',
    keywords: [
      'cuándo juega España',
      'a qué hora juega España',
      'cuándo juega España fútbol',
      'cuándo juega España el Mundial',
      'a qué hora juega España la final',
      'cuándo juega España hoy',
      'partido España hoy',
      'próximo partido España',
      'cuándo es el próximo partido de España',
      'cuándo juega España selección',
      'canal partido España hoy',
      'dónde ver España en directo',
      'horario partido España',
      'España vs hoy',
      'partidos amistosos España Mundial 2026',
      'partidos España Mundial 2026',
      'calendario España Mundial 2026',
      'cuándo es el debut de España en el Mundial',
      'primer partido España Mundial 2026',
    ],
  });
}

// Próximos partidos de España (actualizar manualmente).
// Estructura editorial — fuentes: RFEF, FIFA, calendar oficial.
const PROXIMOS = [
  {
    type: 'AMISTOSO',
    date: '2026-06-04',
    time: '21:00',
    timezone: 'CEST (Madrid)',
    rival: 'Irak',
    rivalFlag: '🇮🇶',
    venue: 'Estadio de Riazor',
    city: 'A Coruña, España',
    channel: 'La 1 de RTVE · gratis',
    streaming: 'RTVE Play',
    competition: 'Amistoso pre-Mundial',
  },
  {
    type: 'AMISTOSO',
    date: '2026-06-08',
    time: '03:00',
    timezone: 'CEST (Madrid) · 20:00 CDT Puebla',
    rival: 'Perú',
    rivalFlag: '🇵🇪',
    venue: 'Estadio Cuauhtémoc',
    city: 'Puebla, México',
    channel: 'La 1 de RTVE · gratis',
    streaming: 'RTVE Play',
    competition: 'Amistoso pre-Mundial (concentración México-USA)',
  },
];

const MUNDIAL_2026 = [
  {
    n: 1,
    date: '2026-06-15',
    time: '18:00',
    timezone: 'CEST',
    timeUS: '12:00',
    timezoneUS: 'EDT Atlanta',
    rival: 'Cabo Verde',
    rivalFlag: '🇨🇻',
    venue: 'Mercedes-Benz Stadium',
    city: 'Atlanta, Estados Unidos',
    competition: 'Mundial 2026 · Grupo H · J1',
    channel: 'La 1 de RTVE · Movistar Plus+ Deportes',
    streaming: 'RTVE Play (gratis) · Movistar+ (suscripción)',
  },
  {
    n: 2,
    date: '2026-06-20',
    time: '21:00',
    timezone: 'CEST',
    timeUS: '15:00',
    timezoneUS: 'EDT Filadelfia',
    rival: 'Arabia Saudí',
    rivalFlag: '🇸🇦',
    venue: 'Lincoln Financial Field',
    city: 'Filadelfia, Estados Unidos',
    competition: 'Mundial 2026 · Grupo H · J2',
    channel: 'La 1 de RTVE · Movistar Plus+ Deportes',
    streaming: 'RTVE Play (gratis) · Movistar+ (suscripción)',
  },
  {
    n: 3,
    date: '2026-06-25',
    time: '03:00',
    timezone: 'CEST · 20:00 CDT Guadalajara',
    timeUS: '20:00',
    timezoneUS: 'CDT Guadalajara',
    rival: 'Uruguay',
    rivalFlag: '🇺🇾',
    venue: 'Estadio Akron',
    city: 'Guadalajara, México',
    competition: 'Mundial 2026 · Grupo H · J3',
    channel: 'La 1 de RTVE · Movistar Plus+ Deportes',
    streaming: 'RTVE Play (gratis) · Movistar+ (suscripción)',
  },
];

export default async function CuandoJuegaEspanaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const proximo = PROXIMOS[0];

  const sportsEventLd = MUNDIAL_2026.map((m) => ({
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: `España vs ${m.rival} · ${m.competition}`,
    startDate: `${m.date}T${m.time}:00+02:00`,
    location: { '@type': 'Place', name: `${m.venue}, ${m.city}` },
    competitor: [
      { '@type': 'SportsTeam', name: 'España' },
      { '@type': 'SportsTeam', name: m.rival },
    ],
    organizer: { '@type': 'Organization', name: 'FIFA' },
  }));

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '¿Cuándo juega España su próximo partido?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `El próximo partido de España es el ${proximo.date} a las ${proximo.time} hora peninsular contra ${proximo.rival} en ${proximo.venue} de ${proximo.city}. Es ${proximo.competition.toLowerCase()}. Se retransmite por ${proximo.channel}.`,
        },
      },
      {
        '@type': 'Question',
        name: '¿A qué hora juega España en el Mundial 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'España disputa tres partidos en la fase de grupos del Mundial 2026: el 15 de junio contra Cabo Verde a las 18:00 hora peninsular española (Mercedes-Benz Stadium, Atlanta), el 20 de junio contra Arabia Saudí a las 21:00 (Lincoln Financial Field, Filadelfia) y el 25 de junio contra Uruguay a las 03:00 hora de Madrid (Estadio Akron, Guadalajara, México).',
        },
      },
      {
        '@type': 'Question',
        name: '¿Cuándo es el debut de España en el Mundial 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'España debuta el lunes 15 de junio de 2026 a las 18:00 hora de Madrid (12:00 hora del Este USA) contra Cabo Verde, en el Mercedes-Benz Stadium de Atlanta. Es el primer partido de España en un Mundial desde la eliminación de Catar 2022 contra Marruecos.',
        },
      },
      {
        '@type': 'Question',
        name: '¿En qué canal puedo ver España?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Todos los partidos de España en el Mundial 2026 se emiten en abierto por La 1 de RTVE (gratuito) y en pago por Movistar Plus+ Deportes (dial 53). RTVE también ofrece streaming gratuito en RTVE Play (web y app). Los amistosos pre-Mundial también van por La 1 de RTVE.',
        },
      },
      {
        '@type': 'Question',
        name: '¿En qué grupo está España en el Mundial 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'España está en el Grupo H del Mundial 2026, junto con Cabo Verde, Arabia Saudí y Uruguay. Los dos primeros del grupo pasan directos a dieciseisavos; el tercero puede clasificarse como mejor tercero entre los 12 grupos.',
        },
      },
    ],
  };

  return (
    <article className="pt-32 pb-24">
      <JsonLd
        data={[
          ...sportsEventLd,
          faqLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: '¿Cuándo juega España?', path: '/cuando-juega-espana' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Inicio
        </Link>

        <div className="mt-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <CalendarClock className="h-4 w-4" />
          <span>Próximo partido de España</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          ¿Cuándo juega España?
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          El próximo partido de la selección española es <strong>{proximo.date}</strong> a las <strong>{proximo.time}h</strong> ({proximo.timezone}) contra <strong>{proximo.rivalFlag} {proximo.rival}</strong>. Se juega en {proximo.venue}, {proximo.city}, y se emite por <strong>{proximo.channel}</strong>. Calendario completo con amistosos pre-Mundial y los tres partidos del Grupo H abajo.
        </p>
      </header>

      {/* Próximo partido — bloque hero destacado */}
      <section className="mx-auto mt-12 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-pitch)]/40 bg-gradient-to-br from-[var(--color-pitch)]/15 via-[var(--color-bg-2)] to-[var(--color-bg-2)] p-8 md:p-10">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            <Clock className="h-3 w-3" />
            <span>Próximo · {proximo.type}</span>
          </div>
          <div className="mt-4 flex flex-wrap items-baseline gap-4">
            <span className="font-display text-4xl uppercase text-[var(--color-fg)] md:text-5xl">
              🇪🇸 España
            </span>
            <span className="font-display text-2xl text-[var(--color-fg-subtle)]">vs</span>
            <span className="font-display text-4xl uppercase text-[var(--color-fg)] md:text-5xl">
              {proximo.rivalFlag} {proximo.rival}
            </span>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">Fecha y hora</div>
              <div className="mt-1 font-display text-2xl tab-num text-[var(--color-fg)]">{proximo.date} · {proximo.time}h</div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">{proximo.timezone}</div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">Sede</div>
              <div className="mt-1 flex items-center gap-2 font-display text-lg text-[var(--color-fg)]">
                <MapPin className="h-4 w-4 text-[var(--color-pitch)]" />
                {proximo.venue}
              </div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">{proximo.city}</div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">Canal de TV</div>
              <div className="mt-1 flex items-center gap-2 font-display text-lg text-[var(--color-fg)]">
                <Tv className="h-4 w-4 text-[var(--color-pitch)]" />
                {proximo.channel}
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">Streaming</div>
              <div className="mt-1 font-display text-lg text-[var(--color-fg)]">{proximo.streaming}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Amistosos pre-Mundial */}
      <section className="mx-auto mt-12 w-full max-w-[1100px] px-6 md:px-10">
        <h2 className="font-display text-3xl uppercase">Amistosos pre-Mundial 2026</h2>
        <p className="mt-3 text-sm text-[var(--color-fg-muted)]">
          España disputa dos amistosos antes de viajar a Estados Unidos. Última oportunidad para que Luis de la Fuente cierre el once titular del debut.
        </p>
        <ul className="mt-6 space-y-3">
          {PROXIMOS.map((p, i) => (
            <li
              key={i}
              className="grid gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5 md:grid-cols-[180px_1fr_auto]"
            >
              <div>
                <div className="font-display text-xl uppercase tab-num text-[var(--color-fg)]">{p.date}</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">{p.time}h {p.timezone}</div>
              </div>
              <div>
                <div className="font-display text-lg uppercase text-[var(--color-fg)]">🇪🇸 vs {p.rivalFlag} {p.rival}</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
                  <MapPin className="inline h-3 w-3 mr-1" />
                  {p.venue}, {p.city}
                </div>
              </div>
              <div className="text-right md:text-left">
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-pitch)]">
                  <Tv className="inline h-3 w-3 mr-1" />
                  {p.channel}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Mundial 2026: los 3 partidos del Grupo H */}
      <section className="mx-auto mt-12 w-full max-w-[1100px] px-6 md:px-10">
        <h2 className="font-display text-3xl uppercase">Partidos de España en el Mundial 2026</h2>
        <p className="mt-3 text-sm text-[var(--color-fg-muted)]">
          Tres partidos en la fase de grupos. Los dos primeros del Grupo H pasan a dieciseisavos directos.
        </p>
        <ul className="mt-6 space-y-3">
          {MUNDIAL_2026.map((m) => (
            <li
              key={m.n}
              className="grid gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5 md:grid-cols-[60px_180px_1fr_auto]"
            >
              <div className="font-display text-4xl uppercase tab-num text-[var(--color-pitch)]">J{m.n}</div>
              <div>
                <div className="font-display text-xl uppercase tab-num text-[var(--color-fg)]">{m.date}</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
                  {m.time}h {m.timezone} · {m.timeUS}h {m.timezoneUS}
                </div>
              </div>
              <div>
                <div className="font-display text-lg uppercase text-[var(--color-fg)]">🇪🇸 vs {m.rivalFlag} {m.rival}</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
                  <MapPin className="inline h-3 w-3 mr-1" />
                  {m.venue}, {m.city}
                </div>
              </div>
              <div className="text-right md:text-left">
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-pitch)]">
                  <Tv className="inline h-3 w-3 mr-1" />
                  {m.channel}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ visible */}
      <section className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10">
        <h2 className="font-display text-3xl uppercase">Preguntas frecuentes</h2>
        <div className="mt-6 space-y-4">
          {faqLd.mainEntity.map((f) => (
            <details
              key={f.name}
              className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5"
            >
              <summary className="cursor-pointer font-display text-base uppercase text-[var(--color-fg)] group-open:text-[var(--color-pitch)]">
                {f.name}
              </summary>
              <p className="mt-3 text-base leading-relaxed text-[var(--color-fg-muted)]">{f.acceptedAnswer.text}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTAs */}
      <section className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
          <h2 className="font-display text-lg uppercase">Sigue por aquí</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={withLocale(locale as Locale, '/selecciones/ESP/grupo-h')} className="rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black">
              Grupo H completo <ArrowRight className="inline h-3 w-3 ml-1 rtl:rotate-180" />
            </Link>
            <Link href={withLocale(locale as Locale, '/2026/listas/ESP')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">Lista de De la Fuente</Link>
            <Link href={withLocale(locale as Locale, '/2026/cuando-empieza')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">Cuándo empieza el Mundial</Link>
            <Link href={withLocale(locale as Locale, '/2026/donde-ver')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">Dónde ver el Mundial</Link>
            <Link href={withLocale(locale as Locale, '/selecciones/ESP')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">Ficha de España</Link>
          </div>
        </div>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
          Calendario actualizado al 23 de mayo de 2026. Fuente: FIFA, RFEF, RTVE, Movistar Plus+. URL canónica: {SEO.siteUrl}/cuando-juega-espana.
        </p>
      </section>
    </article>
  );
}

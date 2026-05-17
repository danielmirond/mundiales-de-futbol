import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ArrowLeft, Ticket, AlertTriangle } from 'lucide-react';
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
  const t = await getTranslations({ locale, namespace: 'pages.entradas' });
  return pageMetadata({
    locale,
    path: '/2026/entradas',
    title: t('title'),
    description:
      t('description'),
    keywords: [
      'entradas Mundial 2026',
      'comprar entradas Mundial 2026',
      'precios entradas Mundial 2026',
      'Mundial 2026 fase 4 entradas',
      'cómo comprar boletos Mundial 2026',
      'FIFA tickets 2026',
      'entradas final Mundial 2026',
      'entradas inauguración Mundial 2026',
      'hospitality Mundial 2026',
    ],
  });
}

// ─── Datos verificados (abril 2026) ─────────────────────────────────

const PHASES = [
  {
    n: 1,
    name: 'Phase 1, Visa Presale Draw',
    when: 'Octubre 2025',
    desc: 'Sorteo aleatorio reservado a titulares de tarjetas Visa.',
    closed: true,
  },
  {
    n: 2,
    name: 'Phase 2, Early Ticket Draw',
    when: 'Noviembre 2025',
    desc: 'Segundo sorteo aleatorio antes de conocerse el resultado del sorteo de grupos.',
    closed: true,
  },
  {
    n: 3,
    name: 'Phase 3, Random Selection Draw',
    when: 'Diciembre 2025, enero 2026',
    desc: 'Tercer sorteo, ya con grupos conocidos. Asignación de partidos específicos por equipo.',
    closed: true,
  },
  {
    n: 4,
    name: 'Phase 4, Last-Minute Sales',
    when: 'Desde 1 abril 2026 hasta la final (19 julio)',
    desc:
      'Venta continua por orden de llegada (no sorteo). Precios dinámicos en tiempo real según demanda. Disponibilidad para los 104 partidos sujeta a inventario.',
    closed: false,
  },
];

const PRICES = [
  { stage: 'Fase de grupos · Cat. 3', from: '120 $', to: '1.200 $', notes: 'Categoría más asequible. Precios suben con demanda.' },
  { stage: 'Fase de grupos · Cat. 1', from: '300 $', to: '1.200 $', notes: 'Mejor zona del estadio. Cap superior según partido.' },
  { stage: 'Octavos', from: '180 $', to: '1.500 $', notes: 'Variación según partido y sede.' },
  { stage: 'Cuartos', from: '550 $', to: '2.500 $', notes: '' },
  { stage: 'Semifinales · Cat. 3', from: '930 $', to: '-', notes: 'Cat. 3 desde 930 $; Cat. 1 supera los 4.000 $.' },
  { stage: 'Tercer puesto', from: '300 $', to: '1.500 $', notes: '' },
  { stage: 'Final · Cat. 3', from: '1.490 $', to: '-', notes: 'Más asequible para la final.' },
  { stage: 'Final · Cat. 1', from: '6.730 $', to: '7.875 $', notes: 'Tope oficial; reventa supera los 2 M $.' },
];

const HOSPITALITY = [
  {
    name: 'FIFA Pavilion',
    from: '1.350 $/partido',
    perks: 'Asiento premium, lounge compartido, entrada rápida.',
  },
  {
    name: 'Champions Club',
    from: '2.500 $/partido',
    perks: 'Menús firmados por chefs locales, cócteles, lounge climatizado.',
  },
  {
    name: 'Pitchside Lounge',
    from: '6.000 $/partido',
    perks: 'Acceso casi al borde del campo, barra premium incluida.',
  },
  {
    name: 'Suites privadas',
    from: 'hasta 73.200 $',
    perks: 'Paquetes multipartido (incl. final) en MetLife y Azteca.',
  },
];

const FAQ = [
  {
    q: '¿Dónde se compran las entradas del Mundial 2026?',
    a: 'Solo en la web oficial fifa.com/tickets. FIFA es la única vendedora autorizada. Cualquier otro sitio que ofrezca entradas a precio nominal es una reventa o, en el peor caso, una estafa.',
  },
  {
    q: '¿Las entradas siguen disponibles en abril de 2026?',
    a: 'Sí. La Phase 4 (Last-Minute Sales) abrió el 1 de abril de 2026 y permanece activa hasta la final del 19 de julio. La compra es por orden de llegada y los precios son dinámicos: pueden subir o bajar en tiempo real según la demanda.',
  },
  {
    q: '¿Cuánto cuesta una entrada del Mundial 2026?',
    a: 'Las entradas más asequibles para el público parten de 120 $ (Cat. 3, fase de grupos en sedes de menor demanda). La final cuesta desde 1.490 $ en Cat. 3 y hasta 7.875 $ en Cat. 1. Existe un Supporter Tier de 60 $ pero está reservado a los grupos oficiales de aficionados de las selecciones participantes.',
  },
  {
    q: '¿Qué es el precio dinámico?',
    a: 'Por primera vez en un Mundial, FIFA aplica precios dinámicos: el coste de una entrada cambia en tiempo real según la demanda, las selecciones que jueguen y la sede. Una entrada que abre fase a 200 $ puede acabar costando 350 $ antes de cerrarse esa misma fase.',
  },
  {
    q: '¿Puedo comprar entradas en la reventa?',
    a: 'FIFA tiene una plataforma oficial de reventa dentro de fifa.com/tickets. Es la única forma legal y segura de revender una entrada. Webs de terceros (StubHub, Viagogo, etc.) no están autorizadas: el ticket puede ser cancelado en la entrada del estadio.',
  },
  {
    q: '¿Necesito visado para entrar a EE. UU., México o Canadá con la entrada?',
    a: 'La entrada al Mundial no exime de los requisitos migratorios. Cada país aplica sus normas: España requiere ESTA para EE. UU., FMM para México y eTA para Canadá. Los plazos de tramitación pueden ser de semanas, así que conviene resolverlo cuanto antes una vez tengas la entrada.',
  },
  {
    q: '¿Cuándo es el partido inaugural y cuándo la final?',
    a: 'La inauguración es el 11 de junio de 2026 a las 13:00 hora de México (México vs Sudáfrica) en el Estadio Azteca. La final es el 19 de julio de 2026 a las 15:00 ET en el MetLife Stadium de Nueva Jersey.',
  },
];

// ────────────────────────────────────────────────────────────────────

export default async function EntradasPage({
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

  // HowTo schema, guía paso a paso para comprar.
  const howToLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Cómo comprar entradas para el Mundial 2026',
    description:
      'Guía paso a paso para comprar entradas oficiales del Mundial 2026 en fifa.com/tickets durante la fase 4 de venta.',
    totalTime: 'PT15M',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Crea o accede a tu cuenta FIFA',
        text: 'Entra en fifa.com/tickets y crea una cuenta con email verificado. Imprescindible nombre real coincidiendo con el documento de identidad.',
        url: 'https://www.fifa.com/tickets',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Elige el partido',
        text: 'En la pestaña "Partidos" filtra por fecha, ciudad o selección. Disponibilidad sujeta a inventario y precio dinámico.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Selecciona categoría y asiento',
        text: 'Elige entre Cat. 1, 2 o 3. La opción Supporter (60 $) solo aparece si eres miembro acreditado del Fan Club de tu selección.',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Paga con Visa o tarjeta admitida',
        text: 'Visa es socio oficial. Otras tarjetas también funcionan pero pueden tener restricciones de divisa.',
      },
      {
        '@type': 'HowToStep',
        position: 5,
        name: 'Recibe la entrada digital en tu cuenta',
        text: 'Las entradas son nominativas y digitales (FIFA Mobile App). No se pueden imprimir ni transferir libremente.',
      },
    ],
  };

  return (
    <article className="relative">
      <JsonLd
        data={[
          faqLd,
          howToLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Mundial 2026', path: '/2026' },
            { name: 'Entradas', path: '/2026/entradas' },
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
            <Ticket className="h-4 w-4" />
            <span>Mundial 2026 · USA · México · Canadá</span>
          </div>

          <h1 className="mt-6 font-display text-fluid-display uppercase leading-[0.9]">
            Entradas<br />Mundial 2026
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
            Cómo comprar, qué precios hay y qué fases de venta siguen abiertas para los 104 partidos del primer Mundial de 48 selecciones. Guía actualizada a abril de 2026.
          </p>

          <p className="mt-10 inline-flex items-center gap-3 rounded-full border border-[var(--color-pitch)]/40 bg-[var(--color-pitch)]/10 px-5 py-2.5 text-sm font-mono uppercase tracking-[0.25em] text-[var(--color-pitch)]">
            <Ticket className="h-4 w-4" />
            Venta oficial: fifa.com/tickets
          </p>
        </div>
      </section>

      {/* Aviso de seguridad */}
      <section className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <div className="flex gap-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 md:p-6">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-400" />
          <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">
            <strong className="text-[var(--color-fg)]">FIFA es la única vendedora oficial.</strong> Cualquier web que ofrezca entradas a precio nominal fuera de fifa.com/tickets es reventa no autorizada o estafa. Tu entrada puede ser cancelada en la puerta del estadio.
          </p>
        </div>
      </section>

      {/* Fases de venta */}
      <section className="mx-auto w-full max-w-[1100px] px-6 py-16 md:px-10 md:py-20">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Cuándo se vendieron y qué queda
        </div>
        <h2 className="mt-4 font-display text-fluid-h2 uppercase leading-[0.95]">
          4 fases de venta
        </h2>

        <ol className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)]">
          {PHASES.map((p) => (
            <li key={p.n} className="bg-[var(--color-bg)] p-6 md:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div className="flex items-center gap-4">
                  <span className="font-display text-3xl text-[var(--color-fg-subtle)]">
                    {String(p.n).padStart(2, '0')}
                  </span>
                  <h3 className="font-display text-xl uppercase text-[var(--color-fg)]">{p.name}</h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">
                    {p.when}
                  </span>
                  {p.closed ? (
                    <span className="rounded-full border border-[var(--color-border)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                      Cerrada
                    </span>
                  ) : (
                    <span className="rounded-full border border-[var(--color-pitch)]/40 bg-[var(--color-pitch)]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-pitch)]">
                      Abierta
                    </span>
                  )}
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[var(--color-fg-muted)] md:text-base">{p.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Precios */}
      <section className="mx-auto w-full max-w-[1100px] px-6 py-16 md:px-10 md:py-20">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Tarifas oficiales · Phase 4 · Abril 2026
        </div>
        <h2 className="mt-4 font-display text-fluid-h2 uppercase leading-[0.95]">
          Precios por etapa
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-fg-muted)]">
          Precios en dólares estadounidenses, sujetos a precio dinámico de FIFA: el coste real depende de la sede, los equipos y la demanda en el momento de la compra.
        </p>

        <div className="mt-10 overflow-hidden rounded-2xl border border-[var(--color-border)]">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-2)] text-left font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                <th className="px-5 py-4">Etapa</th>
                <th className="px-5 py-4">Desde</th>
                <th className="px-5 py-4">Hasta</th>
                <th className="hidden px-5 py-4 md:table-cell">Notas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {PRICES.map((p) => (
                <tr key={p.stage} className="hover:bg-[var(--color-bg-2)]/40">
                  <td className="px-5 py-4 font-medium text-[var(--color-fg)]">{p.stage}</td>
                  <td className="px-5 py-4 font-mono text-[var(--color-pitch)]">{p.from}</td>
                  <td className="px-5 py-4 font-mono text-[var(--color-fg-muted)]">{p.to}</td>
                  <td className="hidden px-5 py-4 text-[var(--color-fg-muted)] md:table-cell">{p.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-xs leading-relaxed text-[var(--color-fg-subtle)]">
          Hay un Supporter Tier de 60 $ disponible solo para miembros acreditados de los Fan Clubs oficiales de las selecciones. La reventa de entradas para la final ha alcanzado los 2 millones de dólares por unidad en mercados secundarios.
        </p>
      </section>

      {/* Hospitality */}
      <section className="mx-auto w-full max-w-[1100px] px-6 py-16 md:px-10 md:py-20">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Paquetes premium
        </div>
        <h2 className="mt-4 font-display text-fluid-h2 uppercase leading-[0.95]">
          Hospitality
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-fg-muted)]">
          Cuando ya no hay entradas individuales asequibles, los paquetes oficiales de hospitalidad son la única vía para asistir. Se compran en hospitality.fifa.com.
        </p>

        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {HOSPITALITY.map((h) => (
            <li
              key={h.name}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:p-7"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-xl uppercase text-[var(--color-fg)]">{h.name}</h3>
                <span className="font-mono text-xs text-[var(--color-pitch)]">{h.from}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">{h.perks}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section className="mx-auto w-full max-w-[1100px] px-6 py-16 md:px-10 md:py-20">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Lo que más se pregunta
        </div>
        <h2 className="mt-4 font-display text-fluid-h2 uppercase leading-[0.95]">
          Preguntas frecuentes
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

      {/* CTA final */}
      <section className="mx-auto w-full max-w-[1100px] px-6 pb-24 md:px-10 md:pb-32">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-8 text-center md:p-14">
          <Ticket className="mx-auto h-10 w-10 text-[var(--color-pitch)]" />
          <h2 className="mt-6 font-display text-3xl uppercase leading-tight md:text-4xl">
            Cómpralas siempre en la web oficial
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[var(--color-fg-muted)]">
            Esta página es informativa: no vendemos ni revendemos entradas. Las únicas
            transacciones seguras son a través de <strong>fifa.com/tickets</strong> y el
            portal oficial de hospitality <strong>fifaworldcup26.hospitality.fifa.com</strong>.
            Cualquier otra fuente es reventa de riesgo.
          </p>
        </div>
      </section>
    </article>
  );
}

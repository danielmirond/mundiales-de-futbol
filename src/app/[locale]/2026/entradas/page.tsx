import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ArrowLeft, Ticket, AlertTriangle } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

// ─── Copy por idioma ─────────────────────────────────────────────
type Phase = { n: number; name: string; when: string; desc: string; closed: boolean };
type Price = { stage: string; from: string; to: string; notes: string };
type Hospitality = { name: string; from: string; perks: string };
type FaqItem = { q: string; a: string };
type HowToStep = { name: string; text: string };

type Copy = {
  keywords: readonly string[];
  back: string;
  heroKicker: string;
  h1: string;
  heroIntro: string;
  ctaPill: string;
  warning: { strong: string; rest: string };
  phasesKicker: string;
  phasesH2: string;
  phaseClosed: string;
  phaseOpen: string;
  phases: ReadonlyArray<Phase>;
  pricesKicker: string;
  pricesH2: string;
  pricesIntro: string;
  pricesTable: { stage: string; from: string; to: string; notes: string };
  prices: ReadonlyArray<Price>;
  supporterNote: string;
  hospitalityKicker: string;
  hospitalityH2: string;
  hospitalityIntro: string;
  hospitality: ReadonlyArray<Hospitality>;
  faqKicker: string;
  faqH2: string;
  faq: ReadonlyArray<FaqItem>;
  finalH2: string;
  finalBody: React.ReactNode;
  breadcrumbEntradas: string;
  howToName: string;
  howToDescription: string;
  howToSteps: ReadonlyArray<HowToStep>;
};

const COPY: Record<string, Copy> = {
  es: {
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
    back: 'Mundial 2026',
    heroKicker: 'Mundial 2026 · USA · México · Canadá',
    h1: 'Entradas Mundial 2026',
    heroIntro:
      'Cómo comprar, qué precios hay y qué fases de venta siguen abiertas para los 104 partidos del primer Mundial de 48 selecciones. Guía actualizada a abril de 2026.',
    ctaPill: 'Venta oficial: fifa.com/tickets',
    warning: {
      strong: 'FIFA es la única vendedora oficial.',
      rest: 'Cualquier web que ofrezca entradas a precio nominal fuera de fifa.com/tickets es reventa no autorizada o estafa. Tu entrada puede ser cancelada en la puerta del estadio.',
    },
    phasesKicker: 'Cuándo se vendieron y qué queda',
    phasesH2: '4 fases de venta',
    phaseClosed: 'Cerrada',
    phaseOpen: 'Abierta',
    phases: [
      { n: 1, name: 'Phase 1, Visa Presale Draw', when: 'Octubre 2025', desc: 'Sorteo aleatorio reservado a titulares de tarjetas Visa.', closed: true },
      { n: 2, name: 'Phase 2, Early Ticket Draw', when: 'Noviembre 2025', desc: 'Segundo sorteo aleatorio antes de conocerse el resultado del sorteo de grupos.', closed: true },
      { n: 3, name: 'Phase 3, Random Selection Draw', when: 'Diciembre 2025, enero 2026', desc: 'Tercer sorteo, ya con grupos conocidos. Asignación de partidos específicos por equipo.', closed: true },
      { n: 4, name: 'Phase 4, Last-Minute Sales', when: 'Desde 1 abril 2026 hasta la final (19 julio)', desc: 'Venta continua por orden de llegada (no sorteo). Precios dinámicos en tiempo real según demanda. Disponibilidad para los 104 partidos sujeta a inventario.', closed: false },
    ],
    pricesKicker: 'Tarifas oficiales · Phase 4 · Abril 2026',
    pricesH2: 'Precios por etapa',
    pricesIntro:
      'Precios en dólares estadounidenses, sujetos a precio dinámico de FIFA: el coste real depende de la sede, los equipos y la demanda en el momento de la compra.',
    pricesTable: { stage: 'Etapa', from: 'Desde', to: 'Hasta', notes: 'Notas' },
    prices: [
      { stage: 'Fase de grupos · Cat. 3', from: '120 $', to: '1.200 $', notes: 'Categoría más asequible. Precios suben con demanda.' },
      { stage: 'Fase de grupos · Cat. 1', from: '300 $', to: '1.200 $', notes: 'Mejor zona del estadio. Cap superior según partido.' },
      { stage: 'Octavos', from: '180 $', to: '1.500 $', notes: 'Variación según partido y sede.' },
      { stage: 'Cuartos', from: '550 $', to: '2.500 $', notes: '' },
      { stage: 'Semifinales · Cat. 3', from: '930 $', to: '-', notes: 'Cat. 3 desde 930 $; Cat. 1 supera los 4.000 $.' },
      { stage: 'Tercer puesto', from: '300 $', to: '1.500 $', notes: '' },
      { stage: 'Final · Cat. 3', from: '1.490 $', to: '-', notes: 'Más asequible para la final.' },
      { stage: 'Final · Cat. 1', from: '6.730 $', to: '7.875 $', notes: 'Tope oficial; reventa supera los 2 M $.' },
    ],
    supporterNote:
      'Hay un Supporter Tier de 60 $ disponible solo para miembros acreditados de los Fan Clubs oficiales de las selecciones. La reventa de entradas para la final ha alcanzado los 2 millones de dólares por unidad en mercados secundarios.',
    hospitalityKicker: 'Paquetes premium',
    hospitalityH2: 'Hospitality',
    hospitalityIntro:
      'Cuando ya no hay entradas individuales asequibles, los paquetes oficiales de hospitalidad son la única vía para asistir. Se compran en hospitality.fifa.com.',
    hospitality: [
      { name: 'FIFA Pavilion', from: '1.350 $/partido', perks: 'Asiento premium, lounge compartido, entrada rápida.' },
      { name: 'Champions Club', from: '2.500 $/partido', perks: 'Menús firmados por chefs locales, cócteles, lounge climatizado.' },
      { name: 'Pitchside Lounge', from: '6.000 $/partido', perks: 'Acceso casi al borde del campo, barra premium incluida.' },
      { name: 'Suites privadas', from: 'hasta 73.200 $', perks: 'Paquetes multipartido (incl. final) en MetLife y Azteca.' },
    ],
    faqKicker: 'Lo que más se pregunta',
    faqH2: 'Preguntas frecuentes',
    faq: [
      { q: '¿Dónde se compran las entradas del Mundial 2026?', a: 'Solo en la web oficial fifa.com/tickets. FIFA es la única vendedora autorizada. Cualquier otro sitio que ofrezca entradas a precio nominal es una reventa o, en el peor caso, una estafa.' },
      { q: '¿Las entradas siguen disponibles en abril de 2026?', a: 'Sí. La Phase 4 (Last-Minute Sales) abrió el 1 de abril de 2026 y permanece activa hasta la final del 19 de julio. La compra es por orden de llegada y los precios son dinámicos: pueden subir o bajar en tiempo real según la demanda.' },
      { q: '¿Cuánto cuesta una entrada del Mundial 2026?', a: 'Las entradas más asequibles para el público parten de 120 $ (Cat. 3, fase de grupos en sedes de menor demanda). La final cuesta desde 1.490 $ en Cat. 3 y hasta 7.875 $ en Cat. 1. Existe un Supporter Tier de 60 $ pero está reservado a los grupos oficiales de aficionados de las selecciones participantes.' },
      { q: '¿Qué es el precio dinámico?', a: 'Por primera vez en un Mundial, FIFA aplica precios dinámicos: el coste de una entrada cambia en tiempo real según la demanda, las selecciones que jueguen y la sede. Una entrada que abre fase a 200 $ puede acabar costando 350 $ antes de cerrarse esa misma fase.' },
      { q: '¿Puedo comprar entradas en la reventa?', a: 'FIFA tiene una plataforma oficial de reventa dentro de fifa.com/tickets. Es la única forma legal y segura de revender una entrada. Webs de terceros (StubHub, Viagogo, etc.) no están autorizadas: el ticket puede ser cancelado en la entrada del estadio.' },
      { q: '¿Necesito visado para entrar a EE. UU., México o Canadá con la entrada?', a: 'La entrada al Mundial no exime de los requisitos migratorios. Cada país aplica sus normas: España requiere ESTA para EE. UU., FMM para México y eTA para Canadá. Los plazos de tramitación pueden ser de semanas, así que conviene resolverlo cuanto antes una vez tengas la entrada.' },
      { q: '¿Cuándo es el partido inaugural y cuándo la final?', a: 'La inauguración es el 11 de junio de 2026 a las 13:00 hora de México (México vs Sudáfrica) en el Estadio Azteca. La final es el 19 de julio de 2026 a las 15:00 ET en el MetLife Stadium de Nueva Jersey.' },
    ],
    finalH2: 'Cómpralas siempre en la web oficial',
    finalBody: (
      <>
        Esta página es informativa: no vendemos ni revendemos entradas. Las únicas transacciones seguras son a través de <strong>fifa.com/tickets</strong> y el portal oficial de hospitality <strong>fifaworldcup26.hospitality.fifa.com</strong>. Cualquier otra fuente es reventa de riesgo.
      </>
    ),
    breadcrumbEntradas: 'Entradas',
    howToName: 'Cómo comprar entradas para el Mundial 2026',
    howToDescription: 'Guía paso a paso para comprar entradas oficiales del Mundial 2026 en fifa.com/tickets durante la fase 4 de venta.',
    howToSteps: [
      { name: 'Crea o accede a tu cuenta FIFA', text: 'Entra en fifa.com/tickets y crea una cuenta con email verificado. Imprescindible nombre real coincidiendo con el documento de identidad.' },
      { name: 'Elige el partido', text: 'En la pestaña "Partidos" filtra por fecha, ciudad o selección. Disponibilidad sujeta a inventario y precio dinámico.' },
      { name: 'Selecciona categoría y asiento', text: 'Elige entre Cat. 1, 2 o 3. La opción Supporter (60 $) solo aparece si eres miembro acreditado del Fan Club de tu selección.' },
      { name: 'Paga con Visa o tarjeta admitida', text: 'Visa es socio oficial. Otras tarjetas también funcionan pero pueden tener restricciones de divisa.' },
      { name: 'Recibe la entrada digital en tu cuenta', text: 'Las entradas son nominativas y digitales (FIFA Mobile App). No se pueden imprimir ni transferir libremente.' },
    ],
  },
  en: {
    keywords: [
      '2026 World Cup tickets',
      'buy World Cup 2026 tickets',
      'World Cup 2026 ticket prices',
      'World Cup 2026 Phase 4',
      'FIFA tickets 2026',
      'World Cup 2026 final tickets',
      'World Cup 2026 opening match tickets',
      'World Cup 2026 hospitality',
      'dynamic pricing World Cup 2026',
    ],
    back: 'World Cup 2026',
    heroKicker: 'World Cup 2026 · USA · Mexico · Canada',
    h1: '2026 World Cup tickets',
    heroIntro:
      'How to buy them, what prices to expect and which sales phases are still open for the 104 matches of the first 48-team World Cup. Guide updated April 2026.',
    ctaPill: 'Official sales: fifa.com/tickets',
    warning: {
      strong: 'FIFA is the only official seller.',
      rest: 'Any website offering tickets at face value outside fifa.com/tickets is unauthorised resale or fraud. Your ticket can be cancelled at the stadium gate.',
    },
    phasesKicker: 'When tickets sold and what is left',
    phasesH2: 'The 4 sales phases',
    phaseClosed: 'Closed',
    phaseOpen: 'Open',
    phases: [
      { n: 1, name: 'Phase 1, Visa Presale Draw', when: 'October 2025', desc: 'Random draw reserved for Visa cardholders.', closed: true },
      { n: 2, name: 'Phase 2, Early Ticket Draw', when: 'November 2025', desc: 'Second random draw, held before the group-stage draw result.', closed: true },
      { n: 3, name: 'Phase 3, Random Selection Draw', when: 'December 2025, January 2026', desc: 'Third draw, with groups already known. Match-specific allocation per team.', closed: true },
      { n: 4, name: 'Phase 4, Last-Minute Sales', when: 'From April 1, 2026 until the final (July 19)', desc: 'Continuous first-come-first-served sale (no draw). Real-time dynamic pricing depending on demand. Availability across all 104 matches subject to inventory.', closed: false },
    ],
    pricesKicker: 'Official rates · Phase 4 · April 2026',
    pricesH2: 'Prices by stage',
    pricesIntro:
      'Prices in US dollars, subject to FIFA dynamic pricing: the real cost depends on the venue, the teams and demand at purchase time.',
    pricesTable: { stage: 'Stage', from: 'From', to: 'Up to', notes: 'Notes' },
    prices: [
      { stage: 'Group stage · Cat. 3', from: '$120', to: '$1,200', notes: 'Most affordable category. Prices rise with demand.' },
      { stage: 'Group stage · Cat. 1', from: '$300', to: '$1,200', notes: 'Best zone in the stadium. Upper cap varies by match.' },
      { stage: 'Round of 16', from: '$180', to: '$1,500', notes: 'Varies by match and venue.' },
      { stage: 'Quarter-finals', from: '$550', to: '$2,500', notes: '' },
      { stage: 'Semi-finals · Cat. 3', from: '$930', to: '-', notes: 'Cat. 3 from $930; Cat. 1 exceeds $4,000.' },
      { stage: 'Third-place play-off', from: '$300', to: '$1,500', notes: '' },
      { stage: 'Final · Cat. 3', from: '$1,490', to: '-', notes: 'Cheapest tier for the final.' },
      { stage: 'Final · Cat. 1', from: '$6,730', to: '$7,875', notes: 'Official cap; resale exceeds $2M per ticket.' },
    ],
    supporterNote:
      'There is a $60 Supporter Tier available only to accredited members of national-team Fan Clubs. Resale prices for the final have hit $2 million per ticket on secondary markets.',
    hospitalityKicker: 'Premium packages',
    hospitalityH2: 'Hospitality',
    hospitalityIntro:
      'When affordable individual tickets are sold out, official hospitality packages are the only way to attend. Sold on hospitality.fifa.com.',
    hospitality: [
      { name: 'FIFA Pavilion', from: '$1,350/match', perks: 'Premium seat, shared lounge, fast-track entry.' },
      { name: 'Champions Club', from: '$2,500/match', perks: 'Menus signed by local chefs, cocktails, climate-controlled lounge.' },
      { name: 'Pitchside Lounge', from: '$6,000/match', perks: 'Pitch-side access, premium bar included.' },
      { name: 'Private suites', from: 'up to $73,200', perks: 'Multi-match packages (incl. final) at MetLife and Azteca.' },
    ],
    faqKicker: 'Most asked',
    faqH2: 'Frequently asked questions',
    faq: [
      { q: 'Where do I buy 2026 World Cup tickets?', a: 'Only on the official site fifa.com/tickets. FIFA is the only authorised seller. Any other site offering tickets at face value is resale or, in the worst case, a scam.' },
      { q: 'Are tickets still available in April 2026?', a: 'Yes. Phase 4 (Last-Minute Sales) opened on April 1, 2026 and runs until the final on July 19. Sales are first-come-first-served and prices are dynamic: they can rise or fall in real time with demand.' },
      { q: 'How much does a 2026 World Cup ticket cost?', a: 'The most affordable public tickets start at $120 (Cat. 3, group stage in lower-demand venues). The final starts at $1,490 in Cat. 3 and reaches $7,875 in Cat. 1. There is a $60 Supporter Tier, reserved for official Fan Club members of participating nations.' },
      { q: 'What is dynamic pricing?', a: 'For the first time at a World Cup, FIFA uses dynamic pricing: the price of a ticket changes in real time depending on demand, the teams playing and the venue. A ticket opening at $200 may end up costing $350 before that phase closes.' },
      { q: 'Can I buy resale tickets?', a: 'FIFA has an official resale platform inside fifa.com/tickets. It is the only legal and safe way to resell a ticket. Third-party sites (StubHub, Viagogo, etc.) are not authorised: the ticket can be cancelled at the stadium gate.' },
      { q: 'Do I need a visa to enter the USA, Mexico or Canada with a ticket?', a: 'A match ticket does not waive immigration requirements. Each host country applies its own rules: ESTA for the USA, FMM for Mexico and eTA for Canada. Processing times can take weeks, so sort it out as soon as you have your ticket.' },
      { q: 'When are the opening match and the final?', a: 'The opening match is June 11, 2026 at 1:00 PM Mexico City time (Mexico vs South Africa) at Estadio Azteca. The final is July 19, 2026 at 3:00 PM ET at MetLife Stadium, New Jersey.' },
    ],
    finalH2: 'Always buy from the official website',
    finalBody: (
      <>
        This page is informational: we do not sell or resell tickets. The only safe transactions are through <strong>fifa.com/tickets</strong> and the official hospitality portal <strong>fifaworldcup26.hospitality.fifa.com</strong>. Any other source is high-risk resale.
      </>
    ),
    breadcrumbEntradas: 'Tickets',
    howToName: 'How to buy 2026 World Cup tickets',
    howToDescription: 'Step-by-step guide to buying official 2026 World Cup tickets on fifa.com/tickets during the Phase 4 sales window.',
    howToSteps: [
      { name: 'Create or sign in to your FIFA account', text: 'Go to fifa.com/tickets and create an account with a verified email. Real name matching your ID document is mandatory.' },
      { name: 'Pick a match', text: 'Under "Matches" filter by date, city or team. Availability is subject to inventory and dynamic pricing.' },
      { name: 'Choose category and seat', text: 'Select between Cat. 1, 2 or 3. The Supporter option ($60) only appears if you are an accredited member of your national-team Fan Club.' },
      { name: 'Pay with Visa or a supported card', text: 'Visa is the official partner. Other cards work but may have currency restrictions.' },
      { name: 'Get your digital ticket in your account', text: 'Tickets are personal and digital (FIFA Mobile App). They cannot be printed or freely transferred.' },
    ],
  },
};

const AVAILABLE: readonly string[] = ['es', 'en'];

function copyFor(locale: string): Copy {
  return COPY[locale] ?? COPY.es;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.entradas' });
  const c = copyFor(locale);
  return pageMetadata({
    locale,
    path: '/2026/entradas',
    title: t('title'),
    description: t('description'),
    keywords: [...c.keywords],
    availableLocales: AVAILABLE,
  });
}

export default async function EntradasPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = copyFor(locale);

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: c.faq.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  const howToLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: c.howToName,
    description: c.howToDescription,
    totalTime: 'PT15M',
    inLanguage: locale,
    step: c.howToSteps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
      ...(i === 0 ? { url: 'https://www.fifa.com/tickets' } : {}),
    })),
  };

  return (
    <article className="relative">
      <JsonLd
        data={[
          faqLd,
          howToLd,
          breadcrumbLd(locale, [
            { name: locale === 'en' ? 'Home' : 'Inicio', path: '/' },
            { name: locale === 'en' ? 'World Cup 2026' : 'Mundial 2026', path: '/2026' },
            { name: c.breadcrumbEntradas, path: '/2026/entradas' },
          ]),
        ]}
      />

      <section className="relative overflow-hidden pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div
            className="absolute inset-x-0 top-0 h-[60%]"
            style={{
              background: 'radial-gradient(ellipse at top, rgba(78, 222, 128, 0.15), transparent 60%)',
            }}
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1100px] px-6 md:px-10">
          <Link
            href={withLocale(locale as Locale, '/2026')}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
          >
            <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> {c.back}
          </Link>

          <div className="mt-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            <Ticket className="h-4 w-4" />
            <span>{c.heroKicker}</span>
          </div>

          <h1 className="mt-6 font-display text-fluid-display uppercase leading-[0.9]">{c.h1}</h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
            {c.heroIntro}
          </p>

          <p className="mt-10 inline-flex items-center gap-3 rounded-full border border-[var(--color-pitch)]/40 bg-[var(--color-pitch)]/10 px-5 py-2.5 text-sm font-mono uppercase tracking-[0.25em] text-[var(--color-pitch)]">
            <Ticket className="h-4 w-4" />
            {c.ctaPill}
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <div className="flex gap-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 md:p-6">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-400" />
          <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">
            <strong className="text-[var(--color-fg)]">{c.warning.strong}</strong> {c.warning.rest}
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1100px] px-6 py-16 md:px-10 md:py-20">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">{c.phasesKicker}</div>
        <h2 className="mt-4 font-display text-fluid-h2 uppercase leading-[0.95]">{c.phasesH2}</h2>

        <ol className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)]">
          {c.phases.map((p) => (
            <li key={p.n} className="bg-[var(--color-bg)] p-6 md:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div className="flex items-center gap-4">
                  <span className="font-display text-3xl text-[var(--color-fg-subtle)]">{String(p.n).padStart(2, '0')}</span>
                  <h3 className="font-display text-xl uppercase text-[var(--color-fg)]">{p.name}</h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-muted)]">{p.when}</span>
                  {p.closed ? (
                    <span className="rounded-full border border-[var(--color-border)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">{c.phaseClosed}</span>
                  ) : (
                    <span className="rounded-full border border-[var(--color-pitch)]/40 bg-[var(--color-pitch)]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-pitch)]">{c.phaseOpen}</span>
                  )}
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[var(--color-fg-muted)] md:text-base">{p.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto w-full max-w-[1100px] px-6 py-16 md:px-10 md:py-20">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">{c.pricesKicker}</div>
        <h2 className="mt-4 font-display text-fluid-h2 uppercase leading-[0.95]">{c.pricesH2}</h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-fg-muted)]">{c.pricesIntro}</p>

        <div className="mt-10 overflow-hidden rounded-2xl border border-[var(--color-border)]">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-2)] text-left font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                <th className="px-5 py-4">{c.pricesTable.stage}</th>
                <th className="px-5 py-4">{c.pricesTable.from}</th>
                <th className="px-5 py-4">{c.pricesTable.to}</th>
                <th className="hidden px-5 py-4 md:table-cell">{c.pricesTable.notes}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {c.prices.map((p) => (
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

        <p className="mt-6 text-xs leading-relaxed text-[var(--color-fg-subtle)]">{c.supporterNote}</p>
      </section>

      <section className="mx-auto w-full max-w-[1100px] px-6 py-16 md:px-10 md:py-20">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">{c.hospitalityKicker}</div>
        <h2 className="mt-4 font-display text-fluid-h2 uppercase leading-[0.95]">{c.hospitalityH2}</h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-fg-muted)]">{c.hospitalityIntro}</p>

        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {c.hospitality.map((h) => (
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

      <section className="mx-auto w-full max-w-[1100px] px-6 py-16 md:px-10 md:py-20">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">{c.faqKicker}</div>
        <h2 className="mt-4 font-display text-fluid-h2 uppercase leading-[0.95]">{c.faqH2}</h2>

        <div className="mt-10 divide-y divide-[var(--color-border)] border-t border-b border-[var(--color-border)]">
          {c.faq.map(({ q, a }) => (
            <details key={q} className="group py-5">
              <summary className="flex cursor-pointer items-start justify-between gap-6 text-base md:text-lg">
                <span className="font-medium text-[var(--color-fg)]">{q}</span>
                <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center font-mono text-sm text-[var(--color-fg-subtle)] transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-[var(--color-fg-muted)]">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1100px] px-6 pb-24 md:px-10 md:pb-32">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-8 text-center md:p-14">
          <Ticket className="mx-auto h-10 w-10 text-[var(--color-pitch)]" />
          <h2 className="mt-6 font-display text-3xl uppercase leading-tight md:text-4xl">{c.finalH2}</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[var(--color-fg-muted)]">{c.finalBody}</p>
        </div>
      </section>
    </article>
  );
}

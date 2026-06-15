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
  Newspaper,
} from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl, SEO } from '@/lib/seo';
import { SQUADS_2026 } from '@/lib/wc-2026-squads';
import { NEWS_ITEMS } from '@/lib/news';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

type TimelineItem = { date: string; title: string; detail: string };
type FaqItem = { q: string; a: string };
type Federation = { code: string; name: string; flag: string; expected: string };
type SizeRow = { year: number; size: number; note?: string };

type Copy = {
  metaTitle: string;
  metaDescription: string;
  keywords: readonly string[];
  back: string;
  heroKicker: string;
  h1Line1: string;
  h1Line2: string;
  intro: string;
  timeline: ReadonlyArray<TimelineItem>;
  squadKicker: string;
  squadH2: string;
  squadIntro: React.ReactNode;
  sizeTable: { mundial: string; players: string; note: string };
  sizeRows: ReadonlyArray<SizeRow>;
  injKicker: string;
  injH2: string;
  injAllowed: string;
  injBefore: string;
  injBeforeBody: string;
  injForbidden: string;
  injAfter: string;
  injAfterBody: string;
  fedKicker: string;
  fedH2: string;
  fedIntro: string;
  fed: ReadonlyArray<Federation>;
  faqKicker: string;
  faqH2: string;
  faq: ReadonlyArray<FaqItem>;
  source: string;
  ctaKicker: string;
  ctas: ReadonlyArray<{ href: string; label: string; primary?: boolean }>;
  breadcrumb: string;
  headlineLd: string;
  descriptionLd: string;
};

const COPY: Record<string, Copy> = {
  es: {
    metaTitle: 'Convocatorias Mundial 2026: lista provisional 11 mayo, definitiva 1 junio',
    metaDescription: 'Cuándo publican las 48 selecciones sus listas para el Mundial 2026. FIFA fija la lista preliminar el 11 de mayo y la definitiva el 1 de junio. 26 jugadores por equipo, 3 porteros obligatorios.',
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
    back: 'Mundial 2026',
    heroKicker: 'Convocatorias · Plazos FIFA',
    h1Line1: 'Listas',
    h1Line2: 'Mundial 2026',
    intro: 'Las 48 selecciones del Mundial 2026 entregan a FIFA la lista provisional el 11 de mayo y la definitiva el 1 de junio. Aquí el calendario oficial, el tamaño del squad, las reglas de sustitución por lesión y cuándo se espera el anuncio público de cada federación.',
    timeline: [
      { date: '11 mayo 2026', title: 'Lista provisional (release list)', detail: 'Cada federación entrega a FIFA una lista de entre 35 y 55 jugadores. Es interna: FIFA NO la hace pública. Los seleccionadores suelen anunciar su lista preliminar en rueda de prensa los días previos.' },
      { date: '1 junio 2026', title: 'Lista definitiva', detail: 'Plazo límite para entregar a FIFA la convocatoria final: entre 23 y 26 jugadores, con 3 porteros obligatorios. La gran mayoría de selecciones publica esta lista al mismo día de entregarla.' },
      { date: '11 junio 2026', title: 'Partido inaugural · Estadio Azteca', detail: 'México vs Sudáfrica abre el torneo. A partir de aquí, los reemplazos por lesión solo se permiten hasta 24 horas antes del PRIMER partido del propio equipo, validados por el médico del seleccionado y un médico FIFA.' },
    ],
    squadKicker: 'Tamaño del squad',
    squadH2: '26 jugadores por selección',
    squadIntro: (
      <>
        Entre 23 y 26 jugadores totales por convocatoria, con un mínimo obligatorio de <strong className="text-[var(--color-fg)]">3 porteros</strong>. Es el mismo tope que se aplicó por primera vez en Qatar 2022. Hasta Rusia 2018 inclusive, las selecciones podían llevar como máximo 23 jugadores. La ampliación se introdujo durante la pandemia para dar más rotación, y FIFA la consolida en 2026 con un torneo más largo y exigente (la nueva ronda de 32avos añade un partido).
      </>
    ),
    sizeTable: { mundial: 'Mundial', players: 'Tope de jugadores', note: 'Nota' },
    sizeRows: [
      { year: 1982, size: 22 },
      { year: 1998, size: 22 },
      { year: 2002, size: 23 },
      { year: 2006, size: 23 },
      { year: 2010, size: 23 },
      { year: 2014, size: 23 },
      { year: 2018, size: 23 },
      { year: 2022, size: 26, note: 'Pandemia: FIFA elevó el tope a 26 ya en Qatar.' },
      { year: 2026, size: 26, note: 'Se mantiene el tope de 26 para 48 selecciones.' },
    ],
    injKicker: 'Sustituciones',
    injH2: 'Reglas de reemplazo por lesión',
    injAllowed: 'Permitido',
    injBefore: 'Antes del primer partido',
    injBeforeBody: 'Hasta 24 horas antes del primer partido del equipo, FIFA permite sustituir a un jugador convocado por lesión o enfermedad. El médico del seleccionado certifica el caso y un médico general FIFA lo valida. Ocurre habitualmente en cada Mundial: la última cesión de Bayern, Madrid o Manchester deja a alguien fuera y entra el suplente que estaba en la lista provisional.',
    injForbidden: 'Prohibido',
    injAfter: 'Una vez empezado el torneo',
    injAfterBody: 'Disputado el primer partido del equipo, FIFA NO admite sustituciones. Aunque un jugador caiga lesionado en la primera jornada, el seleccionado completa el torneo con los jugadores aptos restantes. Esa fue la situación de Italia con Cabrini en 1990, Argentina con Caniggia y muchas otras: una vez dentro, dentro hasta el final.',
    fedKicker: 'Federaciones top',
    fedH2: 'Cuándo lo dirá cada selección',
    fedIntro: 'Estimación de fecha y lugar del anuncio público de la lista, basada en el patrón de cada federación en Mundiales anteriores. Las cifras se confirmarán a medida que cada selección las haga oficiales.',
    fed: [
      { code: 'ESP', name: 'España', flag: '🇪🇸', expected: 'Primera semana de mayo (Las Rozas, RFEF)' },
      { code: 'ARG', name: 'Argentina', flag: '🇦🇷', expected: 'Mediados de mayo (Ezeiza, AFA)' },
      { code: 'BRA', name: 'Brasil', flag: '🇧🇷', expected: 'Mediados de mayo (Granja Comary, CBF)' },
      { code: 'FRA', name: 'Francia', flag: '🇫🇷', expected: 'Primera quincena de mayo (Clairefontaine, FFF)' },
      { code: 'GER', name: 'Alemania', flag: '🇩🇪', expected: 'Primera quincena de mayo (Frankfurt, DFB)' },
      { code: 'POR', name: 'Portugal', flag: '🇵🇹', expected: 'Primera quincena de mayo (Cidade do Futebol, FPF)' },
      { code: 'ENG', name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', expected: 'Primera quincena de mayo (St. George\'s Park, FA)' },
      { code: 'NED', name: 'Países Bajos', flag: '🇳🇱', expected: 'Primera quincena de mayo (KNVB Campus, KNVB)' },
    ],
    faqKicker: 'Preguntas frecuentes',
    faqH2: 'Lo que más se pregunta',
    faq: [
      { q: '¿Cuándo publican las selecciones la lista del Mundial 2026?', a: 'FIFA fija dos plazos: el 11 de mayo de 2026 las federaciones envían una lista provisional de 35 a 55 jugadores (que FIFA no hace pública) y el 1 de junio de 2026 entregan la lista definitiva de 23 a 26 jugadores. La mayoría de selecciones anuncia ambas en rueda de prensa el mismo día del envío a FIFA o en los días previos.' },
      { q: '¿Cuántos jugadores van por selección al Mundial 2026?', a: 'Entre 23 y 26 jugadores, con 3 porteros obligatorios. Es el mismo formato que se aplicó en Qatar 2022. En Mundiales anteriores hasta 2018 el tope eran 23 jugadores.' },
      { q: '¿Cuándo dará la lista España para el Mundial 2026?', a: 'La RFEF tradicionalmente publica su lista provisional en una rueda de prensa en Las Rozas a inicios de mayo. La fecha exacta no está confirmada, pero se espera entre el 5 y el 11 de mayo de 2026, antes del plazo FIFA. La lista definitiva se conocerá entre el 25 de mayo y el 1 de junio.' },
      { q: '¿Qué pasa si un jugador se lesiona después de presentar la lista?', a: 'Hasta 24 horas antes del primer partido de su selección, FIFA permite sustituirlo si el médico del equipo y un médico FIFA certifican la lesión. Una vez disputado el primer partido, no hay sustituciones permitidas: el equipo termina el torneo con los jugadores aptos restantes.' },
      { q: '¿Por qué la lista es de 26 jugadores y no de 23 como antes?', a: 'FIFA amplió el tope a 26 en Qatar 2022 como excepción por la pandemia y la cercanía con la temporada europea. Para 2026 se mantiene la cifra: con 48 selecciones y un calendario más exigente (32avos añadidos), tiene sentido permitir más rotación.' },
      { q: '¿Pueden cambiar la lista entre el 1 y el 11 de junio?', a: 'Sí, pero solo por lesión o enfermedad confirmadas. Cada cambio requiere certificado del médico del seleccionado y validación del médico general FIFA. No hay sustituciones libres.' },
      { q: '¿Cuántos porteros tienen que llevar?', a: 'Tres porteros obligatorios dentro del rango 23-26. Si una selección lleva 26 jugadores, tendrá 3 porteros y 23 jugadores de campo. Si lleva 23, tendrá 3 porteros y 20 de campo.' },
      { q: '¿Cuándo se publican las dorsales (números de camiseta)?', a: 'Junto con la lista definitiva del 1 de junio. FIFA exige que cada jugador lleve un número fijo del 1 al 26 durante todo el torneo y la AFA, la RFEF y demás federaciones suelen revelarlas el mismo día del anuncio oficial.' },
    ],
    source: 'Fuente: «Regulations, FIFA World Cup 26» (PDF, 19 marzo 2026) · Wikipedia «2026 FIFA World Cup squads». Última verificación: abril 2026.',
    ctaKicker: 'Más del Mundial 2026',
    ctas: [
      { href: '/2026/calendario', label: 'Calendario por fase', primary: true },
      { href: '/2026/grupos', label: '12 grupos' },
      { href: '/2026/sedes', label: '16 sedes' },
      { href: '/selecciones/ESP/grupo-h', label: 'España · Grupo H' },
    ],
    breadcrumb: 'Convocatorias',
    headlineLd: 'Convocatorias Mundial 2026: lista provisional 11 mayo, definitiva 1 junio',
    descriptionLd: 'Calendario oficial FIFA para que las 48 selecciones publiquen sus listas del Mundial 2026: lista preliminar el 11 de mayo, definitiva el 1 de junio.',
  },
  en: {
    metaTitle: '2026 World Cup squads: preliminary list May 11, final May 26 / June 1',
    metaDescription: 'When the 48 national teams release their 2026 World Cup squads. FIFA sets the preliminary list on May 11 and the final 26-man squad on June 1. 3 mandatory goalkeepers per team.',
    keywords: [
      '2026 World Cup squad announcement',
      'Spain squad 2026 World Cup',
      'England squad 2026 World Cup',
      'Argentina squad 2026 World Cup',
      'Brazil squad 2026 World Cup',
      'when do national teams announce squads',
      '26-man squad World Cup 2026',
      'injury replacement rules World Cup',
    ],
    back: 'World Cup 2026',
    heroKicker: 'Squad announcements · FIFA deadlines',
    h1Line1: '2026 World Cup',
    h1Line2: 'squads',
    intro: 'The 48 national teams submit their preliminary list to FIFA on May 11 and the final 26-man squad on June 1. Here is the official calendar, squad size, injury-replacement rules and when each federation is expected to make its public call-up.',
    timeline: [
      { date: 'May 11, 2026', title: 'Preliminary list (release list)', detail: 'Each federation submits to FIFA a list of 35 to 55 players. It is internal — FIFA does NOT publish it. National-team coaches usually announce their public preliminary call-up in a press conference in the days before.' },
      { date: 'June 1, 2026', title: 'Final squad', detail: 'Deadline to submit the final squad to FIFA: between 23 and 26 players, with 3 mandatory goalkeepers. Most federations publish this list the same day they submit it.' },
      { date: 'June 11, 2026', title: 'Opening match · Estadio Azteca', detail: 'Mexico vs South Africa opens the tournament. From then on, injury replacements are only allowed up to 24 hours before a team\'s FIRST match, certified by the team doctor and a FIFA medical officer.' },
    ],
    squadKicker: 'Squad size',
    squadH2: '26 players per nation',
    squadIntro: (
      <>
        Between 23 and 26 players per squad, with a mandatory minimum of <strong className="text-[var(--color-fg)]">3 goalkeepers</strong>. It is the same cap first used in Qatar 2022. Until Russia 2018, national teams could bring a maximum of 23 players. The expansion was introduced during the pandemic to allow more rotation, and FIFA keeps it for 2026 with a longer, more demanding tournament (the new Round of 32 adds an extra match).
      </>
    ),
    sizeTable: { mundial: 'World Cup', players: 'Squad cap', note: 'Note' },
    sizeRows: [
      { year: 1982, size: 22 },
      { year: 1998, size: 22 },
      { year: 2002, size: 23 },
      { year: 2006, size: 23 },
      { year: 2010, size: 23 },
      { year: 2014, size: 23 },
      { year: 2018, size: 23 },
      { year: 2022, size: 26, note: 'Pandemic: FIFA raised the cap to 26 in Qatar.' },
      { year: 2026, size: 26, note: 'Cap kept at 26 for the 48-team tournament.' },
    ],
    injKicker: 'Replacements',
    injH2: 'Injury replacement rules',
    injAllowed: 'Allowed',
    injBefore: 'Before the first match',
    injBeforeBody: 'Up to 24 hours before a team\'s first match, FIFA allows replacing a called-up player due to injury or illness. The team doctor certifies the case and a FIFA medical officer validates it. It happens at every World Cup: a late training-camp setback at Bayern, Real Madrid or Manchester drops a player out and the backup from the preliminary list comes in.',
    injForbidden: 'Forbidden',
    injAfter: 'Once the tournament begins',
    injAfterBody: 'Once a team has played its first match, FIFA does NOT allow substitutions. Even if a player gets injured on matchday 1, the team finishes the tournament with the remaining fit players. That was Italy with Cabrini in 1990, Argentina with Caniggia and many others: once you are in the squad, you stay until the end.',
    fedKicker: 'Top federations',
    fedH2: 'When each nation will reveal its squad',
    fedIntro: 'Estimated date and venue of the public squad reveal, based on each federation\'s pattern at previous World Cups. Figures will be confirmed as each nation makes them official.',
    fed: [
      { code: 'ESP', name: 'Spain', flag: '🇪🇸', expected: 'First week of May (Las Rozas, RFEF)' },
      { code: 'ARG', name: 'Argentina', flag: '🇦🇷', expected: 'Mid-May (Ezeiza, AFA)' },
      { code: 'BRA', name: 'Brazil', flag: '🇧🇷', expected: 'Mid-May (Granja Comary, CBF)' },
      { code: 'FRA', name: 'France', flag: '🇫🇷', expected: 'Early May (Clairefontaine, FFF)' },
      { code: 'GER', name: 'Germany', flag: '🇩🇪', expected: 'Early May (Frankfurt, DFB)' },
      { code: 'POR', name: 'Portugal', flag: '🇵🇹', expected: 'Early May (Cidade do Futebol, FPF)' },
      { code: 'ENG', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', expected: 'Early May (St. George\'s Park, FA)' },
      { code: 'NED', name: 'Netherlands', flag: '🇳🇱', expected: 'Early May (KNVB Campus, KNVB)' },
    ],
    faqKicker: 'Frequently asked questions',
    faqH2: 'Most asked',
    faq: [
      { q: 'When do national teams announce their 2026 World Cup squads?', a: 'FIFA sets two deadlines: on May 11, 2026 federations submit a preliminary list of 35–55 players (not made public by FIFA), and on June 1, 2026 they deliver the final 23–26 player squad. Most teams announce both in a press conference on the day they submit them or in the days before.' },
      { q: 'How many players does each nation take to the 2026 World Cup?', a: 'Between 23 and 26 players, with 3 mandatory goalkeepers. It is the same format used at Qatar 2022. At earlier World Cups up to 2018, the cap was 23 players.' },
      { q: 'When will Spain announce its 2026 World Cup squad?', a: 'The RFEF traditionally reveals its preliminary list in a press conference at Las Rozas in early May. The exact date is not yet confirmed, but it is expected between May 5 and May 11, 2026, ahead of the FIFA deadline. The final squad will be known between May 25 and June 1.' },
      { q: 'What happens if a player gets injured after being called up?', a: 'Up to 24 hours before a team\'s first match, FIFA allows replacing him if the team doctor and a FIFA medical officer certify the injury. Once the first match is played, no substitutions are allowed: the team finishes the tournament with the remaining fit players.' },
      { q: 'Why is the squad 26 players instead of 23 like before?', a: 'FIFA raised the cap to 26 at Qatar 2022 as an exception due to the pandemic and the proximity to the European season. For 2026 it stays the same: with 48 teams and a more demanding calendar (extra Round of 32), more rotation makes sense.' },
      { q: 'Can the squad be changed between June 1 and June 11?', a: 'Yes, but only for confirmed injury or illness. Each change requires a certificate from the team doctor validated by the FIFA medical officer. No free substitutions are allowed.' },
      { q: 'How many goalkeepers must each team bring?', a: 'Three goalkeepers are mandatory within the 23–26 range. A team taking 26 will have 3 keepers and 23 outfield players. A team taking 23 will have 3 keepers and 20 outfield players.' },
      { q: 'When are squad numbers (shirt numbers) announced?', a: 'Together with the final June 1 squad. FIFA requires each player to wear a fixed number 1 to 26 throughout the tournament, and most federations reveal them the same day as the official announcement.' },
    ],
    source: 'Source: "Regulations, FIFA World Cup 26" (PDF, March 19, 2026) · Wikipedia "2026 FIFA World Cup squads". Last verified: April 2026.',
    ctaKicker: 'More from the 2026 World Cup',
    ctas: [
      { href: '/2026/calendario', label: 'Schedule by phase', primary: true },
      { href: '/2026/grupos', label: '12 groups' },
      { href: '/2026/sedes', label: '16 host venues' },
      { href: '/selecciones/ESP/grupo-h', label: 'Spain · Group H' },
    ],
    breadcrumb: 'Squad announcements',
    headlineLd: '2026 World Cup squads: preliminary list May 11, final squad June 1',
    descriptionLd: 'Official FIFA timeline for the 48 nations to release their 2026 World Cup squads: preliminary list on May 11, final squad on June 1.',
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
  const c = copyFor(locale);
  return pageMetadata({
    locale,
    path: '/2026/convocatorias',
    title: c.metaTitle,
    description: c.metaDescription,
    keywords: [...c.keywords],
    type: 'article',
    availableLocales: AVAILABLE,
  });
}

export default async function Convocatorias2026({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = copyFor(locale);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: c.headlineLd,
    description: c.descriptionLd,
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
    mainEntity: c.faq.map(({ q, a }) => ({
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
            { name: locale === 'en' ? 'Home' : 'Inicio', path: '/' },
            { name: locale === 'en' ? 'World Cup 2026' : 'Mundial 2026', path: '/2026' },
            { name: c.breadcrumb, path: '/2026/convocatorias' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/2026')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> {c.back}
        </Link>

        <div className="mt-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <FileText className="h-4 w-4" />
          <span>{c.heroKicker}</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          {c.h1Line1}<br />{c.h1Line2}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          {c.intro}
        </p>
      </header>

      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <div className="grid gap-px overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-border)] md:grid-cols-3">
          {c.timeline.map((t) => (
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

      <section className="mx-auto mt-20 w-full max-w-[1100px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Users className="inline h-3 w-3 mr-2" />
          {c.squadKicker}
        </div>
        <h2 className="mt-3 font-display text-3xl uppercase leading-[1] md:text-4xl">
          {c.squadH2}
        </h2>
        <p className="mt-6 max-w-3xl text-base leading-relaxed text-[var(--color-fg-muted)] md:text-lg">
          {c.squadIntro}
        </p>

        <div className="mt-10 overflow-hidden rounded-2xl border border-[var(--color-border)]">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-2)] text-left font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                <th className="px-4 py-4">{c.sizeTable.mundial}</th>
                <th className="px-4 py-4 text-right">{c.sizeTable.players}</th>
                <th className="px-4 py-4">{c.sizeTable.note}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {c.sizeRows.map((row) => (
                <tr
                  key={row.year}
                  className={`hover:bg-[var(--color-bg-2)]/40 ${
                    row.year === 2026 ? 'bg-[var(--color-pitch)]/5' : ''
                  }`}
                >
                  <td className="px-4 py-3 font-mono tab-num text-[var(--color-fg)]">{row.year}</td>
                  <td className="px-4 py-3 text-right font-mono tab-num text-[var(--color-fg)]">{row.size}</td>
                  <td className="px-4 py-3 text-sm text-[var(--color-fg-muted)]">{row.note ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-[1100px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Shield className="inline h-3 w-3 mr-2" />
          {c.injKicker}
        </div>
        <h2 className="mt-3 font-display text-3xl uppercase leading-[1] md:text-4xl">
          {c.injH2}
        </h2>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-7">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              {c.injAllowed}
            </div>
            <h3 className="mt-3 font-display text-xl uppercase leading-tight">
              {c.injBefore}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">
              {c.injBeforeBody}
            </p>
          </div>
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-7">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-amber-300">
              <AlertTriangle className="h-4 w-4" />
              {c.injForbidden}
            </div>
            <h3 className="mt-3 font-display text-xl uppercase leading-tight">
              {c.injAfter}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">
              {c.injAfterBody}
            </p>
          </div>
        </div>
      </section>

      {/* ── Grid dinámico 48 selecciones ─────────────────────────────── */}
      <section className="mx-auto mt-20 w-full max-w-[1100px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Users className="inline h-3 w-3 mr-2" />
          {locale === 'en' ? 'All 48 squads' : 'Las 48 convocatorias'}
        </div>
        <h2 className="mt-3 font-display text-3xl uppercase leading-[1] md:text-4xl">
          {locale === 'en' ? 'Status by nation' : 'Estado por selección'}
        </h2>
        <p className="mt-4 max-w-3xl text-sm text-[var(--color-fg-muted)]">
          {locale === 'en'
            ? 'Click any nation to see the full 26-player list, coach, captain and first match.'
            : 'Haz clic en cualquier selección para ver la lista de 26, seleccionador, capitán y primer partido.'}
        </p>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 font-mono text-[10px] uppercase tracking-[0.25em]">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" />
            {locale === 'en' ? 'Final' : 'Oficial'}
          </span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="h-2 w-2 rounded-full bg-amber-400 inline-block" />
            {locale === 'en' ? 'Provisional' : 'Provisional'}
          </span>
          <span className="flex items-center gap-1.5 text-[var(--color-fg-subtle)]">
            <span className="h-2 w-2 rounded-full bg-[var(--color-border-strong)] inline-block" />
            {locale === 'en' ? 'Pending' : 'Pendiente'}
          </span>
        </div>

        <ul className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3">
          {SQUADS_2026.map((squad) => {
            const statusColor =
              squad.status === 'final'
                ? 'text-emerald-400'
                : squad.status === 'provisional'
                ? 'text-amber-400'
                : 'text-[var(--color-fg-subtle)]';
            const statusDot =
              squad.status === 'final'
                ? 'bg-emerald-400'
                : squad.status === 'provisional'
                ? 'bg-amber-400'
                : 'bg-[var(--color-border-strong)]';
            const statusLabel =
              squad.status === 'final'
                ? locale === 'en' ? 'Final' : 'Oficial'
                : squad.status === 'provisional'
                ? locale === 'en' ? 'Provisional' : 'Provisional'
                : locale === 'en' ? 'Pending' : 'Pendiente';
            const playerCount = squad.players.length;
            return (
              <li key={squad.teamCode} className="bg-[var(--color-bg)]">
                <Link
                  href={withLocale(locale as Locale, `/2026/listas/${squad.teamCode}`)}
                  className="group flex items-center gap-4 p-4 transition-colors hover:bg-[var(--color-bg-2)]"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-1.5 w-1.5 rounded-full flex-none ${statusDot}`}
                      />
                      <span className="font-mono text-[11px] font-bold tracking-wider text-[var(--color-fg)]">
                        {squad.teamCode}
                      </span>
                      {squad.coach && (
                        <span className="truncate text-[11px] text-[var(--color-fg-muted)]">
                          · {squad.coach}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-3">
                      <span className={`font-mono text-[9px] uppercase tracking-[0.2em] ${statusColor}`}>
                        {statusLabel}
                      </span>
                      {playerCount > 0 && (
                        <span className="font-mono text-[9px] text-[var(--color-fg-subtle)]">
                          {playerCount}/26 {locale === 'en' ? 'players' : 'jugadores'}
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="h-3 w-3 flex-none text-[var(--color-fg-subtle)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--color-pitch)]" />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Stats bar */}
        {(() => {
          const final = SQUADS_2026.filter((s) => s.status === 'final').length;
          const provisional = SQUADS_2026.filter((s) => s.status === 'provisional').length;
          const pending = SQUADS_2026.filter((s) => s.status === 'pending').length;
          return (
            <div className="mt-6 flex flex-wrap gap-6 font-mono text-[11px] text-[var(--color-fg-muted)]">
              <span className="text-emerald-400 font-semibold">{final} {locale === 'en' ? 'official' : 'oficiales'}</span>
              <span className="text-amber-400 font-semibold">{provisional} {locale === 'en' ? 'provisional' : 'provisionales'}</span>
              <span>{pending} {locale === 'en' ? 'pending' : 'pendientes'}</span>
              <span>· {locale === 'en' ? 'Last updated' : 'Actualizado'} 2 jun 2026</span>
            </div>
          );
        })()}
      </section>

      {/* ── Noticias de convocatorias ─────────────────────────────────── */}
      {(() => {
        const convNoticias = NEWS_ITEMS
          .filter((n) => n.category === 'convocatorias')
          .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
          .slice(0, 12);
        if (!convNoticias.length) return null;
        return (
          <section className="mx-auto mt-20 w-full max-w-[1100px] px-6 md:px-10">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              <Newspaper className="inline h-3 w-3 mr-2" />
              {locale === 'en' ? 'Latest squad news' : 'Últimas noticias de convocatorias'}
            </div>
            <h2 className="mt-3 font-display text-3xl uppercase leading-[1] md:text-4xl">
              {locale === 'en' ? 'Squad announcements' : 'Anuncios de convocatorias'}
            </h2>
            <ul className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3">
              {convNoticias.map((n) => (
                <li key={n.slug} className="bg-[var(--color-bg)]">
                  <Link
                    href={withLocale(locale as Locale, `/noticias/${n.slug}`)}
                    className="group flex h-full flex-col gap-2 p-5 transition-colors hover:bg-[var(--color-bg-2)]"
                  >
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
                      {new Date(n.publishedAt).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </span>
                    <span className="text-sm font-semibold leading-snug text-[var(--color-fg)] group-hover:text-[var(--color-pitch)] transition-colors line-clamp-2">
                      {n.title}
                    </span>
                    <span className="mt-auto font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)] group-hover:text-[var(--color-pitch)] transition-colors">
                      {locale === 'en' ? 'Read →' : 'Leer →'}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })()}

      <section className="mx-auto mt-20 w-full max-w-[900px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          {c.faqKicker}
        </div>
        <h2 className="mt-3 font-display text-3xl uppercase leading-[1] md:text-4xl">
          {c.faqH2}
        </h2>

        <ul className="mt-10 space-y-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)]">
          {c.faq.map((item) => (
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
          {c.source}
        </p>
      </section>

      <section className="mx-auto mb-24 mt-20 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-pitch)]/8 via-[var(--color-bg-2)] to-[var(--color-bg-2)] p-10 md:p-14">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            {c.ctaKicker}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {c.ctas.map((cta) => (
              <Link
                key={cta.href}
                href={withLocale(locale as Locale, cta.href)}
                className={
                  cta.primary
                    ? 'group inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90'
                    : 'group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]'
                }
              >
                {cta.label}
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}

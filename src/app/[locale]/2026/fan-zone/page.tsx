import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ArrowLeft, ArrowRight, Sofa, Volume2, Headphones, Beer } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';
import { AmazonCard } from '@/components/affiliate/amazon-card';
import { AMAZON_PRODUCTS } from '@/lib/amazon-products';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

const PICK = (id: number) => AMAZON_PRODUCTS.find((p) => p.id === id)!;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.fanZone' });
  return pageMetadata({
    locale,
    path: '/2026/fan-zone',
    title: t('title'),
    description:
      t('description'),
    keywords: [
      'fan zone Mundial 2026',
      'cómo ver el Mundial 2026 en casa',
      'mejor TV para Mundial 2026',
      'TV 4K Mundial fútbol',
      'barra de sonido para fútbol',
      'proyector ver fútbol casa',
      'auriculares ver fútbol nocturno',
      'preparar casa Mundial 2026',
    ],
  });
}

const FAQ = [
  {
    q: '¿Qué TV es la mejor para ver el Mundial 2026?',
    a: 'Depende del presupuesto. Como punto medio, una QLED 4K de 65" con HDMI 2.1 y 100Hz nativos cubre todo lo que el fútbol necesita: imagen amplia, color saturado y movimiento fluido. Si te lo puedes permitir, OLED da el negro perfecto y los 144Hz no se notan en fútbol pero sí en gaming. Por debajo, una Mini-LED de 55" sigue siendo una pantalla excelente para deportes.',
  },
  {
    q: '¿Importan los Hz / motion rate para ver fútbol?',
    a: 'Sí, pero hasta cierto punto. El fútbol se emite en 50Hz en Europa (PAL) y los TVs modernos hacen interpolación a 100/120Hz nativos sin distorsión. A partir de ahí, los 144Hz / 240Hz no aportan mejora visible para deporte real (sí para videojuegos). Lo que sí importa: que sea panel nativo 100Hz+, no "motion rate efectivo" inflado.',
  },
  {
    q: '¿Qué pulgadas son ideales según el salón?',
    a: 'La fórmula de THX y Society of Motion Picture Engineers: pulgadas = distancia en cm × 0.84 / 2.54 para 4K. En la práctica, 55" desde 2 metros, 65" desde 2.5 metros, 75" desde 3 metros, 85" desde 3.5 metros. La distancia mínima en el salón típico español favorece 55-65", más allá puede ser excesivo en pisos urbanos.',
  },
  {
    q: '¿Hace falta una barra de sonido?',
    a: 'Para un partido normal no, los altavoces de un TV moderno son aceptables. Pero el momento épico, un gol importante, la atmósfera del estadio, la voz del relator, se siente diferente con audio inmersivo. Una barra 3.1.2 con Dolby Atmos transforma cualquier TV en algo más cercano al estadio. Es la inversión más infravalorada del fan promedio.',
  },
  {
    q: '¿Vale la pena un proyector para ver el Mundial?',
    a: 'Si tienes una pared blanca de 2.5+ metros y el salón se puede oscurecer, sí. Un proyector portátil 1080p (XGIMI Halo+, Anker Nebula) crea pantalla de 100" por menos que un TV de 65". Ideal para reuniones grandes, fan zones improvisadas o terrazas cubiertas en verano. La pega: la imagen sufre con luz ambiente.',
  },
  {
    q: '¿Cómo veo los partidos sin molestar a la familia?',
    a: 'Auriculares Bluetooth con baja latencia. Los Sony WH-1000XM5 son referencia por cancelación de ruido (perfecto para evitar despertar a quien duerme), pero también valen unos AirPods Pro o Bose QC Ultra. Importante: usar codec aptX Low Latency o LE Audio para evitar desincronización de labios.',
  },
  {
    q: '¿Cómo organizo una fan zone en casa con amigos?',
    a: 'Lo aprendido del Mundial 2010 y 2014: TV grande (mín. 65"), audio decente, asientos para mínimo el doble del salón habitual (taburetes y cojines en el suelo si hace falta), una nevera dedicada solo para bebidas frías y comida fácil de comer sin cubiertos. Atenuar luces principales para que la pantalla domine. Y un hueco amplio entre el TV y los espectadores para celebrar sin tirar nada.',
  },
];

const TESTIMONIOS = [
  {
    autor: 'David, 38',
    contexto: 'Madrid · Vió la final 2010 con su padre',
    quote:
      'Lo del Mundial nunca es ver un partido. Es montar un dispositivo. Mi padre lleva tres semanas hablándome del proyector que se quiere comprar y del salón vacío del primo para verlo en grupo. Esto va de qué hueco eliges.',
  },
  {
    autor: 'Cristina, 31',
    contexto: 'Sevilla · Madre, dos hijos pequeños',
    quote:
      'En 2026 los partidos de España con Uruguay van a ser de madrugada. La pregunta no es qué TV tengo, es si me compro unos auriculares lo bastante buenos para que el grito del 95 no despierte a los niños.',
  },
  {
    autor: 'Mikel, 26',
    contexto: 'Bilbao · Le tocaba el sofá compartido del piso',
    quote:
      'Cuatro años llevo viendo Champions en una pantalla del 50 con dos altavoces planos. Para el Mundial me he prometido la barra Atmos. Si lo voy a ver una vez en mi vida con todo el ritual, mejor que el ritual sea bueno.',
  },
];

// ────────────────────────────────────────────────────────────────────

export default async function FanZonePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Productos por capítulo
  const tvs = [PICK(13), PICK(14), PICK(15)]; // Hisense, Samsung QLED, LG OLED
  const proyector = PICK(16);
  const audios = [PICK(17), PICK(60), PICK(61)]; // Q700C, Q800D, Q990F
  const auriculares = PICK(62);
  const appleTv = PICK(63);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Fan zone Mundial 2026: cómo preparar tu casa para los 64 partidos',
    description:
      'Reportaje sobre cómo equipar tu casa para el Mundial 2026: pantalla, sonido y comunidad. Recomendaciones contextuales de TVs, audio y accesorios.',
    author: { '@type': 'Organization', name: 'Mundial de Fútbol' },
    publisher: {
      '@type': 'Organization',
      name: 'Mundial de Fútbol',
      url: localeUrl(locale, '/'),
    },
    datePublished: '2026-04-26',
    dateModified: '2026-04-26',
    mainEntityOfPage: localeUrl(locale, '/2026/fan-zone'),
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
    <article className="relative">
      <JsonLd
        data={[
          articleLd,
          faqLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Mundial 2026', path: '/2026' },
            { name: 'Fan zone', path: '/2026/fan-zone' },
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
                'radial-gradient(ellipse at top, rgba(78, 222, 128, 0.18), transparent 60%)',
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
            <Sofa className="h-4 w-4" />
            <span>Reportaje · Cómo prepararse</span>
          </div>

          <h1 className="mt-6 font-display text-fluid-display uppercase leading-[0.9]">
            29 días.<br />64 partidos.<br />Una cancha en tu salón.
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
            El Mundial 2026 dura más que cualquier vacación que hayas planeado.
            Empieza el 11 de junio, termina el 19 de julio, y entremedias hay
            partidos a las cinco de la madrugada y partidos al filo de la cena.
            Esta guía no va de comprar la TV más cara: va de elegir las piezas
            que hacen que ver fútbol con la gente que quieres se sienta como ir
            al estadio sin salir de casa.
          </p>
        </div>
      </section>

      {/* Capítulo 1: La pantalla */}
      <section className="mx-auto w-full max-w-[1100px] px-6 py-16 md:px-10 md:py-24">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Capítulo 1
        </div>
        <h2 className="mt-4 font-display text-fluid-h2 uppercase leading-[0.95]">
          El sofá no aguanta
        </h2>

        <div className="mt-8 max-w-3xl space-y-6 text-base leading-[1.8] text-[var(--color-fg)]/90 md:text-lg">
          <p>
            Antes de ningún Mundial uno se hace la misma pregunta. ¿Cómo es
            posible que el televisor que llevamos cinco años aguantando series y
            telediarios, de repente, no parezca lo bastante grande?
          </p>
          <p>
            La respuesta es prosaica: porque vamos a ver fútbol siete días por
            semana durante un mes, en grupo, con cervezas, con primos. La pantalla
            que sirve para una serie cualquiera no aguanta el escrutinio sostenido
            de tres compadres mirando un fuera de juego al revés en el minuto 89.
            Para eso hace falta más pulgadas, más Hz, más color saturado.
          </p>
          <p>
            En el escalón asequible, los Mini-LED de Hisense y TCL ofrecen lo que
            hace una década solo daban los OLED de gama alta. En el medio, los
            QLED de Samsung mantienen la luminosidad cuando el salón se llena de
            sol matutino (importante para los partidos de México y USA, que en
            España caen casi todos en horario de tarde). En la parte alta, el
            OLED de LG (la C4) es lo que más se acerca a estar en el estadio.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {tvs.map((tv) => (
            <AmazonCard key={tv.id} product={tv} variant="default" />
          ))}
        </div>

        <details className="mt-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5">
          <summary className="cursor-pointer font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            Y si prefieres proyector…
          </summary>
          <div className="mt-4 grid gap-5 md:grid-cols-[2fr_1fr]">
            <p className="text-base leading-relaxed text-[var(--color-fg-muted)]">
              Si tienes pared blanca y se puede oscurecer el salón, un proyector
              portátil convierte cualquier sitio en pantalla de 100&quot;. Ideal
              para terrazas, casas rurales en verano, o reuniones grandes donde
              un TV de 65&quot; ya no llega.
            </p>
            <AmazonCard product={proyector} variant="default" />
          </div>
        </details>
      </section>

      {/* Capítulo 2: El sonido */}
      <section className="mx-auto w-full max-w-[1100px] px-6 py-16 md:px-10 md:py-24">
        <div className="flex items-center gap-3">
          <Volume2 className="h-5 w-5 text-[var(--color-pitch)]" />
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            Capítulo 2
          </span>
        </div>
        <h2 className="mt-4 font-display text-fluid-h2 uppercase leading-[0.95]">
          El gol se siente, no se ve
        </h2>

        <div className="mt-8 max-w-3xl space-y-6 text-base leading-[1.8] text-[var(--color-fg)]/90 md:text-lg">
          <p>
            Iniesta marcó el gol de la final del Mundial 2010 al minuto 116. La
            tele con la que lo viste tenía dos altavoces de 8 vatios y la voz de
            Manolo Lama saliendo por unas rejillas de plástico justo encima del
            sintonizador de TDT. Era 2010, todos los teléfonos cabían en el
            bolsillo, y la pantalla plana ya era el centro del salón pero el
            sonido seguía atrapado en los ochenta.
          </p>
          <p>
            Quince años después, una barra de sonido decente cuesta lo que en
            2010 valía un cargador de iPhone, y la diferencia entre escuchar el
            grito del estadio y escuchar la voz amortiguada del relator es lo
            que separa el deporte del ritual.
          </p>
          <p>
            Tres niveles. La 3.1.2 con Atmos cubre el salón típico y conecta
            inalámbricamente con tu TV. La 5.1.2 añade los altavoces traseros
            (necesitas espacio para colocarlos). La 11.1.4 es para quien quiere
            sentir físicamente la afición del estadio detrás del sofá: cuesta lo
            que un televisor decente y se nota desde el primer minuto.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {audios.map((a) => (
            <AmazonCard key={a.id} product={a} variant="default" />
          ))}
        </div>
      </section>

      {/* Capítulo 3: Auriculares (sin agotar al de al lado) */}
      <section className="mx-auto w-full max-w-[1100px] px-6 py-16 md:px-10 md:py-24">
        <div className="flex items-center gap-3">
          <Headphones className="h-5 w-5 text-[var(--color-pitch)]" />
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            Capítulo 3
          </span>
        </div>
        <h2 className="mt-4 font-display text-fluid-h2 uppercase leading-[0.95]">
          Sin agotar al de al lado
        </h2>

        <div className="mt-8 grid gap-10 md:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6 text-base leading-[1.8] text-[var(--color-fg)]/90 md:text-lg">
            <p>
              España-Uruguay se juega el 18 de junio a las 20:00 hora local de
              Guadalajara. Eso son las cuatro de la madrugada del jueves 19 en
              hora peninsular. Y ese es el partido decisivo del grupo.
            </p>
            <p>
              Para los padres con niños pequeños, los compañeros de piso, los que
              comparten cama con alguien que tiene que madrugar al día siguiente,
              ver el Mundial empieza con la misma pregunta: cómo gritar un gol
              sin convertir la noche en un drama doméstico.
            </p>
            <p>
              Los Sony WH-1000XM5 son la respuesta razonable: cancelación activa
              de ruido por si hay calle, batería de 30 horas (sobreviven todos
              los partidos del torneo), y latencia muy baja con LDAC para que el
              relator no llegue tres décimas tarde respecto al gol.
            </p>
          </div>
          <AmazonCard product={auriculares} variant="featured" />
        </div>
      </section>

      {/* Testimonios */}
      <section className="mx-auto w-full max-w-[1100px] px-6 py-16 md:px-10 md:py-24">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Capítulo 4
        </div>
        <h2 className="mt-4 font-display text-fluid-h2 uppercase leading-[0.95]">
          Lo que dicen los hinchas
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-fg-muted)]">
          Tres conversaciones cualesquiera de las últimas semanas. Cero
          influencers, cero rooms patrocinados. La gente de siempre hablando del
          Mundial como lo que es: el último gran rito colectivo del año.
        </p>

        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {TESTIMONIOS.map((t) => (
            <li
              key={t.autor}
              className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6"
            >
              <p className="text-base italic leading-relaxed text-[var(--color-fg)] md:text-lg">
                «{t.quote}»
              </p>
              <div className="mt-5 border-t border-[var(--color-border)] pt-4">
                <div className="font-display text-base uppercase text-[var(--color-fg)]">
                  {t.autor}
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                  {t.contexto}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-2xl font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
          Tipo testimonio · Conversaciones reales adaptadas. Anonimizadas con
          consentimiento.
        </p>
      </section>

      {/* Apple TV / Streaming */}
      <section className="mx-auto w-full max-w-[1100px] px-6 py-16 md:px-10 md:py-24">
        <div className="flex items-center gap-3">
          <Beer className="h-5 w-5 text-[var(--color-pitch)]" />
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            Capítulo 5
          </span>
        </div>
        <h2 className="mt-4 font-display text-fluid-h2 uppercase leading-[0.95]">
          El detalle que no falla
        </h2>

        <div className="mt-8 grid gap-10 md:grid-cols-[1fr_1.5fr]">
          <AmazonCard product={appleTv} variant="default" />
          <div className="space-y-6 text-base leading-[1.8] text-[var(--color-fg)]/90 md:text-lg">
            <p>
              Tu TV puede ser el más caro del mercado, pero si las apps son las
              que vienen de fábrica, llegará un momento en que Movistar+ se
              quedará pillado o DAZN dará un error en pleno tiempo añadido.
            </p>
            <p>
              Un Apple TV 4K (o un Chromecast Ultra, o un Fire TV Stick 4K Max)
              soluciona el problema de raíz: app más rápida, mejor mando, y
              acceso a las plataformas internacionales si viajas, Tubi, Peacock,
              Fox Sports App. Ciento setenta euros que en el momento crítico
              valen mucho más.
            </p>
          </div>
        </div>
      </section>

      {/* Comunidad / cierre */}
      <section className="mx-auto w-full max-w-[1100px] px-6 py-16 md:px-10 md:py-24">
        <div className="rounded-3xl border border-[var(--color-pitch)]/30 bg-gradient-to-br from-[var(--color-pitch)]/8 via-[var(--color-bg-2)] to-[var(--color-bg-2)] p-8 md:p-14">
          <h2 className="font-display text-fluid-h2 uppercase leading-tight">
            ¿Cómo es tu fan zone?
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-fg-muted)] md:text-lg">
            La pantalla, el sonido y los amigos hacen el ritual. Pero el partido
            ya tiene una ventana definida, y el ritual también: empieza el 11 de
            junio. Mientras tanto, esto es lo que vamos publicando para que la
            casa esté lista a tiempo.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={withLocale(locale as Locale, '/2026/donde-ver')}
              className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
            >
              Dónde ver el Mundial 2026
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
            </Link>
            <Link
              href={withLocale(locale as Locale, '/2026')}
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              Calendario completo
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
            </Link>
            <Link
              href={withLocale(locale as Locale, '/historias')}
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
            >
              Historias del Mundial
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto w-full max-w-[1100px] px-6 py-16 md:px-10 md:py-20">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Preguntas frecuentes
        </div>
        <h2 className="mt-4 font-display text-fluid-h2 uppercase leading-[0.95]">
          Lo que dudan los hinchas
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

      <div className="h-24" />
    </article>
  );
}

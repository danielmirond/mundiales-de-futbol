import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, Calendar } from 'lucide-react';
import { getTopPlayers } from '@/lib/data/players';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';
import { RecordTable } from '@/components/records/record-table';

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
    path: '/records/mas-mundiales-jugados',
    title:
      'Jugadores con 6 Mundiales jugados · Messi, Cristiano Ronaldo y Modrić rompen el récord en 2026',
    description:
      '¿Qué jugadores tienen más Mundiales jugados en la historia? Seis futbolistas han disputado 5 Mundiales (Carbajal, Matthäus, Márquez, Guardado, Messi, Cristiano Ronaldo). Si Messi, CR7 y Modrić juegan el Mundial 2026 alcanzarán los 6 Mundiales jugados, récord histórico absoluto. Ranking completo con partidos, minutos y goles.',
    keywords: [
      'jugadores con 6 mundiales jugados',
      'jugadores con más Mundiales jugados',
      'jugadores con 7 mundiales jugados',
      'jugadores con 5 mundiales jugados',
      'récord más Mundiales jugados',
      'Carbajal 5 Mundiales',
      'Matthäus 5 Mundiales',
      'Messi seis Mundiales 2026',
      'Cristiano Ronaldo seis Mundiales 2026',
      'Modrić seis Mundiales 2026',
      'jugador con más Mundiales',
      'futbolistas con más participaciones Copa del Mundo',
      'récord de Mundiales jugados',
    ],
  });
}

export default async function MasMundialesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const players = await getTopPlayers(30);

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '¿Qué jugador tiene más Mundiales jugados en la historia?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Seis jugadores comparten el récord histórico de 5 Mundiales disputados: Antonio Carbajal (México, 1950-1966), Lothar Matthäus (Alemania, 1982-1998), Rafael Márquez (México, 2002-2018), Andrés Guardado (México, 2006-2022), Lionel Messi (Argentina, 2006-2022) y Cristiano Ronaldo (Portugal, 2006-2022). Tres de ellos —Messi, Cristiano Ronaldo y Luka Modrić— pueden alcanzar los 6 Mundiales jugados en 2026.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Qué jugadores pueden tener 6 Mundiales jugados en 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Solo tres futbolistas están en disposición de alcanzar los 6 Mundiales en 2026: Lionel Messi (Argentina, jugó 2006-2022), Cristiano Ronaldo (Portugal, jugó 2006-2022) y Luka Modrić (Croacia, jugó 2006-2022). Los tres están convocados o en la prelista de sus selecciones. Sería el récord histórico absoluto: 6 participaciones en una Copa del Mundo.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Cuántos jugadores han disputado 7 Mundiales?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ninguno. El máximo histórico son 5 Mundiales jugados, compartido por seis futbolistas. Para alcanzar 7 Mundiales un jugador tendría que tener una carrera de 24+ años consecutivos en la élite, escenario sin precedentes incluso para Messi (39 años en 2026) o Cristiano Ronaldo (41 años en 2026).',
        },
      },
      {
        '@type': 'Question',
        name: '¿Cuál es el jugador con más partidos disputados en Mundiales?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Lionel Messi lidera el ranking de partidos disputados en Mundiales con 26 (2006-2022). Le siguen Lothar Matthäus con 25 (1982-1998) y Cristiano Ronaldo con 22 (2006-2022). En el Mundial 2026 Messi y CR7 podrían ampliar la cifra.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Pelé jugó 6 Mundiales?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. Pelé disputó 4 Mundiales (1958, 1962, 1966, 1970), ganando tres (1958, 1962, 1970). Es el único jugador campeón en tres Copas del Mundo, pero está por debajo del récord de 5 Mundiales en participaciones.',
        },
      },
    ],
  };

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Jugadores con más Mundiales disputados',
    numberOfItems: players.length,
    itemListElement: players.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Person',
        name: (p.known_as && p.known_as.trim()) || p.full_name,
        nationality: p.nationality_code,
        url: localeUrl(locale, `/jugadores/${p.slug}`),
      },
    })),
  };

  return (
    <article className="pt-32">
      <JsonLd
        data={[
          itemListLd,
          faqLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Récords', path: '/records' },
            { name: 'Más Mundiales jugados', path: '/records/mas-mundiales-jugados' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/records')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Récords mundialistas
        </Link>

        <div className="mt-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-sky-300">
          <Calendar className="h-4 w-4" />
          <span>Top 30 · más participaciones</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          Jugadores con<br />6 Mundiales en 2026
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          El récord histórico de Mundiales jugados son <strong>5 participaciones</strong>, compartido por <strong>seis futbolistas</strong>: Antonio Carbajal (México, 1950-1966), Lothar Matthäus (Alemania, 1982-1998), Rafael Márquez (México, 2002-2018), Andrés Guardado (México, 2006-2022), Lionel Messi (Argentina, 2006-2022) y Cristiano Ronaldo (Portugal, 2006-2022). En el Mundial 2026 pueden alcanzar los <strong>6 Mundiales jugados</strong> tres jugadores: <strong>Messi, Cristiano Ronaldo y Luka Modrić</strong>. Sería récord absoluto.
        </p>
      </header>

      <section className="mx-auto mt-16 w-full max-w-[1400px] px-6 md:px-10">
        <RecordTable
          players={players}
          highlightLabel="Mundiales"
          locale={locale}
          columns={[
            { label: 'Mundiales', value: (p) => p.wc_count, primary: true },
            { label: 'Goles', value: (p) => p.goals, hideOnMobile: false },
            { label: 'Min.', value: (p) => p.total_minutes, hideOnMobile: true },
          ]}
        />
        <p className="mt-8 max-w-3xl text-xs leading-relaxed text-[var(--color-fg-subtle)]">
          Récord absoluto: 6 jugadores con 5 Mundiales (lista arriba). En partidos
          el ranking lo lidera Messi con 26, seguido de Matthäus con 25 y CR7
          con 22. Si en la tabla no aparece alguno de los 6 con 5 Mundiales,
          revisa su ficha individual: la convocatoria está, pero el agregado
          puede tardar en sincronizar.
        </p>
      </section>

      <section className="mx-auto mt-20 w-full max-w-[1400px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-8 md:p-12">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            Más récords
          </div>
          <h2 className="mt-3 font-display text-2xl uppercase md:text-3xl">
            Sigue explorando
          </h2>
          <ul className="mt-6 grid gap-3 md:grid-cols-3">
            <li>
              <Link
                href={withLocale(locale as Locale, '/records/maximos-goleadores')}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] p-4 transition-colors hover:border-[var(--color-pitch)]/50"
              >
                <span className="font-medium text-[var(--color-fg)]">Máximos goleadores</span>
                <span className="font-mono text-xs text-[var(--color-fg-subtle)] transition-colors group-hover:text-[var(--color-pitch)]">→</span>
              </Link>
            </li>
            <li>
              <Link
                href={withLocale(locale as Locale, '/records/mas-minutos')}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] p-4 transition-colors hover:border-[var(--color-pitch)]/50"
              >
                <span className="font-medium text-[var(--color-fg)]">Más minutos disputados</span>
                <span className="font-mono text-xs text-[var(--color-fg-subtle)] transition-colors group-hover:text-[var(--color-pitch)]">→</span>
              </Link>
            </li>
            <li>
              <Link
                href={withLocale(locale as Locale, '/palmares')}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] p-4 transition-colors hover:border-[var(--color-pitch)]/50"
              >
                <span className="font-medium text-[var(--color-fg)]">Palmarés completo</span>
                <span className="font-mono text-xs text-[var(--color-fg-subtle)] transition-colors group-hover:text-[var(--color-pitch)]">→</span>
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-[1100px] px-6 md:px-10">
        <h2 className="font-display text-3xl uppercase">Preguntas frecuentes</h2>
        <div className="mt-6 space-y-4">
          {[
            {
              q: '¿Qué jugador tiene más Mundiales jugados en la historia?',
              a: 'Seis jugadores comparten el récord histórico de 5 Mundiales: Antonio Carbajal, Lothar Matthäus, Rafael Márquez, Andrés Guardado, Lionel Messi y Cristiano Ronaldo. Tres de ellos pueden llegar a 6 Mundiales en 2026.',
            },
            {
              q: '¿Quién puede tener 6 Mundiales jugados en 2026?',
              a: 'Solo Lionel Messi (Argentina), Cristiano Ronaldo (Portugal) y Luka Modrić (Croacia) están en disposición de alcanzar los 6 Mundiales jugados en el torneo de Estados Unidos, Canadá y México. Los tres están convocados o en prelista.',
            },
            {
              q: '¿Cuántos jugadores han disputado 7 Mundiales?',
              a: 'Ninguno. El máximo histórico son 5 Mundiales, compartido por seis jugadores. Llegar a 7 Mundiales requeriría 24+ años en la élite, escenario sin precedentes en la historia del fútbol.',
            },
            {
              q: '¿Cuál es el jugador con más partidos disputados en Mundiales?',
              a: 'Lionel Messi lidera con 26 partidos. Le siguen Lothar Matthäus con 25 y Cristiano Ronaldo con 22. En 2026 Messi y CR7 pueden ampliar el ranking.',
            },
            {
              q: '¿Pelé jugó 6 Mundiales?',
              a: 'No. Pelé disputó 4 Mundiales (1958, 1962, 1966, 1970), ganando tres. Es el único jugador campeón en tres Copas del Mundo, pero está por debajo del récord de 5 participaciones.',
            },
            {
              q: '¿Qué jugadores tienen 5 Mundiales jugados?',
              a: 'Carbajal (México 1950-1966), Matthäus (Alemania 1982-1998), Márquez (México 2002-2018), Guardado (México 2006-2022), Messi (Argentina 2006-2022) y Ronaldo (Portugal 2006-2022). Seis jugadores en 96 años de Mundiales.',
            },
          ].map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5"
            >
              <summary className="cursor-pointer font-display text-base uppercase tracking-tight text-[var(--color-fg)] group-open:text-[var(--color-pitch)]">
                {f.q}
              </summary>
              <p className="mt-3 text-base leading-relaxed text-[var(--color-fg-muted)]">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <div className="h-24" />
    </article>
  );
}

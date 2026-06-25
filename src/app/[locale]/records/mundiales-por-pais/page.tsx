import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, Trophy } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

/**
 * Hub editorial que responde a las queries tipo "cuántos mundiales ha
 * ganado / tiene X", masivas según GSC: USA 93+47+46+31+26 imps,
 * Ecuador 69+56+42+36 imps, Canadá 42+26+20+10 imps, etc. Total
 * cluster: 1.400+ impresiones mensuales actualmente sin clicks.
 *
 * Estructura: dos tablas (campeones + participaciones), FAQ schema.
 */

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/records/mundiales-por-pais',
    title:
      'Mundiales ganados por país · Brasil 5, Alemania e Italia 4, Argentina y Francia 2-3',
    description:
      '¿Cuántos Mundiales ha ganado cada país? Brasil 5 (1958, 1962, 1970, 1994, 2002); Alemania 4 (1954, 1974, 1990, 2014); Italia 4 (1934, 1938, 1982, 2006); Argentina 3 (1978, 1986, 2022); Francia 2 (1998, 2018); Uruguay 2 (1930, 1950); Inglaterra 1 (1966); España 1 (2010). Cuántos Mundiales han ganado Ecuador, Canadá, Estados Unidos, Chile, Perú, México y todas las selecciones que nunca alzaron la copa.',
    keywords: [
      'cuántos Mundiales ha ganado España',
      'cuántos Mundiales ha ganado Alemania',
      'cuántos Mundiales tiene Estados Unidos',
      'cuántos Mundiales ha ganado Ecuador',
      'cuántos Mundiales ha ganado Canadá',
      'cuántos Mundiales tiene Argentina',
      'países que han ganado el Mundial',
      'Mundiales ganados por país',
      'cuántos mundiales tiene Chile',
      'cuántos mundiales tiene Perú',
      'cuántos mundiales tiene Panamá',
      'campeones del Mundial historia',
      'palmarés Mundiales Copa del Mundo',
    ],
  });
}

const CAMPEONES = [
  { code: 'BRA', name: 'Brasil', flag: '🇧🇷', titulos: 5, anos: '1958, 1962, 1970, 1994, 2002' },
  { code: 'GER', name: 'Alemania', flag: '🇩🇪', titulos: 4, anos: '1954, 1974, 1990, 2014' },
  { code: 'ITA', name: 'Italia', flag: '🇮🇹', titulos: 4, anos: '1934, 1938, 1982, 2006' },
  { code: 'ARG', name: 'Argentina', flag: '🇦🇷', titulos: 3, anos: '1978, 1986, 2022' },
  { code: 'FRA', name: 'Francia', flag: '🇫🇷', titulos: 2, anos: '1998, 2018' },
  { code: 'URU', name: 'Uruguay', flag: '🇺🇾', titulos: 2, anos: '1930, 1950' },
  { code: 'ENG', name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', titulos: 1, anos: '1966' },
  { code: 'ESP', name: 'España', flag: '🇪🇸', titulos: 1, anos: '2010' },
];

type Participacion = {
  code: string;
  name: string;
  flag: string;
  participaciones: number;
  titulos: number;
  mejor: string;
};

const PARTICIPACIONES: Participacion[] = [
  { code: 'BRA', name: 'Brasil', flag: '🇧🇷', participaciones: 22, titulos: 5, mejor: 'Campeón 5×' },
  { code: 'GER', name: 'Alemania', flag: '🇩🇪', participaciones: 20, titulos: 4, mejor: 'Campeón 4×' },
  { code: 'ITA', name: 'Italia', flag: '🇮🇹', participaciones: 18, titulos: 4, mejor: 'Campeón 4×' },
  { code: 'ARG', name: 'Argentina', flag: '🇦🇷', participaciones: 18, titulos: 3, mejor: 'Campeón 3×' },
  { code: 'MEX', name: 'México', flag: '🇲🇽', participaciones: 17, titulos: 0, mejor: 'Cuartos 1970, 1986' },
  { code: 'FRA', name: 'Francia', flag: '🇫🇷', participaciones: 16, titulos: 2, mejor: 'Campeón 2×' },
  { code: 'ESP', name: 'España', flag: '🇪🇸', participaciones: 16, titulos: 1, mejor: 'Campeón 2010' },
  { code: 'ENG', name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', participaciones: 16, titulos: 1, mejor: 'Campeón 1966' },
  { code: 'URU', name: 'Uruguay', flag: '🇺🇾', participaciones: 14, titulos: 2, mejor: 'Campeón 2×' },
  { code: 'BEL', name: 'Bélgica', flag: '🇧🇪', participaciones: 14, titulos: 0, mejor: '3.º en 2018' },
  { code: 'SUI', name: 'Suiza', flag: '🇨🇭', participaciones: 12, titulos: 0, mejor: 'Cuartos 1934, 1938, 1954' },
  { code: 'USA', name: 'Estados Unidos', flag: '🇺🇸', participaciones: 11, titulos: 0, mejor: '3.º en 1930' },
  { code: 'KOR', name: 'Corea del Sur', flag: '🇰🇷', participaciones: 11, titulos: 0, mejor: '4.º en 2002' },
  { code: 'NED', name: 'Países Bajos', flag: '🇳🇱', participaciones: 11, titulos: 0, mejor: '3 subcampeonatos (1974, 1978, 2010)' },
  { code: 'CHI', name: 'Chile', flag: '🇨🇱', participaciones: 9, titulos: 0, mejor: '3.º en 1962' },
  { code: 'POL', name: 'Polonia', flag: '🇵🇱', participaciones: 9, titulos: 0, mejor: '3.º en 1974 y 1982' },
  { code: 'POR', name: 'Portugal', flag: '🇵🇹', participaciones: 8, titulos: 0, mejor: '3.º en 1966' },
  { code: 'PAR', name: 'Paraguay', flag: '🇵🇾', participaciones: 8, titulos: 0, mejor: 'Cuartos 2010' },
  { code: 'CMR', name: 'Camerún', flag: '🇨🇲', participaciones: 8, titulos: 0, mejor: 'Cuartos 1990' },
  { code: 'JPN', name: 'Japón', flag: '🇯🇵', participaciones: 7, titulos: 0, mejor: 'Octavos 4×' },
  { code: 'NGA', name: 'Nigeria', flag: '🇳🇬', participaciones: 6, titulos: 0, mejor: 'Octavos 1994, 1998, 2014' },
  { code: 'IRN', name: 'Irán', flag: '🇮🇷', participaciones: 6, titulos: 0, mejor: 'Fase de grupos' },
  { code: 'KSA', name: 'Arabia Saudí', flag: '🇸🇦', participaciones: 6, titulos: 0, mejor: 'Octavos 1994' },
  { code: 'TUN', name: 'Túnez', flag: '🇹🇳', participaciones: 6, titulos: 0, mejor: 'Fase de grupos' },
  { code: 'MAR', name: 'Marruecos', flag: '🇲🇦', participaciones: 6, titulos: 0, mejor: '4.º en 2022 (récord africano)' },
  { code: 'CRO', name: 'Croacia', flag: '🇭🇷', participaciones: 6, titulos: 0, mejor: 'Subcampeona 2018' },
  { code: 'COL', name: 'Colombia', flag: '🇨🇴', participaciones: 6, titulos: 0, mejor: 'Cuartos 2014' },
  { code: 'CRC', name: 'Costa Rica', flag: '🇨🇷', participaciones: 6, titulos: 0, mejor: 'Cuartos 2014' },
  { code: 'AUS', name: 'Australia', flag: '🇦🇺', participaciones: 6, titulos: 0, mejor: 'Octavos 2006, 2022' },
  { code: 'PER', name: 'Perú', flag: '🇵🇪', participaciones: 5, titulos: 0, mejor: 'Cuartos 1970' },
  { code: 'GHA', name: 'Ghana', flag: '🇬🇭', participaciones: 4, titulos: 0, mejor: 'Cuartos 2010' },
  { code: 'ECU', name: 'Ecuador', flag: '🇪🇨', participaciones: 4, titulos: 0, mejor: 'Octavos 2006' },
  { code: 'EGY', name: 'Egipto', flag: '🇪🇬', participaciones: 3, titulos: 0, mejor: 'Fase de grupos' },
  { code: 'HON', name: 'Honduras', flag: '🇭🇳', participaciones: 3, titulos: 0, mejor: 'Fase de grupos' },
  { code: 'BOL', name: 'Bolivia', flag: '🇧🇴', participaciones: 3, titulos: 0, mejor: 'Fase de grupos' },
  { code: 'CAN', name: 'Canadá', flag: '🇨🇦', participaciones: 2, titulos: 0, mejor: 'Fase de grupos (1986, 2022). Anfitrión 2026' },
  { code: 'SLV', name: 'El Salvador', flag: '🇸🇻', participaciones: 2, titulos: 0, mejor: 'Fase de grupos' },
  { code: 'CUB', name: 'Cuba', flag: '🇨🇺', participaciones: 1, titulos: 0, mejor: 'Cuartos 1938 (único Mundial)' },
  { code: 'PAN', name: 'Panamá', flag: '🇵🇦', participaciones: 1, titulos: 0, mejor: 'Fase de grupos 2018' },
  { code: 'HAI', name: 'Haití', flag: '🇭🇹', participaciones: 1, titulos: 0, mejor: 'Fase de grupos 1974' },
  { code: 'CHN', name: 'China', flag: '🇨🇳', participaciones: 1, titulos: 0, mejor: 'Fase de grupos 2002' },
];

export default async function MundialesPorPaisPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '¿Qué país ha ganado más Mundiales?',
        acceptedAnswer: { '@type': 'Answer', text: 'Brasil con 5 títulos: 1958 (Suecia), 1962 (Chile), 1970 (México), 1994 (Estados Unidos) y 2002 (Corea-Japón). Es el único país que ha disputado los 22 Mundiales desde 1930.' },
      },
      {
        '@type': 'Question',
        name: '¿Cuántos Mundiales ha ganado Alemania?',
        acceptedAnswer: { '@type': 'Answer', text: 'Alemania ha ganado 4 Mundiales (1954, 1974, 1990 y 2014), todos incluyendo el periodo de la República Federal de Alemania antes de la reunificación. Empatada con Italia como segunda más ganadora.' },
      },
      {
        '@type': 'Question',
        name: '¿Cuántos Mundiales ha ganado España?',
        acceptedAnswer: { '@type': 'Answer', text: 'España ha ganado un único Mundial: Sudáfrica 2010, con gol de Andrés Iniesta en la prórroga de la final contra Países Bajos. Es la sexta nación campeona de la historia.' },
      },
      {
        '@type': 'Question',
        name: '¿Cuántos Mundiales ha ganado Argentina?',
        acceptedAnswer: { '@type': 'Answer', text: 'Argentina ha ganado 3 Mundiales: 1978 (anfitriona, con Kempes), 1986 (México, con Maradona) y 2022 (Catar, con Messi). Subcampeona tres veces más.' },
      },
      {
        '@type': 'Question',
        name: '¿Cuántos Mundiales ha ganado Estados Unidos?',
        acceptedAnswer: { '@type': 'Answer', text: 'Estados Unidos no ha ganado ningún Mundial. Su mejor resultado fue el tercer puesto en el primer Mundial de la historia (Uruguay 1930). Será anfitrión del Mundial 2026 junto con Canadá y México.' },
      },
      {
        '@type': 'Question',
        name: '¿Cuántos Mundiales ha ganado Ecuador?',
        acceptedAnswer: { '@type': 'Answer', text: 'Ecuador no ha ganado ningún Mundial. Su mejor actuación fueron los octavos de final de Alemania 2006. Ha participado en 4 Mundiales (2002, 2006, 2014, 2022).' },
      },
      {
        '@type': 'Question',
        name: '¿Cuántos Mundiales ha ganado Canadá?',
        acceptedAnswer: { '@type': 'Answer', text: 'Canadá no ha ganado ningún Mundial. Solo ha participado en dos (México 1986 y Catar 2022), sin pasar de fase de grupos. Es coanfitrión del Mundial 2026.' },
      },
      {
        '@type': 'Question',
        name: '¿Cuántos Mundiales ha ganado Chile?',
        acceptedAnswer: { '@type': 'Answer', text: 'Chile no ha ganado ningún Mundial. Su mejor resultado es el tercer puesto como anfitrión en 1962. Ha participado en 9 Mundiales, el último Brasil 2014.' },
      },
      {
        '@type': 'Question',
        name: '¿Cuántos Mundiales ha ganado Perú?',
        acceptedAnswer: { '@type': 'Answer', text: 'Perú no ha ganado ningún Mundial. Su mejor actuación fueron los cuartos de final en México 1970. Ha participado en 5 Mundiales: 1930, 1970, 1978, 1982 y 2018.' },
      },
      {
        '@type': 'Question',
        name: '¿Qué países han llegado a la final del Mundial sin ganar?',
        acceptedAnswer: { '@type': 'Answer', text: 'Cuatro países han llegado a la final del Mundial sin ganar nunca: Países Bajos (3 finales perdidas: 1974, 1978, 2010), Hungría (1938, 1954), Checoslovaquia (1934, 1962) y Suecia (1958). Croacia ha llegado a una final (2018).' },
      },
    ],
  };

  return (
    <article className="pt-32 pb-24">
      <JsonLd
        data={[
          faqLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Récords', path: '/records' },
            { name: 'Mundiales por país', path: '/records/mundiales-por-pais' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/records')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Récords mundialistas
        </Link>

        <div className="mt-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Trophy className="h-4 w-4" />
          <span>Palmarés y participaciones · 1930-2022</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          Mundiales ganados por país
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          Ocho países han ganado un Mundial en 96 años: <strong>Brasil 5</strong>, <strong>Alemania 4</strong>, <strong>Italia 4</strong>, <strong>Argentina 3</strong>, <strong>Francia 2</strong>, <strong>Uruguay 2</strong>, <strong>Inglaterra 1</strong> y <strong>España 1</strong>. Países que nunca lo ganaron pero llegaron a la final: Países Bajos (3 veces), Hungría (2), Checoslovaquia (2), Suecia (1) y Croacia (1). Tabla con participaciones y mejor resultado de cada selección que ha jugado al menos un Mundial.
        </p>
      </header>

      <section className="mx-auto mt-12 w-full max-w-[1100px] px-6 md:px-10">
        <h2 className="font-display text-3xl uppercase">Los 8 campeones</h2>
        <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--color-border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--color-bg-2)] text-left font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-subtle)]">
                <th className="p-4 w-12 text-right">#</th>
                <th className="p-4">Selección</th>
                <th className="p-4 text-right">Títulos</th>
                <th className="p-4">Años</th>
              </tr>
            </thead>
            <tbody>
              {CAMPEONES.map((c, i) => (
                <tr key={c.code} className="border-t border-[var(--color-border)] hover:bg-[var(--color-bg-2)]">
                  <td className="p-4 text-right font-mono text-xs text-[var(--color-fg-subtle)] tab-num">{i + 1}</td>
                  <td className="p-4">
                    <Link
                      href={withLocale(locale as Locale, `/selecciones/${c.code}`)}
                      className="flex items-center gap-2 font-medium text-[var(--color-fg)] hover:text-[var(--color-pitch)]"
                    >
                      <span className="text-xl">{c.flag}</span>
                      {c.name}
                    </Link>
                  </td>
                  <td className="p-4 text-right font-display text-lg tab-num text-[var(--color-fg)]">{c.titulos}</td>
                  <td className="p-4 font-mono text-xs text-[var(--color-fg-muted)] tab-num">{c.anos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10">
        <h2 className="font-display text-3xl uppercase">Participaciones por selección</h2>
        <p className="mt-3 text-sm text-[var(--color-fg-muted)]">
          Brasil es la única selección que ha disputado todos los Mundiales desde Uruguay 1930. Le siguen Alemania (20), Italia y Argentina (18 cada una).
        </p>
        <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--color-border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--color-bg-2)] text-left font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-subtle)]">
                <th className="p-4">Selección</th>
                <th className="p-4 text-right">Mundiales</th>
                <th className="p-4 text-right hidden sm:table-cell">Títulos</th>
                <th className="p-4 hidden md:table-cell">Mejor resultado</th>
              </tr>
            </thead>
            <tbody>
              {PARTICIPACIONES.map((p) => (
                <tr key={p.code} className="border-t border-[var(--color-border)] hover:bg-[var(--color-bg-2)]">
                  <td className="p-4">
                    <Link
                      href={withLocale(locale as Locale, `/selecciones/${p.code}`)}
                      className="flex items-center gap-2 font-medium text-[var(--color-fg)] hover:text-[var(--color-pitch)]"
                    >
                      <span className="text-xl">{p.flag}</span>
                      {p.name}
                    </Link>
                  </td>
                  <td className="p-4 text-right font-display text-lg tab-num text-[var(--color-fg)]">{p.participaciones}</td>
                  <td className="p-4 text-right tab-num text-[var(--color-fg-muted)] hidden sm:table-cell">{p.titulos}</td>
                  <td className="p-4 text-sm text-[var(--color-fg-muted)] hidden md:table-cell">{p.mejor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <h2 className="font-display text-3xl uppercase">Preguntas frecuentes</h2>
        <div className="mt-6 space-y-4">
          {faqLd.mainEntity.slice(0, 8).map((f) => (
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

      <section className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
          <h2 className="font-display text-lg uppercase">Más récords</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={withLocale(locale as Locale, '/records/goles-por-seleccion')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">Goles por selección</Link>
            <Link href={withLocale(locale as Locale, '/records/mas-mundiales-jugados')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">Jugadores con más Mundiales</Link>
            <Link href={withLocale(locale as Locale, '/palmares')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">Palmarés completo</Link>
            <Link href={withLocale(locale as Locale, '/ediciones')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">22 Mundiales 1930-2026</Link>
          </div>
        </div>
      </section>
    </article>
  );
}

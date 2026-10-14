import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, Trophy } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';
import { teamWorldCupRecord, bestWorldCupStage, worldCupFinals } from '@/lib/wc-head-to-head';
import { teamWorldCupFaq, type Faq } from '@/lib/team-faq';
import { FaqBlock, faqLd as buildFaqLd } from '@/components/team/team-faq';

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
    title: 'Mundiales ganados por país · Palmarés y participaciones de cada selección',
    description:
      '¿Cuántos Mundiales ha ganado cada país? Brasil 5; Alemania 4; Italia 4; Argentina 3; Francia 2; Uruguay 2; España 2 (2010 y 2026); Inglaterra 1. Participaciones y mejor resultado de Ecuador, Canadá, Estados Unidos, Chile, Perú, México y todas las selecciones que nunca alzaron la copa.',
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

type Participacion = {
  code: string;
  name: string;
  flag: string;
};

const SELECCIONES: Participacion[] = [
  { code: 'BRA', name: 'Brasil', flag: '🇧🇷' },
  { code: 'GER', name: 'Alemania', flag: '🇩🇪' },
  { code: 'ITA', name: 'Italia', flag: '🇮🇹' },
  { code: 'ARG', name: 'Argentina', flag: '🇦🇷' },
  { code: 'MEX', name: 'México', flag: '🇲🇽' },
  { code: 'FRA', name: 'Francia', flag: '🇫🇷' },
  { code: 'ESP', name: 'España', flag: '🇪🇸' },
  { code: 'ENG', name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { code: 'URU', name: 'Uruguay', flag: '🇺🇾' },
  { code: 'BEL', name: 'Bélgica', flag: '🇧🇪' },
  { code: 'SUI', name: 'Suiza', flag: '🇨🇭' },
  { code: 'USA', name: 'Estados Unidos', flag: '🇺🇸' },
  { code: 'KOR', name: 'Corea del Sur', flag: '🇰🇷' },
  { code: 'NED', name: 'Países Bajos', flag: '🇳🇱' },
  { code: 'CHI', name: 'Chile', flag: '🇨🇱' },
  { code: 'POL', name: 'Polonia', flag: '🇵🇱' },
  { code: 'POR', name: 'Portugal', flag: '🇵🇹' },
  { code: 'PAR', name: 'Paraguay', flag: '🇵🇾' },
  { code: 'CMR', name: 'Camerún', flag: '🇨🇲' },
  { code: 'JPN', name: 'Japón', flag: '🇯🇵' },
  { code: 'NGA', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'IRN', name: 'Irán', flag: '🇮🇷' },
  { code: 'KSA', name: 'Arabia Saudí', flag: '🇸🇦' },
  { code: 'TUN', name: 'Túnez', flag: '🇹🇳' },
  { code: 'MAR', name: 'Marruecos', flag: '🇲🇦' },
  { code: 'CRO', name: 'Croacia', flag: '🇭🇷' },
  { code: 'COL', name: 'Colombia', flag: '🇨🇴' },
  { code: 'CRC', name: 'Costa Rica', flag: '🇨🇷' },
  { code: 'AUS', name: 'Australia', flag: '🇦🇺' },
  { code: 'PER', name: 'Perú', flag: '🇵🇪' },
  { code: 'GHA', name: 'Ghana', flag: '🇬🇭' },
  { code: 'ECU', name: 'Ecuador', flag: '🇪🇨' },
  { code: 'EGY', name: 'Egipto', flag: '🇪🇬' },
  { code: 'HON', name: 'Honduras', flag: '🇭🇳' },
  { code: 'BOL', name: 'Bolivia', flag: '🇧🇴' },
  { code: 'CAN', name: 'Canadá', flag: '🇨🇦' },
  { code: 'SLV', name: 'El Salvador', flag: '🇸🇻' },
  { code: 'CUB', name: 'Cuba', flag: '🇨🇺' },
  { code: 'PAN', name: 'Panamá', flag: '🇵🇦' },
  { code: 'HAI', name: 'Haití', flag: '🇭🇹' },
  { code: 'CHN', name: 'China', flag: '🇨🇳' },
];

/** Linaje FIFA: la RFA cuenta como Alemania. */
const LINEAGE: Record<string, string[]> = { GER: ['GER', 'FRG'] };
const yearsEs = (ys: string[]) => (ys.length <= 1 ? ys.join('') : `${ys.slice(0, -1).join(', ')} y ${ys[ys.length - 1]}`);

/** Participaciones, títulos y mejor resultado derivados del histórico (incluye 2026). */
const PARTICIPACIONES = SELECCIONES.map((t) => {
  const codes = LINEAGE[t.code] ?? [t.code];
  const rec = teamWorldCupRecord(codes);
  const { won, lost } = worldCupFinals(codes);
  const best = bestWorldCupStage(codes);
  const mejor = won.length > 0
    ? `Campeón ${won.length > 1 ? `${won.length}× ` : ''}(${yearsEs(won)})`
    : lost.length > 1
      ? `Subcampeón ${lost.length}× (${yearsEs(lost)})`
      : best ? `${best.label} · ${best.year}` : '—';
  return { ...t, codes, participaciones: rec.wcCount, titulos: won.length, anos: won, mejor };
}).sort((x, y) => y.participaciones - x.participaciones || y.titulos - x.titulos);

const CAMPEONES = PARTICIPACIONES.filter((p) => p.titulos > 0)
  .sort((x, y) => y.titulos - x.titulos || x.anos[0].localeCompare(y.anos[0]));

/** Preguntas con más impresiones en GSC; la respuesta sale de los datos. */
const FAQ_TEAMS = ['ESP', 'GER', 'ARG', 'POR', 'USA', 'MEX', 'ECU', 'CAN', 'CHI', 'PER'];

function buildFaq(): Faq[] {
  const top = CAMPEONES[0];
  const tied = CAMPEONES.filter((c) => c.titulos === top.titulos);
  const out: Faq[] = [
    {
      q: '¿Qué país ha ganado más Mundiales?',
      a: tied.length === 1
        ? `${top.name}, con ${top.titulos} Mundiales: ${yearsEs(top.anos)}.`
        : `${yearsEs(tied.map((c) => c.name))}, con ${top.titulos} Mundiales cada una.`,
    },
    {
      q: '¿Qué países han ganado el Mundial?',
      a: `${CAMPEONES.length} países han ganado el Mundial: ${yearsEs(CAMPEONES.map((c) => `${c.name} (${c.titulos})`))}.`,
    },
  ];
  for (const code of FAQ_TEAMS) {
    const t = PARTICIPACIONES.find((p) => p.code === code);
    if (!t) continue;
    const [first] = teamWorldCupFaq(t.name, t.codes);
    if (!first) continue;
    out.push({ q: `¿Cuántos Mundiales ha ganado ${t.name}?`, a: first.a.startsWith('No,') ? `${t.name} no ha ganado ningún Mundial.${first.a.slice(first.a.indexOf('.') + 1)}` : first.a });
  }
  return out;
}

export default async function MundialesPorPaisPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const faq = buildFaq();
  const faqLd = buildFaqLd(faq);

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
          <span>Palmarés y participaciones · 1930-2026</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          Mundiales ganados por país
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          {CAMPEONES.length} países han ganado un Mundial desde 1930:{' '}
          {CAMPEONES.map((c, i) => (
            <span key={c.code}>{i > 0 && (i === CAMPEONES.length - 1 ? ' y ' : ', ')}<strong>{c.name} {c.titulos}</strong></span>
          ))}. Países que llegaron a la final sin ganarla nunca: Países Bajos (3 veces), Hungría (2), Checoslovaquia (2), Suecia (1) y Croacia (1). Tabla con participaciones y mejor resultado de cada selección que ha jugado al menos un Mundial.
        </p>
      </header>

      <section className="mx-auto mt-12 w-full max-w-[1100px] px-6 md:px-10">
        <h2 className="font-display text-3xl uppercase">Los {CAMPEONES.length} campeones</h2>
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
                  <td className="p-4 font-mono text-xs text-[var(--color-fg-muted)] tab-num">{c.anos.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10">
        <h2 className="font-display text-3xl uppercase">Participaciones por selección</h2>
        <p className="mt-3 text-sm text-[var(--color-fg-muted)]">
          Brasil es la única selección que ha disputado todos los Mundiales desde Uruguay 1930. Datos actualizados con el Mundial 2026.
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

      <FaqBlock title="Cuántos Mundiales ha ganado cada país" items={faq} width="max-w-[1100px]" />

      <section className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
          <h2 className="font-display text-lg uppercase">Más récords</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={withLocale(locale as Locale, '/records/goles-por-seleccion')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">Goles por selección</Link>
            <Link href={withLocale(locale as Locale, '/records/mas-mundiales-jugados')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">Jugadores con más Mundiales</Link>
            <Link href={withLocale(locale as Locale, '/palmares')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">Palmarés completo</Link>
            <Link href={withLocale(locale as Locale, '/ediciones')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">23 Mundiales 1930-2026</Link>
          </div>
        </div>
      </section>
    </article>
  );
}

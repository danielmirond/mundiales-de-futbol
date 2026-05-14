import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, Flag, AlertCircle } from 'lucide-react';
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
  return pageMetadata({
    locale,
    path: '/2026/normas-estadios/banderas-y-mensajes',
    title: 'Banderas y mensajes políticos en el Mundial 2026',
    description:
      'Política FIFA sobre banderas y mensajes en los estadios del Mundial 2026: banderas de selección permitidas, banderas con asta prohibidas, mensajes políticos no deportivos a discreción del operativo de seguridad.',
    keywords: [
      'banderas Mundial 2026',
      'mensajes políticos Mundial 2026',
      'bandera Palestina estadio Mundial 2026',
      'bandera LGBT estadio Mundial 2026',
      'pancartas Mundial 2026',
      'tifo Mundial 2026',
      'censura banderas FIFA',
    ],
    type: 'article',
  });
}

export default async function FlagsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Banderas y mensajes políticos en el Mundial 2026',
    url: localeUrl(locale, '/2026/normas-estadios/banderas-y-mensajes'),
    inLanguage: locale,
  };

  return (
    <article className="pt-32 pb-24">
      <JsonLd
        data={[
          articleLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Mundial 2026', path: '/2026' },
            { name: 'Normas estadios', path: '/2026/normas-estadios' },
            { name: 'Banderas y mensajes', path: '/2026/normas-estadios/banderas-y-mensajes' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[900px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/2026/normas-estadios')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-pitch)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Normas estadios
        </Link>

        <div className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Flag className="mr-2 inline h-3 w-3" /> Banderas y mensajes
        </div>
        <h1 className="mt-3 font-display text-4xl uppercase leading-[1] md:text-5xl">
          La zona gris del Mundial 2026
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-fg-muted)]">
          FIFA permite banderas de selección y prohíbe banderas con asta. Lo que pasa entre
          medias —banderas con mensaje políticamente sensible, pancartas LGBT, símbolos
          religiosos, banderas de naciones no participantes— se decide caso a caso por el
          operativo de seguridad del estadio.
        </p>
      </header>

      {/* Reglas claras */}
      <section className="mx-auto mt-16 w-full max-w-[900px] px-6 md:px-10">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--color-pitch)]/40 bg-[var(--color-bg-2)] p-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              ✓ Sí están permitidas
            </div>
            <ul className="mt-4 space-y-2.5 text-sm text-[var(--color-fg)]">
              <li>Banderas oficiales de las 48 selecciones participantes</li>
              <li>Banderas SIN asta (llevadas con la mano)</li>
              <li>Pancartas de tela sin palos ni varillas metálicas</li>
              <li>Camisetas y bufandas de cualquier selección</li>
              <li>Pintura facial / corporal no permanente</li>
              <li>Cánticos y aplausos del fan experience tradicional</li>
              <li>Tifos colectivos coordinados con el club / federación</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-red-500/40 bg-red-500/5 p-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-red-500">
              ✗ Prohibidas explícitamente
            </div>
            <ul className="mt-4 space-y-2.5 text-sm text-[var(--color-fg)]">
              <li>Banderas o pancartas con asta / palo / varilla</li>
              <li>Banderas de organizaciones consideradas terroristas por las jurisdicciones locales</li>
              <li>Símbolos de odio explícitos (esvástica, etc.)</li>
              <li>Cantos racistas, xenofobios u homofóbicos</li>
              <li>Mensajes publicitarios comerciales no autorizados (ambush marketing)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Zona gris */}
      <section className="mx-auto mt-16 w-full max-w-[900px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-sun)]/40 bg-gradient-to-br from-[var(--color-bg-2)] to-[color-mix(in_oklab,_var(--color-sun)_5%,_var(--color-bg-2))] p-6 md:p-8">
          <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-sun)]">
            <AlertCircle className="h-3 w-3" /> Zona gris
          </div>
          <h2 className="mt-3 font-display text-2xl uppercase">«Cada caso se evalúa en el momento»</h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-fg-muted)]">
            La respuesta oficial de FIFA a las preguntas sobre banderas con mensaje
            político o social sensible es ambigua por diseño: <em>«cada caso se evalúa en
            el momento por el operativo del estadio»</em>. Ese principio cubre situaciones
            como:
          </p>
          <ul className="mt-5 space-y-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">
            <li className="flex items-start gap-2">
              <span className="text-[var(--color-sun)] mt-1">·</span>
              <span><strong className="text-[var(--color-fg)]">Banderas Palestina / Israel</strong> en partidos sin esas selecciones participando. Precedente Qatar 2022: las de Palestina fueron toleradas masivamente; las de Israel, también. Para 2026 FIFA no ha emitido directriz específica.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--color-sun)] mt-1">·</span>
              <span><strong className="text-[var(--color-fg)]">Bandera del arcoíris LGBT</strong>. En USA y Canadá las federaciones locales han confirmado que se permitirá. En México la postura federal es ambigua, aunque tampoco hay prohibición legal.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--color-sun)] mt-1">·</span>
              <span><strong className="text-[var(--color-fg)]">Banderas de territorios disputados</strong> (Kurdistán, Tíbet, Cataluña dentro de partidos de España, etc.). Históricamente FIFA ha tolerado banderas regionales no oficiales pero ha retirado las que violan códigos de paz política internacional.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--color-sun)] mt-1">·</span>
              <span><strong className="text-[var(--color-fg)]">Mensaje político escrito en pancartas</strong> (anti-guerra, anti-corrupción, pro-derechos humanos). El operativo puede retirar la pancarta sin expulsar al aficionado.</span>
            </li>
          </ul>
          <p className="mt-5 text-sm leading-relaxed text-[var(--color-fg-muted)]">
            <strong className="text-[var(--color-fg)]">Recomendación práctica:</strong> si
            la bandera o pancarta es claramente deportiva (selección, club, jugador), no
            tendrás problema. Si tiene mensaje político, social o religioso, asume riesgo
            de que te la retiren en la entrada o durante el partido. No es una
            prohibición automática, pero tampoco una garantía.
          </p>
        </div>
      </section>

      {/* Precedente Qatar */}
      <section className="mx-auto mt-16 w-full max-w-[900px] px-6 md:px-10">
        <h2 className="font-display text-2xl uppercase">El precedente Qatar 2022</h2>
        <p className="mt-4 text-base leading-relaxed text-[var(--color-fg-muted)]">
          En el Mundial anterior, FIFA enfrentó decisiones similares con el conflicto entre
          el reglamento qatarí (homosexualidad ilegal en Qatar) y las posiciones de las
          federaciones europeas (capitanes con el brazalete «OneLove»). FIFA prohibió el
          brazalete bajo amenaza de tarjeta amarilla, lo que generó protesta inédita
          (jugadores alemanes taparon su boca en la foto previa al partido vs Japón).
        </p>
        <p className="mt-4 text-base leading-relaxed text-[var(--color-fg-muted)]">
          Para 2026, en territorios donde el matrimonio igualitario es legal (USA federal
          desde 2015, Canadá desde 2005, México desde 2022), no se espera ningún veto a
          banderas LGBT. La política FIFA sigue siendo la misma —discrecionalidad del
          operativo local—, pero el contexto jurídico es radicalmente distinto.
        </p>
      </section>

      <section className="mx-auto mt-20 w-full max-w-[900px] px-6 md:px-10">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
          <h2 className="font-display text-lg uppercase">Sigue con las normas</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={withLocale(locale as Locale, '/2026/normas-estadios/items-prohibidos')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              22 items prohibidos
            </Link>
            <Link href={withLocale(locale as Locale, '/2026/normas-estadios/sanciones')} className="rounded-full bg-[var(--color-pitch)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] font-semibold text-black">
              Qué pasa si te lo retiran
            </Link>
            <Link href={withLocale(locale as Locale, '/2026/normas-estadios/alcohol-por-pais')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Alcohol por país
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

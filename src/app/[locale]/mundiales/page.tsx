import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { MundialesHero } from '@/components/portal/mundiales-hero';
import { StatsBand } from '@/components/home/stats-band';
import { EditionsGrid } from '@/components/home/editions-grid';
import { Pillars } from '@/components/home/pillars';
import { Icon, type IconName } from '@/components/ui/icon';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';

export const dynamic = 'force-dynamic';
const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);

const SECTIONS: { href: string; label: string; desc: string; icon: IconName }[] = [
  { href: '/2026', label: 'Mundial 2026', desc: 'Campeón, cuadro, goleadores y las 104 fichas de partido.', icon: 'trofeo' },
  { href: '/2030', label: 'Mundial 2030', desc: 'España, Portugal y Marruecos: sedes, fechas y cómo llega cada selección.', icon: 'cal' },
  { href: '/ediciones', label: 'Ediciones 1930–2026', desc: 'Todas las Copas del Mundo, una a una: campeón, final, goleador y sedes.', icon: 'estadio' },
  { href: '/selecciones', label: 'Selecciones', desc: 'Historial, camisetas y participaciones de cada país.', icon: 'futbol' },
  { href: '/palmares', label: 'Palmarés', desc: 'Quién ha ganado cada Mundial y cuántas veces.', icon: 'trofeo' },
  { href: '/historial', label: 'Historial y cara a cara', desc: 'Todos los cruces entre selecciones en Mundiales.', icon: 'alineaciones' },
  { href: '/jugadores', label: 'Jugadores', desc: 'Leyendas, goleadores históricos y récords individuales.', icon: 'gol' },
  { href: '/goles-famosos', label: 'Goles famosos', desc: 'Los goles que cambiaron un Mundial.', icon: 'gol' },
  { href: '/historias', label: 'Historias', desc: 'Reportajes largos sobre partidos, polémicas y protagonistas.', icon: 'noticias' },
  { href: '/estadios', label: 'Estadios', desc: 'Las sedes de todas las ediciones.', icon: 'estadio' },
  { href: '/galeria', label: 'Galería', desc: 'Fotos por edición y por tema.', icon: 'mas' },
  { href: '/records', label: 'Récords', desc: 'Cifras y marcas de la historia del torneo.', icon: 'triple' },
  { href: '/coleccionismo', label: 'Coleccionismo', desc: 'Cromos, balones, entradas y camisetas históricas.', icon: 'penalti' },
];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale, path: '/mundiales',
    title: 'Historia de los Mundiales de fútbol: ediciones, campeones, selecciones y récords',
    description: 'Todas las Copas del Mundo desde 1930 hasta 2026: campeones y finales, selecciones y camisetas, goleadores, estadios, historias, galería, récords y coleccionismo. Y el camino al Mundial 2030.',
    keywords: ['mundiales de fútbol', 'historia de los mundiales', 'campeones del mundo', 'ediciones mundial', 'mundial 2030', 'palmarés mundial'],
  });
}

export default async function MundialesHub({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const L = locale as Locale;
  return (
    <main className="pt-28">
      <JsonLd data={[
        breadcrumbLd(locale, [{ name: 'Inicio', path: '/' }, { name: 'Mundiales', path: '/mundiales' }]),
        { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Historia de los Mundiales', url: localeUrl(locale, '/mundiales'), hasPart: SECTIONS.map((s) => ({ '@type': 'WebPage', name: s.label, url: localeUrl(locale, s.href) })) },
      ]} />
      <MundialesHero locale={L} />

      <section className="mx-auto w-full max-w-[1400px] px-6 py-6 md:px-10">
        <div className="kicker" style={{ color: 'var(--color-gold)' }}>Secciones</div>
        <h2 className="t-h2 mt-3 text-[var(--color-fg)]">Todo el archivo</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {SECTIONS.map((s) => (
            <Link key={s.href} href={withLocale(L, s.href)} className="group grid gap-3 rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5 transition-colors hover:border-[var(--color-gold)]">
              <span className="grid h-10 w-10 place-items-center rounded-[11px] bg-[color-mix(in_oklab,var(--color-gold)_16%,transparent)] text-[var(--color-gold)]"><Icon name={s.icon} size={22} /></span>
              <span className="text-[17px] font-semibold text-[var(--color-fg)] group-hover:text-[var(--color-gold)]">{s.label}</span>
              <span className="text-sm leading-[1.5] text-[var(--color-fg-muted)]">{s.desc}</span>
            </Link>
          ))}
        </div>
      </section>

      <StatsBand />
      <EditionsGrid locale={L} />
      <Pillars />
    </main>
  );
}

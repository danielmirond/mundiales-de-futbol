import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { getCompetition, type Competition } from '@/lib/competitions';
import { fetchTeams } from '@/lib/espn-team';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd } from '@/lib/seo';

export const revalidate = 86400;
const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/cuanto-cuesta-ver',
    title: '¿Cuánto cuesta ver a tu equipo? Calculadora de DAZN y Movistar para LaLiga y Champions',
    description: 'Elige tu equipo de LaLiga y te decimos qué plataformas necesitas para ver todos sus partidos, cuánto cuestan y qué te pierdes con cada opción más barata, partido a partido.',
    keywords: ['cuánto cuesta ver el fútbol', 'dazn o movistar', 'dónde ver a mi equipo', 'calculadora fútbol televisión'],
    availableLocales: ['es'],
  });
}

export default async function TvCostIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const L = locale as Locale;
  const teams = (await fetchTeams(getCompetition('futbol', 'laliga') as Competition)).sort((a, b) => a.name.localeCompare(b.name, 'es'));
  return (
    <main className="pt-28" data-sport="futbol">
      <JsonLd data={breadcrumbLd(locale, [{ name: 'Inicio', path: '/' }, { name: '¿Cuánto cuesta ver a tu equipo?', path: '/cuanto-cuesta-ver' }])} />
      <header className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <div className="kicker">Calculadora · temporada 2026-27</div>
        <h1 className="t-h1 mt-4 text-[var(--color-fg)]">¿Cuánto cuesta ver a tu equipo?</h1>
        <p className="mt-4 max-w-2xl text-lg text-[var(--color-fg-muted)]">LaLiga se reparte entre DAZN y Movistar Plus+, y la Champions es solo de Movistar. Elige tu equipo y te decimos qué necesitas para verlo todo, cuánto cuesta y qué te pierdes con cada opción más barata.</p>
      </header>
      <section className="mx-auto w-full max-w-[1100px] px-6 py-10 md:px-10">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {teams.map((t) => (
            <li key={t.id}>
              <Link href={withLocale(L, `/cuanto-cuesta-ver/${t.slug}`)} className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] p-3 font-semibold text-[var(--color-fg)] hover:border-[var(--accent)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {t.logo && <img src={t.logo} alt="" width={28} height={28} loading="lazy" />}
                <span className="truncate">{t.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

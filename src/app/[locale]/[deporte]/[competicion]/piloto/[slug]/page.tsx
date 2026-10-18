import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';
import { f1Driver, nationalityEs } from '@/lib/f1-history';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';

export const revalidate = 86400;
export const dynamicParams = true;
export async function generateStaticParams() { return []; }
type Params = Promise<{ locale: string; deporte: string; competicion: string; slug: string }>;
const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);
const load = (deporte: string, competicion: string, slug: string) => (deporte === 'motor' && competicion === 'formula-1' ? f1Driver(slug) : undefined);

export async function generateMetadata({ params }: { params: Params }) {
  const { locale, deporte, competicion, slug } = await params;
  const d = load(deporte, competicion, slug);
  if (!d) return {};
  return pageMetadata({
    locale, path: `/motor/formula-1/piloto/${d.slug}`,
    title: `${d.name} en la Fórmula 1: victorias, títulos y todas sus temporadas`,
    description: `Trayectoria de ${d.name} en la Fórmula 1: grandes premios disputados, victorias, podios, poles y títulos, y su clasificación y equipo temporada a temporada.`,
    keywords: [d.name, `${d.name} victorias`, `${d.name} títulos`, `${d.name} fórmula 1`, `${d.name} palmarés`],
  });
}

export default async function F1DriverPage({ params }: { params: Params }) {
  const { locale, deporte, competicion, slug } = await params;
  const d = load(deporte, competicion, slug);
  if (!d) notFound();
  setRequestLocale(locale);
  const L = locale as Locale;
  const cards = [
    ['Grandes premios', d.starts], ['Victorias', d.wins], ['Podios', d.podiums], ['Salidas desde la pole', d.poles], ['Títulos', d.titles.length],
  ] as [string, number][];
  const milestones = [
    d.firstRace && ['Debut', `${d.firstRace.race} ${d.firstRace.season}`],
    d.firstWin && ['Primera victoria', `${d.firstWin.race} ${d.firstWin.season}`],
    d.lastWin && d.wins > 1 && ['Última victoria', `${d.lastWin.race} ${d.lastWin.season}`],
    d.titles.length > 0 && ['Campeón del mundo', d.titles.join(', ')],
    nationalityEs(d.nationality) && ['Nacionalidad', nationalityEs(d.nationality)!],
  ].filter(Boolean) as [string, string][];
  const seasons = [...d.seasons].reverse();
  return (
    <main className="pt-28" data-sport="motor">
      <JsonLd data={[
        breadcrumbLd(locale, [{ name: 'Inicio', path: '/' }, { name: 'Motor', path: '/motor' }, { name: 'Fórmula 1', path: '/motor/formula-1' }, { name: d.name, path: `/motor/formula-1/piloto/${d.slug}` }]),
        { '@context': 'https://schema.org', '@type': 'Person', name: d.name, ...(d.birth ? { birthDate: d.birth } : {}), ...(nationalityEs(d.nationality) ? { nationality: nationalityEs(d.nationality) } : {}), url: localeUrl(locale, `/motor/formula-1/piloto/${d.slug}`) },
      ]} />
      <header className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <Link href={withLocale(L, '/motor/formula-1')} className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"><ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Fórmula 1</Link>
        <div className="kicker mt-6">Fórmula 1{d.number ? ` · #${d.number}` : ''}</div>
        <h1 className="t-h1 mt-1 text-[var(--color-fg)]">{d.name}</h1>
      </header>

      <section className="mx-auto w-full max-w-[1400px] px-6 py-8 md:px-10">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {cards.map(([k, v]) => (
            <div key={k} className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5"><div className="n-xl leading-none text-[var(--color-fg)]">{v}</div><div className="mt-2 text-sm text-[var(--color-fg-muted)]">{k}</div></div>
          ))}
        </div>
        {milestones.length > 0 && (
          <dl className="mt-6 grid gap-px overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3">
            {milestones.map(([k, v]) => (<div key={k} className="bg-[var(--color-bg-2)] px-5 py-4"><dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">{k}</dt><dd className="mt-1 text-sm font-medium text-[var(--color-fg)]">{v}</dd></div>))}
          </dl>
        )}
      </section>

      {seasons.length > 0 && (
        <section className="mx-auto w-full max-w-[1400px] px-6 pb-16 md:px-10">
          <div className="kicker">Trayectoria</div>
          <h2 className="t-h2 mt-3 text-[var(--color-fg)]">Temporada a temporada</h2>
          <div className="mt-5 overflow-x-auto rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)] px-3 md:px-5">
            <table className="w-full border-collapse text-sm">
              <thead><tr className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]"><th className="px-2 py-3 text-left font-medium">Temporada</th><th className="px-2 py-3 text-left font-medium">Equipo</th><th className="px-2 py-3 text-center font-medium">Posición</th><th className="px-2 py-3 text-center font-medium">Puntos</th><th className="px-2 py-3 text-center font-medium">Victorias</th></tr></thead>
              <tbody>
                {seasons.map((s) => (
                  <tr key={s.season} className={`border-t border-[var(--color-border)] ${s.position === 1 ? 'bg-[color-mix(in_oklab,var(--color-gold)_12%,transparent)]' : ''}`}>
                    <td className="h-11 px-2 font-mono text-xs text-[var(--color-fg-muted)]">{s.season}</td>
                    <td className="h-11 px-2 text-[var(--color-fg)]">{s.teams.join(' / ')}</td>
                    <td className="h-11 px-2 text-center tab-num text-[var(--color-fg)]">{s.position ? `${s.position}.º` : '–'}</td>
                    <td className="h-11 px-2 text-center tab-num text-[var(--color-fg-muted)]">{s.points.toLocaleString('es-ES')}</td>
                    <td className="h-11 px-2 text-center tab-num text-[var(--color-fg-muted)]">{s.wins}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">Fuente: Jolpica (Ergast) · «salidas desde la pole» cuenta la posición de salida, no la clasificación</p>
        </section>
      )}
    </main>
  );
}

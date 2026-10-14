import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';
import { getSport, getCompetition } from '@/lib/competitions';
import { fetchAthlete } from '@/lib/espn-athlete';
import { Crest } from '@/components/portal/crest';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';

export const revalidate = 3600;
export const dynamicParams = true;
export async function generateStaticParams() { return []; }

type Params = Promise<{ locale: string; deporte: string; competicion: string; id: string }>;
const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);

async function load(deporte: string, competicion: string, id: string) {
  const s = getSport(deporte), c = getCompetition(deporte, competicion);
  if (!s || !c || !c.espn) return null;
  const p = await fetchAthlete(c, id);
  return p ? { s, c, p } : null;
}

export async function generateMetadata({ params }: { params: Params }) {
  const { locale, deporte, competicion, id } = await params;
  const d = await load(deporte, competicion, id);
  if (!d) return {};
  const { c, p } = d;
  return pageMetadata({
    locale, path: `/${c.sport}/${c.slug}/jugador/${id}`,
    title: `${p.bio.name}: estadísticas${c.sport === 'futbol' ? ', goles' : ', puntos'} y temporada${p.bio.team ? ` · ${p.bio.team}` : ''}`,
    description: `${p.bio.name}${p.bio.position ? `, ${p.bio.position.toLowerCase()}` : ''}${p.bio.team ? ` del ${p.bio.team}` : ''}: estadísticas de la temporada en ${c.name} y de las anteriores, edad, nacionalidad y dorsal.`,
    keywords: [p.bio.name, `${p.bio.name} estadísticas`, `${p.bio.name} goles`, `${p.bio.name} temporada`],
  });
}

export default async function PlayerPage({ params }: { params: Params }) {
  const { locale, deporte, competicion, id } = await params;
  const d = await load(deporte, competicion, id);
  if (!d) notFound();
  setRequestLocale(locale);
  const L = locale as Locale;
  const { s, c, p } = d;
  const facts = [['Posición', p.bio.position], ['Equipo', p.bio.team], ['Dorsal', p.bio.jersey], ['Edad', p.bio.age ? `${p.bio.age} años` : undefined], ['Nacimiento', p.bio.dob], ['Nacionalidad', p.bio.country], ['Altura', p.bio.height]].filter(([, v]) => v) as [string, string][];
  return (
    <main className="pt-28" data-sport={s.slug}>
      <JsonLd data={[
        breadcrumbLd(locale, [{ name: 'Inicio', path: '/' }, { name: s.name, path: `/${s.slug}` }, { name: c.name, path: `/${c.sport}/${c.slug}` }, { name: p.bio.name, path: `/${c.sport}/${c.slug}/jugador/${id}` }]),
        { '@context': 'https://schema.org', '@type': 'Person', name: p.bio.name, ...(p.bio.headshot ? { image: p.bio.headshot } : {}), ...(p.bio.country ? { nationality: p.bio.country } : {}), ...(p.bio.team ? { memberOf: { '@type': 'SportsTeam', name: p.bio.team } } : {}), url: localeUrl(locale, `/${c.sport}/${c.slug}/jugador/${id}`) },
      ]} />
      <header className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <Link href={withLocale(L, p.bio.teamId ? `/${c.sport}/${c.slug}/equipo/${p.bio.teamId}` : `/${c.sport}/${c.slug}`)} className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> {p.bio.team ?? c.name}
        </Link>
        <div className="mt-6 flex items-center gap-5">
          {p.bio.headshot ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.bio.headshot} alt={p.bio.name} width={96} height={96} className="h-20 w-20 rounded-full bg-[var(--color-surface)] object-cover md:h-24 md:w-24" />
          ) : <Crest abbr={p.bio.name.split(' ').map((w) => w[0]).join('').slice(0, 3)} size="xl" />}
          <div>
            <div className="kicker">{c.name}{p.bio.jersey ? ` · #${p.bio.jersey}` : ''}</div>
            <h1 className="t-h1 mt-1 text-[var(--color-fg)]">{p.bio.name}</h1>
          </div>
        </div>
      </header>

      <section className="mx-auto w-full max-w-[1400px] px-6 py-8 md:px-10">
        <dl className="grid gap-px overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-4">
          {facts.map(([k, v]) => (
            <div key={k} className="bg-[var(--color-bg-2)] px-5 py-4"><dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">{k}</dt><dd className="mt-1 text-sm font-medium text-[var(--color-fg)]">{v}</dd></div>
          ))}
        </dl>
      </section>

      {p.summary.length > 0 && (
        <section className="mx-auto w-full max-w-[1400px] px-6 pb-8 md:px-10">
          <div className="kicker">Temporada</div>
          <h2 className="t-h2 mt-3 text-[var(--color-fg)]">{p.summaryTitle?.replace(/ Stats$/i, '').replace(/regular season stats/i, 'temporada regular') ?? 'Esta temporada'}</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {p.summary.slice(0, 4).map((x) => (
              <div key={x.label} className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5">
                <div className="n-xl leading-none text-[var(--color-fg)]">{x.value}</div>
                <div className="mt-2 text-sm text-[var(--color-fg-muted)]">{x.label}{x.rank ? <span className="ml-2 font-mono text-[10px] text-[var(--color-fg-subtle)]">{x.rank.replace(/(\d+)(st|nd|rd|th)/, '$1.º')}</span> : null}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {p.rows.length > 0 && (
        <section className="mx-auto w-full max-w-[1400px] px-6 pb-16 md:px-10">
          <div className="kicker">Trayectoria</div>
          <h2 className="t-h2 mt-3 text-[var(--color-fg)]">Estadísticas por temporada</h2>
          <div className="mt-5 overflow-x-auto rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)] px-3 md:px-5">
            <table className="w-full border-collapse text-sm">
              <thead><tr className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]"><th className="px-2 py-3 text-left font-medium">Temporada</th><th className="px-2 py-3 text-left font-medium">Equipo</th>{p.labels.map((l, i) => <th key={l + i} className="px-2 py-3 text-center font-medium" title={p.titles[i]}>{l}</th>)}</tr></thead>
              <tbody>
                {p.rows.map((r) => (
                  <tr key={r.season + r.team} className="border-t border-[var(--color-border)]">
                    <td className="h-11 whitespace-nowrap px-2 font-mono text-xs text-[var(--color-fg-muted)]">{r.season}</td>
                    <td className="h-11 whitespace-nowrap px-2 text-[var(--color-fg)]">{r.team}</td>
                    {r.stats.map((v, i) => <td key={i} className="h-11 px-2 text-center tab-num text-[var(--color-fg-muted)]">{v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">Fuente: ESPN</p>
        </section>
      )}
    </main>
  );
}

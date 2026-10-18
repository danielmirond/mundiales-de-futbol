import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';
import { fetchUfcFighter } from '@/lib/cito-ufc';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';

export const revalidate = 86400;
export const dynamicParams = true;
export async function generateStaticParams() { return []; }
type Params = Promise<{ locale: string; deporte: string; competicion: string; slug: string }>;
const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);
const pct = (n?: number) => (typeof n === 'number' ? `${Math.round(n * 100)} %` : '–');
const num = (n?: number) => (typeof n === 'number' ? n.toLocaleString('es-ES', { maximumFractionDigits: 2 }) : '–');
const dateEs = new Intl.DateTimeFormat('es-ES', { timeZone: 'UTC', day: 'numeric', month: 'short', year: 'numeric' });
const load = async (deporte: string, competicion: string, slug: string) => (deporte === 'combate' && competicion === 'ufc' ? fetchUfcFighter(slug) : null);

export async function generateMetadata({ params }: { params: Params }) {
  const { locale, deporte, competicion, slug } = await params;
  const f = await load(deporte, competicion, slug);
  if (!f) return {};
  return pageMetadata({
    locale, path: `/combate/ufc/luchador/${f.slug}`,
    title: `${f.name}: récord, estadísticas y combates en la UFC`,
    description: `${f.name}${f.nickname ? ` «${f.nickname}»` : ''}, ${f.division.toLowerCase()} de la UFC: récord, precisión de golpeo y derribos, cómo gana sus combates, su puesto en el ranking y todos sus combates.`,
    keywords: [f.name, `${f.name} récord`, `${f.name} ufc`, `${f.name} estadísticas`, `${f.name} próximo combate`],
  });
}

export default async function UfcFighterPage({ params }: { params: Params }) {
  const { locale, deporte, competicion, slug } = await params;
  const f = await load(deporte, competicion, slug);
  if (!f) notFound();
  setRequestLocale(locale);
  const L = locale as Locale;
  const facts = [['División', f.division], ['Edad', f.age ? `${f.age} años` : undefined], ['Altura', f.heightCm ? `${f.heightCm} cm` : undefined], ['Alcance', f.reachCm ? `${f.reachCm} cm` : undefined], ['Guardia', f.stance], ['Nacido en', f.born], ['Entrena en', f.trainsAt]].filter(([, v]) => v) as [string, string][];
  const s = f.stats;
  const next = f.fights.find((x) => x.upcoming);
  const past = f.fights.filter((x) => !x.upcoming);
  const rank = f.ranks.find((r) => r.system === 'media') ?? f.ranks[0];
  return (
    <main className="pt-28" data-sport="combate">
      <JsonLd data={[
        breadcrumbLd(locale, [{ name: 'Inicio', path: '/' }, { name: 'Combate', path: '/combate' }, { name: 'UFC', path: '/combate/ufc' }, { name: f.name, path: `/combate/ufc/luchador/${f.slug}` }]),
        { '@context': 'https://schema.org', '@type': 'Person', name: f.name, ...(f.nickname ? { alternateName: f.nickname } : {}), url: localeUrl(locale, `/combate/ufc/luchador/${f.slug}`) },
      ]} />
      <header className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <Link href={withLocale(L, '/combate/ufc')} className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"><ArrowLeft className="h-3 w-3 rtl:rotate-180" /> UFC</Link>
        <div className="kicker mt-6">{f.division}{f.champion ? ' · Campeón' : rank ? ` · ${rank.rankText === 'C' ? 'Campeón' : `n.º ${rank.rankText} del ranking`}` : ''}</div>
        <h1 className="t-h1 mt-1 text-[var(--color-fg)]">{f.name}{f.nickname ? <span className="text-[var(--color-fg-subtle)]"> «{f.nickname}»</span> : null}</h1>
        <p className="mt-3 font-display text-[44px] leading-none tab-num text-[var(--color-fg)]">{f.record}<span className="ml-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">victorias · derrotas · empates</span></p>
      </header>

      {next && (
        <section className="mx-auto w-full max-w-[1400px] px-6 pt-8 md:px-10">
          <Link href={withLocale(L, `/combate/ufc/evento/${next.eventSlug}`)} className="block rounded-[18px] border border-[var(--accent)] bg-[var(--color-bg-2)] p-5 hover:bg-[color-mix(in_oklab,var(--accent)_8%,transparent)]">
            <div className="kicker">Próximo combate</div>
            <div className="mt-1 text-lg font-semibold text-[var(--color-fg)]">Contra {next.opponent}</div>
            <div className="text-sm text-[var(--color-fg-muted)]">{next.event} · {next.date ? dateEs.format(new Date(next.date)) : ''}</div>
          </Link>
        </section>
      )}

      <section className="mx-auto w-full max-w-[1400px] px-6 py-8 md:px-10">
        <dl className="grid gap-px overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-4">
          {facts.map(([k, v]) => (<div key={k} className="bg-[var(--color-bg-2)] px-5 py-4"><dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">{k}</dt><dd className="mt-1 text-sm font-medium text-[var(--color-fg)]">{v}</dd></div>))}
        </dl>
      </section>

      {s && (
        <section className="mx-auto w-full max-w-[1400px] px-6 pb-8 md:px-10">
          <div className="kicker">Estadísticas en la UFC</div>
          <h2 className="t-h2 mt-3 text-[var(--color-fg)]">Cómo pelea {f.name.split(' ').slice(-1)[0]}</h2>
          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[['Precisión de golpeo', pct(s.strikingAccuracy)], ['Golpes significativos por minuto', num(s.strikesLandedPerMin)], ['Golpes recibidos por minuto', num(s.strikesAbsorbedPerMin)], ['Defensa de golpeo', pct(s.strikeDefense)],
              ['Precisión en derribos', pct(s.takedownAccuracy)], ['Derribos cada 15 min', num(s.takedownsPer15)], ['Defensa de derribos', pct(s.takedownDefense)], ['Sumisiones intentadas cada 15 min', num(s.submissionsPer15)]].map(([k, v]) => (
              <div key={k} className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5"><div className="n-xl leading-none text-[var(--color-fg)]">{v}</div><div className="mt-2 text-sm text-[var(--color-fg-muted)]">{k}</div></div>
            ))}
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {[['Dónde golpea', s.byTarget], ['Desde qué posición', s.byPosition]].map(([title, list]) => (
              <div key={title as string}>
                <h3 className="sub-label mb-3">{title as string}</h3>
                {((list as { label: string; percent: number }[] | undefined) ?? []).map((x) => (
                  <div key={x.label} className="mb-2">
                    <div className="flex justify-between text-[13px] text-[var(--color-fg)]"><span>{x.label}</span><span className="tab-num">{Math.round(x.percent * 100)} %</span></div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-[var(--color-border)]"><span className="block h-full bg-[var(--accent)]" style={{ width: `${Math.round(x.percent * 100)}%` }} /></div>
                  </div>
                ))}
              </div>
            ))}
            <div>
              <h3 className="sub-label mb-3">Cómo gana</h3>
              <ul className="space-y-1.5 text-[14px] text-[var(--color-fg)]">{(s.winsByMethod ?? []).map((x) => <li key={x.label} className="flex justify-between"><span>{x.label}</span><span className="font-semibold tab-num">{x.count}</span></li>)}</ul>
            </div>
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section className="mx-auto w-full max-w-[1400px] px-6 pb-16 md:px-10">
          <div className="kicker">Historial</div>
          <h2 className="t-h2 mt-3 text-[var(--color-fg)]">Sus combates en la UFC</h2>
          <div className="mt-5 overflow-x-auto rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)] px-3 md:px-5">
            <table className="w-full border-collapse text-sm">
              <thead><tr className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-fg-subtle)]"><th className="px-2 py-3 text-left font-medium">Resultado</th><th className="px-2 py-3 text-left font-medium">Rival</th><th className="px-2 py-3 text-left font-medium">Método</th><th className="px-2 py-3 text-left font-medium">Velada</th></tr></thead>
              <tbody>
                {past.map((x) => (
                  <tr key={x.eventSlug + x.opponent} className="border-t border-[var(--color-border)]">
                    <td className={`h-11 px-2 font-semibold ${x.outcome === 'win' ? 'text-[var(--color-win,#2e7d4f)]' : x.outcome === 'loss' ? 'text-[var(--color-live-ink)]' : 'text-[var(--color-fg-muted)]'}`}>{x.outcome === 'win' ? 'Victoria' : x.outcome === 'loss' ? 'Derrota' : x.outcome === 'draw' ? 'Empate' : '–'}{x.title ? <span className="ml-1.5 font-mono text-[9px] uppercase text-[var(--color-gold)]">título</span> : null}</td>
                    <td className="h-11 px-2 text-[var(--color-fg)]">{x.opponentSlug ? <Link href={withLocale(L, `/combate/ufc/luchador/${x.opponentSlug}`)} className="hover:text-[var(--accent-ink)]">{x.opponent}</Link> : x.opponent}</td>
                    <td className="h-11 px-2 text-[var(--color-fg-muted)]">{x.method}{x.round ? ` · asalto ${x.round}${x.time ? ` (${x.time})` : ''}` : ''}</td>
                    <td className="h-11 px-2 text-[var(--color-fg-muted)]"><Link href={withLocale(L, `/combate/ufc/evento/${x.eventSlug}`)} className="hover:text-[var(--accent-ink)]">{x.event}</Link>{x.date ? <span className="ml-1.5 font-mono text-[11px] text-[var(--color-fg-subtle)]">{dateEs.format(new Date(x.date))}</span> : null}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">Datos: Cito API</p>
        </section>
      )}
    </main>
  );
}

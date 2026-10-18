import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';
import { fetchUfcRankings } from '@/lib/cito-ufc';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd } from '@/lib/seo';

export const revalidate = 21600;
export const dynamicParams = true;
export async function generateStaticParams() { return []; }
type Params = Promise<{ locale: string; deporte: string; competicion: string }>;
const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);
const isUfc = (d: string, c: string) => d === 'combate' && c === 'ufc';

export async function generateMetadata({ params }: { params: Params }) {
  const { locale, deporte, competicion } = await params;
  if (!isUfc(deporte, competicion)) return {};
  return pageMetadata({
    locale, path: '/combate/ufc/rankings',
    title: 'Rankings de la UFC por división: campeones y aspirantes',
    description: 'Los rankings oficiales de la UFC en cada división, masculina y femenina: quién tiene el cinturón, los quince aspirantes y quién ha subido o bajado esta semana.',
    keywords: ['rankings ufc', 'ranking ufc peso ligero', 'campeones ufc', 'ranking libra por libra ufc'],
  });
}

function Change({ v }: { v?: string | null }) {
  const n = Number(v);
  if (v === 'NR') return <span className="w-12 shrink-0 text-right font-mono text-[10px] uppercase text-[var(--accent-ink)]">nuevo</span>;
  if (!v || !Number.isFinite(n) || n === 0) return <span className="w-12 shrink-0" />;
  return <span className={`w-12 shrink-0 text-right font-mono text-[11px] ${n < 0 ? 'text-[var(--color-live-ink)]' : 'text-[var(--color-win,#2e7d4f)]'}`}>{n < 0 ? `▼${-n}` : `▲${n}`}</span>;
}

export default async function UfcRankingsPage({ params }: { params: Params }) {
  const { locale, deporte, competicion } = await params;
  if (!isUfc(deporte, competicion)) notFound();
  const divisions = (await fetchUfcRankings('media')) ?? (await fetchUfcRankings('meta'));
  if (!divisions?.length) notFound();
  setRequestLocale(locale);
  const L = locale as Locale;
  return (
    <main className="pt-28" data-sport="combate">
      <JsonLd data={breadcrumbLd(locale, [{ name: 'Inicio', path: '/' }, { name: 'Combate', path: '/combate' }, { name: 'UFC', path: '/combate/ufc' }, { name: 'Rankings', path: '/combate/ufc/rankings' }])} />
      <header className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <Link href={withLocale(L, '/combate/ufc')} className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"><ArrowLeft className="h-3 w-3 rtl:rotate-180" /> UFC</Link>
        <div className="kicker mt-6">UFC · Rankings</div>
        <h1 className="t-h1 mt-1 text-[var(--color-fg)]">Rankings de la UFC por división</h1>
        <p className="mt-3 max-w-2xl text-[var(--color-fg-muted)]">El campeón arriba y los aspirantes debajo, división a división. La flecha indica si el luchador ha subido o bajado desde la última actualización; «nuevo», que acaba de entrar en el ranking.</p>
        <nav className="mt-5 flex flex-wrap gap-2">
          {divisions.map((d) => <a key={d.division} href={`#${d.division}`} className="rounded-full border border-[var(--color-border)] px-3 py-1 text-[12px] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">{d.name}</a>)}
        </nav>
      </header>
      <section className="mx-auto grid w-full max-w-[1400px] gap-6 px-6 py-10 md:grid-cols-2 md:px-10 xl:grid-cols-3">
        {divisions.map((d) => (
          <div key={d.division} id={d.division} className="scroll-mt-28 rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5">
            <h2 className="t-h3 text-[var(--color-fg)]">{d.name}</h2>
            <ol className="mt-3">
              {d.rows.map((r) => (
                <li key={r.slug} className={`flex items-center gap-3 border-t border-[var(--color-border)] py-2 text-[14px] ${r.champion ? 'font-semibold' : ''}`}>
                  <span className={`w-7 shrink-0 font-mono text-[12px] tab-num ${r.champion ? 'text-[var(--color-gold)]' : 'text-[var(--color-fg-subtle)]'}`}>{r.champion ? 'C' : r.rankText}</span>
                  <Link href={withLocale(L, `/combate/ufc/luchador/${r.slug}`)} className="min-w-0 flex-1 truncate text-[var(--color-fg)] hover:text-[var(--accent-ink)]">{r.name}</Link>
                  <Change v={r.change} />
                </li>
              ))}
            </ol>
          </div>
        ))}
      </section>
      <p className="mx-auto w-full max-w-[1400px] px-6 pb-16 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)] md:px-10">Datos: Cito API</p>
    </main>
  );
}

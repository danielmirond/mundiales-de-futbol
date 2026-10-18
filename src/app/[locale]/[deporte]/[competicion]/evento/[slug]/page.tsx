import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';
import type { UfcBout, UfcCorner, UfcRoundRow } from '@/lib/cito-ufc';
import { ufcEvent, hasUfcFighter } from '@/lib/ufc-data';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';

export const revalidate = 3600;
export const dynamicParams = true;
export async function generateStaticParams() { return []; }
type Params = Promise<{ locale: string; deporte: string; competicion: string; slug: string }>;
const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);
const load = async (deporte: string, competicion: string, slug: string) => (deporte === 'combate' && competicion === 'ufc' ? ufcEvent(slug) ?? null : null);
const dayEs = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const hourEs = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit' });
/** «9 of 37» → «9/37». */
const of = (s: string) => s.replace(' of ', '/');
const titleEs = (t: string) => t.replace(/^UFC Fight Night/, 'UFC Fight Night').replace(/ vs\.? /g, ' contra ');

export async function generateMetadata({ params }: { params: Params }) {
  const { locale, deporte, competicion, slug } = await params;
  const ev = await load(deporte, competicion, slug);
  if (!ev) return {};
  const main = ev.bouts[0];
  const done = ev.status === 'completed';
  const vs = main ? `${main.a.name} contra ${main.b.name}` : titleEs(ev.title);
  return pageMetadata({
    locale, path: `/combate/ufc/evento/${ev.slug}`,
    title: done ? `${vs}: resultados y estadísticas de la velada` : `${vs}: cartelera, horario y dónde ver la velada`,
    description: done
      ? `Resultados de ${titleEs(ev.title)}: quién ganó cada combate, cómo y en qué asalto, con los golpes, derribos y tiempo de control asalto por asalto.`
      : `Cartelera completa de ${titleEs(ev.title)}${ev.place ? ` en ${ev.place}` : ''}: combates, divisiones y hora en España.`,
    keywords: [ev.title, `${ev.title} resultados`, ...(main ? [`${main.a.name} ${main.b.name}`] : [])],
  });
}

function Corner({ c, L, right }: { c: UfcCorner; L: Locale; right?: boolean }) {
  const won = c.outcome === 'win';
  return (
    <div className={`min-w-0 ${right ? 'text-right' : ''}`}>
      {hasUfcFighter(c.slug) ? <Link href={withLocale(L, `/combate/ufc/luchador/${c.slug}`)} className={`block truncate text-[15px] hover:text-[var(--accent-ink)] ${won ? 'font-semibold text-[var(--color-fg)]' : 'text-[var(--color-fg-muted)]'}`}>{c.name}</Link> : <span className={`block truncate text-[15px] ${won ? 'font-semibold text-[var(--color-fg)]' : 'text-[var(--color-fg-muted)]'}`}>{c.name}</span>}
      <div className="font-mono text-[11px] text-[var(--color-fg-subtle)]">{c.record}{won ? <span className="ml-1.5 uppercase text-[var(--color-win,#2e7d4f)]">gana</span> : null}</div>
    </div>
  );
}

const COLS: [keyof UfcRoundRow, string][] = [['sig', 'Golpes signif.'], ['head', 'Cabeza'], ['body', 'Cuerpo'], ['leg', 'Piernas'], ['td', 'Derribos'], ['ctrl', 'Control'], ['kd', 'KD']];
function RoundTable({ b }: { b: UfcBout }) {
  const rounds = [...new Set([...b.a.rounds, ...b.b.rounds].map((r) => r.round))].sort((x, y) => x - y);
  if (!rounds.length) return null;
  const line = (c: UfcCorner, r?: UfcRoundRow) => (
    <tr key={c.slug} className="border-t border-[var(--color-border)]">
      <td className="h-9 max-w-[140px] truncate px-2 text-[var(--color-fg)]">{c.name.split(' ').slice(-1)[0]}</td>
      {COLS.map(([k]) => <td key={k} className="h-9 px-2 text-right tab-num text-[var(--color-fg-muted)]">{r ? (typeof r[k] === 'string' ? of(r[k] as string) : r[k]) : '–'}</td>)}
    </tr>
  );
  return (
    <details className="mt-3 rounded-[12px] border border-[var(--color-border)]">
      <summary className="cursor-pointer px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">Estadísticas asalto por asalto</summary>
      <div className="overflow-x-auto px-2 pb-3 md:px-4">
        <table className="w-full min-w-[560px] border-collapse text-[13px]">
          <thead><tr className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-fg-subtle)]"><th className="px-2 py-2 text-left font-medium" />{COLS.map(([k, l]) => <th key={k} className="px-2 py-2 text-right font-medium">{l}</th>)}</tr></thead>
          {rounds.map((n) => (
            <tbody key={n}>
              <tr><td colSpan={COLS.length + 1} className="px-2 pt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent-ink)]">Asalto {n}</td></tr>
              {line(b.a, b.a.rounds.find((r) => r.round === n))}
              {line(b.b, b.b.rounds.find((r) => r.round === n))}
            </tbody>
          ))}
          {(b.a.totals || b.b.totals) && (
            <tbody>
              <tr><td colSpan={COLS.length + 1} className="px-2 pt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent-ink)]">Total del combate</td></tr>
              {line(b.a, b.a.totals)}
              {line(b.b, b.b.totals)}
            </tbody>
          )}
        </table>
      </div>
    </details>
  );
}

export default async function UfcEventPage({ params }: { params: Params }) {
  const { locale, deporte, competicion, slug } = await params;
  const ev = await load(deporte, competicion, slug);
  if (!ev) notFound();
  setRequestLocale(locale);
  const L = locale as Locale;
  const start = ev.startsAt ? new Date(ev.startsAt) : null;
  const sections = [...new Set(ev.bouts.map((b) => b.section))];
  return (
    <main className="pt-28" data-sport="combate">
      <JsonLd data={[
        breadcrumbLd(locale, [{ name: 'Inicio', path: '/' }, { name: 'Combate', path: '/combate' }, { name: 'UFC', path: '/combate/ufc' }, { name: ev.title, path: `/combate/ufc/evento/${ev.slug}` }]),
        { '@context': 'https://schema.org', '@type': 'SportsEvent', name: ev.title, url: localeUrl(locale, `/combate/ufc/evento/${ev.slug}`), ...(ev.startsAt ? { startDate: ev.startsAt } : {}), ...(ev.place ? { location: { '@type': 'Place', name: ev.place } } : {}), sport: 'Artes marciales mixtas', organizer: { '@type': 'Organization', name: 'UFC' } },
      ]} />
      <header className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <Link href={withLocale(L, '/combate/ufc')} className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"><ArrowLeft className="h-3 w-3 rtl:rotate-180" /> UFC</Link>
        <div className="kicker mt-6">{ev.status === 'completed' ? 'Resultados' : 'Cartelera'}{ev.place ? ` · ${ev.place}` : ''}</div>
        <h1 className="t-h1 mt-1 text-[var(--color-fg)]">{titleEs(ev.title)}</h1>
        {start && <p className="mt-2 text-[var(--color-fg-muted)]">{dayEs.format(start)} · {hourEs.format(start)} (hora peninsular)</p>}
      </header>
      {sections.map((sec) => (
        <section key={sec} className="mx-auto w-full max-w-[1100px] px-6 pt-10 md:px-10">
          <h2 className="t-h3 text-[var(--color-fg)]">{sec}</h2>
          <ul className="mt-4 space-y-3">
            {ev.bouts.filter((b) => b.section === sec).map((b) => {
              const done = b.status === 'completed';
              return (
                <li key={b.id} className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)] p-4 md:p-5">
                  <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">{b.division}{b.title ? <span className="ml-1.5 text-[var(--color-gold)]">· por el título</span> : null}</div>
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                    <Corner c={b.a} L={L} />
                    <div className="text-center font-mono text-[11px] uppercase text-[var(--color-fg-subtle)]">{done ? (b.method || 'final') : 'contra'}</div>
                    <Corner c={b.b} L={L} right />
                  </div>
                  {done && (b.round || b.methodDetail || b.referee) ? (
                    <p className="mt-2 text-[13px] text-[var(--color-fg-muted)]">{[b.methodDetail, b.round ? `asalto ${b.round}${b.time ? `, ${b.time}` : ''}` : '', b.referee ? `árbitro: ${b.referee}` : ''].filter(Boolean).join(' · ')}</p>
                  ) : null}
                  {done ? <RoundTable b={b} /> : null}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
      <p className="mx-auto w-full max-w-[1100px] px-6 py-12 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)] md:px-10">Datos: Cito API</p>
    </main>
  );
}

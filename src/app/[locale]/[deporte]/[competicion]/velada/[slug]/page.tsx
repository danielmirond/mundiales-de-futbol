import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getCompetition } from '@/lib/competitions';
import { getVelada, veladaNombre, fechaLarga, proximasVeladas } from '@/lib/boxeo';
import { DondeVerVelada } from '@/components/portal/boxing-hub';
import { CompetitionHeader } from '@/components/portal/competition-header';
import { resolveCompetition, withLocale } from '@/lib/competition-page';
import type { Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, localeUrl } from '@/lib/seo';

// Regeneración periódica (ISR); el calendario es un JSON del repo.
export const revalidate = 3600;
export const dynamicParams = true;
export async function generateStaticParams() { return []; }
type Params = Promise<{ locale: string; deporte: string; competicion: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { locale, deporte, competicion, slug } = await params;
  const c = getCompetition(deporte, competicion);
  const v = getVelada(slug);
  if (!c || c.stats !== 'boxing' || !v) return {};
  const n = veladaNombre(v);
  return pageMetadata({
    locale, path: `/combate/boxeo/velada/${v.slug}`,
    title: `${n}: horario en España y dónde ver el combate`,
    description: `${n}${v.titulo ? `, ${v.titulo.toLowerCase()}` : ''}: fecha, hora en España, sede y cómo verlo${v.tv ? ` en ${v.tv.plataforma}` : ''}.`,
    keywords: [n.toLowerCase(), `${v.pelea.a} ${v.pelea.b} horario`, `${v.pelea.a} ${v.pelea.b} dónde ver`, `${v.pelea.a} ${v.pelea.b} hora españa`],
    type: 'article',
  });
}

export default async function VeladaPage({ params }: { params: Params }) {
  const { locale, deporte, competicion, slug } = await params;
  const { s, c } = resolveCompetition(locale, deporte, competicion);
  const v = getVelada(slug);
  if (c.stats !== 'boxing' || !v) notFound();
  setRequestLocale(locale);
  const L = locale as Locale;
  const n = veladaNombre(v);
  const otras = proximasVeladas().filter((x) => x.slug !== v.slug).slice(0, 4);
  const rows: [string, string][] = [
    ['Fecha', fechaLarga(v.fecha)],
    ['Hora en España', v.horaEspana ?? 'Por confirmar'],
    ['Título en juego', v.titulo ?? 'Por confirmar'],
    ['Sede', [v.sede, v.ciudad, v.pais].filter(Boolean).join(', ') || 'Por confirmar'],
    ['Dónde ver', v.tv ? `${v.tv.plataforma}${v.tv.modalidad === 'PPV' ? ' (PPV)' : ''}` : 'Por confirmar'],
  ];
  return (
    <main className="pt-28" data-sport={s.slug}>
      <JsonLd data={{
        '@context': 'https://schema.org', '@type': 'SportsEvent', name: n, sport: 'Boxeo', startDate: v.fecha,
        eventStatus: 'https://schema.org/EventScheduled',
        competitor: [{ '@type': 'Person', name: v.pelea.a }, { '@type': 'Person', name: v.pelea.b }],
        ...(v.sede ? { location: { '@type': 'Place', name: v.sede, address: [v.ciudad, v.pais].filter(Boolean).join(', ') } } : {}),
        url: localeUrl(locale, `/combate/boxeo/velada/${v.slug}`),
      }} />
      <CompetitionHeader s={s} c={c} locale={locale} section="inicio" title={n}
        description={`${v.titulo ? `${v.titulo}. ` : ''}${fechaLarga(v.fecha)}${v.sede ? `, ${v.sede} (${v.ciudad})` : ''}.`}
        extraPath={{ name: n, path: `/combate/boxeo/velada/${v.slug}` }} />
      <section className="mx-auto w-full max-w-[900px] px-6 py-8 md:px-10">
        <dl className="grid gap-px overflow-hidden rounded-[18px] border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2">
          {rows.map(([k, val]) => (
            <div key={k} className="bg-[var(--color-bg-2)] px-5 py-4">
              <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">{k}</dt>
              <dd className="mt-1 text-[15px] font-medium text-[var(--color-fg)]">{val}</dd>
            </div>
          ))}
        </dl>
        <h2 className="t-h2 mt-10 text-[var(--color-fg)]">Dónde ver {n}</h2>
        <div className="mt-4"><DondeVerVelada v={v} /></div>
        {v.contexto && <p className="mt-8 text-[17px] leading-relaxed text-[var(--color-fg-muted)]">{v.contexto}</p>}
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">Fuente: {v.fuente}. La hora se actualiza cuando la organización confirma la salida al ring.</p>
        {otras.length > 0 && (
          <div className="mt-10">
            <div className="kicker">Más boxeo</div>
            <ul className="mt-3 space-y-2">
              {otras.map((x) => <li key={x.slug}><Link href={withLocale(L, `/combate/boxeo/velada/${x.slug}`)} className="text-[var(--color-fg)] hover:text-[var(--accent-ink)]">{veladaNombre(x)} · {fechaLarga(x.fecha)}</Link></li>)}
            </ul>
          </div>
        )}
      </section>
    </main>
  );
}

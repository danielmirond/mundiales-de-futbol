import Link from 'next/link';
import { fetchUfcRankings, fetchUfcEvents } from '@/lib/cito-ufc';
import { routing, type Locale } from '@/i18n/routing';

const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);
const dayEs = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', day: 'numeric', month: 'short' });

/** Bajo el hub de la UFC: campeones por división, veladas con resultados y acceso a rankings y fichas. Sin clave de Cito no pinta nada. */
export async function UfcExtras({ locale }: { locale: Locale }) {
  const [divs, events] = await Promise.all([fetchUfcRankings('media').then((d) => d ?? fetchUfcRankings('meta')), fetchUfcEvents()]);
  if (!divs?.length && !events) return null;
  const champs = (divs ?? []).map((d) => ({ div: d.name, f: d.rows.find((r) => r.champion) })).filter((x) => x.f);
  const evs = [...(events?.upcoming ?? []).slice(0, 2), ...(events?.recent ?? []).slice(0, 4)];
  const link = 'text-[var(--color-fg)] hover:text-[var(--accent-ink)]';
  return (
    <section className="mx-auto grid w-full max-w-[1400px] gap-6 px-6 py-10 md:grid-cols-2 md:px-10">
      {champs.length > 0 && (
        <div className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5">
          <div className="kicker">Campeones</div>
          <h2 className="t-h3 mt-1 text-[var(--color-fg)]">Quién tiene cada cinturón</h2>
          <ul className="mt-3">
            {champs.map(({ div, f }) => (
              <li key={div} className="flex justify-between gap-3 border-t border-[var(--color-border)] py-2 text-[14px]">
                <span className="text-[var(--color-fg-muted)]">{div}</span>
                <Link href={withLocale(locale, `/combate/ufc/luchador/${f!.slug}`)} className={`font-medium ${link}`}>{f!.name}</Link>
              </li>
            ))}
          </ul>
          <Link href={withLocale(locale, '/combate/ufc/rankings')} className="mt-4 inline-block font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent-ink)]">Rankings completos por división →</Link>
        </div>
      )}
      {evs.length > 0 && (
        <div className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5">
          <div className="kicker">Veladas</div>
          <h2 className="t-h3 mt-1 text-[var(--color-fg)]">Carteleras y resultados</h2>
          <ul className="mt-3">
            {evs.map((e) => (
              <li key={e.slug} className="flex justify-between gap-3 border-t border-[var(--color-border)] py-2 text-[14px]">
                <Link href={withLocale(locale, `/combate/ufc/evento/${e.slug}`)} className={`min-w-0 truncate ${link}`}>{e.title.replace(/ vs\.? /g, ' contra ')}</Link>
                <span className="shrink-0 font-mono text-[12px] text-[var(--color-fg-subtle)]">{e.startsAt ? dayEs.format(new Date(e.startsAt)) : ''}</span>
              </li>
            ))}
          </ul>
          <Link href={withLocale(locale, '/combate/ufc/luchador/ilia-topuria')} className="mt-4 inline-block font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent-ink)]">Ficha de Ilia Topuria →</Link>
        </div>
      )}
    </section>
  );
}

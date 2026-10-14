import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { fetchTeam, fetchTeamRoster } from '@/lib/espn-team';
import { loadTeam, teamBase, POS_LABEL } from '@/lib/team-page';
import { TeamHeader } from '@/components/portal/team-header';
import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import { routing, type Locale } from '@/i18n/routing';

const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);

// Regeneración periódica (ISR): rápida y estable sin pedir a las fuentes en cada visita.
export const revalidate = 21600;
// Sin prerender en build: cada URL se genera en la primera visita y queda en caché (ISR).
export const dynamicParams = true;
export async function generateStaticParams() { return []; }
type Params = Promise<{ locale: string; deporte: string; competicion: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { locale, deporte, competicion, slug } = await params;
  const ctx = await loadTeam(deporte, competicion, slug);
  if (!ctx) return {};
  const { c, ref } = ctx;
  return pageMetadata({
    locale, path: `${teamBase(c, ref)}/plantilla`,
    title: `Plantilla del ${ref.name}: jugadores, dorsales y entrenador · ${c.shortName ?? c.name}`,
    description: `Plantilla completa del ${ref.name} en ${c.name}: jugadores por posición con dorsal, edad y nacionalidad, y entrenador.`,
    keywords: [`${ref.name} plantilla`, `plantilla ${ref.name}`, `jugadores ${ref.name}`, `dorsales ${ref.name}`, `entrenador ${ref.name}`],
  });
}

export default async function TeamRosterPage({ params }: { params: Params }) {
  const { locale, deporte, competicion, slug } = await params;
  const ctx = await loadTeam(deporte, competicion, slug);
  if (!ctx) notFound();
  setRequestLocale(locale);
  const { s, c, ref } = ctx;
  const [team, roster] = await Promise.all([fetchTeam(c, ref.id), fetchTeamRoster(c, ref.id)]);
  const groups = new Map<string, typeof roster.players>();
  for (const p of roster.players) groups.set(p.pos || '—', [...(groups.get(p.pos || '—') ?? []), p]);
  return (
    <main className="pt-28" data-sport={s.slug}>
      <TeamHeader ctx={ctx} locale={locale} section="plantilla" title={`Plantilla del ${ref.name}`} description={roster.players.length ? `${roster.players.length} jugadores${roster.coach ? ` · Entrenador: ${roster.coach}` : ''}.` : 'ESPN no ha publicado la plantilla de este equipo.'} logo={team?.logo} color={team?.color} />
      {roster.players.length > 0 && (
        <section className="mx-auto w-full max-w-[1400px] px-6 py-8 md:px-10">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[...groups.entries()].map(([pos, ps]) => (
              <div key={pos} className="rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5">
                <h2 className="sub-label">{POS_LABEL[pos] ?? pos}</h2>
                <ul className="mt-3 space-y-1.5">
                  {ps.map((p) => (
                    <li key={`${p.jersey}-${p.name}`} className="flex items-center gap-3 text-sm">
                      <span className="n-pos inline-grid h-6 w-7 shrink-0 place-items-center rounded-full bg-[var(--color-bg)] tab-num">{p.jersey && p.jersey !== 'undefined' ? p.jersey : '·'}</span>
                      {p.id ? <Link href={withLocale(locale as Locale, `/${c.sport}/${c.slug}/jugador/${p.id}`)} className="flex-1 truncate text-[var(--color-fg)] hover:text-[var(--accent-ink)]">{p.name}</Link> : <span className="flex-1 truncate text-[var(--color-fg)]">{p.name}</span>}
                      {p.nationality && <span className="hidden truncate font-mono text-[10px] text-[var(--color-fg-subtle)] sm:inline">{p.nationality}</span>}
                      {p.age && <span className="font-mono text-[10px] tab-num text-[var(--color-fg-subtle)]">{p.age}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

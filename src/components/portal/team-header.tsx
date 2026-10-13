import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { TeamCtx } from '@/lib/team-page';
import { teamBase } from '@/lib/team-page';
import { Crest } from './crest';
import { TeamTabs, teamSections, type TeamSection } from './team-tabs';
import { JsonLd, breadcrumbLd, localeUrl } from '@/lib/seo';
import { routing, type Locale } from '@/i18n/routing';

const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);

/** Cabecera de las subpáginas de equipo: migas, escudo, H1 y pestañas. */
export function TeamHeader({ ctx, locale, section, title, description, logo, color }: { ctx: TeamCtx; locale: string; section: TeamSection; title: string; description: string; logo?: string; color?: string }) {
  const { s, c, ref } = ctx;
  const L = locale as Locale;
  const sec = teamSections(c, ref).find((x) => x.key === section);
  const crumbs = [{ name: 'Inicio', path: '/' }, { name: s.name, path: `/${s.slug}` }, { name: c.name, path: `/${c.sport}/${c.slug}` }, { name: ref.name, path: teamBase(c, ref) }];
  if (sec && section !== 'inicio') crumbs.push({ name: sec.label, path: sec.path });
  return (
    <>
      <JsonLd data={[
        breadcrumbLd(locale, crumbs),
        { '@context': 'https://schema.org', '@type': 'SportsTeam', name: ref.name, sport: s.name, ...(logo ?? ref.logo ? { logo: logo ?? ref.logo } : {}), memberOf: { '@type': 'SportsOrganization', name: c.name }, url: localeUrl(locale, sec?.path ?? teamBase(c, ref)) },
      ]} />
      <header className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <Link href={withLocale(L, teamBase(c, ref))} className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> {ref.name}
        </Link>
        <div className="mt-6 flex items-center gap-4">
          <Crest src={logo ?? ref.logo} abbr={ref.abbr} color={color} size="l" />
          <div>
            <div className="kicker">{c.name}</div>
            <h1 className="t-h1 mt-1 text-[var(--color-fg)]">{title}</h1>
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-lg text-[var(--color-fg-muted)]">{description}</p>
      </header>
      <TeamTabs comp={c} team={ref} active={section} locale={L} />
    </>
  );
}

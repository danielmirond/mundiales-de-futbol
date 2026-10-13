import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Competition, Sport } from '@/lib/competitions';
import { JsonLd, breadcrumbLd, localeUrl } from '@/lib/seo';
import { withLocale, compBase } from '@/lib/competition-page';
import type { Locale } from '@/i18n/routing';
import { CompetitionTabs, competitionSections, type CompetitionSection } from './competition-tabs';

/** Cabecera común de las secciones de una competición: migas, H1, descripción y pestañas. */
export function CompetitionHeader({ s, c, locale, section, title, description, extraPath }: {
  s: Sport; c: Competition; locale: string; section: CompetitionSection; title: string; description: string;
  /** Segmento extra tras la sección (p. ej. `jornada-9`) para las migas. */
  extraPath?: { name: string; path: string };
}) {
  const L = locale as Locale;
  const sec = competitionSections(c).find((x) => x.key === section);
  const crumbs = [{ name: 'Inicio', path: '/' }, { name: s.name, path: `/${s.slug}` }, { name: c.name, path: compBase(c) }];
  if (sec && section !== 'inicio') crumbs.push({ name: sec.label, path: sec.path });
  if (extraPath) crumbs.push(extraPath);
  return (
    <>
      <JsonLd data={[
        breadcrumbLd(locale, crumbs),
        { '@context': 'https://schema.org', '@type': 'SportsOrganization', name: c.name, sport: s.name, url: localeUrl(locale, compBase(c)) },
      ]} />
      <header className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <Link href={withLocale(L, section === 'inicio' ? `/${s.slug}` : compBase(c))} className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> {section === 'inicio' ? s.name : c.name}
        </Link>
        {section !== 'inicio' && <div className="kicker mt-6">{c.name}</div>}
        <h1 className={`${section === 'inicio' ? 'mt-6 font-display text-fluid-display uppercase leading-[0.9]' : 't-h1 mt-3 text-[var(--color-fg)]'}`}>{title}</h1>
        <p className="mt-4 max-w-2xl text-lg text-[var(--color-fg-muted)]">{description}</p>
      </header>
      <CompetitionTabs comp={c} active={section} locale={L} />
    </>
  );
}

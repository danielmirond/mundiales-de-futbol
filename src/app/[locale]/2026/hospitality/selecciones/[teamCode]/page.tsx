import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight, Flag, ShieldCheck } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';
import { FMT_TEAM_PARAMS, fifaTeamUrl, HOSPITALITY_PRODUCTS } from '@/lib/wc-2026-hospitality';
import { TEAMS_2026 } from '@/lib/wc-2026';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export function generateStaticParams() {
  return Object.keys(FMT_TEAM_PARAMS).map((teamCode) => ({ teamCode }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; teamCode: string }>;
}) {
  const { locale, teamCode } = await params;
  const team = TEAMS_2026[teamCode as keyof typeof TEAMS_2026];
  if (!team || !FMT_TEAM_PARAMS[teamCode]) return {};
  return pageMetadata({
    locale,
    path: `/2026/hospitality/selecciones/${teamCode}`,
    title: `Follow My Team ${team.name} Mundial 2026 · Hospitality oficial`,
    description: `Paquete hospitality "Follow My Team" para seguir a ${team.name} en el Mundial 2026. Asiento premium garantizado en los 3 partidos de grupos + continuidad hasta donde llegue la selección. Desde 6.500 USD por persona.`,
    keywords: [
      `hospitality ${team.name.toLowerCase()} mundial 2026`,
      `follow my team ${team.name.toLowerCase()}`,
      `entradas premium ${team.name.toLowerCase()}`,
      `seguir ${team.name.toLowerCase()} mundial`,
    ],
    type: 'article',
  });
}

const FMT_PRODUCT = HOSPITALITY_PRODUCTS.find((p) => p.id === 'FMT')!;

export default async function TeamDetailPage({
  params,
}: {
  params: Promise<{ locale: string; teamCode: string }>;
}) {
  const { locale, teamCode } = await params;
  const team = TEAMS_2026[teamCode as keyof typeof TEAMS_2026];
  if (!team || !FMT_TEAM_PARAMS[teamCode]) notFound();
  setRequestLocale(locale);

  const fmtUrl = fifaTeamUrl(teamCode);

  // Otras selecciones de la misma confederación
  const otherTeams = Object.keys(FMT_TEAM_PARAMS)
    .map((c) => ({ code: c, team: TEAMS_2026[c as keyof typeof TEAMS_2026] }))
    .filter((x) => x.team && x.team.conf === team.conf && x.code !== teamCode)
    .slice(0, 6);

  return (
    <article className="pt-32 pb-24">
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: `Follow My Team ${team.name} Mundial 2026`,
            url: localeUrl(locale, `/2026/hospitality/selecciones/${teamCode}`),
            inLanguage: locale,
            about: {
              '@type': 'SportsTeam',
              name: team.name,
            },
          },
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Mundial 2026', path: '/2026' },
            { name: 'Hospitality', path: '/2026/hospitality' },
            { name: 'Por selección', path: '/2026/hospitality/selecciones' },
            { name: team.name, path: `/2026/hospitality/selecciones/${teamCode}` },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/2026/hospitality/selecciones')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-pitch)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Follow My Team
        </Link>

        <div className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Flag className="mr-2 inline h-3 w-3" /> {team.conf} · Follow My Team
        </div>
        <h1 className="mt-3 flex items-baseline gap-4 font-display text-4xl uppercase leading-[1] md:text-5xl">
          <span className="text-5xl md:text-6xl">{team.flag}</span>
          <span>Hospitality {team.name}</span>
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)]">
          Sigue a <strong>{team.name}</strong> por todo el Mundial 2026 con
          asiento premium garantizado, lounge con catering chef-driven y
          continuidad automática hasta donde llegue tu selección. Si {team.name}
          llega a la final, tu paquete incluye la final en MetLife Stadium.
        </p>

        <a
          href={fmtUrl}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-[1.02]"
        >
          <ShieldCheck className="h-4 w-4" />
          Ver Follow My Team {team.name} en FIFA Hospitality
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </a>
      </header>

      {/* Qué incluye */}
      <section className="mx-auto mt-12 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-pitch)]/40 bg-[var(--color-bg-2)] p-6 md:p-7">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="font-display text-2xl uppercase">Qué incluye Follow My Team</h2>
            <div className="font-mono text-base text-[var(--color-pitch)]">
              desde {FMT_PRODUCT.priceFromUsd?.toLocaleString('es-ES')} USD
            </div>
          </div>
          <p className="mt-3 text-base leading-relaxed text-[var(--color-fg-muted)]">{FMT_PRODUCT.description}</p>
          <ul className="mt-4 grid gap-1.5 md:grid-cols-2">
            {FMT_PRODUCT.details.map((d) => (
              <li key={d} className="flex gap-2 text-sm text-[var(--color-fg-muted)]">
                <span className="text-[var(--color-pitch)]">·</span>{d}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Riesgo eliminación */}
      <section className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:p-7">
          <h2 className="font-display text-xl uppercase">El riesgo de Follow My Team</h2>
          <p className="mt-3 text-base leading-relaxed text-[var(--color-fg-muted)]">
            Si {team.name} es eliminada en fase de grupos, mantienes los
            3 partidos garantizados pero no recibes los partidos de eliminatorias
            (ya estaban contemplados en el precio). Es el riesgo asumido del
            producto. Para {team.name}, dependiendo del bombo y rivales en
            el sorteo, las probabilidades de pasar de grupos varían entre
            el 40 % y el 95 %.
          </p>
          <p className="mt-3 text-base leading-relaxed text-[var(--color-fg-muted)]">
            Si quieres asegurar ver más partidos sin depender del rendimiento,
            valora una <Link href={withLocale(locale as Locale, '/2026/hospitality/productos')} className="underline">Venue Series</Link>
            {' '}por estadio o un <strong>Multi-Match Bundle</strong> con 5
            partidos que tú eliges del calendario.
          </p>
        </div>
      </section>

      {/* Más info de la selección */}
      <section className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10">
        <h2 className="font-display text-xl uppercase">Más sobre {team.name}</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={withLocale(locale as Locale, `/2026/listas/${teamCode}`)} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
            Convocatoria
          </Link>
          <Link href={withLocale(locale as Locale, `/selecciones/${teamCode}`)} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
            Histórico
          </Link>
          <Link href={withLocale(locale as Locale, `/selecciones/${teamCode}/camisetas`)} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
            Camisetas históricas
          </Link>
        </div>
      </section>

      {/* Otras selecciones */}
      {otherTeams.length > 0 && (
        <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
          <h2 className="font-display text-lg uppercase">Otras selecciones {team.conf}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {otherTeams.map(({ code, team: t }) => (
              <Link
                key={code}
                href={withLocale(locale as Locale, `/2026/hospitality/selecciones/${code}`)}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-2)] px-3 py-1.5 text-xs hover:border-[var(--color-pitch)]/60 hover:text-[var(--color-pitch)]"
              >
                <span>{t!.flag}</span>
                <span>{t!.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

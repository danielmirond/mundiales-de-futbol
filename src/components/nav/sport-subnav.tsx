'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { routing, type Locale } from '@/i18n/routing';
import { NAV_COMPS, NAV_SPORTS } from './nav-data';
import { activeSportOf } from './site-nav';
import { useLiveToday } from './use-live-today';
import { Icon, sportIcon } from '@/components/ui/icon';

const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);

/**
 * Subnav pegajosa (sistema de diseño · 05): competiciones del deporte activo
 * con punto rojo si tienen partido en directo. Sin deporte activo (portada,
 * noticias, archivo) muestra los deportes con datos.
 */
export function SportSubnav() {
  const t = useTranslations('nav');
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const sport = activeSportOf(pathname);
  const live = useLiveToday();
  const comps = sport ? NAV_COMPS.filter((c) => c.sport === sport && c.live) : [];
  const isActive = (href: string) => pathname === withLocale(locale, href) || pathname.startsWith(`${withLocale(locale, href)}/`);
  const pill = (active: boolean) => cn('inline-flex h-[30px] shrink-0 items-center gap-1.5 rounded-full border px-3 text-[13px] whitespace-nowrap transition-colors', active ? 'border-transparent bg-[var(--color-fg)] font-semibold text-[var(--color-bg)]' : 'border-transparent text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]');
  const dot = (key: string) => live.liveSlugs.includes(key) && <i className="h-1.5 w-1.5 rounded-full bg-[var(--color-live)]" />;

  return (
    <div data-sport={sport ?? undefined} className="border-b border-[var(--color-border)] bg-[var(--color-bg-2)]/90 backdrop-blur">
      <div className="no-scrollbar mx-auto flex h-11 w-full max-w-[1400px] items-center gap-1.5 overflow-x-auto px-4 md:px-7">
        {sport ? (
          <>
            <span className="kicker mr-2 whitespace-nowrap">{t(sport as 'futbol')}</span>
            <Link href={withLocale(locale, `/${sport}`)} className={pill(pathname === withLocale(locale, `/${sport}`))}>Todo</Link>
            {comps.map((c) => <Link key={c.slug} href={withLocale(locale, c.href)} className={pill(isActive(c.href))}>{dot(`${c.sport}/${c.slug}`)}{c.name}</Link>)}
          </>
        ) : (
          <>
            {NAV_SPORTS.filter((s) => s.live).map((s) => (
              <Link key={s.slug} href={withLocale(locale, `/${s.slug}`)} data-sport={s.slug} className={pill(false)}>
                <Icon name={sportIcon(s.slug)} size={14} className="text-[var(--accent)]" />{t(s.slug as 'futbol')}
                {live.liveSlugs.some((x) => x.startsWith(`${s.slug}/`)) && <i className="h-1.5 w-1.5 rounded-full bg-[var(--color-live)]" />}
              </Link>
            ))}
            {NAV_COMPS.filter((c) => ['laliga', 'champions-league', 'premier-league', 'nba'].includes(c.slug)).map((c) => (
              <Link key={c.slug} href={withLocale(locale, c.href)} className={pill(false)}>{dot(`${c.sport}/${c.slug}`)}{c.name}</Link>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

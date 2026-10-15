'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { LocaleSwitcher } from './locale-switcher';
import { BrandLockup } from '@/components/brand/brand-mark';
import { Icon, sportIcon, type IconName } from '@/components/ui/icon';
import { routing, localeMeta, type Locale } from '@/i18n/routing';
import { NAV_SPORTS, NAV_COMPS, MORE_SPORTS } from './nav-data';
import { useLiveToday } from './use-live-today';
import { OPEN_MENU_EVENT } from './bottom-nav';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

/** Rutas del archivo histórico de los Mundiales: sección dorada «1930–2026». */
const ARCHIVE = /^(mundiales|2026|2030|ediciones|selecciones|records|palmares|historias|historial|estadios|jugadores|goles-famosos|galeria|coleccionismo)$/;
export function isArchivePath(pathname: string): boolean {
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] && (routing.locales as readonly string[]).includes(parts[0])) parts.shift();
  return ARCHIVE.test(parts[0] ?? '');
}

/** Deporte activo a partir de la ruta (`/futbol/laliga`, `/en/baloncesto`…). */
export function activeSportOf(pathname: string): string | null {
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] && (routing.locales as readonly string[]).includes(parts[0])) parts.shift();
  const first = parts[0] ?? '';
  return NAV_SPORTS.some((s) => s.slug === first) ? first : null;
}

const LiveCount = ({ n }: { n: number }) => n > 0 ? (
  <span className="inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_oklab,var(--color-live)_16%,transparent)] px-2 py-1 font-mono text-[10px] font-semibold text-[var(--color-live-ink)]"><i className="pulse" />{n}</span>
) : null;

/**
 * Navegación del portal (sistema de diseño · 05/06): deporte arriba,
 * competición debajo (SportSubnav). Escritorio: barra + mega-menú «Más
 * deportes». Móvil: barra + tira de deportes + tira de competiciones + drawer.
 */
export function SiteNav() {
  const t = useTranslations('nav');
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const sport = activeSportOf(pathname);
  const archive = isArchivePath(pathname);
  // Sección del logotipo: el deporte activo (con su acento) o el archivo (oro).
  const section = sport ? NAV_SPORTS.find((s) => s.slug === sport)?.name.toUpperCase() : archive ? '1930–2026' : undefined;
  const brandSport = sport ?? (archive ? 'archivo' : undefined);
  const [open, setOpen] = useState(false);
  // true solo en cliente (el portal necesita document); sin efecto que provoque doble render.
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  // El botón «Menú» del menú inferior móvil abre este mismo panel.
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_MENU_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_MENU_EVENT, onOpen);
  }, []);
  const [mega, setMega] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const live = useLiveToday();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  // Cierra drawer y mega-menú al navegar (ajuste de estado durante el render).
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) { setPrevPath(pathname); setOpen(false); setMega(false); }
  useEffect(() => {
    if (!mega) return;
    const onDown = (e: MouseEvent) => { if (megaRef.current && !megaRef.current.contains(e.target as Node)) setMega(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMega(false); };
    document.addEventListener('mousedown', onDown); document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [mega]);

  const liveSports = NAV_SPORTS.filter((s) => s.live);
  /** Barra de escritorio: los tres primeros deportes; el resto con datos va arriba en «Más deportes». */
  const barSports = liveSports.slice(0, 3);
  const moreLive = liveSports.slice(3);
  const item = (active: boolean) => cn('inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-sm whitespace-nowrap transition-colors', active ? 'bg-[var(--color-surface)] font-medium text-[var(--color-fg)]' : 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]');
  const sportLiveCount = (slug: string) => live.liveSlugs.filter((x) => x.startsWith(`${slug}/`)).length;

  return (
    <header className={cn('relative z-40 transition-colors duration-300', scrolled || open || mega ? 'border-b border-[var(--color-border)] bg-[var(--color-bg)]/85 backdrop-blur-xl' : 'border-b border-transparent bg-[var(--color-bg)]/60 backdrop-blur-md')}>
      <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center gap-0.5 px-4 md:h-[68px] md:px-7">
        <Link href={withLocale(locale, '/')} data-sport={brandSport} className="mr-3 flex shrink-0 items-center md:mr-5" aria-label="Mundiales · inicio">
          {/* La sección se oculta en el tramo lg–xl, donde la barra de escritorio no deja sitio. */}
          <BrandLockup section={section} sectionClassName="lg:max-xl:hidden" />
        </Link>

        {/* Escritorio */}
        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Principal">
          <Link href={withLocale(locale, '/partidos-hoy')} className={cn(item(pathname.endsWith('/partidos-hoy')), 'font-semibold text-[var(--color-fg)]')}>{t('today')}<LiveCount n={live.live} /></Link>
          {barSports.map((s) => (
            <Link key={s.slug} href={withLocale(locale, `/${s.slug}`)} className={item(sport === s.slug)} data-sport={s.slug}>
              <Icon name={sportIcon(s.slug)} className="text-[var(--accent)]" />{t(s.slug as 'futbol')}
              {sportLiveCount(s.slug) > 0 && <LiveCount n={sportLiveCount(s.slug)} />}
            </Link>
          ))}
          <button type="button" onClick={() => setMega((v) => !v)} aria-expanded={mega} className={item(mega)}>{t('moreSports')}<Icon name="chev" size={12} className={cn('text-[var(--color-fg-subtle)] transition-transform', mega && 'rotate-180')} /></button>
          <span className="mx-2 h-5 w-px bg-[var(--color-border-strong)]" />
          <Link href={withLocale(locale, '/mundiales')} className={item(/\/(mundiales|2026|2030|ediciones|selecciones|palmares|historial|historias|jugadores|goles-famosos|estadios|galeria|records|coleccionismo)(\/|$)/.test(pathname))}>{t('worldCups')}</Link>
          <Link href={withLocale(locale, '/noticias')} className={item(pathname.includes('/noticias'))}>{t('news')}</Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link href={withLocale(locale, '/partidos-hoy')} className="inline-flex h-9 items-center gap-1.5 rounded-full px-2 text-sm font-semibold text-[var(--color-fg)] lg:hidden" aria-label={t('today')}>
            <LiveCount n={live.live} />
          </Link>
          <LocaleSwitcher />
          <button onClick={() => setOpen(true)} className="grid h-9 w-9 place-items-center rounded-full border border-[var(--color-border)] text-[var(--color-fg-muted)] lg:hidden" aria-label={t('menu')}>
            <Icon name="menu" />
          </button>
        </div>
      </div>

      {/* Móvil: tira de deportes */}
      <div className="no-scrollbar flex h-11 items-stretch gap-0.5 overflow-x-auto border-t border-[var(--color-border)] px-2 lg:hidden" role="navigation" aria-label="Deportes">
        <Link href={withLocale(locale, '/partidos-hoy')} className={cn('flex items-center gap-1.5 whitespace-nowrap border-b-2 px-2.5 text-[13.5px]', pathname.endsWith('/partidos-hoy') ? 'border-[var(--color-pitch)] font-semibold text-[var(--color-fg)]' : 'border-transparent text-[var(--color-fg-muted)]')}>{t('today')}</Link>
        {liveSports.map((s) => (
          <Link key={s.slug} href={withLocale(locale, `/${s.slug}`)} data-sport={s.slug} className={cn('flex items-center gap-1.5 whitespace-nowrap border-b-2 px-2.5 text-[13.5px]', sport === s.slug ? 'border-[var(--accent)] font-semibold text-[var(--color-fg)]' : 'border-transparent text-[var(--color-fg-muted)]')}>
            <Icon name={sportIcon(s.slug)} className="text-[var(--accent)]" />{t(s.slug as 'futbol')}
          </Link>
        ))}
        <Link href={withLocale(locale, '/mundiales')} className={cn('flex items-center whitespace-nowrap border-b-2 px-2.5 text-[13.5px]', /\/(mundiales|2026|ediciones)(\/|$)/.test(pathname) ? 'border-[var(--color-gold)] font-semibold text-[var(--color-fg)]' : 'border-transparent text-[var(--color-fg-muted)]')}>{t('worldCups')}</Link>
        <Link href={withLocale(locale, '/noticias')} className={cn('flex items-center whitespace-nowrap border-b-2 px-2.5 text-[13.5px]', pathname.includes('/noticias') ? 'border-[var(--color-fg)] font-semibold text-[var(--color-fg)]' : 'border-transparent text-[var(--color-fg-muted)]')}>{t('news')}</Link>
      </div>

      {/* Mega-menú «Más deportes» (escritorio) */}
      {mega && (
        <div ref={megaRef} className="absolute inset-x-0 top-full hidden border-b border-[var(--color-border)] bg-[var(--color-bg-2)] lg:block">
          {moreLive.length > 0 && (
            <div className="mx-auto flex w-full max-w-[1400px] flex-wrap gap-2 border-b border-[var(--color-border)] px-7 pb-5 pt-6">
              {moreLive.map((s) => (
                <Link key={s.slug} href={withLocale(locale, `/${s.slug}`)} data-sport={s.slug} className="inline-flex h-9 items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-4 text-sm font-semibold text-[var(--color-fg)] hover:border-[var(--accent)] hover:text-[var(--accent-ink)]">
                  <Icon name={sportIcon(s.slug)} className="text-[var(--accent)]" />{t(s.slug as 'futbol')}
                  {sportLiveCount(s.slug) > 0 && <LiveCount n={sportLiveCount(s.slug)} />}
                </Link>
              ))}
            </div>
          )}
          <div className="mx-auto grid w-full max-w-[1400px] grid-cols-4 gap-x-8 gap-y-7 px-7 py-7">
            {MORE_SPORTS.map((g) => (
              <div key={g.name} data-sport={['motor', 'tenis', 'balonmano', 'ciclismo', 'atletismo'].includes(g.icon) ? g.icon : 'tenis'}>
                <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--color-fg)]">
                  <Icon name={g.icon as IconName} className="text-[var(--accent)]" />
                  {g.href ? <Link href={withLocale(locale, g.href)} className="hover:text-[var(--accent-ink)]">{g.name}</Link> : g.name}
                  {g.soon && <span className="rounded border border-[var(--color-border)] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--color-fg-subtle)]">{t('soon')}</span>}
                </h4>
                <ul className="grid gap-2 text-[13.5px] text-[var(--color-fg-muted)]">{g.items.map((i) => <li key={i}>{i}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Drawer móvil: en un portal a <body>, porque el backdrop-filter de la cabecera
          crea un bloque contenedor y un `fixed` dentro quedaría recortado a su altura. */}
      {mounted && createPortal(<div className={cn('fixed inset-0 z-50 flex flex-col gap-4 overflow-y-auto bg-[var(--color-bg)] px-5 pb-8 pt-[calc(env(safe-area-inset-top)+1rem)] transition-transform duration-300 lg:hidden', open ? 'translate-x-0' : 'translate-x-full')} aria-hidden={!open}>
        <div className="flex items-center justify-between">
          <span data-sport={brandSport}><BrandLockup size="s" section={section} /></span>
          <button onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-full border border-[var(--color-border)] text-[var(--color-fg-muted)]" aria-label={t('close')}><Icon name="cerrar" /></button>
        </div>
        <Link href={withLocale(locale, '/partidos-hoy')} className="flex h-[46px] items-center gap-2.5 rounded-xl bg-[var(--color-surface)] px-3.5 text-[15px] text-[var(--color-fg-subtle)]"><Icon name="buscar" size={18} />{t('search')}</Link>
        <nav className="grid" aria-label="Menú">
          <Link href={withLocale(locale, '/partidos-hoy')} className="flex h-[54px] items-center gap-3 border-b border-[var(--color-border)] text-[17px] font-medium text-[var(--color-fg)]">{t('today')}<span className="ml-auto font-mono text-[11px] text-[var(--color-live-ink)]">{live.live > 0 ? `${live.live} ${t('liveNow')}` : live.total > 0 ? `${live.total}` : ''}</span></Link>
          {NAV_SPORTS.filter((s) => s.live).map((s) => (
            <Link key={s.slug} href={withLocale(locale, `/${s.slug}`)} data-sport={s.slug} className="flex h-[54px] items-center gap-3 border-b border-[var(--color-border)] text-[17px] font-medium text-[var(--color-fg)]">
              <span className="grid h-8 w-8 place-items-center rounded-[9px] bg-[color-mix(in_oklab,var(--accent)_16%,transparent)] text-[var(--accent)]"><Icon name={sportIcon(s.slug)} size={18} /></span>{t(s.slug as 'futbol')}
              <span className="ml-auto font-mono text-[11px] text-[var(--color-fg-subtle)]">{NAV_COMPS.filter((c) => c.sport === s.slug && c.live).length}</span>
            </Link>
          ))}
          {NAV_SPORTS.filter((s) => !s.live).map((s) => (
            <Link key={s.slug} href={withLocale(locale, `/${s.slug}`)} data-sport={s.slug} className="flex h-[54px] items-center gap-3 border-b border-[var(--color-border)] text-[17px] font-medium text-[var(--color-fg)]">
              <span className="grid h-8 w-8 place-items-center rounded-[9px] bg-[color-mix(in_oklab,var(--accent)_16%,transparent)] text-[var(--accent)]"><Icon name={sportIcon(s.slug)} size={18} /></span>{t(s.slug as 'futbol')}
              <span className="ml-auto font-mono text-[11px] text-[var(--color-fg-subtle)]">{t('soon')}</span>
            </Link>
          ))}
          <Link href={withLocale(locale, '/noticias')} className="flex h-[54px] items-center gap-3 border-b border-[var(--color-border)] text-[17px] font-medium text-[var(--color-fg)]">
            <span className="grid h-8 w-8 place-items-center rounded-[9px] bg-[var(--color-surface)] text-[var(--color-fg)]"><Icon name="noticias" size={18} /></span>{t('news')}
          </Link>
        </nav>
        <div className="sub-label mt-1">{t('worldCups')}</div>
        <nav className="grid" aria-label={t('worldCups')}>
          {[
            { href: '/mundiales', label: 'Historia de los Mundiales', icon: 'trofeo' as IconName },
            { href: '/2026', label: 'Mundial 2026', icon: 'trofeo' as IconName },
            { href: '/ediciones', label: `${t('editions')} 1930–2026`, icon: 'cal' as IconName },
            { href: '/selecciones', label: t('selections'), icon: 'futbol' as IconName },
            { href: '/estadios', label: t('stadiums'), icon: 'estadio' as IconName },
            { href: '/historias', label: t('stories'), icon: 'noticias' as IconName },
            { href: '/galeria', label: t('gallery'), icon: 'mas' as IconName },
          ].map((l) => (
            <Link key={l.href} href={withLocale(locale, l.href)} className="flex h-[54px] items-center gap-3 border-b border-[var(--color-border)] text-[17px] font-medium text-[var(--color-fg)]">
              <span className="grid h-8 w-8 place-items-center rounded-[9px] bg-[color-mix(in_oklab,var(--color-gold)_16%,transparent)] text-[var(--color-gold)]"><Icon name={l.icon} size={18} /></span>{l.label}
            </Link>
          ))}
        </nav>
        <div className="mt-2 flex flex-wrap gap-2">
          {routing.locales.map((l) => (
            <Link key={l} href={withLocale(l as Locale, '/')} className={cn('rounded-full border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.1em]', l === locale ? 'border-[var(--color-fg)] text-[var(--color-fg)]' : 'border-[var(--color-border)] text-[var(--color-fg-muted)]')}>{localeMeta[l as Locale]?.nativeLabel ?? l}</Link>
          ))}
        </div>
      </div>, document.body)}
    </header>
  );
}

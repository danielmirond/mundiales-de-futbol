'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icon';
import { BrandSymbol } from '@/components/brand/brand-mark';
import { routing, type Locale } from '@/i18n/routing';
import { useLiveToday } from './use-live-today';

const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);
const stripLocale = (p: string) => p.replace(new RegExp(`^/(${routing.locales.join('|')})(?=/|$)`), '') || '/';

/** Evento que abre el menú lateral de la cabecera (lo escucha SiteNav). */
export const OPEN_MENU_EVENT = 'mundiales:open-menu';

/**
 * Menú inferior para móvil: Inicio · Hoy · Directo · Noticias · Menú.
 * Fijo abajo, respeta la zona segura del iPhone y se oculta en escritorio.
 */
export function BottomNav() {
  const t = useTranslations('nav');
  const locale = useLocale() as Locale;
  const path = stripLocale(usePathname());
  const live = useLiveToday();
  const is = (p: string) => (p === '/' ? path === '/' : path === p || path.startsWith(`${p}/`));
  const item = (active: boolean) => cn('flex flex-1 flex-col items-center justify-center gap-1 text-[11px] leading-none transition-colors', active ? 'text-[var(--color-fg)]' : 'text-[var(--color-fg-subtle)]');

  return (
    <nav aria-label="Navegación principal" className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-bg)]/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex h-[60px] max-w-[560px] items-stretch">
        <Link href={withLocale(locale, '/')} aria-current={is('/') ? 'page' : undefined} className={item(is('/'))}>
          <BrandSymbol size={20} className={is('/') ? 'text-[var(--accent)]' : ''} />{t('home')}
        </Link>
        <Link href={withLocale(locale, '/partidos-hoy')} aria-current={is('/partidos-hoy') ? 'page' : undefined} className={item(is('/partidos-hoy'))}>
          <span className="relative"><Icon name="cal" size={20} />{live.live > 0 && <span className="absolute -right-1.5 -top-1 h-2 w-2 rounded-full bg-[var(--color-live)]" />}</span>Hoy
        </Link>
        <Link href={withLocale(locale, '/directo')} aria-current={is('/directo') ? 'page' : undefined} className={item(is('/directo'))}>
          <span className={cn('grid h-[22px] w-[22px] place-items-center rounded-full border-[1.5px]', is('/directo') ? 'border-[var(--color-live)]' : 'border-current')}>
            <span className="h-2 w-2 rounded-full bg-[var(--color-live)]" />
          </span>Directo
        </Link>
        <Link href={withLocale(locale, '/noticias')} aria-current={is('/noticias') ? 'page' : undefined} className={item(is('/noticias'))}>
          <Icon name="noticias" size={20} />{t('news')}
        </Link>
        <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_MENU_EVENT))} className={item(false)} aria-label={t('menu')}>
          <Icon name="menu" size={20} />{t('menu')}
        </button>
      </div>
    </nav>
  );
}

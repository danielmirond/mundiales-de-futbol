import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import { TimelineMark } from '@/components/brand/timeline';
import { routing, type Locale } from '@/i18n/routing';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export async function SiteFooter() {
  const t = await getTranslations('footer');
  const locale = (await getLocale()) as Locale;
  return (
    <footer className="relative mt-24 border-t border-[var(--color-border)] bg-[var(--color-bg-2)]">
      <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-6 py-16 md:grid-cols-[2fr_1fr_1fr] md:px-10">
        <div>
          <TimelineMark size={40} ticks={14} />
          <p className="mt-8 max-w-md text-lg leading-relaxed text-[var(--color-fg-muted)]">
            {t('tagline')}
          </p>
        </div>
        <div className="text-sm text-[var(--color-fg-muted)]">
          <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-fg-subtle)]">
            1930-2026
          </div>
          <ul className="mt-4 space-y-2">
            <li>22 ediciones</li>
            <li>2.578 partidos</li>
            <li>2.720 goles</li>
            <li>8 campeones</li>
          </ul>
        </div>
        <div className="text-sm text-[var(--color-fg-muted)]">
          <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-fg-subtle)]">
            Open data
          </div>
          <p className="mt-4 leading-relaxed">{t('credits')}</p>
        </div>
      </div>
      {/*
        Bloque editorial E-E-A-T. Las tres páginas (sobre-nosotros,
        política editorial, política de correcciones) refuerzan la
        señal de Authoritativeness/Trustworthiness para Discover y
        Google News. Los enlaces aquí son la entrada principal a esas
        páginas desde cualquier vista del sitio.
      */}
      <div className="border-t border-[var(--color-border)]">
        <div className="mx-auto grid w-full max-w-[1400px] gap-8 px-6 py-10 sm:grid-cols-2 md:grid-cols-4 md:px-10">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              {t('editorial.heading')}
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href={withLocale(locale, '/sobre-nosotros')} className="text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]">
                  {t('editorial.about')}
                </Link>
              </li>
              <li>
                <Link href={withLocale(locale, '/politica-editorial')} className="text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]">
                  {t('editorial.editorialPolicy')}
                </Link>
              </li>
              <li>
                <Link href={withLocale(locale, '/politica-correcciones')} className="text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]">
                  {t('editorial.correctionsPolicy')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              {t('content.heading')}
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href={withLocale(locale, '/historias')} className="text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]">
                  {t('content.stories')}
                </Link>
              </li>
              <li>
                <Link href={withLocale(locale, '/noticias')} className="text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]">
                  {t('content.news')}
                </Link>
              </li>
              <li>
                <Link href={withLocale(locale, '/galeria')} className="text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]">
                  {t('content.gallery')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              {t('shop.heading')}
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href={withLocale(locale, '/coleccionismo/camisetas-mundial-2026')} className="text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]">
                  {t('shop.jerseys')}
                </Link>
              </li>
              <li>
                <Link href={withLocale(locale, '/coleccionismo/panini-mundial-2026')} className="text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]">
                  {t('shop.panini')}
                </Link>
              </li>
              <li>
                <Link href={withLocale(locale, '/coleccionismo/lego-mundial-2026')} className="text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]">
                  {t('shop.lego')}
                </Link>
              </li>
              <li>
                <Link href={withLocale(locale, '/aviso-afiliados')} className="text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]">
                  {t('shop.disclosure')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              {t('legal')}
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href={withLocale(locale, '/contacto')} className="text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]">
                  {t('contact')}
                </Link>
              </li>
              <li>
                <Link href={withLocale(locale, '/privacidad')} className="text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]">
                  {t('privacy')}
                </Link>
              </li>
              <li>
                <Link href={withLocale(locale, '/cookies')} className="text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]">
                  {t('cookies')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--color-border)]">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col items-start gap-3 px-6 py-5 text-xs text-[var(--color-fg-subtle)] md:flex-row md:items-center md:justify-between md:px-10">
          <span className="tab-num">© {new Date().getFullYear()} mundiales-de-futbol.com</span>
          <span className="font-mono uppercase tracking-widest">v0.1 · alpha</span>
        </div>
      </div>
    </footer>
  );
}

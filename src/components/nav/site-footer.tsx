import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import { LogomarkSeal } from '@/components/brand/logomark-seal';
import { HISTORY_TOTALS, fmtEs } from '@/lib/tournaments';
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
          <Link href={withLocale(locale, '/')} className="flex items-center gap-2.5 text-[var(--color-fg)]"><LogomarkSeal size={32} /><span className="font-display text-[28px] leading-none tracking-[0.01em]">MUNDIALES</span></Link>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-[var(--color-fg-muted)]">
            {t('tagline')}
          </p>
        </div>
        <div className="text-sm text-[var(--color-fg-muted)]">
          <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-fg-subtle)]">
            {t('history')} · 1930-2026
          </div>
          <ul className="mt-4 space-y-2">
            <li><Link href={withLocale(locale, '/ediciones')} className="hover:text-[var(--color-fg)]">{HISTORY_TOTALS.editions} ediciones</Link></li>
            <li>{fmtEs(HISTORY_TOTALS.matches)} partidos</li>
            <li>{fmtEs(HISTORY_TOTALS.goals)} goles</li>
            <li><Link href={withLocale(locale, '/palmares')} className="hover:text-[var(--color-fg)]">{HISTORY_TOTALS.champions} campeones</Link></li>
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
        <div className="mx-auto grid w-full max-w-[1400px] gap-8 px-6 py-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 md:px-10">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              En directo
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href={withLocale(locale, '/partidos-hoy')} className="text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]">
                  Partidos de hoy
                </Link>
              </li>
              <li>
                <Link href={withLocale(locale, '/futbol')} className="text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]">
                  Fútbol
                </Link>
              </li>
              <li>
                <Link href={withLocale(locale, '/futbol/laliga')} className="text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]">
                  LaLiga
                </Link>
              </li>
              <li>
                <Link href={withLocale(locale, '/futbol/champions-league')} className="text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]">
                  Champions League
                </Link>
              </li>
              <li>
                <Link href={withLocale(locale, '/baloncesto')} className="text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]">
                  Baloncesto
                </Link>
              </li>
              <li>
                <Link href={withLocale(locale, '/mundiales')} className="text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]">
                  Historia de los Mundiales
                </Link>
              </li>
            </ul>
          </div>
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
            <nav className="mt-6" aria-label={t('sports.heading')}>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
                {t('sports.heading')}
              </div>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <a href="https://pista-central.com/" className="text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]">
                    {t('sports.tennis')}
                  </a>
                </li>
              </ul>
            </nav>
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
                <Link href={withLocale(locale, '/legal/terminos')} className="text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]">
                  Términos y condiciones
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

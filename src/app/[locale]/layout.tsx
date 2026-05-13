import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { Bebas_Neue, Geist, Geist_Mono, Noto_Naskh_Arabic } from 'next/font/google';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing, localeMeta, type Locale } from '@/i18n/routing';
import { SiteNav } from '@/components/nav/site-nav';
import { SiteFooter } from '@/components/nav/site-footer';
import { Wc2026Bar } from '@/components/nav/wc-2026-bar';
import { CookieBanner } from '@/components/shared/cookie-banner';
import { GatedAnalytics } from '@/components/shared/gated-analytics';
import { GoogleAnalytics } from '@/components/shared/google-analytics';
import { JsonLd, organizationLd, websiteLd, hreflangAlternates, SEO } from '@/lib/seo';
import '../globals.css';

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });
const bebasNeue = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-bebas' });
const notoArabic = Noto_Naskh_Arabic({ subsets: ['arabic'], variable: '--font-noto-arabic' });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: '#05060a',
  colorScheme: 'dark',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const t = await getTranslations({ locale: validLocale, namespace: 'meta' });
  // Verification tokens, read from env so we don't hardcode them.
  // Configura NEXT_PUBLIC_GSC_VERIFICATION y NEXT_PUBLIC_BING_VERIFICATION
  // en Vercel para activar la verificación.
  const verification: Metadata['verification'] = {};
  const gsc = process.env.NEXT_PUBLIC_GSC_VERIFICATION;
  const bing = process.env.NEXT_PUBLIC_BING_VERIFICATION;
  if (gsc) verification.google = gsc;
  if (bing) verification.other = { 'msvalidate.01': bing };

  return {
    metadataBase: new URL(SEO.siteUrl),
    title: { default: t('title'), template: t('titleTemplate') },
    description: t('description'),
    verification,
    // Universal Discover-friendly + SERP-friendly directives
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
    alternates: {
      languages: hreflangAlternates('/'),
    },
    openGraph: {
      type: 'website',
      title: t('title'),
      description: t('description'),
      siteName: t('title'),
      url: SEO.siteUrl,
      // El OG image lo aporta automáticamente
      // src/app/[locale]/opengraph-image.tsx (1200×675).
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      // Twitter image automático vía src/app/[locale]/twitter-image.tsx.
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const dir = localeMeta[locale as Locale].dir;

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${geistSans.variable} ${geistMono.variable} ${bebasNeue.variable} ${notoArabic.variable}`}
    >
      <body className="bg-[var(--color-bg)] text-[var(--color-fg)] antialiased">
        <JsonLd data={[organizationLd(), websiteLd(locale as Locale)]} />
        <NextIntlClientProvider>
          <div aria-hidden className="vignette-fixed" />
          <div className="relative flex min-h-screen flex-col">
            <SiteNav />
            <Wc2026Bar />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
          <CookieBanner />
          <GatedAnalytics />
          <GoogleAnalytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

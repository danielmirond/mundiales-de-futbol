import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { Bebas_Neue, Geist, Geist_Mono, Noto_Naskh_Arabic } from 'next/font/google';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing, localeMeta, type Locale } from '@/i18n/routing';
import { SiteNav } from '@/components/nav/site-nav';
import { SiteFooter } from '@/components/nav/site-footer';
import { CookieBanner } from '@/components/shared/cookie-banner';
import { GatedAnalytics } from '@/components/shared/gated-analytics';
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mundiales-de-futbol.com';
  return {
    metadataBase: new URL(siteUrl),
    title: { default: t('title'), template: t('titleTemplate') },
    description: t('description'),
    openGraph: {
      type: 'website',
      title: t('title'),
      description: t('description'),
      siteName: t('title'),
      url: siteUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
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
        <NextIntlClientProvider>
          <div className="relative flex min-h-screen flex-col">
            <SiteNav />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
          <CookieBanner />
          <GatedAnalytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

import { setRequestLocale } from 'next-intl/server';
import { KnockoutRoundPage, roundMetadata } from '@/components/edition/knockout-round-landing';
import type { Locale } from '@/i18n/routing';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return roundMetadata('R32', locale);
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <KnockoutRoundPage locale={locale as Locale} roundKey="R32" />;
}

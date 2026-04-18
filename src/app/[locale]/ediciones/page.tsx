import { setRequestLocale, getTranslations } from 'next-intl/server';
import { EditionsGrid } from '@/components/home/editions-grid';
import type { Locale } from '@/i18n/routing';

export default async function EditionsIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home.editions');

  return (
    <div className="pt-32">
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Archivo · 1930 — 2026
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          {t('title')}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-[var(--color-fg-muted)]">{t('subtitle')}</p>
      </div>
      <EditionsGrid locale={locale as Locale} />
    </div>
  );
}

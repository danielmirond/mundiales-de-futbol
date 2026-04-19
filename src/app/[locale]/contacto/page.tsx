import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ContactForm } from '@/components/shared/contact-form';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  return {
    title: t('title'),
    description: t('intro'),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contact');

  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-32 md:px-10 md:py-40">
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
        {t('kicker')}
      </div>
      <h1 className="mt-4 font-display text-fluid-h1 uppercase leading-[0.95]">{t('title')}</h1>
      <p className="mt-6 max-w-xl text-lg text-[var(--color-fg-muted)]">{t('intro')}</p>

      <div className="mt-12">
        <ContactForm />
      </div>
    </article>
  );
}

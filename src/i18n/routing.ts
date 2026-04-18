import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['es', 'en', 'pt', 'fr', 'ar'] as const,
  defaultLocale: 'es',
  localePrefix: 'as-needed',
});

export type Locale = (typeof routing.locales)[number];

export const localeMeta: Record<Locale, { label: string; nativeLabel: string; flag: string; dir: 'ltr' | 'rtl' }> = {
  es: { label: 'Spanish', nativeLabel: 'Español', flag: '🇪🇸', dir: 'ltr' },
  en: { label: 'English', nativeLabel: 'English', flag: '🇬🇧', dir: 'ltr' },
  pt: { label: 'Portuguese', nativeLabel: 'Português', flag: '🇵🇹', dir: 'ltr' },
  fr: { label: 'French', nativeLabel: 'Français', flag: '🇫🇷', dir: 'ltr' },
  ar: { label: 'Arabic', nativeLabel: 'العربية', flag: '🇸🇦', dir: 'rtl' },
};

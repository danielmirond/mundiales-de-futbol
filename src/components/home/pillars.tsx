import { getTranslations } from 'next-intl/server';
import { BookOpen, Clapperboard, Gamepad2 } from 'lucide-react';

export async function Pillars() {
  const t = await getTranslations('home.pillars');
  const items = [
    { key: 'encyclopedia', Icon: BookOpen, color: 'var(--color-pitch)' },
    { key: 'editorial', Icon: Clapperboard, color: 'var(--color-sun)' },
    { key: 'interactive', Icon: Gamepad2, color: 'var(--color-flame)' },
  ] as const;

  return (
    <section className="relative mx-auto w-full max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
      <h2 className="font-display text-fluid-h1 uppercase leading-[0.92]">{t('title')}</h2>
      <div className="mt-14 grid gap-px bg-[var(--color-border)] md:grid-cols-3">
        {items.map(({ key, Icon, color }) => (
          <div key={key} className="group relative overflow-hidden bg-[var(--color-bg)] p-8 md:p-12">
            <div
              aria-hidden
              className="absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-20 blur-3xl transition-all duration-700 group-hover:opacity-60"
              style={{ background: color }}
            />
            <Icon className="h-10 w-10" style={{ color }} />
            <h3 className="mt-8 font-display text-4xl uppercase leading-none text-[var(--color-fg)] md:text-5xl">
              {t(`${key}.title`)}
            </h3>
            <p className="mt-4 max-w-sm text-base leading-relaxed text-[var(--color-fg-muted)]">
              {t(`${key}.text`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

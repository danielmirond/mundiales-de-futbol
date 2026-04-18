import { getTranslations } from 'next-intl/server';

export async function SiteFooter() {
  const t = await getTranslations('footer');
  return (
    <footer className="relative mt-24 border-t border-[var(--color-border)] bg-[var(--color-bg-2)]">
      <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-6 py-16 md:grid-cols-[2fr_1fr_1fr] md:px-10">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--color-pitch)] text-black font-mono text-sm">
              22
            </span>
            <span className="text-sm font-semibold uppercase tracking-[0.2em]">
              Mundiales de Fútbol
            </span>
          </div>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-[var(--color-fg-muted)]">
            {t('tagline')}
          </p>
        </div>
        <div className="text-sm text-[var(--color-fg-muted)]">
          <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-fg-subtle)]">
            1930 — 2026
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
      <div className="border-t border-[var(--color-border)]">
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-6 py-6 text-xs text-[var(--color-fg-subtle)] md:px-10">
          <span className="tab-num">© {new Date().getFullYear()} mundiales-de-futbol.com</span>
          <span className="font-mono uppercase tracking-widest">v0.1 · alpha</span>
        </div>
      </div>
    </footer>
  );
}

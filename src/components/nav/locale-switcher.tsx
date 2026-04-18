'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useTransition, useRef, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { routing, localeMeta, type Locale } from '@/i18n/routing';
import { cn } from '@/lib/utils';

export function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  function switchTo(next: Locale) {
    setOpen(false);
    if (next === locale) return;
    // Strip current locale prefix from pathname (if present) and prepend next.
    const parts = pathname.split('/').filter(Boolean);
    const hasPrefix = (routing.locales as readonly string[]).includes(parts[0]);
    const rest = hasPrefix ? parts.slice(1).join('/') : parts.join('/');
    const target = next === routing.defaultLocale ? `/${rest}` : `/${next}${rest ? '/' + rest : ''}`;
    startTransition(() => router.replace(target || '/'));
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/60 px-4 text-sm text-[var(--color-fg)] backdrop-blur transition-colors hover:border-[var(--color-border-strong)]"
        aria-label="Language"
      >
        <Globe className="h-4 w-4" />
        <span className="font-medium uppercase tracking-widest">{locale}</span>
      </button>
      {open && (
        <div
          className="absolute end-0 mt-2 w-52 overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-bg-2)]/95 p-1 shadow-2xl backdrop-blur"
          style={{ zIndex: 50 }}
        >
          {routing.locales.map((l) => {
            const meta = localeMeta[l];
            const active = l === locale;
            return (
              <button
                key={l}
                onClick={() => switchTo(l)}
                className={cn(
                  'flex w-full items-center justify-between rounded-xl px-3 py-2 text-start text-sm transition-colors',
                  active
                    ? 'bg-[var(--color-surface)] text-[var(--color-pitch)]'
                    : 'text-[var(--color-fg)] hover:bg-[var(--color-surface)]',
                )}
              >
                <span className="flex items-center gap-3">
                  <span aria-hidden>{meta.flag}</span>
                  <span>{meta.nativeLabel}</span>
                </span>
                {active && <Check className="h-4 w-4" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

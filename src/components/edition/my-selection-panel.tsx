'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Star, ArrowRight } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';

const LS_KEY = 'mdf:my-selection';

type Team = { code: string; name: string; flag: string };

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

/**
 * Panel "Mi selección" del dashboard /2026.
 *
 * Persiste la selección elegida en `localStorage['mdf:my-selection']`.
 * Si no hay nada guardado: muestra dropdown con las 48 selecciones y CTA
 * para elegir. Si hay: muestra bandera + nombre + grupo + accesos a ficha
 * y camiseta + botón "Cambiar".
 *
 * Client component porque toca localStorage.
 */
export function MySelectionPanel({
  locale,
  teams,
  teamToGroup,
  labels,
}: {
  locale: Locale;
  teams: Team[];
  teamToGroup: Record<string, string>;
  labels: {
    heading: string;
    placeholder: string;
    choose: string;
    change: string;
    group: string;
    seeProfile: string;
    seeJersey: string;
  };
}) {
  const [code, setCode] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    const stored = typeof window !== 'undefined' ? localStorage.getItem(LS_KEY) : null;
    if (stored && teams.find((t) => t.code === stored)) {
      setCode(stored);
    } else {
      setEditing(true); // sin selección → mostrar dropdown directamente
    }
  }, [teams]);

  function pick(next: string) {
    setCode(next);
    setEditing(false);
    try {
      localStorage.setItem(LS_KEY, next);
    } catch {
      // ignore quota / disabled
    }
  }

  const team = code ? teams.find((t) => t.code === code) : null;
  const group = code ? teamToGroup[code] : null;

  // Skeleton durante SSR para evitar mismatch
  if (!hydrated) {
    return (
      <article className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:p-7">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Star className="mr-2 inline h-3 w-3" />
          {labels.heading}
        </div>
        <p className="mt-6 text-sm text-[var(--color-fg-subtle)]">
          {labels.placeholder}
        </p>
      </article>
    );
  }

  return (
    <article className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:p-7">
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
        <Star className="mr-2 inline h-3 w-3" />
        {labels.heading}
      </div>

      {(!code || editing) && (
        <div className="mt-5">
          <label
            htmlFor="mySelectionPicker"
            className="block font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-muted)]"
          >
            {labels.choose}
          </label>
          <select
            id="mySelectionPicker"
            defaultValue={code ?? ''}
            onChange={(e) => e.target.value && pick(e.target.value)}
            className="mt-2 w-full rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-bg)] px-3.5 py-2.5 text-sm focus:border-[var(--color-pitch)] focus:outline-none"
          >
            <option value="" disabled>
              {labels.placeholder}
            </option>
            {teams.map((t) => (
              <option key={t.code} value={t.code}>
                {t.flag} {t.name}
              </option>
            ))}
          </select>
          {code && (
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="mt-3 text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-fg-muted)] hover:text-[var(--color-pitch)]"
            >
              ← {labels.change}
            </button>
          )}
        </div>
      )}

      {code && team && !editing && (
        <>
          <div className="mt-5 flex items-center gap-3">
            <span aria-hidden className="text-5xl">{team.flag}</span>
            <div>
              <div className="font-display text-xl uppercase leading-tight">
                {team.name}
              </div>
              {group && (
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-muted)]">
                  {labels.group} {group}
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 grid gap-2">
            <Link
              href={withLocale(locale, `/selecciones/${code}`)}
              className="group inline-flex items-center justify-between gap-2 rounded-xl border border-[var(--color-border-strong)] px-3.5 py-2.5 text-sm transition-colors hover:border-[var(--color-pitch)]"
            >
              <span>{labels.seeProfile}</span>
              <ArrowRight className="h-3.5 w-3.5 opacity-50 transition-transform group-hover:translate-x-1 group-hover:opacity-100 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Link>
            <Link
              href={withLocale(locale, `/selecciones/${code}/camisetas`)}
              className="group inline-flex items-center justify-between gap-2 rounded-xl border border-[var(--color-border-strong)] px-3.5 py-2.5 text-sm transition-colors hover:border-[var(--color-pitch)]"
            >
              <span>{labels.seeJersey}</span>
              <ArrowRight className="h-3.5 w-3.5 opacity-50 transition-transform group-hover:translate-x-1 group-hover:opacity-100 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Link>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="mt-1 text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-pitch)]"
            >
              {labels.change} →
            </button>
          </div>
        </>
      )}
    </article>
  );
}

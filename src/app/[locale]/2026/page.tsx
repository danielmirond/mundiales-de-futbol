import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { Countdown } from '@/components/home/countdown';
import { getTournament } from '@/lib/tournaments';
import { routing, type Locale } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export default async function NorthAmerica2026Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = getTournament(2026)!;

  return (
    <div>
      <section className="relative flex min-h-[80svh] flex-col justify-end overflow-hidden pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-50"
            style={{
              background: `radial-gradient(60% 50% at 50% 0%, ${t.palette.from}55 0%, transparent 60%), radial-gradient(40% 60% at 90% 10%, ${t.palette.to}55 0%, transparent 60%)`,
            }}
          />
          <div className="absolute inset-0 grid-overlay opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--color-bg)]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 md:px-10">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            23ᵃ edición · 11 junio — 19 julio 2026
          </div>
          <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.88]">
            <span className="block text-[var(--color-fg)]">Norteamérica</span>
            <span
              className="block bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(90deg, ${t.palette.from}, ${t.palette.to})` }}
            >
              2026
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-[var(--color-fg-muted)] md:text-2xl">
            48 selecciones. 104 partidos. 3 países. El primer Mundial del nuevo formato.
          </p>
        </div>
      </section>

      <Countdown />

      <section className="mx-auto w-full max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
        <div className="grid gap-px bg-[var(--color-border)] md:grid-cols-3">
          {[
            { country: 'México 🇲🇽', cities: 3, matches: 13, note: 'Azteca, Akron, BBVA' },
            { country: 'Estados Unidos 🇺🇸', cities: 11, matches: 78, note: 'MetLife, SoFi, AT&T…' },
            { country: 'Canadá 🇨🇦', cities: 2, matches: 13, note: 'BMO Field, BC Place' },
          ].map((h) => (
            <div key={h.country} className="bg-[var(--color-bg)] p-8 md:p-10">
              <div className="font-display text-4xl uppercase leading-none">{h.country}</div>
              <div className="mt-6 grid grid-cols-2 gap-6">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-subtle)]">
                    Ciudades
                  </div>
                  <div className="mt-1 font-display text-3xl tab-num">{h.cities}</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-fg-subtle)]">
                    Partidos
                  </div>
                  <div className="mt-1 font-display text-3xl tab-num">{h.matches}</div>
                </div>
              </div>
              <div className="mt-6 text-sm text-[var(--color-fg-muted)]">{h.note}</div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Link
            href={withLocale(locale as Locale, '/ediciones/2026-norteamerica')}
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-6 py-3 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
          >
            Ficha completa de 2026
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
          </Link>
        </div>
      </section>
    </div>
  );
}

import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { routing, type Locale } from '@/i18n/routing';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

type Table = { name: string; purpose: string; lifetime: string; owner: string };

type Content = {
  title: string;
  updated: string;
  intro: string[];
  h_necessary: string;
  h_analytics: string;
  h_marketing: string;
  necessary: Table[];
  analytics: Table[];
  marketing: string;
  h_withdraw: string;
  withdraw: string[];
  backToSite: string;
};

const CONTENT: Record<string, Content> = {
  es: {
    title: 'Política de Cookies',
    updated: 'Última actualización · abril 2026',
    intro: [
      'Una cookie es un pequeño archivo que el sitio web envía a tu navegador y que éste guarda. Las cookies son una tecnología estándar para recordar tus preferencias entre visitas.',
      'En mundiales-de-futbol.com hemos reducido el uso de cookies al mínimo imprescindible. A continuación detallamos cada una, su finalidad y su duración, y cómo retirar tu consentimiento en cualquier momento.',
    ],
    h_necessary: 'Cookies necesarias',
    h_analytics: 'Cookies analíticas (opcionales)',
    h_marketing: 'Cookies de marketing',
    necessary: [
      {
        name: 'mdf_consent',
        purpose: 'Guarda tu elección en el aviso de cookies.',
        lifetime: '12 meses',
        owner: 'Propia',
      },
      {
        name: 'NEXT_LOCALE',
        purpose: 'Recuerda el idioma preferido si cambias desde el selector.',
        lifetime: 'Sesión',
        owner: 'Propia (next-intl)',
      },
    ],
    analytics: [
      {
        name: '(pendiente)',
        purpose: 'No hay analítica activa hoy. Si la añadimos (p.ej. Plausible o Vercel Analytics) actualizaremos este listado y volveremos a pedir tu consentimiento.',
        lifetime: '—',
        owner: '—',
      },
    ],
    marketing: 'No utilizamos cookies de marketing ni publicidad. No compartimos datos con anunciantes.',
    h_withdraw: 'Cómo retirar el consentimiento',
    withdraw: [
      'Puedes cambiar tu elección desde el enlace "Cookies" del pie de página en cualquier momento, o borrando las cookies desde la configuración de tu navegador.',
      'Si bloqueas las cookies necesarias, parte del sitio puede no funcionar correctamente.',
    ],
    backToSite: 'Volver al sitio',
  },
  en: {
    title: 'Cookies Policy',
    updated: 'Last updated · April 2026',
    intro: [
      'A cookie is a small file that a website sends to your browser and your browser stores. Cookies are a standard technology to remember your preferences across visits.',
      'At mundiales-de-futbol.com we keep cookie use to the bare minimum. Below you\'ll find each cookie, its purpose, its lifetime, and how to withdraw consent at any time.',
    ],
    h_necessary: 'Strictly necessary cookies',
    h_analytics: 'Analytics cookies (optional)',
    h_marketing: 'Marketing cookies',
    necessary: [
      {
        name: 'mdf_consent',
        purpose: 'Stores your choice in the cookie banner.',
        lifetime: '12 months',
        owner: 'First-party',
      },
      {
        name: 'NEXT_LOCALE',
        purpose: 'Remembers the preferred language if you change it.',
        lifetime: 'Session',
        owner: 'First-party (next-intl)',
      },
    ],
    analytics: [
      {
        name: '(pending)',
        purpose: 'No analytics are active today. If we add any (e.g. Plausible or Vercel Analytics) we will update this list and re-request your consent.',
        lifetime: '—',
        owner: '—',
      },
    ],
    marketing: 'We do not use marketing or advertising cookies. We do not share data with advertisers.',
    h_withdraw: 'How to withdraw consent',
    withdraw: [
      'You may change your choice at any time via the "Cookies" link in the footer, or by deleting cookies in your browser settings.',
      'If you block strictly-necessary cookies, parts of the site may stop working correctly.',
    ],
    backToSite: 'Back to the site',
  },
};

function getContent(locale: string): Content {
  return CONTENT[locale] ?? CONTENT.es;
}

export default async function CookiesPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = getContent(locale);

  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-32 md:px-10 md:py-40">
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
        {c.updated}
      </div>
      <h1 className="mt-4 font-display text-fluid-h1 uppercase leading-[0.95]">{c.title}</h1>

      <div className="mt-12 space-y-6 text-base leading-relaxed text-[var(--color-fg-muted)]">
        {c.intro.map((p, i) => <p key={i}>{p}</p>)}
      </div>

      <section className="mt-16">
        <h2 className="font-display text-2xl uppercase text-[var(--color-fg)]">{c.h_necessary}</h2>
        <CookieTable rows={c.necessary} />
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl uppercase text-[var(--color-fg)]">{c.h_analytics}</h2>
        <CookieTable rows={c.analytics} />
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl uppercase text-[var(--color-fg)]">{c.h_marketing}</h2>
        <p className="mt-4 text-base leading-relaxed text-[var(--color-fg-muted)]">{c.marketing}</p>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl uppercase text-[var(--color-fg)]">{c.h_withdraw}</h2>
        <div className="mt-4 space-y-4 text-base leading-relaxed text-[var(--color-fg-muted)]">
          {c.withdraw.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </section>

      <div className="mt-16 flex items-center gap-4">
        <Link
          href={withLocale(locale as Locale, '/')}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-3 text-sm text-[var(--color-fg)] transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
        >
          ← {c.backToSite}
        </Link>
        <Link
          href={withLocale(locale as Locale, '/privacidad')}
          className="text-sm text-[var(--color-fg-muted)] underline hover:text-[var(--color-fg)]"
        >
          Privacy
        </Link>
      </div>
    </article>
  );
}

function CookieTable({ rows }: { rows: Table[] }) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--color-border)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[var(--color-bg-2)] text-left">
            <th className="p-4 font-mono text-xs uppercase tracking-widest text-[var(--color-fg-subtle)]">Cookie</th>
            <th className="p-4 font-mono text-xs uppercase tracking-widest text-[var(--color-fg-subtle)]">Purpose</th>
            <th className="p-4 font-mono text-xs uppercase tracking-widest text-[var(--color-fg-subtle)]">Lifetime</th>
            <th className="p-4 font-mono text-xs uppercase tracking-widest text-[var(--color-fg-subtle)]">Owner</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-t border-[var(--color-border)] align-top">
              <td className="p-4 font-mono text-[var(--color-fg)]">{r.name}</td>
              <td className="p-4 text-[var(--color-fg-muted)]">{r.purpose}</td>
              <td className="p-4 text-[var(--color-fg-muted)]">{r.lifetime}</td>
              <td className="p-4 text-[var(--color-fg-muted)]">{r.owner}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

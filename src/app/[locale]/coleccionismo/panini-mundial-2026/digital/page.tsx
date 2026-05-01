import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, ArrowRight, Smartphone, Code } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl, SEO } from '@/lib/seo';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/coleccionismo/panini-mundial-2026/digital',
    title: 'Álbum Panini Mundial 2026 digital: app, códigos virtuales y cómo funciona',
    description:
      'Cómo funciona el álbum Panini Mundial 2026 digital: app oficial FIFA Panini Digital Album, códigos virtuales gratis incluidos en sobres físicos, intercambios online, Dream Team y contenido exclusivo. Guía actualizada.',
    keywords: [
      'álbum panini mundial 2026 digital',
      'app panini mundial 2026',
      'códigos cromos virtuales mundial 2026',
      'panini digital album fifa',
      'álbum virtual mundial 2026',
      'codigos sobres gratis panini 2026',
    ],
    type: 'article',
  });
}

const FEATURES = [
  { title: 'Coleccionar gratis', detail: 'Versión digital totalmente gratuita. Cromos virtuales con la misma estructura que el álbum físico (980 piezas en 112 páginas).' },
  { title: 'Códigos físico-digital', detail: 'Cada sobre de cromos físicos incluye un código de un solo uso que desbloquea cromos digitales adicionales en la app.' },
  { title: 'Intercambios globales', detail: 'Trade con coleccionistas de todo el mundo desde la propia app. Sistema de matchmaking que sugiere intercambios basados en tu colección.' },
  { title: 'Dream Team', detail: 'Una vez completas el álbum digital, puedes montar tu equipo ideal con los 26 mejores cromos. Comparable con otros usuarios.' },
  { title: 'Cromos exclusivos digitales', detail: 'La app contiene cromos que NO están en el álbum físico (versiones animadas, foil digital, "moments" tras goles del torneo).' },
  { title: 'Sin compras dentro de la app', detail: 'A diferencia del álbum físico, no hay micropagos. Todo el contenido se desbloquea con el uso o con códigos promocionales públicos.' },
];

const FAQ = [
  {
    q: '¿La app Panini Mundial 2026 es gratis?',
    a: 'Sí. La aplicación oficial FIFA Panini Digital Album es gratuita y está disponible en iOS y Android desde el 30 de abril de 2026. No hay compras dentro de la app: todos los cromos se obtienen jugando, intercambiando o canjeando códigos promocionales.',
  },
  {
    q: '¿Cómo conseguir códigos gratis para cromos digitales?',
    a: 'Los sobres físicos incluyen códigos en su interior. Adicionalmente, medios como Sporting News, TyC Sports, La Nación y Olé publican packs de códigos comunitarios cada semana durante mayo y junio. La FIFA y Panini comparten códigos en redes sociales en eventos especiales.',
  },
  {
    q: '¿Puedo intercambiar cromos físicos por digitales?',
    a: 'No directamente. Lo que sí puedes hacer es canjear el código que viene en el sobre físico para conseguir cromos digitales asociados a esos jugadores. Las plataformas de intercambio externas como Catawiki y eBay permiten conseguir códigos sueltos.',
  },
  {
    q: '¿Qué tiene la app que no tenga el álbum físico?',
    a: 'Cromos exclusivos digitales (versiones animadas, foil digital), Dream Team interactivo, intercambios globales en tiempo real, "moments" o cromos especiales que se desbloquean cuando un jugador marca durante el Mundial real.',
  },
  {
    q: '¿La app funciona offline?',
    a: 'Parcialmente. Puedes ver tu colección y administrar cromos sin conexión, pero los intercambios, los códigos promocionales y los moments del torneo requieren internet.',
  },
];

export default async function DigitalPanini({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Álbum Panini Mundial 2026 digital: app, códigos y cómo funciona',
    description: 'La app oficial FIFA Panini Digital Album es gratuita, permite intercambios globales y se sincroniza con los sobres físicos vía códigos.',
    publisher: { '@type': 'Organization', name: SEO.siteName, url: SEO.siteUrl },
    datePublished: '2026-05-02',
    dateModified: '2026-05-02',
    mainEntityOfPage: localeUrl(locale, '/coleccionismo/panini-mundial-2026/digital'),
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };

  return (
    <article className="pt-32">
      <JsonLd data={[articleLd, faqLd, breadcrumbLd(locale, [
        { name: 'Inicio', path: '/' },
        { name: 'Panini Mundial 2026', path: '/coleccionismo/panini-mundial-2026' },
        { name: 'Álbum digital', path: '/coleccionismo/panini-mundial-2026/digital' },
      ])]} />

      <header className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <Link href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026')} className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Panini Mundial 2026
        </Link>
        <div className="mt-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Smartphone className="h-4 w-4" /><span>FIFA Panini Digital Album</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">El álbum<br />digital</h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          La app oficial gratuita que extiende el álbum físico con cromos digitales, códigos canjeables, Dream Team y intercambios globales. Disponible en iOS y Android desde el 30 de abril de 2026.
        </p>
      </header>

      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <ul className="grid gap-4 md:grid-cols-2">
          {FEATURES.map((f) => (
            <li key={f.title} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
              <h3 className="font-display text-lg uppercase text-[var(--color-fg)]">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">{f.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto mt-20 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-pitch)]/30 bg-[var(--color-pitch)]/5 p-7 md:p-10">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            <Code className="h-4 w-4" /><span>Códigos comunitarios</span>
          </div>
          <h2 className="mt-3 font-display text-2xl uppercase md:text-3xl">Dónde encontrar códigos gratis</h2>
          <p className="mt-4 text-sm leading-relaxed text-[var(--color-fg-muted)] md:text-base">
            Aparte de los códigos que vienen en cada sobre físico, hay packs de códigos promocionales públicos que se publican periódicamente:
          </p>
          <ul className="mt-4 grid gap-2 md:grid-cols-2 text-sm text-[var(--color-fg-muted)]">
            <li>· Sporting News (web internacional)</li>
            <li>· TyC Sports (Argentina)</li>
            <li>· La Nación (Argentina)</li>
            <li>· Olé (Argentina)</li>
            <li>· FIFA en redes sociales</li>
            <li>· Panini Twitter/X global</li>
            <li>· Subreddit r/PaniniWC2026</li>
            <li>· Grupo Telegram «Panini Mundial 2026 ES»</li>
          </ul>
        </div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-[1100px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">Preguntas frecuentes</div>
        <h2 className="mt-3 font-display text-3xl uppercase md:text-4xl">Lo que más se pregunta</h2>
        <div className="mt-10 divide-y divide-[var(--color-border)] border-t border-b border-[var(--color-border)]">
          {FAQ.map(({ q, a }) => (
            <details key={q} className="group py-5">
              <summary className="flex cursor-pointer items-start justify-between gap-6 text-base md:text-lg">
                <span className="font-medium text-[var(--color-fg)]">{q}</span>
                <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center font-mono text-sm text-[var(--color-fg-subtle)] transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-[var(--color-fg-muted)]">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 mb-24 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-10">
          <h2 className="font-display text-2xl uppercase">Más del Panini 2026</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026')} className="rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black">Pillar Panini Mundial 2026</Link>
            <Link href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/coca-cola')} className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm">Promo Coca-Cola</Link>
          </div>
        </div>
      </section>
    </article>
  );
}

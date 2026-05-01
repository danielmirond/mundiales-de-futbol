import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, GlassWater } from 'lucide-react';
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
    path: '/coleccionismo/panini-mundial-2026/coca-cola',
    title:
      'Promo Coca-Cola Panini Mundial 2026: 12 cromos exclusivos en botellas',
    description:
      'Cómo conseguir los 12 cromos exclusivos Panini × Coca-Cola Mundial 2026 escondidos dentro de etiquetas de botella desde mediados de mayo. Países donde aplica, formato y consejos para completar la doble página.',
    keywords: [
      'álbum panini mundial 2026 coca cola',
      'promoción coca cola panini 2026',
      'cromos exclusivos coca cola mundial',
      'doble página coca cola panini',
    ],
    type: 'article',
  });
}

const FAQ = [
  { q: '¿En qué consiste la promoción Coca-Cola Panini Mundial 2026?', a: 'Coca-Cola es partner oficial del Mundial 2026 y ha incluido 12 cromos exclusivos en una doble página del álbum Panini que SOLO se pueden conseguir comprando botellas seleccionadas de Coca-Cola desde mediados de mayo de 2026. Los cromos van impresos dentro de la etiqueta o como inserción en el packaging.' },
  { q: '¿Cuándo arranca la promoción?', a: 'A partir de mediados de mayo de 2026, en países seleccionados. Es la primera vez que Panini y Coca-Cola hacen este formato cross-channel para un Mundial.' },
  { q: '¿En qué países aplica?', a: 'Confirmado en España, México, Estados Unidos, Argentina, Colombia, Brasil, Reino Unido, Alemania, Francia y otros mercados clave. La rotación específica del producto promocional dura 6-8 semanas según país.' },
  { q: '¿Hay forma de conseguir los 12 cromos sin comprar botellas?', a: 'Es muy difícil. Algunos coleccionistas consiguen los 12 cromos en bloque a través de Mercado Libre, Wallapop o Cardmarket, donde se venden los packs completos por entre 25 y 60 € (mucho más barato que comprar 12+ botellas). Cataract de la doble página: si no llenas estos 12 cromos, queda página vacía.' },
  { q: '¿Qué formato Coca-Cola incluye los cromos?', a: 'Botellas de 500 ml a 1,5 L con etiqueta promocional Mundial 2026. Las latas y formatos pequeños no llevan cromos. La etiqueta lleva un código QR que también activa contenido digital en la app.' },
  { q: '¿Qué jugadores aparecen en la promoción Coca-Cola?', a: 'La doble página son 12 cromos especiales con jugadores y momentos del Mundial 2026 que NO están en el álbum estándar. Panini todavía no ha hecho público el listado completo.' },
];

export default async function CocaColaPromo({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const faqLd = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: FAQ.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };
  const articleLd = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: '12 cromos exclusivos Coca-Cola del álbum Panini Mundial 2026',
    publisher: { '@type': 'Organization', name: SEO.siteName, url: SEO.siteUrl },
    datePublished: '2026-05-02',
    mainEntityOfPage: localeUrl(locale, '/coleccionismo/panini-mundial-2026/coca-cola'),
  };

  return (
    <article className="pt-32">
      <JsonLd data={[articleLd, faqLd, breadcrumbLd(locale, [
        { name: 'Inicio', path: '/' },
        { name: 'Panini Mundial 2026', path: '/coleccionismo/panini-mundial-2026' },
        { name: 'Promo Coca-Cola', path: '/coleccionismo/panini-mundial-2026/coca-cola' },
      ])]} />

      <header className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <Link href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026')} className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Panini Mundial 2026
        </Link>
        <div className="mt-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <GlassWater className="h-4 w-4" /><span>Promo cross-brand</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">Panini ×<br />Coca-Cola</h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          Coca-Cola, partner oficial FIFA, ha incluido <strong className="text-[var(--color-fg)]">12 cromos exclusivos</strong> dentro de etiquetas de botellas seleccionadas desde mediados de mayo de 2026. La única forma de completar esta doble página del álbum Panini sin pasar por mercado secundario.
        </p>
      </header>

      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: 'Cromos exclusivos', value: '12' },
            { label: 'Inicio promoción', value: 'Mayo 2026' },
            { label: 'Países', value: '20+' },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:p-8">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">{s.label}</span>
              <span className="mt-3 block font-display text-4xl text-[var(--color-fg)] md:text-5xl">{s.value}</span>
            </div>
          ))}
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
                <span className="mt-1 inline-flex h-5 w-5 items-center justify-center font-mono text-sm text-[var(--color-fg-subtle)] transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 max-w-[68ch] text-base leading-relaxed text-[var(--color-fg-muted)]">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 mb-24 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-10">
          <h2 className="font-display text-2xl uppercase">Sigue explorando</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/cromos-mas-caros')} className="rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black">Cromos más caros</Link>
            <Link href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026/digital')} className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm">App digital</Link>
          </div>
        </div>
      </section>
    </article>
  );
}

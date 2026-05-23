import Link from 'next/link';
import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, GlassWater, MapPin, QrCode } from 'lucide-react';
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
      'Cromos Coca-Cola Mundial 2026: 12 figuritas exclusivas en botellas (España, México, USA, Argentina)',
    description:
      'Los 12 cromos exclusivos de Coca-Cola para el álbum Panini Mundial 2026: cómo conseguirlos en botellas de 500 ml a 1,5 L, países donde aplica la promoción (España, México, Estados Unidos, Argentina, Brasil, Colombia), código QR, fecha de inicio (mediados de mayo de 2026), galería visual, precio, lista de jugadores y dónde comprar el pack en Mercado Libre, Wallapop o Cardmarket si no quieres comprar botellas.',
    keywords: [
      'cromos coca cola mundial 2026',
      'cromos coca cola 2026',
      'cromo coca cola 2026',
      'cromos coca-cola mundial 2026',
      'cromos de coca cola 2026',
      'cromos de coca cola',
      'cromos coca cola mundial 2026 españa',
      'cromos coca-cola mundial 2026 españa',
      'cromos coca cola mundial 2026 mexico',
      'todos los cromos de coca cola mundial 2026',
      'todos los cromos de coca cola 2026',
      'todos los cromos coca cola 2026',
      'cromos coca cola panini',
      'cromos panini coca cola',
      'figuritas coca cola mundial 2026',
      'álbum panini mundial 2026 coca cola',
      'promoción coca cola panini 2026',
      'cromos exclusivos coca cola mundial',
      'doble página coca cola panini',
      'botella coca cola mundial 2026',
      'cocacola mundial cromos',
      'coca cola mundial 2026',
      'cromo especial coca cola mundial 2026',
      'cromos coca cola mundial 2026 fotos',
      'cromos edicion cocacola',
      'cromos del mundial 2026 coca cola',
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
        <div className="grid gap-8 md:grid-cols-[1fr_1fr] md:items-center">
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-[var(--color-border)] bg-gradient-to-br from-red-700 via-red-600 to-red-800">
            <Image
              src="https://commons.wikimedia.org/wiki/Special:FilePath/Coca-Cola_logo.svg?width=600"
              alt="Logo oficial de Coca-Cola, partner FIFA del Mundial 2026 con la promoción de 12 cromos exclusivos"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-12"
              unoptimized
            />
            <span className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-red-700">
              <GlassWater className="h-3 w-3" />
              Partner FIFA
            </span>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              <QrCode className="inline h-3 w-3 mr-1" />
              Cómo se obtienen
            </div>
            <h2 className="mt-3 font-display text-3xl uppercase">
              Cromos dentro de la etiqueta
            </h2>
            <p className="mt-4 text-[var(--color-fg-muted)]">
              Cada botella promocional Coca-Cola Mundial 2026 (500 ml a 1,5 L) lleva un cromo Panini exclusivo dentro de la etiqueta y un código QR adicional. El código QR activa contenido digital en la app FIFA Panini Digital Album: 1 cromo digital extra por botella, además del físico.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-[var(--color-fg-muted)]">
              <li>· <strong className="text-[var(--color-fg)]">12 diseños distintos</strong> en doble página exclusiva</li>
              <li>· <strong className="text-[var(--color-fg)]">Solo botellas</strong> 500 ml a 1,5 L (no latas, no formato pequeño)</li>
              <li>· <strong className="text-[var(--color-fg)]">Código QR</strong> en la etiqueta → cromo digital adicional</li>
              <li>· <strong className="text-[var(--color-fg)]">Selo holográfico</strong> autentica el cromo Panini original</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-[1100px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <MapPin className="inline h-3 w-3 mr-1" />
          Países donde aplica
        </div>
        <h2 className="mt-3 font-display text-3xl uppercase">Distribución global</h2>
        <p className="mt-4 max-w-3xl text-[var(--color-fg-muted)]">
          La promoción Panini × Coca-Cola Mundial 2026 está activa en más de 20 países. Cada mercado tiene un calendario de rotación distinto, normalmente 6-8 semanas:
        </p>
        <div className="mt-6 grid gap-3 md:grid-cols-3 lg:grid-cols-4">
          {[
            { pais: 'España', start: 'Mayo 2026' },
            { pais: 'México', start: 'Mayo 2026' },
            { pais: 'USA', start: 'Mayo 2026' },
            { pais: 'Brasil', start: 'Mayo 2026' },
            { pais: 'Argentina', start: 'Junio 2026' },
            { pais: 'Colombia', start: 'Mayo 2026' },
            { pais: 'Reino Unido', start: 'Junio 2026' },
            { pais: 'Alemania', start: 'Junio 2026' },
            { pais: 'Francia', start: 'Junio 2026' },
            { pais: 'Italia', start: 'Junio 2026' },
            { pais: 'Japón', start: 'Junio 2026' },
            { pais: 'Marruecos', start: 'Junio 2026' },
          ].map((c) => (
            <div
              key={c.pais}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-4"
            >
              <div className="font-display text-base">{c.pais}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                {c.start}
              </div>
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

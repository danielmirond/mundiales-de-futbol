import Link from 'next/link';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, Users, Globe2, Wallet, ExternalLink } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, SEO, localeUrl } from '@/lib/seo';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/sobre-nosotros',
    title: 'Sobre nosotros · Mundial de Fútbol',
    description:
      'Quién hay detrás de mundiales-de-futbol.com, qué cubrimos, cómo nos financiamos. Sitio independiente dedicado a las 23 ediciones del Mundial, desde Uruguay 1930 hasta Norteamérica 2026.',
  });
}

export default async function SobreNosotros({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const url = localeUrl(locale, '/sobre-nosotros');
  const aboutLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Sobre nosotros · Mundial de Fútbol',
    url,
    inLanguage: locale,
    isPartOf: { '@type': 'WebSite', name: SEO.siteName, url: SEO.siteUrl },
    mainEntity: {
      '@type': 'NewsMediaOrganization',
      name: 'Redacción Mundial de Fútbol',
      legalName: SEO.siteName,
      url: SEO.siteUrl,
      knowsAbout: [
        'Mundiales de fútbol',
        'Hemeroteca deportiva',
        'Selecciones nacionales',
        'Estadísticas FIFA',
        'Historia del fútbol',
      ],
      ethicsPolicy: `${SEO.siteUrl}/politica-editorial`,
      correctionsPolicy: `${SEO.siteUrl}/politica-correcciones`,
      ownershipFundingInfo: `${SEO.siteUrl}/sobre-nosotros`,
      publishingPrinciples: `${SEO.siteUrl}/politica-editorial`,
    },
  };

  return (
    <article className="pt-32">
      <JsonLd
        data={[
          aboutLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Sobre nosotros', path: '/sobre-nosotros' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[800px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Inicio
        </Link>

        <div className="mt-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Users className="h-4 w-4" />
          <span>Quiénes somos</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-h1 uppercase leading-[0.95]">
          Sobre nosotros
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          Mundial de Fútbol es un sitio independiente dedicado a las 23 ediciones de la Copa del Mundo, desde Uruguay 1930 hasta Norteamérica 2026. Cubrimos historia, hemeroteca, datos verificables, calendario, sedes, equipaciones y coleccionismo.
        </p>
      </header>

      <section className="mx-auto mt-16 w-full max-w-[800px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Qué cubrimos
        </div>
        <h2 className="mt-3 font-display text-2xl uppercase md:text-3xl">
          Hemeroteca, datos y actualidad
        </h2>
        <div className="mt-6 space-y-5 text-base leading-relaxed text-[var(--color-fg-muted)]">
          <p>
            Tres líneas editoriales conviven en el sitio. La <strong className="text-[var(--color-fg)]">hemeroteca</strong> reconstruye historias verificadas en fuentes primarias de cada Mundial: el Conte Verde de 1930, Pak Doo-ik en Middlesbrough, el Disastro de Gijón, el Maracanazo… Cada pieza pasa por verificación cruzada en al menos dos fuentes públicas y documenta su nivel de certeza.
          </p>
          <p>
            La <strong className="text-[var(--color-fg)]">actualidad</strong> sigue el día a día del Mundial 2026: convocatorias, sedes, entradas, polémicas FIFA, mascotas, ceremonia, derechos de TV y patrocinios. Publicamos varias noticias por semana firmadas por la redacción del medio con atribución pública de la fuente original y fuentes secundarias para verificación.
          </p>
          <p>
            Los <strong className="text-[var(--color-fg)]">datos</strong> son la columna estructural: 23 ediciones del Mundial, todos los partidos, plantillas, máximos goleadores, sedes, grupos del torneo. La base de datos es propia (Supabase) y se nutre de fuentes públicas (FIFA, Wikipedia, hemerotecas oficiales abiertas). Cada cifra se cruza antes de publicarse.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 w-full max-w-[800px] px-6 md:px-10">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Globe2 className="h-4 w-4" />
          <span>Multidioma</span>
        </div>
        <h2 className="mt-3 font-display text-2xl uppercase md:text-3xl">
          Cinco idiomas, cinco mercados
        </h2>
        <div className="mt-6 space-y-5 text-base leading-relaxed text-[var(--color-fg-muted)]">
          <p>
            El sitio publica en <strong className="text-[var(--color-fg)]">español, inglés, portugués, francés y árabe</strong>. La versión española es la canónica; las demás se adaptan al mercado correspondiente. El portugués va dirigido a Brasil, el inglés a USA y Reino Unido, el francés a Francia y francófonos, el árabe al Magreb y al Golfo. La página /2026/donde-ver, por ejemplo, no es una traducción literal: cada locale habla de las cadenas y plataformas reales de su mercado.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 w-full max-w-[800px] px-6 md:px-10">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Wallet className="h-4 w-4" />
          <span>Financiación</span>
        </div>
        <h2 className="mt-3 font-display text-2xl uppercase md:text-3xl">
          Cómo se mantiene el proyecto
        </h2>
        <div className="mt-6 space-y-5 text-base leading-relaxed text-[var(--color-fg-muted)]">
          <p>
            Mundial de Fútbol es un proyecto editorial independiente sin patrocinadores institucionales ni vínculos con federaciones, FIFA, marcas de equipación ni medios deportivos. La <strong className="text-[var(--color-fg)]">única vía de monetización activa</strong> es el programa de afiliación de Amazon Associates España (tag <code>nuus-21</code>), que aplica una comisión sobre las compras realizadas tras hacer clic en los enlaces marcados como afiliados.
          </p>
          <p>
            Los enlaces afiliados están etiquetados en el HTML con <code>rel=&quot;sponsored noopener noreferrer&quot;</code> y declarados en la página <Link href={withLocale(locale as Locale, '/aviso-afiliados')} className="underline underline-offset-4 hover:text-[var(--color-pitch)]">aviso de afiliados</Link>. La afiliación <strong className="text-[var(--color-fg)]">no condiciona la cobertura editorial</strong>: una marca con la que tenemos enlace puede aparecer criticada si los hechos lo justifican, y mencionamos competidores cuando aportan información relevante (por ejemplo, comparativas adidas vs Nike).
          </p>
          <p>
            En el futuro previsiblemente se sumarán otras redes de afiliación (Awin para LEGO, adidas y Decathlon; CJ para Nike US; Booking Partner para hospedaje). Cuando se activen aparecerán declaradas en esta sección y en /aviso-afiliados.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 w-full max-w-[800px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Independencia editorial
        </div>
        <h2 className="mt-3 font-display text-2xl uppercase md:text-3xl">
          Lo que no hacemos
        </h2>
        <div className="mt-6 space-y-5 text-base leading-relaxed text-[var(--color-fg-muted)]">
          <p>
            Para ser explícitos: <strong className="text-[var(--color-fg)]">no aceptamos publirreportajes pagados disfrazados de noticia</strong>. No publicamos contenido patrocinado por marcas, federaciones o ligas. No recibimos viajes, entradas ni regalos a cambio de cobertura favorable. No tenemos vínculos contractuales con ninguna selección, jugador, agente, federación o casa de apuestas. No hacemos predicciones para apuestas y los precios y cuotas que publicamos son siempre con fuente externa atribuida.
          </p>
          <p>
            Si alguna vez se rompe alguna de estas reglas (por ejemplo, una colaboración patrocinada concreta), aparecerá declarada en la propia pieza con disclosure visible y, además, listada en esta sección.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 w-full max-w-[800px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Más sobre nosotros
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={withLocale(locale as Locale, '/politica-editorial')}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
          >
            Política editorial
            <ExternalLink className="h-3 w-3" />
          </Link>
          <Link
            href={withLocale(locale as Locale, '/politica-correcciones')}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
          >
            Política de correcciones
            <ExternalLink className="h-3 w-3" />
          </Link>
          <Link
            href={withLocale(locale as Locale, '/aviso-afiliados')}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
          >
            Aviso de afiliados
            <ExternalLink className="h-3 w-3" />
          </Link>
          <Link
            href={withLocale(locale as Locale, '/contacto')}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          >
            Contacto
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </section>

      <div className="h-32" />
    </article>
  );
}

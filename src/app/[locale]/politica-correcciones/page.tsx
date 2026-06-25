import Link from 'next/link';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, AlertCircle, Mail, Clock, ExternalLink } from 'lucide-react';
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
    path: '/politica-correcciones',
    title: 'Política de correcciones · Mundial de Fútbol',
    description:
      'Cómo reportar un error, plazo de respuesta y criterios de actualización. Mundiales de Fútbol corrige y deja constancia con dateModified de cualquier cambio relevante.',
  });
}

export default async function PoliticaCorrecciones({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const url = localeUrl(locale, '/politica-correcciones');
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Política de correcciones · Mundial de Fútbol',
    url,
    inLanguage: locale,
    isPartOf: { '@type': 'WebSite', name: SEO.siteName, url: SEO.siteUrl },
  };

  return (
    <article className="pt-32">
      <JsonLd
        data={[
          articleLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Política de correcciones', path: '/politica-correcciones' },
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
          <AlertCircle className="h-4 w-4" />
          <span>Errata y actualizaciones</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-h1 uppercase leading-[0.95]">
          Política de correcciones
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          Si encuentras un dato incorrecto, una atribución mal hecha o una imprecisión en cualquier pieza de Mundial de Fútbol, queremos saberlo. Esta página explica cómo reportarlo, qué hacemos con tu aviso y cómo dejamos constancia pública del cambio.
        </p>
      </header>

      <section className="mx-auto mt-16 w-full max-w-[800px] px-6 md:px-10">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Mail className="h-4 w-4" />
          <span>Cómo reportar</span>
        </div>
        <h2 className="mt-3 font-display text-2xl uppercase md:text-3xl">
          Cómo decirnos que algo está mal
        </h2>
        <div className="mt-6 space-y-5 text-base leading-relaxed text-[var(--color-fg-muted)]">
          <p>
            La vía principal es el formulario de la página <Link href={withLocale(locale as Locale, '/contacto')} className="underline underline-offset-4 hover:text-[var(--color-pitch)]">contacto</Link>. Selecciona el motivo «Corrección» e incluye la URL exacta de la pieza, el dato concreto que crees incorrecto y, si lo tienes, una fuente pública que respalde tu corrección. Si reportas en redes sociales, te pediremos que abras el ticket por la web para tener trazabilidad.
          </p>
          <p>
            Aceptamos correcciones tanto factuales (un dato numérico, una fecha, una atribución) como editoriales (un sesgo claro, una omisión relevante, un titular engañoso). Cada caso se evalúa por separado.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 w-full max-w-[800px] px-6 md:px-10">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Clock className="h-4 w-4" />
          <span>Plazos</span>
        </div>
        <h2 className="mt-3 font-display text-2xl uppercase md:text-3xl">
          Cuándo te respondemos
        </h2>
        <div className="mt-6 space-y-5 text-base leading-relaxed text-[var(--color-fg-muted)]">
          <p>
            Tres niveles de prioridad. Las correcciones <strong className="text-[var(--color-fg)]">graves</strong> —error factual con potencial de daño, atribución incorrecta a una persona viva, fecha que invalida una efeméride— se atienden en menos de 24 horas y tienen prioridad sobre cualquier otra cola editorial. Las <strong className="text-[var(--color-fg)]">menores</strong> —ortografía, datos secundarios, mejora de cita— se procesan en la siguiente revisión semanal. Las <strong className="text-[var(--color-fg)]">discutibles</strong> —diferencias de interpretación o cuestiones de matiz— se evalúan en bloque y respondemos al reportante explicando la decisión final.
          </p>
          <p>
            En todos los casos te respondemos al email del formulario de contacto. Si la corrección procede, te indicamos qué se ha cambiado y dónde figura el dato actualizado.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 w-full max-w-[800px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Trazabilidad
        </div>
        <h2 className="mt-3 font-display text-2xl uppercase md:text-3xl">
          Qué pasa cuando corregimos
        </h2>
        <div className="mt-6 space-y-5 text-base leading-relaxed text-[var(--color-fg-muted)]">
          <p>
            Cuando aplicamos una corrección sustantiva, actualizamos el campo <code>modifiedAt</code> de la pieza con la fecha del cambio. El JSON-LD <code>NewsArticle.dateModified</code> refleja la edición y Google detecta la actualización para frescura. Si el cambio afecta al titular, al resumen o a un dato relevante para la interpretación, lo indicamos al final del cuerpo con una nota tipo «<em>Actualizado el [fecha]: corregido X tras aviso de un lector</em>».
          </p>
          <p>
            Las correcciones tipográficas o de estilo no requieren nota visible, pero sí actualizan <code>modifiedAt</code> internamente. Las eliminaciones completas de una pieza son extremadamente raras y se justifican públicamente cuando ocurren (típicamente, cuando una pieza es retirada por una desmentida formal).
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 w-full max-w-[800px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Otras políticas
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
            href={withLocale(locale as Locale, '/sobre-nosotros')}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
          >
            Sobre nosotros
            <ExternalLink className="h-3 w-3" />
          </Link>
          <Link
            href={withLocale(locale as Locale, '/contacto')}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          >
            Reportar una corrección
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </section>

      <div className="h-32" />
    </article>
  );
}

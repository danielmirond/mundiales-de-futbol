import Link from 'next/link';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, BookOpen, ShieldCheck, FileSearch, Languages, ExternalLink } from 'lucide-react';
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
    path: '/politica-editorial',
    title: 'Política editorial · Mundial de Fútbol',
    description:
      'Cómo verificamos, citamos y publicamos en mundiales-de-futbol.com. Proceso editorial, criterios de selección, atribución de fuentes y política de transparencia.',
  });
}

export default async function PoliticaEditorial({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const url = localeUrl(locale, '/politica-editorial');
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Política editorial · Mundial de Fútbol',
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
            { name: 'Política editorial', path: '/politica-editorial' },
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
          <BookOpen className="h-4 w-4" />
          <span>Transparencia editorial</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-h1 uppercase leading-[0.95]">
          Política editorial
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          Mundial de Fútbol publica historia, datos y actualidad de las Copas del Mundo desde 1930 hasta 2026. Esta página describe cómo seleccionamos, verificamos y publicamos cada pieza, qué fuentes usamos y dónde declaramos los conflictos de interés.
        </p>
      </header>

      <section className="mx-auto mt-16 w-full max-w-[800px] px-6 md:px-10">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <ShieldCheck className="h-4 w-4" />
          <span>Verificación</span>
        </div>
        <h2 className="mt-3 font-display text-2xl uppercase md:text-3xl">
          Cómo verificamos un dato antes de publicarlo
        </h2>
        <div className="mt-6 space-y-5 text-base leading-relaxed text-[var(--color-fg-muted)]">
          <p>
            Cada pieza editorial debe sostenerse en al menos <strong className="text-[var(--color-fg)]">dos fuentes públicas independientes</strong> antes de publicarse. La fuente principal queda registrada en el campo <code>sourceName</code> con su URL; las secundarias en el array <code>sourcesSecondary</code>. Ambos aparecen como <code>citation</code> en el JSON-LD <code>NewsArticle</code> del sitio para que cualquier lector pueda contrastar.
          </p>
          <p>
            La verificación cruzada se aplica de forma proporcional al riesgo: para datos verificables en estadísticas FIFA o Wikipedia bastan dos fuentes; para citas atribuidas a una persona reciente requerimos la fuente original (entrevista, comunicado, hemeroteca) más al menos un medio que la haya recogido; para reconstrucciones históricas (1930-1990) priorizamos hemeroteca primaria de la época sobre relatos posteriores.
          </p>
          <p>
            Cuando un dato no se puede verificar al 100 % en fuentes públicas, lo marcamos con el campo <code>certainty</code> que admite cuatro valores: <em>Alta</em> (cruce limpio en &gt;2 fuentes), <em>Media-Alta</em> (cruce con matices), <em>Media</em> (atribución débil pero documentada) y <em>Baja-Media</em> (no publicamos hasta confirmar; si publicamos, lo señalamos en el cuerpo).
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 w-full max-w-[800px] px-6 md:px-10">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <FileSearch className="h-4 w-4" />
          <span>Originalidad</span>
        </div>
        <h2 className="mt-3 font-display text-2xl uppercase md:text-3xl">
          Cero copia literal del medio fuente
        </h2>
        <div className="mt-6 space-y-5 text-base leading-relaxed text-[var(--color-fg-muted)]">
          <p>
            Nuestro contenido editorial se redacta íntegramente en español propio. <strong className="text-[var(--color-fg)]">No copiamos ni traducimos literalmente la entradilla del medio fuente</strong>. Cada noticia tiene un título propio (no calcado del medio), un resumen propio de 40-60 palabras y un cuerpo de 200-400 palabras (noticias) o 600-1000 palabras (historias) escrito desde cero, con contexto añadido.
          </p>
          <p>
            Las citas literales —cuando aparecen— se marcan entre comillas y se atribuyen explícitamente al hablante con su fuente original. No usamos parafraseo desplazante: una pieza nuestra no debe sustituir el clic al medio que descubrió la noticia; lo enlaza y lo cita.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 w-full max-w-[800px] px-6 md:px-10">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Languages className="h-4 w-4" />
          <span>Multidioma</span>
        </div>
        <h2 className="mt-3 font-display text-2xl uppercase md:text-3xl">
          Traducción y localización por mercado
        </h2>
        <div className="mt-6 space-y-5 text-base leading-relaxed text-[var(--color-fg-muted)]">
          <p>
            El sitio publica en cinco idiomas: español, inglés, portugués, francés y árabe. La versión española es la canónica; el resto se genera por adaptación —no traducción literal— para mantener relevancia local. Algunas piezas incluyen <em>localización por mercado</em>: la versión inglesa habla de cadenas de USA, la portuguesa de Brasil, la árabe del Magreb, etc.
          </p>
          <p>
            Las traducciones a inglés, portugués, francés y árabe se generan con asistencia LLM y se revisan editorialmente antes del despliegue. Marcamos como pendiente de revisión nativa las piezas donde la profundidad cultural justifica una pasada humana adicional.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 w-full max-w-[800px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Conflictos de interés
        </div>
        <h2 className="mt-3 font-display text-2xl uppercase md:text-3xl">
          Afiliación y monetización
        </h2>
        <div className="mt-6 space-y-5 text-base leading-relaxed text-[var(--color-fg-muted)]">
          <p>
            Mundial de Fútbol es un sitio independiente que se financia con afiliación de Amazon España (tag <code>nuus-21</code>) y, en el futuro, redes de afiliación adicionales (Awin, CJ, etc.). Los enlaces afiliados están etiquetados con <code>rel=&quot;sponsored noopener noreferrer&quot;</code> en el HTML y declarados en la página <Link href={withLocale(locale as Locale, '/aviso-afiliados')} className="underline underline-offset-4 hover:text-[var(--color-pitch)]">aviso de afiliados</Link>.
          </p>
          <p>
            La afiliación no condiciona la cobertura editorial. Una marca con la que tenemos enlace afiliado puede aparecer criticada o cuestionada si los hechos lo justifican. Cuando una pieza recomienda directamente un producto (p. ej., en la sección Fan Zone), incluye disclosure visible además del marcado HTML.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 w-full max-w-[800px] px-6 md:px-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Páginas relacionadas
        </div>
        <h2 className="mt-3 font-display text-2xl uppercase md:text-3xl">
          Más sobre nuestro proceso
        </h2>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={withLocale(locale as Locale, '/politica-correcciones')}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
          >
            Política de correcciones
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
            href={withLocale(locale as Locale, '/aviso-afiliados')}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
          >
            Aviso de afiliados
            <ExternalLink className="h-3 w-3" />
          </Link>
          <Link
            href={withLocale(locale as Locale, '/contacto')}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm transition-colors hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]"
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

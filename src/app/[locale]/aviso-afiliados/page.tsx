import { setRequestLocale } from 'next-intl/server';
import { ShoppingCart, Tv2 } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/aviso-afiliados',
    title: 'Aviso de afiliados · Mundial de Fútbol',
    description:
      'Información sobre el programa de afiliados de Amazon en mundiales-de-futbol.com: cómo funciona, qué comisión recibimos y cómo lo identificamos en cada enlace.',
    noIndex: false,
  });
}

export default async function AvisoAfiliadosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <article className="pt-32">
      <div className="mx-auto w-full max-w-[820px] px-6 md:px-10">
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <ShoppingCart className="h-4 w-4" />
          <span>Transparencia</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-h1 uppercase leading-[0.95]">
          Aviso de afiliados
        </h1>

        <div className="mt-10 space-y-6 text-base leading-relaxed text-[var(--color-fg)] md:text-lg">
          <p>
            <strong>Mundial de Fútbol</strong> participa en el{' '}
            <strong>Programa de Afiliados de Amazon EU</strong>, un sistema
            publicitario diseñado para que sitios web puedan obtener comisiones
            por publicidad mediante el enlace a productos en Amazon.es.
          </p>
          <p>
            Eso significa que algunos de los enlaces que ves en este sitio
            <strong> son enlaces de afiliado</strong>. Cuando haces clic en un
            enlace marcado como «Enlace de afiliado» y compras el producto,
            Amazon nos paga una pequeña comisión por la recomendación.
          </p>
          <p>
            <strong>Para ti, el precio no cambia</strong>. La comisión la asume
            Amazon. Tampoco se comparte tu información personal con nosotros:
            solo recibimos una notificación agregada de las ventas generadas.
          </p>
        </div>

        <h2 className="mt-14 font-display text-2xl uppercase leading-tight md:text-3xl">
          Cómo identificamos los enlaces
        </h2>
        <div className="mt-6 space-y-5 text-base leading-relaxed text-[var(--color-fg-muted)]">
          <p>
            Cada enlace de afiliado lleva una etiqueta visible
            <strong className="text-[var(--color-fg)]"> «Enlace de afiliado»</strong>
            {' '}junto al botón de compra y, técnicamente, los atributos
            <code className="mx-1 rounded bg-[var(--color-bg-2)] px-2 py-0.5 font-mono text-sm">
              rel=&quot;sponsored nofollow&quot;
            </code>
            siguiendo las recomendaciones de Google.
          </p>
          <p>
            Solo enlazamos productos que <strong>elegimos editorialmente</strong>:
            camisetas oficiales de selecciones, balones del Mundial 2026,
            álbumes Panini, libros sobre fútbol y aparatos para ver el torneo
            (TVs, proyectores, soundbars). No incluimos productos que no
            recomendaríamos a un amigo.
          </p>
        </div>

        <h2 className="mt-14 font-display text-2xl uppercase leading-tight md:text-3xl">
          Cómo nos ayuda
        </h2>
        <div className="mt-6 space-y-5 text-base leading-relaxed text-[var(--color-fg-muted)]">
          <p>
            Las comisiones financian la base de datos histórica del sitio
            (más de 2.000 jugadores, 22 Mundiales, 84 estadios), las
            traducciones a cinco idiomas, las ilustraciones, los servidores
            y las horas dedicadas a investigar y escribir las historias
            del calendario editorial.
          </p>
          <p>
            Si quieres apoyar el proyecto, una de las formas más directas es
            comprar a través de los enlaces marcados. Si prefieres no hacerlo,
            ningún problema: el contenido es y será siempre el mismo,
            esté o no monetizado.
          </p>
        </div>

        {/* ── Movistar Plus+ / AWIN ── */}
        <div className="mt-14 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)]">
          <Tv2 className="h-4 w-4" />
          <span>Movistar Plus+ · AWIN</span>
        </div>
        <h2 className="mt-3 font-display text-2xl uppercase leading-tight md:text-3xl">
          Afiliación Movistar Plus+
        </h2>
        <div className="mt-6 space-y-5 text-base leading-relaxed text-[var(--color-fg-muted)]">
          <p>
            Este sitio también participa en el{' '}
            <strong className="text-[var(--color-fg)]">programa de afiliados de AWIN</strong>{' '}
            en colaboración con <strong className="text-[var(--color-fg)]">Movistar Plus+</strong>{' '}
            (ID de afiliado: 2898755 / anunciante: 114230).
          </p>
          <p>
            Los botones y enlaces etiquetados como «Ver en Movistar Plus+»
            apuntan a la web oficial de Movistar Plus+ a través de un enlace
            de seguimiento AWIN. Si contratas un servicio a través de ese
            enlace, recibimos una comisión.{' '}
            <strong className="text-[var(--color-fg)]">
              El precio que pagas es exactamente el mismo
            </strong>{' '}
            que si entraras directamente a movistarplus.es.
          </p>
          <p>
            Los derechos audiovisuales del Mundial 2026 en España pertenecen a{' '}
            <strong className="text-[var(--color-fg)]">RTVE</strong> (partidos de España, en abierto)
            y a <strong className="text-[var(--color-fg)]">DAZN</strong> (resto de partidos).
            Movistar Plus+ distribuye DAZN a través de su plataforma.
            El acceso exacto a los canales depende del plan contratado; consulta
            las condiciones actualizadas en la web de Movistar Plus+ antes de suscribirte.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-black p-6 md:p-8">
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/40">
            Condiciones · Movistar Plus+ / AWIN
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-white/60">
            <li>· Los precios y condiciones de suscripción pueden variar sin previo aviso.</li>
            <li>· La disponibilidad de los partidos depende del plan contratado con Movistar Plus+.</li>
            <li>· Este sitio no actúa como intermediario en la contratación: la relación contractual es directa entre el usuario y Movistar Plus+ (Telefónica de España, S.A.U.).</li>
            <li>· Los enlaces de afiliado siguen la normativa AWIN y están marcados con <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[11px]">rel=&quot;sponsored nofollow noopener noreferrer&quot;</code>.</li>
            <li>· Para ejercer derechos RGPD sobre los datos de seguimiento, consulta la política de privacidad de AWIN: <a href="https://www.awin.com/es/privacidad" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 opacity-70 hover:opacity-100 transition-opacity">awin.com/es/privacidad</a>.</li>
          </ul>
        </div>

        {/* ── Amazon ── */}
        <div className="mt-14 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            Texto reglamentario Amazon
          </p>
          <p className="mt-4 text-sm italic leading-relaxed text-[var(--color-fg-muted)]">
            «Como Afiliado de Amazon, obtengo ingresos por las compras
            adscritas que cumplen los requisitos aplicables.»
          </p>
        </div>

        <p className="mt-10 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-fg-subtle)]">
          Última actualización: junio 2026 · Amazon ID nuus-21 · AWIN 2898755
        </p>
      </div>

      <div className="h-24" />
    </article>
  );
}

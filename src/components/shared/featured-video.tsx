import { JsonLd } from '@/lib/seo';

/**
 * Componente para embeber un video de YouTube con tratamiento editorial:
 *  - iframe responsivo (aspect-video 16:9)
 *  - VideoObject JSON-LD para Discover/Google
 *  - lazy loading
 *  - thumbnail como fallback antes de cargar el iframe
 *
 * Uso típico: noticias importantes con material audiovisual (ruedas de
 * prensa, sorteos, anuncios oficiales) y secciones destacadas en la home.
 */

export type FeaturedVideoProps = {
  videoId: string;
  title: string;
  description: string;
  /** Fecha de publicación del video (ISO 8601) */
  uploadDate: string;
  /** Duración aproximada en segundos (opcional, mejora schema) */
  durationSeconds?: number;
  /** Etiqueta superior (ej. "EN DIRECTO", "OFICIAL", "ANUNCIO") */
  badge?: string;
  /** Si true, se usa <h2>; si false, <h3>. Default: h2 */
  large?: boolean;
};

const YOUTUBE_EMBED_BASE = 'https://www.youtube-nocookie.com/embed/';
const THUMBNAIL_BASE = 'https://img.youtube.com/vi/';

export function FeaturedVideo({
  videoId,
  title,
  description,
  uploadDate,
  durationSeconds,
  badge,
  large = true,
}: FeaturedVideoProps) {
  const embedUrl = `${YOUTUBE_EMBED_BASE}${videoId}?rel=0&modestbranding=1`;
  const thumbnailUrl = `${THUMBNAIL_BASE}${videoId}/maxresdefault.jpg`;
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

  const videoObjectLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: title,
    description,
    thumbnailUrl: [thumbnailUrl],
    uploadDate,
    contentUrl: watchUrl,
    embedUrl,
  };
  if (durationSeconds) {
    videoObjectLd.duration = `PT${durationSeconds}S`;
  }

  const Heading = large ? 'h2' : 'h3';

  return (
    <div className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)]">
      <JsonLd data={videoObjectLd} />

      <div className="relative aspect-video w-full overflow-hidden bg-black">
        <iframe
          src={embedUrl}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>

      <div className="p-6 md:p-7">
        {badge && (
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            {badge}
          </div>
        )}
        <Heading
          className={`mt-2 font-display uppercase leading-tight ${
            large ? 'text-2xl md:text-3xl' : 'text-xl'
          } text-[var(--color-fg)]`}
        >
          {title}
        </Heading>
        <p className="mt-3 text-base leading-relaxed text-[var(--color-fg-muted)]">
          {description}
        </p>
      </div>
    </div>
  );
}

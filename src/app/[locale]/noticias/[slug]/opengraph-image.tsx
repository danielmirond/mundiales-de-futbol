import { ImageResponse } from 'next/og';
import { getNewsBySlug, type NewsCategory } from '@/lib/news';

/**
 * Open Graph image dinámica por noticia del Mundial 2026.
 *
 * Genera una imagen 1200×675 (16:9, ratio óptimo Google Discover) con:
 *  - Kicker con categoría y fecha
 *  - Título de la noticia (grande, escalado por longitud)
 *  - Glow lateral con color asociado a la categoría
 *  - Footer mundiales-de-futbol.com
 *
 * Convención Next.js App Router: cualquier petición a
 * `/noticias/<slug>` recibe automáticamente esta imagen como
 * `og:image` y `twitter:image`, garantizando 1200×675 sin depender
 * de la imagen original (las URLs Wikimedia con `?width=1200`
 * conservan el aspect ratio del archivo y normalmente NO son 16:9).
 *
 * Renderiza on-demand en edge runtime.
 */

export const runtime = 'edge';
export const size = { width: 1200, height: 675 };
export const contentType = 'image/png';
export const alt = 'Noticia · Mundial de Fútbol';

const CATEGORY_LABEL: Record<NewsCategory, string> = {
  panini: 'Panini',
  convocatorias: 'Convocatorias',
  sedes: 'Sedes',
  entradas: 'Entradas',
  jugadores: 'Jugadores',
  mascotas: 'Mascotas',
  ceremonia: 'Ceremonia',
  polemica: 'Polémica',
  tv: 'TV / Streaming',
  patrocinios: 'Patrocinios',
  general: 'General',
};

// Gradient por categoría. Mantiene marca pero diferencia visualmente
// distintos tipos de noticia en feed social.
const CATEGORY_GRADIENT: Record<NewsCategory, string> = {
  panini: 'linear-gradient(135deg, #d3261a 0%, #f59e0b 100%)',
  convocatorias: 'linear-gradient(135deg, #4ede80 0%, #06b6d4 100%)',
  sedes: 'linear-gradient(135deg, #06b6d4 0%, #4ede80 100%)',
  entradas: 'linear-gradient(135deg, #f59e0b 0%, #d3261a 100%)',
  jugadores: 'linear-gradient(135deg, #4ede80 0%, #1a8cdf 100%)',
  mascotas: 'linear-gradient(135deg, #f59e0b 0%, #4ede80 100%)',
  ceremonia: 'linear-gradient(135deg, #c084fc 0%, #f59e0b 100%)',
  polemica: 'linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)',
  tv: 'linear-gradient(135deg, #1a8cdf 0%, #c084fc 100%)',
  patrocinios: 'linear-gradient(135deg, #f59e0b 0%, #4ede80 100%)',
  general: 'linear-gradient(135deg, #4ede80 0%, #1a8cdf 100%)',
};

function formatDateEs(iso: string): string {
  try {
    const d = new Date(iso);
    const dd = String(d.getUTCDate()).padStart(2, '0');
    const months = [
      'ene', 'feb', 'mar', 'abr', 'may', 'jun',
      'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
    ];
    const mm = months[d.getUTCMonth()];
    const yy = d.getUTCFullYear();
    return `${dd} ${mm} ${yy}`;
  } catch {
    return '';
  }
}

export default async function NoticiaOgImage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const item = getNewsBySlug(params.slug);

  const title = item?.title ?? 'Mundial de Fútbol';
  const categoryLabel = item ? CATEGORY_LABEL[item.category] : 'Noticias';
  const accent = item ? CATEGORY_GRADIENT[item.category] : CATEGORY_GRADIENT.general;
  const dateText = item ? formatDateEs(item.publishedAt) : '';

  // Tamaño de fuente del título escalado por longitud.
  const titleLen = title.length;
  const titleFontSize =
    titleLen <= 60 ? 76 : titleLen <= 90 ? 64 : titleLen <= 120 ? 54 : 46;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background:
            'linear-gradient(135deg, #05060a 0%, #0b0d14 50%, #101319 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#f5f6f8',
          position: 'relative',
        }}
      >
        {/* Glow superior derecha con el color de la categoría */}
        <div
          style={{
            position: 'absolute',
            top: '-220px',
            right: '-220px',
            width: '640px',
            height: '640px',
            borderRadius: '50%',
            background: accent,
            opacity: 0.18,
            display: 'flex',
            filter: 'blur(40px)',
          }}
        />

        {/* Glow inferior izquierda más sutil */}
        <div
          style={{
            position: 'absolute',
            bottom: '-180px',
            left: '-180px',
            width: '480px',
            height: '480px',
            borderRadius: '50%',
            background: accent,
            opacity: 0.12,
            display: 'flex',
            filter: 'blur(40px)',
          }}
        />

        {/* Top: kicker categoría + fecha */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            zIndex: 2,
          }}
        >
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#4ede80',
              display: 'flex',
            }}
          />
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: '22px',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: '#4ede80',
              display: 'flex',
            }}
          >
            Mundial 2026 · {categoryLabel}
          </div>
          {dateText ? (
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '20px',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: '#9ea3ad',
                marginLeft: 'auto',
                display: 'flex',
              }}
            >
              {dateText}
            </div>
          ) : null}
        </div>

        {/* Centro: título grande con gradient sutil */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            zIndex: 2,
            maxWidth: '1056px',
          }}
        >
          <div
            style={{
              fontSize: titleFontSize,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: '#f5f6f8',
              display: 'flex',
            }}
          >
            {title}
          </div>
        </div>

        {/* Footer: dominio + accent line */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: 'monospace',
            fontSize: '20px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#9ea3ad',
            zIndex: 2,
            borderTop: '1px solid #1f2430',
            paddingTop: '20px',
          }}
        >
          <div style={{ display: 'flex' }}>mundiales-de-futbol.com</div>
          <div
            style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '4px',
                background: accent,
                display: 'flex',
              }}
            />
            <div style={{ display: 'flex', color: '#4ede80' }}>Noticia</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}

import { ImageResponse } from 'next/og';
import {
  getHistoria,
  BLOCK_LABELS,
  CATEGORY_LABELS,
  type HistoriaCategory,
} from '@/lib/historias';

/**
 * Open Graph image dinámica por historia del Mundial.
 *
 * Genera una imagen 1200×675 (16:9, ratio óptimo Google Discover) con:
 *  - Kicker con bloque editorial y fecha de la cita
 *  - Cita literal (entre comillas) cuando entra
 *  - Título de la historia
 *  - Glow lateral con color por categoría editorial
 *  - Footer mundiales-de-futbol.com + protagonista
 *
 * Convención Next.js App Router: cualquier petición a
 * `/historias/<slug>` recibe automáticamente esta imagen como
 * `og:image` y `twitter:image`, garantizando 1200×675 sin depender
 * de la imagen original (las URLs Wikimedia con `?width=1200`
 * conservan el aspect ratio del archivo y normalmente NO son 16:9).
 *
 * Renderiza on-demand en edge runtime.
 */

export const runtime = 'edge';
export const size = { width: 1200, height: 675 };
export const contentType = 'image/png';
export const alt = 'Historia · Mundial de Fútbol';

// Gradient por categoría editorial (alineado con CATEGORY_COLORS de
// la página de detalle, pero en formato gradient para el OG).
const CATEGORY_GRADIENT: Record<HistoriaCategory, string> = {
  epica: 'linear-gradient(135deg, #4ede80 0%, #1a8cdf 100%)',
  polemica: 'linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)',
  tragica: 'linear-gradient(135deg, #6366f1 0%, #c084fc 100%)',
  profetica: 'linear-gradient(135deg, #f59e0b 0%, #4ede80 100%)',
  humor: 'linear-gradient(135deg, #facc15 0%, #4ede80 100%)',
  historica: 'linear-gradient(135deg, #06b6d4 0%, #4ede80 100%)',
  mixta: 'linear-gradient(135deg, #c084fc 0%, #f59e0b 100%)',
};

function formatDateEs(iso: string): string {
  try {
    const d = new Date(iso);
    const yy = d.getUTCFullYear();
    return String(yy);
  } catch {
    return '';
  }
}

export default async function HistoriaOgImage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const historia = getHistoria(params.slug);

  const title = historia?.title ?? 'Historias del Mundial';
  const blockLabel = historia ? BLOCK_LABELS[historia.blockCode] : 'Historia';
  const categoryLabel = historia ? CATEGORY_LABELS[historia.category] : 'Histórica';
  const accent = historia
    ? CATEGORY_GRADIENT[historia.category]
    : CATEGORY_GRADIENT.historica;
  const protagonist = historia?.protagonist ?? '';
  const year = historia ? formatDateEs(historia.quoteDate) : '';
  const quote = historia?.quote ?? '';

  // Tamaño fuente del título escalado por longitud.
  const titleLen = title.length;
  const titleFontSize =
    titleLen <= 48 ? 76 : titleLen <= 70 ? 64 : titleLen <= 100 ? 52 : 44;

  // Si la cita es razonablemente corta, la pintamos como elemento
  // editorial principal sobre el título. Si pasa de 110 chars, la
  // saltamos para no saturar la imagen.
  const showQuote = quote.length > 0 && quote.length <= 110;
  const quoteFontSize = quote.length <= 60 ? 38 : 32;

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
        {/* Glow superior derecha con color de la categoría */}
        <div
          style={{
            position: 'absolute',
            top: '-220px',
            right: '-220px',
            width: '640px',
            height: '640px',
            borderRadius: '50%',
            background: accent,
            opacity: 0.2,
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

        {/* Top: kicker bloque editorial + año */}
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
              fontSize: '20px',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: '#4ede80',
              display: 'flex',
            }}
          >
            Historias del Mundial · {categoryLabel}
          </div>
          {year ? (
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
              {year}
            </div>
          ) : null}
        </div>

        {/* Centro: cita (si entra) + título grande */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            zIndex: 2,
            maxWidth: '1056px',
          }}
        >
          {showQuote ? (
            <div
              style={{
                fontSize: quoteFontSize,
                fontStyle: 'italic',
                lineHeight: 1.2,
                letterSpacing: '-0.01em',
                color: '#dadde2',
                display: 'flex',
                borderLeft: '4px solid',
                borderImage: `${accent} 1`,
                paddingLeft: '24px',
              }}
            >
              «{quote}»
            </div>
          ) : null}

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

        {/* Footer: dominio + protagonista + bloque */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: 'monospace',
            fontSize: '18px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#9ea3ad',
            zIndex: 2,
            borderTop: '1px solid #1f2430',
            paddingTop: '20px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex' }}>mundiales-de-futbol.com</div>
            {protagonist ? (
              <div
                style={{
                  display: 'flex',
                  color: '#dadde2',
                  fontSize: '16px',
                  textTransform: 'none',
                  letterSpacing: '0.1em',
                }}
              >
                {protagonist}
              </div>
            ) : null}
          </div>
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
            <div
              style={{
                display: 'flex',
                color: '#4ede80',
                fontSize: '14px',
              }}
            >
              {blockLabel}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}

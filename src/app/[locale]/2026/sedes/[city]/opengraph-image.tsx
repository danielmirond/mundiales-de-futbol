import { ImageResponse } from 'next/og';
import { getSedeBySlug, getVenueForSede } from '@/lib/wc-2026-sedes';

/**
 * Open Graph image dinámica por sede del Mundial 2026.
 *
 * Genera una imagen 1200×675 con:
 *  - Bandera del país anfitrión
 *  - Nombre de la ciudad (gigante)
 *  - Nombre del estadio + capacidad + rol en el torneo
 *  - Footer mundiales-de-futbol.com
 *
 * Renderiza on-demand en edge runtime (Next.js no permite combinar
 * `runtime: 'edge'` con `generateStaticParams`). El primer fetch
 * cachea la respuesta en CDN.
 */

export const runtime = 'edge';
export const size = { width: 1200, height: 675 };
export const contentType = 'image/png';
export const alt = 'Sede del Mundial 2026';

const HOST_GRADIENT: Record<'USA' | 'MEX' | 'CAN', string> = {
  USA: 'linear-gradient(135deg, #0a5fd3 0%, #4ede80 100%)',
  MEX: 'linear-gradient(135deg, #006341 0%, #4ede80 100%)',
  CAN: 'linear-gradient(135deg, #ff3b3b 0%, #4ede80 100%)',
};

export default async function SedeOgImage({
  params,
}: {
  params: { locale: string; city: string };
}) {
  const sede = getSedeBySlug(params.city);
  const venue = sede ? getVenueForSede(sede) : undefined;

  const cityName = sede?.cityName ?? 'Mundial 2026';
  const stadiumName = venue?.name ?? '';
  const role = venue?.role ?? '';
  const flag = sede?.flag ?? '🌍';
  const country = sede?.countryName ?? '';
  const accent =
    sede?.countryCode && HOST_GRADIENT[sede.countryCode]
      ? HOST_GRADIENT[sede.countryCode]
      : HOST_GRADIENT.USA;

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
        {/* Glow superior derecha con color del país */}
        <div
          style={{
            position: 'absolute',
            top: '-200px',
            right: '-200px',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: accent,
            opacity: 0.18,
            display: 'flex',
            filter: 'blur(40px)',
          }}
        />

        {/* Top: kicker mundialista */}
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
            Sede Mundial 2026
          </div>
        </div>

        {/* Bandera + nombre ciudad gigante */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            zIndex: 2,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              fontSize: '88px',
            }}
          >
            <div style={{ display: 'flex' }}>{flag}</div>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '24px',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: '#9ea3ad',
                display: 'flex',
              }}
            >
              {country}
            </div>
          </div>

          <div
            style={{
              fontSize: cityName.length > 14 ? 132 : 168,
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              backgroundImage: accent,
              backgroundClip: 'text',
              color: 'transparent',
              display: 'flex',
              maxWidth: '1050px',
            }}
          >
            {cityName}
          </div>

          {stadiumName ? (
            <div
              style={{
                fontSize: '34px',
                fontWeight: 600,
                color: '#dadde2',
                display: 'flex',
                marginTop: '12px',
              }}
            >
              {stadiumName}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            fontFamily: 'monospace',
            fontSize: '20px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#9ea3ad',
            zIndex: 2,
          }}
        >
          <div style={{ display: 'flex' }}>mundiales-de-futbol.com</div>
          {role ? (
            <div style={{ display: 'flex', color: '#4ede80' }}>{role}</div>
          ) : null}
        </div>
      </div>
    ),
    size,
  );
}

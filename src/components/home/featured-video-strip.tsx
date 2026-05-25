import { FeaturedVideo } from '@/components/shared/featured-video';

/**
 * Tira de vídeo destacado en la home. Encapsula la lógica editorial
 * de qué vídeo mostrar y permite cambiarlo desde un solo lugar conforme
 * van saliendo grandes momentos audiovisuales del ciclo Mundial 2026.
 *
 * Estado actual (25-may): rueda de prensa con el anuncio de la lista
 * de España por Luis de la Fuente desde el Espacio Movistar de Gran Vía.
 *
 * Para cambiar el video destacado, sustituir `CURRENT_FEATURED` por el
 * nuevo objeto. Hot moments candidatos a sustituir:
 *  - Listas oficiales en directo de Inglaterra, Brasil, Argentina, etc.
 *  - Sorteo del Sub-17 / sorteos relevantes.
 *  - Anuncio camisetas oficiales.
 *  - Comerciales virales (Adidas Backyard Legends).
 *  - Goles tras el inicio del Mundial.
 */

const CURRENT_FEATURED = {
  videoId: '982yoXq6Mgk',
  title: 'Luis de la Fuente anuncia la lista de España para el Mundial 2026',
  description:
    'Rueda de prensa íntegra desde el Espacio Movistar de Gran Vía 28, Madrid. El seleccionador desvela los 26 jugadores convocados, los amistosos pre-Mundial contra Irak (4 jun, Riazor) y Perú (8 jun, Puebla) y la composición táctica del equipo para el debut del 15 de junio contra Cabo Verde en el Mercedes-Benz Stadium de Atlanta.',
  uploadDate: '2026-05-25T10:30:00Z',
  durationSeconds: 3600,
  badge: 'Anuncio oficial · 25 may 2026',
};

export function FeaturedVideoStrip() {
  return (
    <section className="relative border-y border-[var(--color-border)] bg-[var(--color-bg)]">
      <div className="mx-auto w-full max-w-[1100px] px-6 py-12 md:px-10 md:py-16">
        <FeaturedVideo
          videoId={CURRENT_FEATURED.videoId}
          title={CURRENT_FEATURED.title}
          description={CURRENT_FEATURED.description}
          uploadDate={CURRENT_FEATURED.uploadDate}
          durationSeconds={CURRENT_FEATURED.durationSeconds}
          badge={CURRENT_FEATURED.badge}
          large
        />
      </div>
    </section>
  );
}

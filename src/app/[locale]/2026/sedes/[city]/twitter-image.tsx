// Reutilizamos el opengraph-image como twitter-image (mismo 1200x675).
// Next.js valida que cada export estático esté en el archivo: lo
// duplicamos en lugar de re-exportar para cumplir esa restricción.
export { default } from './opengraph-image';

export const runtime = 'edge';
export const size = { width: 1200, height: 675 };
export const contentType = 'image/png';
export const alt = 'Sede del Mundial 2026';

// Twitter Card image, usa el mismo generador que el OG (1200×675).
// Next.js exige que los config exports sean estáticos, no re-exportados.
import OpengraphImage from './opengraph-image';

export const runtime = 'edge';
export const alt =
  'Mundial de Fútbol, La enciclopedia definitiva de los Mundiales de Fútbol';
export const size = { width: 1200, height: 675 };
export const contentType = 'image/png';

export default OpengraphImage;

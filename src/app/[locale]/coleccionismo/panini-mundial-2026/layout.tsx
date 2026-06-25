import { PaniniLinks } from '@/components/coleccionismo/panini-links';

/**
 * Layout de la vertical Panini Mundial 2026: añade el bloque de enlazado
 * interno (cluster SEO) al final de TODAS las páginas de la sección.
 */
export default function PaniniLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <PaniniLinks />
    </>
  );
}

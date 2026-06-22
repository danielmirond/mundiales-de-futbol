'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { routing } from '@/i18n/routing';

/**
 * Enlazado interno de la vertical Panini Mundial 2026.
 *
 * Conecta todas las páginas del cluster con anchors ricos en keyword (la
 * palanca SEO real para subir posiciones, sin tocar titles). Se renderiza
 * desde el layout de la sección, así aparece en TODAS las páginas. Excluye la
 * página actual.
 */
const BASE = '/coleccionismo/panini-mundial-2026';

const LINKS: { href: string; anchor: string }[] = [
  { href: BASE, anchor: 'Álbum Panini del Mundial 2026' },
  { href: `${BASE}/cuantos-cromos-tiene`, anchor: 'Cuántos cromos tiene el álbum' },
  { href: `${BASE}/completar-album`, anchor: 'Cuánto cuesta completar el álbum' },
  { href: `${BASE}/precio`, anchor: 'Precio del álbum y los sobres' },
  { href: `${BASE}/check-list-cromos`, anchor: 'Check list de cromos para completar' },
  { href: `${BASE}/cromos-mas-caros`, anchor: 'Los cromos más caros y difíciles' },
  { href: `${BASE}/coca-cola`, anchor: 'Cromos Coca-Cola exclusivos' },
  { href: `${BASE}/caja-50-sobres`, anchor: 'Caja de 50 sobres' },
  { href: `${BASE}/edicion-dorada`, anchor: 'Edición dorada del álbum' },
  { href: `${BASE}/tapa-dura`, anchor: 'Álbum de tapa dura' },
  { href: `${BASE}/cuando-sale`, anchor: 'Cuándo sale el álbum' },
  { href: `${BASE}/digital`, anchor: 'Álbum digital Panini' },
  { href: `${BASE}/topps-vs-panini`, anchor: 'Topps vs Panini: diferencias' },
  { href: `${BASE}/figurinhas-copa-2026`, anchor: 'Figurinhas da Copa 2026' },
  { href: `${BASE}/donde-comprar`, anchor: 'Dónde comprar los cromos' },
  { href: `${BASE}/donde-comprar/espana`, anchor: 'Comprar en España' },
  { href: `${BASE}/donde-comprar/mexico`, anchor: 'Comprar en México' },
  { href: `${BASE}/donde-comprar/usa`, anchor: 'Comprar en Estados Unidos' },
  { href: `${BASE}/donde-comprar/brasil`, anchor: 'Comprar en Brasil' },
];

export function PaniniLinks() {
  const locale = useLocale();
  const pathname = usePathname() || '';
  // Quita el prefijo de idioma para comparar con los href (sin prefijo).
  const localePrefix = new RegExp(`^/(${routing.locales.join('|')})(?=/|$)`);
  const current = pathname.replace(localePrefix, '') || '/';
  const wl = (href: string) => (locale === routing.defaultLocale ? href : `/${locale}${href}`);

  const links = LINKS.filter((l) => l.href !== current);

  return (
    <section className="mx-auto w-full max-w-[1100px] px-6 pb-20 md:px-10">
      <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:p-8">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          Colección Panini Mundial 2026
        </div>
        <h2 className="mt-2 font-display text-xl uppercase leading-tight text-[var(--color-fg)] md:text-2xl">
          Sigue explorando los cromos
        </h2>
        <ul className="mt-5 grid gap-x-6 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={wl(l.href)}
                className="inline-flex items-center gap-2 text-sm text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-pitch)]"
              >
                <span className="text-[var(--color-pitch)]">→</span>
                {l.anchor}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

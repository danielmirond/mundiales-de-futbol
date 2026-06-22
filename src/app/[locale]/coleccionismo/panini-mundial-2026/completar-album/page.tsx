import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/coleccionismo/panini-mundial-2026/completar-album',
    title: 'Completar el álbum Panini del Mundial 2026: cuántos sobres, coste y el truco del intercambio',
    description:
      '¿Cuántos sobres hacen falta para completar el álbum Panini del Mundial 2026 y cuánto cuesta de verdad? La matemática del coleccionista, por qué el último cromo es el más caro y cómo el intercambio cambia por completo la cuenta.',
    keywords: [
      'completar álbum Panini Mundial 2026',
      'cuántos sobres para completar el álbum',
      'cuánto cuesta completar el álbum Panini',
      'probabilidad completar álbum mundial 2026',
      'cromos repetidos Panini',
    ],
  });
}

function withLocale(locale: string, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

const BASE = '/coleccionismo/panini-mundial-2026';

export default async function CompletarAlbumPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="mx-auto w-full max-w-[900px] px-6 pb-12 pt-28 md:px-10 md:pt-32">
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
        Colección Panini · Mundial 2026
      </div>
      <h1 className="mt-3 font-display text-fluid-h1 uppercase leading-[0.95]">
        ¿Cuánto cuesta completar el álbum del Mundial 2026?
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-[var(--color-fg-muted)]">
        Llenar el álbum Panini comprando sobres a ciegas sale carísimo, y la culpa la tienen los{' '}
        <strong className="text-[var(--color-fg)]">cromos repetidos</strong>. Lo explica la
        matemática (el "problema del coleccionista") y los números asustan.
      </p>

      <section className="mt-10">
        <h2 className="font-display text-2xl uppercase leading-tight md:text-3xl">
          La matemática del coleccionista
        </h2>
        <p className="mt-3 leading-relaxed text-[var(--color-fg-muted)]">
          El álbum tiene <Link href={withLocale(locale, `${BASE}/cuantos-cromos-tiene`)} className="text-[var(--color-pitch)] underline-offset-4 hover:underline">cromos para rellenar</Link>{' '}
          y cada sobre trae 5. Al principio casi todos son nuevos, pero según avanzas empiezan a
          salir repes. Cuanto más cerca del final, más difícil es que toque uno que te falte.
          Haciendo el cálculo (coupon collector) para los <strong className="text-[var(--color-fg)]">980 cromos</strong>:
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { big: '~1.460', label: 'sobres de media para completarlo tú solo' },
            { big: '~1.470 €', label: 'coste comprando solo sobres (+ álbum)' },
            { big: '~196', label: 'sobres solo para el ÚLTIMO cromo que te falta' },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-5">
              <div className="font-display text-3xl tab-num text-[var(--color-pitch)] md:text-4xl">{s.big}</div>
              <div className="mt-1.5 text-sm text-[var(--color-fg-muted)]">{s.label}</div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-[var(--color-fg-subtle)]">
          Es una estimación matemática (media estadística): puedes tener más suerte… o menos. Pero
          deja claro por qué nadie completa el álbum a pelo.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl uppercase leading-tight md:text-3xl">
          Por qué el intercambio lo cambia TODO
        </h2>
        <p className="mt-3 leading-relaxed text-[var(--color-fg-muted)]">
          La clave para no arruinarte son los <strong className="text-[var(--color-fg)]">cambios</strong>:
          tus repes son los cromos que le faltan a otro. En teoría, si cada repe se aprovecha, bastarían{' '}
          <strong className="text-[var(--color-fg)]">unos 196 sobres</strong> (los 980 cromos ÷ 5) repartidos
          entre varios coleccionistas — una fracción del coste de ir solo. Por eso funcionan los
          mercadillos de intercambio (en algunos países, con decenas de miles de aficionados) y los
          grupos de cambios online.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl uppercase leading-tight md:text-3xl">
          El plan más barato para completarlo
        </h2>
        <ul className="mt-4 space-y-2 text-[var(--color-fg-muted)]">
          <li>• Compra una base de sobres (una <Link href={withLocale(locale, `${BASE}/caja-50-sobres`)} className="text-[var(--color-pitch)] underline-offset-4 hover:underline">caja</Link> rinde mucho al principio, cuando casi todo es nuevo).</li>
          <li>• Apúntate a grupos de <Link href={withLocale(locale, `${BASE}/donde-comprar`)} className="text-[var(--color-pitch)] underline-offset-4 hover:underline">intercambio</Link> para soltar repes y cazar los que faltan.</li>
          <li>• Los últimos (los más esquivos) cómpralos sueltos a coleccionistas en vez de seguir abriendo sobres.</li>
          <li>• Consulta el <Link href={withLocale(locale, `${BASE}/check-list-cromos`)} className="text-[var(--color-pitch)] underline-offset-4 hover:underline">check list</Link> para llevar la cuenta y el <Link href={withLocale(locale, `${BASE}/precio`)} className="text-[var(--color-pitch)] underline-offset-4 hover:underline">precio</Link> de cada formato.</li>
        </ul>
        <p className="mt-5 text-sm text-[var(--color-fg-subtle)]">
          ¿Y los cromos más buscados? Los especiales (foil, holograma, ediciones limitadas) son los
          que disparan el coste y el valor: te los detallamos en{' '}
          <Link href={withLocale(locale, `${BASE}/cromos-mas-caros`)} className="text-[var(--color-pitch)] underline-offset-4 hover:underline">los cromos más caros</Link>.
        </p>
      </section>
    </main>
  );
}

import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl } from '@/lib/seo';
import { KIT_TIERS } from '@/lib/wc-2026-kits-info';

function withLocale(locale: Locale, href: string) {
  if (locale === routing.defaultLocale) return href;
  return `/${locale}${href === '/' ? '' : href}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return pageMetadata({
    locale,
    path: '/coleccionismo/camisetas-mundial-2026/authentic-vs-replica',
    title: 'Camiseta Authentic vs Replica Mundial 2026 · Diferencias técnicas',
    description:
      'Diferencias entre camiseta authentic (player version) y replica del Mundial 2026: HEAT.RDY vs AEROREADY, Dri-FIT ADV vs Stadium, ULTRAWEAVE vs dryCELL. Cuál te conviene según uso.',
    keywords: [
      'authentic vs replica camiseta',
      'camiseta player version mundial 2026',
      'diferencia authentic replica',
      'heat.rdy vs aeroready',
      'dri-fit adv vs stadium',
      'ultraweave vs drycell',
    ],
    type: 'article',
  });
}

const REPLICA = KIT_TIERS.find((t) => t.id === 'replica')!;
const AUTHENTIC = KIT_TIERS.find((t) => t.id === 'authentic')!;

const COMPARISON_ROWS = [
  {
    feature: 'Precio RRP',
    replica: '70–100 €',
    authentic: '130–180 €',
  },
  {
    feature: 'Audiencia objetivo',
    replica: REPLICA.audience,
    authentic: AUTHENTIC.audience,
  },
  {
    feature: 'Tecnología adidas',
    replica: REPLICA.techByBrand.adidas ?? '—',
    authentic: AUTHENTIC.techByBrand.adidas ?? '—',
  },
  {
    feature: 'Tecnología Nike',
    replica: REPLICA.techByBrand.nike ?? '—',
    authentic: AUTHENTIC.techByBrand.nike ?? '—',
  },
  {
    feature: 'Tecnología Puma',
    replica: REPLICA.techByBrand.puma ?? '—',
    authentic: AUTHENTIC.techByBrand.puma ?? '—',
  },
  {
    feature: 'Logo de marca',
    replica: 'Cosido',
    authentic: 'Prensado en caliente',
  },
  {
    feature: 'Costuras',
    replica: 'Estándar',
    authentic: 'Planas, casi invisibles',
  },
  {
    feature: 'Tejido',
    replica: 'Poliéster reciclado básico',
    authentic: 'Poliéster premium reciclado, más fino y ligero',
  },
  {
    feature: 'Ventilación',
    replica: 'Básica',
    authentic: 'Perforaciones en zonas calor (axilas, espalda)',
  },
  {
    feature: 'Fit',
    replica: 'Holgado, talla estándar',
    authentic: 'Slim fit, considera bajar 1 talla',
  },
  {
    feature: 'Manga',
    replica: '1–2 cm más larga',
    authentic: 'Ajustada y ergonómica',
  },
  {
    feature: 'Etiqueta interior',
    replica: 'Etiquetas múltiples cosidas',
    authentic: 'Etiquetas mínimas (algunas prensadas)',
  },
  {
    feature: 'Peso aproximado',
    replica: '180–210 g',
    authentic: '120–150 g',
  },
  {
    feature: 'Uso recomendado',
    replica: 'Estadio, casual, regalo',
    authentic: 'Deporte intenso, coleccionismo, foto pro',
  },
];

export default async function AuthenticVsReplicaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Camiseta Authentic vs Replica Mundial 2026',
    url: localeUrl(locale, '/coleccionismo/camisetas-mundial-2026/authentic-vs-replica'),
    inLanguage: locale,
  };

  return (
    <article className="pt-32 pb-24">
      <JsonLd
        data={[
          articleLd,
          breadcrumbLd(locale, [
            { name: 'Inicio', path: '/' },
            { name: 'Camisetas Mundial 2026', path: '/coleccionismo/camisetas-mundial-2026' },
            { name: 'Authentic vs Replica', path: '/coleccionismo/camisetas-mundial-2026/authentic-vs-replica' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1100px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/coleccionismo/camisetas-mundial-2026')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-pitch)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> Camisetas Mundial 2026
        </Link>

        <div className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Sparkles className="mr-2 inline h-3 w-3" /> Comparativa técnica
        </div>
        <h1 className="mt-3 font-display text-4xl uppercase leading-[1] md:text-5xl">
          Authentic vs Replica: cuál te conviene
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)]">
          La diferencia entre una camiseta authentic (también llamada
          &ldquo;player version&rdquo;) y una replica (&ldquo;fan version&rdquo;) no es
          solo el precio. Cambia el tejido, el fit, la ventilación, las
          costuras y el peso. Esta es la tabla completa.
        </p>
      </header>

      <section className="mx-auto mt-12 w-full max-w-[1100px] px-6 md:px-10">
        <div className="overflow-x-auto rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)]">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-5 py-4 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
                  Característica
                </th>
                <th className="px-5 py-4 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-fg-subtle)]">
                  Replica (Fan)
                </th>
                <th className="px-5 py-4 text-left font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-pitch)]">
                  Authentic (Player)
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row, i) => (
                <tr
                  key={row.feature}
                  className={i % 2 === 0 ? 'bg-[var(--color-bg)]/40' : ''}
                >
                  <td className="px-5 py-3 font-mono text-xs uppercase tracking-[0.15em] text-[var(--color-fg)]">
                    {row.feature}
                  </td>
                  <td className="px-5 py-3 text-[var(--color-fg-muted)]">
                    {row.replica}
                  </td>
                  <td className="px-5 py-3 text-[var(--color-fg)]">
                    {row.authentic}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10 grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:p-7">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            Elige Replica si...
          </div>
          <ul className="mt-3 space-y-2 text-sm text-[var(--color-fg-muted)]">
            <li className="flex gap-2"><span className="text-[var(--color-pitch)]">+</span>Vas a llevarla al estadio o a verla con amigos</li>
            <li className="flex gap-2"><span className="text-[var(--color-pitch)]">+</span>Es un regalo y no sabes la talla exacta del destinatario</li>
            <li className="flex gap-2"><span className="text-[var(--color-pitch)]">+</span>Tu presupuesto está entre 70 y 100 €</li>
            <li className="flex gap-2"><span className="text-[var(--color-pitch)]">+</span>Prefieres un fit holgado y casual</li>
            <li className="flex gap-2"><span className="text-[var(--color-pitch)]">+</span>No te importa que pese 60 g más</li>
          </ul>
        </div>

        <div className="rounded-3xl border border-[var(--color-pitch)]/40 bg-[var(--color-bg-2)] p-6 md:p-7">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            Elige Authentic si...
          </div>
          <ul className="mt-3 space-y-2 text-sm text-[var(--color-fg-muted)]">
            <li className="flex gap-2"><span className="text-[var(--color-pitch)]">+</span>Vas a usarla para correr, jugar o entrenar</li>
            <li className="flex gap-2"><span className="text-[var(--color-pitch)]">+</span>Coleccionas camisetas y quieres la misma que el jugador</li>
            <li className="flex gap-2"><span className="text-[var(--color-pitch)]">+</span>Tu presupuesto admite 130–180 €</li>
            <li className="flex gap-2"><span className="text-[var(--color-pitch)]">+</span>Prefieres un fit ceñido y ligero</li>
            <li className="flex gap-2"><span className="text-[var(--color-pitch)]">+</span>Quieres la mejor tecnología textil disponible</li>
          </ul>
        </div>
      </section>

      <section className="mx-auto mt-14 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 md:p-7">
          <h2 className="font-display text-2xl uppercase">¿Y las kids?</h2>
          <p className="mt-3 text-base leading-relaxed text-[var(--color-fg-muted)]">
            Las camisetas de niño (4Y a 14Y) siempre son réplicas
            simplificadas: 50–80 €, AEROREADY light, Dri-FIT youth o
            dryCELL básico. No existe authentic infantil porque ningún
            jugador profesional usa esa talla en partido oficial. Si te
            están vendiendo una authentic talla niño, es falsificación.
            Ver <Link href={withLocale(locale as Locale, '/coleccionismo/camisetas-mundial-2026/falsificaciones')} className="underline">cómo detectar copias</Link>.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-16 w-full max-w-[1100px] px-6 md:px-10">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6">
          <h2 className="font-display text-lg uppercase">Sigue con el cluster</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={withLocale(locale as Locale, '/coleccionismo/camisetas-mundial-2026/precio')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Precios
            </Link>
            <Link href={withLocale(locale as Locale, '/coleccionismo/camisetas-mundial-2026/tallas')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Tallas
            </Link>
            <Link href={withLocale(locale as Locale, '/coleccionismo/camisetas-mundial-2026/comprar')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Dónde comprar
            </Link>
            <Link href={withLocale(locale as Locale, '/coleccionismo/camisetas-mundial-2026/falsificaciones')} className="rounded-full border border-[var(--color-border-strong)] px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] hover:border-[var(--color-pitch)] hover:text-[var(--color-pitch)]">
              Detectar copias
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

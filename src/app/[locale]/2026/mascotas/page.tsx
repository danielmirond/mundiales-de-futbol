import Link from 'next/link';
import Image from 'next/image';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { routing, type Locale } from '@/i18n/routing';
import { JsonLd, pageMetadata, breadcrumbLd, localeUrl, SEO } from '@/lib/seo';

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
  const t = await getTranslations({ locale, namespace: 'pages.mascotas' });
  return pageMetadata({
    locale,
    path: '/2026/mascotas',
    title: t('title'),
    description: t('description'),
    keywords: [
      'mascotas Mundial 2026',
      'World Cup 2026 mascots',
      'mascotes Copa do Mundo 2026',
      'mascottes Coupe du Monde 2026',
      'Maple Zayu Clutch FIFA',
      'jaguar México Mundial',
      'bald eagle USA World Cup',
    ],
    type: 'article',
  });
}

const MASCOTS = [
  {
    slug: 'maple',
    name: 'Maple',
    animal: 'Alce (moose)',
    country: 'Canadá',
    flag: '🇨🇦',
    color: '#ff3b3b',
    role: 'Portera',
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Maple_Mascot_FIFA_World_Cup_2026.png?width=900',
    bio: `Maple representa a Canadá como portera y carga sobre los hombros la energía de la naturaleza canadiense. El alce es un animal emblemático del país, presente en su moneda, su iconografía y su cultura outdoor. La hoja de arce roja —el símbolo nacional por excelencia— le da nombre y aparece en su uniforme.`,
    symbolism: `El alce es el segundo animal terrestre más alto de Norteamérica y simboliza fuerza, resistencia y conexión con el invierno boreal. Como portera, Maple encarna la última línea de defensa, idea reforzada por la imagen del alce parado en mitad del bosque sin moverse cuando algo se le acerca.`,
    funFact:
      'Maple es la primera mascota mundialista que ocupa explícitamente la posición de portera. FIFA quiso reforzar el rol con la elección.',
  },
  {
    slug: 'zayu',
    name: 'Zayu',
    animal: 'Jaguar',
    country: 'México',
    flag: '🇲🇽',
    color: '#006341',
    role: 'Delantero',
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Zayu_Mascot_FIFA_World_Cup_2026.png?width=900',
    bio: `Zayu representa a México como delantero. El jaguar es uno de los grandes felinos sagrados de la cultura mesoamericana —maya, azteca, olmeca— y aparece en escultura, mitología y códices prehispánicos como símbolo de fuerza, valentía y autoridad. Es el sucesor moderno del clásico Pique de México 1986.`,
    symbolism: `El jaguar fue venerado en el panteón azteca como representación del dios Tezcatlipoca y en la Maya como animal del inframundo. Es felino de selva, depredador silencioso y signo de poder. Al elegirlo como delantero, FIFA enfatiza la velocidad, la potencia y la capacidad de definición.`,
    funFact:
      'El nombre «Zayu» deriva de raíces mayas y zapotecas, una elección deliberada por FIFA para representar la pluralidad cultural mexicana.',
  },
  {
    slug: 'clutch',
    name: 'Clutch',
    animal: 'Águila calva (bald eagle)',
    country: 'Estados Unidos',
    flag: '🇺🇸',
    color: '#0a5fd3',
    role: 'Centrocampista',
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Clutch_Mascot_FIFA_World_Cup_2026.png?width=900',
    bio: `Clutch representa a Estados Unidos como centrocampista. El águila calva es el ave nacional estadounidense desde 1782, cuando el Congreso la adoptó como símbolo del país. Aparece en el sello presidencial, en monedas y en gran parte de la iconografía estatal.`,
    symbolism: `El águila simboliza libertad, visión, liderazgo y fuerza. Es ave de altura, capaz de ver desde 1.500 metros con detalle quirúrgico. Como centrocampista, Clutch encarna la inteligencia táctica, la visión de juego y el liderazgo en el organigrama del equipo: el cerebro entre la defensa y la ofensiva.`,
    funFact:
      'El nombre «Clutch» significa «en el momento clave» en jerga deportiva estadounidense. Un guiño cultural a la dramaturgia anglosajona del deporte: ese momento en el que se gana o se pierde el partido.',
  },
];

export default async function Mascotas({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'pages.mascotas' });

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: t('title'),
    description: t('description'),
    publisher: { '@type': 'Organization', name: SEO.siteName, url: SEO.siteUrl },
    datePublished: '2026-05-02',
    dateModified: '2026-05-02',
    mainEntityOfPage: localeUrl(locale, '/2026/mascotas'),
    about: {
      '@type': 'SportsEvent',
      name: 'FIFA World Cup 2026',
      startDate: '2026-06-11',
      endDate: '2026-07-19',
    },
  };

  return (
    <article className="pt-32">
      <JsonLd
        data={[
          articleLd,
          breadcrumbLd(locale, [
            { name: t('breadcrumbHome'), path: '/' },
            { name: t('breadcrumbHub'), path: '/2026' },
            { name: t('breadcrumbSelf'), path: '/2026/mascotas' },
          ]),
        ]}
      />

      <header className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
        <Link
          href={withLocale(locale as Locale, '/2026')}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
        >
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" /> {t('back')}
        </Link>

        <div className="mt-8 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
          <Sparkles className="h-4 w-4" />
          <span>{t('kicker')}</span>
        </div>
        <h1 className="mt-4 font-display text-fluid-display uppercase leading-[0.9]">
          {t('h1Line1')}<br />{t('h1Line2')}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-fg-muted)] md:text-xl">
          {t('intro')}
        </p>
      </header>

      <section className="mx-auto mt-16 w-full max-w-[1200px] px-6 md:px-10 space-y-12">
        {MASCOTS.map((m) => (
          <article
            key={m.slug}
            id={m.slug}
            className="scroll-mt-32 grid gap-8 rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-7 md:grid-cols-[1fr_2fr] md:p-10"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-bg)] to-[var(--color-bg-2)]">
              {m.image ? (
                <Image
                  src={m.image}
                  alt={`${m.name}, mascota oficial del Mundial 2026 representando a ${m.country}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-contain p-6"
                  unoptimized
                />
              ) : (
                <div className="flex h-full items-center justify-center text-9xl">
                  {m.flag}
                </div>
              )}
              <span
                className="absolute right-4 top-4 rounded-full px-3 py-1 font-mono text-[9px] uppercase tracking-[0.3em] text-white"
                style={{ background: m.color }}
              >
                {m.role}
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-3 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
                <span aria-hidden>{m.flag}</span>
                <span>{m.country}</span>
                <span className="text-[var(--color-fg-subtle)]">·</span>
                <span className="text-[var(--color-fg-subtle)]">{m.animal}</span>
              </div>
              <h2 className="mt-3 font-display text-4xl uppercase leading-[1] md:text-5xl">
                {m.name}
              </h2>

              <p className="mt-6 text-base leading-relaxed text-[var(--color-fg-muted)] md:text-lg">
                {m.bio}
              </p>

              <h3 className="mt-8 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
                {t('symbolismLabel')}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)] md:text-base">
                {m.symbolism}
              </p>

              <h3 className="mt-8 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
                {t('funFactLabel')}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)] md:text-base">
                {m.funFact}
              </p>
            </div>
          </article>
        ))}
      </section>

      <section className="mx-auto mt-20 w-full max-w-[1200px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-10 md:p-14">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            {t('historyKicker')}
          </div>
          <h2 className="mt-3 font-display text-3xl uppercase md:text-4xl">
            {t('historyHeading')}
          </h2>
          <ul className="mt-8 grid gap-3 text-sm md:grid-cols-2 md:text-base">
            <li><strong className="text-[var(--color-fg)]">1966 · Willie</strong> (Inglaterra). El primer mascota mundialista. León con uniforme de la Union Jack.</li>
            <li><strong className="text-[var(--color-fg)]">1970 · Juanito</strong> (México). Niño con sombrero charro.</li>
            <li><strong className="text-[var(--color-fg)]">1986 · Pique</strong> (México). Pimiento jalapeño con bigote y sombrero. Sucesor de Zayu en cuanto a mascota mexicana.</li>
            <li><strong className="text-[var(--color-fg)]">1994 · Striker</strong> (USA). El perro de la World Cup en Estados Unidos. Antecesor de Clutch.</li>
            <li><strong className="text-[var(--color-fg)]">2010 · Zakumi</strong> (Sudáfrica). Leopardo pelo verde y amarillo.</li>
            <li><strong className="text-[var(--color-fg)]">2018 · Zabivaka</strong> (Rusia). Lobo siberiano con gafas naranjas.</li>
            <li><strong className="text-[var(--color-fg)]">2022 · La'eeb</strong> (Catar). Pañuelo blanco voladero.</li>
            <li><strong className="text-[var(--color-fg)]">2026 · Maple, Zayu, Clutch</strong>. Tres mascotas, una por país anfitrión.</li>
          </ul>
        </div>
      </section>

      <section className="mx-auto mt-16 mb-24 w-full max-w-[1200px] px-6 md:px-10">
        <div className="rounded-3xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-pitch)]/8 via-[var(--color-bg-2)] to-[var(--color-bg-2)] p-10 md:p-14">
          <h2 className="font-display text-2xl uppercase">{t('moreHeading')}</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={withLocale(locale as Locale, '/2026')} className="rounded-full bg-[var(--color-pitch)] px-5 py-2.5 text-sm font-semibold text-black">{t('moreCta1')}</Link>
            <Link href={withLocale(locale as Locale, '/2026/sedes')} className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm">{t('moreCta2')}</Link>
            <Link href={withLocale(locale as Locale, '/coleccionismo/panini-mundial-2026')} className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm">{t('moreCta3')}</Link>
          </div>
        </div>
      </section>
    </article>
  );
}

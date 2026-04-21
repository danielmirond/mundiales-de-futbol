import Image from 'next/image';
import { getStory } from '@/lib/tournament-stories';
import ASSETS from '@/lib/tournament-assets.json';

type Assets = Record<string, { mascot?: string; ball?: string }>;

export function EditionStory({ year }: { year: number }) {
  const story = getStory(year);
  if (!story) return null;

  const assets = (ASSETS as Assets)[String(year)] ?? {};

  // Build the mascot / ball / anthem blocks only when data exists
  const hasHighlight = !!story.mascot || !!assets.mascot || !!story.ball || !!assets.ball || !!story.anthem;

  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-pitch)]">
        Historia
      </div>
      <h2 className="mt-3 font-display text-fluid-h2 uppercase leading-none">
        La edición por dentro
      </h2>

      {/* Highlight tiles — mascot, ball, anthem */}
      {hasHighlight && (
        <div className="mt-10 grid gap-px bg-[var(--color-border)] md:grid-cols-3">
          {/* Mascot */}
          {assets.mascot || story.mascot ? (
            <HighlightTile
              kicker="Mascota"
              title={story.mascot?.name ?? mascotLabel(year)}
              description={story.mascot?.description ?? descriptionFromAssets(year, 'mascot')}
              image={assets.mascot}
              objectPosition="center"
            />
          ) : null}

          {/* Ball */}
          {assets.ball || story.ball ? (
            <HighlightTile
              kicker="Balón oficial"
              title={story.ball?.name ?? ballLabel(year)}
              description={story.ball?.description ?? ballDescription(year)}
              image={assets.ball}
              objectPosition="center"
            />
          ) : null}

          {/* Anthem */}
          {story.anthem ? (
            <div className="flex flex-col gap-4 bg-[var(--color-bg-2)] p-8">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
                Canción oficial
              </div>
              <div>
                <div className="font-display text-3xl uppercase leading-none text-[var(--color-fg)]">
                  {story.anthem.title}
                </div>
                <div className="mt-2 text-sm text-[var(--color-fg-muted)]">
                  {story.anthem.artist}
                </div>
              </div>
              {story.anthem.youtubeId && (
                <div className="mt-auto overflow-hidden rounded-2xl">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${story.anthem.youtubeId}`}
                    title={story.anthem.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="block aspect-video w-full"
                  />
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}

      {/* Innovations + key moments */}
      <div className="mt-12 grid gap-10 md:grid-cols-2">
        {story.innovations.length > 0 && (
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              Innovaciones
            </div>
            <ul className="mt-5 space-y-4">
              {story.innovations.map((inn, i) => (
                <li
                  key={i}
                  className="flex gap-3 border-l-2 border-[var(--color-border-strong)] pl-4 text-base leading-relaxed text-[var(--color-fg)]"
                >
                  <span className="font-mono text-[var(--color-pitch)] tab-num">{String(i + 1).padStart(2, '0')}</span>
                  <span>{inn}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {story.moments.length > 0 && (
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
              Momentos clave
            </div>
            <ul className="mt-5 space-y-5">
              {story.moments.map((m, i) => (
                <li key={i}>
                  <div className="font-display text-xl uppercase leading-tight text-[var(--color-fg)]">
                    {m.title}
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                    {m.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Controversies — polémicas, escándalos, decisiones discutidas */}
      {story.controversies && story.controversies.length > 0 && (
        <div className="mt-16 rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-2)] p-8 md:p-12">
          <div className="flex items-baseline gap-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-red-400/80">
              Polémicas
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-red-500/40 to-transparent" />
          </div>
          <h3 className="mt-3 font-display text-fluid-h3 uppercase leading-none">
            Lo que todavía se discute
          </h3>
          <ul className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {story.controversies.map((c, i) => (
              <li
                key={i}
                className="relative border-l-2 border-red-500/40 pl-5"
              >
                <div className="absolute left-[-6px] top-1 h-[10px] w-[10px] rounded-full bg-red-500" />
                <div className="font-display text-lg uppercase leading-tight text-[var(--color-fg)]">
                  {c.title}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                  {c.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Nostalgia — recuerdos sensoriales: narradores, jingles, cromos, rituales */}
      {story.nostalgia && story.nostalgia.length > 0 && (
        <div className="mt-12">
          <div className="flex items-baseline gap-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400/80">
              Añoranza
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-amber-500/40 to-transparent" />
          </div>
          <h3 className="mt-3 font-display text-fluid-h3 uppercase leading-none">
            Así lo vivimos
          </h3>
          <p className="mt-2 max-w-2xl text-sm italic text-[var(--color-fg-subtle)]">
            Jingles, narradores, cromos, rituales. Lo que quedó en la retina y en el oído.
          </p>
          <div className="mt-8 grid gap-px bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3">
            {story.nostalgia.map((n, i) => (
              <article
                key={i}
                className="flex flex-col gap-3 bg-[var(--color-bg-2)] p-6 md:p-8"
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400/70">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="font-display text-xl uppercase leading-tight text-[var(--color-fg)]">
                  {n.title}
                </div>
                <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">
                  {n.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Trivia — curiosidades rápidas */}
      {story.trivia && story.trivia.length > 0 && (
        <div className="mt-12 rounded-3xl border border-[var(--color-border)] p-8 md:p-10">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-pitch)]">
            ¿Lo sabías?
          </div>
          <h3 className="mt-3 font-display text-fluid-h3 uppercase leading-none">
            Para contar en la sobremesa
          </h3>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {story.trivia.map((t, i) => (
              <li
                key={i}
                className="flex gap-3 text-sm leading-relaxed text-[var(--color-fg-muted)]"
              >
                <span className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--color-pitch)]" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function HighlightTile({
  kicker,
  title,
  description,
  image,
  objectPosition = 'center',
}: {
  kicker: string;
  title: string;
  description?: string;
  image?: string;
  objectPosition?: string;
}) {
  return (
    <article className="flex flex-col gap-4 bg-[var(--color-bg-2)] p-8">
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-fg-subtle)]">
        {kicker}
      </div>
      <div>
        <div className="font-display text-3xl uppercase leading-none text-[var(--color-fg)]">
          {title}
        </div>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
            {description}
          </p>
        )}
      </div>
      {image && (
        <div className="relative mt-auto aspect-square w-full overflow-hidden rounded-2xl bg-black/20">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-contain p-4"
            style={{ objectPosition }}
            unoptimized
          />
        </div>
      )}
    </article>
  );
}

// Fallbacks for mundials where we only have image + title from asset fetching.
function mascotLabel(year: number): string {
  return (
    {
      1966: 'World Cup Willie',
      1970: 'Juanito',
      1974: 'Tip y Tap',
      1978: 'Gauchito',
      1982: 'Naranjito',
      1986: 'Pique',
      1990: 'Ciao',
      1994: 'Striker',
      1998: 'Footix',
      2002: 'Ato · Kaz · Nik',
      2006: 'Goleo VI',
      2010: 'Zakumi',
      2014: 'Fuleco',
      2018: 'Zabivaka',
      2022: 'La\'eeb',
      2026: 'Maik · Zayu · Clutch',
    }[year] ?? ''
  );
}

function ballLabel(year: number): string {
  return (
    {
      1970: 'Telstar',
      1974: 'Telstar Durlast',
      1978: 'Tango Riverplate',
      1982: 'Tango España',
      1986: 'Azteca',
      1990: 'Etrusco Unico',
      1994: 'Questra',
      1998: 'Tricolore',
      2002: 'Fevernova',
      2006: '+Teamgeist',
      2010: 'Jabulani',
      2014: 'Brazuca',
      2018: 'Telstar 18',
      2022: 'Al Rihla',
      2026: 'Trionda',
    }[year] ?? ''
  );
}

function ballDescription(year: number): string {
  return (
    {
      1970: 'Primer balón Adidas, con los icónicos 32 paneles blancos y negros pensados para televisión.',
      1974: 'Evolución del Telstar con cuero poliuretano Durlast, más durable.',
      1978: 'Primer Tango: 20 paneles "tríada" que dibujan círculos.',
      1982: 'Tango España — última versión en cuero natural.',
      1986: 'Primer balón totalmente sintético de la historia. Más control en altitud.',
      1990: 'Primer balón multicolor, con detalles inspirados en el arte etrusco.',
      1994: 'Nuevo material espuma de alta energía para mayor velocidad.',
      1998: 'Primer balón del Mundial con más de un color (azul, rojo, blanco).',
      2002: 'Diseño futurista con estrella de cuatro puntas.',
      2006: 'Revoluciona con 14 paneles curvados (antes 32). Más esférico.',
      2010: 'Jabulani — "celebrar" en zulú. Muy criticado por porteros por su vuelo errático.',
      2014: 'Brazuca (nombre elegido por votación popular). 6 paneles grandes.',
      2018: 'Homenaje al Telstar original con diseño pixelado.',
      2022: 'Más rápido de la historia en aire. Primer balón con tecnología de sensor interno.',
      2026: 'Diseñado para el primer Mundial a 48 equipos. Triángulos simbólicos de los 3 países sede.',
    }[year] ?? ''
  );
}

function descriptionFromAssets(year: number, kind: 'mascot' | 'ball'): string {
  if (kind === 'mascot') {
    return (
      {
        1966: 'Primera mascota oficial de un Mundial. Un león con camiseta de Union Jack.',
        1970: 'Niño mexicano con sombrero; presenta al mundo la iconografía de anfitrión.',
        1974: 'Dos niños con camisetas de Alemania Occidental; símbolo de unidad.',
        1978: 'Niño vestido de gaucho argentino con pañuelo y sombrero.',
        1982: 'Naranja antropomórfica con el traje de la selección española. Polémica estética.',
        1986: 'Chile mexicano con sombrero y bigote.',
        1990: 'Robot compuesto por cubos con los colores de la bandera italiana.',
        1994: 'Perro deportista con balón — primera mascota animal americana.',
        1998: 'Gallo azul con "France 98" en el pecho. Símbolo nacional francés.',
        2002: 'Tres seres futuristas llamados "The Spheriks" representando la era digital.',
        2006: 'León con pantalones cortos — controvertido en Alemania.',
        2010: 'Leopardo con melena verde; símbolo de la conservación africana.',
        2014: 'Armadillo de tres bandas, especie en peligro de extinción brasileña.',
        2018: 'Lobo con gafas de vuelo — "el que marca" en ruso.',
        2022: 'Figura etérea inspirada en el "ghutrah" (pañuelo tradicional qatarí).',
        2026: 'Trío de mascotas representando las tres sedes: alce (Canadá), jaguar (México), águila (EE.UU.).',
      }[year] ?? ''
    );
  }
  return ballDescription(year);
}

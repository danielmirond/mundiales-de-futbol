/**
 * Cross-fading background of iconic historic World Cup imagery.
 * All sources are Wikimedia Commons (CC / public domain). Attribution
 * is provided in the footer.
 *
 * Treatment: heavy grayscale + contrast + brightness(0.35) so the photos
 * read as a moody backdrop behind the brand's neon green gradients.
 */

export type HeroImage = {
  src: string;
  alt: string;
  credit: string;
  focus?: string; // CSS object-position, e.g. "center 30%"
};

export const HERO_IMAGES: HeroImage[] = [
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Argentina_celebrando_copa_%28cropped%29.jpg',
    alt: 'Diego Maradona celebrando con el trofeo del Mundial 1986',
    credit: 'Maradona 1986 · El Gráfico · Wikimedia Commons',
    focus: 'center 20%',
  },
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Pele_con_brasil_%28cropped%29.jpg',
    alt: 'Pelé con la camiseta de Brasil',
    credit: 'Pelé · Dutch National Archives · Wikimedia Commons',
    focus: 'center 25%',
  },
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Burruchaga_goal_germany.jpg',
    alt: 'Jorge Burruchaga marca el gol decisivo en la final 1986',
    credit: '1986 Final · Wikimedia Commons',
    focus: 'center 50%',
  },
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Estadio_Azteca_y_sus_alrededores_46.jpg',
    alt: 'Estadio Azteca y sus alrededores en Ciudad de México',
    credit: 'Estadio Azteca · Wikimedia Commons',
    focus: 'center 60%',
  },
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/d/d2/London_Wembley.jpg',
    alt: 'Wembley Stadium en Londres',
    credit: 'Wembley Stadium · Wikimedia Commons',
    focus: 'center 45%',
  },
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Zinedine_Zidane_by_Tasnim_03.jpg',
    alt: 'Zinedine Zidane',
    credit: 'Zidane · Tasnim News · CC BY 4.0',
    focus: 'center 20%',
  },
];

const CYCLE_SEC = HERO_IMAGES.length * 8; // seconds per full loop

export function HeroImagery() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {HERO_IMAGES.map((img, i) => (
        <div
          key={img.src}
          className="hero-slide"
          aria-hidden
          style={{
            backgroundImage: `url(${img.src})`,
            backgroundPosition: img.focus ?? 'center',
            animationDuration: `${CYCLE_SEC}s`,
            animationDelay: `${i * 8}s`,
          }}
        />
      ))}
      <style>{`
        .hero-slide {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-repeat: no-repeat;
          filter: grayscale(100%) contrast(1.15) brightness(0.38);
          opacity: 0;
          animation-name: hero-slide-fade;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
          will-change: opacity;
        }
        @keyframes hero-slide-fade {
          0%, 100% { opacity: 0; }
          6% { opacity: 0.55; }
          14% { opacity: 0.55; }
          20% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

import Link from 'next/link';
import Image from 'next/image';
import { newsImageUrl, newsImageAlt, newsKind, NEWS_KIND_LABEL, relativeTimeEs, type NewsItem } from '@/lib/news';
import { routing, type Locale } from '@/i18n/routing';

const withLocale = (l: Locale, h: string) => (l === routing.defaultLocale ? h : `/${l}${h}`);
const timeFmt = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
const dayFmt = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', day: 'numeric', month: 'short' });

const CATEGORY_LABELS: Record<string, string> = {
  panini: 'Panini', convocatorias: 'Convocatorias', sedes: 'Sedes', entradas: 'Entradas', jugadores: 'Jugadores', mascotas: 'Mascotas',
  ceremonia: 'Ceremonia', polemica: 'Polémica', tv: 'TV', patrocinios: 'Patrocinios', amistosos: 'Amistosos', lesiones: 'Lesiones',
  tecnico: 'Cuerpo técnico', general: 'Actualidad', historica: 'Historia', curiosa: 'Curiosidades',
};

/** Kicker «LaLiga · Crónica» (o la categoría si la pieza no es del pipeline). */
export function newsKicker(n: NewsItem): string {
  const kind = newsKind(n);
  if (n.competition) return `${n.competition.name} · ${NEWS_KIND_LABEL[kind]}`;
  return kind === 'noticia' ? (CATEGORY_LABELS[n.category] ?? 'Actualidad') : NEWS_KIND_LABEL[kind];
}

/** Firma y fecha: «Redacción · 25 oct, 21:52 · actualizado 22:10». */
export function newsByline(n: NewsItem, withAuthor = false): string {
  const pub = new Date(n.publishedAt);
  const parts = [`${dayFmt.format(pub)}, ${timeFmt.format(pub)}`];
  if (n.modifiedAt && n.modifiedAt > n.publishedAt) parts.push(`actualizado ${timeFmt.format(new Date(n.modifiedAt))}`);
  return (withAuthor ? [n.author ?? 'Redacción Mundiales de Fútbol', ...parts] : parts).join(' · ');
}

function Photo({ n, ratio = '16/9', tint = true, priority = false, sizes }: { n: NewsItem; ratio?: string; tint?: boolean; priority?: boolean; sizes: string }) {
  const hasOwn = !!n.image?.url;
  return (
    <div className="relative overflow-hidden rounded-[10px] bg-[var(--color-surface)]" style={{ aspectRatio: ratio }}>
      <Image src={newsImageUrl(n)} alt={newsImageAlt(n)} fill sizes={sizes} className="object-cover" unoptimized priority={priority} />
      {/* Tinte del acento + degradado: disimula la repetición de fotos de estadio en listados */}
      {hasOwn && tint && <span aria-hidden className="absolute inset-0 opacity-55 mix-blend-color" style={{ background: 'var(--accent)' }} />}
      <span aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgb(5_6_10/.78))]" />
      <span className="kicker absolute bottom-3.5 left-4 !text-white">{newsKicker(n)}</span>
      {n.image?.credit && <span className="absolute bottom-3 right-3 font-mono text-[10px] text-white/80">{n.image.credit.replace(' · Wikimedia Commons', '')}</span>}
    </div>
  );
}

/**
 * Tarjeta de noticia (sistema de diseño · 09). Variantes:
 * `feat` (destacada ancha), `photo` (con foto), `np` (sin foto: agenda y
 * clasificación usan el dato como imagen), `list` (compacta con hora).
 */
export function NewsCard({ n, locale, variant = 'photo', priority = false }: { n: NewsItem; locale: Locale; variant?: 'feat' | 'photo' | 'np' | 'list'; priority?: boolean }) {
  const href = withLocale(locale, `/noticias/${n.slug}`);
  const sport = n.competition?.sport;
  if (variant === 'list') {
    return (
      <Link href={href} data-sport={sport} className="grid grid-cols-[52px_1fr] gap-4 border-t border-[var(--color-border)] py-4 text-[var(--color-fg)]">
        <time className="font-mono text-xs leading-6 text-[var(--color-fg-subtle)]" dateTime={n.publishedAt}>{timeFmt.format(new Date(n.publishedAt))}</time>
        <span className="grid gap-1.5"><span className="kicker">{newsKicker(n)}</span><b className="text-[16px] font-semibold leading-[1.35] tracking-[-0.01em]">{n.title}</b></span>
      </Link>
    );
  }
  if (variant === 'np') {
    return (
      <Link href={href} data-sport={sport} className="grid content-start gap-3 rounded-[18px] border border-[var(--color-border)] bg-[var(--color-bg-2)] p-6 text-[var(--color-fg)] transition-colors hover:border-[var(--color-border-strong)]">
        <span className="kicker">{newsKicker(n)}</span>
        <span className="flex items-end gap-3 border-b border-[var(--color-border)] pb-4"><span className="n-xl leading-[0.8]">{newsKind(n) === 'agenda' ? 'Hoy' : newsKind(n) === 'clasificacion' ? 'Tabla' : '·'}</span><span className="pb-1 text-sm text-[var(--color-fg-muted)]">{n.summary.split('.')[0]}.</span></span>
        <h3 className="t-h3">{n.title}</h3>
        <span className="font-mono text-[11px] leading-[1.4] tracking-[0.03em] text-[var(--color-fg-subtle)]">{newsByline(n)}</span>
      </Link>
    );
  }
  if (variant === 'feat') {
    return (
      <Link href={href} data-sport={sport} className="group grid gap-6 text-[var(--color-fg)] md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] md:items-end md:gap-9">
        <Photo n={n} priority={priority} sizes="(max-width: 768px) 100vw, 60vw" />
        <span className="grid gap-3">
          <h3 className="text-[26px] font-semibold leading-[1.08] tracking-[-0.032em] group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4 md:text-[36px]">{n.title}</h3>
          <p className="text-base leading-[1.55] text-[var(--color-fg-muted)]">{n.summary}</p>
          <span className="font-mono text-[11px] leading-[1.4] tracking-[0.03em] text-[var(--color-fg-subtle)]">{newsByline(n, true)}</span>
        </span>
      </Link>
    );
  }
  return (
    <Link href={href} data-sport={sport} className="group grid content-start gap-3 text-[var(--color-fg)]">
      <Photo n={n} priority={priority} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
      {n.image?.credit && <span className="-mt-1 font-mono text-[11px] leading-[1.4] text-[var(--color-fg-subtle)]">Foto: {n.image.credit}</span>}
      <h3 className="t-h3 group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">{n.title}</h3>
      <span className="font-mono text-[11px] leading-[1.4] tracking-[0.03em] text-[var(--color-fg-subtle)]">{newsByline(n)}</span>
    </Link>
  );
}

/** Variante automática según tipo: agenda y clasificación no llevan foto propia. */
export const autoVariant = (n: NewsItem): 'photo' | 'np' => (['agenda', 'clasificacion'].includes(newsKind(n)) ? 'np' : 'photo');

export { relativeTimeEs };

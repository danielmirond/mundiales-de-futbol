/**
 * Banner de afiliado de DAZN (creatividades oficiales vía AWIN, programa 126263).
 * El ID de publisher (r=2898755) es el de mundiales-de-futbol.com.
 * La propia <img> (cshow.php) cuenta la impresión; el <a> (cread.php) el clic.
 */

const V = 126263; // merchant DAZN
const R = 2898755; // publisher (mundiales-de-futbol)

export type DaznCreative = 'tall' | 'wide' | 'leaderboard' | 'square';

const CREATIVES: Record<DaznCreative, { s: number; q: number; w: number; h: number }> = {
  tall:        { s: 4803666, q: 605443, w: 1920, h: 630 },
  wide:        { s: 4803664, q: 605443, w: 1920, h: 495 },
  leaderboard: { s: 4803665, q: 605443, w: 1776, h: 144 },
  square:      { s: 4783260, q: 605441, w: 400,  h: 400 },
};

export function DaznBanner({
  creative = 'leaderboard',
  className,
}: {
  creative?: DaznCreative;
  className?: string;
}) {
  const c = CREATIVES[creative];
  const href = `https://www.awin1.com/cread.php?s=${c.s}&v=${V}&q=${c.q}&r=${R}`;
  const img = `https://www.awin1.com/cshow.php?s=${c.s}&v=${V}&q=${c.q}&r=${R}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      aria-label="Ver el Mundial 2026 en DAZN"
      className={className ?? 'block'}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={img}
        width={c.w}
        height={c.h}
        alt="Ver el Mundial 2026 en DAZN"
        loading="lazy"
        className="h-auto w-full rounded-2xl border border-[var(--color-border)]"
      />
    </a>
  );
}

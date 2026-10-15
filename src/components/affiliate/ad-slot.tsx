import { pickCampaign, ADVERTISER, type Placement, type Campaign } from '@/lib/campaigns';

/** Tarjeta de una campaña: marcada como publicidad y con enlace patrocinado. */
export function CampaignCard({ c, compact = false }: { c: Campaign; compact?: boolean }) {
  const a = ADVERTISER[c.anunciante];
  return (
    <a href={c.url} target="_blank" rel="sponsored nofollow noopener noreferrer"
      className="group flex overflow-hidden rounded-[18px] border border-[var(--color-border)] transition-colors hover:border-[var(--color-border-strong)]"
      style={{ background: a.bg, color: a.fg }}>
      {c.imagen && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={c.imagen} alt="" loading="lazy" className={compact ? 'hidden' : 'hidden w-[40%] shrink-0 object-cover sm:block'} />
      )}
      <span className="flex flex-1 flex-col gap-2 p-5">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-70">Publicidad · {a.name}</span>
        <span className="text-[19px] font-semibold leading-tight tracking-[-0.015em]">{c.titulo}</span>
        {!compact && <span className="text-[14px] leading-relaxed opacity-80">{c.texto}</span>}
        <span className="mt-1 inline-flex h-10 w-fit items-center rounded-full px-4 text-sm font-semibold" style={{ background: a.fg, color: a.bg }}>{c.cta} ↗</span>
      </span>
    </a>
  );
}

/** Hueco publicitario: muestra la campaña activa para esa ubicación (y deporte) o nada. */
export function AdSlot({ placement, sport, salt = 0, className = '' }: { placement: Placement; sport?: string; salt?: number; className?: string }) {
  const c = pickCampaign(placement, sport, salt);
  if (!c) return null;
  return (
    <aside aria-label="Publicidad" className={`mx-auto w-full max-w-[1400px] px-6 md:px-10 ${className}`}>
      <CampaignCard c={c} />
    </aside>
  );
}

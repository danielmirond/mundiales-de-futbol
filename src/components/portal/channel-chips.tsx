import { Icon } from '@/components/ui/icon';
import { platformOf, PLATFORM_URL, PLATFORM_LABEL } from '@/lib/affiliate';

/** Canales en abierto en España (relleno claro + etiqueta «abierto»). */
const FREE_TO_AIR = /\b(la 1|la 2|gol play|gol\b|teledeporte|dmax|cuatro|telecinco|antena 3|la sexta|rtve|tv3|etb|à punt|canal sur|tvg|aragón tv|mediaset)\b/i;
export const isFreeToAir = (c: string) => FREE_TO_AIR.test(c);

/**
 * Chips de canal: 1 / abierto / 2 / «y N más» / «por confirmar» (fútbol) / sede
 * (deportes sin fuente de canales). El hueco nunca queda vacío.
 * `max` = chips visibles antes del «y N más» (1 en móvil, 2 en escritorio).
 */
export function ChannelChips({
  channels, sport, venue, max = 2, compact = false,
}: { channels: string[]; sport: string; venue?: string; max?: number; compact?: boolean }) {
  if (channels.length === 0) {
    if (sport === 'futbol') return <span className="ch tbd">Canal por confirmar</span>;
    if (venue) return <span className="ch venue"><Icon name="pin" />{venue}</span>;
    return null;
  }
  // El abierto tiene prioridad: va primero.
  const sorted = [...channels].sort((a, b) => Number(isFreeToAir(b)) - Number(isFreeToAir(a)));
  const shown = sorted.slice(0, max);
  const rest = sorted.length - shown.length;
  return (
    <span className="flex min-w-0 items-center gap-1.5 overflow-hidden" title={`Dónde ver: ${sorted.join(', ')}`}>
      {shown.map((c, i) => {
        const cls = `ch max-w-[11rem] ${isFreeToAir(c) ? 'free' : ''} ${compact && i > 0 ? 'hidden md:inline-flex' : ''}`;
        const p = platformOf(c);
        // Canal de Movistar Plus+ o DAZN: el chip enlaza (afiliado) a la plataforma.
        return p ? (
          <a key={c} href={PLATFORM_URL[p]} target="_blank" rel="sponsored nofollow noopener noreferrer" title={`Ver en ${PLATFORM_LABEL[p]} (enlace de afiliado)`}
            className={`${cls} aff hover:border-[var(--color-fg)] hover:text-[var(--color-fg)]`}><span className="truncate">{c}</span><span aria-hidden className="ml-1 opacity-60">↗</span></a>
        ) : (
          <span key={c} className={cls}><span className="truncate">{c}</span></span>
        );
      })}
      {rest > 0 && <span className="ch more">y {rest} más</span>}
    </span>
  );
}

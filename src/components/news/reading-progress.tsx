'use client';

import { useEffect, useRef } from 'react';

/**
 * Barra de progreso de lectura: línea fina bajo la cabecera fija que se llena
 * según el avance por el cuerpo del artículo (`targetId`), no por toda la
 * página, para que llegue al 100 % al terminar el texto. Sin re-render: escribe
 * el `scaleX` directamente en un rAF.
 */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el || !bar.current) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 0;
      const r = el.getBoundingClientRect();
      const total = r.height - (window.innerHeight - header);
      const p = total <= 0 ? (r.top < header ? 1 : 0) : Math.min(1, Math.max(0, (header - r.top) / total));
      bar.current!.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [targetId]);
  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 z-50 h-[3px]" style={{ top: 'var(--header-h, 7rem)' }}>
      <div ref={bar} className="h-full origin-left bg-[var(--accent)]" style={{ transform: 'scaleX(0)' }} />
    </div>
  );
}
